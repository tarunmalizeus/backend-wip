import {sequelize} from './database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createError } from 'apollo-errors';

export const ApplicationAlreadyExist = createError('ApplicationAlreadyExist', {
  message: 'You have already applied for this job.'
});


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


export const resolvers = {

  Mutation:{

    createApplication : async (_, { input }) => {
        const { job_id, preference, user_id, slot, resumeFile}=input;
        const [result, metadata] = await sequelize.query(`SELECT * from application where user_id = ${user_id} and job_id = ${job_id}`);
        if(result.length === 0){
          let resume_id, application_id, slot_id;
          await sequelize.transaction(async (t) => {
            [resume_id]=await sequelize.query(
              `INSERT INTO resume_for_job (resume)
              VALUES ("${resumeFile}")`
              , { transaction: t });

              [slot_id] = await sequelize.query(
                `SELECT slot_id FROM slots WHERE TIME(from_time) = TIME(:slotFromTime) AND TIME(to_time) = TIME(:slotToTime)`,
                { replacements: { slotFromTime: slot.split('-')[0], slotToTime: slot.split('-')[1] }, transaction: t }
            );
                 
            [application_id]=await sequelize.query(
              `INSERT INTO application (user_id, job_id, slot_id, resume_id)
              VALUES (${user_id}, ${job_id}, ${slot_id[0].slot_id}, ${resume_id})`
              , { transaction: t });

            for(const role of preference){
              const [result, metadata] = await sequelize.query(`SELECT role_id from roles where role_name = "${role}"`);
              await sequelize.query(
                `INSERT INTO application_role (application_id, role_id)
                VALUES (${application_id}, ${result[0].role_id})`
                , { transaction: t });
            }

          });
            return {
              application_id: application_id,
              //hardcoded, discuss its logic
              venu_id: 1,
              exact_date: "2021-07-01",
              job_id:`${job_id}`,
              slot_id: `${slot_id[0].slot_id}`,
            };
        }
        else{
          throw new ApplicationAlreadyExist();
          // https://www.npmjs.com/package/apollo-errors
          //unsucessfull
          // throw new ApplicationAlreadyExist({
          //   data: {
          //     something: 'important'
          //   },
          //   internalData: {
          //     error: `The SQL server died.`
          //   }
          // });

        }
    },

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
          
          let user_id,userassets_id,edqualification_id,proqualification_id;


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


await sequelize.transaction(async (t) => {

  [user_id]=await sequelize.query(userQuery, { transaction: t });
  [userassets_id]=await sequelize.query(userAssetsQuery, { transaction: t });
  [edqualification_id]=await sequelize.query(edQualificationQuery, { transaction: t });
  [proqualification_id]=await sequelize.query(proQualificationQuery, { transaction: t });


  for(const tech of experiencedTech){
    const [result, metadata] = await sequelize.query(`SELECT tech_id from techs where tech_name = "${tech}"`);
    await sequelize.query(
      `INSERT INTO experienced_tech (user_id, tech_id)
      VALUES ("${user_id}", ${result[0].tech_id})`
      , { transaction: t });
  }

  for(const tech of familiarTech){
    const [result, metadata] = await sequelize.query(`SELECT tech_id from techs where tech_name = "${tech}"`);
    await sequelize.query(
      `INSERT INTO familiar_tech (user_id, tech_id)
      VALUES ("${user_id}", ${result[0].tech_id})`
      , { transaction: t });
  }

  await sequelize.query(
   `
    INSERT INTO userdetails (first_name, last_name, phone_no, portfolio_url, referal_emp_name, send_me_update, familiartechs_others, experttechs_others, user_id, userassets_id, edqualification_id, proqualification_id)
    VALUES ("${firstName}", "${lastName}", "${phone}", "${portfolioUrl}", "${referralName}", ${jobUpdates === 'Yes' ? true : false}, "${otherFamiliarTech}", "${otherExperiencedTech}", "${user_id}", "${userassets_id}", "${edqualification_id}", "${proqualification_id}" )
  `
    , { transaction: t });

});
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
      }
    },

    login: async (_, { email, password }) => {
      const [result, metadata] = await sequelize.query(`SELECT * from users where email = "${email}" and password = "${password}";`);
      if(result.length === 0){
        return null;
      }
      return result[0];
    },
  },
  AuthData:{
    name: async (parent, args, context, info) => {
      const [result, metadata] = await sequelize.query(`SELECT first_name from userdetails where user_id = ${parent.user_id};`);
      return result[0].first_name;
    },
    token: async (parent, args, context, info) => {
      return jwt.sign({ userId: parent.user_id, email: parent.email }, 'somesupersecretkey', {
        expiresIn: '1h'
      });
    },
    tokenExpiration: async (parent, args, context, info) => {
      return 1;
    }
  },

    Query: {

        roleUnique : async (_, {job_id, role_id}, { dataSources }) => {
          const [result, metadata] = await sequelize.query(`SELECT * from role_desc where role_id=${role_id} and job_id=${job_id} ;`);
          return result[0];
        },

        jobs: async (_, __, { dataSources }) => {
          const jobs = await fetchJobs();
          return jobs;
        },
        jobById: async (_, { job_id }, { dataSources }) => {
          const job = await fetchJobById(job_id);
          return job;
        },


        qualifications: async (_, __, { dataSources }) => {
          const qualifications = await fetchQualifications();
          return qualifications;
        },
        
        colleges: async (_, __, { dataSources }) => {
          const colleges = await fetchColleges();
          return colleges;
        },

        streams: async (_, __, { dataSources }) => {
          const [result, metadata] = await sequelize.query(`SELECT * from stream_branch;`);
          return result;
        }

      },
      Job: {
        instructionsAndRequirements: async (job, _, { dataSources }) => {
          const [result, metadata] = await sequelize.query(`SELECT * from instructions_and_requirements where instructions_and_requirements_id = ${job.instructions_and_requirements_id};`);
          return result[0];
        },
        thingsToRemember: async (job, _, { dataSources }) => {
          const [result, metadata] = await sequelize.query(`SELECT * from things_to_remember where things_to_remember_id = ${job.things_to_remember_id};`);
          return result[0];
        },
        slots: async (job, _, { dataSources }) => {
          const slots = await fetchSlotsForJob(job.job_id);
          return slots;
        },
        roles: async (job, _, { dataSources }) => {
          const roles = await fetchRolesForJob(job.job_id);
          return roles;
        },

        location_city: async (job, _, { dataSources }) => {
          const location_city = await fetchCity(job.location_id);
          return location_city;
        }

      },





};
