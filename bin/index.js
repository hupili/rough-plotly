#!/usr/bin/env node

const fs = require('fs');
const signale = require('signale');
const updateNotifier = require('update-notifier');
const meow = require('meow');
const coarse = require('./coarse.js');
const help = require('./help');
const validate = require('./validate');
const pkg = require('./pkg');

/**
 * Check for updates
 */

updateNotifier({ pkg }).notify();

/**
 * Parse input and validate
 */

const { input, flags } = meow({
  help,
  description: false,
  flags: {
    roughness: {
      type: 'number'
    },
    bowing: {
      type: 'number'
    },
    stroke: {
      type: 'string'
    },
    strokeWidth: {
      type: 'number'
    },
    fill: {
      type: 'string'
    },
    fillStyle: {
      type: 'string'
    },
    fillWeight: {
      type: 'number'
    },
    hachureAngle: {
      type: 'number'
    },
    hachureGap: {
      type: 'number'
    },
    curveStepCount: {
      type: 'number'
    },
    simplification: {
      type: 'number'
    }
  }
});

validate({ input, flags });

/**
 * CLI script
 */

const fn = (inputPath, outputPath, options = {}) => {
  const svg = fs.readFileSync(inputPath);

  fs.writeFileSync(outputPath, coarse(svg, options));
  signale.success(`Rendered svg to ${outputPath}`);
};

fn(input[0], input[1], flags);
