import {sequelize} from './database.js';

const fetchJobs = async () => {
    const [result, metadata] = await sequelize.query(`SELECT * from job;`);
    return result;
}

const fetchJobById = async (job_id) => {
    const [result, metadata] = await sequelize.query(`SELECT * from job where job_id = ${job_id};`);
    return result[0];
}

const fetchInstructionsAndRequirements = async (instructionsAndRequirementsId) => {
    const [result, metadata] = await sequelize.query(`SELECT * from instructionsAndRequirements where instructionsAndRequirementsId = ${instructionsAndRequirementsId};`);
    return result[0];
}

const fetchThingsToRemember = async (thingsToRememberId) => {
    const [result, metadata] = await sequelize.query(`SELECT * from thingsToRemember where thingsToRememberId = ${thingsToRememberId};`);
    return result[0];
}

const fetchSlotsForJob = async (job_id) => {
    const [result, metadata] = await sequelize.query(`SELECT * from slot where job_id = ${job_id};`);
    return result;
}

const fetchRolesForJob = async (job_id) => {
    const [result, metadata] = await sequelize.query(`SELECT * from roles where job_id = ${job_id};`);
    return result;
}

const fetchCity = async (location_id) => {
    const [result, metadata] = await sequelize.query(`SELECT location_name from location_city where location_id = ${location_id};`);
    return result[0];
}



function executeQuery(query, values) {
  return new Promise((resolve, reject) => {
    sequelize.query(query, values, (error, results, fields) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(results);
    });
  });
}

export const resolvers = {

  Mutation:{
    createUser: async (_, { input }) => {
      try {
        // Extract fields from input
        let { firstName, lastName, email, password, phone, portfolioUrl, imageFile, resumeFile, 
        instructionalDesigner, softwareEngineer, softwareQualityEngineer, 
        jobUpdates, referralName, 
        percentage, yearOfPassing, qualification, stream, college, otherCollege, collegeLocation, 
        applicantType, yearsOfExperience, currentCTC, expectedCTC,
        experiencedTech, familiarTech, otherExperiencedTech, otherFamiliarTech, 
        onNoticePeriod, noticePeriodEnd, noticePeriodLength, appearedForTests, testNames } = input;

        // console.log(email);

        // Begin a transaction
        // await executeQuery('START TRANSACTION');

        // Insert user data into the users table
        // console.log(email);

        //CONVERT EMAIL AND PASSWORD TO STRING
        // email = email.toString();
        // password = password.toString();

        // console.log(email);
        // const [result1, metadata1] = await sequelize.query(`SELECT * from job;`);
        //  console.log(result1); 

         const [result, metadata] = await sequelize.query(`INSERT INTO users (email, password) VALUES ("${email}", "${password}") `);


        // const [result, metadata] = await sequelize.query(`INSERT INTO users (email, password) VALUES ("j.com", "password123") `);
        // const userInsertResult = await executeQuery('INSERT INTO users (email, password) VALUES (?, ?)', [email, password]);
        // const userId = userInsertResult.insertId;
        // console.log(userId);



        // Insert other related data into respective tables
        // Insert userassets
        // await executeQuery('INSERT INTO userassets (resume, profile_photo) VALUES (?, ?)', [resumeFile, imageFile]);



        // Insert other tables' data and handle relationships as needed

        // Commit the transaction
        // await executeQuery('COMMIT');

        // Return the newly created user
        return {
          user_id: userId,
          firstName,
          lastName,
          email,
          password,
          phone,
          portfolioUrl,
          // Include other fields as needed
        };
      }

      catch (error) {
        // Rollback the transaction if an error occurs
        // await executeQuery('ROLLBACK');
        // console.error('Error creating user:', error);
        // throw new Error('Failed to create user');
      }
    }
  },



    Query: {
        jobs: async (_, __, { dataSources }) => {
        
          // Implement logic to fetch jobs from the database
          const jobs = await fetchJobs();
          return jobs;
        },
        jobById: async (_, { job_id }, { dataSources }) => {
          // Implement logic to fetch a job by ID from the database
          const job = await fetchJobById(job_id);
          return job;
        },



        

      },
      Job: {
        instructionsAndRequirements: async (job, _, { dataSources }) => {
          // Implement logic to fetch instructions and requirements for a job
          const instructionsAndRequirements = await fetchInstructionsAndRequirements(job.instructionsAndRequirementsId);
          return instructionsAndRequirements;
        },
        thingsToRemember: async (job, _, { dataSources }) => {
          // Implement logic to fetch things to remember for a job
          const thingsToRemember = await fetchThingsToRemember(job.thingsToRememberId);
          return thingsToRemember;
        },
        slots: async (job, _, { dataSources }) => {
          // Implement logic to fetch slots for a job
          const slots = await fetchSlotsForJob(job.job_id);
          return slots;
        },
        roles: async (job, _, { dataSources }) => {
          // Implement logic to fetch roles for a job
          const roles = await fetchRolesForJob(job.job_id);
          return roles;
        },

        location_city: async (job, _, { dataSources }) => {
          // Implement logic to fetch location city for a job
          const location_city = await fetchCity(job.location_id);
          return location_city;
        }

      },



};
