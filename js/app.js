/**
 * app.js
 * -----------------------------------------------------------------
 * PRESENTATION LAYER (Client / Browser Tier)
 * Tanggung jawab: mengontrol DOM, rendering dinamis, event handling.
 * Mengambil data lewat ApiService — tidak pernah fetch() langsung.
 * -----------------------------------------------------------------
 */

const App = (() => {
  'use strict';

  // ---- STATE LOKAL (di memori tab ini) --------------------------
  const state = {
    projects: [],
    services: [],
    profile: null,
    activeFilter: 'Semua',
    orders: []
  };

  // ---- KEAMANAN: sanitasi dasar sebelum masuk ke innerHTML -------
  // Mencegah DOM-based XSS: setiap teks yang berasal dari data
  // (JSON atau input pengguna) WAJIB lewat sini sebelum dirender,
  // supaya tag seperti <script> tidak dieksekusi browser.
  function escapeHTML(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
 }

  // Hanya izinkan URL http/https agar "javascript:..." dari JSON tidak lolos
  function safeUrl(url) {
    try {
      const u = new URL(url, window.location.href);
      return ['http:', 'https:'].includes(u.protocol) ? url : '#';
    } catch {
      return '#';
    }
  }
  // =================================================================
  // 1. RENDER PROFILE (hero, skills, contact, education, experience)
  // =================================================================
  function renderProfile(profile) {
    state.profile = profile;

    document.getElementById('heroName').textContent = profile.name;
    document.getElementById('heroRole').textContent = profile.role;
    document.getElementById('heroBio').textContent = profile.bio;

    const factsEl = document.getElementById('heroFacts');
    factsEl.innerHTML = profile.facts.map(f => `
      <div class="col-6 col-md-3">
        <p class="fact-label">${escapeHTML(f.label)}</p>
        <p class="fact-value">${escapeHTML(f.value)}</p>
      </div>
    `).join('');

    document.getElementById('techStackList').innerHTML = profile.techStack
      .map(t => `<li class="badge custom-badge">${escapeHTML(t)}</li>`).join('');

    document.getElementById('canDoList').innerHTML = profile.canDo
      .map(c => `<li><i class="bi bi-check-circle-fill"></i> ${escapeHTML(c)}</li>`).join('');

    document.getElementById('contactEmail').textContent = profile.contact.email;
    document.getElementById('contactEmail').href = `mailto:${profile.contact.email}`;
    document.getElementById('contactPhone').textContent = profile.contact.phoneDisplay;
    document.getElementById('contactPhone').href = `tel:${profile.contact.phone}`;

    document.getElementById('socialList').innerHTML = profile.socials.map(s => `
      <li><a class="btn custom-btn-ghost btn-sm" href="${escapeHTML(safeUrl(s.url))}" target="_blank" rel="noopener">
        <i class="bi ${escapeHTML(s.icon)}"></i> ${escapeHTML(s.name)}
      </a></li>
    `).join('');

    document.getElementById('timelineList').innerHTML = profile.experience.map(e => `
      <li class="timeline-item">
        <time datetime="${escapeHTML(e.datetime)}">${escapeHTML(e.date)}</time>
        <h3 class="h5">${escapeHTML(e.title)}</h3>
        <p class="timeline-org">${escapeHTML(e.org)}</p>
        <p>${escapeHTML(e.description)}</p>
      </li>
    `).join('');

    document.getElementById('educationList').innerHTML = profile.education.map(ed => `
      <div class="col-md-6">
        <article class="card education-card h-100">
          <div class="card-body">
            <h3 class="h5">${escapeHTML(ed.institution)}</h3>
            <p class="edu-meta">${escapeHTML(ed.meta)}</p>
            <p>${escapeHTML(ed.description)}</p>
          </div>
        </article>
      </div>
    `).join('');
  }

  // =================================================================
  // 2. PROJECTS — Dynamic CSR + 4 UI States + Filter + Modal Universal
  // =================================================================
  const projectsGrid = () => document.getElementById('projectsGrid');
  const projectsLoading = () => document.getElementById('projectsLoading');
  const projectsEmpty = () => document.getElementById('projectsEmpty');
  const projectsError = () => document.getElementById('projectsError');

  function setProjectsUIState(mode) {
    // mode: 'loading' | 'success' | 'empty' | 'error'
    projectsGrid().classList.toggle('d-none', mode !== 'success');
    projectsLoading().classList.toggle('d-none', mode !== 'loading');
    projectsEmpty().classList.toggle('d-none', mode !== 'empty');
    projectsError().classList.toggle('d-none', mode !== 'error');
  }

  function projectCardHTML(p) {
    const banner = p.image
      ? `<img src="${escapeHTML(p.image)}" class="card-banner-img" alt="${escapeHTML(p.title)}">`
      : `<div class="card-banner"><i class="bi ${escapeHTML(p.icon)}"></i></div>`;

    const badgeClass = p.category === 'Independen' ? 'custom-badge-soft' : 'custom-badge-soft-team';
    const metricHTML = p.metric
      ? `<p class="project-metric"><i class="bi bi-graph-up"></i> ${escapeHTML(p.metric)}</p>` : '';

    return `
      <div class="col">
        <article class="card h-100 project-card" data-accent="${escapeHTML(p.accent)}">
          ${banner}
          <div class="card-body d-flex flex-column">
            <span class="badge ${badgeClass} mb-2 align-self-start">${escapeHTML(p.category)}</span>
            <h3 class="card-title h5">${escapeHTML(p.title)}</h3>
            <p class="card-text project-desc">${escapeHTML(p.description)}</p>
            ${metricHTML}
            <ul class="chip-list list-unstyled d-flex flex-wrap gap-1 mb-3">
              ${p.tags.map(t => `<li class="badge custom-badge">${escapeHTML(t)}</li>`).join('')}
            </ul>
            <p class="project-role small mb-3">Peran: ${escapeHTML(p.role)}</p>
            <div class="mt-auto d-flex gap-2">
              <button type="button" class="btn custom-btn-outline btn-sm flex-fill"
                      data-action="open-modal" data-id="${escapeHTML(p.id)}">Detail</button>
              <a class="btn custom-btn-primary btn-sm flex-fill" href="${escapeHTML(safeUrl(p.link))}"
                 target="_blank" rel="noopener">Lihat Proyek</a>
            </div>
          </div>
        </article>
      </div>
    `;
  }

  function renderProjects(list) {
    if (list.length === 0) {
      setProjectsUIState('empty');
      return;
    }
    projectsGrid().innerHTML = list.map(projectCardHTML).join('');
    setProjectsUIState('success');
  }

  function applyFilter(category) {
    state.activeFilter = category;
    document.querySelectorAll('[data-filter]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === category);
    });
    const filtered = category === 'Semua'
      ? state.projects
      : state.projects.filter(p => p.category === category);
    renderProjects(filtered);
  }

  // ---- Universal Dynamic Modal (SATU elemen untuk semua proyek) --
  function openProjectModal(id) {
    const proj = state.projects.find(p => p.id === id);
    if (!proj) return;

    document.getElementById('projectModalTitle').textContent = proj.title;
    document.getElementById('projectModalBody').innerHTML = `
      <p>${escapeHTML(proj.detail)}</p>
      <p class="mb-2"><strong>Tools:</strong> ${proj.tags.map(escapeHTML).join(', ')}</p>
      <p class="mb-0"><strong>Peran:</strong> ${escapeHTML(proj.role)}</p>
    `;
      document.getElementById('projectModalLink').href = safeUrl(proj.link);
    const modalEl = document.getElementById('universalProjectModal');
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
  }

  // =================================================================
  // 3. SERVICES — render katalog layanan (bagian "Service Portal")
  // =================================================================
  function renderServices(list) {
    document.getElementById('servicesGrid').innerHTML = list.map(s => `
      <div class="col-md-4">
        <article class="card h-100 service-card ${s.highlight ? 'service-card-highlight' : ''}">
          <div class="card-body d-flex flex-column">
            ${s.highlight ? '<span class="badge custom-badge-soft mb-2 align-self-start">Populer</span>' : ''}
            <h3 class="h5">${escapeHTML(s.name)}</h3>
            <p class="text-muted small mb-2">${escapeHTML(s.tagline)}</p>
            <p class="project-desc">${escapeHTML(s.description)}</p>
            <ul class="check-list list-unstyled mb-3">
              ${s.features.map(f => `<li><i class="bi bi-check-circle-fill"></i> ${escapeHTML(f)}</li>`).join('')}
            </ul>
            <p class="fw-bold mb-3">${escapeHTML(s.price)}</p>
            <button type="button" class="btn custom-btn-primary mt-auto" data-action="pesan-layanan" data-service="${escapeHTML(s.name)}">
              Pesan Layanan
            </button>
          </div>
        </article>
      </div>
    `).join('');
  }

  function prefillServiceCategory(serviceName) {
    const select = document.getElementById('kategori');
    const match = [...select.options].find(o => o.text.trim() === serviceName.trim());
    if (match) select.value = match.value;

    // Cadangan: kalau nama layanan tidak cocok dengan opsi select,
    // isi pesan otomatis supaya klik tetap menghasilkan efek yang terlihat
    const pesan = document.getElementById('pesan');
    if (!pesan.value) {
      pesan.value = `Halo, saya tertarik dengan layanan "${serviceName}".`;
    }

    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    document.getElementById('nama').focus({ preventScroll: true });
  }

  // =================================================================
  // 4. TOAST NOTIFICATION (feedback visual pengganti alert())
  // =================================================================
  function showToast(title, message, variant = 'success') {
    const container = document.getElementById('toastContainer');
    const id = `toast-${Date.now()}`;
    const icon = variant === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill';
    const bg = variant === 'success' ? 'text-bg-success' : 'text-bg-danger';

    container.insertAdjacentHTML('beforeend', `
      <div id="${id}" class="toast align-items-center ${bg} border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">
            <i class="bi ${icon} me-2"></i><strong>${escapeHTML(title)}</strong><br>${escapeHTML(message)}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Tutup"></button>
        </div>
      </div>
    `);
    const toastEl = document.getElementById(id);
    const toast = new bootstrap.Toast(toastEl, { delay: 4000 });
    toast.show();
    toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
  }

  // =================================================================
  // 5. LOCAL STATE — riwayat pesanan di localStorage
  // =================================================================
  const ORDERS_KEY = 'ppw_service_orders';

  function loadOrdersFromStorage() {
    try {
      state.orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
    } catch {
      state.orders = [];
    }
    updateOrderBadge();
  }

  function saveOrderToStorage(payload) {
    state.orders.unshift({ ...payload, submittedAt: new Date().toISOString() });
    state.orders = state.orders.slice(0, 10); // simpan 10 terakhir saja
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(state.orders));
    } catch (err) {
      console.warn('[App] localStorage tidak tersedia:', err);
    }
    updateOrderBadge();
  }

  function updateOrderBadge() {
    const badge = document.getElementById('orderBadge');
    if (!badge) return;
    if (state.orders.length === 0) {
      badge.classList.add('d-none');
      return;
    }
    badge.classList.remove('d-none');
    badge.textContent = `${state.orders.length} pesan tersimpan lokal`;
    badge.title = state.orders.map(o => `${o.nama} — ${o.kategori}`).join('\n');
  }

  // =================================================================
  // 6. FORM SUBMIT — async, tanpa reload, dengan status tombol
  // =================================================================
  function wireContactForm() {
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }

      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalLabel = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Mengirim...';

      try {
        await ApiService.submitServiceOrder(payload);
        saveOrderToStorage(payload);
        showToast('Pesan Terkirim!', 'Permintaan kamu berhasil diproses. Akan segera saya balas.', 'success');
        form.reset();
        form.classList.remove('was-validated');
      } catch (err) {
        showToast('Gagal Mengirim', 'Terjadi kendala jaringan. Silakan coba lagi sebentar lagi.', 'danger');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalLabel;
      }
    });
  }

  // =================================================================
  // 7. EVENT DELEGATION (satu listener, bukan banyak listener manual)
  // =================================================================
  function wireGlobalEvents() {
    document.addEventListener('click', (e) => {
      const modalBtn = e.target.closest('[data-action="open-modal"]');
      if (modalBtn) return openProjectModal(modalBtn.dataset.id);

      const filterBtn = e.target.closest('[data-filter]');
      if (filterBtn) return applyFilter(filterBtn.dataset.filter);

      const serviceBtn = e.target.closest('[data-action="pesan-layanan"]');
      if (serviceBtn) return prefillServiceCategory(serviceBtn.dataset.service);
    });
  }

  // =================================================================
  // 8. INIT — titik masuk aplikasi
  // =================================================================
  async function init() {
    wireGlobalEvents();
    wireContactForm();
    loadOrdersFromStorage();
    setProjectsUIState('loading');

    // Tiga request tidak saling bergantung, jadi dijalankan bersamaan.
    // allSettled: kegagalan satu file tidak menggagalkan yang lain.
    const [profileRes, servicesRes, projectsRes] = await Promise.allSettled([
      ApiService.getProfile(),
      ApiService.getServices(),
      ApiService.getProjects()
    ]);

    if (profileRes.status === 'fulfilled') {
      renderProfile(profileRes.value);
    } else {
      console.error('[App] Gagal memuat profil:', profileRes.reason);
    }

    if (servicesRes.status === 'fulfilled') {
      state.services = servicesRes.value;
      renderServices(servicesRes.value);
    } else {
      console.error('[App] Gagal memuat layanan:', servicesRes.reason);
    }

    if (projectsRes.status === 'fulfilled') {
      state.projects = projectsRes.value;
      applyFilter('Semua');
    } else {
      console.error('[App] Gagal memuat proyek:', projectsRes.reason);
      setProjectsUIState('error');
    }
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', App.init);