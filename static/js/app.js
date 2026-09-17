const STORAGE_KEY = 'ntt-iot-ideation-radars-v1';

const CHAPTERS = [
  {
    id: 'you',
    name: 'YOU',
    title: 'Vamos começar por si.',
    intro: 'As melhores ideias começam com uma experiência concreta, não com tecnologia.',
    questions: [
      { id: 'name', type: 'text', label: 'Como quer ser identificado neste radar?', helper: 'Pode usar o seu primeiro nome, nome de equipa ou um alias.', placeholder: 'Ex.: Inês · Equipa de Operações' },
      { id: 'role', type: 'choice', label: 'De onde observa o mundo?', helper: 'Escolha o papel que mais se aproxima do seu dia a dia.', options: ['Operações no terreno', 'Atendimento e experiência', 'Gestão e decisão', 'Tecnologia e dados', 'Outro'] }
    ]
  },
  {
    id: 'your-world',
    name: 'YOUR WORLD',
    title: 'Olhe à sua volta.',
    intro: 'Pense num momento real: pessoas, ativos e lugares a fazerem o seu trabalho.',
    questions: [
      { id: 'world', type: 'textarea', label: 'Que espaço físico, operação ou rotina conhece bem?', helper: 'Descreva o que acontece no local — não a solução. Quem está lá? O que se move? O que tem de ser observado?', placeholder: 'Ex.: Uma equipa percorre um armazém várias vezes por turno para confirmar...' },
      { id: 'friction', type: 'textarea', label: 'Onde sente fricção, espera ou desperdício?', helper: 'Procure o momento que se repete, que depende de memória ou que só descobrimos demasiado tarde.', placeholder: 'Ex.: Só percebemos que algo ficou parado quando...' }
    ]
  },
  {
    id: 'your-platform',
    name: 'YOUR PLATFORM',
    title: 'O que já existe?',
    intro: 'Uma oportunidade forte aproveita sinais e capacidades que já estão perto.',
    questions: [
      { id: 'signals', type: 'multi', label: 'Que sinais já consegue observar hoje?', helper: 'Selecione todos os que fazem parte deste mundo.', options: ['Localização e movimento', 'Temperatura, energia ou ambiente', 'Estado de um ativo', 'Comportamento de pessoas', 'Imagens ou vídeo', 'Nenhum sinal fiável ainda'] },
      { id: 'data', type: 'choice', label: 'Como circula hoje essa informação?', helper: 'Não há problema se a resposta for “não circula”.', options: ['Em tempo real', 'Em relatórios periódicos', 'Em folhas, mensagens ou chamadas', 'Fica na cabeça de alguém', 'Ainda não é recolhida'] }
    ]
  },
  {
    id: 'another-world',
    name: 'ANOTHER WORLD',
    title: 'Imagine o mundo depois do sinal.',
    intro: 'Não salte para a app. Imagine primeiro uma reação melhor no mundo físico.',
    questions: [
      { id: 'future', type: 'textarea', label: 'Se pudesse dar visão a esta situação, o que mudaria primeiro?', helper: 'Complete: “A pessoa certa saberia que ___ antes de ___.”', placeholder: 'Ex.: A pessoa certa saberia que uma intervenção era necessária antes de a operação parar.' },
      { id: 'impact', type: 'choice', label: 'Qual seria o primeiro ganho visível?', helper: 'Escolha o efeito que gostaria de observar no terreno.', options: ['Menos tempo perdido', 'Mais segurança e confiança', 'Decisões no momento certo', 'Menos energia e desperdício', 'Uma experiência mais simples'] }
    ]
  },
  {
    id: 'break-idea',
    name: 'BREAK THE IDEA',
    title: 'Agora vamos torná-la melhor.',
    intro: 'Uma boa ideia IoT não é vigiar tudo. É criar a intervenção certa, no lugar certo.',
    questions: [
      { id: 'boundary', type: 'choice', label: 'O que nunca deveria acontecer?', helper: 'Esta fronteira torna a oportunidade mais humana e mais implementável.', options: ['Recolher dados sem propósito', 'Criar mais alertas do que ações', 'Tornar o trabalho mais lento', 'Expor pessoas desnecessariamente', 'Ficar dependente de uma única tecnologia'] },
      { id: 'confidence', type: 'range', label: 'Quanto acredita que esta oportunidade pode ser testada?', helper: 'Pense nos dados, pessoas e espaço físico que já tem ao alcance.', min: 1, max: 5, labels: ['Ainda é uma hipótese', 'Consigo testar já'] }
    ]
  },
  {
    id: 'edp',
    name: 'EDP',
    title: 'Traga a lente da energia.',
    intro: 'Onde é que uma visão mais inteligente do mundo físico pode tornar a energia mais segura, eficiente ou útil?',
    questions: [
      { id: 'energy', type: 'choice', label: 'Que ligação à energia vê nesta oportunidade?', helper: 'Escolha a ligação mais natural — não precisa de forçar uma resposta.', options: ['Produção e ativos', 'Rede e infraestrutura', 'Consumo e eficiência', 'Mobilidade e carregamento', 'Resiliência e segurança', 'Ainda não vejo uma ligação'] },
      { id: 'edp_role', type: 'textarea', label: 'Que papel poderia desempenhar uma empresa de energia?', helper: 'Pense em dados, confiança, ativos, proximidade ou capacidade de agir.', placeholder: 'Ex.: Usar a rede e os seus sinais para...' }
    ]
  },
  {
    id: 'your-bet',
    name: 'YOUR BET',
    title: 'Faça a sua aposta.',
    intro: 'Junte o sinal, a fricção e a primeira experiência que vale a pena testar.',
    questions: [
      { id: 'bet', type: 'textarea', label: 'Qual é a sua oportunidade IoT em uma frase?', helper: 'Use este molde: “Ajudar [quem] a [agir melhor] ao [detetar/prever] [sinal].”', placeholder: 'Ex.: Ajudar equipas de manutenção a agir antes da falha ao detetar alterações no estado do ativo.' },
      { id: 'next', type: 'choice', label: 'Qual seria o primeiro passo na próxima semana?', helper: 'Uma aposta começa pequena, observável e com uma pessoa real.', options: ['Observar uma operação no local', 'Falar com utilizadores e equipas', 'Mapear os sinais disponíveis', 'Prototipar uma alerta ou visualização', 'Escolher um ativo para piloto'] }
    ]
  }
];

