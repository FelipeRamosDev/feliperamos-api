# API Routes Documentation

This document provides comprehensive documentation for all API endpoints in the Felipe Ramos API backend system.

## Base URL
```
https://api.feliperamos.dev
```

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the `Authorization` header:
```
Authorization: Bearer <your-jwt-token>
```

### Role-based Access Control
- **Public**: No authentication required
- **Admin/Master**: Requires authentication with admin or master role

---

## Authentication Routes

### POST /auth/login
Authenticate user and generate JWT token.

**Access**: Public  
**Content-Type**: `application/json`

#### Request Body
```json
{
  "email": "user@example.com",
  "password": "userpassword"
}
```

#### Response (200 OK)
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "User Name",
  "role": "admin",
  "first_name": "User",
  "last_name": "Name"
}
```

#### Response (401 Unauthorized)
```json
{
  "message": "Invalid email or password.",
  "code": "INVALID_EMAIL_PASSWORD",
  "status": 401
}
```

#### Response (400 Bad Request)
```json
{
  "message": "Email and password are required.",
  "code": "EMAIL_PASSWORD_REQUIRED",
  "status": 400
}
```

---

### GET /auth/user
Get current authenticated user information.

**Access**: Public  

#### Response (200 OK)
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "User Name",
  "role": "admin",
  "first_name": "User",
  "last_name": "Name"
}
```

#### Response (200 OK - Not Authenticated)
```json
null
```

---

## Skills Management (Protected Routes)

### POST /skill/create
Create a new skill.

**Access**: Admin/Master  
**Content-Type**: `application/json`

#### Request Body
```json
{
  "name": "JavaScript",
  "journey": "5 years of experience in web development",
  "category": "Programming Languages",
  "level": 85,
  "language_set": "en"
}
```

#### Response (201 Created)
```json
{
  "id": 1,
  "user_id": 1,
  "name": "JavaScript",
  "journey": "5 years of experience in web development",
  "category": "Programming Languages",
  "level": 85,
  "language_set": "en",
  "created_at": "2025-01-01T00:00:00.000Z",
  "updated_at": "2025-01-01T00:00:00.000Z"
}
```

---

### POST /skill/create-set
Create a skill language set (multiple language versions of the same skill).

**Access**: Admin/Master  
**Content-Type**: `application/json`

#### Request Body
```json
{
  "skill_id": 1,
  "language_sets": [
    {
      "language_set": "es",
      "name": "JavaScript",
      "journey": "5 años de experiencia en desarrollo web",
      "category": "Lenguajes de Programación"
    }
  ]
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "created_sets": [
    {
      "id": 2,
      "skill_id": 1,
      "language_set": "es",
      "name": "JavaScript",
      "journey": "5 años de experiencia en desarrollo web",
      "category": "Lenguajes de Programación"
    }
  ]
}
```

---

### GET /skill/query
Query user skills with filtering options.

**Access**: Admin/Master  

#### Query Parameters
- `language_set` (optional): Filter by language set (e.g., "en", "es")
- `category` (optional): Filter by skill category
- `level` (optional): Filter by skill level

#### Response (200 OK)
```json
[
  {
    "id": 1,
    "user_id": 1,
    "name": "JavaScript",
    "journey": "5 years of experience in web development",
    "category": "Programming Languages",
    "level": 85,
    "language_set": "en",
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z"
  }
]
```

---

### GET /skill/:skill_id
Get skill details by ID.

**Access**: Public  

#### Path Parameters
- `skill_id`: The ID of the skill

#### Response (200 OK)
```json
{
  "id": 1,
  "user_id": 1,
  "name": "JavaScript",
  "journey": "5 years of experience in web development",
  "category": "Programming Languages",
  "level": 85,
  "language_set": "en",
  "created_at": "2025-01-01T00:00:00.000Z",
  "updated_at": "2025-01-01T00:00:00.000Z"
}
```

---

### PATCH /skill/update
Update skill information.

**Access**: Admin/Master  
**Content-Type**: `application/json`

#### Request Body
```json
{
  "id": 1,
  "updates": {
    "name": "Advanced JavaScript",
    "level": 90,
    "journey": "6 years of experience in web development"
  }
}
```

#### Response (200 OK)
```json
{
  "id": 1,
  "user_id": 1,
  "name": "Advanced JavaScript",
  "journey": "6 years of experience in web development",
  "category": "Programming Languages",
  "level": 90,
  "language_set": "en",
  "created_at": "2025-01-01T00:00:00.000Z",
  "updated_at": "2025-01-01T12:00:00.000Z"
}
```

---

### PATCH /skill/update-set
Update skill language set information.

**Access**: Admin/Master  
**Content-Type**: `application/json`

#### Request Body
```json
{
  "skill_id": 1,
  "language_set": "es",
  "updates": {
    "name": "JavaScript Avanzado",
    "journey": "6 años de experiencia en desarrollo web"
  }
}
```

