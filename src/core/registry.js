import axios from 'axios';
import { readFile, writeFile } from 'fs/promises';
import { validateMCPConfig } from './validator.js';

export class MCPRegistry {
  constructor() {
    this.baseUrl = 'https://api.github.com';
    this.registrySources = [
      'modelcontextprotocol/registry',
      // Add more registry sources here
    ];
  }

  async discoverServers(options = {}) {
    const { query = 'mcp', limit = 10 } = options;
    const servers = [];

    try {
      // Search GitHub for MCP-related repositories
      const response = await axios.get(
        `${this.baseUrl}/search/repositories?q=${query}+topic:mcp&per_page=${limit}`
      );

      for (const repo of response.data.items) {
        servers.push({
          name: repo.name,
          description: repo.description,
          url: repo.html_url,
          stars: repo.stargazers_count,
          updated: repo.updated_at,
          language: repo.language
        });
      }
    } catch (error) {
      console.error('Error discovering servers:', error.message);
    }

    return servers;
  }

  async validateServer(configPath) {
    try {
      const configContent = await readFile(configPath, 'utf8');
      const config = JSON.parse(configContent);
      return validateMCPConfig(config);
    } catch (error) {
      return {
        valid: false,
        errors: [error.message]
      };
    }
  }

  async enhanceRegistry(options = {}) {
    const servers = await this.discoverServers({ limit: 50 });
    const enhancedData = {
      timestamp: new Date().toISOString(),
      totalServers: servers.length,
      servers: servers.map(server => ({
        ...server,
        metadata: this.generateMetadata(server)
      }))
    };

    if (options.output) {
      await writeFile(options.output, JSON.stringify(enhancedData, null, 2));
    }

    return enhancedData;
  }

  generateMetadata(server) {
    return {
      qualityScore: this.calculateQualityScore(server),
      categories: this.categorizeServer(server),
      compatibility: this.checkCompatibility(server),
      lastValidated: new Date().toISOString()
    };
  }

  calculateQualityScore(server) {
    let score = 0;
    if (server.stars > 100) score += 3;
    if (server.stars > 10) score += 2;
    if (server.description && server.description.length > 50) score += 2;
    if (server.updated) {
      const daysSinceUpdate = (new Date() - new Date(server.updated)) / (1000 * 3600 * 24);
      if (daysSinceUpdate < 30) score += 3;
    }
    return Math.min(score, 10);
  }

  categorizeServer(server) {
    const categories = [];
    const name = server.name.toLowerCase();
    const description = server.description.toLowerCase();

    if (name.includes('tool') || description.includes('tool')) categories.push('tools');
    if (name.includes('resource') || description.includes('resource')) categories.push('resources');
    if (name.includes('prompt') || description.includes('prompt')) categories.push('prompts');
    if (name.includes('knowledge') || description.includes('knowledge')) categories.push('knowledge');

    return categories.length > 0 ? categories : ['general'];
  }

  checkCompatibility(server) {
    // Basic compatibility check based on common patterns
    return {
      sse: server.description?.toLowerCase().includes('sse') || false,
      transport: this.detectTransport(server)
    };
  }

  detectTransport(server) {
    if (server.description?.toLowerCase().includes('stdio')) return 'stdio';
    if (server.description?.toLowerCase().includes('http')) return 'http';
    return 'unknown';
  }
}

export const discoverServers = (options) => new MCPRegistry().discoverServers(options);
export const validateServer = (path) => new MCPRegistry().validateServer(path);
export const enhanceRegistry = (options) => new MCPRegistry().enhanceRegistry(options);
