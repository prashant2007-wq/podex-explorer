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
GET https://pokeapi.co/api/v2/type                    → Fetch all Pokémon types
GET https://pokeapi.co/api/v2/pokemon-species/{id}    → Fetch species/flavor text
```

---

## ✨ Features

### 🔍 Search
- Real-time search by Pokémon name
- Debounced input to avoid excessive API calls (300ms delay)
- Implemented using `.filter()` HOF on the fetched data array

### 🎨 Filter
- Filter Pokémon by type (Fire, Water, Grass, Electric, Psychic, etc.)
- Multi-type support (each Pokémon can have up to 2 types)
- Implemented using `.filter()` HOF

### 📊 Sort
- Sort by: Pokémon ID (default), Name (A–Z / Z–A), Base HP, Base Attack
- Toggle ascending / descending order
- Implemented using `.sort()` HOF

### ❤️ Favorites
- Like / unlike any Pokémon with a heart button
- Favorites persist across sessions using `localStorage`
- View a dedicated "Favorites" tab

### 🌙 Dark / Light Mode
- Toggle between dark and light themes
- Preference saved in `localStorage`

### 📋 Pokémon Detail Modal
- Click any card to open a detailed modal
- Shows: sprite, types, base stats (HP, Attack, Defense, Speed), abilities, and Pokédex description

### 📄 Pagination
- 20 Pokémon per page
- Previous / Next navigation buttons

### ⏳ Loading State
- Animated spinner shown while data is being fetched
- Skeleton card placeholders during initial load

### 📱 Responsive Design
- Fully responsive across mobile, tablet, and desktop
- CSS Grid with auto-fill columns adapts to screen size

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
├── index.html          # Home — main Pokédex grid (search, filter, sort)
├── compare.html        # Compare 2 Pokémon side by side
├── quiz.html           # Guess the Pokémon game
├── types.html          # Browse Pokémon by type
├── favorites.html      # Saved/liked Pokémon
├── about.html          # About the project
│
├── style.css           # Global styles + dark mode
├── compare.css         # Styles specific to compare page
├── quiz.css            # Styles specific to quiz page
│
├── app.js              # Home page logic (API, render, pagination)
├── compare.js          # Compare page logic
├── quiz.js             # Quiz game logic
├── types.js            # Types page logic
├── favorites.js        # Favorites logic (localStorage)
├── filter.js           # Search, filter, sort HOFs (shared)
├── api.js              # All fetch/API calls in one place (shared)
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
| **Milestone 2** | API integration, display data, responsive UI | 1st April | 🔄 In Progress |
| **Milestone 3** | Search, filter, sort, dark mode, favorites | 8th April | ⏳ Upcoming |
| **Milestone 4** | Deployment, final documentation, cleanup | 10th April | ⏳ Upcoming |

---

## ⭐ Bonus Features

| Feature | Description | Status |
|---------|-------------|--------|
| **Debouncing** | Search input debounced at 300ms | 🔄 Planned |
| **Pagination** | 20 Pokémon per page with navigation | 🔄 Planned |
| **Loading Indicators** | Spinner + skeleton cards during fetch | 🔄 Planned |
| **Local Storage** | Favorites and theme saved persistently | 🔄 Planned |

---

## 📸 Screenshots

> Screenshots will be added after UI implementation in Milestone 2.

---

## 👤 Author

**Your Name**
- GitHub: [@your_username](https://github.com/prashant2007-wq)

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

> 🎓 Built as part of a JavaScript & API Integration course project.
