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
  const [result, metadata] = await sequelize.query(`
      SELECT slots.slot_id, slots.from_time, slots.to_time, slots.created, slots.modified
      FROM slots_in_job
      JOIN slots ON slots_in_job.slot_id = slots.slot_id
      WHERE slots_in_job.job_id = ${job_id};
  `);
  return result;
};


const fetchRolesForJob = async (job_id) => {
    const [result, metadata] = await sequelize.query(`
      SELECT role_desc.*, roles.role_name
      FROM role_desc
      JOIN roles ON role_desc.role_id = roles.role_id
      WHERE role_desc.job_id = ${job_id};
    `);
    return result;
}

const fetchCity = async (location_id) => {
    const [result, metadata] = await sequelize.query(`SELECT location_name from location_city where location_id = ${location_id};`);
    return result[0];
}

async function executeExperiencedTechQuery(user_id, arg){
      await sequelize.query(
        `INSERT INTO experienced_tech (user_id, tech_id)
        VALUES ("${user_id}", (SELECT tech_id FROM tech WHERE tech_name = "${experiencedTech[i]}"))`
        , { transaction: t });
}


// function executeExperiencedTechQuery(query, values) {
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
        const { firstName, lastName, email, password, phone, portfolioUrl, imageFile, resumeFile, 
          instructionalDesigner, softwareEngineer, softwareQualityEngineer, 
          jobUpdates, referralName, 
          percentage, yearOfPassing, qualification, stream, college, otherCollege, collegeLocation, 
          applicantType, yearsOfExperience, currentCTC, expectedCTC,
          experiencedTech, familiarTech, otherExperiencedTech, otherFamiliarTech, 
          onNoticePeriod, noticePeriodEnd, noticePeriodLength, appearedForTests, testNames } = input;
          
          let user_id,userassets_id,edqualification_id,proqualification_id, userDetails_id;



        // Begin a transaction
        // await executeExperiencedTechQuery('START TRANSACTION');


// const preferredJobUser = `
//         `;

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


const proQualificationQuery = `
  INSERT INTO proqualification (applicationtype_id, exp_year, current_ctc, expected_ctc, currently_on_notice_period, notice_end, notice_period_length, appeared_zeus_test, zeus_test_role)
  VALUES ((SELECT applicationtype_id FROM applicationtype WHERE applicationtype_name = "${applicantType}"), ${yearsOfExperience}, ${currentCTC}, ${expectedCTC}, ${onNoticePeriod === 'Yes' ? true : false}, ${noticePeriodEnd ? `"${noticePeriodEnd}"` : null}, ${noticePeriodLength}, ${appearedForTests === 'Yes' ? true : false}, "${testNames}")
`;


// const experiencedTechsQuery = `

// `;


// const userDetailsQuery = `
//   INSERT INTO userdetails (first_name, last_name, phone_no, portfolio_url, referal_emp_name, send_me_update, familiartechs_others, experttechs_others, user_id, userassets_id, edqualification_id, proqualification_id)
//   VALUES ("${firstName}", "${lastName}", "${phone}", "${portfolioUrl}", "${referralName}", ${jobUpdates === 'Yes' ? true : false}, "${otherFamiliarTech}", "${otherExperiencedTech}", "${user_id}", "${userassets_id_id}", "${edqualification_id}", "${proqualification_id}" )
// `;


await sequelize.transaction(async (t) => {
  // console.log(experiencedTech);

  // user_id=1;

  [user_id]=await sequelize.query(userQuery, { transaction: t });
  // [userassets_id]=await sequelize.query(userAssetsQuery, { transaction: t });
  // [edqualification_id]=await sequelize.query(edQualificationQuery, { transaction: t });
  // [proqualification_id]=await sequelize.query(proQualificationQuery, { transaction: t });

    
  for(const tech of experiencedTech){
    const [result, metadata] = await sequelize.query(`SELECT tech_id from techs where tech_name = "${tech}"`);
    await sequelize.query(
      `INSERT INTO experienced_tech (user_id, tech_id)
      VALUES ("${user_id}", ${result[0].tech_id})`
      , { transaction: t });
  }

    // await sequelize.query(preferredJobUser, { transaction: t });

  // [userDetails_id]=await sequelize.query(userDetailsQuery, { transaction: t });

});
        // Commit the transaction
        // await executeExperiencedTechQuery('COMMIT');
        return {
          user_id: user_id,
          firstName,
          lastName,
          email,
          password,
          phone,
          portfolioUrl,
        };
      }

      catch (error) {
        // Rollback the transaction if an error occurs
        // await executeExperiencedTechQuery('ROLLBACK');
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
