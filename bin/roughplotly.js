function roughPlotly(svg) {

    const rc = rough.svg(svg);

    /**
     * Get all attributes of an element as an array of { name, value } objects
     */

    getAttributes = element => Array.prototype.slice.call(element.attributes);

    /**
     * Return the numerical value of each attribute as an array of ints
     */

    getNum = (element, attributes) =>
        attributes.map(attribute => parseFloat(element.getAttribute(attribute), 10));

    /**
     * Return the numerical value of each attribute as an array of ints, multiplied by two
     */

    getDiam = (element, attributes) =>
        attributes.map(attribute => 2 * parseFloat(element.getAttribute(attribute), 10));

    /**
     * Convert a points attribute to an array that can be consumed by rough
     */

    getCoords = (element, attribute) =>
        element
        .getAttribute(attribute)
        .trim()
        .split(' ')
        .filter(item => item.length > 0)
        .map(item =>
            item
            .trim()
            .split(',')
            .map(num => parseFloat(num, 10))
        );

    /**
     * Converts attributes to settings for rough
     */

    getSettings = element => {
        const settings = {};

        if (element.hasAttribute('stroke')) {
            settings.stroke = element.getAttribute('stroke');
        }

        if (element.hasAttribute('fill')) {
            settings.fill = element.getAttribute('fill');
        }

        if (
            element.hasAttribute('stroke-width') &&
            !element.getAttribute('stroke-width').includes('%')
        ) {
            settings.strokeWidth = parseFloat(element.getAttribute('stroke-width'), 10);
        }

        return settings;
    };

    // Ref: https://stackoverflow.com/a/14865690
    function rulesForCssText(styleContent) {
        var styleElement = document.createElement('style');

        styleElement.textContent = `div { ${styleContent} }`;
        document.body.appendChild(styleElement);

        return styleElement.sheet.cssRules[0].style;
    }

    function roughItBlock(p) {
        roughIt(p, {
            fill: rulesForCssText(p.getAttribute('style'))['fill'],
            fillStyle: 'zigzag',
            fillWeight: 1.5
        });
    }

    function roughIt(original, extraSettings) {
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
        s = getSettings(original);
        if (extraSettings) {
            s = Object.assign({}, s, extraSettings);
        }
        const replacement = rc[shapeType](...params, s);

        blacklist = [];

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

    // Generic

    svg.querySelector('text.js-plot-link-container').remove();

    // Bar chart

    svg.querySelectorAll('g.point path').forEach(original => {
        roughItBlock(original);
    });

    svg.querySelectorAll('g.legendlines path').forEach(original => {
        roughIt(original);
    });

    svg.querySelectorAll('g.legendpoints path').forEach(original => {
        roughItBlock(original);
    });

    svg.querySelectorAll('g.gridlayer path').forEach(original => {
        roughIt(original);
    });

    svg.querySelectorAll('g.zerolinelayer path').forEach(original => {
        roughIt(original);
    });

    svg.querySelectorAll('g.gridlayer  path').forEach(original => {
        original.setAttribute('style', 'stroke: #aaa; stroke-width: 0.5; fill: none;');
    });

    // Line chart

    svg.querySelectorAll('g.points path').forEach(original => {
        roughIt(original);
    });

    svg.querySelectorAll('g.lines path').forEach(original => {
        roughIt(original);
    });

    const toColorElements = [
        // ...svg.querySelectorAll('g.points path'),
        ...svg.querySelectorAll('g.lines path'),
        // ...svg.querySelectorAll('g.legendlines path'),
        // ...svg.querySelectorAll('g.legendsymbols path')
    ];

    toColorElements.forEach(x => {
        x.setAttribute('style', 'stroke-width: 2;');
    });

    // svg.querySelectorAll('g.legend traces rect.legendtoggle').forEach(original => {
    //     roughIt(original);
    // });

}