#### Response (200 OK)
```json
{
  "id": 2,
  "skill_id": 1,
  "language_set": "es",
  "name": "JavaScript Avanzado",
  "journey": "6 años de experiencia en desarrollo web",
  "category": "Lenguajes de Programación",
  "updated_at": "2025-01-01T12:00:00.000Z"
}
```

---

### DELETE /skill/delete
Delete a skill.

**Access**: Admin/Master  
**Content-Type**: `application/json`

#### Request Body
```json
{
  "id": 1
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Skill deleted successfully",
  "deleted_id": 1
}
```

---

### GET /skill/public/user-skills
Get public skills for master user.

**Access**: Public  

#### Response (200 OK)
```json
[
  {
    "id": 1,
    "name": "JavaScript",
    "category": "Programming Languages",
    "level": 85,
    "language_set": "en"
  }
]
```

---

## Companies Management (Protected Routes)

### POST /company/create
Create a new company.

**Access**: Admin/Master  
**Content-Type**: `application/json`

#### Request Body
```json
{
  "company_name": "Tech Corp",
  "industry": "Technology",
  "description": "Leading technology company",
  "website": "https://techcorp.com",
  "location": "San Francisco, CA",
  "language_set": "en"
}
```

#### Response (201 Created)
```json
{
  "id": 1,
  "user_id": 1,
  "company_name": "Tech Corp",
  "industry": "Technology",
  "description": "Leading technology company",
  "website": "https://techcorp.com",
  "location": "San Francisco, CA",
  "language_set": "en",
  "created_at": "2025-01-01T00:00:00.000Z",
  "updated_at": "2025-01-01T00:00:00.000Z"
}
```

---

### POST /company/create-set
Create a company language set.

**Access**: Admin/Master  
**Content-Type**: `application/json`

#### Request Body
```json
{
  "company_id": 1,
  "language_sets": [
    {
      "language_set": "es",
      "company_name": "Tech Corp",
      "description": "Empresa líder en tecnología",
      "location": "San Francisco, CA"
    }
  ]
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "created_sets": [
    {
      "id": 2,
      "company_id": 1,
      "language_set": "es",
      "company_name": "Tech Corp",
      "description": "Empresa líder en tecnología",
      "location": "San Francisco, CA"
    }
  ]
}
```

---

### GET /company/query
Query user companies with filtering options.

**Access**: Admin/Master  

#### Query Parameters
- `language_set` (optional): Filter by language set
- `industry` (optional): Filter by industry

#### Response (200 OK)
```json
[
  {
    "id": 1,
    "user_id": 1,
    "company_name": "Tech Corp",
    "industry": "Technology",
    "description": "Leading technology company",
    "website": "https://techcorp.com",
    "location": "San Francisco, CA",
    "language_set": "en"
  }
]
```

---

### GET /company/:company_id
Get company details by ID.

**Access**: Public  

#### Path Parameters
- `company_id`: The ID of the company

#### Response (200 OK)
```json
{
  "id": 1,
  "user_id": 1,
  "company_name": "Tech Corp",
  "industry": "Technology",
  "description": "Leading technology company",
  "website": "https://techcorp.com",
  "location": "San Francisco, CA",
  "language_set": "en"
}
```

---

### PATCH /company/update
Update company information.

**Access**: Admin/Master  
**Content-Type**: `application/json`

#### Request Body
```json
{
  "id": 1,
  "updates": {
    "company_name": "Advanced Tech Corp",
    "description": "Leading innovative technology company",
    "website": "https://advancedtechcorp.com"
  }
}
```

#### Response (200 OK)
```json
{
  "id": 1,
  "user_id": 1,
  "company_name": "Advanced Tech Corp",
  "industry": "Technology",
  "description": "Leading innovative technology company",
  "website": "https://advancedtechcorp.com",
  "location": "San Francisco, CA",
  "language_set": "en",
  "updated_at": "2025-01-01T12:00:00.000Z"
}
```

---

### PATCH /company/update-set
Update company language set information.

**Access**: Admin/Master  
**Content-Type**: `application/json`

#### Request Body
```json
{
  "company_id": 1,
  "language_set": "es",
  "updates": {
    "company_name": "Tech Corp Avanzado",
    "description": "Empresa líder en tecnología innovadora"
  }
}
```

#### Response (200 OK)
```json
{
  "id": 2,
  "company_id": 1,
  "language_set": "es",
  "company_name": "Tech Corp Avanzado",
  "description": "Empresa líder en tecnología innovadora",
  "updated_at": "2025-01-01T12:00:00.000Z"
}
```

---

### DELETE /company/delete
Delete a company.

**Access**: Admin/Master  
**Content-Type**: `application/json`

#### Request Body
```json
{
  "id": 1
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Company deleted successfully",
  "deleted_id": 1
}
```

---

## Languages Management (Protected Routes)

### POST /language/create
Create a new language skill.

