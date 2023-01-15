/**
* (c) Iconify
*
* For the full copyright and license information, please view the license.txt or license.gpl.txt
* files at https://github.com/iconify/iconify
*
* Licensed under Apache 2.0 or GPL 2.0 at your option.
* If derivative product is not compatible with one of licenses, you can pick one of licenses.
*
* @license Apache 2.0
* @license GPL 2.0
*/
var Iconify = (function () {
	'use strict';

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var calcSize_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.calcSize = void 0;
	/**
	 * Regular expressions for calculating dimensions
	 */
	var unitsSplit = /(-?[0-9.]*[0-9]+[0-9.]*)/g;
	var unitsTest = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
	/**
	 * Calculate second dimension when only 1 dimension is set
	 *
	 * @param {string|number} size One dimension (such as width)
	 * @param {number} ratio Width/height ratio.
	 *      If size is width, ratio = height/width
	 *      If size is height, ratio = width/height
	 * @param {number} [precision] Floating number precision in result to minimize output. Default = 2
	 * @return {string|number} Another dimension
	 */
	function calcSize(size, ratio, precision) {
	    if (ratio === 1) {
	        return size;
	    }
	    precision = precision === void 0 ? 100 : precision;
	    if (typeof size === 'number') {
	        return Math.ceil(size * ratio * precision) / precision;
	    }
	    if (typeof size !== 'string') {
	        return size;
	    }
	    // Split code into sets of strings and numbers
	    var oldParts = size.split(unitsSplit);
	    if (oldParts === null || !oldParts.length) {
	        return size;
	    }
	    var newParts = [];
	    var code = oldParts.shift();
	    var isNumber = unitsTest.test(code);
	    // eslint-disable-next-line no-constant-condition
	    while (true) {
	        if (isNumber) {
	            var num = parseFloat(code);
	            if (isNaN(num)) {
	                newParts.push(code);
	            }
	            else {
	                newParts.push(Math.ceil(num * ratio * precision) / precision);
	            }
	        }
	        else {
	            newParts.push(code);
	        }
	        // next
	        code = oldParts.shift();
	        if (code === void 0) {
	            return newParts.join('');
	        }
	        isNumber = !isNumber;
	    }
	}
	exports.calcSize = calcSize;

	});

	unwrapExports(calcSize_1);
	var calcSize_2 = calcSize_1.calcSize;

	var merge_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.merge = void 0;
	/**
	 * Merge two objects
	 *
	 * Replacement for Object.assign() that is not supported by IE, so it cannot be used in production yet.
	 */
	function merge(item1, item2, item3) {
	    var result = Object.create(null);
	    var items = [item1, item2, item3];
	    for (var i = 0; i < 3; i++) {
	        var item = items[i];
	        if (typeof item === 'object' && item) {
	            for (var key in item) {
	                result[key] = item[key];
	            }
	        }
	    }
	    return result;
	}
	exports.merge = merge;

	});

	unwrapExports(merge_1);
	var merge_2 = merge_1.merge;

	var name = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.validateIcon = exports.stringToIcon = void 0;
	/**
	 * Expression to test part of icon name.
	 */
	var match = /^[a-z0-9]+(-[a-z0-9]+)*$/;
	/**
	 * Convert string to Icon object.
	 */
	exports.stringToIcon = function (value) {
	    var provider = '';
	    var colonSeparated = value.split(':');
	    // Check for provider with correct '@' at start
	    if (value.slice(0, 1) === '@') {
	        // First part is provider
	        if (colonSeparated.length < 2 || colonSeparated.length > 3) {
	            // "@provider:prefix:name" or "@provider:prefix-name"
	            return null;
	        }
	        provider = colonSeparated.shift().slice(1);
	    }
	    // Check split by colon: "prefix:name", "provider:prefix:name"
	    if (colonSeparated.length > 3 || !colonSeparated.length) {
	        return null;
	    }
	    if (colonSeparated.length > 1) {
	        // "prefix:name"
	        var name = colonSeparated.pop();
	        var prefix = colonSeparated.pop();
	        return {
	            // Allow provider without '@': "provider:prefix:name"
	            provider: colonSeparated.length > 0 ? colonSeparated[0] : provider,
	            prefix: prefix,
	            name: name,
	        };
	    }
	    // Attempt to split by dash: "prefix-name"
	    var dashSeparated = colonSeparated[0].split('-');
	    if (dashSeparated.length > 1) {
	        return {
	            provider: provider,
	            prefix: dashSeparated.shift(),
	            name: dashSeparated.join('-'),
	        };
	    }
	    return null;
	};
	/**
	 * Check if icon is valid.
	 *
	 * This function is not part of stringToIcon because validation is not needed for most code.
	 */
	exports.validateIcon = function (icon) {
	    if (!icon) {
	        return false;
	    }
	    return !!((icon.provider === '' || icon.provider.match(match)) &&
	        icon.prefix.match(match) &&
	        icon.name.match(match));
	};

	});

	unwrapExports(name);
	var name_1 = name.validateIcon;
	var name_2 = name.stringToIcon;

	var customisations = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.fullCustomisations = exports.defaults = void 0;

	/**
	 * Default icon customisations values
	 */
	exports.defaults = Object.freeze({
	    // Display mode
	    inline: false,
	    // Dimensions
	    width: null,
	    height: null,
	    // Alignment
	    hAlign: 'center',
	    vAlign: 'middle',
	    slice: false,
	    // Transformations
	    hFlip: false,
	    vFlip: false,
	    rotate: 0,
	});
	/**
	 * Convert IconifyIconCustomisations to FullIconCustomisations
	 */
	function fullCustomisations(item) {
	    return merge_1.merge(exports.defaults, item);
	}
	exports.fullCustomisations = fullCustomisations;

	});

	unwrapExports(customisations);
	var customisations_1 = customisations.fullCustomisations;
	var customisations_2 = customisations.defaults;

	var icon = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.fullIcon = exports.iconDefaults = void 0;

	/**
	 * Default values for IconifyIcon properties
	 */
	exports.iconDefaults = Object.freeze({
	    body: '',
	    left: 0,
	    top: 0,
	    width: 16,
	    height: 16,
	    rotate: 0,
	    vFlip: false,
	    hFlip: false,
	});
	/**
	 * Create new icon with all properties
	 */
	function fullIcon(icon) {
	    return merge_1.merge(exports.iconDefaults, icon);
	}
	exports.fullIcon = fullIcon;

	});

	unwrapExports(icon);
	var icon_1 = icon.fullIcon;
	var icon_2 = icon.iconDefaults;

	var merge = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.mergeIcons = void 0;

	/**
	 * Icon keys
	 */
	var iconKeys = Object.keys(icon.iconDefaults);
	/**
	 * Merge two icons
	 *
	 * icon2 overrides icon1
	 */
	function mergeIcons(icon1, icon2) {
	    var icon = Object.create(null);
	    iconKeys.forEach(function (key) {
	        if (icon1[key] === void 0) {
	            if (icon2[key] !== void 0) {
	                icon[key] = icon2[key];
	            }
	            return;
	        }
	        if (icon2[key] === void 0) {
	            icon[key] = icon1[key];
	            return;
	        }
	        switch (key) {
	            case 'rotate':
	                icon[key] =
	                    (icon1[key] + icon2[key]) % 4;
	                return;
	            case 'hFlip':
	            case 'vFlip':
	                icon[key] = icon1[key] !== icon2[key];
	                return;
	            default:
	                icon[key] = icon2[key];
	        }
	    });
	    return icon;
	}
	exports.mergeIcons = mergeIcons;

	});

	unwrapExports(merge);
	var merge_1$1 = merge.mergeIcons;

	var storage_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getIcon = exports.iconExists = exports.addIcon = exports.addIconSet = exports.listStoredPrefixes = exports.listStoredProviders = exports.getStorage = exports.newStorage = void 0;



	/**
	 * Get list of defaults keys
	 */
	var defaultsKeys = Object.keys(icon.iconDefaults);
	/**
	 * Storage by provider and prefix
	 */
	var storage = Object.create(null);
	/**
	 * Create new storage
	 */
	function newStorage(provider, prefix) {
	    return {
	        provider: provider,
	        prefix: prefix,
	        icons: Object.create(null),
	        missing: Object.create(null),
	    };
	}
	exports.newStorage = newStorage;
	/**
	 * Get storage for provider and prefix
	 */
	function getStorage(provider, prefix) {
	    if (storage[provider] === void 0) {
	        storage[provider] = Object.create(null);
	    }
	    var providerStorage = storage[provider];
	    if (providerStorage[prefix] === void 0) {
	        providerStorage[prefix] = newStorage(provider, prefix);
	    }
	    return providerStorage[prefix];
	}
	exports.getStorage = getStorage;
	/**
	 * Get all providers
	 */
	function listStoredProviders() {
	    return Object.keys(storage);
	}
	exports.listStoredProviders = listStoredProviders;
	/**
	 * Get all prefixes
	 */
	function listStoredPrefixes(provider) {
	    return storage[provider] === void 0 ? [] : Object.keys(storage[provider]);
	}
	exports.listStoredPrefixes = listStoredPrefixes;
	/**
	 * Resolve alias
	 */
	function resolveAlias(alias, icons, aliases, level) {
	    if ( level === void 0 ) level = 0;

	    var parent = alias.parent;
	    if (icons[parent] !== void 0) {
	        return merge.mergeIcons(icons[parent], alias);
	    }
	    if (aliases[parent] !== void 0) {
	        if (level > 2) {
	            // icon + alias + alias + alias = too much nesting, possibly infinite
	            throw new Error('Invalid alias');
	        }
	        var icon = resolveAlias(aliases[parent], icons, aliases, level + 1);
	        if (icon) {
	            return merge.mergeIcons(icon, alias);
	        }
	    }
	    return null;
	}
	/**
	 * Add icon set to storage
	 *
	 * Returns array of added icons if 'list' is true and icons were added successfully
	 */
	function addIconSet(storage, data, list) {
	    if ( list === void 0 ) list = 'none';

	    var added = [];
	    try {
	        // Must be an object
	        if (typeof data !== 'object') {
	            return false;
	        }
	        // Check for missing icons list returned by API
	        if (data.not_found instanceof Array) {
	            var t = Date.now();
	            data.not_found.forEach(function (name) {
	                storage.missing[name] = t;
	                if (list === 'all') {
	                    added.push(name);
	                }
	            });
	        }
	        // Must have 'icons' object
	        if (typeof data.icons !== 'object') {
	            return false;
	        }
	        // Get default values
	        var defaults = Object.create(null);
	        defaultsKeys.forEach(function (key) {
	            if (data[key] !== void 0 && typeof data[key] !== 'object') {
	                defaults[key] = data[key];
	            }
	        });
	        // Get icons
	        var icons = data.icons;
	        Object.keys(icons).forEach(function (name) {
	            var icon$1 = icons[name];
	            if (typeof icon$1.body !== 'string') {
	                throw new Error('Invalid icon');
	            }
	            // Freeze icon to make sure it will not be modified
	            storage.icons[name] = Object.freeze(merge_1.merge(icon.iconDefaults, defaults, icon$1));
	            if (list !== 'none') {
	                added.push(name);
	            }
	        });
	        // Get aliases
	        if (typeof data.aliases === 'object') {
	            var aliases = data.aliases;
	            Object.keys(aliases).forEach(function (name) {
	                var icon$1 = resolveAlias(aliases[name], icons, aliases, 1);
	                if (icon$1) {
	                    // Freeze icon to make sure it will not be modified
	                    storage.icons[name] = Object.freeze(merge_1.merge(icon.iconDefaults, defaults, icon$1));
	                    if (list !== 'none') {
	                        added.push(name);
	                    }
	                }
	            });
	        }
	    }
	    catch (err) {
	        return false;
	    }
	    return list === 'none' ? true : added;
	}
	exports.addIconSet = addIconSet;
	/**
	 * Add icon to storage
	 */
	function addIcon(storage, name, icon$1) {
	    try {
	        if (typeof icon$1.body === 'string') {
	            // Freeze icon to make sure it will not be modified
	            storage.icons[name] = Object.freeze(icon.fullIcon(icon$1));
	            return true;
	        }
	    }
	    catch (err) {
	        // Do nothing
	    }
	    return false;
	}
	exports.addIcon = addIcon;
	/**
	 * Check if icon exists
	 */
	function iconExists(storage, name) {
	    return storage.icons[name] !== void 0;
	}
	exports.iconExists = iconExists;
	/**
	 * Get icon data
	 */
	function getIcon(storage, name) {
	    var value = storage.icons[name];
	    return value === void 0 ? null : value;
	}
	exports.getIcon = getIcon;

	});

	unwrapExports(storage_1);
	var storage_2 = storage_1.getIcon;
	var storage_3 = storage_1.iconExists;
	var storage_4 = storage_1.addIcon;
	var storage_5 = storage_1.addIconSet;
	var storage_6 = storage_1.listStoredPrefixes;
	var storage_7 = storage_1.listStoredProviders;
	var storage_8 = storage_1.getStorage;
	var storage_9 = storage_1.newStorage;

	var builder = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.iconToSVG = void 0;

	/**
	 * Get preserveAspectRatio value
	 */
	function preserveAspectRatio(props) {
	    var result = '';
	    switch (props.hAlign) {
	        case 'left':
	            result += 'xMin';
	            break;
	        case 'right':
	            result += 'xMax';
	            break;
	        default:
	            result += 'xMid';
	    }
	    switch (props.vAlign) {
	        case 'top':
	            result += 'YMin';
	            break;
	        case 'bottom':
	            result += 'YMax';
	            break;
	        default:
	            result += 'YMid';
	    }
	    result += props.slice ? ' slice' : ' meet';
	    return result;
	}
	/**
	 * Get SVG attributes and content from icon + customisations
	 *
	 * Does not generate style to make it compatible with frameworks that use objects for style, such as React.
	 * Instead, it generates verticalAlign value that should be added to style.
	 *
	 * Customisations should be normalised by platform specific parser.
	 * Result should be converted to <svg> by platform specific parser.
	 * Use replaceIDs to generate unique IDs for body.
	 */
	function iconToSVG(icon, customisations) {
	    // viewBox
	    var box = {
	        left: icon.left,
	        top: icon.top,
	        width: icon.width,
	        height: icon.height,
	    };
	    // Apply transformations
	    var transformations = [];
	    var hFlip = customisations.hFlip !== icon.hFlip;
	    var vFlip = customisations.vFlip !== icon.vFlip;
	    var rotation = customisations.rotate + icon.rotate;
	    if (hFlip) {
	        if (vFlip) {
	            rotation += 2;
	        }
	        else {
	            // Horizontal flip
	            transformations.push('translate(' +
	                (box.width + box.left) +
	                ' ' +
	                (0 - box.top) +
	                ')');
	            transformations.push('scale(-1 1)');
	            box.top = box.left = 0;
	        }
	    }
	    else if (vFlip) {
	        // Vertical flip
	        transformations.push('translate(' + (0 - box.left) + ' ' + (box.height + box.top) + ')');
	        transformations.push('scale(1 -1)');
	        box.top = box.left = 0;
	    }
	    var tempValue;
	    rotation = rotation % 4;
	    switch (rotation) {
	        case 1:
	            // 90deg
	            tempValue = box.height / 2 + box.top;
	            transformations.unshift('rotate(90 ' + tempValue + ' ' + tempValue + ')');
	            break;
	        case 2:
	            // 180deg
	            transformations.unshift('rotate(180 ' +
	                (box.width / 2 + box.left) +
	                ' ' +
	                (box.height / 2 + box.top) +
	                ')');
	            break;
	        case 3:
	            // 270deg
	            tempValue = box.width / 2 + box.left;
	            transformations.unshift('rotate(-90 ' + tempValue + ' ' + tempValue + ')');
	            break;
	    }
	    if (rotation % 2 === 1) {
	        // Swap width/height and x/y for 90deg or 270deg rotation
	        if (box.left !== 0 || box.top !== 0) {
	            tempValue = box.left;
	            box.left = box.top;
	            box.top = tempValue;
	        }
	        if (box.width !== box.height) {
	            tempValue = box.width;
	            box.width = box.height;
	            box.height = tempValue;
	        }
	    }
	    // Calculate dimensions
	    var width, height;
	    if (customisations.width === null && customisations.height === null) {
	        // Set height to '1em', calculate width
	        height = '1em';
	        width = calcSize_1.calcSize(height, box.width / box.height);
	    }
	    else if (customisations.width !== null &&
	        customisations.height !== null) {
	        // Values are set
	        width = customisations.width;
	        height = customisations.height;
	    }
	    else if (customisations.height !== null) {
	        // Height is set
	        height = customisations.height;
	        width = calcSize_1.calcSize(height, box.width / box.height);
	    }
	    else {
	        // Width is set
	        width = customisations.width;
	        height = calcSize_1.calcSize(width, box.height / box.width);
	    }
	    // Check for 'auto'
	    if (width === 'auto') {
	        width = box.width;
	    }
	    if (height === 'auto') {
	        height = box.height;
	    }
	    // Convert to string
	    width = typeof width === 'string' ? width : width + '';
	    height = typeof height === 'string' ? height : height + '';
	    // Generate body
	    var body = icon.body;
	    if (transformations.length) {
	        body =
	            '<g transform="' + transformations.join(' ') + '">' + body + '</g>';
	    }
	    // Result
	    var result = {
	        attributes: {
	            width: width,
	            height: height,
	            preserveAspectRatio: preserveAspectRatio(customisations),
	            viewBox: box.left + ' ' + box.top + ' ' + box.width + ' ' + box.height,
	        },
	        body: body,
	    };
	    if (customisations.inline) {
	        result.inline = true;
	    }
	    return result;
	}
	exports.iconToSVG = iconToSVG;

	});

	unwrapExports(builder);
	var builder_1 = builder.iconToSVG;

	var ids = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.replaceIDs = void 0;
	/**
	 * Regular expression for finding ids
	 */
	var regex = /\sid="(\S+)"/g;
	/**
	 * New random-ish prefix for ids
	 */
	var randomPrefix = 'IconifyId-' +
	    Date.now().toString(16) +
	    '-' +
	    ((Math.random() * 0x1000000) | 0).toString(16) +
	    '-';
	/**
	 * Counter for ids, increasing with every replacement
	 */
	var counter = 0;
	/**
	 * Replace multiple occurance of same string
	 */
	function strReplace(search, replace, subject) {
	    var pos = 0;
	    while ((pos = subject.indexOf(search, pos)) !== -1) {
	        subject =
	            subject.slice(0, pos) +
	                replace +
	                subject.slice(pos + search.length);
	        pos += replace.length;
	    }
	    return subject;
	}
	/**
	 * Replace IDs in SVG output with unique IDs
	 * Fast replacement without parsing XML, assuming commonly used patterns and clean XML (icon should have been cleaned up with Iconify Tools or SVGO).
	 */
	function replaceIDs(body, prefix) {
	    if ( prefix === void 0 ) prefix = randomPrefix;

	    // Find all IDs
	    var ids = [];
	    var match;
	    while ((match = regex.exec(body))) {
	        ids.push(match[1]);
	    }
	    if (!ids.length) {
	        return body;
	    }
	    // Replace with unique ids
	    ids.forEach(function (id) {
	        var newID = typeof prefix === 'function' ? prefix() : prefix + counter++;
	        body = strReplace('="' + id + '"', '="' + newID + '"', body);
	        body = strReplace('="#' + id + '"', '="#' + newID + '"', body);
	        body = strReplace('(#' + id + ')', '(#' + newID + ')', body);
	    });
	    return body;
	}
	exports.replaceIDs = replaceIDs;

	});

	unwrapExports(ids);
	var ids_1 = ids.replaceIDs;

	/**
	 * Names of properties to add to nodes
	 */
	var elementFinderProperty = ('iconifyFinder' +
	    Date.now());
	var elementDataProperty = ('iconifyData' +
	    Date.now());

	/**
	 * Replace element with SVG
	 */
	function renderIcon(placeholder, customisations, iconData, returnString) {
	    var data = builder_1(iconData, customisations_1(customisations));
	    // Placeholder properties
	    var placeholderElement = placeholder.element;
	    var finder = placeholder.finder;
	    var name = placeholder.name;
	    // Get class name
	    var placeholderClassName = placeholderElement
	        ? placeholderElement.getAttribute('class')
	        : '';
	    var filteredClassList = finder
	        ? finder.classFilter(placeholderClassName ? placeholderClassName.split(/\s+/) : [])
	        : [];
	    var className = 'iconify iconify--' +
	        name.prefix +
	        (name.provider === '' ? '' : ' iconify--' + name.provider) +
	        (filteredClassList.length ? ' ' + filteredClassList.join(' ') : '');
	    // Generate SVG as string
	    var html = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" class="' +
	        className +
	        '">' +
	        ids_1(data.body) +
	        '</svg>';
	    // Create placeholder. Why placeholder? IE11 doesn't support innerHTML method on SVG.
	    var span = document.createElement('span');
	    span.innerHTML = html;
	    // Get SVG element
	    var svg = span.childNodes[0];
	    var svgStyle = svg.style;
	    // Add attributes
	    var svgAttributes = data.attributes;
	    Object.keys(svgAttributes).forEach(function (attr) {
	        svg.setAttribute(attr, svgAttributes[attr]);
	    });
	    // Add custom styles
	    svgStyle.transform = 'rotate(360deg)';
	    if (data.inline) {
	        svgStyle.verticalAlign = '-0.125em';
	    }
	    // Copy stuff from placeholder
	    if (placeholderElement) {
	        // Copy attributes
	        var placeholderAttributes = placeholderElement.attributes;
	        for (var i = 0; i < placeholderAttributes.length; i++) {
	            var item = placeholderAttributes.item(i);
	            if (item) {
	                var name$1 = item.name;
	                if (name$1 !== 'class' &&
	                    name$1 !== 'style' &&
	                    svgAttributes[name$1] === void 0) {
	                    try {
	                        svg.setAttribute(name$1, item.value);
	                    }
	                    catch (err) { }
	                }
	            }
	        }
	        // Copy styles
	        var placeholderStyle = placeholderElement.style;
	        for (var i$1 = 0; i$1 < placeholderStyle.length; i$1++) {
	            var attr = placeholderStyle[i$1];
	            svgStyle[attr] = placeholderStyle[attr];
	        }
	    }
	    // Store finder specific data
	    if (finder) {
	        var elementData = {
	            name: name,
	            status: 'loaded',
	            customisations: customisations,
	        };
	        svg[elementDataProperty] = elementData;
	        svg[elementFinderProperty] = finder;
	    }
	    // Get result
	    var result = returnString ? span.innerHTML : svg;
	    // Replace placeholder
	    if (placeholderElement && placeholderElement.parentNode) {
	        placeholderElement.parentNode.replaceChild(svg, placeholderElement);
	    }
	    else {
	        // Placeholder has no parent? Remove SVG parent as well
	        span.removeChild(svg);
	    }
	    // Return new node
	    return result;
	}

	/**
	 * List of root nodes
	 */
	var nodes = [];
	/**
	 * Find node
	 */
	function findRootNode(node) {
	    for (var i = 0; i < nodes.length; i++) {
	        var item = nodes[i];
	        var root = typeof item.node === 'function' ? item.node() : item.node;
	        if (root === node) {
	            return item;
	        }
	    }
	}
	/**
	 * Add extra root node
	 */
	function addRootNode(root, autoRemove) {
	    if ( autoRemove === void 0 ) autoRemove = false;

	    var node = findRootNode(root);
	    if (node) {
	        // Node already exist: switch type if needed
	        if (node.temporary) {
	            node.temporary = autoRemove;
	        }
	        return node;
	    }
	    // Create item, add it to list, start observer
	    node = {
	        node: root,
	        temporary: autoRemove,
	    };
	    nodes.push(node);
	    return node;
	}
	/**
	 * Add document.body node
	 */
	function addBodyNode() {
	    if (document.body) {
	        return addRootNode(document.body);
	    }
	    nodes.push({
	        node: function () {
	            return document.body;
	        },
	    });
	}
	/**
	 * Remove root node
	 */
	function removeRootNode(root) {
	    nodes = nodes.filter(function (node) {
	        var element = typeof node.node === 'function' ? node.node() : node.node;
	        return root !== element;
	    });
	}
	/**
	 * Get list of root nodes
	 */
	function listRootNodes() {
	    return nodes;
	}

	/**
	 * Execute function when DOM is ready
	 */
	function onReady(callback) {
	    var doc = document;
	    if (doc.readyState === 'complete' ||
	        (doc.readyState !== 'loading' &&
	            !doc.documentElement.doScroll)) {
	        callback();
	    }
	    else {
	        doc.addEventListener('DOMContentLoaded', callback);
	        window.addEventListener('load', callback);
	    }
	}

	/**
	 * Callback
	 */
	var callback = null;
	/**
	 * Parameters for mutation observer
	 */
	var observerParams = {
	    childList: true,
	    subtree: true,
	    attributes: true,
	};
	/**
	 * Queue DOM scan
	 */
	function queueScan(node) {
	    if (!node.observer) {
	        return;
	    }
	    var observer = node.observer;
	    if (!observer.pendingScan) {
	        observer.pendingScan = setTimeout(function () {
	            delete observer.pendingScan;
	            if (callback) {
	                callback(node);
	            }
	        });
	    }
	}
	/**
	 * Check mutations for added nodes
	 */
	function checkMutations(node, mutations) {
	    if (!node.observer) {
	        return;
	    }
	    var observer = node.observer;
	    if (!observer.pendingScan) {
	        for (var i = 0; i < mutations.length; i++) {
	            var item = mutations[i];
	            if (
	            // Check for added nodes
	            (item.addedNodes && item.addedNodes.length > 0) ||
	                // Check for icon or placeholder with modified attributes
	                (item.type === 'attributes' &&
	                    item.target[elementFinderProperty] !==
	                        void 0)) {
	                if (!observer.paused) {
	                    queueScan(node);
	                }
	                return;
	            }
	        }
	    }
	}
	/**
	 * Start/resume observer
	 */
	function observe(node, root) {
	    node.observer.instance.observe(root, observerParams);
	}
	/**
	 * Start mutation observer
	 */
	function startObserver(node) {
	    var observer = node.observer;
	    if (observer && observer.instance) {
	        // Already started
	        return;
	    }
	    var root = typeof node.node === 'function' ? node.node() : node.node;
	    if (!root) {
	        // document.body is not available yet
	        return;
	    }
	    if (!observer) {
	        observer = {
	            paused: 0,
	        };
	        node.observer = observer;
	    }
	    // Create new instance, observe
	    observer.instance = new MutationObserver(checkMutations.bind(null, node));
	    observe(node, root);
	    // Scan immediately
	    if (!observer.paused) {
	        queueScan(node);
	    }
	}
	/**
	 * Start all observers
	 */
	function startObservers() {
	    listRootNodes().forEach(startObserver);
	}
	/**
	 * Stop observer
	 */
	function stopObserver(node) {
	    if (!node.observer) {
	        return;
	    }
	    var observer = node.observer;
	    // Stop scan
	    if (observer.pendingScan) {
	        clearTimeout(observer.pendingScan);
	        delete observer.pendingScan;
	    }
	    // Disconnect observer
	    if (observer.instance) {
	        observer.instance.disconnect();
	        delete observer.instance;
	    }
	}
	/**
	 * Start observer when DOM is ready
	 */
	function initObserver(cb) {
	    var isRestart = callback !== null;
	    if (callback !== cb) {
	        // Change callback and stop all pending observers
	        callback = cb;
	        if (isRestart) {
	            listRootNodes().forEach(stopObserver);
	        }
	    }
	    if (isRestart) {
	        // Restart instances
	        startObservers();
	        return;
	    }
	    // Start observers when document is ready
	    onReady(startObservers);
	}
	/**
	 * Pause observer
	 */
	function pauseObserver(node) {
	    (node ? [node] : listRootNodes()).forEach(function (node) {
	        if (!node.observer) {
	            node.observer = {
	                paused: 1,
	            };
	            return;
	        }
	        var observer = node.observer;
	        observer.paused++;
	        if (observer.paused > 1 || !observer.instance) {
	            return;
	        }
	        // Disconnect observer
	        var instance = observer.instance;
	        // checkMutations(node, instance.takeRecords());
	        instance.disconnect();
	    });
	}
	/**
	 * Resume observer
	 */
	function resumeObserver(observer) {
	    (observer ? [observer] : listRootNodes()).forEach(function (node) {
	        if (!node.observer) {
	            // Start observer
	            startObserver(node);
	            return;
	        }
	        var observer = node.observer;
	        if (observer.paused) {
	            observer.paused--;
	            if (!observer.paused) {
	                // Start / resume
	                var root = typeof node.node === 'function' ? node.node() : node.node;
	                if (!root) {
	                    return;
	                }
	                else if (observer.instance) {
	                    observe(node, root);
	                }
	                else {
	                    startObserver(node);
	                }
	            }
	        }
	    });
	}
	/**
	 * Observe node
	 */
	function observeNode(root, autoRemove) {
	    if ( autoRemove === void 0 ) autoRemove = false;

	    var node = addRootNode(root, autoRemove);
	    startObserver(node);
	    return node;
	}
	/**
	 * Remove observed node
	 */
	function removeObservedNode(root) {
	    var node = findRootNode(root);
	    if (node) {
	        stopObserver(node);
	        removeRootNode(root);
	    }
	}

	var modules = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.coreModules = void 0;
	exports.coreModules = {};

	});

	unwrapExports(modules);
	var modules_1 = modules.coreModules;

	/**
	 * List of modules
	 */
	var finders = [];
	/**
	 * Add module
	 */
	function addFinder(finder) {
	    if (finders.indexOf(finder) === -1) {
	        finders.push(finder);
	    }
	}
	/**
	 * Clean icon name: convert from string if needed and validate
	 */
	function cleanIconName(name) {
	    if (typeof name === 'string') {
	        name = name_2(name);
	    }
	    return name === null || !name_1(name) ? null : name;
	}
	/**
	 * Compare customisations. Returns true if identical
	 */
	function compareCustomisations(list1, list2) {
	    var keys1 = Object.keys(list1);
	    var keys2 = Object.keys(list2);
	    if (keys1.length !== keys2.length) {
	        return false;
	    }
	    for (var i = 0; i < keys1.length; i++) {
	        var key = keys1[i];
	        if (list2[key] !== list1[key]) {
	            return false;
	        }
	    }
	    return true;
	}
	/**
	 * Find all placeholders
	 */
	function findPlaceholders(root) {
	    var results = [];
	    finders.forEach(function (finder) {
	        var elements = finder.find(root);
	        Array.prototype.forEach.call(elements, function (item) {
	            var element = item;
	            if (element[elementFinderProperty] !== void 0 &&
	                element[elementFinderProperty] !== finder) {
	                // Element is assigned to a different finder
	                return;
	            }
	            // Get icon name
	            var name = cleanIconName(finder.name(element));
	            if (name === null) {
	                // Invalid name - do not assign this finder to element
	                return;
	            }
	            // Assign finder to element and add it to results
	            element[elementFinderProperty] = finder;
	            var placeholder = {
	                element: element,
	                finder: finder,
	                name: name,
	            };
	            results.push(placeholder);
	        });
	    });
	    // Find all modified SVG
	    var elements = root.querySelectorAll('svg.iconify');
	    Array.prototype.forEach.call(elements, function (item) {
	        var element = item;
	        var finder = element[elementFinderProperty];
	        var data = element[elementDataProperty];
	        if (!finder || !data) {
	            return;
	        }
	        // Get icon name
	        var name = cleanIconName(finder.name(element));
	        if (name === null) {
	            // Invalid name
	            return;
	        }
	        var updated = false;
	        var customisations;
	        if (name.prefix !== data.name.prefix || name.name !== data.name.name) {
	            updated = true;
	        }
	        else {
	            customisations = finder.customisations(element);
	            if (!compareCustomisations(data.customisations, customisations)) {
	                updated = true;
	            }
	        }
	        // Add item to results
	        if (updated) {
	            var placeholder = {
	                element: element,
	                finder: finder,
	                name: name,
	                customisations: customisations,
	            };
	            results.push(placeholder);
	        }
	    });
	    return results;
	}

	/**
	 * Flag to avoid scanning DOM too often
	 */
	var scanQueued = false;
	/**
	 * Icons have been loaded
	 */
	function checkPendingIcons() {
	    if (!scanQueued) {
	        scanQueued = true;
	        setTimeout(function () {
	            if (scanQueued) {
	                scanQueued = false;
	                scanDOM();
	            }
	        });
	    }
	}
	/**
	 * Compare Icon objects. Returns true if icons are identical.
	 *
	 * Note: null means icon is invalid, so null to null comparison = false.
	 */
	var compareIcons = function (icon1, icon2) {
	    return (icon1 !== null &&
	        icon2 !== null &&
	        icon1.name === icon2.name &&
	        icon1.prefix === icon2.prefix);
	};
	/**
	 * Scan node for placeholders
	 */
	function scanElement(root) {
	    // Add temporary node
	    var node = findRootNode(root);
	    if (!node) {
	        scanDOM({
	            node: root,
	            temporary: true,
	        }, true);
	    }
	    else {
	        scanDOM(node);
	    }
	}
	/**
	 * Scan DOM for placeholders
	 */
	function scanDOM(node, addTempNode) {
	    if ( addTempNode === void 0 ) addTempNode = false;

	    scanQueued = false;
	    // List of icons to load: [provider][prefix][name] = boolean
	    var loadIcons = Object.create(null);
	    // Get placeholders
	    (node ? [node] : listRootNodes()).forEach(function (node) {
	        var root = typeof node.node === 'function' ? node.node() : node.node;
	        if (!root || !root.querySelectorAll) {
	            return;
	        }
	        // Track placeholders
	        var hasPlaceholders = false;
	        // Observer
	        var paused = false;
	        // Find placeholders
	        findPlaceholders(root).forEach(function (item) {
	            var element = item.element;
	            var iconName = item.name;
	            var provider = iconName.provider;
	            var prefix = iconName.prefix;
	            var name = iconName.name;
	            var data = element[elementDataProperty];
	            // Icon has not been updated since last scan
	            if (data !== void 0 && compareIcons(data.name, iconName)) {
	                // Icon name was not changed and data is set - quickly return if icon is missing or still loading
	                switch (data.status) {
	                    case 'missing':
	                        return;
	                    case 'loading':
	                        if (modules_1.api &&
	                            modules_1.api.isPending({
	                                provider: provider,
	                                prefix: prefix,
	                                name: name,
	                            })) {
	                            // Pending
	                            hasPlaceholders = true;
	                            return;
	                        }
	                }
	            }
	            // Check icon
	            var storage = storage_8(provider, prefix);
	            if (storage.icons[name] !== void 0) {
	                // Icon exists - pause observer before replacing placeholder
	                if (!paused && node.observer) {
	                    pauseObserver(node);
	                    paused = true;
	                }
	                // Get customisations
	                var customisations = item.customisations !== void 0
	                    ? item.customisations
	                    : item.finder.customisations(element);
	                // Render icon
	                renderIcon(item, customisations, storage_2(storage, name));
	                return;
	            }
	            if (storage.missing[name]) {
	                // Mark as missing
	                data = {
	                    name: iconName,
	                    status: 'missing',
	                    customisations: {},
	                };
	                element[elementDataProperty] = data;
	                return;
	            }
	            if (modules_1.api) {
	                if (!modules_1.api.isPending({ provider: provider, prefix: prefix, name: name })) {
	                    // Add icon to loading queue
	                    if (loadIcons[provider] === void 0) {
	                        loadIcons[provider] = Object.create(null);
	                    }
	                    var providerLoadIcons = loadIcons[provider];
	                    if (providerLoadIcons[prefix] === void 0) {
	                        providerLoadIcons[prefix] = Object.create(null);
	                    }
	                    providerLoadIcons[prefix][name] = true;
	                }
	            }
	            // Mark as loading
	            data = {
	                name: iconName,
	                status: 'loading',
	                customisations: {},
	            };
	            element[elementDataProperty] = data;
	            hasPlaceholders = true;
	        });
	        // Node stuff
	        if (node.temporary && !hasPlaceholders) {
	            // Remove temporary node
	            removeObservedNode(root);
	        }
	        else if (addTempNode && hasPlaceholders) {
	            // Add new temporary node
	            observeNode(root, true);
	        }
	        else if (paused && node.observer) {
	            // Resume observer
	            resumeObserver(node);
	        }
	    });
	    // Load icons
	    if (modules_1.api) {
	        var api = modules_1.api;
	        Object.keys(loadIcons).forEach(function (provider) {
	            var providerLoadIcons = loadIcons[provider];
	            Object.keys(providerLoadIcons).forEach(function (prefix) {
	                api.loadIcons(Object.keys(providerLoadIcons[prefix]).map(function (name) {
	                    var icon = {
	                        provider: provider,
	                        prefix: prefix,
	                        name: name,
	                    };
	                    return icon;
	                }), checkPendingIcons);
	            });
	        });
	    }
	}

	var rotate = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.rotateFromString = void 0;
	/**
	 * Get rotation value
	 */
	function rotateFromString(value) {
	    var units = value.replace(/^-?[0-9.]*/, '');
	    function cleanup(value) {
	        while (value < 0) {
	            value += 4;
	        }
	        return value % 4;
	    }
	    if (units === '') {
	        var num = parseInt(value);
	        return isNaN(num) ? 0 : cleanup(num);
	    }
	    else if (units !== value) {
	        var split = 0;
	        switch (units) {
	            case '%':
	                // 25% -> 1, 50% -> 2, ...
	                split = 25;
	                break;
	            case 'deg':
	                // 90deg -> 1, 180deg -> 2, ...
	                split = 90;
	        }
	        if (split) {
	            var num$1 = parseFloat(value.slice(0, value.length - units.length));
	            if (isNaN(num$1)) {
	                return 0;
	            }
	            num$1 = num$1 / split;
	            return num$1 % 1 === 0 ? cleanup(num$1) : 0;
	        }
	    }
	    return 0;
	}
	exports.rotateFromString = rotateFromString;

	});

	unwrapExports(rotate);
	var rotate_1 = rotate.rotateFromString;

	var shorthand = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.alignmentFromString = exports.flipFromString = void 0;
	var separator = /[\s,]+/;
	/**
	 * Apply "flip" string to icon customisations
	 */
	function flipFromString(custom, flip) {
	    flip.split(separator).forEach(function (str) {
	        var value = str.trim();
	        switch (value) {
	            case 'horizontal':
	                custom.hFlip = true;
	                break;
	            case 'vertical':
	                custom.vFlip = true;
	                break;
	        }
	    });
	}
	exports.flipFromString = flipFromString;
	/**
	 * Apply "align" string to icon customisations
	 */
	function alignmentFromString(custom, align) {
	    align.split(separator).forEach(function (str) {
	        var value = str.trim();
	        switch (value) {
	            case 'left':
	            case 'center':
	            case 'right':
	                custom.hAlign = value;
	                break;
	            case 'top':
	            case 'middle':
	            case 'bottom':
	                custom.vAlign = value;
	                break;
	            case 'slice':
	            case 'crop':
	                custom.slice = true;
	                break;
	            case 'meet':
	                custom.slice = false;
	        }
	    });
	}
	exports.alignmentFromString = alignmentFromString;

	});

	unwrapExports(shorthand);
	var shorthand_1 = shorthand.alignmentFromString;
	var shorthand_2 = shorthand.flipFromString;

	/**
	 * Check if attribute exists
	 */
	function hasAttribute(element, key) {
	    return element.hasAttribute(key);
	}
	/**
	 * Get attribute value
	 */
	function getAttribute(element, key) {
	    return element.getAttribute(key);
	}
	/**
	 * Get attribute value
	 */
	function getBooleanAttribute(element, key) {
	    var value = element.getAttribute(key);
	    if (value === key || value === 'true') {
	        return true;
	    }
	    if (value === '' || value === 'false') {
	        return false;
	    }
	    return null;
	}
	/**
	 * Boolean attributes
	 */
	var booleanAttributes = [
	    'inline',
	    'hFlip',
	    'vFlip' ];
	/**
	 * String attributes
	 */
	var stringAttributes = [
	    'width',
	    'height' ];
	/**
	 * Class names
	 */
	var mainClass = 'iconify';
	var inlineClass = 'iconify-inline';
	/**
	 * Selector combining class names and tags
	 */
	var selector = 'i.' +
	    mainClass +
	    ', span.' +
	    mainClass +
	    ', i.' +
	    inlineClass +
	    ', span.' +
	    inlineClass;
	/**
	 * Export finder for:
	 *  <span class="iconify" />
	 *  <i class="iconify" />
	 *  <span class="iconify-inline" />
	 *  <i class="iconify-inline" />
	 */
	var finder = {
	    /**
	     * Find all elements
	     */
	    find: function (root) { return root.querySelectorAll(selector); },
	    /**
	     * Get icon name from element
	     */
	    name: function (element) {
	        if (hasAttribute(element, 'data-icon')) {
	            return getAttribute(element, 'data-icon');
	        }
	        return null;
	    },
	    /**
	     * Get customisations list from element
	     */
	    customisations: function (element, defaultValues) {
	        if ( defaultValues === void 0 ) defaultValues = {
	        inline: false,
	    };

	        var result = defaultValues;
	        // Check class list for inline class
	        var className = element.getAttribute('class');
	        var classList = className ? className.split(/\s+/) : [];
	        if (classList.indexOf(inlineClass) !== -1) {
	            result.inline = true;
	        }
	        // Rotation
	        if (hasAttribute(element, 'data-rotate')) {
	            var value = rotate_1(getAttribute(element, 'data-rotate'));
	            if (value) {
	                result.rotate = value;
	            }
	        }
	        // Shorthand attributes
	        if (hasAttribute(element, 'data-flip')) {
	            shorthand_2(result, getAttribute(element, 'data-flip'));
	        }
	        if (hasAttribute(element, 'data-align')) {
	            shorthand_1(result, getAttribute(element, 'data-align'));
	        }
	        // Boolean attributes
	        booleanAttributes.forEach(function (attr) {
	            if (hasAttribute(element, 'data-' + attr)) {
	                var value = getBooleanAttribute(element, 'data-' + attr);
	                if (typeof value === 'boolean') {
	                    result[attr] = value;
	                }
	            }
	        });
	        // String attributes
	        stringAttributes.forEach(function (attr) {
	            if (hasAttribute(element, 'data-' + attr)) {
	                var value = getAttribute(element, 'data-' + attr);
	                if (value !== '') {
	                    result[attr] = value;
	                }
	            }
	        });
	        return result;
	    },
	    /**
	     * Filter classes
	     */
	    classFilter: function (classList) {
	        var result = [];
	        classList.forEach(function (className) {
	            if (className !== 'iconify' &&
	                className !== '' &&
	                className.slice(0, 9) !== 'iconify--') {
	                result.push(className);
	            }
	        });
	        return result;
	    },
	};

	// import { finder as iconifyIconFinder } from './finders/iconify-icon';
	/**
	 * Get icon name
	 */
	function getIconName(name) {
	    var icon = name_2(name);
	    if (!name_1(icon)) {
	        return null;
	    }
	    return icon;
	}
	/**
	 * Get icon data
	 */
	function getIconData(name) {
	    var icon = getIconName(name);
	    return icon
	        ? storage_2(storage_8(icon.provider, icon.prefix), icon.name)
	        : null;
	}
	/**
	 * Get SVG data
	 */
	function buildIcon(name, customisations) {
	    // Get icon data
	    var iconData = getIconData(name);
	    if (!iconData) {
	        return null;
	    }
	    // Clean up customisations
	    var changes = customisations_1(customisations);
	    // Get data
	    return builder_1(iconData, changes);
	}
	/**
	 * Generate icon
	 */
	function generateIcon(name, customisations, returnString) {
	    // Get icon data
	    var iconData = getIconData(name);
	    if (!iconData) {
	        return null;
	    }
	    // Split name
	    var iconName = name_2(name);
	    // Clean up customisations
	    var changes = customisations_1(customisations);
	    // Get data
	    return renderIcon({
	        name: iconName,
	    }, changes, iconData, returnString);
	}
	/**
	 * Add icon set
	 */
	function addCollection(data, provider) {
	    if (typeof provider !== 'string') {
	        provider = typeof data.provider === 'string' ? data.provider : '';
	    }
	    if (typeof data !== 'object' ||
	        typeof data.prefix !== 'string' ||
	        !name_1({
	            provider: provider,
	            prefix: data.prefix,
	            name: 'a',
	        })) {
	        return false;
	    }
	    var storage = storage_8(provider, data.prefix);
	    return !!storage_5(storage, data);
	}
	/**
	 * Global variable
	 */
	var IconifyCommon = {
	    // Version
	    getVersion: function () { return '2.0.0-beta.5'; },
	    // Check if icon exists
	    iconExists: function (name) { return getIconData(name) !== null; },
	    // Get raw icon data
	    getIcon: function (name) {
	        var result = getIconData(name);
	        return result ? merge_2(result) : null;
	    },
	    // List icons
	    listIcons: function (provider, prefix) {
	        var icons = [];
	        // Get providers
	        var providers;
	        if (typeof provider === 'string') {
	            providers = [provider];
	        }
	        else {
	            providers = storage_7();
	        }
	        // Get all icons
	        providers.forEach(function (provider) {
	            var prefixes;
	            if (typeof prefix === 'string') {
	                prefixes = [prefix];
	            }
	            else {
	                prefixes = storage_6(provider);
	            }
	            prefixes.forEach(function (prefix) {
	                var storage = storage_8(provider, prefix);
	                var icons = Object.keys(storage.icons).map(function (name) { return (provider !== '' ? '@' + provider + ':' : '') +
	                    prefix +
	                    ':' +
	                    name; });
	                icons = icons.concat(icons);
	            });
	        });
	        return icons;
	    },
	    // Add icon
	    addIcon: function (name, data) {
	        var icon = getIconName(name);
	        if (!icon) {
	            return false;
	        }
	        var storage = storage_8(icon.provider, icon.prefix);
	        return storage_4(storage, icon.name, data);
	    },
	    // Add icon set
	    addCollection: addCollection,
	    // Render SVG
	    renderSVG: function (name, customisations) {
	        return generateIcon(name, customisations, false);
	    },
	    renderHTML: function (name, customisations) {
	        return generateIcon(name, customisations, true);
	    },
	    // Get rendered icon as object that can be used to create SVG (use replaceIDs on body)
	    renderIcon: buildIcon,
	    // Replace IDs in body
	    replaceIDs: ids_1,
	    // Scan DOM
	    scan: function (root) {
	        if (root) {
	            scanElement(root);
	        }
	        else {
	            scanDOM();
	        }
	    },
	    // Add root node
	    observe: function (root) {
	        observeNode(root);
	    },
	    // Remove root node
	    stopObserving: function (root) {
	        removeObservedNode(root);
	    },
	    // Pause observer
	    pauseObserver: function (root) {
	        if (root) {
	            var node = findRootNode(root);
	            if (node) {
	                pauseObserver(node);
	            }
	        }
	        else {
	            pauseObserver();
	        }
	    },
	    // Resume observer
	    resumeObserver: function (root) {
	        if (root) {
	            var node = findRootNode(root);
	            if (node) {
	                resumeObserver(node);
	            }
	        }
	        else {
	            resumeObserver();
	        }
	    },
	};
	/**
	 * Initialise stuff
	 */
	if (typeof document !== 'undefined' && typeof window !== 'undefined') {
	    // Add document.body node
	    addBodyNode();
	    // Add finder modules
	    // addFinder(iconifyIconFinder);
	    addFinder(finder);
	    var _window = window;
	    if (_window.IconifyPreload !==
	        void 0) {
	        var preload = _window
	            .IconifyPreload;
	        var err = 'Invalid IconifyPreload syntax.';
	        if (typeof preload === 'object' && preload !== null) {
	            (preload instanceof Array ? preload : [preload]).forEach(function (item) {
	                try {
	                    if (
	                    // Check if item is an object and not null/array
	                    typeof item !== 'object' ||
	                        item === null ||
	                        item instanceof Array ||
	                        // Check for 'icons' and 'prefix'
	                        typeof item.icons !== 'object' ||
	                        typeof item.prefix !== 'string' ||
	                        // Add icon set
	                        !addCollection(item)) {
	                        console.error(err);
	                    }
	                }
	                catch (e) {
	                    console.error(err);
	                }
	            });
	        }
	    }
	    // Load observer and scan DOM on next tick
	    setTimeout(function () {
	        initObserver(scanDOM);
	        scanDOM();
	    });
	}

	/**
	 * Global variable
	 */
	var Iconify = {
	    // Exposed internal functions
	    _internal: {
	        // Calculate size
	        calculateSize: calcSize_2,
	    },
	};
	// Merge with common functions
	for (var key in IconifyCommon) {
	    Iconify[key] = IconifyCommon[key];
	}

	return Iconify;

}());

// Export to window or web worker
try {
	if (self.Iconify === void 0) {
		self.Iconify = Iconify;
	}
} catch (err) {
}

// Export as ES module
if (typeof exports === 'object') {
	try {
		exports.__esModule = true;
		exports.default = Iconify;
	} catch (err) {
	}
}
