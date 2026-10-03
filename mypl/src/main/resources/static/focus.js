(() => {
    const $ = id => document.getElementById(id), t = window.plannerI18n.t;
    const dayKey = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
    const shift = (date,days,hour=0) => { const result=new Date(`${date}T00:00:00`); result.setDate(result.getDate()+days); result.setHours(hour); return result; };
    const nowDay = () => dayKey(new Date());
    const monday = date => dayKey(shift(date,-((new Date(`${date}T12:00:00`).getDay()+6)%7)));
    const duration = seconds => { seconds=Math.max(0,Math.floor(seconds)); return `${String(Math.floor(seconds/3600)).padStart(2,'0')}:${String(Math.floor(seconds/60)%60).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`; };
    const newId = () => {
        if (crypto.randomUUID) return crypto.randomUUID();
        const bytes=crypto.getRandomValues(new Uint8Array(16)); bytes[6]=(bytes[6]&15)|64; bytes[8]=(bytes[8]&63)|128;
        const hex=Array.from(bytes,value=>value.toString(16).padStart(2,'0')).join('');
        return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
    };
    const sessionKey = 'planner.focus.active.' + (window.plannerGuest?'guest':document.documentElement.dataset.account);
    let selected=$('date').value||nowDay(), week=monday(nowDay()), active=null, starting=false, finishing=false, beatBusy=false;
    let recentTitles=[], dayRecords=[], weekRecords=[], dayRequest=0, weekRequest=0, breakUntil=0, completionAttemptAt=0;
    const elapsed = record => record.endedAt ? record.seconds : Math.min(record.targetSeconds, Math.max(0,(Date.now()-Date.parse(record.startedAt))/1000));
    const endOf = record => record.endedAt ? Date.parse(record.endedAt) : Date.parse(record.startedAt)+record.seconds*1000;
    function remember(id) { try { if (id) sessionStorage.setItem(sessionKey,id); else sessionStorage.removeItem(sessionKey); } catch {} }
    async function api(url, options) {
        const response=await window.plannerApi(url,options);
        if (!response.ok || response.redirected) throw new Error(t(response.status===409?'다른 창에서 타이머가 실행 중이에요.':'기록을 저장하거나 불러오지 못했어요. 다시 시도해 주세요.'));
        return response.json();
    }
    // Guest timer data follows the same contract, with synchronous writes on pagehide.
    window.guestFocusApi = (url, method, body, store) => {
        const records=store.read('focus')||[], now=Date.now();
        for (const record of records) if (!record.endedAt) {
            const target=Date.parse(record.startedAt)+record.targetSeconds*1000;
            if (now-record.lastSeen>90000 || now>=target) {
                record.endedAt=new Date(now-record.lastSeen>90000?Math.min(record.lastSeen,target):target).toISOString();
                record.reason=now-record.lastSeen>90000?'interrupted':'completed';
            }
        }
        let result;
        if (method==='GET' && url.pathname==='/api/focus/recent-titles') {
            return store.json([...new Set([...records].sort((a,b)=>Date.parse(b.startedAt)-Date.parse(a.startedAt)).map(record=>record.title))].slice(0,8));
        }
        if (method==='GET') result=records.filter(record=>Date.parse(record.startedAt)<Date.parse(url.searchParams.get('until')) && (!record.endedAt||Date.parse(record.endedAt)>Date.parse(url.searchParams.get('from'))));
        else if (url.pathname==='/api/focus') {
            let record=records.find(record=>record.id===body.id);
            if (!record && records.some(record=>!record.endedAt)) return new Response(null,{status:409});
            if (!record) { record={id:body.id,title:body.title,mode:body.mode,startedAt:new Date(now).toISOString(),lastSeen:now,endedAt:null,targetSeconds:body.mode==='POMODORO'?body.minutes*60:2147483647}; records.push(record); }
            result=record;
        } else {
            const record=records.find(record=>record.id===url.pathname.split('/')[3]);
            if (!record) return new Response(null,{status:404});
            if (!record.endedAt) {
                record.lastSeen=now;
                if (url.pathname.endsWith('/finish')) { record.endedAt=new Date(now).toISOString(); record.reason=url.searchParams.get('reason')||'finished'; }
            }
            result=record;
        }
        for (const record of records) record.seconds=Math.max(0,Math.floor(((record.endedAt?Date.parse(record.endedAt):record.lastSeen)-Date.parse(record.startedAt))/1000));
        store.write('focus',records); return store.json(result);
    };
    function renderDay() {
        $('focus-records').replaceChildren();
        const from=shift(selected,0).getTime(), until=shift(selected,1).getTime();
        for (const record of dayRecords.filter(record=>record.endedAt)) {
            const row=document.createElement('div'); row.className='focus-row';
            const title=document.createElement('span'); title.textContent=record.title; title.title=record.title;
            const time=document.createElement('time'); time.textContent=duration((Math.min(endOf(record),until)-Math.max(Date.parse(record.startedAt),from))/1000);
            row.append(title,time); $('focus-records').append(row);
        }
        if (!$('focus-records').children.length) { const empty=document.createElement('p'); empty.className='focus-empty'; empty.textContent=t('타이머로 오늘의 집중 시간을 기록해 보세요.'); $('focus-records').append(empty); }
    }
    function paintWeek() {
        document.querySelectorAll('.focus-overlay').forEach(element=>element.remove());
        for (const column of document.querySelectorAll('.day-column')) {
            const date=column.dataset.date, from=shift(date,0,5).getTime(), until=shift(date,1,3).getTime();
            for (const record of weekRecords.filter(record=>record.endedAt)) {
                const start=Date.parse(record.startedAt), end=endOf(record);
                const clippedStart=Math.max(start,from), clippedEnd=Math.min(end,until);
                const outside=end>shift(date,0,3).getTime() && start<from && end<=from;
                if (clippedEnd<=clippedStart && !outside) continue;
                const overlay=document.createElement('div'); overlay.className='focus-overlay'+(outside?' outside':'');
                // Use local clock minutes so midnight and DST retain their clock positions.
                const minutes=value=>{const d=new Date(value);return d.getHours()*60+d.getMinutes()+d.getSeconds()/60+(dayKey(d)!==date?1440:0);};
                overlay.style.top=`${(minutes(clippedStart)-300)/1320*100}%`;
                overlay.style.height=`${(minutes(clippedEnd)-minutes(clippedStart))/1320*100}%`;
                const label=document.createElement('span'); label.textContent=(outside?t('시간표 밖 기록')+' · ':'')+record.title;
                overlay.setAttribute('role','img'); overlay.setAttribute('aria-label',`${record.title} · ${duration(record.seconds)}`);
                overlay.append(label); column.append(overlay);
            }
        }
    }
    async function refreshDay() {
        const seq=++dayRequest;
        try { const rows=await api(`/api/focus?from=${encodeURIComponent(shift(selected,0).toISOString())}&until=${encodeURIComponent(shift(selected,1).toISOString())}`); if(seq!==dayRequest)return; dayRecords=rows; renderDay(); $('focus-status').textContent=''; }
        catch(error) { if(seq===dayRequest)$('focus-status').textContent=error.message; }
    }
    async function refreshWeek() {
        const seq=++weekRequest;
        try { const rows=await api(`/api/focus?from=${encodeURIComponent(shift(week,0).toISOString())}&until=${encodeURIComponent(shift(week,7,5).toISOString())}`); if(seq!==weekRequest)return; weekRecords=rows; paintWeek(); }
        catch(error) { if(seq===weekRequest)$('focus-status').textContent=error.message; }
    }
    function renderRecentTitles() {
        $('focus-recent-list').replaceChildren();
        $('focus-recent-label').textContent=t('최근 기록 이름');
        $('focus-recent').hidden=!recentTitles.length || !!active;
        for (const title of recentTitles) {
            const button=document.createElement('button');
            button.type='button'; button.textContent=title; button.title=title;
            button.disabled=starting||finishing;
            button.onclick=()=>{ $('focus-title').value=title; $('focus-title').focus(); };
            $('focus-recent-list').append(button);
        }
    }
    async function refreshRecentTitles() {
        try { recentTitles=await api('/api/focus/recent-titles'); renderRecentTitles(); }
        catch(error) { $('focus-dialog-status').textContent=error.message; }
    }
    function controls() {
        renderRecentTitles();
        const running=!!active;
        $('focus-mode').options[0].textContent=t('포모도로'); $('focus-mode').options[1].textContent=t('스톱워치');
        for (const id of ['focus-title','focus-mode','focus-minutes']) $(id).disabled=running||starting||finishing;
        $('focus-minutes').disabled ||= $('focus-mode').value==='STOPWATCH';
        $('start-focus').hidden=running; $('start-focus').disabled=starting||finishing;
        $('stop-focus').hidden=!running; $('stop-focus').disabled=finishing;
        $('close-focus').disabled=starting||finishing;
    }
    function tick() {
        const seconds=active?elapsed(active):breakUntil?Math.max(0,(breakUntil-Date.now())/1000):0;
        $('focus-phase').textContent=t(breakUntil?'휴식':active?.mode==='STOPWATCH'?'스톱워치':'집중');
        const stopwatch=!breakUntil && (active?.mode||$('focus-mode').value)==='STOPWATCH';
        const total=active?.targetSeconds||Math.max(60,Number($('focus-minutes').value||25)*60);
        const remaining=breakUntil?seconds/300:stopwatch?(seconds%60)/60:active?1-seconds/total:1;
        const percent=Math.max(0,Math.min(100,remaining*100));
        $('focus-dial').style.setProperty('--focus-progress',`${percent}%`);
        $('focus-dial').classList.toggle('is-break',!!breakUntil);
        $('focus-dial').classList.toggle('is-stopwatch',stopwatch);
        $('focus-dial').setAttribute('aria-valuenow',String(Math.round(percent)));
        $('focus-dial').setAttribute('aria-label',t(breakUntil?'남은 휴식 시간':stopwatch?'스톱워치':'남은 집중 시간'));
        $('focus-clock').textContent=duration(active?(active.mode==='POMODORO'?active.targetSeconds-seconds:seconds):breakUntil?seconds:$('focus-mode').value==='POMODORO'?Number($('focus-minutes').value||25)*60:0);
        if (active && seconds>=active.targetSeconds && !finishing && Date.now()-completionAttemptAt>15000) { completionAttemptAt=Date.now(); finish(false,true); }
        if (breakUntil && seconds<=0) { breakUntil=0; $('focus-dialog-status').textContent=t('휴식이 끝났어요. 다음 집중을 시작해 보세요.'); }
    }
    async function finish(close=false,completed=false) {
        if (starting||finishing) return;
        if (!active) { breakUntil=0; if(close)$('focus-dialog').close(); return; }
        finishing=true; controls();
        try {
            const record=await api(`/api/focus/${active.id}/finish?reason=${close?'closed':'finished'}`,{method:'POST'});
            const wasPomodoro=active.mode==='POMODORO'; recentTitles=[active.title,...recentTitles.filter(title=>title!==active.title)].slice(0,8); active=null; remember(null);
            breakUntil=!close&&completed&&wasPomodoro?Date.now()+300000:0;
            $('focus-dialog-status').textContent=t(breakUntil?'집중 완료! 5분간 쉬어가세요.':'집중 기록을 저장했어요.');
            await Promise.all([refreshDay(),refreshWeek()]); if(close)$('focus-dialog').close();
        } catch(error) { $('focus-dialog-status').textContent=error.message; }
        finally {finishing=false;controls();tick();}
    }
    $('open-focus').onclick=()=>{$('focus-dialog-status').textContent='';$('focus-dialog').showModal();controls();tick();refreshRecentTitles();if(!active)$('focus-title').focus();};
    $('focus-title').addEventListener('input',event=>{if(!event.isComposing)event.target.value=Array.from(event.target.value).slice(0,40).join('');});
    $('focus-title').addEventListener('compositionend',()=>{$('focus-title').value=Array.from($('focus-title').value).slice(0,40).join('');});
    $('focus-mode').onchange=()=>{breakUntil=0;controls();tick();}; $('focus-minutes').oninput=tick;
    $('start-focus').onclick=async()=>{
        if(active||starting)return;
        const title=$('focus-title').value.trim(),minutes=$('focus-mode').value==='POMODORO'?Number($('focus-minutes').value):25;
        if(!title||!Number.isInteger(minutes)||minutes<1||minutes>180){$('focus-dialog-status').textContent=t('기록 이름과 1~180분 사이의 시간을 입력해 주세요.');return;}
        starting=true;controls();breakUntil=0;
        const id=newId(); remember(id);
        try {active=await api('/api/focus',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,title,mode:$('focus-mode').value,minutes})});$('focus-dialog-status').textContent='';}
        catch(error){$('focus-dialog-status').textContent=error.message;window.plannerApi(`/api/focus/${id}/finish?reason=closed`,{method:'POST',keepalive:true}).catch(()=>{});}
        finally{starting=false;controls();tick();}
    };
    $('stop-focus').onclick=()=>finish(); $('close-focus').onclick=()=>finish(true);
    $('focus-dialog').addEventListener('cancel',event=>{event.preventDefault();finish(true);});
    setInterval(tick,1000);
    setInterval(async()=>{
        if(!active||finishing||beatBusy)return;beatBusy=true;
        try {const record=await api(`/api/focus/${active.id}/heartbeat`,{method:'POST'});if(!active||finishing)return;active=record;if(record.endedAt){active=null;remember(null);controls();$('focus-dialog-status').textContent=t('집중 기록이 종료되었어요.');await Promise.all([refreshDay(),refreshWeek()]);}}
        catch(error){$('focus-dialog-status').textContent=error.message;}finally{beatBusy=false;}
    },15000);
    window.addEventListener('pagehide',()=>{
        if(!active)return;
        const url=`/api/focus/${active.id}/finish?reason=closed`;
        if(window.plannerGuest)window.plannerApi(url,{method:'POST'}).catch(()=>{});
        else if(!navigator.sendBeacon(url))fetch(url,{method:'POST',keepalive:true}).catch(()=>{});
        active=null; // A page restored from the back/forward cache must not restart its timer.
    });
    window.addEventListener('pageshow',()=>{controls();refreshDay();refreshWeek();});
    window.addEventListener('planner-date-selected',event=>{selected=event.detail;refreshDay();});
    window.addEventListener('planner-week-rendered',event=>{if(week!==event.detail){week=event.detail;refreshWeek();}else paintWeek();});
    window.addEventListener('planner-week-sized',paintWeek);
    window.addEventListener('planner-language-change',()=>{renderDay();paintWeek();controls();tick();});
    (async()=>{try{const id=sessionStorage.getItem(sessionKey);if(id){await api(`/api/focus/${id}/finish?reason=closed`,{method:'POST'});remember(null);}}catch{}await Promise.all([refreshDay(),refreshWeek()]);})();
})();
