# Auth API Documentation

## Overview
This API provides authentication-related endpoints for user management, including email verification, password reset, email change, and user deletion.

## Base URL
`/auth/`

## Authentication Endpoints

### 1. Request Forgot Password Token
- **Endpoint:** `/request-fp-token`
- **Method:** `POST`
- **Description:** Generate a token for password reset

#### Request Body
```json
{
  "email": "user@example.com"
}
```

#### Responses
- **200 OK:** Token sent to email
- **400 Bad Request:** Invalid email
- **404 Not Found:** User not found
- **500 Internal Server Error**

### 2. Request Email Verification Token
- **Endpoint:** `/request-ev-token`
- **Method:** `POST`
- **Description:** Generate a token for email verification

#### Request Body
```json
{
  "email": "user@example.com"
}
```

#### Responses
- **200 OK:** Verification token sent to email
- **400 Bad Request:** Invalid email
- **404 Not Found:** User not found
- **500 Internal Server Error**

### 3. Request Change Password Token
- **Endpoint:** `/request-cp-token`
- **Method:** `POST`
- **Description:** Generate a token for changing password (Requires authentication)

#### Request Body
```json
{
  "password": "currentPassword"
}
```

#### Responses
- **200 OK:** Change password token sent to email
- **400 Bad Request:** Invalid password
- **401 Unauthorized:** Not authenticated
- **500 Internal Server Error**

### 4. Request Change Email Token
- **Endpoint:** `/request-ce-token`
- **Method:** `POST`
- **Description:** Generate a token for changing email (Requires authentication)

#### Request Body
```json
{
  "email": "newemail@example.com"
}
```

#### Responses
- **200 OK:** Change email token sent to new email
- **400 Bad Request:** Invalid email or email already in use
- **401 Unauthorized:** Not authenticated
- **500 Internal Server Error**

### 5. Request Delete User Token
- **Endpoint:** `/request-du-token`
- **Method:** `POST`
- **Description:** Schedule account for deletion (Requires authentication)

#### Responses
- **200 OK:** Account scheduled for deletion
- **401 Unauthorized:** Not authenticated
- **403 Forbidden:** User already scheduled for deletion
- **500 Internal Server Error**

## Token Verification Endpoints

### 6. Verify Email
- **Endpoint:** `/verify-email/:token`
- **Method:** `GET`
- **Description:** Verify email using the token sent to user's email

#### Responses
- **200 OK:** Email verified
- **400 Bad Request:** Missing token or CSRF
- **403 Forbidden:** Invalid CSRF
- **500 Internal Server Error**

### 7. Reset Password
- **Endpoint:** `/reset-password/:token`
- **Method:** `GET`
- **Description:** Render password reset page

#### Responses
- **200 OK:** Password reset page rendered
- **400 Bad Request:** Missing token
- **403 Forbidden:** Invalid CSRF
- **500 Internal Server Error**

### 8. Change Password
- **Endpoint:** `/change-password`
- **Method:** `POST`
- **Description:** Change user password

#### Request Body
```json
{
  "token": "resetToken",
  "email": "user@example.com", 
  "cpassword": "currentPassword",
  "npassword": "newPassword"
}
```

#### Responses
- **200 OK:** Password changed successfully
- **400 Bad Request:** Invalid passwords
- **403 Forbidden:** Token verification failed
- **500 Internal Server Error**

### 9. Reset Password
- **Endpoint:** `/reset-password`
- **Method:** `POST`
- **Description:** Reset forgotten password

#### Request Body
```json
{
  "token": "resetToken",
  "email": "user@example.com",
  "npassword": "newPassword"
}
```

#### Responses
- **200 OK:** Password reset successfully
- **400 Bad Request:** Invalid password
- **403 Forbidden:** Token verification failed
- **500 Internal Server Error**

### 10. Change Email
- **Endpoint:** `/change-email`
- **Method:** `POST`
- **Description:** Change user email

#### Request Body
```json
{
  "kaf": "csrfToken",
  "token": "emailChangeToken",
  "password": "currentPassword"
}
```

#### Responses
- **200 OK:** Email changed successfully
- **400 Bad Request:** Invalid email or password
- **403 Forbidden:** Token verification failed
- **500 Internal Server Error**

### 11. Delete User
- **Endpoint:** `/delete-user`
- **Method:** `POST`
- **Description:** Schedule user account for deletion

#### Request Body
```json
{
  "password": "currentPassword"
}
```

