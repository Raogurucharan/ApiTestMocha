import axios from 'axios';
import { expect } from 'chai';

describe('User Creation API - Edge and Negative Cases with Axios', () => {
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

  // Edge Case: Sending All Fields Empty
  it('Edge Case - Send All Fields Empty', async () => {
    const requestBody = {
      name: '',     // Empty name
      gender: '',   // Empty gender
      email: '',    // Empty email
      status: ''    // Empty status
    };

    try {
      await axios.post('/users', requestBody, config);
    } catch (error) {
      expect(error.response.status).to.equal(422);  // Unprocessable Entity
      const errors = error.response.data.data;
      
      expect(errors.some(e => e.field === 'name' && e.message === "can't be blank")).to.be.true;
      expect(errors.some(e => e.field === 'email' && e.message === 'is invalid')).to.be.true;
      expect(errors.some(e => e.field === 'gender' && e.message === "can't be blank, can be male or female")).to.be.true;
      expect(errors.some(e => e.field === 'status' && e.message === "can't be blank")).to.be.true;
    }
  });

  // Negative Case: Invalid Email Format
  it('Negative Case - Invalid Email Format', async () => {
    const requestBody = {
      name: 'Invalid Email User',
      gender: 'female',
      email: 'invalid-email-format',  // Invalid email
      status: 'active',
    };

    try {
      await axios.post('/users', requestBody, config);
    } catch (error) {
      expect(error.response.status).to.equal(422);  // Unprocessable Entity
      expect(error.response.data.data[0].message).to.equal('is invalid');  // Email error
    }
  });

  // Negative Case: Invalid Gender
  it('Negative Case - Invalid Gender', async () => {
    const requestBody = {
      name: 'Invalid Gender User',
      gender: 'other',  // Invalid gender
      email: `valid.email${Date.now()}@example.com`,
      status: 'active',
    };

    try {
      await axios.post('/users', requestBody, config);
    } catch (error) {
      expect(error.response.status).to.equal(422);  // Unprocessable Entity
      expect(error.response.data.data[0].message).to.equal("can't be blank, can be male or female");  // Gender error
    }
  });

  // Negative Case: Duplicate Email
  it('Negative Case - Duplicate Email', async () => {
    const requestBody = {
      name: 'Duplicate Email User',
      gender: 'male',
      email: 'duplicate.email@example.com',  // Use an existing email
      status: 'active',
    };

    try {
      await axios.post('/users', requestBody, config);
    } catch (error) {
      expect(error.response.status).to.equal(422);  // Unprocessable Entity
      expect(error.response.data.data[0].message).to.equal('has already been taken');  // Duplicate email error
    }
  });

  // Negative Case: Missing Status Field
  it('Negative Case - Missing Status', async () => {
    const requestBody = {
      name: 'Missing Status User',
      gender: 'female',
      email: `missing.status${Date.now()}@example.com`,  // Valid email
      // status is missing
    };

    try {
      await axios.post('/users', requestBody, config);
    } catch (error) {
      expect(error.response.status).to.equal(422);  // Unprocessable Entity
      expect(error.response.data.data[0].message).to.equal("can't be blank");  // Status error
    }
  });
});
