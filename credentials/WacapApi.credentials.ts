import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class WacapApi implements ICredentialType {
  name = 'wacapApi';
  displayName = 'Wacap HTTP API';
  documentationUrl = 'https://github.com/izzelislam/wacapp';
  properties: INodeProperties[] = [
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: 'http://localhost:3000',
      required: true,
      placeholder: 'http://localhost:3000',
      description: 'Base URL of your Wacap API server',
    },
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      description: 'API Key for authentication (leave empty if not required)',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        'X-Api-Key': '={{$credentials.apiKey}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.baseUrl}}',
      url: '/api/sessions',
      method: 'GET',
    },
  };
}
