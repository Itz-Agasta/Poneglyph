# Poneglyph

Smart resource allocation platform for NGOs powered by AI agents.

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Bun + HonoJS
- **Charts**: Recharts
- **Monorepo**: Turborepo

## Project Structure

```
poneglyph/
├── apps/
│   ├── web/          # Next.js frontend (port 3000)
│   └── api/          # Bun + HonoJS API server (port 3001)
├── packages/
│   └── data/         # CTDC dataset and query logic
├── turbo.json
└── package.json
```

## Getting Started

### Prerequisites

- Bun 1.1+
- Node.js 18+

### Installation

```bash
# Install dependencies
bun install
```

### Development

```bash
# Run all apps
bun run dev

# Run specific app
bun run dev --filter=web    # Next.js frontend
bun run dev --filter=api   # API server
```

### Build

```bash
bun run build
```

## Features

- **Research Page**: AI-powered data queries with interactive charts (CTDC human trafficking dataset)
- **Landing Page**: Search functionality with synthetic data visualizations
- **Responsive Design**: Works on mobile, tablet, and desktop

## Data Sources

- CTDC Global K-anonymized Dataset (Counter-Trafficking Data Collaborative)
- Source: https://www.ctdatacollaborative.org/page/global-k-anonymized-dataset

## License

MIT