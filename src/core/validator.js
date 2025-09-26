export function validateMCPConfig(config) {
  const errors = [];
  const warnings = [];

  // Basic structure validation
  if (!config.name) errors.push('Missing required field: name');
  if (!config.version) errors.push('Missing required field: version');
  if (!config.schemaVersion) warnings.push('Consider adding schemaVersion');

  // Validate tools if present
  if (config.tools) {
    if (!Array.isArray(config.tools)) {
      errors.push('Tools must be an array');
    } else {
      config.tools.forEach((tool, index) => {
        if (!tool.name) errors.push(`Tool ${index} missing name`);
        if (!tool.description) warnings.push(`Tool ${index} should have a description`);
      });
    }
  }

  // Validate resources if present
  if (config.resources) {
    if (!Array.isArray(config.resources)) {
      errors.push('Resources must be an array');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
