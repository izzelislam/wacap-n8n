# n8n-nodes-wacap

n8n community node for WhatsApp integration using Wacap wrapper (Baileys v7.0.0-rc.8)

## Features

✅ **Send Messages** - Text, media (image, video, audio, document), location
✅ **Receive Messages** - Webhook trigger for incoming messages  
✅ **Presence Updates** - Typing, recording, available indicators
✅ **Session Management** - Start, stop, get info, delete sessions
✅ **Group Operations** - Get all groups, group metadata
✅ **Contact Operations** - Get profile pictures
✅ **Event Triggers** - QR code, connection status, group updates, presence
✅ **Multi-Session Support** - Manage multiple WhatsApp accounts
✅ **Flexible Storage** - SQLite or Prisma (MySQL/PostgreSQL)

## Installation

### Install in n8n

#### Using npm

```bash
cd ~/.n8n/custom
npm install n8n-nodes-wacap
```

#### Using pnpm (n8n default)

```bash
cd ~/.n8n/custom
pnpm install n8n-nodes-wacap
```

### Restart n8n

```bash
n8n start
```

## Credentials Setup

1. In n8n, go to **Credentials** → **New**
2. Search for "Wacap API"
3. Configure:
   - **Session ID**: Unique identifier (e.g., "my-whatsapp")
   - **Sessions Path**: Directory for session data (default: `./sessions`)
   - **Storage Adapter**: Choose SQLite or Prisma

## Usage

### 1. Start Session & Get QR Code

**Nodes:**
- Wacap Trigger (QR Code event)
- Wacap (Session → Start)

**Workflow:**
```
[Wacap Trigger: QR Code] → [Display/Send QR]
```

The QR code will be in the trigger output: `data.qr`

### 2. Send Text Message

**Node:** Wacap  
**Resource:** Message  
**Operation:** Send Text

**Fields:**
- Phone Number (JID): `6281234567890@s.whatsapp.net`
- Message: Your text message
- Additional Options:
  - Mentions: `6281234567890@s.whatsapp.net, 6289876543210@s.whatsapp.net`

### 3. Send Media

**Node:** Wacap  
**Resource:** Message  
**Operation:** Send Media

**Fields:**
- Phone Number (JID): `6281234567890@s.whatsapp.net`
- Media Type: Image / Video / Audio / Document
- Media URL: URL to media file
- Caption: Optional caption
- File Name: For documents

### 4. Receive Messages (Webhook)

**Node:** Wacap Trigger  
**Event:** Message Received

**Filter Options:**
- Only From Me: false
- Ignore From Me: true (recommended for bots)
- Only Groups: false
- Only Private: false
- Filter By JID: Leave empty or specify JID

**Output:**
```json
{
  "sessionId": "my-session",
  "timestamp": "2025-11-20T10:00:00.000Z",
  "message": {...},
  "isFromMe": false,
  "messageType": "conversation",
  "body": "Hello!",
  "from": "6281234567890@s.whatsapp.net"
}
```

### 5. Typing Indicator

**Node:** Wacap  
**Resource:** Presence  
**Operation:** Send Typing

**Fields:**
- Phone Number (JID): `6281234567890@s.whatsapp.net`

### 6. Get All Groups

**Node:** Wacap  
**Resource:** Group  
**Operation:** Get All

**Output:**
```json
{
  "groups": [
    {
      "id": "120363xxxxx@g.us",
      "subject": "Group Name",
      "participants": [...]
    }
  ]
}
```

## Example Workflows

### Auto-Reply Bot

```
[Wacap Trigger: Message Received]
  ↓ (filter: ignoreFromMe = true)
[If: message contains "ping"]
  ↓ true
[Wacap: Send Text] → "Pong! 🏓"
```

### Send Daily Report

```
[Schedule Trigger: Every day at 9 AM]
  ↓
[Generate Report]
  ↓
[Wacap: Send Text] → Group/Contact
```

### Forward Messages to Webhook

```
[Wacap Trigger: Message Received]
  ↓
[HTTP Request: POST to webhook]
```

## JID Format

- **Phone Numbers**: `6281234567890@s.whatsapp.net`
- **Groups**: `120363xxxxx@g.us`

## Storage Options

### SQLite (Default)
- Zero configuration
- Good for single instance
- Data stored in `./sessions/wacap.db`

### Prisma (MySQL/PostgreSQL)
- For production/scaling
- Requires setup:
  1. Create database
  2. Configure connection
  3. Run migrations
  4. Set credentials to use Prisma

## Available Events (Triggers)

| Event | Description |
|-------|-------------|
| Message Received | New incoming message |
| Message Sent | Message sent successfully |
| Connection Open | WhatsApp connected |
| Connection Close | WhatsApp disconnected |
| QR Code | QR code generated (scan to login) |
| Group Participants Update | Someone joined/left group |
| Presence Update | Contact online/offline/typing |

## Troubleshooting

**QR Code not scanning?**
- Use Wacap Trigger with QR Code event
- Scan quickly (QR expires in ~20 seconds)
- Ensure phone has internet connection

**Session not connecting?**
- Check credentials (Session ID, path)
- Delete old session data if corrupted
- Start session before using other operations

**Messages not sending?**
- Ensure session is connected
- Check JID format
- Verify phone number is on WhatsApp

**Trigger not firing?**
- Enable "Auto Start Session"
- Check filter options
- Verify session is active

## Advanced Usage

### Custom Workflows with Raw Socket

The node provides access to all Baileys features. For advanced operations not directly supported, you can:

1. Use Function node with Wacap output
2. Access raw socket via the wrapper
3. Call any Baileys method

## License

MIT

## Support

- GitHub Issues: https://github.com/izzelislam/wacapp/issues
- Documentation: https://github.com/izzelislam/wacapp

## Credits

Built on top of:
- [@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys) - WhatsApp Web API
- [@pakor/wacap-wrapper](https://www.npmjs.com/package/@pakor/wacap-wrapper) - TypeScript wrapper
