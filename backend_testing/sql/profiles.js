// correct credential
const profile1 = {
    host: 'database-1.chrcwgi8wrbt.us-east-1.rds.amazonaws.com',
    user: 'cis557',
    password:  'cis557+mysql', 
    database:   'game_test', 
}

// credentials for exceptions
const profile2 = {
    host: 'database-1.chrcwgi8wrbt.us-east-1.rds.amazonaws.com',
    user: 'cis557_error',
    password:  'cis557_error+2021', 
    database:   'test_schema',
}

module.exports = {
    profile1, profile2,
  };