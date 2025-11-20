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
                            name: 'Message',
                            value: 'message',
                            description: 'Triggers when a new message is received',
                        },
                        {
                            name: 'Message Update',
                            value: 'message.update',
                            description: 'Triggers when a message is updated',
                        },
                        {
                            name: 'Session Status',
                            value: 'session.status',
                            description: 'Triggers when session status changes',
                        },
                    ],
                    default: 'message',
                    description: 'The event to listen for',
                },
                {
                    displayName: 'Session Name',
                    name: 'session',
                    type: 'string',
                    default: 'default',
                    description: 'Session name to filter events (leave empty for all sessions)',
                },
            ],
        };
        this.webhookMethods = {
            default: {
                async checkExists() {
                    return true;
                },
                async create() {
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
        const sessionFilter = this.getNodeParameter('session', '');
        // Filter by event type
        if (bodyData.event && bodyData.event !== event) {
            return {
                workflowData: [],
            };
        }
        // Filter by session
        if (sessionFilter && bodyData.session !== sessionFilter) {
            return {
                workflowData: [],
            };
        }
        return {
            workflowData: [this.helpers.returnJsonArray(bodyData)],
        };
    }
}
exports.WacapTrigger = WacapTrigger;
