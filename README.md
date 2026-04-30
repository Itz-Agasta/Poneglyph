![thumbnail](./docs/imgs/thumbnail.png)

<p align="center">
  <img src="https://img.shields.io/badge/Google%20Solution%20Challenge-2026-blue?style=for-the-badge" alt="Google Solution Challenge 2026" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License" />
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Hono-E36002?style=for-the-badge" alt="Hono" />
  <img src="https://img.shields.io/badge/Bun-FBF0DF?style=for-the-badge&logo=bun&logoColor=black" alt="Bun" />
  <img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white" alt="Rust" />
  <img src="https://img.shields.io/badge/Google%20Gemini-886FBF?style=for-the-badge" alt="Google Gemini" />
  <img src="https://img.shields.io/badge/Vercel%20AI%20SDK-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel AI SDK" />
  <img src="https://img.shields.io/badge/Better%20Auth-000000?style=for-the-badge" alt="Better Auth" />
  <img src="https://img.shields.io/badge/Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white" alt="Turborepo" />
  <img src="https://img.shields.io/badge/Google%20Cloud-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white" alt="Google Cloud" />
  <img src="https://img.shields.io/badge/Google%20Pub%2FSub-4285F4?style=for-the-badge" alt="Google Pub/Sub" />
  <img src="https://img.shields.io/badge/Terraform-844FBA?style=for-the-badge&logo=terraform&logoColor=white" alt="Terraform" />
</p>

<h1 align="center">Poneglyph</h1>

<p align="center">
  <strong>A unified platform for open data discovery, AI-powered research, and volunteer-driven data collection.</strong>
  <br />
  <em>Think of it as GitHub for survey data  where organizations publish, volunteers contribute, and AI agents analyze.</em>
</p>

<p align="center">
  <a href="https://youtu.be/9IbQkpQFVAs">View Demo</a>
  ·
  <a href="https://github.com/Itz-Agasta/poneglyph/issues">Report Bug</a>
  ·
  <a href="https://github.com/Itz-Agasta/poneglyph/issues">Request Feature</a>
  ·
  <a href="https://github.com/Itz-Agasta/poneglyph/pulls">Send a Pull Request</a>
</p>

---

## Overview

Today, survey and research data is scattered across dozens of platforms, difficult to navigate, and nearly impossible to turn into actionable insight. Poneglyph solves this by bringing **50+ open data sources** into a single, searchable platform and layering AI research agents on top so users can ask questions, analyze datasets, and extract meaningful insights without manual effort.

### Key Capabilities

- **Unified Data Library** — Search, explore, and understand datasets from 50+ external sources in one place, with semantic vector search powered by pgvector HNSW indexes.
- **AI Research Agents** — Chat with your data. Ask natural-language questions and get synthesized answers backed by multi-source analysis using Google Gemini, Groq, and Tavily.
- **Volunteer Collaboration** — Organizations can post fieldwork opportunities, accept volunteer applications, and manage data collection campaigns, all on-platform.
- **Dual Collection Modes** — Hire real volunteers for on-the-ground work, or run fully automated survey campaigns using AI agent swarms.
- **Incentive System** — A digital currency framework rewards contributors for their work, redeemable for platform benefits.
- **SEO-Optimized Discoverability** — Datasets are structured for organic search, driving a freemium + lead generation model (free exploration, login-gated downloads).

---

## How Organizations use Poneglyph

![How orgs use poneglyph](./docs/imgs/orgs.png)

## How Volunteers use Poneglyph

![How volunteers use poneglyph](./docs/imgs/volunteer2.png)

---

## Watch our Demo

[![Watch the demo](./docs/imgs/demo.png)](https://drive.google.com/file/d/1YKA0lxptWLse_9OqTN5ll4SFlsFxU33z/view?usp=sharing)

## Architecture

Poneglyph is a **Turborepo monorepo** with a polyglot architecture. TypeScript for the web and API layer, Rust for high-performance data workers.

![Architecture](./docs/imgs/arch.png)

### Tech Stack

| Layer             | Technology                                                             |
| ----------------- | ---------------------------------------------------------------------- |
| **Frontend**      | Next.js 16, React 19, TailwindCSS v4, shadcn/ui, D3.js, Recharts, GSAP |
| **API**           | Hono, Bun runtime, Vercel AI SDK (v6)                                  |
| **AI/ML**         | Google Gemini, Groq, Tavily, pgvector (768-dim HNSW)                   |
| **Auth**          | Better Auth, Resend (email)                                            |
| **Database**      | PostgreSQL, Drizzle ORM                                                |
| **Workers**       | Rust (Tokio, SQLx, Lapin)                                              |
| **Message Queue** | Google Pub/Sub                                                         |
| **Storage**       | Cloudflare R2                                                          |
| **Infra**         | Terraform, Google Cloud Run                                            |
| **Tooling**       | Turborepo, TypeScript, Zod, oxfmt, oxlint                              |

---

## Contact

This project is licensed under the [MIT License](LICENSE). For questions or feedback, reach out at [rupam.golui@proton.me](mailto:rupam.golui@proton.me).
