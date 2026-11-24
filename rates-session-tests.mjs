// Exercise the real shared session controller with a minimal DOM adapter.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import * as rates from './dist/rates.js';
import * as rateUI from './dist/rates-ui.js';
import * as math from './dist/math.js';
import * as factoring from './dist/factoring.js';
import * as progress from './dist/progress.js';
import * as diagrams from './dist/diagrams.js';
import * as fractions from './dist/fractions.js';
const memory=new Map(),nodes=new Map(),app={html:'',get innerHTML(){return this.html},set innerHTML(value){this.html=value;nodes.clear()}};
const node=selector=>{
 if(selector==='#app')return app;
 if(!app.innerHTML.includes(`id="${selector.slice(1)}"`))return null;
 if(!nodes.has(selector))nodes.set(selector,{handlers:{},addEventListener(event,handler){this.handlers[event]=handler}});
 return nodes.get(selector);
};
let practiceTool;
const context=vm.createContext({...rates,...rateUI,...math,...factoring,...progress,...diagrams,...fractions,
 structuredClone,console,matchMedia:()=>({matches:false}),mountCalculator:()=>({update(){},toggle(){}}),
 localStorage:{getItem:key=>memory.get(key),setItem:(key,value)=>memory.set(key,value)},
 document:{querySelector:node,querySelectorAll:()=>[],modelContext:{registerTool(tool){practiceTool=tool}}}
});
const source=(await readFile(new URL('./dist/app.js',import.meta.url),'utf8')).replace(/^import .*?;\r?\n/gm,'');
vm.runInContext(source+`\nglobalThis.testSession={
 state:()=>({mode,p,session,history,complete,done,feedback,length,difficulty,unitMode,hints,attempts,explained}),
 startUnit:(study,topic='rates')=>{unitMode=study;start(topic)},
 start, next, setDifficulty:value=>{difficulty=value;start()},
 respond:raw=>{selected=p.kind==='select'?(Array.isArray(raw)?raw:[]):p.kind==='choice'?[raw]:p.kind==='common-gcf'?raw.selected??[]:[];answer=p.kind==='common-gcf'?raw.answer??'':raw;submit()},
 mistakes:()=>{mistakeQueue=savedMistakes(history);unitMode='Mistakes';start('rates')}
}`,context);
const api=context.testSession;
const right=p=>p.kind==='ratio'?p.correctAnswer.join(':'):p.kind==='equivalent'?p.correctAnswer.map(n=>n*2).join(':'):p.kind==='list'?p.correctAnswer.join(', '):p.kind==='time'?rates.clockText(p.correctAnswer):p.kind==='number'?String(p.correctAnswer):p.correctAnswer;
assert.equal(api.state().mode,'triangle');assert.equal(api.state().length,10);
api.startUnit('Quiz');const topics=[],kinds=[];
for(let i=0;i<10;i++){
 const before=api.state();assert(!before.complete);topics.push(before.p.topic);kinds.push(before.p.kind);
 assert.equal(before.session.length,i);
 api.respond('');assert.equal(api.state().session.length,i,'Empty answer must not count');
 if(before.p.topic==='rate-proportion'&&!api.state().session.some(r=>!r.correct)){
  api.respond('-100');assert.equal(api.state().session.length,i+1);assert(!api.state().done);
  api.respond(right(before.p));assert.equal(api.state().session.length,i+1,'Retry must not create a second record');
 }else api.respond(right(before.p));
 assert(api.state().done);api.next();
}
assert(api.state().complete);assert.equal(new Set(topics).size,7);
assert.equal(topics.filter(t=>t==='rate-proportion').length,3);
assert(kinds.includes('choice')&&kinds.includes('select')&&kinds.includes('number'));
assert.equal(api.state().session.filter(r=>r.correct).length,9);
assert(app.innerHTML.includes('Practice My Mistakes (1)'));
const stored=progress.readHistory({getItem:key=>memory.get(key)});
assert.equal(stored.length,10);assert.equal(rates.savedMistakes(stored).length,1);
api.mistakes();assert.equal(api.state().length,1);api.respond(right(api.state().p));api.next();
assert(api.state().complete);assert.equal(rates.savedMistakes(api.state().history).length,0);
api.startUnit('Practice','rate-proportion');assert.equal(api.state().length,0);
for(let i=0;i<4;i++){api.respond(right(api.state().p));api.next()}
assert(!api.state().complete,'Topic practice must be unlimited');
api.setDifficulty('Hard');api.start('triangle');assert.equal(api.state().length,10);assert.equal(api.state().difficulty,'Easy');
api.start('rates');assert.equal(api.state().difficulty,'Hard');
api.start('progress');assert(app.innerHTML.includes('Rates &amp;')||app.innerHTML.includes('Rates & Ratios'));
const click=selector=>node(selector).handlers.click();
const change=(selector,value)=>node(selector).handlers.change({target:{value}});
api.startUnit('Quiz');
practiceTool.execute({topic:'rate-ratio'});
assert.equal(api.state().unitMode,'Practice');
assert.equal(api.state().p.topic,'rate-ratio');
assert.equal(api.state().length,0);
api.respond('1:1');
api.mistakes();
assert.equal(api.state().length,1);
api.respond(right(api.state().p));api.next();
click('#restart');
assert.equal(api.state().unitMode,'Practice');
assert.equal(api.state().length,0);
assert(!api.state().complete);
const fractionRight=p=>`${p.result.n}/${p.result.d}`;
for(const [topic,title] of fractions.fractionTabs){
 api.start(topic);assert.equal(api.state().p.type,'fraction');
 assert(app.innerHTML.includes(`<h1>${title}</h1>`));
 assert(app.innerHTML.includes('Chapter 4')&&app.innerHTML.includes('stacked-fraction'));
 assert(app.innerHTML.includes('id="answer" type="text"'));
 assert(!app.innerHTML.includes('data-mode="triangle" class="active"'));
 for(const [id] of fractions.fractionTabs)assert(app.innerHTML.includes(`data-mode="${id}"`));
 change('#length','5');change('#difficulty','Medium');
 const before=api.state().history.length;
 api.respond('1/0');assert.equal(api.state().session.length,0);assert.equal(api.state().attempts,0);
 assert.match(api.state().feedback,/nonzero/);
 click('#hint');assert.equal(api.state().hints,1);
 const p=api.state().p;
 api.respond(`${p.result.n*2}/${p.result.d*2}`);
 assert.equal(api.state().session.length,1);assert(!api.state().done);assert.match(api.state().feedback,/simplifying/);
 api.respond(fractionRight(p));assert(api.state().done&&api.state().explained);
 assert.equal(api.state().session.length,1);assert.equal(api.state().history.length,before+1);
 assert.equal(api.state().session[0].correct,false);assert.equal(api.state().session[0].hints,1);
 assert(app.innerHTML.includes("Let's work it through"));
 api.next();
 api.respond('-1');click('#explain');assert(!api.state().explained);
 api.respond('-1');click('#explain');assert(api.state().explained&&api.state().done);
 api.next();
 for(let i=2;i<5;i++){api.respond(fractionRight(api.state().p));api.next()}
 assert(api.state().complete);assert(app.innerHTML.includes('Practice Complete'));
 assert(app.innerHTML.includes(api.state().p.skill));
 const stored=progress.readHistory({getItem:key=>memory.get(key)});
 assert.equal(stored.length,api.state().history.length);
 assert.equal(stored.filter(r=>r.skill===p.skill).length,5);
 api.start(topic);change('#length','0');
 for(let i=0;i<6;i++){api.respond(fractionRight(api.state().p));api.next()}
 assert(!api.state().complete);
 change('#difficulty','Adaptive');assert.equal(api.state().p.difficulty,'Easy');
 for(let i=0;i<4;i++){api.respond(fractionRight(api.state().p));api.next()}
 assert.equal(api.state().p.difficulty,'Medium');
 api.respond(fractionRight(api.state().p));api.next();assert.equal(api.state().p.difficulty,'Hard');
 api.respond('-1');api.next();api.respond('-1');api.next();
 assert.equal(api.state().p.difficulty,'Medium');assert.equal(api.state().hints,1);
 api.start('rates');assert.equal(api.state().difficulty,'Hard');assert.equal(api.state().length,0);
 api.start(topic);assert.equal(api.state().difficulty,'Adaptive');assert.equal(api.state().length,0);
}
api.start('progress');
for(const skill of fractions.fractionSkills)assert(app.innerHTML.includes(skill));
console.log('Shared controller verified: Rates quizzes/mistakes and fraction navigation, session controls, hints, explanations, retries, Adaptive levels, summaries, and persistence.');
