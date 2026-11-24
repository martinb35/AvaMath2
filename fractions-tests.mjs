import assert from 'node:assert/strict';
import {fractionTabs,fractionSkills,fractionProblem,parseFractionAnswer,checkFraction,fractionMarkup,fractionVisual,fractionHelp,fractionInput} from './dist/fractions.js';
import {generate,checkAnswer,skills} from './dist/math.js';

const gcd=(a,b)=>b?gcd(b,a%b):a;
const cases=[
 ['whole-fraction-multiply',[{n:10,d:1},{n:1,d:5}],'2'],
 ['whole-fraction-multiply',[{n:8,d:1},{n:3,d:4}],'6'],
 ['whole-fraction-multiply',[{n:7,d:8},{n:11,d:1}],'9 5/8'],
 ['fraction-multiply',[{n:3,d:4},{n:1,d:2}],'3/8'],
 ['fraction-multiply',[{n:6,d:8},{n:10,d:12}],'5/8'],
 ['fraction-multiply',[{n:3,d:8},{n:10,d:1}],'3 3/4'],
 ['fraction-multiply',[{n:1,d:5},{n:1,d:2},{n:2,d:3}],'1/15'],
 ['fraction-multiply',[{n:2,d:5},{n:5,d:6},{n:3,d:4}],'1/4'],
 ['fraction-multiply',[{n:1,d:10},{n:3,d:10},{n:5,d:9}],'1/60'],
 ['mixed-multiply',[{n:1,d:3},{n:5,d:4}],'5/12'],
 ['mixed-multiply',[{n:5,d:2},{n:3,d:5}],'1 1/2'],
 ['mixed-multiply',[{n:21,d:8},{n:19,d:7}],'7 1/8'],
 ['mixed-multiply',[{n:80,d:9},{n:31,d:10}],'27 5/9'],
 ['mixed-multiply',[{n:48,d:5},{n:71,d:8}],'85 1/5'],
 ['mixed-multiply',[{n:9,d:2},{n:20,d:3}],'30']
];
for(const [mode,operands,answer] of cases){
 const p=fractionProblem(mode,'Hard',operands),expected=parseFractionAnswer(answer);
 assert.deepEqual(p.result,{n:expected.n,d:expected.d});
 assert(checkAnswer(p,answer).correct);
 assert(checkAnswer(p,`${p.result.n}/${p.result.d}`).correct,'Reduced improper answers must be accepted');
 const feedback=checkFraction(p,`${p.result.n*2}/${p.result.d*2}`);
 assert(!feedback.correct&&!feedback.invalid);assert.match(feedback.message,/right value.*simplifying/);
 assert(!checkFraction(p,`${p.result.n+1}/${p.result.d}`).correct);
 if(operands.some(x=>x.n>x.d&&x.d>1)&&mode==='mixed-multiply')assert.match(p.explanation,/Convert mixed numbers to improper/);
 if(p.result.n>p.result.d&&p.result.d>1)assert(p.explanation.includes(answer));
}
assert.match(fractionProblem('whole-fraction-multiply','Easy',[{n:8,d:1},{n:3,d:4}]).explanation,/Standard method:[\s\S]*Divide-first shortcut/);
assert.match(fractionProblem('fraction-multiply','Medium',[{n:7,d:12},{n:6,d:11}]).explanation,/Cancel a common factor of 6/);

