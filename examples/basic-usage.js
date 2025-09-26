import { MCPRegistry } from '../src/core/registry.js';

async function main() {
  const registry = new MCPRegistry();
  
  // Discover servers
  console.log('Discovering MCP servers...');
  const servers = await registry.discoverServers({ limit: 5 });
  console.log(`Found ${servers.length} servers`);

  // Enhance registry
  console.log('Enhancing registry...');
  const enhanced = await registry.enhanceRegistry({ output: './enhanced-registry.json' });
  console.log('Enhanced registry saved');
}

main().catch(console.error);
