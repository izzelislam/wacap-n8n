import {
  IHookFunctions,
  IWebhookFunctions,
  INodeType,
  INodeTypeDescription,
  IWebhookResponseData,
  IDataObject,
} from 'n8n-workflow';

export class WacapTrigger implements INodeType {
  description: INodeTypeDescription = {
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

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        return true;
      },
      async create(this: IHookFunctions): Promise<boolean> {
        return true;
      },
      async delete(this: IHookFunctions): Promise<boolean> {
        return true;
      },
    },
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const bodyData = this.getBodyData() as IDataObject;
    const event = this.getNodeParameter('event') as string;
    const sessionFilter = this.getNodeParameter('session', '') as string;

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
