#!/usr/bin/env node
import { Command } from 'commander';

const program = new Command();

program
  .name('mcp-grow')
  .description('MCP Registry Grow - Enhance and grow the MCP ecosystem')
  .version('1.0.0');

program
  .command('discover')
  .description('Discover MCP servers')
  .action(() => {
    console.log('Discovering MCP servers...');
  });

program.parse();
