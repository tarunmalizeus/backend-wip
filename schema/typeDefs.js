export const typeDefs = `#graphql


scalar Upload


type User {
  user_id: Int
  email: String
  password: String
  created: String
  modified: String
  userassets: UserAssets
  edqualification: EdQualification
  proqualification: ProQualification
  userdetails: UserDetails
}

type UserAssets {
  userassets_id: Int
  resume: Upload
  profile_photo: Upload
  created: String
  modified: String
}

type EdQualification {
  edqualification_id: Int
  percentage: Float
  passing_year: Int
  qualification: Qualification
  stream_branch: StreamBranch
  college: College
  other_college_name: String
  created: String
  modified: String
}

type Qualification {
  qualification_id: Int
  qualification_name: String
  created: String
  modified: String
}

type StreamBranch {
  stream_id: Int
  stream_name: String
  created: String
  modified: String
}

type College {
  college_id: Int
  college_name: String
  location: LocationCity
  created: String
  modified: String
}

type LocationCity {
  location_id: Int
  location_name: String
  created: String
  modified: String
}

type ProQualification {
  proqualification_id: Int
  applicationtype: ApplicationType
  exp_year: Int
  current_ctc: Float
  expected_ctc: Float
  currently_on_notice_period: Boolean
  notice_end: String
  notice_period_length: Int
  appeared_zeus_test: Boolean
  zeus_test_role: String
  familiarTechs: [Tech]
  expertTechs: [Tech]
  created: String
  modified: String
}

type ApplicationType {
  applicationtype_id: Int
  applicationtype_name: String
  created: String
  modified: String
}

type Tech {
  tech_id: Int
  tech_name: String
  created: String
  modified: String
}

type UserDetails {
  userdetail_id: Int
  first_name: String
  last_name: String
  phone_no: String
  portfolio_url: String
  referal_emp_name: String
  send_me_update: Boolean
  familiarTechs: String
  expertTechs: String
  created: String
  modified: String
}




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
    location_city: LocationCity!
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
    users: [User]
    qualifications: [Qualification]
    colleges: [College]
    streams: [StreamBranch]
  }

  type Mutation {
    createUser(input: CreateUserInput!): User
  }
  
  input CreateUserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    phone: String!
    portfolioUrl: String
    imageFile: Upload
    resumeFile: Upload
    instructionalDesigner: Boolean
    softwareEngineer: Boolean
    softwareQualityEngineer: Boolean
    jobUpdates: Boolean
    referralName: String
    percentage: Float
    yearOfPassing: Int
    qualification: String
    stream: String
    college: String
    otherCollege: String
    collegeLocation: String
    applicantType: String
    yearsOfExperience: Int
    currentCTC: Float
    expectedCTC: Float
    experiencedTech: [String]
    familiarTech: [String]
    otherExperiencedTech: String
    otherFamiliarTech: String
    onNoticePeriod: String
    noticePeriodEnd: String
    noticePeriodLength: Int
    appearedForTests: String
    testNames: String
  }
  



`;