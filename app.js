const START_TOKEN = "^";
const END_TOKEN = "$";
const NAME_OUTPUT_COUNT = 12;
const STORAGE_KEY = "bigram-studio-state-v2";
const SVG_NS = "http://www.w3.org/2000/svg";

const SAMPLE_CORPORA = {
  lesson: {
    kind: "text",
    labelKey: "sampleLesson",
    text:
      "Bigrams are one of the simplest language models. We read the training text one character at a time, count which character follows which, and then convert those counts into probabilities. If the model often sees t followed by h, it learns that h is a likely next character after t. Generation works by sampling from those learned probabilities over and over again.",
  },
  rain: {
    kind: "text",
    labelKey: "sampleRain",
    text:
      "Rain tapped softly on the studio roof while the class whispered over their notes. Small sounds turned into patterns, and the patterns turned into rhythm. Soon the room was full of repeating shapes: rain, refrain, train, and grain.",
  },
  robots: {
    kind: "text",
    labelKey: "sampleRobots",
    text:
      "A little classroom robot rolled to the whiteboard and wrote hello. The students laughed, and the robot wrote hello again. After a few minutes the machine had learned the rhythm of the room, and its messages sounded almost playful.",
  },
  names: {
    kind: "names",
    labelKey: "sampleNames",
    text: [
      "Ana",
      "Beatriz",
      "Bruno",
      "Camila",
      "Daniel",
      "Eduarda",
      "Felipe",
      "Gabriela",
      "Helena",
      "Isabela",
      "Joao",
      "Julia",
      "Larissa",
      "Laura",
      "Lucas",
      "Mariana",
      "Mateus",
      "Nicolas",
      "Otavio",
      "Rafaela",
      "Samuel",
      "Sofia",
      "Thiago",
      "Valentina",
      "Vinicius",
      "Yasmin",
    ].join("\n"),
  },
};

