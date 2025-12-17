"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WacapTrigger = void 0;
class WacapTrigger {
    constructor() {
        this.description = {
            displayName: 'Wacap Trigger',
            name: 'wacapTrigger',
            icon: 'file:wacap.svg',
            group: ['trigger'],
            version: 1,
            subtitle: '={{$parameter["event"]}}',
            description: 'Trigger on WhatsApp webhook events from Wacap API',
            defaults: {
                name: 'Wacap Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'wacapApi',
                    required: true,
                },
            ],
            webhooks: [
                {
                    name: 'default',
                    httpMethod: 'POST',
                    responseMode: 'onReceived',
                    path: 'webhook',
                },
            ],
            properties: [
                {
                    displayName: 'Event',
                    name: 'event',
                    type: 'options',
                    options: [
                        {
                            name: 'Message Received',
                            value: 'message.received',
                            description: 'Triggers when a new message is received',
                        },
                        {
                            name: 'Message Sent',
                            value: 'message.sent',
                            description: 'Triggers when a message is sent',
                        },
                        {
                            name: 'Session Connected',
                            value: 'session.connected',
                            description: 'Triggers when session connects successfully',
                        },
                        {
                            name: 'Session Disconnected',
                            value: 'session.disconnected',
                            description: 'Triggers when session disconnects',
                        },
                        {
                            name: 'Session QR',
                            value: 'session.qr',
                            description: 'Triggers when QR code is generated',
                        },
                        {
                            name: 'All Events',
                            value: 'all',
                            description: 'Triggers on any event',
                        },
                    ],
                    default: 'message.received',
                    description: 'The event to listen for',
                },
                {
                    displayName: 'Session Filter',
                    name: 'sessionFilter',
                    type: 'string',
                    default: '',
                    placeholder: 'my-session',
                    description: 'Filter events by session ID (leave empty for all sessions)',
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    placeholder: 'Add Option',
                    default: {},
                    options: [
                        {
                            displayName: 'Ignore From Me',
                            name: 'ignoreFromMe',
                            type: 'boolean',
                            default: true,
                            description: 'Whether to ignore messages sent by yourself',
                        },
                        {
                            displayName: 'Ignore Groups',
                            name: 'ignoreGroups',
                            type: 'boolean',
                            default: false,
                            description: 'Whether to ignore messages from groups',
                        },
                        {
                            displayName: 'Ignore Status/Broadcast',
                            name: 'ignoreStatus',
                            type: 'boolean',
                            default: true,
                            description: 'Whether to ignore status/broadcast messages',
                        },
                    ],
                },
            ],
        };
        this.webhookMethods = {
            default: {
                async checkExists() {
                    // Webhook is managed externally via Wacap API
                    return true;
                },
                async create() {
                    // Log webhook URL for user to register manually
                    const webhookUrl = this.getNodeWebhookUrl('default');
                    console.log(`[WacapTrigger] Webhook URL: ${webhookUrl}`);
                    console.log('[WacapTrigger] Register this URL in Wacap API: POST /api/webhooks');
                    return true;
                },
                async delete() {
                    return true;
                },
            },
        };
    }
    async webhook() {
        const bodyData = this.getBodyData();
        const event = this.getNodeParameter('event');
        const sessionFilter = this.getNodeParameter('sessionFilter', '');
        const options = this.getNodeParameter('options', {});
        const incomingEvent = bodyData.event;
        const incomingSession = bodyData.sessionId;
        const data = bodyData.data || {};
        // Filter by event type (unless 'all' is selected)
        if (event !== 'all' && incomingEvent !== event) {
            return { workflowData: [] };
        }
        // Filter by session
        if (sessionFilter && incomingSession !== sessionFilter) {
            return { workflowData: [] };
        }
        // Apply message filters for message events
        if (incomingEvent === 'message.received' || incomingEvent === 'message.sent') {
            // Ignore messages from self
            if (options.ignoreFromMe && data.isFromMe === true) {
                return { workflowData: [] };
            }
            // Ignore group messages
            if (options.ignoreGroups && data.isGroup === true) {
                return { workflowData: [] };
            }
            // Ignore status/broadcast messages
            if (options.ignoreStatus && data.isStatus === true) {
                return { workflowData: [] };
            }
        }
        // Build comprehensive output (WAHA-style)
        const output = {
            // Event metadata
            event: incomingEvent,
            timestamp: bodyData.timestamp || Date.now(),
            sessionId: incomingSession,
            // Flatten important fields for easy access
            ...(incomingEvent === 'message.received' || incomingEvent === 'message.sent' ? {
                // Message fields (flattened)
                messageId: data.id,
                from: data.from,
                to: data.to,
                // replyTo: Use this JID to reply to the message (handles LID conversion)
                replyTo: data.replyTo || data.from,
                // phoneNumber: Extracted phone number for convenience
                phoneNumber: data.phoneNumber,
                body: data.body,
                pushName: data.pushName,
                messageType: data.messageType,
                messageTimestamp: data.timestamp,
                isFromMe: data.isFromMe,
                isGroup: data.isGroup,
                isStatus: data.isStatus,
                isLid: data.isLid,
                participant: data.participant,
                // Media info
                hasMedia: data.hasMedia,
                media: data.mediaInfo,
                // Chat info
                chat: {
                    id: data.replyTo || data.from,
                    isGroup: data.isGroup,
                    participant: data.participant,
                },
                // Sender info
                sender: {
                    id: data.isGroup ? data.participant : data.from,
                    pushName: data.pushName,
                    phoneNumber: data.phoneNumber,
                },
            } : {}),
            // Session status fields
            ...(incomingEvent?.startsWith('session.') ? {
                status: data.status,
                phoneNumber: data.phoneNumber,
                userName: data.userName,
                error: data.error,
                qr: data.qr,
                qrBase64: data.qrBase64,
            } : {}),
            // Raw payload for advanced usage
            payload: bodyData,
        };
        return {
            workflowData: [this.helpers.returnJsonArray(output)],
        };
    }
}
exports.WacapTrigger = WacapTrigger;