for(const [raw,expected] of [['6',{n:6,d:1}],[' 3 / 4 ',{n:3,d:4}],['2 1 / 3',{n:7,d:3}],['-2 1/3',{n:-7,d:3}],['-0 1/3',{n:-1,d:3}],['+7/3',{n:7,d:3}],['0',{n:0,d:1}]]){
 assert.deepEqual(parseFractionAnswer(raw),expected);
}
for(const raw of ['', '1/0','2 1/0','1//2','1.5','2,1/3','2 3/3','2 4/3','1/-2','1/2 extra','1e3','NaN','Infinity','1 2 3/4','9007199254740992','9007199254740991 1/2','1/9007199254740992']){
 assert.equal(parseFractionAnswer(raw),null,raw);
 assert(checkAnswer(fractionProblem('fraction-multiply','Easy'),raw).invalid,raw);
}
const third={result:{n:1,d:3},mode:'fraction-multiply'};
const near=checkFraction(third,'3002399751580330/9007199254740991');
assert(!near.invalid&&!near.correct,'Valid near-equal values must not pass through floating-point rounding');
const largeEquivalent=checkFraction(third,'3002399751580330/9007199254740990');
assert(!largeEquivalent.invalid&&!largeEquivalent.correct);
assert.match(largeEquivalent.message,/right value.*simplifying/);
assert(checkFraction(third,'1/3').correct);

let seed=71423;
const original=Math.random;
Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32};
try{
 for(const [mode] of fractionTabs)for(const difficulty of ['Easy','Medium','Hard']){
  const seen=new Set(),patterns=new Set();
  for(let i=0;i<500;i++){
   const p=generate(mode,difficulty),n=p.operands.reduce((a,x)=>a*x.n,1),d=p.operands.reduce((a,x)=>a*x.d,1),g=gcd(n,d);
   assert.deepEqual(p.result,{n:n/g,d:d/g});
   assert(checkAnswer(p,`${n/g}/${d/g}`).correct);
   assert(skills.includes(p.skill)&&fractionSkills.includes(p.skill));
   assert.equal(p.difficulty,difficulty);assert.equal(p.mode,mode);
   const max=difficulty==='Easy'?8:difficulty==='Medium'?12:16;
   assert(p.operands.every(x=>x.n>0&&x.d>0&&x.d<=max));
   seen.add(JSON.stringify(p.operands));
   patterns.add(p.operands.length===3?'three':p.operands.some(x=>x.d===1)?'whole':'fractions');
   if(mode==='whole-fraction-multiply'){
    assert.equal(p.operands.length,2);assert.equal(p.operands.filter(x=>x.d===1).length,1);
    assert(p.operands.filter(x=>x.d!==1).every(x=>x.n<x.d));
    patterns.add(p.operands[0].d===1?'whole-first':'whole-last');
    patterns.add(p.result.d===1?'whole-result':'mixed-result');
   }else if(mode==='mixed-multiply'){
    const count=p.operands.filter(x=>x.n>x.d).length;
    assert.equal(p.operands.length,2);assert(count>=1);
    if(difficulty==='Easy')assert.equal(count,1);
    if(difficulty==='Hard')assert.equal(count,2);
    assert(p.operands.every(x=>x.d>1&&x.n%x.d!==0&&Math.floor(x.n/x.d)<=(difficulty==='Easy'?3:difficulty==='Medium'?5:9)));
   }
  }
  assert(seen.size>100,`${mode} ${difficulty} should vary problems`);
  if(mode==='whole-fraction-multiply')for(const pattern of ['whole-first','whole-last','whole-result','mixed-result'])assert(patterns.has(pattern));
  if(mode==='fraction-multiply'){assert(patterns.has('whole'));assert(patterns.has('fractions'));assert.equal(patterns.has('three'),difficulty==='Hard');}
 }
}finally{Math.random=original}
assert.match(fractionMarkup('2 1/3'),/fraction-whole">2.*stacked-fraction/);
assert(!fractionMarkup('<img src=x>').includes('<img'));
assert.match(fractionInput('" autofocus',false),/value="&quot; autofocus"/);
assert.match(fractionInput('',true),/disabled/);
assert.match(fractionVisual(fractionProblem('mixed-multiply','Easy',cases[10][1])),/aria-label="2 1\/2 times 3\/5"/);
assert.match(fractionHelp(fractionProblem('mixed-multiply')),/improper fraction/);
console.log('4500 fraction problems verified, plus worksheet products, cancellation, exact parsing, simplification, and vertical rendering.');
