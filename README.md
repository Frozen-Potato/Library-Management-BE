# 📚 Library Management System API

## Overview

This project serves as the backend for a Library Management System, facilitating operations such as book cataloging, user management, borrowing, and returning books. It's designed with scalability and maintainability in mind, leveraging modern technologies and best practices.

## 🛠️ Tech Stack

- **Framework:** Express.js  
- **Language:** TypeScript  
- **Database:** MongoDB  
- **Testing:** Jest  
- **API Documentation:** Swagger  
- **Containerization:** Docker  

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB instance
- Docker (optional, for containerization)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Frozen-Potato/Library-Management-BE.git
   cd Library-Management-BE
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables:**

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your MongoDB connection string and JWT secret.

4. **Run the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The server should now be running at `http://localhost:3000`.

## 🧪 Running Tests

To execute the test suite:

```bash
npm test
# or
yarn test
```

Ensure that your MongoDB test database is configured properly in the `.env` file.

## 📄 API Documentation

After starting the server, access the Swagger UI at:

```
http://localhost:3000/api/v1/api-docs
```

This provides interactive documentation for all available endpoints.

## 🧰 Project Structure

```
├── src
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── services
│   └── utils
├── tests
├── .env.example
├── Dockerfile
├── jest.config.ts
├── package.json
└── tsconfig.json
```

- **controllers:** Handle incoming requests and responses.
- **models:** Define Mongoose schemas and models.
- **routes:** Define API endpoints and route handlers.
- **services:** Contain business logic and interact with models.
- **utils:** Utility functions and helpers.
- **tests:** Unit and integration tests.

## 🐳 Docker Support

To run the application using Docker:

1. **Build the Docker image:**

   ```bash
   docker build -t library-management-be .
   ```

2. **Run the Docker container:**

   ```bash
   docker run -p 3000:3000 --env-file .env library-management-be
   ```

Ensure that your `.env` file is correctly configured before running the container.

## 🔐 Authentication & Authorization

The application uses JWT for authentication. Upon successful login, clients receive a token to include in the `Authorization` header for protected routes.

Role-based access control (RBAC) is implemented to restrict access to certain endpoints based on user roles (e.g., admin, member).

## 👥 Contributors

- [Frozen-Potato](https://github.com/Frozen-Potato)
- [phuoc94](https://github.com/phuoc94)
- [tuannguyen-TN](https://github.com/tuannguyen-TN)
- [TungNguyen12](https://github.com/TungNguyen12)

---

For further details and updates, please refer to the [official repository](https://github.com/Frozen-Potato/Library-Management-BE).
