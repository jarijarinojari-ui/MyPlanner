const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(new URL('../../main/resources/static/appearance.js', `file://${__filename}`), 'utf8');

async function start({country = 'KR', saved = {}, browser = 'en-US', fail = false, beforeResponse} = {}) {
    const storage = new Map(Object.entries(saved)), listeners = {}, events = [];
    const root = {dataset:{}};
    let calls = 0, resolve;
    const response = new Promise(r => resolve = r);
    vm.runInNewContext(source, {
        document: {documentElement:root, addEventListener:(name, callback) => listeners[name] = callback},
        navigator:{language:browser}, localStorage:{getItem:key => storage.get(key), setItem:(key,value) => storage.set(key,value)},
        matchMedia:() => ({matches:false}), AbortController, setTimeout, clearTimeout,
        CustomEvent:class { constructor(type, options) { this.type = type; this.detail = options.detail; } },
        window:{dispatchEvent:event => events.push(event)},
        fetch:async (url, options) => {
            calls++;
            assert.equal(url, 'https://api.country.is/');
            assert.equal(options.credentials, 'omit');
            assert.equal(options.referrerPolicy, 'no-referrer');
            await response;
            if (fail) throw new Error('offline');
            return {ok:true,json:async () => ({country})};
        }
    });
    if (beforeResponse) beforeResponse(storage,listeners,root);
    resolve();
    await new Promise(setImmediate);
    return {root,storage,calls,events};
}

for (const [country, language] of [['KR','ko'],['JP','ja'],['US','en'],['FR','en']]) {
    test(`first visit from ${country} selects ${language}`, async () => {
        const result = await start({country});
        assert.equal(result.root.lang, language);
        assert.equal(result.storage.get('planner.detected-language'), language);
        assert.equal(result.events[0].detail, language);
    });
}
test('manual preference bypasses country lookup', async () => {
    const result = await start({country:'JP',saved:{'planner.language':'ko'}});
    assert.equal(result.root.lang,'ko'); assert.equal(result.calls,0);
});
test('return visit reuses initial country language', async () => {
    const result = await start({saved:{'planner.detected-language':'ja'}});
    assert.equal(result.root.lang,'ja'); assert.equal(result.calls,0);
});
test('manual change during lookup wins', async () => {
    const result = await start({country:'JP',beforeResponse:(storage,listeners,root) => {
        storage.set('planner.language','en'); root.lang = 'en';
        listeners.change({target:{id:'language-setting'}});
    }});
    assert.equal(result.root.lang,'en'); assert.equal(result.events.length,0);
});
test('lookup failure falls back to browser language without blocking', async () => {
    const result = await start({fail:true,browser:'ja-JP'});
    assert.equal(result.root.lang,'ja'); assert.equal(result.events.length,0);
});
test('unsupported browser language falls back to English', async () => {
    const result = await start({fail:true,browser:'fr-FR'});
    assert.equal(result.root.lang,'en');
});
