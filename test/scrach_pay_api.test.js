var request = require('supertest')

let token;
beforeAll(async () => {
  const response = await request('https://qa-challenge-api.scratchpay.com/api').get('/auth?email=gianna@hightable.test&password=thedantonio1');  
  token = response.body['data']['session'].token;
});

describe('GET /api/clinics',  function() {
    
      it('should respond with user data', async function() {
       await request('https://qa-challenge-api.scratchpay.com/api').get('/clinics?term=veterinary')
            .set('Authorization', 'Bearer ' +token)
            .expect(200)           
            .then((response)=>{
              let result = response.body.data;
              expect(result[0]['id']).toBe(2);   
              expect(result[0]['displayName']).toBe('Continental Veterinary Clinic, Los Angeles, CA');           
              expect(result[1]['id']).toBe(7);   
              expect(result[1]['displayName']).toBe('Third Transfer Veterinary Clinic, Los Angeles, CA');           
      
            })            
      });    

      it('should respond with empty user data because we passed incorrect search query', async function() {
        await request('https://qa-challenge-api.scratchpay.com/api').get('/clinics?term=vetirinary')
            .set('Authorization', 'Bearer ' +token)           
            .then((response)=>{
              let result = response.body.data;    
              expect(result.length === 0).toBe(true)
            })          
    });

      it('should respond with empty user data because we passed in empty search query', async function() {
        await request('https://qa-challenge-api.scratchpay.com/api').get('/clinics?term=""')
            .set('Authorization', 'Bearer ' +token)           
            .then((response)=>{
              let result = response.body.data;  
              expect(result.length === 0).toBe(true)
            })
          
      });

        it('should respond with error when term query parameter is missing', async function() {
         await request('https://qa-challenge-api.scratchpay.com/api').get('/clinics')
              .set('Authorization', 'Bearer ' +token)           
              .then((response)=>{
              let result = response.body;  
              expect(result['error']).toBe('term is a required parameter for this action')
              })
      });

        it('should respond with user data Error: User does not have permissions, when the wrong api is called', async function() {
          await request('https://qa-challenge-api.scratchpay.com/api').get('/clinics/2/emails?term=veterinary')
              .set('Authorization', 'Bearer ' +token)           
              .then((response)=>{
                let result = response.body.data;                          
                expect(result['message']).toBe('An error happened')
                expect(result['error']).toBe('Error: User does not have permissions')
              })
              
      });

      it('should respond with error when auth token is not passed ', async function() {
        await request('https://qa-challenge-api.scratchpay.com/api').get('/clinics/2/emails?term=veterinary')
            .then((response)=>{          
              let result = response.body.data;                    
              expect(result['message']).toBe('You need to be authorized for this action.')
            })        
      });

      it('should respond with error - unauthorized when the token is empty', async function() {
        token = "";
        await request('https://qa-challenge-api.scratchpay.com/api').get('/clinics?term=veterinary')
              .set('Authorization', 'Bearer ' +token)
              .expect(401);                       
      });

      it('should respond with error - unauthorized when the right token is accidentally appended with a string', async function() {
        await request('https://qa-challenge-api.scratchpay.com/api').get('/clinics?term=veterinary')
              .set('Authorization', 'Bearer ' +token+"abc")
              .expect(401);                       
      });

      // Another test would be to validate 503
});