const ACHIEVEMENTS = [
  { id: '01', title: 'Grounded', text: 'Começou num mundo físico real.', test: (a) => !!a.world },
  { id: '02', title: 'Friction finder', text: 'Encontrou o ponto de fricção.', test: (a) => !!a.friction },
  { id: '03', title: 'Signal hunter', text: 'Identificou sinais observáveis.', test: (a) => !!a.signals && !a.signals.includes('Nenhum sinal fiável ainda') },
  { id: '04', title: 'Human first', text: 'Definiu um ganho para as pessoas.', test: (a) => !!a.impact },
  { id: '05', title: 'Reality check', text: 'Colocou uma fronteira na ideia.', test: (a) => !!a.boundary },
  { id: '06', title: 'Made a bet', text: 'Escolheu um primeiro passo.', test: (a) => !!a.bet && !!a.next }
];

const state = { chapterIndex: 0, questionIndex: 0, answers: {}, completed: false, unlocked: [] };

function currentChapter() { return CHAPTERS[state.chapterIndex]; }
function currentQuestion() { return currentChapter().questions[state.questionIndex]; }
function allQuestions() { return CHAPTERS.reduce((all, chapter) => all.concat(chapter.questions), []); }
function questionNumber() { return CHAPTERS.slice(0, state.chapterIndex).reduce((n, chapter) => n + chapter.questions.length, 0) + state.questionIndex + 1; }
function totalQuestions() { return allQuestions().length; }

function readRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.warn('Não foi possível ler os IoT Radars locais.', error);
    return [];
  }
}