**Access**: Admin/Master  
**Content-Type**: `application/json`

#### Request Body
```json
{
  "language": "Spanish",
  "proficiency": "Native",
  "level": 100,
  "locale": "es"
}
```

#### Response (201 Created)
```json
{
  "id": 1,
  "user_id": 1,
  "language": "Spanish",
  "proficiency": "Native",
  "level": 100,
  "locale": "es",
  "created_at": "2025-01-01T00:00:00.000Z",
  "updated_at": "2025-01-01T00:00:00.000Z"
}
```

---

### GET /language/:language_id
Get language details by ID.

**Access**: Public  

#### Path Parameters
- `language_id`: The ID of the language

#### Response (200 OK)
```json
{
  "id": 1,
  "user_id": 1,
  "language": "Spanish",
  "proficiency": "Native",
  "level": 100,
  "locale": "es",
  "created_at": "2025-01-01T00:00:00.000Z",
  "updated_at": "2025-01-01T00:00:00.000Z"
}
```

---

### PATCH /language/update
Update language information.

**Access**: Admin/Master  
**Content-Type**: `application/json`

#### Request Body
```json
{
  "id": 1,
  "updates": {
    "proficiency": "Advanced",
    "level": 95
  }
}
```

#### Response (200 OK)
```json
{
  "id": 1,
  "user_id": 1,
  "language": "Spanish",
  "proficiency": "Advanced",
  "level": 95,
  "locale": "es",
  "updated_at": "2025-01-01T12:00:00.000Z"
}
```

---

### DELETE /language/delete
Delete a language skill.

**Access**: Admin/Master  
**Content-Type**: `application/json`

#### Request Body
```json
{
  "id": 1
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Language deleted successfully",
  "deleted_id": 1
}
```

---

## Education Management (Protected Routes)

### POST /education/create
Create a new education record.

**Access**: Admin/Master  
**Content-Type**: `application/json`

#### Request Body
```json
{
  "institution": "University of Technology",
  "degree": "Bachelor of Science",
  "field_of_study": "Computer Science",
  "start_date": "2018-09-01",
  "end_date": "2022-06-15",
  "grade": "3.8 GPA",
  "description": "Specialized in software engineering and web development",
  "language_set": "en"
}
```

#### Response (201 Created)
```json
{
  "id": 1,
  "user_id": 1,
  "institution": "University of Technology",
  "degree": "Bachelor of Science",
  "field_of_study": "Computer Science",
  "start_date": "2018-09-01",
  "end_date": "2022-06-15",
  "grade": "3.8 GPA",
  "description": "Specialized in software engineering and web development",
  "language_set": "en",
  "created_at": "2025-01-01T00:00:00.000Z",
  "updated_at": "2025-01-01T00:00:00.000Z"
}
```

---

### GET /education/:education_id
Get education details by ID.

**Access**: Public  

#### Path Parameters
- `education_id`: The ID of the education record

#### Response (200 OK)
```json
{
  "id": 1,
  "user_id": 1,
  "institution": "University of Technology",
  "degree": "Bachelor of Science",
  "field_of_study": "Computer Science",
  "start_date": "2018-09-01",
  "end_date": "2022-06-15",
  "grade": "3.8 GPA",
  "description": "Specialized in software engineering and web development",
  "language_set": "en"
}
```

---

### PATCH /education/update
Update education information.

**Access**: Admin/Master  
**Content-Type**: `application/json`

#### Request Body
```json
{
  "id": 1,
  "updates": {
    "grade": "3.9 GPA",
    "description": "Specialized in software engineering, web development, and AI"
  }
}
```

#### Response (200 OK)
```json
{
  "id": 1,
  "user_id": 1,
  "institution": "University of Technology",
  "degree": "Bachelor of Science",
  "field_of_study": "Computer Science",
  "start_date": "2018-09-01",
  "end_date": "2022-06-15",
  "grade": "3.9 GPA",
  "description": "Specialized in software engineering, web development, and AI",
  "language_set": "en",
  "updated_at": "2025-01-01T12:00:00.000Z"
}
```

---

### PATCH /education/update-set
Update education language set information.

**Access**: Admin/Master  
**Content-Type**: `application/json`

#### Request Body
```json
{
  "education_id": 1,
  "language_set": "es",
  "updates": {
    "institution": "Universidad de Tecnología",
    "description": "Especializado en ingeniería de software, desarrollo web e IA"
  }
}
```

#### Response (200 OK)
```json
{
  "id": 2,
  "education_id": 1,
  "language_set": "es",
  "institution": "Universidad de Tecnología",
  "description": "Especializado en ingeniería de software, desarrollo web e IA",
  "updated_at": "2025-01-01T12:00:00.000Z"
}
```

---

### DELETE /education/delete
Delete an education record.

**Access**: Admin/Master  
**Content-Type**: `application/json`

