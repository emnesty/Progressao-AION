/* Conteúdo editorial independente. Consulte as referências em Fontes e créditos. */
(() => {
  'use strict';
  const sources = {
    official: 'https://aion2.plaync.com/en-us/about/index',
    guidebook: 'https://aion2.plaync.com/ko-kr/guidebook/list',
    expedition: 'https://aion2.plaync.com/ko-kr/guidebook/view?title=%EC%9B%90%EC%A0%95',
    wallpapers: 'https://aion2.ncsoft.jp/'
  };
  const reference = { url: 'https://i.redd.it/cwcyfp2672th1.png', title: 'Roteiro de equipamento para o nível 45 · Beeks Official', note: 'Adaptado da imagem enviada: temporada 1, semana de lançamento. Faixas, custos e limites são valores de referência, não uma verificação do patch atual. Confirme-os no cliente da sua região.' };
  const stages = [
    { id: 'base', title: 'A base da sua evolução', category: 'PODER PERMANENTE', range: '1000–1269', min: 1000, icon: 'shield', description: 'Fortaleça os sistemas que acompanham você por toda a jornada.', tip: 'Não ignore Masmorras Seladas, Strongholds e Monólitos. A referência destaca esses sistemas como a base do poder permanente.', tasks: [
      { id: 'base-gear', title: 'Montar seu equipamento-base do nível 45', detail: 'Complete os espaços de equipamento. Na referência, essa base leva à faixa de 600+; os sistemas permanentes complementam o caminho até 1000 e além.', tag: 'Equipamento' },
      { id: 'base-sealed', title: 'Limpar as Masmorras Seladas', detail: 'Priorize as disponíveis na sua região para avançar nos pontos de Daevanion.', tag: 'Essencial' },
      { id: 'base-monolith', title: 'Coletar penas e avançar nos Monólitos', detail: 'Use a progressão de Monólito / Traço do Empíreo para evoluir o Amuleto da Revelação.', guide: 'systems' },
      { id: 'base-strongholds', title: 'Fazer Strongholds para o Cinto Nobre', detail: 'Busque os pergaminhos usados no aprimoramento do cinto. A referência indica evolução visual em +10.', guide: 'systems' },
      { id: 'base-abyss', title: 'Buscar as Penas do Abismo', detail: 'Na referência, elas oferecem progressão extra nos painéis. Confira o sistema e a disponibilidade no seu cliente.' },
      { id: 'base-runes', title: 'Equipar duas Runas do Confronto', detail: 'Preencha os dois espaços e mantenha o aprimoramento moderado no início. A imagem alerta que runas podem quebrar.', tag: 'Com cuidado', guide: 'systems' }
    ] },
    { id: 'expedicoes', title: 'Suas primeiras expedições', category: 'META: ~1400', range: '1269–1420', min: 1269, icon: 'castle', description: 'Troque as peças mais fracas e estabeleça seu ciclo de masmorras.', tip: 'Exploração é o caminho indicado para a progressão direcionada; Conquista, para repetir o ciclo de equipamento e Kinah.', tasks: [
      { id: 'exp-accessories', title: 'Criar ou substituir acessórios fracos', detail: 'Revise primeiro os espaços que estão ficando para trás.' },
      { id: 'exp-weapon', title: 'Verificar se sua arma está defasada', detail: 'Crie uma arma apenas se a atual estiver atrasada em relação ao restante do equipamento. Se ela já estiver adequada, marque esta revisão como concluída.' },
      { id: 'exp-draupnir', title: 'Completar Exploração de Draupnir 3 vezes', detail: 'A referência indica um baú de armadura garantido após três explorações. Confira a recompensa no cliente antes de investir recursos.', tag: '3 conclusões', guide: 'dungeons' },
      { id: 'exp-conquest', title: 'Começar as Conquistas acessíveis', detail: 'Entre nas masmorras de Conquista de nível baixo para as quais você já se qualifica.' },
      { id: 'exp-routine', title: 'Organizar sua rotina de atividades', detail: 'Inclua Missões Dever, Pesadelo e Masmorra Diária. Use a seção Rotina para acompanhar a sessão manualmente.', guide: 'routine' }
    ] },
    { id: 'meio', title: 'Novos horizontes', category: 'DESBLOQUEIO EM 1600', range: '1400–1600', min: 1400, icon: 'compass', description: 'Amplie suas opções e prepare a entrada na Transcendência.', tip: 'As faixas da referência se sobrepõem. Use os requisitos reais dos conteúdos e seus objetivos pendentes para decidir quando avançar.', tasks: [
      { id: 'mid-vakron', title: 'Completar Exploração de Vakron 3 vezes', detail: 'A referência aponta outra etapa de armadura garantida após três conclusões. Verifique a missão ou recompensa no jogo.', tag: '3 conclusões' },
      { id: 'mid-legendary', title: 'Distribuir melhorias entre as peças lendárias', detail: 'Evite concentrar todos os materiais em uma única peça enquanto outros espaços estão muito atrás.' },
      { id: 'mid-conquest', title: 'Incluir Uruguy Canyon e Vakron no ciclo', detail: 'Na referência, essas Conquistas passam a integrar a rotina nesta faixa. Confira o poder exigido na sua versão.' },
      { id: 'mid-systems', title: 'Continuar os sistemas permanentes', detail: 'Mantenha cinto, amuleto, runas e painéis de Daevanion avançando junto com o equipamento.', guide: 'systems' },
      { id: 'mid-transcendence', title: 'Chegar à primeira etapa da Transcendência', detail: 'Marco indicado pela referência: 1600 de Poder de Combate. A confirmação de acesso é feita no jogo.', tag: 'Marco: 1600' }
    ] },
    { id: 'transcendencia', title: 'Além dos seus limites', category: 'A ERA DAS ARCANAS', range: '1600–2100', min: 1600, icon: 'sparkles', description: 'Construa poder na Transcendência e desenvolva suas Arcanas.', tip: '1900 aparece como um checkpoint comum antes do próximo avanço; não é apresentado na referência como um requisito obrigatório.', tasks: [
      { id: 'trans-stages', title: 'Evoluir da primeira para a segunda etapa', detail: 'Repita a primeira etapa da Transcendência e avance para a segunda conforme seu personagem estiver preparado.' },
      { id: 'trans-arcana', title: 'Desenvolver suas Arcanas', detail: 'A referência destaca Arcanas como uma das maiores fontes de Poder de Combate nesta fase.' },
      { id: 'trans-craft', title: 'Revisar melhorias criadas e marcos intermediários', detail: 'Use equipamento criado e aprimoramentos intermediários quando forem necessários para o próximo avanço.' },
      { id: 'trans-checkpoint', title: 'Reavaliar a build próximo de 1900', detail: 'Faça uma revisão do personagem nesse checkpoint sugerido antes de tentar a etapa seguinte.', tag: 'Checkpoint' },
      { id: 'trans-2100', title: 'Preparar Fire Temple e Ferocious Horns Den', detail: 'A referência indica a liberação dessas Conquistas em 2100 de Poder de Combate.', tag: 'Marco: 2100' }
    ] },
    { id: 'avancado', title: 'O impulso para o endgame', category: 'CONSOLIDAÇÃO DE PODER', range: '2100–2500', min: 2100, icon: 'swords', description: 'Consolide seu equipamento e avance para recompensas mais fortes.', tip: 'Complete os espaços mais fracos antes de investir em melhorias por vaidade. Tenha reposição antes de arriscar runas.', tasks: [
      { id: 'adv-conquest', title: 'Fazer Conquistas de 3 estrelas', detail: 'Busque as faixas de recompensa mais fortes para as quais seu personagem está preparado.' },
      { id: 'adv-arcana', title: 'Avançar na Transcendência e nos conjuntos de Arcanas', detail: 'Procure etapas mais altas e combinações de Arcanas que apoiem sua progressão.' },
      { id: 'adv-stability', title: 'Estabilizar o aprimoramento do equipamento lendário', detail: 'Leve a maior parte das peças a uma base consistente antes de tentar aprimoramentos altos.' },
      { id: 'adv-runes', title: 'Revisar runas e guardar reposição', detail: 'Melhore as runas com cautela. A referência recomenda só arriscar quando houver reposição.', guide: 'systems' },
      { id: 'adv-weakslots', title: 'Corrigir os espaços mais fracos', detail: 'Identifique o que limita sua evolução e crie uma tarefa específica para a próxima peça ou melhoria.' }
    ] },
    { id: 'raide', title: 'À altura de uma lenda', category: 'PREPARAÇÃO PARA O ENDGAME', range: '2500–2800+', min: 2500, icon: 'crown', description: 'Refine seu personagem e prepare-se para a raide de Ludra.', tip: 'A referência cita aproximadamente 2800 como meta de entrada na raide Ludra. Confirme o requisito e a preparação do grupo no patch atual.', tasks: [
      { id: 'raid-permanent', title: 'Refinar os sistemas permanentes', detail: 'Revise os principais marcos de aprimoramento do seu personagem.' },
      { id: 'raid-bestgear', title: 'Evoluir equipamento, Arcanas e peças criadas', detail: 'Concentre os recursos nas melhorias alinhadas à sua configuração final de combate.' },
      { id: 'raid-rite', title: 'Explorar dificuldades maiores do Rito de Ascensão', detail: 'A referência aponta o modo Desafio em 2500. Escolha dificuldades realistas para sua preparação.', tag: 'Marco: 2500' },
      { id: 'raid-ludra', title: 'Preparar sua entrada na raide Ludra', detail: 'Use ~2800 de Poder de Combate como meta indicada pela imagem, confirme o requisito no jogo e combine a preparação com seu grupo.', tag: 'Meta: ~2800' }
    ] }
  ];
  const starters = [
    { id: 'start-quests', title: 'Concluir missões regionais e secundárias' },
    { id: 'start-sealed', title: 'Limpar as Masmorras Seladas da região inicial' },
    { id: 'start-daevanion', title: 'Usar pontos de Daevanion e Wisdom Stones' },
    { id: 'start-feathers', title: 'Coletar penas para o Amuleto da Revelação' },
    { id: 'start-belt', title: 'Fazer Strongholds para os pergaminhos do Cinto Nobre' },
    { id: 'start-runes', title: 'Equipar duas Runas do Confronto e preencher espaços vazios' }
  ];
  const rules = [
    { icon: 'shield', title: 'Guarde antes do 45', text: 'Evite investir em equipamento temporário durante a subida até o nível 45.' },
    { icon: 'gem', title: 'Ative seu poder', text: 'Use Daevanion Crystals e Wisdom Stones; não os deixe esquecidos.' },
    { icon: 'swords', title: 'Primeiro +5, depois +10', text: 'A referência sugere +5 em todas as peças antes de focar as principais em +10.' },
    { icon: 'flame', title: 'Cuide da Energia de Od', text: 'Evite chegar ao limite. Planeje os resgates no melhor conteúdo disponível.' }
  ];
  const unlocks = [
    { power: 700, title: 'Krao Cave e Draupnir', detail: 'Conquistas' },
    { power: 1000, title: 'Rito de Ascensão', detail: 'Fácil' },
    { power: 1400, title: 'Uruguy Canyon e Vakron', detail: 'Conquista / acesso' },
    { power: 1500, title: 'Rito de Ascensão', detail: 'Normal' },
    { power: 1600, title: 'Transcendência', detail: 'Primeira etapa' },
    { power: 1900, title: 'Revisão de personagem', detail: 'Checkpoint sugerido · não é requisito' },
    { power: 2000, title: 'Rito de Ascensão', detail: 'Difícil' },
    { power: 2100, title: 'Fire Temple e Ferocious Horns Den', detail: 'Conquistas' },
    { power: 2500, title: 'Rito de Ascensão', detail: 'Desafio' },
    { power: 2800, title: 'Raide Ludra', detail: 'Meta aproximada da referência' }
  ];
  const routines = [
    { id: 'routine-duty', title: 'Missões Dever', detail: 'Conferir e concluir as missões disponíveis.', frequency: 'Todo dia' },
    { id: 'routine-nightmare', title: 'Pesadelo', detail: 'Referência: 2 conclusões por dia.', frequency: '2 / dia' },
    { id: 'routine-dungeon', title: 'Masmorra Diária', detail: 'Para Pedras de Aprimoramento. Referência: 7 por semana.', frequency: '7 / semana' },
    { id: 'routine-rite', title: 'Rito de Ascensão', detail: 'Referência: 3 entradas por semana. Se espera subir de poder, considere guardar as entradas para o fim da semana.', frequency: '3 / semana' }
  ];
  const classes = [
    { id: 'gladiator', name: 'Gladiator', label: 'Gladiador', role: 'Corpo a corpo', filter: 'dano', icon: 'swords', image: 1, description: 'Entre no centro do combate com uma grande espada e uma presença ofensiva marcante.', tip: 'Pratique a distância de cada golpe e guarde uma resposta defensiva para os momentos de pressão.' },
    { id: 'templar', name: 'Templar', label: 'Templário', role: 'Defesa', filter: 'defesa', icon: 'shield', image: 2, description: 'Espada e escudo para quem gosta de encarar o perigo na linha de frente.', tip: 'Em grupo, combine posicionamento e proteção. Conheça suas ferramentas defensivas antes de um novo chefe.' },
    { id: 'assassin', name: 'Assassin', label: 'Assassino', role: 'Corpo a corpo', filter: 'dano', icon: 'swords', image: 3, description: 'Um estilo próximo do alvo, com lâminas e atenção ao momento de agir.', tip: 'Treine aproximação e saída. Escolher o momento certo evita perder espaço para as mecânicas do inimigo.' },
    { id: 'ranger', name: 'Ranger', label: 'Arqueiro', role: 'Dano à distância', filter: 'dano', icon: 'target', image: 4, description: 'Arco, alcance e movimento para acompanhar a batalha de outra perspectiva.', tip: 'Experimente atacar mantendo espaço para se mover e observe os limites de alcance das habilidades.' },
    { id: 'chanter', name: 'Chanter', label: 'Cantor', role: 'Suporte', filter: 'suporte', icon: 'sparkles', image: 5, description: 'Um combatente de cajado para quem gosta de contribuir com o ritmo do grupo.', tip: 'Observe os aliados enquanto ataca. Combine suas ferramentas de apoio com os momentos difíceis do encontro.' },
    { id: 'cleric', name: 'Cleric', label: 'Clérigo', role: 'Cura e suporte', filter: 'suporte', icon: 'heart', image: 6, description: 'Uma escolha para quem gosta de cuidar dos aliados e participar ativamente do combate.', tip: 'Posicione-se onde consiga acompanhar o grupo e reserve recursos para os momentos de maior dano.' },
    { id: 'sorcerer', name: 'Sorcerer', label: 'Feiticeiro', role: 'Dano mágico', filter: 'dano', icon: 'flame', image: 7, description: 'Magia à distância para quem prefere ler o combate antes de lançar seus feitiços.', tip: 'Aprenda quais ações exigem tempo e quando você terá espaço para usá-las sem se expor.' },
    { id: 'spiritmaster', name: 'Spiritmaster', label: 'Mestre dos espíritos', role: 'Magia e espíritos', filter: 'dano', icon: 'sparkles', image: 8, description: 'Espíritos e magia compõem um estilo para quem gosta de administrar diferentes ferramentas.', tip: 'Conheça o papel de cada ferramenta da sua classe e pratique as combinações em encontros simples.' }
  ];
  const articles = [
    { id: 'classes', title: 'Encontre a sua classe', category: 'PERSONAGEM', image: 'flight.webp', icon: 'swords', summary: 'O melhor estilo é aquele que combina com você.', paragraphs: ['Pense primeiro na experiência que deseja: combate próximo, ataques à distância, proteção ou apoio. Depois, compare as classes e experimente a que mais desperta a sua curiosidade.', 'As descrições deste guia são pontos de partida, não uma lista de melhores classes. Equilíbrio, habilidades e papéis podem mudar com as atualizações.'], points: ['Escolha pelo estilo de jogo que você quer aprender.', 'Leia suas habilidades e experimente os controles no início.', 'Use a seção Classes para personalizar a dica do seu perfil.'], source: sources.official },
    { id: 'flight', title: 'Atreia, além do chão', category: 'EXPLORAÇÃO', image: 'atreia.webp', icon: 'feather', summary: 'Abra as asas. O caminho também faz parte da aventura.', paragraphs: ['O voo faz parte da identidade de AION 2. Quando estiver disponível para seu personagem, reserve tempo para praticar movimentação, altura e pouso em uma área tranquila.', 'Use os tutoriais e o mapa do seu cliente para conhecer as regras de cada área. Este guia não presume um nível fixo para a liberação de sistemas.'], points: ['Observe os indicadores de voo na interface.', 'Planeje onde pousar antes de atravessar uma área desconhecida.', 'Salve destinos interessantes como objetivos pessoais.'], source: sources.official },
    { id: 'equipment', title: 'Poder com propósito', category: 'EQUIPAMENTOS', image: 'sanctuary.webp', icon: 'shield', summary: 'Entenda cada melhoria antes de investir seus recursos.', paragraphs: ['Use a descrição dos itens para comparar atributos e efeitos com o que a sua classe precisa. Uma nova peça é uma oportunidade de revisar sua configuração, não apenas de olhar um número.', 'Os sistemas de aprimoramento e seus custos variam com a versão. Confira as opções liberadas no seu cliente e planeje o que pretende melhorar antes de usar materiais.'], points: ['Compare a peça nova com a que está equipada.', 'Escolha uma prioridade de cada vez.', 'Anote materiais e próximos itens em uma tarefa desta etapa.'], source: sources.guidebook },
    { id: 'dungeons', title: 'Sua primeira expedição', category: 'JOGO EM GRUPO', image: 'dungeon.webp', icon: 'castle', summary: 'Prepare-se, conheça o encontro e evolua com seu grupo.', paragraphs: ['As expedições reúnem masmorras e encontros com chefes. Comece consultando os requisitos e as informações da atividade no jogo, e escolha um desafio adequado ao seu personagem.', 'Na primeira tentativa, concentre-se em entender os sinais do encontro. Depois, use as tarefas pessoais para anotar o que precisa praticar ou levar na próxima visita.'], points: ['Confira a dificuldade e os requisitos antes de entrar.', 'Combine os papéis e avise se é a sua primeira visita.', 'Consulte recompensas e limites no cliente da sua região.'], source: sources.expedition },
    { id: 'factions', title: 'Dois povos. O seu caminho.', category: 'MUNDO', image: 'elysea.webp', icon: 'sun', summary: 'Elyos ou Asmodianos: escolha onde começa a sua história.', paragraphs: ['Elyos e Asmodianos fazem parte do mundo de AION 2. Explore a apresentação oficial de cada povo e escolha a identidade com a qual você mais se conecta.', 'Se quiser jogar com amigos, combinem as escolhas no jogo antes de criar os personagens. O perfil deste guia é apenas sua organização pessoal e não altera sua conta de AION 2.'], points: ['Alinhe região, servidor e facção com seu grupo.', 'Conheça as duas perspectivas da história.', 'Personalize a facção no perfil deste guia quando quiser.'], source: sources.official },
    { id: 'routine', title: 'Uma aventura no seu ritmo', category: 'PLANEJAMENTO', image: 'asmodae.webp', icon: 'calendar', summary: 'Menos pressa. Mais clareza sobre o próximo passo.', paragraphs: ['Antes de iniciar uma sessão, escolha uma meta principal. Pode ser avançar na campanha, aprender um encontro ou simplesmente explorar. Sua lista precisa ajudar, não virar uma obrigação.', 'As tarefas aqui são manuais e não reiniciam sozinhas. Para repetir um objetivo, desmarque-o. Confira os horários de renovação de atividades diretamente no jogo.'], points: ['Use a lista geral para ideias e lembretes.', 'Vincule um objetivo a uma etapa para encontrá-lo no momento certo.', 'Exporte uma cópia do seu progresso para usar em outro navegador.'], source: sources.guidebook }
  ];
  articles.push({ id: 'systems', title: 'Os sistemas que ficam', category: 'PODER PERMANENTE', image: 'sanctuary.webp', icon: 'gem', summary: 'Cinto, amuletos e runas: dê atenção a cada espaço.', paragraphs: ['Na imagem de referência, o Cinto Nobre progride com pergaminhos de Stronghold e muda visualmente em +10. O Amuleto da Revelação acompanha a progressão de Monólito e penas.', 'O Fierce Battle Amulet é apresentado como um amuleto PvP para mais adiante, vendido na loja do Abismo. Para as duas Runas do Confronto, a recomendação inicial é aprimoramento baixo, pois podem quebrar.'], points: ['Acompanhe o Cinto Nobre e o Amuleto da Revelação desde a base.', 'Preencha os dois espaços de Runas do Confronto.', 'Consulte custos e riscos no cliente antes de aprimorar.'], source: reference.url });
  const taskIds = new Set([...stages.flatMap(s => s.tasks.map(t => t.id)), ...starters.map(t => t.id), ...routines.map(t => t.id)]);
  const stageIds = new Set(stages.map(s => s.id));
  const isDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
  function freshState() {
    return { version: 1, profile: { name: 'Viajante', faction: 'elyos', classId: '', power: null }, completed: [], tasks: [] };
  }
  function validateState(input) {
    if (!input || typeof input !== 'object' || input.version !== 1 || !Array.isArray(input.completed) || !Array.isArray(input.tasks) || !input.profile || typeof input.profile !== 'object') throw new Error('Este arquivo não é um backup compatível do guia.');
    if (input.tasks.length > 1000 || input.completed.length > taskIds.size || input.completed.some(id => !taskIds.has(id))) throw new Error('O arquivo contém objetivos inválidos.');
    const profile = input.profile;
    if (typeof profile.name !== 'string' || !profile.name.trim() || profile.name.trim().length > 32 || !['elyos', 'asmodians'].includes(profile.faction) || (profile.classId !== '' && !classes.some(c => c.id === profile.classId)) || (profile.power !== null && (!Number.isInteger(profile.power) || profile.power < 0 || profile.power > 99999))) throw new Error('O perfil do arquivo é inválido.');
    const ids = new Set();
    const tasks = input.tasks.map(t => {
      if (!t || typeof t.id !== 'string' || !/^[a-zA-Z0-9-]{1,80}$/.test(t.id) || taskIds.has(t.id) || ids.has(t.id) || typeof t.title !== 'string' || t.title.trim().length < 3 || t.title.trim().length > 120 || typeof t.detail !== 'string' || t.detail.length > 500 || (t.stage !== 'general' && !stageIds.has(t.stage)) || !['normal', 'high', 'low'].includes(t.priority) || typeof t.done !== 'boolean' || (t.due !== '' && !isDate(t.due))) throw new Error('O arquivo contém uma tarefa inválida.');
      ids.add(t.id);
      return { id: t.id, title: t.title.trim(), detail: t.detail, stage: t.stage, priority: t.priority, due: t.due, done: t.done };
    });
    return { version: 1, profile: { name: profile.name.trim(), faction: profile.faction, classId: profile.classId, power: profile.power }, completed: [...new Set(input.completed)], tasks };
  }
  function tasksForStage(state, stage) {
    const completed = new Set(state.completed);
    return [...stage.tasks.map(t => ({ ...t, done: completed.has(t.id), custom: false, stage: stage.id })), ...state.tasks.filter(t => t.stage === stage.id).map(t => ({ ...t, custom: true }))];
  }
  function progress(state, stageId) {
    const selected = stageId ? stages.filter(s => s.id === stageId) : stages;
    const tasks = selected.flatMap(s => tasksForStage(state, s));
    const done = tasks.filter(t => t.done).length;
    return { done, total: tasks.length, percent: tasks.length ? Math.round(done / tasks.length * 100) : 0, stagesDone: selected.filter(s => tasksForStage(state, s).every(t => t.done)).length };
  }
  function nextObjective(state) {
    for (const stage of stages) {
      const task = tasksForStage(state, stage).find(t => !t.done);
      if (task) return { stage, task };
    }
    return null;
  }
  const normalize = text => String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const matches = (text, query) => normalize(text).includes(normalize(query).trim());
  const escape = text => String(text ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  globalThis.AionData = { sources, reference, stages, starters, rules, unlocks, routines, classes, articles, freshState, validateState, tasksForStage, progress, nextObjective, matches, escape, isDate };
})();
