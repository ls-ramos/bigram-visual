const SAMPLE_CORPORA = {
  lesson:
    "Bigrams are one of the simplest language models. We read the training text one character at a time, count which character follows which, and then convert those counts into probabilities. If the model often sees t followed by h, it learns that h is a likely next character after t. Generation works by sampling from those learned probabilities over and over again.",
  rain:
    "Rain tapped softly on the studio roof while the class whispered over their notes. Small sounds turned into patterns, and the patterns turned into rhythm. Soon the room was full of repeating shapes: rain, refrain, train, and grain.",
  robots:
    "A little classroom robot rolled to the whiteboard and wrote hello. The students laughed, and the robot wrote hello again. After a few minutes the machine had learned the rhythm of the room, and its messages sounded almost playful.",
};

const STORAGE_KEY = "bigram-studio-state-v1";
const SVG_NS = "http://www.w3.org/2000/svg";

const elements = {
  presetRow: document.getElementById("preset-row"),
  trainingInput: document.getElementById("training-input"),
  lowercaseToggle: document.getElementById("lowercase-toggle"),
  spacesToggle: document.getElementById("spaces-toggle"),
  punctuationToggle: document.getElementById("punctuation-toggle"),
  sortSelect: document.getElementById("sort-select"),
  normalizedPreview: document.getElementById("normalized-preview"),
  pairStrip: document.getElementById("pair-strip"),
  statCharacters: document.getElementById("stat-characters"),
  statSymbols: document.getElementById("stat-symbols"),
  statBigrams: document.getElementById("stat-bigrams"),
  statBranching: document.getElementById("stat-branching"),
  topBigrams: document.getElementById("top-bigrams"),
  teachingNote: document.getElementById("teaching-note"),
  selectedCharBadge: document.getElementById("selected-char-badge"),
  heatmap: document.getElementById("heatmap"),
  orbit: document.getElementById("orbit"),
  selectedSummary: document.getElementById("selected-summary"),
  transitionBars: document.getElementById("transition-bars"),
  seedInput: document.getElementById("seed-input"),
  lengthInput: document.getElementById("length-input"),
  temperatureInput: document.getElementById("temperature-input"),
  lengthValue: document.getElementById("length-value"),
  temperatureValue: document.getElementById("temperature-value"),
  generateButton: document.getElementById("generate-button"),
  copyButton: document.getElementById("copy-button"),
  generatedOutput: document.getElementById("generated-output"),
  tooltip: document.getElementById("tooltip"),
};

const state = loadState();
let currentModel = null;

initialize();

function initialize() {
  elements.trainingInput.value = state.trainingText;
  elements.lowercaseToggle.checked = state.options.lowercase;
  elements.spacesToggle.checked = state.options.keepSpaces;
  elements.punctuationToggle.checked = state.options.keepPunctuation;
  elements.sortSelect.value = state.sortMode;
  elements.seedInput.value = state.seed;
  elements.lengthInput.value = String(state.length);
  elements.temperatureInput.value = String(state.temperature);
  updateGeneratorLabels();
  highlightPresetButton(state.sampleKey);

  elements.presetRow.addEventListener("click", handlePresetClick);
  elements.trainingInput.addEventListener("input", () => {
    state.trainingText = elements.trainingInput.value;
    state.sampleKey = "custom";
    highlightPresetButton("custom");
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
    state.seed = elements.seedInput.value;
    renderGeneratedText();
    saveState(state);
  });

  elements.lengthInput.addEventListener("input", () => {
    state.length = Number(elements.lengthInput.value);
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

  rerender();
}

function rerender() {
  currentModel = buildBigramModel(state.trainingText, state.options, state.sortMode);

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

function handlePresetClick(event) {
  const button = event.target.closest("[data-sample]");

  if (!button) {
    return;
  }

  const sampleKey = button.dataset.sample;
  state.sampleKey = sampleKey;
  state.trainingText = SAMPLE_CORPORA[sampleKey];
  elements.trainingInput.value = state.trainingText;
  highlightPresetButton(sampleKey);
  rerender();
}

function highlightPresetButton(sampleKey) {
  const buttons = elements.presetRow.querySelectorAll("[data-sample]");

  buttons.forEach((button) => {
    button.classList.toggle("active", button.dataset.sample === sampleKey);
  });
}

function buildBigramModel(rawText, options, sortMode) {
  const normalizedText = normalizeText(rawText, options);
  const chars = Array.from(normalizedText);
  const charCounts = new Map();
  const transitionCounts = new Map();
  const transitionTotals = new Map();
  const bigramCounts = new Map();

  chars.forEach((char) => {
    charCounts.set(char, (charCounts.get(char) ?? 0) + 1);
  });

  for (let index = 0; index < chars.length - 1; index += 1) {
    const current = chars[index];
    const next = chars[index + 1];
    const row = transitionCounts.get(current) ?? new Map();
    row.set(next, (row.get(next) ?? 0) + 1);
    transitionCounts.set(current, row);
    transitionTotals.set(current, (transitionTotals.get(current) ?? 0) + 1);

    const bigramKey = `${current}\u0000${next}`;
    bigramCounts.set(bigramKey, (bigramCounts.get(bigramKey) ?? 0) + 1);
  }

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
    normalizedText,
    chars,
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

function normalizeText(rawText, options) {
  let text = rawText.replace(/\r\n?/g, "\n").replace(/\t/g, " ");

  if (options.lowercase) {
    text = text.toLowerCase();
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

function renderPreview(model) {
  if (!model.normalizedText) {
    elements.normalizedPreview.textContent =
      "Add some training text to see the normalized corpus.";
    elements.pairStrip.innerHTML = "";
    return;
  }

  elements.normalizedPreview.textContent = truncate(model.normalizedText, 240);
  elements.pairStrip.innerHTML = "";

  const previewPairs = [];
  const limit = Math.min(model.chars.length - 1, 18);

  for (let index = 0; index < limit; index += 1) {
    previewPairs.push([model.chars[index], model.chars[index + 1]]);
  }

  previewPairs.forEach(([current, next]) => {
    const pill = document.createElement("div");
    pill.className = "pair-pill";
    pill.innerHTML = `<span>${compactSymbol(current)}</span><strong>→</strong><span>${compactSymbol(next)}</span>`;
    elements.pairStrip.appendChild(pill);
  });
}

function renderStats(model) {
  elements.statCharacters.textContent = formatNumber(model.chars.length);
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
    elements.topBigrams.innerHTML = `<div class="chip">No transitions yet</div>`;
  }

  const note = buildTeachingNote(model);
  elements.teachingNote.textContent = note;
}

function buildTeachingNote(model) {
  if (!model.normalizedText) {
    return "A bigram model needs at least two characters of training text before it can learn any transition probabilities.";
  }

  const top = model.topBigrams[0];

  if (!top) {
    return "The corpus is too short to produce a meaningful transition table yet.";
  }

  return `In this corpus, ${prettySymbol(top.next)} is the most likely character after ${prettySymbol(top.current)}. That makes the pair ${compactSymbol(top.current)} → ${compactSymbol(top.next)} a strong local pattern for the model to imitate during generation.`;
}

function renderHeatmap(model) {
  const svg = elements.heatmap;
  svg.innerHTML = "";

  if (!model.alphabet.length) {
    renderSvgMessage(svg, "Paste some text to build the heatmap.");
    elements.selectedCharBadge.textContent = "Selected: none";
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
          `<strong>${compactSymbol(current)} → ${compactSymbol(next)}</strong><br/>Count: ${count}<br/>P(next | current): ${(probability * 100).toFixed(1)}%`,
        );
      });
      rect.addEventListener("mousemove", moveTooltip);
      rect.addEventListener("mouseleave", hideTooltip);
      grid.appendChild(rect);
    });
  });

  elements.selectedCharBadge.textContent = `Selected: ${compactSymbol(state.selectedChar)}`;
}