#### Request Body
```json
{
  "id": 1
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Education record deleted successfully",
  "deleted_id": 1
}
```

---

## Experience Management (Protected Routes)

### POST /experience/create
Create a new experience.

**Access**: Admin/Master  
**Content-Type**: `application/json`

#### Request Body
```json
{
  "company_name": "Tech Solutions Inc",
  "position": "Senior Software Developer",
  "start_date": "2022-07-01",
  "end_date": "2024-12-31",
  "description": "Led development of web applications using React and Node.js",
  "technologies": ["React", "Node.js", "PostgreSQL", "Docker"],
  "achievements": ["Improved application performance by 40%", "Led team of 5 developers"],
  "language_set": "en"
}
```

#### Response (201 Created)
```json
{
  "id": 1,
  "user_id": 1,
  "company_name": "Tech Solutions Inc",
  "position": "Senior Software Developer",
  "start_date": "2022-07-01",
  "end_date": "2024-12-31",
  "description": "Led development of web applications using React and Node.js",
  "technologies": ["React", "Node.js", "PostgreSQL", "Docker"],
  "achievements": ["Improved application performance by 40%", "Led team of 5 developers"],
  "language_set": "en",
  "created_at": "2025-01-01T00:00:00.000Z",
  "updated_at": "2025-01-01T00:00:00.000Z"
}
```

---

### POST /experience/create-set
Create an experience language set.

**Access**: Admin/Master  
**Content-Type**: `application/json`

#### Request Body
```json
{
  "experience_id": 1,
  "language_sets": [
    {
      "language_set": "es",
      "position": "Desarrollador Senior de Software",
      "description": "Lideré el desarrollo de aplicaciones web usando React y Node.js",
      "achievements": ["Mejoré el rendimiento de la aplicación en un 40%", "Lideré un equipo de 5 desarrolladores"]
    }
  ]
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "created_sets": [
    {
      "id": 2,
      "experience_id": 1,
      "language_set": "es",
      "position": "Desarrollador Senior de Software",
      "description": "Lideré el desarrollo de aplicaciones web usando React y Node.js",
      "achievements": ["Mejoré el rendimiento de la aplicación en un 40%", "Lideré un equipo de 5 desarrolladores"]
    }
  ]
}
```

---

### GET /experience/query
Query user experiences with filtering options.

**Access**: Admin/Master  

#### Query Parameters
- `language_set` (optional): Filter by language set
- `company_name` (optional): Filter by company name
- `position` (optional): Filter by position

#### Response (200 OK)
```json
[
  {
    "id": 1,
    "user_id": 1,
    "company_name": "Tech Solutions Inc",
    "position": "Senior Software Developer",
    "start_date": "2022-07-01",
    "end_date": "2024-12-31",
    "description": "Led development of web applications using React and Node.js",
    "technologies": ["React", "Node.js", "PostgreSQL", "Docker"],
    "achievements": ["Improved application performance by 40%", "Led team of 5 developers"],
    "language_set": "en"
  }
]
```

---

### GET /experience/:experience_id
Get experience details by ID.

**Access**: Public  

#### Path Parameters
- `experience_id`: The ID of the experience

#### Response (200 OK)
```json
{
  "id": 1,
  "user_id": 1,
  "company_name": "Tech Solutions Inc",
  "position": "Senior Software Developer",
  "start_date": "2022-07-01",
  "end_date": "2024-12-31",
  "description": "Led development of web applications using React and Node.js",
  "technologies": ["React", "Node.js", "PostgreSQL", "Docker"],
  "achievements": ["Improved application performance by 40%", "Led team of 5 developers"],
  "language_set": "en"
}
```

---

### PATCH /experience/update
Update experience information.

**Access**: Admin/Master  
**Content-Type**: `application/json`

#### Request Body
```json
{
  "id": 1,
  "updates": {
    "position": "Lead Software Developer",
    "achievements": ["Improved application performance by 50%", "Led team of 8 developers", "Implemented CI/CD pipeline"]
  }
}
```

#### Response (200 OK)
```json
{
  "id": 1,
  "user_id": 1,
  "company_name": "Tech Solutions Inc",
  "position": "Lead Software Developer",
  "start_date": "2022-07-01",
  "end_date": "2024-12-31",
  "description": "Led development of web applications using React and Node.js",
  "technologies": ["React", "Node.js", "PostgreSQL", "Docker"],
  "achievements": ["Improved application performance by 50%", "Led team of 8 developers", "Implemented CI/CD pipeline"],
  "language_set": "en",
  "updated_at": "2025-01-01T12:00:00.000Z"
}
```

---

### PATCH /experience/update-set
Update experience language set information.

**Access**: Admin/Master  
**Content-Type**: `application/json`

#### Request Body
```json
{
  "experience_id": 1,
  "language_set": "es",
  "updates": {
    "position": "Desarrollador Líder de Software",
    "description": "Lideré el desarrollo de aplicaciones web usando React y Node.js"
  }
}
```

