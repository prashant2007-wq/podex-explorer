# 🔴 Pokédex Explorer

> A modern, responsive Pokédex web application built with vanilla JavaScript, powered by the PokéAPI. Browse, search, filter, and sort Pokémon — all in one place.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![PokéAPI](https://img.shields.io/badge/PokéAPI-EF5350?style=for-the-badge&logo=pokemon&logoColor=white)

---

## 📌 Table of Contents

- [About the Project](#about-the-project)
- [Live Demo](#live-demo)
- [API Used](#api-used)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Milestones](#milestones)
- [Bonus Features](#bonus-features)
- [Screenshots](#screenshots)
- [Author](#author)

---

## 📖 About the Project

**Pokédex Explorer** is a fully client-side web application that fetches and displays data from the official [PokéAPI](https://pokeapi.co/). Users can browse all Pokémon, search by name, filter by type, sort by various attributes, and save their favorite Pokémon — all without any page reloads.

This project was built as part of a JavaScript + API Integration course, demonstrating real-world skills including `fetch`, array Higher-Order Functions (HOFs), responsive design, and local storage.

---

## 🌐 Live Demo

> 🔗 Coming soon after deployment (Milestone 4)

---

## 🔌 API Used

| Detail | Info |
|--------|------|
| **Name** | PokéAPI |
| **Base URL** | `https://pokeapi.co/api/v2/` |
| **Auth Required** | ❌ No |
| **Docs** | [https://pokeapi.co/docs/v2](https://pokeapi.co/docs/v2) |

### Key Endpoints Used

```
GET https://pokeapi.co/api/v2/pokemon?limit=151       → Fetch first 151 Pokémon
GET https://pokeapi.co/api/v2/pokemon/{id}            → Fetch individual Pokémon details
GET https://pokeapi.co/api/v2/pokemon-species/{id}    → Fetch species/flavor text
```

---

## ✨ Features

### 🔍 Search
- Search Pokémon in the Explore tab by `name` or `ID`

### 🎨 Filter
- Filter Pokémon by type using the "Filter Type" dropdown
- Dropdown is hidden by default and appears on hover

### 📊 Sort
- Sort by: Pokémon ID and Name (A–Z / Z–A)

### ❤️ Favorites
- Like/unlike Pokémon
- Favorites persist across sessions using `localStorage`
- Dedicated Favorites tab

### 🌙 Dark / Light Mode
- Toggle between dark and light themes
- Theme preference saved in `localStorage`

### 📋 Pokémon Detail Modal
- Hover a card to open the details panel
- Shows: sprite, types, base stats (HP, Attack, Defense, Speed), abilities, and a Pokédex description
- Includes robust fallback messaging if a species description is unavailable

### ⏳ Loading State
- Basic loading indicator while Pokémon data is being fetched

### 📱 Responsive Design
- Fully responsive across mobile, tablet, and desktop
- Responsive grid/card layout

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Page structure and semantic markup |
| **CSS3** | Styling, animations, and responsive layout |
| **JavaScript (ES6+)** | Logic, API calls, DOM manipulation |
| **PokéAPI** | Source of all Pokémon data |
| **LocalStorage** | Persisting favorites and theme preference |
| **CSS Grid & Flexbox** | Responsive layout system |

> 💡 No frameworks or libraries used — pure vanilla JavaScript.

---

## 📁 Project Structure

```
pokedex-explorer/
│
├── index.html
├── style.css                       # Legacy root stylesheet (kept for compatibility)
├── app.js                          # Legacy app file (kept for compatibility)
├── api.js                          # Legacy API file (kept for compatibility)
│
├── assets/
│   ├── css/
│   │   └── main.css                # Active stylesheet entrypoint
│   └── js/
│       ├── api.js                  # API layer
│       ├── app-core.js             # State, helpers, filters, sorting, theme
│       └── app-ui.js               # Rendering, modal, controls, app bootstrap
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari)
- No installations required

### Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/pokedex-explorer.git
   ```

2. **Navigate into the project folder**
   ```bash
   cd pokedex-explorer
   ```

3. **Open the app**
   ```bash
   # Simply open index.html in your browser
   open index.html
   ```
   Or double-click `index.html` from your file explorer.

> ✅ No build tools, no npm install, no server required. Just open and run.

---

## 📅 Milestones

| Milestone | Description | Deadline | Status |
|-----------|-------------|----------|--------|
| **Milestone 1** | Project setup, repo creation, README | 23rd March | ✅ Done |
| **Milestone 2** | API integration, display data, responsive UI | 1st April | ✅ Done |
| **Milestone 3** | Search, filter, sort, dark mode, favorites | 8th April | ✅ Done |
| **Milestone 4** | Deployment, final documentation, cleanup | 10th April | ⏳ Upcoming |

---

## ⭐ Bonus Features

| Feature | Description | Status |
|---------|-------------|--------|
| **Debouncing** | Search input debounced at 300ms | 🔄 Planned |
| **Pagination** | 20 Pokémon per page with navigation | 🔄 Planned |
| **Loading Indicators** | Basic loading indicator during fetch | ✅ Done |
| **Local Storage** | Favorites and theme saved persistently | ✅ Done |

---

## 📸 Screenshots

- Home page with hero, type browsing, trending cards, and stats strip
- Explore workflow with search, sort, and hover filter dropdown
- Details modal with stats, abilities, and Pokédex description

---

## 👤 Author

**Your Name**
- GitHub: [PRASHNAT S BISHT](https://github.com/prashant2007-wq)

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

> 🎓 Built as part of a JavaScript & API Integration course project.
