import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class WacapApi implements ICredentialType {
  name = 'wacapApi';
  displayName = 'Wacap Docker API';
  documentationUrl = 'https://hub.docker.com/r/bangfkr/wacap';
  properties: INodeProperties[] = [
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: 'http://localhost:3000',
      required: true,
      placeholder: 'http://localhost:3000',
      description: 'Base URL of your Wacap Docker API server',
    },
    {
      displayName: 'Device Token',
      name: 'apiKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      description: 'Device Token for API authentication (get from Settings > API Usage in dashboard)',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        'X-Device-Token': '={{$credentials.apiKey}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.baseUrl}}',
      url: '/api/health',
      method: 'GET',
    },
  };
}
