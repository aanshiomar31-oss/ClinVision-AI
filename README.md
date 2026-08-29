# ClinVision AI

Enterprise Clinical AI Assistant for Multimodal Medical Analysis

ClinVision AI is a full-stack healthcare AI application that combines a React frontend, FastAPI backend, and Groq-powered Large Language Models to provide an interactive clinical assistant for medical image discussions and healthcare knowledge workflows.

The project demonstrates modern AI application development practices, including modular frontend architecture, REST API communication, environment-based configuration, and local deployment.

---

## Features

- AI-powered clinical conversation interface
- Multiple clinical modes:
  - Brain MRI
  - Chest X-ray
  - Histopathology
  - Clinical Guidelines
- FastAPI-powered backend
- Groq LLM integration through LangChain
- Persistent local chat history
- Environment-based configuration
- Modular React component architecture

---

## Tech Stack

| Layer | Technology |
|--------|------------|
| Frontend | React + TypeScript |
| Build Tool | Vite |
| Backend | FastAPI |
| AI Framework | LangChain |
| LLM | Groq |
| Styling | CSS |
| Version Control | Git & GitHub |

---

## Project Architecture

ClinVision AI follows a client-server architecture where the frontend manages user interactions, the backend orchestrates AI requests, and Groq handles language model inference through LangChain.

### Architecture Diagram

```text
                         ┌─────────────────────────┐
                         │        User             │
                         │  Clinical Interaction   │
                         └───────────┬─────────────┘
                                     │
                                     ▼
               ┌─────────────────────────────────┐
               │ React + TypeScript Frontend     │
               │ • Chat Interface                │
               │ • Clinical Modes                │
               │ • Local Chat History            │
               └──────────────┬──────────────────┘
                              │ REST API
                              ▼
               ┌─────────────────────────────────┐
               │ FastAPI Backend                 │
               │ • Request Validation            │
               │ • Prompt Processing             │
               │ • API Orchestration             │
               └──────────────┬──────────────────┘
                              │
                              ▼
               ┌─────────────────────────────────┐
               │ LangChain + Groq LLM            │
               │ • Medical Reasoning             │
               │ • Clinical Responses            │
               └──────────────┬──────────────────┘
                              │
                              ▼
               ┌─────────────────────────────────┐
               │ AI-Generated Clinical Response  │
               └─────────────────────────────────┘
```

### Request Flow

1. User selects a clinical mode.
2. React frontend captures the prompt and optional image input.
3. FastAPI receives the request through REST endpoints.
4. LangChain structures the prompt for the Groq LLM.
5. Groq generates the AI-powered clinical response.
6. The backend returns the response to the frontend.
7. Conversation history is stored locally for future sessions.

---

## Project Structure

```text
ClinVision-AI/
├── src/
│   ├── components/
│   │   ├── TopBar.tsx
│   │   ├── Sidebar.tsx
│   │   └── ChatWindow.tsx
│   ├── App.tsx
│   └── main.tsx
├── public/
├── Fast_API.py
├── requirements.txt
├── package.json
├── .env
└── README.md
```

### Core Components

| Component | Purpose |
|-----------|---------|
| `App.tsx` | Application state and API communication |
| `Sidebar.tsx` | Chat history and clinical mode selection |
| `TopBar.tsx` | Branding and backend status |
| `ChatWindow.tsx` | Conversation interface |
| `Fast_API.py` | Backend API and LLM orchestration |

---

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/aanshiomar31-oss/ClinVision-AI.git
cd ClinVision-AI
```

### Frontend Setup

```bash
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

### Backend Setup

```bash
pip install -r requirements.txt
python3 Fast_API.py
```

Backend runs at:

```text
http://127.0.0.1:8000
```

---

## Environment Variables

Create a `.env` file in the project root.

```env
VITE_API_URL=http://127.0.0.1:8000
GROQ_API_KEY=your_groq_api_key
```

---

## Screenshots

Add application screenshots after the UI refinement.

- Dashboard
- Chat Interface
- Clinical Modes
- Backend Running

---

## Engineering Contributions

This version extends the original foundation with several practical software engineering improvements:

- Rebranded the application into ClinVision AI.
- Replaced hardcoded backend URLs with environment-variable configuration.
- Added a reproducible Python dependency setup (`requirements.txt`).
- Integrated a local FastAPI deployment workflow.
- Introduced a Clinical Guidelines workflow mode.
- Improved UI styling and project organization.
- Configured secure environment variable management.

---

## Roadmap

- Clinical Guidelines PDF ingestion
- Retrieval-Augmented Generation (RAG)
- Docker deployment
- User authentication
- Cloud deployment
- Conversation export

---

## Acknowledgements

This project builds upon an open-source medical AI interface and has been extended with new branding, deployment improvements, configuration enhancements, and additional application workflows as part of my software engineering portfolio.
