# 🚀 Social Media Scheduler – Backend

Backend API for **Social Media Scheduler**, a full-stack social media scheduling dashboard system.  
Built with Node.js, Express.js, and Supabase (PostgreSQL).  
Deployed on Render.

---

## 🚀 Live API

🔗 Base URL: https://social-media-schedular-backend.onrender.com/  

---

## ⚡ Features

- **User Authentication**  
  - Register: `POST /auth/register`  
  - Login: `POST /auth/login`  
  - Protected routes require JWT  

- **Post Management**  
  - CRUD operations for posts: `GET /posts`, `POST /posts`, `PUT /posts/:id`, `DELETE /posts/:id`  

- **Campaign Management**  
  - CRUD operations for campaigns: `GET /campaigns`, `POST /campaigns`, `PUT /campaigns/:id`, `DELETE /campaigns/:id`  

- **Analytics**  
  - Fetch analytics data: `GET /analytics`  

- **Users**  
  - Fetch Users data: `GET /users`  

- **Scheduler / Cron Jobs**  
  - Automated scheduled tasks (e.g., posting content automatically)

---

## 🛠️ Tech Stack

- **Node.js** with **Express.js**  
- **Supabase** as database  
- **JWT** for authentication  
- **Bcrypt** for password hashing  
- **Node-cron** for scheduling tasks  
- **CORS** for cross-origin requests  
- **dotenv** for environment variables
  
---

## 🏗️ System Architecture

Client (React) → Express REST API → Supabase (PostgreSQL)  

---

## 📂 Project Structure

```
social-media-schedular-backend/
│
├── database/                # Database schema
│
├── src/
│   ├── configs/             # Configuration files (DB connection, environment, etc.)
│   ├── controllers/         # Route controllers / business logic
│   ├── middlewares/         # Middlewares
│   ├── routes/              # Express route definitions
│   ├── utils/               # Helper functions
│   └── services/            # Services
│
├── .env                     # Environment variables (not committed)
├── .env.example             # Example environment variables
├── .gitignore
├── server.js                # Server start file
├── README.md
├── LICENSE
├── package.json
└── package-lock.json
```
---

## 🗄️ Database Schema

The database schema is available in the `database/schema.sql` file.  
It contains all table definitions, enum types, and constraints needed to set up the Supabase database.

---

## ⚙️ Installation & Setup

### Clone Repository

```bash
git clone https://github.com/Mahalaxmi-Komuravelly/social-media-schedular-backend
cd social-media-schedular-backend
```

### Install Dependencies

```bash
npm install
```

### Database Setup

- Ensure Supabase is configured with the `.env` variables.
- Import the schema from `database/schema.sql` to set up tables and enums.
- Verify the database connection using `src/utils/checkDBConnection.js`.

### Environment Variables

Create a `.env` file taking `.env.example` as a reference.

⚠️ **Never commit your `.env` file.**

### Run Development Server

```bash
npm run dev
```

### Production Mode

For production (Render), configure environment variables in:

Render → Environment → Environment Variables

```bash
npm start
```
---

🔑 Authentication

- Uses JWT for securing routes.
- Routes requiring authentication will expect a valid Authorization: Bearer <token> header.
- Passwords are hashed using bcrypt

---

📅 Scheduler

- Uses node-cron for scheduling tasks.
- Scheduled jobs start automatically when the server runs (startScheduler() in server.js).
- Example: Posting scheduled social media content automatically.

---

📚 API Routes

| Route        | Method                 | Description                       |
| ------------ | ---------------------- | --------------------------------- |
| `/auth`      | POST, GET              | User authentication               |
| `/posts`     | GET, POST, PUT, DELETE | Manage social media posts         |
| `/campaigns` | GET, POST, PUT, DELETE | Manage campaigns                  |
| `/analytics` | GET                    | Get analytics for posts/campaigns |
| `/users`     | GET, PUT, DELETE       | Manage users                      |

📝 Scripts

"scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
}

---

# 📄 License  
MIT License

---

# 👨‍💻 Author

**Mahalaxmi Komuravelly**    
Full Stack Web Developer    
Email: mahalaxmikomuravelly@gmail.com    
GitHub: https://github.com/Mahalaxmi-Komuravelly  

---

⭐ If you found this project helpful, consider giving it a star!