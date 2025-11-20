import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
} from 'n8n-workflow';

import { WacapWrapper } from '@pakor/wacap-wrapper';

let wacapInstance: WacapWrapper | null = null;

async function getWacapInstance(context: IExecuteFunctions): Promise<WacapWrapper> {
  if (!wacapInstance) {
    const credentials = await context.getCredentials('wacapApi');
    wacapInstance = new WacapWrapper({
      sessionsPath: credentials.sessionsPath as string || './sessions',
      storageAdapter: credentials.storageAdapter as 'sqlite' | 'prisma' || 'sqlite',
      autoDisplayQR: false,
    });
    await wacapInstance.init();
  }
  return wacapInstance;
}

export class Wacap implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Wacap WhatsApp',
    name: 'wacap',
    icon: 'file:wacap.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with WhatsApp using Wacap wrapper',
    defaults: {
      name: 'Wacap WhatsApp',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'wacapApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Message',
            value: 'message',
          },
          {
            name: 'Session',
            value: 'session',
          },
          {
            name: 'Presence',
            value: 'presence',
          },
          {
            name: 'Group',
            value: 'group',
          },
          {
            name: 'Contact',
            value: 'contact',
          },
        ],
        default: 'message',
      },

      // MESSAGE OPERATIONS
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['message'],
          },
        },
        options: [
          {
            name: 'Send Text',
            value: 'sendText',
            description: 'Send a text message',
            action: 'Send a text message',
          },
          {
            name: 'Send Media',
            value: 'sendMedia',
            description: 'Send image, video, audio, or document',
            action: 'Send media',
          },
          {
            name: 'Send Location',
            value: 'sendLocation',
            description: 'Send location',
            action: 'Send location',
          },
        ],
        default: 'sendText',
      },

      // SESSION OPERATIONS
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['session'],
          },
        },
        options: [
          {
            name: 'Start',
            value: 'start',
            description: 'Start a WhatsApp session',
            action: 'Start session',
          },
          {
            name: 'Stop',
            value: 'stop',
            description: 'Stop a WhatsApp session',
            action: 'Stop session',
          },
          {
            name: 'Get Info',
            value: 'getInfo',
            description: 'Get session information',
            action: 'Get session info',
          },
          {
            name: 'Delete',
            value: 'delete',
            description: 'Delete session data',
            action: 'Delete session',
          },
        ],
        default: 'start',
      },

      // PRESENCE OPERATIONS
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['presence'],
          },
        },
        options: [
          {
            name: 'Send Typing',
            value: 'typing',
            description: 'Show typing indicator',
            action: 'Send typing',
          },
          {
            name: 'Send Recording',
            value: 'recording',
            description: 'Show recording indicator',
            action: 'Send recording',
          },
          {
            name: 'Send Available',
            value: 'available',
            description: 'Set status as available',
            action: 'Send available',
          },
        ],
        default: 'typing',
      },

      // GROUP OPERATIONS
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['group'],
          },
        },
        options: [
          {
            name: 'Get All',
            value: 'getAll',
            description: 'Get all groups',
            action: 'Get all groups',
          },
          {
            name: 'Get Metadata',
            value: 'getMetadata',
            description: 'Get group metadata',
            action: 'Get group metadata',
          },
        ],
        default: 'getAll',
      },

      // CONTACT OPERATIONS
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['contact'],
          },
        },
        options: [
          {
            name: 'Get Profile Picture',
            value: 'getProfilePicture',
            description: 'Get contact profile picture',
            action: 'Get profile picture',
          },
        ],
        default: 'getProfilePicture',
      },

      // COMMON FIELDS
      {
        displayName: 'Phone Number (JID)',
        name: 'jid',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['sendText', 'sendMedia', 'sendLocation', 'typing', 'recording', 'available', 'getProfilePicture'],
          },
        },
        default: '',
        placeholder: '6281234567890@s.whatsapp.net',
        description: 'WhatsApp JID (phone number with @s.whatsapp.net)',
      },

      // MESSAGE FIELDS
      {
        displayName: 'Message',
        name: 'message',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['sendText'],
          },
        },
        default: '',
        description: 'The text message to send',
      },

      {
        displayName: 'Media Type',
        name: 'mediaType',
        type: 'options',
        displayOptions: {
          show: {
            operation: ['sendMedia'],
          },
        },
        options: [
          {
            name: 'Image',
            value: 'image',
          },
          {
            name: 'Video',
            value: 'video',
          },
          {
            name: 'Audio',
            value: 'audio',
          },
          {
            name: 'Document',
            value: 'document',
          },
        ],
        default: 'image',
      },

      {
        displayName: 'Media URL',
        name: 'mediaUrl',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['sendMedia'],
          },
        },
        default: '',
        description: 'URL of the media file',
      },

      {
        displayName: 'Caption',
        name: 'caption',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['sendMedia'],
          },
        },
        default: '',
        description: 'Caption for the media',
      },

      {
        displayName: 'File Name',
        name: 'fileName',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['sendMedia'],
            mediaType: ['document'],
          },
        },
        default: '',
        description: 'File name for documents',
      },

      {
        displayName: 'Latitude',
        name: 'latitude',
        type: 'number',
        required: true,
        displayOptions: {
          show: {
            operation: ['sendLocation'],
          },
        },
        default: 0,
        description: 'Location latitude',
      },

      {
        displayName: 'Longitude',
        name: 'longitude',
        type: 'number',
        required: true,
        displayOptions: {
          show: {
            operation: ['sendLocation'],
          },
        },
        default: 0,
        description: 'Location longitude',
      },

      // GROUP FIELDS
      {
        displayName: 'Group JID',
        name: 'groupJid',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['getMetadata'],
          },
        },
        default: '',
        placeholder: '120363xxxxx@g.us',
        description: 'WhatsApp Group JID',
      },

      // ADDITIONAL OPTIONS
      {
        displayName: 'Additional Options',
        name: 'additionalOptions',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
          show: {
            operation: ['sendText'],
          },
        },
        options: [
          {
            displayName: 'Mentions',
            name: 'mentions',
            type: 'string',
            default: '',
            description: 'Comma-separated list of JIDs to mention',
          },
        ],
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    const credentials = await this.getCredentials('wacapApi');
    const sessionId = credentials.sessionId as string;

    const wacap = await getWacapInstance(this);

    for (let i = 0; i < items.length; i++) {
      try {
        if (resource === 'session') {
          if (operation === 'start') {
            await wacap.sessionStart(sessionId);
            returnData.push({
              json: { success: true, message: 'Session started', sessionId },
            });
          } else if (operation === 'stop') {
            await wacap.sessionStop(sessionId);
            returnData.push({
              json: { success: true, message: 'Session stopped', sessionId },
            });
          } else if (operation === 'getInfo') {
            const info = wacap.getSessionInfo(sessionId);
            returnData.push({ json: info || {} });
          } else if (operation === 'delete') {
            await wacap.deleteSession(sessionId);
            returnData.push({
              json: { success: true, message: 'Session deleted', sessionId },
            });
          }
        } else if (resource === 'message') {
          if (operation === 'sendText') {
            const jid = this.getNodeParameter('jid', i) as string;
            const message = this.getNodeParameter('message', i) as string;
            const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as any;

            const options: any = {};
            if (additionalOptions.mentions) {
              options.mentions = (additionalOptions.mentions as string).split(',').map(m => m.trim());
            }

            const result = await wacap.sendMessage(sessionId, jid, message, options);
            returnData.push({ json: { success: true, result } });
          } else if (operation === 'sendMedia') {
            const jid = this.getNodeParameter('jid', i) as string;
            const mediaType = this.getNodeParameter('mediaType', i) as string;
            const mediaUrl = this.getNodeParameter('mediaUrl', i) as string;
            const caption = this.getNodeParameter('caption', i, '') as string;
            const fileName = this.getNodeParameter('fileName', i, '') as string;

            const mimetypes: any = {
              image: 'image/jpeg',
              video: 'video/mp4',
              audio: 'audio/mp3',
              document: 'application/pdf',
            };

            const result = await wacap.sendMedia(sessionId, jid, {
              url: mediaUrl,
              mimetype: mimetypes[mediaType],
              caption,
              fileName,
            });

            returnData.push({ json: { success: true, result } });
          } else if (operation === 'sendLocation') {
            const jid = this.getNodeParameter('jid', i) as string;
            const latitude = this.getNodeParameter('latitude', i) as number;
            const longitude = this.getNodeParameter('longitude', i) as number;

            const socket = wacap.getSocket(sessionId);
            if (!socket) {
              throw new NodeOperationError(this.getNode(), 'Session not connected');
            }

            const result = await socket.sendMessage(jid, {
              location: {
                degreesLatitude: latitude,
                degreesLongitude: longitude,
              },
            });

            returnData.push({ json: { success: true, result } });
          }
        } else if (resource === 'presence') {
          const jid = this.getNodeParameter('jid', i) as string;
          const socket = wacap.getSocket(sessionId);
          
          if (!socket) {
            throw new NodeOperationError(this.getNode(), 'Session not connected');
          }

          let presenceType = 'available';
          if (operation === 'typing') presenceType = 'composing';
          else if (operation === 'recording') presenceType = 'recording';

          await socket.sendPresenceUpdate(presenceType as any, jid);
          returnData.push({ json: { success: true, presence: presenceType, jid } });
        } else if (resource === 'group') {
          const socket = wacap.getSocket(sessionId);
          
          if (!socket) {
            throw new NodeOperationError(this.getNode(), 'Session not connected');
          }

          if (operation === 'getAll') {
            const groups = await socket.groupFetchAllParticipating();
            returnData.push({ json: { groups: Object.values(groups) } });
          } else if (operation === 'getMetadata') {
            const groupJid = this.getNodeParameter('groupJid', i) as string;
            const metadata = await socket.groupMetadata(groupJid);
            returnData.push({ json: metadata });
          }
        } else if (resource === 'contact') {
          const socket = wacap.getSocket(sessionId);
          
          if (!socket) {
            throw new NodeOperationError(this.getNode(), 'Session not connected');
          }

          if (operation === 'getProfilePicture') {
            const jid = this.getNodeParameter('jid', i) as string;
            try {
              const ppUrl = await socket.profilePictureUrl(jid, 'image');
              returnData.push({ json: { success: true, profilePictureUrl: ppUrl } });
            } catch (error) {
              returnData.push({ json: { success: false, error: 'No profile picture found' } });
            }
          }
        }
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: error.message } });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
