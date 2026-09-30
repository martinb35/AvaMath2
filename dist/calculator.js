// Immediate-execution arithmetic, like a basic desk calculator. No eval.
export function createCalculator() {
  let display = '0', stored = null, operator = null, fresh = true;
  const value = () => display;
  const reset = () => { display = '0'; stored = null; operator = null; fresh = true; };
  function calculate() {
    const b = Number(display);
    const result = operator === '+' ? stored + b : operator === '-' ? stored - b : operator === '*' ? stored * b : b === 0 ? NaN : stored / b;
    display = Number.isFinite(result) ? String(Number(result.toPrecision(12))) : 'Error';
    stored = null; operator = null; fresh = true;
  }
  function press(key) {
    if (key === 'clear') { reset(); return value(); }
    if (display === 'Error') reset();
    if (/^\d$/.test(key)) {
      if (fresh || display === '0') display = key;
      else if (display.replace(/[-.]/g, '').length < 12) display += key;
      fresh = false;
    } else if (key === '.') {
      if (fresh) display = '0';
      if (!display.includes('.')) display += '.';
      fresh = false;
    } else if (key === 'sign') {
      if (Number(display) !== 0) display = display.startsWith('-') ? display.slice(1) : '-' + display;
    } else if (key === 'back') {
      if (!fresh) display = display.length > 1 ? display.slice(0, -1) : '0';
      if (display === '-') display = '0';
    } else if (['+', '-', '*', '/'].includes(key)) {
      if (operator && !fresh) calculate();
      if (display !== 'Error') { stored = Number(display); operator = key; fresh = true; }
    } else if (key === '=' && operator && !fresh) calculate();
    return value();
  }
  return {press, value, pending: () => operator ? `${stored} ${{'+':'+','-':'−','*':'×','/':'÷'}[operator]}` : ''};
}

export function mountCalculator(onUse) {
  const calc = createCalculator();
  const panel = document.createElement('section');
  panel.tabIndex = -1; panel.id = 'calculator'; panel.className = 'calculator'; panel.hidden = true;
  panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Calculator');
  const keys = [['clear','AC','Clear'],['sign','±','Change sign'],['back','⌫','Delete last digit'],['/','÷','Divide'],['7','7'],['8','8'],['9','9'],['*','×','Multiply'],['4','4'],['5','5'],['6','6'],['-','−','Subtract'],['1','1'],['2','2'],['3','3'],['+','+','Add'],['0','0'],['.','.','Decimal point'],['=','=','Equals']];
  panel.innerHTML = `<div class="calculator-heading"><h2>Calculator</h2><button type="button" id="calc-side" aria-label="Move calculator to left side">⇆</button><button type="button" id="calc-close" aria-label="Close calculator">×</button></div><div class="calculator-screen"><div id="calc-pending" aria-hidden="true"></div><output id="calc-display" aria-live="polite" aria-atomic="true">0</output></div><div class="calculator-keys">${keys.map(([key,label,name]) => `<button type="button" data-calc="${key}" aria-label="${name || label}" class="${key === '=' ? 'primary equals' : ['+','-','*','/'].includes(key) ? 'operator' : ''}">${label}</button>`).join('')}</div><button type="button" id="calc-use">Use answer</button><p class="calculator-note">Works one operation at a time.</p>`;
  document.body.append(panel);
  const update = () => {
    panel.querySelector('#calc-display').textContent = calc.value();
    panel.querySelector('#calc-pending').textContent = calc.pending();
    panel.querySelector('#calc-use').disabled = calc.value() === 'Error' || !document.querySelector('#answer:not(:disabled)');
    document.querySelector('#calculator-toggle')?.setAttribute('aria-expanded', String(!panel.hidden));
  };
  const close = () => { panel.hidden = true; update(); document.querySelector('#calculator-toggle')?.focus({preventScroll:true}); };
  panel.querySelector('#calc-close').onclick = close;
  panel.querySelector('#calc-side').onclick = e => {
    const left = panel.classList.toggle('on-left');
    e.currentTarget.setAttribute('aria-label', `Move calculator to ${left ? 'right' : 'left'} side`);
  };
  panel.querySelectorAll('[data-calc]').forEach(button => button.onclick = () => { calc.press(button.dataset.calc); update(); });
  panel.querySelector('#calc-use').onclick = () => { if (calc.value() !== 'Error') { onUse(calc.value()); close(); } };
  panel.addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const key = e.key === 'Enter' && e.target.matches('button:not([data-calc])') ? null : ({Enter:'=',Backspace:'back',Delete:'clear',Escape:'close'}[e.key] || (/^[\d.+*/=\-]$/.test(e.key) ? e.key : null));
    if (!key) return;
    e.preventDefault(); if (key === 'close') close(); else { calc.press(key); update(); }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) close(); });
  return {update, toggle() { if (!panel.hidden) close(); else { panel.hidden = false; update(); panel.focus({preventScroll:true}); } }};
}
