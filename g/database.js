import { Sequelize } from 'sequelize';
import { config } from 'dotenv';
config({ path: './config.env' });

const sequelize = new Sequelize(


    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASSWORD, 
    {
        host: process.env.HOST,
        dialect: "mysql",
        port: "3306"
    }
);

// Test database connection
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection successful!');
    } catch (error) {
        console.error('Error connecting to database:', error);
    }
})();


export { sequelize };