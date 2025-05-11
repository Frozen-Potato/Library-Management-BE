
# 📚 Library Management Backend

This is the backend service for the Library Management System, built with Node.js, Express, and MongoDB. It provides a RESTful API to manage books, users, borrowing history, and authentication.

## 🚀 Features

- User registration, login, and authentication using JWT
- Book creation, listing, updating, and deletion
- Book borrowing and returning with history tracking
- Role-based access (admin/user)
- Input validation and centralized error handling
- Swagger documentation

## 🛠 Tech Stack

![Node.js](https://img.shields.io/badge/Node.js-v18.x-brightgreen)
![Express](https://img.shields.io/badge/Express.js-Framework-lightgrey)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![TypeScript](https://img.shields.io/badge/TypeScript-v4.x-blue)
![Swagger](https://img.shields.io/badge/Swagger-API--Docs-orange)
![JWT](https://img.shields.io/badge/JWT-Authentication-red)
![CI/CD](https://img.shields.io/badge/GitHub%20Actions-CI--CD-blue)

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT
- **Validation:** express-validator
- **Documentation:** Swagger (OpenAPI)
- **Deployment:** VPS with Caddy v2, Cloudflare DNS, GitHub Actions for CI/CD

## 📁 Project Structure

```
src/
├── controllers/       # Route controllers
├── middlewares/       # Custom middleware (e.g., auth, validation)
├── models/            # Mongoose models
├── routes/            # Express routes
├── services/          # Business logic layer
├── utils/             # Utility functions (e.g., ApiError)
└── app.ts             # Express app entry point
```

## 🔒 Authentication

The API uses JWT for authentication. Protected routes require a valid token in the `Authorization` header:

```
Authorization: Bearer <token>
```

## 🧪 Testing & Validation

- Requests are validated using middleware (e.g., `bookValidate.ts`)
- Centralized error handling via `ApiError.ts`
- Errors follow a consistent structure:
  
```json
{
  "status": "error",
  "message": "Resource not found",
  "code": 404
}
```

## 🚀 Deployment

This project is currently deployed on a Virtual Private Server (VPS) with:

- **Caddy v2**: Serves as a reverse proxy and handles HTTPS
- **Cloudflare**: Manages DNS and security
- **GitHub Actions**: Automates testing and deployment via CI/CD

## 📄 API Documentation

Interactive Swagger documentation is available here:

👉 [https://expressapi.frozenpotato.homes/api/v1/api-docs/](https://expressapi.frozenpotato.homes/api/v1/api-docs/)

---

## 📌 License

This project is licensed under the MIT License.

