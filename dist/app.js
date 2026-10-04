(() => {
  'use strict';
  const D = globalThis.AionData;
  const e = D.escape;
  const STORAGE_KEY = 'aion2.jornada.v1';
  const app = document.getElementById('app');
  const dialog = document.getElementById('dialog');
  const mobileViewport = matchMedia('(max-width: 760px)');
  let storageHealthy = true;
  let loadWarning = '';
  let state = D.freshState();
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) state = D.validateState(JSON.parse(saved));
  } catch {
    storageHealthy = false;
    loadWarning = 'Não foi possível ler o progresso salvo. Você pode restaurar uma cópia em Seus dados.';
  }
  const views = { journey: 'Sua jornada', tasks: 'Meus objetivos', routine: 'Rotina de jogo', library: 'Biblioteca', classes: 'Classes' };
  const ui = { view: views[location.hash.slice(1)] ? location.hash.slice(1) : 'journey', query: '', stageFilter: 'all', hideDone: false, taskFilter: 'pending', scope: 'all', classFilter: 'all', opened: new Set([(D.nextObjective(state)?.stage.id || 'base')]), mobileOpen: false };
  let toastTimer;
  let toastAction;
  let dialogAction;
  let dialogReturnFocus;
  let memoryRevision = 0;

  const paths = {
    route: '<circle cx="6" cy="5" r="2"/><circle cx="18" cy="19" r="2"/><path d="M8 5h7a4 4 0 0 1 0 8H9a3 3 0 0 0 0 6h7"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    checklist: '<rect x="5" y="4" width="15" height="17" rx="2"/><path d="M9 2h7v4H9zM9 11h6m-6 5h6M2 10l1 1 2-2"/>',
    book: '<path d="M12 5c-3-2-6-2-10-1v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-4-1-7-1-10 1Zm0 0v15"/>',
    swords: '<path d="m14 3 7 0 0 7-5-2-8 8m-5 5 4-4M3 14l7 7M3 3h7L8 8l8 8m5 5-4-4m-3 4 7-7"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
    moon: '<path d="M21 13A9 9 0 0 1 11 3a9 9 0 1 0 10 10Z"/>',
    feather: '<path d="M20 4c-5-4-13 2-13 10l3 3c8 0 14-8 10-13ZM3 21 16 8M8 13h5m-2-6v3"/>',
    shield: '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/>',
    castle: '<path d="M3 21V8h3V4h3v4h6V4h3v4h3v13ZM9 21v-6a3 3 0 0 1 6 0v6M3 11h18"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18m-13 4h2m4 0h2m-8 3h2"/>',
    crown: '<path d="m3 6 5 5 4-7 4 7 5-5-3 13H6L3 6ZM6 22h12"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m16 8-3 5-5 3 3-5 5-3Z"/>',
    sparkles: '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Zm7-1v4m-2-2h4M3 18v4m-2-2h4"/>',
    gem: '<path d="m7 3-5 6 10 13L22 9l-5-6H7Zm-5 6h20M7 3l5 19L17 3"/>',
    flame: '<path d="M13 2c1 6 6 7 6 12a7 7 0 0 1-14 0c0-3 2-5 4-7 0 4 2 4 2 4s3-4 2-9Z"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/>',
    arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    right: '<path d="m9 5 7 7-7 7"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M4 15v6h16v-6"/>',
    upload: '<path d="M12 16V3m-5 5 5-5 5 5M4 15v6h16v-6"/>',
    cloud: '<path d="M7 18H6a4 4 0 0 1-1-8 7 7 0 0 1 13-2 5 5 0 0 1 0 10h-1m-9-4 3 3 5-6"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4m-4 5v2"/>',
    edit: '<path d="m15 4 5 5M4 20l5-1L21 7a2 2 0 0 0-5-5L4 14l-1 7 1-1Z"/>',
    trash: '<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
    external: '<path d="M14 3h7v7m0-7L10 14m1-10H4v17h17v-7"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    flag: '<path d="M5 21V3c5-3 9 3 14 0v10c-5 3-9-3-14 0"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    reset: '<path d="M3 10a9 9 0 1 1 2 8M3 3v7h7"/>',
    settings: '<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3" fill="var(--bg)"/><circle cx="15" cy="17" r="3" fill="var(--bg)"/>'
  };
  const icon = (name, css = '') => `<svg class="icon ${css}" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.sparkles}</svg>`;
  const factionName = () => state.profile.faction === 'asmodians' ? 'Asmodianos' : 'Elyos';
  const chosenClass = () => D.classes.find(c => c.id === state.profile.classId);
  const taskLabel = id => [...D.stages.flatMap(s => s.tasks), ...D.starters, ...D.routines, ...state.tasks].find(t => t.id === id)?.title || 'Objetivo';

  function save() {
    memoryRevision++;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); storageHealthy = true; }
    catch { storageHealthy = false; toast('O navegador não permitiu salvar. Exporte uma cópia em Seus dados.', true); }
  }
  function toast(message, error = false, action = null) {
    clearTimeout(toastTimer);
    toastAction = action?.run || null;
    const element = document.getElementById('toast');
    element.className = `toast visible${error ? ' error' : ''}`;
    element.innerHTML = `<span>${e(message)}</span>${action ? `<button data-action="toast-action">${e(action.label)}</button>` : ''}`;
    toastTimer = setTimeout(() => { element.classList.remove('visible'); toastAction = null; }, error ? 8500 : action ? 8000 : 3800);
  }
  function nextRecommended() {
    if (state.profile.power !== null && state.profile.power < 1000) {
      const starter = D.starters.find(t => !state.completed.includes(t.id));
      if (starter) return { task: starter, stage: { id: 'start', title: 'Antes dos 1000 de poder', range: 'Nível 45' } };
    }
    const index = state.profile.power === null ? 0 : Math.max(0, D.stages.findLastIndex(s => state.profile.power >= s.min));
    for (const stage of D.stages.slice(index)) {
      const task = D.tasksForStage(state, stage).find(t => !t.done);
      if (task) return { stage, task };
    }
    return D.nextObjective(state);
  }
  function render() {
    const active = document.activeElement;
    const focusId = active?.id;
    const selection = active?.tagName === 'INPUT' && ['search', 'text'].includes(active.type) ? [active.selectionStart, active.selectionEnd] : null;
    const pending = state.tasks.filter(t => !t.done).length;
    const navigation = [['journey', 'route'], ['tasks', 'checklist'], ['routine', 'calendar'], ['library', 'book'], ['classes', 'swords']];
    app.innerHTML = `
      <div class="mobile-shade ${ui.mobileOpen ? 'visible' : ''}" data-action="close-menu"></div>
      <aside class="sidebar ${ui.mobileOpen ? 'mobile-open' : ''}" id="sidebar" aria-label="Menu principal" ${mobileViewport.matches && !ui.mobileOpen ? 'inert' : ''}>
        <button class="icon-button mobile-nav-close" data-action="close-menu" aria-label="Fechar menu">${icon('close')}</button>
        <a class="brand" href="#journey" aria-label="AION 2 — Sua jornada"><img src="assets/aion2-logo.webp" alt="AION 2" width="108" height="91"><span class="brand-subtitle">JORNADA DE DAEVA</span></a>
        <div class="side-label">SEU COMPANHEIRO EM ATREIA</div>
        <nav>${navigation.map(([view, symbol]) => `<a href="#${view}" class="nav-link ${ui.view === view ? 'active' : ''}" ${ui.view === view ? 'aria-current="page"' : ''}>${icon(symbol)}<span>${views[view]}</span>${view === 'tasks' ? `<span class="nav-count">${pending}</span>` : ''}</a>`).join('')}</nav>
        <div class="side-label">FAÇA A JORNADA SER SUA</div>
        <button class="side-utility" data-action="new-task" data-stage="general">${icon('plus', 'small')} Novo objetivo</button>
        <button class="side-utility" data-action="data">${icon('download', 'small')} Seus dados</button>
        <div class="sidebar-bottom">
          <div class="side-tip">${icon('feather')}<strong>No seu tempo. Do seu jeito.</strong><p>Cada pequeno passo faz parte de uma grande jornada.</p></div>
          <button class="side-utility" data-action="sources">${icon('info', 'small')} Sobre este guia</button>
          <button class="profile-button" data-action="profile" aria-label="Editar perfil de ${e(state.profile.name)}"><span class="avatar"><img src="assets/${state.profile.faction}.webp" alt="" width="32" height="32"></span><span><strong class="profile-name">${e(state.profile.name)}</strong><span class="profile-meta">${factionName()} · ${chosenClass()?.name || 'Escolha sua classe'}</span></span>${icon('settings')}</button>
        </div>
      </aside>
      <header class="topbar">
        <button class="icon-button menu-button" data-action="menu" aria-controls="sidebar" aria-expanded="${ui.mobileOpen}" aria-label="Abrir menu">${icon('menu')}</button>
        <div class="breadcrumb"><span>Guia do aventureiro</span>${icon('right')}<strong>${views[ui.view]}</strong></div>
        <div class="top-actions"><label class="search">${icon('search', 'small')}<input id="guide-search" type="search" aria-label="Buscar no guia" placeholder="Buscar no guia..." value="${e(ui.query)}" autocomplete="off"><kbd>/</kbd></label><span class="top-divider"></span><span class="save-status ${storageHealthy ? '' : 'failed'}" title="${storageHealthy ? 'Progresso salvo neste navegador' : 'Salvamento indisponível. Exporte seus dados.'}">${icon(storageHealthy ? 'cloud' : 'info')} ${storageHealthy ? 'Salvo neste navegador' : 'Não salvo'}</span><button class="avatar" data-action="profile" aria-label="Editar meu perfil"><img src="assets/${state.profile.faction}.webp" alt="" width="32" height="32"></button></div>
      </header>
      <main class="main" id="main" tabindex="-1">${renderView()}
        <footer class="footer"><span>${icon('feather')} Sua jornada, um objetivo de cada vez.</span><button data-action="sources">Guia independente · Fontes e créditos ${icon('external', 'small')}</button></footer>
      </main>`;
    if (focusId) {
      const replacement = document.getElementById(focusId);
      if (replacement) { replacement.focus({ preventScroll: true }); if (selection) replacement.setSelectionRange(...selection); }
    }
  }
  function renderView() {
    return ({ journey: journeyView, tasks: tasksView, routine: routineView, library: libraryView, classes: classesView })[ui.view]();
  }
  function journeyView() {
    const p = D.progress(state);
    const personalDone = state.tasks.filter(t => t.done).length;
    const activeStages = D.stages.filter(s => { const stats = D.progress(state, s.id); return stats.done > 0 && stats.done < stats.total; }).length;
    const next = nextRecommended();
    const filtered = D.stages.filter(s => {
      const stats = D.progress(state, s.id);
      return (ui.stageFilter === 'all' || (ui.stageFilter === 'done' ? stats.percent === 100 : stats.done > 0 && stats.done < stats.total)) && (!ui.query || D.matches(`${s.title} ${s.range} ${s.category} ${s.description} ${D.tasksForStage(state, s).map(t => `${t.title} ${t.detail}`).join(' ')}`, ui.query));
    });
    return `<div class="page-intro"><div><h2 class="welcome">Pronto para ir mais longe, ${e(state.profile.name)}?</h2><p>Um mundo de possibilidades. Um próximo passo de cada vez.</p></div><span class="intro-tag">GUIA DE EQUIPAMENTO · NÍVEL 45</span></div>
      <section class="hero" aria-labelledby="hero-title"><img class="hero-art" src="assets/atreia.webp" alt="O céu de Atreia, com uma lua partida e uma torre suspensa entre estrelas" fetchpriority="high" width="1920" height="1080"><span class="hero-corner">AION 2 · GUIA INTERATIVO</span><div class="hero-content"><div class="hero-eyebrow">O SEU CAMINHO ATÉ O ENDGAME</div><h1 id="hero-title">Asas para explorar.<br><span>Um norte para evoluir.</span></h1><p>Do nível 45 à sua próxima grande conquista.<br>Organize seus objetivos e escreva sua lenda em Atreia.</p><div class="hero-buttons"><button class="button primary" data-action="continue">${icon('compass', 'small')} ${p.done ? 'Continuar jornada' : 'Começar minha jornada'} ${icon('arrow', 'small')}</button><a class="button ghost" href="#library">Explorar o guia ${icon('book', 'small')}</a></div></div><span class="hero-mark">${icon('compass')} ATREIA · UM MUNDO PARA DESCOBRIR</span></section>
      <div class="stats"><button class="stat" data-action="jump-journey"><span class="stat-icon">${icon('checklist')}</span><span><span class="stat-value">${p.done}<small>/ ${p.total}</small></span><span class="stat-label" style="display:block">Objetivos da jornada</span></span><span class="stat-trail">${p.percent}% concluído</span></button><button class="stat" data-action="stage-filter" data-filter="done"><span class="stat-icon">${icon('flag')}</span><span><span class="stat-value">${p.stagesDone}<small>/ 6</small></span><span class="stat-label" style="display:block">Etapas concluídas</span></span></button><a class="stat" href="#tasks"><span class="stat-icon">${icon('book')}</span><span><span class="stat-value">${state.tasks.length}<small>${personalDone ? `· ${personalDone} ✓` : ''}</small></span><span class="stat-label" style="display:block">Objetivos pessoais</span></span>${icon('right', 'small')}</a></div>
      <div class="workspace-grid"><section id="journey-section" aria-labelledby="journey-title"><div class="section-heading"><div><h2 id="journey-title">Sua jornada de evolução</h2><p>Um roteiro claro. A liberdade de seguir no seu ritmo.</p></div>${icon('route')}</div>
        <div class="tabs" role="group" aria-label="Filtrar etapas">${[['all', 'Todas as etapas', 6], ['active', 'Em andamento', activeStages], ['done', 'Concluídas', p.stagesDone]].map(([filter, label, count]) => `<button class="tab ${ui.stageFilter === filter ? 'active' : ''}" data-action="stage-filter" data-filter="${filter}" aria-pressed="${ui.stageFilter === filter}">${label}<span class="tab-count">${count}</span></button>`).join('')}</div>
        <label class="hide-toggle"><input id="hide-done" type="checkbox" ${ui.hideDone ? 'checked' : ''}> Ocultar objetivos concluídos</label>
        ${ui.query ? `<div class="filter-note"><span>Resultados para “${e(ui.query)}”</span><button class="text-link" data-action="clear-search">Limpar busca</button></div>` : ''}
        ${p.percent === 100 ? `<div class="completion-banner"><h3>Uma jornada digna de uma lenda.</h3><p>Todos os objetivos do roteiro estão concluídos. Adicione uma nova conquista para continuar.</p></div>` : ''}
        <div class="stages">${filtered.map((s) => renderStage(s, D.stages.indexOf(s), next?.stage.id)).join('') || `<div class="no-results">${ui.query ? 'Nenhuma etapa encontrada. Tente um nome, item ou faixa de poder.' : ui.stageFilter === 'done' ? 'Você ainda não concluiu uma etapa. Cada objetivo conta!' : 'Marque o primeiro objetivo de uma etapa para vê-la aqui.'}<br><button class="text-link" data-action="reset-filters">Mostrar todas as etapas ${icon('arrow', 'small')}</button></div>`}</div>
        <div class="prep-banner">${icon('compass')}<div><strong>Ainda não chegou a 1000 de poder?</strong><p>Prepare a base antes de seguir o roteiro.</p></div><button class="text-link" data-action="starter">Por onde começar ${icon('arrow', 'small')}</button></div>
      </section><aside class="rail" aria-label="Resumo da sua jornada">${renderRail(p, next)}</aside></div>
      <section class="lower-section"><div class="section-heading"><div><h2>Quatro regras. Uma base sólida.</h2><p>Leve estes princípios com você ao longo da jornada.</p></div><span class="badge">REGRAS DE OURO</span></div><div class="rules-grid">${D.rules.map(rule => `<article class="rule"><div class="rule-icon">${icon(rule.icon)}</div><h3>${rule.title}</h3><p>${rule.text}</p></article>`).join('')}</div></section>
      ${renderUnlocks()}`;
  }
  function renderStage(stage, index, recommendedId) {
    const p = D.progress(state, stage.id);
    const open = ui.opened.has(stage.id) || !!ui.query;
    let tasks = D.tasksForStage(state, stage);
    if (ui.hideDone) tasks = tasks.filter(t => !t.done);
    const stageMatch = ui.query && D.matches(`${stage.title} ${stage.range} ${stage.category}`, ui.query);
    if (ui.query && !stageMatch) tasks = tasks.filter(t => D.matches(`${t.title} ${t.detail}`, ui.query));
    return `<article class="stage ${recommendedId === stage.id ? 'current' : ''} ${p.percent === 100 ? 'complete' : ''} ${open ? 'open' : ''}" id="stage-${stage.id}"><span class="stage-dot" aria-hidden="true"></span><button class="stage-head" id="stage-toggle-${stage.id}" data-action="toggle-stage" data-stage="${stage.id}" aria-expanded="${open}" aria-controls="stage-body-${stage.id}"><span class="stage-number"><span>ETAPA</span><strong>${String(index + 1).padStart(2, '0')}</strong></span><span class="stage-info"><span class="stage-title-line"><h3>${stage.title}</h3>${p.percent === 100 ? '<span class="badge green">Concluída</span>' : recommendedId === stage.id ? '<span class="badge">SEU PRÓXIMO PASSO</span>' : ''}</span><span class="stage-range">${icon('swords')}<strong>${stage.range}</strong> de poder de combate</span></span><span class="stage-count">${p.done}/${p.total}</span>${icon('chevron', 'stage-chevron')}</button>
      <div class="stage-body" id="stage-body-${stage.id}" ${open ? '' : 'hidden'}><p class="stage-description">${stage.description}</p><div class="task-list">${tasks.map(t => renderTask(t)).join('') || `<p class="stage-completed-message">${ui.query ? 'Nenhum objetivo com esse termo nesta etapa.' : 'Todos os objetivos desta etapa estão concluídos.'}</p>`}</div><div class="stage-tip">${icon('sparkles')}<span>${stage.tip}</span></div><button class="add-stage" data-action="new-task" data-stage="${stage.id}">${icon('plus')} Adicionar objetivo nesta etapa</button></div></article>`;
  }
  function checkbox(id, done, compact = '') {
    return `<label class="check-wrap"><input type="checkbox" id="check-${compact}${id}" data-check="${id}" ${done ? 'checked' : ''} aria-label="${e(taskLabel(id))}">${icon('check')}</label>`;
  }
  function renderTask(task, compact = false) {
    return `<div class="task ${task.done ? 'done' : ''}" id="task-${compact ? 'rail-' : ''}${task.id}">${checkbox(task.id, task.done, compact ? 'rail-' : '')}<div class="task-content"><label class="task-title" for="check-${compact ? 'rail-' : ''}${task.id}">${e(task.title)}</label>${!compact && task.detail ? `<p class="task-detail">${e(task.detail)}</p>` : ''}<div class="task-metadata">${task.custom ? `<span class="badge blue">Pessoal</span>` : ''}${task.tag && !compact ? `<span class="badge neutral">${e(task.tag)}</span>` : ''}${task.guide && !compact ? `<button class="task-link" data-action="article" data-article="${task.guide}">Guia rápido ${icon('external')}</button>` : ''}${task.custom ? renderDue(task) : ''}</div></div>${task.custom ? `<button class="icon-button task-edit" data-action="edit-task" data-id="${task.id}" aria-label="Editar ${e(task.title)}">${icon('edit', 'small')}</button>` : ''}</div>`;
  }
  function renderRail(p, next) {
    const circumference = 2 * Math.PI * 57;
    const pending = state.tasks.filter(t => !t.done).slice(0, 3);
    return `<section class="panel progress-panel"><h2 class="panel-title">${icon('compass')} O seu progresso</h2><div class="progress-visual" role="img" aria-label="${p.percent}% da jornada, ${p.done} de ${p.total} objetivos"><svg viewBox="0 0 142 142" aria-hidden="true"><circle class="ring-bg" cx="71" cy="71" r="57"/><circle class="ring-fill" cx="71" cy="71" r="57" stroke-dasharray="${circumference}" stroke-dashoffset="${circumference * (1 - p.percent / 100)}"/></svg><div class="progress-center"><strong>${p.percent}<span>%</span></strong><p>da jornada concluída</p></div></div><p class="progress-caption"><strong>${p.done} de ${p.total}</strong> objetivos concluídos</p><div class="progress-foot"><span>Seu poder de combate</span><button class="text-link" data-action="profile" aria-label="Editar poder de combate"><strong>${state.profile.power === null ? 'Informar poder' : state.profile.power.toLocaleString('pt-BR')}</strong>${icon('edit', 'small')}</button></div></section>
      <section class="panel next-panel"><div class="eyebrow">${icon('sparkles', 'small')} SEU PRÓXIMO PASSO</div><h3>${next ? e(next.task.title) : 'O próximo capítulo é seu.'}</h3><p>${next ? `${next.stage.title} · ${next.stage.range}` : 'Crie uma meta pessoal e continue escrevendo sua história.'}</p><button class="button" data-action="${next ? 'continue' : 'new-task'}" data-stage="general">${next ? 'Ir para o objetivo' : 'Criar meu próximo objetivo'} ${icon('arrow', 'small')}</button></section>
      <section class="panel"><div class="spread personal-heading"><h2 class="panel-title">${icon('book')} Suas anotações de jornada</h2><button class="icon-button" data-action="new-task" data-stage="general" aria-label="Adicionar objetivo geral">${icon('plus', 'small')}</button></div>${pending.length ? `<p class="personal-summary">O que você quer conquistar a seguir.</p>${pending.map(t => renderTask({ ...t, custom: true }, true)).join('')}<a href="#tasks" class="view-all">Ver todos os objetivos ${icon('right', 'small')}</a>` : `<div class="empty-mini">${icon('feather')}<strong>${state.tasks.length ? 'Tudo em dia por aqui.' : 'Toda conquista começa com uma ideia.'}</strong><p>${state.tasks.length ? 'Seus objetivos pessoais estão concluídos. O que vem a seguir?' : 'Anote um item para buscar, uma masmorra para explorar ou sua próxima meta.'}</p><button class="text-link" data-action="new-task" data-stage="general">${icon('plus', 'small')} Criar um objetivo</button></div>`}</section>
      ${energyPanel()}<p class="mini-reference">Adaptado do roteiro de <button data-action="sources">Beeks Official</button> · Temporada 1, nível 45. Confirme requisitos e limites no jogo.</p>`;
  }
  function energyPanel(big = false) {
    return `<section class="panel energy-panel ${big ? 'energy-big' : ''}"><div class="energy-label">UM RECURSO VALIOSO</div><h3>${icon('gem', 'small')} Energia de Od</h3><div class="energy-numbers"><div><strong>40</strong><span>por resgate*</span></div><div><strong>560</strong><span>limite base*</span></div><div><strong>840</strong><span>com assinatura*</span></div></div><p>Evite deixar a energia no limite. Planeje os resgates no melhor conteúdo que você já desbloqueou.</p>${big ? '<p class="source-note">*Valores da imagem de referência. O custo de 40 se aplica à maioria dos resgates citados, não a toda atividade. Entrar na masmorra é apresentado como gratuito; resgatar recompensas consome energia. Consulte seu cliente.</p>' : '<button class="text-link" data-action="energy">Entender o recurso '+icon('arrow','small')+'</button>'}</section>`;
  }
  function renderUnlocks() {
    const power = state.profile.power;
    const nextUnlock = power === null ? null : D.unlocks.find(u => u.power > power);
    return `<section class="lower-section" id="unlocks"><div class="section-heading"><div><h2>O que espera por você</h2><p>Marcos de poder e novos conteúdos no horizonte.</p></div><button class="text-link" data-action="profile">${power === null ? 'Informar meu poder' : `Seu poder: ${power.toLocaleString('pt-BR')}`} ${icon('edit', 'small')}</button></div><div class="unlock-grid">${D.unlocks.map(u => `<article class="unlock ${power !== null && power >= u.power ? 'available' : ''} ${nextUnlock === u ? 'current' : ''}"><span class="unlock-status" title="${power === null ? 'Informe seu poder para comparar' : power >= u.power ? 'Faixa de referência alcançada' : 'Próximo marco de poder'}">${icon(power !== null && power >= u.power ? 'check' : nextUnlock === u ? 'flag' : 'lock')}</span><strong>${u.power}</strong><h3>${u.title}</h3><p>${u.detail}</p></article>`).join('')}</div><p class="source-note">Marcos da imagem de referência; faixas podem se sobrepor. O poder informado apenas orienta o guia — não confirma acesso nem conclui objetivos no jogo.</p></section>`;
  }
  function pageHeading(eyebrow, title, subtitle, action = '') {
    return `<div class="page-heading"><div><div class="eyebrow">${eyebrow}</div><h1 class="page-title">${title}</h1><p class="page-subtitle">${subtitle}</p></div>${action}</div>`;
  }
  function referenceStrip() { return `<div class="reference-strip">${icon('info')}<span>${D.reference.note} <button data-action="sources">Ver referência</button></span></div>`; }
  function tasksView() {
    let tasks = state.tasks.filter(t => (ui.taskFilter === 'all' || (ui.taskFilter === 'done' ? t.done : !t.done)) && (ui.scope === 'all' || ui.scope === t.stage) && D.matches(`${t.title} ${t.detail}`, ui.query));
    tasks = [...tasks].sort((a, b) => ({ high: 0, normal: 1, low: 2 })[a.priority] - ({ high: 0, normal: 1, low: 2 })[b.priority]);
    const groups = [['general', 'Lista geral'], ...D.stages.map(s => [s.id, s.title])];
    return pageHeading('A JORNADA É SUA', 'Pequenos passos. Grandes conquistas.', 'Suas metas, lembretes e itens para buscar, reunidos em um só lugar.', `<button class="button primary" data-action="new-task" data-stage="general">${icon('plus', 'small')} Novo objetivo</button>`) + `<div class="task-controls"><div class="tabs" role="group" aria-label="Filtrar objetivos pessoais">${[['pending', 'Pendentes', state.tasks.filter(t => !t.done).length], ['done', 'Concluídos', state.tasks.filter(t => t.done).length], ['all', 'Todos', state.tasks.length]].map(([filter, title, count]) => `<button class="tab ${ui.taskFilter === filter ? 'active' : ''}" data-action="task-filter" data-filter="${filter}" aria-pressed="${ui.taskFilter === filter}">${title}<span class="tab-count">${count}</span></button>`).join('')}</div><label class="sr-only" for="scope-filter">Filtrar por etapa</label><select id="scope-filter"><option value="all">Todas as etapas</option>${groups.map(([id, title]) => `<option value="${id}" ${ui.scope === id ? 'selected' : ''}>${title}</option>`).join('')}</select></div>${ui.query ? `<p class="filter-note">Busca: “${e(ui.query)}” <button class="text-link" data-action="clear-search">Limpar</button></p>` : ''}` + (tasks.length ? groups.map(([id, title]) => { const items = tasks.filter(t => t.stage === id); return items.length ? `<section class="task-group"><h2 class="task-group-title">${icon(id === 'general' ? 'book' : 'route')}${title} <span class="tab-count">${items.length}</span></h2>${items.map(renderPersonalTask).join('')}</section>` : ''; }).join('') : `<div class="empty-state">${icon(ui.taskFilter === 'done' ? 'flag' : 'feather')}<h2>${!state.tasks.length ? 'Uma página em branco para suas conquistas.' : ui.query || ui.scope !== 'all' ? 'Nenhum objetivo encontrado.' : ui.taskFilter === 'done' ? 'As primeiras conquistas estão a caminho.' : 'Tudo em dia. O horizonte é seu.'}</h2><p>${!state.tasks.length ? 'Crie seu primeiro objetivo e escolha se ele faz parte de uma etapa ou da sua lista geral.' : ui.query || ui.scope !== 'all' ? 'Tente outro termo ou remova os filtros para ver mais objetivos.' : ui.taskFilter === 'done' ? 'Marque uma tarefa como concluída e ela aparecerá aqui.' : 'Seus objetivos pessoais estão concluídos. Guarde uma nova ideia para sua próxima sessão.'}</p><button class="button ${state.tasks.length && (ui.query || ui.scope !== 'all') ? '' : 'primary'}" data-action="${state.tasks.length && (ui.query || ui.scope !== 'all') ? 'reset-task-filters' : 'new-task'}" data-stage="general">${icon('plus', 'small')}${state.tasks.length && (ui.query || ui.scope !== 'all') ? 'Limpar filtros' : 'Criar um objetivo'}</button></div>`);
  }
  function renderDue(task) {
    if (!task.due) return '';
    const date = new Date(`${task.due}T12:00:00`);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const overdue = !task.done && date < today;
    return `<span class="due ${overdue ? 'overdue' : ''}">${icon('calendar')} ${overdue ? 'Pendente desde ' : ''}${date.toLocaleDateString('pt-BR')}</span>`;
  }
  function renderPersonalTask(task) {
    return `<article class="personal-task ${task.done ? 'done' : ''}" id="task-${task.id}">${checkbox(task.id, task.done)}<div class="task-content"><label class="task-title" for="check-${task.id}">${e(task.title)}</label>${task.detail ? `<p class="task-detail">${e(task.detail)}</p>` : ''}<div class="task-metadata"><span class="badge ${task.priority === 'high' ? 'high' : 'neutral'}">${({ high: 'Alta prioridade', normal: 'No seu ritmo', low: 'Para depois' })[task.priority]}</span>${renderDue(task)}</div></div><div class="task-actions"><button class="icon-button" data-action="edit-task" data-id="${task.id}" aria-label="Editar ${e(task.title)}">${icon('edit', 'small')}</button><button class="icon-button" data-action="delete-task" data-id="${task.id}" aria-label="Excluir ${e(task.title)}">${icon('trash', 'small')}</button></div></article>`;
  }
  function routineView() {
    const list = D.routines.filter(t => D.matches(`${t.title} ${t.detail}`, ui.query));
    return pageHeading('FAÇA CADA SESSÃO VALER', 'Seu ritual de evolução.', 'Organize as atividades da sua sessão e acompanhe os recursos importantes.', `<button class="button" data-action="reset-routine">${icon('reset', 'small')} Nova sessão</button>`) + referenceStrip() + `<div class="routine-layout"><section><div class="section-heading"><h2>Checklist da sessão</h2><span class="badge">MANUAL</span></div>${list.map(t => `<div class="routine-card task ${state.completed.includes(t.id) ? 'done' : ''}">${checkbox(t.id, state.completed.includes(t.id))}<div class="task-content"><label class="task-title" for="check-${t.id}">${t.title}</label><p class="task-detail">${t.detail}</p></div><span class="badge neutral">${t.frequency}</span></div>`).join('') || '<p class="no-results">Nenhuma atividade corresponde à busca.</p>'}<p class="source-note">Marcar significa que você revisou a atividade nesta sessão. Não há contagem de entradas nem reinício automático. Use “Nova sessão” para desmarcar as quatro atividades.</p><div class="routine-tip" style="margin-top:22px">${icon('sparkles', 'small')} Se pretende subir seu poder de combate, a referência sugere guardar as entradas semanais do Rito de Ascensão para o fim da semana.</div><button class="add-stage" data-action="new-task" data-stage="general">${icon('plus')} Adicionar uma meta à lista geral</button></section><aside>${energyPanel(true)}</aside></div>${renderUnlocks()}`;
  }
  function libraryView() {
    const articles = D.articles.filter(a => D.matches(`${a.title} ${a.category} ${a.summary} ${a.paragraphs.join(' ')}`, ui.query));
    return pageHeading('CONHECIMENTO PARA A SUA JORNADA', 'O pequeno manual de Atreia.', 'Entenda os sistemas, faça suas escolhas e encontre um caminho que combine com você.') + referenceStrip() + `<div class="articles-grid">${articles.map(a => `<button class="article-card" data-action="article" data-article="${a.id}"><img class="article-image" src="assets/${a.image}" alt="" width="480" height="270" loading="lazy"><span class="article-info"><span class="eyebrow">${a.category}</span><h2>${a.title}</h2><p>${a.summary}</p><span class="text-link">Abrir guia ${icon('arrow', 'small')}</span></span></button>`).join('')}</div>${!articles.length ? '<p class="no-results">Nenhum guia encontrado. Tente “runas”, “voo” ou “equipamento”.</p>' : ''}`;
  }
  function classesView() {
    const classes = D.classes.filter(c => (ui.classFilter === 'all' || c.filter === ui.classFilter) && D.matches(`${c.name} ${c.label} ${c.role} ${c.description}`, ui.query));
    return pageHeading('ENCONTRE SEU ESTILO', 'O poder de ser você.', 'Conheça as oito classes da apresentação global consultada e escolha a que mais combina com a sua aventura.') + `<div class="class-filters" role="group" aria-label="Filtrar classes">${[['all', 'Todas as classes'], ['dano', 'Dano'], ['defesa', 'Defesa'], ['suporte', 'Suporte']].map(([id, title]) => `<button class="class-filter ${ui.classFilter === id ? 'active' : ''}" data-action="class-filter" data-filter="${id}" aria-pressed="${ui.classFilter === id}">${title}</button>`).join('')}</div><div class="classes-grid">${classes.map(c => `<article class="class-card ${state.profile.classId === c.id ? 'selected' : ''}">${state.profile.classId === c.id ? `<span class="class-selected">${icon('check')} SUA CLASSE</span>` : ''}<img class="class-art" src="assets/class-${c.image}.webp" alt="Ilustração oficial da classe ${c.name}" width="360" height="360" loading="lazy"><span class="eyebrow">${c.role}</span><h2>${c.name}</h2><span class="class-translation">${c.label}</span><p>${c.description}</p><button class="button ${state.profile.classId === c.id ? 'primary' : ''}" data-action="choose-class" data-class="${c.id}">${state.profile.classId === c.id ? 'Classe selecionada' : 'Esta é a minha classe'} ${icon(state.profile.classId === c.id ? 'check' : 'arrow', 'small')}</button></article>`).join('')}</div>${classes.length ? '' : '<p class="no-results">Nenhuma classe encontrada para estes filtros.</p>'}${chosenClass() ? `<div class="routine-tip" style="margin-top:24px"><strong>Uma dica para ${chosenClass().name}:</strong> ${chosenClass().tip}</div>` : ''}<p class="source-note">Esta seleção personaliza seu perfil no guia. Consulte o cliente para classes e habilidades disponíveis na sua região. <a href="${D.sources.official}" target="_blank" rel="noopener noreferrer">Apresentação oficial</a>.</p>`;
  }

  function showDialog(title, content, eyebrow = 'JORNADA DE DAEVA') {
    if (!dialog.open) dialogReturnFocus = document.activeElement?.id ? { id: document.activeElement.id } : { action: document.activeElement?.dataset.action, stage: document.activeElement?.dataset.stage, taskId: document.activeElement?.dataset.id };
    dialog.innerHTML = `<div class="dialog-header"><div><div class="eyebrow">${eyebrow}</div><h2 id="dialog-title">${title}</h2></div><button class="icon-button" data-action="close-dialog" aria-label="Fechar janela">${icon('close')}</button></div><div class="dialog-content">${content}</div>`;
    if (!dialog.open) dialog.showModal();
    requestAnimationFrame(() => { dialog.querySelector('[autofocus]')?.focus(); });
  }
  function closeDialog() { dialog.close(); dialogAction = null; }
  dialog.addEventListener('close', () => {
    dialogAction = null;
    let target = dialogReturnFocus?.id ? document.getElementById(dialogReturnFocus.id) : [...document.querySelectorAll('[data-action]')].find(el => el.dataset.action === dialogReturnFocus?.action && el.dataset.stage === dialogReturnFocus?.stage && el.dataset.id === dialogReturnFocus?.taskId);
    if (target) target.focus({ preventScroll: true });
  });
  dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeDialog(); } });
  function confirmDialog(title, description, label, onConfirm, danger = false) {
    showDialog(title, `<p>${description}</p><div class="dialog-actions"><button class="button" data-action="close-dialog">Cancelar</button><button class="button ${danger ? 'danger' : 'primary'}" data-action="confirm-dialog">${label}</button></div>`);
    dialogAction = onConfirm;
  }
  function taskDialog(stage = 'general', id = null) {
    const existing = state.tasks.find(t => t.id === id);
    if (id && !existing) return;
    const task = existing || { title: '', detail: '', stage, priority: 'normal', due: '' };
    showDialog(existing ? 'Ajuste sua próxima conquista.' : 'O que você quer conquistar?', `<form id="task-form" data-task-id="${existing?.id || ''}"><div class="field"><label for="task-title">Seu objetivo <span class="field-hint">· obrigatório</span></label><input id="task-title" name="title" type="text" minlength="3" maxlength="120" required placeholder="Ex.: Conseguir uma nova arma em Draupnir" value="${e(task.title)}" autofocus autocomplete="off"></div><div class="field"><label for="task-detail">Anotações <span class="field-hint">· opcional</span></label><textarea id="task-detail" name="detail" maxlength="500" placeholder="Itens necessários, uma dica ou algo para lembrar...">${e(task.detail)}</textarea></div><div class="field"><label for="task-stage">Onde esse objetivo entra?</label><select id="task-stage" name="stage"><option value="general" ${task.stage === 'general' ? 'selected' : ''}>Lista geral · sem etapa específica</option>${D.stages.map((s, i) => `<option value="${s.id}" ${task.stage === s.id ? 'selected' : ''}>${i + 1}. ${s.title} (${s.range})</option>`).join('')}</select><p class="field-hint">Objetivos vinculados aparecem na checklist e contam no progresso da etapa.</p></div><div class="form-row"><div class="field"><label for="task-priority">Prioridade</label><select id="task-priority" name="priority">${[['normal', 'No seu ritmo'], ['high', 'Alta prioridade'], ['low', 'Para depois']].map(([value, name]) => `<option value="${value}" ${task.priority === value ? 'selected' : ''}>${name}</option>`).join('')}</select></div><div class="field"><label for="task-due">Data-alvo <span class="field-hint">· opcional</span></label><input id="task-due" name="due" type="date" value="${e(task.due)}" max="9999-12-31"></div></div><p class="form-error" id="form-error" role="alert"></p><div class="dialog-actions"><button type="button" class="button" data-action="close-dialog">Cancelar</button><button type="submit" class="button primary">${icon(existing ? 'check' : 'plus', 'small')}${existing ? 'Salvar alterações' : 'Adicionar objetivo'}</button></div></form>`, existing ? 'SEU OBJETIVO, DO SEU JEITO' : 'UMA NOVA META NO HORIZONTE');
  }
  function profileDialog() {
    showDialog('Seu Daeva, sua jornada.', `<form id="profile-form"><div class="field"><label for="profile-name">Como podemos chamar você?</label><input id="profile-name" name="name" maxlength="32" required value="${e(state.profile.name)}" autofocus autocomplete="nickname"></div><div class="form-row"><div class="field"><label for="profile-faction">Facção</label><select id="profile-faction" name="faction"><option value="elyos" ${state.profile.faction === 'elyos' ? 'selected' : ''}>Elyos</option><option value="asmodians" ${state.profile.faction === 'asmodians' ? 'selected' : ''}>Asmodianos</option></select></div><div class="field"><label for="profile-class">Classe</label><select id="profile-class" name="classId"><option value="">Ainda vou escolher</option>${D.classes.map(c => `<option value="${c.id}" ${state.profile.classId === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}</select></div></div><div class="field"><label for="profile-power">Poder de combate <span class="field-hint">· opcional</span></label><input id="profile-power" name="power" type="number" min="0" max="99999" step="1" placeholder="Ex.: 1450" value="${state.profile.power ?? ''}"><p class="field-hint">Usado para sugerir sua faixa de evolução. Os objetivos continuam sendo marcados por você.</p></div><p class="form-error" id="form-error" role="alert"></p><div class="dialog-actions"><button type="button" class="button" data-action="close-dialog">Cancelar</button><button type="submit" class="button primary">Salvar meu perfil ${icon('check', 'small')}</button></div></form>`);
  }
  function showArticle(id) {
    const article = D.articles.find(a => a.id === id);
    if (!article) return;
    showDialog(article.title, `<img class="dialog-art" src="assets/${article.image}" alt="Cenário de AION 2" width="480" height="270">${article.paragraphs.map(p => `<p>${p}</p>`).join('')}<ul class="article-points">${article.points.map(p => `<li>${p}</li>`).join('')}</ul><a class="dialog-source" href="${article.source}" target="_blank" rel="noopener noreferrer">${article.source === D.reference.url ? 'Consultar a imagem de referência' : 'Consultar a fonte oficial'} ${icon('external', 'small')}</a>${id === 'classes' ? '<div class="dialog-actions"><button class="button primary" data-action="go-classes">Conhecer as classes '+icon('arrow','small')+'</button></div>' : ''}`, article.category);
  }
  function showStarter() {
    showDialog('Primeiro, uma base sólida.', `<p>Abaixo de 1000 de poder no nível 45? Use estes passos da referência para preparar seu personagem. Esta checklist de preparação é independente do percentual das seis etapas.</p><div class="prep-list">${D.starters.map(t => `<div class="task ${state.completed.includes(t.id) ? 'done' : ''}">${checkbox(t.id, state.completed.includes(t.id), 'starter-')}<label class="task-title" for="check-starter-${t.id}">${t.title}</label></div>`).join('')}</div><p class="source-note">Meta sugerida: chegar a 1000+ e iniciar o roteiro principal. ${D.reference.note}</p><div class="dialog-actions"><button class="button primary" data-action="close-dialog">Voltar à jornada ${icon('arrow', 'small')}</button></div>`, 'O PONTO DE PARTIDA');
  }
  function showSources() {
    showDialog('Um guia feito para a sua jornada.', `<p>Companheiro independente para organizar a progressão em AION 2. O roteiro de equipamento foi adaptado da imagem fornecida por você, creditada a Beeks Official.</p><p>${D.reference.note} As faixas 1269–1420 e 1400–1600 se sobrepõem na imagem; a sugestão por poder muda de faixa em 1400. O ponto 1900 é um checkpoint sugerido e ~2800 é uma meta aproximada.</p><a class="reference-image-link" href="assets/roteiro-referencia.png" target="_blank" rel="noopener noreferrer">${icon('book', 'small')} Abrir a imagem original ${icon('external', 'small')}</a><div class="credits-list"><div><a href="${D.reference.url}" target="_blank" rel="noopener noreferrer">Roteiro de equipamento · Beeks Official ${icon('external', 'small')}</a><small>Fonte das faixas de poder, regras de ouro, marcos e valores de rotina.</small></div><div><a href="${D.sources.official}" target="_blank" rel="noopener noreferrer">AION 2 · Apresentação oficial ${icon('external', 'small')}</a><small>Referência de mundo, facções e classes. Ilustrações de classe e cenários: NC.</small></div><div><a href="${D.sources.guidebook}" target="_blank" rel="noopener noreferrer">AION 2 · Guidebook oficial (coreano) ${icon('external', 'small')}</a><small>Consulta complementar dos sistemas; a versão regional pode ser diferente.</small></div><div><a href="${D.sources.wallpapers}" target="_blank" rel="noopener noreferrer">AION 2 · Galeria oficial japonesa ${icon('external', 'small')}</a><small>Logo e wallpapers usados neste projeto. Direitos de AION 2 e das artes pertencem à NC.</small></div></div><p>Os textos de orientação são editoriais e não constituem uma build oficial. Alt funneling não está incluído. O progresso é salvo apenas neste navegador e pode ser transferido por exportação.</p><p class="field-hint">Fontes: Manrope, Cinzel e Barlow Condensed (Google Fonts). Referências consultadas em 03/10/2026.</p>`, 'FONTES E CRÉDITOS');
  }
  function showData() {
    showDialog('Leve sua jornada com você.', `<p>Seu perfil, seus objetivos e suas conclusões ficam salvos neste navegador. Exporte uma cópia antes de trocar de dispositivo ou limpar os dados do navegador.</p><div class="storage-actions"><button class="storage-action" data-action="export">${icon('download')}<span><strong>Exportar meu progresso</strong><span>Baixe um arquivo JSON com todos os seus dados.</span></span></button><button class="storage-action" data-action="import">${icon('upload')}<span><strong>Restaurar uma cópia</strong><span>Importe um arquivo exportado por este guia.</span></span></button><button class="storage-action" data-action="reset-all">${icon('reset')}<span><strong>Começar uma nova jornada</strong><span>Apague o progresso, o perfil e os objetivos pessoais.</span></span></button></div><p class="source-note">${storageHealthy ? 'Salvamento local disponível. Não há sincronização entre dispositivos.' : 'O salvamento local não está disponível. Exporte uma cópia antes de fechar.'}</p>`, 'SEUS DADOS');
  }
  function exportData() {
    const content = JSON.stringify(state, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = `aion2-jornada-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    toast('Cópia do progresso exportada.');
  }
  function navigate(view) {
    ui.view = view; ui.query = ''; ui.mobileOpen = false;
    if (location.hash !== `#${view}`) location.hash = view;
    else { render(); window.scrollTo({ top: 0 }); }
  }
  function jumpToObjective() {
    const next = nextRecommended();
    if (!next) { taskDialog('general'); return; }
    if (next.stage.id === 'start') { showStarter(); return; }
    ui.view = 'journey'; ui.query = ''; ui.stageFilter = 'all'; ui.opened.add(next.stage.id);
    history.replaceState(null, '', '#journey');
    render();
    requestAnimationFrame(() => { const target = document.getElementById(`task-${next.task.id}`); target?.scrollIntoView({ behavior: 'smooth', block: 'center' }); target?.classList.add('spotlight'); document.getElementById(`check-${next.task.id}`)?.focus({ preventScroll: true }); });
  }

  document.addEventListener('click', event => {
    const navLink = event.target.closest('a[href^="#"]');
    if (navLink && ui.mobileOpen) {
      ui.mobileOpen = false;
      if (navLink.getAttribute('href') === location.hash || (navLink.getAttribute('href') === '#journey' && !location.hash)) render();
    }
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const { action, stage, filter, id } = button.dataset;
    switch (action) {
      case 'menu': ui.mobileOpen = true; render(); document.querySelector('.mobile-nav-close')?.focus(); break;
      case 'close-menu': ui.mobileOpen = false; render(); document.querySelector('.menu-button')?.focus(); break;
      case 'continue': jumpToObjective(); break;
      case 'jump-journey': document.getElementById('journey-section')?.scrollIntoView({ behavior: 'smooth' }); break;
      case 'toggle-stage': if (ui.opened.has(stage)) ui.opened.delete(stage); else ui.opened.add(stage); ui.query = ''; render(); break;
      case 'stage-filter': ui.stageFilter = filter; render(); if (button.classList.contains('stat')) document.getElementById('journey-section')?.scrollIntoView({ behavior: 'smooth' }); break;
      case 'task-filter': ui.taskFilter = filter; render(); break;
      case 'class-filter': ui.classFilter = filter; render(); break;
      case 'clear-search': ui.query = ''; render(); document.getElementById('guide-search').focus(); break;
      case 'reset-filters': ui.stageFilter = 'all'; ui.query = ''; render(); break;
      case 'reset-task-filters': ui.taskFilter = 'all'; ui.scope = 'all'; ui.query = ''; render(); break;
      case 'new-task': taskDialog(stage || 'general'); break;
      case 'edit-task': taskDialog('general', id); break;
      case 'delete-task': {
        const task = state.tasks.find(t => t.id === id);
        if (!task) return;
        confirmDialog('Excluir este objetivo?', `“${e(task.title)}” será removido da sua lista${task.stage !== 'general' ? ' e do progresso da etapa' : ''}.`, 'Excluir objetivo', () => {
          const index = state.tasks.findIndex(t => t.id === id);
          if (index < 0) return;
          const [removed] = state.tasks.splice(index, 1);
          save(); render();
          toast('Objetivo excluído.', false, { label: 'Desfazer', run: () => { if (!state.tasks.some(t => t.id === id)) state.tasks.splice(Math.min(index, state.tasks.length), 0, removed); save(); render(); toast('Objetivo restaurado.'); } });
        }, true);
        break;
      }
      case 'profile': profileDialog(); break;
      case 'article': showArticle(button.dataset.article); break;
      case 'starter': showStarter(); break;
      case 'sources': showSources(); break;
      case 'energy': showDialog('Use sua energia com intenção.', `${energyPanel(true)}<ul class="article-points"><li>Exploração: progressão direcionada e recompensas indicadas como garantidas na referência.</li><li>Conquista: ciclo repetível de equipamento e Kinah.</li><li>Não deixe o recurso atingir o limite; confira custos e disponibilidade no jogo.</li></ul>`, 'ENERGIA DE OD'); break;
      case 'data': showData(); break;
      case 'export': exportData(); break;
      case 'import': document.getElementById('import-file').click(); break;
      case 'reset-all': {
        confirmDialog('Começar do zero?', 'Seu perfil, todos os objetivos pessoais e todas as marcações serão apagados deste navegador. Exporte uma cópia em Seus dados se quiser guardar a jornada atual.', 'Apagar e recomeçar', () => { state = D.freshState(); ui.opened = new Set(['base']); ui.stageFilter = 'all'; ui.hideDone = false; ui.query = ''; ui.taskFilter = 'pending'; ui.scope = 'all'; save(); render(); toast('Uma nova jornada começa agora.'); }, true);
        break;
      }
      case 'reset-routine': {
        if (!D.routines.some(t => state.completed.includes(t.id))) { toast('A checklist da sessão já está pronta.'); break; }
        confirmDialog('Preparar uma nova sessão?', 'As quatro atividades da rotina serão desmarcadas. Seus objetivos pessoais e as etapas da jornada serão preservados.', 'Iniciar nova sessão', () => { const routineIds = D.routines.map(t => t.id); state.completed = state.completed.filter(id => !routineIds.includes(id)); save(); render(); toast('Checklist pronta para a próxima sessão.'); });
        break;
      }
      case 'choose-class': {
        const c = D.classes.find(c => c.id === button.dataset.class);
        if (!c) return;
        state.profile.classId = c.id; save(); render(); toast(`${c.name} selecionado para o seu perfil.`); break;
      }
      case 'go-classes': closeDialog(); navigate('classes'); break;
      case 'close-dialog': closeDialog(); break;
      case 'confirm-dialog': { const run = dialogAction; closeDialog(); run?.(); break; }
      case 'toast-action': { const run = toastAction; toastAction = null; run?.(); break; }
    }
  });
  document.addEventListener('change', event => {
    const target = event.target;
    if (target.dataset.check) {
      const id = target.dataset.check;
      const custom = state.tasks.find(t => t.id === id);
      if (custom) custom.done = target.checked;
      else if (target.checked && !state.completed.includes(id)) state.completed.push(id);
      else if (!target.checked) state.completed = state.completed.filter(item => item !== id);
      save(); render();
      if (dialog.open && D.starters.some(t => t.id === id)) { showStarter(); document.getElementById(`check-starter-${id}`)?.focus(); }
      if (target.checked && storageHealthy) toast('Mais um passo na sua jornada.');
    }
    if (target.id === 'hide-done') { ui.hideDone = target.checked; render(); }
    if (target.id === 'scope-filter') { ui.scope = target.value; render(); }
  });
  document.addEventListener('input', event => {
    if (event.target.id === 'guide-search') { ui.query = event.target.value.slice(0, 150); render(); }
    if (['task-title', 'profile-name'].includes(event.target.id)) event.target.setCustomValidity('');
  });
  document.addEventListener('submit', event => {
    if (event.target.id === 'task-form') {
      event.preventDefault();
      const form = event.target;
      const fields = new FormData(form);
      const title = String(fields.get('title')).trim();
      if (title.length < 3) { form.elements.title.setCustomValidity('Escreva pelo menos 3 caracteres, além dos espaços.'); form.elements.title.reportValidity(); return; }
      if (state.tasks.length >= 1000 && !form.dataset.taskId) { document.getElementById('form-error').textContent = 'O limite é de 1000 objetivos pessoais. Exclua um objetivo antes de criar outro.'; return; }
      const due = String(fields.get('due'));
      if (due && !D.isDate(due)) { document.getElementById('form-error').textContent = 'Informe uma data válida.'; return; }
      const existing = state.tasks.find(t => t.id === form.dataset.taskId);
      if (form.dataset.taskId && !existing) { document.getElementById('form-error').textContent = 'Este objetivo mudou em outra aba. Feche a janela e abra-o novamente.'; return; }
      const task = { id: existing?.id || `task-${crypto.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2)}`, title, detail: String(fields.get('detail')).trim(), stage: String(fields.get('stage')), priority: String(fields.get('priority')), due, done: existing?.done || false };
      const candidate = { ...state, tasks: existing ? state.tasks.map(t => t.id === existing.id ? task : t) : [...state.tasks, task] };
      try { state = D.validateState(candidate); }
      catch (error) { document.getElementById('form-error').textContent = error.message; return; }
      if (task.stage !== 'general') ui.opened.add(task.stage);
      save(); closeDialog(); render();
      if (storageHealthy) toast(existing ? 'Objetivo atualizado.' : 'Seu novo objetivo já faz parte da jornada.');
    }
    if (event.target.id === 'profile-form') {
      event.preventDefault();
      const form = event.target;
      const fields = new FormData(form);
      const name = String(fields.get('name')).trim();
      if (!name) { form.elements.name.setCustomValidity('Informe um nome além dos espaços.'); form.elements.name.reportValidity(); return; }
      const profile = { name, faction: fields.get('faction'), classId: fields.get('classId'), power: fields.get('power') === '' ? null : Number(fields.get('power')) };
      try { state = D.validateState({ ...state, profile }); }
      catch (error) { document.getElementById('form-error').textContent = error.message; return; }
      const next = nextRecommended(); if (next && next.stage.id !== 'start') ui.opened.add(next.stage.id);
      save(); closeDialog(); render(); if (storageHealthy) toast('Seu perfil está pronto para a aventura.');
    }
  });
  document.getElementById('import-file').addEventListener('change', async event => {
    const file = event.target.files[0];
    event.target.value = '';
    if (!file) return;
    if (file.size > 2000000) { toast('Arquivo muito grande. Use um backup JSON de até 2 MB.', true); return; }
    try {
      const restored = D.validateState(JSON.parse(await file.text()));
      const count = D.progress(restored);
      const revision = memoryRevision;
      confirmDialog('Restaurar esta jornada?', `A cópia de <strong>${e(restored.profile.name)}</strong> contém ${count.done} objetivos da jornada concluídos e ${restored.tasks.length} objetivos pessoais. Ela substituirá o progresso atual deste navegador.`, 'Restaurar progresso', () => {
        if (revision !== memoryRevision) { toast('Seu progresso mudou em outra aba. Importe novamente para revisar a substituição.', true); return; }
        state = restored; ui.opened = new Set([D.nextObjective(state)?.stage.id || 'base']); ui.stageFilter = 'all'; ui.taskFilter = 'pending'; ui.query = ''; ui.scope = 'all'; ui.hideDone = false;
        save(); render(); if (storageHealthy) toast('Sua jornada foi restaurada.');
      });
    } catch (error) { toast(error instanceof SyntaxError ? 'O arquivo não contém um JSON válido.' : error instanceof DOMException ? 'Não foi possível ler o arquivo. Selecione uma cópia local acessível.' : error.message, true); }
  });
  window.addEventListener('hashchange', () => {
    const view = location.hash.slice(1);
    ui.view = views[view] ? view : 'journey'; ui.query = ''; ui.mobileOpen = false;
    render(); window.scrollTo({ top: 0 }); document.getElementById('main').focus({ preventScroll: true });
  });
  mobileViewport.addEventListener('change', () => { ui.mobileOpen = false; render(); });
  window.addEventListener('storage', event => {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    try {
      state = event.newValue ? D.validateState(JSON.parse(event.newValue)) : D.freshState();
      memoryRevision++; storageHealthy = true; render(); toast('Progresso atualizado a partir de outra aba.');
    } catch { toast('Uma alteração de outra aba não pôde ser lida. Os dados desta sessão foram preservados.', true); }
  });
  document.addEventListener('keydown', event => {
    if (event.key === '/' && !dialog.open && !['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) { event.preventDefault(); document.getElementById('guide-search').focus(); }
    if (event.key === 'Escape' && ui.mobileOpen) { ui.mobileOpen = false; render(); document.querySelector('.menu-button')?.focus(); }
    if (event.key === 'Tab' && ui.mobileOpen && !dialog.open) {
      const candidates = [...document.querySelectorAll('.sidebar a,.sidebar button')].filter(el => el.offsetParent !== null);
      const first = candidates[0], last = candidates.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  render();
  if (loadWarning) toast(loadWarning, true);
})();
