import {sequelize} from './database.js';


const fetchColleges = async () => {
    const [result, metadata] = await sequelize.query(`SELECT * from college;`);
    return result;
}

const fetchQualifications = async () => {
    const [result, metadata] = await sequelize.query(`SELECT * from qualification;`);
    return result;
}

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



// function executeQuery(query, values) {
//   return new Promise((resolve, reject) => {
//     sequelize.query(query, values, (error, results, fields) => {
//       if (error) {
//         reject(error);
//         return;
//       }
//       resolve(results);
//     });
//   });
// }

export const resolvers = {

  Mutation:{
    createUser: async (_, { input }) => {
      const array = [];
      try {
        // Extract fields from input
        const { firstName, lastName, email, password, phone, portfolioUrl, imageFile, resumeFile, 
          instructionalDesigner, softwareEngineer, softwareQualityEngineer, 
          jobUpdates, referralName, 
          percentage, yearOfPassing, qualification, stream, college, otherCollege, collegeLocation, 
          applicantType, yearsOfExperience, currentCTC, expectedCTC,
          experiencedTech, familiarTech, otherExperiencedTech, otherFamiliarTech, 
          onNoticePeriod, noticePeriodEnd, noticePeriodLength, appearedForTests, testNames } = input;
          
          let user_id,userassets_id,edqualification_id,proqualification_id, userDetails_id;
          

        // console.log(email);

        // Begin a transaction
        // await executeQuery('START TRANSACTION');


// Insert user data into the users table

const preferredJobUser = `
        `;

const userQuery = `
  INSERT INTO users (email, password)
  VALUES ("${email}", "${password}")
`;

const userAssetsQuery = `
  INSERT INTO userassets (resume, profile_photo)
  VALUES ("${resumeFile}", "${imageFile}")
`;


const edQualificationQuery = `
  INSERT INTO edqualification (percentage, passing_year, qualification_id, stream_id, college_id, other_college_name)
  VALUES (${percentage}, ${yearOfPassing}, (SELECT qualification_id FROM qualification WHERE qualification_name = "${qualification}"), (SELECT stream_id FROM stream_branch WHERE stream_name = "${stream}"), (SELECT college_id FROM college WHERE college_name = "${college}"), "${otherCollege}")
`;

// Insert user professional qualification data into the proqualification table
const proQualificationQuery = `
  INSERT INTO proqualification (applicationtype_id, exp_year, current_ctc, expected_ctc, currently_on_notice_period, notice_end, notice_period_length, appeared_zeus_test, zeus_test_role)
  VALUES ((SELECT applicationtype_id FROM applicationtype WHERE applicationtype_name = "${applicantType}"), ${yearsOfExperience}, ${currentCTC}, ${expectedCTC}, ${onNoticePeriod === 'Yes' ? true : false}, ${noticePeriodEnd ? `"${noticePeriodEnd}"` : null}, ${noticePeriodLength}, ${appearedForTests === 'Yes' ? true : false}, "${testNames}")
`;

// // Insert user details into the userdetails table
// const userDetailsQuery = `
//   INSERT INTO userdetails (first_name, last_name, phone_no, portfolio_url, referal_emp_name, send_me_update, familiartechs_others, experttechs_others, user_id, userassets_id, edqualification_id, proqualification_id)
//   VALUES ("${firstName}", "${lastName}", "${phone}", "${portfolioUrl}", "${referralName}", ${jobUpdates === 'Yes' ? true : false}, "${familiarTech.join(', ')}", "${experiencedTech.join(', ')}", LAST_INSERT_ID(), LAST_INSERT_ID(), LAST_INSERT_ID(), LAST_INSERT_ID())
// `;


// const queries = [];
// const queries = [userQuery ,userAssetsQuery];
// const queries = [userQuery, userAssetsQuery, edQualificationQuery, proQualificationQuery, userDetailsQuery];

// Execute the transaction

await sequelize.transaction(async (t) => {
  [user_id]=await sequelize.query(userQuery, { transaction: t });
  await sequelize.query(preferredJobUser, { transaction: t });
  // [userassets_id]=await sequelize.query(userAssetsQuery, { transaction: t });
  // [edqualification_id]=await sequelize.query(edQualificationQuery, { transaction: t });
  [proqualification_id]=await sequelize.query(proQualificationQuery, { transaction: t });
  // [userDetails_id]=await sequelize.query(userDetailsQuery, { transaction: t });

});



        //  const [user_id, metadata] = await sequelize.query(`INSERT INTO users (email, password) VALUES ("${email}", "${password}") `);


        // Insert other related data into respective tables
        // Insert userassets
        // await executeQuery('INSERT INTO userassets (resume, profile_photo) VALUES (?, ?)', [resumeFile, imageFile]); 




        // Commit the transaction
        // await executeQuery('COMMIT');

        return {
          user_id: user_id,
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


        qualifications: async (_, __, { dataSources }) => {
          // Implement logic to fetch qualifications from the database
          const qualifications = await fetchQualifications();
          return qualifications;
        },
        
        colleges: async (_, __, { dataSources }) => {
          // Implement logic to fetch colleges from the database
          const colleges = await fetchColleges();
          return colleges;
        },

        streams: async (_, __, { dataSources }) => {
          // Implement logic to fetch streams from the database
          const [result, metadata] = await sequelize.query(`SELECT * from stream_branch;`);
          return result;
        }

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