const TRANSLATIONS = {
  en: {
    pageTitle: "Bigram Studio",
    languageLabel: "Interface language",
    languageEnglish: "English",
    languagePortuguese: "Português (Brasil)",
    modeLabel: "Corpus type",
    modeText: "Text",
    modeNames: "Names",
    heroEyebrow: "Introduction to AI • Character-level language models",
    heroText:
      "Watch a tiny language model learn from text one neighboring character at a time. Paste a corpus, inspect the probability of the next character, and sample new text from the learned bigram model.",
    step1Label: "Step 1",
    step1Title: "Count character pairs",
    step1Body: "We slide through the text and record every current → next transition.",
    step2Label: "Step 2",
    step2Title: "Turn counts into probabilities",
    step2Body: "Each row becomes a distribution over what tends to come next.",
    step3Label: "Step 3",
    step3Title: "Sample from the model",
    step3Body: "Generation works by repeatedly drawing the next character.",
    coreIdeaTitle: "The core idea",
    whatYouCanDoTitle: "What you can do here",
    feature1: "Swap training text instantly",
    feature2: "See the full bigram heatmap",
    feature3: "Probe one character at a time",
    feature4: "Turn a class list of names into a name generator",
    trainKicker: "Train The Model",
    trainHeadingText: "Paste any text and watch the bigram model update",
    trainHeadingNames: "Paste a list of names and watch the name model update",
    modeHintText:
      "In text mode, paste a paragraph and the model will learn character-to-character transitions.",
    modeHintNames:
      "In names mode, paste one name per line or separate names with commas. The model will learn how names begin, continue, and end.",
    sampleLesson: "AI Lesson",
    sampleRain: "Rain Poem",
    sampleRobots: "Robot Story",
    sampleNames: "Name List",
    lowercaseLabel: "Lowercase text",
    spacesLabel: "Keep spaces",
    punctuationLabel: "Keep punctuation",
    sortLabel: "Order symbols",
    sortFrequency: "By frequency",
    sortAlphabetical: "Alphabetically",
    trainingLabelText: "Training text",
    trainingLabelNames: "Training names",
    previewNormalizedTitle: "Normalized preview",
    previewPairsTitle: "First extracted bigrams",
    snapshotKicker: "Model Snapshot",
    snapshotHeading: "What the corpus becomes after training",
    statCharacters: "Characters",
    statNames: "Names in corpus",
    statSymbols: "Unique symbols",
    statBigrams: "Observed bigrams",
    statBranching: "Average branching",
    topBigramsTitle: "Most common transitions",
    whyItMattersTitle: "Why this matters",
    heatmapKicker: "Bigram Heatmap",
    heatmapHeadingText: "Rows are current characters, columns are next characters",
    heatmapHeadingNames:
      "Rows are current symbols, columns are next symbols, including start and end",
    legendLow: "Low probability",
    legendHigh: "High probability",
    focusKicker: "Local Neighborhood",
    focusHeadingText: "Probe one symbol and inspect what tends to follow it",
    focusHeadingNames:
      "Probe one symbol and inspect how a name can continue from that point",
    generateKicker: "Generate Output",
    generateHeadingText: "Sample from the learned bigram model",
    generateHeadingNames: "Invent new names from the learned bigram model",
    seedLabelText: "Seed text",
    seedLabelNames: "Prefix",
    seedPlaceholderText: "Try: the ",
    seedPlaceholderNames: "Try: ma",
    lengthLabelText: "Length",
    lengthLabelNames: "Max name length",
    temperatureLabel: "Temperature",
    generateButtonText: "Generate sample",
    generateButtonNames: "Generate names",
    copyButton: "Copy output",
    copySuccess: "Copied",
    copyFailure: "Copy failed",
    previewEmptyText: "Add some training text to see the normalized corpus.",
    previewEmptyNames: "Add some names to see the normalized list and extracted pairs.",
    heatmapEmpty: "Paste some training data to build the heatmap.",
    focusEmpty: "Select a symbol to explore its local neighborhood.",
    focusNoOutgoing:
      "{symbol} never appears with a following symbol in the normalized data, so the model has nothing to sample from at this step.",
    outputEmptyText:
      "Once the model has some training text, generated samples will appear here.",
    outputEmptyNames:
      "Once the model has a list of names, invented names will appear here.",
    tooltipCount: "Count",
    tooltipProbability: "P(next | current)",
    selectedBadge: "Selected: {symbol}",
    selectedNone: "Selected: none",
    noteNeedDataText:
      "A bigram model needs at least two characters of training text before it can learn any transition probabilities.",
    noteNeedDataNames:
      "A name generator needs at least a few names before it can learn useful character transitions.",
    noteTooShort: "The corpus is too short to produce a meaningful transition table yet.",
    noteTopPatternText:
      "In this corpus, {next} is especially likely after {current}. That makes {compactCurrent} → {compactNext} a strong local pattern for the model to imitate during generation.",
    noteTopPatternNames:
      "In this name list, {compactCurrent} → {compactNext} is one of the strongest local patterns. Start and end tokens help the model learn how names begin and when they stop.",
    selectedSummaryText:
      "{selected} is followed by {next} most often in this corpus. The bars below show the full next-character distribution for the currently selected symbol.",
    selectedSummaryNames:
      "{selected} often continues to {next} in this name list. The bars below show how the model can continue from the selected symbol.",
    generatedNamesFallback: "No new names yet. Try a longer list or a different prefix.",
    spaceWord: "space",
    startWord: "start token",
    endWord: "end token",
  },
  "pt-BR": {
    pageTitle: "Bigram Studio",
    languageLabel: "Idioma da interface",
    languageEnglish: "English",
    languagePortuguese: "Português (Brasil)",
    modeLabel: "Tipo de corpus",
    modeText: "Texto",
    modeNames: "Nomes",
    heroEyebrow: "Introdução à IA • Modelos de linguagem em nível de caractere",
    heroText:
      "Veja um pequeno modelo de linguagem aprender a partir do texto, um caractere vizinho de cada vez. Cole um corpus, inspecione a probabilidade do próximo caractere e gere novas saídas a partir do modelo de bigramas aprendido.",
    step1Label: "Passo 1",
    step1Title: "Contar pares de caracteres",
    step1Body: "Percorremos o texto e registramos cada transição caractere atual → próximo caractere.",
    step2Label: "Passo 2",
    step2Title: "Transformar contagens em probabilidades",
    step2Body: "Cada linha vira uma distribuição do que tende a aparecer em seguida.",
    step3Label: "Passo 3",
    step3Title: "Amostrar do modelo",
    step3Body: "A geração funciona escolhendo repetidamente o próximo caractere.",
    coreIdeaTitle: "A ideia central",
    whatYouCanDoTitle: "O que você pode fazer aqui",
    feature1: "Trocar o texto de treinamento instantaneamente",
    feature2: "Ver o mapa de calor completo dos bigramas",
    feature3: "Explorar um caractere de cada vez",
    feature4: "Transformar uma lista de nomes da turma em um gerador de nomes",
    trainKicker: "Treinar o modelo",
    trainHeadingText: "Cole qualquer texto e veja o modelo de bigramas se atualizar",
    trainHeadingNames: "Cole uma lista de nomes e veja o modelo de nomes se atualizar",
    modeHintText:
      "No modo texto, cole um parágrafo e o modelo aprenderá transições de caractere para caractere.",
    modeHintNames:
      "No modo nomes, cole um nome por linha ou separe os nomes com vírgulas. O modelo aprenderá como os nomes começam, continuam e terminam.",
    sampleLesson: "Lição de IA",
    sampleRain: "Poema da chuva",
    sampleRobots: "História de robô",
    sampleNames: "Lista de nomes",
    lowercaseLabel: "Colocar em minúsculas",
    spacesLabel: "Manter espaços",
    punctuationLabel: "Manter pontuação",
    sortLabel: "Ordenar símbolos",
    sortFrequency: "Por frequência",
    sortAlphabetical: "Em ordem alfabética",
    trainingLabelText: "Texto de treinamento",
    trainingLabelNames: "Nomes de treinamento",
    previewNormalizedTitle: "Prévia normalizada",
    previewPairsTitle: "Primeiros bigramas extraídos",
    snapshotKicker: "Retrato do modelo",
    snapshotHeading: "No que o corpus se transforma depois do treinamento",
    statCharacters: "Caracteres",
    statNames: "Nomes no corpus",
    statSymbols: "Símbolos únicos",
    statBigrams: "Bigramas observados",
    statBranching: "Ramificação média",
    topBigramsTitle: "Transições mais comuns",
    whyItMattersTitle: "Por que isso importa",
    heatmapKicker: "Mapa de calor",
    heatmapHeadingText: "As linhas são os caracteres atuais e as colunas são os próximos caracteres",
    heatmapHeadingNames:
      "As linhas são os símbolos atuais e as colunas são os próximos símbolos, incluindo início e fim",
    legendLow: "Baixa probabilidade",
    legendHigh: "Alta probabilidade",
    focusKicker: "Vizinhança local",
    focusHeadingText: "Explore um símbolo e veja o que tende a vir em seguida",
    focusHeadingNames:
      "Explore um símbolo e veja como um nome pode continuar a partir desse ponto",
    generateKicker: "Gerar saída",
    generateHeadingText: "Amostre do modelo de bigramas aprendido",
    generateHeadingNames: "Invente novos nomes a partir do modelo de bigramas aprendido",
    seedLabelText: "Texto inicial",
    seedLabelNames: "Prefixo",
    seedPlaceholderText: "Ex.: a ",
    seedPlaceholderNames: "Ex.: ma",
    lengthLabelText: "Comprimento",
    lengthLabelNames: "Tamanho máximo do nome",
    temperatureLabel: "Temperatura",
    generateButtonText: "Gerar amostra",
    generateButtonNames: "Gerar nomes",
    copyButton: "Copiar saída",
    copySuccess: "Copiado",
    copyFailure: "Falha ao copiar",
    previewEmptyText: "Adicione texto de treinamento para ver o corpus normalizado.",
    previewEmptyNames: "Adicione nomes para ver a lista normalizada e os pares extraídos.",
    heatmapEmpty: "Cole dados de treinamento para montar o mapa de calor.",
    focusEmpty: "Selecione um símbolo para explorar sua vizinhança local.",
    focusNoOutgoing:
      "{symbol} nunca aparece com um símbolo seguinte nos dados normalizados, então o modelo não tem o que amostrar nesta etapa.",
    outputEmptyText:
      "Assim que o modelo tiver texto suficiente, as amostras geradas aparecerão aqui.",
    outputEmptyNames:
      "Assim que o modelo tiver uma lista de nomes, os nomes inventados aparecerão aqui.",
    tooltipCount: "Contagem",
    tooltipProbability: "P(próximo | atual)",
    selectedBadge: "Selecionado: {symbol}",
    selectedNone: "Selecionado: nenhum",
    noteNeedDataText:
      "Um modelo de bigramas precisa de pelo menos dois caracteres de treinamento antes de aprender probabilidades de transição.",
    noteNeedDataNames:
      "Um gerador de nomes precisa de pelo menos alguns nomes antes de aprender transições úteis entre caracteres.",
    noteTooShort: "O corpus ainda é curto demais para produzir uma tabela de transições significativa.",
    noteTopPatternText:
      "Neste corpus, {next} é especialmente provável depois de {current}. Isso faz de {compactCurrent} → {compactNext} um padrão local forte para o modelo imitar durante a geração.",
    noteTopPatternNames:
      "Nesta lista de nomes, {compactCurrent} → {compactNext} é um dos padrões locais mais fortes. Os tokens de início e fim ajudam o modelo a aprender como os nomes começam e quando eles terminam.",
    selectedSummaryText:
      "{selected} é seguido por {next} com mais frequência neste corpus. As barras abaixo mostram a distribuição completa do próximo caractere para o símbolo selecionado.",
    selectedSummaryNames:
      "{selected} costuma continuar para {next} nesta lista de nomes. As barras abaixo mostram como o modelo pode continuar a partir do símbolo selecionado.",
    generatedNamesFallback:
      "Ainda não surgiram novos nomes. Tente uma lista maior ou um prefixo diferente.",
    spaceWord: "espaço",
    startWord: "token de início",
    endWord: "token de fim",
  },
};

