/**
 * utility functions for testing
 */

/**
 * Adds a test student to the DB
 * @param {*} testData - the test data
 * @param {*} db - the database 
 * @returns the id of the data
 */
const insertTestDataToDB = async (db, testData) => {
    const result = await db.collection('students').insertOne(testData);
    return result.insertedId;
}
/**
 * 
 * @param {*} db 
 * @param {*} testData 
 * @returns 
 */
const deleteTestDataFromDB = async (db, testData) => {
    try {
      const result = await db.collection('students').deleteMany({ name: testData });
      const { deletedCount } = result;
      if (deletedCount === 1) {
        console.log('info', 'Successfully deleted test student');
      } else {
        console.log('warning', 'test student was not deleted');
      }
      } catch (err) {
        console.log('error', err.message);
      }
}

// test user
 // define the test user
 const testStudent = {
  name: 'teststudent',
  email: 'ttt@cis.upenn.edu',
  major: 'CIS'
};

/**
 * utility function to test if the id 
 * of the test student is in the response (array)
 * 
 * @param {*} arr 
 * @param {*} val 
 * @returns 
 */
const isInArray = (arr, val) =>{
  let value = false;
  arr.map((x) =>{
    if(String(x._id) === String(val)){
      value = true;
    }
  });
  return value;
}


// export the functions
module.exports = {
    insertTestDataToDB,
    deleteTestDataFromDB,
    testStudent,
    isInArray,
  };