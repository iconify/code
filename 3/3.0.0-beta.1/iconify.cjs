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
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

const defaultIconSizeCustomisations = Object.freeze({
  width: null,
  height: null
});
const defaultIconCustomisations = Object.freeze({
  ...defaultIconSizeCustomisations,
  ...defaultIconTransformations
});

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

const regex = /\sid="(\S+)"/g;
const randomPrefix = "IconifyId" + Date.now().toString(16) + (Math.random() * 16777216 | 0).toString(16);
let counter = 0;
function replaceIDs(body, prefix = randomPrefix) {
  const ids = [];
  let match;
  while (match = regex.exec(body)) {
    ids.push(match[1]);
  }
  if (!ids.length) {
    return body;
  }
  ids.forEach((id) => {
    const newID = typeof prefix === "function" ? prefix(id) : prefix + (counter++).toString();
    const escapedID = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    body = body.replace(new RegExp('([#;"])(' + escapedID + ')([")]|\\.[a-z])', "g"), "$1" + newID + "$3");
  });
  return body;
}

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

const cache = {};

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

const storage = /* @__PURE__ */ Object.create(null);
function setAPIModule(provider, item) {
  storage[provider] = item;
}
function getAPIModule(provider) {
  return storage[provider] || storage[""];
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
const isPending = (icon) => {
  const provider = icon.provider;
  const prefix = icon.prefix;
  return pendingIcons[provider] && pendingIcons[provider][prefix] && pendingIcons[provider][prefix][icon.name] !== void 0;
};
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

const defaultExtendedIconCustomisations = {
    ...defaultIconCustomisations,
    inline: false,
};
/**
 * Class names
 */
const blockClass = 'iconify';
const inlineClass = 'iconify-inline';
/**
 * Names of properties to add to nodes
 */
const elementDataProperty = ('iconifyData' + Date.now());

/**
 * List of root nodes
 */
let nodes = [];
/**
 * Find node
 */
function findRootNode(node) {
    for (let i = 0; i < nodes.length; i++) {
        const item = nodes[i];
        const root = typeof item.node === 'function' ? item.node() : item.node;
        if (root === node) {
            return item;
        }
    }
}
/**
 * Add extra root node
 */
function addRootNode(root, autoRemove = false) {
    let node = findRootNode(root);
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
        node: () => {
            return document.documentElement;
        },
    });
}
/**
 * Remove root node
 */