const elements = {
  languageLabel: document.getElementById("language-label"),
  languageRow: document.getElementById("language-row"),
  modeLabel: document.getElementById("mode-label"),
  modeRow: document.getElementById("mode-row"),
  heroEyebrow: document.getElementById("hero-eyebrow"),
  heroText: document.getElementById("hero-text"),
  step1Label: document.getElementById("step-1-label"),
  step1Title: document.getElementById("step-1-title"),
  step1Body: document.getElementById("step-1-body"),
  step2Label: document.getElementById("step-2-label"),
  step2Title: document.getElementById("step-2-title"),
  step2Body: document.getElementById("step-2-body"),
  step3Label: document.getElementById("step-3-label"),
  step3Title: document.getElementById("step-3-title"),
  step3Body: document.getElementById("step-3-body"),
  coreIdeaTitle: document.getElementById("core-idea-title"),
  whatYouCanDoTitle: document.getElementById("what-you-can-do-title"),
  feature1: document.getElementById("feature-1"),
  feature2: document.getElementById("feature-2"),
  feature3: document.getElementById("feature-3"),
  feature4: document.getElementById("feature-4"),
  trainKicker: document.getElementById("train-kicker"),
  trainHeading: document.getElementById("train-heading"),
  modeHint: document.getElementById("mode-hint"),
  presetRow: document.getElementById("preset-row"),
  lowercaseLabel: document.getElementById("lowercase-label"),
  spacesLabel: document.getElementById("spaces-label"),
  punctuationLabel: document.getElementById("punctuation-label"),
  sortLabel: document.getElementById("sort-label"),
  sortSelect: document.getElementById("sort-select"),
  trainingLabel: document.getElementById("training-label"),
  trainingInput: document.getElementById("training-input"),
  previewNormalizedTitle: document.getElementById("preview-normalized-title"),
  previewPairsTitle: document.getElementById("preview-pairs-title"),
  normalizedPreview: document.getElementById("normalized-preview"),
  pairStrip: document.getElementById("pair-strip"),
  snapshotKicker: document.getElementById("snapshot-kicker"),
  snapshotHeading: document.getElementById("snapshot-heading"),
  statLabelPrimary: document.getElementById("stat-label-primary"),
  statPrimary: document.getElementById("stat-primary"),
  statLabelSymbols: document.getElementById("stat-label-symbols"),
  statSymbols: document.getElementById("stat-symbols"),
  statLabelBigrams: document.getElementById("stat-label-bigrams"),
  statBigrams: document.getElementById("stat-bigrams"),
  statLabelBranching: document.getElementById("stat-label-branching"),
  statBranching: document.getElementById("stat-branching"),
  topBigramsTitle: document.getElementById("top-bigrams-title"),
  topBigrams: document.getElementById("top-bigrams"),
  whyItMattersTitle: document.getElementById("why-it-matters-title"),
  teachingNote: document.getElementById("teaching-note"),
  heatmapKicker: document.getElementById("heatmap-kicker"),
  heatmapHeading: document.getElementById("heatmap-heading"),
  selectedCharBadge: document.getElementById("selected-char-badge"),
  legendLow: document.getElementById("legend-low"),
  legendHigh: document.getElementById("legend-high"),
  heatmap: document.getElementById("heatmap"),
  focusKicker: document.getElementById("focus-kicker"),
  focusHeading: document.getElementById("focus-heading"),
  orbit: document.getElementById("orbit"),
  selectedSummary: document.getElementById("selected-summary"),
  transitionBars: document.getElementById("transition-bars"),
  generateKicker: document.getElementById("generate-kicker"),
  generateHeading: document.getElementById("generate-heading"),
  seedLabel: document.getElementById("seed-label"),
  seedInput: document.getElementById("seed-input"),
  lengthLabelPrefix: document.getElementById("length-label-prefix"),
  lengthValue: document.getElementById("length-value"),
  lengthInput: document.getElementById("length-input"),
  temperatureLabelPrefix: document.getElementById("temperature-label-prefix"),
  temperatureValue: document.getElementById("temperature-value"),
  temperatureInput: document.getElementById("temperature-input"),
  generateButton: document.getElementById("generate-button"),
  copyButton: document.getElementById("copy-button"),
  generatedOutput: document.getElementById("generated-output"),
  lowercaseToggle: document.getElementById("lowercase-toggle"),
  spacesToggle: document.getElementById("spaces-toggle"),
  punctuationToggle: document.getElementById("punctuation-toggle"),
  tooltip: document.getElementById("tooltip"),
};

const state = loadState();
let currentModel = null;
let lastGeneratedText = "";

initialize();

function initialize() {
  bindEvents();
  syncStateToControls();
  applyLocalizedText();
  rerender();
}

function bindEvents() {
  elements.languageRow.addEventListener("click", (event) => {
    const button = event.target.closest("[data-language]");

    if (!button) {
      return;
    }

    state.language = button.dataset.language;
    applyLocalizedText();
    rerender();
  });

  elements.modeRow.addEventListener("click", (event) => {
    const button = event.target.closest("[data-mode]");

    if (!button) {
      return;
    }

    state.mode = button.dataset.mode;
    syncGeneratorControls();
    applyLocalizedText();
    rerender();
  });

  elements.presetRow.addEventListener("click", (event) => {
    const button = event.target.closest("[data-sample]");

    if (!button) {
      return;
    }

    const sampleKey = button.dataset.sample;
    const sample = SAMPLE_CORPORA[sampleKey];
    state.sampleKey = sampleKey;
    state.mode = sample.kind;
    state.trainingText = sample.text;
    elements.trainingInput.value = state.trainingText;
    syncGeneratorControls();
    applyLocalizedText();
    rerender();
  });

  elements.trainingInput.addEventListener("input", () => {
    state.trainingText = elements.trainingInput.value;
    state.sampleKey = "custom";
    rerender();
  });

  elements.lowercaseToggle.addEventListener("change", () => {
    state.options.lowercase = elements.lowercaseToggle.checked;
    rerender();
  });

  elements.spacesToggle.addEventListener("change", () => {
    state.options.keepSpaces = elements.spacesToggle.checked;
    rerender();
  });

  elements.punctuationToggle.addEventListener("change", () => {
    state.options.keepPunctuation = elements.punctuationToggle.checked;
    rerender();
  });

  elements.sortSelect.addEventListener("change", () => {
    state.sortMode = elements.sortSelect.value;
    rerender();
  });

  elements.seedInput.addEventListener("input", () => {
    if (state.mode === "names") {
      state.namePrefix = elements.seedInput.value;
    } else {
      state.textSeed = elements.seedInput.value;
    }

    renderGeneratedText();
    saveState(state);
  });

  elements.lengthInput.addEventListener("input", () => {
    if (state.mode === "names") {
      state.nameMaxLength = Number(elements.lengthInput.value);
    } else {
      state.textLength = Number(elements.lengthInput.value);
    }

    updateGeneratorLabels();
    renderGeneratedText();
    saveState(state);
  });

  elements.temperatureInput.addEventListener("input", () => {
    state.temperature = Number(elements.temperatureInput.value);
    updateGeneratorLabels();
    renderGeneratedText();
    saveState(state);
  });

  elements.generateButton.addEventListener("click", renderGeneratedText);
  elements.copyButton.addEventListener("click", copyGeneratedText);
}

