# Slack MCP Server

[![npm version](https://img.shields.io/npm/v/@node2flow/slack-mcp.svg)](https://www.npmjs.com/package/@node2flow/slack-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

MCP (Model Context Protocol) server for Slack Web API. Send messages, manage channels, search content, handle files, and more through 38 tools.

Works with Claude Desktop, Cursor, VS Code, and any MCP client.

---

## Quick Start

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": ["-y", "@node2flow/slack-mcp"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-bot-token"
      }
    }
  }
}
```

### Cursor / VS Code

Add to MCP settings:

```json
{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": ["-y", "@node2flow/slack-mcp"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-bot-token"
      }
    }
  }
}
```

### HTTP Mode (Streamable HTTP)

For remote deployment or shared access:

```bash
SLACK_BOT_TOKEN=xoxb-xxx npx @node2flow/slack-mcp --http
```

Server starts on port 3000 (configurable via `PORT` env var). MCP endpoint: `http://localhost:3000/mcp`

---

## Configuration

| Environment Variable | Required | Description |
|---|---|---|
| `SLACK_BOT_TOKEN` | Yes | Slack Bot User OAuth Token (`xoxb-...`) |
| `PORT` | No | Port for HTTP server (default: `3000`, only used with `--http`) |

---

## All Tools (38 tools)

### Messages (7 tools)

| Tool | Description |
|---|---|
| `slack_send_message` | Send a message to a channel or DM |
| `slack_update_message` | Update an existing message |
| `slack_delete_message` | Delete a message |
| `slack_schedule_message` | Schedule a message for later |
| `slack_delete_scheduled_message` | Cancel a scheduled message |
| `slack_list_scheduled_messages` | List pending scheduled messages |
| `slack_get_permalink` | Get permanent URL for a message |

### Conversations (12 tools)

| Tool | Description |
|---|---|
| `slack_list_channels` | List channels in workspace |
| `slack_get_channel_info` | Get channel details |
| `slack_get_channel_history` | Get messages from a channel |
| `slack_get_thread_replies` | Get replies in a thread |
| `slack_get_channel_members` | List members of a channel |
| `slack_create_channel` | Create a new channel |
| `slack_archive_channel` | Archive a channel |
| `slack_invite_to_channel` | Invite users to a channel |
| `slack_kick_from_channel` | Remove a user from a channel |
| `slack_join_channel` | Join a public channel |
| `slack_set_channel_topic` | Set the channel topic |
| `slack_open_conversation` | Open or resume a DM/group DM |

### Users (2 tools)

| Tool | Description |
|---|---|
| `slack_list_users` | List all workspace members |
| `slack_get_user_info` | Get user profile details |

### Reactions (3 tools)

| Tool | Description |
|---|---|
| `slack_add_reaction` | Add emoji reaction to a message |
| `slack_remove_reaction` | Remove emoji reaction |
| `slack_get_reactions` | Get reactions on a message |

### Search (2 tools)

| Tool | Description |
|---|---|
| `slack_search_messages` | Search messages (supports `in:#channel from:@user has:reaction`) |
| `slack_search_files` | Search files in workspace |

### Files (3 tools)

| Tool | Description |
|---|---|
| `slack_upload_file` | Upload text content as a file |
| `slack_list_files` | List files in workspace |
| `slack_delete_file` | Delete a file |

### Pins (3 tools)

| Tool | Description |
|---|---|
| `slack_pin_message` | Pin a message to a channel |
| `slack_unpin_message` | Unpin a message |
| `slack_list_pins` | List pinned items in a channel |

### Bookmarks (4 tools)

| Tool | Description |
|---|---|
| `slack_add_bookmark` | Add a bookmark link to a channel |
| `slack_edit_bookmark` | Edit a bookmark |
| `slack_remove_bookmark` | Remove a bookmark |
| `slack_list_bookmarks` | List bookmarks in a channel |

### Team (1 tool)

| Tool | Description |
|---|---|
| `slack_get_team_info` | Get workspace/team information |

### Emoji (1 tool)

| Tool | Description |
|---|---|
| `slack_list_emoji` | List custom emoji in workspace |

---

## Requirements

- **Node.js** 18+
- **Slack Bot Token** (`xoxb-...`)

### How to Create a Slack App and Get Bot Token

1. Go to [api.slack.com/apps](https://api.slack.com/apps) and click **Create New App**
2. Choose **From scratch**, enter a name, and select your workspace
3. Go to **OAuth & Permissions** in the sidebar
4. Under **Bot Token Scopes**, add these scopes:

```
bookmarks:read        bookmarks:write       channels:history
channels:join         channels:manage       channels:read
chat:write            chat:write.public     emoji:read
files:read            files:write           groups:history
groups:read           groups:write          im:history
im:read               im:write              mpim:history
mpim:read             mpim:write            pins:read
pins:write            reactions:read        reactions:write
search:read           team:read             users:read
```

5. Click **Install to Workspace** and authorize
6. Copy the **Bot User OAuth Token** (starts with `xoxb-`)
7. Use it as `SLACK_BOT_TOKEN`

> **Note**: Search tools (`slack_search_messages`, `slack_search_files`) require a **User Token** (`xoxp-...`) instead of a Bot Token. If you only need search, add a User Token scope for `search:read`.

> **Free Plan Limitation**: Slack Free plan limits message history to 90 days and allows max 10 app integrations.

---

## For Developers

```bash
git clone https://github.com/node2flow-th/slack-mcp-community.git
cd slack-mcp-community
npm install
npm run build

# Run in stdio mode
SLACK_BOT_TOKEN=xoxb-xxx npm start

# Run in HTTP mode
SLACK_BOT_TOKEN=xoxb-xxx npm start -- --http
```

---

## License

MIT License - see [LICENSE](LICENSE)

Copyright (c) 2026 [Node2Flow](https://node2flow.net)

## Links

- [npm Package](https://www.npmjs.com/package/@node2flow/slack-mcp)
- [Slack Web API](https://api.slack.com/web)
- [MCP Protocol](https://modelcontextprotocol.io/)
- [Node2Flow](https://node2flow.net)
