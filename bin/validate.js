const signale = require('signale');

/**
 * Validate input
 */

const validate = ({ input, flags }) => {
  const validFlags = [
    'roughness',
    'bowing',
    'stroke',
    'strokeWidth',
    'fill',
    'fillStyle',
    'fillWeight',
    'hachureAngle',
    'hachureGap',
    'curveStepCount',
    'simplification'
  ];
  const invalidFlags = Object.keys(flags).filter(flag => !validFlags.includes(flag));

  if (input.length === 0) {
    signale.error(new Error('Please supply an input and output file'));
    process.exit(1);
  } else if (input.length === 1) {
    signale.error(new Error('Please supply an output file'));
    process.exit(1);
  } else if (input.length > 2) {
    signale.error(new Error('Too many arguments, need just two arguments.'));
    process.exit(1);
  } else if (invalidFlags.length > 0) {
    signale.error(new Error(`Invalid flag(s): ${invalidFlags.join(', ')}`));
    process.exit(1);
  }
};

module.exports = validate;