#### Response (200 OK)
```json
{
  "id": 2,
  "experience_id": 1,
  "language_set": "es",
  "position": "Desarrollador Líder de Software",
  "description": "Lideré el desarrollo de aplicaciones web usando React y Node.js",
  "updated_at": "2025-01-01T12:00:00.000Z"
}
```

---

### DELETE /experience/delete
Delete an experience.

**Access**: Admin/Master  
**Content-Type**: `application/json`

#### Request Body
```json
{
  "id": 1
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Experience deleted successfully",
  "deleted_id": 1
}
```

---

### GET /experience/public/user-experiences
Get public experiences for master user.

**Access**: Public  

#### Response (200 OK)
```json
[
  {
    "id": 1,
    "company_name": "Tech Solutions Inc",
    "position": "Senior Software Developer",
    "start_date": "2022-07-01",
    "end_date": "2024-12-31",
    "description": "Led development of web applications using React and Node.js",
    "technologies": ["React", "Node.js", "PostgreSQL", "Docker"],
    "language_set": "en"
  }
]
```

---

## Curriculum/CV Management (Protected Routes)

### POST /curriculum/create
Create a new CV/resume.

**Access**: Admin/Master  
**Content-Type**: `application/json`

#### Request Body
```json
{
  "title": "Software Developer CV",
  "job_title": "Senior Software Developer",
  "summary": "Experienced software developer with expertise in full-stack development",
  "contact_info": {
    "email": "user@example.com",
    "phone": "+1234567890",
    "location": "San Francisco, CA"
  },
  "language_set": "en",
  "is_master": false,
  "is_favorite": false
}
```

#### Response (201 Created)
```json
{
  "id": 1,
  "user_id": 1,
  "title": "Software Developer CV",
  "job_title": "Senior Software Developer",
  "summary": "Experienced software developer with expertise in full-stack development",
  "contact_info": {
    "email": "user@example.com",
    "phone": "+1234567890",
    "location": "San Francisco, CA"
  },
  "language_set": "en",
  "is_master": false,
  "is_favorite": false,
  "created_at": "2025-01-01T00:00:00.000Z",
  "updated_at": "2025-01-01T00:00:00.000Z"
}
```

---

### POST /curriculum/create-set
Create a CV language set.

**Access**: Admin/Master  
**Content-Type**: `application/json`

#### Request Body
```json
{
  "cv_id": 1,
  "language_sets": [
    {
      "language_set": "es",
      "title": "CV Desarrollador de Software",
      "job_title": "Desarrollador Senior de Software",
      "summary": "Desarrollador de software experimentado con experiencia en desarrollo full-stack"
    }
  ]
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "created_sets": [
    {
      "id": 2,
      "cv_id": 1,
      "language_set": "es",
      "title": "CV Desarrollador de Software",
      "job_title": "Desarrollador Senior de Software",
      "summary": "Desarrollador de software experimentado con experiencia en desarrollo full-stack"
    }
  ]
}
```

---

### GET /curriculum/:cv_id
Get CV details by ID.

**Access**: Admin/Master  

#### Path Parameters
- `cv_id`: The ID of the CV

#### Response (200 OK)
```json
{
  "id": 1,
  "user_id": 1,
  "title": "Software Developer CV",
  "job_title": "Senior Software Developer",
  "summary": "Experienced software developer with expertise in full-stack development",
  "contact_info": {
    "email": "user@example.com",
    "phone": "+1234567890",
    "location": "San Francisco, CA"
  },
  "language_set": "en",
  "is_master": false,
  "is_favorite": false,
  "cv_skills": [],
  "cv_experiences": [],
  "cv_educations": [],
  "cv_languages": []
}
```

---

### PATCH /curriculum/update
Update CV information.

**Access**: Admin/Master  
**Content-Type**: `application/json`

#### Request Body
```json
{
  "id": 1,
  "updates": {
    "title": "Lead Software Developer CV",
    "job_title": "Lead Software Developer",
    "summary": "Experienced lead software developer with expertise in full-stack development and team leadership",
    "is_favorite": true
  }
}
```

#### Response (200 OK)
```json
{
  "id": 1,
  "user_id": 1,
  "title": "Lead Software Developer CV",
  "job_title": "Lead Software Developer",
  "summary": "Experienced lead software developer with expertise in full-stack development and team leadership",
  "contact_info": {
    "email": "user@example.com",
    "phone": "+1234567890",
    "location": "San Francisco, CA"
  },
  "language_set": "en",
  "is_master": false,
  "is_favorite": true,
  "updated_at": "2025-01-01T12:00:00.000Z"
}
```

---

### PATCH /curriculum/update-set
Update CV language set information.

**Access**: Admin/Master  
**Content-Type**: `application/json`

#### Request Body
```json
{
  "cv_id": 1,
  "language_set": "es",
  "updates": {
    "title": "CV Desarrollador Líder de Software",
    "job_title": "Desarrollador Líder de Software"
  }
}
```

