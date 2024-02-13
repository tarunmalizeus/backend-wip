// const express=require('express');
// const app=express();
// const {config}=require('dotenv');
// config({path:'./config.env'});
// const {Sequelize} = require('sequelize');

// const sequelize = new Sequelize("first_demo", "root", 'password', {
//     host: 'localhost',
//     dialect: "mysql",
//     port:"3306"
//   });



  
//   const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.USER, process.env.PASSWORD, {
//     host: process.env.HOST,
//     dialect: 'mysql',
//     port: process.env.PORT || 3306
//   });

const express = require('express');
const app = express();
var cors = require('cors')
const { config } = require('dotenv');
config({ path: './config.env' });
const sequelize = require('./database');
// const { Sequelize } = require('sequelize');

app.use(cors())
/////////////////////////////////////
app.use(express.json());

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

//////////////////////////////////

// app.use(express.json({extended:false}));
// // Middleware (Example)
app.use(express.json()); // For parsing JSON payloads



// Test database connection
sequelize.authenticate()
  .then(() => console.log('Database connected successfully.'))
  .catch((error) => console.error('Unable to connect to the database:', error));

// Sync models with the database
sequelize.sync()
  .then(() => console.log('Models synchronized with the database.'))
  .catch((error) => console.error('Error synchronizing models with the database:', error));




// Import Model Definitions (Place this where your models exist)
// const UserModel = require('./models/user'); // Example; adjust if your models are in a different location

// Routes (Create your API routes here)

// app.use('/Api/signup', require('./Api/signup'));


// app.get('/', (req, res) => {
//     res.send('Welcome to your Node.js and Sequelize API!');
// });

// app.get('/signin', (req, res) => {
//     res.send("sign in");
// });

app.use('/Api/job', require('./Api/job'));

// Error Handling Middleware (Place this at the end)
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something went wrong!');
// });

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

