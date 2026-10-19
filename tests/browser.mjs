import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { existsSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, extname, sep } from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { Browser, sleep } from './helpers/browser.mjs';

const root = resolve('.');
const reference = resolve(process.env.REFERENCE_DIR || '../IT-Company-Website-Refactoring');
const output = resolve('test-results');
mkdirSync(output, { recursive: true });
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf' };
const server = createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  const file = resolve(reference, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(reference + sep) || !existsSync(file)) { response.writeHead(404).end(); return; }
  response.writeHead(200, { 'content-type': mime[extname(file).toLowerCase()] || 'application/octet-stream' });
  response.end(readFileSync(file));
});
let browser;
let production;
let count = 0;
const checks = [];
const check = (value, message) => { assert.ok(value, message); count++; checks.push(message); };
const scroll = async (page, selector, offset = 100) => {
  await page.eval(({ selector, offset }) => window.scrollTo(0, document.querySelector(selector).getBoundingClientRect().top + scrollY - offset), { selector, offset });
  await sleep(380);
};
const isHidden = page => page.eval(() => document.querySelector('.contact-popover').hidden);
const snapshot = page => page.eval(() => {
  const selectors = ['.home', '.vision', '.vitaray', '.counters', '#scenario', '.communicate', '.clients', '.team', '#contact', '.contact-in', '.faq', '.footer'];
  return selectors.map(selector => {
    const element = document.querySelector(selector);
    const rect = element.getBoundingClientRect();
    return { selector, text: element.textContent.replace(/\s+/g, ' ').trim(), top: rect.top + scrollY, width: rect.width, height: rect.height };
  });
});

