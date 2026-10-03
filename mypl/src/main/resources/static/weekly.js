(() => {
    const t = window.plannerI18n.t;
    const $ = id => document.getElementById(id);
    const START = 300, END = 1620, SLOT = 30;
    let HEIGHT = 14;
    const scroller = document.querySelector('.week-scroll');
    function sizeWeek(reset = false) {
        if (!scroller.clientHeight) return;
        HEIGHT = Math.max(6, (scroller.clientHeight - 52) / 32);
        document.documentElement.style.setProperty('--slot-height', `${HEIGHT}px`);
        document.querySelectorAll('.time-axis span').forEach((label, index) => {
            label.style.top = `${index * 2 * HEIGHT}px`;
        });
        document.querySelectorAll('.time-block').forEach(element => {
            const block = blocks[Number(element.dataset.index)];
            if (block) position(element, block);
        });
        if (pending) { const element = document.querySelector('.time-block.is-draft'); if (element) position(element,pending); }
        window.dispatchEvent(new CustomEvent('planner-week-sized'));
        if (reset) scroller.scrollTop = Math.max(0, 6 * HEIGHT - 8);
    }
    const key = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const shift = (date, days) => { const value = new Date(`${date}T12:00:00`); value.setDate(value.getDate() + days); return key(value); };
    const monday = date => shift(date, -((new Date(`${date}T12:00:00`).getDay() + 6) % 7));
    const time = minute => `${minute >= 1440 ? t('다음 날 ') : ''}${String(Math.floor(minute / 60) % 24).padStart(2, '0')}:${String(minute % 60).padStart(2, '0')}`;
    let week = monday(key(new Date())), blocks = [], dirty = false, busy = true, ready = false;
    let pending = null;
    let lastTap = null, selectedDate = key(new Date());
    window.addEventListener('planner-date-selected', event => { selectedDate = event.detail; });
    const status = message => { $('week-status').textContent = message; };
    const changed = () => { dirty = true; status(t('저장하지 않은 주간 기록이 있어요.')); };
    const overlaps = (block, start, end, date = block.planDate) => [...blocks, ...(pending ? [pending] : [])].some(other => other !== block && other.planDate === date && start < other.endMinute && end > other.startMinute);
    function position(element, block) {
        element.style.top = `${(block.startMinute - START) / SLOT * HEIGHT}px`;
        element.style.height = `${(block.endMinute - block.startMinute) / SLOT * HEIGHT}px`;
        element.title = `${time(block.startMinute)} ~ ${time(block.endMinute)}`;
        element.querySelector('input')?.setAttribute('aria-label', t('{date} {time} 메모, 최대 20자', {date:block.planDate,time:time(block.startMinute)}));
    }
    function resize(block, element, edge, minute) {
        const start = edge === 'start' ? Math.max(START, Math.min(block.endMinute - SLOT, minute)) : block.startMinute;
        const end = edge === 'end' ? Math.min(END, Math.max(block.startMinute + SLOT, minute)) : block.endMinute;
        if (overlaps(block, start, end)) return;
        if (start === block.startMinute && end === block.endMinute) return;
        block.startMinute = start; block.endMinute = end; position(element, block); if (block !== pending) changed();
        status(`${time(start)} ~ ${time(end)} · ${t('저장하지 않은 변경 사항')}`);
    }
    function blockElement(block) {
        const element = document.createElement('div'); element.className = 'time-block'; element.classList.toggle('is-draft', block === pending); position(element, block);
        const input = document.createElement('input'); input.value = block.memo; input.placeholder = t('무엇을 했나요?');
        input.setAttribute('aria-label', t('{date} {time} 메모, 최대 20자', {date:block.planDate,time:time(block.startMinute)}));
        input.oninput = event => {
            if (event.isComposing) return;
            input.value = Array.from(input.value).slice(0, 20).join(''); block.memo = input.value;
            if (block === pending && block.memo.trim()) { blocks.push(block); pending = null; element.classList.remove('is-draft'); element.dataset.index = blocks.indexOf(block); }
            changed();
        };
        input.addEventListener('compositionend', () => input.oninput({ isComposing: false }));
        input.onclick = event => event.stopPropagation();
        input.onkeydown = event => {
            if (event.isComposing) return;
            if (event.key === 'Escape' && block === pending) { event.preventDefault(); cancelSelection(); }
            if (event.key === 'Enter') { event.preventDefault(); input.blur(); }
        };
        const shrink = () => { if (!busy) { block.endMinute = block.startMinute + SLOT; position(element, block); if (block !== pending) changed(); } };
        element.ondblclick = event => { event.preventDefault(); shrink(); };
        element.addEventListener('pointerup', event => {
            if (event.pointerType !== 'touch' || event.target.closest('.resize-handle, .move-block, .delete-block')) return;
            const now = Date.now();
            if (lastTap?.block === block && now - lastTap.at < 350) { shrink(); lastTap = null; }
            else lastTap = { block, at: now };
        });
        const remove = document.createElement('button'); remove.className = 'delete-block'; remove.textContent = '×'; remove.setAttribute('aria-label', t('시간 블록 삭제'));
        remove.onclick = event => { event.stopPropagation(); if (block === pending) { cancelSelection(); return; } blocks.splice(blocks.indexOf(block), 1); changed(); render(); };
        const moveHandle = document.createElement('button'); moveHandle.className = 'move-block'; moveHandle.textContent = '⠿';
        moveHandle.setAttribute('aria-label', t('일정 이동. 방향키로 날짜와 시간 변경'));
        moveHandle.onclick = event => event.stopPropagation();
        moveHandle.ondblclick = event => event.stopPropagation();
        const moveBlock = (date, start) => {
            const duration = block.endMinute - block.startMinute;
            start = Math.max(START, Math.min(END - duration, start));
            if (date < week || date > shift(week, 6) || overlaps(block, start, start + duration, date)) return;
            if (block.planDate === date && block.startMinute === start) return;
            block.planDate = date; block.startMinute = start; block.endMinute = start + duration;
            position(element, block); if (block !== pending) changed();
            input.setAttribute('aria-label', t('{date} {time} 메모, 최대 20자', {date,time:time(start)}));
        };
        const place = () => {
            const column = document.querySelector(`.day-column[data-date="${block.planDate}"]`);
            if (element.parentElement !== column) column.append(element);
            element.style.transform = '';
        };
        moveHandle.onkeydown = event => {
            if (busy || !['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key)) return;
            event.preventDefault();
            moveBlock(shift(block.planDate, event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0),
                block.startMinute + (event.key === 'ArrowUp' ? -SLOT : event.key === 'ArrowDown' ? SLOT : 0));
            place(); moveHandle.focus({preventScroll:true});
        };
        moveHandle.onpointerdown = event => {
            if (busy) return;
            event.preventDefault(); event.stopPropagation();
            const originY = event.clientY, originScroll = scroller.scrollTop, originMinute = block.startMinute;
            const originalColumn = element.parentElement;
            const restoreInput = document.activeElement === input;
            let pointerX = event.clientX, pointerY = event.clientY, frame, finished = false;
            const update = () => {
                const columns = [...document.querySelectorAll('.day-column')];
                const target = columns.find(column => { const bounds = column.getBoundingClientRect(); return pointerX >= bounds.left && pointerX < bounds.right; });
                if (!target) return;
                moveBlock(target.dataset.date, originMinute + Math.round((pointerY - originY + scroller.scrollTop - originScroll) / HEIGHT) * SLOT);
                const current = columns.find(column => column.dataset.date === block.planDate);
                element.style.transform = `translateX(${current.getBoundingClientRect().left - originalColumn.getBoundingClientRect().left}px)`;
            };
            moveHandle.setPointerCapture(event.pointerId);
            moveHandle.onpointermove = move => { pointerX = move.clientX; pointerY = move.clientY; update(); };
            const scroll = () => {
                const bounds = scroller.getBoundingClientRect();
                if (pointerY < bounds.top + 45) scroller.scrollTop -= 8;
                else if (pointerY > bounds.bottom - 35) scroller.scrollTop += 8;
                if (pointerX < bounds.left + 55) scroller.scrollLeft -= 8;
                else if (pointerX > bounds.right - 25) scroller.scrollLeft += 8;
                update(); frame = requestAnimationFrame(scroll);
            };
            frame = requestAnimationFrame(scroll);
            const finish = () => {
                if (finished) return; finished = true; cancelAnimationFrame(frame);
                moveHandle.onpointermove = moveHandle.onpointerup = moveHandle.onpointercancel = moveHandle.onlostpointercapture = null;
                place(); if (restoreInput) input.focus({preventScroll:true});
            };
            moveHandle.onpointerup = moveHandle.onpointercancel = moveHandle.onlostpointercapture = finish;
        };
        element.append(input, moveHandle, remove);
        for (const edge of ['start', 'end']) {
            const handle = document.createElement('button'); handle.className = `resize-handle ${edge}`;
            handle.setAttribute('aria-label', t(edge === 'start' ? '시작 시간 조절. 위아래 방향키로 30분씩 변경' : '종료 시간 조절. 위아래 방향키로 30분씩 변경'));
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
        element.querySelectorAll('input, button').forEach(control => { control.disabled = busy; });
        return element;
    }
    function render() {
        const scrollTop = scroller.scrollTop, scrollLeft = scroller.scrollLeft;
        $('week-label').textContent = `${week.replaceAll('-', '.')} – ${shift(week, 6).slice(5).replace('-', '.')}`;
        for (const id of ['prev-week', 'next-week', 'this-week']) $(id).disabled = busy;
        $('save-week').disabled = busy || !ready;
        const grid = $('week-grid'); grid.replaceChildren();
        const corner = document.createElement('div'); corner.className = 'week-corner'; corner.textContent = t('시간'); grid.append(corner);
        const days = Array.from({length:7}, (_,i) => new Intl.DateTimeFormat(window.plannerI18n.locale(), {weekday:'short'}).format(new Date(`${shift(week,i)}T12:00:00`)));
        for (let day = 0; day < 7; day++) {
            const date = shift(week, day), header = document.createElement('button'); header.className = 'week-day';
            header.textContent = `${days[day]} ${Number(date.slice(8))}`; header.setAttribute('aria-label', t('{date} 일일 기록 열기', {date}));
            header.onclick = () => window.dispatchEvent(new CustomEvent('planner-select-date', { detail: date })); grid.append(header);
        }
        const axis = document.createElement('div'); axis.className = 'time-axis';
        for (let minute = START; minute <= END; minute += 60) {
            const label = document.createElement('span'); label.textContent = minute === 1440 ? '24:00' : `${String(Math.floor(minute / 60) % 24).padStart(2, '0')}:00`;
            label.style.top = `${(minute - START) / SLOT * HEIGHT}px`; axis.append(label);
        }
        grid.append(axis);
        for (let day = 0; day < 7; day++) {
            const date = shift(week, day), column = document.createElement('div'); column.className = 'day-column'; column.dataset.date = date;
            for (let minute = START; minute < END; minute += SLOT) {
                const slot = document.createElement('button'); slot.className = 'time-slot'; slot.disabled = busy || !ready;
                slot.setAttribute('aria-label', t('{date} {time} 시간 선택', {date,time:time(minute)}));
                slot.onclick = () => {
                    const next = blocks.filter(block => block.planDate === date && block.startMinute > minute)
                        .reduce((end, block) => Math.min(end, block.startMinute), END);
                    const end = Math.min(minute + 60, next, END);
                    const block = { planDate: date, startMinute: minute, endMinute: end, memo: '' };
                    if (blocks.some(other => other.planDate === date && minute < other.endMinute && end > other.startMinute)) { status(t('이미 기록한 시간과 겹쳐요. 다른 시간대를 선택해 주세요.')); return; }
                    pending = block; render();
                    // Focus synchronously in the tap handler so mobile keyboards open immediately.
                    document.querySelector('.time-block.is-draft input').focus({preventScroll:true});
                    status(t('상자에 바로 입력 · 위아래 테두리로 크기 조절 · 왼쪽 손잡이로 이동'));
                };
                column.append(slot);
            }
            if (pending?.planDate === date) column.append(blockElement(pending));
            blocks.filter(block => block.planDate === date).forEach(block => {
                const element = blockElement(block); element.dataset.index = blocks.indexOf(block);
                element.querySelectorAll('input, button').forEach(control => { control.disabled = busy; }); column.append(element);
            });
            grid.append(column);
        }
        window.dispatchEvent(new CustomEvent('planner-week-rendered', {detail:week}));
        scroller.scrollTop = scrollTop; scroller.scrollLeft = scrollLeft;
        requestAnimationFrame(() => { scroller.scrollTop = scrollTop; scroller.scrollLeft = scrollLeft; });
    }
    async function request(options, start = week) {
        const response = await window.plannerApi(`/api/weekly?start=${start}`, options);
        if (response.status === 401 || response.redirected) throw new Error(t('다시 로그인해 주세요. 현재 입력한 기록은 화면에 남아 있어요.'));
        if (!response.ok) throw new Error(t('주간 기록 요청에 실패했어요. 연결을 확인하고 다시 시도해 주세요.'));
        return response;
    }
    async function load(start) {
        if ((dirty || pending?.memo) && !confirm(t('저장하지 않은 주간 기록을 버리고 이동할까요?'))) return false;
        busy = true; render(); status(t('주간 기록을 불러오는 중…')); $('retry-week').hidden = true;
        try {
            const response = await request(undefined, start); const loaded = await response.json();
            pending = null; blocks = loaded; week = start; dirty = false; ready = true; status(t('05:00부터 다음 날 03:00까지 · 30분 단위')); return true;
        } catch (error) { status(error.message); $('retry-week').hidden = false; return false; }
        finally { busy = false; render(); requestAnimationFrame(() => sizeWeek(true)); }
    }
    function cancelSelection() {
        pending = null; render(); status(t('시간 선택을 취소했어요.'));
    }
    $('save-week').onclick = async () => {
        pending = null;
        busy = true; render(); status(t('주간 기록을 저장하는 중…'));
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
            if (!success) { window.alert(t('주간 전환을 완료하지 못했어요. 주간 기록의 변경 사항 또는 연결 상태를 확인해 주세요.')); return; }
        }
        $('monthly-view').hidden = !monthly; $('weekly-view').hidden = monthly;
        $('toggle-view').textContent = monthly ? t('주간으로 변경') : t('월간으로 변경');
        $('toggle-view').setAttribute('aria-pressed', String(monthly));
        if (!monthly) requestAnimationFrame(() => sizeWeek(true));
    };
    window.addEventListener('beforeunload', event => { if (dirty || pending?.memo) { event.preventDefault(); event.returnValue = ''; } });
    new ResizeObserver(() => sizeWeek(!document.activeElement?.closest('.time-block'))).observe(scroller);
    window.addEventListener('planner-language-change', () => {
        render();
        $('toggle-view').textContent = $('monthly-view').hidden ? t('월간으로 변경') : t('주간으로 변경');
        requestAnimationFrame(() => sizeWeek());
    });
    load(week);
})();
