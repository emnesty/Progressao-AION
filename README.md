# AION 2 · Jornada de Daeva

Guia interativo em português, feito em HTML, CSS e JavaScript, sem dependências de produção e sem etapa de build.

## Abrir localmente

Execute `npm run dev` e abra http://localhost:4173. Também é possível abrir `dist/index.html` diretamente; prefira o servidor local para que o armazenamento do navegador tenha uma origem estável. Os arquivos publicados ficam em `dist/`.

## Funcionalidades

- Roteiro do nível 45 em seis faixas de poder, adaptado da imagem enviada pelo usuário e creditada a Beeks Official.
- Checklists por etapa, checklist de preparação até 1000 e rotina manual independente.
- Objetivos pessoais gerais ou vinculados a uma etapa, com edição, exclusão, desfazer, prioridade e data opcional.
- Perfil com facção, classe e poder de combate opcional; sugestão da próxima etapa sem conclusão automática.
- Busca sem distinção de acentos, filtros, progresso calculado e marcos de desbloqueio da referência.
- Persistência local, atualização entre abas e backup JSON com validação antes de substituir os dados.
- Layout responsivo, controles por teclado, foco visível, diálogos nativos e respeito a movimento reduzido.

O progresso da jornada inclui os 30 objetivos do roteiro e as tarefas pessoais vinculadas às etapas. Objetivos gerais, preparação e rotina são separados. As tarefas não reiniciam automaticamente. `Nova sessão` limpa somente as quatro marcações de rotina.

As faixas de referência 1269–1420 e 1400–1600 se sobrepõem: a recomendação por poder passa à terceira etapa em 1400. Todas as etapas permanecem acessíveis. Requisitos e limites devem ser confirmados no cliente do jogo; não há integração com a conta AION 2.

## Verificação

`npm run check` verifica a sintaxe e executa os testes de consistência do progresso, preparação/rotina, backup, validação e busca. Requer Node.js 20 ou superior.

## Estrutura

- `dist/index.html`: entrada da aplicação.
- `dist/styles.css`: identidade visual e responsividade.
- `dist/data.js`: roteiro, conteúdos de referência, classes e validação dos dados.
- `dist/app.js`: interface, navegação e interações.
- `dist/assets/`: imagens e fontes locais.
- `scripts/serve.mjs`: servidor local sem dependências.

## Fontes e créditos

A imagem do roteiro está preservada em `dist/assets/roteiro-referencia.png`. Original: https://i.redd.it/cwcyfp2672th1.png. Ela se identifica como roteiro de Beeks Official, temporada 1, nível 45, baseado na pesquisa da semana de lançamento. Os valores não são apresentados como verificação do patch atual.

Artes, classes e cenários: https://aion2.plaync.com/en-us/about/index e https://aion2.ncsoft.jp/. AION 2 e artes oficiais pertencem à NC. Este é um guia independente, sem afiliação com a NC ou Beeks Official.

Fontes locais: Manrope, Cinzel e Barlow Condensed, distribuídas pelo Google Fonts sob licenças SIL Open Font License; licenças incluídas na pasta de assets.

Não são usados rastreadores ou serviços externos em tempo de execução. Exportações JSON contêm somente perfil, objetivos e marcações locais. Guardar a cópia permite transferir o progresso entre a versão local e o site publicado.
