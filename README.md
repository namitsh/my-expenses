# MY-EXPENSES
An application which tracks the expenses of a user for different accounts.

#### TECHNOLOGIES:
    - FRONTEND : POSTMAN(I'll upload swagger/postman collection)
    - BACKEND: NODEJS, EXPRESS
    - DATABASE: MONGODB

#### To Run it locally
    1. Create a .env file. Add the following variables
        -MONGO_DB_URI=<yourDbUri>
        -SALT=8/10
        -JWT_SECRET=<secret-key> 
        -NODE_ENV=production/development
        -PORT=<port>
    2. npm install or npm install --only=dev(for dev dependency)
    3. npm start or npm run dev

#### In Progress
    1. Code Coverage/Unit Testing
    2. Deployment using Docker. ----- DONE

*NOTE: This project would not run on local mongodb. Becasue it contains mongodb transactions which requires replica set. For free cluster you can create your account on https://www.mongodb.com/.*
