# LLaVA-MedRAG Web Interface

A simple medical image analysis chatbot interface for the LLaVA-Med custom RAG implimentation for medical imaging. 

## Features


## Live Demo

[https://llava-medrag.github.io/](https://llava-medrag.github.io/)

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- FastAPI backend (optional, for full functionality)

### Installation

```bash
# Clone the repository
git clone https://github.com/LLaVA-MedRAG/LLaVA-MedRAG.github.io.git
cd LLaVA-MedRAG.github.io

# Install dependencies
npm install
```

### Development Server

```bash
npm run dev
```
Access at `http://localhost:5173`

## Deployment Options

### Option 1: GitHub Pages (Free Hosting)

```bash
npm run deploy
```

### Option 2: Custom Server with HTTP

1. **Update configuration** in `vite.config.ts`:
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/',  // Remove GitHub Pages base path
  server: {
    host: '0.0.0.0',
    port: 5173
  }
})
```

2. **Build and serve**:
```bash
npm run build
npm install -g serve
serve -s dist -p 5173
```

3. **Or with PM2** (recommended for production):
```bash
npm install -g pm2
npm run build
pm2 serve dist 5173 --name llava-medrag
pm2 save
```

### Option 3: Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
RUN npm install -g serve
EXPOSE 5173
CMD ["serve", "-s", "dist", "-p", "5173"]
```

Deploy:
```bash
docker build -t llava-medrag .
docker run -d -p 5173:5173 llava-medrag
```

## Backend Configuration

Update API endpoints in `src/App.tsx`:

```typescript
// Line ~70 and ~123
const response = await fetch('http://YOUR_SERVER:8000/status');
const response = await fetch('http://YOUR_SERVER:8000/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(requestBody)
});
```

### Expected Backend Endpoints

**GET** `/status` - Health check
```json
{ "status": "online" }
```

**POST** `/chat` - Process chat message
```json
{
  "mode": "Auto | BrainMRI | ChestX-ray | Histopathology",
  "message": { "text": "...", "image": "base64 or null", "timestamp": "..." },
  "history": { "messages": [...], "images": [...] },
  "chat_id": "..."
}
```

## Project Structure

```
src/
├── components/
│   ├── TopBar.tsx      # Status bar with online indicator
│   ├── Sidebar.tsx     # Chat list and mode selector
│   └── ChatWindow.tsx  # Main chat interface
├── App.tsx             # Application logic
└── main.tsx            # Entry point
```

## License

MIT License

## Author

Hasitha Gallella - [GitHub](https://github.com/HasithaGallella)

---

Built with React + TypeScript + Vite
