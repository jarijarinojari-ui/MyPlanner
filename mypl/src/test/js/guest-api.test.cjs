const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const source=fs.readFileSync(new URL('../../main/resources/static/planner-api.js',`file://${__filename}`),'utf8');
function setup(guest=true,storage=new Map(),fail=false) {
    let calls=0;
    const window={plannerI18n:{t:s=>s}};
    vm.runInNewContext(source,{window,document:{documentElement:{dataset:{guest:String(guest)}}},location:{origin:'http://localhost'},URL,Response,
        localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>{if(fail)throw new Error('quota');storage.set(key,value);}},
        fetch:async()=>{calls++;return new Response('{}');}});
    return {api:window.plannerApi,storage,calls:()=>calls};
}
test('guest daily, weekly and monthly survive a new page without server calls',async()=>{
    const first=setup();
    await first.api('/api/daily',{method:'POST',body:JSON.stringify({planDate:'2026-10-04',goals:[],todos:[{content:'독서',done:false}],memo:'메모'})});
    await first.api('/api/weekly?start=2026-09-28',{method:'PUT',body:JSON.stringify([{planDate:'2026-10-04',startMinute:600,endMinute:660,memo:'공부'}])});
    await first.api('/api/monthly?date=2026-10-04',{method:'PUT',body:JSON.stringify(['운동'])});
    const second=setup(true,first.storage);
    assert.equal((await (await second.api('/api/daily?date=2026-10-04')).json()).todos[0].content,'독서');
    assert.equal((await (await second.api('/api/weekly?start=2026-09-28')).json())[0].memo,'공부');
    assert.equal((await (await second.api('/api/monthly?month=2026-10')).json())[0].titles[0],'운동');
    assert.equal(first.calls()+second.calls(),0);
});
test('account mode uses server and leaves guest records untouched',async()=>{
    const store=new Map([['planner.guest.v1.daily.2026-10-04','{}']]);const app=setup(false,store);
    await app.api('/api/daily?date=2026-10-04');assert.equal(app.calls(),1);assert.equal(store.size,1);
});
test('storage failure does not pretend to save successfully',async()=>{
    const app=setup(true,new Map(),true);
    await assert.rejects(app.api('/api/daily',{method:'POST',body:JSON.stringify({planDate:'2026-10-04'})}));
});
