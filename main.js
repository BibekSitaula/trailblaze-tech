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

// =============================================
// PORTFOLIO TAB SWITCHER
// =============================================
function switchTab(tabId, clickedBtn) {
  document.querySelectorAll('.portfolio-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + tabId).classList.add('active');
  clickedBtn.classList.add('active');
}

// =============================================
// PROJECT MODAL DATA
// =============================================
const projects = {
  dm1: {
    title: 'Brand Awareness Campaign',
    client: 'Client: NexaCorp — SaaS / B2B',
    badge: 'Completed',
    desc: 'A full-funnel digital marketing campaign spanning Google Ads, Meta, and LinkedIn for a B2B SaaS company targeting mid-market enterprises. We designed the ad creative, managed bidding strategy, built custom landing pages, and ran continuous A/B tests throughout the engagement.',
    stats: [{ val: '3x', label: 'Lead Growth' }, { val: '90', label: 'Days' }, { val: '-41%', label: 'Cost Per Lead' }],
    tags: ['Google Ads', 'Meta Ads', 'LinkedIn', 'A/B Testing', 'Landing Pages'],
    outcomes: ['Tripled qualified lead volume within 90 days', 'Reduced cost-per-acquisition by 41%', 'Improved landing page conversion rate from 2.1% to 6.8%', 'Built reusable ad templates adopted by client in-house team']
  },
  dm2: {
    title: 'E-commerce SEO Overhaul',
    client: 'Client: RetailVista — E-commerce',
    badge: 'Completed',
    desc: 'Comprehensive technical SEO audit and content strategy for a mid-size retail e-commerce store with over 4,000 product pages. Addressed crawlability issues, site speed, structured data, and built a content calendar to drive long-tail organic traffic.',
    stats: [{ val: '+180%', label: 'Organic Traffic' }, { val: '6', label: 'Months' }, { val: '#1', label: 'Rankings Won' }],
    tags: ['Technical SEO', 'Content Strategy', 'Core Web Vitals', 'Schema Markup', 'Link Building'],
    outcomes: ['180% increase in organic traffic over 6 months', 'Secured #1 rankings for 23 high-value product keywords', 'Improved Core Web Vitals score from 42 to 91', 'Reduced page load time by 58% through asset optimization']
  },
  dm3: {
    title: 'Social Media Revamp',
    client: 'Client: BrightFlow — Fintech',
    badge: 'Completed',
    desc: 'Complete overhaul of social media presence for a fintech startup across Instagram, LinkedIn, and X. Included brand voice development, content calendar, paid amplification, and community management strategy.',
    stats: [{ val: '+420%', label: 'Followers' }, { val: '4.2%', label: 'Engagement' }, { val: '4', label: 'Months' }],
    tags: ['Instagram', 'LinkedIn', 'Content Creation', 'Community Management', 'Paid Amplification'],
    outcomes: ['Grew Instagram following by 420% in 4 months', 'Increased engagement rate from 0.8% to 4.2%', 'Developed 3-month content calendar adopted by in-house team', 'Generated 14 inbound partnership inquiries through LinkedIn']
  },
  dv1: {
    title: 'Kubernetes Migration',
    client: 'Client: Proxima Labs — Cloud / SaaS',
    badge: 'Completed',
    desc: 'End-to-end migration of a Node.js monolith with 18 tightly coupled services into a containerised microservices architecture running on Kubernetes. Included traffic shifting, canary deployments, and full observability stack setup.',
    stats: [{ val: '8min', label: 'Deploy Time' }, { val: '0', label: 'Downtime' }, { val: '4', label: 'Months' }],
    tags: ['Kubernetes', 'Docker', 'Helm', 'Prometheus', 'Grafana', 'ArgoCD'],
    outcomes: ['Deployment time reduced from 2 hours to 8 minutes', 'Zero downtime during migration using blue/green strategy', 'Introduced full observability with Prometheus + Grafana', 'Enabled independent scaling of 6 high-traffic services']
  },
  dv2: {
    title: 'CI/CD Pipeline Buildout',
    client: 'Client: VaultFin — Fintech',
    badge: 'Completed',
    desc: 'Designed and implemented a complete GitOps pipeline for a fintech startup transitioning from manual deployments. The pipeline handles automated testing, security scanning, staging promotion, and production deployment with one-click rollback.',
    stats: [{ val: '0', label: 'Failed Releases' }, { val: '6wk', label: 'Delivery' }, { val: '94%', label: 'Test Coverage' }],
    tags: ['GitHub Actions', 'ArgoCD', 'Docker', 'Terraform', 'SAST', 'GitOps'],
    outcomes: ['Zero failed production releases in first 6 months post-launch', 'Automated test coverage reached 94% across all services', 'Security scanning integrated into every pull request', 'One-click rollback capability reduced MTTR from hours to minutes']
  },
  dv3: {
    title: 'Multi-Cloud Infra Setup',
    client: 'Client: CloudWave — Infrastructure',
    badge: 'Completed',
    desc: 'Provisioned and configured a multi-cloud environment spanning AWS and Azure, managed entirely through Terraform. Implemented cost tagging, budget alerts, reserved instance strategy, and automated rightsizing recommendations.',
    stats: [{ val: '-34%', label: 'Infra Cost' }, { val: '2', label: 'Cloud Providers' }, { val: '3mo', label: 'Duration' }],
    tags: ['Terraform', 'AWS', 'Azure', 'Cost Optimization', 'IAM', 'VPC'],
    outcomes: ['Reduced monthly infrastructure spend by 34%', 'Unified IAM and access policies across both cloud providers', 'Established tagging standards enabling per-team cost attribution', 'Automated nightly rightsizing reports saving 8hrs/week of manual review']
  },
  it1: {
    title: 'Managed IT — 200-seat Office',
    client: 'Client: HealthSync — Healthcare',
    badge: 'Completed',
    desc: 'Full managed IT service for a 200-person healthcare organisation including Tier 1–3 helpdesk, hardware lifecycle management, endpoint security, and monthly reporting. Operated under strict HIPAA compliance requirements.',
    stats: [{ val: '99.7%', label: 'Uptime' }, { val: '<2hr', label: 'Avg Resolution' }, { val: '12mo', label: 'Engagement' }],
    tags: ['Helpdesk', 'Endpoint Management', 'HIPAA', 'MDM', 'Asset Management'],
    outcomes: ['Maintained 99.7% system uptime across 200 endpoints', 'Average ticket resolution time under 2 hours', 'Achieved full HIPAA endpoint compliance within first 60 days', 'Reduced hardware replacement costs by 22% through proactive monitoring']
  },
  it2: {
    title: 'Remote Workforce Rollout',
    client: 'Client: NomadLabs — Remote-first Startup',
    badge: 'Completed',
    desc: 'Rapid deployment of devices, VPN infrastructure, and collaboration tooling for a 60-person fully distributed team spanning 8 countries. Included MDM enrollment, SSO setup, and a custom onboarding guide for each region.',
    stats: [{ val: '60', label: 'Users' }, { val: '8', label: 'Countries' }, { val: '3wk', label: 'Delivery' }],
    tags: ['MDM', 'VPN', 'SSO', 'Okta', 'Jamf', 'Remote Onboarding'],
    outcomes: ['All 60 employees fully operational within 3 weeks', 'Zero security incidents during rollout', 'SSO integrated with 12 SaaS tools used by the team', 'Custom IT onboarding guide reduced new hire setup time by 70%']
  },
  it3: {
    title: 'Helpdesk SLA Turnaround',
    client: 'Client: TerraGroup — Construction',
    badge: 'Completed',
    desc: 'Took over a failing internal helpdesk with a 72-hour average resolution time and significant user dissatisfaction. Restructured ticket triage, introduced SLA tiers, and implemented a knowledge base to reduce repeat issues.',
    stats: [{ val: '<4hr', label: 'Resolution Time' }, { val: '60', label: 'Days to Fix' }, { val: '94%', label: 'Satisfaction' }],
    tags: ['ITSM', 'SLA Management', 'Knowledge Base', 'Jira Service Desk', 'Triage'],
    outcomes: ['Average resolution time dropped from 72hrs to under 4hrs in 60 days', 'User satisfaction score improved from 48% to 94%', 'Knowledge base reduced repeat tickets by 38%', 'Introduced priority SLA tiers protecting business-critical systems']
  },
  sw1: {
    title: 'Inventory Management System',
    client: 'Client: WareHouse Pro — Logistics',
    badge: 'Completed',
    desc: 'Built a full-stack inventory and warehouse management system from scratch in Python/Django with a React frontend. Features include real-time stock tracking, barcode scanning integration, automated reorder alerts, and multi-warehouse support.',
    stats: [{ val: '40%', label: 'Faster Processing' }, { val: '5mo', label: 'Build Time' }, { val: '99.9%', label: 'Accuracy' }],
    tags: ['Python', 'Django', 'React', 'PostgreSQL', 'REST API', 'Barcode Integration'],
    outcomes: ['Replaced 3 separate spreadsheet systems with one platform', 'Order processing speed improved by 40%', 'Inventory accuracy reached 99.9% from previous 91%', 'Integrated with existing ERP via REST API with zero data loss']
  },
  sw2: {
    title: 'Client Portal — Java Spring',
    client: 'Client: ClientFirst — Professional Services',
    badge: 'Completed',
    desc: 'Secure, multi-tenant client portal built on Java Spring Boot with a Vue.js frontend. Provides role-based access to project updates, documents, invoices, and a real-time messaging thread per engagement.',
    stats: [{ val: '3', label: 'Access Roles' }, { val: '4mo', label: 'Build Time' }, { val: '100%', label: 'Audit Coverage' }],
    tags: ['Java', 'Spring Boot', 'Vue.js', 'PostgreSQL', 'OAuth2', 'Multi-tenancy'],
    outcomes: ['Delivered role-based access for Admin, Manager, and Client roles', 'Full audit trail on every document access and change', 'Reduced client email back-and-forth by 65%', 'ISO 27001-aligned security controls throughout']
  },
  sw3: {
    title: 'Booking & Scheduling App',
    client: 'Client: MediVault — HealthTech',
    badge: 'Completed',
    desc: 'Mobile-friendly web application for appointment booking, staff scheduling, and automated patient reminders for a multi-location healthcare provider. Integrated with Stripe for payment processing and Google Calendar for staff sync.',
    stats: [{ val: '-30%', label: 'No-shows' }, { val: '3mo', label: 'Build Time' }, { val: '4.8★', label: 'User Rating' }],
    tags: ['Python', 'FastAPI', 'React', 'Stripe', 'Google Calendar API', 'SMS'],
    outcomes: ['No-show rate reduced by 30% through automated SMS reminders', 'Booking process reduced from 8 minutes to under 90 seconds', 'Stripe integration handling payments across 3 locations', 'Achieved 4.8-star user rating from 200+ patient reviews']
  },
  ot1: {
    title: 'Data Analytics Dashboard',
    client: 'Client: InsightCo — Analytics',
    badge: 'Completed',
    desc: 'Real-time business intelligence dashboard pulling live data from 6 source systems including Salesforce, HubSpot, and a proprietary ERP. Built on Python/FastAPI backend with a React + Recharts frontend and role-based data access.',
    stats: [{ val: '6', label: 'Data Sources' }, { val: '2mo', label: 'Build Time' }, { val: 'Live', label: 'Data Refresh' }],
    tags: ['Python', 'FastAPI', 'React', 'Recharts', 'Salesforce API', 'PostgreSQL'],
    outcomes: ['Live data from 6 systems consolidated in one view', 'Leadership decision cycle shortened from weekly reports to real-time', 'Custom KPI widgets built for Sales, Ops, and Finance teams', 'Role-based data access ensuring department data privacy']
  },
  ot2: {
    title: 'IT Training Program',
    client: 'Client: GreenField — Non-profit',
    badge: 'Completed',
    desc: 'Designed and delivered a structured 6-week IT literacy and security training programme for a 40-person non-technical team. Covered phishing awareness, password hygiene, safe remote working, and tool-specific training for their stack.',
    stats: [{ val: '40', label: 'Staff Trained' }, { val: '6wk', label: 'Programme' }, { val: '97%', label: 'Pass Rate' }],
    tags: ['Security Awareness', 'Phishing Simulation', 'Microsoft 365', 'Zoom', 'Training Design'],
    outcomes: ['97% of staff passed final security assessment', 'Simulated phishing click rate dropped from 34% to 4%', 'All staff certified on Microsoft 365 essentials', 'Training materials handed off for ongoing internal use']
  },
  ot3: {
    title: 'Vendor Management Portal',
    client: 'Client: OxfordTech — Consulting',
    badge: 'Completed',
    desc: 'Centralised vendor tracking and procurement portal for a 500-person enterprise. Replaced a fragmented email-based approval process with a structured workflow engine, contract repository, and vendor performance scoring system.',
    stats: [{ val: '-60%', label: 'Approval Time' }, { val: '3mo', label: 'Build Time' }, { val: '80+', label: 'Vendors Managed' }],
    tags: ['Python', 'Django', 'React', 'Workflow Engine', 'DocuSign API', 'Reporting'],
    outcomes: ['Procurement approval cycle reduced by 60%', 'Centralised 80+ vendor contracts previously stored across email and drives', 'Vendor performance scoring system adopted by procurement team', 'DocuSign integration eliminated all manual signature workflows']
  }
};

function openModal(id) {
  const p = projects[id];
  if (!p) return;
  document.getElementById('modalContent').innerHTML = `
    <span class="modal-badge">${p.badge}</span>
    <h2 class="modal-title">${p.title}</h2>
    <p class="modal-client">${p.client}</p>
    <p class="modal-desc">${p.desc}</p>
    <div class="modal-stats">
      ${p.stats.map(s => `<div class="modal-stat"><span class="modal-stat-val">${s.val}</span><span class="modal-stat-label">${s.label}</span></div>`).join('')}
    </div>
    <p class="modal-section-title">Technologies & Methods</p>
    <div class="modal-tags">${p.tags.map(t => `<span class="modal-tag">${t}</span>`).join('')}</div>
    <p class="modal-section-title">Key Outcomes</p>
    <div class="modal-outcomes">${p.outcomes.map(o => `<div class="modal-outcome">${o}</div>`).join('')}</div>
  `;
  document.getElementById('projectModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(e) {
  if (e.target === document.getElementById('projectModal')) closeModalDirect();
}

function closeModalDirect() {
  document.getElementById('projectModal').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModalDirect();
});


