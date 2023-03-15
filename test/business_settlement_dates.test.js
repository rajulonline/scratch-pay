const request = require("supertest");
const app = require("../index");
let settlementDateRequestObject;

// settlementDate request object
beforeEach(() => {
  settlementDateRequestObject = {
    "delay": "5",
    "initialDate": "2023-03-09",
    "country": "IN"    
  }
});

  describe("GET /settlementDate test scenarios", () => {
    test("should return 200 and the correct response upon passing the right query parameters", async () => {
      const delay = settlementDateRequestObject.delay     
      const initialDate = settlementDateRequestObject.initialDate;
      const country =  settlementDateRequestObject.country;    
      await request(app).get(`/api/v1/settlementDate?delay=${delay}&initialDate=${initialDate}&country=${country}`).expect(200).then((response)=>{
        let es = response.body;  
        expect(es["initialQuery"]["delay"]).toBe("5");
        expect(es["initialQuery"]["initialDate"]).toBe("2023-03-09");
        expect(es["initialQuery"]["country"]).toBe("IN");
        expect(es["results"]["businessDate"]).toBe("2023-03-15T07:00:00Z");
        expect(es["results"]["holidayDays"]).toBe(0);
        expect(es["results"]["totalDays"]).toBe(7);
        expect(es["results"]["weekendDays"]).toBe(2);
      })
    }) 
    
    test("should return 200 even when the country parameter is not passed ", async () => {  
      const delay = settlementDateRequestObject.delay     
      const initialDate = settlementDateRequestObject.initialDate;    
      await request(app).get(`/api/v1/settlementDate?delay=${delay}&initialDate=${initialDate}`).expect(200).then((response)=>{
        let es = response.body;
        expect(es["initialQuery"]["delay"]).toBe("5");
        expect(es["initialQuery"]["initialDate"]).toBe("2023-03-09");
        expect(es["results"]["businessDate"]).toBe("2023-03-15T07:00:00Z");
        expect(es["results"]["holidayDays"]).toBe(0);
        expect(es["results"]["totalDays"]).toBe(7);
        expect(es["results"]["weekendDays"]).toBe(2);
      })
    }) 

    test("should return 500 when the delay parameter is not passed", async () => {  
      const initialDate = settlementDateRequestObject.initialDate;    
      await request(app).get(`/api/v1/settlementDate?initialDate=${initialDate}`).expect(500)
    }) 

    test("should return 200 even when the initial date parameter is not passed but the business date object is set to null in response", async () => {  
      const delay = settlementDateRequestObject.delay     
      await request(app).get(`/api/v1/settlementDate?delay=${delay}`).expect(200).then((response)=>{
        let es = response.body; 
        expect(es["initialQuery"]["delay"]).toBe("5");        
        expect(es["results"]["businessDate"]).toBe(null);
        expect(es["results"]["holidayDays"]).toBe(0);
        expect(es["results"]["totalDays"]).toBe(5);
        expect(es["results"]["weekendDays"]).toBe(0);
      })
    })
    
    test("should return 200 with the request object in the before each hook", async () => {    
      await request(app).get(`/api/v1/settlementDate`).expect(200).then((response)=>{
        let es = response.body; 
        expect(es["initialQuery"]).toMatchObject({});      
        expect(es["results"]["businessDate"]).toBe(null);
        expect(es["results"]["holidayDays"]).toBe(0);
        expect(es["results"]["totalDays"]).toBe(null);
        expect(es["results"]["weekendDays"]).toBe(0);
      })
    })

  });
