# VibeJam

A modern, interactive web application for music collaboration and sharing vibes. Built with React Router and modern web technologies.

## Features

- 🎵 Real-time music collaboration
- 🚀 Server-side rendering for optimal performance
- ⚡️ Hot Module Replacement (HMR) for efficient development
- 🎨 Modern UI with TailwindCSS
- 📱 Responsive design for all devices
- 🔒 TypeScript for type safety
- 🔄 Data loading and mutations with React Router

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
# or
bun install
```

### Development

Start the development server with HMR:

```bash
npm run dev
# or
bun run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
# or
bun run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t vibejam .

# Run the container
docker run -p 3000:3000 vibejam
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Tech Stack

- React 19
- React Router 7
- TailwindCSS 4
- TypeScript
- Vite

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by the VibeJam team.
