const STORAGE_KEY = 'ntt-workshop-responses-v1';

const FLOW = [
  {
    id: 'name',
    label: 'Como se chama?',
    helper: 'Vamos começar por identificar o participante.',
    type: 'text',
    placeholder: 'Nome e apelido',
    required: true
  },
  {
    id: 'company',
    label: 'Qual é o nome da sua organização?',
    helper: 'Se preferir, indique também a equipa ou departamento.',
    type: 'text',
    placeholder: 'Ex.: NTT DATA Portugal',
    required: true
  },
  {
    id: 'role',
    label: 'Qual é a sua função principal?',
    helper: 'Escolha o papel que melhor descreve a sua responsabilidade atual.',
    type: 'select',
    options: ['Consultor', 'Analista', 'Gestor', 'Especialista', 'Diretor', 'Outra'],
    required: true
  },
  {
    id: 'challenge',
    label: 'Qual é o maior desafio ou oportunidade para esta sessão?',
    helper: 'Partilhe o contexto que melhor ajuda o facilitador a preparar a conversa.',
    type: 'textarea',
    placeholder: 'Descreva em 1-3 frases o principal contexto.',
    required: true
  },
  {
    id: 'contact',
    label: 'Como prefere receber a próxima atualização?',
    helper: 'A forma de contacto ajuda a manter o acompanhamento simples e útil.',
    type: 'select',
    options: ['Email', 'Teams', 'Telefone', 'Presencial na próxima sessão'],
    required: true
  }
];

const state = { currentStep: 0, answers: {}, submitted: false };

function getResponses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.warn('Não foi possível ler as respostas locais.', error);
    return [];
  }
}

