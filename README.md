# PM2 UI 🌐

Modern user interface for managing PM2 processes with Node.js, Next.js, TailwindCSS, and HeadlessUI.

## Table of Contents 📚

- [Getting Started](#getting-started)
- [Features](#features)
- [Login Credentials](#login-credentials)
- [Learn More](#learn-more)
- [Deploy on Vercel](#deploy-on-vercel)

## Getting Started 🚀

To start an application with PM2, run:

```bash
pm2 start 'npm run dev' -i <instances> --name <name>
```

### Prerequisites 📋

- Node.js
- Next.js
- TailwindCSS
- HeadlessUI

### Development Server 🖥️

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page auto-updates as you edit `app/page.js`.

## Features ✨

### Process Data 📊

- CPU Usage (%)
- Memory Usage (MB)
- Uptime (d, h, m, s)
- Process ID (PID)

### Process Actions ⚙️

- Start
- Stop
- Restart
- Reload

### Process Logs 📜

- Standard input & output

### Process Filters 🔍

- By name
- By status: online, error, stopped

> **Note:** The `.env.local` file is included in version control for auth purposes.

## Login Credentials 🔐

- Username: `admin`
- Password: `admin`

## Learn More 📖

- [Next.js Documentation](https://nextjs.org/docs) - Features and API.
- [Learn Next.js](https://nextjs.org/learn) - Interactive tutorial.
- [Next.js GitHub Repository](https://github.com/vercel/next.js/) - Feedback and contributions.
  This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) for font optimization.

## Deploy on Vercel 🚢

Deploy your Next.js app easily using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

## Contributing 🤝

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](#).