try {
  assert.ok(existsSync(resolve('.output/server/index.mjs')), 'Run npm run build first');
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const referenceURL = `http://127.0.0.1:${server.address().port}`;
  const portProbe = createServer();
  await new Promise(r => portProbe.listen(0, '127.0.0.1', r));
  const port = portProbe.address().port;
  await new Promise(r => portProbe.close(r));
  const url = `http://127.0.0.1:${port}`;
  production = spawn(process.execPath, ['.output/server/index.mjs'], {
    cwd: root, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, NODE_ENV: 'production', HOST: '127.0.0.1', PORT: String(port), NUXT_PUBLIC_CONTACT_ENDPOINT: 'https://forms.test/contact' },
  });
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    try { if ((await fetch(url)).ok) { ready = true; break; } } catch {}
    await sleep(200);
  }
  check(ready, 'Production server starts');
  const serverHTML = await (await fetch(url)).text();
  check(serverHTML.includes('Sensing life. Protecting dignity.') && serverHTML.includes('What makes VitaRay different?'), 'SSR includes page content');
  check(!/<script[^>]+(?:jquery|main\.js|contact-popover\.js)/i.test(serverHTML), 'No legacy scripts loaded');
  check((await fetch(url + '/google71b522dc6e151dee.html')).ok, 'Google verification file preserved');
  browser = await Browser.launch();
  const comparisons = [];
  for (const width of [1440, 768, 390, 320]) {
    const height = width > 600 ? 900 : 844;
    const page = await browser.newPage({ width, height, mobile: width <= 600 });
    await page.goto(url, { timeoutMs: 20000, settleMs: 800 });
    await page.eval(() => document.fonts.ready);
    check(page.consoleErrors.length === 0, `${width}: no JavaScript errors`);
    check(await page.eval(() => [...document.images].every(image => image.complete && image.naturalWidth > 0)), `${width}: all images load`);
    check(await isHidden(page), `${width}: survey hidden initially`);
    check(await page.eval(() => new Set([...document.querySelectorAll('.scenario-carousel .owl-item img')].map(image => image.src)).size === 6), `${width}: six scenarios retained`);
    // Stop animation only while producing still comparisons.
    await page.eval(() => {
      const style = document.createElement('style'); style.textContent = '* { animation: none !important; transition: none !important; }'; style.id = 'screenshot-still'; document.head.append(style);
    });
    const actual = await snapshot(page);
    await page.screenshot({ path: `${output}/${width}-nuxt.png`, format: 'png', fullPage: true });
    if (existsSync(resolve(reference, 'index.html'))) {
      const baseline = await browser.newPage({ width, height, mobile: width <= 600 });
      await baseline.goto(referenceURL, { timeoutMs: 20000, settleMs: 800 });
      await baseline.eval(() => document.fonts.ready);
      await baseline.eval(() => {
        const style = document.createElement('style'); style.textContent = '* { animation: none !important; transition: none !important; }'; document.head.append(style);
      });
      const expected = await snapshot(baseline);
      comparisons.push({ width, expected, actual, baselineErrors: baseline.consoleErrors });
      await baseline.screenshot({ path: `${output}/${width}-reference.png`, format: 'png', fullPage: true });
      writeFileSync(resolve(output, 'comparison.json'), JSON.stringify(comparisons, null, 2));
      for (let i = 0; i < expected.length; i++) {
        check(actual[i].text.replace(/\s/g, '') === expected[i].text.replace(/\s/g, ''), `${width}: ${expected[i].selector} copy retained`);
        check(Math.abs(actual[i].top - expected[i].top) <= 2 && Math.abs(actual[i].height - expected[i].height) <= 2 && Math.abs(actual[i].width - expected[i].width) <= 2, `${width}: ${expected[i].selector} geometry retained within 2px`);
      }
      await baseline.close();
    }
    await page.eval(() => document.getElementById('screenshot-still').remove());
    await scroll(page, '#product');
    check(!(await isHidden(page)), `${width}: scrolling reveals survey`);
    const geometry = await page.eval(() => {
      const popup = document.querySelector('.contact-popover').getBoundingClientRect();
      const top = document.querySelector('.back-to-top').getBoundingClientRect();
      return { fits: popup.left >= 0 && popup.right <= innerWidth && popup.bottom <= innerHeight, overlap: popup.left < top.right && popup.right > top.left && popup.top < top.bottom && popup.bottom > top.top };
    });
    check(geometry.fits && !geometry.overlap, `${width}: survey fits without overlapping back-to-top`);
    await scroll(page, '.communicate');
    check(await isHidden(page), `${width}: survey hides near inline invitation`);
    await scroll(page, '.team');
    check(!(await isHidden(page)), `${width}: survey returns after inline invitation`);
    if (width <= 768) {
      await page.eval(() => document.querySelector('.fa-bars').click());
      await sleep(350);
      check(await page.eval(() => document.querySelector('.navbar').classList.contains('nav-toggle')), `${width}: mobile menu opens`);
      check(await isHidden(page), `${width}: menu hides survey`);
      await page.eval(() => document.querySelector('.fa-bars').click());
      await sleep(350);
      check(!(await isHidden(page)), `${width}: closing menu restores survey`);
    }
    await page.eval(() => document.querySelector('.contact-popover-close').click());
    await sleep(280);
    check(await isHidden(page), `${width}: survey close works`);
    await scroll(page, '#product');
    check(await isHidden(page), `${width}: dismissal lasts on this page`);
    await page.eval(() => document.querySelector('.accordion-header').click());
    await sleep(350);
    check(await page.eval(() => getComputedStyle(document.querySelector('.accordion-body')).display !== 'none'), `${width}: FAQ opens`);
    const answerHeight = await page.eval(() => document.querySelector('.accordion-body').getBoundingClientRect().height);
    await page.eval(() => document.querySelector('.accordion-header').click());
    await sleep(100);
    const exitingAnswerHeight = await page.eval(() => document.querySelector('.accordion-body').getBoundingClientRect().height);
    check(exitingAnswerHeight > 0 && exitingAnswerHeight < answerHeight, `${width}: FAQ closes with slide animation`);
    await sleep(250);
    check(await page.eval(() => getComputedStyle(document.querySelector('.accordion-body')).display === 'none'), `${width}: FAQ closes`);
    await page.eval(() => document.querySelectorAll('.owl-dot')[2].click());
    check(await page.eval(() => document.querySelector('.scenario-carousel .owl-item.active img').src.includes('scenario-3.png')), `${width}: carousel pagination works`);
    await page.eval(() => document.querySelector('.back-to-top').click());
    await sleep(1500);
    check(await page.eval(() => scrollY < 2), `${width}: back-to-top works`);
    await page.goto(url, { timeoutMs: 20000, settleMs: 350 });
    await scroll(page, '#product');
    check(!(await isHidden(page)), `${width}: reload resets survey dismissal`);
    check(page.consoleErrors.length === 0, `${width}: interactions produce no JavaScript errors`);
    check(page.hydrationErrors.length === 0, `${width}: no hydration mismatches`);
    await page.close();
  }

  const interactive = await browser.newPage({ width: 390, height: 844, mobile: true });
  await interactive.goto(url, { timeoutMs: 20000, settleMs: 400 });
  await scroll(interactive, '#product');
  await interactive.eval(() => document.querySelector('.contact-popover-feedback').focus());
  await interactive.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await sleep(300);
  check(await isHidden(interactive), 'Escape dismisses survey');
  await interactive.goto(url, { timeoutMs: 20000, settleMs: 400 });
  await scroll(interactive, '#product');
  await interactive.eval(() => {
    const link = document.querySelector('.contact-popover-feedback');
    link.addEventListener('click', event => event.preventDefault(), { once: true }); link.click();
  });
  await sleep(300);
  check(await isHidden(interactive), 'Following survey link dismisses invitation');
  await scroll(interactive, '.team');
  check(await isHidden(interactive), 'Following survey link prevents reappearance');
  await scroll(interactive, '#scenario');
  await interactive.eval(() => document.querySelector('.scenario-carousel').focus());
  await interactive.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 });
  await sleep(350);
  check(await interactive.eval(() => document.querySelector('.owl-dot.active').getAttribute('aria-label') === 'Show scenario 2'), 'Carousel keyboard navigation');
  for (let step = 0; step < 6; step++) {
    await interactive.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 });
    await sleep(300);
  }
  check(await interactive.eval(() => document.querySelector('.owl-dot.active').getAttribute('aria-label') === 'Show scenario 2'), 'Carousel wraps seamlessly');
  await interactive.eval(() => {
    const carousel = document.querySelector('.scenario-carousel');
    const rect = carousel.getBoundingClientRect();
    window.__swipe = { x: rect.x + rect.width * .75, y: rect.y + 30 };
  });
  const swipe = await interactive.eval(() => window.__swipe);
  await interactive.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: swipe.x, y: swipe.y }] });
  await interactive.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: swipe.x - 80, y: swipe.y }] });
  await interactive.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await sleep(350);
  check(await interactive.eval(() => document.querySelector('.owl-dot.active').getAttribute('aria-label') === 'Show scenario 3'), 'Carousel touch swipe');
  await interactive.close();

  const reduced = await browser.newPage({ width: 390, height: 844, mobile: true, reducedMotion: true });
  await reduced.goto(url, { timeoutMs: 20000, settleMs: 400 });
  await scroll(reduced, '#product');
  check(!(await isHidden(reduced)), 'Reduced motion still shows survey');
  await reduced.eval(() => document.querySelector('.contact-popover-close').click());
  await sleep(20);
  check(await isHidden(reduced), 'Reduced motion survey closes immediately');
  await sleep(5100);
  check(await reduced.eval(() => document.querySelector('.owl-dot.active').getAttribute('aria-label') === 'Show scenario 1'), 'Reduced motion disables carousel autoplay');
  await reduced.close();

  const page = await browser.newPage();
  await page.goto(url, { timeoutMs: 20000, settleMs: 400 });
  await page.eval(() => {
    window.__requests = [];
    window.__mode = 'success';
    window.fetch = async (endpoint, options) => {
      window.__requests.push({ endpoint, payload: JSON.parse(options.body) });
      await new Promise(r => setTimeout(r, 150));
      if (window.__mode === 'network') throw new Error('Offline');
      if (window.__mode === 'http') return new Response('{}', { status: 500 });
      return new Response(JSON.stringify(window.__mode === 'success' ? { status: 'success' } : { status: 'error', error: 'Please try again.' }), { headers: { 'content-type': 'application/json' } });
    };
  });
  const fill = page => page.eval(() => {
    for (const [key, value] of Object.entries({ name: 'Test visitor', phone: '0412345678', email: 'test@example.com', message: 'Test message' })) {
      const input = document.querySelector(`[name="${key}"]`);
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  await fill(page);
  await page.eval(() => document.querySelector('form').requestSubmit());
  await sleep(30);
  check(await page.eval(() => document.querySelector('.contact-form-btn').disabled), 'Contact disables duplicate submissions');
  await sleep(250);
  check(await page.eval(() => document.querySelector('[role="status"]').textContent.includes('Thank you!')), 'Contact success feedback');
  check(await page.eval(() => document.querySelector('[name="name"]').value === ''), 'Contact success resets form');
  check(await page.eval(() => window.__requests[0].payload.phone === '0412345678' && Object.keys(window.__requests[0].payload).length === 4), 'Contact retains original payload format');
  for (const mode of ['error', 'network', 'http']) {
    await fill(page);
    await page.eval(mode => { window.__mode = mode; document.querySelector('form').requestSubmit(); }, mode);
    await sleep(300);
    check(await page.eval(() => /Failed|Error/.test(document.querySelector('[role="status"]').textContent)), `Contact ${mode} feedback`);
    check(await page.eval(() => !document.querySelector('.contact-form-btn').disabled && document.querySelector('[name="name"]').value !== ''), `Contact ${mode} retains input and allows retry`);
  }
  const before = await page.eval(() => window.__requests.length);
  await page.eval(() => {
    const input = document.querySelector('[name="phone"]'); input.value = '123'; input.dispatchEvent(new Event('input', { bubbles: true })); document.querySelector('form').requestSubmit();
  });
  await sleep(200);
  check(await page.eval(() => window.__requests.length) === before, 'Invalid phone prevents submission');
  await page.close();
  writeFileSync(resolve(output, 'report.json'), JSON.stringify({ checks: count, passed: checks, comparisons }, null, 2));
  console.log(`PASS: ${count} checks. Screenshots and reference comparisons: test-results/`);
} finally {
  if (browser) await browser.close();
  if (production) { production.kill(); await Promise.race([once(production, 'exit'), sleep(2000)]); }
  server.close();
}
