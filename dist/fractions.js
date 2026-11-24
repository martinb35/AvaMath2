export const fractionTabs=[['whole-fraction-multiply','Multiply Fractions and Whole Numbers'],['fraction-multiply','Multiply Fractions'],['mixed-multiply','Multiply Mixed Numbers']];
export const fractionSkills=['Multiply fractions and whole numbers','Multiply fractions','Multiply mixed numbers'];
export const isFractions=mode=>fractionTabs.some(([id])=>id===mode);

const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
const reduce=(n,d)=>{const g=gcd(n,d);return {n:n/g,d:d/g}};
const rand=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const text=({n,d})=>d===1?String(n):n>d?`${Math.floor(n/d)}${n%d?` ${n%d}/${d}`:''}`:`${n}/${d}`;
const improperText=({n,d})=>d===1?String(n):`${n}/${d}`;
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function fractionProblem(mode,difficulty='Easy',values){
 if(!isFractions(mode)||!['Easy','Medium','Hard'].includes(difficulty))throw Error('Unknown fraction topic or difficulty');
 const index=fractionTabs.findIndex(([id])=>id===mode),max=difficulty==='Easy'?8:difficulty==='Medium'?12:16;
 const proper=()=>{const d=rand(2,max);return {n:rand(1,d-1),d}};
 const mixed=()=>{const f=proper();return {n:rand(1,difficulty==='Easy'?3:difficulty==='Medium'?5:9)*f.d+f.n,d:f.d}};
 let operands;
 if(values)operands=values.length===4&&values.every(x=>typeof x==='number')?[{n:values[0],d:values[3]},{n:values[2],d:values[1]}]:values.map(x=>({...x}));
 else if(index===0){
  const f=proper(),whole={n:difficulty==='Easy'&&Math.random()<.65?f.d*rand(1,3):rand(2,difficulty==='Hard'?36:24),d:1};
  operands=Math.random()<.5?[whole,f]:[f,whole];
 }else if(index===1){
  operands=[proper(),proper()];
  if(difficulty==='Hard'&&Math.random()<.55)operands.push(proper());
  else if(Math.random()<(difficulty==='Easy'?.1:.25))operands[rand(0,1)]={n:rand(3,16),d:1};
 }else{
  operands=[mixed(),difficulty==='Hard'||difficulty==='Medium'&&Math.random()<.6?mixed():proper()];
  if(Math.random()<.5)operands.reverse();
 }
 if(![2,3].includes(operands.length)||operands.some(x=>!Number.isSafeInteger(x.n)||!Number.isSafeInteger(x.d)||x.n<=0||x.d<=0))throw Error('Invalid fraction operands');
 const numerator=operands.reduce((n,x)=>n*x.n,1),denominator=operands.reduce((d,x)=>d*x.d,1);
 if(!Number.isSafeInteger(numerator)||!Number.isSafeInteger(denominator))throw Error('Fraction product is too large');
 const result=reduce(numerator,denominator),working=operands.map(x=>({...x})),cancellations=[];
 for(let i=0;i<working.length;i++)for(let j=0;j<working.length;j++){
  if(i===j)continue;
  const g=gcd(working[i].n,working[j].d);
  if(g>1){cancellations.push(`Cancel a common factor of ${g}: ${working[i].n} and ${working[j].d} become ${working[i].n/g} and ${working[j].d/g}.`);working[i].n/=g;working[j].d/=g;}
 }
 const lines=[];
 if(index===2){
  lines.push('Convert mixed numbers to improper fractions:');
  for(const x of operands.filter(x=>x.d>1&&x.n>x.d))lines.push(`${Math.floor(x.n/x.d)} x ${x.d} + ${x.n%x.d} = ${x.n}. Keep denominator ${x.d}: ${text(x)} = ${improperText(x)}.`);
 }
 if(index===0){
  const whole=operands.find(x=>x.d===1),f=operands.find(x=>x.d!==1);
  if(whole&&f){lines.push(`Standard method: ${whole.n} x ${f.n} = ${whole.n*f.n}. Keep denominator ${f.d}: ${whole.n*f.n}/${f.d}.`);
   if(whole.n%f.d===0)lines.push(`Divide-first shortcut: (${whole.n} / ${f.d}) x ${f.n} = ${whole.n/f.d} x ${f.n} = ${result.n/result.d}.`);}
 }
 lines.push(`Multiply numerators: ${operands.map(x=>x.n).join(' x ')} = ${numerator}.`,`Multiply denominators: ${operands.map(x=>x.d).join(' x ')} = ${denominator}.`);
 lines.push(...(cancellations.length?['You can also cancel common factors BEFORE multiplying:',...cancellations,`After cancellation: ${working.map(improperText).join(' x ')}.`]:['No cross-cancellation is needed.']));
 const g=gcd(numerator,denominator);
 lines.push(g>1?`Simplify ${numerator}/${denominator}: divide numerator and denominator by ${g} to get ${improperText(result)}.`:`${improperText(result)} is already in simplest form.`);
 if(result.n>result.d&&result.d>1)lines.push(`${result.n} / ${result.d} = ${Math.floor(result.n/result.d)} remainder ${result.n%result.d}. So ${improperText(result)} = ${text(result)}.`);
 lines.push(`Answer: ${text(result)}.`);
 return {type:'fraction',mode,difficulty,skill:fractionSkills[index],operands,result,correctAnswer:result.n/result.d,units:'',
  prompt:'Multiply. Write your answer in simplest form.',
  hints:[index===2?'Convert each mixed number: whole number x denominator + numerator. Keep the denominator.':index===0?'Multiply the whole number by the numerator; keep the denominator. Divide first if the denominator divides the whole number evenly.':'Multiply all numerators and all denominators. A whole number has denominator 1.',
   'Cancel common factors between a numerator and a denominator before multiplying, or reduce the product afterward.',
   `The unreduced product is ${numerator}/${denominator}. ${g>1?`Divide both by ${g}.`:'It is already reduced.'} Convert to a mixed number if helpful.`],
  explanation:lines.join('\n')};
}

