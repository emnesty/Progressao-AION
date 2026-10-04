import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

const context = vm.createContext({});
vm.runInContext(readFileSync(new URL('../dist/data.js', import.meta.url), 'utf8'), context);
const D = context.AionData;
const task = (values = {}) => ({ id: 'task-test', title: 'Buscar minha arma', detail: '', stage: 'base', priority: 'high', due: '', done: false, ...values });

test('o roteiro tem seis etapas e todos os objetivos contam uma só vez', () => {
  const state = D.freshState();
  assert.equal(D.stages.length, 6);
  assert.equal(D.progress(state).total, 30);
  assert.equal(D.progress(state).percent, 0);
  assert.equal(D.nextObjective(state).task.id, 'base-gear');
  state.completed = D.stages.flatMap(s => s.tasks.map(t => t.id));
  assert.equal(D.progress(state).percent, 100);
  assert.equal(D.progress(state).stagesDone, 6);
  assert.equal(D.nextObjective(state), null);
});
test('tarefas gerais, preparação e rotina não alteram o progresso do roteiro', () => {
  const state = D.freshState();
  state.completed = [...D.starters.map(t => t.id), ...D.routines.map(t => t.id)];
  state.tasks.push(task({ stage: 'general', done: true }));
  assert.equal(D.progress(state).total, 30);
  assert.equal(D.progress(state).done, 0);
  assert.equal(D.validateState(JSON.parse(JSON.stringify(state))).completed.length, 10);
});
test('um objetivo pessoal reabre uma etapa concluída e acompanha a mudança de etapa', () => {
  const state = D.freshState();
  state.completed = D.stages[0].tasks.map(t => t.id);
  assert.equal(D.progress(state, 'base').percent, 100);
  state.tasks.push(task());
  assert.equal(D.progress(state, 'base').total, 7);
  assert.equal(D.progress(state, 'base').stagesDone, 0);
  assert.equal(D.nextObjective(state).task.id, 'task-test');
  state.tasks[0].done = true;
  assert.equal(D.progress(state, 'base').percent, 100);
  state.tasks[0].stage = 'expedicoes';
  assert.equal(D.progress(state, 'base').total, 6);
  assert.equal(D.progress(state, 'expedicoes').done, 1);
});
test('exportação e importação preservam dados e eliminam propriedades desconhecidas', () => {
  const state = D.freshState();
  state.profile = { name: '  Daeva  ', faction: 'asmodians', classId: 'cleric', power: 1450 };
  state.tasks.push(task({ title: '<img src=x onerror=alert(1)>', detail: 'Uma tarefa em português', due: '2026-10-15' }));
  const loaded = D.validateState({ ...JSON.parse(JSON.stringify(state)), unwanted: 'x' });
  assert.equal(loaded.profile.name, 'Daeva');
  assert.equal(loaded.profile.power, 1450);
  assert.equal(loaded.tasks[0].title, '<img src=x onerror=alert(1)>');
  assert.equal(loaded.unwanted, undefined);
  assert.equal(D.escape(loaded.tasks[0].title).includes('<'), false);
});
test('backups inválidos não são aceitos parcialmente', () => {
  const invalid = [null, {}, { ...D.freshState(), version: 2 }, { ...D.freshState(), completed: ['unknown'] }, { ...D.freshState(), tasks: [task({ title: '   ' })] }, { ...D.freshState(), tasks: [task({ stage: 'unknown' })] }, { ...D.freshState(), tasks: [task({ done: 'false' })] }, { ...D.freshState(), tasks: [task({ id: '" onclick="alert(1)' })] }, { ...D.freshState(), tasks: [task(), task()] }, { ...D.freshState(), tasks: [task({ due: '2026-02-30' })] }, { ...D.freshState(), profile: { ...D.freshState().profile, power: -1 } }];
  for (const value of invalid) assert.throws(() => D.validateState(value));
});
test('a busca ignora acentos e maiúsculas', () => {
  assert.ok(D.matches('Preparação para a Transcendência', 'transcendencia'));
  assert.ok(D.matches('Runas do Confronto', 'RUNAS'));
  assert.ok(!D.matches('Cinto Nobre', 'amuleto'));
});
