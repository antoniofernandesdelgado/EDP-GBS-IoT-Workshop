const STORAGE_KEY = 'ntt-iot-ideation-radars-v1';

function readRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.warn('Não foi possível ler os IoT Radars.', error);
    return [];
  }
}

function writeRecords(records) { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); }
function escapeHtml(value) { return String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;'); }
function formatDate(value) { return new Intl.DateTimeFormat('pt-PT', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)); }

function renderStats(records) {
  const target = document.getElementById('stats-grid');
  const pending = records.filter((record) => record.syncStatus === 'pending').length;
  const achievements = records.reduce((total, record) => total + (record.achievements || []).length, 0);
  const average = records.length ? Math.round(records.reduce((total, record) => total + (record.radar || []).reduce((sum, item) => sum + item[1], 0) / Math.max(1, (record.radar || []).length), 0) / records.length) : 0;
  target.innerHTML = `
    <article class="stat-card"><span class="label">IoT Radars</span><span class="value">${records.length}</span></article>
    <article class="stat-card"><span class="label">Opportunity cards</span><span class="value">${records.filter((record) => record.opportunity).length}</span></article>
    <article class="stat-card"><span class="label">Achievements</span><span class="value">${achievements}</span></article>
    <article class="stat-card"><span class="label">Radar médio</span><span class="value">${average}%</span></article>
  `;
  const status = document.getElementById('admin-status');
  status.textContent = pending ? `${pending} pendente${pending > 1 ? 's' : ''}` : 'Tudo sincronizado';
  status.classList.toggle('warning', pending > 0);
}

function renderSignals(records) {
  const target = document.getElementById('signal-summary');
  const counts = {};
  records.forEach((record) => {
    const signals = Array.isArray(record.answers?.signals) ? record.answers.signals : [record.answers?.signals];
    signals.filter(Boolean).forEach((signal) => { counts[signal] = (counts[signal] || 0) + 1; });
  });
  const fallback = ['Localização e movimento', 'Estado de um ativo', 'Temperatura, energia ou ambiente', 'Comportamento de pessoas', 'Imagens ou vídeo'];
  target.innerHTML = fallback.map((signal) => `<div class="signal-chip"><strong>${counts[signal] || 0}</strong><span>${escapeHtml(signal)}</span></div>`).join('');
}

function renderTable() {
  const records = readRecords();
  renderStats(records);
  renderSignals(records);
  const body = document.getElementById('responses-body');
  if (!records.length) {
    body.innerHTML = '<tr><td colspan="7" class="empty-state">Ainda não existem IoT Radars. Abra a experiência participante e complete uma conversa.</td></tr>';
    return;
  }
  body.innerHTML = records.slice().reverse().map((record) => {
    const answers = record.answers || {};
    const card = record.opportunity || {};
    const chapters = Object.keys(answers).length;
    const radar = record.radar && record.radar.length ? `${Math.round(record.radar.reduce((sum, item) => sum + item[1], 0) / record.radar.length)}%` : '—';
    return `<tr>
      <td><strong>${escapeHtml(answers.name || 'Participante sem nome')}</strong><div class="meta">${escapeHtml(answers.role || '')}</div></td>
      <td><strong>${escapeHtml(card.title || 'Sem card')}</strong><div class="meta">${escapeHtml(card.impact || '')}</div></td>
      <td>${chapters ? `${chapters} sinais` : '—'}<div class="meta">${(record.achievements || []).length}/6 achievements</div></td>
      <td><strong>${radar}</strong><div class="meta">${escapeHtml(answers.energy || 'Sem lente energética')}</div></td>
      <td><span class="row-status ${record.syncStatus === 'pending' ? 'pending' : 'synced'}">${record.syncStatus === 'pending' ? 'Pendente' : 'Guardado'}</span></td>
      <td>${formatDate(record.createdAt)}</td>
      <td>${record.syncStatus === 'pending' ? `<button class="row-action" data-action="retry" data-id="${record.id}" type="button">Reenviar</button>` : '<span class="meta">OK</span>'}</td>
    </tr>`;
  }).join('');
}

function retryAll() {
  writeRecords(readRecords().map((record) => record.syncStatus === 'pending' ? { ...record, syncStatus: 'synced', syncedAt: new Date().toISOString(), syncMessage: 'Sincronização confirmada pelo facilitador.' } : record));
  renderTable();
}

function exportCsv() {
  const records = readRecords();
  if (!records.length) return;
  const headers = ['id', 'createdAt', 'participante', 'funcao', 'mundo', 'friccao', 'sinais', 'oportunidade', 'primeiro_passo', 'ganho', 'achievements', 'radar_medio', 'syncStatus'];
  const rows = records.map((record) => {
    const a = record.answers || {};
    const card = record.opportunity || {};
    const radar = record.radar && record.radar.length ? Math.round(record.radar.reduce((sum, item) => sum + item[1], 0) / record.radar.length) : '';
    return [record.id, record.createdAt, a.name, a.role, a.world, a.friction, Array.isArray(a.signals) ? a.signals.join(' | ') : a.signals, card.title, card.action, card.impact, (record.achievements || []).join(' | '), radar, record.syncStatus].map((cell) => `"${String(cell || '').replace(/"/g, '""')}"`).join(',');
  });
  const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = 'ntt-data-iot-radars.csv'; link.click(); URL.revokeObjectURL(url);
}

function init() {
  renderTable();
  document.getElementById('retry-all-btn').addEventListener('click', retryAll);
  document.getElementById('export-btn').addEventListener('click', exportCsv);
  document.getElementById('responses-body').addEventListener('click', (event) => {
    const button = event.target.closest('[data-action="retry"]');
    if (!button) return;
    const id = button.getAttribute('data-id');
    writeRecords(readRecords().map((record) => record.id === id ? { ...record, syncStatus: 'synced', syncedAt: new Date().toISOString(), syncMessage: 'Sincronização confirmada pelo facilitador.' } : record));
    renderTable();
  });
}
window.addEventListener('DOMContentLoaded', init);
