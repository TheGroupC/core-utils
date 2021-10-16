const Utils = require('./Utils');
const util = new Utils({ projectId: 10, apiToken: 'sampletoken', apiUrl: 'https://' });
const axios = require('axios');

jest.mock('axios');

describe('Testing Utils.submitForm()', () => {
  test('It should get a status 204 as response', async () => {
    axios.mockResolvedValue({ status: 200 });
    const response = await util.submitForm({ formData: { name: 'test' }, formId: 300, email: 'test@email.com' });
    expect(response.status).toEqual(200);
  });

  test('It should return error if missing params', async () => {
    const response = await util.submitForm({ formId: 10, email: 'test@email.com', leadId: 10 });
    const error = { error: 'Missing some required params' };
    expect(response).toEqual(error);
  });
});

describe('Testing Utils.sendMail()', () => {
  test('It should return right response', async () => {
    axios.mockResolvedValue({ status: 204 });
    const response = await util.sendMail({
      recipientEmail: 'test@email.com',
      subject: 'Test subject',
      htmlBody: '<p>Html body</p>',
    });
    expect(response.status).toEqual(204);
  });

  test('It should return right response with attachment', async () => {
    axios.mockResolvedValue({ status: 204 });
    const response = await util.sendMail({
      recipientEmail: 'test@email.com',
      subject: 'Test subject',
      htmlBody: '<p>Html body</p>',
      hasAttachment: true,
      attachmentFilename: 'file',
      attachmentUrl: 'url',
    });
    expect(response.status).toEqual(204);
  });

  test('Should require attachmentFilename and attachmentUrl if hasAttachment is true', async () => {
    const response = await util.sendMail({
      recipientEmail: 'test@email.com',
      subject: 'Test subject',
      htmlBody: '<p>Html body</p>',
      hasAttachment: true,
      attachmentFilename: 'testfilename',
    });
    const error = { error: 'Some missing params. If hasAttachment is true, both attachmentFilename and attachmentUrl are required' };
    expect(response).toEqual(error);
  });

  test('Should return error if hasAttachment is false or undefined but attachmentUrl or attachmentFilename are not empty', async () => {
    const response = await util.sendMail({
      recipientEmail: 'test@email.com',
      subject: 'Test subject',
      htmlBody: '<p>Html body</p>',
      attachmentFilename: 'testfilename',
    });
    const error = { error: 'If hasAttachment is false, both attachmentFilename and attachmentUrl cannot be accepted' };
    expect(response).toEqual(error);
  });

  test('Should return error if missing required params', async () => {
    const response = await util.sendMail({
      recipientEmail: 'test@email.com',
    });
    const error = { error: 'Missing some required params' };
    expect(response).toEqual(error);
  });
});

describe('Testing Utils.addLead()', () => {
  test('It should return right response', async () => {
    axios.mockResolvedValue({ data: { insertId: 3 } });
    const response = await util.addLead({ firstname: 'test', lastname: 'test', email: 'test@email.com', phone: '123456' });
    expect(response.data.insertId).toEqual(3);
  });

  test('Should return error if missing required params', async () => {
    const response = await util.addLead({
      firstname: 'test@email.com',
    });
    const error = { error: 'Missing some required params' };
    expect(response).toEqual(error);
  });
});
