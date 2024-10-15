import axios from 'axios';
import { expect } from 'chai';

describe('User Creation API - Performance Test', function () {
  this.timeout(60000); // Set timeout to 60 seconds, in case of slow responses

  let config;

  beforeEach(() => {
    config = {
      baseURL: 'https://gorest.co.in/public-api',
      headers: {
        'Authorization': 'Bearer 1eed2ad91172c041cf5f201a81b7bdeb5d703be568c948552b6535c3fa7614b0',
        'Content-Type': 'application/json',
      }
    };
  });

  it('should hit the API 500 times in parallel', async function () {
    const requestBody = () => ({
      name: `Performance Test User ${Date.now()}`,
      gender: 'male',
      email: `perf${Date.now()}@example.com`,
      status: 'active',
    });

    // Create an array of 500 promises (50 requests)
    const promises = Array.from({ length: 500 }, () =>
      axios.post('/users', requestBody(), config)
    );

    const startTime = Date.now(); // Measure start time

    // Send all requests in parallel and wait for them to complete
    const results = await Promise.allSettled(promises);

    const endTime = Date.now(); // Measure end time

    // Check how many requests succeeded and how many failed
    const successfulRequests = results.filter(result => result.status === 'fulfilled').length;
    const failedRequests = results.filter(result => result.status === 'rejected').length;

    console.log(`Total time taken: ${endTime - startTime} ms`);
    console.log(`Successful requests: ${successfulRequests}`);
    console.log(`Failed requests: ${failedRequests}`);

    // Ensure all requests were successful
    expect(successfulRequests).to.equal(500);
  });
});
