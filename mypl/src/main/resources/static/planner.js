(() => {
    const t = window.plannerI18n.t;
    const $ = id => document.getElementById(id);
    const dateKey = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const today = dateKey(new Date());
    let selected = today, month = new Date(`${today}T12:00:00`), dirty = false, busy = false;
    let data = { goals: [], todos: [], memo: '' };
    const markDirty = () => { dirty = true; $('status').textContent = t('저장하지 않은 변경 사항이 있어요.'); };
    let monthItems = new Map(), loadedMonth = '', monthLoading = false, monthRequest = 0;
    let editDate = '', draft = [], monthSaving = false;
    const monthKey = () => dateKey(month).slice(0, 7);
    async function fetchMonth() {
        const target = monthKey(), sequence = ++monthRequest;
        monthLoading = true; loadedMonth = ''; monthItems = new Map(); calendar();
        $('month-status').textContent = t('월간 일정을 불러오는 중…'); $('retry-month').hidden = true;
        try {
            const response = await request(`/api/monthly?month=${target}`);
            const days = await response.json();
            if (sequence !== monthRequest) return;
            monthItems = new Map(days.map(day => [day.planDate, day.titles])); loadedMonth = target;
            $('month-status').textContent = t('일정을 눌러 수정하거나 삭제할 수 있어요.');
        } catch (error) {
            if (sequence !== monthRequest) return;
            $('month-status').textContent = error.message; $('retry-month').hidden = false;
        } finally {
            if (sequence === monthRequest) { monthLoading = false; calendar(); }
        }
    }
    function calendar() {
        $('month-label').textContent = new Intl.DateTimeFormat(window.plannerI18n.locale(), {year:'numeric',month:'long'}).format(month);
        $('calendar').replaceChildren();
        const first = new Date(month.getFullYear(), month.getMonth(), 1);
        for (let i = 0; i < first.getDay(); i++) {
            const blank = document.createElement('div'); blank.className = 'month-empty'; $('calendar').append(blank);
        }
        const last = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
        $('calendar').style.setProperty('--month-rows', Math.ceil((first.getDay() + last) / 7));
        for (let day = 1; day <= last; day++) {
            const key = dateKey(new Date(month.getFullYear(), month.getMonth(), day));
            const cell = document.createElement('div'); cell.className = 'month-day';
            cell.classList.toggle('selected', key === selected);
            const heading = document.createElement('div'); heading.className = 'month-day-heading';
            const button = document.createElement('button'); button.className = 'month-date'; button.textContent = day;
            button.classList.toggle('is-today', key === today);
            button.setAttribute('aria-label', t('{date} 선택', {date:key})); button.setAttribute('aria-pressed', String(key === selected));
            button.disabled = busy; button.onclick = () => load(key);
            const titles = loadedMonth === monthKey() ? monthItems.get(key) || [] : [];
            const add = document.createElement('button'); add.className = 'month-add'; add.textContent = '+';
            add.setAttribute('aria-label', t('{date} 일정 추가', {date:key}));
            add.disabled = monthLoading || loadedMonth !== monthKey() || titles.length >= 5;
            add.onclick = () => editMonth(key, true);
            heading.append(button, add); cell.append(heading);
            titles.slice(0, 3).forEach((title, index) => {
                const event = document.createElement('button'); event.className = 'month-event'; event.textContent = title; event.title = title;
                event.setAttribute('aria-label', t('{date} 일정 {title} 수정', {date:key,title}));
                event.onclick = () => editMonth(key, false, index); cell.append(event);
            });
            if (titles.length > 3) {
                const more = document.createElement('button'); more.className = 'month-more';
                more.textContent = t('+{count}개 더보기', {count:titles.length - 3});
                more.setAttribute('aria-label', t('{date} 일정 전체 {count}개 보기', {date:key,count:titles.length}));
                more.onclick = () => editMonth(key, false); cell.append(more);
            }
            cell.onclick = event => { if (event.target === cell) load(key); };
            $('calendar').append(cell);
        }
        const trailing = (7 - (first.getDay() + last) % 7) % 7;
        for (let i = 0; i < trailing; i++) {
            const blank = document.createElement('div'); blank.className = 'month-empty'; $('calendar').append(blank);
        }
    }
    function editMonth(key, add, focusIndex = 0) {
        editDate = key; draft = [...(monthItems.get(key) || [])];
        if (add && draft.length < 5) { draft.push(''); focusIndex = draft.length - 1; }
        $('month-dialog-title').textContent = t('{date} 일정', {date:key});
        $('month-dialog-status').textContent = ''; renderDraft(); $('month-dialog').showModal();
        $('month-inputs').querySelectorAll('input')[focusIndex]?.focus();
    }
    function renderDraft() {
        $('month-inputs').replaceChildren();
        draft.forEach((title, index) => {
            const row = document.createElement('div'); row.className = 'month-input-row';
            const input = document.createElement('input'); input.value = title; input.required = true;
            input.setAttribute('aria-label', t('일정 {index}', {index:index+1})); input.placeholder = t('일정을 적어주세요'); input.disabled = monthSaving;
            const update = event => {
                if (event.isComposing) return;
                input.value = Array.from(input.value).slice(0, 20).join(''); draft[index] = input.value;
            };
            input.oninput = update; input.addEventListener('compositionend', () => update({isComposing: false}));
            const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = '×'; remove.disabled = monthSaving;
            remove.setAttribute('aria-label', t('일정 {index} 삭제', {index:index+1}));
            remove.onclick = () => { draft.splice(index, 1); renderDraft(); };
            row.append(input, remove); $('month-inputs').append(row);
        });
        $('add-month-item').disabled = monthSaving || draft.length >= 5;
        $('save-month').disabled = monthSaving; $('cancel-month').disabled = monthSaving;
    }
    $('add-month-item').onclick = () => { if (draft.length < 5) { draft.push(''); renderDraft(); $('month-inputs').lastElementChild.querySelector('input').focus(); } };
    $('cancel-month').onclick = () => $('month-dialog').close();
    $('month-dialog').addEventListener('cancel', event => { if (monthSaving) event.preventDefault(); });
    $('month-form').onsubmit = async event => {
        event.preventDefault(); if (monthSaving) return;
        if (draft.some(title => !title.trim())) { $('month-dialog-status').textContent = t('빈 일정은 입력하거나 삭제해 주세요.'); return; }
        monthSaving = true; renderDraft(); $('month-dialog-status').textContent = t('저장하는 중…');
        try {
            const response = await request(`/api/monthly?date=${editDate}`, {method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(draft)});
            const day = await response.json(); monthItems.set(day.planDate, day.titles); calendar();
            $('month-status').textContent = window.plannerSavedAt(); $('month-dialog').close();
        } catch (error) { $('month-dialog-status').textContent = error.message; }
        finally { monthSaving = false; renderDraft(); }
    };
    $('retry-month').onclick = fetchMonth;
    function progress() { $('progress').textContent = t('{done} / {total} 완료', {done:data.todos.filter(item => item.done).length,total:data.todos.length}); }
    function fitText(input) {
        input.style.height = 'auto';
        input.style.height = `${Math.max(40, input.scrollHeight)}px`;
    }
    function fitLists() { document.querySelectorAll('.item textarea').forEach(fitText); }
    function renderList(type) {
        $(type).replaceChildren();
        data[type].forEach((item, index) => {
            const row = document.createElement('div'); row.className = 'item';
            const check = document.createElement('input'); check.type = 'checkbox'; check.checked = item.done;
            check.setAttribute('aria-label', t('{type} {index} 완료', {type:type === 'goals' ? t('목표') : t('할 일'),index:index+1}));
            check.onchange = () => { item.done = check.checked; markDirty(); progress(); };
            const input = document.createElement('textarea'); input.rows = 1; input.maxLength = 255; input.value = item.content;
            input.placeholder = type === 'goals' ? t('오늘의 목표를 적어보세요') : t('할 일을 적어보세요');
            input.setAttribute('aria-label', t('{type} {index}', {type:type === 'goals' ? t('목표') : t('할 일'),index:index+1}));
            input.oninput = () => { item.content = input.value; fitText(input); markDirty(); };
            const remove = document.createElement('button'); remove.textContent = '×'; remove.setAttribute('aria-label', t('{index}번 항목 삭제', {index:index+1}));
            remove.onclick = () => { data[type].splice(index, 1); markDirty(); renderList(type); };
            row.append(check, input, remove); $(type).append(row);
        });
        progress();
        requestAnimationFrame(fitLists);
    }
    function setBusy(value) { busy = value; $('editor').disabled = value; $('date').disabled = value; $('prev-day').disabled = value; $('next-day').disabled = value; calendar(); }
    async function request(url, options) {
        const response = await window.plannerApi(url, options);
        if (response.status === 401 || response.redirected) throw new Error(t('로그인이 만료되었어요. 다시 로그인해 주세요. 입력 내용은 이 화면에 남아 있어요.'));
        if (!response.ok) throw new Error(t('요청을 완료하지 못했어요. 연결 상태를 확인하고 다시 시도해 주세요.'));
        return response;
    }
    async function load(key) {
        if (busy || !key) { $('date').value = selected; return; }
        if (dirty && !confirm(t('저장하지 않은 내용이 있어요. 변경 사항을 버리고 날짜를 이동할까요?'))) { $('date').value = selected; return; }
        setBusy(true); $('retry').hidden = true; $('status').textContent = t('기록을 불러오는 중…');
        try {
            const response = await request(`/api/daily?date=${encodeURIComponent(key)}`);
            const loaded = await response.json();
            data = loaded; selected = key; month = new Date(`${key}T12:00:00`); dirty = false;
            $('date').value = key;
            $('day-label').textContent = new Intl.DateTimeFormat(window.plannerI18n.locale(), { month: 'long', day: 'numeric', weekday: 'long' }).format(month);
            renderList('goals'); renderList('todos'); $('memo').value = data.memo || '';
            $('status').textContent = '';
            setBusy(false);
            window.dispatchEvent(new CustomEvent('planner-date-selected', {detail:selected}));
            if (loadedMonth !== monthKey()) fetchMonth();
        } catch (error) {
            $('status').textContent = error.message; busy = false; $('date').disabled = false; $('prev-day').disabled = false; $('next-day').disabled = false; $('date').value = selected; calendar();
            $('editor').disabled = !data.planDate;
            $('retry').hidden = false;
        }
    }
    document.querySelectorAll('[data-add]').forEach(button => button.onclick = () => {
        const type = button.dataset.add;
        if (data[type].length >= 100) { $('status').textContent = t('각 목록은 100개까지 입력할 수 있어요.'); return; }
        data[type].push({ content: '', done: false }); markDirty(); renderList(type);
        $(type).lastElementChild.querySelector('textarea').focus();
    });
    $('memo').oninput = () => { data.memo = $('memo').value; markDirty(); };
    $('save').onclick = async () => {
        const empty = [...document.querySelectorAll('.item textarea')].find(input => !input.value.trim());
        if (empty) { $('status').textContent = t('빈 항목에 내용을 입력하거나 삭제해 주세요.'); empty.focus(); return; }
        setBusy(true); $('status').textContent = t('저장하는 중…');
        try {
            await request('/api/daily', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, planDate: selected }) });
            dirty = false; $('status').textContent = window.plannerSavedAt();
        } catch (error) { $('status').textContent = error.message; }
        finally { setBusy(false); }
    };
    function moveDay(offset) {
        const date = new Date(`${selected}T12:00:00`);
        date.setDate(date.getDate() + offset);
        load(dateKey(date));
    }
    $('prev-day').onclick = () => moveDay(-1);
    $('next-day').onclick = () => moveDay(1);
    function showPanel(panel) {
        const focus = panel === 'focus';
        document.body.classList.toggle('show-daily', panel !== 'schedule');
        document.body.classList.toggle('show-focus', focus);
        $('editor').hidden = focus;
        $('focus-panel').hidden = !focus;
        for (const name of ['schedule', 'daily', 'focus']) {
            $(`show-${name}`).setAttribute('aria-pressed', String(panel === name));
        }
        $('daily-tab').setAttribute('aria-pressed', String(!focus));
        $('focus-tab').setAttribute('aria-pressed', String(focus));
        requestAnimationFrame(fitLists);
    }
    for (const panel of ['schedule', 'daily', 'focus']) {
        $(`show-${panel}`).onclick = () => showPanel(panel);
    }
    $('daily-tab').onclick = () => showPanel('daily');
    $('focus-tab').onclick = () => showPanel('focus');
    let listWidth = 0;
    new ResizeObserver(entries => {
        const width = entries[0].contentRect.width;
        if (width && width !== listWidth) { listWidth = width; requestAnimationFrame(fitLists); }
    }).observe($('editor'));
    $('date').onchange = () => load($('date').value);
    $('today').onclick = () => load(today);
    $('retry').onclick = () => load(selected);
    $('prev-month').onclick = () => { month = new Date(month.getFullYear(), month.getMonth() - 1, 1); fetchMonth(); };
    $('next-month').onclick = () => { month = new Date(month.getFullYear(), month.getMonth() + 1, 1); fetchMonth(); };
    window.addEventListener('beforeunload', event => { if (dirty) { event.preventDefault(); event.returnValue = ''; } });
    window.addEventListener('planner-select-date', event => load(event.detail));
    window.addEventListener('planner-language-change', () => {
        calendar(); renderList('goals'); renderList('todos');
        if (data.planDate) $('day-label').textContent = new Intl.DateTimeFormat(window.plannerI18n.locale(), {month:'long',day:'numeric',weekday:'long'}).format(new Date(`${selected}T12:00:00`));
    });
    fetchMonth();
    load(today);
})();
