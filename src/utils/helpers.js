import chalk from 'chalk';

export function formatOutput(data, format = 'table') {
  switch (format) {
    case 'json':
      return JSON.stringify(data, null, 2);
    case 'table':
      return formatAsTable(data);
    default:
      return data.toString();
  }
}

function formatAsTable(servers) {
  if (!servers.length) return 'No servers found';

  const headers = ['Name', 'Description', 'Stars', 'Updated', 'Quality'];
  const rows = servers.map(server => [
    server.name,
    server.description?.substring(0, 50) + '...' || 'No description',
    server.stars.toString(),
    new Date(server.updated).toLocaleDateString(),
    '★'.repeat(Math.floor(server.metadata?.qualityScore / 2))
  ]);

  // Simple table formatting
  const headerRow = headers.join(' | ');
  const separator = '-'.repeat(headerRow.length);
  const dataRows = rows.map(row => row.join(' | '));

  return [headerRow, separator, ...dataRows].join('\n');
}

export function logger(message, type = 'info') {
  const colors = {
    info: chalk.blue,
    success: chalk.green,
    warning: chalk.yellow,
    error: chalk.red
  };

  console.log(colors[type](message));
}
