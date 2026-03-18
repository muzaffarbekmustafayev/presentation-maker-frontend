# Presentation Maker — Frontend

React + Vite frontend for the Presentation Maker app.

## Tech Stack

- **Framework:** React 19
- **Build tool:** Vite 8
- **Routing:** React Router DOM 7
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **HTTP:** Axios
- **Export:** PptxGenJS

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure API URL

The API base URL is set in `src/api/axios.js`. By default it points to `http://localhost:5000`.

### 3. Run the dev server

```bash
npm run dev
```

App runs on `http://localhost:5173` by default.

### Build for production

```bash
npm run build
```

## Project Structure

```
frontend/
├── index.html
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── api/
│   │   └── axios.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   └── pages/
│       ├── Landing.jsx
│       ├── Login.jsx
│       ├── Register.jsx
│       ├── Dashboard.jsx
│       ├── CreatePresentation.jsx
│       └── Editor.jsx
└── public/
```