#### Response (200 OK)
```json
{
  "id": 2,
  "cv_id": 1,
  "language_set": "es",
  "title": "CV Desarrollador Líder de Software",
  "job_title": "Desarrollador Líder de Software",
  "updated_at": "2025-01-01T12:00:00.000Z"
}
```

---

### PATCH /curriculum/set-master
Set CV as master/primary CV.

**Access**: Admin/Master  
**Content-Type**: `application/json`

#### Request Body
```json
{
  "id": 1
}
```

#### Response (200 OK)
```json
{
  "id": 1,
  "user_id": 1,
  "title": "Lead Software Developer CV",
  "job_title": "Lead Software Developer",
  "summary": "Experienced lead software developer with expertise in full-stack development and team leadership",
  "is_master": true,
  "updated_at": "2025-01-01T12:00:00.000Z"
}
```

---

### DELETE /curriculum/delete
Delete a CV.

**Access**: Admin/Master  
**Content-Type**: `application/json`

#### Request Body
```json
{
  "id": 1
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "CV deleted successfully",
  "deleted_id": 1
}
```

---

### GET /curriculum/public/:cv_id
Get public CV data for display.

**Access**: Public  

#### Path Parameters
- `cv_id`: The ID of the CV

#### Response (200 OK)
```json
{
  "id": 1,
  "title": "Software Developer CV",
  "job_title": "Senior Software Developer",
  "summary": "Experienced software developer with expertise in full-stack development",
  "contact_info": {
    "email": "user@example.com",
    "phone": "+1234567890",
    "location": "San Francisco, CA"
  },
  "language_set": "en",
  "cv_skills": [],
  "cv_experiences": [],
  "cv_educations": [],
  "cv_languages": []
}
```

---

## Job Opportunity Management (Protected Routes)

### POST /opportunity/create
Create a new job opportunity.

**Access**: Admin/Master  
**Content-Type**: `application/json`

#### Request Body
```json
{
  "jobURL": "https://linkedin.com/jobs/123456789",
  "jobTitle": "Senior Full Stack Developer",
  "jobDescription": "We are looking for a senior full stack developer...",
  "jobLocation": "San Francisco, CA",
  "jobSeniority": "Senior",
  "jobEmploymentType": "Full-time",
  "jobCompany": "Tech Innovations Inc",
  "cvSummary": "Experienced developer with 5+ years in React and Node.js",
  "cvTemplate": 1
}
```

#### Response (200 OK)
```json
{
  "id": 1,
  "job_url": "https://linkedin.com/jobs/123456789",
  "job_title": "Senior Full Stack Developer",
  "job_description": "We are looking for a senior full stack developer...",
  "location": "San Francisco, CA",
  "seniority_level": "Senior",
  "employment_type": "Full-time",
  "company_id": 1,
  "opportunity_user_id": 1,
  "cv_id": 2,
  "created_at": "2025-01-01T00:00:00.000Z",
  "updated_at": "2025-01-01T00:00:00.000Z"
}
```

---

### GET /opportunity/search
Search job opportunities with advanced filtering.

**Access**: Admin/Master  

#### Query Parameters
- `where[company_id]` (optional): Filter by company ID
- `sort` (optional): Sort field (e.g., "created_at")
- `order` (optional): Sort order ("asc" or "desc")

#### Response (200 OK)
```json
[
  {
    "id": 1,
    "job_url": "https://linkedin.com/jobs/123456789",
    "job_title": "Senior Full Stack Developer",
    "job_description": "We are looking for a senior full stack developer...",
    "location": "San Francisco, CA",
    "seniority_level": "Senior",
    "employment_type": "Full-time",
    "company_id": 1,
    "opportunity_user_id": 1,
    "cv_id": 2,
    "company": {
      "id": 1,
      "company_name": "Tech Innovations Inc"
    },
    "cv": {
      "id": 2,
      "title": "Senior Developer CV"
    }
  }
]
```

---

### PATCH /opportunity/update
Update opportunity information.

**Access**: Admin/Master  
**Content-Type**: `application/json`

#### Request Body
```json
{
  "id": 1,
  "updates": {
    "job_title": "Lead Full Stack Developer",
    "seniority_level": "Lead",
    "location": "San Francisco, CA (Remote)"
  }
}
```

#### Response (200 OK)
```json
{
  "id": 1,
  "job_url": "https://linkedin.com/jobs/123456789",
  "job_title": "Lead Full Stack Developer",
  "job_description": "We are looking for a senior full stack developer...",
  "location": "San Francisco, CA (Remote)",
  "seniority_level": "Lead",
  "employment_type": "Full-time",
  "company_id": 1,
  "opportunity_user_id": 1,
  "cv_id": 2,
  "updated_at": "2025-01-01T12:00:00.000Z"
}
```

---

