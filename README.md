# Chapaa Hub

A full-stack personal finance tracker built with Node.js, Express 5, MySQL and a vanilla HTML/CSS/JS frontend.

## Run locally

1. Create the database:

```bash
mysql -u root -p < sql/schema.sql
```

2. Copy `.env.example` to `.env` and set the MySQL credentials and a strong JWT secret.

3. Install dependencies:

```bash
npm install
```

4. Start:

```bash
npm run dev
```

5. Open `http://localhost:3000/register` or `http://localhost:3000/login`.

6. Verify the backend at `http://localhost:3000/api/health`.

## Troubleshooting

Every request gets an `X-Request-ID`. API errors return the same ID as `requestId`, so copy that reference from the browser and find it in the Node console.

If you see a schema error, run `sql/schema.sql` against the configured database. Never put database credentials in frontend files.
