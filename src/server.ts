/**
 * Shared MCP Server — used by both Node.js (index.ts) and CF Worker (worker.ts)
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { SlackClient } from './slack-client.js';
import { TOOLS } from './tools.js';

export interface SlackMcpConfig {
  botToken: string;
}

export function handleToolCall(
  toolName: string,
  args: Record<string, unknown>,
  client: SlackClient
) {
  // Strip _fields param (Smithery quality — not a Slack API param)
  const { _fields, ...params } = args;

  switch (toolName) {
    // ========== Messages (7) ==========
    case 'slack_send_message': {
      const { channel, text, ...opts } = params;
      return client.postMessage(channel as string, text as string, opts);
    }
    case 'slack_update_message': {
      const { channel, ts, ...opts } = params;
      return client.updateMessage(channel as string, ts as string, opts);
    }
    case 'slack_delete_message':
      return client.deleteMessage(params.channel as string, params.ts as string);
    case 'slack_schedule_message': {
      const { channel, post_at, text, ...opts } = params;
      return client.scheduleMessage(channel as string, post_at as number, text as string, opts);
    }
    case 'slack_delete_scheduled_message':
      return client.deleteScheduledMessage(
        params.channel as string,
        params.scheduled_message_id as string
      );
    case 'slack_list_scheduled_messages': {
      const { ...opts } = params;
      return client.listScheduledMessages(Object.keys(opts).length ? opts : undefined);
    }
    case 'slack_get_permalink':
      return client.getPermalink(params.channel as string, params.message_ts as string);

    // ========== Conversations (10) ==========
    case 'slack_list_channels': {
      const { ...opts } = params;
      return client.listChannels(Object.keys(opts).length ? opts : undefined);
    }
    case 'slack_get_channel_info': {
      const { channel, ...opts } = params;
      return client.getChannelInfo(channel as string, Object.keys(opts).length ? opts : undefined);
    }
    case 'slack_get_channel_history': {
      const { channel, ...opts } = params;
      return client.getChannelHistory(channel as string, Object.keys(opts).length ? opts : undefined);
    }
    case 'slack_get_thread_replies': {
      const { channel, ts, ...opts } = params;
      return client.getThreadReplies(channel as string, ts as string, Object.keys(opts).length ? opts : undefined);
    }
    case 'slack_get_channel_members': {
      const { channel, ...opts } = params;
      return client.getChannelMembers(channel as string, Object.keys(opts).length ? opts : undefined);
    }
    case 'slack_create_channel': {
      const { name, ...opts } = params;
      return client.createChannel(name as string, Object.keys(opts).length ? opts : undefined);
    }
    case 'slack_archive_channel':
      return client.archiveChannel(params.channel as string);
    case 'slack_invite_to_channel':
      return client.inviteToChannel(params.channel as string, params.users as string);
    case 'slack_kick_from_channel':
      return client.kickFromChannel(params.channel as string, params.user as string);
    case 'slack_join_channel':
      return client.joinChannel(params.channel as string);
    case 'slack_set_channel_topic':
      return client.setChannelTopic(params.channel as string, params.topic as string);
    case 'slack_open_conversation': {
      const { users, ...opts } = params;
      return client.openConversation(users as string, Object.keys(opts).length ? opts : undefined);
    }

    // ========== Users (2) ==========
    case 'slack_list_users': {
      const { ...opts } = params;
      return client.listUsers(Object.keys(opts).length ? opts : undefined);
    }
    case 'slack_get_user_info': {
      const { user, ...opts } = params;
      return client.getUserInfo(user as string, Object.keys(opts).length ? opts : undefined);
    }

    // ========== Reactions (3) ==========
    case 'slack_add_reaction':
      return client.addReaction(
        params.channel as string,
        params.timestamp as string,
        params.name as string
      );
    case 'slack_remove_reaction':
      return client.removeReaction(
        params.channel as string,
        params.timestamp as string,
        params.name as string
      );
    case 'slack_get_reactions':
      return client.getReactions(params.channel as string, params.timestamp as string);

    // ========== Search (2) ==========
    case 'slack_search_messages': {
      const { query, ...opts } = params;
      return client.searchMessages(query as string, Object.keys(opts).length ? opts : undefined);
    }
    case 'slack_search_files': {
      const { query, ...opts } = params;
      return client.searchFiles(query as string, Object.keys(opts).length ? opts : undefined);
    }

    // ========== Files (3) ==========
    case 'slack_upload_file': {
      const { content, filename, channel_id, initial_comment, thread_ts } = params;
      return client.uploadFile(content as string, filename as string, {
        channel_id: channel_id as string | undefined,
        initial_comment: initial_comment as string | undefined,
        thread_ts: thread_ts as string | undefined,
      });
    }
    case 'slack_list_files': {
      const { ...opts } = params;
      return client.listFiles(Object.keys(opts).length ? opts : undefined);
    }
    case 'slack_delete_file':
      return client.deleteFile(params.file as string);

    // ========== Pins (3) ==========
    case 'slack_pin_message':
      return client.pinMessage(params.channel as string, params.timestamp as string);
    case 'slack_unpin_message':
      return client.unpinMessage(params.channel as string, params.timestamp as string);
    case 'slack_list_pins':
      return client.listPins(params.channel as string);

    // ========== Bookmarks (4) ==========
    case 'slack_add_bookmark': {
      const { channel_id, title, link, ...opts } = params;
      return client.addBookmark(
        channel_id as string,
        title as string,
        link as string,
        Object.keys(opts).length ? opts : undefined
      );
    }
    case 'slack_edit_bookmark': {
      const { bookmark_id, channel_id, ...opts } = params;
      return client.editBookmark(
        bookmark_id as string,
        channel_id as string,
        Object.keys(opts).length ? opts : undefined
      );
    }
    case 'slack_remove_bookmark':
      return client.removeBookmark(params.bookmark_id as string, params.channel_id as string);
    case 'slack_list_bookmarks':
      return client.listBookmarks(params.channel_id as string);

    // ========== Team (1) ==========
    case 'slack_get_team_info': {
      const { ...opts } = params;
      return client.getTeamInfo(Object.keys(opts).length ? opts : undefined);
    }

    // ========== Emoji (1) ==========
    case 'slack_list_emoji': {
      const { ...opts } = params;
      return client.listEmoji(Object.keys(opts).length ? opts : undefined);
    }

    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}

export function createServer(config?: SlackMcpConfig) {
  const server = new McpServer({
    name: 'slack-mcp',
    version: '1.0.0',
  });

  let client: SlackClient | null = null;

  // Register all 38 tools with annotations
  for (const tool of TOOLS) {
    server.registerTool(
      tool.name,
      {
        description: tool.description,
        inputSchema: tool.inputSchema as any,
        annotations: tool.annotations,
      },
      async (args: Record<string, unknown>) => {
        const botToken =
          config?.botToken ||
          (args as Record<string, unknown>).SLACK_BOT_TOKEN as string;

        if (!botToken) {
          return {
            content: [{ type: 'text' as const, text: 'Error: SLACK_BOT_TOKEN is required. Set it as an environment variable or pass via config.' }],
            isError: true,
          };
        }

        if (!client || config?.botToken !== botToken) {
          client = new SlackClient({ botToken });
        }

        try {
          const result = await handleToolCall(tool.name, args, client);
          return {
            content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            isError: false,
          };
        } catch (error) {
          return {
            content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
            isError: true,
          };
        }
      }
    );
  }

  // Register prompts
  server.prompt(
    'send-and-manage-messages',
    'Guide for sending and managing Slack messages',
    async () => {
      return {
        messages: [{
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: [
              'You are a Slack workspace assistant. Help me send and manage messages.',
              '',
              'Available message tools:',
              '1. **Send** — slack_send_message with channel + text (supports Block Kit via blocks param)',
              '2. **Reply in thread** — slack_send_message with thread_ts parameter',
              '3. **Update** — slack_update_message with channel + ts + new text/blocks',
              '4. **Delete** — slack_delete_message with channel + ts',
              '5. **Schedule** — slack_schedule_message with channel + post_at (Unix) + text',
              '6. **Get permalink** — slack_get_permalink with channel + message_ts',
              '',
              'Tips:',
              '- Always include "text" even when using "blocks" (used as notification fallback)',
              '- Use mrkdwn formatting: *bold*, _italic_, ~strikethrough~, `code`, ```code block```',
              '- Channel IDs start with C (public), G (private), D (DM)',
              '',
              'Start by listing channels with slack_list_channels.',
            ].join('\n'),
          },
        }],
      };
    },
  );

  server.prompt(
    'search-and-navigate',
    'Guide for searching messages/files and navigating channels',
    async () => {
      return {
        messages: [{
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: [
              'You are a Slack search and navigation assistant.',
              '',
              'Available tools:',
              '1. **Search messages** — slack_search_messages with query (supports in:#channel, from:@user, has:reaction)',
              '2. **Search files** — slack_search_files with query',
              '3. **List channels** — slack_list_channels (filter by types: public_channel, private_channel, im, mpim)',
              '4. **Channel history** — slack_get_channel_history with channel ID',
              '5. **Thread replies** — slack_get_thread_replies with channel + ts',
              '6. **Channel members** — slack_get_channel_members',
              '7. **User info** — slack_get_user_info with user ID',
              '8. **Team info** — slack_get_team_info for workspace details',
              '',
              'Search modifiers: in:#channel, from:@user, has:reaction, before:YYYY-MM-DD, after:YYYY-MM-DD',
              '',
              'Note: Free plan limits message history to 90 days.',
            ].join('\n'),
          },
        }],
      };
    },
  );

  // Register resources
  server.resource(
    'server-info',
    'slack://server-info',
    {
      description: 'Connection status and available tools for this Slack MCP server',
      mimeType: 'application/json',
    },
    async () => {
      return {
        contents: [{
          uri: 'slack://server-info',
          mimeType: 'application/json',
          text: JSON.stringify({
            name: 'slack-mcp',
            version: '1.0.0',
            connected: !!config,
            tools_available: TOOLS.length,
            tool_categories: {
              messages: 7,
              conversations: 10,
              users: 2,
              reactions: 3,
              search: 2,
              files: 3,
              pins: 3,
              bookmarks: 4,
              team: 1,
              emoji: 1,
            },
          }, null, 2),
        }],
      };
    },
  );

  // Override tools/list handler to return raw JSON Schema with property descriptions.
  // McpServer's Zod processing strips raw JSON Schema properties, returning empty schemas.
  (server as any).server.setRequestHandler(ListToolsRequestSchema, () => ({
    tools: TOOLS.map(tool => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
      annotations: tool.annotations,
    })),
  }));

  return server;
}