function renderFocus(model) {
  const svg = elements.orbit;
  svg.innerHTML = "";

  if (!state.selectedChar || !model.alphabet.length) {
    renderSvgMessage(svg, "Select a character to explore its local neighborhood.");
    elements.selectedSummary.textContent =
      "The selected symbol will show its most likely next characters here.";
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
    renderSvgMessage(svg, `No outgoing transitions from ${compactSymbol(selected)} in this corpus.`);
    elements.selectedSummary.textContent = `${prettySymbol(selected)} never appears with a following character in the normalized text, so the model has nothing to sample from at this step.`;
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
        `<strong>${compactSymbol(selected)} → ${compactSymbol(transition.next)}</strong><br/>Count: ${transition.count}<br/>Probability: ${(transition.probability * 100).toFixed(1)}%`,
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
  elements.selectedSummary.textContent = `${prettySymbol(selected)} is followed by ${prettySymbol(best.next)} most often in this corpus. The bars below show the full next-character distribution for the currently selected symbol.`;
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
    elements.generatedOutput.textContent =
      "Once the model has some training text, generated samples will appear here.";
    return;
  }

  const generated = generateText(
    currentModel,
    elements.seedInput.value,
    Number(elements.lengthInput.value),
    Number(elements.temperatureInput.value),
  );

  elements.generatedOutput.textContent = generated;
}

function generateText(model, seedText, length, temperature) {
  if (!model.alphabet.length) {
    return "";
  }

  const sanitizedSeed = normalizeText(seedText || "", {
    lowercase: state.options.lowercase,
    keepSpaces: state.options.keepSpaces,
    keepPunctuation: state.options.keepPunctuation,
  });

  const baseSeed = sanitizedSeed || sampleFromCounts(model.charCounts, 1);
  const output = Array.from(baseSeed);
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

function sampleFromCounts(countMap, temperature) {
  const entries = Array.from(countMap.entries());
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
  elements.lengthValue.textContent = elements.lengthInput.value;
  elements.temperatureValue.textContent = Number(elements.temperatureInput.value).toFixed(2);
}

async function copyGeneratedText() {
  const text = elements.generatedOutput.textContent.trim();

  if (!text) {
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    elements.copyButton.textContent = "Copied";
    window.setTimeout(() => {
      elements.copyButton.textContent = "Copy text";
    }, 1200);
  } catch (error) {
    elements.copyButton.textContent = "Copy failed";
    window.setTimeout(() => {
      elements.copyButton.textContent = "Copy text";
    }, 1200);
  }
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

function prettySymbol(symbol) {
  if (symbol === " ") {
    return "space";
  }

  return `"${symbol}"`;
}

function compactSymbol(symbol) {
  if (symbol === " ") {
    return "␠";
  }

  return symbol;
}

function compareSymbols(left, right) {
  return left.localeCompare(right, undefined, { sensitivity: "base" });
}

function truncate(text, limit) {
  return text.length > limit ? `${text.slice(0, limit - 1)}…` : text;
}

function formatNumber(value) {
  return new Intl.NumberFormat().format(value);
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

function loadState() {
  const fallback = {
    sampleKey: "lesson",
    trainingText: SAMPLE_CORPORA.lesson,
    selectedChar: " ",
    seed: "a",
    length: 140,
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