function syncStateToControls() {
  elements.trainingInput.value = state.trainingText;
  elements.lowercaseToggle.checked = state.options.lowercase;
  elements.spacesToggle.checked = state.options.keepSpaces;
  elements.punctuationToggle.checked = state.options.keepPunctuation;
  elements.sortSelect.value = state.sortMode;
  elements.temperatureInput.value = String(state.temperature);
  syncGeneratorControls();
}

function syncGeneratorControls() {
  highlightLanguageButtons();
  highlightModeButtons();
  highlightPresetButton(state.sampleKey);

  if (state.mode === "names") {
    elements.seedInput.value = state.namePrefix;
    elements.lengthInput.min = "4";
    elements.lengthInput.max = "16";
    elements.lengthInput.step = "1";
    elements.lengthInput.value = String(state.nameMaxLength);
  } else {
    elements.seedInput.value = state.textSeed;
    elements.lengthInput.min = "20";
    elements.lengthInput.max = "320";
    elements.lengthInput.step = "1";
    elements.lengthInput.value = String(state.textLength);
  }

  updateGeneratorLabels();
}

function applyLocalizedText() {
  document.documentElement.lang = state.language;
  document.title = t("pageTitle");

  elements.languageLabel.textContent = t("languageLabel");
  elements.modeLabel.textContent = t("modeLabel");
  setSegmentLabel(elements.languageRow, "language", {
    en: t("languageEnglish"),
    "pt-BR": t("languagePortuguese"),
  });
  setSegmentLabel(elements.modeRow, "mode", {
    text: t("modeText"),
    names: t("modeNames"),
  });

  elements.heroEyebrow.textContent = t("heroEyebrow");
  elements.heroText.textContent = t("heroText");
  elements.step1Label.textContent = t("step1Label");
  elements.step1Title.textContent = t("step1Title");
  elements.step1Body.textContent = t("step1Body");
  elements.step2Label.textContent = t("step2Label");
  elements.step2Title.textContent = t("step2Title");
  elements.step2Body.textContent = t("step2Body");
  elements.step3Label.textContent = t("step3Label");
  elements.step3Title.textContent = t("step3Title");
  elements.step3Body.textContent = t("step3Body");
  elements.coreIdeaTitle.textContent = t("coreIdeaTitle");
  elements.whatYouCanDoTitle.textContent = t("whatYouCanDoTitle");
  elements.feature1.textContent = t("feature1");
  elements.feature2.textContent = t("feature2");
  elements.feature3.textContent = t("feature3");
  elements.feature4.textContent = t("feature4");
  elements.trainKicker.textContent = t("trainKicker");
  elements.trainHeading.textContent =
    state.mode === "names" ? t("trainHeadingNames") : t("trainHeadingText");
  elements.modeHint.textContent =
    state.mode === "names" ? t("modeHintNames") : t("modeHintText");
  elements.lowercaseLabel.textContent = t("lowercaseLabel");
  elements.spacesLabel.textContent = t("spacesLabel");
  elements.punctuationLabel.textContent = t("punctuationLabel");
  elements.sortLabel.textContent = t("sortLabel");
  elements.sortSelect.options[0].textContent = t("sortFrequency");
  elements.sortSelect.options[1].textContent = t("sortAlphabetical");
  elements.trainingLabel.textContent =
    state.mode === "names" ? t("trainingLabelNames") : t("trainingLabelText");
  elements.previewNormalizedTitle.textContent = t("previewNormalizedTitle");
  elements.previewPairsTitle.textContent = t("previewPairsTitle");
  elements.snapshotKicker.textContent = t("snapshotKicker");
  elements.snapshotHeading.textContent = t("snapshotHeading");
  elements.statLabelPrimary.textContent =
    state.mode === "names" ? t("statNames") : t("statCharacters");
  elements.statLabelSymbols.textContent = t("statSymbols");
  elements.statLabelBigrams.textContent = t("statBigrams");
  elements.statLabelBranching.textContent = t("statBranching");
  elements.topBigramsTitle.textContent = t("topBigramsTitle");
  elements.whyItMattersTitle.textContent = t("whyItMattersTitle");
  elements.heatmapKicker.textContent = t("heatmapKicker");
  elements.heatmapHeading.textContent =
    state.mode === "names" ? t("heatmapHeadingNames") : t("heatmapHeadingText");
  elements.legendLow.textContent = t("legendLow");
  elements.legendHigh.textContent = t("legendHigh");
  elements.focusKicker.textContent = t("focusKicker");
  elements.focusHeading.textContent =
    state.mode === "names" ? t("focusHeadingNames") : t("focusHeadingText");
  elements.generateKicker.textContent = t("generateKicker");
  elements.generateHeading.textContent =
    state.mode === "names" ? t("generateHeadingNames") : t("generateHeadingText");
  elements.seedLabel.textContent =
    state.mode === "names" ? t("seedLabelNames") : t("seedLabelText");
  elements.seedInput.placeholder =
    state.mode === "names" ? t("seedPlaceholderNames") : t("seedPlaceholderText");
  elements.lengthLabelPrefix.textContent =
    state.mode === "names" ? t("lengthLabelNames") : t("lengthLabelText");
  elements.temperatureLabelPrefix.textContent = t("temperatureLabel");
  elements.generateButton.textContent =
    state.mode === "names" ? t("generateButtonNames") : t("generateButtonText");
  elements.copyButton.textContent = t("copyButton");

  setPresetLabels();
  updateGeneratorLabels();
}

function setSegmentLabel(container, attribute, labels) {
  const buttons = container.querySelectorAll(`[data-${attribute}]`);

  buttons.forEach((button) => {
    button.textContent = labels[button.dataset[attribute]];
  });
}

