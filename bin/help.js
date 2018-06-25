const commandLineUsage = require('command-line-usage');
const gradient = require('gradient-string');
const pkg = require('./pkg');

/**
 * Define help text
 */

const help = commandLineUsage([
  {
    header: gradient.morning(pkg.name),
    content: [
      pkg.description.charAt(0).toUpperCase() + pkg.description.substr(1),
      '',
      'This tool allows you to convert SVGs to a more rough version with roughjs. To do so it uses the coarse npm library.'
    ]
  },
  {
    header: 'Usage',
    content: '$ coarse <input> <output> [options]'
  },
  {
    header: 'Required parameters',
    content: [
      { command: '<input>', description: 'Path to the svg to process' },
      { command: '<output>', description: 'Path to output the svg file to' }
    ]
  },
  {
    header: 'Optional flags',
    optionList: [
      {
        name: 'roughness',
        typeLabel: '{underline number}'
      },
      {
        name: 'bowing',
        typeLabel: '{underline number}'
      },
      {
        name: 'stroke',
        typeLabel: '{underline string}'
      },
      {
        name: 'stroke-width',
        typeLabel: '{underline number}'
      },
      {
        name: 'fill',
        typeLabel: '{underline string}'
      },
      {
        name: 'fill-style',
        typeLabel: '{underline string}'
      },
      {
        name: 'fill-weight',
        typeLabel: '{underline number}'
      },
      {
        name: 'hachure-angle',
        typeLabel: '{underline number}'
      },
      {
        name: 'hachure-gap',
        typeLabel: '{underline number}'
      },
      {
        name: 'curve-step-count',
        typeLabel: '{underline number}'
      },
      {
        name: 'simplification',
        typeLabel: '{underline number}'
      }
    ]
  },
  {
    header: 'Examples',
    content: [
      '$ coarse input.svg output.svg',
      '$ coarse input.svg output.svg --roughness 3 --bowing 2'
    ]
  }
]);

module.exports = help;
