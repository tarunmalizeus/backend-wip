export const typeDefs = `#graphql






type InstructionsAndRequirements {
    instructionsAndRequirementsId: Int!
    generalInstructions: String!
    instructionsForTheExam: String!
    minSystemRequirements: String!
    processText: String!
    created: String!
    modified: String!
  }

  type ThingsToRemember {
    thingsToRememberId: Int!
    thingsToRemember: String!
    created: String!
    modified: String!
  }

  type Slot {
    slotId: Int!
    fromt_time: String!
    to_time: String!
    created: String!
    modified: String!
  }

  type Job {
    job_id: Int!
    name: String!
    from_time: String!
    to_time: String!
    location_id: Int!
    internship: String!
    instructionsAndRequirements: InstructionsAndRequirements!
    thingsToRemember: ThingsToRemember!
    slots: [Slot!]!
    roles: [Role!]!
  }

  type Role {
    role_id: Int!
    role_name: String!
    created: String!
    modified: String!
  }

  type RoleDesc {
    job_id: Int!
    role_id: Int!
    packageRupees: Float!
    description: String!
    requirements: String!
    created: String!
    modified: String!
  }

  # Define queries
  type Query {
    jobs: [Job!]!
    jobById(job_id: Int!): Job
  }
`;