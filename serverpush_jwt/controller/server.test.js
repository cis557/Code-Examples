let webapp = require("./server");
const request = require('supertest');

const jwt = require('jsonwebtoken');
const testToken = jwt.sign({
    name: 'testuser',
  }, 'this_is_a_secret', { expiresIn: '1h' });


describe('Test root endpoint', () => {
    test('root endpoint response type and content', () => {
    
        return request(webapp).get('/').expect(200).then(response => {
            expect(JSON.stringify(response.text)).toMatch(/Welcome to our chat app/)});
    });
});

describe('Test  /login and /users endpoints', () => {
    const responseLogin = { user: 'testuser', token: testToken }
    test('/login endpoint response & status code', () => {
    
        return request(webapp).post('/login').send('username=testuser')
        .expect(200).then(response => {
            expect(JSON.parse(response.text)).toStrictEqual(responseLogin);
        });
    });

    test('/users endpoint response & status code', () => {
        return request(webapp).get('/users').expect(200).then(response => {
            expect(JSON.parse(response.text).data).toStrictEqual(['testuser']);
        });
    });
});

describe('Test message endpoint', () => {
    test('message endpoint missing body data', () => {
    
        return request(webapp).post('/message').send('to=testuser')
        .expect(400).then(response => {
            expect(JSON.stringify(response.text)).toMatch(/missing to or from or message/);
        });
    });

    // Lecture activity
    test('message endpoint: reception response', () => {
    
    });

    test('message endpoint: anauthorized user', () => {
    
    });
});

