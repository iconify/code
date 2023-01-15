/**
* (c) Iconify
*
* For the full copyright and license information, please view the license.txt
* files at https://github.com/iconify/iconify
*
* Licensed under MIT.
*
* @license MIT
* @version 0.0.7
*/
(function () {
  'use strict';

  const defaultIconDimensions = Object.freeze({
    left: 0,
    top: 0,
    width: 16,
    height: 16
  });
  const defaultIconTransformations = Object.freeze({
    rotate: 0,
    vFlip: false,
    hFlip: false
  });
  const defaultIconProps = Object.freeze({
    ...defaultIconDimensions,
    ...defaultIconTransformations
  });
  const defaultExtendedIconProps = Object.freeze({
    ...defaultIconProps,
    body: "",
    hidden: false
  });

  const defaultIconSizeCustomisations = Object.freeze({
    width: null,
    height: null
  });
  const defaultIconCustomisations = Object.freeze({
    ...defaultIconSizeCustomisations,
    ...defaultIconTransformations
  });

  function rotateFromString(value, defaultValue = 0) {
    const units = value.replace(/^-?[0-9.]*/, "");
    function cleanup(value2) {
      while (value2 < 0) {
        value2 += 4;
      }
      return value2 % 4;
    }
    if (units === "") {
      const num = parseInt(value);
      return isNaN(num) ? 0 : cleanup(num);
    } else if (units !== value) {
      let split = 0;
      switch (units) {
        case "%":
          split = 25;
          break;
        case "deg":
          split = 90;
      }
      if (split) {
        let num = parseFloat(value.slice(0, value.length - units.length));
        if (isNaN(num)) {
          return 0;
        }
        num = num / split;
        return num % 1 === 0 ? cleanup(num) : 0;
      }
    }
    return defaultValue;
  }

  const separator = /[\s,]+/;
  function flipFromString(custom, flip) {
    flip.split(separator).forEach((str) => {
      const value = str.trim();
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

  const defaultCustomisations = {
      ...defaultIconCustomisations,
      preserveAspectRatio: '',
  };
  /**
   * Get customisations
   */
  function getCustomisations(node) {
      const customisations = {
          ...defaultCustomisations,
      };
      const attr = (key, def) => node.getAttribute(key) || def;
      // Dimensions
      customisations.width = attr('width', null);
      customisations.height = attr('height', null);
      // Rotation
      customisations.rotate = rotateFromString(attr('rotate', ''));
      // Flip
      flipFromString(customisations, attr('flip', ''));
      // SVG attributes
      customisations.preserveAspectRatio = attr('preserveAspectRatio', attr('preserveaspectratio', ''));
      return customisations;
  }
  /**
   * Check if customisations have been updated
   */
  function haveCustomisationsChanged(value1, value2) {
      for (const key in defaultCustomisations) {
          if (value1[key] !== value2[key]) {
              return true;
          }
      }
      return false;
  }

  const matchIconName = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  const stringToIcon = (value, validate, allowSimpleName, provider = "") => {
    const colonSeparated = value.split(":");
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
      const name2 = colonSeparated.pop();
      const prefix = colonSeparated.pop();
      const result = {
        provider: colonSeparated.length > 0 ? colonSeparated[0] : provider,
        prefix,
        name: name2
      };
      return validate && !validateIcon(result) ? null : result;
    }
    const name = colonSeparated[0];
    const dashSeparated = name.split("-");
    if (dashSeparated.length > 1) {
      const result = {
        provider,
        prefix: dashSeparated.shift(),
        name: dashSeparated.join("-")
      };
      return validate && !validateIcon(result) ? null : result;
    }
    if (allowSimpleName && provider === "") {
      const result = {
        provider,
        prefix: "",
        name
      };
      return validate && !validateIcon(result, allowSimpleName) ? null : result;
    }
    return null;
  };
  const validateIcon = (icon, allowSimpleName) => {
    if (!icon) {
      return false;
    }
    return !!((icon.provider === "" || icon.provider.match(matchIconName)) && (allowSimpleName && icon.prefix === "" || icon.prefix.match(matchIconName)) && icon.name.match(matchIconName));
  };

  function mergeIconTransformations(obj1, obj2) {
    const result = {};
    if (!obj1.hFlip !== !obj2.hFlip) {
      result.hFlip = true;
    }
    if (!obj1.vFlip !== !obj2.vFlip) {
      result.vFlip = true;
    }
    const rotate = ((obj1.rotate || 0) + (obj2.rotate || 0)) % 4;
    if (rotate) {
      result.rotate = rotate;
    }
    return result;
  }

  function mergeIconData(parent, child) {
    const result = mergeIconTransformations(parent, child);
    for (const key in defaultExtendedIconProps) {
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
    const icons = data.icons;
    const aliases = data.aliases || {};
    const resolved = /* @__PURE__ */ Object.create(null);
    function resolve(name) {
      if (icons[name]) {
        return resolved[name] = [];
      }
      if (resolved[name] === void 0) {
        resolved[name] = null;
        const parent = aliases[name] && aliases[name].parent;
        const value = parent && resolve(parent);
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
    const icons = data.icons;
    const aliases = data.aliases || {};
    let currentProps = {};
    function parse(name2) {
      currentProps = mergeIconData(icons[name2] || aliases[name2], currentProps);
    }
    parse(name);
    tree.forEach(parse);
    currentProps = mergeIconData(data, currentProps);
    return full ? Object.assign({}, defaultIconProps, currentProps) : currentProps;
  }

  function parseIconSet(data, callback) {
    const names = [];
    if (typeof data !== "object" || typeof data.icons !== "object") {
      return names;
    }
    if (data.not_found instanceof Array) {
      data.not_found.forEach((name) => {
        callback(name, null);
        names.push(name);
      });
    }
    const tree = getIconsTree(data);
    for (const name in tree) {
      const item = tree[name];
      if (item) {
        callback(name, internalGetIconData(data, name, item, true));
        names.push(name);
      }
    }
    return names;
  }

  const optionalPropertyDefaults = {
    provider: "",
    aliases: {},
    not_found: {},
    ...defaultIconDimensions
  };
  function checkOptionalProps(item, defaults) {
    for (const prop in defaults) {
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
    const data = obj;
    if (typeof data.prefix !== "string" || !obj.icons || typeof obj.icons !== "object") {
      return null;
    }
    if (!checkOptionalProps(obj, optionalPropertyDefaults)) {
      return null;
    }
    const icons = data.icons;
    for (const name in icons) {
      const icon = icons[name];
      if (!name.match(matchIconName) || typeof icon.body !== "string" || !checkOptionalProps(icon, defaultExtendedIconProps)) {
        return null;
      }
    }
    const aliases = data.aliases || {};
    for (const name in aliases) {
      const icon = aliases[name];
      const parent = icon.parent;
      if (!name.match(matchIconName) || typeof parent !== "string" || !icons[parent] && !aliases[parent] || !checkOptionalProps(icon, defaultExtendedIconProps)) {
        return null;
      }
    }
    return data;
  }

  const storage$1 = /* @__PURE__ */ Object.create(null);
  function newStorage(provider, prefix) {
    return {
      provider,
      prefix,
      icons: /* @__PURE__ */ Object.create(null),
      missing: /* @__PURE__ */ Object.create(null)
    };
  }
  function getStorage(provider, prefix) {
    if (storage$1[provider] === void 0) {
      storage$1[provider] = /* @__PURE__ */ Object.create(null);
    }
    const providerStorage = storage$1[provider];
    if (providerStorage[prefix] === void 0) {
      providerStorage[prefix] = newStorage(provider, prefix);
    }
    return providerStorage[prefix];
  }
  function addIconSet(storage2, data) {
    if (!quicklyValidateIconSet(data)) {
      return [];
    }
    const t = Date.now();
    return parseIconSet(data, (name, icon) => {
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
        storage2.icons[name] = Object.freeze({
          ...defaultIconProps,
          ...icon
        });
        return true;
      }
    } catch (err) {
    }
    return false;
  }
  function listIcons(provider, prefix) {
    let allIcons = [];
    let providers;
    if (typeof provider === "string") {
      providers = [provider];
    } else {
      providers = Object.keys(storage$1);
    }
    providers.forEach((provider2) => {
      let prefixes;
      if (typeof provider2 === "string" && typeof prefix === "string") {
        prefixes = [prefix];
      } else {
        prefixes = storage$1[provider2] === void 0 ? [] : Object.keys(storage$1[provider2]);
      }
      prefixes.forEach((prefix2) => {
        const storage2 = getStorage(provider2, prefix2);
        const icons = Object.keys(storage2.icons).map((name) => (provider2 !== "" ? "@" + provider2 + ":" : "") + prefix2 + ":" + name);
        allIcons = allIcons.concat(icons);
      });
    });
    return allIcons;
  }

  let simpleNames = false;
  function allowSimpleNames(allow) {
    if (typeof allow === "boolean") {
      simpleNames = allow;
    }
    return simpleNames;
  }
  function getIconData(name) {
    const icon = typeof name === "string" ? stringToIcon(name, true, simpleNames) : name;
    if (!icon) {
      return;
    }
    const storage = getStorage(icon.provider, icon.prefix);
    const iconName = icon.name;
    return storage.icons[iconName] || (storage.missing[iconName] ? null : void 0);
  }
  function addIcon(name, data) {
    const icon = stringToIcon(name, true, simpleNames);
    if (!icon) {
      return false;
    }
    const storage = getStorage(icon.provider, icon.prefix);
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
      let added = false;
      if (quicklyValidateIconSet(data)) {
        data.prefix = "";
        parseIconSet(data, (name, icon) => {
          if (icon && addIcon(name, icon)) {
            added = true;
          }
        });
      }
      return added;
    }
    if (typeof data.prefix !== "string" || !validateIcon({
      provider,
      prefix: data.prefix,
      name: "a"
    })) {
      return false;
    }
    const storage = getStorage(provider, data.prefix);
    return !!addIconSet(storage, data);
  }
  function iconExists(name) {
    return !!getIconData(name);
  }
  function getIcon(name) {
    const result = getIconData(name);
    return result ? { ...result } : null;
  }

  function sortIcons(icons) {
    const result = {
      loaded: [],
      missing: [],
      pending: []
    };
    const storage = /* @__PURE__ */ Object.create(null);
    icons.sort((a, b) => {
      if (a.provider !== b.provider) {
        return a.provider.localeCompare(b.provider);
      }
      if (a.prefix !== b.prefix) {
        return a.prefix.localeCompare(b.prefix);
      }
      return a.name.localeCompare(b.name);
    });
    let lastIcon = {
      provider: "",
      prefix: "",
      name: ""
    };
    icons.forEach((icon) => {
      if (lastIcon.name === icon.name && lastIcon.prefix === icon.prefix && lastIcon.provider === icon.provider) {
        return;
      }
      lastIcon = icon;
      const provider = icon.provider;
      const prefix = icon.prefix;
      const name = icon.name;
      if (storage[provider] === void 0) {
        storage[provider] = /* @__PURE__ */ Object.create(null);
      }
      const providerStorage = storage[provider];
      if (providerStorage[prefix] === void 0) {
        providerStorage[prefix] = getStorage(provider, prefix);
      }
      const localStorage = providerStorage[prefix];
      let list;
      if (localStorage.icons[name] !== void 0) {
        list = result.loaded;
      } else if (prefix === "" || localStorage.missing[name] !== void 0) {
        list = result.missing;
      } else {
        list = result.pending;
      }
      const item = {
        provider,
        prefix,
        name
      };
      list.push(item);
    });
    return result;
  }

  const callbacks = /* @__PURE__ */ Object.create(null);
  const pendingUpdates = /* @__PURE__ */ Object.create(null);
  function removeCallback(sources, id) {
    sources.forEach((source) => {
      const provider = source.provider;
      if (callbacks[provider] === void 0) {
        return;
      }
      const providerCallbacks = callbacks[provider];
      const prefix = source.prefix;
      const items = providerCallbacks[prefix];
      if (items) {
        providerCallbacks[prefix] = items.filter((row) => row.id !== id);
      }
    });
  }
  function updateCallbacks(provider, prefix) {
    if (pendingUpdates[provider] === void 0) {
      pendingUpdates[provider] = /* @__PURE__ */ Object.create(null);
    }
    const providerPendingUpdates = pendingUpdates[provider];
    if (!providerPendingUpdates[prefix]) {
      providerPendingUpdates[prefix] = true;
      setTimeout(() => {
        providerPendingUpdates[prefix] = false;
        if (callbacks[provider] === void 0 || callbacks[provider][prefix] === void 0) {
          return;
        }
        const items = callbacks[provider][prefix].slice(0);
        if (!items.length) {
          return;
        }
        const storage = getStorage(provider, prefix);
        let hasPending = false;
        items.forEach((item) => {
          const icons = item.icons;
          const oldLength = icons.pending.length;
          icons.pending = icons.pending.filter((icon) => {
            if (icon.prefix !== prefix) {
              return true;
            }
            const name = icon.name;
            if (storage.icons[name] !== void 0) {
              icons.loaded.push({
                provider,
                prefix,
                name
              });
            } else if (storage.missing[name] !== void 0) {
              icons.missing.push({
                provider,
                prefix,
                name
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
                  provider,
                  prefix
                }
              ], item.id);
            }
            item.callback(icons.loaded.slice(0), icons.missing.slice(0), icons.pending.slice(0), item.abort);
          }
        });
      });
    }
  }
  let idCounter = 0;
  function storeCallback(callback, icons, pendingSources) {
    const id = idCounter++;
    const abort = removeCallback.bind(null, pendingSources, id);
    if (!icons.pending.length) {
      return abort;
    }
    const item = {
      id,
      icons,
      callback,
      abort
    };
    pendingSources.forEach((source) => {
      const provider = source.provider;
      const prefix = source.prefix;
      if (callbacks[provider] === void 0) {
        callbacks[provider] = /* @__PURE__ */ Object.create(null);
      }
      const providerCallbacks = callbacks[provider];
      if (providerCallbacks[prefix] === void 0) {
        providerCallbacks[prefix] = [];
      }
      providerCallbacks[prefix].push(item);
    });
    return abort;
  }

  const storage = /* @__PURE__ */ Object.create(null);
  function setAPIModule(provider, item) {
    storage[provider] = item;
  }
  function getAPIModule(provider) {
    return storage[provider] || storage[""];
  }

  function listToIcons(list, validate = true, simpleNames = false) {
    const result = [];
    list.forEach((item) => {
      const icon = typeof item === "string" ? stringToIcon(item, false, simpleNames) : item;
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
    const resourcesCount = config.resources.length;
    const startIndex = config.random ? Math.floor(Math.random() * resourcesCount) : config.index;
    let resources;
    if (config.random) {
      let list = config.resources.slice(0);
      resources = [];
      while (list.length > 1) {
        const nextIndex = Math.floor(Math.random() * list.length);
        resources.push(list[nextIndex]);
        list = list.slice(0, nextIndex).concat(list.slice(nextIndex + 1));
      }
      resources = resources.concat(list);
    } else {
      resources = config.resources.slice(startIndex).concat(config.resources.slice(0, startIndex));
    }
    const startTime = Date.now();
    let status = "pending";
    let queriesSent = 0;
    let lastError;
    let timer = null;
    let queue = [];
    let doneCallbacks = [];
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
      queue.forEach((item) => {
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
        startTime,
        payload,
        status,
        queriesSent,
        queriesPending: queue.length,
        subscribe,
        abort
      };
    }
    function failQuery() {
      status = "failed";
      doneCallbacks.forEach((callback) => {
        callback(void 0, lastError);
      });
    }
    function clearQueue() {
      queue.forEach((item) => {
        if (item.status === "pending") {
          item.status = "aborted";
        }
      });
      queue = [];
    }
    function moduleResponse(item, response, data) {
      const isError = response !== "success";
      queue = queue.filter((queued) => queued !== item);
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
        const index = config.resources.indexOf(item.resource);
        if (index !== -1 && index !== config.index) {
          config.index = index;
        }
      }
      status = "completed";
      doneCallbacks.forEach((callback) => {
        callback(data);
      });
    }
    function execNext() {
      if (status !== "pending") {
        return;
      }
      resetTimer();
      const resource = resources.shift();
      if (resource === void 0) {
        if (queue.length) {
          timer = setTimeout(() => {
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
      const item = {
        status: "pending",
        resource,
        callback: (status2, data) => {
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
    const newConfig = /* @__PURE__ */ Object.create(null);
    let key;
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
    const config = setConfig(cfg);
    let queries = [];
    function cleanup() {
      queries = queries.filter((item) => item().status === "pending");
    }
    function query(payload, queryCallback, doneCallback) {
      const query2 = sendQuery(config, payload, queryCallback, (data, error) => {
        cleanup();
        if (doneCallback) {
          doneCallback(data, error);
        }
      });
      queries.push(query2);
      return query2;
    }
    function find(callback) {
      const result = queries.find((value) => {
        return callback(value);
      });
      return result !== void 0 ? result : null;
    }
    const instance = {
      query,
      find,
      setIndex: (index) => {
        config.index = index;
      },
      getIndex: () => config.index,
      cleanup
    };
    return instance;
  }

  function createAPIConfig(source) {
    let resources;
    if (typeof source.resources === "string") {
      resources = [source.resources];
    } else {
      resources = source.resources;
      if (!(resources instanceof Array) || !resources.length) {
        return null;
      }
    }
    const result = {
      resources,
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
  const configStorage = /* @__PURE__ */ Object.create(null);
  const fallBackAPISources = [
    "https://api.simplesvg.com",
    "https://api.unisvg.com"
  ];
  const fallBackAPI = [];
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
    const config = createAPIConfig(customConfig);
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

  function emptyCallback$1() {
  }
  const redundancyCache = /* @__PURE__ */ Object.create(null);
  function getRedundancyCache(provider) {
    if (redundancyCache[provider] === void 0) {
      const config = getAPIConfig(provider);
      if (!config) {
        return;
      }
      const redundancy = initRedundancy(config);
      const cachedReundancy = {
        config,
        redundancy
      };
      redundancyCache[provider] = cachedReundancy;
    }
    return redundancyCache[provider];
  }
  function sendAPIQuery(target, query, callback) {
    let redundancy;
    let send;
    if (typeof target === "string") {
      const api = getAPIModule(target);
      if (!api) {
        callback(void 0, 424);
        return emptyCallback$1;
      }
      send = api.send;
      const cached = getRedundancyCache(target);
      if (cached) {
        redundancy = cached.redundancy;
      }
    } else {
      const config = createAPIConfig(target);
      if (config) {
        redundancy = initRedundancy(config);
        const moduleKey = target.resources ? target.resources[0] : "";
        const api = getAPIModule(moduleKey);
        if (api) {
          send = api.send;
        }
      }
    }
    if (!redundancy || !send) {
      callback(void 0, 424);
      return emptyCallback$1;
    }
    return redundancy.query(query, send, callback)().abort;
  }

  const cache = {};

  function emptyCallback() {
  }
  const pendingIcons = /* @__PURE__ */ Object.create(null);
  const iconsToLoad = /* @__PURE__ */ Object.create(null);
  const loaderFlags = /* @__PURE__ */ Object.create(null);
  const queueFlags = /* @__PURE__ */ Object.create(null);
  function loadedNewIcons(provider, prefix) {
    if (loaderFlags[provider] === void 0) {
      loaderFlags[provider] = /* @__PURE__ */ Object.create(null);
    }
    const providerLoaderFlags = loaderFlags[provider];
    if (!providerLoaderFlags[prefix]) {
      providerLoaderFlags[prefix] = true;
      setTimeout(() => {
        providerLoaderFlags[prefix] = false;
        updateCallbacks(provider, prefix);
      });
    }
  }
  const errorsCache = /* @__PURE__ */ Object.create(null);
  function loadNewIcons(provider, prefix, icons) {
    function err() {
      const key = (provider === "" ? "" : "@" + provider + ":") + prefix;
      const time = Math.floor(Date.now() / 6e4);
      if (errorsCache[key] < time) {
        errorsCache[key] = time;
        console.error('Unable to retrieve icons for "' + key + '" because API is not configured properly.');
      }
    }
    if (iconsToLoad[provider] === void 0) {
      iconsToLoad[provider] = /* @__PURE__ */ Object.create(null);
    }
    const providerIconsToLoad = iconsToLoad[provider];
    if (queueFlags[provider] === void 0) {
      queueFlags[provider] = /* @__PURE__ */ Object.create(null);
    }
    const providerQueueFlags = queueFlags[provider];
    if (pendingIcons[provider] === void 0) {
      pendingIcons[provider] = /* @__PURE__ */ Object.create(null);
    }
    const providerPendingIcons = pendingIcons[provider];
    if (providerIconsToLoad[prefix] === void 0) {
      providerIconsToLoad[prefix] = icons;
    } else {
      providerIconsToLoad[prefix] = providerIconsToLoad[prefix].concat(icons).sort();
    }
    if (!providerQueueFlags[prefix]) {
      providerQueueFlags[prefix] = true;
      setTimeout(() => {
        providerQueueFlags[prefix] = false;
        const icons2 = providerIconsToLoad[prefix];
        delete providerIconsToLoad[prefix];
        const api = getAPIModule(provider);
        if (!api) {
          err();
          return;
        }
        const params = api.prepare(provider, prefix, icons2);
        params.forEach((item) => {
          sendAPIQuery(provider, item, (data, error) => {
            const storage = getStorage(provider, prefix);
            if (typeof data !== "object") {
              if (error !== 404) {
                return;
              }
              const t = Date.now();
              item.icons.forEach((name) => {
                storage.missing[name] = t;
              });
            } else {
              try {
                const parsed = addIconSet(storage, data);
                if (!parsed.length) {
                  return;
                }
                const pending = providerPendingIcons[prefix];
                parsed.forEach((name) => {
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
  const loadIcons = (icons, callback) => {
    const cleanedIcons = listToIcons(icons, true, allowSimpleNames());
    const sortedIcons = sortIcons(cleanedIcons);
    if (!sortedIcons.pending.length) {
      let callCallback = true;
      if (callback) {
        setTimeout(() => {
          if (callCallback) {
            callback(sortedIcons.loaded, sortedIcons.missing, sortedIcons.pending, emptyCallback);
          }
        });
      }
      return () => {
        callCallback = false;
      };
    }
    const newIcons = /* @__PURE__ */ Object.create(null);
    const sources = [];
    let lastProvider, lastPrefix;
    sortedIcons.pending.forEach((icon) => {
      const provider = icon.provider;
      const prefix = icon.prefix;
      if (prefix === lastPrefix && provider === lastProvider) {
        return;
      }
      lastProvider = provider;
      lastPrefix = prefix;
      sources.push({
        provider,
        prefix
      });
      if (pendingIcons[provider] === void 0) {
        pendingIcons[provider] = /* @__PURE__ */ Object.create(null);
      }
      const providerPendingIcons = pendingIcons[provider];
      if (providerPendingIcons[prefix] === void 0) {
        providerPendingIcons[prefix] = /* @__PURE__ */ Object.create(null);
      }
      if (newIcons[provider] === void 0) {
        newIcons[provider] = /* @__PURE__ */ Object.create(null);
      }
      const providerNewIcons = newIcons[provider];
      if (providerNewIcons[prefix] === void 0) {
        providerNewIcons[prefix] = [];
      }
    });
    const time = Date.now();
    sortedIcons.pending.forEach((icon) => {
      const provider = icon.provider;
      const prefix = icon.prefix;
      const name = icon.name;
      const pendingQueue = pendingIcons[provider][prefix];
      if (pendingQueue[name] === void 0) {
        pendingQueue[name] = time;
        newIcons[provider][prefix].push(name);
      }
    });
    sources.forEach((source) => {
      const provider = source.provider;
      const prefix = source.prefix;
      if (newIcons[provider][prefix].length) {
        loadNewIcons(provider, prefix, newIcons[provider][prefix]);
      }
    });
    return callback ? storeCallback(callback, sortedIcons, sources) : emptyCallback;
  };
  const loadIcon = (icon) => {
    return new Promise((fulfill, reject) => {
      const iconObj = typeof icon === "string" ? stringToIcon(icon) : icon;
      loadIcons([iconObj || icon], (loaded) => {
        if (loaded.length && iconObj) {
          const data = getIconData(iconObj);
          if (data) {
            fulfill({
              ...data
            });
            return;
          }
        }
        reject(icon);
      });
    });
  };

  /**
   * Test icon string
   */
  function testIconObject(value) {
      try {
          const obj = typeof value === 'string' ? JSON.parse(value) : value;
          if (typeof obj.body === 'string') {
              return {
                  ...defaultIconProps,
                  ...obj,
              };
          }
      }
      catch (err) {
          //
      }
  }

  /**
   * Parse icon value, load if needed
   */
  function parseIconValue(value, onload) {
      // Check if icon name is valid
      const name = typeof value === 'string' ? stringToIcon(value, true, true) : null;
      if (!name) {
          // Test for serialised object
          const data = testIconObject(value);
          return {
              value,
              data,
          };
      }
      // Valid icon name: check if data is available
      const data = getIconData(name);
      // Icon data exists or icon has no prefix. Do not load icon from API if icon has no prefix
      if (data !== void 0 || !name.prefix) {
          return {
              value,
              name,
              data, // could be 'null' -> icon is missing
          };
      }
      // Load icon
      const loading = loadIcons([name], () => onload(value, name, getIconData(name)));
      return {
          value,
          name,
          loading,
      };
  }

  /**
   * Check for inline
   */
  function getInline(node) {
      return node.hasAttribute('inline');
  }

  // Check for Safari
  let isBuggedSafari = false;
  try {
      isBuggedSafari = navigator.vendor.indexOf('Apple') === 0;
  }
  catch (err) {
      //
  }
  /**
   * Get render mode
   */
  function getRenderMode(body, mode) {
      switch (mode) {
          // Force mode
          case 'svg':
          case 'bg':
          case 'mask':
              return mode;
      }
      // Check for animation, use 'style' for animated icons, unless browser is Safari
      // (only <a>, which should be ignored or animations start with '<a')
      if (mode !== 'style' &&
          (isBuggedSafari || body.indexOf('<a') === -1)) {
          // Render <svg>
          return 'svg';
      }
      // Use background or mask
      return body.indexOf('currentColor') === -1 ? 'bg' : 'mask';
  }

  function mergeCustomisations(defaults, item) {
    const result = {
      ...defaults
    };
    for (const key in item) {
      const value = item[key];
      const valueType = typeof value;
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

  const unitsSplit = /(-?[0-9.]*[0-9]+[0-9.]*)/g;
  const unitsTest = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
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
    const oldParts = size.split(unitsSplit);
    if (oldParts === null || !oldParts.length) {
      return size;
    }
    const newParts = [];
    let code = oldParts.shift();
    let isNumber = unitsTest.test(code);
    while (true) {
      if (isNumber) {
        const num = parseFloat(code);
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
    const box = {
      left: icon.left,
      top: icon.top,
      width: icon.width,
      height: icon.height
    };
    let body = icon.body;
    [icon, customisations].forEach((props) => {
      const transformations = [];
      const hFlip = props.hFlip;
      const vFlip = props.vFlip;
      let rotation = props.rotate;
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
      let tempValue;
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
    const customisationsWidth = customisations.width;
    const customisationsHeight = customisations.height;
    const boxWidth = box.width;
    const boxHeight = box.height;
    let width;
    let height;
    if (customisationsWidth === null) {
      height = customisationsHeight === null ? "1em" : customisationsHeight === "auto" ? boxHeight : customisationsHeight;
      width = calculateSize(height, boxWidth / boxHeight);
    } else {
      width = customisationsWidth === "auto" ? boxWidth : customisationsWidth;
      height = customisationsHeight === null ? calculateSize(width, boxHeight / boxWidth) : customisationsHeight === "auto" ? boxHeight : customisationsHeight;
    }
    const result = {
      attributes: {
        width: width.toString(),
        height: height.toString(),
        viewBox: box.left.toString() + " " + box.top.toString() + " " + boxWidth.toString() + " " + boxHeight.toString()
      },
      body
    };
    return result;
  }

  function buildIcon(icon, customisations) {
    return iconToSVG({ ...defaultIconProps, ...icon }, mergeCustomisations(defaultIconCustomisations, customisations || {}));
  }

  const maxLengthCache = {};
  const pathCache = {};
  const detectFetch = () => {
    let callback;
    try {
      callback = fetch;
      if (typeof callback === "function") {
        return callback;
      }
    } catch (err) {
    }
    return null;
  };
  let fetchModule = detectFetch();
  function setFetch(fetch2) {
    fetchModule = fetch2;
  }
  function getFetch() {
    return fetchModule;
  }
  function calculateMaxLength(provider, prefix) {
    const config = getAPIConfig(provider);
    if (!config) {
      return 0;
    }
    let result;
    if (!config.maxURL) {
      result = 0;
    } else {
      let maxHostLength = 0;
      config.resources.forEach((item) => {
        const host = item;
        maxHostLength = Math.max(maxHostLength, host.length);
      });
      const url = prefix + ".json?icons=";
      result = config.maxURL - maxHostLength - config.path.length - url.length;
    }
    const cacheKey = provider + ":" + prefix;
    pathCache[provider] = config.path;
    maxLengthCache[cacheKey] = result;
    return result;
  }
  function shouldAbort(status) {
    return status === 404;
  }
  const prepare = (provider, prefix, icons) => {
    const results = [];
    let maxLength = maxLengthCache[prefix];
    if (maxLength === void 0) {
      maxLength = calculateMaxLength(provider, prefix);
    }
    const type = "icons";
    let item = {
      type,
      provider,
      prefix,
      icons: []
    };
    let length = 0;
    icons.forEach((name, index) => {
      length += name.length + 1;
      if (length >= maxLength && index > 0) {
        results.push(item);
        item = {
          type,
          provider,
          prefix,
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
        const config = getAPIConfig(provider);
        if (!config) {
          return "/";
        }
        pathCache[provider] = config.path;
      }
      return pathCache[provider];
    }
    return "/";
  }
  const send = (host, params, callback) => {
    if (!fetchModule) {
      callback("abort", 424);
      return;
    }
    let path = getPath(params.provider);
    switch (params.type) {
      case "icons": {
        const prefix = params.prefix;
        const icons = params.icons;
        const iconsList = icons.join(",");
        const urlParams = new URLSearchParams({
          icons: iconsList
        });
        path += prefix + ".json?" + urlParams.toString();
        break;
      }
      case "custom": {
        const uri = params.uri;
        path += uri.slice(0, 1) === "/" ? uri.slice(1) : uri;
        break;
      }
      default:
        callback("abort", 400);
        return;
    }
    let defaultError = 503;
    fetchModule(host + path).then((response) => {
      const status = response.status;
      if (status !== 200) {
        setTimeout(() => {
          callback(shouldAbort(status) ? "abort" : "next", status);
        });
        return;
      }
      defaultError = 501;
      return response.json();
    }).then((data) => {
      if (typeof data !== "object" || data === null) {
        setTimeout(() => {
          callback("next", defaultError);
        });
        return;
      }
      setTimeout(() => {
        callback("success", data);
      });
    }).catch(() => {
      callback("next", defaultError);
    });
  };
  const fetchAPIModule = {
    prepare,
    send
  };

  const cacheVersion = "iconify2";
  const cachePrefix = "iconify";
  const countKey = cachePrefix + "-count";
  const versionKey = cachePrefix + "-version";
  const hour = 36e5;
  const cacheExpiration = 168;
  const config = {
    local: true,
    session: true
  };
  let loaded = false;
  const count = {
    local: 0,
    session: 0
  };
  const emptyList = {
    local: [],
    session: []
  };
  let _window = typeof window === "undefined" ? {} : window;
  function getGlobal(key) {
    const attr = key + "Storage";
    try {
      if (_window && _window[attr] && typeof _window[attr].length === "number") {
        return _window[attr];
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
    const count2 = storage.getItem(countKey);
    if (count2) {
      const total = parseInt(count2);
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
      const total = getCount(storage);
      for (let i = 0; i < total; i++) {
        storage.removeItem(cachePrefix + i.toString());
      }
    } catch (err) {
    }
  }
  const loadCache = () => {
    if (loaded) {
      return;
    }
    loaded = true;
    const minTime = Math.floor(Date.now() / hour) - cacheExpiration;
    function load(key) {
      const func = getGlobal(key);
      if (!func) {
        return;
      }
      const getItem = (index) => {
        const name = cachePrefix + index.toString();
        const item = func.getItem(name);
        if (typeof item !== "string") {
          return false;
        }
        let valid = true;
        try {
          const data = JSON.parse(item);
          if (typeof data !== "object" || typeof data.cached !== "number" || data.cached < minTime || typeof data.provider !== "string" || typeof data.data !== "object" || typeof data.data.prefix !== "string") {
            valid = false;
          } else {
            const provider = data.provider;
            const prefix = data.data.prefix;
            const storage = getStorage(provider, prefix);
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
        const version = func.getItem(versionKey);
        if (version !== cacheVersion) {
          if (version) {
            destroyCache(func);
          }
          initCache(func, key);
          return;
        }
        let total = getCount(func);
        for (let i = total - 1; i >= 0; i--) {
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
    for (const key in config) {
      load(key);
    }
  };
  const storeCache = (provider, data) => {
    if (!loaded) {
      loadCache();
    }
    function store(key) {
      if (!config[key]) {
        return false;
      }
      const func = getGlobal(key);
      if (!func) {
        return false;
      }
      let index = emptyList[key].shift();
      if (index === void 0) {
        index = count[key];
        if (!setCount(func, key, index + 1)) {
          return false;
        }
      }
      try {
        const item = {
          cached: Math.floor(Date.now() / hour),
          provider,
          data
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

  function toggleBrowserCache(storage, value) {
    switch (storage) {
      case "local":
      case "session":
        config[storage] = value;
        break;
      case "all":
        for (const key in config) {
          config[key] = value;
        }
        break;
    }
  }

  // Core
  /**
   * Get functions and initialise stuff
   */
  function exportFunctions() {
      /**
       * Initialise stuff
       */
      // Set API module
      setAPIModule('', fetchAPIModule);
      // Allow simple icon names
      allowSimpleNames(true);
      let _window;
      try {
          _window = window;
      }
      catch (err) {
          //
      }
      if (_window) {
          // Set cache and load existing cache
          cache.store = storeCache;
          loadCache();
          // Load icons from global "IconifyPreload"
          if (_window.IconifyPreload !== void 0) {
              const preload = _window.IconifyPreload;
              const err = 'Invalid IconifyPreload syntax.';
              if (typeof preload === 'object' && preload !== null) {
                  (preload instanceof Array ? preload : [preload]).forEach((item) => {
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
          // Set API from global "IconifyProviders"
          if (_window.IconifyProviders !== void 0) {
              const providers = _window.IconifyProviders;
              if (typeof providers === 'object' && providers !== null) {
                  for (const key in providers) {
                      const err = 'IconifyProviders[' + key + '] is invalid.';
                      try {
                          const value = providers[key];
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
      const _api = {
          getAPIConfig,
          setAPIModule,
          sendAPIQuery,
          setFetch,
          getFetch,
          listAPIProviders,
      };
      return {
          enableCache: (storage) => toggleBrowserCache(storage, true),
          disableCache: (storage) => toggleBrowserCache(storage, false),
          iconExists,
          getIcon,
          listIcons,
          addIcon,
          addCollection,
          calculateSize,
          buildIcon,
          loadIcons,
          loadIcon,
          addAPIProvider,
          _api,
      };
  }

  function iconToHTML(body, attributes) {
    let renderAttribsHTML = body.indexOf("xlink:") === -1 ? "" : ' xmlns:xlink="http://www.w3.org/1999/xlink"';
    for (const attr in attributes) {
      renderAttribsHTML += " " + attr + '="' + attributes[attr] + '"';
    }
    return '<svg xmlns="http://www.w3.org/2000/svg"' + renderAttribsHTML + ">" + body + "</svg>";
  }

  function encodeSVGforURL(svg) {
    return svg.replace(/"/g, "'").replace(/%/g, "%25").replace(/#/g, "%23").replace(/</g, "%3C").replace(/>/g, "%3E").replace(/\s+/g, " ");
  }
  function svgToURL(svg) {
    return 'url("data:image/svg+xml,' + encodeSVGforURL(svg) + '")';
  }

  // List of properties to apply
  const monotoneProps = {
      'background-color': 'currentColor',
  };
  const coloredProps = {
      'background-color': 'transparent',
  };
  // Dynamically add common props to variables above
  const propsToAdd = {
      image: 'var(--svg)',
      repeat: 'no-repeat',
      size: '100% 100%',
  };
  const propsToAddTo = {
      '-webkit-mask': monotoneProps,
      'mask': monotoneProps,
      'background': coloredProps,
  };
  for (const prefix in propsToAddTo) {
      const list = propsToAddTo[prefix];
      for (const prop in propsToAdd) {
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
   * Render node as <span>
   */
  function renderSPAN(data, icon, useMask) {
      const node = document.createElement('span');
      // Body
      let body = data.body;
      if (body.indexOf('<a') !== -1) {
          // Animated SVG: add something to fix timing bug
          body += '<!-- ' + Date.now() + ' -->';
      }
      // Generate SVG as URL
      const renderAttribs = data.attributes;
      const html = iconToHTML(body, {
          ...renderAttribs,
          width: icon.width + '',
          height: icon.height + '',
      });
      const url = svgToURL(html);
      // Generate style
      const svgStyle = node.style;
      const styles = {
          '--svg': url,
          'width': fixSize(renderAttribs.width),
          'height': fixSize(renderAttribs.height),
          ...(useMask ? monotoneProps : coloredProps),
      };
      // Apply style
      for (const prop in styles) {
          svgStyle.setProperty(prop, styles[prop]);
      }
      return node;
  }

  /**
   * Render node as <svg>
   */
  function renderSVG(data) {
      const node = document.createElement('span');
      // Generate SVG
      node.innerHTML = iconToHTML(data.body, data.attributes);
      return node.firstChild;
  }

  /**
   * Render icon
   */
  function renderIcon(parent, state) {
      const iconData = state.icon.data;
      const customisations = state.customisations;
      // Render icon
      const renderData = iconToSVG(iconData, customisations);
      if (customisations.preserveAspectRatio) {
          renderData.attributes['preserveAspectRatio'] =
              customisations.preserveAspectRatio;
      }
      const mode = state.renderedMode;
      let node;
      switch (mode) {
          case 'svg':
              node = renderSVG(renderData);
              break;
          default:
              node = renderSPAN(renderData, iconData, mode === 'mask');
      }
      // Set element
      // Assumes first node is a style node created with updateStyle()
      if (parent.childNodes.length > 1) {
          const lastChild = parent.lastChild;
          if (node.tagName === 'SPAN' && lastChild.tagName === node.tagName) {
              // Swap style instead of whole node
              lastChild.setAttribute('style', node.getAttribute('style'));
          }
          else {
              parent.replaceChild(node, lastChild);
          }
      }
      else {
          parent.appendChild(node);
      }
  }

  /**
   * Add/update style node
   */
  function updateStyle(parent, inline) {
      // Get node, create if needed
      let style = parent.firstChild;
      if (!style) {
          style = document.createElement('style');
          parent.appendChild(style);
      }
      // Update content
      style.textContent =
          ':host{display:inline-block;vertical-align:' +
              (inline ? '-0.125em' : '0') +
              '}span,svg{display:block}';
  }

  /**
   * Set state to PendingState
   */
  function setPendingState(icon, inline, lastState) {
      const lastRender = lastState &&
          (lastState.rendered
              ? lastState
              : lastState.lastRender);
      return {
          rendered: false,
          inline,
          icon,
          lastRender,
      };
  }

  /**
   * Register 'iconify-icon' component, if it does not exist
   */
  function defineIconifyIcon(name = 'iconify-icon') {
      // Check for custom elements registry and HTMLElement
      let customElements;
      let ParentClass;
      try {
          customElements = window.customElements;
          ParentClass = window.HTMLElement;
      }
      catch (err) {
          return;
      }
      // Make sure registry and HTMLElement exist
      if (!customElements || !ParentClass) {
          return;
      }
      // Check for duplicate
      const ConflictingClass = customElements.get(name);
      if (ConflictingClass) {
          return ConflictingClass;
      }
      // All attributes
      const attributes = [
          // Icon
          'icon',
          // Mode
          'mode',
          'inline',
          // Customisations
          'width',
          'height',
          'rotate',
          'flip',
      ];
      /**
       * Component class
       */
      const IconifyIcon = class extends ParentClass {
          // Root
          _shadowRoot;
          // State
          _state;
          // Attributes check queued
          _checkQueued = false;
          /**
           * Constructor
           */
          constructor() {
              super();
              // Attach shadow DOM
              const root = (this._shadowRoot = this.attachShadow({
                  mode: 'closed',
              }));
              // Add style
              const inline = getInline(this);
              updateStyle(root, inline);
              // Create empty state
              this._state = setPendingState({
                  value: '',
              }, inline);
              // Queue icon render
              this._queueCheck();
          }
          /**
           * Observed attributes
           */
          static get observedAttributes() {
              return attributes.slice(0);
          }
          /**
           * Observed properties that are different from attributes
           *
           * Experimental! Need to test with various frameworks that support it
           */
          /*
          static get properties() {
              return {
                  inline: {
                      type: Boolean,
                      reflect: true,
                  },
                  // Not listing other attributes because they are strings or combination
                  // of string and another type. Cannot have multiple types
              };
          }
          */
          /**
           * Attribute has changed
           */
          attributeChangedCallback(name) {
              if (name === 'inline') {
                  // Update immediately: not affected by other attributes
                  const newInline = getInline(this);
                  const state = this._state;
                  if (newInline !== state.inline) {
                      // Update style if inline mode changed
                      state.inline = newInline;
                      updateStyle(this._shadowRoot, newInline);
                  }
              }
              else {
                  // Queue check for other attributes
                  this._queueCheck();
              }
          }
          /**
           * Get/set icon
           */
          get icon() {
              const value = this.getAttribute('icon');
              if (value && value.slice(0, 1) === '{') {
                  try {
                      return JSON.parse(value);
                  }
                  catch (err) {
                      //
                  }
              }
              return value;
          }
          set icon(value) {
              if (typeof value === 'object') {
                  value = JSON.stringify(value);
              }
              this.setAttribute('icon', value);
          }
          /**
           * Get/set inline
           */
          get inline() {
              return getInline(this);
          }
          set inline(value) {
              this.setAttribute('inline', value ? 'true' : null);
          }
          /**
           * Restart animation
           */
          restartAnimation() {
              const state = this._state;
              if (state.rendered) {
                  const root = this._shadowRoot;
                  if (state.renderedMode === 'svg') {
                      // Update root node
                      try {
                          root.lastChild.setCurrentTime(0);
                          return;
                      }
                      catch (err) {
                          // Failed: setCurrentTime() is not supported
                      }
                  }
                  renderIcon(root, state);
              }
          }
          /**
           * Get status
           */
          get status() {
              const state = this._state;
              return state.rendered
                  ? 'rendered'
                  : state.icon.data === null
                      ? 'failed'
                      : 'loading';
          }
          /**
           * Queue attributes re-check
           */
          _queueCheck() {
              if (!this._checkQueued) {
                  this._checkQueued = true;
                  setTimeout(() => {
                      this._check();
                  });
              }
          }
          /**
           * Check for changes
           */
          _check() {
              if (!this._checkQueued) {
                  return;
              }
              this._checkQueued = false;
              const state = this._state;
              // Get icon
              const newIcon = this.getAttribute('icon');
              if (newIcon !== state.icon.value) {
                  this._iconChanged(newIcon);
                  return;
              }
              // Ignore other attributes if icon is not rendered
              if (!state.rendered) {
                  return;
              }
              // Check for mode and attribute changes
              const mode = this.getAttribute('mode');
              const customisations = getCustomisations(this);
              if (state.attrMode !== mode ||
                  haveCustomisationsChanged(state.customisations, customisations)) {
                  this._renderIcon(state.icon, customisations, mode);
              }
          }
          /**
           * Icon value has changed
           */
          _iconChanged(newValue) {
              const icon = parseIconValue(newValue, (value, name, data) => {
                  // Asynchronous callback: re-check values to make sure stuff wasn't changed
                  const state = this._state;
                  if (state.rendered || this.getAttribute('icon') !== value) {
                      // Icon data is already available or icon attribute was changed
                      return;
                  }
                  // Change icon
                  const icon = {
                      value,
                      name,
                      data,
                  };
                  if (icon.data) {
                      // Render icon
                      this._gotIconData(icon);
                  }
                  else {
                      // Nothing to render: update icon in state
                      state.icon = icon;
                  }
              });
              if (icon.data) {
                  // Icon is ready to render
                  this._gotIconData(icon);
              }
              else {
                  // Pending icon
                  this._state = setPendingState(icon, this._state.inline, this._state);
              }
          }
          /**
           * Got new icon data, icon is ready to (re)render
           */
          _gotIconData(icon) {
              this._checkQueued = false;
              this._renderIcon(icon, getCustomisations(this), this.getAttribute('mode'));
          }
          /**
           * Re-render based on icon data
           */
          _renderIcon(icon, customisations, attrMode) {
              // Get mode
              const renderedMode = getRenderMode(icon.data.body, attrMode);
              // Inline was not changed
              const inline = this._state.inline;
              // Set state and render
              renderIcon(this._shadowRoot, (this._state = {
                  rendered: true,
                  icon,
                  inline,
                  customisations,
                  attrMode,
                  renderedMode,
              }));
          }
      };
      // Add getters and setters
      attributes.forEach((attr) => {
          if (!Object.hasOwn(IconifyIcon.prototype, attr)) {
              Object.defineProperty(IconifyIcon.prototype, attr, {
                  get: function () {
                      return this.getAttribute(attr);
                  },
                  set: function (value) {
                      this.setAttribute(attr, value);
                  },
              });
          }
      });
      // Add exported functions: both as static and instance methods
      const functions = exportFunctions();
      for (const key in functions) {
          IconifyIcon[key] = IconifyIcon.prototype[key] = functions[key];
      }
      // Define new component
      customElements.define(name, IconifyIcon);
      return IconifyIcon;
  }

  // Register component
  defineIconifyIcon();

})();
