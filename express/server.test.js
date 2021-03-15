let webapp = require("./server");
const request = require('supertest');


describe('Test root endpoint', () => {
    test('root endpoint response type and content', () => {
    
        return request(webapp).get('/').expect(200).then(response => {
            expect(JSON.stringify(response.text)).toMatch(/Welcome to our first REST API implementation/)});
    });
});

describe('Test  /students endpoint', () => {
    test('/students endpoint response number of rows & status code', () => {
        return request(webapp).get('/students').expect(200).then(response => {
            expect(JSON.parse(response.text).data.length).toBe(8);
        });
    });

    test('/students endpoint response content', () => {
        const expectedResponse = [{"id":4,"name":"Makeba","email":"makeba@upenn.edu","major":"Biology"},
        {"id":1,"name":"Ida Mae","email":"ida@cis.upenn.edu","major":"Computer Science"},
        {"id":3,"name":"Stokely","email":"sto@upenn.edu","major":"History"},
        {"id":8,"name":"George Starling","email":"gstarling@upenn.edu","major":"History"}];
        return request(webapp).get('/students').expect(200).then(response => {
            expect(JSON.parse(response.text).data).toEqual(expect.arrayContaining(expectedResponse));
        });
    });
});

describe('Test /student endpoint', () => {
    test('create student error: missing body data (major)', () => {  
        return request(webapp).post('/student').send('name=testuser&email=tt@upenn.edu')
        .expect(400).then(response => {
            expect(JSON.stringify(response.text)).toMatch(/missing name or email or major/);
        });
    });
    test('create student: response', () => {
        return request(webapp).post('/student').send('name=testuser&email=tt@upenn.edu&major=MCIT')
        .expect(201).then(response => {
            expect(JSON.parse(response.text).message).toMatch(/success/);
        });
    });
  
    test('get student: response', () => {
        const expected = {"id":2,"name":"Maya A","email":"maya@upenn.edu","major":"Math"};
        return request(webapp).get('/student/2').expect(200).then(response => {
            expect(JSON.parse(response.text).data).toEqual(expected);
        });  
    });

    // Lecture activity
    test('delete student', () => {
        
    
    });
    
    test('update student', () => {
        
    
    });
});

