# n8n-nodes-wacap

n8n community node for WhatsApp integration using Wacap Docker API.

## Overview

This package provides n8n nodes that connect to a Wacap Docker API server for WhatsApp automation.

**Architecture:**
- n8n nodes (this package) → HTTP requests → Wacap Docker API → WhatsApp
- QR code scanning and session management handled by the Docker container

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

You need a **Wacap Docker** container running:

```bash
docker run -d \
  --name wacap \
  -p 3000:3000 \
  -v wacap_data:/app/data \
  -e JWT_SECRET=your-secret-key \
  bangfkr/wacap:latest
```

Or use docker-compose:
```yaml
version: '3.8'
services:
  wacap:
    image: bangfkr/wacap:latest
    ports:
      - "3000:3000"
    volumes:
      - wacap_data:/app/data
    environment:
      - JWT_SECRET=your-secret-key
volumes:
  wacap_data:
```

## Configuration

### 1. Get Device Token

1. Open Wacap Dashboard at `http://localhost:3000`
2. Register/Login to your account
3. Go to **Settings** → **API Usage**
4. Create a new Device Token
5. Copy the token

### 2. Setup Credentials in n8n

1. Go to **Credentials** → **New**
2. Search for "Wacap Docker API"
3. Configure:
   - **Base URL**: Your API server URL (e.g., `http://localhost:3000`)
   - **Device Token**: Paste the token from step 1

## Nodes

### Wacap (Action Node)

Perform WhatsApp operations via HTTP API.

#### Session Operations
- **Create**: Create/start a new WhatsApp session
- **Get Info**: Get session information
- **Get All**: List all sessions
- **Stop**: Stop a running session
- **Restart**: Restart a session
- **Delete**: Delete session data
- **Get QR**: Get QR code for pairing

#### Message Operations
- **Send Text**: Send text messages
- **Send Media**: Send image, video, audio, or document
- **Send Location**: Send GPS location with name and address
- **Send Contact**: Send contact card (vCard)
- **Mark as Read**: Mark messages as read (blue tick)

#### Presence Operations
- **Typing**: Show typing indicator
- **Recording**: Show recording indicator
- **Online**: Set status as online
- **Offline**: Set status as offline
- **Paused**: Stop typing indicator

#### Group Operations
- **Get All**: Fetch all groups for a session
- **Get Metadata**: Get group information

#### Contact Operations
- **Get Profile Picture**: Fetch contact's profile picture

### Wacap Trigger (Webhook Node)

Receive events from Wacap API server via webhooks.

**Events:**
- **Message**: New message received
- **Message Update**: Message status changed
- **Session Status**: Session connection status changed

## Usage Examples

### Create Session

**Node:** Wacap  
**Resource:** Session  
**Operation:** Create  
**Session ID:** `my-session`

### Send Text Message

**Node:** Wacap  
**Resource:** Message  
**Operation:** Send Text  
**Fields:**
- Session ID: `my-session`
- To: `628123456789`
- Message: `Hello from n8n!`

### Send Image

**Node:** Wacap  
**Resource:** Message  
**Operation:** Send Media  
**Fields:**
- Session ID: `my-session`
- To: `628123456789`
- Media Type: `Image`
- Media Source: `URL`
- Media URL: `https://example.com/image.jpg`
- Caption: `Check this out!`

### Send Location

**Node:** Wacap  
**Resource:** Message  
**Operation:** Send Location  
**Fields:**
- Session ID: `my-session`
- To: `628123456789`
- Latitude: `-6.2088`
- Longitude: `106.8456`
- Location Name: `Jakarta`
- Address: `Indonesia`

### Send Contact Card

**Node:** Wacap  
**Resource:** Message  
**Operation:** Send Contact  
**Fields:**
- Session ID: `my-session`
- To: `628123456789`
- Contact Full Name: `John Doe`
- Contact Phone Number: `628987654321`
- Contact Organization: `Company Inc`

### Show Typing Before Reply

**Node:** Wacap  
**Resource:** Presence  
**Operation:** Typing  
**Fields:**
- Session ID: `my-session`
- To: `628123456789`

### Mark Messages as Read

**Node:** Wacap  
**Resource:** Message  
**Operation:** Mark as Read  
**Fields:**
- Session ID: `my-session`
- To: `628123456789`
- Message IDs: `msg1,msg2,msg3`

### Auto-Reply Workflow with Typing

```
[Wacap Trigger: Message]
  ↓
[Wacap: Typing] → Show typing indicator
  ↓
[Wait: 2 seconds]
  ↓
[Wacap: Send Text] → "Hi there!"
  ↓
[Wacap: Mark as Read] → Mark incoming message as read
```

## Phone Number Format

- Use phone number without `+` or spaces
- Example: `628123456789` (Indonesia)
- For groups: Use group ID like `120363xxxxx@g.us`

## API Endpoints Used

The nodes make requests to these endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/sessions` | GET | List all sessions |
| `/api/sessions` | POST | Create session |
| `/api/sessions/:id` | GET | Get session info |
| `/api/sessions/:id` | DELETE | Delete session |
| `/api/sessions/:id/stop` | POST | Stop session |
| `/api/sessions/:id/restart` | POST | Restart session |
| `/api/sessions/:id/qr` | GET | Get QR code |
| `/api/send/text` | POST | Send text message |
| `/api/send/media` | POST | Send media |
| `/api/send/location` | POST | Send location |
| `/api/send/contact` | POST | Send contact |
| `/api/sessions/:id/groups` | GET | Get groups |
| `/api/sessions/:id/groups/:groupId` | GET | Get group metadata |
| `/api/send/presence` | POST | Send presence (typing, online) |
| `/api/send/read` | POST | Mark messages as read |

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

- Docker Hub: https://hub.docker.com/r/bangfkr/wacap
- GitHub: https://github.com/izzelislam/wacapp
