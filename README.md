# EarthForge

EarthForge is a full-stack MEN application that allows users to store ,build, refine, and track sustainable ideas. The app demonstrates full CRUD functionality, authentication, session management, and deployment to a production environment.

##  Live Demo
https://lit-ravine-01554-a61c05b57e7a.herokuapp.com/login
## Technologies Used
- Node.js
- Express
- MongoDB
- Mongoose
- EJS
- Express Session
- bcrypt
- Method Override
- Heroku
- MongoDB Atlas

## Features
- User authentication with hashed passwords
- Session-based login and logout
- Create, read, update, and delete ideas
- Server-side rendering with EJS templates
- Protected routes for authenticated users
- Deployed to Heroku with environment variables

## Project Structure
- `server.js` handles server setup and middleware
- `models/` contains Mongoose schemas
- `routes/` manages application routing
- `views/` contains EJS templates
- `public/` holds static assets like CSS and images

## How to Run Locally
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
