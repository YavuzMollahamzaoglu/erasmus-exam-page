# Backend deploy guide — Render (Node.js)

This document lists a simple, repeatable way to deploy the `backend/` service to Render (or a similar platform like Railway/DigitalOcean App).

Prerequisites

- A managed MySQL instance (DigitalOcean Managed MySQL, Amazon RDS, Railway DB, etc.) and a connection string (DATABASE_URL).
- Render (or other host) account connected to your GitHub repo.

Recommended Build & Start commands

- Build command (Render build step):

  npm ci && npm run build

- Start command (Render start command):

  node dist/app.js

Environment variables (minimum)

- DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DBNAME"
- JWT_SECRET="long-random-secret"
- ADMIN_CREATE_TOKEN="long-random-token"
- DISABLE_AUTO_SERIES_CREATE="1"
- NODE_ENV=production

Prisma migrations (production)

- Render offers the option to run a one-off command in the dashboard. To apply migrations on the production DB run:

  npx prisma migrate deploy

- If you prefer CI-driven migrations, add a GitHub Action to run `npx prisma migrate deploy` after you deploy new migrations (make sure the action has `DATABASE_URL` secret).

Render web service creation steps (summary)

1. Create a new Web Service in Render and connect the repository `YavuzMollahamzaoglu/erasmus-exam-page`.
2. Set the Root Directory to `backend`.
3. Set the Build Command to: `npm ci && npm run build`
4. Set the Start Command to: `node dist/app.js`
5. Add the environment variables listed above in the Render dashboard Secrets/Env section.
6. Deploy.

Notes & troubleshooting

- Make sure the MySQL user in `DATABASE_URL` has privileges to run migrations (ALTER/CREATE/DROP on the schema).
- If your migrations are heavy or you prefer safer deployments, run `npx prisma migrate deploy` manually from CI or a one-off Render shell before switching traffic to the new release.
- For zero-downtime DB migrations consider a staging environment first.

Optional: Dockerfile
If you prefer a Docker-based deployment, create a `Dockerfile` in `backend/` and point Render to build using Docker. A minimal example:

FROM node:18-alpine
WORKDIR /app
COPY package\*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node","dist/app.js"]

This completes the quick Render deployment guide.
