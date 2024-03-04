// import { AuthenticationError } from '@apollo/server';
import { AuthenticationError } from 'apollo-server-errors';
import jwt from 'jsonwebtoken';

// Secret key used to sign JWT tokens
const JWT_SECRET = process.env.JWT_SECRET;

// Function to verify JWT token
const verifyToken = (token) => {
  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new AuthenticationError('Invalid token');
  }
};

// Context function
const createContext = ({ req }) => {
  // Get the authorization header from the request
  const authorization = req.headers['authorization'];

//   console.log('authorization', authorization);

  // Check if the authorization header is present
  if (!authorization) {
    return {};
  }

  try {
    // Extract the token from the authorization header
    const token = authorization.split(' ')[1];
    
    // Verify the token
    const decodedToken = verifyToken(token);

    // Return the decoded token along with other necessary data
    return {
      user: decodedToken, // You can customize this based on your token structure
    };
  } catch (error) {
    // If there's an error, return an empty context
    return {};
  }
};

export default createContext;
