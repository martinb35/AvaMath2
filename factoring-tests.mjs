import assert from 'node:assert/strict';
import {factoring,factorsOf} from './dist/factoring.js';
import {generate,checkAnswer,skills} from './dist/math.js';
let cases=0;
for(let a=1;a<=144;a++){
 const expected=[];
 for(let d=1;d<=a;d++)if(Number.isInteger(a/d))expected.push(d);
 const p=factoring('factors','Hard',[a,1]);
 assert.deepEqual(p.correctAnswer,expected);
 assert(checkAnswer(p,expected.slice().reverse()).correct);
 assert(checkAnswer(p,[]).invalid);
 if(a>1)assert(!checkAnswer(p,expected.slice(1)).correct);
 assert(!checkAnswer(p,[...expected,a+1]).correct);
 for(let b=1;b<=144;b++){
  const common=expected.filter(d=>Number.isInteger(b/d));
  let x=a,y=b;while(y)[x,y]=[y,x%y];
  const cp=factoring('common','Hard',[a,b]),gp=factoring('gcf','Hard',[a,b]);
  assert.deepEqual(cp.correctAnswer,common);
  assert.equal(gp.correctAnswer,x);
  assert(checkAnswer(cp,common).correct);
  assert(checkAnswer(gp,String(x)).correct);
  assert(!checkAnswer(gp,String(x+1)).correct);
  cases++;
 }
}
assert.deepEqual(factorsOf(144),[1,2,3,4,6,8,9,12,16,18,24,36,48,72,144]);
assert.deepEqual(factorsOf(1),[1]);
assert.deepEqual(factorsOf(139),[1,139]);
const gcfExample=factoring('gcf','Easy',[12,18]);
assert(checkAnswer(gcfExample,'36').message.includes('least common multiple'));
assert(checkAnswer(gcfExample,'5').message.includes('largest factor'));
for(const [difficulty,max] of [['Easy',36],['Medium',84],['Hard',144]])for(const mode of ['factors','common','gcf'])for(let i=0;i<100;i++){
 const p=generate(mode,difficulty);
 assert(p.a>=1&&p.a<=max&&p.b>=1&&p.b<=max);
 assert(skills.includes(p.skill));
 assert(checkAnswer(p,p.correctAnswer).correct);
 assert(p.hints.length&&p.explanation);
}
console.log(`Factoring verified for every number 1–144 and all ${cases} number pairs, plus difficulty ranges and answer validation.`);
