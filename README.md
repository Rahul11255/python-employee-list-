# Employee Directory

A full-stack Employee Directory application built using **React, FastAPI, and MySQL**. It allows users to view employee records, search employees by name, and navigate through paginated results.

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- TanStack Query
- React Router

### Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- PyMySQL

### Database
- MySQL (Aiven Cloud)

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: Aiven

---

## Project Structure

```text
sumitomo/
├── frontend/
├── python-api/

## Prerequisites

Install the following before starting:

- [Node.js](https://nodejs.org/) (LTS version)
- [Python](https://www.python.org/downloads/) (3.10 or above)
- [Git](https://git-scm.com/)
- MySQL database credentials

---

## 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd sumitomo
```

## 2. Backend Setup (FastAPI)

Open a terminal and navigate to the backend folder:

```bash
cd python-api
```

### Create a Virtual Environment

```bash
python -m venv venv
```

### Activate the Virtual Environment

**Windows PowerShell:**

```powershell
.\venv\Scripts\Activate.ps1
```

**Windows CMD:**

```cmd
venv\Scripts\activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Configure Environment Variables

Create a `.env` file inside the `python-api` folder:

```env
DB_HOST=your_database_host
DB_PORT=your_database_port
DB_USER=your_database_username
DB_PASSWORD=your_database_password
DB_NAME=defaultdb
DB_CA_CERT=ca.pem
```

Replace the placeholder values with your own Aiven MySQL credentials.

Place your Aiven CA certificate file (`ca.pem`) inside the `python-api` folder.

**Important:** Never commit `.env` or `ca.pem` to GitHub.

### Start the Backend Server

```bash
uvicorn main:app --reload
```

Backend will run at:

```text
http://127.0.0.1:8000
```

FastAPI Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

---

## 3. Frontend Setup (React + Vite)

Open a **new terminal** and navigate to the frontend folder:

```bash
cd frontend
```

### Install Dependencies

```bash
npm install
```

### Configure API URL

Update the API URL in:

`src/api/employeeApi.js`

For local development:

```javascript
const API_URL = "http://127.0.0.1:8000/employees";
```

For production, replace it with your deployed backend API URL.

### Start the Frontend

```bash
npm run dev
```

Frontend will run at:

```text
http://localhost:5173
```

---

## 4. Application Features

- Display employee records from MySQL.
- Search employees by name.
- Server-side pagination.
- Loading state while fetching data.
- Error handling for failed API requests.
- REST API integration using Axios.
- API data management using TanStack Query.
- Responsive user interface.

## 5. API Endpoint

### Get Employees

```http
GET /employees
```

**Query Parameters:**

| Parameter | Description | Default |
|---|---|---|
| search | Search employees by name | Empty |
| page | Current page number | 1 |
| page_size | Number of records per page | 10 |

**Example:**

```http
GET /employees?search=Rahul&page=1&page_size=5
```

The API returns employee records along with pagination information:

```json
{
  "items": [],
  "total": 12,
  "page": 1,
  "page_size": 5
}
```

## 6. Security and Pagination

Security is important in applications that handle employee or user information. The backend should verify the user's identity and permissions before allowing access to protected resources.

### 6.1 Authentication Using JWT

JSON Web Token (JWT) can be used to authenticate users.

When a user logs in:

1. The user sends their email and password to the login API.
2. The backend verifies the credentials against the database.
3. If the credentials are valid, the backend generates two tokens:
   - **Access Token**
   - **Refresh Token**
4. The tokens are returned to the client using a secure authentication flow.

### 6.2 Access Token and Refresh Token

**Access Token:**
- Used to access protected API endpoints.
- Sent with API requests in the Authorization header.
- Usually has a short expiration time, such as 10–15 minutes.
- The backend validates the token before processing protected requests.

Example:

```http
GET /employees
Authorization: Bearer <access_token>
```

**Refresh Token:**
- Used to obtain a new access token when the existing access token expires.
- Has a longer expiration time, such as several days.
- Should be stored securely, preferably in an HttpOnly, Secure, SameSite cookie.
- Should be rotated when used, with the previous refresh token invalidated.
- Can be revoked when the user logs out or the session is compromised.

**Why use two tokens?**

If an access token is stolen, its short lifetime limits how long it can be used. The refresh token allows the user to obtain a new access token without entering their credentials again.

### 6.3 Protecting APIs and Preventing Unauthorized Access

Every protected backend endpoint should verify the access token.

A typical request flow:

1. The user logs in and receives tokens.
2. The frontend sends the access token with each protected API request.
3. The backend authentication middleware or dependency validates the token's signature and expiration.
4. The backend identifies the logged-in user from the verified token.
5. The authorization logic checks whether that user has permission to access the requested resource.
6. Only then does the backend return the requested data.

If the token is missing, invalid, or expired, the backend returns `401 Unauthorized`.

If the user is authenticated but does not have permission, the backend returns `403 Forbidden`.

### 6.4 Preventing URL and ID Manipulation (IDOR Protection)

Changing an ID in the URL should never allow a user to access another user's private information.

For example:

```http
GET /users/101
GET /users/102
```

Suppose user 101 is logged in and manually changes the URL from `/users/101` to `/users/102`.

The backend must not trust the ID provided by the frontend.

Instead:

1. The backend validates the access token.
2. It extracts the authenticated user's ID from the verified token.
3. It checks whether the requested resource belongs to that user or whether the user has an appropriate admin permission.
4. If access is not allowed, it returns `403 Forbidden` (or `404 Not Found` when hiding resource existence is appropriate).


This is an illustrative example. The actual database relationships and permission rules must match the application's data model.

This type of vulnerability is known as **Insecure Direct Object Reference (IDOR)** or Broken Object Level Authorization (BOLA). Checking permissions on the backend prevents users from accessing resources simply by changing IDs in URLs or request bodies.

### 6.5 Role-Based Access Control (RBAC)

Role-Based Access Control restricts operations based on the user's role.

For example:

| Role | Permissions |
|---|---|
| Admin | View, create, update, and delete employee records |
| Employee | View permitted employee information |
| Manager | View employees within their assigned team |

The backend checks the user's role and permissions before performing an operation.

The frontend can hide buttons based on the role for a better user experience, but the backend must always enforce the actual permissions.

### 6.6 Password and Session Security

- Store passwords using secure password hashing algorithms such as Argon2 or bcrypt. Never store plain-text passwords.
- Use HTTPS to protect data during transmission.
- Store refresh tokens in HttpOnly, Secure, SameSite cookies where appropriate.
- Avoid storing sensitive authentication tokens in localStorage because JavaScript can access them.
- Implement refresh token rotation and revocation.
- Provide logout functionality that invalidates the refresh-token session.
- Use login rate limiting to reduce brute-force attacks.

### 6.7 SQL Injection Prevention

SQLAlchemy ORM helps protect against SQL injection by using parameterized database queries.

Avoid constructing SQL queries by directly concatenating user input.

For example, use ORM filters instead of building SQL strings from user-provided values.

### 6.8 CORS Protection

Cross-Origin Resource Sharing (CORS) controls which browser origins are allowed to make requests to the API.

Only trusted frontend domains should be configured in production.

CORS is not authentication or authorization. It does not prevent direct API requests from tools or other servers.

### 6.9 Input Validation and Error Handling

- Use Pydantic schemas to validate incoming request data.
- Validate query parameters, IDs, email addresses, and other user inputs.
- Return appropriate HTTP status codes.
- Avoid exposing database credentials, internal errors, or sensitive information in API responses.
- Keep secrets in environment variables instead of hardcoding them.

### 6.10 Pagination

Pagination prevents the API from returning all database records in a single request.

The API uses `LIMIT` and `OFFSET` to retrieve records in smaller batches.

For example:

```http
GET /employees?page=1&page_size=5
```

- `page`: Specifies the requested page.
- `page_size`: Specifies the number of records per page.
- `OFFSET`: Determines how many records to skip.
- `LIMIT`: Determines how many records to return.

The offset is calculated using:

```python
offset = (page - 1) * page_size
```

The API also returns the total number of matching records, current page, and page size.

A maximum page size should be enforced to prevent unnecessarily large database queries.

For very large datasets, cursor-based pagination can be considered for better performance.

### Security Summary

The recommended production security approach includes:

- JWT-based authentication.
- Short-lived access tokens and securely managed refresh tokens.
- Backend authentication and authorization checks.
- Role-based access control.
- Ownership checks to prevent IDOR/BOLA vulnerabilities.
- Secure password hashing.
- SQL injection prevention using parameterized queries.
- HTTPS, restricted CORS, input validation, and rate limiting.

**Implementation note:** The current Employee Directory project implements database access using SQLAlchemy, request validation where applicable, CORS configuration, and server-side pagination. JWT login, refresh-token management, RBAC, and ownership-based authorization are proposed security enhancements and are not currently implemented.

---

## 7. Live Application

- **Frontend:** https://employees-smoky.vercel.app/

---

## Author

Developed as a full-stack Employee Directory project using React, FastAPI, and MySQL.
