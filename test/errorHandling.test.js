import axios from 'axios';
import { expect } from 'chai';

describe('User Creation API - Error Handling with Axios', () => {
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

  it('Error Case - Missing Bearer Token', async () => {
    const requestBody = {
      name: 'No Auth User',
      gender: 'female',
      email: `no.auth${Date.now()}@example.com`,
      status: 'active',
    };

    try {
      await axios.post('/users', requestBody, {
        baseURL: 'https://gorest.co.in/public-api',  // No Bearer token in the headers
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      expect(error.response.status).to.equal(401);  // Unauthorized
      expect(error.response.data.message).to.equal('Authentication failed');
    }
  });

  it('Error Case - Invalid HTTP Method', async () => {
    try {
      await axios.get('/users', {
        baseURL: 'https://gorest.co.in/public-api',
        headers: {
          'Authorization': 'Bearer 1eed2ad91172c041cf5f201a81b7bdeb5d703be568c948552b6535c3fa7614b0',
          'Content-Type': 'application/json',
        },
        data: {
          name: 'Invalid Method User',
          gender: 'female',
          email: `invalid.method${Date.now()}@example.com`,
          status: 'active',
        }
      });
    } catch (error) {
      expect(error.response.status).to.equal(405);  // Method Not Allowed
      expect(error.response.data.message).to.equal('The requested method is not allowed for the URL');
    }
  });
});
