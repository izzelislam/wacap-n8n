import {
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class WacapApi implements ICredentialType {
  name = 'wacapApi';
  displayName = 'Wacap API';
  documentationUrl = 'https://github.com/izzelislam/wacapp';
  properties: INodeProperties[] = [
    {
      displayName: 'Session ID',
      name: 'sessionId',
      type: 'string',
      default: '',
      required: true,
      description: 'Unique identifier for your WhatsApp session',
    },
    {
      displayName: 'Sessions Path',
      name: 'sessionsPath',
      type: 'string',
      default: './sessions',
      description: 'Directory path where session data will be stored',
    },
    {
      displayName: 'Storage Adapter',
      name: 'storageAdapter',
      type: 'options',
      options: [
        {
          name: 'SQLite',
          value: 'sqlite',
        },
        {
          name: 'Prisma',
          value: 'prisma',
        },
      ],
      default: 'sqlite',
      description: 'Storage backend for session data',
    },
  ];
}
