"use strict";

if (self.SimpleSVG === void 0) {
    self.SimpleSVG = {
        isReady: false
    };
    (function (SimpleSVG, global) {
        var local = {
            config: {},
            version: '0.3.0'
        };

        
		/**
		 * Function to fire custom event and IE9 polyfill
		 */
		(function(local) {
		    
		    /**
		     * CustomEvent polyfill for IE9
		     * From https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
		     */
		    (function() {
		        if (typeof window.CustomEvent === 'function') return false;
		
		        function CustomEvent(event, params) {
		            var evt;
		
		            params = params || { bubbles: false, cancelable: false, detail: void 0 };
		            evt = document.createEvent('CustomEvent');
		            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
		
		            return evt;
		        }
		
		        CustomEvent.prototype = window.Event.prototype;
		        window.CustomEvent = CustomEvent;
		    })();
		
		    /**
		     * Dispatch custom event
		     *
		     * @param {string} name Event name
		     * @param {object} [params] Event parameters
		     */
		    local.event = function(name, params) {
		        document.dispatchEvent(new CustomEvent(name, params));
		    };
		
		})(local);

		/**
		 * Check if DOM is ready, fire stuff when it is
		 */
		(function(SimpleSVG, local, config) {
		    
		    var loaded = false,
		        initialized = false;
		
		    /**
		     * DOM is ready. Initialize stuff
		     */
		    function DOMReady() {
		        loaded = true;
		        local.init();
		    }
		
		    /**
		     * Remove event listeners and call DOMReady()
		     */
		    function DOMLoaded() {
		        document.removeEventListener('DOMContentLoaded', DOMLoaded);
		        window.removeEventListener('load', DOMLoaded);
		        DOMReady();
		    }
		
		    /**
		     * List of callbacks to call to test if script is ready
		     * Callback should return false if not ready, true if ready
		     *
		     * @type {[{Function}]}
		     */
		    local.preInitQueue = [function() {
		        return loaded;
		    }];
		
		    /**
		     * List of callbacks to call when SimpleSVG is ready
		     *
		     * @type {[function]}
		     */
		    local.initQueue = [];
		
		    /**
		     * Initialize SimpleSVG
		     */
		    local.init = function() {
		        if (initialized) {
		            return;
		        }
		
		        // Filter all callbacks, keeping only those that return false
		        local.preInitQueue = local.preInitQueue.filter(function(callback) {
		            return !callback();
		        });
		
		        // Callbacks queue is empty - script is ready to be initialized
		        if (!local.preInitQueue.length) {
		            initialized = true;
		            window.setTimeout(function() {
		                SimpleSVG.isReady = true;
		                local.initQueue.forEach(function(callback) {
		                    callback();
		                });
		                local.event(config._readyEvent);
		            });
		        }
		    };
		
		    /**
		     * Events to run when SimpleSVG is ready
		     *
		     * @param {function} callback
		     */
		    SimpleSVG.ready = function(callback) {
		        if (SimpleSVG.isReady) {
		            window.setTimeout(callback);
		        } else {
		            document.addEventListener(config._readyEvent, callback);
		        }
		    };
		
		    // Do stuff on next tick after script has loaded
		    window.setTimeout(function() {
		        if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
		            DOMReady();
		        } else {
		            document.addEventListener('DOMContentLoaded', DOMLoaded);
		            window.addEventListener('load', DOMLoaded);
		        }
		    });
		
		})(SimpleSVG, local, local.config);

		/**
		 * Default configuration.
		 * Configuration variables that cannot be changed after script has loaded start with _
		 *
		 * Additional defaults.js are included in sub-directories, with different content for different builds
		 */
		(function(config) {
		    
		    // Custom default attributes for SVG
		    config.SVGAttributes = {};
		
		    // Class name for icons
		    config._imageClass = 'simple-svg';
		
		    // Class name for image that is being loaded
		    config._loadingClass = 'svg-loading';
		
		    // Attribute that stores icon name
		    config._iconAttribute = 'data-icon';
		
		    // Attribute for rotation
		    config._rotateAttribute = 'data-rotate';
		
		    // Attribute for flip
		    config._flipAttribute = 'data-flip';
		
		    // Attribute for inline mode
		    config._inlineModeAttribute = 'data-icon-inline';
		
		    // Attribute for alignment
		    config._alignAttribute = 'data-align';
		
		    // Attribute to append icon to element instead of replacing element
		    config._appendAttribute = 'data-icon-append';
		
		    // Class to add to container when content has been appended
		    config._appendedClass = 'svg-appended';
		
		    // Event to call when SimpleSVG is ready
		    config._readyEvent = 'SimpleSVGReady';
		
		    // Polyfill URLs
		    config._webComponentsPolyfill = '//cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/0.7.24/webcomponents-lite.min.js';
		    config._classListPolyfill = '//cdnjs.cloudflare.com/ajax/libs/classlist/1.1.20150312/classList.min.js';
		
		})(local.config);

		/**
		 * Default configuration when CDN module is included
		 */
		(function(config) {
		    
		    // CDN callback script
		    config.defaultCDN = '//icons.simplesvg.com/{prefix}.js?icons={icons}';
		
		    // Custom CDN list. Key = prefix, value = CDN URL
		    config._cdn = {};
		
		    // Maximum URL size for CDN
		    config.loaderMaxURLSize = 500;
		
		    // Custom event to call when new set of images is added
		    config._loaderEvent = 'SimpleSVGAddedIcons';
		
		})(local.config);

		/**
		 * Merge custom and default configuration and functions for changing config values
		 *
		 * It will merge default config with SimpleSVGConfig object if it exists
		 */
		(function(SimpleSVG, global, local, config) {
		    
		    /**
		     * Change config value
		     *
		     * @param {string} key
		     * @param {*} value
		     * @param {boolean} canChangeHardcoded
		     */
		    function setConfig(key, value, canChangeHardcoded) {
		        if (!canChangeHardcoded && key.slice(0, 1) === '_') {
		            return;
		        }
		
		        switch (key) {
		            case '_customCDN':
		            case 'SVGAttributes':
		                // Merge objects
		                Object.keys(value).forEach(function (key2) {
		                    config[key][key2] = value[key2];
		                });
		                break;
		
		            default:
		                // Overwrite config
		                config[key] = value;
		        }
		    }
		
		    /**
		     * Merge configuration objects
		     *
		     * @param {object} list
		     * @param {boolean} canChangeHardcoded
		     */
		    function mergeConfig(list, canChangeHardcoded) {
		        Object.keys(list).forEach(function(key) {
		            setConfig(key, list[key], canChangeHardcoded);
		        });
		    }
		
		    /**
		     * Change configuration option
		     *
		     * @param {string} name
		     * @param {*} value
		     */
		    SimpleSVG.setConfig = function(name, value) {
		        setConfig(name, value, false);
		    };
		
		    /**
		     * Set custom CDN URL
		     *
		     * @param {string|Array} prefix Collection prefix
		     * @param {string} url JSONP URL. There are several possible variables in URL:
		     *
		     *      {icons} represents icons list
		     *      {callback} represents SimpleSVG callback function
		     *      {prefix} is replaced with collection prefix (used when multiple collections are added with same url)
		     *
		     *      All variables are optional. If {icons} is missing, callback must return entire collection.
		     */
		    SimpleSVG.setCustomCDN = function(prefix, url) {
		        (typeof prefix === 'string' ? [prefix] : prefix).forEach(function(key) {
		            config._cdn[key] = url;
		        });
		    };
		
		    /**
		     * Get configuration value
		     *
		     * @param {string} name
		     * @return {*}
		     */
		    SimpleSVG.getConfig = function(name) {
		        return config[name];
		    };
		
		    // Merge configuration with SimpleSVGConfig object
		    if (global.SimpleSVGConfig !== void 0 && typeof global.SimpleSVGConfig === 'object') {
		        mergeConfig(global.SimpleSVGConfig, true);
		    }
		
		})(SimpleSVG, global, local, local.config);

		/**
		 * Observer polyfill loader
		 */
		(function(local, config, global) {
		    
		    var polyCounter = false,
		        loading = {
		            observer: false,
		            classList: false
		        },
		        timer;
		
		    /**
		     * Load script
		     *
		     * @param {string} url
		     */
		    function load(url) {
		        var element;
		
		        if (!url.length) {
		            return;
		        }
		
		        element = document.createElement('script');
		        element.setAttribute('src', url);
		        element.setAttribute('type', 'text/javascript');
		        element.setAttribute('async', true);
		
		        document.head.appendChild(element);
		    }
		
		    /**
		     * Check if polyfills have loaded
		     */
		    function check() {
		        // Check if observer has loaded
		        if (loading.observer && global.MutationObserver && global.WeakMap) {
		            loading.observer = false;
		        }
		
		        // Check if classList has loaded
		        if (loading.classList && ('classList' in document.createElement('div'))) {
		            loading.classList = false;
		        }
		
		        // Done
		        if (!loading.observer && !loading.classList) {
		            clearInterval(timer);
		            local.init();
		            return;
		        }
		
		        // Increase counter
		        polyCounter ++;
		        if (polyCounter === 60) {
		            // Polyfills didn't load after 30 seconds - increase timer to reduce page load
		            clearInterval(timer);
		            timer = setInterval(check, 5000);
		        }
		    }
		
		    // Check if ClassList is available in browser
		    // P.S. IE must die!
		    if (!('classList' in document.createElement('div'))) {
		        // Try to load polyfill
		        loading.classList = true;
		        load(config._classListPolyfill);
		    }
		
		    // Check if MutationObserver is available in browser
		    // P.S. IE must die!
		    if ((!global.MutationObserver || !global.WeakMap)) {
		        // Try to load polyfill
		        loading.observer = true;
		        load(config._webComponentsPolyfill);
		    }
		
		    // Setup timer and callback to check polyfills
		    if (loading.observer || loading.classList) {
		        local.preInitQueue.push(function() {
		            return !loading.observer && !loading.classList;
		        });
		        polyCounter = 1;
		        timer = setInterval(check, 500);
		    }
		
		})(local, local.config, global);

		(function() {
			
			/**
			 * Default values for attributes
			 *
			 * @type {object}
			 */
			var itemDefaults = {
			    left: 0,
			    top: 0,
			    rotate: 0,
			    vFlip: false,
			    hFlip: false,
			    inlineTop: 0
			};
			
			/**
			 * List of attributes to check
			 *
			 * @type {[string]}
			 */
			var itemAttributes = [
			    // Dimensions
			    'left', 'top', 'width', 'height',
			    // Content
			    'body',
			    // Transformations
			    'rotate', 'vFlip', 'hFlip',
			    // Inline mode data
			    'inlineTop', 'inlineHeight', 'verticalAlign'
			];
			
			/**
			 * Normalize icon, return new object
			 *
			 * @param {object} item Item data
			 * @param {object} [defaults] Default values for missing attributes
			 * @return {object|null}
			 */
			function normalizeIcon(item, defaults) {
			    var error = false,
			        result = {};
			
			    defaults = defaults === void 0 ? itemDefaults : defaults;
			
			    itemAttributes.forEach(function(attr) {
			        if (error) {
			            return;
			        }
			        if (item[attr] === void 0) {
			            if (defaults[attr] === void 0) {
			                switch (attr) {
			                    case 'inlineHeight':
			                        result[attr] = result.height;
			                        break;
			
			                    case 'verticalAlign':
			                        if (item.height % 7 === 0 && item.height % 8 !== 0) {
			                            // Icons designed for 14px height
			                            result[attr] = -0.143;
			                        } else {
			                            // Assume icon is designed for 16px height
			                            result[attr] = -0.125;
			                        }
			                        break;
			
			                    default:
			                        error = true;
			                }
			                return;
			            }
			            result[attr] = defaults[attr];
			        } else {
			            result[attr] = normalizeValue(attr, item[attr]);
			            if (result[attr] === null) {
			                error = true;
			            }
			        }
			    });
			
			    return error ? null : result;
			}
			
			/**
			 * Normalize alias, return new object
			 *
			 * @param {object} item Alias data
			 * @param {object} items List of available items
			 * @return {object|null}
			 */
			function normalizeAlias(item, items) {
			    var parent, result, error, prefix;
			
			    if (typeof item.parent !== 'string') {
			        return null;
			    }
			
			    prefix = item.parent.split('-').shift();
			    if (!items[prefix] || items[prefix][item.parent] === void 0) {
			        return null;
			    }
			
			    parent = items[prefix][item.parent];
			    result = {
			        parent: item.parent
			    };
			    error = false;
			
			    itemAttributes.forEach(function(attr) {
			        if (error) {
			            return;
			        }
			
			        if (item[attr] === void 0) {
			            result[attr] = parent[attr];
			        } else {
			            switch (attr) {
			                case 'rotate':
			                    result[attr] = mergeRotation(parent[attr], item[attr]);
			                    break;
			
			                case 'hFlip':
			                case 'vFlip':
			                    result[attr] = mergeFlip(parent[attr], item[attr]);
			                    break;
			
			                default:
			                    result[attr] = normalizeValue(attr, item[attr]);
			            }
			            if (result[attr] === null) {
			                error = true;
			            }
			        }
			    });
			    return error ? null : result;
			}
			
			/**
			 * Convert value to appropriate type
			 *
			 * @param {string} attr Attribute name
			 * @param {*} value Value
			 * @return {*}
			 */
			function normalizeValue(attr, value) {
			    switch (attr) {
			        case 'rotate':
			            value = parseInt(value);
			            if (isNaN(value)) {
			                return null;
			            }
			            while (value < 0) {
			                value += 4;
			            }
			            if (value > 3) {
			                value %= 4;
			            }
			            return value;
			
			        case 'width':
			        case 'height':
			        case 'inlineHeight':
			        case 'inlineTop':
			        case 'verticalAlign':
			            value = parseFloat(value);
			            return isNaN(value) ? null : value;
			
			        case 'vFlip':
			        case 'hFlip':
			            return !!value;
			
			        case 'body':
			            return typeof value === 'string' ? value : null;
			    }
			    return value;
			}
			
			/**
			 * Merge and normalize rotate values
			 *
			 * @param value1
			 * @param value2
			 * @return {*}
			 */
			function mergeRotation(value1, value2) {
			    return normalizeValue('rotate', value1 + value2);
			}
			
			/**
			 * Merge and normalize flip values
			 *
			 * @param value1
			 * @param value2
			 * @return {boolean}
			 */
			function mergeFlip(value1, value2) {
			    return (!!value1) !== (!!value2);
			}
			
			/**
			 * Returns new instance of storage object
			 *
			 * @return {object}
			 * @constructor
			 */
			function Storage() {
			    this.items = {};
			
			    /**
			     * Function to add collection
			     *
			     * @param {object} json JSON data
			     * @param {string} [collectionPrefix] Common prefix used in collection
			     * @return {number} Number of added items
			     */
			    this.addCollection = function(json, collectionPrefix) {
			        // Get default values
			        var defaults = {},
			            items = this.items,
			            added = 0;
			
			        // Get default values for icons
			        itemAttributes.forEach(function(attr) {
			            if (json[attr] !== void 0) {
			                defaults[attr] = json[attr];
			            } else if (itemDefaults[attr] !== void 0) {
			                defaults[attr] = itemDefaults[attr];
			            }
			        });
			
			        // Parse icons
			        if (json.icons !== void 0) {
			            Object.keys(json.icons).forEach(function(key) {
			                var item = normalizeIcon(json.icons[key], defaults),
			                    prefix;
			
			                if (item !== null) {
			                    prefix = collectionPrefix ? collectionPrefix : key.split('-').shift();
			                    if (items[prefix] === void 0) {
			                        items[prefix] = {};
			                    }
			
			                    items[prefix][key] = item;
			                    added ++;
			                }
			            });
			        }
			
			        // Parse aliases
			        if (json.aliases !== void 0) {
			            Object.keys(json.aliases).forEach(function(key) {
			                var item = normalizeAlias(json.aliases[key], items),
			                    prefix;
			
			                if (item !== null) {
			                    prefix = collectionPrefix ? collectionPrefix : key.split('-').shift();
			                    if (items[prefix] === void 0) {
			                        items[prefix] = {};
			                    }
			
			                    items[prefix][key] = item;
			                    added ++;
			                }
			            });
			        }
			
			        return added;
			    };
			
			    /**
			     * Add icon
			     *
			     * @param {string} name Icon name
			     * @param {object} data Icon data
			     * @return {boolean} True if icon was added, false on error
			     */
			    this.addIcon = function(name, data) {
			        var prefix = name.split('-').shift();
			
			        if (data.parent !== void 0) {
			            data = normalizeAlias(data, this.items);
			        } else {
			            data = normalizeIcon(data, itemDefaults);
			            if (this.items[prefix] === void 0) {
			                this.items[prefix] = {};
			            }
			        }
			        return !!(this.items[prefix][name] = data);
			    };
			
			    /**
			     * Check if icon exists
			     *
			     * @param {string} name Icon name
			     * @param {string} [prefix] Icon prefix
			     * @return {boolean}
			     */
			    this.exists = function(name, prefix) {
			        prefix = prefix === void 0 ? name.split('-').shift() : prefix;
			        return this.items[prefix] !== void 0 && this.items[prefix][name] !== void 0;
			    };
			
			    /**
			     * Get list of available items
			     *
			     * @param {string} [prefix] Optional prefix
			     * @return {Array}
			     */
			    this.list = function(prefix) {
			        var results, items;
			
			        if (prefix !== void 0) {
			            return this.items[prefix] === void 0 ? [] : Object.keys(this.items[prefix]);
			        }
			
			        results = [];
			        items = this.items;
			        Object.keys(items).forEach(function(prefix) {
			            results = results.concat(Object.keys(items[prefix]));
			        });
			        return results;
			    };
			
			    /**
			     * Get item data
			     *
			     * @param {string} name
			     * @param {boolean} [copy] True if object should be copied. Default = true
			     * @return {null}
			     */
			    this.get = function(name, copy) {
			        var prefix = name.split('-').shift(),
			            result, item;
			
			        if (!this.items[prefix] || this.items[prefix][name] === void 0) {
			            return null;
			        }
			
			        if (copy === false) {
			            return this.items[prefix][name];
			        }
			
			        result = {};
			        item = this.items[prefix][name];
			
			        itemAttributes.forEach(function(key) {
			            result[key] = item[key];
			        });
			
			        return result;
			    };
			
			    return this;
			}
			
			// Export static functions used by SVG object
			Storage.mergeFlip = mergeFlip;
			Storage.mergeRotation = mergeRotation;
			Storage.normalizeIcon = normalizeIcon;
			
			local.Storage = Storage;
		})();

		/**
		 * Icons storage handler
		 */
		(function(SimpleSVG, local) {
		    
		    var eventQueued = false,
		        storage = new local.Storage();
		
		    /**
		     * Triggers callback
		     */
		    function triggerCallback() {
		        if (!eventQueued) {
		            return;
		        }
		        eventQueued = false;
		        local.iconsAdded();
		    }
		
		    /**
		     * Function to add collection
		     *
		     * @param {object} json JSON data
		     * @return {number} Number of added items
		     */
		    SimpleSVG.addCollection = function(json) {
		        var result = storage.addCollection(json);
		        if (result) {
		            if (!eventQueued) {
		                eventQueued = true;
		                window.setTimeout(triggerCallback, 0);
		            }
		        }
		    };
		
		    /**
		     * Add icon
		     *
		     * @param {string} name Icon name
		     * @param {object} data Icon data
		     * @return {boolean} True if icon was added, false on error
		     */
		    SimpleSVG.addIcon = function(name, data) {
		        var result = storage.addIcon(name, data);
		        if (result) {
		            if (!eventQueued) {
		                eventQueued = true;
		                window.setTimeout(triggerCallback, 0);
		            }
		        }
		        return result;
		    };
		
		    /**
		     * Check if icon exists
		     *
		     * @param {string} name Icon name
		     * @return {boolean}
		     */
		    SimpleSVG.iconExists = storage.exists.bind(storage);
		
		    /**
		     * Get icon data
		     *
		     * @param {string} name
		     * @param {boolean} [copy] True if object should be copied. Default = true
		     * @return {null}
		     */
		    SimpleSVG.getIcon = storage.get.bind(storage);
		
		    /**
		     * Get list of available icons
		     *
		     * @return {Array}
		     */
		    SimpleSVG.listIcons = storage.list.bind(storage);
		
		})(SimpleSVG, local);

		(function() {
			
			var Storage = local.Storage;
			var config = local.config;
			
			/**
			 * Regular expressions for calculating dimensions
			 *
			 * @type {RegExp}
			 */
			var unitsSplit = /(-?[0-9.]*[0-9]+[0-9.]*)/g,
			    unitsTest = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
			
			/**
			 * List of attributes used in generating SVG code that should not be passed to SVG object
			 *
			 * @type {Array}
			 */
			var reservedAttributes = ['width', 'height', 'inline'];
			
			/**
			 * Unique id counter
			 *
			 * @type {number}
			 */
			var idCounter = 0;
			
			/**
			 * Calculate second dimension when only 1 dimension is set
			 *
			 * @param {string|number} size One dimension (such as width)
			 * @param {number} ratio Width/height ratio.
			 *      If size is width, ratio = height/width
			 *      If size is height, ratio = width/height
			 * @param {number} [precision] Floating number precision in result to minimize output. Default = 100
			 * @return {string|number} Another dimension
			 */
			function calculateDimension(size, ratio, precision) {
			    var split, number, results, code, isNumber, num;
			
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
			    split = size.split(unitsSplit);
			    if (split === null || !split.length) {
			        return size;
			    }
			
			    results = [];
			    code = split.shift();
			    isNumber = unitsTest.test(code);
			
			    while (true) {
			        if (isNumber) {
			            num = parseFloat(code);
			            if (isNaN(num)) {
			                results.push(code);
			            } else {
			                results.push(Math.ceil(num * ratio * precision) / precision);
			            }
			        } else {
			            results.push(code);
			        }
			
			        // next
			        code = split.shift();
			        if (code === void 0) {
			            return results.join('');
			        }
			        isNumber = !isNumber;
			    }
			}
			
			/**
			 * Get transformation string
			 *
			 * @param {object} attr Attributes
			 * @return {string} Result is never empty. If no transformation is applied, returns rotate(360deg) that fixes
			 *  rendering issue for small icons in Firefox
			 */
			function calculateTransformation(attr) {
			    var rotate = attr.rotate;
			
			    function rotation() {
			        while (rotate < 1) {
			            rotate += 4;
			        }
			        while (rotate > 4) {
			            rotate -= 4;
			        }
			        return 'rotate(' + (rotate * 90) + 'deg)';
			    }
			
			    if (attr.vFlip && attr.hFlip) {
			        rotate += 2;
			        return rotation();
			    }
			
			    if (attr.vFlip || attr.hFlip) {
			        return (rotate ? rotation() + ' ' : '') + 'scale(' + (attr.hFlip ? '-' : '') + '1, ' + (attr.vFlip ? '-' : '') + '1)';
			    }
			    return rotation();
			}
			
			/**
			 * Replace IDs in SVG output with unique IDs
			 * Fast replacement without parsing XML, assuming commonly used patterns.
			 *
			 * @param body
			 * @return {*}
			 */
			function replaceIDs(body) {
			    var regex = /\sid="(\S+)"/g,
			        ids = [],
			        match, prefix;
			
			    function strReplace(search, replace, subject) {
			        var pos = 0;
			
			        while ((pos = subject.indexOf(search, pos)) !== -1) {
			            subject = subject.slice(0, pos) + replace + subject.slice(pos + search.length);
			            pos += replace.length;
			        }
			
			        return subject;
			    }
			
			    // Find all IDs
			    while (match = regex.exec(body)) {
			        ids.push(match[1]);
			    }
			    if (!ids.length) {
			        return body;
			    }
			
			    prefix = 'SimpleSVGId-' + Math.round(Math.random() * 65536).toString(16) + '-';
			
			    // Replace with unique ids
			    ids.forEach(function(id) {
			        var newID = prefix + idCounter;
			        idCounter ++;
			        body = strReplace('="' + id + '"', '="' + newID + '"', body);
			        body = strReplace('="#' + id + '"', '="#' + newID + '"', body);
			        body = strReplace('(#' + id + ')', '(#' + newID + ')', body);
			    });
			
			    return body;
			}
			
			
			/**
			 * Get boolean attribute value
			 *
			 * @param {object} attributes
			 * @param {Array} properties
			 * @param {*} defaultValue
			 * @return {*}
			 */
			function getBooleanValue(attributes, properties, defaultValue) {
			    var i, prop, value;
			
			    for (i = 0; i < properties.length; i++) {
			        prop = properties[i];
			        if (attributes[prop] !== void 0) {
			            value = attributes[prop];
			            switch (typeof value) {
			                case 'boolean':
			                    return value;
			
			                case 'number':
			                    return !!value;
			
			                case 'string':
			                    switch (value.toLowerCase()) {
			                        case '1':
			                        case 'true':
			                        case prop:
			                            return true;
			
			                        case '0':
			                        case 'false':
			                        case '':
			                            return false;
			                    }
			            }
			        }
			    }
			
			    return defaultValue;
			}
			
			/**
			 * Get boolean attribute value
			 *
			 * @param {object} attributes
			 * @param {Array} properties
			 * @param {*} defaultValue
			 * @return {*}
			 */
			function getValue(attributes, properties, defaultValue) {
			    var i, prop;
			
			    for (i = 0; i < properties.length; i++) {
			        prop = properties[i];
			        if (attributes[prop] !== void 0) {
			            return attributes[prop];
			        }
			    }
			
			    return defaultValue;
			
			}
			
			/**
			 * SVG object constructor
			 *
			 * @param {object} item Item from storage
			 * @return {SVG}
			 * @constructor
			 */
			function SVG(item) {
			    if (!item) {
			        // Set empty icon
			        item = Storage.normalizeIcon({
			            body: '',
			            width: 16,
			            height: 16
			        });
			    }
			
			    this.item = item;
			
			    /**
			     * Get icon height
			     *
			     * @param {string|number} [width] Width to calculate height for. If missing, default icon height will be returned.
			     * @param {boolean} [inline] Inline mode. If missing, assumed to be false
			     * @param {number} [precision] Precision for calculating height. Result is rounded to 1/precision. Default = 100
			     * @return {number|null}
			     */
			    this.height = function(width, inline, precision) {
			        if (width === void 0) {
			            return inline ? this.item.inlineHeight : this.item.height;
			        }
			        return calculateDimension(width, (inline ? this.item.inlineHeight : this.item.height) / this.item.width, precision);
			    };
			
			    /**
			     * Get icon width
			     *
			     * @param {string|number} [height] Height to calculate width for. If missing, default icon width will be returned.
			     * @param {boolean} [inline] Inline mode. If missing, assumed to be false
			     * @param {number} [precision] Precision for calculating width. Result is rounded to 1/precision. Default = 100
			     * @return {number|null}
			     */
			    this.width = function(height, inline, precision) {
			        if (height === void 0) {
			            return this.item.width;
			        }
			        return calculateDimension(height, this.item.width / (inline ? this.item.inlineHeight : this.item.height), precision);
			    };
			
			    /**
			     * Get transformation string for icon
			     *
			     * @param {object} [props] Custom properties to merge with icon properties
			     * @return {string|null}
			     */
			    this.transformation = function(props) {
			        var data;
			
			        if (props !== void 0) {
			            data = {
			                vFlip: props.vFlip === void 0 ? this.item.vFlip : Storage.mergeFlip(this.item.vFlip, props.vFlip),
			                hFlip: props.hFlip === void 0 ? this.item.hFlip : Storage.mergeFlip(this.item.hFlip, props.hFlip),
			                rotate: props.rotate === void 0 ? this.item.rotate : Storage.mergeRotation(this.item.rotate, props.rotate)
			            };
			        } else {
			            data = this.item;
			        }
			
			        return calculateTransformation(data);
			    };
			
			    /**
			     * Get default SVG attributes
			     *
			     * @return {object}
			     */
			    this.defaultAttributes = function() {
			        return {
			            xmlns: 'http://www.w3.org/2000/svg',
			            'xmlns:xlink': 'http://www.w3.org/1999/xlink'
			        };
			    };
			
			    /**
			     * Get preserveAspectRatio attribute value
			     *
			     * @param {*} [horizontal] Horizontal alignment: left, center, right. Default = center
			     * @param {*} [vertical] Vertical alignment: top, middle, bottom. Default = middle
			     * @param {boolean} [slice] Slice: true or false. Default = false
			     * @return {string}
			     */
			    this.preserveAspectRatio = function(horizontal, vertical, slice) {
			        var result = '';
			        switch (horizontal) {
			            case 'left':
			                result += 'xMin';
			                break;
			
			            case 'right':
			                result += 'xMax';
			                break;
			
			            default:
			                result += 'xMid';
			        }
			        switch (vertical) {
			            case 'top':
			                result += 'YMin';
			                break;
			
			            case 'bottom':
			                result += 'YMax';
			                break;
			
			            default:
			                result += 'YMid';
			        }
			        result += slice === true ? ' slice' : ' meet';
			        return result;
			    };
			
			    /**
			     * Generate SVG attributes from attributes list
			     *
			     * @param {object} [attributes] Element attributes
			     * @return {object|null}
			     */
			    this.attributes = function(attributes) {
			        var align = {
			            horizontal: 'center',
			            vertical: 'middle',
			            crop: false
			        };
			        var box = {
			            left: item.left,
			            top: item.top,
			            width: item.width,
			            height: item.height
			        };
			        var transform = {
			            rotate: item.rotate,
			            hFlip: item.hFlip,
			            vFlip: item.vFlip
			        };
			        var style = '';
			        var result = this.defaultAttributes();
			
			        var customWidth, customHeight, width, height, inline, body, value, split, append, units, extraAttributes;
			
			        attributes = typeof attributes === 'object' ? attributes : {};
			
			        // Check mode
			        inline = getBooleanValue(attributes, [config._inlineModeAttribute, 'inline'], null);
			        append = getBooleanValue(attributes, [config._appendAttribute], false);
			
			        // Calculate dimensions
			        // Values for width/height: null = default, 'auto' = from svg, false = do not set
			        // Default: if both values aren't set, height defaults to '1em', width is calculated from height
			        customWidth = getValue(attributes, ['data-width', 'width'], null);
			        customHeight = getValue(attributes, ['data-height', 'height'], null);
			
			        if (customWidth === null && customHeight === null) {
			            inline = inline === null ? true : inline;
			            height = '1em';
			            width = this.width(height, inline);
			        } else if (customWidth !== null && customHeight !== null) {
			            inline = inline === null ? (customHeight === false) : inline;
			            width = customWidth;
			            height = customHeight;
			        } else if (customWidth !== null) {
			            inline = inline === null ? false : inline;
			            width = customWidth;
			            height = this.height(width, inline);
			        } else {
			            inline = inline === null ? (customHeight === false) : inline;
			            height = customHeight;
			            width = this.width(height, inline);
			        }
			
			        if (width !== false) {
			            result.width = width === 'auto' ? this.item.width : width;
			        }
			
			        if (height !== false) {
			            result.height = height === 'auto' ? (inline ? this.item.inlineHeight : this.item.height) : height;
			        }
			
			        // Apply inline mode to offsets
			        if (inline) {
			            box.top = item.inlineTop;
			            box.height = item.inlineHeight;
			            if (item.verticalAlign !== 0) {
			                style += 'vertical-align: ' + item.verticalAlign + 'em;';
			            }
			        }
			
			        // Check custom alignment
			        if (typeof attributes[config._alignAttribute] === 'string') {
			            attributes[config._alignAttribute].toLowerCase().split(/[\s,]+/).forEach(function(value) {
			                switch (value) {
			                    case 'left':
			                    case 'right':
			                    case 'center':
			                        align.horizontal = value;
			                        break;
			
			                    case 'top':
			                    case 'bottom':
			                    case 'middle':
			                        align.vertical = value;
			                        break;
			
			                    case 'crop':
			                        align.crop = true;
			                        break;
			
			                    case 'meet':
			                        align.crop = false;
			                }
			            });
			        }
			
			        // Transformations
			        if (typeof attributes[config._flipAttribute] === 'string') {
			            attributes[config._flipAttribute].split(/[\s,]+/).forEach(function(value) {
			                value = value.toLowerCase();
			                switch (value) {
			                    case 'horizontal':
			                        transform.hFlip = !transform.hFlip;
			                        break;
			
			                    case 'vertical':
			                        transform.vFlip = !transform.vFlip;
			                        break;
			                }
			            });
			        }
			        if (attributes[config._rotateAttribute] !== void 0) {
			            value = attributes[config._rotateAttribute];
			            if (typeof value === 'number') {
			                transform.rotate += value;
			            } else if (typeof value === 'string') {
			                units = value.replace(/^-?[0-9.]*/, '');
			                if (units === '') {
			                    value = parseInt(value);
			                    if (!isNaN(value)) {
			                        transform.rotate += value;
			                    }
			                } else if (units !== value) {
			                    split = false;
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
			                        value = parseInt(value.slice(0, value.length - units.length));
			                        if (!isNaN(value)) {
			                            transform.rotate += Math.round(value / split);
			                        }
			                    }
			                }
			            }
			        }
			
			        // Add transformation to style
			        transform = calculateTransformation(transform);
			        style += '-ms-transform: ' + transform + ';' +
			            ' -webkit-transform: ' + transform + ';' +
			            ' transform: ' + transform + ';';
			
			        // Generate style
			        result.style = style + (attributes.style === void 0 ? '' : attributes.style);
			
			        // Generate viewBox and preserveAspectRatio attributes
			        result.preserveAspectRatio = this.preserveAspectRatio(align.horizontal, align.vertical, align.crop);
			        result.viewBox = box.left + ' ' + box.top + ' ' + box.width + ' ' + box.height;
			
			        // Generate body
			        body = replaceIDs(this.item.body);
			
			        // Add misc attributes
			        extraAttributes = {};
			        Object.keys(attributes).forEach(function(attr) {
			            if (result[attr] === void 0 && reservedAttributes.indexOf(attr) === -1) {
			                extraAttributes[attr] = attributes[attr];
			            }
			        });
			
			        return {
			            attributes: result,
			            elementAttributes: extraAttributes,
			            body: body,
			            append: append
			        };
			    };
			
			    return this;
			}
			
			// Node.js only
			
			local.SVG = SVG;
		})();

		/**
		 * Functions that create image objects
		 */
		(function(local, config) {
		    
		    var loadingClass = config._loadingClass;
		
		    /**
		     * Create object for new image
		     *
		     * @param {Element} element DOM element
		     * @param {string} icon Icon name
		     * @param {function} parser Parser function
		     * @return {{element: Element, icon: string, parser: function, loading: boolean}}
		     */
		    local.newImage = function(element, icon, parser) {
		        return {
		            element: element,
		            icon: icon,
		            parser: parser,
		            loading: element.classList.contains(loadingClass)
		        };
		    };
		
		    /**
		     * Create object for parsed image
		     *
		     * @param {Element} element DOM element
		     * @param {string} icon Icon name
		     * @return {{element: Element, icon: string}}
		     */
		    local.parsedImage = function(element, icon) {
		        return {
		            element: element,
		            icon: icon
		        };
		    };
		
		    /**
		     * Get image attributes to pass to SVG
		     *
		     * @param {object} image
		     * @return {object}
		     */
		    local.getImageAttributes = function(image) {
		        var results = {},
		            i, attr;
		
		        if (!image.element.hasAttributes()) {
		            return results;
		        }
		
		        // Copy all attributes
		        for (i = 0; i < image.element.attributes.length; i++) {
		            attr = image.element.attributes[i];
		            results[attr.name] = attr.value;
		        }
		
		        // Filter attributes
		        if (image.parser && image.parser.filterAttributes !== void 0) {
		            results = image.parser.filterAttributes(image, results);
		        }
		
		        // Filter class names
		        if (results['class'] !== void 0) {
		            results['class'] = results['class'].split(' ').filter(function(item) {
		                return item !== loadingClass;
		            });
		
		            if (image.parser && image.parser.filterClasses !== void 0) {
		                results['class'] = image.parser.filterClasses(image, results['class']);
		            }
		
		            results['class'] = results['class'].join(' ');
		        }
		
		        // Add attributes from image
		        if (image.attributes !== void 0) {
		            Object.keys(image.attributes).forEach(function (attr) {
		                results[attr] = image.attributes[attr];
		            });
		        }
		
		        return results;
		    };
		
		})(local, local.config);

		/**
		 * Functions that find images in DOM
		 */
		(function(SimpleSVG, local, config) {
		    
		    var imageClass = config._imageClass,
		        loadingClass = config._loadingClass,
		        appendedClass = config._appendedClass,
		        iconAttribute = config._iconAttribute,
		        inlineAttribute = config._inlineModeAttribute,
		        negativeSelectors = ':not(svg):not(.' + appendedClass + ')',
		        negativeLoadingSelectors = ':not(.' + loadingClass + ')',
		        loadingSelector = '.' + loadingClass;
		
		    /**
		     * List of finders
		     *
		     * @type {object}
		     */
		    var finders = {
		        ssvg: {
		            selector: '.' + imageClass,
		            selectorAll: '.' + imageClass + negativeSelectors,
		            selectorNew: '.' + imageClass + negativeSelectors + negativeLoadingSelectors,
		            selectorLoading: '.' + imageClass + negativeSelectors + loadingSelector,
		
		            /**
		             * Get icon name from element
		             *
		             * @param {Element} element
		             * @return {string} Icon name, empty string if none
		             */
		            icon: function(element) {
		                var result = element.getAttribute(iconAttribute);
		                return typeof result === 'string' ? result : '';
		            }
		
		            /**
		             * Filter class names list, removing any custom classes
		             *
		             * If function is missing in finder, classes will not be filtered
		             *
		             * @param {object} image
		             * @param {Array|DOMTokenList} list
		             * @return {Array}
		             */
		            // filterClasses: function(image, list) { return list; }
		
		            /**
		             * Filter attributes, removing any attributes that should not be passed to SVG
		             *
		             * If function is missing in finder, attributes will not be filtered
		             *
		             * @param {object} image
		             * @param {object} attributes
		             * @return {object}
		             */
		            // filterAttributes: function(image, attributes) { return attributes; }
		        }
		    };
		
		    /**
		     * List of finder keys for faster iteration
		     *
		     * @type {Array}
		     */
		    var finderKeys = Object.keys(finders);
		
		    /**
		     * Add custom finder
		     *
		     * @param {string} name Finder name
		     * @param {object} finder Finder data
		     */
		    SimpleSVG.addFinder = function(name, finder) {
		        // Set missing properties
		        if (finder.selectorAll === void 0) {
		            finder.selectorAll = finder.selector + negativeSelectors;
		        }
		        if (finder.selectorNew === void 0) {
		            finder.selectorNew = finder.selector + negativeSelectors + negativeLoadingSelectors;
		        }
		        if (finder.selectorLoading === void 0) {
		            finder.selectorLoading = finder.selector + negativeSelectors + loadingSelector;
		        }
		
		        finders[name] = finder;
		        finderKeys = Object.keys(finders);
		
		        // Re-scan DOM
		        if (SimpleSVG.isReady) {
		            SimpleSVG.scanDOM();
		        }
		    };
		
		    /**
		     * Add custom tag finder
		     *
		     * @param {string} name Tag name
		     * @param {boolean} inline True/false if icon should be inline by default
		     * @param {function} [resolver] Function to return icon name, null or undefined if default resolver should be used
		     */
		    SimpleSVG.addTag = function(name, inline, resolver) {
		        SimpleSVG.addFinder('tag-' + name, {
		            selector: name,
		            icon: resolver === void 0 || resolver === null ? finders.ssvg.icon : resolver,
		            filterAttributes: function(image, attributes) {
		                if (attributes[inlineAttribute] === void 0) {
		                    attributes[inlineAttribute] = inline;
		                }
		                return attributes;
		            }
		        });
		    };
		    SimpleSVG.addTag('simple-svg', false);
		
		    /**
		     * Find new images
		     *
		     * @param {Element} root Root element
		     * @param {boolean} [loading] Filter images by loading status. If missing, result will not be filtered
		     * @return {Array}
		     */
		    local.findNewImages = function(root, loading) {
		        var results = [],
		            duplicates = [];
		
		        root = root === void 0 ? (config._root === void 0 ? document.querySelector('body') : config._root) : root;
		
		        finderKeys.forEach(function(key) {
		            var finder = finders[key],
		                selector = loading === true ? finder.selectorLoading : (loading === false ? finder.selectorNew : finder.selectorAll);
		
		            var nodes = root.querySelectorAll(selector),
		                index, node, icon, image;
		
		            for (index = 0; index < nodes.length; index ++) {
		                node = nodes[index];
		                icon = finder.icon(node);
		
		                if (icon && duplicates.indexOf(node) === -1) {
		                    duplicates.push(node);
		                    image = local.newImage(node, icon, finder);
		                    results.push(image);
		                }
		            }
		        });
		
		        return results;
		    };
		
		    /**
		     * Find all svg images
		     *
		     * @param {Element} root Root element
		     * @return {Array}
		     */
		    local.findParsedImages = function(root) {
		        var results = [];
		
		        var nodes = root.querySelectorAll('svg.' + imageClass),
		            index, node, icon;
		
		        for (index = 0; index < nodes.length; index ++) {
		            node = nodes[index];
		            icon = node.getAttribute(iconAttribute);
		
		            if (icon) {
		                results.push(local.parsedImage(node, icon));
		            }
		        }
		
		        return results;
		    };
		
		})(SimpleSVG, local, local.config);

		/**
		 * Module for loading images from remote location
		 */
		(function(SimpleSVG, local, config, global) {
		    
		    /**
		     * List of images queued for loading
		     *
		     * @type {Array}
		     */
		    var queue = [],
		        tested = [];
		
		    /**
		     * True if queue will be parsed on next tick
		     *
		     * @type {boolean}
		     */
		    var queued = false;
		
		    /**
		     * List of all prefixes
		     *
		     * @type {Array}
		     */
		    var prefixes = [];
		
		    /**
		     * Find prefix for icon
		     *
		     * @param {string} icon Icon name
		     * @return {object|null}
		     */
		    function getPrefix(icon) {
		        var split, prefix;
		
		        // Check for fa:home
		        split = icon.split(':');
		        if (split.length === 2) {
		            return {
		                prefix: split[0],
		                icon: split[1]
		            };
		        }
		
		        // Check for fa-home
		        split = icon.split('-');
		        if (split.length > 1) {
		            prefix = split.shift();
		            return {
		                prefix: prefix,
		                icon: split.join('-')
		            }
		        }
		
		        return null;
		    }
		
		    /**
		     * Load all queued images
		     */
		    function loadQueue() {
		        var queues = {},
		            URLLengths = {},
		            urls = {},
		            limit = config.loaderMaxURLSize;
		
		        /**
		         * Send JSONP request by adding script tag to document
		         *
		         * @param {string} prefix
		         * @param {Array} items
		         */
		        function addScript(prefix, items) {
		            var url = urls[prefix],
		                element;
		
		            // Replace icons list
		            url = url.replace('{icons}', items.join(','));
		
		            // Change to protocol-less to secure
		            url = SimpleSVG.secureURL(url);
		
		            // Create script
		            element = document.createElement('script');
		            element.setAttribute('type', 'text/javascript');
		            element.setAttribute('src', url);
		            element.setAttribute('async', true);
		            document.head.appendChild(element);
		        }
		
		        /**
		         * Calculate base length of URL
		         *
		         * @param {string} prefix
		         * @return {number|null}
		         */
		        function baseLength(prefix) {
		            var url = config._cdn[prefix] === void 0 ? config.defaultCDN : config._cdn[prefix];
		
		            if (url.indexOf('{icons}') === -1) {
		                urls[prefix] = url;
		                return null;
		            }
		            url = url.replace('{prefix}', prefix).replace('{callback}', 'SimpleSVG._loaderCallback');
		            urls[prefix] = url;
		            return url.replace('{icons}', '').length;
		        }
		
		        // Check queue
		        queue.forEach(function(icon) {
		            var prefixParts = getPrefix(icon),
		                prefix, shortIcon;
		
		            if (prefixParts === null) {
		                return;
		            }
		            shortIcon = prefixParts.icon;
		            prefix = prefixParts.prefix;
		
		            // Check if queue for prefix exists
		            if (queues[prefix] === void 0) {
		                queues[prefix] = [];
		                URLLengths[prefix] = baseLength(prefix);
		                if (URLLengths[prefix] === null) {
		                    // URL without list of icons - loads entire library
		                    addScript(prefix, []);
		                    return;
		                }
		                queues[prefix].push(shortIcon);
		                URLLengths[prefix] += shortIcon.length + 1;
		            } else if (URLLengths[prefix] !== null) {
		                // Add icon to queue
		                URLLengths[prefix] += shortIcon.length + 1;
		                if (URLLengths[prefix] >= limit) {
		                    addScript(prefix, queues[prefix]);
		                    queues[prefix] = [];
		                    URLLengths[prefix] = baseLength(prefix) + shortIcon.length + 1;
		                }
		                queues[prefix].push(shortIcon);
		            }
		        });
		
		        // Get remaining items
		        Object.keys(queues).forEach(function(prefix) {
		            if (URLLengths[prefix] !== null && queues[prefix].length) {
		                addScript(prefix, queues[prefix]);
		            }
		        });
		
		        // Mark icons as loaded
		        tested = tested.concat(queue);
		        queue = [];
		        queued = false;
		    }
		
		    /**
		     * Add image to loading queue
		     *
		     * @param {string} image Image name
		     * @return {boolean} True if image was added to queue
		     */
		    function addToQueue(image) {
		        // Check queue
		        if (queue.indexOf(image) !== -1 || tested.indexOf(image) !== -1) {
		            return false;
		        }
		
		        // Add to queue
		        queue.push(image);
		        if (!queued) {
		            queued = true;
		            window.setTimeout(loadQueue, 0);
		        }
		        return true;
		    }
		
		    /**
		     * Callback for JSONP
		     *
		     * @param {object} data
		     * @constructor
		     */
		    SimpleSVG._loaderCallback = function(data) {
		        if (typeof data === 'object') {
		            SimpleSVG.addCollection(data);
		
		            // Dispatch event
		            local.event(config._loaderEvent);
		        }
		    };
		
		    /**
		     * Add image to queue, return true if image has been loaded
		     *
		     * @param {object} image Image object
		     * @param {boolean} [checkQueue] True if queue should be checked. Default = true
		     * @return {boolean}
		     */
		    local.loadImage = function(image, checkQueue) {
		        if (SimpleSVG.iconExists(image.icon)) {
		            return true;
		        }
		
		        if (checkQueue !== false && addToQueue(image.icon)) {
		            // Mark as loading
		            image.element.classList.add(config._loadingClass);
		        }
		
		        return false;
		    };
		
		    /**
		     * Preload images
		     *
		     * @param {Array} images List of images
		     * @returns {boolean} True if images are queued for preload, false if images are already available
		     */
		    SimpleSVG.preloadImages = function(images) {
		        var queued = false;
		        images.forEach(function(key) {
		            if (!SimpleSVG.iconExists(key)) {
		                addToQueue(key);
		                queued = true;
		            }
		        });
		        return queued;
		    };
		
		})(SimpleSVG, local, local.config, global);

		/**
		 * Observer function
		 *
		 * Observer automatically loads polyfill for MutationObserver for IE9-10 from CDN that can be configured
		 * See ../polyfill.js
		 *
		 * Observer can be paused using SimpleSVG.pauseObserving()
		 * and resumed using SimpleSVG.resumeObserving()
		 * Pause/resume can stack, so if you call pause twice, resume should be called twice.
		 */
		(function(SimpleSVG, local, config, global) {
		    
		    var observer = null,
		        paused = 0,
		        queue = null,
		        addedNodes = false,
		        params = {
		            childList: true,
		            subtree: true
		        };
		
		    /**
		     * Process all pending mutations
		     */
		    function processPendingMutations() {
		        var temp = addedNodes;
		
		        addedNodes = false;
		        if (temp !== false && temp.length) {
		            // At least 1 node was added
		            local.nodesAdded(temp);
		        }
		    }
		
		    /**
		     * Process array of mutations
		     *
		     * @param mutations
		     */
		    function processMutations(mutations) {
		        mutations.forEach(function(mutation) {
		            var i;
		
		            // Parse on next tick to collect all mutations
		            if (addedNodes === false) {
		                addedNodes = [];
		                window.setTimeout(processPendingMutations, 0);
		            }
		            if (mutation.addedNodes) {
		                for (i = 0; i < mutation.addedNodes.length; i++) {
		                    addedNodes.push(mutation.addedNodes[i]);
		                }
		            }
		        });
		    }
		
		    /**
		     * Start/resume observing
		     */
		    function observe() {
		        observer.observe(config._root === void 0 ? document.querySelector('body') : config._root, params);
		    }
		
		    /**
		     * Function to pause observing
		     *
		     * Multiple pauseObserving() calls stack, resuming observer only when same amount of resumeObserving() is called
		     */
		    SimpleSVG.pauseObserving = function() {
		        if (observer === null) {
		            paused ++;
		            return;
		        }
		
		        if (!paused) {
		            // Store pending records, stop observer
		            queue = observer.takeRecords();
		            observer.disconnect();
		        }
		        paused ++;
		    };
		
		    /**
		     * Function to resume observing
		     */
		    SimpleSVG.resumeObserving = function() {
		        var temp;
		
		        if (observer === null) {
		            paused --;
		            return;
		        }
		        if (!paused) {
		            return;
		        }
		
		        paused --;
		        if (!paused) {
		            // Resume observer and process stored records
		            observe();
		            if (queue !== null && queue.length) {
		                processMutations(queue);
		            }
		        }
		    };
		
		    /**
		     * Start observing when all modules and DOM are ready
		     */
		    local.initQueue.push(function () {
		        observer = new global.MutationObserver(processMutations);
		        if (!paused) {
		            observe();
		        }
		    });
		
		})(SimpleSVG, local, local.config, global);

		/**
		 * Module for changing images
		 */
		(function(SimpleSVG, local, config) {
		    
		    var iconAttribute = config._iconAttribute,
		        loadingClass = config._loadingClass,
		        imageClass = config._imageClass,
		        appendedClass = config._appendedClass;
		
		    /**
		     * Generate SVG code
		     *
		     * @param {string} html Empty SVG element with all attributes
		     * @param {string} body Body
		     * @return {string}
		     */
		    function generateSVG(html, body) {
		        var pos;
		
		        if (html.slice(0, 2) === '<?') {
		            // XML prefix from old IE
		            pos = html.indexOf('>');
		            html = html.slice(pos + 1);
		        }
		
		        // Fix lower case attributes
		        html = html.replace('viewbox=', 'viewBox=').replace('preserveaspectratio=', 'preserveAspectRatio=');
		
		        // Add body
		        pos = html.indexOf('</');
		        if (pos !== -1) {
		            // Closing tag
		            html = html.replace('</', body + '</');
		        } else {
		            // Self-closing
		            html = html.replace('/>', '>' + body + '</svg>');
		        }
		
		        return html;
		    }
		
		    /**
		     * Render SVG
		     *
		     * @param {object} image
		     */
		    local.renderSVG = function(image) {
		        var attributes = local.getImageAttributes(image),
		            item = SimpleSVG.getIcon(image.icon),
		            svgObject, svgElement, temp, span, data, html;
		
		        attributes[iconAttribute] = image.icon;
		        svgObject = new local.SVG(item);
		        temp = document.createElement('svg');
		
		        data = svgObject.attributes(attributes);
		
		        Object.keys(data.attributes).forEach(function(attr) {
		            try {
		                temp.setAttribute(attr, data.attributes[attr]);
		            } catch (err) {
		            }
		        });
		        Object.keys(data.elementAttributes).forEach(function(attr) {
		            try {
		                (data.append ? image.element : temp).setAttribute(attr, data.elementAttributes[attr]);
		            } catch (err) {
		            }
		        });
		
		        if (image.loading) {
		            temp.classList.remove(loadingClass);
		            if (data.append) {
		                image.element.classList.remove(loadingClass);
		            }
		        }
		        temp.classList.add(imageClass);
		
		        // innerHTML is not supported for SVG element :(
		        // Creating temporary element instead
		        html = generateSVG(temp.outerHTML, data.body);
		
		        span = document.createElement('span');
		        span.innerHTML = html;
		
		        svgElement = span.childNodes[0];
		
		        if (data.append) {
		            image.element.classList.add(appendedClass);
		            image.element.appendChild(svgElement);
		        } else {
		            image.element.parentNode.replaceChild(svgElement, image.element);
		            image.element = svgElement;
		        }
		
		        delete image.parser;
		        delete image.loading;
		    };
		
		    /**
		     * Get SVG icon code
		     *
		     * @param {string} name Icon name
		     * @param {object} [properties] Custom properties
		     * @return {string|false}
		     */
		    SimpleSVG.getSVG = function(name, properties) {
		        var svg, el, data;
		
		        if (!SimpleSVG.iconExists(name)) {
		            return false;
		        }
		
		        svg = new local.SVG(SimpleSVG.getIcon(name));
		        data = svg.attributes(properties, false);
		
		        el = document.createElement('svg');
		        Object.keys(data.attributes).forEach(function(attr) {
		            try {
		                el.setAttribute(attr, data.attributes[attr]);
		            } catch (err) {
		
		            }
		        });
		
		        return generateSVG(el.outerHTML, data.body);
		    };
		
		})(SimpleSVG, local, local.config);

		/**
		 * Main file
		 */
		(function(SimpleSVG, local) {
		    
		    var useHTTPS = false;
		
		    /*
		    // Disabled because SSL adds 50-100ms to loading time. Uncomment to enable forced SSL in modern browsers.
		    try {
		        useHTTPS = (window && window.CSS && window.CSS.supports);
		    } catch (err) {
		    }
		    */
		
		    /**
		     * Find new icons and change them
		     */
		    function findNewIcons() {
		        var paused = false;
		
		        if (!SimpleSVG.isReady) {
		            return;
		        }
		
		        local.findNewImages().forEach(function(image) {
		            if (local.loadImage(image)) {
		                if (!paused) {
		                    paused = true;
		                    SimpleSVG.pauseObserving();
		                }
		
		                local.renderSVG(image);
		            }
		        });
		
		        if (paused) {
		            SimpleSVG.resumeObserving();
		        }
		    }
		
		    /**
		     * Callback when DOM was changed
		     */
		    function scanDOM() {
		        if (!SimpleSVG.isReady) {
		            return;
		        }
		
		        // Find new icons
		        findNewIcons();
		    }
		
		    /**
		     * Set local functions
		     */
		    local.iconsAdded = findNewIcons;
		    local.nodesAdded = scanDOM;
		
		    /**
		     * Scan DOM when script is ready
		     */
		    local.initQueue.push(scanDOM);
		
		    /**
		     * Export function to scan DOM
		     */
		    SimpleSVG.scanDOM = scanDOM;
		
		    /**
		     * Change protocol-less URL to secure URL if browser supports it
		     *
		     * @param {string} url
		     * @return {string}
		     */
		    SimpleSVG.secureURL = function(url) {
		        return (useHTTPS && url.slice(0, 2) === '//') ? 'https:' + url : url;
		    };
		
		    /**
		     * Get version
		     *
		     * @return {string}
		     */
		    SimpleSVG.getVersion = function() {
		        return local.version;
		    };
		
		})(SimpleSVG, local);


    })(self.SimpleSVG, self);
}
