import axios from 'axios';
import { expect } from 'chai';

describe('User Creation API - Positive Tests with Axios', () => {
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

  it('should create a valid user with a unique email', async () => {
    const uniqueEmail = `john.doe${Date.now()}@example.com`;

    const requestBody = {
      name: 'Gurucharan Doe',
      gender: 'male',
      email: uniqueEmail,
      status: 'active',
    };

    try {
      const response = await axios.post('/users', requestBody, config);
      expect(response.status).to.equal(201); // Chai assertion
      expect(response.data.data).to.have.property('id'); // Check for user ID
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  });
});