### DELETE /opportunity/delete
Delete a job opportunity.

**Access**: Admin/Master  
**Content-Type**: `application/json`

#### Request Body
```json
{
  "id": 1,
  "deleteRelated": false
}
```

#### Response (204 No Content)
```json
{
  "success": true,
  "message": "Opportunity deleted successfully",
  "deleted_id": 1
}
```

---

## Cover Letter Management (Protected Routes)

### POST /cover-letter/create
Create a new cover letter.

**Access**: Admin/Master  
**Content-Type**: `application/json`

#### Request Body
```json
{
  "type": "cover-letter",
  "subject": "Application for Senior Full Stack Developer Position",
  "body": "Dear Hiring Manager,\n\nI am writing to express my interest...",
  "opportunity_id": 1,
  "company_id": 1
}
```

#### Response (201 Created)
```json
{
  "id": 1,
  "from_id": 1,
  "type": "cover-letter",
  "subject": "Application for Senior Full Stack Developer Position",
  "body": "Dear Hiring Manager,\n\nI am writing to express my interest...",
  "opportunity_id": 1,
  "company_id": 1,
  "created_at": "2025-01-01T00:00:00.000Z",
  "updated_at": "2025-01-01T00:00:00.000Z"
}
```

---

### GET /cover-letter/search/:id
Search cover letters with filtering options. Use 'all' for all letters.

**Access**: Admin/Master  

#### Path Parameters
- `id`: Letter ID or 'all' to get all letters

#### Query Parameters
- `where[type]` (optional): Filter by letter type (default: "cover-letter")

#### Response (200 OK) - Single Letter
```json
{
  "id": 1,
  "from_id": 1,
  "type": "cover-letter",
  "subject": "Application for Senior Full Stack Developer Position",
  "body": "Dear Hiring Manager,\n\nI am writing to express my interest...",
  "opportunity_id": 1,
  "company_id": 1,
  "created_at": "2025-01-01T00:00:00.000Z",
  "updated_at": "2025-01-01T00:00:00.000Z"
}
```

#### Response (200 OK) - All Letters
```json
[
  {
    "id": 1,
    "from_id": 1,
    "type": "cover-letter",
    "subject": "Application for Senior Full Stack Developer Position",
    "body": "Dear Hiring Manager,\n\nI am writing to express my interest...",
    "opportunity_id": 1,
    "company_id": 1,
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z"
  }
]
```

---

### PATCH /cover-letter/update/:id
Update cover letter information.

**Access**: Admin/Master  
**Content-Type**: `application/json`

#### Path Parameters
- `id`: The ID of the cover letter

#### Request Body
```json
{
  "subject": "Updated Application for Senior Full Stack Developer Position",
  "body": "Dear Hiring Manager,\n\nI am writing to express my strong interest..."
}
```

#### Response (200 OK)
```json
{
  "id": 1,
  "from_id": 1,
  "type": "cover-letter",
  "subject": "Updated Application for Senior Full Stack Developer Position",
  "body": "Dear Hiring Manager,\n\nI am writing to express my strong interest...",
  "opportunity_id": 1,
  "company_id": 1,
  "updated_at": "2025-01-01T12:00:00.000Z"
}
```

---

### DELETE /cover-letter/delete/:id
Delete a cover letter.

**Access**: Admin/Master  

