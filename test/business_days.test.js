const request = require("supertest");
const app = require("../index");

let businessDayObject;

// businessDayObject request object
beforeEach(() => {
  businessDayObject = {
    "date": "2023-03-09",
    "country": "US"    
  }
});

  describe("GET /isBusinessDay test scenarios", () => {
    test("should return 200 and correct response when the correct query parameters are passed", async () => {
      const date = businessDayObject.date     
      const country =  businessDayObject.country;    
      await request(app).get(`/api/v1/isBusinessDay?date=${date}&country=${country}`).expect(200).then((response)=>{
        let result = response.body;  
        expect(result["ok"]).toBe(true);        
        expect(result["results"]).toBe(true);
      })
    }) 

    test("should return false with the country is not US and a date which is not business day", async () => {
      const date = "2023-03-12"     
      const country =  "IN";    
      await request(app).get(`/api/v1/isBusinessDay?date=${date}&country=${country}`).expect(200).then((response)=>{
        let result = response.body;  
        expect(result["ok"]).toBe(true);        
        expect(result["results"]).toBe(false);
      })
    }) 

    test("should return true with the country is India and the date format is in dd/mm/yyy", async () => {
      const date = "12-03-2023"     
      const country =  "IN";    
      await request(app).get(`/api/v1/isBusinessDay?date=${date}&country=${country}`).expect(200).then((response)=>{
        let result = response.body;  
        expect(result["ok"]).toBe(true);        
        expect(result["results"]).toBe(true);
      })
    }) 
    
    test("should return error message when the date is not passed in the query parameter", async () => {       
      await request(app).get(`/api/v1/isBusinessDay`).expect(200).then((response)=>{
        let result = response.body;  
        expect(result["ok"]).toBe(false); 
        expect(result["errorMessage"]).toBe('A valid date is required')        
      })
    })     
  });

  