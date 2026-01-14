# 🧪 Full-Stack Evaluator – Technical Exam

This repository contains my submission and solution for the Full-Stack Technical Evaluation. The project is a simple task manager.

---

## Technologies Used

### Backend

- .NET 9 Web API
- Entity Framework Core
- PostgreSQL
- Swagger docs
- JWT Authentication

### Frontend

- React + Axios
- Vite

## Implemented & Fixed Features
- Added the connection string in the appsettings.json
- Created DTOs to be used by the controllers
- Implemented JWT Auth
- Connected frontend and backend
- Added and completed the missing functions in the frontend like CRUD functionalities and etc.

## Testing and Running
### Backend setup
Update the connection string in 'appsettings.json' if needed:
```json
"ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=TaskManagerDb;Username=postgres;Password=yourPassword"
  }
```
Update the 'Issuer' and 'Audience' in  the 'appsettings.json' to match the url/port of the
backend and frontend if necessary:
```
  "Jwt": {
    "Key": "MySecretKeyForTestinInThisProjectPretendIts32Char",
    "Issuer": "http://localhost:5215",
    "Audience": "http://localhost:5173",
    "ExpiresInMinutes": 60
  }
```
Cloning and running the project
```bash
git clone https://github.com/Niijima-dev/Digiteer-Coding-Evaluation.git
cd full* or cd "repository name"
cd backend
dotnet restore
dotnet ef database update
dotnet run
```
### Frontend setup
```bash
cd frontend
npm install
```
then create a .env file in the frontend root:
```
VITE_API_BASE_URL=http://localhost:5215
//or modify based on what port does the web api run
```
then start the dev server and run the project
```bash
npm run dev
```

### Additional note on testing:
- When creating an account create it on the frontend 's UI as account created
  on Swagger will not have a valid token resulting in an Invalid Credential error.

# Sample Output:
<img width="600" height="400" alt="image" src="https://github.com/user-attachments/assets/030aa0ac-6853-4a8c-86b9-7edc5132f8a6" />
<img width="600" height="400" alt="image" src="https://github.com/user-attachments/assets/8bd2ace6-9426-4468-a34b-59610676d1f0" />