#### Path Parameters
- `id`: The ID of the cover letter

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Cover letter deleted successfully",
  "deleted_id": 1
}
```

---

## User Management (Protected Routes)

### PATCH /user/update
Update user profile information.

**Access**: Admin/Master  
**Content-Type**: `application/json`

#### Request Body
```json
{
  "first_name": "John",
  "last_name": "Smith",
  "email": "john.smith@example.com",
  "bio": "Experienced software developer and team leader"
}
```

#### Response (200 OK)
```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Smith",
  "email": "john.smith@example.com",
  "bio": "Experienced software developer and team leader",
  "role": "admin",
  "updated_at": "2025-01-01T12:00:00.000Z"
}
```

---

### GET /user/languages
Get user's language skills.

**Access**: Admin/Master  

#### Response (200 OK)
```json
[
  {
    "id": 1,
    "user_id": 1,
    "language": "English",
    "proficiency": "Native",
    "level": 100,
    "locale": "en"
  },
  {
    "id": 2,
    "user_id": 1,
    "language": "Spanish",
    "proficiency": "Advanced",
    "level": 90,
    "locale": "es"
  }
]
```

---

### GET /user/educations
Get user's education records.

**Access**: Admin/Master  

#### Response (200 OK)
```json
[
  {
    "id": 1,
    "user_id": 1,
    "institution": "University of Technology",
    "degree": "Bachelor of Science",
    "field_of_study": "Computer Science",
    "start_date": "2018-09-01",
    "end_date": "2022-06-15",
    "grade": "3.8 GPA",
    "description": "Specialized in software engineering and web development",
    "language_set": "en"
  }
]
```

---

### GET /user/master-cv
Get master user's primary CV.

**Access**: Public  

#### Response (200 OK)
```json
{
  "id": 1,
  "user_id": 1,
  "title": "Software Developer CV",
  "job_title": "Senior Software Developer",
  "summary": "Experienced software developer with expertise in full-stack development",
  "contact_info": {
    "email": "user@example.com",
    "phone": "+1234567890",
    "location": "San Francisco, CA"
  },
  "language_set": "en",
  "is_master": true,
  "is_favorite": true,
  "cv_skills": [],
  "cv_experiences": [],
  "cv_educations": [],
  "cv_languages": []
}
```

---

### GET /user/cvs
Get user's CVs with filtering options.

**Access**: Admin/Master  

#### Query Parameters
- `language_set` (optional): Filter by language set
- `is_favorite` (optional): Filter by favorite status ("true" or "false")

#### Response (200 OK)
```json
[
  {
    "id": 1,
    "user_id": 1,
    "title": "Software Developer CV",
    "job_title": "Senior Software Developer",
    "summary": "Experienced software developer with expertise in full-stack development",
    "language_set": "en",
    "is_master": true,
    "is_favorite": true,
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z"
  }
]
```

---

## General Routes

### POST /virtual-browser/linkedin/job-infos
Extract job information from LinkedIn URLs.

**Access**: Admin/Master  
**Content-Type**: `application/json`

#### Request Body
```json
{
  "jobURL": "https://www.linkedin.com/jobs/view/123456789"
}
```

#### Response (200 OK)
```json
{
  "jobCompany": "Tech Innovations Inc",
  "jobTitle": "Senior Full Stack Developer",
  "jobDescription": "We are looking for a senior full stack developer with experience in React, Node.js, and cloud technologies...",
  "jobLocation": "San Francisco, CA",
  "jobSeniority": "Senior level",
  "jobEmploymentType": "Full-time"
}
```

#### Response (400 Bad Request)
```json
{
  "message": "Job URL is required",
  "code": "JOB_URL_REQUIRED",
  "status": 400
}
```

---

### GET /health
Service health status and diagnostics.

**Access**: Public  

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Server is running"
}
```

---

## Socket-based AI Routes (Event Endpoints)

These are Socket.IO event endpoints, not HTTP REST endpoints. They are used for real-time communication with the AI services.

### /ai/generate-cv-summary
Generate AI-powered CV summaries based on job requirements.

**Type**: Socket Event  
**Access**: Authenticated Socket Connection

#### Event Data
```json
{
  "aiThreadID": "thread_abc123",
  "jobDescription": "Senior Full Stack Developer position requiring React, Node.js...",
  "additionalMessage": "Focus on leadership experience"
}
```

#### Response Event
```json
{
  "success": true,
  "output": "Generated CV summary tailored to the job requirements..."
}
```

---

### /ai/generate-letter
Generate AI-powered cover letters for specific opportunities.

**Type**: Socket Event  
**Access**: Authenticated Socket Connection

#### Event Data
```json
{
  "aiThreadID": "thread_abc123",
  "currentLetter": "Dear Hiring Manager...",
  "jobDescription": "Senior Full Stack Developer position...",
  "additionalMessage": "Emphasize experience with React and team leadership"
}
```

#### Response Event
```json
{
  "success": true,
  "output": "Generated cover letter content..."
}
```

---

### /ai/assistant-generate
Generate AI responses for general assistant functionality.

**Type**: Socket Event  
**Access**: Authenticated Socket Connection

#### Event Data
```json
{
  "input": "Tell me about your experience with React development",
  "threadID": "thread_abc123"
}
```

#### Response Event
```json
{
  "success": true,
  "threadID": "thread_abc123",
  "output": "I have extensive experience with React development..."
}
```

---

## Common Error Responses

### 400 Bad Request
```json
{
  "message": "Invalid request data",
  "code": "INVALID_REQUEST",
  "status": 400
}
```

### 401 Unauthorized
```json
{
  "message": "User not authenticated",
  "code": "USER_NOT_AUTHENTICATED",
  "status": 401
}
```

### 403 Forbidden
```json
{
  "message": "Insufficient permissions",
  "code": "INSUFFICIENT_PERMISSIONS",
  "status": 403
}
```

### 404 Not Found
```json
{
  "message": "Resource not found",
  "code": "RESOURCE_NOT_FOUND",
  "status": 404
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error",
  "code": "INTERNAL_SERVER_ERROR",
  "status": 500
}
```

---

## Rate Limiting

The API implements rate limiting to prevent abuse:
- **Public endpoints**: 100 requests per 15 minutes per IP
- **Authenticated endpoints**: 1000 requests per 15 minutes per user
- **AI generation endpoints**: 10 requests per minute per user

---

## Pagination

For endpoints that return lists of items, pagination is available:

#### Query Parameters
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

#### Response Format
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```
