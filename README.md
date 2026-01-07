# 🎯 Focus135

**A minimalist productivity app that helps you focus on what matters most.**

The 1-3-5 rule is simple: each day, commit to completing **1 major task**, **3 medium tasks**, and **5 small tasks**. No more, no less. This structure prevents overwhelm while ensuring meaningful progress.

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react" alt="React 18" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Storage-Local-green?style=flat-square" alt="Local Storage" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="MIT License" />
</p>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔥 **Streak Tracking** | Build momentum with consecutive day tracking |
| 🔄 **Smart Rollover** | Incomplete tasks automatically carry to the next day |
| ⏰ **Age Badges** | Visual indicators show how long tasks have been pending |
| 🎉 **Overflow Mode** | Unlocks bonus tasks when you complete all 9 |
| 👁️ **Focus Mode** | Hide everything except your major priority |
| 📊 **Statistics** | Track daily, weekly, and all-time completions |
| 📅 **Archive** | Review your past 30 days of productivity |
| 💾 **100% Local** | All data stays on your device—no accounts, no cloud |

---

## 🚀 Try It Now

**[➡️ Launch Focus135](https://yourusername.github.io/135Tasks/)**

*Works on desktop and mobile. No installation required.*

---

## 📸 Preview

```
┌─────────────────────────────────────────────────┐
│  Focus135                           🔥 7 streak │
│  1 Major · 3 Medium · 5 Small                   │
├─────────────────────────────────────────────────┤
│  📊 Today: 44%  │  This Week: 23  │  All: 156   │
├─────────────────────────────────────────────────┤
│                                                 │
│  🟠 MAJOR PRIORITY                              │
│  ┌─────────────────────────────────────────┐   │
│  │ Ship the new landing page               │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  🔵 MEDIUM TASKS (3)                            │
│  ☑ Review pull requests                        │
│  ☐ Update documentation                        │
│  ☐ Team standup notes                          │
│                                                 │
│  ⚪ SMALL TASKS (5)                             │
│  ☑ Reply to emails                             │
│  ☑ Schedule dentist                            │
│  ☐ Order supplies                              │
│  ☐ Update calendar                             │
│  ☐ Quick code review                           │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🛠️ Local Development

```bash
# Clone the repo
git clone https://github.com/yourusername/135Tasks.git
cd 135Tasks

# Install dependencies
npm install

# Start dev server
npm run dev

# Open http://localhost:5173/135Tasks/
```

---

## 📦 Deploy Your Own

### GitHub Pages (Recommended)

1. Fork this repository
2. Update `vite.config.js` with your repo name:
   ```js
   base: '/your-repo-name/',
   ```
3. Run:
   ```bash
   npm run deploy
   ```
4. Enable GitHub Pages in Settings → Pages → Branch: `gh-pages`

### Other Platforms

```bash
npm run build
# Upload the 'dist' folder to Netlify, Vercel, or any static host
```

---

## 🧠 The 1-3-5 Philosophy

The 1-3-5 rule was popularized by [The Muse](https://www.themuse.com/advice/a-better-todo-list-the-135-rule) as a way to combat the overwhelm of endless to-do lists.

**Why it works:**
- **Constraints breed focus** — You can't add 20 things. Pick what matters.
- **Visible progress** — Completing 9 tasks feels achievable and rewarding.
- **Built-in prioritization** — Forces you to rank importance before you start.
- **Sustainable pace** — Prevents burnout from overcommitting.

---

## 🗂️ Project Structure

```
135Tasks/
├── src/
│   ├── App.jsx        # Main application component
│   ├── main.jsx       # React entry point
│   └── index.css      # Tailwind CSS imports
├── index.html         # HTML template
├── vite.config.js     # Vite + GitHub Pages config
├── tailwind.config.js # Tailwind configuration
└── package.json       # Dependencies & scripts
```

---

## 🔒 Privacy

Focus135 stores everything in your browser's `localStorage`. Your tasks, streaks, and history **never leave your device**. There are no analytics, no tracking, and no accounts.

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

<p align="center">
  Built with ❤️ for focused productivity
</p>
