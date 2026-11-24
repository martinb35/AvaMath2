import assert from 'node:assert/strict';
import {rateTabs,rateSkills,rateProblem,checkRateAnswer,parseNumber,parseTime,clockText,quizTopics,topicLevel,chooseTopic,freshRateProblem,savedMistakes,questionKey} from './dist/rates.js';
import {generate,checkAnswer,skills} from './dist/math.js';
import {readHistory,KEY,stats} from './dist/progress.js';
import {rateInput,rateRaw,rateLearning,rateVisual,rateControls,editRatio} from './dist/rates-ui.js';
const divisors=n=>Array.from({length:n},(_,i)=>i+1).filter(x=>n/x===Math.floor(n/x));
const independentLCM=(a,b)=>{for(let n=Math.max(a,b);n<=a*b;n++)if(n%a===0&&n%b===0)return n};
const rawFor=p=>p.kind==='ratio'?p.correctAnswer.join(':'):p.kind==='equivalent'?p.correctAnswer.map(n=>n*2).join(':'):p.kind==='list'?p.correctAnswer.join(', '):p.kind==='time'?clockText(p.correctAnswer):p.kind==='number'?String(p.correctAnswer):p.correctAnswer;
let count=0;
const variants={ratio:[undefined],equivalent:['select','generate'],proportion:['price','recipe','distance','points','quantity'],gcf:['number','factors','common'],lcm:['number','list','choice'],cycles:['bells','lights','buses','cycles'],distinguish:['relation','factors','multiples','method']};
for(const [topic] of rateTabs)for(const difficulty of ['Easy','Medium','Hard'])for(const variant of variants[topic.replace('rate-','')])for(let i=0;i<80;i++){
 const p=rateProblem(topic,difficulty,variant),{a,b}=p.data;
 assert(p.hints.length&&p.hints.every(Boolean)&&p.explanation&&p.feedback,p.prompt);
 assert(rateSkills.includes(p.skill)&&skills.includes(p.skill));
 assert(checkAnswer(p,rawFor(p)).correct,JSON.stringify(p));
 assert(checkRateAnswer(p,rawFor(p)).correct);
 assert(!checkRateAnswer(p,'').correct);
 if(p.options)assert.equal(new Set(p.options.map(o=>o.value)).size,p.options.length);
 if(p.kind==='ratio'){
  assert.deepEqual(p.correctAnswer,p.data.reverse?[b,a]:[a,b]);
  assert(p.visual[0].count===a&&p.visual[1].count===b);
  assert(!checkAnswer(p,[p.correctAnswer[1],p.correctAnswer[0]].join(':')).correct);
  assert(checkAnswer(p,p.correctAnswer.join(' : ')).correct);
 }
 if(topic==='rate-equivalent'){
  if(p.kind==='select'){
   const expected=p.options.filter(o=>{const [x,y]=o.value.split(':').map(Number);return x*b===y*a}).map(o=>o.value);
   assert.deepEqual(p.correctAnswer,expected);assert(expected.length>=2&&expected.length<p.options.length);
   assert(!checkAnswer(p,p.options.map(o=>o.value)).correct);
  }else {assert(!checkAnswer(p,`${a}:${b}`).correct);assert(!checkAnswer(p,`${a*2}:${b}`).correct);}
 }
 if(topic==='rate-proportion'){
  const d=p.data;assert(Math.abs(p.correctAnswer-d.amount*d.target/d.source)<1e-9);
  assert(checkAnswer(p,`${p.correctAnswer*100}/100`).correct);
  const additive=d.amount+d.target-d.source;if(Math.abs(additive-p.correctAnswer)>1e-8){const r=checkAnswer(p,String(additive));assert(!r.correct);assert(r.message.includes('scale factor'));}
 }
 if(topic==='rate-gcf'){
  const expected=divisors(a).filter(x=>b%x===0);
  if(p.kind==='common-gcf'){assert.deepEqual(p.correctAnswer.selected,expected);assert.equal(p.correctAnswer.answer,expected.at(-1));assert(!checkAnswer(p,{selected:[...expected,a*b+1],answer:expected.at(-1)}).correct)}
  else if(p.kind==='select')assert.deepEqual(p.correctAnswer,divisors(a));else assert.equal(p.correctAnswer,expected.at(-1));
 }
 if(topic==='rate-lcm'){
  if(p.kind==='list')assert.deepEqual(p.correctAnswer,[a,a*2,a*3,a*4,a*5]);else assert.equal(Number(p.correctAnswer),independentLCM(a,b));
 }
 if(topic==='rate-cycles'){assert.equal(p.data.wait,independentLCM(a,b));assert.equal(p.correctAnswer,(p.data.start+p.data.wait)%1440)}
 if(topic==='rate-distinguish'&&p.data.subject)assert(p.correctAnswer==='factor'?p.data.reference%p.data.subject===0:p.data.subject%p.data.reference===0);
 const input=rateInput(p,{answer:'',selected:[],done:false});assert(!input.includes('undefined'));assert(rateLearning(p,'Learn').includes('open'));
 if(p.kind==='choice'||p.kind==='select'||p.kind==='common-gcf')assert(input.includes('aria-pressed'));
 if(p.kind==='ratio')assert(rateVisual(p).includes('role="img"'));
 count++;
}
for(const invalid of ['','Infinity','NaN','1e3','3/0','2abc','2/3/4'])assert.equal(parseNumber(invalid),null);
assert.equal(parseNumber(' 3 / 2 '),1.5);assert.equal(parseNumber('1.500'),1.5);assert.equal(parseNumber('.5'),.5);
assert.equal(parseTime('12:00 AM'),0);assert.equal(parseTime('12:00 PM'),720);assert.equal(parseTime(' 9 : 24 am '),564);
for(const bad of ['9:60 AM','13:00 PM','0:01 AM','9:24','9:2 AM'])assert.equal(parseTime(bad),null);
for(let n=0;n<1440;n++)assert.equal(parseTime(clockText(n)),n);
const eq=rateProblem('rate-equivalent','Hard','generate');for(const raw of ['0:0','2:-3','2.5:3','2/3','2:3:4'])assert(checkAnswer(eq,raw).invalid);
const selectedProblem=rateProblem('rate-equivalent','Easy','select');
assert(!checkAnswer(selectedProblem,[...selectedProblem.correctAnswer,selectedProblem.correctAnswer[0]]).correct);
const listProblem=rateProblem('rate-lcm','Easy','list');assert(!checkAnswer(listProblem,[...listProblem.correctAnswer,listProblem.correctAnswer[0]].join(',')).correct);
for(let i=0;i<100;i++){
 const plan=quizTopics();assert.equal(plan.length,10);assert.equal(new Set(plan).size,7);assert.equal(plan.filter(t=>t==='rate-proportion').length,3);
}
const topic='rate-ratio',row=(correct,hints=0)=>({topic,skill:rateSkills[0],correct,hints,time:Date.now()});
assert.equal(topicLevel([row(true),row(true)],topic),0);
assert.equal(topicLevel(Array.from({length:3},()=>row(true)),topic),1);
assert.equal(topicLevel(Array.from({length:6},()=>row(true)),topic),2);
assert.equal(topicLevel([...Array.from({length:6},()=>row(true)),row(false),row(false)],topic),1);
assert.equal(topicLevel(Array.from({length:6},()=>row(true,1)),topic),0);
assert.equal(topicLevel(Array.from({length:6},()=>row(true)),'rate-lcm'),0);
for(let i=0;i<35;i++){const chosen=chooseTopic([],i);assert(rateTabs.some(([t])=>t===chosen))}
assert.equal(new Set(Array.from({length:7},(_,i)=>chooseTopic([],i*5+4))).size,7);
// Sweep the weighted selection deterministically so this test cannot be flaky.
const originalRandom=Math.random,weakHistory=Array.from({length:8},()=>({...row(false),topic:'rate-lcm'})),draws=[];
try{for(let i=0;i<1000;i++){Math.random=()=>i/1000;draws.push(chooseTopic(weakHistory,0))}}finally{Math.random=originalRandom}
assert(draws.filter(t=>t==='rate-lcm').length>draws.filter(t=>t==='rate-ratio').length*3);
const recent=[];for(let i=0;i<25;i++){const p=freshRateProblem(topic,'Easy',recent);assert(!recent.includes(questionKey(p)));recent.push(questionKey(p))}
const q=generate(topic,'Easy'),miss={...row(false),question:q};
let history=readHistory({getItem:key=>key===KEY?JSON.stringify([miss]):null});assert.equal(savedMistakes(history).length,1);
assert.equal(stats(history.filter(r=>r.skill===q.skill)).attempted,1);
history.push({...miss,correct:true});assert.equal(savedMistakes(history).length,0);
assert(rateControls('Quiz','rates',history,0).includes('three proportional'));
assert.deepEqual(rateRaw({kind:'common-gcf'},[1,2],'2'),{selected:[1,2],answer:'2'});
let tapped='';for(const key of ['1','2',':','1','8'])tapped=editRatio(tapped,key).value;
assert.equal(tapped,'12:18');
assert.deepEqual(editRatio(tapped,':'),{value:'12:18',cursor:3});
assert.deepEqual(editRatio(tapped,'backspace'),{value:'12:1',cursor:4});
assert.deepEqual(editRatio(tapped,'clear'),{value:'',cursor:0});
assert.deepEqual(editRatio('12:18','9',0,2),{value:'9:18',cursor:1});
assert.deepEqual(editRatio('','backspace'),{value:'',cursor:0});
console.log(`${count} randomized Rates & Ratios questions verified across every variant and difficulty, plus quiz balance, parsing, adaptive learning, deduplication, persistence, and UI rendering.`);
