// =============================================
// TERMINAL TYPEWRITER — Signature Element
// =============================================
const commands = [
  { cmd: 'docker compose up -d --scale app=3', out: '✓ 3 containers started in 1.2s' },
  { cmd: 'kubectl rollout status deploy/api', out: '✓ deployment "api" successfully rolled out' },
  { cmd: 'terraform apply -auto-approve', out: '✓ 12 resources added. 0 destroyed.' },
  { cmd: 'ansible-playbook harden.yml --diff', out: '✓ Playbook run: ok=24, changed=8, failed=0' },
  { cmd: 'helm upgrade --install nginx ingress/', out: '✓ Release "nginx" has been upgraded.' },
];

let cmdIndex = 0;
const textEl = document.getElementById('terminal-text');
const outputEl = document.getElementById('terminal-output');

function typeCommand(cmd, callback) {
  let i = 0;
  textEl.textContent = '';
  outputEl.textContent = '';
  const iv = setInterval(() => {
    textEl.textContent += cmd[i++];
    if (i >= cmd.length) { clearInterval(iv); setTimeout(callback, 400); }
  }, 38);
}

function showOutput(out, callback) {
  outputEl.textContent = out;
  setTimeout(callback, 2200);
}

function clearAndNext() {
  textEl.textContent = '';
  outputEl.textContent = '';
  cmdIndex = (cmdIndex + 1) % commands.length;
  setTimeout(runCycle, 500);
}

function runCycle() {
  const { cmd, out } = commands[cmdIndex];
  typeCommand(cmd, () => showOutput(out, clearAndNext));
}

// Start after a short delay
setTimeout(runCycle, 800);

// =============================================
// NAV SCROLL BEHAVIOR
// =============================================
const navWrap = document.querySelector('.nav-wrap');
window.addEventListener('scroll', () => {
  navWrap.style.background = window.scrollY > 60
    ? 'rgba(10,15,30,0.97)'
    : 'rgba(10,15,30,0.85)';
});

// =============================================
// SMOOTH SCROLL FOR NAV LINKS
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// =============================================
// HAMBURGER MENU (MOBILE)
// =============================================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
let menuOpen = false;

hamburger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  if (menuOpen) {
    navLinks.style.cssText = `
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 64px; left: 0; right: 0;
      background: rgba(10,15,30,0.98);
      padding: 24px;
      gap: 24px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      backdrop-filter: blur(16px);
    `;
    hamburger.innerHTML = '✕';
  } else {
    navLinks.removeAttribute('style');
    hamburger.innerHTML = '&#9776;';
  }
});

// =============================================
// CONTACT FORM HANDLER
// =============================================
function handleSubmit() {
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const service = document.getElementById('service').value;
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !service || !message) {
    showToast('Please fill in all fields.', 'error');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('Please enter a valid email address.', 'error');
    return;
  }

  const btn = document.querySelector('.btn-full');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  // Simulate form submission
  setTimeout(() => {
    showToast('Message sent! We\'ll be in touch within 1 business day.', 'success');
    btn.textContent = 'Send Message';
    btn.disabled = false;
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('service').value = '';
    document.getElementById('message').value = '';
  }, 1200);
}

function showToast(msg, type) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed;
    bottom: 32px; right: 32px;
    background: ${type === 'success' ? '#16a34a' : '#dc2626'};
    color: #fff;
    padding: 16px 24px;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    z-index: 9999;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    animation: slideIn 0.3s ease;
    max-width: 360px;
    line-height: 1.5;
  `;

  const style = document.createElement('style');
  style.textContent = `@keyframes slideIn { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`;
  document.head.appendChild(style);

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// =============================================
// SCROLL-TRIGGERED FADE-IN ANIMATIONS
// =============================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .why-card, .process-step, .stat').forEach(el => {
  el.style.cssText += 'opacity:0; transform:translateY(20px); transition: opacity 0.5s ease, transform 0.5s ease;';
  observer.observe(el);
});
