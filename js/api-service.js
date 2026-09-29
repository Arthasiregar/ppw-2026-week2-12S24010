/**
 * api-service.js
 * -----------------------------------------------------------------
 * DATA ACCESS LAYER (Application/API Logic Tier - disimulasikan)
 * Tanggung jawab file ini HANYA satu: mengambil & mengirim data.
 * Tidak ada kode yang menyentuh DOM di sini — itu tugas app.js.
 * -----------------------------------------------------------------
 * Pola: async/await + defensive error handling, sesuai contoh
 * modul (fetchPortfolioData).
 */

const ApiService = (() => {
  'use strict';

  /**
   * Generic JSON fetcher dengan penanganan error yang konsisten.
   * Melempar Error yang jelas kalau response tidak ok (status 4xx/5xx)
   * atau kalau jaringan gagal total (offline, CORS, dll).
   */
  async function fetchJSON(path) {
    try {
      const response = await fetch(path, { cache: 'no-cache' });
      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText} (${path})`);
      }
      return await response.json();
    } catch (err) {
      console.error(`[ApiService] Gagal memuat ${path}:`, err);
      throw err;
    }
  }

  function getProfile() {
    return fetchJSON('./data/profile.json');
  }

  function getProjects() {
    return fetchJSON('./data/projects.json');
  }

  function getServices() {
    return fetchJSON('./data/services.json');
  }

  /**
   * Mock REST endpoint (httpbin.org) — endpoint publik yang cuma
   * "memantulkan" kembali payload yang dikirim, dipakai di sini
   * supaya form benar-benar melakukan HTTP POST asinkron nyata
   * (bisa dilihat & diprofilkan di tab Network DevTools), tanpa
   * perlu membangun backend sungguhan untuk tugas ini.
   */
  const MOCK_ENDPOINT = 'https://httpbin.org/post';

  async function submitServiceOrder(payload) {
    try {
      const response = await fetch(MOCK_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: Gagal mengirim permintaan layanan`);
      }
      return await response.json();
    } catch (err) {
      console.error('[ApiService] submitServiceOrder gagal:', err);
      throw err;
    }
  }

  return { getProfile, getProjects, getServices, submitServiceOrder };
})();