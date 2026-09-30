// Apply saved appearance before painting; storage can be unavailable in private browsers.
(() => {
    let theme = '', language = 'ko';
    try { theme = localStorage.getItem('planner.theme'); language = localStorage.getItem('planner.language') || 'ko'; } catch {}
    document.documentElement.dataset.theme = ['light', 'dark'].includes(theme) ? theme : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.lang = ['ko', 'ja', 'en'].includes(language) ? language : 'ko';
})();