function setPresetLabels() {
  const buttons = elements.presetRow.querySelectorAll("[data-sample]");

  buttons.forEach((button) => {
    const sample = SAMPLE_CORPORA[button.dataset.sample];
    button.textContent = t(sample.labelKey);
  });
}

function highlightLanguageButtons() {
  toggleActiveButton(elements.languageRow, "language", state.language);
}

function highlightModeButtons() {
  toggleActiveButton(elements.modeRow, "mode", state.mode);
}

function highlightPresetButton(sampleKey) {
  toggleActiveButton(elements.presetRow, "sample", sampleKey);
}

function toggleActiveButton(container, attribute, value) {
  const buttons = container.querySelectorAll(`[data-${attribute}]`);

  buttons.forEach((button) => {
    button.classList.toggle("active", button.dataset[attribute] === value);
  });
}

function rerender() {
  currentModel = buildModel(state.trainingText, state.options, state.sortMode, state.mode);

  if (!currentModel.alphabet.length) {
    state.selectedChar = "";
  } else if (!currentModel.alphabet.includes(state.selectedChar)) {
    state.selectedChar = currentModel.alphabet[0];
  }

  renderPreview(currentModel);
  renderStats(currentModel);
  renderHeatmap(currentModel);
  renderFocus(currentModel);
  renderGeneratedText();
  saveState(state);
}

function buildModel(rawInput, options, sortMode, mode) {
  if (mode === "names") {
    return buildNameModel(rawInput, options, sortMode);
  }

  return buildTextModel(rawInput, options, sortMode);
}

function buildTextModel(rawInput, options, sortMode) {
  const normalizedText = normalizePlainText(rawInput, options);
  const chars = Array.from(normalizedText);
  const sequences = chars.length ? [chars] : [];

  return createTransitionModel(sequences, sortMode, {
    kind: "text",
    previewText: normalizedText,
    primaryCount: chars.length,
  });
}

function buildNameModel(rawInput, options, sortMode) {
  const names = parseNameList(rawInput, options);
  const sequences = names.map((name) => [START_TOKEN, ...Array.from(name), END_TOKEN]);

  return createTransitionModel(sequences, sortMode, {
    kind: "names",
    previewText: names.join(" • "),
    primaryCount: names.length,
    names,
  });
}

function createTransitionModel(sequences, sortMode, metadata) {
  const charCounts = new Map();
  const transitionCounts = new Map();
  const transitionTotals = new Map();
  const bigramCounts = new Map();
  const previewPairs = [];

  sequences.forEach((sequence) => {
    sequence.forEach((symbol) => {
      charCounts.set(symbol, (charCounts.get(symbol) ?? 0) + 1);
    });

    for (let index = 0; index < sequence.length - 1; index += 1) {
      const current = sequence[index];
      const next = sequence[index + 1];
      const row = transitionCounts.get(current) ?? new Map();
      row.set(next, (row.get(next) ?? 0) + 1);
      transitionCounts.set(current, row);
      transitionTotals.set(current, (transitionTotals.get(current) ?? 0) + 1);

      const bigramKey = `${current}\u0000${next}`;
      bigramCounts.set(bigramKey, (bigramCounts.get(bigramKey) ?? 0) + 1);

      if (previewPairs.length < 18) {
        previewPairs.push([current, next]);
      }
    }
  });

  const alphabet = Array.from(charCounts.keys()).sort((left, right) => {
    if (sortMode === "alphabetical") {
      return compareSymbols(left, right);
    }

    return (
      (charCounts.get(right) ?? 0) - (charCounts.get(left) ?? 0) ||
      compareSymbols(left, right)
    );
  });

  let maxProbability = 0;

  transitionCounts.forEach((row, current) => {
    const total = transitionTotals.get(current) ?? 1;

    row.forEach((count) => {
      maxProbability = Math.max(maxProbability, count / total);
    });
  });

  const topBigrams = Array.from(bigramCounts.entries())
    .map(([key, count]) => {
      const [current, next] = key.split("\u0000");
      const total = transitionTotals.get(current) ?? 1;

      return {
        current,
        next,
        count,
        probability: count / total,
      };
    })
    .sort(
      (left, right) =>
        right.count - left.count ||
        right.probability - left.probability ||
        compareSymbols(left.current, right.current) ||
        compareSymbols(left.next, right.next),
    );

  const branchingValues = Array.from(transitionCounts.values()).map((row) => row.size);
  const averageBranching = branchingValues.length
    ? branchingValues.reduce((sum, value) => sum + value, 0) / branchingValues.length
    : 0;

  return {
    ...metadata,
    previewPairs,
    alphabet,
    charCounts,
    transitionCounts,
    transitionTotals,
    topBigrams,
    uniqueBigrams: bigramCounts.size,
    averageBranching,
    maxProbability,
  };
}

function normalizePlainText(rawText, options) {
  let text = rawText.replace(/\r\n?/g, "\n").replace(/\t/g, " ");

  if (options.lowercase) {
    text = text.toLocaleLowerCase(localeCode());
  }

  if (!options.keepPunctuation) {
    text = text.replace(/[^\p{L}\p{N}\s]/gu, "");
  }

  if (options.keepSpaces) {
    text = text.replace(/\s+/g, " ").trim();
  } else {
    text = text.replace(/\s+/g, "");
  }

  return text;
}

function parseNameList(rawInput, options) {
  return rawInput
    .split(/[\n,;]+/g)
    .map((entry) => normalizeName(entry, options))
    .filter(Boolean);
}

function normalizeName(name, options) {
  let value = name.replace(/\r\n?/g, " ").replace(/\t/g, " ").trim();

  if (options.lowercase) {
    value = value.toLocaleLowerCase(localeCode());
  }

  if (!options.keepPunctuation) {
    value = value.replace(/[^\p{L}\p{N}\s]/gu, "");
  }

  if (options.keepSpaces) {
    value = value.replace(/\s+/g, " ").trim();
  } else {
    value = value.replace(/\s+/g, "");
  }

  return value;
}

function renderPreview(model) {
  if (!model.previewText) {
    elements.normalizedPreview.textContent =
      state.mode === "names" ? t("previewEmptyNames") : t("previewEmptyText");
    elements.pairStrip.innerHTML = "";
    return;
  }

  elements.normalizedPreview.textContent = truncate(model.previewText, 260);
  elements.pairStrip.innerHTML = "";

  model.previewPairs.forEach(([current, next]) => {
    const pill = document.createElement("div");
    pill.className = "pair-pill";
    pill.innerHTML = `<span>${compactSymbol(current)}</span><strong>→</strong><span>${compactSymbol(next)}</span>`;
    elements.pairStrip.appendChild(pill);
  });
}

