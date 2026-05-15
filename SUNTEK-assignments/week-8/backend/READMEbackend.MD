# Backend Application

A RESTful backend API built using Express.js, MongoDB, and Mongoose.

---

# 🚀 Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- dotenv
- CORS
- Nodemon

---

# 📂 Project Structure

```bash
backend/
│
├── apis/
│   └── userApi.js
│
├── models/
│   └── userModel.js
│
├── .env
├── package.json
├── server.js
├── req.http
└── README.md
```

---

# ⚙️ Installation

Clone the repository:

```bash
git clone <your-repository-url>
```

Move into project folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file in the root directory and add:

```env
DB_URL=mongodb://localhost:27017/users-db
PORT=5000
```

---

# ▶️ Run Server

Using Node:

```bash
node server.js
```

Using Nodemon:

```bash
npx nodemon server.js
```

Server runs on:

```bash
http://localhost:5000
```

---

# 📦 API Base URL

```bash
http://localhost:5000/user-api
```

---

# 📌 API Endpoints

## 1️⃣ Create User

```http
POST /user-api/users
```

### Request Body

```json
{
  "name": "Mani",
  "email": "mani@gmail.com",
  "dateOfBirth": "2005-05-10",
  "mobileNumber": 9876543210
}
```

---

## 2️⃣ Get All Users

```http
GET /user-api/users
```

---

## 3️⃣ Get User By ID

```http
GET /user-api/users/:id
```

---

## 4️⃣ Update User

```http
PUT /user-api/users/:id
```

---

## 5️⃣ Soft Delete User

```http
DELETE /user-api/users/:id
```

This changes:

```js
status: false
```

instead of permanently deleting the user.

---

## 6️⃣ Activate User

```http
PATCH /user-api/users/:id
```

This changes:

```js
status: true
```

---

# 🗄️ Database Schema

## User Schema

```js
{
  name: String,
  email: String,
  dateOfBirth: Date,
  mobileNumber: Number,
  status: Boolean
}
```

---

# 🔥 Features

- REST API architecture
- MongoDB integration
- CRUD Operations
- Soft Delete functionality
- Validation using Mongoose
- Error Handling Middleware
- Environment Variable Support
- CORS Configuration

---

# 🛡️ Error Handling

Handles:

- Validation Errors
- Invalid MongoDB Object IDs
- Duplicate Emails
- Internal Server Errors

---

# 📜 Available Dependencies

## Production Dependencies

- express
- mongoose
- dotenv
- cors

## Development Dependencies

- nodemon

---

# 🧪 Testing APIs

You can test APIs using:

- Postman
- Thunder Client
- req.http file in VS Code

---

# 🚀 Future Improvements

- JWT Authentication
- Password Hashing
- Role-Based Access
- Pagination
- Search & Filtering
- API Documentation
- Docker Support

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Developer

Developed by Mani
