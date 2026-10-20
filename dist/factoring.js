export const factorSkills=['All factors','Common factors','Greatest common factor'];
export const factorTabs=[['factors','All Factors'],['common','Common Factors'],['gcf','Greatest Common Factor']];
export const isFactoring=mode=>factorTabs.some(([id])=>id===mode);
export const factorsOf=n=>Array.from({length:n},(_,i)=>i+1).filter(d=>n%d===0);
export function factoring(type,difficulty,numbers){
 const max=difficulty==='Easy'?36:difficulty==='Medium'?84:144;
 const rand=()=>1+Math.floor(Math.random()*max);
 const a=numbers?.[0]??rand(),b=numbers?.[1]??rand(),fa=factorsOf(a),fb=factorsOf(b),common=fa.filter(n=>b%n===0),gcf=common.at(-1),single=type==='factors';
 const pairs=fa.filter(n=>n*n<=a).map(n=>`${n} × ${a/n} = ${a}`).join('\n');
 return {type,difficulty,a,b,misconceptionChecks:type==='gcf'?[{value:a*b/gcf,message:'That is the least common multiple. Find the largest factor shared by both numbers.'}]:[],skill:factorSkills[single?0:type==='common'?1:2],units:'',choicesMax:single?a:Math.min(a,b),
 prompt:single?`Find all the positive factors of ${a}.`:type==='common'?`Find all the common factors of ${a} and ${b}.`:`What is the greatest common factor (GCF) of ${a} and ${b}?`,
 correctAnswer:single?fa:type==='common'?common:gcf,
 hints:single?['A factor divides a number evenly, with no remainder.',`Start with 1 × ${a}. Find the other multiplication pairs.`,`Test whole numbers up to ${Math.floor(Math.sqrt(a))}. Each partner is also a factor.`]:['List the factors of each number first.',`Factors of ${a}: ${fa.join(', ')}. Now find the factors of ${b}.`,type==='common'?'Select every number that appears in both lists.':'Find the largest number that appears in both factor lists.'],
 explanation:single?`Factor pairs:\n${pairs}\nAll factors of ${a}: ${fa.join(', ')}. Each factor is listed once.`:`Factors of ${a}: ${fa.join(', ')}.\nFactors of ${b}: ${fb.join(', ')}.\nCommon factors: ${common.join(', ')}.\nThe greatest common factor is ${gcf}.`};
}
export function checkFactors(p,raw){
 if(!Array.isArray(raw)||!raw.length)return {correct:false,invalid:true,message:'Tap each factor, then check your selection.'};
 const values=[...new Set(raw)];
 return {correct:values.length===p.correctAnswer.length&&values.every(n=>p.correctAnswer.includes(n)),message:values.some(n=>!p.correctAnswer.includes(n))?'One of your selections does not divide evenly. Check for a remainder.':'You have some factors. Look for missing factor pairs.'};
}
export function factoringHelp(){return `<details class="factoring-help"><summary>Learn how · Factors, common factors &amp; GCF</summary><p>A <strong>factor</strong> is a positive whole number that divides evenly into a number. For 12, find the pairs: 1 × 12, 2 × 6, and 3 × 4. Its factors are <strong>1, 2, 3, 4, 6, 12</strong>.</p><p>Factors of 18 are 1, 2, 3, 6, 9, 18. The <strong>common factors</strong> of 12 and 18 are <strong>1, 2, 3, 6</strong>. The largest, <strong>6</strong>, is their <strong>greatest common factor (GCF)</strong>.</p><p>Test pairs up to the square root. For 144, check through 12; list 12 only once for 12 × 12. The number 1 has just one factor: 1. Numbers with only 1 in common have a GCF of 1.</p><p>Easy: 1–36 · Medium: 1–84 · Hard: 1–144. Adaptive adjusts as you practice.</p></details>`}
