# Event Management System

A full-stack event management application built with modern web technologies, featuring user authentication, event planning, and an interactive AI event assistant.

## 🚀 Features

- **AI Event Assistant**: Natural-language assistant powered by LLaMA 3.1 (Groq) to answer questions about your schedule, discovery events, and categories.
- **User Authentication**: Secure register and login system using JWT, Bcrypt, and HTTP-only cookies.
- **Event Management**: Create, edit, and delete events with title, description, date, and tags/categories.
- **Participation**: Join and leave events with capacity limits and organizer controls.
- **Visibility Control**: Support for both public and private events.
- **Calendar View**: Interactive dashboard using `react-big-calendar` to visualize scheduled events in month and week views.
- **Robust Error Handling**: Global exception filters (NestJS) and ErrorBoundary (React) for standardized, user-friendly failure states.
- **Responsive UI**: Modern, clean interface built with Tailwind CSS 4 and Lucide icons.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Icons**: Lucide React
- **Validation**: Zod
- **API Client**: Axios

### Backend
- **Framework**: NestJS 11
- **AI Engine**: Groq (LLaMA 3.1)
- **ORM**: Prisma
- **Auth**: Passport.js (JWT) & Cookie-based
- **Database**: PostgreSQL

### Infrastructure
- **Containerization**: Docker & Docker Compose

## 🏁 Getting Started

### Prerequisites
- [Docker](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Groq API Key](https://console.groq.com/) (for the AI assistant)

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Event-Management-System
   ```

2. **Environment Variables**:
   The project uses environment variables for both client and server.
   - For the **Backend**: Copy `server/.env.example` to `server/.env`. **CRITICAL**: You must add your `GROQ_API_KEY`.
   - For the **Frontend**: Copy `client/.env.example` to `client/.env`.

3. **Start the application with Docker**:
   ```bash
   docker-compose up --build
   ```

   This command will:
   - Spin up a PostgreSQL database.
   - Build and start the NestJS backend (available at `http://localhost:3000`).
   - Register API Documentation (Swagger) at [http://localhost:3000/api/docs](http://localhost:3000/api/docs).
   - Build and start the React frontend (available at `http://localhost:5173`).
   - Automatically run Prisma migrations and seed the database.

4. **Access the App**:
   Open your browser and navigate to [http://localhost:5173](http://localhost:5173).

## 📁 Project Structure

```text
Event-Management-System/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components (Common, Calendar, Assistant)
│   │   ├── features/    # Feature-specific logic (Auth, Events, Error Pages)
│   │   ├── hooks/       # Custom React hooks
│   │   ├── stores/      # Zustand state stores
│   │   └── app/         # Router and Global Providers
├── server/              # NestJS backend
│   ├── src/
│   │   ├── common/      # Global Filters, Guards, and Decorators
│   │   ├── modules/     # NestJS modules (Auth, Events, Assistant, Tags)
│   │   └── main.ts      # Entry point
│   ├── prisma/          # Database schema and seed scripts
└── docker-compose.yml   # Orchestration for DB, Backend, and Frontend
```

## 📝 License

This project is [UNLICENSED](LICENSE).
