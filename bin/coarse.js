const { JSDOM } = require('jsdom');
const rough = require('roughjs');
const { getAttributes, getSettings, getNum, getDiam, getCoords } = require('./utils');

console.log('DEBUG: modified version');

/**
 * Attributes that should not be transferred to the new shape
 */

const blacklist = [
  'cx',
  'cy',
  'd',
  'fill',
  'height',
  'points',
  'r',
  'rx',
  'ry',
  'stroke-width',
  'stroke',
  'width',
  'x',
  'x1',
  'x2',
  'y',
  'y1',
  'y2'
];

/**
 * Convert an svg server-side with rough
 * @kind function
 * @param {string} input An svg string to render with rough
 * @param {Object} [options={}] Global configuration options for rough
 * @returns {string} The converted svg as a string
 */

console.log('test in coarse lib');

const coarse = (input, options = {}) => {
  const { window } = new JSDOM();

  // Parse svg and initialize rough
  window.document.body.insertAdjacentHTML('beforebegin', input);
  const svg = window.document.querySelector('svg');
  const rc = rough.svg(svg, { options });

  // Get all descendants of the svg that should be processed
  const children = svg.querySelectorAll('circle, rect, ellipse, line, polygon, polyline, path');

  // Remove clip-path to make show inner elements
  const g1 = svg.querySelector('g.plot');
  g1.removeAttribute('clip-path');
  const g2 = svg.querySelector('g.scrollbox');
  g2.removeAttribute('clip-path');
  // Remove the plotly URL at bottom
  svg.querySelector('text.js-plot-link-container').remove();

  // Loop through all child elements
  for (let i = 0; i < children.length; i += 1) {
    const original = children[i];
    const params = [];
    let shapeType;

    switch (original.tagName) {
      case 'circle':
        params.push(...getNum(original, ['cx', 'cy']), ...getDiam(original, ['r']));
        shapeType = 'circle';
        break;
      case 'rect':
        params.push(...getNum(original, ['x', 'y', 'width', 'height']));
        shapeType = 'rectangle';
        break;
      case 'ellipse':
        params.push(...getNum(original, ['cx', 'cy']), ...getDiam(original, ['rx', 'ry']));
        shapeType = 'ellipse';
        break;
      case 'line':
        params.push(...getNum(original, ['x1', 'y1', 'x2', 'y2']));
        shapeType = 'line';
        break;
      case 'polygon':
        params.push(getCoords(original, 'points'));
        shapeType = 'polygon';
        break;
      case 'polyline':
        params.push(getCoords(original, 'points'));
        shapeType = 'linearPath';
        break;
      case 'path':
        params.push(original.getAttribute('d'));
        shapeType = 'path';
        break;
      default:
        console.log('Default case:', original);
        break;
    }

    // Generate the new shape
    const replacement = rc[shapeType](...params, getSettings(original));

    // Get all attributes from the original element that should be copied over
    const attributes = getAttributes(original).filter(
      attribute => !blacklist.includes(attribute.name)
    );

    // Copy all valid attributes to the replacement
    attributes.forEach(({ name, value }) => {
      replacement.setAttribute(name, value);
    });

    original.replaceWith(replacement);
  }

  // ==== Tune the styles to beautify the graph ====

  // Lowlight the axes and gridlines

  const paths = svg.querySelectorAll('g.gridlayer path');
  for (let i = 0; i < paths.length; i += 1) {
    const p = paths[i];
    p.setAttribute('style', 'stroke: #aaa; stroke-width: 0.5; fill: none;');
  }

  // Lowlight the legend region
  svg.querySelector('g.draglayer.cursor-crosshair').remove();
  svg.querySelector('g.legend g.bg').remove();
  svg.querySelectorAll('g.legendtoggle').forEach(x => {
    x.remove();
  });

  const toColorElements = [
    ...svg.querySelectorAll('g.lines path'),
    ...svg.querySelectorAll('g.points path'),
    ...svg.querySelectorAll('g.legendlines path'),
    ...svg.querySelectorAll('g.legendsymbols path')
  ];

  toColorElements.forEach(x => {
    x.removeAttribute('style');
  });

  return svg.outerHTML;
};

module.exports = coarse;
