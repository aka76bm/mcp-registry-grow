import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { MCPRegistry } from '../src/core/registry.js';
import axios from 'axios';

describe('MCPRegistry', () => {
  let registry: MCPRegistry;

  beforeEach(() => {
    registry = new MCPRegistry();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('discoverServers', () => {
    it('should discover servers from GitHub', async () => {
      const mockResponse = {
        data: {
          items: [
            {
              name: 'test-repo',
              description: 'A test MCP server',
              html_url: 'https://github.com/test/test-repo',
              stargazers_count: 10,
              updated_at: new Date().toISOString(),
              language: 'TypeScript',
            },
          ],
        },
      };
      const axiosGetSpy = jest.spyOn(axios, 'get').mockResolvedValue(mockResponse);

      const servers = await registry.discoverServers();

      expect(servers).toHaveLength(1);
      expect(servers[0].name).toBe('test-repo');
      expect(axiosGetSpy).toHaveBeenCalledWith(
        'https://api.github.com/search/repositories?q=mcp+topic:mcp&per_page=10'
      );
    });

    it('should handle errors during discovery', async () => {
        const axiosGetSpy = jest.spyOn(axios, 'get').mockRejectedValue(new Error('GitHub API error'));
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const servers = await registry.discoverServers();

        expect(servers).toHaveLength(0);
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error discovering servers:', 'GitHub API error');
    });
  });
});