#### Responses
- **200 OK:** Account deletion scheduled
- **400 Bad Request:** Invalid password
- **401 Unauthorized:** Not authenticated
- **403 Forbidden:** User already scheduled for deletion
- **500 Internal Server Error**

### 12. Get Email Verification Page
- **Endpoint:** `/email-verification/:token`
- **Method:** `GET`
- **Description:** Verify email and render verification page

#### Query Parameters
- `kaf`: CSRF token

#### Verification Process
1. Validate token and CSRF
2. Verify email token
3. Update user's verification status
4. Render email verification template

#### Responses
- **200 OK:** Email verified, template rendered
- **400 Bad Request:** Missing token or CSRF
- **403 Forbidden:** Invalid CSRF token
- **404 Not Found:** User not found
- **500 Internal Server Error**

### 13. Get Reset Password Page
- **Endpoint:** `/reset-password/:token`
- **Method:** `GET`
- **Description:** Render password reset page

#### Query Parameters
- `kaf`: CSRF token

#### Verification Process
1. Validate token and CSRF
2. Verify forgot password token
3. Render reset password template with email

#### Responses
- **200 OK:** Reset password page rendered
- **400 Bad Request:** Missing token or CSRF
- **403 Forbidden:** Invalid CSRF token
- **500 Internal Server Error**

### 14. Get Change Password Page
- **Endpoint:** `/change-password/:token`
- **Method:** `GET`
- **Description:** Render change password page

#### Query Parameters
- `kaf`: CSRF token

#### Verification Process
1. Validate token and CSRF
2. Verify change password token
3. Render change password template with email

#### Responses
- **200 OK:** Change password page rendered
- **400 Bad Request:** Missing token or CSRF
- **403 Forbidden:** Invalid CSRF token
- **500 Internal Server Error**

### 15. Get Change Email Page
- **Endpoint:** `/change-email/:token`
- **Method:** `GET`
- **Description:** Render change email page

#### Query Parameters
- `kaf`: CSRF token

#### Verification Process
1. Validate token and CSRF
2. Verify change email token
3. Render change email template

#### Responses
- **200 OK:** Change email page rendered
- **400 Bad Request:** Missing token or CSRF
- **403 Forbidden:** Invalid CSRF token
- **500 Internal Server Error**

### 16. Cancel User Deletion
- **Endpoint:** `/cancel-delete/:token`
- **Method:** `GET`
- **Description:** Cancel scheduled account deletion

#### Verification Process
1. Validate deletion token
2. Find user by email
3. Verify user is on kill list
4. Remove from kill list
5. Render cancellation template

#### Responses
- **200 OK:** Deletion canceled
- **400 Bad Request:** Missing token
- **403 Forbidden:** User not on deletion list
- **404 Not Found:** User not found
- **500 Internal Server Error**

## Detailed Authentication Flows

### Password Change Workflow
1. Request change password token
2. Receive token via email
3. Access change password page
4. Verify current password
5. Set new password
6. Validate new password is different from current

#### Validation Checks
- Token must be valid and not expired
- Current password must match
- New password cannot be same as current password
- Password hashed before storage

### Email Change Workflow
1. Request email change token
2. Receive token at new email
3. Verify current password
4. Confirm new email is unique
5. Update email and mark as verified
6. Destroy current session

#### Validation Checks
- CSRF protection
- Token verification
- Password confirmation
- Unique email check
- Session management

### User Deletion Workflow
1. Request deletion token
2. Verify current password
3. Schedule account for deletion
4. Send cancellation link via email
5. Allow cancellation within deletion window

#### Validation Checks
- Authentication required
- Password verification
- 14-day deletion window
- Cancellation mechanism

## Security Considerations
- All sensitive operations require multi-factor verification
- Tokens are short-lived
- CSRF protection on all endpoints
- Password complexity and reuse prevention
- Session management during critical changes

## Error Handling Patterns
- Consistent error responses
- Informative but non-revealing error messages
- Appropriate HTTP status codes
- Logging for monitoring and debugging

## Potential Improvements
- Implement rate limiting
- Add multi-factor authentication
- Enhance token generation entropy
- Implement progressive security challenges

## Logging and Monitoring
- Log all authentication attempts
- Monitor for suspicious activities
- Track failed login attempts
- Implement account lockout mechanisms

## Compliance Considerations
- GDPR data handling
- CCPA user data rights
- Secure token and password management