/**
* (c) Iconify
*
* For the full copyright and license information, please view the license.txt or license.gpl.txt
* files at https://github.com/iconify/iconify
*
* Licensed under MIT.
*
* @license MIT
* @version 3.0.0-beta.1
*/
var Iconify = (function (exports) {
  'use strict';

  var defaultIconDimensions = Object.freeze({
    left: 0,
    top: 0,
    width: 16,
    height: 16
  });
  var defaultIconTransformations = Object.freeze({
    rotate: 0,
    vFlip: false,
    hFlip: false
  });
  var defaultIconProps = Object.freeze(Object.assign({}, defaultIconDimensions,
    defaultIconTransformations));
  var defaultExtendedIconProps = Object.freeze(Object.assign({}, defaultIconProps,
    {body: "",
    hidden: false}));

  function mergeIconTransformations(obj1, obj2) {
    var result = {};
    if (!obj1.hFlip !== !obj2.hFlip) {
      result.hFlip = true;
    }
    if (!obj1.vFlip !== !obj2.vFlip) {
      result.vFlip = true;
    }
    var rotate = ((obj1.rotate || 0) + (obj2.rotate || 0)) % 4;
    if (rotate) {
      result.rotate = rotate;
    }
    return result;
  }

  function mergeIconData(parent, child) {
    var result = mergeIconTransformations(parent, child);
    for (var key in defaultExtendedIconProps) {
      if (defaultIconTransformations[key] !== void 0) {
        if (result[key] === void 0 && parent[key] !== void 0) {
          result[key] = defaultIconTransformations[key];
        }
      } else if (child[key] !== void 0) {
        result[key] = child[key];
      } else if (parent[key] !== void 0) {
        result[key] = parent[key];
      }
    }
    return result;
  }

  function getIconsTree(data, names) {
    var icons = data.icons;
    var aliases = data.aliases || {};
    var resolved = /* @__PURE__ */ Object.create(null);
    function resolve(name) {
      if (icons[name]) {
        return resolved[name] = [];
      }
      if (resolved[name] === void 0) {
        resolved[name] = null;
        var parent = aliases[name] && aliases[name].parent;
        var value = parent && resolve(parent);
        if (value) {
          resolved[name] = [parent].concat(value);
        }
      }
      return resolved[name];
    }
    (names || Object.keys(icons).concat(Object.keys(aliases))).forEach(resolve);
    return resolved;
  }

  function internalGetIconData(data, name, tree, full) {
    var icons = data.icons;
    var aliases = data.aliases || {};
    var currentProps = {};
    function parse(name2) {
      currentProps = mergeIconData(icons[name2] || aliases[name2], currentProps);
    }
    parse(name);
    tree.forEach(parse);
    currentProps = mergeIconData(data, currentProps);
    return full ? Object.assign({}, defaultIconProps, currentProps) : currentProps;
  }

  function parseIconSet(data, callback) {
    var names = [];
    if (typeof data !== "object" || typeof data.icons !== "object") {
      return names;
    }
    if (data.not_found instanceof Array) {
      data.not_found.forEach(function (name) {
        callback(name, null);
        names.push(name);
      });
    }
    var tree = getIconsTree(data);
    for (var name in tree) {
      var item = tree[name];
      if (item) {
        callback(name, internalGetIconData(data, name, item, true));
        names.push(name);
      }
    }
    return names;
  }

  var matchIconName = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  var stringToIcon = function (value, validate, allowSimpleName, provider) {
    if ( provider === void 0 ) provider = "";

    var colonSeparated = value.split(":");
    if (value.slice(0, 1) === "@") {
      if (colonSeparated.length < 2 || colonSeparated.length > 3) {
        return null;
      }
      provider = colonSeparated.shift().slice(1);
    }
    if (colonSeparated.length > 3 || !colonSeparated.length) {
      return null;
    }
    if (colonSeparated.length > 1) {
      var name2 = colonSeparated.pop();
      var prefix = colonSeparated.pop();
      var result = {
        provider: colonSeparated.length > 0 ? colonSeparated[0] : provider,
        prefix: prefix,
        name: name2
      };
      return validate && !validateIcon(result) ? null : result;
    }
    var name = colonSeparated[0];
    var dashSeparated = name.split("-");
    if (dashSeparated.length > 1) {
      var result$1 = {
        provider: provider,
        prefix: dashSeparated.shift(),
        name: dashSeparated.join("-")
      };
      return validate && !validateIcon(result$1) ? null : result$1;
    }
    if (allowSimpleName && provider === "") {
      var result$2 = {
        provider: provider,
        prefix: "",
        name: name
      };
      return validate && !validateIcon(result$2, allowSimpleName) ? null : result$2;
    }
    return null;
  };
  var validateIcon = function (icon, allowSimpleName) {
    if (!icon) {
      return false;
    }
    return !!((icon.provider === "" || icon.provider.match(matchIconName)) && (allowSimpleName && icon.prefix === "" || icon.prefix.match(matchIconName)) && icon.name.match(matchIconName));
  };

  var optionalPropertyDefaults = Object.assign({}, {provider: "",
    aliases: {},
    not_found: {}},
    defaultIconDimensions);
  function checkOptionalProps(item, defaults) {
    for (var prop in defaults) {
      if (item[prop] !== void 0 && typeof item[prop] !== typeof defaults[prop]) {
        return false;
      }
    }
    return true;
  }
  function quicklyValidateIconSet(obj) {
    if (typeof obj !== "object" || obj === null) {
      return null;
    }
    var data = obj;
    if (typeof data.prefix !== "string" || !obj.icons || typeof obj.icons !== "object") {
      return null;
    }
    if (!checkOptionalProps(obj, optionalPropertyDefaults)) {
      return null;
    }
    var icons = data.icons;
    for (var name in icons) {
      var icon = icons[name];
      if (!name.match(matchIconName) || typeof icon.body !== "string" || !checkOptionalProps(icon, defaultExtendedIconProps)) {
        return null;
      }
    }
    var aliases = data.aliases || {};
    for (var name$1 in aliases) {
      var icon$1 = aliases[name$1];
      var parent = icon$1.parent;
      if (!name$1.match(matchIconName) || typeof parent !== "string" || !icons[parent] && !aliases[parent] || !checkOptionalProps(icon$1, defaultExtendedIconProps)) {
        return null;
      }
    }
    return data;
  }

  var storage$1 = /* @__PURE__ */ Object.create(null);
  function newStorage(provider, prefix) {
    return {
      provider: provider,
      prefix: prefix,
      icons: /* @__PURE__ */ Object.create(null),
      missing: /* @__PURE__ */ Object.create(null)
    };
  }
  function getStorage(provider, prefix) {
    if (storage$1[provider] === void 0) {
      storage$1[provider] = /* @__PURE__ */ Object.create(null);
    }
    var providerStorage = storage$1[provider];
    if (providerStorage[prefix] === void 0) {
      providerStorage[prefix] = newStorage(provider, prefix);
    }
    return providerStorage[prefix];
  }
  function addIconSet(storage2, data) {
    if (!quicklyValidateIconSet(data)) {
      return [];
    }
    var t = Date.now();
    return parseIconSet(data, function (name, icon) {
      if (icon) {
        storage2.icons[name] = icon;
      } else {
        storage2.missing[name] = t;
      }
    });
  }
  function addIconToStorage(storage2, name, icon) {
    try {
      if (typeof icon.body === "string") {
        storage2.icons[name] = Object.freeze(Object.assign({}, defaultIconProps,
          icon));
        return true;
      }
    } catch (err) {
    }
    return false;
  }
  function listIcons(provider, prefix) {
    var allIcons = [];
    var providers;
    if (typeof provider === "string") {
      providers = [provider];
    } else {
      providers = Object.keys(storage$1);
    }
    providers.forEach(function (provider2) {
      var prefixes;
      if (typeof provider2 === "string" && typeof prefix === "string") {
        prefixes = [prefix];
      } else {
        prefixes = storage$1[provider2] === void 0 ? [] : Object.keys(storage$1[provider2]);
      }
      prefixes.forEach(function (prefix2) {
        var storage2 = getStorage(provider2, prefix2);
        var icons = Object.keys(storage2.icons).map(function (name) { return (provider2 !== "" ? "@" + provider2 + ":" : "") + prefix2 + ":" + name; });
        allIcons = allIcons.concat(icons);
      });
    });
    return allIcons;
  }

  var simpleNames = false;
  function allowSimpleNames(allow) {
    if (typeof allow === "boolean") {
      simpleNames = allow;
    }
    return simpleNames;
  }
  function getIconData(name) {
    var icon = typeof name === "string" ? stringToIcon(name, true, simpleNames) : name;
    if (!icon) {
      return;
    }
    var storage = getStorage(icon.provider, icon.prefix);
    var iconName = icon.name;
    return storage.icons[iconName] || (storage.missing[iconName] ? null : void 0);
  }
  function addIcon(name, data) {
    var icon = stringToIcon(name, true, simpleNames);
    if (!icon) {
      return false;
    }
    var storage = getStorage(icon.provider, icon.prefix);
    return addIconToStorage(storage, icon.name, data);
  }
  function addCollection(data, provider) {
    if (typeof data !== "object") {
      return false;
    }
    if (typeof provider !== "string") {
      provider = typeof data.provider === "string" ? data.provider : "";
    }
    if (simpleNames && provider === "" && (typeof data.prefix !== "string" || data.prefix === "")) {
      var added = false;
      if (quicklyValidateIconSet(data)) {
        data.prefix = "";
        parseIconSet(data, function (name, icon) {
          if (icon && addIcon(name, icon)) {
            added = true;
          }
        });
      }
      return added;
    }
    if (typeof data.prefix !== "string" || !validateIcon({
      provider: provider,
      prefix: data.prefix,
      name: "a"
    })) {
      return false;
    }
    var storage = getStorage(provider, data.prefix);
    return !!addIconSet(storage, data);
  }
  function iconExists(name) {
    return !!getIconData(name);
  }
  function getIcon(name) {
    var result = getIconData(name);
    return result ? Object.assign({}, result) : null;
  }

  var defaultIconSizeCustomisations = Object.freeze({
    width: null,
    height: null
  });
  var defaultIconCustomisations = Object.freeze(Object.assign({}, defaultIconSizeCustomisations,
    defaultIconTransformations));

  function mergeCustomisations(defaults, item) {
    var result = Object.assign({}, defaults);
    for (var key in item) {
      var value = item[key];
      var valueType = typeof value;
      if (key in defaultIconSizeCustomisations) {
        if (value === null || value && (valueType === "string" || valueType === "number")) {
          result[key] = value;
        }
      } else if (valueType === typeof result[key]) {
        result[key] = key === "rotate" ? value % 4 : value;
      }
    }
    return result;
  }

  var unitsSplit = /(-?[0-9.]*[0-9]+[0-9.]*)/g;
  var unitsTest = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
  function calculateSize(size, ratio, precision) {
    if (ratio === 1) {
      return size;
    }
    precision = precision === void 0 ? 100 : precision;
    if (typeof size === "number") {
      return Math.ceil(size * ratio * precision) / precision;
    }
    if (typeof size !== "string") {
      return size;
    }
    var oldParts = size.split(unitsSplit);
    if (oldParts === null || !oldParts.length) {
      return size;
    }
    var newParts = [];
    var code = oldParts.shift();
    var isNumber = unitsTest.test(code);
    while (true) {
      if (isNumber) {
        var num = parseFloat(code);
        if (isNaN(num)) {
          newParts.push(code);
        } else {
          newParts.push(Math.ceil(num * ratio * precision) / precision);
        }
      } else {
        newParts.push(code);
      }
      code = oldParts.shift();
      if (code === void 0) {
        return newParts.join("");
      }
      isNumber = !isNumber;
    }
  }

  function iconToSVG(icon, customisations) {
    var box = {
      left: icon.left,
      top: icon.top,
      width: icon.width,
      height: icon.height
    };
    var body = icon.body;
    [icon, customisations].forEach(function (props) {
      var transformations = [];
      var hFlip = props.hFlip;
      var vFlip = props.vFlip;
      var rotation = props.rotate;
      if (hFlip) {
        if (vFlip) {
          rotation += 2;
        } else {
          transformations.push("translate(" + (box.width + box.left).toString() + " " + (0 - box.top).toString() + ")");
          transformations.push("scale(-1 1)");
          box.top = box.left = 0;
        }
      } else if (vFlip) {
        transformations.push("translate(" + (0 - box.left).toString() + " " + (box.height + box.top).toString() + ")");
        transformations.push("scale(1 -1)");
        box.top = box.left = 0;
      }
      var tempValue;
      if (rotation < 0) {
        rotation -= Math.floor(rotation / 4) * 4;
      }
      rotation = rotation % 4;
      switch (rotation) {
        case 1:
          tempValue = box.height / 2 + box.top;
          transformations.unshift("rotate(90 " + tempValue.toString() + " " + tempValue.toString() + ")");
          break;
        case 2:
          transformations.unshift("rotate(180 " + (box.width / 2 + box.left).toString() + " " + (box.height / 2 + box.top).toString() + ")");
          break;
        case 3:
          tempValue = box.width / 2 + box.left;
          transformations.unshift("rotate(-90 " + tempValue.toString() + " " + tempValue.toString() + ")");
          break;
      }
      if (rotation % 2 === 1) {
        if (box.left !== box.top) {
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
      if (transformations.length) {
        body = '<g transform="' + transformations.join(" ") + '">' + body + "</g>";
      }
    });
    var customisationsWidth = customisations.width;
    var customisationsHeight = customisations.height;
    var boxWidth = box.width;
    var boxHeight = box.height;
    var width;
    var height;
    if (customisationsWidth === null) {
      height = customisationsHeight === null ? "1em" : customisationsHeight === "auto" ? boxHeight : customisationsHeight;
      width = calculateSize(height, boxWidth / boxHeight);
    } else {
      width = customisationsWidth === "auto" ? boxWidth : customisationsWidth;
      height = customisationsHeight === null ? calculateSize(width, boxHeight / boxWidth) : customisationsHeight === "auto" ? boxHeight : customisationsHeight;
    }
    var result = {
      attributes: {
        width: width.toString(),
        height: height.toString(),
        viewBox: box.left.toString() + " " + box.top.toString() + " " + boxWidth.toString() + " " + boxHeight.toString()
      },
      body: body
    };
    return result;
  }

  function buildIcon(icon, customisations) {
    return iconToSVG(Object.assign({}, defaultIconProps, icon), mergeCustomisations(defaultIconCustomisations, customisations || {}));
  }

  var regex = /\sid="(\S+)"/g;
  var randomPrefix = "IconifyId" + Date.now().toString(16) + (Math.random() * 16777216 | 0).toString(16);
  var counter = 0;
  function replaceIDs(body, prefix) {
    if ( prefix === void 0 ) prefix = randomPrefix;

    var ids = [];
    var match;
    while (match = regex.exec(body)) {
      ids.push(match[1]);
    }
    if (!ids.length) {
      return body;
    }
    ids.forEach(function (id) {
      var newID = typeof prefix === "function" ? prefix(id) : prefix + (counter++).toString();
      var escapedID = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      body = body.replace(new RegExp('([#;"])(' + escapedID + ')([")]|\\.[a-z])', "g"), "$1" + newID + "$3");
    });
    return body;
  }

  var cacheVersion = "iconify2";
  var cachePrefix = "iconify";
  var countKey = cachePrefix + "-count";
  var versionKey = cachePrefix + "-version";
  var hour = 36e5;
  var cacheExpiration = 168;
  var config = {
    local: true,
    session: true
  };
  var loaded = false;
  var count = {
    local: 0,
    session: 0
  };
  var emptyList = {
    local: [],
    session: []
  };
  var _window$2 = typeof window === "undefined" ? {} : window;
  function getGlobal(key) {
    var attr = key + "Storage";
    try {
      if (_window$2 && _window$2[attr] && typeof _window$2[attr].length === "number") {
        return _window$2[attr];
      }
    } catch (err) {
    }
    config[key] = false;
    return null;
  }
  function setCount(storage, key, value) {
    try {
      storage.setItem(countKey, value.toString());
      count[key] = value;
      return true;
    } catch (err) {
    }
    return false;
  }
  function getCount(storage) {
    var count2 = storage.getItem(countKey);
    if (count2) {
      var total = parseInt(count2);
      return total ? total : 0;
    }
    return 0;
  }
  function initCache(storage, key) {
    try {
      storage.setItem(versionKey, cacheVersion);
    } catch (err) {
    }
    setCount(storage, key, 0);
  }
  function destroyCache(storage) {
    try {
      var total = getCount(storage);
      for (var i = 0; i < total; i++) {
        storage.removeItem(cachePrefix + i.toString());
      }
    } catch (err) {
    }
  }
  var loadCache = function () {
    if (loaded) {
      return;
    }
    loaded = true;
    var minTime = Math.floor(Date.now() / hour) - cacheExpiration;
    function load(key) {
      var func = getGlobal(key);
      if (!func) {
        return;
      }
      var getItem = function (index) {
        var name = cachePrefix + index.toString();
        var item = func.getItem(name);
        if (typeof item !== "string") {
          return false;
        }
        var valid = true;
        try {
          var data = JSON.parse(item);
          if (typeof data !== "object" || typeof data.cached !== "number" || data.cached < minTime || typeof data.provider !== "string" || typeof data.data !== "object" || typeof data.data.prefix !== "string") {
            valid = false;
          } else {
            var provider = data.provider;
            var prefix = data.data.prefix;
            var storage = getStorage(provider, prefix);
            valid = addIconSet(storage, data.data).length > 0;
          }
        } catch (err) {
          valid = false;
        }
        if (!valid) {
          func.removeItem(name);
        }
        return valid;
      };
      try {
        var version = func.getItem(versionKey);
        if (version !== cacheVersion) {
          if (version) {
            destroyCache(func);
          }
          initCache(func, key);
          return;
        }
        var total = getCount(func);
        for (var i = total - 1; i >= 0; i--) {
          if (!getItem(i)) {
            if (i === total - 1) {
              total--;
            } else {
              emptyList[key].push(i);
            }
          }
        }
        setCount(func, key, total);
      } catch (err) {
      }
    }
    for (var key in config) {
      load(key);
    }
  };
  var storeCache = function (provider, data) {
    if (!loaded) {
      loadCache();
    }
    function store(key) {
      if (!config[key]) {
        return false;
      }
      var func = getGlobal(key);
      if (!func) {
        return false;
      }
      var index = emptyList[key].shift();
      if (index === void 0) {
        index = count[key];
        if (!setCount(func, key, index + 1)) {
          return false;
        }
      }
      try {
        var item = {
          cached: Math.floor(Date.now() / hour),
          provider: provider,
          data: data
        };
        func.setItem(cachePrefix + index.toString(), JSON.stringify(item));
      } catch (err) {
        return false;
      }
      return true;
    }
    if (!Object.keys(data.icons).length) {
      return;
    }
    if (data.not_found) {
      data = Object.assign({}, data);
      delete data.not_found;
    }
    if (!store("local")) {
      store("session");
    }
  };

  var cache = {};

  function toggleBrowserCache(storage, value) {
    switch (storage) {
      case "local":
      case "session":
        config[storage] = value;
        break;
      case "all":
        for (var key in config) {
          config[key] = value;
        }
        break;
    }
  }

  var storage = /* @__PURE__ */ Object.create(null);
  function setAPIModule(provider, item) {
    storage[provider] = item;
  }
  function getAPIModule(provider) {
    return storage[provider] || storage[""];
  }

  function createAPIConfig(source) {
    var resources;
    if (typeof source.resources === "string") {
      resources = [source.resources];
    } else {
      resources = source.resources;
      if (!(resources instanceof Array) || !resources.length) {
        return null;
      }
    }
    var result = {
      resources: resources,
      path: source.path === void 0 ? "/" : source.path,
      maxURL: source.maxURL ? source.maxURL : 500,
      rotate: source.rotate ? source.rotate : 750,
      timeout: source.timeout ? source.timeout : 5e3,
      random: source.random === true,
      index: source.index ? source.index : 0,
      dataAfterTimeout: source.dataAfterTimeout !== false
    };
    return result;
  }
  var configStorage = /* @__PURE__ */ Object.create(null);
  var fallBackAPISources = [
    "https://api.simplesvg.com",
    "https://api.unisvg.com"
  ];
  var fallBackAPI = [];
  while (fallBackAPISources.length > 0) {
    if (fallBackAPISources.length === 1) {
      fallBackAPI.push(fallBackAPISources.shift());
    } else {
      if (Math.random() > 0.5) {
        fallBackAPI.push(fallBackAPISources.shift());
      } else {
        fallBackAPI.push(fallBackAPISources.pop());
      }
    }
  }
  configStorage[""] = createAPIConfig({
    resources: ["https://api.iconify.design"].concat(fallBackAPI)
  });
  function addAPIProvider(provider, customConfig) {
    var config = createAPIConfig(customConfig);
    if (config === null) {
      return false;
    }
    configStorage[provider] = config;
    return true;
  }
  function getAPIConfig(provider) {
    return configStorage[provider];
  }
  function listAPIProviders() {
    return Object.keys(configStorage);
  }

  var maxLengthCache = {};
  var pathCache = {};
  var detectFetch = function () {
    var callback;
    try {
      callback = fetch;
      if (typeof callback === "function") {
        return callback;
      }
    } catch (err) {
    }
    return null;
  };
  var fetchModule = detectFetch();
  function setFetch(fetch2) {
    fetchModule = fetch2;
  }
  function getFetch() {
    return fetchModule;
  }
  function calculateMaxLength(provider, prefix) {
    var config = getAPIConfig(provider);
    if (!config) {
      return 0;
    }
    var result;
    if (!config.maxURL) {
      result = 0;
    } else {
      var maxHostLength = 0;
      config.resources.forEach(function (item) {
        var host = item;
        maxHostLength = Math.max(maxHostLength, host.length);
      });
      var url = prefix + ".json?icons=";
      result = config.maxURL - maxHostLength - config.path.length - url.length;
    }
    var cacheKey = provider + ":" + prefix;
    pathCache[provider] = config.path;
    maxLengthCache[cacheKey] = result;
    return result;
  }
  function shouldAbort(status) {
    return status === 404;
  }
  var prepare = function (provider, prefix, icons) {
    var results = [];
    var maxLength = maxLengthCache[prefix];
    if (maxLength === void 0) {
      maxLength = calculateMaxLength(provider, prefix);
    }
    var type = "icons";
    var item = {
      type: type,
      provider: provider,
      prefix: prefix,
      icons: []
    };
    var length = 0;
    icons.forEach(function (name, index) {
      length += name.length + 1;
      if (length >= maxLength && index > 0) {
        results.push(item);
        item = {
          type: type,
          provider: provider,
          prefix: prefix,
          icons: []
        };
        length = name.length;
      }
      item.icons.push(name);
    });
    results.push(item);
    return results;
  };
  function getPath(provider) {
    if (typeof provider === "string") {
      if (pathCache[provider] === void 0) {
        var config = getAPIConfig(provider);
        if (!config) {
          return "/";
        }
        pathCache[provider] = config.path;
      }
      return pathCache[provider];
    }
    return "/";
  }
  var send = function (host, params, callback) {
    if (!fetchModule) {
      callback("abort", 424);
      return;
    }
    var path = getPath(params.provider);
    switch (params.type) {
      case "icons": {
        var prefix = params.prefix;
        var icons = params.icons;
        var iconsList = icons.join(",");
        var urlParams = new URLSearchParams({
          icons: iconsList
        });
        path += prefix + ".json?" + urlParams.toString();
        break;
      }
      case "custom": {
        var uri = params.uri;
        path += uri.slice(0, 1) === "/" ? uri.slice(1) : uri;
        break;
      }
      default:
        callback("abort", 400);
        return;
    }
    var defaultError = 503;
    fetchModule(host + path).then(function (response) {
      var status = response.status;
      if (status !== 200) {
        setTimeout(function () {
          callback(shouldAbort(status) ? "abort" : "next", status);
        });
        return;
      }
      defaultError = 501;
      return response.json();
    }).then(function (data) {
      if (typeof data !== "object" || data === null) {
        setTimeout(function () {
          callback("next", defaultError);
        });
        return;
      }
      setTimeout(function () {
        callback("success", data);
      });
    }).catch(function () {
      callback("next", defaultError);
    });
  };
  var fetchAPIModule = {
    prepare: prepare,
    send: send
  };

  function sortIcons(icons) {
    var result = {
      loaded: [],
      missing: [],
      pending: []
    };
    var storage = /* @__PURE__ */ Object.create(null);
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
      provider: "",
      prefix: "",
      name: ""
    };
    icons.forEach(function (icon) {
      if (lastIcon.name === icon.name && lastIcon.prefix === icon.prefix && lastIcon.provider === icon.provider) {
        return;
      }
      lastIcon = icon;
      var provider = icon.provider;
      var prefix = icon.prefix;
      var name = icon.name;
      if (storage[provider] === void 0) {
        storage[provider] = /* @__PURE__ */ Object.create(null);
      }
      var providerStorage = storage[provider];
      if (providerStorage[prefix] === void 0) {
        providerStorage[prefix] = getStorage(provider, prefix);
      }
      var localStorage = providerStorage[prefix];
      var list;
      if (localStorage.icons[name] !== void 0) {
        list = result.loaded;
      } else if (prefix === "" || localStorage.missing[name] !== void 0) {
        list = result.missing;
      } else {
        list = result.pending;
      }
      var item = {
        provider: provider,
        prefix: prefix,
        name: name
      };
      list.push(item);
    });
    return result;
  }

  var callbacks = /* @__PURE__ */ Object.create(null);
  var pendingUpdates = /* @__PURE__ */ Object.create(null);
  function removeCallback(sources, id) {
    sources.forEach(function (source) {
      var provider = source.provider;
      if (callbacks[provider] === void 0) {
        return;
      }
      var providerCallbacks = callbacks[provider];
      var prefix = source.prefix;
      var items = providerCallbacks[prefix];
      if (items) {
        providerCallbacks[prefix] = items.filter(function (row) { return row.id !== id; });
      }
    });
  }
  function updateCallbacks(provider, prefix) {
    if (pendingUpdates[provider] === void 0) {
      pendingUpdates[provider] = /* @__PURE__ */ Object.create(null);
    }
    var providerPendingUpdates = pendingUpdates[provider];
    if (!providerPendingUpdates[prefix]) {
      providerPendingUpdates[prefix] = true;
      setTimeout(function () {
        providerPendingUpdates[prefix] = false;
        if (callbacks[provider] === void 0 || callbacks[provider][prefix] === void 0) {
          return;
        }
        var items = callbacks[provider][prefix].slice(0);
        if (!items.length) {
          return;
        }
        var storage = getStorage(provider, prefix);
        var hasPending = false;
        items.forEach(function (item) {
          var icons = item.icons;
          var oldLength = icons.pending.length;
          icons.pending = icons.pending.filter(function (icon) {
            if (icon.prefix !== prefix) {
              return true;
            }
            var name = icon.name;
            if (storage.icons[name] !== void 0) {
              icons.loaded.push({
                provider: provider,
                prefix: prefix,
                name: name
              });
            } else if (storage.missing[name] !== void 0) {
              icons.missing.push({
                provider: provider,
                prefix: prefix,
                name: name
              });
            } else {
              hasPending = true;
              return true;
            }
            return false;
          });
          if (icons.pending.length !== oldLength) {
            if (!hasPending) {
              removeCallback([
                {
                  provider: provider,
                  prefix: prefix
                }
              ], item.id);
            }
            item.callback(icons.loaded.slice(0), icons.missing.slice(0), icons.pending.slice(0), item.abort);
          }
        });
      });
    }
  }
  var idCounter = 0;
  function storeCallback(callback, icons, pendingSources) {
    var id = idCounter++;
    var abort = removeCallback.bind(null, pendingSources, id);
    if (!icons.pending.length) {
      return abort;
    }
    var item = {
      id: id,
      icons: icons,
      callback: callback,
      abort: abort
    };
    pendingSources.forEach(function (source) {
      var provider = source.provider;
      var prefix = source.prefix;
      if (callbacks[provider] === void 0) {
        callbacks[provider] = /* @__PURE__ */ Object.create(null);
      }
      var providerCallbacks = callbacks[provider];
      if (providerCallbacks[prefix] === void 0) {
        providerCallbacks[prefix] = [];
      }
      providerCallbacks[prefix].push(item);
    });
    return abort;
  }

  function listToIcons(list, validate, simpleNames) {
    if ( validate === void 0 ) validate = true;
    if ( simpleNames === void 0 ) simpleNames = false;

    var result = [];
    list.forEach(function (item) {
      var icon = typeof item === "string" ? stringToIcon(item, false, simpleNames) : item;
      if (!validate || validateIcon(icon, simpleNames)) {
        result.push({
          provider: icon.provider,
          prefix: icon.prefix,
          name: icon.name
        });
      }
    });
    return result;
  }

  // src/config.ts
  var defaultConfig = {
    resources: [],
    index: 0,
    timeout: 2e3,
    rotate: 750,
    random: false,
    dataAfterTimeout: false
  };

  // src/query.ts
  function sendQuery(config, payload, query, done) {
    var resourcesCount = config.resources.length;
    var startIndex = config.random ? Math.floor(Math.random() * resourcesCount) : config.index;
    var resources;
    if (config.random) {
      var list = config.resources.slice(0);
      resources = [];
      while (list.length > 1) {
        var nextIndex = Math.floor(Math.random() * list.length);
        resources.push(list[nextIndex]);
        list = list.slice(0, nextIndex).concat(list.slice(nextIndex + 1));
      }
      resources = resources.concat(list);
    } else {
      resources = config.resources.slice(startIndex).concat(config.resources.slice(0, startIndex));
    }
    var startTime = Date.now();
    var status = "pending";
    var queriesSent = 0;
    var lastError;
    var timer = null;
    var queue = [];
    var doneCallbacks = [];
    if (typeof done === "function") {
      doneCallbacks.push(done);
    }
    function resetTimer() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    }
    function abort() {
      if (status === "pending") {
        status = "aborted";
      }
      resetTimer();
      queue.forEach(function (item) {
        if (item.status === "pending") {
          item.status = "aborted";
        }
      });
      queue = [];
    }
    function subscribe(callback, overwrite) {
      if (overwrite) {
        doneCallbacks = [];
      }
      if (typeof callback === "function") {
        doneCallbacks.push(callback);
      }
    }
    function getQueryStatus() {
      return {
        startTime: startTime,
        payload: payload,
        status: status,
        queriesSent: queriesSent,
        queriesPending: queue.length,
        subscribe: subscribe,
        abort: abort
      };
    }
    function failQuery() {
      status = "failed";
      doneCallbacks.forEach(function (callback) {
        callback(void 0, lastError);
      });
    }
    function clearQueue() {
      queue.forEach(function (item) {
        if (item.status === "pending") {
          item.status = "aborted";
        }
      });
      queue = [];
    }
    function moduleResponse(item, response, data) {
      var isError = response !== "success";
      queue = queue.filter(function (queued) { return queued !== item; });
      switch (status) {
        case "pending":
          break;
        case "failed":
          if (isError || !config.dataAfterTimeout) {
            return;
          }
          break;
        default:
          return;
      }
      if (response === "abort") {
        lastError = data;
        failQuery();
        return;
      }
      if (isError) {
        lastError = data;
        if (!queue.length) {
          if (!resources.length) {
            failQuery();
          } else {
            execNext();
          }
        }
        return;
      }
      resetTimer();
      clearQueue();
      if (!config.random) {
        var index = config.resources.indexOf(item.resource);
        if (index !== -1 && index !== config.index) {
          config.index = index;
        }
      }
      status = "completed";
      doneCallbacks.forEach(function (callback) {
        callback(data);
      });
    }
    function execNext() {
      if (status !== "pending") {
        return;
      }
      resetTimer();
      var resource = resources.shift();
      if (resource === void 0) {
        if (queue.length) {
          timer = setTimeout(function () {
            resetTimer();
            if (status === "pending") {
              clearQueue();
              failQuery();
            }
          }, config.timeout);
          return;
        }
        failQuery();
        return;
      }
      var item = {
        status: "pending",
        resource: resource,
        callback: function (status2, data) {
          moduleResponse(item, status2, data);
        }
      };
      queue.push(item);
      queriesSent++;
      timer = setTimeout(execNext, config.rotate);
      query(resource, payload, item.callback);
    }
    setTimeout(execNext);
    return getQueryStatus;
  }

  // src/index.ts
  function setConfig(config) {
    if (typeof config !== "object" || typeof config.resources !== "object" || !(config.resources instanceof Array) || !config.resources.length) {
      throw new Error("Invalid Reduncancy configuration");
    }
    var newConfig = /* @__PURE__ */ Object.create(null);
    var key;
    for (key in defaultConfig) {
      if (config[key] !== void 0) {
        newConfig[key] = config[key];
      } else {
        newConfig[key] = defaultConfig[key];
      }
    }
    return newConfig;
  }
  function initRedundancy(cfg) {
    var config = setConfig(cfg);
    var queries = [];
    function cleanup() {
      queries = queries.filter(function (item) { return item().status === "pending"; });
    }
    function query(payload, queryCallback, doneCallback) {
      var query2 = sendQuery(config, payload, queryCallback, function (data, error) {
        cleanup();
        if (doneCallback) {
          doneCallback(data, error);
        }
      });
      queries.push(query2);
      return query2;
    }
    function find(callback) {
      var result = queries.find(function (value) {
        return callback(value);
      });
      return result !== void 0 ? result : null;
    }
    var instance = {
      query: query,
      find: find,
      setIndex: function (index) {
        config.index = index;
      },
      getIndex: function () { return config.index; },
      cleanup: cleanup
    };
    return instance;
  }

  function emptyCallback$1() {
  }
  var redundancyCache = /* @__PURE__ */ Object.create(null);
  function getRedundancyCache(provider) {
    if (redundancyCache[provider] === void 0) {
      var config = getAPIConfig(provider);
      if (!config) {
        return;
      }
      var redundancy = initRedundancy(config);
      var cachedReundancy = {
        config: config,
        redundancy: redundancy
      };
      redundancyCache[provider] = cachedReundancy;
    }
    return redundancyCache[provider];
  }
  function sendAPIQuery(target, query, callback) {
    var redundancy;
    var send;
    if (typeof target === "string") {
      var api = getAPIModule(target);
      if (!api) {
        callback(void 0, 424);
        return emptyCallback$1;
      }
      send = api.send;
      var cached = getRedundancyCache(target);
      if (cached) {
        redundancy = cached.redundancy;
      }
    } else {
      var config = createAPIConfig(target);
      if (config) {
        redundancy = initRedundancy(config);
        var moduleKey = target.resources ? target.resources[0] : "";
        var api$1 = getAPIModule(moduleKey);
        if (api$1) {
          send = api$1.send;
        }
      }
    }
    if (!redundancy || !send) {
      callback(void 0, 424);
      return emptyCallback$1;
    }
    return redundancy.query(query, send, callback)().abort;
  }

  function emptyCallback() {
  }
  var pendingIcons = /* @__PURE__ */ Object.create(null);
  var iconsToLoad = /* @__PURE__ */ Object.create(null);
  var loaderFlags = /* @__PURE__ */ Object.create(null);
  var queueFlags = /* @__PURE__ */ Object.create(null);
  function loadedNewIcons(provider, prefix) {
    if (loaderFlags[provider] === void 0) {
      loaderFlags[provider] = /* @__PURE__ */ Object.create(null);
    }
    var providerLoaderFlags = loaderFlags[provider];
    if (!providerLoaderFlags[prefix]) {
      providerLoaderFlags[prefix] = true;
      setTimeout(function () {
        providerLoaderFlags[prefix] = false;
        updateCallbacks(provider, prefix);
      });
    }
  }
  var errorsCache = /* @__PURE__ */ Object.create(null);
  function loadNewIcons(provider, prefix, icons) {
    function err() {
      var key = (provider === "" ? "" : "@" + provider + ":") + prefix;
      var time = Math.floor(Date.now() / 6e4);
      if (errorsCache[key] < time) {
        errorsCache[key] = time;
        console.error('Unable to retrieve icons for "' + key + '" because API is not configured properly.');
      }
    }
    if (iconsToLoad[provider] === void 0) {
      iconsToLoad[provider] = /* @__PURE__ */ Object.create(null);
    }
    var providerIconsToLoad = iconsToLoad[provider];
    if (queueFlags[provider] === void 0) {
      queueFlags[provider] = /* @__PURE__ */ Object.create(null);
    }
    var providerQueueFlags = queueFlags[provider];
    if (pendingIcons[provider] === void 0) {
      pendingIcons[provider] = /* @__PURE__ */ Object.create(null);
    }
    var providerPendingIcons = pendingIcons[provider];
    if (providerIconsToLoad[prefix] === void 0) {
      providerIconsToLoad[prefix] = icons;
    } else {
      providerIconsToLoad[prefix] = providerIconsToLoad[prefix].concat(icons).sort();
    }
    if (!providerQueueFlags[prefix]) {
      providerQueueFlags[prefix] = true;
      setTimeout(function () {
        providerQueueFlags[prefix] = false;
        var icons2 = providerIconsToLoad[prefix];
        delete providerIconsToLoad[prefix];
        var api = getAPIModule(provider);
        if (!api) {
          err();
          return;
        }
        var params = api.prepare(provider, prefix, icons2);
        params.forEach(function (item) {
          sendAPIQuery(provider, item, function (data, error) {
            var storage = getStorage(provider, prefix);
            if (typeof data !== "object") {
              if (error !== 404) {
                return;
              }
              var t = Date.now();
              item.icons.forEach(function (name) {
                storage.missing[name] = t;
              });
            } else {
              try {
                var parsed = addIconSet(storage, data);
                if (!parsed.length) {
                  return;
                }
                var pending = providerPendingIcons[prefix];
                parsed.forEach(function (name) {
                  delete pending[name];
                });
                if (cache.store) {
                  cache.store(provider, data);
                }
              } catch (err2) {
                console.error(err2);
              }
            }
            loadedNewIcons(provider, prefix);
          });
        });
      });
    }
  }
  var isPending = function (icon) {
    var provider = icon.provider;
    var prefix = icon.prefix;
    return pendingIcons[provider] && pendingIcons[provider][prefix] && pendingIcons[provider][prefix][icon.name] !== void 0;
  };
  var loadIcons = function (icons, callback) {
    var cleanedIcons = listToIcons(icons, true, allowSimpleNames());
    var sortedIcons = sortIcons(cleanedIcons);
    if (!sortedIcons.pending.length) {
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
    var newIcons = /* @__PURE__ */ Object.create(null);
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
        prefix: prefix
      });
      if (pendingIcons[provider] === void 0) {
        pendingIcons[provider] = /* @__PURE__ */ Object.create(null);
      }
      var providerPendingIcons = pendingIcons[provider];
      if (providerPendingIcons[prefix] === void 0) {
        providerPendingIcons[prefix] = /* @__PURE__ */ Object.create(null);
      }
      if (newIcons[provider] === void 0) {
        newIcons[provider] = /* @__PURE__ */ Object.create(null);
      }
      var providerNewIcons = newIcons[provider];
      if (providerNewIcons[prefix] === void 0) {
        providerNewIcons[prefix] = [];
      }
    });
    var time = Date.now();
    sortedIcons.pending.forEach(function (icon) {
      var provider = icon.provider;
      var prefix = icon.prefix;
      var name = icon.name;
      var pendingQueue = pendingIcons[provider][prefix];
      if (pendingQueue[name] === void 0) {
        pendingQueue[name] = time;
        newIcons[provider][prefix].push(name);
      }
    });
    sources.forEach(function (source) {
      var provider = source.provider;
      var prefix = source.prefix;
      if (newIcons[provider][prefix].length) {
        loadNewIcons(provider, prefix, newIcons[provider][prefix]);
      }
    });
    return callback ? storeCallback(callback, sortedIcons, sources) : emptyCallback;
  };
  var loadIcon = function (icon) {
    return new Promise(function (fulfill, reject) {
      var iconObj = typeof icon === "string" ? stringToIcon(icon) : icon;
      loadIcons([iconObj || icon], function (loaded) {
        if (loaded.length && iconObj) {
          var data = getIconData(iconObj);
          if (data) {
            fulfill(Object.assign({}, data));
            return;
          }
        }
        reject(icon);
      });
    });
  };

  var defaultExtendedIconCustomisations = Object.assign({}, defaultIconCustomisations,
      {inline: false});
  /**
   * Class names
   */
  var blockClass = 'iconify';
  var inlineClass = 'iconify-inline';
  /**
   * Names of properties to add to nodes
   */
  var elementDataProperty = ('iconifyData' + Date.now());

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
      // Create item, add it to list
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
      if (document.documentElement) {
          return addRootNode(document.documentElement);
      }
      nodes.push({
          node: function () {
              return document.documentElement;
          },
      });
  }
  /**
   * Remove root node
   */
  function removeRootNode(root) {
      nodes = nodes.filter(function (node) { return root !== node &&
          root !== (typeof node.node === 'function' ? node.node() : node.node); });
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
      if (doc.readyState && doc.readyState !== 'loading') {
          callback();
      }
      else {
          doc.addEventListener('DOMContentLoaded', callback);
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
                      item.target[elementDataProperty] !==
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
  function continueObserving(node, root) {
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
      if (!root || !window) {
          // document.body is not available yet or window is missing
          return;
      }
      if (!observer) {
          observer = {
              paused: 0,
          };
          node.observer = observer;
      }
      // Create new instance, observe
      observer.instance = new window.MutationObserver(checkMutations.bind(null, node));
      continueObserving(node, root);
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
   * Pause observing node
   */
  function pauseObservingNode(node) {
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
   * Pause observer
   */
  function pauseObserver(root) {
      if (root) {
          var node = findRootNode(root);
          if (node) {
              pauseObservingNode(node);
          }
      }
      else {
          pauseObservingNode();
      }
  }
  /**
   * Resume observer
   */
  function resumeObservingNode(observer) {
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
                      continueObserving(node, root);
                  }
                  else {
                      startObserver(node);
                  }
              }
          }
      });
  }
  /**
   * Resume observer
   */
  function resumeObserver(root) {
      if (root) {
          var node = findRootNode(root);
          if (node) {
              resumeObservingNode(node);
          }
      }
      else {
          resumeObservingNode();
      }
  }
  /**
   * Observe node
   */
  function observe(root, autoRemove) {
      if ( autoRemove === void 0 ) autoRemove = false;

      var node = addRootNode(root, autoRemove);
      startObserver(node);
      return node;
  }
  /**
   * Remove observed node
   */
  function stopObserving(root) {
      var node = findRootNode(root);
      if (node) {
          stopObserver(node);
          removeRootNode(root);
      }
  }

  /**
   * Compare props
   */
  function propsChanged(props1, props2) {
      if (props1.name !== props2.name || props1.mode !== props2.mode) {
          return true;
      }
      var customisations1 = props1.customisations;
      var customisations2 = props2.customisations;
      for (var key in defaultExtendedIconCustomisations) {
          if (customisations1[key] !== customisations2[key]) {
              return true;
          }
      }
      return false;
  }

  function rotateFromString(value, defaultValue) {
    if ( defaultValue === void 0 ) defaultValue = 0;

    var units = value.replace(/^-?[0-9.]*/, "");
    function cleanup(value2) {
      while (value2 < 0) {
        value2 += 4;
      }
      return value2 % 4;
    }
    if (units === "") {
      var num = parseInt(value);
      return isNaN(num) ? 0 : cleanup(num);
    } else if (units !== value) {
      var split = 0;
      switch (units) {
        case "%":
          split = 25;
          break;
        case "deg":
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
    return defaultValue;
  }

  var separator = /[\s,]+/;
  function flipFromString(custom, flip) {
    flip.split(separator).forEach(function (str) {
      var value = str.trim();
      switch (value) {
        case "horizontal":
          custom.hFlip = true;
          break;
        case "vertical":
          custom.vFlip = true;
          break;
      }
    });
  }

  /**
   * Size attributes
   */
  var sizeAttributes = ['width', 'height'];
  /**
   * Boolean attributes
   */
  var booleanAttributes = [
      'inline',
      'hFlip',
      'vFlip' ];
  /**
   * Get attribute value
   */
  function getBooleanAttribute(value, key) {
      if (value === key || value === 'true') {
          return true;
      }
      if (value === '' || value === 'false') {
          return false;
      }
      return null;
  }
  /**
   * Get element properties from HTML element
   */
  function getElementProps(element) {
      // Get icon name
      var name = element.getAttribute('data-icon');
      var icon = typeof name === 'string' && stringToIcon(name, true);
      if (!icon) {
          return null;
      }
      // Get defaults and inline
      var customisations = Object.assign({}, defaultExtendedIconCustomisations,
          {inline: element.classList && element.classList.contains(inlineClass)});
      // Get dimensions
      sizeAttributes.forEach(function (attr) {
          var value = element.getAttribute('data-' + attr);
          if (value) {
              customisations[attr] = value;
          }
      });
      // Get rotation
      var rotation = element.getAttribute('data-rotate');
      if (typeof rotation === 'string') {
          customisations.rotate = rotateFromString(rotation);
      }
      // Get flip shorthand
      var flip = element.getAttribute('data-flip');
      if (typeof flip === 'string') {
          flipFromString(customisations, flip);
      }
      // Boolean attributes
      booleanAttributes.forEach(function (attr) {
          var key = 'data-' + attr;
          var value = getBooleanAttribute(element.getAttribute(key), key);
          if (typeof value === 'boolean') {
              customisations[attr] = value;
          }
      });
      // Get render mode. Not checking actual value because incorrect values are treated as inline
      var mode = element.getAttribute('data-mode');
      return {
          name: name,
          icon: icon,
          customisations: customisations,
          mode: mode,
      };
  }

  /**
   * Selector combining class names and tags
   */
  var selector = 'svg.' +
      blockClass +
      ', i.' +
      blockClass +
      ', span.' +
      blockClass +
      ', i.' +
      inlineClass +
      ', span.' +
      inlineClass;
  /**
   * Find all parent nodes in DOM
   */
  function scanRootNode(root) {
      var nodes = [];
      root.querySelectorAll(selector).forEach(function (node) {
          // Get props, ignore SVG rendered outside of SVG framework
          var props = node[elementDataProperty] || node.tagName.toLowerCase() !== 'svg'
              ? getElementProps(node)
              : null;
          if (props) {
              nodes.push({
                  node: node,
                  props: props,
              });
          }
      });
      return nodes;
  }

  function iconToHTML(body, attributes) {
    var renderAttribsHTML = body.indexOf("xlink:") === -1 ? "" : ' xmlns:xlink="http://www.w3.org/1999/xlink"';
    for (var attr in attributes) {
      renderAttribsHTML += " " + attr + '="' + attributes[attr] + '"';
    }
    return '<svg xmlns="http://www.w3.org/2000/svg"' + renderAttribsHTML + ">" + body + "</svg>";
  }

  /**
   * Get classes to add from icon name
   */
  function iconClasses(iconName) {
      var classesToAdd = new Set(['iconify']);
      ['provider', 'prefix'].forEach(function (attr) {
          if (iconName[attr]) {
              classesToAdd.add('iconify--' + iconName[attr]);
          }
      });
      return classesToAdd;
  }
  /**
   * Add classes to SVG, removing previously added classes, keeping custom classes
   */
  function applyClasses(svg, classes, previouslyAddedClasses, placeholder) {
      var svgClasses = svg.classList;
      // Copy classes from placeholder
      if (placeholder) {
          var placeholderClasses = placeholder.classList;
          Array.from(placeholderClasses).forEach(function (item) {
              svgClasses.add(item);
          });
      }
      // Add new classes
      var addedClasses = [];
      classes.forEach(function (item) {
          if (!svgClasses.contains(item)) {
              // Add new class
              svgClasses.add(item);
              addedClasses.push(item);
          }
          else if (previouslyAddedClasses.has(item)) {
              // Was added before: keep it
              addedClasses.push(item);
          }
      });
      // Remove previously added classes
      previouslyAddedClasses.forEach(function (item) {
          if (!classes.has(item)) {
              // Class that was added before, but no longer needed
              svgClasses.remove(item);
          }
      });
      return addedClasses;
  }

  /**
   * Copy old styles, apply new styles
   */
  function applyStyle(svg, styles, previouslyAddedStyles) {
      var svgStyle = svg.style;
      // Remove previously added styles
      (previouslyAddedStyles || []).forEach(function (prop) {
          svgStyle.removeProperty(prop);
      });
      // Apply new styles, ignoring styles that already exist
      var appliedStyles = [];
      for (var prop in styles) {
          if (!svgStyle.getPropertyValue(prop)) {
              appliedStyles.push(prop);
              svgStyle.setProperty(prop, styles[prop]);
          }
      }
      return appliedStyles;
  }

  /**
   * Render icon as inline SVG
   */
  function renderInlineSVG(element, props, iconData) {
      // Create placeholder. Why placeholder? innerHTML setter on SVG does not work in some environments.
      var span;
      try {
          span = document.createElement('span');
      }
      catch (err) {
          return element;
      }
      // Generate data to render
      var customisations = props.customisations;
      var renderData = iconToSVG(iconData, customisations);
      // Get old data
      var oldData = element[elementDataProperty];
      // Generate SVG
      var html = iconToHTML(replaceIDs(renderData.body), Object.assign({}, {'aria-hidden': 'true',
          'role': 'img'},
          renderData.attributes));
      span.innerHTML = html;
      // Get SVG element
      var svg = span.childNodes[0];
      // Add attributes
      var placeholderAttributes = element.attributes;
      for (var i = 0; i < placeholderAttributes.length; i++) {
          var item = placeholderAttributes.item(i);
          var name = item.name;
          if (name !== 'class' && !svg.hasAttribute(name)) {
              svg.setAttribute(name, item.value);
          }
      }
      // Add classes
      var classesToAdd = iconClasses(props.icon);
      var addedClasses = applyClasses(svg, classesToAdd, new Set(oldData && oldData.addedClasses), element);
      // Update style
      var addedStyles = applyStyle(svg, customisations.inline
          ? {
              'vertical-align': '-0.125em',
          }
          : {}, oldData && oldData.addedStyles);
      // Add data to element
      var newData = Object.assign({}, props,
          {status: 'loaded',
          addedClasses: addedClasses,
          addedStyles: addedStyles});
      svg[elementDataProperty] = newData;
      // Replace old element
      if (element.parentNode) {
          element.parentNode.replaceChild(svg, element);
      }
      return svg;
  }

  function encodeSVGforURL(svg) {
    return svg.replace(/"/g, "'").replace(/%/g, "%25").replace(/#/g, "%23").replace(/</g, "%3C").replace(/>/g, "%3E").replace(/\s+/g, " ");
  }
  function svgToURL(svg) {
    return 'url("data:image/svg+xml,' + encodeSVGforURL(svg) + '")';
  }

  var commonProps = {
      display: 'inline-block',
  };
  var monotoneProps = {
      'background-color': 'currentColor',
  };
  var coloredProps = {
      'background-color': 'transparent',
  };
  // Dynamically add common props to variables above
  var propsToAdd = {
      image: 'var(--svg)',
      repeat: 'no-repeat',
      size: '100% 100%',
  };
  var propsToAddTo = {
      '-webkit-mask': monotoneProps,
      'mask': monotoneProps,
      'background': coloredProps,
  };
  for (var prefix in propsToAddTo) {
      var list = propsToAddTo[prefix];
      for (var prop in propsToAdd) {
          list[prefix + '-' + prop] = propsToAdd[prop];
      }
  }
  /**
   * Fix size: add 'px' to numbers
   */
  function fixSize(value) {
      return value + (value.match(/^[-0-9.]+$/) ? 'px' : '');
  }
  /**
   * Render icon as inline SVG
   */
  function renderBackground(element, props, iconData, useMask) {
      // Generate data to render
      var customisations = props.customisations;
      var renderData = iconToSVG(iconData, customisations);
      var renderAttribs = renderData.attributes;
      // Get old data
      var oldData = element[elementDataProperty];
      // Generate SVG
      var html = iconToHTML(renderData.body, Object.assign({}, renderAttribs,
          {width: iconData.width + '',
          height: iconData.height + ''}));
      // Add classes
      var classesToAdd = iconClasses(props.icon);
      var addedClasses = applyClasses(element, classesToAdd, new Set(oldData && oldData.addedClasses));
      // Update style
      var url = svgToURL(html);
      var newStyles = Object.assign({}, {'--svg': url,
          'width': fixSize(renderAttribs.width),
          'height': fixSize(renderAttribs.height)},
          commonProps,
          (useMask ? monotoneProps : coloredProps));
      if (customisations.inline) {
          newStyles['vertical-align'] = '-0.125em';
      }
      var addedStyles = applyStyle(element, newStyles, oldData && oldData.addedStyles);
      // Add data to element
      var newData = Object.assign({}, props,
          {status: 'loaded',
          addedClasses: addedClasses,
          addedStyles: addedStyles});
      element[elementDataProperty] = newData;
      return element;
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
   * Scan node for placeholders
   */
  function scanDOM(rootNode, addTempNode) {
      if ( addTempNode === void 0 ) addTempNode = false;

      // List of icons to load: [provider][prefix] = Set<name>
      var iconsToLoad = Object.create(null);
      function getIcon(icon, load) {
          var provider = icon.provider;
          var prefix = icon.prefix;
          var name = icon.name;
          var storage = getStorage(provider, prefix);
          var storedIcon = storage.icons[name];
          if (storedIcon) {
              return {
                  status: 'loaded',
                  icon: storedIcon,
              };
          }
          if (storage.missing[name]) {
              return {
                  status: 'missing',
              };
          }
          if (load && !isPending(icon)) {
              var providerIconsToLoad = iconsToLoad[provider] ||
                  (iconsToLoad[provider] = Object.create(null));
              var set = providerIconsToLoad[prefix] ||
                  (providerIconsToLoad[prefix] = new Set());
              set.add(name);
          }
          return {
              status: 'loading',
          };
      }
      // Parse all root nodes
      (rootNode ? [rootNode] : listRootNodes()).forEach(function (observedNode) {
          var root = typeof observedNode.node === 'function'
              ? observedNode.node()
              : observedNode.node;
          if (!root || !root.querySelectorAll) {
              return;
          }
          // Track placeholders
          var hasPlaceholders = false;
          // Observer
          var paused = false;
          /**
           * Render icon
           */
          function render(element, props, iconData) {
              if (!paused) {
                  paused = true;
                  pauseObservingNode(observedNode);
              }
              if (element.tagName.toUpperCase() !== 'SVG') {
                  // Check for one of style modes
                  var mode = props.mode;
                  var isMask = mode === 'mask' ||
                      (mode === 'bg'
                          ? false
                          : mode === 'style'
                              ? iconData.body.indexOf('currentColor') !== -1
                              : null);
                  if (typeof isMask === 'boolean') {
                      renderBackground(element, props, iconData, isMask);
                      return;
                  }
              }
              renderInlineSVG(element, props, iconData);
          }
          // Find all elements
          scanRootNode(root).forEach(function (ref) {
              var node = ref.node;
              var props = ref.props;

              // Check if item already has props
              var oldData = node[elementDataProperty];
              if (!oldData) {
                  // New icon without data
                  var ref$1 = getIcon(props.icon, true);
                  var status = ref$1.status;
                  var icon = ref$1.icon;
                  if (icon) {
                      // Ready to render!
                      render(node, props, icon);
                      return;
                  }
                  // Loading or missing
                  hasPlaceholders = hasPlaceholders || status === 'loading';
                  node[elementDataProperty] = Object.assign({}, props,
                      {status: status});
                  return;
              }
              // Previously found icon
              var item;
              if (!propsChanged(oldData, props)) {
                  // Props have not changed. Check status
                  var oldStatus = oldData.status;
                  if (oldStatus !== 'loading') {
                      return;
                  }
                  item = getIcon(props.icon, false);
                  if (!item.icon) {
                      // Nothing to render
                      oldData.status = item.status;
                      return;
                  }
              }
              else {
                  // Properties have changed: load icon if name has changed
                  item = getIcon(props.icon, oldData.name !== props.name);
                  if (!item.icon) {
                      // Cannot render icon: update status and props
                      hasPlaceholders =
                          hasPlaceholders || item.status === 'loading';
                      Object.assign(oldData, Object.assign({}, props,
                          {status: item.status}));
                      return;
                  }
              }
              // Re-render icon
              render(node, props, item.icon);
          });
          // Observed node stuff
          if (observedNode.temporary && !hasPlaceholders) {
              // Remove temporary node
              stopObserving(root);
          }
          else if (addTempNode && hasPlaceholders) {
              // Add new temporary node
              observe(root, true);
          }
          else if (paused && observedNode.observer) {
              // Resume observer
              resumeObservingNode(observedNode);
          }
      });
      // Load icons
      var loop = function ( provider ) {
          var providerIconsToLoad = iconsToLoad[provider];
          var loop$1 = function ( prefix ) {
              var set = providerIconsToLoad[prefix];
              loadIcons(Array.from(set).map(function (name) { return ({
                  provider: provider,
                  prefix: prefix,
                  name: name,
              }); }), checkPendingIcons);
          };

          for (var prefix in providerIconsToLoad) loop$1( prefix );
      };

      for (var provider in iconsToLoad) loop( provider );
  }
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

  function generateIcon(name, customisations, returnString) {
      if ( returnString === void 0 ) returnString = false;

      // Get icon data
      var iconData = getIconData(name);
      if (!iconData) {
          return null;
      }
      // Split name
      var iconName = stringToIcon(name);
      // Clean up customisations
      var changes = mergeCustomisations(defaultExtendedIconCustomisations, customisations || {});
      // Get data
      var result = renderInlineSVG(document.createElement('span'), {
          name: name,
          icon: iconName,
          customisations: changes,
      }, iconData);
      return returnString
          ? result.outerHTML
          : result;
  }
  /**
   * Get version
   */
  function getVersion() {
      return '3.0.0-beta.1';
  }
  /**
   * Generate SVG element
   */
  function renderSVG(name, customisations) {
      return generateIcon(name, customisations, false);
  }
  /**
   * Generate SVG as string
   */
  function renderHTML(name, customisations) {
      return generateIcon(name, customisations, true);
  }
  /**
   * Get rendered icon as object that can be used to create SVG (use replaceIDs on body)
   */
  function renderIcon(name, customisations) {
      // Get icon data
      var iconData = getIconData(name);
      if (!iconData) {
          return null;
      }
      // Clean up customisations
      var changes = mergeCustomisations(defaultExtendedIconCustomisations, customisations || {});
      // Get data
      return iconToSVG(iconData, changes);
  }
  /**
   * Scan DOM
   */
  function scan(root) {
      if (root) {
          scanElement(root);
      }
      else {
          scanDOM();
      }
  }
  /**
   * Initialise stuff
   */
  if (typeof document !== 'undefined' && typeof window !== 'undefined') {
      // Add document.body node
      addBodyNode();
      var _window$1 = window;
      // Load icons from global "IconifyPreload"
      if (_window$1.IconifyPreload !== void 0) {
          var preload = _window$1.IconifyPreload;
          var err$1 = 'Invalid IconifyPreload syntax.';
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
                          console.error(err$1);
                      }
                  }
                  catch (e) {
                      console.error(err$1);
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
   * Enable cache
   */
  function enableCache(storage, enable) {
      toggleBrowserCache(storage, enable !== false);
  }
  /**
   * Disable cache
   */
  function disableCache(storage) {
      toggleBrowserCache(storage, true);
  }
  /**
   * Initialise stuff
   */
  // Set API module
  setAPIModule('', fetchAPIModule);
  /**
   * Browser stuff
   */
  if (typeof document !== 'undefined' && typeof window !== 'undefined') {
      // Set cache and load existing cache
      cache.store = storeCache;
      loadCache();
      var _window = window;
      // Set API from global "IconifyProviders"
      if (_window.IconifyProviders !== void 0) {
          var providers = _window.IconifyProviders;
          if (typeof providers === 'object' && providers !== null) {
              for (var key in providers) {
                  var err = 'IconifyProviders[' + key + '] is invalid.';
                  try {
                      var value = providers[key];
                      if (typeof value !== 'object' ||
                          !value ||
                          value.resources === void 0) {
                          continue;
                      }
                      if (!addAPIProvider(key, value)) {
                          console.error(err);
                      }
                  }
                  catch (e) {
                      console.error(err);
                  }
              }
          }
      }
  }
  /**
   * Internal API
   */
  var _api = {
      getAPIConfig: getAPIConfig,
      setAPIModule: setAPIModule,
      sendAPIQuery: sendAPIQuery,
      setFetch: setFetch,
      getFetch: getFetch,
      listAPIProviders: listAPIProviders,
  };
  /**
   * Global variable
   */
  var Iconify = {
      // IconifyAPIInternalFunctions
      _api: _api,
      // IconifyAPIFunctions
      addAPIProvider: addAPIProvider,
      loadIcons: loadIcons,
      loadIcon: loadIcon,
      // IconifyStorageFunctions
      iconExists: iconExists,
      getIcon: getIcon,
      listIcons: listIcons,
      addIcon: addIcon,
      addCollection: addCollection,
      // IconifyBuilderFunctions
      replaceIDs: replaceIDs,
      calculateSize: calculateSize,
      buildIcon: buildIcon,
      // IconifyCommonFunctions
      getVersion: getVersion,
      renderSVG: renderSVG,
      renderHTML: renderHTML,
      renderIcon: renderIcon,
      scan: scan,
      observe: observe,
      stopObserving: stopObserving,
      pauseObserver: pauseObserver,
      resumeObserver: resumeObserver,
      // IconifyBrowserCacheFunctions
      enableCache: enableCache,
      disableCache: disableCache,
  };

  exports._api = _api;
  exports.addAPIProvider = addAPIProvider;
  exports.addCollection = addCollection;
  exports.addIcon = addIcon;
  exports.buildIcon = buildIcon;
  exports.calculateSize = calculateSize;
  exports["default"] = Iconify;
  exports.disableCache = disableCache;
  exports.enableCache = enableCache;
  exports.getIcon = getIcon;
  exports.getVersion = getVersion;
  exports.iconExists = iconExists;
  exports.listIcons = listIcons;
  exports.loadIcon = loadIcon;
  exports.loadIcons = loadIcons;
  exports.observe = observe;
  exports.pauseObserver = pauseObserver;
  exports.renderHTML = renderHTML;
  exports.renderIcon = renderIcon;
  exports.renderSVG = renderSVG;
  exports.replaceIDs = replaceIDs;
  exports.resumeObserver = resumeObserver;
  exports.scan = scan;
  exports.stopObserving = stopObserving;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

})({});

// Export as ES module
if (typeof exports === 'object') {
	try {
		exports.__esModule = true;
		exports.default = Iconify;
		for (var key in Iconify) {
			exports[key] = Iconify[key];
		}
	} catch (err) {
	}
}


// Export to window or web worker
try {
	if (self.Iconify === void 0) {
		self.Iconify = Iconify;
	}
} catch (err) {
}