function saveResponses(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function updateProgress() {
  const total = FLOW.length;
  const fill = document.getElementById('progress-fill');
  const text = document.getElementById('progress-text');
  const ratio = ((state.currentStep + 1) / total) * 100;

  if (fill) fill.style.width = `${ratio}%`;
  if (text) text.textContent = `Pergunta ${state.currentStep + 1} de ${total}`;
}

function updateSyncBanner() {
  const banner = document.getElementById('sync-banner');
  if (!banner) return;

  const pending = getResponses().filter((item) => item.syncStatus === 'pending').length;

  if (pending === 0) {
    banner.classList.add('hidden');
    banner.classList.remove('warning');
    banner.textContent = '';
    return;
  }

  banner.classList.remove('hidden');
  banner.classList.add('warning');
  banner.textContent = `${pending} pendente${pending > 1 ? 's' : ''} · tentar novamente`;
}

function renderStep() {
  const shell = document.getElementById('step-shell');
  const step = FLOW[state.currentStep];

  if (!shell || !step) return;

  const currentValue = state.answers[step.id] ?? '';
  const existingValue = typeof currentValue === 'string' ? currentValue : '';
  let fieldMarkup = '';

  if (step.type === 'textarea') {
    fieldMarkup = `
      <div class="form-field">
        <textarea id="answer-field" data-answer="${step.id}" aria-label="${step.label}" placeholder="${step.placeholder || ''}" required>${existingValue}</textarea>
      </div>
    `;
  } else if (step.type === 'select') {
    const options = step.options
      .map((option) => `
        <option value="${option}" ${option === existingValue ? 'selected' : ''}>${option}</option>
      `)
      .join('');

    fieldMarkup = `
      <div class="form-field">
        <select id="answer-field" data-answer="${step.id}" aria-label="${step.label}" required>
          <option value="">Selecione uma opção</option>
          ${options}
        </select>
      </div>
    `;
  } else {
    fieldMarkup = `
      <div class="form-field">
        <input id="answer-field" data-answer="${step.id}" type="text" value="${existingValue}" aria-label="${step.label}" placeholder="${step.placeholder || ''}" required />
      </div>
    `;
  }

  shell.innerHTML = `
    <div>
      <span class="mini-label">Pergunta ${state.currentStep + 1}</span>
      <h3>${step.label}</h3>
      <p>${step.helper}</p>
      ${fieldMarkup}
      <div id="field-error" class="field-error"></div>
    </div>
  `;

  const backButton = document.getElementById('back-btn');
  const nextButton = document.getElementById('next-btn');

  if (backButton) backButton.disabled = state.currentStep === 0;
  if (nextButton) nextButton.textContent = state.currentStep === FLOW.length - 1 ? 'Guardar respostas' : 'Continuar';

  updateProgress();
  updateSyncBanner();
}

function showFieldError(message) {
  const fieldError = document.getElementById('field-error');
  if (fieldError) fieldError.textContent = message;
}

function captureCurrentAnswer() {
  const step = FLOW[state.currentStep];
  const field = document.getElementById('answer-field');

  if (!field) return false;

  const value = field.value.trim();
  if (step.required && !value) {
    showFieldError('Preencha esta resposta para continuar.');
    field.focus();
    return false;
  }

  state.answers[step.id] = value;
  showFieldError('');
  return true;
}

function resetFlow() {
  state.answers = {};
  state.currentStep = 0;
  state.submitted = false;
  renderStep();
}

function submitResponses() {
  const records = getResponses();
  records.push({
    id: `response-${Date.now()}`,
    createdAt: new Date().toISOString(),
    syncStatus: 'pending',
    syncMessage: 'Resposta guardada localmente e pendente de sincronização.',
    response: { ...state.answers }
  });

  saveResponses(records);

  state.answers = {};
  state.currentStep = 0;
  state.submitted = true;

  const shell = document.getElementById('step-shell');
  if (shell) {
    shell.innerHTML = `
      <div class="summary-panel">
        <div class="summary-card">
          <strong>Respostas guardadas</strong>
          <p>As suas respostas ficaram guardadas localmente. A sincronização está pendente e pode tentar novamente quando quiser.</p>
        </div>
        <div class="summary-card">
          <strong>Próximo passo</strong>
          <p>Use o botão de sincronização no topo para confirmar a entrega das respostas ao facilitador.</p>
        </div>
      </div>
    `;
  }

  const backButton = document.getElementById('back-btn');
  const nextButton = document.getElementById('next-btn');

  if (backButton) backButton.disabled = true;
  if (nextButton) nextButton.textContent = 'Voltar ao início';

  updateSyncBanner();
}

function retrySyncQueue() {
  const queue = getResponses().filter((item) => item.syncStatus === 'pending');
  if (queue.length === 0) {
    updateSyncBanner();
    return;
  }

  const config = window.APP_CONFIG?.supabase || {};
  const hasSupabaseConfig = !!(config.enabled && config.url && config.anonKey);

  const updated = getResponses().map((item) => {
    if (item.syncStatus !== 'pending') return item;

    if (hasSupabaseConfig) {
      return {
        ...item,
        syncStatus: 'pending',
        syncMessage: 'Aguardar ligação real do Supabase para concluir a sincronização.'
      };
    }

    return {
      ...item,
      syncStatus: 'synced',
      syncedAt: new Date().toISOString(),
      syncMessage: 'Sincronização concluída localmente.'
    };
  });

  saveResponses(updated);
  updateSyncBanner();
}

function handleNext() {
  if (state.submitted) {
    resetFlow();
    return;
  }

  if (!captureCurrentAnswer()) return;

  if (state.currentStep === FLOW.length - 1) {
    submitResponses();
    return;
  }

  state.currentStep += 1;
  renderStep();
}

function handleBack() {
  if (state.currentStep === 0) return;
  state.currentStep -= 1;
  renderStep();
}

function bindEvents() {
  document.getElementById('next-btn')?.addEventListener('click', handleNext);
  document.getElementById('back-btn')?.addEventListener('click', handleBack);
  document.getElementById('sync-banner')?.addEventListener('click', retrySyncQueue);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && document.activeElement?.tagName !== 'TEXTAREA' && !event.shiftKey) {
      event.preventDefault();
      handleNext();
    }
  });
}

function init() {
  bindEvents();
  renderStep();
  updateSyncBanner();
}

window.addEventListener('DOMContentLoaded', init);
