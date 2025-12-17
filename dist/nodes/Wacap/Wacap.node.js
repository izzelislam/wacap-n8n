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
            description: 'Interact with WhatsApp using Wacap Docker API',
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
                        { name: 'Message', value: 'message' },
                        { name: 'Presence', value: 'presence' },
                        { name: 'Session', value: 'session' },
                        { name: 'Group', value: 'group' },
                        { name: 'Contact', value: 'contact' },
                    ],
                    default: 'message',
                },
                // MESSAGE OPERATIONS
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: { show: { resource: ['message'] } },
                    options: [
                        { name: 'Send Text', value: 'sendText', description: 'Send a text message', action: 'Send a text message' },
                        { name: 'Send Media', value: 'sendMedia', description: 'Send image, video, audio, or document', action: 'Send media' },
                        { name: 'Send Location', value: 'sendLocation', description: 'Send location', action: 'Send location' },
                        { name: 'Send Contact', value: 'sendContact', description: 'Send contact card', action: 'Send contact' },
                        { name: 'Mark as Read', value: 'markAsRead', description: 'Mark messages as read', action: 'Mark as read' },
                    ],
                    default: 'sendText',
                },
                // PRESENCE OPERATIONS
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: { show: { resource: ['presence'] } },
                    options: [
                        { name: 'Typing', value: 'typing', description: 'Show typing indicator', action: 'Send typing' },
                        { name: 'Recording', value: 'recording', description: 'Show recording indicator', action: 'Send recording' },
                        { name: 'Online', value: 'online', description: 'Set status as online', action: 'Set online' },
                        { name: 'Offline', value: 'offline', description: 'Set status as offline', action: 'Set offline' },
                        { name: 'Paused', value: 'paused', description: 'Stop typing indicator', action: 'Stop typing' },
                    ],
                    default: 'typing',
                },
                // SESSION OPERATIONS
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: { show: { resource: ['session'] } },
                    options: [
                        { name: 'Create', value: 'create', description: 'Create a new WhatsApp session', action: 'Create session' },
                        { name: 'Get Info', value: 'getInfo', description: 'Get session information', action: 'Get session info' },
                        { name: 'Get All', value: 'getAll', description: 'Get all sessions', action: 'Get all sessions' },
                        { name: 'Stop', value: 'stop', description: 'Stop a WhatsApp session', action: 'Stop session' },
                        { name: 'Restart', value: 'restart', description: 'Restart a WhatsApp session', action: 'Restart session' },
                        { name: 'Delete', value: 'delete', description: 'Delete session data', action: 'Delete session' },
                        { name: 'Get QR', value: 'getQr', description: 'Get QR code for session', action: 'Get QR code' },
                    ],
                    default: 'create',
                },
                // GROUP OPERATIONS
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: { show: { resource: ['group'] } },
                    options: [
                        { name: 'Get All', value: 'getAll', description: 'Get all groups', action: 'Get all groups' },
                        { name: 'Get Metadata', value: 'getMetadata', description: 'Get group metadata', action: 'Get group metadata' },
                    ],
                    default: 'getAll',
                },
                // CONTACT OPERATIONS
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: { show: { resource: ['contact'] } },
                    options: [
                        { name: 'Get Profile Picture', value: 'getProfilePicture', description: 'Get contact profile picture', action: 'Get profile picture' },
                    ],
                    default: 'getProfilePicture',
                },
                // SESSION ID FIELD
                {
                    displayName: 'Session ID',
                    name: 'sessionId',
                    type: 'string',
                    required: true,
                    default: 'default',
                    description: 'Session ID/name',
                    displayOptions: {
                        hide: { operation: ['getAll'] },
                    },
                },
                // SESSION NAME (for create)
                {
                    displayName: 'Session Name',
                    name: 'sessionName',
                    type: 'string',
                    default: '',
                    description: 'Friendly name for the session (optional)',
                    displayOptions: { show: { operation: ['create'] } },
                },
                // TO FIELD (recipient)
                {
                    displayName: 'To',
                    name: 'to',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: { operation: ['sendText', 'sendMedia', 'sendLocation', 'sendContact', 'markAsRead', 'typing', 'recording', 'paused'] },
                    },
                    default: '',
                    placeholder: '628123456789',
                    description: 'Phone number (without + or spaces) or group ID',
                },
                // MESSAGE FIELD
                {
                    displayName: 'Message',
                    name: 'message',
                    type: 'string',
                    required: true,
                    displayOptions: { show: { operation: ['sendText'] } },
                    default: '',
                    description: 'The text message to send',
                },
                // MEDIA FIELDS
                {
                    displayName: 'Media Type',
                    name: 'mediaType',
                    type: 'options',
                    displayOptions: { show: { operation: ['sendMedia'] } },
                    options: [
                        { name: 'Image', value: 'image/jpeg' },
                        { name: 'PNG Image', value: 'image/png' },
                        { name: 'Video', value: 'video/mp4' },
                        { name: 'Audio', value: 'audio/mpeg' },
                        { name: 'PDF Document', value: 'application/pdf' },
                        { name: 'Word Document', value: 'application/msword' },
                        { name: 'Excel', value: 'application/vnd.ms-excel' },
                        { name: 'Custom', value: 'custom' },
                    ],
                    default: 'image/jpeg',
                    description: 'Type of media to send',
                },
                {
                    displayName: 'Custom Mimetype',
                    name: 'customMimetype',
                    type: 'string',
                    displayOptions: { show: { mediaType: ['custom'] } },
                    default: '',
                    placeholder: 'image/gif',
                    description: 'Custom mimetype for the media',
                },
                {
                    displayName: 'Media Source',
                    name: 'mediaSource',
                    type: 'options',
                    displayOptions: { show: { operation: ['sendMedia'] } },
                    options: [
                        { name: 'URL', value: 'url' },
                        { name: 'Base64', value: 'base64' },
                    ],
                    default: 'url',
                    description: 'Source of the media file',
                },
                {
                    displayName: 'Media URL',
                    name: 'mediaUrl',
                    type: 'string',
                    required: true,
                    displayOptions: { show: { operation: ['sendMedia'], mediaSource: ['url'] } },
                    default: '',
                    description: 'URL of the media file',
                },
                {
                    displayName: 'Base64 Data',
                    name: 'base64Data',
                    type: 'string',
                    required: true,
                    displayOptions: { show: { operation: ['sendMedia'], mediaSource: ['base64'] } },
                    default: '',
                    description: 'Base64 encoded media data',
                },
                {
                    displayName: 'Caption',
                    name: 'caption',
                    type: 'string',
                    displayOptions: { show: { operation: ['sendMedia'] } },
                    default: '',
                    description: 'Caption for the media',
                },
                {
                    displayName: 'File Name',
                    name: 'fileName',
                    type: 'string',
                    displayOptions: { show: { operation: ['sendMedia'] } },
                    default: '',
                    description: 'File name for documents',
                },
                // LOCATION FIELDS
                {
                    displayName: 'Latitude',
                    name: 'latitude',
                    type: 'number',
                    required: true,
                    displayOptions: { show: { operation: ['sendLocation'] } },
                    default: 0,
                    description: 'Location latitude',
                },
                {
                    displayName: 'Longitude',
                    name: 'longitude',
                    type: 'number',
                    required: true,
                    displayOptions: { show: { operation: ['sendLocation'] } },
                    default: 0,
                    description: 'Location longitude',
                },
                {
                    displayName: 'Location Name',
                    name: 'locationName',
                    type: 'string',
                    displayOptions: { show: { operation: ['sendLocation'] } },
                    default: '',
                    description: 'Name of the location',
                },
                {
                    displayName: 'Address',
                    name: 'address',
                    type: 'string',
                    displayOptions: { show: { operation: ['sendLocation'] } },
                    default: '',
                    description: 'Address of the location',
                },
                // CONTACT FIELDS
                {
                    displayName: 'Contact Full Name',
                    name: 'contactFullName',
                    type: 'string',
                    required: true,
                    displayOptions: { show: { operation: ['sendContact'] } },
                    default: '',
                    description: 'Full name of the contact',
                },
                {
                    displayName: 'Contact Phone Number',
                    name: 'contactPhoneNumber',
                    type: 'string',
                    required: true,
                    displayOptions: { show: { operation: ['sendContact'] } },
                    default: '',
                    placeholder: '628123456789',
                    description: 'Phone number of the contact',
                },
                {
                    displayName: 'Contact Organization',
                    name: 'contactOrganization',
                    type: 'string',
                    displayOptions: { show: { operation: ['sendContact'] } },
                    default: '',
                    description: 'Organization of the contact',
                },
                // GROUP FIELDS
                {
                    displayName: 'Group ID',
                    name: 'groupId',
                    type: 'string',
                    required: true,
                    displayOptions: { show: { operation: ['getMetadata'] } },
                    default: '',
                    placeholder: '120363xxxxx@g.us',
                    description: 'WhatsApp Group ID',
                },
                // CONTACT CHAT ID (for profile picture)
                {
                    displayName: 'Chat ID',
                    name: 'chatId',
                    type: 'string',
                    required: true,
                    displayOptions: { show: { resource: ['contact'], operation: ['getProfilePicture'] } },
                    default: '',
                    placeholder: '628123456789',
                    description: 'Phone number or chat ID',
                },
                // MESSAGE IDS (for mark as read)
                {
                    displayName: 'Message IDs',
                    name: 'messageIds',
                    type: 'string',
                    required: true,
                    displayOptions: { show: { operation: ['markAsRead'] } },
                    default: '',
                    placeholder: 'msg1,msg2,msg3',
                    description: 'Comma-separated list of message IDs to mark as read',
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
        const baseUrl = credentials.baseUrl.replace(/\/$/, '');
        for (let i = 0; i < items.length; i++) {
            try {
                let endpoint = '';
                let method = 'POST';
                let body = {};
                if (resource === 'session') {
                    if (operation === 'getAll') {
                        endpoint = '/api/sessions';
                        method = 'GET';
                    }
                    else {
                        const sessionId = this.getNodeParameter('sessionId', i, 'default');
                        if (operation === 'create') {
                            const sessionName = this.getNodeParameter('sessionName', i, '');
                            endpoint = '/api/sessions';
                            method = 'POST';
                            body = { sessionId, name: sessionName || sessionId };
                        }
                        else if (operation === 'getInfo') {
                            endpoint = `/api/sessions/${sessionId}`;
                            method = 'GET';
                        }
                        else if (operation === 'stop') {
                            endpoint = `/api/sessions/${sessionId}/stop`;
                            method = 'POST';
                        }
                        else if (operation === 'restart') {
                            endpoint = `/api/sessions/${sessionId}/restart`;
                            method = 'POST';
                        }
                        else if (operation === 'delete') {
                            endpoint = `/api/sessions/${sessionId}`;
                            method = 'DELETE';
                        }
                        else if (operation === 'getQr') {
                            endpoint = `/api/sessions/${sessionId}/qr`;
                            method = 'GET';
                        }
                    }
                }
                else if (resource === 'message') {
                    const sessionId = this.getNodeParameter('sessionId', i, 'default');
                    const to = this.getNodeParameter('to', i);
                    if (operation === 'sendText') {
                        const message = this.getNodeParameter('message', i);
                        endpoint = '/api/send/text';
                        body = { sessionId, to, message };
                    }
                    else if (operation === 'sendMedia') {
                        const mediaType = this.getNodeParameter('mediaType', i);
                        const mediaSource = this.getNodeParameter('mediaSource', i);
                        const caption = this.getNodeParameter('caption', i, '');
                        const fileName = this.getNodeParameter('fileName', i, '');
                        const mimetype = mediaType === 'custom'
                            ? this.getNodeParameter('customMimetype', i)
                            : mediaType;
                        endpoint = '/api/send/media';
                        body = { sessionId, to, mimetype };
                        if (mediaSource === 'url') {
                            body.url = this.getNodeParameter('mediaUrl', i);
                        }
                        else {
                            body.base64 = this.getNodeParameter('base64Data', i);
                        }
                        if (caption)
                            body.caption = caption;
                        if (fileName)
                            body.fileName = fileName;
                    }
                    else if (operation === 'sendLocation') {
                        const latitude = this.getNodeParameter('latitude', i);
                        const longitude = this.getNodeParameter('longitude', i);
                        const locationName = this.getNodeParameter('locationName', i, '');
                        const address = this.getNodeParameter('address', i, '');
                        endpoint = '/api/send/location';
                        body = { sessionId, to, latitude, longitude };
                        if (locationName)
                            body.name = locationName;
                        if (address)
                            body.address = address;
                    }
                    else if (operation === 'sendContact') {
                        const fullName = this.getNodeParameter('contactFullName', i);
                        const phoneNumber = this.getNodeParameter('contactPhoneNumber', i);
                        const organization = this.getNodeParameter('contactOrganization', i, '');
                        endpoint = '/api/send/contact';
                        body = {
                            sessionId,
                            to,
                            contact: { fullName, phoneNumber, organization: organization || undefined },
                        };
                    }
                    else if (operation === 'markAsRead') {
                        const messageIdsStr = this.getNodeParameter('messageIds', i);
                        const messageIds = messageIdsStr.split(',').map(id => id.trim()).filter(id => id);
                        endpoint = '/api/send/read';
                        body = { sessionId, to, messageIds };
                    }
                }
                else if (resource === 'presence') {
                    const sessionId = this.getNodeParameter('sessionId', i, 'default');
                    const to = this.getNodeParameter('to', i, '');
                    let presence = 'available';
                    if (operation === 'typing')
                        presence = 'composing';
                    else if (operation === 'recording')
                        presence = 'recording';
                    else if (operation === 'online')
                        presence = 'available';
                    else if (operation === 'offline')
                        presence = 'unavailable';
                    else if (operation === 'paused')
                        presence = 'paused';
                    endpoint = '/api/send/presence';
                    body = { sessionId, presence };
                    if (to)
                        body.to = to;
                }
                else if (resource === 'group') {
                    const sessionId = this.getNodeParameter('sessionId', i, 'default');
                    if (operation === 'getAll') {
                        endpoint = `/api/sessions/${sessionId}/groups`;
                        method = 'GET';
                    }
                    else if (operation === 'getMetadata') {
                        const groupId = this.getNodeParameter('groupId', i);
                        endpoint = `/api/sessions/${sessionId}/groups/${groupId}`;
                        method = 'GET';
                    }
                }
                else if (resource === 'contact') {
                    const sessionId = this.getNodeParameter('sessionId', i, 'default');
                    if (operation === 'getProfilePicture') {
                        const chatId = this.getNodeParameter('chatId', i);
                        endpoint = `/api/sessions/${sessionId}/contacts/${chatId}/profile-picture`;
                        method = 'GET';
                    }
                }
                // Build request options
                const options = {
                    method,
                    url: `${baseUrl}${endpoint}`,
                    json: true,
                    headers: {},
                };
                if (method !== 'GET' && Object.keys(body).length > 0) {
                    options.body = body;
                }
                // Add authentication header
                if (credentials.apiKey) {
                    options.headers = {
                        'X-Device-Token': credentials.apiKey,
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
