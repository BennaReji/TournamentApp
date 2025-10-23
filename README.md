# 🏆 Tournament Score Sheet

![Tests](https://github.com/BennaReji/TournamentApp/workflows/CI/CD%20Pipeline/badge.svg)
![Coverage](https://img.shields.io/codecov/c/github/BennaReji/TournamentApp)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

A web application for managing sport tournaments with round-robin scoring and playoff brackets.

## 🚀 Live Demo

**Live App:** [https://bennareji.github.io/TournamentApp/](https://bennareji.github.io/TournamentApp/)

## ✨ Features

- ✅ Customizable team names (4, 5, or 6 teams)
- ✅ Round-robin match generation
- ✅ Automatic winner highlighting
- ✅ Live standings table with point differentials
- ✅ Playoff bracket seeding (1 vs 4, 2 vs 3)
- ✅ Championship tracking
- ✅ Responsive design

## 🛠️ Tech Stack

- **Frontend:** React 19 + Vite
- **Testing:** Vitest + React Testing Library
- **CI/CD:** GitHub Actions
- **Deployment:** GitHub Pages

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/BennaReji/TournamentApp.git
cd TournamentApp

# Install dependencies
npm install

# Run development server
npm run dev
```

## 🧪 Testing

# Run all tests

npm test

# Run only tournamentUtils tests

npm test tournamentUtils

# Run tests in watch mode (auto re-run)

npm test -- --watch

# Run with coverage report

npm run test:coverage

# Run coverage for specific file

npm run test:coverage -- tournamentUtils

# Run with UI (visual test runner)

npm run test:ui

# Run with UI + coverage

npm run test:ui -- --coverage

### Test Coverage

- **Unit Tests:** 52 tests for business logic (100% coverage)
- **Integration Tests:** 18 tests for React components
- **Total:** 70 tests

## 🏗️ Build

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 📊 CI/CD Pipeline

This project uses GitHub Actions for:

- ✅ Automated testing on every push
- ✅ Code coverage reports
- ✅ Automatic deployment to GitHub Pages
- ✅ Build artifact generation

## 🔗 Related Repositories

- **Selenium E2E Tests:** [TournamentAppTest](https://github.com/BennaReji/TournamentAppTest)

## 📝 License

MIT License - feel free to use this project for learning!

## 👤 Author

**Benna Reji**

- GitHub: [@BennaReji](https://github.com/BennaReji)