function renderStats(model) {
  elements.statPrimary.textContent = formatNumber(model.primaryCount);
  elements.statSymbols.textContent = formatNumber(model.alphabet.length);
  elements.statBigrams.textContent = formatNumber(model.uniqueBigrams);
  elements.statBranching.textContent = model.averageBranching.toFixed(1);
  elements.topBigrams.innerHTML = "";

  model.topBigrams.slice(0, 8).forEach((bigram) => {
    const chip = document.createElement("div");
    chip.className = "chip";
    chip.innerHTML = `<span>${compactSymbol(bigram.current)} → ${compactSymbol(bigram.next)}</span><strong>${bigram.count}x</strong>`;
    elements.topBigrams.appendChild(chip);
  });

  if (!model.topBigrams.length) {
    elements.topBigrams.innerHTML = `<div class="chip">-</div>`;
  }

  elements.teachingNote.textContent = buildTeachingNote(model);
}

function buildTeachingNote(model) {
  if (!model.previewText) {
    return state.mode === "names" ? t("noteNeedDataNames") : t("noteNeedDataText");
  }

  const top = model.topBigrams[0];

  if (!top) {
    return t("noteTooShort");
  }

  return formatMessage(
    state.mode === "names" ? "noteTopPatternNames" : "noteTopPatternText",
    {
      current: prettySymbol(top.current),
      next: prettySymbol(top.next),
      compactCurrent: compactSymbol(top.current),
      compactNext: compactSymbol(top.next),
    },
  );
}

function renderHeatmap(model) {
  const svg = elements.heatmap;
  svg.innerHTML = "";

  if (!model.alphabet.length) {
    renderSvgMessage(svg, t("heatmapEmpty"));
    elements.selectedCharBadge.textContent = t("selectedNone");
    return;
  }

  const symbolCount = model.alphabet.length;
  const cellSize = symbolCount <= 12 ? 36 : symbolCount <= 20 ? 28 : 22;
  const margin = { top: 94, right: 24, bottom: 24, left: 86 };
  const width = margin.left + symbolCount * cellSize + margin.right;
  const height = margin.top + symbolCount * cellSize + margin.bottom;

  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));

  const grid = createSvgElement("g");
  svg.appendChild(grid);

  model.alphabet.forEach((symbol, rowIndex) => {
    const rowY = margin.top + rowIndex * cellSize;
    const rowLabel = createSvgElement("text", {
      x: margin.left - 12,
      y: rowY + cellSize * 0.66,
      "text-anchor": "end",
      fill: symbol === state.selectedChar ? "#ffd166" : "rgba(243,239,231,0.88)",
      "font-family": "IBM Plex Mono, monospace",
      "font-size": cellSize <= 24 ? 12 : 13,
      cursor: "pointer",
    });

    rowLabel.textContent = compactSymbol(symbol);
    rowLabel.addEventListener("click", () => {
      state.selectedChar = symbol;
      renderHeatmap(model);
      renderFocus(model);
      saveState(state);
    });
    grid.appendChild(rowLabel);
  });

  model.alphabet.forEach((symbol, columnIndex) => {
    const x = margin.left + columnIndex * cellSize + cellSize * 0.5;
    const colLabel = createSvgElement("text", {
      x,
      y: margin.top - 18,
      transform: `rotate(-55 ${x} ${margin.top - 18})`,
      "text-anchor": "middle",
      fill: "rgba(243,239,231,0.88)",
      "font-family": "IBM Plex Mono, monospace",
      "font-size": cellSize <= 24 ? 12 : 13,
    });

    colLabel.textContent = compactSymbol(symbol);
    grid.appendChild(colLabel);
  });

  model.alphabet.forEach((current, rowIndex) => {
    const row = model.transitionCounts.get(current) ?? new Map();
    const total = model.transitionTotals.get(current) ?? 0;

    model.alphabet.forEach((next, columnIndex) => {
      const count = row.get(next) ?? 0;
      const probability = total ? count / total : 0;
      const rect = createSvgElement("rect", {
        x: margin.left + columnIndex * cellSize + 1,
        y: margin.top + rowIndex * cellSize + 1,
        width: cellSize - 2,
        height: cellSize - 2,
        rx: Math.min(8, cellSize * 0.22),
        fill: colorForProbability(probability, model.maxProbability),
        stroke:
          current === state.selectedChar
            ? "rgba(255, 209, 102, 0.65)"
            : "rgba(255,255,255,0.03)",
        "stroke-width": current === state.selectedChar ? 1.2 : 1,
        cursor: "pointer",
      });

      rect.addEventListener("click", () => {
        state.selectedChar = current;
        renderHeatmap(model);
        renderFocus(model);
        saveState(state);
      });
      rect.addEventListener("mouseenter", (event) => {
        showTooltip(
          event,
          `<strong>${compactSymbol(current)} → ${compactSymbol(next)}</strong><br/>${t("tooltipCount")}: ${count}<br/>${t("tooltipProbability")}: ${(probability * 100).toFixed(1)}%`,
        );
      });
      rect.addEventListener("mousemove", moveTooltip);
      rect.addEventListener("mouseleave", hideTooltip);
      grid.appendChild(rect);
    });
  });

  elements.selectedCharBadge.textContent = formatMessage("selectedBadge", {
    symbol: badgeSymbol(state.selectedChar),
  });
}

