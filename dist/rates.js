import {factorsOf} from './factoring.js';
export const rateTabs=[['ratio','Understanding Ratios'],['equivalent','Equivalent Ratios'],['proportion','Proportional Word Problems'],['gcf','Greatest Common Factor'],['lcm','Least Common Multiple'],['cycles','LCM Word Problems'],['distinguish','Factors vs. Multiples']].map(([id,label])=>['rate-'+id,label]);
export const rateSkills=rateTabs.map(([,label])=>'Rates & Ratios · '+label);
export const isRates=mode=>mode==='rates'||rateTabs.some(([id])=>id===mode);
export const gcd=(a,b)=>b?gcd(b,a%b):a;
export const lcm=(a,b)=>a/gcd(a,b)*b;
const rand=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[rand(0,a.length-1)];
export function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=rand(0,i);[a[i],a[j]]=[a[j],a[i]]}return a}
const round=n=>Math.round(n*1e8)/1e8;
const list=a=>a.join(', ');
const multiples=(n,count=5)=>Array.from({length:count},(_,i)=>n*(i+1));
export const clockText=minutes=>`${Math.floor(minutes/60)%12||12}:${String(minutes%60).padStart(2,'0')} ${minutes%1440<720?'AM':'PM'}`;
export const lessons={
 ratio:['Order matters','A ratio compares two quantities in a stated order. Count each group, then write first:second.','7 stars and 9 squares → stars:squares = 7:9. Reverse the order: squares:stars = 9:7.'],
 equivalent:['Scale both terms together','Multiply or divide BOTH terms by the same positive number. The comparison stays the same.','4:6 ÷ 2 = 2:3. Multiplying 4:6 by 2 gives 8:12. Adding 2 gives 6:8, which is not equivalent.'],
 proportion:['Scale together','Find the scale factor or the amount for one unit. Multiply both related quantities by the same scale.','16 oranges cost $12. For 24 oranges: 24 ÷ 16 = 1.5. Cost = $12 × 1.5 = $18. Adding 8 to the cost would change the rate.'],
 gcf:['Factors divide evenly','List the factors of each number. Keep the shared factors, then choose the largest.','36: 1, 2, 3, 4, 6, 9, 12, 18, 36.\n48: 1, 2, 3, 4, 6, 8, 12, 16, 24, 48.\nShared: 1, 2, 3, 4, 6, 12. GCF = 12. A multiple such as 72 is not a factor of 36.'],
 lcm:['Multiples count forward','Multiply each number by 1, 2, 3, … . Find the smallest positive number in both lists.','6: 6, 12, 18, 24, …\n9: 9, 18, 27, …\nLCM = 18. GCF = 3 answers a different question. Zero is excluded when finding the LCM.'],
 cycles:['When will cycles meet again?','When events start together and repeat, find the LCM of their intervals. Then add that time to the start.','Bells ring every 8 and 12 minutes. LCM(8,12) = 24. Starting together at 9:00 AM, they next ring together at 9:24 AM.'],
 distinguish:['Factors or multiples?','Factors divide into a number. Multiples are products of the number and whole numbers. Use GCF for largest equal groups; use LCM for cycles meeting again.','Factors of 6: 1, 2, 3, 6 (a finite list).\nFirst five positive multiples of 6: 6, 12, 18, 24, 30 (the list keeps going).\n3 is a factor of 6; 18 is a multiple of 6.']
};
export function rateProblem(topic,difficulty='Easy',variant){
 const id=topic.replace('rate-',''),index=rateTabs.findIndex(([key])=>key==='rate-'+id);
 if(index<0)throw Error('Unknown rates topic');
 const level=['Easy','Medium','Hard'].indexOf(difficulty),max=[9,12,18][Math.max(0,level)];
 let a=rand(2,max),b=rand(2,max);if(a===b)b=b===max?2:b+1;
 const p={type:'rates',topic:'rate-'+id,skill:rateSkills[index],difficulty,kind:'number',units:'',hints:[],explanation:'',data:{a,b}};
 const set=(prompt,correctAnswer,hints,explanation,extra={})=>Object.assign(p,{prompt,correctAnswer,hints,explanation,...extra});
 if(id==='ratio'){
  const objects=shuffle([{symbol:'★',name:'stars'},{symbol:'■',name:'squares'},{symbol:'●',name:'circles'},{symbol:'▲',name:'triangles'}]).slice(0,2),reverse=!!rand(0,1),first=reverse?b:a,second=reverse?a:b;
  set(`What is the ratio of ${objects[reverse?1:0].name} to ${objects[reverse?0:1].name}? Write the counts in a:b format.`,[first,second],['Read which object is named first. Its count goes before the colon.','Count each group carefully; do not add the counts.'],`Count ${a} ${objects[0].name} and ${b} ${objects[1].name}.\nThe question names ${objects[reverse?1:0].name} first.\nWrite ${first}:${second}. Order matters.`,{kind:'ratio',visual:[{...objects[0],count:a},{...objects[1],count:b}],data:{a,b,reverse},feedback:'Keep the order in the question. Count the first named group before the colon, then the second group.'});
 }
 if(id==='equivalent'){
  const k=rand(2,4),base=[a*k,b*k],v=variant??pick(['select','generate']);
  p.data={a:base[0],b:base[1]};
  if(v==='generate')set(`Write a different ratio equivalent to ${base[0]}:${base[1]}. Use positive whole numbers in a:b format.`,[...base],['Divide both terms by the same factor, or multiply both by the same number.','Changing only one term changes the comparison.'],`Divide both terms by ${k}: ${base[0]} ÷ ${k} = ${a}; ${base[1]} ÷ ${k} = ${b}.\nOne answer is ${a}:${b}.\nOther different ratios with the same comparison are also correct.`,{kind:'equivalent',feedback:'Scale both terms by the same amount. Adding the same amount or scaling only one term does not keep this ratio.'});
  else {
   const candidates=[[a,b],[base[0]*2,base[1]*2],[a*3,b*3],[base[0]+1,base[1]+1],[base[0]*2,base[1]],[base[1],base[0]]];
   const options=shuffle([...new Map(candidates.map(pair=>[pair.join(':'),pair])).values()]).map(pair=>({value:pair.join(':'),label:pair.join(':')}));
   const correct=options.filter(o=>{const [x,y]=o.value.split(':').map(Number);return x*base[1]===y*base[0]}).map(o=>o.value);
   set(`Select ALL ratios equivalent to ${base[0]}:${base[1]}.`,correct,['Multiply or divide both terms by the same number.','Test each option. The multiplier must match for both terms.'],`Divide ${base[0]}:${base[1]} by ${k} to get ${a}:${b}.\nEquivalent options: ${correct.join(', ')}.\nBoth terms must scale together.`,{kind:'select',options,feedback:'Check every option. Scale both terms together; adding the same amount or changing just one term is not equivalent.'});
  }
 }
 if(id==='proportion'){
  const scenario=variant??pick(['price','recipe','distance','points','quantity']),unit=level===0||['points','quantity'].includes(scenario)?rand(2,5):pick([.5,.75,1.25,1.5,2.5]),source=rand(2,max)*2,target=level===0?source*rand(2,4):source/2*pick([1,3,5]),amount=round(source*unit),result=round(target*unit);
  const stories={price:[`${source} oranges cost $${amount}. At the same price per orange, how much do ${target} oranges cost?`,'dollars'],recipe:[`A recipe uses ${amount} cups of flour for ${source} servings. How many cups are needed for ${target} servings of the same recipe?`,'cups'],distance:[`A cyclist travels ${amount} km in ${source} hours at a constant speed. How many km will they travel in ${target} hours?`,'km'],points:[`A student earns ${amount} points for every ${source} boxes sold. At the same rate, how many points for ${target} boxes?`,'points'],quantity:[`A machine packs ${amount} items in ${source} minutes at a steady rate. How many items does it pack in ${target} minutes?`,'items']};
  set(stories[scenario][0],result,['Find how many times larger or smaller the new quantity is.','Divide the original amount by its quantity to find the amount for one unit. Then multiply.'],`Amount for one unit: ${amount} ÷ ${source} = ${unit}.\nScale factor: ${target} ÷ ${source} = ${target/source}.\nNew amount: ${amount} × ${target/source} = ${result} ${stories[scenario][1]}.`,{units:stories[scenario][1],data:{source,target,amount,unit,scenario},misconceptions:[{value:amount+target-source,message:`Instead of adding ${target-source}, find the scale factor ${target} ÷ ${source}. Multiply the original amount by that same factor.`}],feedback:'The quantities must scale together. Find the amount for one unit, then multiply by the new quantity.'});
 }
 if(id==='gcf'){
  const scale=rand(2,level===0?4:8);a*=scale;b*=scale;p.data={a,b};
  const fa=factorsOf(a),fb=factorsOf(b),shared=fa.filter(n=>b%n===0),v=variant??pick(['number','factors','common']);
  const explanation=`Factors of ${a}: ${list(fa)}.\nFactors of ${b}: ${list(fb)}.\nCommon factors: ${list(shared)}.\nGreatest common factor: ${gcd(a,b)}.`;
  if(v==='factors')set(`Select ALL factors of ${a}.`,fa,['A factor divides evenly into the number.','Find multiplication pairs. Include 1 and the number itself.'],`Factor pairs: ${fa.filter(n=>n*n<=a).map(n=>`${n} × ${a/n}`).join('; ')}.\nAll factors: ${list(fa)}.`,{kind:'select',options:Array.from({length:a},(_,i)=>({value:i+1,label:String(i+1)})),feedback:'Factors divide into the number with no remainder. Multiples are products and can be larger than the number.'});
  else set(v==='common'?`Select all common factors of ${a} and ${b}, THEN enter their greatest common factor.`:`Find the GCF of ${a} and ${b}.`,v==='common'?{selected:shared,answer:gcd(a,b)}:gcd(a,b),['List the factors of each number, not their multiples.','Keep only factors that divide evenly into BOTH numbers. Choose the greatest.'],explanation,{kind:v==='common'?'common-gcf':'number',options:shuffle([...new Set([...fa,...fb,lcm(a,b)])]).map(n=>({value:n,label:String(n)})),misconceptions:[{value:lcm(a,b),message:`${lcm(a,b)} is a multiple of both numbers. We need a factor that divides evenly into both ${a} and ${b}.`}],feedback:'A common factor must divide evenly into both numbers. Choose the largest shared factor, not a common multiple.'});
 }
 if(id==='lcm'){
  const v=variant??pick(['number','list','choice']);p.data={a,b};const answer=lcm(a,b),explanation=`Multiples of ${a}: ${list(multiples(a,answer/a))}.\nMultiples of ${b}: ${list(multiples(b,answer/b))}.\nFirst shared positive multiple: ${answer}. GCF = ${gcd(a,b)} is a different question.`;
  if(v==='list')set(`List the first FIVE positive multiples of ${a}, separated by commas.`,multiples(a),['Multiply the number by 1, 2, 3, 4, and 5.','Start with the number itself; do not list its factors or zero.'],`${a} × 1, 2, 3, 4, 5 gives ${list(multiples(a))}.`,{kind:'list',feedback:'Multiples are products: count forward by the number. List exactly five positive multiples.'});
  else set(`Find the LCM of ${a} and ${b}: the first common positive multiple.`,v==='choice'?String(answer):answer,['Write positive multiples of each number in order.','Look for the first number in BOTH lists, not the greatest number.'],explanation,{kind:v==='choice'?'choice':'number',options:shuffle([...new Set([answer,gcd(a,b),a*b,answer+a,answer+b])]).map(n=>({value:String(n),label:String(n)})),misconceptions:[{value:gcd(a,b),message:'That is the GCF. We need the first shared positive multiple, not a common factor.'}],feedback:'List multiples in increasing order and find the first shared number. The largest listed number is not necessarily the LCM.'});
 }
 if(id==='cycles'){
  const v=variant??pick(['bells','lights','buses','cycles']),start=pick([8*60,9*60,11*60+50,13*60+30]),wait=lcm(a,b),end=(start+wait)%1440;
  const stories={bells:`Two bells ring every ${a} and ${b} minutes.`,lights:`Two lights flash every ${a} and ${b} minutes.`,buses:`Two shuttle buses depart every ${a} and ${b} minutes.`,cycles:`Two sprinklers start a watering cycle every ${a} and ${b} minutes.`};
  set(`${stories[v]} They happen together at ${clockText(start)}. At what time will they next happen together? Include AM or PM.`,end,['Find the LCM of the two intervals to get the waiting time.','Add the waiting time to the start time. Remember 60 minutes make one hour.'],`Find LCM(${a}, ${b}) = ${wait} minutes.\nStart: ${clockText(start)}.\nAdd ${wait} minutes → ${clockText(end)}.`,{kind:'time',data:{a,b,start,wait,scenario:v},feedback:'Find the first common positive multiple of the intervals, then add that many minutes to the starting clock time.'});
 }
 if(id==='distinguish'){
  const v=variant??pick(['relation','factors','multiples','method']);
  if(v==='relation'){
   const factor=!!rand(0,1),k=rand(2,5),subject=factor?a:a*k,reference=factor?a*k:a;
   set(`Is ${subject} a factor or a multiple of ${reference}?`,factor?'factor':'multiple',['A factor divides into the other number. A multiple is a product of the other number.','Check which number can be divided by the other with no remainder.'],`${a} × ${k} = ${a*k}.\n${a} is a factor of ${a*k}; ${a*k} is a multiple of ${a}.\nSo ${subject} is a ${factor?'factor':'multiple'} of ${reference}.`,{kind:'choice',options:[{value:'factor',label:'Factor'},{value:'multiple',label:'Multiple'}],data:{a,k,subject,reference},feedback:'Read the direction carefully. Factors divide into a number; multiples are made by multiplying that number.'});
  }else if(v==='method'){
   const grouping=!!rand(0,1);
   set(grouping?`You have ${a*3} red beads and ${b*3} blue beads. Make the greatest number of identical bags, using all beads. Which method finds the number of bags?`:`Two signals repeat every ${a} and ${b} seconds. Which method finds when they next happen together?`,grouping?'gcf':'lcm',['Largest equal groups need a common divisor. Repeating events need a common multiple.'],grouping?'Each bag count must divide both totals evenly. The greatest such count is the GCF.':'The next shared event is the first shared positive multiple of the intervals. Use LCM.',{kind:'choice',options:[{value:'gcf',label:'GCF'},{value:'lcm',label:'LCM'}],feedback:'Use GCF for the greatest number of equal groups using everything. Use LCM for repeating cycles meeting again.'});
  }else{
   const factor=v==='factors',answer=factor?factorsOf(a):multiples(a);
   set(factor?`List ALL factors of ${a}, separated by commas.`:`List the first FIVE positive multiples of ${a}, separated by commas.`,answer,[factor?'Find every pair that multiplies to the number.':'Multiply the number by 1 through 5.'],factor?`Factors divide evenly into ${a}: ${list(answer)}.`:`Multiples come from multiplication: ${list(answer)}.`,{kind:'list',feedback:factor?'Factors divide into the number. Include 1 and the number itself, but do not continue to larger multiples.':'Multiples are products, not divisors. Count forward by the number, starting at the number itself.'});
  }
 }
 return p;
}
const sameSet=(a,b)=>Array.isArray(a)&&a.length===b.length&&b.every(n=>a.includes(n));
export function parseNumber(raw){
 const s=String(raw??'').trim();
 if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:\s*\/\s*[+-]?(?:\d+(?:\.\d*)?|\.\d+))?$/.test(s))return null;
 const [a,b=1]=s.split('/').map(Number),n=a/b;return Number.isFinite(n)?n:null;
}
export function parseTime(raw){
 const m=String(raw).trim().match(/^(\d{1,2})\s*:\s*(\d{2})\s*([ap])\.?m\.?$/i);
 if(!m||+m[1]<1||+m[1]>12||+m[2]>59)return null;
 return (+m[1]%12)*60 + +m[2]+(m[3].toLowerCase()==='p'?720:0);
}
export function checkRateAnswer(p,raw){
 let correct=false,n=null;
 const invalid=message=>({correct:false,invalid:true,message});
 if(p.kind==='ratio'||p.kind==='equivalent'){
  const m=String(raw).trim().match(/^(\d+)\s*:\s*(\d+)$/);
  if(!m||+m[1]===0||+m[2]===0||!Number.isSafeInteger(+m[1])||!Number.isSafeInteger(+m[2]))return invalid('Use two positive whole numbers with a colon, such as 2 : 3.');
  const a=+m[1],b=+m[2],[x,y]=p.correctAnswer;
  correct=p.kind==='ratio'?a===x&&b===y:BigInt(a)*BigInt(y)===BigInt(b)*BigInt(x)&&(a!==x||b!==y);
  if(p.kind==='equivalent'&&a===x&&b===y)return {correct:false,message:'That is the original ratio. Multiply or divide both terms to make a different equivalent ratio.'};
 }else if(p.kind==='select'){
  if(!Array.isArray(raw)||!raw.length)return invalid('Select at least one option, then check your answer.');
  correct=sameSet(raw,p.correctAnswer);
 }else if(p.kind==='common-gcf'){
  if(!Array.isArray(raw?.selected)||!raw.selected.length)return invalid('Select the common factors first, then enter the greatest one.');
  n=parseNumber(raw.answer);if(n===null)return invalid('Enter a numerical GCF after selecting the common factors.');
  correct=sameSet(raw.selected,p.correctAnswer.selected)&&n===p.correctAnswer.answer;
 }else if(p.kind==='choice'){
  if(!p.options.some(o=>o.value===raw))return invalid('Choose an option first.');correct=raw===p.correctAnswer;n=parseNumber(raw);
 }else if(p.kind==='list'){
  const s=String(raw).trim();if(!/^\d+(?:\s*[,;\s]\s*\d+)*$/.test(s))return invalid('Enter whole numbers separated by commas, such as 2, 4, 6.');
  const nums=s.split(/[,;\s]+/).map(Number);correct=sameSet(nums,p.correctAnswer);
 }else if(p.kind==='time'){
  n=parseTime(raw);if(n===null)return invalid('Enter a clock time with AM or PM, such as 9:24 AM.');correct=n===p.correctAnswer;
 }else{
  n=parseNumber(raw);if(n===null)return invalid('Enter a number, decimal, or fraction, such as 12, 1.5, or 3/2.');correct=Math.abs(n-p.correctAnswer)<1e-8;
 }
 return {correct,message:correct?'You kept the relationship in mind. Well done!':p.misconceptions?.find(m=>n!==null&&Math.abs(m.value-n)<1e-8)?.message||p.feedback};
}
export function quizTopics(){return shuffle([...rateTabs.map(([id])=>id),'rate-proportion','rate-proportion','rate-equivalent'])}
export function topicLevel(history,topic){
 const rows=history.filter(r=>r.topic===topic).slice(-12);let level=0,streak=0,misses=0;
 for(const row of rows){if(row.correct&&!row.hints){streak++;misses=0;if(streak===3){level=Math.min(2,level+1);streak=0}}else{streak=0;misses++;if(misses===2){level=Math.max(0,level-1);misses=0}}}return level;
}
export function chooseTopic(history,step=0){
 // Regular revisits include mastered topics; other draws favor recent mistakes.
 if(step%5===4)return rateTabs[Math.floor(step/5)%rateTabs.length][0];
 const weighted=rateTabs.flatMap(([topic])=>{const rows=history.filter(r=>r.topic===topic).slice(-8),wrong=rows.filter(r=>!r.correct).length;return Array(2+wrong*2+(rows.length?0:2)).fill(topic)});
 return pick(weighted);
}
export const questionKey=p=>JSON.stringify([p.topic,p.prompt,p.visual||null]);
export function freshRateProblem(topic,difficulty,recent=[],variant){
 let p;for(let i=0;i<80;i++){p=rateProblem(topic,difficulty,variant);if(!recent.includes(questionKey(p)))return p}return p;
}
export function savedMistakes(history){
 const latest=new Map();for(const row of history)if(row.topic&&row.question?.type==='rates')latest.set(questionKey(row.question),row);
 return [...latest.values()].filter(r=>!r.correct).map(r=>r.question);
}
