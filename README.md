# mille mots

A free, gamified app to learn French from **A1 to A2**: 1,500 essential words and 32 grammar lessons. No account, no ads, no tracking.

**[▶ Try it live](https://USERNAME.github.io/mille-mots/)**

## Features

- **1,500 words** in 15 themed units, from greetings to work, travel and the environment
- **32 grammar lessons**, from articles and *être/avoir* to the passé composé, imparfait, future and conditional
- **7 exercise types**: flashcards with audio, multiple choice, listening, typing, matching, sentence building, fill in the gap
- **Gamified**: XP, hearts, streaks, daily goal, stars and achievements
- **Spaced repetition** that brings back the words you're about to forget
- **Backup and restore** your progress as a file
- Works on phone and desktop, in light and dark mode

## How it works

Everything runs in the browser: two static HTML files, no framework, no backend. Progress is saved in `localStorage` on your device. Use **Profile → Backup** to keep a copy or move it to another device.

## Run it

Open `index.html` in a browser, or host the repo on GitHub Pages: **Settings → Pages → Deploy from a branch → `main` / root**.

## Adding content

Words and grammar are embedded in `app.html`:

- **`VOCAB`**: one `français;English` pair per line
- **`GR`**: the grammar lessons
- **`UNIT_G`**: which unit each lesson appears in

Add new units, lessons and grammar **after** the existing ones, so saved progress stays in place.

## License

[MIT](LICENSE)
