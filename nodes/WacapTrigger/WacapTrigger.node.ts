import {
  ITriggerFunctions,
  INodeType,
  INodeTypeDescription,
  ITriggerResponse,
  IDataObject,
} from 'n8n-workflow';

import { WacapWrapper, WacapEventType } from '@pakor/wacap-wrapper';

export class WacapTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Wacap Trigger',
    name: 'wacapTrigger',
    icon: 'file:wacap.svg',
    group: ['trigger'],
    version: 1,
    subtitle: '={{$parameter["event"]}}',
    description: 'Trigger on WhatsApp events',
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
    properties: [
      {
        displayName: 'Event',
        name: 'event',
        type: 'options',
        options: [
          {
            name: 'Message Received',
            value: 'messageReceived',
            description: 'Triggers when a new message is received',
          },
          {
            name: 'Message Sent',
            value: 'messageSent',
            description: 'Triggers when a message is sent',
          },
          {
            name: 'Connection Open',
            value: 'connectionOpen',
            description: 'Triggers when connection opens',
          },
          {
            name: 'Connection Close',
            value: 'connectionClose',
            description: 'Triggers when connection closes',
          },
          {
            name: 'QR Code',
            value: 'qrCode',
            description: 'Triggers when QR code is generated',
          },
          {
            name: 'Group Participants Update',
            value: 'groupParticipantsUpdate',
            description: 'Triggers when group participants change',
          },
          {
            name: 'Presence Update',
            value: 'presenceUpdate',
            description: 'Triggers when presence updates',
          },
        ],
        default: 'messageReceived',
        description: 'The event to listen for',
      },
      {
        displayName: 'Auto Start Session',
        name: 'autoStart',
        type: 'boolean',
        default: true,
        description: 'Whether to automatically start the session when trigger activates',
      },
      {
        displayName: 'Filter Options',
        name: 'filterOptions',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: {
          show: {
            event: ['messageReceived'],
          },
        },
        options: [
          {
            displayName: 'Only From Me',
            name: 'onlyFromMe',
            type: 'boolean',
            default: false,
            description: 'Whether to only trigger on messages sent by you',
          },
          {
            displayName: 'Ignore From Me',
            name: 'ignoreFromMe',
            type: 'boolean',
            default: false,
            description: 'Whether to ignore messages sent by you',
          },
          {
            displayName: 'Only Groups',
            name: 'onlyGroups',
            type: 'boolean',
            default: false,
            description: 'Whether to only trigger on group messages',
          },
          {
            displayName: 'Only Private',
            name: 'onlyPrivate',
            type: 'boolean',
            default: false,
            description: 'Whether to only trigger on private messages',
          },
          {
            displayName: 'Filter By JID',
            name: 'filterByJid',
            type: 'string',
            default: '',
            description: 'Only trigger for specific JID (phone number or group)',
          },
        ],
      },
    ],
  };

  async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
    const credentials = await this.getCredentials('wacapApi');
    const event = this.getNodeParameter('event') as string;
    const autoStart = this.getNodeParameter('autoStart') as boolean;
    const filterOptions = this.getNodeParameter('filterOptions', {}) as IDataObject;

    const sessionId = credentials.sessionId as string;

    const wacap = new WacapWrapper({
      sessionsPath: credentials.sessionsPath as string || './sessions',
      storageAdapter: credentials.storageAdapter as 'sqlite' | 'prisma' || 'sqlite',
      autoDisplayQR: true,
    });

    await wacap.init();

    let session;
    if (autoStart) {
      session = await wacap.sessionStart(sessionId);
    } else {
      session = wacap.findSession(sessionId);
      if (!session) {
        throw new Error('Session not found. Enable "Auto Start Session" or start the session manually.');
      }
    }

    const eventManager = session.getEventManager();

    const manualTriggerFunction = async () => {
      this.emit([this.helpers.returnJsonArray([{ manual: true }])]);
    };

    const closeFunction = async () => {
      await wacap.sessionStop(sessionId).catch(() => {});
    };

    // Map event types
    const eventMap: { [key: string]: WacapEventType } = {
      messageReceived: WacapEventType.MESSAGE_RECEIVED,
      messageSent: WacapEventType.MESSAGE_SENT,
      connectionOpen: WacapEventType.CONNECTION_OPEN,
      connectionClose: WacapEventType.CONNECTION_CLOSE,
      qrCode: WacapEventType.QR_CODE,
      groupParticipantsUpdate: WacapEventType.GROUP_PARTICIPANTS_UPDATE,
      presenceUpdate: WacapEventType.PRESENCE_UPDATE,
    };

    const wacapEventType = eventMap[event];

    if (event === 'messageReceived') {
      eventManager.onMessageReceived((data) => {
        // Apply filters
        if (filterOptions.onlyFromMe && !data.isFromMe) return;
        if (filterOptions.ignoreFromMe && data.isFromMe) return;
        if (filterOptions.onlyGroups && !data.from?.includes('@g.us')) return;
        if (filterOptions.onlyPrivate && data.from?.includes('@g.us')) return;
        if (filterOptions.filterByJid && data.from !== filterOptions.filterByJid) return;

        this.emit([this.helpers.returnJsonArray([data as any])]);
      });
    } else if (event === 'messageSent') {
      eventManager.onMessageSent((data) => {
        this.emit([this.helpers.returnJsonArray([data as any])]);
      });
    } else if (event === 'connectionOpen') {
      eventManager.onConnectionOpen((data) => {
        this.emit([this.helpers.returnJsonArray([data as any])]);
      });
    } else if (event === 'connectionClose') {
      eventManager.onConnectionClose((data) => {
        this.emit([this.helpers.returnJsonArray([data as any])]);
      });
    } else if (event === 'qrCode') {
      eventManager.onQRCode((data) => {
        this.emit([this.helpers.returnJsonArray([data as any])]);
      });
    } else if (event === 'groupParticipantsUpdate') {
      eventManager.onGroupParticipantsUpdate((data) => {
        this.emit([this.helpers.returnJsonArray([data as any])]);
      });
    } else if (event === 'presenceUpdate') {
      eventManager.onPresenceUpdate((data) => {
        this.emit([this.helpers.returnJsonArray([data as any])]);
      });
    }

    return {
      closeFunction,
      manualTriggerFunction,
    };
  }
}
