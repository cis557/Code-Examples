/**
 * This module contains authentication and session functions
 */

// import JWT
const jwt = require('jsonwebtoken');

// import the env variables
require('dotenv').config();

// import DB function
const { getStudentByName } = require('../DbOperations');


/**
 * Create a JWT containing the username
 * @param {*} userid 
 * @returns the token
 */
const authenticateUser = (userid) => {

    try{
        const token = jwt.sign({username: userid}, process.env.KEY, {expiresIn: '120s'});
        console.log('token', token);
        return token;
    }catch(err){
        console.log('error', err.message);

    }
}

/**
 * Verify a token. Check if the user is valid
 * @param {*} token 
 * @returns true if the user is valid
 */
const verifyUser = async (token) =>{
    try{
        // decoded contains the paylod of the token
        const decoded = jwt.verify(token, process.env.KEY);
        console.log('payload', decoded);
        // check that the payload contains a valid user
        const user = await getStudentByName(decoded.username);
        if(!user){
            // user is undefined
            return false;
        }
        return true;
    }catch(err){
        // invalid token
        console.log('error', err.message);
        return false;
        
    }
}
/** 
const main = () =>{
    const token = authenticateUser('cis3500');
    verifyUser(token);
}
main();
*/

module.exports = { authenticateUser, verifyUser }