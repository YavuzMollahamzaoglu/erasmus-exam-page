# Deployment guide — professional HTTPS site

This document walks through deploying the project as a professional HTTPS site (example: https://ingilizcehazirli.com). It uses GitHub for source, Vercel for frontend, Render (or Supabase/Neon) for backend + Postgres, and Cloudflare for DNS + SSL. You can adapt providers (Netlify, Railway, DigitalOcean App Platform, AWS, etc.).

1) Create a GitHub repository
- Create a new public or private repository under your GitHub account.
- From your local repo root run:
  git init
  git add .
  git commit -m "Initial commit"
  git branch -M main
  git remote add origin git@github.com:<your-username>/<repo>.git
  git push -u origin main

2) Frontend — Vercel (recommended)
- Go to vercel.com, sign up with GitHub and import the repo.
- Project settings:
  - Root directory: `frontend`
  - Build command: `npm run build`
  - Output directory: `build`
  - Environment variables (Production): set `REACT_APP_API_URL` to your backend URL.
- After deploy, add your custom domain (ingilizcehazirli.com) in Vercel and follow DNS instructions.

3) Backend — Render (or alternative)
- Render (simple): create a Web Service, connect GitHub repo, set root to `backend`.
- Build & Start commands:
  - Build: `npm install --production` (or leave blank if Render runs `npm start`)
  - Start: `npm start` (already set to `ts-node src/app.ts` in package.json — for production prefer building JS: `tsc` and run `node dist/app.js`)
- Environment variables: set `DATABASE_URL`, `JWT_SECRET`, `ADMIN_CREATE_TOKEN`, `DISABLE_AUTO_SERIES_CREATE=1` (recommended) and any SMTP/S3 keys.

4) Managed Postgres (Supabase / Neon / Render Postgres)
- Create a managed Postgres (Supabase or Render Postgres). Copy the `DATABASE_URL`.
- Run migrations: on the server or via GitHub Action run `npx prisma migrate deploy` with `DATABASE_URL` env var set.
- Seed data if needed: `node prisma/seed.js` or `ts-node prisma/seed.ts`.

5) Domain + Cloudflare
- Buy `ingilizcehazirli.com` from Namecheap / Google Domains / GoDaddy.
- Add domain to Cloudflare, change registrar nameservers to Cloudflare's.
- In Cloudflare, add DNS records pointing to Vercel / Render per provider docs (CNAME or A records). Use Cloudflare proxying if you want CDN/WAF.
- Enable HTTPS (Vercel/Render provide certificates automatically). With Cloudflare proxy use Full (strict) mode.

6) CI / Migrations (recommended)
- Add a GitHub Action to run `prisma migrate deploy` on backend deployment or as a one-off admin workflow.

7) Final checks
- Verify the site is served over https://ingilizcehazirli.com
- Verify backend endpoints respond and DB queries work
- Run Lighthouse and fix major issues (perf, accessibility, SEO)

If you want, I can:
- Prepare a ready-to-run GitHub Actions workflow for migrations and deploy
- Prepare Render/Vercel settings and env-var templates
- Help buy domain and configure Cloudflare
