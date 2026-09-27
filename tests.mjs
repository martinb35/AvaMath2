import assert from 'node:assert/strict';
import {generate,polygon,checkAnswer,validateProblem,area} from './dist/math.js';
import {diagram} from './dist/diagrams.js';
import {stats,adaptive,readHistory,KEY} from './dist/progress.js';
let count=0;
for(const difficulty of ['Easy','Medium','Hard'])for(const mode of ['triangle','base','missing','grid','polygon','identification','reasoning','multiplication','challenge','mixed'])for(let i=0;i<100;i++){
 const p=generate(mode,difficulty);assert(validateProblem(p));const d=p.diagramData;
 if(d?.kind==='triangle'){const [a,b,c]=d.vertices,dist=(u,v)=>Math.hypot(u[0]-v[0],u[1]-v[1]),sides=[dist(a,b),dist(b,c),dist(c,a)],s=sides.reduce((x,y)=>x+y)/2,heron=Math.sqrt(s*sides.reduce((prod,n)=>prod*(s-n),1));assert(Math.abs(heron-d.b*d.h/2)<1e-5);const expected=d.what==='base'?d.b:d.what==='height'?d.h:heron;assert(Math.abs(expected-(p.numericAnswer??p.correctAnswer))<1e-5);if(d.grid)for(const v of d.vertices)for(const x of v)assert(Math.abs(x-Math.round(x))<1e-6);let svg=diagram(p,3,true);assert(!svg.includes('NaN'));if(d.hide)assert(svg.includes('= ?'));}
 if(p.type==='multiplication')assert.equal(p.partials.reduce((a,b)=>a+b),p.correctAnswer);
 const raw=typeof p.correctAnswer==='number'?String(p.correctAnswer):p.correctAnswer;assert(checkAnswer(p,raw).correct);count++;
}
for(const kind of ['trapezoid','notch','octagon','roof'])for(let i=0;i<100;i++){let p=polygon('Hard',kind),{w,h,c}=p.diagramData;let expected=kind==='octagon'?w*h-2*c*c:kind==='notch'?w*h-c*c:kind==='trapezoid'?(w-c)*h:w*(h-c)+w*c/2;assert.equal(p.correctAnswer,expected);assert.equal(area(p.diagramData.vertices),expected);count++}
let p=generate('triangle','Easy');for(const answer of [String(p.correctAnswer),p.correctAnswer+' '+p.units,p.correctAnswer+' '+p.units.replace('²','^2')])assert(checkAnswer(p,answer).correct);assert(!checkAnswer(p,p.correctAnswer+' '+p.units.replace('²','')).correct);assert(!checkAnswer(p,'').correct);assert(!checkAnswer(p,'1e3').correct);assert(checkAnswer(p,String(p.correctAnswer*2)).message.includes('half'));
let rows=Array.from({length:12},(_,i)=>({skill:'Triangle area',correct:true,hints:0,time:Date.now()+i}));assert.equal(stats(rows).mastery,'Mastered');assert.equal(adaptive(rows,0),1);assert.equal(adaptive([{correct:false},{correct:true},{correct:false}],2),1);let memory=new Map([[KEY,JSON.stringify(rows)]]);assert.equal(readHistory({getItem:k=>memory.get(k)}).length,12);assert.equal(readHistory({getItem:()=>'{broken'}).length,0);assert.equal(stats([{correct:false,hints:2},...rows]).mastery,'Mastered');
console.log(`${count} randomized problems verified, plus validation, misconceptions, adaptive difficulty, mastery, and persistence tests.`);
