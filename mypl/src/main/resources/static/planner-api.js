// Account requests use the server. Guest records never leave this browser.
(() => {
    const guest = document.documentElement.dataset.guest === 'true';
    const prefix = 'planner.guest.v1.';
    const read = key => {
        try { return JSON.parse(localStorage.getItem(prefix + key) || 'null'); }
        catch { throw new Error(window.plannerI18n.t('브라우저 저장소를 읽을 수 없어요. 저장소 설정을 확인해 주세요.')); }
    };
    const write = (key, value) => {
        try { localStorage.setItem(prefix + key, JSON.stringify(value)); }
        catch { throw new Error(window.plannerI18n.t('브라우저에 저장하지 못했어요. 저장 공간과 설정을 확인해 주세요.')); }
    };
    const json = value => new Response(JSON.stringify(value), {headers:{'Content-Type':'application/json'}});
    window.plannerGuest = guest;
    window.plannerApi = async (url, options = {}) => {
        if (!guest) return fetch(url, options);
        const target = new URL(url, location.origin), method = options.method || 'GET';
        const date = target.searchParams.get('date'), start = target.searchParams.get('start');
        const body = options.body ? JSON.parse(options.body) : null;
        if (target.pathname === '/api/daily') {
            if (method === 'GET') return json(read('daily.' + date) || {planDate:date,goals:[],todos:[],memo:''});
            write('daily.' + body.planDate, body); return json({});
        }
        if (target.pathname === '/api/weekly') {
            if (method === 'GET') return json(read('weekly.' + start) || []);
            write('weekly.' + start, body); return json({});
        }
        if (target.pathname === '/api/monthly') {
            if (method === 'PUT') { write('monthly.' + date, body); return json({planDate:date,titles:body}); }
            const month = target.searchParams.get('month'), days = [];
            for (let day = 1; day <= 31; day++) {
                const planDate = `${month}-${String(day).padStart(2,'0')}`, titles = read('monthly.' + planDate);
                if (titles?.length) days.push({planDate,titles});
            }
            return json(days);
        }
        if (target.pathname.startsWith('/api/focus')) return window.guestFocusApi(target, method, body, {read,write,json});
        return new Response(null, {status:404});
    };
})();