export function parseFractionAnswer(raw){
 const s=String(raw).trim();
 let m=s.match(/^([+-]?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/),n,d;
 if(m){d=BigInt(m[4]);const part=BigInt(m[3]);if(d===0n||part>=d)return null;n=(BigInt(m[2])*d+part)*(m[1]==='-'?-1n:1n);}
 else if((m=s.match(/^([+-]?\d+)\s*\/\s*(\d+)$/))){n=BigInt(m[1]);d=BigInt(m[2]);}
 else if((m=s.match(/^[+-]?\d+$/))){n=BigInt(m[0]);d=1n;}
 else return null;
 if(d===0n||d>BigInt(Number.MAX_SAFE_INTEGER)||n>BigInt(Number.MAX_SAFE_INTEGER)||n< -BigInt(Number.MAX_SAFE_INTEGER))return null;
 return {n:Number(n),d:Number(d)};
}

export function checkFraction(p,raw){
 const value=parseFractionAnswer(raw);
 if(!value)return {correct:false,invalid:true,message:'Enter a whole number (6), fraction (3/4), or mixed number (2 1/3). Use a nonzero positive denominator and whole-number parts within the safe integer range.'};
 if(BigInt(value.n)*BigInt(p.result.d)!==BigInt(p.result.n)*BigInt(value.d))return {correct:false,message:p.mode==='mixed-multiply'?'Not quite. Convert mixed numbers to improper fractions, multiply, then simplify.':'Not quite. Multiply the numerators and denominators, then simplify.'};
 if(gcd(value.n,value.d)!==1)return {correct:false,message:`That has the right value, but still needs simplifying. Divide the numerator and denominator by ${gcd(value.n,value.d)}. Try again.`};
 return {correct:true,message:'Correct! Your answer is in simplest form.'};
}

export function fractionMarkup(value){
 return escape(value).replace(/(?:(\d+) )?(\d+)\/(\d+)/g,(_,whole,n,d)=>`<span class="fraction-number">${whole?`<span class="fraction-whole">${whole}</span>`:''}<span class="stacked-fraction" aria-label="${n} over ${d}"><span>${n}</span><span>${d}</span></span></span>`);
}
export const fractionVisual=p=>`<div class="fraction-product" role="img" aria-label="${escape(p.operands.map(text).join(' times '))}">${p.operands.map(x=>fractionMarkup(text(x))).join('<span class="fraction-times" aria-hidden="true">&times;</span>')}</div>`;
export const fractionHelp=p=>`<details class="fraction-help"><summary>Learn the method</summary><p>${p.mode==='whole-fraction-multiply'?'Multiply the whole number by the numerator and keep the denominator. If the denominator divides the whole number evenly, divide first.':p.mode==='mixed-multiply'?'Convert each mixed number to an improper fraction: whole x denominator + numerator. Multiply, simplify, and convert the result to a mixed number.':'Multiply numerators together and denominators together. Cancel common factors across the fraction bars before multiplying, then simplify fully.'}</p><p>${fractionMarkup(p.mode==='whole-fraction-multiply'?'8 x 3/4 = (8 / 4) x 3 = 6':p.mode==='mixed-multiply'?'2 1/2 x 3/5 = 5/2 x 3/5 = 3/2 = 1 1/2':'2/5 x 5/6 = 1/1 x 1/3 = 1/3')}</p></details>`;
export const fractionInput=(answer,done)=>`<label for="answer">Your answer</label><p id="fraction-format" class="tiny muted">Enter a whole number (6), fraction (3/4), or mixed number (2 1/3). Simplify fully. Reduced improper fractions are accepted.</p><div class="answerrow"><div class="inputwrap"><input id="answer" type="text" inputmode="text" autocomplete="off" enterkeyhint="done" aria-describedby="fraction-format" placeholder="e.g. 2 1/3" value="${escape(answer)}" ${done?'disabled':''}></div><button class="primary" ${done?'disabled':''}>Check answer</button></div>`;
