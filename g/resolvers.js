import {sequelize} from './database.js';

const fetchJobs = async () => {
    const [result, metadata] = await sequelize.query(`SELECT * from job;`);
    return result;
}

const fetchJobById = async (jobId) => {
    const [result, metadata] = await sequelize.query(`SELECT * from job where jobId = ${jobId};`);
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

const fetchSlotsForJob = async (jobId) => {
    const [result, metadata] = await sequelize.query(`SELECT * from slot where jobId = ${jobId};`);
    return result;
}

const fetchRolesForJob = async (jobId) => {
    const [result, metadata] = await sequelize.query(`SELECT * from role where jobId = ${jobId};`);
    return result;
}




export const resolvers = {

    Query: {
        jobs: async (_, __, { dataSources }) => {
        
          // Implement logic to fetch jobs from the database
          const jobs = await fetchJobs();
          return jobs;
        },
        jobById: async (_, { jobId }, { dataSources }) => {
          // Implement logic to fetch a job by ID from the database
          const job = await fetchJobById(jobId);
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
          const slots = await fetchSlotsForJob(job.jobId);
          return slots;
        },
        roles: async (job, _, { dataSources }) => {
          // Implement logic to fetch roles for a job
          const roles = await fetchRolesForJob(job.jobId);
          return roles;
        },
      },



};
