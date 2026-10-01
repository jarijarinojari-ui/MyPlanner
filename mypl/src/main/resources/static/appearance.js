// Apply saved preferences before painting. Country detection never overwrites a manual choice.
(() => {
    const valid = language => ['ko', 'ja', 'en'].includes(language);
    const read = key => { try { return localStorage.getItem(key); } catch { return null; } };
    const theme = read('planner.theme');
    const selected = read('planner.language');
    const detected = read('planner.detected-language');
    const browserLanguage = (navigator.language || 'en').split('-')[0].toLowerCase();
    document.documentElement.dataset.theme = ['light', 'dark'].includes(theme) ? theme : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.lang = valid(selected) ? selected : valid(detected) ? detected : valid(browserLanguage) ? browserLanguage : 'en';
    if (valid(selected) || valid(detected)) return;

    let manuallyChanged = false;
    document.addEventListener('change', event => {
        if (event.target.id === 'language-setting') manuallyChanged = true;
    });
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    // The caller's public IP is resolved by Country.is; no IP is stored in this app.
    fetch('https://api.country.is/', {signal:controller.signal, credentials:'omit', referrerPolicy:'no-referrer'})
        .then(response => { if (!response.ok) throw new Error('Country lookup unavailable'); return response.json(); })
        .then(({country}) => {
            if (typeof country !== 'string' || !/^[A-Z]{2}$/.test(country)) return;
            if (manuallyChanged || valid(read('planner.language'))) return;
            const language = country === 'KR' ? 'ko' : country === 'JP' ? 'ja' : 'en';
            try { localStorage.setItem('planner.detected-language', language); } catch {}
            document.documentElement.lang = language;
            window.dispatchEvent(new CustomEvent('planner-country-language', {detail:language}));
        })
        .catch(() => { /* Keep the browser language and allow retry on a later visit. */ })
        .finally(() => clearTimeout(timeout));
})();
