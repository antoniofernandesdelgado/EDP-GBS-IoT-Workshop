const STORAGE_KEY = 'ntt-workshop-responses-v1';

function getResponses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.warn('Não foi possível ler os dados do facilitador.', error);
    return [];
  }
}

function saveResponses(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function formatDate(dateValue) {
  const date = new Date(dateValue || Date.now());
  return new Intl.DateTimeFormat('pt-PT', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderStats(items) {
  const statsGrid = document.getElementById('stats-grid');
  if (!statsGrid) return;

  const total = items.length;
  const pending = items.filter((item) => item.syncStatus === 'pending').length;
  const synced = items.filter((item) => item.syncStatus === 'synced').length;

  const latest = items.reduce((max, item) => {
    if (!max) return item;
    return new Date(item.createdAt) > new Date(max.createdAt) ? item : max;
  }, null);

  const latestLabel = latest
    ? new Intl.DateTimeFormat('pt-PT', {
        day: '2-digit',
        month: '2-digit'
      }).format(new Date(latest.createdAt))
    : '--';

  statsGrid.innerHTML = `
    <article class="stat-card">
      <span class="label">Participantes</span>
      <span class="value">${total}</span>
    </article>
    <article class="stat-card">
      <span class="label">Sincronizados</span>
      <span class="value">${synced}</span>
    </article>
    <article class="stat-card">
      <span class="label">Pendentes</span>
      <span class="value">${pending}</span>
    </article>
    <article class="stat-card">
      <span class="label">Última resposta</span>
      <span class="value">${latestLabel}</span>
    </article>
  `;
}

function retryPendingSync() {
  const all = getResponses();
  const pending = all.filter((item) => item.syncStatus === 'pending');

  if (pending.length === 0) {
    const status = document.getElementById('admin-status');
    if (status) status.textContent = 'Sem pendências';
    renderTable();
    return;
  }

  const updated = all.map((item) => {
    if (item.syncStatus !== 'pending') return item;

    return {
      ...item,
      syncStatus: 'synced',
      syncedAt: new Date().toISOString(),
      syncMessage: 'Sincronização simulada pelo facilitador.'
    };
  });

  saveResponses(updated);
  renderTable();
}

function renderTable() {
  const body = document.getElementById('responses-body');
  const status = document.getElementById('admin-status');

  if (!body) return;

  const items = getResponses();
  const pending = items.filter((item) => item.syncStatus === 'pending').length;

  if (status) {
    status.textContent = pending > 0 ? `${pending} pendente${pending > 1 ? 's' : ''}` : 'Tudo sincronizado';
    status.classList.toggle('warning', pending > 0);
    status.classList.toggle('status-pill-muted', pending === 0);
  }

  if (items.length === 0) {
    body.innerHTML = '<tr><td colspan="7" class="empty-state">Ainda não existem respostas guardadas localmente.</td></tr>';
    renderStats(items);
    return;
  }

  body.innerHTML = items
    .map((item) => {
      const response = item.response || {};
      const name = response.name || 'Não informado';
      const company = response.company || 'Não informado';
      const role = response.role || 'Não informado';
      const challenge = response.challenge || 'Não informado';
      const statusText = item.syncStatus === 'pending' ? 'Pendente' : 'Sincronizado';
      const statusClass = item.syncStatus === 'pending' ? 'pending' : 'synced';

      return `
        <tr>
          <td>
            <strong>${escapeHtml(name)}</strong>
            <div class="meta">${escapeHtml(item.syncMessage || 'Sem mensagem')}</div>
          </td>
          <td>${escapeHtml(company)}</td>
          <td>${escapeHtml(role)}</td>
          <td>${escapeHtml(challenge)}</td>
          <td><span class="row-status ${statusClass}">${statusText}</span></td>
          <td>${formatDate(item.createdAt)}</td>
          <td>
            ${
              item.syncStatus === 'pending'
                ? '<button class="row-action" type="button" data-action="retry" data-id="' + item.id + '">Reenviar</button>'
                : '<span class="meta">A verificar</span>'
            }
          </td>
        </tr>
      `;
    })
    .join('');

  renderStats(items);
}

function exportCsv() {
  const items = getResponses();
  if (items.length === 0) return;

  const headers = ['id', 'createdAt', 'nome', 'empresa', 'cargo', 'desafio', 'canal', 'syncStatus', 'syncMessage'];
  const rows = items.map((item) => {
    const response = item.response || {};
    return [
      item.id,
      item.createdAt,
      response.name || '',
      response.company || '',
      response.role || '',
      response.challenge || '',
      response.contact || '',
      item.syncStatus || '',
      item.syncMessage || ''
    ]
      .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
      .join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'ntt-data-workshop-respostas.csv';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function bindEvents() {
  document.getElementById('export-btn')?.addEventListener('click', exportCsv);
  document.getElementById('retry-all-btn')?.addEventListener('click', retryPendingSync);

  document.getElementById('responses-body')?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action="retry"]');
    if (!button) return;

    const itemId = button.getAttribute('data-id');
    const updated = getResponses().map((item) => {
      if (item.id !== itemId) return item;
      return {
        ...item,
        syncStatus: 'synced',
        syncedAt: new Date().toISOString(),
        syncMessage: 'Sincronização solicitada pelo facilitador.'
      };
    });

    saveResponses(updated);
    renderTable();
  });
}

function init() {
  bindEvents();
  renderTable();
}

window.addEventListener('DOMContentLoaded', init);
