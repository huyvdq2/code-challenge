# Currency Swap Application

A modern React-based currency swap application built with TypeScript, Vite, and Tailwind CSS. The application provides real-time currency conversion with a clean, responsive interface and comprehensive test coverage.

## Features

- **Real-time Currency Conversion**: Convert between multiple cryptocurrencies with live price data.
- **Interactive UI**: Clean, modern interface with smooth animations and transitions.
- **Swap History**: Track all your currency swaps with persistent storage.
- **Responsive Design**: Optimized for desktop and mobile devices.
- **Type Safety**: Built with TypeScript for robust error checking.
- **Comprehensive Testing**: High test coverage with Jest and React Testing Library.

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **State Management**: Zustand
- **Testing**: Jest, React Testing Library

## Quick Start

### Local Development (recommended for fast iteration)

1. Install dependencies:

   ```bash
   cd src/problem2
   npm install
   ```

2. Start a local Vite dev server:

   ```bash
   npm run dev
   ```

3. Open your browser at `http://localhost:5173`

Notes:

- Use this when you're actively developing UI and want instant HMR and the fastest feedback loop.
- Requires Node.js (18+) installed locally.

### Docker Development (recommended for reproducing production-like environment)

1. Build and start the development container:

   ```bash
   npm run docker:dev
   ```

2. Stop the development containers:

   ```bash
   npm run docker:dev:down
   ```

Notes:

- Runs the app inside Docker with the source mounted for live reload (see `docker/docker-compose.dev.yml`).
- Use this if you want an environment matching CI or collaborators who use Docker.

### Run Tests

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage
```

## Production

### Build and Run Locally (preview)

1. Build the production assets:

   ```bash
   npm run build
   ```

2. Preview the production build locally:

   ```bash
   npm run preview
   ```

   This serves the static `dist/` output on a local server for testing.

### Production with Docker

1. Build and start the production container:

   ```bash
   npm run docker:prod
   ```

2. Stop the production containers:

   ```bash
   npm run docker:prod:down
   ```

Notes:

- The production Docker uses a multi-stage build (builder + nginx) to produce a small image that serves static files from `dist/` on port 80 inside the container. The `docker/docker-compose.yml` file defines how the service is built and exposed.
- Set production environment variables in your CI/CD or Docker orchestration (avoid committing secrets). Example variables live in `.env` or your deployment platform's secret manager.
- Verify the app after deployment by visiting the host/port exposed by your deployment (commonly `http://<host>:80`).

## Project Structure

```
src/
├── components/           # React components
├── store/               # Zustand state stores
├── lib/                 # Utility functions
├── __tests__/           # Test files
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── setupTests.ts        # Test configuration
```

## Troubleshooting

### Common Issues

**Docker container not starting:**

```bash
# Check if ports are available
lsof -i :5173
lsof -i :3000

# Restart Docker service
sudo systemctl restart docker
```

**Tests failing:**

```bash
# Clear Jest cache
npx jest --clearCache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Getting Help

- Check the Issues page in your repository.
- Review the test files for usage examples.
