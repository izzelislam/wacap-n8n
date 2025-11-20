"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wacap = void 0;
class Wacap {
    constructor() {
        this.description = {
            displayName: 'Wacap',
            name: 'wacap',
            icon: 'file:wacap.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Interact with WhatsApp using Wacap HTTP API',
            defaults: {
                name: 'Wacap',
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
                    displayName: 'Session',
                    name: 'session',
                    type: 'string',
                    required: true,
                    default: 'default',
                    description: 'Session name/ID',
                },
                {
                    displayName: 'Chat ID',
                    name: 'chatId',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: ['sendText', 'sendMedia', 'sendLocation', 'typing', 'recording', 'available'],
                        },
                    },
                    default: '',
                    placeholder: '6281234567890@c.us',
                    description: 'Chat ID (phone with @c.us or group with @g.us)',
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
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        const credentials = await this.getCredentials('wacapApi');
        const baseUrl = credentials.baseUrl;
        for (let i = 0; i < items.length; i++) {
            try {
                let endpoint = '';
                let method = 'POST';
                let body = {};
                if (resource === 'session') {
                    const session = this.getNodeParameter('session', i, 'default');
                    if (operation === 'start') {
                        endpoint = '/api/sessions';
                        method = 'POST';
                        body = { name: session };
                    }
                    else if (operation === 'stop') {
                        endpoint = `/api/sessions/${session}`;
                        method = 'DELETE';
                    }
                    else if (operation === 'getInfo') {
                        endpoint = `/api/sessions/${session}`;
                        method = 'GET';
                    }
                    else if (operation === 'delete') {
                        endpoint = `/api/sessions/${session}`;
                        method = 'DELETE';
                    }
                }
                else if (resource === 'message') {
                    const session = this.getNodeParameter('session', i, 'default');
                    if (operation === 'sendText') {
                        const chatId = this.getNodeParameter('chatId', i);
                        const message = this.getNodeParameter('message', i);
                        const additionalOptions = this.getNodeParameter('additionalOptions', i, {});
                        endpoint = '/api/sendText';
                        body = {
                            session,
                            chatId,
                            text: message,
                        };
                        if (additionalOptions.mentions) {
                            body.mentions = additionalOptions.mentions.split(',').map(m => m.trim());
                        }
                    }
                    else if (operation === 'sendMedia') {
                        const chatId = this.getNodeParameter('chatId', i);
                        const mediaType = this.getNodeParameter('mediaType', i);
                        const mediaUrl = this.getNodeParameter('mediaUrl', i);
                        const caption = this.getNodeParameter('caption', i, '');
                        const fileName = this.getNodeParameter('fileName', i, '');
                        endpoint = `/api/send${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}`;
                        body = {
                            session,
                            chatId,
                            url: mediaUrl,
                            caption,
                        };
                        if (fileName) {
                            body.fileName = fileName;
                        }
                    }
                    else if (operation === 'sendLocation') {
                        const chatId = this.getNodeParameter('chatId', i);
                        const latitude = this.getNodeParameter('latitude', i);
                        const longitude = this.getNodeParameter('longitude', i);
                        endpoint = '/api/sendLocation';
                        body = {
                            session,
                            chatId,
                            latitude,
                            longitude,
                        };
                    }
                }
                else if (resource === 'presence') {
                    const session = this.getNodeParameter('session', i, 'default');
                    const chatId = this.getNodeParameter('chatId', i);
                    let presenceType = 'available';
                    if (operation === 'typing')
                        presenceType = 'composing';
                    else if (operation === 'recording')
                        presenceType = 'recording';
                    endpoint = '/api/sendPresence';
                    body = {
                        session,
                        chatId,
                        presence: presenceType,
                    };
                }
                else if (resource === 'group') {
                    const session = this.getNodeParameter('session', i, 'default');
                    if (operation === 'getAll') {
                        endpoint = `/api/sessions/${session}/groups`;
                        method = 'GET';
                    }
                    else if (operation === 'getMetadata') {
                        const groupJid = this.getNodeParameter('groupJid', i);
                        endpoint = `/api/sessions/${session}/groups/${groupJid}`;
                        method = 'GET';
                    }
                }
                else if (resource === 'contact') {
                    const session = this.getNodeParameter('session', i, 'default');
                    if (operation === 'getProfilePicture') {
                        const chatId = this.getNodeParameter('chatId', i, '');
                        endpoint = `/api/sessions/${session}/contacts/${chatId}/profile-picture`;
                        method = 'GET';
                    }
                }
                // Make HTTP request
                const options = {
                    method,
                    url: `${baseUrl}${endpoint}`,
                    json: true,
                };
                if (method !== 'GET' && Object.keys(body).length > 0) {
                    options.body = body;
                }
                if (credentials.apiKey) {
                    options.headers = {
                        'X-Api-Key': credentials.apiKey,
                    };
                }
                const response = await this.helpers.httpRequest(options);
                returnData.push({ json: response });
            }
            catch (error) {
                if (this.continueOnFail()) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                    returnData.push({ json: { error: errorMessage } });
                    continue;
                }
                throw error;
            }
        }
        return [returnData];
    }
}
exports.Wacap = Wacap;