function writeRecords(records) { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); }
function escapeHtml(value) {
  return String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function updateUnlocked() {
  state.unlocked = ACHIEVEMENTS.filter((achievement) => achievement.test(state.answers)).map((achievement) => achievement.id);
}

function renderRail() {
  const rail = document.getElementById('chapter-rail');
  if (!rail) return;
  rail.innerHTML = CHAPTERS.map((chapter, index) => `
    <div class="rail-item ${index === state.chapterIndex ? 'active' : ''} ${index < state.chapterIndex || state.completed ? 'visited' : ''}">
      <span class="rail-number">0${index + 1}</span><span>${chapter.name}</span>
    </div>
  `).join('');
}

function renderAchievements() {
  const strip = document.getElementById('achievement-strip');
  if (!strip) return;
  strip.innerHTML = ACHIEVEMENTS.map((achievement) => `
    <div class="achievement ${state.unlocked.includes(achievement.id) ? 'unlocked' : ''}" title="${achievement.text}">
      <span>${achievement.id}</span><strong>${achievement.title}</strong>
    </div>
  `).join('');
}

function renderProgress() {
  const chapter = currentChapter();
  const ratio = (questionNumber() / totalQuestions()) * 100;
  document.getElementById('chapter-kicker').textContent = `CAPÍTULO 0${state.chapterIndex + 1} · ${chapter.name}`;
  document.getElementById('chapter-title').textContent = chapter.title;
  document.getElementById('progress-text').textContent = `${String(questionNumber()).padStart(2, '0')} de ${String(totalQuestions()).padStart(2, '0')}`;
  document.getElementById('progress-fill').style.width = `${ratio}%`;
  document.getElementById('progress-time').textContent = state.chapterIndex === 6 ? 'último capítulo' : '8–12 min no total';
}

function renderField(question) {
  const answer = state.answers[question.id];
  if (question.type === 'textarea') return `<textarea id="answer-field" data-answer="${question.id}" placeholder="${question.placeholder}" aria-label="${question.label}">${escapeHtml(answer)}</textarea>`;
  if (question.type === 'text') return `<input id="answer-field" data-answer="${question.id}" type="text" value="${escapeHtml(answer)}" placeholder="${question.placeholder}" aria-label="${question.label}" />`;
  if (question.type === 'choice') return `<div class="choice-grid">${question.options.map((option) => `<button type="button" class="choice-card ${answer === option ? 'selected' : ''}" data-choice="${escapeHtml(option)}"><span class="choice-dot"></span>${option}</button>`).join('')}</div>`;
  if (question.type === 'multi') {
    const selected = Array.isArray(answer) ? answer : [];
    return `<div class="choice-grid multi">${question.options.map((option) => `<button type="button" class="choice-card ${selected.includes(option) ? 'selected' : ''}" data-choice="${escapeHtml(option)}"><span class="choice-check">${selected.includes(option) ? '✓' : ''}</span>${option}</button>`).join('')}</div>`;
  }
  const value = answer || 3;
  return `<div class="range-wrap"><input id="answer-field" type="range" min="${question.min}" max="${question.max}" value="${value}" aria-label="${question.label}" /><div class="range-labels"><span>${question.labels[0]}</span><strong id="range-value">${value}/5</strong><span>${question.labels[1]}</span></div></div>`;
}

function renderQuestion() {
  const shell = document.getElementById('step-shell');
  const question = currentQuestion();
  const answer = state.answers[question.id];
  shell.innerHTML = `
    <div class="question-meta"><span class="question-index">0${state.chapterIndex + 1}</span><span class="question-type">${question.type === 'multi' ? 'escolha múltipla' : 'pergunta de reflexão'}</span></div>
    <h3>${question.label}</h3><p>${question.helper}</p>
    <div class="field-wrap">${renderField(question)}</div>
    <div id="field-error" class="field-error"></div>
  `;
  if (question.type === 'range') document.getElementById('answer-field').addEventListener('input', (event) => { document.getElementById('range-value').textContent = `${event.target.value}/5`; });
  document.getElementById('back-btn').disabled = state.chapterIndex === 0 && state.questionIndex === 0;
  document.getElementById('next-btn').innerHTML = questionNumber() === totalQuestions() ? 'Ver o meu IoT Radar <span>↗</span>' : 'Continuar <span>→</span>';
  renderProgress(); renderRail(); renderAchievements();
}

function captureAnswer() {
  const question = currentQuestion();
  if (question.type === 'choice') {
    if (!state.answers[question.id]) return false;
    return true;
  }
  if (question.type === 'multi') return Array.isArray(state.answers[question.id]) && state.answers[question.id].length > 0;
  const field = document.getElementById('answer-field');
  if (!field || !String(field.value).trim()) return false;
  state.answers[question.id] = question.type === 'range' ? Number(field.value) : field.value.trim();
  return true;
}

function showError() { const error = document.getElementById('field-error'); if (error) error.textContent = 'Escolha ou escreva uma resposta para continuar.'; }

function bindChoices() {
  document.querySelectorAll('[data-choice]').forEach((button) => button.addEventListener('click', () => {
    const question = currentQuestion();
    const choice = button.getAttribute('data-choice');
    if (question.type === 'multi') {
      const selected = Array.isArray(state.answers[question.id]) ? state.answers[question.id] : [];
      state.answers[question.id] = selected.includes(choice) ? selected.filter((item) => item !== choice) : selected.concat(choice);
    } else state.answers[question.id] = choice;
    updateUnlocked(); renderQuestion();
  }));
}

function next() {
  if (!captureAnswer()) { showError(); return; }
  updateUnlocked();
  if (state.questionIndex < currentChapter().questions.length - 1) state.questionIndex += 1;
  else if (state.chapterIndex < CHAPTERS.length - 1) { state.chapterIndex += 1; state.questionIndex = 0; }
  else { finish(); return; }
  renderQuestion(); bindChoices();
}

function back() {
  if (state.questionIndex > 0) state.questionIndex -= 1;
  else if (state.chapterIndex > 0) { state.chapterIndex -= 1; state.questionIndex = currentChapter().questions.length - 1; }
  renderQuestion(); bindChoices();
}

function radarData() {
  const score = (keys) => keys.reduce((total, key) => total + (state.answers[key] ? 1 : 0), 0);
  return [
    ['Fricção humana', Math.min(100, score(['world', 'friction', 'impact']) * 33)],
    ['Sinais disponíveis', Math.min(100, score(['signals', 'data']) * 50)],
    ['Ação no terreno', Math.min(100, score(['future', 'next', 'bet']) * 33)],
    ['Energia & ativos', Math.min(100, score(['energy', 'edp_role']) * 50)],
    ['Prontidão para testar', Number(state.answers.confidence || 1) * 20]
  ];
}

function buildOpportunityCard() {
  const title = state.answers.bet || 'Uma oportunidade IoT por explorar';
  return { title, signal: state.answers.signals || 'Sinais a mapear', user: state.answers.role || 'Equipa no terreno', friction: state.answers.friction || 'Fricção a observar', action: state.answers.next || 'Observar uma operação no local', impact: state.answers.impact || 'Decisões no momento certo' };
}

function finish() {
  updateUnlocked(); state.completed = true;
  const record = { id: `radar-${Date.now()}`, createdAt: new Date().toISOString(), syncStatus: 'pending', syncMessage: 'IoT Radar guardado localmente e pendente de sincronização.', answers: { ...state.answers }, achievements: [...state.unlocked], radar: radarData(), opportunity: buildOpportunityCard() };
  const records = readRecords(); records.push(record); writeRecords(records);
  const shell = document.getElementById('step-shell');
  shell.innerHTML = `<div class="radar-result"><div class="result-badge">✦ RADAR GERADO</div><h3>Este é o seu sinal.</h3><p class="result-lede">Uma hipótese concreta para levar da conversa para o mundo real.</p><div class="opportunity-card"><span class="card-label">OPPORTUNITY CARD · 01</span><h4>${escapeHtml(record.opportunity.title)}</h4><div class="opportunity-grid"><div><span>SINAL</span><strong>${escapeHtml(record.opportunity.signal)}</strong></div><div><span>PARA QUEM</span><strong>${escapeHtml(record.opportunity.user)}</strong></div><div><span>PRIMEIRO PASSO</span><strong>${escapeHtml(record.opportunity.action)}</strong></div><div><span>GANHO</span><strong>${escapeHtml(record.opportunity.impact)}</strong></div></div></div><div class="radar-bars">${record.radar.map((item) => `<div class="radar-row"><span>${item[0]}</span><div><i style="width:${item[1]}%"></i></div><strong>${item[1]}%</strong></div>`).join('')}</div><p class="sync-note">Guardado neste dispositivo. O facilitador poderá vê-lo na vista de resultados.</p></div>`;
  document.getElementById('back-btn').disabled = true; document.getElementById('next-btn').textContent = 'Começar outra conversa'; document.getElementById('next-btn').onclick = () => window.location.reload(); updateProgress(); renderRail(); renderAchievements(); updateSyncBanner();
}

function retrySync() {
  const records = readRecords().map((record) => record.syncStatus === 'pending' ? { ...record, syncStatus: 'synced', syncedAt: new Date().toISOString(), syncMessage: 'Sincronização local confirmada.' } : record);
  writeRecords(records); updateSyncBanner();
}
function updateSyncBanner() { const banner = document.getElementById('sync-banner'); const pending = readRecords().filter((record) => record.syncStatus === 'pending').length; if (!pending) { banner.classList.add('hidden'); return; } banner.classList.remove('hidden'); banner.textContent = `${pending} radar${pending > 1 ? 's' : ''} pendente${pending > 1 ? 's' : ''} · tentar novamente`; }

function init() {
  renderQuestion(); bindChoices(); updateSyncBanner();
  document.getElementById('next-btn').addEventListener('click', () => { if (state.completed) window.location.reload(); else next(); });
  document.getElementById('back-btn').addEventListener('click', back);
  document.getElementById('sync-banner').addEventListener('click', retrySync);
}
window.addEventListener('DOMContentLoaded', init);