function renderFocus(model) {
  const svg = elements.orbit;
  svg.innerHTML = "";

  if (!state.selectedChar || !model.alphabet.length) {
    renderSvgMessage(svg, t("focusEmpty"));
    elements.selectedSummary.textContent = t("focusEmpty");
    elements.transitionBars.innerHTML = "";
    return;
  }

  const selected = state.selectedChar;
  const row = model.transitionCounts.get(selected) ?? new Map();
  const total = model.transitionTotals.get(selected) ?? 0;
  const transitions = Array.from(row.entries())
    .map(([next, count]) => ({
      next,
      count,
      probability: total ? count / total : 0,
    }))
    .sort((left, right) => right.probability - left.probability)
    .slice(0, 10);

  if (!transitions.length) {
    renderSvgMessage(svg, formatMessage("focusNoOutgoing", { symbol: badgeSymbol(selected) }));
    elements.selectedSummary.textContent = formatMessage("focusNoOutgoing", {
      symbol: prettySymbol(selected),
    });
    elements.transitionBars.innerHTML = "";
    return;
  }

  const width = 520;
  const height = 400;
  const centerX = width / 2;
  const centerY = height / 2;
  const orbitRadius = 126;

  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));

  const halo = createSvgElement("circle", {
    cx: centerX,
    cy: centerY,
    r: 136,
    fill: "rgba(255, 209, 102, 0.04)",
    stroke: "rgba(255, 209, 102, 0.14)",
    "stroke-dasharray": "6 12",
  });
  svg.appendChild(halo);

  const centerCircle = createSvgElement("circle", {
    cx: centerX,
    cy: centerY,
    r: 42,
    fill: "rgba(255, 139, 77, 0.35)",
    stroke: "rgba(255, 209, 102, 0.85)",
    "stroke-width": 2,
  });
  svg.appendChild(centerCircle);

  const centerText = createSvgElement("text", {
    x: centerX,
    y: centerY + 8,
    "text-anchor": "middle",
    fill: "#f3efe7",
    "font-family": "IBM Plex Mono, monospace",
    "font-size": 26,
    "font-weight": 600,
  });
  centerText.textContent = compactSymbol(selected);
  svg.appendChild(centerText);

  transitions.forEach((transition, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / transitions.length;
    const nodeX = centerX + Math.cos(angle) * orbitRadius;
    const nodeY = centerY + Math.sin(angle) * orbitRadius;
    const radius = 16 + transition.probability * 34;

    const link = createSvgElement("line", {
      x1: centerX,
      y1: centerY,
      x2: nodeX,
      y2: nodeY,
      stroke: colorForProbability(transition.probability, 1),
      "stroke-width": 2 + transition.probability * 16,
      "stroke-linecap": "round",
      opacity: 0.8,
    });
    svg.appendChild(link);

    const node = createSvgElement("circle", {
      cx: nodeX,
      cy: nodeY,
      r: radius,
      fill: colorForProbability(transition.probability, 1),
      stroke: "rgba(255,255,255,0.18)",
      "stroke-width": 1.2,
      cursor: "pointer",
    });

    node.addEventListener("mouseenter", (event) => {
      showTooltip(
        event,
        `<strong>${compactSymbol(selected)} → ${compactSymbol(transition.next)}</strong><br/>${t("tooltipCount")}: ${transition.count}<br/>${t("tooltipProbability")}: ${(transition.probability * 100).toFixed(1)}%`,
      );
    });
    node.addEventListener("mousemove", moveTooltip);
    node.addEventListener("mouseleave", hideTooltip);
    node.addEventListener("click", () => {
      state.selectedChar = transition.next;
      renderHeatmap(model);
      renderFocus(model);
      saveState(state);
    });
    svg.appendChild(node);

    const label = createSvgElement("text", {
      x: nodeX,
      y: nodeY + 6,
      "text-anchor": "middle",
      fill: "#07131f",
      "font-family": "IBM Plex Mono, monospace",
      "font-size": Math.max(11, radius * 0.85),
      "font-weight": 600,
      cursor: "pointer",
    });

    label.textContent = compactSymbol(transition.next);
    label.addEventListener("click", () => {
      state.selectedChar = transition.next;
      renderHeatmap(model);
      renderFocus(model);
      saveState(state);
    });
    svg.appendChild(label);

    const pct = createSvgElement("text", {
      x: nodeX,
      y: nodeY + radius + 18,
      "text-anchor": "middle",
      fill: "rgba(243,239,231,0.8)",
      "font-family": "IBM Plex Mono, monospace",
      "font-size": 11,
    });

    pct.textContent = `${(transition.probability * 100).toFixed(0)}%`;
    svg.appendChild(pct);
  });

  const best = transitions[0];
  elements.selectedSummary.textContent = formatMessage(
    state.mode === "names" ? "selectedSummaryNames" : "selectedSummaryText",
    {
      selected: prettySymbol(selected),
      next: prettySymbol(best.next),
    },
  );
  elements.transitionBars.innerHTML = "";

  transitions.forEach((transition) => {
    const rowElement = document.createElement("div");
    rowElement.className = "transition-row";
    rowElement.innerHTML = `
      <div class="transition-meta">
        <span>${compactSymbol(selected)} → ${compactSymbol(transition.next)}</span>
        <span>${(transition.probability * 100).toFixed(1)}% • ${transition.count}x</span>
      </div>
      <div class="bar-track">
        <div class="bar-fill" style="width: ${transition.probability * 100}%"></div>
      </div>
    `;
    elements.transitionBars.appendChild(rowElement);
  });
}

function renderGeneratedText() {
  updateGeneratorLabels();

  if (!currentModel || !currentModel.alphabet.length) {
    lastGeneratedText = "";
    elements.generatedOutput.classList.remove("is-name-output");
    elements.generatedOutput.textContent =
      state.mode === "names" ? t("outputEmptyNames") : t("outputEmptyText");
    return;
  }

  if (state.mode === "names") {
    const names = generateNameList(
      currentModel,
      state.namePrefix,
      state.nameMaxLength,
      state.temperature,
    );

    lastGeneratedText = names.join("\n");
    elements.generatedOutput.classList.add("is-name-output");
    elements.generatedOutput.innerHTML = "";

    if (!names.length) {
      elements.generatedOutput.textContent = t("generatedNamesFallback");
      return;
    }

    const list = document.createElement("div");
    list.className = "generated-list";

    names.forEach((name) => {
      const chip = document.createElement("div");
      chip.className = "generated-name";
      chip.textContent = name;
      list.appendChild(chip);
    });

    elements.generatedOutput.appendChild(list);
    return;
  }

  const generated = generateText(
    currentModel,
    state.textSeed,
    state.textLength,
    state.temperature,
  );

  lastGeneratedText = generated;
  elements.generatedOutput.classList.remove("is-name-output");
  elements.generatedOutput.textContent = generated;
}

function generateText(model, seedText, length, temperature) {
  const normalizedSeed = normalizePlainText(seedText || "", {
    lowercase: state.options.lowercase,
    keepSpaces: state.options.keepSpaces,
    keepPunctuation: state.options.keepPunctuation,
  });
  const output = Array.from(normalizedSeed || sampleFromCounts(model.charCounts, 1));
  let current = output.length ? output[output.length - 1] : model.alphabet[0];

  while (output.length < length) {
    const row = model.transitionCounts.get(current);

    if (!row || !row.size) {
      current = sampleFromCounts(model.charCounts, 1);
      output.push(current);
      continue;
    }

    const next = sampleFromCounts(row, temperature);
    output.push(next);
    current = next;
  }

  return output.join("");
}

function generateNameList(model, prefix, maxLength, temperature) {
  const normalizedPrefix = normalizeName(prefix || "", {
    lowercase: state.options.lowercase,
    keepSpaces: state.options.keepSpaces,
    keepPunctuation: state.options.keepPunctuation,
  });
  const unique = new Set();
  let attempts = 0;

  while (unique.size < NAME_OUTPUT_COUNT && attempts < NAME_OUTPUT_COUNT * 30) {
    const candidate = generateSingleName(model, normalizedPrefix, maxLength, temperature);

    if (candidate) {
      unique.add(formatGeneratedName(candidate));
    }

    attempts += 1;
  }

  return Array.from(unique);
}

