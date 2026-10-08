// Точки под каруселями на телефоне: какая карточка сейчас в центре
document.querySelectorAll('.row, .strip').forEach(list => {
  const items = [...list.children];
  const dots = document.createElement('div');
  dots.className = 'dots';
  dots.setAttribute('aria-hidden', 'true');
  items.forEach(() => dots.append(document.createElement('i')));
  list.after(dots);
  const mark = i => [...dots.children].forEach((d, k) => d.classList.toggle('on', k === i));
  mark(0);
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.intersectionRatio >= .75) mark(items.indexOf(e.target));
  }), { root: list, threshold: .75 });
  items.forEach(it => io.observe(it));
});

// Мини-игра на шкале: замах длится 0.6 с, парирование в последние 0.2 с, как в игре
(() => {
  const box = document.querySelector('.meter');
  const cursor = box.querySelector('.cursor');
  const flash = box.querySelector('.flash');
  const say = box.querySelector('.say');
  const live = box.parentElement.querySelector('[aria-live]');
  const WIND = 600, WINDOW = 200, GRACE = 60;
  // Надписи в покое берём со страницы, остальные выбираем по языку страницы
  const idleWord = flash.textContent, idleSay = say.textContent;
  const STRINGS = {
    en: { parry: 'PARRY', block: 'BLOCK', hit: 'HIT', good: 'Good. Again.', row: n => n + ' in a row. Again.',
          early: 'Too early. Wait for the strike.', late: 'Too late. Again.', watch: 'Watch the marker.', wait: 'Wait for the strike.',
          saidParry: 'Parry!', saidBlock: 'Blocked, too early for a parry.', saidHit: 'Hit, too late.' },
    ru: { parry: 'ОТБИЛ', block: 'БЛОК', hit: 'УДАР', good: 'Хорошо. Ещё.', row: n => n + ' подряд. Ещё.',
          early: 'Рано. Жди удара.', late: 'Поздно. Ещё раз.', watch: 'Следи за меткой.', wait: 'Жди удара.',
          saidParry: 'Парирование!', saidBlock: 'Блок, для парирования рано.', saidHit: 'Пропущен удар, поздно.' },
  };
  const L = STRINGS[document.documentElement.lang] || STRINGS.en;
  let state = 'idle', start = 0, raf = 0, timer = 0, streak = 0, idleHits = 0;

  const show = (kind, word, line, spoken) => {
    flash.className = 'flash show ' + kind;
    flash.textContent = word;
    say.textContent = line;
    live.textContent = spoken;
  };

  const next = () => {
    state = 'wait';
    box.classList.remove('open');
    flash.className = 'flash';
    cursor.style.left = '0%';
    timer = setTimeout(strike, 500 + Math.random() * 1000);
  };

  const strike = () => {
    state = 'sweep';
    start = performance.now();
    raf = requestAnimationFrame(tick);
  };

  const tick = now => {
    const t = now - start;
    cursor.style.left = Math.min(t / WIND, 1) * 100 + '%';
    box.classList.toggle('open', t >= WIND - WINDOW);
    if (t > WIND + GRACE) return finish('hit');
    raf = requestAnimationFrame(tick);
  };

  const finish = kind => {
    cancelAnimationFrame(raf);
    state = 'result';
    if (kind === 'parry') {
      streak++; idleHits = 0;
      show('parry', L.parry, streak > 1 ? L.row(streak) : L.good, L.saidParry);
    } else if (kind === 'block') {
      streak = 0; idleHits = 0;
      show('block', L.block, L.early, L.saidBlock);
    } else {
      streak = 0;
      show('hit', L.hit, L.late, L.saidHit);
      if (++idleHits >= 3) return (timer = setTimeout(stop, 1200));
    }
    timer = setTimeout(next, 1200);
  };

  const begin = () => {
    state = 'wait';
    streak = 0; idleHits = 0;
    box.classList.add('live');
    say.textContent = L.watch;
    next();
  };

  const stop = () => {
    clearTimeout(timer);
    cancelAnimationFrame(raf);
    state = 'idle';
    box.classList.remove('live', 'open');
    flash.className = 'flash';
    flash.textContent = idleWord;
    say.textContent = idleSay;
    cursor.style.left = '';
  };

  const press = () => {
    if (state === 'wait') say.textContent = L.wait;
    else if (state === 'sweep') finish(performance.now() - start >= WIND - WINDOW ? 'parry' : 'block');
  };

  // Старт по click, чтобы прокрутка пальцем не запускала игру; во время игры важна каждая миллисекунда, поэтому pointerdown
  box.addEventListener('click', () => { if (state === 'idle') begin(); });
  box.addEventListener('pointerdown', e => {
    if (state === 'idle' || (e.pointerType === 'mouse' && e.button !== 0)) return;
    press();
  });
  box.addEventListener('keydown', e => {
    if (state === 'idle' || e.repeat || (e.key !== ' ' && e.key !== 'Enter')) return;
    e.preventDefault();
    press();
  });
  new IntersectionObserver(([e]) => { if (!e.isIntersecting && state !== 'idle') stop(); }).observe(box);
})();
