/* Interface, local progress and navigation. Questions live in question-bank.js. */
(() => {
  'use strict';
  const topics = [
    { id: 'algebra', name: 'Algebra', icon: '⌘' }, { id: 'functions', name: 'Functions', icon: 'ƒ' },
    { id: 'calculus', name: 'Calculus', icon: '∫' }, { id: 'vectors', name: 'Vectors', icon: '↗' },
    { id: 'complex', name: 'Complex Numbers', icon: 'ℂ' }, { id: 'mechanics', name: 'Mechanics', icon: '↘' },
    { id: 'probability', name: 'Probability', icon: '◉' }, { id: 'trigonometry', name: 'Trigonometry', icon: '∿' }
  ];
  const difficulties = SpecialistQuestionBank.levels;
  const STORAGE_KEY = 'specialistMathsPractice.v1';
  const THEME_KEY = 'specialistMathsTheme';
  const blankMode = () => ({ attempted: 0, correct: 0, byTopic: {} });
  const freshState = () => ({ attempted: 0, correct: 0, byTopic: {}, byMode: { cas: blankMode(), noncas: blankMode() }, flagged: [] });
  let state = loadState();
  let currentQuestion = null;
  let selectedTopic = 'algebra';
  let selectedDifficulty = 'Easy';
  let selectedMode = 'noncas';
  let currentNav = 'practice';
  const $ = selector => document.querySelector(selector);
  const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && typeof saved === 'object') {
        const result = { ...freshState(), ...saved, byTopic: saved.byTopic || {}, flagged: Array.isArray(saved.flagged) ? saved.flagged : [] };
        result.byMode = { cas: { ...blankMode(), ...(saved.byMode?.cas || {}) }, noncas: { ...blankMode(), ...(saved.byMode?.noncas || {}) } };
        return result;
      }
    } catch (error) { /* Start fresh when stored data is malformed or unavailable. */ }
    return freshState();
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (error) { /* The practice flow still works without storage. */ }
  }

  function renderMath(element) {
    if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise([element]).catch(() => {});
  }

  function renderSelections() {
    $('#topic-options').innerHTML = topics.map(topic => `<button type="button" class="topic-option" data-topic="${topic.id}" aria-pressed="${topic.id === selectedTopic}"><span class="topic-icon">${topic.icon}</span><span class="topic-name">${topic.name}</span></button>`).join('');
    $('#difficulty-options').innerHTML = difficulties.map(difficulty => `<button type="button" class="difficulty-option" data-difficulty="${difficulty}" aria-pressed="${difficulty === selectedDifficulty}">${difficulty}</button>`).join('');
    document.querySelectorAll('[data-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mode === selectedMode)));
  }

  function updateHomeStats() {
    const accuracy = state.attempted ? Math.round(state.correct / state.attempted * 100) : 0;
    $('#stat-attempted').textContent = state.attempted;
    $('#stat-correct').textContent = state.correct;
    $('#stat-accuracy').textContent = `${accuracy}%`;
    $('#accuracy-bar').style.width = `${accuracy}%`;
    $('#stat-flagged').textContent = state.flagged.length;
    $('#continue-card').hidden = !currentQuestion;
  }

  function showView(view) {
    $('#home-view').hidden = view !== 'home';
    $('#practice-view').hidden = view !== 'practice';
    $('#progress-view').hidden = view !== 'progress';
    if (view === 'progress' && currentNav !== 'flagged') currentNav = 'progress';
    else if (view !== 'progress') currentNav = 'practice';
    document.querySelectorAll('[data-nav]').forEach(link => link.classList.toggle('active', link.dataset.nav === currentNav));
    if (view === 'home') updateHomeStats();
    if (view === 'progress') renderProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function setQuestion(question) {
    currentQuestion = question;
    selectedMode = question.mode || 'noncas';
    $('#question-topic').textContent = topics.find(topic => topic.id === question.topic)?.name || question.topic;
    $('#question-difficulty').textContent = question.difficulty;
    $('#question-mode').textContent = question.mode === 'cas' ? 'CAS' : 'Non-CAS';
    $('#question-title').textContent = 'Work through the problem.';
    $('#question-prompt').innerHTML = question.prompt;
    $('#answer-text').innerHTML = question.answer;
    $('#solution-steps').innerHTML = question.steps.map(step => `<li>${step}</li>`).join('');
    $('#answer-panel').hidden = true;
    $('#solution-panel').hidden = true;
    $('#self-check').hidden = Boolean(question.recorded);
    $('#recorded-result').hidden = !question.recorded;
    $('#recorded-result').textContent = question.recorded === 'correct' ? 'Recorded as correct.' : 'Recorded. Keep practising.';
    const flagged = state.flagged.some(item => item.id === question.id);
    $('#flag-button').classList.toggle('is-flagged', flagged);
    $('#flag-label').textContent = flagged ? 'Flagged' : 'Flag';
    renderMath($('#question-prompt'));
    renderMath($('#answer-panel'));
    renderMath($('#solution-panel'));
    showView('practice');
  }

  function generateQuestion() {
    const question = SpecialistQuestionBank.generate(selectedTopic, selectedDifficulty, selectedMode);
    setQuestion(question);
  }

  function recordResult(result) {
    if (!currentQuestion || currentQuestion.recorded) return;
    currentQuestion.recorded = result;
    state.attempted += 1;
    state.byTopic[currentQuestion.topic] = (state.byTopic[currentQuestion.topic] || 0) + 1;
    const modeStats = state.byMode[currentQuestion.mode];
    modeStats.attempted += 1;
    modeStats.byTopic[currentQuestion.topic] = (modeStats.byTopic[currentQuestion.topic] || 0) + 1;
    if (result === 'correct') {
      state.correct += 1;
      modeStats.correct += 1;
    }
    const flaggedIndex = state.flagged.findIndex(item => item.id === currentQuestion.id);
    if (flaggedIndex >= 0) state.flagged[flaggedIndex] = currentQuestion;
    saveState();
    setQuestion(currentQuestion);
    $('#answer-panel').hidden = false;
    updateHomeStats();
  }

  function renderProgress() {
    const accuracy = stats => stats.attempted ? Math.round(stats.correct / stats.attempted * 100) : 0;
    const cas = state.byMode.cas;
    const noncas = state.byMode.noncas;
    $('#progress-summary').innerHTML = [
      `<div class="summary-card"><span class="summary-value">${state.attempted}</span><span class="summary-label">Total questions</span></div>`,
      `<div class="summary-card"><span class="summary-value">${accuracy(state)}%</span><span class="summary-label">Overall accuracy</span></div>`,
      `<div class="summary-card"><span class="summary-value">${accuracy(cas)}%</span><span class="summary-label">CAS accuracy · ${cas.attempted} attempted</span></div>`,
      `<div class="summary-card"><span class="summary-value">${accuracy(noncas)}%</span><span class="summary-label">Non-CAS accuracy · ${noncas.attempted} attempted</span></div>`
    ].join('');
    const maximum = Math.max(1, ...topics.map(topic => state.byTopic[topic.id] || 0));
    $('#topic-progress-list').innerHTML = topics.map(topic => {
      const count = state.byTopic[topic.id] || 0;
      const casCount = cas.byTopic[topic.id] || 0;
      const noncasCount = noncas.byTopic[topic.id] || 0;
      return `<div class="topic-progress-row"><span class="topic-progress-name">${topic.icon} &nbsp; ${topic.name}</span><div class="topic-progress-track"><span style="width:${count ? Math.max(4, count / maximum * 100) : 0}%"></span></div><span class="topic-progress-count">${count}</span><span class="mode-counts">CAS ${casCount} · NC ${noncasCount}</span></div>`;
    }).join('');
    $('#flag-count').textContent = state.flagged.length;
    if (!state.flagged.length) {
      $('#flagged-list').innerHTML = '<div class="empty-state">No flagged questions. Flag one during practice to save it here.</div>';
      return;
    }
    $('#flagged-list').innerHTML = state.flagged.map(item => `<article class="flagged-item"><div><h3>${escapeHtml(topics.find(topic => topic.id === item.topic)?.name || item.topic)} · ${escapeHtml(item.difficulty)} · ${item.mode === 'cas' ? 'CAS' : 'Non-CAS'}</h3><p>${escapeHtml(item.prompt.replace(/\\\(|\\\)|\\\[|\\\]/g, '').replace(/<[^>]*>/g, ''))}</p></div><div class="flagged-item-actions"><button class="small-action" type="button" data-review="${escapeHtml(item.id)}">Review</button><button class="small-action remove" type="button" data-remove-flag="${escapeHtml(item.id)}">Remove</button></div></article>`).join('');
  }

  function toggleFlag() {
    if (!currentQuestion) return;
    const index = state.flagged.findIndex(item => item.id === currentQuestion.id);
    if (index >= 0) state.flagged.splice(index, 1);
    else state.flagged.unshift(currentQuestion);
    saveState();
    const flagged = index < 0;
    $('#flag-button').classList.toggle('is-flagged', flagged);
    $('#flag-label').textContent = flagged ? 'Flagged' : 'Flag';
    updateHomeStats();
  }

  $('#mode-options').addEventListener('click', event => {
    const button = event.target.closest('[data-mode]');
    if (!button) return;
    selectedMode = button.dataset.mode;
    renderSelections();
  });
  $('#topic-options').addEventListener('click', event => {
    const button = event.target.closest('[data-topic]');
    if (!button) return;
    selectedTopic = button.dataset.topic;
    renderSelections();
  });
  $('#difficulty-options').addEventListener('click', event => {
    const button = event.target.closest('[data-difficulty]');
    if (!button) return;
    selectedDifficulty = button.dataset.difficulty;
    renderSelections();
  });
  $('#start-button').addEventListener('click', generateQuestion);
  $('#continue-button').addEventListener('click', () => currentQuestion && setQuestion(currentQuestion));
  $('#back-home').addEventListener('click', () => showView('home'));
  $('#next-button').addEventListener('click', generateQuestion);
  $('#answer-button').addEventListener('click', () => { $('#answer-panel').hidden = !$('#answer-panel').hidden; renderMath($('#answer-panel')); });
  $('#solution-button').addEventListener('click', () => { $('#solution-panel').hidden = !$('#solution-panel').hidden; renderMath($('#solution-panel')); });
  $('#flag-button').addEventListener('click', toggleFlag);
  $('#self-check').addEventListener('click', event => {
    const button = event.target.closest('[data-result]');
    if (button) recordResult(button.dataset.result);
  });
  document.querySelectorAll('[data-view-link]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    currentNav = link.dataset.nav;
    showView(link.dataset.viewLink);
    currentNav = link.dataset.nav;
    document.querySelectorAll('[data-nav]').forEach(navLink => navLink.classList.toggle('active', navLink.dataset.nav === currentNav));
    history.replaceState(null, '', link.getAttribute('href'));
    const destination = currentNav === 'topics' ? $('#topics-panel') : currentNav === 'flagged' ? $('#flagged-section') : null;
    if (destination) destination.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  }));
  $('#flagged-list').addEventListener('click', event => {
    const review = event.target.closest('[data-review]');
    const remove = event.target.closest('[data-remove-flag]');
    if (review) {
      const question = state.flagged.find(item => item.id === review.dataset.review);
      if (question) setQuestion(question);
    } else if (remove) {
      state.flagged = state.flagged.filter(item => item.id !== remove.dataset.removeFlag);
      saveState(); renderProgress(); updateHomeStats();
    }
  });
  $('.theme-toggle').addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light');
    const isDark = !isLight;
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
    $('.setting-label').textContent = `Settings · ${isDark ? 'Light' : 'Dark'} mode`;
    $('.theme-toggle').setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  });
  if (localStorage.getItem(THEME_KEY) === 'light') {
    document.body.classList.add('light');
    $('.setting-label').textContent = 'Settings · Dark mode';
    $('.theme-toggle').setAttribute('aria-label', 'Switch to dark mode');
  }
  renderSelections();
  updateHomeStats();
})();
