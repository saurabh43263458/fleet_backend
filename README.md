# User Registration Endpoint

## Endpoint: `/users/register`

### Method: `POST`

### Description:
This endpoint is used to register a new user. It validates the input data, hashes the password, creates a new user in the database, and returns a JSON Web Token (JWT) along with the user details.

### Request Body:
The request body should be a JSON object containing the following fields:

```json
{
    "fullname": {
        "firstname": "John",
        "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "password": "password123"
}
```

### Responses:

#### Success:
- **Status Code:** `200 OK`
- **Body:**
```json
{
    "token": "<JWT_TOKEN>",
    "user": {
        "_id": "<USER_ID>",
        "fullname": {
            "firstname": "John",
            "lastname": "Doe"
        },
        "email": "john.doe@example.com"
    }
}
```

#### Error:
- **Status Code:** `400 Bad Request`
- **Body:**
```json
{
    "errors": [
        {
            "msg": "Invalid Email",
            "param": "email",
            "location": "body"
        },
        {
            "msg": "first name must be at least 3 characters long",
            "param": "fullname.firstname",
            "location": "body"
        },
        {
            "msg": "password must be at least 6 characters long",
            "param": "password",
            "location": "body"
        }
    ]
}
```

### Example Request:
```bash
curl -X POST http://localhost:4000/users/register \
-H "Content-Type: application/json" \
-d '{
    "fullname": {
        "firstname": "John",
        "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "password": "password123"
}'
```

# User Login Endpoint

## Endpoint: `/users/login`

### Method: `POST`

### Description:
This endpoint is used to log in an existing user. It validates the input data, checks the user's credentials, and returns a JSON Web Token (JWT) along with the user details.

### Request Body:
The request body should be a JSON object containing the following fields:

```json
{
    "email": "john.doe@example.com",
    "password": "password123"
}
```

### Responses:

#### Success:
- **Status Code:** `200 OK`
- **Body:**
```json
{
    "token": "<JWT_TOKEN>",
    "user": {
        "_id": "<USER_ID>",
        "fullname": {
            "firstname": "John",
            "lastname": "Doe"
        },
        "email": "john.doe@example.com"
    }
}
```

#### Error:
- **Status Code:** `400 Bad Request`
- **Body:**
```json
{
    "errors": [
        {
            "msg": "Invalid Email",
            "param": "email",
            "location": "body"
        },
        {
            "msg": "password must be at least 6 characters long",
            "param": "password",
            "location": "body"
        }
    ]
}
```
- **Status Code:** `401 Unauthorized`
- **Body:**
```json
{
    "message": "Invalid email or password"
}
```

### Example Request:
```bash
curl -X POST http://localhost:4000/users/login \
-H "Content-Type: application/json" \
-d '{
    "email": "john.doe@example.com",
    "password": "password123"
}'
```
