# Event Management System

A full-stack event management application built with modern web technologies, featuring user authentication, event planning, and an interactive calendar.

## 🚀 Features

- **User Authentication**: Secure register and login system using JWT and Bcrypt.
- **Event Management**: Create, edit, and delete events with title, description, date, and location.
- **Participation**: Join and leave events with capacity limits.
- **Visibility Control**: Support for both public and private events.
- **Calendar View**: Interactive dashboard using `react-big-calendar` to visualize scheduled events.
- **Responsive UI**: Modern, clean interface built with Tailwind CSS.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Icons**: Lucide React
- **Validation**: Zod
- **API Client**: Axios

### Backend
- **Framework**: NestJS
- **ORM**: Prisma
- **Auth**: Passport.js (JWT)
- **Database**: PostgreSQL

### Infrastructure
- **Containerization**: Docker & Docker Compose

## 🏁 Getting Started

### Prerequisites
- [Docker](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Event-Management-System
   ```

2. **Environment Variables**:
   The project uses environment variables for both client and server.
   - For the **Backend**: Copy `server/.env.example` to `server/.env` and update values.
   - For the **Frontend**: Copy `client/.env.example` to `client/.env` and update values.
   (Default configurations in the example files are usually sufficient for local Docker development).

3. **Start the application with Docker**:
   ```bash
   docker-compose up --build
   ```

   This command will:
   - Spin up a PostgreSQL database.
   - Build and start the NestJS backend (available at `http://localhost:3000`).
   - Build and start the React frontend (available at `http://localhost:5173`).
   - Automatically run Prisma migrations and seed the database.

4. **Access the App**:
   Open your browser and navigate to [http://localhost:5173](http://localhost:5173).

## 📁 Project Structure

```text
Event-Management-System/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── stores/      # Zustand state stores
│   │   └── features/    # Feature-specific logic (e.g., Auth, Events)
├── server/              # NestJS backend
│   ├── src/
│   │   ├── modules/     # NestJS modules (Auth, Users, Events)
│   │   └── main.ts      # Entry point
│   ├── prisma/          # Database schema and seed scripts
└── docker-compose.yml   # Orchestration for DB, Backend, and Frontend
```

## 📝 License

This project is [UNLICENSED](LICENSE).