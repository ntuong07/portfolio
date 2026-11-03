const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];
document.documentElement.classList.add('js');

/* 1. Dark Mode (ghi nhớ lựa chọn) */
const root = document.documentElement, themeBtn = $('#themeBtn');
function setTheme(t) {
  root.dataset.theme = t;
  themeBtn.textContent = t === 'dark' ? '☀️' : '🌙';
  try { localStorage.setItem('theme', t); } catch (e) {}
}
let saved = null;
try { saved = localStorage.getItem('theme'); } catch (e) {}
setTheme(saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
themeBtn.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

/* 2. Menu mobile */
const menu = $('#menu'), burger = $('#burger');
function toggleMenu(open) {
  menu.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  burger.textContent = open ? '✕' : '☰';
}
burger.addEventListener('click', () => toggleMenu(!menu.classList.contains('open')));
$$('a', menu).forEach(a => a.addEventListener('click', () => toggleMenu(false)));

/* 3. Hiệu ứng gõ chữ */
const words = ['mình là Nhật Tường, người làm game', 'đang học Unity và lập trình C#', 'xem game của mình tại đây', 'mình cũng làm web bằng HTML, CSS, JS', 'và các dự án khác nữa'];
const typing = $('#typing');
let w = 0, c = 0, del = false;
(function type() {
  const word = words[w];
  typing.textContent = word.slice(0, c);
  if (!del && c === word.length) { del = true; return setTimeout(type, 1600); }
  if (del && c === 0) { del = false; w = (w + 1) % words.length; }
  c += del ? -1 : 1;
  setTimeout(type, del ? 25 : 55);
})();

/* 4. Hiện section khi cuộn tới */
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); }
}), { threshold: 0.15 });
$$('.reveal').forEach(el => io.observe(el));

/* 5. Thanh tiến trình cuộn + nút lên đầu */
const bar = $('#progress'), toTop = $('#toTop');
addEventListener('scroll', () => {
  const max = document.body.scrollHeight - innerHeight;
  bar.style.width = (scrollY / max * 100) + '%';
  toTop.classList.toggle('on', scrollY > 500);
}, { passive: true });
toTop.addEventListener('click', () => scrollTo({ top: 0 }));

/* 6. Lọc dự án */
$$('.chip').forEach(chip => chip.addEventListener('click', () => {
  $$('.chip').forEach(c => c.classList.toggle('active', c === chip));
  const f = chip.dataset.filter;
  $$('.project').forEach(p => p.classList.toggle('hide', f !== 'all' && p.dataset.cat !== f));
}));

/* 7. Modal chi tiết dự án */
const modal = $('#modal');
$$('.link').forEach(btn => btn.addEventListener('click', () => {
  $('#mTitle').textContent = btn.dataset.title;
  $('#mDesc').textContent = btn.dataset.desc;
  $('#mTech').textContent = 'Công nghệ: ' + btn.dataset.tech;
  $('#mLink').href = btn.dataset.url;
  modal.showModal();
}));
$('#mClose').addEventListener('click', () => modal.close());
modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });

/* 8. Kiểm tra form liên hệ */
const form = $('#form'), status = $('#status');
const rules = {
  name: v => v.trim().length >= 2 || 'Vui lòng nhập họ tên (ít nhất 2 ký tự).',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || 'Email chưa đúng định dạng, ví dụ: ten@gmail.com.',
  msg: v => v.trim().length >= 10 || 'Lời nhắn cần ít nhất 10 ký tự.'
};
function check(input) {
  const r = rules[input.id](input.value);
  input.classList.toggle('invalid', r !== true);
  input.nextElementSibling.textContent = r === true ? '' : r;
  return r === true;
}
$$('input, textarea', form).forEach(i => i.addEventListener('input', () => check(i)));
form.addEventListener('submit', e => {
  e.preventDefault();
  const ok = $$('input, textarea', form).map(check).every(Boolean);
  status.textContent = ok ? 'Đã gửi! Cảm ơn bạn, mình sẽ phản hồi sớm.' : '';
  if (ok) { form.reset(); confetti(); }
});

/* ===== Hiệu ứng nâng cao ===== */

/* 9. Nền mạng hạt: các chấm nối nhau và né con trỏ chuột */
(function () {
  const cv = $('#bg'), ctx = cv.getContext('2d'), mouse = { x: -999, y: -999 };
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  let W, H, pts = [];
  function resize() {
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    pts = Array.from({ length: Math.min(70, Math.floor(W * H / 18000)) }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4
    }));
  }
  addEventListener('resize', resize); resize();
  addEventListener('pointermove', e => {
    mouse.x = e.clientX; mouse.y = e.clientY;
    root.style.setProperty('--mx', e.clientX + 'px');   /* vầng sáng theo chuột */
    root.style.setProperty('--my', e.clientY + 'px');
  });
  function frame() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = ctx.strokeStyle = getComputedStyle(root).getPropertyValue('--blue').trim();
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
      if (d > 0 && d < 120) { p.x += dx / d * 1.5; p.y += dy / d * 1.5; }
      ctx.globalAlpha = .8; ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, 6.3); ctx.fill();
    }
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
      if (d < 130) {
        ctx.globalAlpha = (1 - d / 130) * .45;
        ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
      }
    }
    if (!still) requestAnimationFrame(frame);
  }
  frame();
})();

/* 10. Thẻ dự án nghiêng 3D theo chuột */
$$('.project').forEach(card => {
  card.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    card.style.transition = 'transform .1s';
    card.style.transform = `perspective(800px) rotateX(${(.5 - y) * 10}deg) rotateY(${(x - .5) * 12}deg) translateY(-6px)`;
    card.style.setProperty('--gx', x * 100 + '%');
    card.style.setProperty('--gy', y * 100 + '%');
  });
  card.addEventListener('pointerleave', () => { card.style.transition = ''; card.style.transform = ''; });
});

/* 11. Nút "hút" theo con trỏ */
$$('.btn').forEach(b => {
  b.addEventListener('pointermove', e => {
    const r = b.getBoundingClientRect();
    b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .2}px, ${(e.clientY - r.top - r.height / 2) * .3}px)`;
  });
  b.addEventListener('pointerleave', () => { b.style.transform = ''; });
});

/* 12. Số liệu đếm lên khi cuộn tới */
const counter = new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return;
  counter.unobserve(e.target);
  $$('b', e.target).forEach(b => {
    const n = +b.dataset.count, t0 = performance.now();
    (function step(t) {
      const k = Math.min((t - t0) / 1400, 1);
      b.textContent = Math.round(n * (1 - Math.pow(1 - k, 3))) + (k === 1 ? b.dataset.suffix || '' : '');
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  });
}), { threshold: .6 });
$$('.stats').forEach(s => counter.observe(s));

/* 13. Menu tô sáng mục đang xem */
const links = $$('.menu a');
const spy = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) links.forEach(a => a.classList.toggle('active', a.hash === '#' + e.target.id));
}), { rootMargin: '-40% 0px -55% 0px' });
$$('main section[id]').forEach(s => spy.observe(s));

/* 14. Pháo giấy khi gửi form thành công */
function confetti() {
  const colors = ['#2540ff', '#d9ff3f', '#ff5c8a', '#18c5a5'];
  for (let i = 0; i < 60; i++) {
    const s = document.createElement('i');
    s.className = 'confetti';
    s.style.cssText = `--x:${(Math.random() - .5) * 700}px;--y:${-180 - Math.random() * 320}px;--r:${Math.random() * 720}deg;background:${colors[i % 4]}`;
    document.body.append(s);
    setTimeout(() => s.remove(), 1600);
  }
}
