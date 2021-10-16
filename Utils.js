const axios = require('axios');
const _isEmpty = require('lodash').isEmpty;

class Utils {
  constructor({ projectId, apiToken, apiUrl }) {
    this.project = projectId;
    this.token = apiToken;
    this.apiUrl = apiUrl;
  }

  submitForm({ formData, formId, email, leadId = 0 }) {
    if (_isEmpty(formData) || _isEmpty(String(formId)) || _isEmpty(email)) {
      console.log('got here');
      return { error: 'Missing some required params' };
    }

    return axios({
      method: 'POST',
      url: `${this.apiUrl}/com/submissions`,
      data: {
        formData,
        formId,
        email,
        leadId,
      },
      headers: {
        token: this.token,
      },
    });
  }

  sendMail({ recipientEmail, subject, htmlBody, hasAttachment = false, attachmentFilename, attachmentUrl }) {
    if (hasAttachment) {
      if (_isEmpty(attachmentFilename) || _isEmpty(attachmentUrl)) {
        return { error: 'Some missing params. If hasAttachment is true, both attachmentFilename and attachmentUrl are required' };
      }
    }

    if (!hasAttachment && (attachmentFilename || attachmentUrl)) {
      return { error: 'If hasAttachment is false, both attachmentFilename and attachmentUrl cannot be accepted' };
    }

    if (_isEmpty(recipientEmail) || _isEmpty(subject) || _isEmpty(htmlBody)) {
      return { error: 'Missing some required params' };
    }

    return axios({
      method: 'POST',
      url: `${this.apiUrl}/mail`,
      data: {
        project: this.project,
        email: recipientEmail,
        message: htmlBody,
        subject,
        attachments: hasAttachment ? [{ filename: attachmentFilename, path: attachmentUrl }] : null,
      },
      headers: {
        token: this.token,
      },
    });
  }

  addLead({ firstname, lastname, phone = null, email }) {
    if (_isEmpty(firstname) || _isEmpty(lastname) || _isEmpty(email)) {
      return { error: 'Missing some required params' };
    }

    return axios({
      method: 'POST',
      url: `${this.apiUrl}/com/leads`,
      data: {
        project: this.project,
        firstname,
        lastname,
        email,
        phone,
      },
      headers: {
        token: this.token,
      },
    });
  }
}

module.exports = Utils;
