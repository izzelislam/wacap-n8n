# n8n-nodes-wacap

n8n community node for WhatsApp integration using Wacap wrapper (Baileys v7.0.0-rc.8)

## Overview

This package provides n8n nodes that connect to an external Wacap HTTP API server. The nodes act as HTTP clients to interact with WhatsApp through the API.

**Architecture:**
- n8n nodes (this package) → HTTP requests → Wacap API Server → WhatsApp
- Similar to how [n8n-nodes-waha](https://github.com/devlikeapro/n8n-nodes-waha) connects to WAHA server
- QR code scanning and session management handled by the API server, not in n8n

## Installation

### In n8n

```bash
cd ~/.n8n/custom
npm install n8n-nodes-wacap
```

Restart n8n:
```bash
n8n start
```

## Prerequisites

You need a **Wacap API Server** running separately from n8n:

1. The API server handles WhatsApp connections, QR scanning, and sessions
2. Example: `http://localhost:3000`
3. The n8n nodes make HTTP requests to this server

## Configuration

### 1. Setup Credentials

1. Go to **Credentials** → **New**
2. Search for "Wacap HTTP API"
3. Configure:
   - **Base URL**: Your API server URL (e.g., `http://localhost:3000`)
   - **API Key**: Optional authentication key

### 2. Test Connection

The credential will automatically test the connection to `/api/sessions`

## Nodes

### Wacap (Action Node)

Perform WhatsApp operations via HTTP API.

**Resources:**

#### Session
- **Start**: Create/start a WhatsApp session
- **Stop**: Stop a running session
- **Get Info**: Get session information
- **Delete**: Delete session data

#### Message
- **Send Text**: Send text messages
- **Send Media**: Send image, video, audio, or document
- **Send Location**: Send GPS location

#### Presence
- **Send Typing**: Show typing indicator
- **Send Recording**: Show recording indicator
- **Send Available**: Set as available

#### Group
- **Get All**: Fetch all groups
- **Get Metadata**: Get group information

#### Contact
- **Get Profile Picture**: Fetch contact's profile picture

### Wacap Trigger (Webhook Node)

Receive events from Wacap API server via webhooks.

**Events:**
- **Message**: New message received
- **Message Update**: Message status changed
- **Session Status**: Session connection status changed

**Filters:**
- **Session Name**: Filter by specific session (or leave empty for all)

## Usage Examples

### Start Session

**Node:** Wacap  
**Resource:** Session  
**Operation:** Start  
**Session:** `default`

### Send Text Message

**Node:** Wacap  
**Resource:** Message  
**Operation:** Send Text  
**Fields:**
- Session: `default`
- Chat ID: `6281234567890@c.us`
- Message: `Hello from n8n!`

### Send Image

**Node:** Wacap  
**Resource:** Message  
**Operation:** Send Media  
**Fields:**
- Session: `default`
- Chat ID: `6281234567890@c.us`
- Media Type: `Image`
- Media URL: `https://example.com/image.jpg`
- Caption: `Check this out!`

### Receive Messages (Webhook)

**Node:** Wacap Trigger  
**Event:** Message  
**Session Name:** `default` (or leave empty)

**Webhook URL:** Copy the webhook URL from the trigger node

**Configure in API Server:** Send webhook events to this URL

### Auto-Reply Workflow

```
[Wacap Trigger: Message]
  ↓
[IF: message contains "hello"]
  ↓ true
[Wacap: Send Text] → "Hi there!"
```

### Send Daily Report

```
[Schedule Trigger: Every day 9 AM]
  ↓
[Function: Generate report]
  ↓
[Wacap: Send Text] → Group/Contact
```

## Chat ID Format

- **Individual**: `6281234567890@c.us` (phone number + @c.us)
- **Group**: `120363xxxxx@g.us` (group ID + @g.us)

Note: Different from JID format (@s.whatsapp.net), this uses the simplified format.

## API Endpoints Used

The nodes make requests to these endpoints:

- `POST /api/sessions` - Start session
- `DELETE /api/sessions/:session` - Stop session
- `GET /api/sessions/:session` - Get session info
- `POST /api/sendText` - Send text message
- `POST /api/sendImage` - Send image
- `POST /api/sendVideo` - Send video
- `POST /api/sendAudio` - Send audio
- `POST /api/sendDocument` - Send document
- `POST /api/sendLocation` - Send location
- `POST /api/sendPresence` - Send presence update
- `GET /api/sessions/:session/groups` - Get groups
- `GET /api/sessions/:session/groups/:groupId` - Get group metadata
- `GET /api/sessions/:session/contacts/:chatId/profile-picture` - Get profile picture

## Comparison with Direct Integration

| Feature | This Package | Direct Wrapper |
|---------|-------------|----------------|
| Architecture | HTTP Client → API Server | Direct Library Integration |
| QR Scanning | In API Server | In n8n Workflow |
| Session Management | External Server | In n8n Process |
| Scalability | High (separate server) | Limited (in n8n) |
| Multi-instance | Yes (via API server) | Complex |
| Best for | Production, Multiple n8n instances | Single n8n instance |

## Error Handling

- Nodes will show error messages from the API server
- Enable "Continue on Fail" in node settings to handle errors gracefully
- Check API server logs for detailed debugging

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev
```

## License

MIT

## Links

- GitHub: https://github.com/izzelislam/wacapp
- Wacap Wrapper: https://www.npmjs.com/package/@pakor/wacap-wrapper
- Baileys: https://github.com/WhiskeySockets/Baileys
