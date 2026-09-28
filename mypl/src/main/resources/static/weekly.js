(() => {
    const $ = id => document.getElementById(id);
    const START = 300, END = 1620, SLOT = 30;
    let HEIGHT = Math.max(10, Math.min(22, (window.innerHeight - 310) / 32));
    const scroller = document.querySelector('.week-scroll');
    function sizeWeek(reset = false) {
        HEIGHT = Math.max(10, Math.min(22, (window.innerHeight - 310) / 32));
        document.documentElement.style.setProperty('--slot-height', `${HEIGHT}px`);
        scroller.style.height = `${32 * HEIGHT + 52}px`;
        if (reset) scroller.scrollTop = Math.max(0, 6 * HEIGHT - 8);
    }
    sizeWeek();
    const key = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const shift = (date, days) => { const value = new Date(`${date}T12:00:00`); value.setDate(value.getDate() + days); return key(value); };
    const monday = date => shift(date, -((new Date(`${date}T12:00:00`).getDay() + 6) % 7));
    const time = minute => `${minute >= 1440 ? '다음 날 ' : ''}${String(Math.floor(minute / 60) % 24).padStart(2, '0')}:${String(minute % 60).padStart(2, '0')}`;
    let week = monday(key(new Date())), blocks = [], dirty = false, busy = true, ready = false;
    let lastTap = null, selectedDate = key(new Date());
    window.addEventListener('planner-date-selected', event => { selectedDate = event.detail; });
    const status = message => { $('week-status').textContent = message; };
    const changed = () => { dirty = true; status('저장하지 않은 주간 기록이 있어요.'); };
    const overlaps = (block, start, end) => blocks.some(other => other !== block && other.planDate === block.planDate && start < other.endMinute && end > other.startMinute);
    function position(element, block) {
        element.style.top = `${(block.startMinute - START) / SLOT * HEIGHT}px`;
        element.style.height = `${(block.endMinute - block.startMinute) / SLOT * HEIGHT}px`;
        element.title = `${time(block.startMinute)} ~ ${time(block.endMinute)}`;
    }
    function resize(block, element, edge, minute) {
        const start = edge === 'start' ? Math.max(START, Math.min(block.endMinute - SLOT, minute)) : block.startMinute;
        const end = edge === 'end' ? Math.min(END, Math.max(block.startMinute + SLOT, minute)) : block.endMinute;
        if (overlaps(block, start, end)) return;
        if (start === block.startMinute && end === block.endMinute) return;
        block.startMinute = start; block.endMinute = end; position(element, block); changed();
        status(`${time(start)} ~ ${time(end)} · 저장하지 않은 변경 사항`);
    }
    function blockElement(block) {
        const element = document.createElement('div'); element.className = 'time-block'; position(element, block);
        const input = document.createElement('input'); input.value = block.memo; input.placeholder = '무엇을 했나요?';
        input.setAttribute('aria-label', `${block.planDate} ${time(block.startMinute)} 메모, 최대 20자`);
        input.oninput = event => {
            if (event.isComposing) return;
            input.value = Array.from(input.value).slice(0, 20).join(''); block.memo = input.value; changed();
        };
        input.addEventListener('compositionend', () => input.oninput({ isComposing: false }));
        input.onclick = event => event.stopPropagation();
        const shrink = () => { if (!busy) { block.endMinute = block.startMinute + SLOT; position(element, block); changed(); } };
        element.ondblclick = event => { event.preventDefault(); shrink(); };
        element.addEventListener('pointerup', event => {
            if (event.pointerType !== 'touch' || event.target.closest('.resize-handle, .delete-block')) return;
            const now = Date.now();
            if (lastTap?.block === block && now - lastTap.at < 350) { shrink(); lastTap = null; }
            else lastTap = { block, at: now };
        });
        const remove = document.createElement('button'); remove.className = 'delete-block'; remove.textContent = '×'; remove.setAttribute('aria-label', '시간 블록 삭제');
        remove.onclick = event => { event.stopPropagation(); blocks.splice(blocks.indexOf(block), 1); changed(); render(); };
        element.append(input, remove);
        for (const edge of ['start', 'end']) {
            const handle = document.createElement('button'); handle.className = `resize-handle ${edge}`;
            handle.setAttribute('aria-label', `${edge === 'start' ? '시작' : '종료'} 시간 조절. 위아래 방향키로 30분씩 변경`);
            handle.onclick = event => event.stopPropagation();
            handle.ondblclick = event => event.stopPropagation();
            handle.onkeydown = event => {
                if (busy || !['ArrowUp', 'ArrowDown'].includes(event.key)) return;
                event.preventDefault(); resize(block, element, edge, block[`${edge}Minute`] + (event.key === 'ArrowUp' ? -SLOT : SLOT));
            };
            handle.onpointerdown = event => {
                if (busy) return;
                event.preventDefault(); event.stopPropagation();
                const originY = event.clientY, origin = block[`${edge}Minute`];
                const scroller = $('week-scroll') || document.querySelector('.week-scroll');
                const originScroll = scroller.scrollTop;
                let pointerY = originY, frame;
                handle.setPointerCapture(event.pointerId);
                const update = () => resize(block, element, edge, origin + Math.round((pointerY - originY + scroller.scrollTop - originScroll) / HEIGHT) * SLOT);
                handle.onpointermove = move => { pointerY = move.clientY; update(); };
                const scroll = () => {
                    const bounds = scroller.getBoundingClientRect();
                    if (pointerY < bounds.top + 45) scroller.scrollTop -= 8;
                    else if (pointerY > bounds.bottom - 35) scroller.scrollTop += 8;
                    update(); frame = requestAnimationFrame(scroll);
                };
                frame = requestAnimationFrame(scroll);
                const finish = () => { cancelAnimationFrame(frame); handle.onpointermove = null; handle.onpointerup = null; handle.onpointercancel = null; };
                handle.onlostpointercapture = finish;
                handle.onpointerup = finish; handle.onpointercancel = finish;
            };
            element.append(handle);
        }
        return element;
    }
    function render() {
        $('week-label').textContent = `${week.replaceAll('-', '.')} – ${shift(week, 6).slice(5).replace('-', '.')}`;
        for (const id of ['prev-week', 'next-week', 'this-week']) $(id).disabled = busy;
        $('save-week').disabled = busy || !ready;
        const grid = $('week-grid'); grid.replaceChildren();
        const corner = document.createElement('div'); corner.className = 'week-corner'; corner.textContent = '시간'; grid.append(corner);
        const days = ['월', '화', '수', '목', '금', '토', '일'];
        for (let day = 0; day < 7; day++) {
            const date = shift(week, day), header = document.createElement('button'); header.className = 'week-day';
            header.textContent = `${days[day]} ${Number(date.slice(8))}`; header.setAttribute('aria-label', `${date} 일일 기록 열기`);
            header.onclick = () => window.dispatchEvent(new CustomEvent('planner-select-date', { detail: date })); grid.append(header);
        }
        const axis = document.createElement('div'); axis.className = 'time-axis';
        for (let minute = START; minute <= END; minute += 60) {
            const label = document.createElement('span'); label.textContent = minute === 1440 ? '24:00' : `${String(Math.floor(minute / 60) % 24).padStart(2, '0')}:00`;
            label.style.top = `${(minute - START) / SLOT * HEIGHT}px`; axis.append(label);
        }
        grid.append(axis);
        for (let day = 0; day < 7; day++) {
            const date = shift(week, day), column = document.createElement('div'); column.className = 'day-column';
            for (let minute = START; minute < END; minute += SLOT) {
                const slot = document.createElement('button'); slot.className = 'time-slot'; slot.disabled = busy || !ready;
                slot.setAttribute('aria-label', `${date} ${time(minute)} 블록 추가`);
                slot.onclick = () => {
                    // The last half-hour uses the final full hour so a new block is always one hour.
                    const start = Math.min(minute, END - 60);
                    const block = { planDate: date, startMinute: start, endMinute: start + 60, memo: '' };
                    if (overlaps(block, start, start + 60)) { status('이미 기록한 시간과 겹쳐요. 다른 시간대를 선택해 주세요.'); return; }
                    blocks.push(block); changed(); render();
                    const created = $('week-grid').querySelectorAll('.time-block');
                    [...created].find(item => item.dataset.index === String(blocks.indexOf(block)))?.querySelector('input').focus();
                };
                column.append(slot);
            }
            blocks.filter(block => block.planDate === date).forEach(block => {
                const element = blockElement(block); element.dataset.index = blocks.indexOf(block);
                element.querySelectorAll('input, button').forEach(control => { control.disabled = busy; }); column.append(element);
            });
            grid.append(column);
        }
    }
    async function request(options, start = week) {
        const response = await fetch(`/api/weekly?start=${start}`, options);
        if (response.status === 401 || response.redirected) throw new Error('다시 로그인해 주세요. 현재 입력한 기록은 화면에 남아 있어요.');
        if (!response.ok) throw new Error('주간 기록 요청에 실패했어요. 연결을 확인하고 다시 시도해 주세요.');
        return response;
    }
    async function load(start) {
        if (dirty && !confirm('저장하지 않은 주간 기록을 버리고 이동할까요?')) return false;
        busy = true; render(); status('주간 기록을 불러오는 중…'); $('retry-week').hidden = true;
        try {
            const response = await request(undefined, start); const loaded = await response.json();
            blocks = loaded; week = start; dirty = false; ready = true; status('05:00부터 다음 날 03:00까지 · 30분 단위'); return true;
        } catch (error) { status(error.message); $('retry-week').hidden = false; return false; }
        finally { busy = false; render(); requestAnimationFrame(() => sizeWeek(true)); }
    }
    $('save-week').onclick = async () => {
        busy = true; render(); status('주간 기록을 저장하는 중…');
        try {
            await request({ method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(blocks) });
            dirty = false; status(window.plannerSavedAt());
        } catch (error) { status(error.message); }
        finally { busy = false; render(); requestAnimationFrame(() => sizeWeek(true)); }
    };
    $('prev-week').onclick = () => load(shift(week, -7));
    $('next-week').onclick = () => load(shift(week, 7));
    $('this-week').onclick = () => load(monday(key(new Date())));
    $('retry-week').onclick = () => load(week);
    $('toggle-view').onclick = async () => {
        if (busy) return;
        const monthly = $('monthly-view').hidden;
        if (!monthly && (monday(selectedDate) !== week || !ready)) {
            $('toggle-view').disabled = true;
            const success = await load(monday(selectedDate));
            $('toggle-view').disabled = false;
            if (!success) { window.alert('주간 전환을 완료하지 못했어요. 주간 기록의 변경 사항 또는 연결 상태를 확인해 주세요.'); return; }
        }
        $('monthly-view').hidden = !monthly; $('weekly-view').hidden = monthly;
        $('toggle-view').textContent = monthly ? '주간으로 변경' : '월간으로 변경';
        $('toggle-view').setAttribute('aria-pressed', String(monthly));
        if (!monthly) requestAnimationFrame(() => sizeWeek(true));
    };
    window.addEventListener('beforeunload', event => { if (dirty) { event.preventDefault(); event.returnValue = ''; } });
    window.addEventListener('resize', () => { sizeWeek(); render(); sizeWeek(true); });
    load(week);
})();
