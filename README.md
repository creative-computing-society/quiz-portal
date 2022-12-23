# Quiz Portal

Quiz portal made to conduct recruitment test for Creative Computing Society. The Portal can be used to conduct tests in various shifts, with unique questions from a question bank being assigned to students from each shift. Camera and Microphone permissions are required to give the test. The portal also has cheat detection methods like switching windows, tabs, fullscreen, etc.

A tutorial video for the portal has been uploaded on youtube - https://www.youtube.com/watch?v=NTH6LncgPzA&ab_channel=CCSTIET

![image](https://user-images.githubusercontent.com/45175270/209334209-5b3e4292-8901-4538-bd6f-e48de23976a3.png)

## Tech Stack

**Client:** ReactJS

**Server:** NodeJS, ExpressJS

**Database:** MongoDB

## Run Locally

*To run this project, you need to install NodeJS on your machine.*

Clone the project

```bash
  git clone https://github.com/creative-computing-society/quiz-portal
```

Go to the project directory

```bash
  cd quiz-portal
```

**You need to run backend and frontend separately**

Backend

(Add config.env file in the backend directory containing *PORT*, *DATABASE*, *DATABASE_PASSWORD*, *ADMIN_PASSWORD*, *JWT_SECRET*, *JWT_EXPIRES_IN*, *JWT_COOKIE_EXPIRES_IN*)

```bash
  cd backend
  npm i --force
  npm start
```

Frontend

```bash
  cd frontend
  npm i --force
  npm start
```

## Endpoints

- / - Landing page
- signup/ - Register for the test
- login/ - Login to portal
- instructions/ - Instructions and Countdown to test time

## Team

- [Aditya Parmar](https://github.com/adityaParmar9813)
- [Harsiddak Singh Bedi](https://github.com/Aitchessbee)
- [Tijil Malhotra](https://github.com/TijilM)
- [Sanya Mahajan](https://github.com/sanya-mahajan)
- [Vaniya Tripathi](https://github.com/VaniyaTripathi)
