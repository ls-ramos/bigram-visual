# Bigram Studio

Bigram Studio is a static, interactive teaching demo for explaining how a simple character-level bigram model works.

It lets you:

- paste any training corpus
- switch the interface between English and Brazilian Portuguese
- normalize the text by toggling lowercase, spaces, and punctuation
- inspect a full next-character heatmap
- probe one current character at a time
- generate new text by sampling from the learned probabilities
- switch to a name-list mode that learns from names and invents new ones

## Run locally

Because the project is plain `HTML`, `CSS`, and `JavaScript`, you can open `index.html` directly or serve the folder with a tiny web server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy to GitHub Pages

This repository is designed to work directly from the root of a GitHub Pages site, with no build step required.