function generateSingleName(model, prefix, maxLength, temperature) {
  const prefixChars = Array.from(prefix);
  const output = prefixChars.filter((char) => char !== START_TOKEN && char !== END_TOKEN);
  let current = output.length ? output[output.length - 1] : START_TOKEN;

  let safety = 0;

  while (output.length < maxLength && safety < maxLength * 6) {
    safety += 1;
    const row = model.transitionCounts.get(current);

    if (!row || !row.size) {
      break;
    }

    const filteredEntries = Array.from(row.entries()).filter(([symbol]) => {
      if (symbol === START_TOKEN) {
        return false;
      }

      if (!output.length && symbol === END_TOKEN) {
        return false;
      }

      return true;
    });

    if (!filteredEntries.length) {
      break;
    }

    const next = sampleFromEntries(filteredEntries, temperature);

    if (next === END_TOKEN) {
      break;
    }

    output.push(next);
    current = next;
  }

  return output.join("").trim();
}

function formatGeneratedName(name) {
  return name.replace(/(^|[\s-])(\p{L})/gu, (match, prefix, letter) => {
    return `${prefix}${letter.toLocaleUpperCase(localeCode())}`;
  });
}

function sampleFromCounts(countMap, temperature) {
  return sampleFromEntries(Array.from(countMap.entries()), temperature);
}

function sampleFromEntries(entries, temperature) {
  const safeTemperature = Math.max(0.01, temperature);
  const weighted = entries.map(([symbol, count]) => ({
    symbol,
    weight: Math.pow(count, 1 / safeTemperature),
  }));
  const totalWeight = weighted.reduce((sum, entry) => sum + entry.weight, 0);
  let threshold = Math.random() * totalWeight;

  for (const entry of weighted) {
    threshold -= entry.weight;

    if (threshold <= 0) {
      return entry.symbol;
    }
  }

  return weighted[weighted.length - 1]?.symbol ?? "";
}

function updateGeneratorLabels() {
  const currentLength = state.mode === "names" ? state.nameMaxLength : state.textLength;
  elements.lengthValue.textContent = String(currentLength);
  elements.temperatureValue.textContent = state.temperature.toFixed(2);
}

async function copyGeneratedText() {
  if (!lastGeneratedText.trim()) {
    return;
  }

  try {
    await navigator.clipboard.writeText(lastGeneratedText);
    elements.copyButton.textContent = t("copySuccess");
  } catch (error) {
    elements.copyButton.textContent = t("copyFailure");
  }

  window.setTimeout(() => {
    elements.copyButton.textContent = t("copyButton");
  }, 1200);
}

function renderSvgMessage(svg, message) {
  svg.setAttribute("viewBox", "0 0 520 220");
  svg.setAttribute("width", "520");
  svg.setAttribute("height", "220");

  const background = createSvgElement("rect", {
    x: 12,
    y: 12,
    width: 496,
    height: 196,
    rx: 18,
    fill: "rgba(255,255,255,0.03)",
    stroke: "rgba(255,255,255,0.06)",
  });
  const text = createSvgElement("text", {
    x: 260,
    y: 116,
    "text-anchor": "middle",
    fill: "rgba(243,239,231,0.72)",
    "font-size": 16,
    "font-family": "Space Grotesk, sans-serif",
  });

  text.textContent = message;
  svg.appendChild(background);
  svg.appendChild(text);
}

function createSvgElement(name, attributes = {}) {
  const element = document.createElementNS(SVG_NS, name);

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, String(value));
  });

  return element;
}

function colorForProbability(probability, maxProbability) {
  if (!probability) {
    return "rgba(255,255,255,0.045)";
  }

  const normalized = Math.min(1, probability / Math.max(0.001, maxProbability));
  const eased = Math.pow(normalized, 0.72);
  const hue = 18 + eased * 148;
  const saturation = 88;
  const lightness = 24 + eased * 48;
  return `hsl(${hue} ${saturation}% ${lightness}%)`;
}

function compactSymbol(symbol) {
  if (symbol === " ") {
    return "␠";
  }

  return symbol;
}

function badgeSymbol(symbol) {
  if (symbol === START_TOKEN || symbol === END_TOKEN || symbol === " ") {
    return prettySymbol(symbol);
  }

  return compactSymbol(symbol);
}

function prettySymbol(symbol) {
  if (symbol === " ") {
    return t("spaceWord");
  }

  if (symbol === START_TOKEN) {
    return t("startWord");
  }

  if (symbol === END_TOKEN) {
    return t("endWord");
  }

  return `"${symbol}"`;
}

function compareSymbols(left, right) {
  const leftPriority = symbolPriority(left);
  const rightPriority = symbolPriority(right);

  if (leftPriority !== rightPriority) {
    return leftPriority - rightPriority;
  }

  return left.localeCompare(right, localeCode(), { sensitivity: "base" });
}

function symbolPriority(symbol) {
  if (symbol === START_TOKEN) {
    return -2;
  }

  if (symbol === END_TOKEN) {
    return -1;
  }

  if (symbol === " ") {
    return 0;
  }

  return 1;
}

function showTooltip(event, html) {
  elements.tooltip.innerHTML = html;
  elements.tooltip.classList.remove("hidden");
  moveTooltip(event);
}

function moveTooltip(event) {
  elements.tooltip.style.left = `${event.clientX + 14}px`;
  elements.tooltip.style.top = `${event.clientY + 14}px`;
}

function hideTooltip() {
  elements.tooltip.classList.add("hidden");
}

function truncate(text, limit) {
  return text.length > limit ? `${text.slice(0, limit - 1)}...` : text;
}

function formatNumber(value) {
  return new Intl.NumberFormat(localeCode()).format(value);
}

function formatMessage(key, replacements = {}) {
  let value = t(key);

  Object.entries(replacements).forEach(([name, replacement]) => {
    value = value.replaceAll(`{${name}}`, replacement);
  });

  return value;
}

function t(key) {
  return TRANSLATIONS[state.language][key] ?? TRANSLATIONS.en[key] ?? key;
}

function localeCode() {
  return state.language === "pt-BR" ? "pt-BR" : "en-US";
}

function loadState() {
  const fallback = {
    language: "en",
    mode: "text",
    sampleKey: "lesson",
    trainingText: SAMPLE_CORPORA.lesson.text,
    selectedChar: " ",
    textSeed: "a",
    namePrefix: "",
    textLength: 140,
    nameMaxLength: 10,
    temperature: 1,
    sortMode: "frequency",
    options: {
      lowercase: true,
      keepSpaces: true,
      keepPunctuation: true,
    },
  };

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return fallback;
    }

    const parsed = JSON.parse(stored);

    return {
      ...fallback,
      ...parsed,
      options: {
        ...fallback.options,
        ...(parsed.options ?? {}),
      },
    };
  } catch (error) {
    return fallback;
  }
}

function saveState(nextState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
}
