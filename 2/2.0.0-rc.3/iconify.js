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

	function createCommonjsModule(fn, basedir, module) {
		return module = {
			path: basedir,
			exports: {},
			require: function (path, base) {
				return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
			}
		}, fn(module, module.exports), module.exports;
	}

	function commonjsRequire () {
		throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
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

	var modules = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.coreModules = void 0;
	exports.coreModules = {};

	});

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

	var iconSet = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.parseIconSet = void 0;



	/**
	 * Get list of defaults keys
	 */
	var defaultsKeys = Object.keys(icon.iconDefaults);
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
	            return null;
	        }
	        var icon = resolveAlias(aliases[parent], icons, aliases, level + 1);
	        if (icon) {
	            return merge.mergeIcons(icon, alias);
	        }
	    }
	    return null;
	}
	/**
	 * Extract icons from an icon set
	 */
	function parseIconSet(data, callback, list) {
	    if ( list === void 0 ) list = 'none';

	    var added = [];
	    // Must be an object
	    if (typeof data !== 'object') {
	        return list === 'none' ? false : added;
	    }
	    // Check for missing icons list returned by API
	    if (data.not_found instanceof Array) {
	        data.not_found.forEach(function (name) {
	            callback(name, null);
	            if (list === 'all') {
	                added.push(name);
	            }
	        });
	    }
	    // Must have 'icons' object
	    if (typeof data.icons !== 'object') {
	        return list === 'none' ? false : added;
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
	            return;
	        }
	        // Freeze icon to make sure it will not be modified
	        callback(name, Object.freeze(merge_1.merge(icon.iconDefaults, defaults, icon$1)));
	        added.push(name);
	    });
	    // Get aliases
	    if (typeof data.aliases === 'object') {
	        var aliases = data.aliases;
	        Object.keys(aliases).forEach(function (name) {
	            var icon$1 = resolveAlias(aliases[name], icons, aliases, 1);
	            if (icon$1) {
	                // Freeze icon to make sure it will not be modified
	                callback(name, Object.freeze(merge_1.merge(icon.iconDefaults, defaults, icon$1)));
	                added.push(name);
	            }
	        });
	    }
	    return list === 'none' ? added.length > 0 : added;
	}
	exports.parseIconSet = parseIconSet;

	});

	var storage_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.listIcons = exports.getIcon = exports.iconExists = exports.addIcon = exports.addIconSet = exports.getStorage = exports.newStorage = void 0;


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
	 * Add icon set to storage
	 *
	 * Returns array of added icons if 'list' is true and icons were added successfully
	 */
	function addIconSet(storage, data, list) {
	    if ( list === void 0 ) list = 'none';

	    var t = Date.now();
	    return iconSet.parseIconSet(data, function (name, icon) {
	        if (icon === null) {
	            storage.missing[name] = t;
	        }
	        else {
	            storage.icons[name] = icon;
	        }
	    }, list);
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
	/**
	 * List available icons
	 */
	function listIcons(provider, prefix) {
	    var allIcons = [];
	    // Get providers
	    var providers;
	    if (typeof provider === 'string') {
	        providers = [provider];
	    }
	    else {
	        providers = Object.keys(storage);
	    }
	    // Get all icons
	    providers.forEach(function (provider) {
	        var prefixes;
	        if (typeof provider === 'string' && typeof prefix === 'string') {
	            prefixes = [prefix];
	        }
	        else {
	            prefixes =
	                storage[provider] === void 0
	                    ? []
	                    : Object.keys(storage[provider]);
	        }
	        prefixes.forEach(function (prefix) {
	            var storage = getStorage(provider, prefix);
	            var icons = Object.keys(storage.icons).map(function (name) { return (provider !== '' ? '@' + provider + ':' : '') +
	                prefix +
	                ':' +
	                name; });
	            allIcons = allIcons.concat(icons);
	        });
	    });
	    return allIcons;
	}
	exports.listIcons = listIcons;

	});

	var storage = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.storeCache = exports.loadCache = exports.mock = exports.emptyList = exports.count = exports.config = void 0;

	// After changing configuration change it in tests/*/fake_cache.ts
	// Cache version. Bump when structure changes
	var cacheVersion = 'iconify2';
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
	var loadCache = function () {
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
	                    typeof data.provider !== 'string' ||
	                    typeof data.data !== 'object' ||
	                    typeof data.data.prefix !== 'string') {
	                    valid = false;
	                }
	                else {
	                    // Add icon set
	                    var provider = data.provider;
	                    var prefix = data.data.prefix;
	                    var storage = storage_1.getStorage(provider, prefix);
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
	exports.loadCache = loadCache;
	/**
	 * Function to cache icons
	 */
	var storeCache = function (provider, data) {
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
	                provider: provider,
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
	exports.storeCache = storeCache;

	});

	var config = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.defaultConfig = void 0;
	/**
	 * Default RedundancyConfig for API calls
	 */
	exports.defaultConfig = {
	    resources: [],
	    index: 0,
	    timeout: 2000,
	    rotate: 750,
	    random: false,
	    dataAfterTimeout: false,
	};
	});

	var query = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.sendQuery = void 0;
	/**
	 * Send query
	 */
	function sendQuery(config, payload, query, done, success) {
	    // Get number of resources
	    var resourcesCount = config.resources.length;
	    // Save start index
	    var startIndex = config.random
	        ? Math.floor(Math.random() * resourcesCount)
	        : config.index;
	    // Get resources
	    var resources;
	    if (config.random) {
	        // Randomise array
	        var list = config.resources.slice(0);
	        resources = [];
	        while (list.length > 1) {
	            var nextIndex = Math.floor(Math.random() * list.length);
	            resources.push(list[nextIndex]);
	            list = list.slice(0, nextIndex).concat(list.slice(nextIndex + 1));
	        }
	        resources = resources.concat(list);
	    }
	    else {
	        // Rearrange resources to start with startIndex
	        resources = config.resources
	            .slice(startIndex)
	            .concat(config.resources.slice(0, startIndex));
	    }
	    // Counters, status
	    var startTime = Date.now();
	    var status = 'pending';
	    var queriesSent = 0;
	    var lastError = void 0;
	    // Timer
	    var timer = null;
	    // Execution queue
	    var queue = [];
	    // Callbacks to call when query is complete
	    var doneCallbacks = [];
	    if (typeof done === 'function') {
	        doneCallbacks.push(done);
	    }
	    /**
	     * Reset timer
	     */
	    function resetTimer() {
	        if (timer) {
	            clearTimeout(timer);
	            timer = null;
	        }
	    }
	    /**
	     * Abort everything
	     */
	    function abort() {
	        // Change status
	        if (status === 'pending') {
	            status = 'aborted';
	        }
	        // Reset timer
	        resetTimer();
	        // Abort all queued items
	        queue.forEach(function (item) {
	            if (item.abort) {
	                item.abort();
	            }
	            if (item.status === 'pending') {
	                item.status = 'aborted';
	            }
	        });
	        queue = [];
	    }
	    /**
	     * Add / replace callback to call when execution is complete.
	     * This can be used to abort pending query implementations when query is complete or aborted.
	     */
	    function subscribe(callback, overwrite) {
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
	    function getQueryStatus() {
	        return {
	            startTime: startTime,
	            payload: payload,
	            status: status,
	            queriesSent: queriesSent,
	            queriesPending: queue.length,
	            subscribe: subscribe,
	            abort: abort,
	        };
	    }
	    /**
	     * Fail query
	     */
	    function failQuery() {
	        status = 'failed';
	        // Send notice to all callbacks
	        doneCallbacks.forEach(function (callback) {
	            callback(void 0, lastError);
	        });
	    }
	    /**
	     * Clear queue
	     */
	    function clearQueue() {
	        queue = queue.filter(function (item) {
	            if (item.status === 'pending') {
	                item.status = 'aborted';
	            }
	            if (item.abort) {
	                item.abort();
	            }
	            return false;
	        });
	    }
	    /**
	     * Got response from module
	     */
	    function moduleResponse(item, data, error) {
	        var isError = data === void 0;
	        // Remove item from queue
	        queue = queue.filter(function (queued) { return queued !== item; });
	        // Check status
	        switch (status) {
	            case 'pending':
	                // Pending
	                break;
	            case 'failed':
	                if (isError || !config.dataAfterTimeout) {
	                    // Query has already timed out or dataAfterTimeout is disabled
	                    return;
	                }
	                // Success after failure
	                break;
	            default:
	                // Aborted or completed
	                return;
	        }
	        // Error
	        if (isError) {
	            if (error !== void 0) {
	                lastError = error;
	            }
	            if (!queue.length) {
	                if (!resources.length) {
	                    // Nothing else queued, nothing can be queued
	                    failQuery();
	                }
	                else {
	                    // Queue is empty: run next item immediately
	                    // eslint-disable-next-line @typescript-eslint/no-use-before-define
	                    execNext();
	                }
	            }
	            return;
	        }
	        // Reset timers, abort pending queries
	        resetTimer();
	        clearQueue();
	        // Update index in Redundancy
	        if (success && !config.random) {
	            var index = config.resources.indexOf(item.resource);
	            if (index !== -1 && index !== config.index) {
	                success(index);
	            }
	        }
	        // Mark as completed and call callbacks
	        status = 'completed';
	        doneCallbacks.forEach(function (callback) {
	            callback(data);
	        });
	    }
	    /**
	     * Execute next query
	     */
	    function execNext() {
	        // Check status
	        if (status !== 'pending') {
	            return;
	        }
	        // Reset timer
	        resetTimer();
	        // Get resource
	        var resource = resources.shift();
	        if (resource === void 0) {
	            // Nothing to execute: wait for final timeout before failing
	            if (queue.length) {
	                var timeout$1 = typeof config.timeout === 'function'
	                    ? config.timeout(startTime)
	                    : config.timeout;
	                if (timeout$1) {
	                    // Last timeout before failing to allow late response
	                    timer = setTimeout(function () {
	                        resetTimer();
	                        if (status === 'pending') {
	                            // Clear queue
	                            clearQueue();
	                            failQuery();
	                        }
	                    }, timeout$1);
	                    return;
	                }
	            }
	            // Fail
	            failQuery();
	            return;
	        }
	        // Create new item
	        var item = {
	            getQueryStatus: getQueryStatus,
	            status: 'pending',
	            resource: resource,
	            done: function (data, error) {
	                moduleResponse(item, data, error);
	            },
	        };
	        // Add to queue
	        queue.push(item);
	        // Bump next index
	        queriesSent++;
	        // Get timeout for next item
	        var timeout = typeof config.rotate === 'function'
	            ? config.rotate(queriesSent, startTime)
	            : config.rotate;
	        // Create timer
	        timer = setTimeout(execNext, timeout);
	        // Execute it
	        query(resource, payload, item);
	    }
	    // Execute first query on next tick
	    setTimeout(execNext);
	    // Return getQueryStatus()
	    return getQueryStatus;
	}
	exports.sendQuery = sendQuery;
	});

	var redundancy = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.initRedundancy = void 0;


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
	     * Remove aborted and completed queries
	     */
	    function cleanup() {
	        queries = queries.filter(function (item) { return item().status === 'pending'; });
	    }
	    /**
	     * Send query
	     */
	    function query$1(payload, queryCallback, doneCallback) {
	        var query$1 = query.sendQuery(config, payload, queryCallback, function (data, error) {
	            // Remove query from list
	            cleanup();
	            // Call callback
	            if (doneCallback) {
	                doneCallback(data, error);
	            }
	        }, function (newIndex) {
	            // Update start index
	            config.index = newIndex;
	        });
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

	var sort = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.sortIcons = void 0;

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
	        if (a.provider !== b.provider) {
	            return a.provider.localeCompare(b.provider);
	        }
	        if (a.prefix !== b.prefix) {
	            return a.prefix.localeCompare(b.prefix);
	        }
	        return a.name.localeCompare(b.name);
	    });
	    var lastIcon = {
	        provider: '',
	        prefix: '',
	        name: '',
	    };
	    icons.forEach(function (icon) {
	        if (lastIcon.name === icon.name &&
	            lastIcon.prefix === icon.prefix &&
	            lastIcon.provider === icon.provider) {
	            return;
	        }
	        lastIcon = icon;
	        // Check icon
	        var provider = icon.provider;
	        var prefix = icon.prefix;
	        var name = icon.name;
	        if (storage[provider] === void 0) {
	            storage[provider] = Object.create(null);
	        }
	        var providerStorage = storage[provider];
	        if (providerStorage[prefix] === void 0) {
	            providerStorage[prefix] = storage_1.getStorage(provider, prefix);
	        }
	        var localStorage = providerStorage[prefix];
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
	            provider: provider,
	            prefix: prefix,
	            name: name,
	        };
	        list.push(item);
	    });
	    return result;
	}
	exports.sortIcons = sortIcons;

	});

	var callbacks = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.storeCallback = exports.updateCallbacks = exports.callbacks = void 0;

	// Records sorted by provider and prefix
	// This export is only for unit testing, should not be used
	exports.callbacks = Object.create(null);
	var pendingUpdates = Object.create(null);
	/**
	 * Remove callback
	 */
	function removeCallback(sources, id) {
	    sources.forEach(function (source) {
	        var provider = source.provider;
	        if (exports.callbacks[provider] === void 0) {
	            return;
	        }
	        var providerCallbacks = exports.callbacks[provider];
	        var prefix = source.prefix;
	        var items = providerCallbacks[prefix];
	        if (items) {
	            providerCallbacks[prefix] = items.filter(function (row) { return row.id !== id; });
	        }
	    });
	}
	/**
	 * Update all callbacks for provider and prefix
	 */
	function updateCallbacks(provider, prefix) {
	    if (pendingUpdates[provider] === void 0) {
	        pendingUpdates[provider] = Object.create(null);
	    }
	    var providerPendingUpdates = pendingUpdates[provider];
	    if (!providerPendingUpdates[prefix]) {
	        providerPendingUpdates[prefix] = true;
	        setTimeout(function () {
	            providerPendingUpdates[prefix] = false;
	            if (exports.callbacks[provider] === void 0 ||
	                exports.callbacks[provider][prefix] === void 0) {
	                return;
	            }
	            // Get all items
	            var items = exports.callbacks[provider][prefix].slice(0);
	            if (!items.length) {
	                return;
	            }
	            var storage = storage_1.getStorage(provider, prefix);
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
	                            provider: provider,
	                            prefix: prefix,
	                            name: name,
	                        });
	                    }
	                    else if (storage.missing[name] !== void 0) {
	                        // Missing
	                        icons.missing.push({
	                            provider: provider,
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
	                        removeCallback([
	                            {
	                                provider: provider,
	                                prefix: prefix,
	                            } ], item.id);
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
	function storeCallback(callback, icons, pendingSources) {
	    // Create unique id and abort function
	    var id = idCounter++;
	    var abort = removeCallback.bind(null, pendingSources, id);
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
	    pendingSources.forEach(function (source) {
	        var provider = source.provider;
	        var prefix = source.prefix;
	        if (exports.callbacks[provider] === void 0) {
	            exports.callbacks[provider] = Object.create(null);
	        }
	        var providerCallbacks = exports.callbacks[provider];
	        if (providerCallbacks[prefix] === void 0) {
	            providerCallbacks[prefix] = [];
	        }
	        providerCallbacks[prefix].push(item);
	    });
	    return abort;
	}
	exports.storeCallback = storeCallback;

	});

	var modules$1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getAPIModule = exports.setAPIModule = void 0;
	/**
	 * Local storate types and entries
	 */
	var storage = Object.create(null);
	/**
	 * Set API module
	 */
	function setAPIModule(provider, item) {
	    storage[provider] = item;
	}
	exports.setAPIModule = setAPIModule;
	/**
	 * Get API module
	 */
	function getAPIModule(provider) {
	    return storage[provider] === void 0 ? storage[''] : storage[provider];
	}
	exports.getAPIModule = getAPIModule;

	});

	var config$1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getAPIConfig = exports.setAPIConfig = void 0;
	/**
	 * Create full API configuration from partial data
	 */
	function createConfig(source) {
	    var resources;
	    if (typeof source.resources === 'string') {
	        resources = [source.resources];
	    }
	    else {
	        resources = source.resources;
	        if (!(resources instanceof Array) || !resources.length) {
	            return null;
	        }
	    }
	    var result = {
	        // API hosts
	        resources: resources,
	        // Root path
	        path: source.path === void 0 ? '/' : source.path,
	        // URL length limit
	        maxURL: source.maxURL ? source.maxURL : 500,
	        // Timeout before next host is used.
	        rotate: source.rotate ? source.rotate : 750,
	        // Timeout before failing query.
	        timeout: source.timeout ? source.timeout : 5000,
	        // Randomise default API end point.
	        random: source.random === true,
	        // Start index
	        index: source.index ? source.index : 0,
	        // Receive data after time out (used if time out kicks in first, then API module sends data anyway).
	        dataAfterTimeout: source.dataAfterTimeout !== false,
	    };
	    return result;
	}
	/**
	 * Local storage
	 */
	var configStorage = Object.create(null);
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
	// Add default API
	configStorage[''] = createConfig({
	    resources: ['https://api.iconify.design'].concat(fallBackAPI),
	});
	/**
	 * Add custom config for provider
	 */
	function setAPIConfig(provider, customConfig) {
	    var config = createConfig(customConfig);
	    if (config === null) {
	        return false;
	    }
	    configStorage[provider] = config;
	    return true;
	}
	exports.setAPIConfig = setAPIConfig;
	/**
	 * Get API configuration
	 */
	var getAPIConfig = function (provider) { return configStorage[provider]; };
	exports.getAPIConfig = getAPIConfig;

	});

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
	var stringToIcon = function (value) {
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
	exports.stringToIcon = stringToIcon;
	/**
	 * Check if icon is valid.
	 *
	 * This function is not part of stringToIcon because validation is not needed for most code.
	 */
	var validateIcon = function (icon) {
	    if (!icon) {
	        return false;
	    }
	    return !!((icon.provider === '' || icon.provider.match(match)) &&
	        icon.prefix.match(match) &&
	        icon.name.match(match));
	};
	exports.validateIcon = validateIcon;

	});

	var list = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getProviders = exports.listToIcons = void 0;

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
	                provider: icon.provider,
	                prefix: icon.prefix,
	                name: icon.name,
	            });
	        }
	    });
	    return result;
	}
	exports.listToIcons = listToIcons;
	/**
	 * Get all providers
	 */
	function getProviders(list) {
	    var providers = Object.create(null);
	    list.forEach(function (icon) {
	        providers[icon.provider] = true;
	    });
	    return Object.keys(providers);
	}
	exports.getProviders = getProviders;

	});

	var api = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.API = exports.getRedundancyCache = void 0;








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
	 * [provider][prefix] = array of icon names
	 */
	var iconsToLoad = Object.create(null);
	// Flags to merge multiple synchronous icon requests in one asynchronous request
	var loaderFlags = Object.create(null);
	var queueFlags = Object.create(null);
	var redundancyCache = Object.create(null);
	/**
	 * Get Redundancy instance for provider
	 */
	function getRedundancyCache(provider) {
	    if (redundancyCache[provider] === void 0) {
	        var config = config$1.getAPIConfig(provider);
	        if (!config) {
	            // No way to load icons because configuration is not set!
	            return;
	        }
	        var redundancy$1 = redundancy.initRedundancy(config);
	        var cachedReundancy = {
	            config: config,
	            redundancy: redundancy$1,
	        };
	        redundancyCache[provider] = cachedReundancy;
	    }
	    return redundancyCache[provider];
	}
	exports.getRedundancyCache = getRedundancyCache;
	/**
	 * Function called when new icons have been loaded
	 */
	function loadedNewIcons(provider, prefix) {
	    // Run only once per tick, possibly joining multiple API responses in one call
	    if (loaderFlags[provider] === void 0) {
	        loaderFlags[provider] = Object.create(null);
	    }
	    var providerLoaderFlags = loaderFlags[provider];
	    if (!providerLoaderFlags[prefix]) {
	        providerLoaderFlags[prefix] = true;
	        setTimeout(function () {
	            providerLoaderFlags[prefix] = false;
	            callbacks.updateCallbacks(provider, prefix);
	        });
	    }
	}
	// Storage for errors for loadNewIcons(). Used to avoid spamming log with identical errors.
	var errorsCache = Object.create(null);
	/**
	 * Load icons
	 */
	function loadNewIcons(provider, prefix, icons) {
	    function err() {
	        var key = (provider === '' ? '' : '@' + provider + ':') + prefix;
	        var time = Math.floor(Date.now() / 60000); // log once in a minute
	        if (errorsCache[key] < time) {
	            errorsCache[key] = time;
	            console.error('Unable to retrieve icons for "' +
	                key +
	                '" because API is not configured properly.');
	        }
	    }
	    // Create nested objects if needed
	    if (iconsToLoad[provider] === void 0) {
	        iconsToLoad[provider] = Object.create(null);
	    }
	    var providerIconsToLoad = iconsToLoad[provider];
	    if (queueFlags[provider] === void 0) {
	        queueFlags[provider] = Object.create(null);
	    }
	    var providerQueueFlags = queueFlags[provider];
	    if (pendingIcons[provider] === void 0) {
	        pendingIcons[provider] = Object.create(null);
	    }
	    var providerPendingIcons = pendingIcons[provider];
	    // Add icons to queue
	    if (providerIconsToLoad[prefix] === void 0) {
	        providerIconsToLoad[prefix] = icons;
	    }
	    else {
	        providerIconsToLoad[prefix] = providerIconsToLoad[prefix]
	            .concat(icons)
	            .sort();
	    }
	    // Redundancy item
	    var cachedReundancy;
	    // Trigger update on next tick, mering multiple synchronous requests into one asynchronous request
	    if (!providerQueueFlags[prefix]) {
	        providerQueueFlags[prefix] = true;
	        setTimeout(function () {
	            providerQueueFlags[prefix] = false;
	            // Get icons and delete queue
	            var icons = providerIconsToLoad[prefix];
	            delete providerIconsToLoad[prefix];
	            // Get API module
	            var api = modules$1.getAPIModule(provider);
	            if (!api) {
	                // No way to load icons!
	                err();
	                return;
	            }
	            // Get API config and Redundancy instance
	            if (cachedReundancy === void 0) {
	                var redundancy = getRedundancyCache(provider);
	                if (redundancy === void 0) {
	                    // No way to load icons because configuration is not set!
	                    err();
	                    return;
	                }
	                cachedReundancy = redundancy;
	            }
	            // Prepare parameters and run queries
	            var params = api.prepare(provider, prefix, icons);
	            params.forEach(function (item) {
	                cachedReundancy.redundancy.query(item, api.send, function (data) {
	                    // Add icons to storage
	                    var storage = storage_1.getStorage(provider, prefix);
	                    try {
	                        var added = storage_1.addIconSet(storage, data, 'all');
	                        if (typeof added === 'boolean') {
	                            return;
	                        }
	                        // Remove added icons from pending list
	                        var pending = providerPendingIcons[prefix];
	                        added.forEach(function (name) {
	                            delete pending[name];
	                        });
	                        // Cache API response
	                        if (modules.coreModules.cache) {
	                            modules.coreModules.cache(provider, data);
	                        }
	                    }
	                    catch (err) {
	                        console.error(err);
	                    }
	                    // Trigger update on next tick
	                    loadedNewIcons(provider, prefix);
	                });
	            });
	        });
	    }
	}
	/**
	 * Check if icon is being loaded
	 */
	var isPending = function (icon) {
	    return (pendingIcons[icon.provider] !== void 0 &&
	        pendingIcons[icon.provider][icon.prefix] !== void 0 &&
	        pendingIcons[icon.provider][icon.prefix][icon.name] !== void 0);
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
	    // Get all sources for pending icons
	    var newIcons = Object.create(null);
	    var sources = [];
	    var lastProvider, lastPrefix;
	    sortedIcons.pending.forEach(function (icon) {
	        var provider = icon.provider;
	        var prefix = icon.prefix;
	        if (prefix === lastPrefix && provider === lastProvider) {
	            return;
	        }
	        lastProvider = provider;
	        lastPrefix = prefix;
	        sources.push({
	            provider: provider,
	            prefix: prefix,
	        });
	        if (pendingIcons[provider] === void 0) {
	            pendingIcons[provider] = Object.create(null);
	        }
	        var providerPendingIcons = pendingIcons[provider];
	        if (providerPendingIcons[prefix] === void 0) {
	            providerPendingIcons[prefix] = Object.create(null);
	        }
	        if (newIcons[provider] === void 0) {
	            newIcons[provider] = Object.create(null);
	        }
	        var providerNewIcons = newIcons[provider];
	        if (providerNewIcons[prefix] === void 0) {
	            providerNewIcons[prefix] = [];
	        }
	    });
	    // List of new icons
	    var time = Date.now();
	    // Filter pending icons list: find icons that are not being loaded yet
	    // If icon was called before, it must exist in pendingIcons or storage, but because this
	    // function is called right after sortIcons() that checks storage, icon is definitely not in storage.
	    sortedIcons.pending.forEach(function (icon) {
	        var provider = icon.provider;
	        var prefix = icon.prefix;
	        var name = icon.name;
	        var pendingQueue = pendingIcons[provider][prefix];
	        if (pendingQueue[name] === void 0) {
	            // New icon - add to pending queue to mark it as being loaded
	            pendingQueue[name] = time;
	            // Add it to new icons list to pass it to API module for loading
	            newIcons[provider][prefix].push(name);
	        }
	    });
	    // Load icons on next tick to make sure result is not returned before callback is stored and
	    // to consolidate multiple synchronous loadIcons() calls into one asynchronous API call
	    sources.forEach(function (source) {
	        var provider = source.provider;
	        var prefix = source.prefix;
	        if (newIcons[provider][prefix].length) {
	            loadNewIcons(provider, prefix, newIcons[provider][prefix]);
	        }
	    });
	    // Store callback and return abort function
	    return callback
	        ? callbacks.storeCallback(callback, sortedIcons, sources)
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

	var jsonp = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getAPIModule = void 0;
	var global = null;
	/**
	 * Endpoint
	 */
	var endPoint = '{prefix}.js?icons={icons}&callback={callback}';
	/**
	 * Cache: provider:prefix = value
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
	 * Return API module
	 */
	var getAPIModule = function (getAPIConfig) {
	    /**
	     * Calculate maximum icons list length for prefix
	     */
	    function calculateMaxLength(provider, prefix) {
	        // Get config and store path
	        var config = getAPIConfig(provider);
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
	            config.resources.forEach(function (item) {
	                var host = item;
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
	                    endPoint
	                        .replace('{provider}', provider)
	                        .replace('{prefix}', prefix)
	                        .replace('{icons}', '').length -
	                    extraLength;
	        }
	        // Cache stuff and return result
	        var cacheKey = provider + ':' + prefix;
	        pathCache[cacheKey] = config.path;
	        maxLengthCache[cacheKey] = result;
	        return result;
	    }
	    /**
	     * Prepare params
	     */
	    var prepare = function (provider, prefix, icons) {
	        var results = [];
	        // Get maximum icons list length
	        var cacheKey = provider + ':' + prefix;
	        var maxLength = maxLengthCache[cacheKey];
	        if (maxLength === void 0) {
	            maxLength = calculateMaxLength(provider, prefix);
	        }
	        // Split icons
	        var item = {
	            provider: provider,
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
	                    provider: provider,
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
	    var send = function (host, params, status) {
	        var provider = params.provider;
	        var prefix = params.prefix;
	        var icons = params.icons;
	        var iconsList = icons.join(',');
	        var cacheKey = provider + ':' + prefix;
	        // Create callback prefix
	        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	        var cbPrefix = prefix.split('-').shift().slice(0, 3);
	        var global = getGlobal();
	        // Callback hash
	        var cbCounter = hash(provider + ':' + host + ':' + prefix + ':' + iconsList);
	        while (global[cbPrefix + cbCounter] !== void 0) {
	            cbCounter++;
	        }
	        var callbackName = cbPrefix + cbCounter;
	        var path = pathCache[cacheKey] +
	            endPoint
	                .replace('{provider}', provider)
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
	    // Return functions
	    return {
	        prepare: prepare,
	        send: send,
	    };
	};
	exports.getAPIModule = getAPIModule;

	});

	var fetch_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getAPIModule = void 0;
	/**
	 * Endpoint
	 */
	var endPoint = '{prefix}.json?icons={icons}';
	/**
	 * Cache
	 */
	var maxLengthCache = Object.create(null);
	var pathCache = Object.create(null);
	/**
	 * Return API module
	 */
	var getAPIModule = function (getAPIConfig) {
	    /**
	     * Calculate maximum icons list length for prefix
	     */
	    function calculateMaxLength(provider, prefix) {
	        // Get config and store path
	        var config = getAPIConfig(provider);
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
	            config.resources.forEach(function (item) {
	                var host = item;
	                maxHostLength = Math.max(maxHostLength, host.length);
	            });
	            // Get available length
	            result =
	                config.maxURL -
	                    maxHostLength -
	                    config.path.length -
	                    endPoint
	                        .replace('{provider}', provider)
	                        .replace('{prefix}', prefix)
	                        .replace('{icons}', '').length;
	        }
	        // Cache stuff and return result
	        var cacheKey = provider + ':' + prefix;
	        pathCache[cacheKey] = config.path;
	        maxLengthCache[cacheKey] = result;
	        return result;
	    }
	    /**
	     * Prepare params
	     */
	    var prepare = function (provider, prefix, icons) {
	        var results = [];
	        // Get maximum icons list length
	        var maxLength = maxLengthCache[prefix];
	        if (maxLength === void 0) {
	            maxLength = calculateMaxLength(provider, prefix);
	        }
	        // Split icons
	        var item = {
	            provider: provider,
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
	                    provider: provider,
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
	    var send = function (host, params, status) {
	        var provider = params.provider;
	        var prefix = params.prefix;
	        var icons = params.icons;
	        var iconsList = icons.join(',');
	        var cacheKey = provider + ':' + prefix;
	        var path = pathCache[cacheKey] +
	            endPoint
	                .replace('{provider}', provider)
	                .replace('{prefix}', prefix)
	                .replace('{icons}', iconsList);
	        // console.log('API query:', host + path);
	        fetch(host + path)
	            .then(function (response) {
	            if (response.status !== 200) {
	                status.done(void 0, response.status);
	                return;
	            }
	            return response.json();
	        })
	            .then(function (data) {
	            if (typeof data !== 'object' || data === null) {
	                return;
	            }
	            // Store cache and complete
	            status.done(data);
	        })
	            .catch(function (err) {
	            // Error
	            status.done(void 0, err.errno);
	        });
	    };
	    // Return functions
	    return {
	        prepare: prepare,
	        send: send,
	    };
	};
	exports.getAPIModule = getAPIModule;

	});

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
	function renderIcon(placeholder, customisations$1, iconData, returnString) {
	    var data = builder.iconToSVG(iconData, customisations.fullCustomisations(customisations$1));
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
	        ids.replaceIDs(data.body) +
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
	            customisations: customisations$1,
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
	function cleanIconName(name$1) {
	    if (typeof name$1 === 'string') {
	        name$1 = name.stringToIcon(name$1);
	    }
	    return name$1 === null || !name.validateIcon(name$1) ? null : name$1;
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
	                        if (modules.coreModules.api &&
	                            modules.coreModules.api.isPending({
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
	            var storage = storage_1.getStorage(provider, prefix);
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
	                renderIcon(item, customisations, storage_1.getIcon(storage, name));
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
	            if (modules.coreModules.api) {
	                if (!modules.coreModules.api.isPending({ provider: provider, prefix: prefix, name: name })) {
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
	    if (modules.coreModules.api) {
	        var api = modules.coreModules.api;
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
	            var value = rotate.rotateFromString(getAttribute(element, 'data-rotate'));
	            if (value) {
	                result.rotate = value;
	            }
	        }
	        // Shorthand attributes
	        if (hasAttribute(element, 'data-flip')) {
	            shorthand.flipFromString(result, getAttribute(element, 'data-flip'));
	        }
	        if (hasAttribute(element, 'data-align')) {
	            shorthand.alignmentFromString(result, getAttribute(element, 'data-align'));
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
	function getIconName(name$1) {
	    var icon = name.stringToIcon(name$1);
	    if (!name.validateIcon(icon)) {
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
	        ? storage_1.getIcon(storage_1.getStorage(icon.provider, icon.prefix), icon.name)
	        : null;
	}
	/**
	 * Get SVG data
	 */
	function buildIcon(name, customisations$1) {
	    // Get icon data
	    var iconData = getIconData(name);
	    if (!iconData) {
	        return null;
	    }
	    // Clean up customisations
	    var changes = customisations.fullCustomisations(customisations$1);
	    // Get data
	    return builder.iconToSVG(iconData, changes);
	}
	/**
	 * Generate icon
	 */
	function generateIcon(name$1, customisations$1, returnString) {
	    // Get icon data
	    var iconData = getIconData(name$1);
	    if (!iconData) {
	        return null;
	    }
	    // Split name
	    var iconName = name.stringToIcon(name$1);
	    // Clean up customisations
	    var changes = customisations.fullCustomisations(customisations$1);
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
	        !name.validateIcon({
	            provider: provider,
	            prefix: data.prefix,
	            name: 'a',
	        })) {
	        return false;
	    }
	    var storage = storage_1.getStorage(provider, data.prefix);
	    return !!storage_1.addIconSet(storage, data);
	}
	/**
	 * Global variable
	 */
	var IconifyCommon = {
	    // Version
	    getVersion: function () { return '2.0.0-rc.3'; },
	    // Check if icon exists
	    iconExists: function (name) { return getIconData(name) !== null; },
	    // Get raw icon data
	    getIcon: function (name) {
	        var result = getIconData(name);
	        return result ? merge_1.merge(result) : null;
	    },
	    // List icons
	    listIcons: storage_1.listIcons,
	    // Add icon
	    addIcon: function (name, data) {
	        var icon = getIconName(name);
	        if (!icon) {
	            return false;
	        }
	        var storage = storage_1.getStorage(icon.provider, icon.prefix);
	        return storage_1.addIcon(storage, icon.name, data);
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
	    replaceIDs: ids.replaceIDs,
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

	function toggleCache(storage$1, value) {
	    switch (storage$1) {
	        case 'local':
	        case 'session':
	            storage.config[storage$1] = value;
	            break;
	        case 'all':
	            for (var key in storage.config) {
	                storage.config[key] = value;
	            }
	            break;
	    }
	}
	/**
	 * Global variable
	 */
	var Iconify = {
	    // Load icons
	    loadIcons: api.API.loadIcons,
	    // API providers
	    addAPIProvider: config$1.setAPIConfig,
	    // Toggle storage
	    enableCache: function (storage, value) {
	        toggleCache(storage, typeof value === 'boolean' ? value : true);
	    },
	    disableCache: function (storage) {
	        toggleCache(storage, false);
	    },
	    // Exposed internal functions
	    _internal: {
	        // Calculate size
	        calculateSize: calcSize_1.calcSize,
	        // Get API data
	        getAPI: api.getRedundancyCache,
	        // Get API config
	        getAPIConfig: config$1.getAPIConfig,
	        // Get API module
	        setAPIModule: modules$1.setAPIModule,
	    },
	};
	// Merge with common functions
	for (var key in IconifyCommon) {
	    Iconify[key] = IconifyCommon[key];
	}
	/**
	 * Initialise stuff
	 */
	// Set API
	modules.coreModules.api = api.API;
	var getAPIModule;
	try {
	    getAPIModule =
	        typeof fetch === 'function' && typeof Promise === 'function'
	            ? fetch_1.getAPIModule
	            : jsonp.getAPIModule;
	}
	catch (err) {
	    getAPIModule = jsonp.getAPIModule;
	}
	modules$1.setAPIModule('', getAPIModule(config$1.getAPIConfig));
	if (typeof document !== 'undefined' && typeof window !== 'undefined') {
	    // Set cache and load existing cache
	    modules.coreModules.cache = storage.storeCache;
	    storage.loadCache();
	    var _window$1 = window;
	    if (_window$1
	        .IconifyProviders !== void 0) {
	        var providers = _window$1
	            .IconifyProviders;
	        if (typeof providers === 'object' && providers !== null) {
	            for (var key$1 in providers) {
	                var err$1 = 'IconifyProviders[' + key$1 + '] is invalid.';
	                try {
	                    var value = providers[key$1];
	                    if (typeof value !== 'object' ||
	                        !value ||
	                        value.resources === void 0) {
	                        continue;
	                    }
	                    if (!config$1.setAPIConfig(key$1, value)) {
	                        console.error(err$1);
	                    }
	                }
	                catch (e) {
	                    console.error(err$1);
	                }
	            }
	        }
	    }
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
