#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { discoverServers, validateServer, enhanceRegistry } from '../core/registry.js';

const program = new Command();

program
  .name('mcp-grow')
  .description('MCP Registry Grow - Enhance and grow the MCP ecosystem')
  .version('1.0.0');

program
  .command('discover')
  .description('Discover new MCP servers')
  .option('-q, --query <query>', 'Search query for MCP servers')
  .option('-l, --limit <number>', 'Limit results', '10')
  .action(async (options) => {
    console.log(chalk.blue('🔍 Discovering MCP servers...'));
    const servers = await discoverServers(options);
    console.log(chalk.green(`Found ${servers.length} servers`));
    servers.forEach(server => {
      console.log(chalk.cyan(`- ${server.name}: ${server.description}`));
    });
  });

program
  .command('validate <path>')
  .description('Validate an MCP server configuration')
  .action(async (path) => {
    console.log(chalk.blue('🔍 Validating MCP server...'));
    const result = await validateServer(path);
    if (result.valid) {
      console.log(chalk.green('✅ Server configuration is valid'));
    } else {
      console.log(chalk.red('❌ Validation errors:'));
      result.errors.forEach(error => console.log(chalk.yellow(`- ${error}`)));
    }
  });

program
  .command('enhance')
  .description('Enhance registry with additional metadata')
  .option('-o, --output <path>', 'Output path for enhanced registry')
  .action(async (options) => {
    console.log(chalk.blue('✨ Enhancing MCP registry...'));
    await enhanceRegistry(options);
    console.log(chalk.green('✅ Registry enhanced successfully'));
  });

program.parse();