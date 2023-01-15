/**
* (c) Vjacheslav Trushkin <cyberalien@gmail.com>
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

	var merge_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
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
	/**
	 * Expression to test part of icon name.
	 */
	var match = /^[a-z0-9]+(-[a-z0-9]+)*$/;
	/**
	 * Convert string to Icon object.
	 */
	exports.stringToIcon = function (value) {
	    // Attempt to split by colon: "prefix:name"
	    var colonSeparated = value.split(':');
	    if (colonSeparated.length > 2) {
	        return null;
	    }
	    if (colonSeparated.length === 2) {
	        return {
	            prefix: colonSeparated[0],
	            name: colonSeparated[1],
	        };
	    }
	    // Attempt to split by dash: "prefix-name"
	    var dashSeparated = value.split('-');
	    if (dashSeparated.length > 1) {
	        return {
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
	    return !!(icon.prefix.match(match) && icon.name.match(match));
	};

	});

	unwrapExports(name);
	var name_1 = name.stringToIcon;
	var name_2 = name.validateIcon;

	var customisations = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });

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
	var customisations_1 = customisations.defaults;
	var customisations_2 = customisations.fullCustomisations;

	var icon = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });

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
	var icon_1 = icon.iconDefaults;
	var icon_2 = icon.fullIcon;

	var merge = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });

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



	/**
	 * Get list of defaults keys
	 */
	var defaultsKeys = Object.keys(icon.iconDefaults);
	/**
	 * Storage by prefix
	 */
	var storage = Object.create(null);
	/**
	 * Create new storage
	 */
	function newStorage(prefix) {
	    return {
	        prefix: prefix,
	        icons: Object.create(null),
	        missing: Object.create(null),
	    };
	}
	exports.newStorage = newStorage;
	/**
	 * Get storage for prefix
	 */
	function getStorage(prefix) {
	    if (storage[prefix] === void 0) {
	        storage[prefix] = newStorage(prefix);
	    }
	    return storage[prefix];
	}
	exports.getStorage = getStorage;
	/**
	 * Get all prefixes
	 */
	function listStoredPrefixes() {
	    return Object.keys(storage);
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
	var storage_2 = storage_1.newStorage;
	var storage_3 = storage_1.getStorage;
	var storage_4 = storage_1.listStoredPrefixes;
	var storage_5 = storage_1.addIconSet;
	var storage_6 = storage_1.addIcon;
	var storage_7 = storage_1.iconExists;
	var storage_8 = storage_1.getIcon;

	var calcSize_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
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

	var builder = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });

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
	    var rotation = customisations.rotate;
	    if (customisations.hFlip) {
	        if (customisations.vFlip) {
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
	    else if (customisations.vFlip) {
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

	var modules = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.coreModules = {};

	});

	unwrapExports(modules);
	var modules_1 = modules.coreModules;

	var browserModules = {};
	/**
	 * Get root element
	 */
	function getRoot() {
	    return browserModules.root
	        ? browserModules.root
	        : document.querySelector('body');
	}

	/**
	 * Names of properties to add to nodes
	 */
	var elementFinderProperty = ('iconifyFinder' +
	    Date.now());
	var elementDataProperty = ('iconifyData' +
	    Date.now());

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
	        name = name_1(name);
	    }
	    return name === null || !name_2(name) ? null : name;
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

	var rotate = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
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
	var shorthand_1 = shorthand.flipFromString;
	var shorthand_2 = shorthand.alignmentFromString;

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
	            shorthand_1(result, getAttribute(element, 'data-flip'));
	        }
	        if (hasAttribute(element, 'data-align')) {
	            shorthand_2(result, getAttribute(element, 'data-align'));
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

	var storage = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });

	// After changing configuration change it in tests/*/fake_cache.ts
	// Cache version. Bump when structure changes
	var cacheVersion = 'iconify1';
	// Cache keys
	var cachePrefix = 'iconify';
	var countKey = cachePrefix + '-count';
	var versionKey = cachePrefix + '-version';
	/**
	 * Cache expiration
	 */
	var hour = 3600000;
	var cacheExpiration = 168; // In hours
	/**
	 * Storage configuration
	 */
	exports.config = {
	    local: true,
	    session: true,
	};
	/**
	 * Flag to check if storage has been loaded
	 */
	var loaded = false;
	/**
	 * Items counter
	 */
	exports.count = {
	    local: 0,
	    session: 0,
	};
	/**
	 * List of empty items
	 */
	exports.emptyList = {
	    local: [],
	    session: [],
	};
	var _window = typeof window === 'undefined' ? {} : window;
	function mock(fakeWindow) {
	    loaded = false;
	    _window = fakeWindow;
	}
	exports.mock = mock;
	/**
	 * Get global
	 *
	 * @param key
	 */
	function getGlobal(key) {
	    var attr = key + 'Storage';
	    try {
	        if (_window &&
	            _window[attr] &&
	            typeof _window[attr].length === 'number') {
	            return _window[attr];
	        }
	    }
	    catch (err) {
	        //
	    }
	    // Failed - mark as disabled
	    exports.config[key] = false;
	    return null;
	}
	/**
	 * Change current count for storage
	 */
	function setCount(storage, key, value) {
	    try {
	        storage.setItem(countKey, value + '');
	        exports.count[key] = value;
	        return true;
	    }
	    catch (err) {
	        return false;
	    }
	}
	/**
	 * Get current count from storage
	 *
	 * @param storage
	 */
	function getCount(storage) {
	    var count = storage.getItem(countKey);
	    if (count) {
	        var total = parseInt(count);
	        return total ? total : 0;
	    }
	    return 0;
	}
	/**
	 * Initialize storage
	 *
	 * @param storage
	 * @param key
	 */
	function initCache(storage, key) {
	    try {
	        storage.setItem(versionKey, cacheVersion);
	    }
	    catch (err) {
	        //
	    }
	    setCount(storage, key, 0);
	}
	/**
	 * Destroy old cache
	 *
	 * @param storage
	 */
	function destroyCache(storage) {
	    try {
	        var total = getCount(storage);
	        for (var i = 0; i < total; i++) {
	            storage.removeItem(cachePrefix + i);
	        }
	    }
	    catch (err) {
	        //
	    }
	}
	/**
	 * Load icons from cache
	 */
	exports.loadCache = function () {
	    if (loaded) {
	        return;
	    }
	    loaded = true;
	    // Minimum time
	    var minTime = Math.floor(Date.now() / hour) - cacheExpiration;
	    // Load data from storage
	    function load(key) {
	        var func = getGlobal(key);
	        if (!func) {
	            return;
	        }
	        // Get one item from storage
	        var getItem = function (index) {
	            var name = cachePrefix + index;
	            var item = func.getItem(name);
	            if (typeof item !== 'string') {
	                // Does not exist
	                return false;
	            }
	            // Get item, validate it
	            var valid = true;
	            try {
	                // Parse, check time stamp
	                var data = JSON.parse(item);
	                if (typeof data !== 'object' ||
	                    typeof data.cached !== 'number' ||
	                    data.cached < minTime ||
	                    typeof data.data !== 'object' ||
	                    typeof data.data.prefix !== 'string') {
	                    valid = false;
	                }
	                else {
	                    // Add icon set
	                    var prefix = data.data.prefix;
	                    var storage = storage_1.getStorage(prefix);
	                    valid = storage_1.addIconSet(storage, data.data);
	                }
	            }
	            catch (err) {
	                valid = false;
	            }
	            if (!valid) {
	                func.removeItem(name);
	            }
	            return valid;
	        };
	        try {
	            // Get version
	            var version = func.getItem(versionKey);
	            if (version !== cacheVersion) {
	                if (version) {
	                    // Version is set, but invalid - remove old entries
	                    destroyCache(func);
	                }
	                // Empty data
	                initCache(func, key);
	                return;
	            }
	            // Get number of stored items
	            var total = getCount(func);
	            for (var i = total - 1; i >= 0; i--) {
	                if (!getItem(i)) {
	                    // Remove item
	                    if (i === total - 1) {
	                        // Last item - reduce country
	                        total--;
	                    }
	                    else {
	                        // Mark as empty
	                        exports.emptyList[key].push(i);
	                    }
	                }
	            }
	            // Update total
	            setCount(func, key, total);
	        }
	        catch (err) {
	            //
	        }
	    }
	    for (var key in exports.config) {
	        load(key);
	    }
	};
	/**
	 * Function to cache icons
	 */
	exports.storeCache = function (data) {
	    if (!loaded) {
	        exports.loadCache();
	    }
	    function store(key) {
	        if (!exports.config[key]) {
	            return false;
	        }
	        var func = getGlobal(key);
	        if (!func) {
	            return false;
	        }
	        // Get item index
	        var index = exports.emptyList[key].shift();
	        if (index === void 0) {
	            // Create new index
	            index = exports.count[key];
	            if (!setCount(func, key, index + 1)) {
	                return false;
	            }
	        }
	        // Create and save item
	        try {
	            var item = {
	                cached: Math.floor(Date.now() / hour),
	                data: data,
	            };
	            func.setItem(cachePrefix + index, JSON.stringify(item));
	        }
	        catch (err) {
	            return false;
	        }
	        return true;
	    }
	    // Attempt to store at localStorage first, then at sessionStorage
	    if (!store('local')) {
	        store('session');
	    }
	};

	});

	unwrapExports(storage);
	var storage_2$1 = storage.config;
	var storage_3$1 = storage.count;
	var storage_4$1 = storage.emptyList;
	var storage_5$1 = storage.mock;
	var storage_6$1 = storage.loadCache;
	var storage_7$1 = storage.storeCache;

	var config = createCommonjsModule(function (module, exports) {
	// Allow <any> type because resource can be anything
	/* eslint-disable @typescript-eslint/no-explicit-any */
	Object.defineProperty(exports, "__esModule", { value: true });
	/**
	 * Default RedundancyConfig for API calls
	 */
	exports.defaultConfig = {
	    resources: [],
	    index: 0,
	    timeout: 2000,
	    rotate: 750,
	    random: false,
	    limit: 2,
	};

	});

	unwrapExports(config);
	var config_1 = config.defaultConfig;

	var query = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	/**
	 * Send query
	 */
	function sendQuery(parent, config, payload, queryCallback, doneCallback) {
	    if ( doneCallback === void 0 ) doneCallback = null;

	    // Optional callbacks to call when query is complete
	    var doneCallbacks = [];
	    if (typeof doneCallback === 'function') {
	        doneCallbacks.push(doneCallback);
	    }
	    // Start time
	    var startTime = Date.now();
	    // Current loop number (increased once per full loop of available resources)
	    var loop = 0;
	    // Current attempt number (increased on every query)
	    var attempt = 0;
	    // Max index (config.resources.length - 1)
	    var maxIndex = config.resources.length - 1;
	    // Resource start index
	    var startIndex = config.index ? config.index : 0;
	    if (config.random && config.resources.length > 1) {
	        startIndex = Math.floor(Math.random() * config.resources.length);
	    }
	    startIndex = Math.min(startIndex, maxIndex);
	    // Last index
	    var index = startIndex;
	    // List of pending items
	    var pending = [];
	    // Query status
	    var status = 'pending';
	    // Timer
	    var timer = 0;
	    /**
	     * Add / replace callback to call when execution is complete.
	     * This can be used to abort pending query implementations when query is complete or aborted.
	     */
	    function subscribe(callback, overwrite) {
	        if ( overwrite === void 0 ) overwrite = false;

	        if (overwrite) {
	            doneCallbacks = [];
	        }
	        if (typeof callback === 'function') {
	            doneCallbacks.push(callback);
	        }
	    }
	    /**
	     * Get query status
	     */
	    function getStatus() {
	        return {
	            // eslint-disable-next-line @typescript-eslint/no-use-before-define
	            done: done,
	            // eslint-disable-next-line @typescript-eslint/no-use-before-define
	            abort: abort,
	            subscribe: subscribe,
	            payload: payload,
	            startTime: startTime,
	            loop: loop,
	            attempt: attempt,
	            startIndex: startIndex,
	            index: index,
	            maxIndex: maxIndex,
	            status: status,
	        };
	    }
	    /**
	     * Stop timer
	     */
	    function stopTimer() {
	        if (timer) {
	            clearTimeout(timer);
	        }
	        timer = 0;
	    }
	    /**
	     * Abort pending item
	     */
	    function abortPendingItem(item) {
	        if (item.abort && item.status === 'pending') {
	            item.status = 'aborted';
	            item.abort();
	        }
	    }
	    /**
	     * Stop everything
	     */
	    function stopQuery() {
	        stopTimer();
	        // Stop all pending queries that have abort() callback
	        pending.forEach(abortPendingItem);
	        pending = [];
	        // Cleanup parent
	        if (parent !== null) {
	            parent.cleanup();
	        }
	    }
	    /**
	     * Send retrieved data to doneCallbacks
	     */
	    function sendRetrievedData(data) {
	        doneCallbacks.forEach(function (callback) {
	            callback(data, payload, getStatus);
	        });
	    }
	    /**
	     * Complete stuff
	     */
	    function done(data) {
	        if ( data === void 0 ) data = void 0;

	        // Stop timer
	        stopTimer();
	        // Complete query
	        if (status === 'pending') {
	            status = 'completed';
	            stopQuery();
	            if (data !== void 0) {
	                sendRetrievedData(data);
	            }
	        }
	    }
	    /**
	     * Check if next run is new loop
	     *
	     * Returns true on new loop or next index number
	     */
	    function isNewLoop() {
	        if (maxIndex < 1) {
	            return true;
	        }
	        var nextIndex = index + 1;
	        if (nextIndex > maxIndex) {
	            nextIndex = 0;
	        }
	        if (nextIndex === startIndex) {
	            return true;
	        }
	        return nextIndex;
	    }
	    /**
	     * Done, called by pendingItem
	     */
	    function completePendingItem(pendingItem, index, data) {
	        if ( data === void 0 ) data = void 0;

	        if (pendingItem.status === 'pending') {
	            pendingItem.status = 'completed';
	            // Complete query
	            done(data);
	            // Change parent index
	            if (parent !== null && !config.random && index !== startIndex) {
	                // Tell Redundancy instance to change start index
	                parent.setIndex(index);
	            }
	        }
	    }
	    /**
	     * Send query
	     */
	    function sendQuery() {
	        var queryIndex = index;
	        var queryResource = config.resources[queryIndex];
	        var pendingItem = {
	            getStatus: getStatus,
	            attempt: attempt + 1,
	            status: 'pending',
	            done: function (data) {
	                if ( data === void 0 ) data = void 0;

	                completePendingItem(pendingItem, queryIndex, data);
	            },
	            abort: null,
	        };
	        // Clean up old pending queries
	        if (pending.length > Math.max(maxIndex * 2, 5)) {
	            // Array is not empty, so first shift() will always return item
	            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	            abortPendingItem(pending.shift());
	        }
	        // Add pending query and call callback
	        pending.push(pendingItem);
	        queryCallback(queryResource, payload, pendingItem);
	    }
	    /**
	     * Start timer for next query
	     */
	    function startTimer() {
	        if (status !== 'pending') {
	            return;
	        }
	        var nextIndex = isNewLoop();
	        var timeout;
	        if (typeof nextIndex === 'boolean') {
	            // New loop
	            var nextLoop = loop + 1;
	            // Check limit
	            var limit;
	            if (typeof config.limit === 'function') {
	                limit = config.limit(nextLoop, startTime);
	            }
	            else {
	                limit = config.limit;
	            }
	            if (limit > 0 && limit <= nextLoop) {
	                // Attempts limit was hit
	                stopTimer();
	                return;
	            }
	            if (typeof config.timeout === 'function') {
	                timeout = config.timeout(nextLoop, startIndex, startTime);
	            }
	            else {
	                timeout = config.timeout;
	            }
	        }
	        else {
	            // Next index
	            if (typeof config.rotate === 'function') {
	                var queriesSent = nextIndex < startIndex
	                    ? maxIndex - startIndex + nextIndex
	                    : nextIndex - startIndex;
	                timeout = config.rotate(queriesSent, loop, nextIndex, startTime);
	            }
	            else {
	                timeout = config.rotate;
	            }
	        }
	        if (typeof timeout !== 'number' || timeout < 1) {
	            // Stop sending queries
	            stopTimer();
	            return;
	        }
	        // eslint-disable-next-line @typescript-eslint/no-use-before-define
	        timer = setTimeout(nextTimer, timeout);
	    }
	    /**
	     * Next attempt
	     */
	    function next() {
	        if (status !== 'pending') {
	            return;
	        }
	        // Send query
	        sendQuery();
	        // Start timer on next tick
	        setTimeout(startTimer);
	    }
	    /**
	     * Next attempt on timer
	     */
	    function nextTimer() {
	        // Increase index
	        index = isNewLoop();
	        if (typeof index === 'boolean') {
	            loop++;
	            index = startIndex;
	        }
	        attempt++;
	        // Start next attempt
	        next();
	    }
	    /**
	     * Abort all queries
	     */
	    function abort() {
	        if (status !== 'pending') {
	            return;
	        }
	        status = 'aborted';
	        stopQuery();
	    }
	    // Run next attempt on next tick
	    setTimeout(next);
	    // Return function that can check status
	    return getStatus;
	}
	exports.sendQuery = sendQuery;

	});

	unwrapExports(query);
	var query_1 = query.sendQuery;

	var redundancy = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });


	/**
	 * Set configuration
	 */
	function setConfig(config$1) {
	    if (typeof config$1 !== 'object' ||
	        typeof config$1.resources !== 'object' ||
	        !(config$1.resources instanceof Array) ||
	        !config$1.resources.length) {
	        throw new Error('Invalid Reduncancy configuration');
	    }
	    var newConfig = Object.create(null);
	    var key;
	    for (key in config.defaultConfig) {
	        if (config$1[key] !== void 0) {
	            newConfig[key] = config$1[key];
	        }
	        else {
	            newConfig[key] = config.defaultConfig[key];
	        }
	    }
	    return newConfig;
	}
	/**
	 * Redundancy instance
	 */
	function initRedundancy(cfg) {
	    // Configuration
	    var config = setConfig(cfg);
	    // List of queries
	    var queries = [];
	    /**
	     * Send query
	     */
	    function query$1(payload, queryCallback, doneCallback) {
	        if ( doneCallback === void 0 ) doneCallback = null;

	        var query$1 = query.sendQuery(
	        // eslint-disable-next-line @typescript-eslint/no-use-before-define
	        instance, config, payload, queryCallback, doneCallback);
	        queries.push(query$1);
	        return query$1;
	    }
	    /**
	     * Find instance
	     */
	    function find(callback) {
	        var result = queries.find(function (value) {
	            return callback(value);
	        });
	        return result !== void 0 ? result : null;
	    }
	    /**
	     * Remove aborted and completed queries
	     */
	    function cleanup() {
	        queries = queries.filter(function (item) { return item().status === 'pending'; });
	    }
	    // Create and return functions
	    var instance = {
	        query: query$1,
	        find: find,
	        setIndex: function (index) {
	            config.index = index;
	        },
	        getIndex: function () { return config.index; },
	        cleanup: cleanup,
	    };
	    return instance;
	}
	exports.initRedundancy = initRedundancy;

	});

	unwrapExports(redundancy);
	var redundancy_1 = redundancy.initRedundancy;

	var sort = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });

	/**
	 * Check if icons have been loaded
	 */
	function sortIcons(icons) {
	    var result = {
	        loaded: [],
	        missing: [],
	        pending: [],
	    };
	    var storage = Object.create(null);
	    // Sort icons alphabetically to prevent duplicates and make sure they are sorted in API queries
	    icons.sort(function (a, b) {
	        if (a.prefix === b.prefix) {
	            return a.name.localeCompare(b.name);
	        }
	        return a.prefix.localeCompare(b.prefix);
	    });
	    var lastIcon = {
	        prefix: '',
	        name: '',
	    };
	    icons.forEach(function (icon) {
	        if (lastIcon.prefix === icon.prefix && lastIcon.name === icon.name) {
	            return;
	        }
	        lastIcon = icon;
	        // Check icon
	        var prefix = icon.prefix;
	        var name = icon.name;
	        if (storage[prefix] === void 0) {
	            storage[prefix] = storage_1.getStorage(prefix);
	        }
	        var localStorage = storage[prefix];
	        var list;
	        if (localStorage.icons[name] !== void 0) {
	            list = result.loaded;
	        }
	        else if (localStorage.missing[name] !== void 0) {
	            list = result.missing;
	        }
	        else {
	            list = result.pending;
	        }
	        var item = {
	            prefix: prefix,
	            name: name,
	        };
	        list.push(item);
	    });
	    return result;
	}
	exports.sortIcons = sortIcons;

	});

	unwrapExports(sort);
	var sort_1 = sort.sortIcons;

	var callbacks = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });

	// This export is only for unit testing, should not be used
	exports.callbacks = Object.create(null);
	var pendingUpdates = Object.create(null);
	/**
	 * Remove callback
	 */
	function removeCallback(prefixes, id) {
	    prefixes.forEach(function (prefix) {
	        var items = exports.callbacks[prefix];
	        if (items) {
	            exports.callbacks[prefix] = items.filter(function (row) { return row.id !== id; });
	        }
	    });
	}
	/**
	 * Update all callbacks for prefix
	 */
	function updateCallbacks(prefix) {
	    if (!pendingUpdates[prefix]) {
	        pendingUpdates[prefix] = true;
	        setTimeout(function () {
	            pendingUpdates[prefix] = false;
	            if (exports.callbacks[prefix] === void 0) {
	                return;
	            }
	            // Get all items
	            var items = exports.callbacks[prefix].slice(0);
	            if (!items.length) {
	                return;
	            }
	            var storage = storage_1.getStorage(prefix);
	            // Check each item for changes
	            var hasPending = false;
	            items.forEach(function (item) {
	                var icons = item.icons;
	                var oldLength = icons.pending.length;
	                icons.pending = icons.pending.filter(function (icon) {
	                    if (icon.prefix !== prefix) {
	                        // Checking only current prefix
	                        return true;
	                    }
	                    var name = icon.name;
	                    if (storage.icons[name] !== void 0) {
	                        // Loaded
	                        icons.loaded.push({
	                            prefix: prefix,
	                            name: name,
	                        });
	                    }
	                    else if (storage.missing[name] !== void 0) {
	                        // Missing
	                        icons.missing.push({
	                            prefix: prefix,
	                            name: name,
	                        });
	                    }
	                    else {
	                        // Pending
	                        hasPending = true;
	                        return true;
	                    }
	                    return false;
	                });
	                // Changes detected - call callback
	                if (icons.pending.length !== oldLength) {
	                    if (!hasPending) {
	                        // All icons have been loaded - remove callback from prefix
	                        removeCallback([prefix], item.id);
	                    }
	                    item.callback(icons.loaded.slice(0), icons.missing.slice(0), icons.pending.slice(0), item.abort);
	                }
	            });
	        });
	    }
	}
	exports.updateCallbacks = updateCallbacks;
	/**
	 * Unique id counter for callbacks
	 */
	var idCounter = 0;
	/**
	 * Add callback
	 */
	function storeCallback(callback, icons, pendingPrefixes) {
	    // Create unique id and abort function
	    var id = idCounter++;
	    var abort = removeCallback.bind(null, pendingPrefixes, id);
	    if (!icons.pending.length) {
	        // Do not store item without pending icons and return function that does nothing
	        return abort;
	    }
	    // Create item and store it for all pending prefixes
	    var item = {
	        id: id,
	        icons: icons,
	        callback: callback,
	        abort: abort,
	    };
	    pendingPrefixes.forEach(function (prefix) {
	        if (exports.callbacks[prefix] === void 0) {
	            exports.callbacks[prefix] = [];
	        }
	        exports.callbacks[prefix].push(item);
	    });
	    return abort;
	}
	exports.storeCallback = storeCallback;

	});

	unwrapExports(callbacks);
	var callbacks_1 = callbacks.callbacks;
	var callbacks_2 = callbacks.updateCallbacks;
	var callbacks_3 = callbacks.storeCallback;

	var modules$1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	var storage = {
	    default: null,
	    prefixes: Object.create(null),
	};
	/**
	 * Set API module
	 *
	 * If prefix is not set, function sets default method.
	 * If prefix is a string or array of strings, function sets method only for those prefixes.
	 *
	 * This should be used before sending any API requests. If used after sending API request, method
	 * is already cached so changing callback will not have any effect.
	 */
	function setAPIModule(item, prefix) {
	    if (prefix === void 0) {
	        storage.default = item;
	        return;
	    }
	    (typeof prefix === 'string' ? [prefix] : prefix).forEach(function (prefix) {
	        storage.prefixes[prefix] = item;
	    });
	}
	exports.setAPIModule = setAPIModule;
	/**
	 * Get API module
	 */
	function getAPIModule(prefix) {
	    var value = storage.prefixes[prefix];
	    return value === void 0 ? storage.default : value;
	}
	exports.getAPIModule = getAPIModule;

	});

	unwrapExports(modules$1);
	var modules_1$1 = modules$1.setAPIModule;
	var modules_2 = modules$1.getAPIModule;

	var config$1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });

	/**
	 * Redundancy for API servers.
	 *
	 * API should have very high uptime because of implemented redundancy at server level, but
	 * sometimes bad things happen. On internet 100% uptime is not possible.
	 *
	 * There could be routing problems. Server might go down for whatever reason, but it takes
	 * few minutes to detect that downtime, so during those few minutes API might not be accessible.
	 *
	 * This script has some redundancy to mitigate possible network issues.
	 *
	 * If one host cannot be reached in 'rotate' (750 by default) ms, script will try to retrieve
	 * data from different host. Hosts have different configurations, pointing to different
	 * API servers hosted at different providers.
	 */
	var fallBackAPISources = [
	    'https://api.simplesvg.com',
	    'https://api.unisvg.com' ];
	// Shuffle fallback API
	var fallBackAPI = [];
	while (fallBackAPISources.length > 0) {
	    if (fallBackAPISources.length === 1) {
	        fallBackAPI.push(fallBackAPISources.shift());
	    }
	    else {
	        // Get first or last item
	        if (Math.random() > 0.5) {
	            fallBackAPI.push(fallBackAPISources.shift());
	        }
	        else {
	            fallBackAPI.push(fallBackAPISources.pop());
	        }
	    }
	}
	/**
	 * Default configuration
	 */
	var defaultConfig = {
	    // API hosts
	    resources: ['https://api.iconify.design'].concat(fallBackAPI),
	    // Root path
	    path: '/',
	    // URL length limit
	    maxURL: 500,
	    // Timeout before next host is used.
	    rotate: 750,
	    // Timeout to retry same host.
	    timeout: 5000,
	    // Number of attempts for each host.
	    limit: 2,
	    // Randomise default API end point.
	    random: false,
	    // Start index
	    index: 0,
	};
	/**
	 * Local storage
	 */
	var configStorage = {
	    default: defaultConfig,
	    prefixes: Object.create(null),
	};
	/**
	 * Add custom config for prefix(es)
	 *
	 * This function should be used before any API queries.
	 * On first API query computed configuration will be cached, so changes to config will not take effect.
	 */
	function setAPIConfig(customConfig, prefix) {
	    var mergedConfig = merge_1.merge(configStorage.default, customConfig);
	    if (prefix === void 0) {
	        configStorage.default = mergedConfig;
	        return;
	    }
	    (typeof prefix === 'string' ? [prefix] : prefix).forEach(function (prefix) {
	        configStorage.prefixes[prefix] = mergedConfig;
	    });
	}
	exports.setAPIConfig = setAPIConfig;
	/**
	 * Get API configuration
	 */
	function getAPIConfig(prefix) {
	    var value = configStorage.prefixes[prefix];
	    return value === void 0 ? configStorage.default : value;
	}
	exports.getAPIConfig = getAPIConfig;

	});

	unwrapExports(config$1);
	var config_1$1 = config$1.setAPIConfig;
	var config_2 = config$1.getAPIConfig;

	var list = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });

	/**
	 * Convert icons list from string/icon mix to icons and validate them
	 */
	function listToIcons(list, validate) {
	    if ( validate === void 0 ) validate = true;

	    var result = [];
	    list.forEach(function (item) {
	        var icon = typeof item === 'string'
	            ? name.stringToIcon(item)
	            : item;
	        if (!validate || name.validateIcon(icon)) {
	            result.push({
	                prefix: icon.prefix,
	                name: icon.name,
	            });
	        }
	    });
	    return result;
	}
	exports.listToIcons = listToIcons;
	/**
	 * Get all prefixes
	 */
	function getPrefixes(list) {
	    var prefixes = Object.create(null);
	    list.forEach(function (icon) {
	        prefixes[icon.prefix] = true;
	    });
	    return Object.keys(prefixes);
	}
	exports.getPrefixes = getPrefixes;

	});

	unwrapExports(list);
	var list_1 = list.listToIcons;
	var list_2 = list.getPrefixes;

	var api = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });








	// Empty abort callback for loadIcons()
	function emptyCallback() {
	    // Do nothing
	}
	var pendingIcons = Object.create(null);
	/**
	 * List of icons that are waiting to be loaded.
	 *
	 * List is passed to API module, then cleared.
	 *
	 * This list should not be used for any checks, use pendingIcons to check
	 * if icons is being loaded.
	 *
	 * [prefix] = array of icon names
	 */
	var iconsToLoad = Object.create(null);
	// Flags to merge multiple synchronous icon requests in one asynchronous request
	var loaderFlags = Object.create(null);
	var queueFlags = Object.create(null);
	var redundancyCache = Object.create(null);
	/**
	 * Function called when new icons have been loaded
	 */
	function loadedNewIcons(prefix) {
	    // Run only once per tick, possibly joining multiple API responses in one call
	    if (!loaderFlags[prefix]) {
	        loaderFlags[prefix] = true;
	        setTimeout(function () {
	            loaderFlags[prefix] = false;
	            callbacks.updateCallbacks(prefix);
	        });
	    }
	}
	/**
	 * Load icons
	 */
	function loadNewIcons(prefix, icons) {
	    function err() {
	        console.error('Unable to retrieve icons for prefix "' +
	            prefix +
	            '" because API is not configured properly.');
	    }
	    // Add icons to queue
	    if (iconsToLoad[prefix] === void 0) {
	        iconsToLoad[prefix] = icons;
	    }
	    else {
	        iconsToLoad[prefix] = iconsToLoad[prefix].concat(icons).sort();
	    }
	    // Trigger update on next tick, mering multiple synchronous requests into one asynchronous request
	    if (!queueFlags[prefix]) {
	        queueFlags[prefix] = true;
	        setTimeout(function () {
	            queueFlags[prefix] = false;
	            // Get icons and delete queue
	            var icons = iconsToLoad[prefix];
	            delete iconsToLoad[prefix];
	            // Get API module
	            var api = modules$1.getAPIModule(prefix);
	            if (!api) {
	                // No way to load icons!
	                err();
	                return;
	            }
	            // Get Redundancy instance
	            if (redundancyCache[prefix] === void 0) {
	                var config = config$1.getAPIConfig(prefix);
	                // Attempt to find matching instance from other prefixes
	                // Using same Redundancy instance allows keeping track of failed hosts for multiple prefixes
	                for (var prefix2 in redundancyCache) {
	                    var item = redundancyCache[prefix2];
	                    if (item.config === config) {
	                        redundancyCache[prefix] = item;
	                        break;
	                    }
	                }
	                if (redundancyCache[prefix] === void 0) {
	                    redundancyCache[prefix] = {
	                        config: config,
	                        redundancy: config ? redundancy.initRedundancy(config) : null,
	                    };
	                }
	            }
	            var redundancy$1 = redundancyCache[prefix].redundancy;
	            if (!redundancy$1) {
	                // No way to load icons because configuration is not set!
	                err();
	                return;
	            }
	            // Prepare parameters and run queries
	            var params = api.prepare(prefix, icons);
	            params.forEach(function (item) {
	                redundancy$1.query(item, api.send, function (data) {
	                    // Add icons to storage
	                    var storage = storage_1.getStorage(prefix);
	                    try {
	                        var added = storage_1.addIconSet(storage, data, 'all');
	                        if (typeof added === 'boolean') {
	                            return;
	                        }
	                        // Remove added icons from pending list
	                        var pending = pendingIcons[prefix];
	                        added.forEach(function (name) {
	                            delete pending[name];
	                        });
	                        // Cache API response
	                        if (modules.coreModules.cache) {
	                            modules.coreModules.cache(data);
	                        }
	                    }
	                    catch (err) {
	                        console.error(err);
	                    }
	                    // Trigger update on next tick
	                    loadedNewIcons(prefix);
	                });
	            });
	        });
	    }
	}
	/**
	 * Check if icon is being loaded
	 */
	var isPending = function (prefix, icon) {
	    return (pendingIcons[prefix] !== void 0 && pendingIcons[prefix][icon] !== void 0);
	};
	/**
	 * Load icons
	 */
	var loadIcons = function (icons, callback) {
	    // Clean up and copy icons list
	    var cleanedIcons = list.listToIcons(icons, true);
	    // Sort icons by missing/loaded/pending
	    // Pending means icon is either being requsted or is about to be requested
	    var sortedIcons = sort.sortIcons(cleanedIcons);
	    if (!sortedIcons.pending.length) {
	        // Nothing to load
	        var callCallback = true;
	        if (callback) {
	            setTimeout(function () {
	                if (callCallback) {
	                    callback(sortedIcons.loaded, sortedIcons.missing, sortedIcons.pending, emptyCallback);
	                }
	            });
	        }
	        return function () {
	            callCallback = false;
	        };
	    }
	    // Get all prefixes
	    var prefixes = list.getPrefixes(sortedIcons.pending);
	    // Get pending icons queue for prefix and create new icons list
	    var newIcons = Object.create(null);
	    prefixes.forEach(function (prefix) {
	        if (pendingIcons[prefix] === void 0) {
	            pendingIcons[prefix] = Object.create(null);
	        }
	        newIcons[prefix] = [];
	    });
	    // List of new icons
	    var time = Date.now();
	    // Filter pending icons list: find icons that are not being loaded yet
	    // If icon was called before, it must exist in pendingIcons or storage, but because this
	    // function is called right after sortIcons() that checks storage, icon is definitely not in storage.
	    sortedIcons.pending.forEach(function (icon) {
	        var prefix = icon.prefix;
	        var name = icon.name;
	        var pendingQueue = pendingIcons[prefix];
	        if (pendingQueue[name] === void 0) {
	            // New icon - add to pending queue to mark it as being loaded
	            pendingQueue[name] = time;
	            // Add it to new icons list to pass it to API module for loading
	            newIcons[prefix].push(name);
	        }
	    });
	    // Load icons on next tick to make sure result is not returned before callback is stored and
	    // to consolidate multiple synchronous loadIcons() calls into one asynchronous API call
	    prefixes.forEach(function (prefix) {
	        if (newIcons[prefix].length) {
	            loadNewIcons(prefix, newIcons[prefix]);
	        }
	    });
	    // Store callback and return abort function
	    return callback
	        ? callbacks.storeCallback(callback, sortedIcons, prefixes)
	        : emptyCallback;
	};
	/**
	 * Export module
	 */
	exports.API = {
	    isPending: isPending,
	    loadIcons: loadIcons,
	};

	});

	unwrapExports(api);
	var api_1 = api.API;

	var global = null;
	/**
	 * Endpoint
	 */
	var endPoint = '{prefix}.js?icons={icons}&callback={callback}';
	/**
	 * Cache
	 */
	var maxLengthCache = Object.create(null);
	var pathCache = Object.create(null);
	/**
	 * Get hash for query
	 *
	 * Hash is used in JSONP callback name, so same queries end up with same JSONP callback,
	 * allowing response to be cached in browser.
	 */
	function hash(str) {
	    var total = 0, i;
	    for (i = str.length - 1; i >= 0; i--) {
	        total += str.charCodeAt(i);
	    }
	    return total % 999;
	}
	/**
	 * Get root object
	 */
	function getGlobal() {
	    // Create root
	    if (global === null) {
	        // window
	        var globalRoot = self;
	        // Test for window.Iconify. If missing, create 'IconifyJSONP'
	        var prefix = 'Iconify';
	        var extraPrefix = '.cb';
	        if (globalRoot[prefix] === void 0) {
	            // Use 'IconifyJSONP' global
	            prefix = 'IconifyJSONP';
	            extraPrefix = '';
	            if (globalRoot[prefix] === void 0) {
	                globalRoot[prefix] = Object.create(null);
	            }
	            global = globalRoot[prefix];
	        }
	        else {
	            // Use 'Iconify.cb'
	            var iconifyRoot = globalRoot[prefix];
	            if (iconifyRoot.cb === void 0) {
	                iconifyRoot.cb = Object.create(null);
	            }
	            global = iconifyRoot.cb;
	        }
	        // Change end point
	        endPoint = endPoint.replace('{callback}', prefix + extraPrefix + '.{cb}');
	    }
	    return global;
	}
	/**
	 * Calculate maximum icons list length for prefix
	 */
	function calculateMaxLength(prefix) {
	    // Get config and store path
	    var config = config_2(prefix);
	    if (!config) {
	        return 0;
	    }
	    // Calculate
	    var result;
	    if (!config.maxURL) {
	        result = 0;
	    }
	    else {
	        var maxHostLength = 0;
	        config.resources.forEach(function (host) {
	            maxHostLength = Math.max(maxHostLength, host.length);
	        });
	        // Make sure global is set
	        getGlobal();
	        // Extra width: prefix (3) + counter (4) - '{cb}' (4)
	        var extraLength = 3;
	        // Get available length
	        result =
	            config.maxURL -
	                maxHostLength -
	                config.path.length -
	                endPoint.replace('{prefix}', prefix).replace('{icons}', '').length -
	                extraLength;
	    }
	    // Cache stuff and return result
	    pathCache[prefix] = config.path;
	    maxLengthCache[prefix] = result;
	    return result;
	}
	/**
	 * Prepare params
	 */
	var prepareQuery = function (prefix, icons) {
	    var results = [];
	    // Get maximum icons list length
	    var maxLength = maxLengthCache[prefix];
	    if (maxLength === void 0) {
	        maxLength = calculateMaxLength(prefix);
	    }
	    // Split icons
	    var item = {
	        prefix: prefix,
	        icons: [],
	    };
	    var length = 0;
	    icons.forEach(function (name, index) {
	        length += name.length + 1;
	        if (length >= maxLength && index > 0) {
	            // Next set
	            results.push(item);
	            item = {
	                prefix: prefix,
	                icons: [],
	            };
	            length = name.length;
	        }
	        item.icons.push(name);
	    });
	    results.push(item);
	    return results;
	};
	/**
	 * Load icons
	 */
	var sendQuery = function (host, params, status) {
	    var prefix = params.prefix;
	    var icons = params.icons;
	    var iconsList = icons.join(',');
	    // Create callback prefix
	    var cbPrefix = prefix.split('-').shift().slice(0, 3);
	    var global = getGlobal();
	    // Callback hash
	    var cbCounter = hash(host + ':' + prefix + ':' + iconsList);
	    while (global[cbPrefix + cbCounter] !== void 0) {
	        cbCounter++;
	    }
	    var callbackName = cbPrefix + cbCounter;
	    var path = pathCache[prefix] +
	        endPoint
	            .replace('{prefix}', prefix)
	            .replace('{icons}', iconsList)
	            .replace('{cb}', callbackName);
	    global[callbackName] = function (data) {
	        // Remove callback and complete query
	        delete global[callbackName];
	        status.done(data);
	    };
	    // Create URI
	    var uri = host + path;
	    // console.log('API query:', uri);
	    // Create script and append it to head
	    var script = document.createElement('script');
	    script.type = 'text/javascript';
	    script.async = true;
	    script.src = uri;
	    document.head.appendChild(script);
	};

	/**
	 * MutationObserver instance, null until DOM is ready
	 */
	var instance = null;
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
	 * Pause. Number instead of boolean to allow multiple pause/resume calls. Observer is resumed only when pause reaches 0
	 */
	var paused = 0;
	/**
	 * Scan is pending when observer is resumed
	 */
	var scanPending = false;
	/**
	 * Scan is already queued
	 */
	var scanQueued = false;
	/**
	 * Queue DOM scan
	 */
	function queueScan() {
	    if (!scanQueued) {
	        scanQueued = true;
	        setTimeout(function () {
	            scanQueued = false;
	            scanPending = false;
	            if (callback) {
	                callback(getRoot());
	            }
	        });
	    }
	}
	/**
	 * Check mutations for added nodes
	 */
	function checkMutations(mutations) {
	    if (!scanPending) {
	        for (var i = 0; i < mutations.length; i++) {
	            var item = mutations[i];
	            if (
	            // Check for added nodes
	            (item.addedNodes && item.addedNodes.length > 0) ||
	                // Check for icon or placeholder with modified attributes
	                (item.type === 'attributes' &&
	                    item.target[elementFinderProperty] !==
	                        void 0)) {
	                scanPending = true;
	                if (!paused) {
	                    queueScan();
	                }
	                return;
	            }
	        }
	    }
	}
	/**
	 * Start/resume observer
	 */
	function observe() {
	    if (instance) {
	        instance.observe(getRoot(), observerParams);
	    }
	}
	/**
	 * Start mutation observer
	 */
	function startObserver() {
	    if (instance !== null) {
	        return;
	    }
	    scanPending = true;
	    instance = new MutationObserver(checkMutations);
	    observe();
	    if (!paused) {
	        queueScan();
	    }
	}
	/**
	 * Export module
	 */
	var observer = {
	    /**
	     * Start observer when DOM is ready
	     */
	    init: function (cb) {
	        callback = cb;
	        if (instance && !paused) {
	            // Restart observer
	            instance.disconnect();
	            observe();
	            return;
	        }
	        setTimeout(function () {
	            var doc = document;
	            if (doc.readyState === 'complete' ||
	                (doc.readyState !== 'loading' &&
	                    !doc.documentElement.doScroll)) {
	                startObserver();
	            }
	            else {
	                doc.addEventListener('DOMContentLoaded', startObserver);
	                window.addEventListener('load', startObserver);
	            }
	        });
	    },
	    /**
	     * Pause observer
	     */
	    pause: function () {
	        paused++;
	        if (paused > 1 || instance === null) {
	            return;
	        }
	        // Check pending records, stop observer
	        checkMutations(instance.takeRecords());
	        instance.disconnect();
	    },
	    /**
	     * Resume observer
	     */
	    resume: function () {
	        if (!paused) {
	            return;
	        }
	        paused--;
	        if (!paused && instance) {
	            observe();
	            if (scanPending) {
	                queueScan();
	            }
	        }
	    },
	    /**
	     * Check if observer is paused
	     */
	    isPaused: function () { return paused > 0; },
	};

	/**
	 * Replace element with SVG
	 */
	function renderIcon(placeholder, customisations, iconData, returnString) {
	    var data = builder_1(iconData, customisations_2(customisations));
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
	 * Flag to avoid scanning DOM too often
	 */
	var scanQueued$1 = false;
	/**
	 * Icons have been loaded
	 */
	function checkPendingIcons() {
	    if (!scanQueued$1) {
	        scanQueued$1 = true;
	        setTimeout(function () {
	            if (scanQueued$1) {
	                scanQueued$1 = false;
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
	 * Scan DOM for placeholders
	 */
	function scanDOM(root) {
	    scanQueued$1 = false;
	    // Observer
	    var paused = false;
	    // List of icons to load
	    var loadIcons = Object.create(null);
	    // Get root node and placeholders
	    if (!root) {
	        root = getRoot();
	    }
	    findPlaceholders(root).forEach(function (item) {
	        var element = item.element;
	        var iconName = item.name;
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
	                        modules_1.api.isPending(prefix, name)) {
	                        // Pending
	                        return;
	                    }
	            }
	        }
	        // Check icon
	        var storage = storage_3(prefix);
	        if (storage.icons[name] !== void 0) {
	            // Icon exists - replace placeholder
	            if (browserModules.observer && !paused) {
	                browserModules.observer.pause();
	                paused = true;
	            }
	            // Get customisations
	            var customisations = item.customisations !== void 0
	                ? item.customisations
	                : item.finder.customisations(element);
	            // Render icon
	            renderIcon(item, customisations, storage_8(storage, name));
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
	            if (!modules_1.api.isPending(prefix, name)) {
	                // Add icon to loading queue
	                if (loadIcons[prefix] === void 0) {
	                    loadIcons[prefix] = Object.create(null);
	                }
	                loadIcons[prefix][name] = true;
	            }
	        }
	        // Mark as loading
	        data = {
	            name: iconName,
	            status: 'loading',
	            customisations: {},
	        };
	        element[elementDataProperty] = data;
	    });
	    // Load icons
	    if (modules_1.api) {
	        var api = modules_1.api;
	        Object.keys(loadIcons).forEach(function (prefix) {
	            api.loadIcons(Object.keys(loadIcons[prefix]).map(function (name) {
	                var icon = {
	                    prefix: prefix,
	                    name: name,
	                };
	                return icon;
	            }), checkPendingIcons);
	        });
	    }
	    if (browserModules.observer && paused) {
	        browserModules.observer.resume();
	    }
	}

	/**
	 * Get icon name
	 */
	function getIconName(name) {
	    var icon = name_1(name);
	    if (!name_2(icon)) {
	        return null;
	    }
	    return icon;
	}
	/**
	 * Get icon data
	 */
	function getIconData(name) {
	    var icon = getIconName(name);
	    return icon ? storage_8(storage_3(icon.prefix), icon.name) : null;
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
	    var changes = customisations_2(customisations);
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
	    var iconName = name_1(name);
	    // Clean up customisations
	    var changes = customisations_2(customisations);
	    // Get data
	    return renderIcon({
	        name: iconName,
	    }, changes, iconData, returnString);
	}
	/**
	 * Global variable
	 */
	var Iconify = {
	    // Version
	    getVersion: function () { return '2.0.0-beta.1'; },
	    // Check if icon exists
	    iconExists: function (name) { return getIconData(name) !== null; },
	    // Get raw icon data
	    getIcon: function (name) {
	        var result = getIconData(name);
	        return result ? merge_2(result) : null;
	    },
	    // List icons
	    listIcons: function (prefix) {
	        var icons = [];
	        var prefixes = storage_4();
	        var addPrefix = true;
	        if (typeof prefix === 'string') {
	            prefixes = prefixes.indexOf(prefix) !== -1 ? [] : [prefix];
	            addPrefix = false;
	        }
	        prefixes.forEach(function (prefix) {
	            var storage = storage_3(prefix);
	            var icons = Object.keys(storage.icons);
	            if (addPrefix) {
	                icons = icons.map(function (name) { return prefix + ':' + name; });
	            }
	            icons = icons.concat(icons);
	        });
	        return icons;
	    },
	    // Load icons
	    loadIcons: api_1.loadIcons,
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
	    // Calculate size
	    calculateSize: calcSize_2,
	    // Add icon
	    addIcon: function (name, data) {
	        var icon = getIconName(name);
	        if (!icon) {
	            return false;
	        }
	        var storage = storage_3(icon.prefix);
	        return storage_6(storage, icon.name, data);
	    },
	    // Add icon set
	    addCollection: function (data) {
	        if (typeof data !== 'object' ||
	            typeof data.prefix !== 'string' ||
	            !name_2({
	                prefix: data.prefix,
	                name: 'a',
	            })) {
	            return false;
	        }
	        var storage = storage_3(data.prefix);
	        return !!storage_5(storage, data);
	    },
	    // Pause observer
	    pauseObserver: observer.pause,
	    // Resume observer
	    resumeObserver: observer.resume,
	    // API configuration
	    setAPIConfig: config_1$1,
	    // Scan DOM
	    scanDOM: scanDOM,
	    // Set root node
	    setRoot: function (root) {
	        browserModules.root = root;
	        // Restart observer
	        observer.init(scanDOM);
	        // Scan DOM on next tick
	        setTimeout(scanDOM);
	    },
	    // Allow storage
	    enableCache: function (storage, value) {
	        switch (storage) {
	            case 'local':
	            case 'session':
	                storage_2$1[storage] = value;
	                break;
	            case 'all':
	                for (var key in storage_2$1) {
	                    storage_2$1[key] = value;
	                }
	                break;
	        }
	    },
	};
	/**
	 * Initialise stuff
	 */
	// Add finder modules
	// addFinder(iconifyIconFinder);
	addFinder(finder);
	// Set cache and load existing cache
	modules_1.cache = storage_7$1;
	storage_6$1();
	// Set API
	modules_1$1({
	    send: sendQuery,
	    prepare: prepareQuery,
	});
	modules_1.api = api_1;
	// Load observer
	browserModules.observer = observer;
	setTimeout(function () {
	    // Init on next tick when entire document has been parsed
	    observer.init(scanDOM);
	});

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
