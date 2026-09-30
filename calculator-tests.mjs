import assert from 'node:assert/strict';
import {createCalculator} from './dist/calculator.js';
const cases = [
  [['1','6','*','1','0','/','2','='],'80'],
  [['0','.','1','+','0','.','2','='],'0.3'],
  [['9','-','1','2','='],'-3'],
  [['8','/','0','='],'Error'],
  [['8','/','0','=','7'],'7'],
  [['5','+','*','2','='],'10'],
  [['5','+','2','=','3'],'3'],
  [['5','+','2','=','*','3','='],'21'],
  [['1','2','back','3'],'13'],
  [['1','sign','back'],'0'],
  [['4','sign','*','2','='],'-8'],
  [['.','5','.','2'],'0.52'],
  [['9','+','clear','2','='],'2'],
  [['1','/','3','='],'0.333333333333'],
];
for (const [keys,expected] of cases) {
  const calc=createCalculator();
  keys.forEach(key=>calc.press(key));
  assert.equal(calc.value(),expected,keys.join(' '));
}
console.log(`${cases.length} calculator arithmetic and recovery cases passed.`);