function removeRootNode(root) {
    nodes = nodes.filter((node) => root !== node &&
        root !== (typeof node.node === 'function' ? node.node() : node.node));
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
    const doc = document;
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
let callback = null;
/**
 * Parameters for mutation observer
 */
const observerParams = {
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
    const observer = node.observer;
    if (!observer.pendingScan) {
        observer.pendingScan = setTimeout(() => {
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
    const observer = node.observer;
    if (!observer.pendingScan) {
        for (let i = 0; i < mutations.length; i++) {
            const item = mutations[i];
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
    let observer = node.observer;
    if (observer && observer.instance) {
        // Already started
        return;
    }
    const root = typeof node.node === 'function' ? node.node() : node.node;
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
    const observer = node.observer;
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
    const isRestart = callback !== null;
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
    (node ? [node] : listRootNodes()).forEach((node) => {
        if (!node.observer) {
            node.observer = {
                paused: 1,
            };
            return;
        }
        const observer = node.observer;
        observer.paused++;
        if (observer.paused > 1 || !observer.instance) {
            return;
        }
        // Disconnect observer
        const instance = observer.instance;
        // checkMutations(node, instance.takeRecords());
        instance.disconnect();
    });
}
/**
 * Pause observer
 */
function pauseObserver(root) {
    if (root) {
        const node = findRootNode(root);
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
    (observer ? [observer] : listRootNodes()).forEach((node) => {
        if (!node.observer) {
            // Start observer
            startObserver(node);
            return;
        }
        const observer = node.observer;
        if (observer.paused) {
            observer.paused--;
            if (!observer.paused) {
                // Start / resume
                const root = typeof node.node === 'function' ? node.node() : node.node;
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
        const node = findRootNode(root);
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
function observe(root, autoRemove = false) {
    const node = addRootNode(root, autoRemove);
    startObserver(node);
    return node;
}
/**
 * Remove observed node
 */
function stopObserving(root) {
    const node = findRootNode(root);
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
    const customisations1 = props1.customisations;
    const customisations2 = props2.customisations;
    for (const key in defaultExtendedIconCustomisations) {
        if (customisations1[key] !== customisations2[key]) {
            return true;
        }
    }
    return false;
}

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

/**
 * Size attributes
 */
const sizeAttributes = ['width', 'height'];
/**
 * Boolean attributes
 */
const booleanAttributes = [
    'inline',
    'hFlip',
    'vFlip',
];
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
    const name = element.getAttribute('data-icon');
    const icon = typeof name === 'string' && stringToIcon(name, true);
    if (!icon) {
        return null;
    }
    // Get defaults and inline
    const customisations = {
        ...defaultExtendedIconCustomisations,
        inline: element.classList && element.classList.contains(inlineClass),
    };
    // Get dimensions
    sizeAttributes.forEach((attr) => {
        const value = element.getAttribute('data-' + attr);
        if (value) {
            customisations[attr] = value;
        }
    });
    // Get rotation
    const rotation = element.getAttribute('data-rotate');
    if (typeof rotation === 'string') {
        customisations.rotate = rotateFromString(rotation);
    }
    // Get flip shorthand
    const flip = element.getAttribute('data-flip');
    if (typeof flip === 'string') {
        flipFromString(customisations, flip);
    }
    // Boolean attributes
    booleanAttributes.forEach((attr) => {
        const key = 'data-' + attr;
        const value = getBooleanAttribute(element.getAttribute(key), key);
        if (typeof value === 'boolean') {
            customisations[attr] = value;
        }
    });
    // Get render mode. Not checking actual value because incorrect values are treated as inline
    const mode = element.getAttribute('data-mode');
    return {
        name,
        icon,
        customisations,
        mode,
    };
}

/**
 * Selector combining class names and tags
 */
const selector = 'svg.' +
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
    const nodes = [];
    root.querySelectorAll(selector).forEach((node) => {
        // Get props, ignore SVG rendered outside of SVG framework
        const props = node[elementDataProperty] || node.tagName.toLowerCase() !== 'svg'
            ? getElementProps(node)
            : null;
        if (props) {
            nodes.push({
                node,
                props,
            });
        }
    });
    return nodes;
}

function iconToHTML(body, attributes) {
  let renderAttribsHTML = body.indexOf("xlink:") === -1 ? "" : ' xmlns:xlink="http://www.w3.org/1999/xlink"';
  for (const attr in attributes) {
    renderAttribsHTML += " " + attr + '="' + attributes[attr] + '"';
  }
  return '<svg xmlns="http://www.w3.org/2000/svg"' + renderAttribsHTML + ">" + body + "</svg>";
}

/**
 * Get classes to add from icon name
 */
function iconClasses(iconName) {
    const classesToAdd = new Set(['iconify']);
    ['provider', 'prefix'].forEach((attr) => {
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
    const svgClasses = svg.classList;
    // Copy classes from placeholder
    if (placeholder) {
        const placeholderClasses = placeholder.classList;
        Array.from(placeholderClasses).forEach((item) => {
            svgClasses.add(item);
        });
    }
    // Add new classes
    const addedClasses = [];
    classes.forEach((item) => {
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
    previouslyAddedClasses.forEach((item) => {
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
    const svgStyle = svg.style;
    // Remove previously added styles
    (previouslyAddedStyles || []).forEach((prop) => {
        svgStyle.removeProperty(prop);
    });
    // Apply new styles, ignoring styles that already exist
    const appliedStyles = [];
    for (const prop in styles) {
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
    let span;
    try {
        span = document.createElement('span');
    }
    catch (err) {
        return element;
    }
    // Generate data to render
    const customisations = props.customisations;
    const renderData = iconToSVG(iconData, customisations);
    // Get old data
    const oldData = element[elementDataProperty];
    // Generate SVG
    const html = iconToHTML(replaceIDs(renderData.body), {
        'aria-hidden': 'true',
        'role': 'img',
        ...renderData.attributes,
    });
    span.innerHTML = html;
    // Get SVG element
    const svg = span.childNodes[0];
    // Add attributes
    const placeholderAttributes = element.attributes;
    for (let i = 0; i < placeholderAttributes.length; i++) {
        const item = placeholderAttributes.item(i);
        const name = item.name;
        if (name !== 'class' && !svg.hasAttribute(name)) {
            svg.setAttribute(name, item.value);
        }
    }
    // Add classes
    const classesToAdd = iconClasses(props.icon);
    const addedClasses = applyClasses(svg, classesToAdd, new Set(oldData && oldData.addedClasses), element);
    // Update style
    const addedStyles = applyStyle(svg, customisations.inline
        ? {
            'vertical-align': '-0.125em',
        }
        : {}, oldData && oldData.addedStyles);
    // Add data to element
    const newData = {
        ...props,
        status: 'loaded',
        addedClasses,
        addedStyles,
    };
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

const commonProps = {
    display: 'inline-block',
};
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
 * Render icon as inline SVG
 */
function renderBackground(element, props, iconData, useMask) {
    // Generate data to render
    const customisations = props.customisations;
    const renderData = iconToSVG(iconData, customisations);
    const renderAttribs = renderData.attributes;
    // Get old data
    const oldData = element[elementDataProperty];
    // Generate SVG
    const html = iconToHTML(renderData.body, {
        ...renderAttribs,
        width: iconData.width + '',
        height: iconData.height + '',
    });
    // Add classes
    const classesToAdd = iconClasses(props.icon);
    const addedClasses = applyClasses(element, classesToAdd, new Set(oldData && oldData.addedClasses));
    // Update style
    const url = svgToURL(html);
    const newStyles = {
        '--svg': url,
        'width': fixSize(renderAttribs.width),
        'height': fixSize(renderAttribs.height),
        ...commonProps,
        ...(useMask ? monotoneProps : coloredProps),
    };
    if (customisations.inline) {
        newStyles['vertical-align'] = '-0.125em';
    }
    const addedStyles = applyStyle(element, newStyles, oldData && oldData.addedStyles);
    // Add data to element
    const newData = {
        ...props,
        status: 'loaded',
        addedClasses,
        addedStyles,
    };
    element[elementDataProperty] = newData;
    return element;
}

/**
 * Flag to avoid scanning DOM too often
 */
let scanQueued = false;
/**
 * Icons have been loaded
 */
function checkPendingIcons() {
    if (!scanQueued) {
        scanQueued = true;
        setTimeout(() => {
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
function scanDOM(rootNode, addTempNode = false) {
    // List of icons to load: [provider][prefix] = Set<name>
    const iconsToLoad = Object.create(null);
    function getIcon(icon, load) {
        const { provider, prefix, name } = icon;
        const storage = getStorage(provider, prefix);
        const storedIcon = storage.icons[name];
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
            const providerIconsToLoad = iconsToLoad[provider] ||
                (iconsToLoad[provider] = Object.create(null));
            const set = providerIconsToLoad[prefix] ||
                (providerIconsToLoad[prefix] = new Set());
            set.add(name);
        }
        return {
            status: 'loading',
        };
    }
    // Parse all root nodes
    (rootNode ? [rootNode] : listRootNodes()).forEach((observedNode) => {
        const root = typeof observedNode.node === 'function'
            ? observedNode.node()
            : observedNode.node;
        if (!root || !root.querySelectorAll) {
            return;
        }
        // Track placeholders
        let hasPlaceholders = false;
        // Observer
        let paused = false;
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
                const mode = props.mode;
                const isMask = mode === 'mask' ||
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
        scanRootNode(root).forEach(({ node, props }) => {
            // Check if item already has props
            const oldData = node[elementDataProperty];
            if (!oldData) {
                // New icon without data
                const { status, icon } = getIcon(props.icon, true);
                if (icon) {
                    // Ready to render!
                    render(node, props, icon);
                    return;
                }
                // Loading or missing
                hasPlaceholders = hasPlaceholders || status === 'loading';
                node[elementDataProperty] = {
                    ...props,
                    status,
                };
                return;
            }
            // Previously found icon
            let item;
            if (!propsChanged(oldData, props)) {
                // Props have not changed. Check status
                const oldStatus = oldData.status;
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
                    Object.assign(oldData, {
                        ...props,
                        status: item.status,
                    });
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
    for (const provider in iconsToLoad) {
        const providerIconsToLoad = iconsToLoad[provider];
        for (const prefix in providerIconsToLoad) {
            const set = providerIconsToLoad[prefix];
            loadIcons(Array.from(set).map((name) => ({
                provider,
                prefix,
                name,
            })), checkPendingIcons);
        }
    }
}
/**
 * Scan node for placeholders
 */
function scanElement(root) {
    // Add temporary node
    const node = findRootNode(root);
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

function generateIcon(name, customisations, returnString = false) {
    // Get icon data
    const iconData = getIconData(name);
    if (!iconData) {
        return null;
    }
    // Split name
    const iconName = stringToIcon(name);
    // Clean up customisations
    const changes = mergeCustomisations(defaultExtendedIconCustomisations, customisations || {});
    // Get data
    const result = renderInlineSVG(document.createElement('span'), {
        name,
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
    const iconData = getIconData(name);
    if (!iconData) {
        return null;
    }
    // Clean up customisations
    const changes = mergeCustomisations(defaultExtendedIconCustomisations, customisations || {});
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
    const _window = window;
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
    // Load observer and scan DOM on next tick
    setTimeout(() => {
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
    const _window = window;
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
/**
 * Internal API
 */
const _api = {
    getAPIConfig,
    setAPIModule,
    sendAPIQuery,
    setFetch,
    getFetch,
    listAPIProviders,
};
/**
 * Global variable
 */
const Iconify = {
    // IconifyAPIInternalFunctions
    _api,
    // IconifyAPIFunctions
    addAPIProvider,
    loadIcons,
    loadIcon,
    // IconifyStorageFunctions
    iconExists,
    getIcon,
    listIcons,
    addIcon,
    addCollection,
    // IconifyBuilderFunctions
    replaceIDs,
    calculateSize,
    buildIcon,
    // IconifyCommonFunctions
    getVersion,
    renderSVG,
    renderHTML,
    renderIcon,
    scan,
    observe,
    stopObserving,
    pauseObserver,
    resumeObserver,
    // IconifyBrowserCacheFunctions
    enableCache,
    disableCache,
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

// Export to window or web worker
try {
	if (self.Iconify === void 0) {
		self.Iconify = Iconify;
	}
} catch (err) {
}
