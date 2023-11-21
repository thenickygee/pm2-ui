# PM2 UI 🌐

Modern responsive user dashboard for managing PM2 processes with Node. 
Built with:
* Next.js
* TailwindCSS
* HeadlessUI
  
![dashboard](https://github.com/thenickygee/pm2-ui/assets/75292383/dff40b00-4280-43c8-98e5-68bf6c88bd4c)


## 📚 Table of Contents 

- [Getting Started](#getting-started)
- [Features](#features)
- [Login Credentials](#login-credentials)
- [Learn More](#learn-more)
- [Deploy on Vercel](#deploy-on-vercel)

## 🚀 Getting Started

To start an application with PM2, run:

```bash
pm2 start 'npm run dev' -i <instances> --name <name>
```

## 🖥️ Development Server

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

Open [http://localhost:3000](http://localhost:3000) (or the port your app starts on) to view it in your browser.

## ✨ Features 

## 📊 Process Data

- CPU Usage (%)
- Memory Usage (MB)
- Uptime (d, h, m, s)
- Process ID (PID)
![closeup-process](https://github.com/thenickygee/pm2-ui/assets/75292383/5745585c-f1d8-489a-aa3f-e8013dfee682)


## ⚙️ Process Actions

- Start
- Stop
- Restart
- Reload
  
![actions](https://github.com/thenickygee/pm2-ui/assets/75292383/a04f4482-a010-4d3c-afd4-70bce0256d6a)

## 📜 Process Logs

- Standard input & output
![logs](https://github.com/thenickygee/pm2-ui/assets/75292383/91821ca1-5e96-462e-91ad-f6e28a689201)


## 🔍 Process Filters

- By name
- By status: online, error, stopped
  
![filter](https://github.com/thenickygee/pm2-ui/assets/75292383/981b9a3e-d5a7-403c-9972-5a33c9b1c407)


> **Note:** The `.env.local` file is included in version control for auth purposes.


## 🔐 Login Credentials

- Username: `admin`
- Password: `admin`


## 📖 Learn More
- [PM2 Docs]([ttps://pm2.keymetrics.io](https://pm2.keymetrics.io/docs/usage/quick-start/) - PM2 Docs.
- [Next.js Documentation](https://nextjs.org/docs) - Features and API.
- [Learn Next.js](https://nextjs.org/learn) - Interactive tutorial.
- [Next.js GitHub Repository](https://github.com/vercel/next.js/) - Feedback and contributions.
  This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) for font optimization.

## Deploy on Vercel 🚢

Deploy your Next.js app easily using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

## Contributing 🤝
Contributions, issues, and feature requests are welcome! Feel free to check [issues page](#).
