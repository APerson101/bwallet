import { c as create_ssr_component, o as onDestroy, d as spread, f as escape_object, h as createEventDispatcher, i as get_store_value, s as setContext, g as getContext, j as compute_rest_props, k as add_attribute, l as escape_attribute_value, a as subscribe, n as noop$1, v as validate_component, b as each, e as escape, p as add_styles, m as missing_component, q as merge_ssr_styles, r as is_promise } from "./ssr.js";
import "dequal";
import { s as sleep, t as tick, i as isFunction$1, a as isHTMLElement, b as toWritableStores, o as omit, d as overridable, e as effect, f as isBrowser, g as builder, h as styleToString, j as disabledAttr, k as addMeltEventListener, l as createElHelpers, m as generateIds, n as executeCallbacks, u as useEscapeKeydown, p as noop, q as useClickOutside, r as createFocusTrap, v as getPortalDestination, w as usePortal, x as removeScroll, y as kbd, z as last, A as createBitAttrs, B as removeUndefined, C as getOptionUpdater, D as is_void, E as createDispatcher, F as cn, I as Icon$1, L as Label, R as Root$2, S as Select_trigger, V as Value, G as Select_content, H as Group, J as Select_label, K as Select_item, M as Input$1, N as AccountTable, O as allAddresses, P as walletConnection, Q as refereshActiveConnections, T as Card_description, U as Skeleton, W as pendingConnections, X as slide, Y as fade, Z as fly, _ as Card_title } from "./skeleton.js";
import "clsx";
import { tv } from "tailwind-variants";
import { ethers, formatEther } from "ethers";
import { w as writable, d as derived } from "./index.js";
import { initializeApp } from "firebase/app";
import { getFirestore, query, collection, getDocs } from "firebase/firestore";
const matchIconName = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const stringToIcon = (value, validate, allowSimpleName, provider2 = "") => {
  const colonSeparated = value.split(":");
  if (value.slice(0, 1) === "@") {
    if (colonSeparated.length < 2 || colonSeparated.length > 3) {
      return null;
    }
    provider2 = colonSeparated.shift().slice(1);
  }
  if (colonSeparated.length > 3 || !colonSeparated.length) {
    return null;
  }
  if (colonSeparated.length > 1) {
    const name22 = colonSeparated.pop();
    const prefix = colonSeparated.pop();
    const result = {
      // Allow provider without '@': "provider:prefix:name"
      provider: colonSeparated.length > 0 ? colonSeparated[0] : provider2,
      prefix,
      name: name22
    };
    return validate && !validateIconName(result) ? null : result;
  }
  const name2 = colonSeparated[0];
  const dashSeparated = name2.split("-");
  if (dashSeparated.length > 1) {
    const result = {
      provider: provider2,
      prefix: dashSeparated.shift(),
      name: dashSeparated.join("-")
    };
    return validate && !validateIconName(result) ? null : result;
  }
  if (allowSimpleName && provider2 === "") {
    const result = {
      provider: provider2,
      prefix: "",
      name: name2
    };
    return validate && !validateIconName(result, allowSimpleName) ? null : result;
  }
  return null;
};
const validateIconName = (icon, allowSimpleName) => {
  if (!icon) {
    return false;
  }
  return !!((icon.provider === "" || icon.provider.match(matchIconName)) && (allowSimpleName && icon.prefix === "" || icon.prefix.match(matchIconName)) && icon.name.match(matchIconName));
};
const defaultIconDimensions = Object.freeze(
  {
    left: 0,
    top: 0,
    width: 16,
    height: 16
  }
);
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
    if (key in defaultIconTransformations) {
      if (key in parent && !(key in result)) {
        result[key] = defaultIconTransformations[key];
      }
    } else if (key in child) {
      result[key] = child[key];
    } else if (key in parent) {
      result[key] = parent[key];
    }
  }
  return result;
}
function getIconsTree(data, names) {
  const icons = data.icons;
  const aliases = data.aliases || /* @__PURE__ */ Object.create(null);
  const resolved = /* @__PURE__ */ Object.create(null);
  function resolve(name2) {
    if (icons[name2]) {
      return resolved[name2] = [];
    }
    if (!(name2 in resolved)) {
      resolved[name2] = null;
      const parent = aliases[name2] && aliases[name2].parent;
      const value = parent && resolve(parent);
      if (value) {
        resolved[name2] = [parent].concat(value);
      }
    }
    return resolved[name2];
  }
  (names || Object.keys(icons).concat(Object.keys(aliases))).forEach(resolve);
  return resolved;
}
function internalGetIconData(data, name2, tree) {
  const icons = data.icons;
  const aliases = data.aliases || /* @__PURE__ */ Object.create(null);
  let currentProps = {};
  function parse(name22) {
    currentProps = mergeIconData(
      icons[name22] || aliases[name22],
      currentProps
    );
  }
  parse(name2);
  tree.forEach(parse);
  return mergeIconData(data, currentProps);
}
function parseIconSet(data, callback) {
  const names = [];
  if (typeof data !== "object" || typeof data.icons !== "object") {
    return names;
  }
  if (data.not_found instanceof Array) {
    data.not_found.forEach((name2) => {
      callback(name2, null);
      names.push(name2);
    });
  }
  const tree = getIconsTree(data);
  for (const name2 in tree) {
    const item = tree[name2];
    if (item) {
      callback(name2, internalGetIconData(data, name2, item));
      names.push(name2);
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
function checkOptionalProps(item, defaults2) {
  for (const prop in defaults2) {
    if (prop in item && typeof item[prop] !== typeof defaults2[prop]) {
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
  for (const name2 in icons) {
    const icon = icons[name2];
    if (!name2.match(matchIconName) || typeof icon.body !== "string" || !checkOptionalProps(
      icon,
      defaultExtendedIconProps
    )) {
      return null;
    }
  }
  const aliases = data.aliases || /* @__PURE__ */ Object.create(null);
  for (const name2 in aliases) {
    const icon = aliases[name2];
    const parent = icon.parent;
    if (!name2.match(matchIconName) || typeof parent !== "string" || !icons[parent] && !aliases[parent] || !checkOptionalProps(
      icon,
      defaultExtendedIconProps
    )) {
      return null;
    }
  }
  return data;
}
const dataStorage = /* @__PURE__ */ Object.create(null);
function newStorage(provider2, prefix) {
  return {
    provider: provider2,
    prefix,
    icons: /* @__PURE__ */ Object.create(null),
    missing: /* @__PURE__ */ new Set()
  };
}
function getStorage(provider2, prefix) {
  const providerStorage = dataStorage[provider2] || (dataStorage[provider2] = /* @__PURE__ */ Object.create(null));
  return providerStorage[prefix] || (providerStorage[prefix] = newStorage(provider2, prefix));
}
function addIconSet(storage2, data) {
  if (!quicklyValidateIconSet(data)) {
    return [];
  }
  return parseIconSet(data, (name2, icon) => {
    if (icon) {
      storage2.icons[name2] = icon;
    } else {
      storage2.missing.add(name2);
    }
  });
}
function addIconToStorage(storage2, name2, icon) {
  try {
    if (typeof icon.body === "string") {
      storage2.icons[name2] = { ...icon };
      return true;
    }
  } catch (err) {
  }
  return false;
}
let simpleNames = false;
function allowSimpleNames(allow) {
  if (typeof allow === "boolean") {
    simpleNames = allow;
  }
  return simpleNames;
}
function getIconData(name2) {
  const icon = typeof name2 === "string" ? stringToIcon(name2, true, simpleNames) : name2;
  if (icon) {
    const storage2 = getStorage(icon.provider, icon.prefix);
    const iconName = icon.name;
    return storage2.icons[iconName] || (storage2.missing.has(iconName) ? null : void 0);
  }
}
function addIcon(name2, data) {
  const icon = stringToIcon(name2, true, simpleNames);
  if (!icon) {
    return false;
  }
  const storage2 = getStorage(icon.provider, icon.prefix);
  return addIconToStorage(storage2, icon.name, data);
}
function addCollection(data, provider2) {
  if (typeof data !== "object") {
    return false;
  }
  if (typeof provider2 !== "string") {
    provider2 = data.provider || "";
  }
  if (simpleNames && !provider2 && !data.prefix) {
    let added = false;
    if (quicklyValidateIconSet(data)) {
      data.prefix = "";
      parseIconSet(data, (name2, icon) => {
        if (icon && addIcon(name2, icon)) {
          added = true;
        }
      });
    }
    return added;
  }
  const prefix = data.prefix;
  if (!validateIconName({
    provider: provider2,
    prefix,
    name: "a"
  })) {
    return false;
  }
  const storage2 = getStorage(provider2, prefix);
  return !!addIconSet(storage2, data);
}
const defaultIconSizeCustomisations = Object.freeze({
  width: null,
  height: null
});
const defaultIconCustomisations = Object.freeze({
  // Dimensions
  ...defaultIconSizeCustomisations,
  // Transformations
  ...defaultIconTransformations
});
const unitsSplit = /(-?[0-9.]*[0-9]+[0-9.]*)/g;
const unitsTest = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
function calculateSize(size, ratio, precision) {
  if (ratio === 1) {
    return size;
  }
  precision = precision || 100;
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
function splitSVGDefs(content, tag = "defs") {
  let defs = "";
  const index = content.indexOf("<" + tag);
  while (index >= 0) {
    const start = content.indexOf(">", index);
    const end = content.indexOf("</" + tag);
    if (start === -1 || end === -1) {
      break;
    }
    const endEnd = content.indexOf(">", end);
    if (endEnd === -1) {
      break;
    }
    defs += content.slice(start + 1, end).trim();
    content = content.slice(0, index).trim() + content.slice(endEnd + 1);
  }
  return {
    defs,
    content
  };
}
function mergeDefsAndContent(defs, content) {
  return defs ? "<defs>" + defs + "</defs>" + content : content;
}
function wrapSVGContent(body, start, end) {
  const split = splitSVGDefs(body);
  return mergeDefsAndContent(split.defs, start + split.content + end);
}
const isUnsetKeyword = (value) => value === "unset" || value === "undefined" || value === "none";
function iconToSVG(icon, customisations) {
  const fullIcon = {
    ...defaultIconProps,
    ...icon
  };
  const fullCustomisations = {
    ...defaultIconCustomisations,
    ...customisations
  };
  const box = {
    left: fullIcon.left,
    top: fullIcon.top,
    width: fullIcon.width,
    height: fullIcon.height
  };
  let body = fullIcon.body;
  [fullIcon, fullCustomisations].forEach((props) => {
    const transformations = [];
    const hFlip = props.hFlip;
    const vFlip = props.vFlip;
    let rotation = props.rotate;
    if (hFlip) {
      if (vFlip) {
        rotation += 2;
      } else {
        transformations.push(
          "translate(" + (box.width + box.left).toString() + " " + (0 - box.top).toString() + ")"
        );
        transformations.push("scale(-1 1)");
        box.top = box.left = 0;
      }
    } else if (vFlip) {
      transformations.push(
        "translate(" + (0 - box.left).toString() + " " + (box.height + box.top).toString() + ")"
      );
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
        transformations.unshift(
          "rotate(90 " + tempValue.toString() + " " + tempValue.toString() + ")"
        );
        break;
      case 2:
        transformations.unshift(
          "rotate(180 " + (box.width / 2 + box.left).toString() + " " + (box.height / 2 + box.top).toString() + ")"
        );
        break;
      case 3:
        tempValue = box.width / 2 + box.left;
        transformations.unshift(
          "rotate(-90 " + tempValue.toString() + " " + tempValue.toString() + ")"
        );
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
      body = wrapSVGContent(
        body,
        '<g transform="' + transformations.join(" ") + '">',
        "</g>"
      );
    }
  });
  const customisationsWidth = fullCustomisations.width;
  const customisationsHeight = fullCustomisations.height;
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
  const attributes = {};
  const setAttr = (prop, value) => {
    if (!isUnsetKeyword(value)) {
      attributes[prop] = value.toString();
    }
  };
  setAttr("width", width);
  setAttr("height", height);
  const viewBox = [box.left, box.top, boxWidth, boxHeight];
  attributes.viewBox = viewBox.join(" ");
  return {
    attributes,
    viewBox,
    body
  };
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
  const suffix = "suffix" + (Math.random() * 16777216 | Date.now()).toString(16);
  ids.forEach((id) => {
    const newID = typeof prefix === "function" ? prefix(id) : prefix + (counter++).toString();
    const escapedID = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    body = body.replace(
      // Allowed characters before id: [#;"]
      // Allowed characters after id: [)"], .[a-z]
      new RegExp('([#;"])(' + escapedID + ')([")]|\\.[a-z])', "g"),
      "$1" + newID + suffix + "$3"
    );
  });
  body = body.replace(new RegExp(suffix, "g"), "");
  return body;
}
const storage = /* @__PURE__ */ Object.create(null);
function setAPIModule(provider2, item) {
  storage[provider2] = item;
}
function getAPIModule(provider2) {
  return storage[provider2] || storage[""];
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
    // API hosts
    resources,
    // Root path
    path: source.path || "/",
    // URL length limit
    maxURL: source.maxURL || 500,
    // Timeout before next host is used.
    rotate: source.rotate || 750,
    // Timeout before failing query.
    timeout: source.timeout || 5e3,
    // Randomise default API end point.
    random: source.random === true,
    // Start index
    index: source.index || 0,
    // Receive data after time out (used if time out kicks in first, then API module sends data anyway).
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
function addAPIProvider(provider2, customConfig) {
  const config = createAPIConfig(customConfig);
  if (config === null) {
    return false;
  }
  configStorage[provider2] = config;
  return true;
}
function getAPIConfig(provider2) {
  return configStorage[provider2];
}
const detectFetch = () => {
  let callback;
  try {
    callback = fetch;
    if (typeof callback === "function") {
      return callback;
    }
  } catch (err) {
  }
};
let fetchModule = detectFetch();
function calculateMaxLength(provider2, prefix) {
  const config = getAPIConfig(provider2);
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
    const url2 = prefix + ".json?icons=";
    result = config.maxURL - maxHostLength - config.path.length - url2.length;
  }
  return result;
}
function shouldAbort(status) {
  return status === 404;
}
const prepare = (provider2, prefix, icons) => {
  const results = [];
  const maxLength = calculateMaxLength(provider2, prefix);
  const type = "icons";
  let item = {
    type,
    provider: provider2,
    prefix,
    icons: []
  };
  let length = 0;
  icons.forEach((name2, index) => {
    length += name2.length + 1;
    if (length >= maxLength && index > 0) {
      results.push(item);
      item = {
        type,
        provider: provider2,
        prefix,
        icons: []
      };
      length = name2.length;
    }
    item.icons.push(name2);
  });
  results.push(item);
  return results;
};
function getPath(provider2) {
  if (typeof provider2 === "string") {
    const config = getAPIConfig(provider2);
    if (config) {
      return config.path;
    }
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
        if (data === 404) {
          callback("abort", data);
        } else {
          callback("next", defaultError);
        }
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
  const storage2 = /* @__PURE__ */ Object.create(null);
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
    const provider2 = icon.provider;
    const prefix = icon.prefix;
    const name2 = icon.name;
    const providerStorage = storage2[provider2] || (storage2[provider2] = /* @__PURE__ */ Object.create(null));
    const localStorage = providerStorage[prefix] || (providerStorage[prefix] = getStorage(provider2, prefix));
    let list;
    if (name2 in localStorage.icons) {
      list = result.loaded;
    } else if (prefix === "" || localStorage.missing.has(name2)) {
      list = result.missing;
    } else {
      list = result.pending;
    }
    const item = {
      provider: provider2,
      prefix,
      name: name2
    };
    list.push(item);
  });
  return result;
}
function removeCallback(storages, id) {
  storages.forEach((storage2) => {
    const items = storage2.loaderCallbacks;
    if (items) {
      storage2.loaderCallbacks = items.filter((row) => row.id !== id);
    }
  });
}
function updateCallbacks(storage2) {
  if (!storage2.pendingCallbacksFlag) {
    storage2.pendingCallbacksFlag = true;
    setTimeout(() => {
      storage2.pendingCallbacksFlag = false;
      const items = storage2.loaderCallbacks ? storage2.loaderCallbacks.slice(0) : [];
      if (!items.length) {
        return;
      }
      let hasPending = false;
      const provider2 = storage2.provider;
      const prefix = storage2.prefix;
      items.forEach((item) => {
        const icons = item.icons;
        const oldLength = icons.pending.length;
        icons.pending = icons.pending.filter((icon) => {
          if (icon.prefix !== prefix) {
            return true;
          }
          const name2 = icon.name;
          if (storage2.icons[name2]) {
            icons.loaded.push({
              provider: provider2,
              prefix,
              name: name2
            });
          } else if (storage2.missing.has(name2)) {
            icons.missing.push({
              provider: provider2,
              prefix,
              name: name2
            });
          } else {
            hasPending = true;
            return true;
          }
          return false;
        });
        if (icons.pending.length !== oldLength) {
          if (!hasPending) {
            removeCallback([storage2], item.id);
          }
          item.callback(
            icons.loaded.slice(0),
            icons.missing.slice(0),
            icons.pending.slice(0),
            item.abort
          );
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
  pendingSources.forEach((storage2) => {
    (storage2.loaderCallbacks || (storage2.loaderCallbacks = [])).push(item);
  });
  return abort;
}
function listToIcons(list, validate = true, simpleNames2 = false) {
  const result = [];
  list.forEach((item) => {
    const icon = typeof item === "string" ? stringToIcon(item, validate, simpleNames2) : item;
    if (icon) {
      result.push(icon);
    }
  });
  return result;
}
var defaultConfig = {
  resources: [],
  index: 0,
  timeout: 2e3,
  rotate: 750,
  random: false,
  dataAfterTimeout: false
};
function sendQuery(config, payload, query2, done) {
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
  function subscribe2(callback, overwrite) {
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
      subscribe: subscribe2,
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
    query2(resource, payload, item.callback);
  }
  setTimeout(execNext);
  return getQueryStatus;
}
function initRedundancy(cfg) {
  const config = {
    ...defaultConfig,
    ...cfg
  };
  let queries = [];
  function cleanup() {
    queries = queries.filter((item) => item().status === "pending");
  }
  function query2(payload, queryCallback, doneCallback) {
    const query22 = sendQuery(
      config,
      payload,
      queryCallback,
      (data, error) => {
        cleanup();
        if (doneCallback) {
          doneCallback(data, error);
        }
      }
    );
    queries.push(query22);
    return query22;
  }
  function find(callback) {
    return queries.find((value) => {
      return callback(value);
    }) || null;
  }
  const instance = {
    query: query2,
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
function getRedundancyCache(provider2) {
  if (!redundancyCache[provider2]) {
    const config = getAPIConfig(provider2);
    if (!config) {
      return;
    }
    const redundancy = initRedundancy(config);
    const cachedReundancy = {
      config,
      redundancy
    };
    redundancyCache[provider2] = cachedReundancy;
  }
  return redundancyCache[provider2];
}
function sendAPIQuery(target, query2, callback) {
  let redundancy;
  let send2;
  if (typeof target === "string") {
    const api = getAPIModule(target);
    if (!api) {
      callback(void 0, 424);
      return emptyCallback$1;
    }
    send2 = api.send;
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
        send2 = api.send;
      }
    }
  }
  if (!redundancy || !send2) {
    callback(void 0, 424);
    return emptyCallback$1;
  }
  return redundancy.query(query2, send2, callback)().abort;
}
const browserCacheVersion = "iconify2";
const browserCachePrefix = "iconify";
const browserCacheCountKey = browserCachePrefix + "-count";
const browserCacheVersionKey = browserCachePrefix + "-version";
const browserStorageHour = 36e5;
const browserStorageCacheExpiration = 168;
const browserStorageLimit = 50;
function getStoredItem(func, key) {
  try {
    return func.getItem(key);
  } catch (err) {
  }
}
function setStoredItem(func, key, value) {
  try {
    func.setItem(key, value);
    return true;
  } catch (err) {
  }
}
function removeStoredItem(func, key) {
  try {
    func.removeItem(key);
  } catch (err) {
  }
}
function setBrowserStorageItemsCount(storage2, value) {
  return setStoredItem(storage2, browserCacheCountKey, value.toString());
}
function getBrowserStorageItemsCount(storage2) {
  return parseInt(getStoredItem(storage2, browserCacheCountKey)) || 0;
}
const browserStorageConfig = {
  local: true,
  session: true
};
const browserStorageEmptyItems = {
  local: /* @__PURE__ */ new Set(),
  session: /* @__PURE__ */ new Set()
};
let browserStorageStatus = false;
function setBrowserStorageStatus(status) {
  browserStorageStatus = status;
}
let _window = typeof window === "undefined" ? {} : window;
function getBrowserStorage(key) {
  const attr = key + "Storage";
  try {
    if (_window && _window[attr] && typeof _window[attr].length === "number") {
      return _window[attr];
    }
  } catch (err) {
  }
  browserStorageConfig[key] = false;
}
function iterateBrowserStorage(key, callback) {
  const func = getBrowserStorage(key);
  if (!func) {
    return;
  }
  const version = getStoredItem(func, browserCacheVersionKey);
  if (version !== browserCacheVersion) {
    if (version) {
      const total2 = getBrowserStorageItemsCount(func);
      for (let i = 0; i < total2; i++) {
        removeStoredItem(func, browserCachePrefix + i.toString());
      }
    }
    setStoredItem(func, browserCacheVersionKey, browserCacheVersion);
    setBrowserStorageItemsCount(func, 0);
    return;
  }
  const minTime = Math.floor(Date.now() / browserStorageHour) - browserStorageCacheExpiration;
  const parseItem = (index) => {
    const name2 = browserCachePrefix + index.toString();
    const item = getStoredItem(func, name2);
    if (typeof item !== "string") {
      return;
    }
    try {
      const data = JSON.parse(item);
      if (typeof data === "object" && typeof data.cached === "number" && data.cached > minTime && typeof data.provider === "string" && typeof data.data === "object" && typeof data.data.prefix === "string" && // Valid item: run callback
      callback(data, index)) {
        return true;
      }
    } catch (err) {
    }
    removeStoredItem(func, name2);
  };
  let total = getBrowserStorageItemsCount(func);
  for (let i = total - 1; i >= 0; i--) {
    if (!parseItem(i)) {
      if (i === total - 1) {
        total--;
        setBrowserStorageItemsCount(func, total);
      } else {
        browserStorageEmptyItems[key].add(i);
      }
    }
  }
}
function initBrowserStorage() {
  if (browserStorageStatus) {
    return;
  }
  setBrowserStorageStatus(true);
  for (const key in browserStorageConfig) {
    iterateBrowserStorage(key, (item) => {
      const iconSet = item.data;
      const provider2 = item.provider;
      const prefix = iconSet.prefix;
      const storage2 = getStorage(
        provider2,
        prefix
      );
      if (!addIconSet(storage2, iconSet).length) {
        return false;
      }
      const lastModified = iconSet.lastModified || -1;
      storage2.lastModifiedCached = storage2.lastModifiedCached ? Math.min(storage2.lastModifiedCached, lastModified) : lastModified;
      return true;
    });
  }
}
function updateLastModified(storage2, lastModified) {
  const lastValue = storage2.lastModifiedCached;
  if (
    // Matches or newer
    lastValue && lastValue >= lastModified
  ) {
    return lastValue === lastModified;
  }
  storage2.lastModifiedCached = lastModified;
  if (lastValue) {
    for (const key in browserStorageConfig) {
      iterateBrowserStorage(key, (item) => {
        const iconSet = item.data;
        return item.provider !== storage2.provider || iconSet.prefix !== storage2.prefix || iconSet.lastModified === lastModified;
      });
    }
  }
  return true;
}
function storeInBrowserStorage(storage2, data) {
  if (!browserStorageStatus) {
    initBrowserStorage();
  }
  function store(key) {
    let func;
    if (!browserStorageConfig[key] || !(func = getBrowserStorage(key))) {
      return;
    }
    const set = browserStorageEmptyItems[key];
    let index;
    if (set.size) {
      set.delete(index = Array.from(set).shift());
    } else {
      index = getBrowserStorageItemsCount(func);
      if (index >= browserStorageLimit || !setBrowserStorageItemsCount(func, index + 1)) {
        return;
      }
    }
    const item = {
      cached: Math.floor(Date.now() / browserStorageHour),
      provider: storage2.provider,
      data
    };
    return setStoredItem(
      func,
      browserCachePrefix + index.toString(),
      JSON.stringify(item)
    );
  }
  if (data.lastModified && !updateLastModified(storage2, data.lastModified)) {
    return;
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
}
function emptyCallback() {
}
function loadedNewIcons(storage2) {
  if (!storage2.iconsLoaderFlag) {
    storage2.iconsLoaderFlag = true;
    setTimeout(() => {
      storage2.iconsLoaderFlag = false;
      updateCallbacks(storage2);
    });
  }
}
function loadNewIcons(storage2, icons) {
  if (!storage2.iconsToLoad) {
    storage2.iconsToLoad = icons;
  } else {
    storage2.iconsToLoad = storage2.iconsToLoad.concat(icons).sort();
  }
  if (!storage2.iconsQueueFlag) {
    storage2.iconsQueueFlag = true;
    setTimeout(() => {
      storage2.iconsQueueFlag = false;
      const { provider: provider2, prefix } = storage2;
      const icons2 = storage2.iconsToLoad;
      delete storage2.iconsToLoad;
      let api;
      if (!icons2 || !(api = getAPIModule(provider2))) {
        return;
      }
      const params = api.prepare(provider2, prefix, icons2);
      params.forEach((item) => {
        sendAPIQuery(provider2, item, (data) => {
          if (typeof data !== "object") {
            item.icons.forEach((name2) => {
              storage2.missing.add(name2);
            });
          } else {
            try {
              const parsed = addIconSet(
                storage2,
                data
              );
              if (!parsed.length) {
                return;
              }
              const pending = storage2.pendingIcons;
              if (pending) {
                parsed.forEach((name2) => {
                  pending.delete(name2);
                });
              }
              storeInBrowserStorage(storage2, data);
            } catch (err) {
              console.error(err);
            }
          }
          loadedNewIcons(storage2);
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
          callback(
            sortedIcons.loaded,
            sortedIcons.missing,
            sortedIcons.pending,
            emptyCallback
          );
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
    const { provider: provider2, prefix } = icon;
    if (prefix === lastPrefix && provider2 === lastProvider) {
      return;
    }
    lastProvider = provider2;
    lastPrefix = prefix;
    sources.push(getStorage(provider2, prefix));
    const providerNewIcons = newIcons[provider2] || (newIcons[provider2] = /* @__PURE__ */ Object.create(null));
    if (!providerNewIcons[prefix]) {
      providerNewIcons[prefix] = [];
    }
  });
  sortedIcons.pending.forEach((icon) => {
    const { provider: provider2, prefix, name: name2 } = icon;
    const storage2 = getStorage(provider2, prefix);
    const pendingQueue = storage2.pendingIcons || (storage2.pendingIcons = /* @__PURE__ */ new Set());
    if (!pendingQueue.has(name2)) {
      pendingQueue.add(name2);
      newIcons[provider2][prefix].push(name2);
    }
  });
  sources.forEach((storage2) => {
    const { provider: provider2, prefix } = storage2;
    if (newIcons[provider2][prefix].length) {
      loadNewIcons(storage2, newIcons[provider2][prefix]);
    }
  });
  return callback ? storeCallback(callback, sortedIcons, sources) : emptyCallback;
};
function mergeCustomisations(defaults2, item) {
  const result = {
    ...defaults2
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
function svgToData(svg) {
  return "data:image/svg+xml," + encodeSVGforURL(svg);
}
function svgToURL(svg) {
  return 'url("' + svgToData(svg) + '")';
}
const defaultExtendedIconCustomisations = {
  ...defaultIconCustomisations,
  inline: false
};
const svgDefaults = {
  "xmlns": "http://www.w3.org/2000/svg",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  "aria-hidden": true,
  "role": "img"
};
const commonProps = {
  display: "inline-block"
};
const monotoneProps = {
  "background-color": "currentColor"
};
const coloredProps = {
  "background-color": "transparent"
};
const propsToAdd = {
  image: "var(--svg)",
  repeat: "no-repeat",
  size: "100% 100%"
};
const propsToAddTo = {
  "-webkit-mask": monotoneProps,
  "mask": monotoneProps,
  "background": coloredProps
};
for (const prefix in propsToAddTo) {
  const list = propsToAddTo[prefix];
  for (const prop in propsToAdd) {
    list[prefix + "-" + prop] = propsToAdd[prop];
  }
}
function fixSize(value) {
  return value + (value.match(/^[-0-9.]+$/) ? "px" : "");
}
function render(icon, props) {
  const customisations = mergeCustomisations(defaultExtendedIconCustomisations, props);
  const mode = props.mode || "svg";
  const componentProps = mode === "svg" ? { ...svgDefaults } : {};
  if (icon.body.indexOf("xlink:") === -1) {
    delete componentProps["xmlns:xlink"];
  }
  let style = typeof props.style === "string" ? props.style : "";
  for (let key in props) {
    const value = props[key];
    if (value === void 0) {
      continue;
    }
    switch (key) {
      case "icon":
      case "style":
      case "onLoad":
      case "mode":
        break;
      case "inline":
      case "hFlip":
      case "vFlip":
        customisations[key] = value === true || value === "true" || value === 1;
        break;
      case "flip":
        if (typeof value === "string") {
          flipFromString(customisations, value);
        }
        break;
      case "color":
        style = style + (style.length > 0 && style.trim().slice(-1) !== ";" ? ";" : "") + "color: " + value + "; ";
        break;
      case "rotate":
        if (typeof value === "string") {
          customisations[key] = rotateFromString(value);
        } else if (typeof value === "number") {
          customisations[key] = value;
        }
        break;
      case "ariaHidden":
      case "aria-hidden":
        if (value !== true && value !== "true") {
          delete componentProps["aria-hidden"];
        }
        break;
      default:
        if (key.slice(0, 3) === "on:") {
          break;
        }
        if (defaultExtendedIconCustomisations[key] === void 0) {
          componentProps[key] = value;
        }
    }
  }
  const item = iconToSVG(icon, customisations);
  const renderAttribs = item.attributes;
  if (customisations.inline) {
    style = "vertical-align: -0.125em; " + style;
  }
  if (mode === "svg") {
    Object.assign(componentProps, renderAttribs);
    if (style !== "") {
      componentProps.style = style;
    }
    let localCounter = 0;
    let id = props.id;
    if (typeof id === "string") {
      id = id.replace(/-/g, "_");
    }
    return {
      svg: true,
      attributes: componentProps,
      body: replaceIDs(item.body, id ? () => id + "ID" + localCounter++ : "iconifySvelte")
    };
  }
  const { body, width, height } = icon;
  const useMask = mode === "mask" || (mode === "bg" ? false : body.indexOf("currentColor") !== -1);
  const html = iconToHTML(body, {
    ...renderAttribs,
    width: width + "",
    height: height + ""
  });
  const url2 = svgToURL(html);
  const styles = {
    "--svg": url2
  };
  const size = (prop) => {
    const value = renderAttribs[prop];
    if (value) {
      styles[prop] = fixSize(value);
    }
  };
  size("width");
  size("height");
  Object.assign(styles, commonProps, useMask ? monotoneProps : coloredProps);
  let customStyle = "";
  for (const key in styles) {
    customStyle += key + ": " + styles[key] + ";";
  }
  componentProps.style = customStyle + style;
  return {
    svg: false,
    attributes: componentProps
  };
}
allowSimpleNames(true);
setAPIModule("", fetchAPIModule);
if (typeof document !== "undefined" && typeof window !== "undefined") {
  initBrowserStorage();
  const _window2 = window;
  if (_window2.IconifyPreload !== void 0) {
    const preload = _window2.IconifyPreload;
    const err = "Invalid IconifyPreload syntax.";
    if (typeof preload === "object" && preload !== null) {
      (preload instanceof Array ? preload : [preload]).forEach((item) => {
        try {
          if (
            // Check if item is an object and not null/array
            typeof item !== "object" || item === null || item instanceof Array || // Check for 'icons' and 'prefix'
            typeof item.icons !== "object" || typeof item.prefix !== "string" || // Add icon set
            !addCollection(item)
          ) {
            console.error(err);
          }
        } catch (e) {
          console.error(err);
        }
      });
    }
  }
  if (_window2.IconifyProviders !== void 0) {
    const providers = _window2.IconifyProviders;
    if (typeof providers === "object" && providers !== null) {
      for (let key in providers) {
        const err = "IconifyProviders[" + key + "] is invalid.";
        try {
          const value = providers[key];
          if (typeof value !== "object" || !value || value.resources === void 0) {
            continue;
          }
          if (!addAPIProvider(key, value)) {
            console.error(err);
          }
        } catch (e) {
          console.error(err);
        }
      }
    }
  }
}
function checkIconState(icon, state, mounted, callback, onload) {
  function abortLoading() {
    if (state.loading) {
      state.loading.abort();
      state.loading = null;
    }
  }
  if (typeof icon === "object" && icon !== null && typeof icon.body === "string") {
    state.name = "";
    abortLoading();
    return { data: { ...defaultIconProps, ...icon } };
  }
  let iconName;
  if (typeof icon !== "string" || (iconName = stringToIcon(icon, false, true)) === null) {
    abortLoading();
    return null;
  }
  const data = getIconData(iconName);
  if (!data) {
    if (mounted && (!state.loading || state.loading.name !== icon)) {
      abortLoading();
      state.name = "";
      state.loading = {
        name: icon,
        abort: loadIcons([iconName], callback)
      };
    }
    return null;
  }
  abortLoading();
  if (state.name !== icon) {
    state.name = icon;
    if (onload && !state.destroyed) {
      onload(icon);
    }
  }
  const classes = ["iconify"];
  if (iconName.prefix !== "") {
    classes.push("iconify--" + iconName.prefix);
  }
  if (iconName.provider !== "") {
    classes.push("iconify--" + iconName.provider);
  }
  return { data, classes };
}
function generateIcon(icon, props) {
  return icon ? render({
    ...defaultIconProps,
    ...icon
  }, props) : null;
}
const Icon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const state = {
    // Last icon name
    name: "",
    // Loading status
    loading: null,
    // Destroyed status
    destroyed: false
  };
  let mounted = false;
  let data;
  const onLoad = (icon) => {
    if (typeof $$props.onLoad === "function") {
      $$props.onLoad(icon);
    }
    const dispatch = createEventDispatcher();
    dispatch("load", { icon });
  };
  function loaded() {
  }
  onDestroy(() => {
    state.destroyed = true;
    if (state.loading) {
      state.loading.abort();
      state.loading = null;
    }
  });
  {
    {
      const iconData = checkIconState($$props.icon, state, mounted, loaded, onLoad);
      data = iconData ? generateIcon(iconData.data, $$props) : null;
      if (data && iconData.classes) {
        data.attributes["class"] = (typeof $$props["class"] === "string" ? $$props["class"] + " " : "") + iconData.classes.join(" ");
      }
    }
  }
  return `${data ? `${data.svg ? `<svg${spread([escape_object(data.attributes)], {})}><!-- HTML_TAG_START -->${data.body}<!-- HTML_TAG_END --></svg>` : `<span${spread([escape_object(data.attributes)], {})}></span>`}` : ``}`;
});
const url = "https://replicator.pegasus.lightlink.io/rpc/v1";
const provider = new ethers.JsonRpcProvider(url);
async function fetchAccountBalance(address) {
  const result = await provider.getBalance(address);
  return formatEther(result);
}
async function handleFocus(args) {
  const { prop, defaultEl } = args;
  await Promise.all([sleep(1), tick]);
  if (prop === void 0) {
    defaultEl?.focus();
    return;
  }
  const returned = isFunction$1(prop) ? prop(defaultEl) : prop;
  if (typeof returned === "string") {
    const el = document.querySelector(returned);
    if (!isHTMLElement(el))
      return;
    el.focus();
  } else if (isHTMLElement(returned)) {
    returned.focus();
  }
}
const defaults$3 = {
  src: "",
  delayMs: 0,
  onLoadingStatusChange: void 0
};
const createAvatar = (props) => {
  const withDefaults = { ...defaults$3, ...props };
  const options = toWritableStores(omit(withDefaults, "loadingStatus", "onLoadingStatusChange"));
  const { src, delayMs } = options;
  const loadingStatusWritable = withDefaults.loadingStatus ?? writable("loading");
  const loadingStatus = overridable(loadingStatusWritable, withDefaults?.onLoadingStatusChange);
  effect([src, delayMs], ([$src, $delayMs]) => {
    if (isBrowser) {
      const image2 = new Image();
      image2.src = $src;
      image2.onload = () => {
        if (delayMs !== void 0) {
          const timerId = window.setTimeout(() => {
            loadingStatus.set("loaded");
          }, $delayMs);
          return () => window.clearTimeout(timerId);
        } else {
          loadingStatus.set("loaded");
        }
      };
      image2.onerror = () => {
        loadingStatus.set("error");
      };
    }
  });
  const image = builder("avatar-image", {
    stores: [src, loadingStatus],
    returned: ([$src, $loadingStatus]) => {
      const imageStyles = styleToString({
        display: $loadingStatus === "loaded" ? "block" : "none"
      });
      return {
        src: $src,
        style: imageStyles
      };
    }
  });
  const fallback = builder("avatar-fallback", {
    stores: [loadingStatus],
    returned: ([$loadingStatus]) => {
      return {
        style: $loadingStatus === "loaded" ? styleToString({
          display: "none"
        }) : void 0,
        hidden: $loadingStatus === "loaded" ? true : void 0
      };
    }
  });
  return {
    elements: {
      image,
      fallback
    },
    states: {
      loadingStatus
    },
    options
  };
};
const defaults$2 = {
  defaultOpen: false,
  disabled: false,
  forceVisible: false
};
const { name: name$1 } = createElHelpers("collapsible");
function createCollapsible(props) {
  const withDefaults = { ...defaults$2, ...props };
  const options = toWritableStores(omit(withDefaults, "open", "defaultOpen", "onOpenChange"));
  const { disabled, forceVisible } = options;
  const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
  const open = overridable(openWritable, withDefaults?.onOpenChange);
  const root = builder(name$1(), {
    stores: [open, disabled],
    returned: ([$open, $disabled]) => ({
      "data-state": $open ? "open" : "closed",
      "data-disabled": disabledAttr($disabled)
    })
  });
  const trigger = builder(name$1("trigger"), {
    stores: [open, disabled],
    returned: ([$open, $disabled]) => ({
      "data-state": $open ? "open" : "closed",
      "data-disabled": disabledAttr($disabled),
      disabled: disabledAttr($disabled)
    }),
    action: (node) => {
      const unsub = addMeltEventListener(node, "click", () => {
        const disabled2 = node.dataset.disabled !== void 0;
        if (disabled2)
          return;
        open.update(($open) => !$open);
      });
      return {
        destroy: unsub
      };
    }
  });
  const isVisible = derived([open, forceVisible], ([$open, $forceVisible]) => $open || $forceVisible);
  const content = builder(name$1("content"), {
    stores: [isVisible, disabled],
    returned: ([$isVisible, $disabled]) => ({
      "data-state": $isVisible ? "open" : "closed",
      "data-disabled": disabledAttr($disabled),
      hidden: $isVisible ? void 0 : true,
      style: styleToString({
        display: $isVisible ? void 0 : "none"
      })
    })
  });
  return {
    elements: {
      root,
      trigger,
      content
    },
    states: {
      open
    },
    options
  };
}
const { name } = createElHelpers("dialog");
const defaults$1 = {
  preventScroll: true,
  closeOnEscape: true,
  closeOnOutsideClick: true,
  role: "dialog",
  defaultOpen: false,
  portal: "body",
  forceVisible: false,
  openFocus: void 0,
  closeFocus: void 0,
  onOutsideClick: void 0
};
const openDialogIds = writable([]);
const dialogIdParts = ["content", "title", "description"];
function createDialog(props) {
  const withDefaults = { ...defaults$1, ...props };
  const options = toWritableStores(omit(withDefaults, "ids"));
  const { preventScroll, closeOnEscape, closeOnOutsideClick, role, portal, forceVisible, openFocus, closeFocus, onOutsideClick } = options;
  const activeTrigger = writable(null);
  const ids = toWritableStores({
    ...generateIds(dialogIdParts),
    ...withDefaults.ids
  });
  const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
  const open = overridable(openWritable, withDefaults?.onOpenChange);
  const isVisible = derived([open, forceVisible], ([$open, $forceVisible]) => {
    return $open || $forceVisible;
  });
  let unsubScroll = noop;
  function handleOpen(e) {
    const el = e.currentTarget;
    const triggerEl = e.currentTarget;
    if (!isHTMLElement(el) || !isHTMLElement(triggerEl))
      return;
    open.set(true);
    activeTrigger.set(triggerEl);
  }
  function handleClose() {
    open.set(false);
    handleFocus({
      prop: get_store_value(closeFocus),
      defaultEl: get_store_value(activeTrigger)
    });
  }
  effect([open], ([$open]) => {
    sleep(100).then(() => {
      if ($open) {
        openDialogIds.update((prev) => {
          prev.push(get_store_value(ids.content));
          return prev;
        });
      } else {
        openDialogIds.update((prev) => prev.filter((id) => id !== get_store_value(ids.content)));
      }
    });
  });
  const trigger = builder(name("trigger"), {
    stores: [open],
    returned: ([$open]) => {
      return {
        "aria-haspopup": "dialog",
        "aria-expanded": $open,
        type: "button"
      };
    },
    action: (node) => {
      const unsub = executeCallbacks(addMeltEventListener(node, "click", (e) => {
        handleOpen(e);
      }), addMeltEventListener(node, "keydown", (e) => {
        if (e.key !== kbd.ENTER && e.key !== kbd.SPACE)
          return;
        e.preventDefault();
        handleOpen(e);
      }));
      return {
        destroy: unsub
      };
    }
  });
  const overlay = builder(name("overlay"), {
    stores: [isVisible],
    returned: ([$isVisible]) => {
      return {
        hidden: $isVisible ? void 0 : true,
        tabindex: -1,
        style: styleToString({
          display: $isVisible ? void 0 : "none"
        }),
        "aria-hidden": true,
        "data-state": $isVisible ? "open" : "closed"
      };
    },
    action: (node) => {
      let unsubEscapeKeydown = noop;
      if (get_store_value(closeOnEscape)) {
        const escapeKeydown = useEscapeKeydown(node, {
          handler: () => {
            handleClose();
          }
        });
        if (escapeKeydown && escapeKeydown.destroy) {
          unsubEscapeKeydown = escapeKeydown.destroy;
        }
      }
      return {
        destroy() {
          unsubEscapeKeydown();
        }
      };
    }
  });
  const content = builder(name("content"), {
    stores: [isVisible, ids.content, ids.description, ids.title],
    returned: ([$isVisible, $contentId, $descriptionId, $titleId]) => {
      return {
        id: $contentId,
        role: get_store_value(role),
        "aria-describedby": $descriptionId,
        "aria-labelledby": $titleId,
        "aria-modal": $isVisible ? "true" : void 0,
        "data-state": $isVisible ? "open" : "closed",
        tabindex: -1,
        hidden: $isVisible ? void 0 : true,
        style: styleToString({
          display: $isVisible ? void 0 : "none"
        })
      };
    },
    action: (node) => {
      let activate = noop;
      let deactivate = noop;
      const destroy = executeCallbacks(effect([open], ([$open]) => {
        if (!$open)
          return;
        const focusTrap = createFocusTrap({
          immediate: false,
          escapeDeactivates: true,
          clickOutsideDeactivates: true,
          returnFocusOnDeactivate: false,
          fallbackFocus: node
        });
        activate = focusTrap.activate;
        deactivate = focusTrap.deactivate;
        const ac = focusTrap.useFocusTrap(node);
        if (ac && ac.destroy) {
          return ac.destroy;
        } else {
          return focusTrap.deactivate;
        }
      }), effect([closeOnOutsideClick, open], ([$closeOnOutsideClick, $open]) => {
        return useClickOutside(node, {
          enabled: $open,
          handler: (e) => {
            get_store_value(onOutsideClick)?.(e);
            if (e.defaultPrevented)
              return;
            const $openDialogIds = get_store_value(openDialogIds);
            const isLast = last($openDialogIds) === get_store_value(ids.content);
            if ($closeOnOutsideClick && isLast) {
              handleClose();
            }
          }
        }).destroy;
      }), effect([closeOnEscape], ([$closeOnEscape]) => {
        if (!$closeOnEscape)
          return noop;
        const escapeKeydown = useEscapeKeydown(node, {
          handler: () => {
            handleClose();
          }
        });
        if (escapeKeydown && escapeKeydown.destroy) {
          return escapeKeydown.destroy;
        }
        return noop;
      }), effect([isVisible], ([$isVisible]) => {
        tick().then(() => {
          if (!$isVisible) {
            deactivate();
          } else {
            activate();
          }
        });
      }));
      return {
        destroy: () => {
          unsubScroll();
          destroy();
        }
      };
    }
  });
  const portalled = builder(name("portalled"), {
    stores: portal,
    returned: ($portal) => ({
      "data-portal": $portal ? "" : void 0
    }),
    action: (node) => {
      const unsubPortal = effect([portal], ([$portal]) => {
        if (!$portal)
          return noop;
        const portalDestination = getPortalDestination(node, $portal);
        if (portalDestination === null)
          return noop;
        const portalAction = usePortal(node, portalDestination);
        if (portalAction && portalAction.destroy) {
          return portalAction.destroy;
        } else {
          return noop;
        }
      });
      return {
        destroy() {
          unsubPortal();
        }
      };
    }
  });
  const title = builder(name("title"), {
    stores: [ids.title],
    returned: ([$titleId]) => ({
      id: $titleId
    })
  });
  const description = builder(name("description"), {
    stores: [ids.description],
    returned: ([$descriptionId]) => ({
      id: $descriptionId
    })
  });
  const close = builder(name("close"), {
    returned: () => ({
      type: "button"
    }),
    action: (node) => {
      const unsub = executeCallbacks(addMeltEventListener(node, "click", () => {
        handleClose();
      }), addMeltEventListener(node, "keydown", (e) => {
        if (e.key !== kbd.SPACE && e.key !== kbd.ENTER)
          return;
        e.preventDefault();
        handleClose();
      }));
      return {
        destroy: unsub
      };
    }
  });
  effect([open, preventScroll], ([$open, $preventScroll]) => {
    if (!isBrowser)
      return;
    if ($preventScroll && $open)
      unsubScroll = removeScroll();
    if ($open) {
      const contentEl = document.getElementById(get_store_value(ids.content));
      handleFocus({ prop: get_store_value(openFocus), defaultEl: contentEl });
    }
    return () => {
      if (!get_store_value(forceVisible)) {
        unsubScroll();
      }
    };
  });
  return {
    ids,
    elements: {
      content,
      trigger,
      title,
      description,
      overlay,
      close,
      portalled
    },
    states: {
      open
    },
    options
  };
}
const defaults = {
  orientation: "horizontal",
  decorative: false
};
const createSeparator = (props) => {
  const withDefaults = { ...defaults, ...props };
  const options = toWritableStores(withDefaults);
  const { orientation, decorative } = options;
  const root = builder("separator", {
    stores: [orientation, decorative],
    returned: ([$orientation, $decorative]) => {
      const ariaOrientation = $orientation === "vertical" ? $orientation : void 0;
      return {
        role: $decorative ? "none" : "separator",
        "aria-orientation": ariaOrientation,
        "aria-hidden": $decorative,
        "data-orientation": $orientation
      };
    }
  });
  return {
    elements: {
      root
    },
    options
  };
};
function getAvatarData() {
  const NAME = "avatar";
  const PARTS = ["root", "image", "fallback"];
  return {
    NAME,
    PARTS
  };
}
function setCtx$3(props) {
  const { NAME, PARTS } = getAvatarData();
  const getAttrs2 = createBitAttrs(NAME, PARTS);
  const avatar = { ...createAvatar(removeUndefined(props)), getAttrs: getAttrs2 };
  setContext(NAME, avatar);
  return {
    ...avatar,
    updateOption: getOptionUpdater(avatar.options)
  };
}
function getImage(src = "") {
  const { NAME } = getAvatarData();
  const avatar = getContext(NAME);
  if (!src) {
    avatar.options.src.set("");
  } else {
    avatar.options.src.set(src);
  }
  return avatar;
}
function getCtx$2() {
  const { NAME } = getAvatarData();
  return getContext(NAME);
}
const Avatar$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["delayMs", "loadingStatus", "onLoadingStatusChange", "asChild", "el"]);
  let { delayMs = void 0 } = $$props;
  let { loadingStatus = void 0 } = $$props;
  let { onLoadingStatusChange = void 0 } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { states: { loadingStatus: localLoadingStatus }, updateOption, getAttrs: getAttrs2 } = setCtx$3({
    src: "",
    delayMs,
    onLoadingStatusChange: ({ next }) => {
      loadingStatus = next;
      onLoadingStatusChange?.(next);
      return next;
    }
  });
  const attrs = getAttrs2("root");
  if ($$props.delayMs === void 0 && $$bindings.delayMs && delayMs !== void 0)
    $$bindings.delayMs(delayMs);
  if ($$props.loadingStatus === void 0 && $$bindings.loadingStatus && loadingStatus !== void 0)
    $$bindings.loadingStatus(loadingStatus);
  if ($$props.onLoadingStatusChange === void 0 && $$bindings.onLoadingStatusChange && onLoadingStatusChange !== void 0)
    $$bindings.onLoadingStatusChange(onLoadingStatusChange);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  loadingStatus !== void 0 && localLoadingStatus.set(loadingStatus);
  {
    updateOption("delayMs", delayMs);
  }
  return `${asChild ? `${slots.default ? slots.default({ attrs }) : ``}` : `<div${spread([escape_object($$restProps), escape_object(attrs)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ attrs }) : ``}</div>`}`;
});
const Avatar_image$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let image;
  let builder2;
  let $$restProps = compute_rest_props($$props, ["src", "alt", "asChild", "el"]);
  let $image, $$unsubscribe_image = noop$1, $$subscribe_image = () => ($$unsubscribe_image(), $$unsubscribe_image = subscribe(image, ($$value) => $image = $$value), image);
  let { src = void 0 } = $$props;
  let { alt = void 0 } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const attrs = { "data-bits-avatar-image": "" };
  if ($$props.src === void 0 && $$bindings.src && src !== void 0)
    $$bindings.src(src);
  if ($$props.alt === void 0 && $$bindings.alt && alt !== void 0)
    $$bindings.alt(alt);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  $$subscribe_image(image = getImage(src).elements.image);
  builder2 = $image;
  {
    Object.assign(builder2, attrs);
  }
  $$unsubscribe_image();
  return `${asChild ? `${slots.default ? slots.default({ builder: builder2 }) : ``}` : `<img${spread(
    [
      escape_object(builder2),
      { alt: escape_attribute_value(alt) },
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("this", el, 0)}>`}`;
});
const Avatar_fallback$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder2;
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let $fallback, $$unsubscribe_fallback;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { fallback }, getAttrs: getAttrs2 } = getCtx$2();
  $$unsubscribe_fallback = subscribe(fallback, (value) => $fallback = value);
  const attrs = getAttrs2("fallback");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  builder2 = $fallback;
  {
    Object.assign(builder2, attrs);
  }
  $$unsubscribe_fallback();
  return `${asChild ? `${slots.default ? slots.default({ builder: builder2 }) : ``}` : `<span${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder: builder2 }) : ``}</span>`}`;
});
function getAttrs(builders) {
  const attrs = {};
  builders.forEach((builder2) => {
    Object.keys(builder2).forEach((key) => {
      if (key !== "action") {
        attrs[key] = builder2[key];
      }
    });
  });
  return attrs;
}
const Button$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["href", "type", "builders", "el"]);
  let { href = void 0 } = $$props;
  let { type = void 0 } = $$props;
  let { builders = [] } = $$props;
  let { el = void 0 } = $$props;
  const attrs = { "data-button-root": "" };
  if ($$props.href === void 0 && $$bindings.href && href !== void 0)
    $$bindings.href(href);
  if ($$props.type === void 0 && $$bindings.type && type !== void 0)
    $$bindings.type(type);
  if ($$props.builders === void 0 && $$bindings.builders && builders !== void 0)
    $$bindings.builders(builders);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  return `${builders && builders.length ? ` ${((tag) => {
    return tag ? `<${href ? "a" : "button"}${spread(
      [
        {
          type: escape_attribute_value(href ? void 0 : type)
        },
        { href: escape_attribute_value(href) },
        { tabindex: "0" },
        escape_object(getAttrs(builders)),
        escape_object($$restProps),
        escape_object(attrs)
      ],
      {}
    )}${add_attribute("this", el, 0)}>${is_void(tag) ? "" : `${slots.default ? slots.default({}) : ``}`}${is_void(tag) ? "" : `</${tag}>`}` : "";
  })(href ? "a" : "button")}` : ` ${((tag) => {
    return tag ? `<${href ? "a" : "button"}${spread(
      [
        {
          type: escape_attribute_value(href ? void 0 : type)
        },
        { href: escape_attribute_value(href) },
        { tabindex: "0" },
        escape_object($$restProps),
        escape_object(attrs)
      ],
      {}
    )}>${is_void(tag) ? "" : `${slots.default ? slots.default({}) : ``}`}${is_void(tag) ? "" : `</${tag}>`}` : "";
  })(href ? "a" : "button")}`}`;
});
function getCollapsibleData() {
  const NAME = "collapsible";
  const PARTS = ["root", "content", "trigger"];
  return {
    NAME,
    PARTS
  };
}
function setCtx$2(props) {
  const { NAME, PARTS } = getCollapsibleData();
  const getAttrs2 = createBitAttrs(NAME, PARTS);
  const collapsible = { ...createCollapsible(removeUndefined(props)), getAttrs: getAttrs2 };
  setContext(NAME, collapsible);
  return {
    ...collapsible,
    updateOption: getOptionUpdater(collapsible.options)
  };
}
function getCtx$1() {
  const { NAME } = getCollapsibleData();
  return getContext(NAME);
}
const Collapsible = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder2;
  let $$restProps = compute_rest_props($$props, ["disabled", "open", "onOpenChange", "asChild", "el"]);
  let $root, $$unsubscribe_root;
  let { disabled = void 0 } = $$props;
  let { open = void 0 } = $$props;
  let { onOpenChange = void 0 } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { root }, states: { open: localOpen }, updateOption, getAttrs: getAttrs2 } = setCtx$2({
    disabled,
    forceVisible: true,
    defaultOpen: open,
    onOpenChange: ({ next }) => {
      if (open !== next) {
        onOpenChange?.(next);
        open = next;
      }
      return next;
    }
  });
  $$unsubscribe_root = subscribe(root, (value) => $root = value);
  const attrs = getAttrs2("root");
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.open === void 0 && $$bindings.open && open !== void 0)
    $$bindings.open(open);
  if ($$props.onOpenChange === void 0 && $$bindings.onOpenChange && onOpenChange !== void 0)
    $$bindings.onOpenChange(onOpenChange);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  open !== void 0 && localOpen.set(open);
  {
    updateOption("disabled", disabled);
  }
  builder2 = $root;
  {
    Object.assign(builder2, attrs);
  }
  $$unsubscribe_root();
  return `${asChild ? `${slots.default ? slots.default({ builder: builder2 }) : ``}` : `<div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>`}`;
});
const Collapsible_content$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder2;
  let $$restProps = compute_rest_props($$props, [
    "transition",
    "transitionConfig",
    "inTransition",
    "inTransitionConfig",
    "outTransition",
    "outTransitionConfig",
    "asChild",
    "el"
  ]);
  let $content, $$unsubscribe_content;
  let $open, $$unsubscribe_open;
  let { transition = void 0 } = $$props;
  let { transitionConfig = void 0 } = $$props;
  let { inTransition = void 0 } = $$props;
  let { inTransitionConfig = void 0 } = $$props;
  let { outTransition = void 0 } = $$props;
  let { outTransitionConfig = void 0 } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { content }, states: { open }, getAttrs: getAttrs2 } = getCtx$1();
  $$unsubscribe_content = subscribe(content, (value) => $content = value);
  $$unsubscribe_open = subscribe(open, (value) => $open = value);
  const attrs = getAttrs2("content");
  if ($$props.transition === void 0 && $$bindings.transition && transition !== void 0)
    $$bindings.transition(transition);
  if ($$props.transitionConfig === void 0 && $$bindings.transitionConfig && transitionConfig !== void 0)
    $$bindings.transitionConfig(transitionConfig);
  if ($$props.inTransition === void 0 && $$bindings.inTransition && inTransition !== void 0)
    $$bindings.inTransition(inTransition);
  if ($$props.inTransitionConfig === void 0 && $$bindings.inTransitionConfig && inTransitionConfig !== void 0)
    $$bindings.inTransitionConfig(inTransitionConfig);
  if ($$props.outTransition === void 0 && $$bindings.outTransition && outTransition !== void 0)
    $$bindings.outTransition(outTransition);
  if ($$props.outTransitionConfig === void 0 && $$bindings.outTransitionConfig && outTransitionConfig !== void 0)
    $$bindings.outTransitionConfig(outTransitionConfig);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  builder2 = $content;
  {
    Object.assign(builder2, attrs);
  }
  $$unsubscribe_content();
  $$unsubscribe_open();
  return `${asChild && $open ? `${slots.default ? slots.default({ builder: builder2 }) : ``}` : `${transition && $open ? `<div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>` : `${inTransition && outTransition && $open ? `<div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>` : `${inTransition && $open ? `<div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>` : `${outTransition && $open ? `<div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>` : `${$open ? `<div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>` : ``}`}`}`}`}`}`;
});
const Collapsible_trigger = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder2;
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let $trigger, $$unsubscribe_trigger;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { trigger }, getAttrs: getAttrs2 } = getCtx$1();
  $$unsubscribe_trigger = subscribe(trigger, (value) => $trigger = value);
  createDispatcher();
  const attrs = getAttrs2("trigger");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  builder2 = $trigger;
  {
    Object.assign(builder2, attrs);
  }
  $$unsubscribe_trigger();
  return `${asChild ? `${slots.default ? slots.default({ builder: builder2 }) : ``}` : `<button${spread([escape_object(builder2), { type: "button" }, escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder: builder2 }) : ``}</button>`}`;
});
function getDialogData() {
  const NAME = "dialog";
  const PARTS = [
    "close",
    "content",
    "description",
    "overlay",
    "portal",
    "title",
    "trigger"
  ];
  return {
    NAME,
    PARTS
  };
}
function setCtx$1(props) {
  const { NAME, PARTS } = getDialogData();
  const getAttrs2 = createBitAttrs(NAME, PARTS);
  const dialog = {
    ...createDialog({ ...removeUndefined(props), role: "dialog", forceVisible: true }),
    getAttrs: getAttrs2
  };
  setContext(NAME, dialog);
  return {
    ...dialog,
    updateOption: getOptionUpdater(dialog.options)
  };
}
function getCtx() {
  const { NAME } = getDialogData();
  return getContext(NAME);
}
const Dialog = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $idValues, $$unsubscribe_idValues;
  let { preventScroll = void 0 } = $$props;
  let { closeOnEscape = void 0 } = $$props;
  let { closeOnOutsideClick = void 0 } = $$props;
  let { portal = void 0 } = $$props;
  let { open = void 0 } = $$props;
  let { onOpenChange = void 0 } = $$props;
  let { openFocus = void 0 } = $$props;
  let { closeFocus = void 0 } = $$props;
  let { onOutsideClick = void 0 } = $$props;
  const { states: { open: localOpen }, updateOption, ids } = setCtx$1({
    closeOnEscape,
    preventScroll,
    closeOnOutsideClick,
    portal,
    forceVisible: true,
    defaultOpen: open,
    openFocus,
    closeFocus,
    onOutsideClick,
    onOpenChange: ({ next }) => {
      if (open !== next) {
        onOpenChange?.(next);
        open = next;
      }
      return next;
    }
  });
  const idValues = derived([ids.content, ids.description, ids.title], ([$contentId, $descriptionId, $titleId]) => ({
    content: $contentId,
    description: $descriptionId,
    title: $titleId
  }));
  $$unsubscribe_idValues = subscribe(idValues, (value) => $idValues = value);
  if ($$props.preventScroll === void 0 && $$bindings.preventScroll && preventScroll !== void 0)
    $$bindings.preventScroll(preventScroll);
  if ($$props.closeOnEscape === void 0 && $$bindings.closeOnEscape && closeOnEscape !== void 0)
    $$bindings.closeOnEscape(closeOnEscape);
  if ($$props.closeOnOutsideClick === void 0 && $$bindings.closeOnOutsideClick && closeOnOutsideClick !== void 0)
    $$bindings.closeOnOutsideClick(closeOnOutsideClick);
  if ($$props.portal === void 0 && $$bindings.portal && portal !== void 0)
    $$bindings.portal(portal);
  if ($$props.open === void 0 && $$bindings.open && open !== void 0)
    $$bindings.open(open);
  if ($$props.onOpenChange === void 0 && $$bindings.onOpenChange && onOpenChange !== void 0)
    $$bindings.onOpenChange(onOpenChange);
  if ($$props.openFocus === void 0 && $$bindings.openFocus && openFocus !== void 0)
    $$bindings.openFocus(openFocus);
  if ($$props.closeFocus === void 0 && $$bindings.closeFocus && closeFocus !== void 0)
    $$bindings.closeFocus(closeFocus);
  if ($$props.onOutsideClick === void 0 && $$bindings.onOutsideClick && onOutsideClick !== void 0)
    $$bindings.onOutsideClick(onOutsideClick);
  open !== void 0 && localOpen.set(open);
  {
    updateOption("preventScroll", preventScroll);
  }
  {
    updateOption("closeOnEscape", closeOnEscape);
  }
  {
    updateOption("closeOnOutsideClick", closeOnOutsideClick);
  }
  {
    updateOption("portal", portal);
  }
  {
    updateOption("openFocus", openFocus);
  }
  {
    updateOption("closeFocus", closeFocus);
  }
  {
    updateOption("onOutsideClick", onOutsideClick);
  }
  $$unsubscribe_idValues();
  return `${slots.default ? slots.default({ ids: $idValues }) : ``}`;
});
const Dialog_title = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder2;
  let $$restProps = compute_rest_props($$props, ["level", "asChild", "id", "el"]);
  let $title, $$unsubscribe_title;
  let { level = "h2" } = $$props;
  let { asChild = false } = $$props;
  let { id = void 0 } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { title }, ids, getAttrs: getAttrs2 } = getCtx();
  $$unsubscribe_title = subscribe(title, (value) => $title = value);
  const attrs = getAttrs2("title");
  if ($$props.level === void 0 && $$bindings.level && level !== void 0)
    $$bindings.level(level);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  {
    if (id) {
      ids.title.set(id);
    }
  }
  builder2 = $title;
  {
    Object.assign(builder2, attrs);
  }
  $$unsubscribe_title();
  return `${asChild ? `${slots.default ? slots.default({ builder: builder2 }) : ``}` : `${((tag) => {
    return tag ? `<${level}${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${is_void(tag) ? "" : `${slots.default ? slots.default({ builder: builder2 }) : ``}`}${is_void(tag) ? "" : `</${tag}>`}` : "";
  })(level)}`}`;
});
const Dialog_close = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder2;
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let $close, $$unsubscribe_close;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { close }, getAttrs: getAttrs2 } = getCtx();
  $$unsubscribe_close = subscribe(close, (value) => $close = value);
  createDispatcher();
  const attrs = getAttrs2("close");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  builder2 = $close;
  {
    Object.assign(builder2, attrs);
  }
  $$unsubscribe_close();
  return `${asChild ? `${slots.default ? slots.default({ builder: builder2 }) : ``}` : `<button${spread([escape_object(builder2), { type: "button" }, escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder: builder2 }) : ``}</button>`}`;
});
const Dialog_portal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder2;
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let $portalled, $$unsubscribe_portalled;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { portalled }, getAttrs: getAttrs2 } = getCtx();
  $$unsubscribe_portalled = subscribe(portalled, (value) => $portalled = value);
  const attrs = getAttrs2("portal");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  builder2 = $portalled;
  {
    Object.assign(builder2, attrs);
  }
  $$unsubscribe_portalled();
  return `${asChild ? `${slots.default ? slots.default({ builder: builder2 }) : ``}` : `<div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>`}`;
});
const Dialog_content = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder2;
  let $$restProps = compute_rest_props($$props, [
    "transition",
    "transitionConfig",
    "inTransition",
    "inTransitionConfig",
    "outTransition",
    "outTransitionConfig",
    "asChild",
    "id",
    "el"
  ]);
  let $content, $$unsubscribe_content;
  let $open, $$unsubscribe_open;
  let { transition = void 0 } = $$props;
  let { transitionConfig = void 0 } = $$props;
  let { inTransition = void 0 } = $$props;
  let { inTransitionConfig = void 0 } = $$props;
  let { outTransition = void 0 } = $$props;
  let { outTransitionConfig = void 0 } = $$props;
  let { asChild = false } = $$props;
  let { id = void 0 } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { content }, states: { open }, ids, getAttrs: getAttrs2 } = getCtx();
  $$unsubscribe_content = subscribe(content, (value) => $content = value);
  $$unsubscribe_open = subscribe(open, (value) => $open = value);
  const attrs = getAttrs2("content");
  if ($$props.transition === void 0 && $$bindings.transition && transition !== void 0)
    $$bindings.transition(transition);
  if ($$props.transitionConfig === void 0 && $$bindings.transitionConfig && transitionConfig !== void 0)
    $$bindings.transitionConfig(transitionConfig);
  if ($$props.inTransition === void 0 && $$bindings.inTransition && inTransition !== void 0)
    $$bindings.inTransition(inTransition);
  if ($$props.inTransitionConfig === void 0 && $$bindings.inTransitionConfig && inTransitionConfig !== void 0)
    $$bindings.inTransitionConfig(inTransitionConfig);
  if ($$props.outTransition === void 0 && $$bindings.outTransition && outTransition !== void 0)
    $$bindings.outTransition(outTransition);
  if ($$props.outTransitionConfig === void 0 && $$bindings.outTransitionConfig && outTransitionConfig !== void 0)
    $$bindings.outTransitionConfig(outTransitionConfig);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  {
    if (id) {
      ids.content.set(id);
    }
  }
  builder2 = $content;
  {
    Object.assign(builder2, attrs);
  }
  $$unsubscribe_content();
  $$unsubscribe_open();
  return `${asChild && $open ? `${slots.default ? slots.default({ builder: builder2 }) : ``}` : `${transition && $open ? `<div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>` : `${inTransition && outTransition && $open ? `<div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>` : `${inTransition && $open ? `<div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>` : `${outTransition && $open ? `<div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>` : `${$open ? `<div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>` : ``}`}`}`}`}`}`;
});
const Dialog_overlay = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder2;
  let $$restProps = compute_rest_props($$props, [
    "transition",
    "transitionConfig",
    "inTransition",
    "inTransitionConfig",
    "outTransition",
    "outTransitionConfig",
    "asChild",
    "el"
  ]);
  let $overlay, $$unsubscribe_overlay;
  let $open, $$unsubscribe_open;
  let { transition = void 0 } = $$props;
  let { transitionConfig = void 0 } = $$props;
  let { inTransition = void 0 } = $$props;
  let { inTransitionConfig = void 0 } = $$props;
  let { outTransition = void 0 } = $$props;
  let { outTransitionConfig = void 0 } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { overlay }, states: { open }, getAttrs: getAttrs2 } = getCtx();
  $$unsubscribe_overlay = subscribe(overlay, (value) => $overlay = value);
  $$unsubscribe_open = subscribe(open, (value) => $open = value);
  const attrs = getAttrs2("overlay");
  if ($$props.transition === void 0 && $$bindings.transition && transition !== void 0)
    $$bindings.transition(transition);
  if ($$props.transitionConfig === void 0 && $$bindings.transitionConfig && transitionConfig !== void 0)
    $$bindings.transitionConfig(transitionConfig);
  if ($$props.inTransition === void 0 && $$bindings.inTransition && inTransition !== void 0)
    $$bindings.inTransition(inTransition);
  if ($$props.inTransitionConfig === void 0 && $$bindings.inTransitionConfig && inTransitionConfig !== void 0)
    $$bindings.inTransitionConfig(inTransitionConfig);
  if ($$props.outTransition === void 0 && $$bindings.outTransition && outTransition !== void 0)
    $$bindings.outTransition(outTransition);
  if ($$props.outTransitionConfig === void 0 && $$bindings.outTransitionConfig && outTransitionConfig !== void 0)
    $$bindings.outTransitionConfig(outTransitionConfig);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  builder2 = $overlay;
  {
    Object.assign(builder2, attrs);
  }
  $$unsubscribe_overlay();
  $$unsubscribe_open();
  return `${asChild && $open ? `${slots.default ? slots.default({ builder: builder2 }) : ``}` : `${transition && $open ? ` <div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}></div>` : `${inTransition && outTransition && $open ? ` <div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}></div>` : `${inTransition && $open ? ` <div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}></div>` : `${outTransition && $open ? ` <div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}></div>` : `${$open ? ` <div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}></div>` : ``}`}`}`}`}`}`;
});
const Dialog_trigger = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder2;
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let $trigger, $$unsubscribe_trigger;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { trigger }, getAttrs: getAttrs2 } = getCtx();
  $$unsubscribe_trigger = subscribe(trigger, (value) => $trigger = value);
  createDispatcher();
  const attrs = getAttrs2("trigger");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  builder2 = $trigger;
  {
    Object.assign(builder2, attrs);
  }
  $$unsubscribe_trigger();
  return `${asChild ? `${slots.default ? slots.default({ builder: builder2 }) : ``}` : `<button${spread([escape_object(builder2), { type: "button" }, escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder: builder2 }) : ``}</button>`}`;
});
const Dialog_description = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder2;
  let $$restProps = compute_rest_props($$props, ["asChild", "id", "el"]);
  let $description, $$unsubscribe_description;
  let { asChild = false } = $$props;
  let { id = void 0 } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { description }, ids, getAttrs: getAttrs2 } = getCtx();
  $$unsubscribe_description = subscribe(description, (value) => $description = value);
  const attrs = getAttrs2("description");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  {
    if (id) {
      ids.description.set(id);
    }
  }
  builder2 = $description;
  {
    Object.assign(builder2, attrs);
  }
  $$unsubscribe_description();
  return `${asChild ? `${slots.default ? slots.default({ builder: builder2 }) : ``}` : `<div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>`}`;
});
function getSeparatorData() {
  const NAME = "separator";
  const PARTS = ["root"];
  return {
    NAME,
    PARTS
  };
}
function setCtx(props) {
  const { NAME, PARTS } = getSeparatorData();
  const getAttrs2 = createBitAttrs(NAME, PARTS);
  const separator2 = { ...createSeparator(removeUndefined(props)), getAttrs: getAttrs2 };
  return {
    ...separator2,
    updateOption: getOptionUpdater(separator2.options)
  };
}
const Separator$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder2;
  let $$restProps = compute_rest_props($$props, ["orientation", "decorative", "asChild", "el"]);
  let $root, $$unsubscribe_root;
  let { orientation = "horizontal" } = $$props;
  let { decorative = true } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { root }, updateOption, getAttrs: getAttrs2 } = setCtx({ orientation, decorative });
  $$unsubscribe_root = subscribe(root, (value) => $root = value);
  const attrs = getAttrs2("root");
  if ($$props.orientation === void 0 && $$bindings.orientation && orientation !== void 0)
    $$bindings.orientation(orientation);
  if ($$props.decorative === void 0 && $$bindings.decorative && decorative !== void 0)
    $$bindings.decorative(decorative);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  {
    updateOption("orientation", orientation);
  }
  {
    updateOption("decorative", decorative);
  }
  builder2 = $root;
  {
    Object.assign(builder2, attrs);
  }
  $$unsubscribe_root();
  return `${asChild ? `${slots.default ? slots.default({ builder: builder2 }) : ``}` : `<div${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}></div>`}`;
});
const Button = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "variant", "size", "builders"]);
  let { class: className = void 0 } = $$props;
  let { variant = "default" } = $$props;
  let { size = "default" } = $$props;
  let { builders = [] } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.variant === void 0 && $$bindings.variant && variant !== void 0)
    $$bindings.variant(variant);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.builders === void 0 && $$bindings.builders && builders !== void 0)
    $$bindings.builders(builders);
  return `${validate_component(Button$1, "ButtonPrimitive.Root").$$render(
    $$result,
    Object.assign(
      {},
      { builders },
      {
        class: cn(buttonVariants({ variant, size, className }))
      },
      { type: "button" },
      $$restProps
    ),
    {},
    {
      default: () => {
        return `${slots.default ? slots.default({}) : ``}`;
      }
    }
  )}`;
});
const buttonVariants = tv({
  base: "inline-flex items-center justify-center rounded-md text-sm font-medium whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline"
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
});
const X = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [["path", { "d": "M18 6 6 18" }], ["path", { "d": "m6 6 12 12" }]];
  return `  ${validate_component(Icon$1, "Icon").$$render($$result, Object.assign({}, { name: "x" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const X$1 = X;
const AccountSummary = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let accounts;
  let $accounts, $$unsubscribe_accounts = noop$1, $$subscribe_accounts = () => ($$unsubscribe_accounts(), $$unsubscribe_accounts = subscribe(accounts, ($$value) => $accounts = $$value), accounts);
  let selectedAccount;
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$subscribe_accounts(accounts = allAddresses);
    $$rendered = `<div class="flex flex-col space-y-2 rounded-xl border p-3">${validate_component(Label, "Label").$$render($$result, { class: "text-white" }, {}, {
      default: () => {
        return `Account Details`;
      }
    })} <div class="flex flex-row space-x-3"> ${validate_component(Root$2, "Select.Root").$$render(
      $$result,
      { portal: null, selected: selectedAccount },
      {
        selected: ($$value) => {
          selectedAccount = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${validate_component(Select_trigger, "Select.Trigger").$$render($$result, { class: "w-[250px]" }, {}, {
            default: () => {
              return `${validate_component(Value, "Select.Value").$$render(
                $$result,
                {
                  placeholder: "Select Account",
                  class: "text-white"
                },
                {},
                {}
              )}`;
            }
          })} ${validate_component(Select_content, "Select.Content").$$render($$result, {}, {}, {
            default: () => {
              return `${validate_component(Group, "Select.Group").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Select_label, "Select.Label").$$render($$result, {}, {}, {
                    default: () => {
                      return `Accounts`;
                    }
                  })} ${each($accounts, (account) => {
                    return `${validate_component(Select_item, "Select.Item").$$render(
                      $$result,
                      {
                        class: "m-2",
                        value: account,
                        label: account.address.substring(0, 5) + "..." + account.address.substring(account.address.length - 5, account.address.length)
                      },
                      {},
                      {
                        default: () => {
                          return `<div class="flex flex-col space-y-2">${validate_component(Label, "Label").$$render($$result, {}, {}, {
                            default: () => {
                              return `${escape(account.address.substring(0, 5))}...${escape(account.address.substring(account.address.length - 5, account.address.length))}`;
                            }
                          })} ${validate_component(Label, "Label").$$render($$result, {}, {}, {
                            default: () => {
                              return `ETH ${escape(parseFloat(account.balance).toFixed(5))}`;
                            }
                          })}</div> `;
                        }
                      }
                    )}`;
                  })}`;
                }
              })}`;
            }
          })} ${validate_component(Input$1, "Select.Input").$$render($$result, { name: "selectedAccount" }, {}, {})}`;
        }
      }
    )} ${selectedAccount != void 0 ? `<div class="flex flex-row rounded-xl border text-white">${validate_component(Button, "Button").$$render(
      $$result,
      {
        variant: "ghost",
        class: "bg-slate-400"
      },
      {},
      {
        default: () => {
          return `Tokens`;
        }
      }
    )} ${validate_component(Button, "Button").$$render(
      $$result,
      {
        variant: "ghost",
        class: "bg-transparent"
      },
      {},
      {
        default: () => {
          return `NFTS`;
        }
      }
    )} ${validate_component(Button, "Button").$$render(
      $$result,
      {
        variant: "ghost",
        class: "bg-transparent"
      },
      {},
      {
        default: () => {
          return `Receipts`;
        }
      }
    )}</div>` : ``}</div> ${selectedAccount != void 0 ? `${`${validate_component(AccountTable, "AccountTable").$$render(
      $$result,
      {
        table: {
          caption: "Tokens your account holds",
          headers: ["index", "name", "quantity", "value"],
          data: [
            ...selectedAccount.value.tokens.map((token, index) => [
              (index + 1).toString(),
              token.token.name,
              parseFloat(token.balance).toFixed(5).toString(),
              (parseFloat(token.token.exchange_rate) * parseInt(token.balance)).toFixed(5)
            ])
          ]
        }
      },
      {},
      {}
    )}`}` : `<div class="text-white" data-svelte-h="svelte-251zjt">Select an accout to view the details</div>`}</div>`;
  } while (!$$settled);
  $$unsubscribe_accounts();
  return $$rendered;
});
const Input = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "value"]);
  let { class: className = void 0 } = $$props;
  let { value = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  return `<input${spread(
    [
      {
        class: escape_attribute_value(cn("flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0  file:bg-transparent file:text-foreground file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("value", value, 0)}>`;
});
function writableDerived(origins, derive, reflect, initial) {
  var childDerivedSetter, originValues, blockNextDerive = false;
  var reflectOldValues = reflect.length >= 2;
  var wrappedDerive = (got, set, update3) => {
    childDerivedSetter = set;
    if (reflectOldValues) {
      originValues = got;
    }
    if (!blockNextDerive) {
      let returned = derive(got, set, update3);
      if (derive.length < 2) {
        set(returned);
      } else {
        return returned;
      }
    }
    blockNextDerive = false;
  };
  var childDerived = derived(origins, wrappedDerive, initial);
  var singleOrigin = !Array.isArray(origins);
  function doReflect(reflecting) {
    var setWith = reflect(reflecting, originValues);
    if (singleOrigin) {
      blockNextDerive = true;
      origins.set(setWith);
    } else {
      setWith.forEach((value, i) => {
        blockNextDerive = true;
        origins[i].set(value);
      });
    }
    blockNextDerive = false;
  }
  var tryingSet = false;
  function update2(fn) {
    var isUpdated, mutatedBySubscriptions, oldValue, newValue;
    if (tryingSet) {
      newValue = fn(get_store_value(childDerived));
      childDerivedSetter(newValue);
      return;
    }
    var unsubscribe = childDerived.subscribe((value) => {
      if (!tryingSet) {
        oldValue = value;
      } else if (!isUpdated) {
        isUpdated = true;
      } else {
        mutatedBySubscriptions = true;
      }
    });
    newValue = fn(oldValue);
    tryingSet = true;
    childDerivedSetter(newValue);
    unsubscribe();
    tryingSet = false;
    if (mutatedBySubscriptions) {
      newValue = get_store_value(childDerived);
    }
    if (isUpdated) {
      doReflect(newValue);
    }
  }
  return {
    subscribe: childDerived.subscribe,
    set(value) {
      update2(() => value);
    },
    update: update2
  };
}
const TOAST_LIMIT = 20;
const toasts = writable([]);
const pausedAt = writable(null);
const toastTimeouts = /* @__PURE__ */ new Map();
const addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    remove(toastId);
  }, 1e3);
  toastTimeouts.set(toastId, timeout);
};
const clearFromRemoveQueue = (toastId) => {
  const timeout = toastTimeouts.get(toastId);
  if (timeout) {
    clearTimeout(timeout);
  }
};
function update(toast2) {
  if (toast2.id) {
    clearFromRemoveQueue(toast2.id);
  }
  toasts.update(($toasts) => $toasts.map((t) => t.id === toast2.id ? { ...t, ...toast2 } : t));
}
function add(toast2) {
  toasts.update(($toasts) => [toast2, ...$toasts].slice(0, TOAST_LIMIT));
}
function upsert(toast2) {
  if (get_store_value(toasts).find((t) => t.id === toast2.id)) {
    update(toast2);
  } else {
    add(toast2);
  }
}
function dismiss(toastId) {
  toasts.update(($toasts) => {
    if (toastId) {
      addToRemoveQueue(toastId);
    } else {
      $toasts.forEach((toast2) => {
        addToRemoveQueue(toast2.id);
      });
    }
    return $toasts.map((t) => t.id === toastId || toastId === void 0 ? { ...t, visible: false } : t);
  });
}
function remove(toastId) {
  toasts.update(($toasts) => {
    if (toastId === void 0) {
      return [];
    }
    return $toasts.filter((t) => t.id !== toastId);
  });
}
function startPause(time) {
  pausedAt.set(time);
}
function endPause(time) {
  let diff;
  pausedAt.update(($pausedAt) => {
    diff = time - ($pausedAt || 0);
    return null;
  });
  toasts.update(($toasts) => $toasts.map((t) => ({
    ...t,
    pauseDuration: t.pauseDuration + diff
  })));
}
const defaultTimeouts = {
  blank: 4e3,
  error: 4e3,
  success: 2e3,
  loading: Infinity,
  custom: 4e3
};
function useToasterStore(toastOptions = {}) {
  const mergedToasts = writableDerived(toasts, ($toasts) => $toasts.map((t) => ({
    ...toastOptions,
    ...toastOptions[t.type],
    ...t,
    duration: t.duration || toastOptions[t.type]?.duration || toastOptions?.duration || defaultTimeouts[t.type],
    style: [toastOptions.style, toastOptions[t.type]?.style, t.style].join(";")
  })), ($toasts) => $toasts);
  return {
    toasts: mergedToasts,
    pausedAt
  };
}
const isFunction = (valOrFunction) => typeof valOrFunction === "function";
const resolveValue = (valOrFunction, arg) => isFunction(valOrFunction) ? valOrFunction(arg) : valOrFunction;
const genId = /* @__PURE__ */ (() => {
  let count = 0;
  return () => {
    count += 1;
    return count.toString();
  };
})();
const prefersReducedMotion = /* @__PURE__ */ (() => {
  let shouldReduceMotion;
  return () => {
    if (shouldReduceMotion === void 0 && typeof window !== "undefined") {
      const mediaQuery = matchMedia("(prefers-reduced-motion: reduce)");
      shouldReduceMotion = !mediaQuery || mediaQuery.matches;
    }
    return shouldReduceMotion;
  };
})();
const createToast = (message, type = "blank", opts) => ({
  createdAt: Date.now(),
  visible: true,
  type,
  ariaProps: {
    role: "status",
    "aria-live": "polite"
  },
  message,
  pauseDuration: 0,
  ...opts,
  id: opts?.id || genId()
});
const createHandler = (type) => (message, options) => {
  const toast2 = createToast(message, type, options);
  upsert(toast2);
  return toast2.id;
};
const toast = (message, opts) => createHandler("blank")(message, opts);
toast.error = createHandler("error");
toast.success = createHandler("success");
toast.loading = createHandler("loading");
toast.custom = createHandler("custom");
toast.dismiss = (toastId) => {
  dismiss(toastId);
};
toast.remove = (toastId) => remove(toastId);
toast.promise = (promise, msgs, opts) => {
  const id = toast.loading(msgs.loading, { ...opts, ...opts?.loading });
  promise.then((p) => {
    toast.success(resolveValue(msgs.success, p), {
      id,
      ...opts,
      ...opts?.success
    });
    return p;
  }).catch((e) => {
    toast.error(resolveValue(msgs.error, e), {
      id,
      ...opts,
      ...opts?.error
    });
  });
  return promise;
};
function calculateOffset(toast2, $toasts, opts) {
  const { reverseOrder, gutter = 8, defaultPosition } = opts || {};
  const relevantToasts = $toasts.filter((t) => (t.position || defaultPosition) === (toast2.position || defaultPosition) && t.height);
  const toastIndex = relevantToasts.findIndex((t) => t.id === toast2.id);
  const toastsBefore = relevantToasts.filter((toast3, i) => i < toastIndex && toast3.visible).length;
  const offset = relevantToasts.filter((t) => t.visible).slice(...reverseOrder ? [toastsBefore + 1] : [0, toastsBefore]).reduce((acc, t) => acc + (t.height || 0) + gutter, 0);
  return offset;
}
const handlers = {
  startPause() {
    startPause(Date.now());
  },
  endPause() {
    endPause(Date.now());
  },
  updateHeight: (toastId, height) => {
    update({ id: toastId, height });
  },
  calculateOffset
};
function useToaster(toastOptions) {
  const { toasts: toasts2, pausedAt: pausedAt2 } = useToasterStore(toastOptions);
  const timeouts = /* @__PURE__ */ new Map();
  let _pausedAt;
  const unsubscribes = [
    pausedAt2.subscribe(($pausedAt) => {
      if ($pausedAt) {
        for (const [, timeoutId] of timeouts) {
          clearTimeout(timeoutId);
        }
        timeouts.clear();
      }
      _pausedAt = $pausedAt;
    }),
    toasts2.subscribe(($toasts) => {
      if (_pausedAt) {
        return;
      }
      const now = Date.now();
      for (const t of $toasts) {
        if (timeouts.has(t.id)) {
          continue;
        }
        if (t.duration === Infinity) {
          continue;
        }
        const durationLeft = (t.duration || 0) + t.pauseDuration - (now - t.createdAt);
        if (durationLeft < 0) {
          if (t.visible) {
            toast.dismiss(t.id);
          }
          return null;
        }
        timeouts.set(t.id, setTimeout(() => toast.dismiss(t.id), durationLeft));
      }
    })
  ];
  onDestroy(() => {
    for (const unsubscribe of unsubscribes) {
      unsubscribe();
    }
  });
  return { toasts: toasts2, handlers };
}
const css$8 = {
  code: "div.svelte-11kvm4p{width:20px;opacity:0;height:20px;border-radius:10px;background:var(--primary, #61d345);position:relative;transform:rotate(45deg);animation:svelte-11kvm4p-circleAnimation 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;animation-delay:100ms}div.svelte-11kvm4p::after{content:'';box-sizing:border-box;animation:svelte-11kvm4p-checkmarkAnimation 0.2s ease-out forwards;opacity:0;animation-delay:200ms;position:absolute;border-right:2px solid;border-bottom:2px solid;border-color:var(--secondary, #fff);bottom:6px;left:6px;height:10px;width:6px}@keyframes svelte-11kvm4p-circleAnimation{from{transform:scale(0) rotate(45deg);opacity:0}to{transform:scale(1) rotate(45deg);opacity:1}}@keyframes svelte-11kvm4p-checkmarkAnimation{0%{height:0;width:0;opacity:0}40%{height:0;width:6px;opacity:1}100%{opacity:1;height:10px}}",
  map: null
};
const CheckmarkIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { primary = "#61d345" } = $$props;
  let { secondary = "#fff" } = $$props;
  if ($$props.primary === void 0 && $$bindings.primary && primary !== void 0)
    $$bindings.primary(primary);
  if ($$props.secondary === void 0 && $$bindings.secondary && secondary !== void 0)
    $$bindings.secondary(secondary);
  $$result.css.add(css$8);
  return `  <div class="svelte-11kvm4p"${add_styles({
    "--primary": primary,
    "--secondary": secondary
  })}></div>`;
});
const css$7 = {
  code: "div.svelte-1ee93ns{width:20px;opacity:0;height:20px;border-radius:10px;background:var(--primary, #ff4b4b);position:relative;transform:rotate(45deg);animation:svelte-1ee93ns-circleAnimation 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;animation-delay:100ms}div.svelte-1ee93ns::after,div.svelte-1ee93ns::before{content:'';animation:svelte-1ee93ns-firstLineAnimation 0.15s ease-out forwards;animation-delay:150ms;position:absolute;border-radius:3px;opacity:0;background:var(--secondary, #fff);bottom:9px;left:4px;height:2px;width:12px}div.svelte-1ee93ns:before{animation:svelte-1ee93ns-secondLineAnimation 0.15s ease-out forwards;animation-delay:180ms;transform:rotate(90deg)}@keyframes svelte-1ee93ns-circleAnimation{from{transform:scale(0) rotate(45deg);opacity:0}to{transform:scale(1) rotate(45deg);opacity:1}}@keyframes svelte-1ee93ns-firstLineAnimation{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}@keyframes svelte-1ee93ns-secondLineAnimation{from{transform:scale(0) rotate(90deg);opacity:0}to{transform:scale(1) rotate(90deg);opacity:1}}",
  map: null
};
const ErrorIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { primary = "#ff4b4b" } = $$props;
  let { secondary = "#fff" } = $$props;
  if ($$props.primary === void 0 && $$bindings.primary && primary !== void 0)
    $$bindings.primary(primary);
  if ($$props.secondary === void 0 && $$bindings.secondary && secondary !== void 0)
    $$bindings.secondary(secondary);
  $$result.css.add(css$7);
  return `  <div class="svelte-1ee93ns"${add_styles({
    "--primary": primary,
    "--secondary": secondary
  })}></div>`;
});
const css$6 = {
  code: "div.svelte-1j7dflg{width:12px;height:12px;box-sizing:border-box;border:2px solid;border-radius:100%;border-color:var(--secondary, #e0e0e0);border-right-color:var(--primary, #616161);animation:svelte-1j7dflg-rotate 1s linear infinite}@keyframes svelte-1j7dflg-rotate{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}",
  map: null
};
const LoaderIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { primary = "#616161" } = $$props;
  let { secondary = "#e0e0e0" } = $$props;
  if ($$props.primary === void 0 && $$bindings.primary && primary !== void 0)
    $$bindings.primary(primary);
  if ($$props.secondary === void 0 && $$bindings.secondary && secondary !== void 0)
    $$bindings.secondary(secondary);
  $$result.css.add(css$6);
  return `  <div class="svelte-1j7dflg"${add_styles({
    "--primary": primary,
    "--secondary": secondary
  })}></div>`;
});
const css$5 = {
  code: ".indicator.svelte-1kgeier{position:relative;display:flex;justify-content:center;align-items:center;min-width:20px;min-height:20px}.status.svelte-1kgeier{position:absolute}.animated.svelte-1kgeier{position:relative;transform:scale(0.6);opacity:0.4;min-width:20px;animation:svelte-1kgeier-enter 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards}@keyframes svelte-1kgeier-enter{from{transform:scale(0.6);opacity:0.4}to{transform:scale(1);opacity:1}}",
  map: null
};
const ToastIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let type;
  let icon;
  let iconTheme;
  let { toast: toast2 } = $$props;
  if ($$props.toast === void 0 && $$bindings.toast && toast2 !== void 0)
    $$bindings.toast(toast2);
  $$result.css.add(css$5);
  ({ type, icon, iconTheme } = toast2);
  return `${typeof icon === "string" ? `<div class="animated svelte-1kgeier">${escape(icon)}</div>` : `${typeof icon !== "undefined" ? `${validate_component(icon || missing_component, "svelte:component").$$render($$result, {}, {}, {})}` : `${type !== "blank" ? `<div class="indicator svelte-1kgeier">${validate_component(LoaderIcon, "LoaderIcon").$$render($$result, Object.assign({}, iconTheme), {}, {})} ${type !== "loading" ? `<div class="status svelte-1kgeier">${type === "error" ? `${validate_component(ErrorIcon, "ErrorIcon").$$render($$result, Object.assign({}, iconTheme), {}, {})}` : `${validate_component(CheckmarkIcon, "CheckmarkIcon").$$render($$result, Object.assign({}, iconTheme), {}, {})}`}</div>` : ``}</div>` : ``}`}`}`;
});
const css$4 = {
  code: ".message.svelte-1nauejd{display:flex;justify-content:center;margin:4px 10px;color:inherit;flex:1 1 auto;white-space:pre-line}",
  map: null
};
const ToastMessage = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { toast: toast2 } = $$props;
  if ($$props.toast === void 0 && $$bindings.toast && toast2 !== void 0)
    $$bindings.toast(toast2);
  $$result.css.add(css$4);
  return `<div${spread([{ class: "message" }, escape_object(toast2.ariaProps)], { classes: "svelte-1nauejd" })}>${typeof toast2.message === "string" ? `${escape(toast2.message)}` : `${validate_component(toast2.message || missing_component, "svelte:component").$$render($$result, { toast: toast2 }, {}, {})}`} </div>`;
});
const css$3 = {
  code: "@keyframes svelte-ug60r4-enterAnimation{0%{transform:translate3d(0, calc(var(--factor) * -200%), 0) scale(0.6);opacity:0.5}100%{transform:translate3d(0, 0, 0) scale(1);opacity:1}}@keyframes svelte-ug60r4-exitAnimation{0%{transform:translate3d(0, 0, -1px) scale(1);opacity:1}100%{transform:translate3d(0, calc(var(--factor) * -150%), -1px) scale(0.6);opacity:0}}@keyframes svelte-ug60r4-fadeInAnimation{0%{opacity:0}100%{opacity:1}}@keyframes svelte-ug60r4-fadeOutAnimation{0%{opacity:1}100%{opacity:0}}.base.svelte-ug60r4{display:flex;align-items:center;background:#fff;color:#363636;line-height:1.3;will-change:transform;box-shadow:0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);max-width:350px;pointer-events:auto;padding:8px 10px;border-radius:8px}.transparent.svelte-ug60r4{opacity:0}.enter.svelte-ug60r4{animation:svelte-ug60r4-enterAnimation 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) forwards}.exit.svelte-ug60r4{animation:svelte-ug60r4-exitAnimation 0.4s cubic-bezier(0.06, 0.71, 0.55, 1) forwards}.fadeIn.svelte-ug60r4{animation:svelte-ug60r4-fadeInAnimation 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) forwards}.fadeOut.svelte-ug60r4{animation:svelte-ug60r4-fadeOutAnimation 0.4s cubic-bezier(0.06, 0.71, 0.55, 1) forwards}",
  map: null
};
const ToastBar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { toast: toast2 } = $$props;
  let { position = void 0 } = $$props;
  let { style = "" } = $$props;
  let { Component = void 0 } = $$props;
  let factor;
  let animation;
  if ($$props.toast === void 0 && $$bindings.toast && toast2 !== void 0)
    $$bindings.toast(toast2);
  if ($$props.position === void 0 && $$bindings.position && position !== void 0)
    $$bindings.position(position);
  if ($$props.style === void 0 && $$bindings.style && style !== void 0)
    $$bindings.style(style);
  if ($$props.Component === void 0 && $$bindings.Component && Component !== void 0)
    $$bindings.Component(Component);
  $$result.css.add(css$3);
  {
    {
      const top = (toast2.position || position || "top-center").includes("top");
      factor = top ? 1 : -1;
      const [enter, exit] = prefersReducedMotion() ? ["fadeIn", "fadeOut"] : ["enter", "exit"];
      animation = toast2.visible ? enter : exit;
    }
  }
  return `<div class="${"base " + escape(toast2.height ? animation : "transparent", true) + " " + escape(toast2.className || "", true) + " svelte-ug60r4"}"${add_styles(merge_ssr_styles(escape(style, true) + "; " + escape(toast2.style, true), { "--factor": factor }))}>${Component ? `${validate_component(Component || missing_component, "svelte:component").$$render($$result, {}, {}, {
    message: () => {
      return `${validate_component(ToastMessage, "ToastMessage").$$render($$result, { toast: toast2, slot: "message" }, {}, {})}`;
    },
    icon: () => {
      return `${validate_component(ToastIcon, "ToastIcon").$$render($$result, { toast: toast2, slot: "icon" }, {}, {})}`;
    }
  })}` : `${slots.default ? slots.default({ ToastIcon, ToastMessage, toast: toast2 }) : ` ${validate_component(ToastIcon, "ToastIcon").$$render($$result, { toast: toast2 }, {}, {})} ${validate_component(ToastMessage, "ToastMessage").$$render($$result, { toast: toast2 }, {}, {})} `}`} </div>`;
});
const css$2 = {
  code: ".wrapper.svelte-v01oml{left:0;right:0;display:flex;position:absolute;transform:translateY(calc(var(--offset, 16px) * var(--factor) * 1px))}.transition.svelte-v01oml{transition:all 230ms cubic-bezier(0.21, 1.02, 0.73, 1)}.active.svelte-v01oml{z-index:9999}.active.svelte-v01oml>*{pointer-events:auto}",
  map: null
};
const ToastWrapper = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let top;
  let bottom;
  let factor;
  let justifyContent;
  let { toast: toast2 } = $$props;
  let { setHeight } = $$props;
  let wrapperEl;
  if ($$props.toast === void 0 && $$bindings.toast && toast2 !== void 0)
    $$bindings.toast(toast2);
  if ($$props.setHeight === void 0 && $$bindings.setHeight && setHeight !== void 0)
    $$bindings.setHeight(setHeight);
  $$result.css.add(css$2);
  top = toast2.position?.includes("top") ? 0 : null;
  bottom = toast2.position?.includes("bottom") ? 0 : null;
  factor = toast2.position?.includes("top") ? 1 : -1;
  justifyContent = toast2.position?.includes("center") && "center" || (toast2.position?.includes("right") || toast2.position?.includes("end")) && "flex-end" || null;
  return `<div class="${[
    "wrapper svelte-v01oml",
    (toast2.visible ? "active" : "") + " " + (!prefersReducedMotion() ? "transition" : "")
  ].join(" ").trim()}"${add_styles({
    "--factor": factor,
    "--offset": toast2.offset,
    top,
    bottom,
    "justify-content": justifyContent
  })}${add_attribute("this", wrapperEl, 0)}>${toast2.type === "custom" ? `${validate_component(ToastMessage, "ToastMessage").$$render($$result, { toast: toast2 }, {}, {})}` : `${slots.default ? slots.default({ toast: toast2 }) : ` ${validate_component(ToastBar, "ToastBar").$$render($$result, { toast: toast2, position: toast2.position }, {}, {})} `}`} </div>`;
});
const css$1 = {
  code: ".toaster.svelte-1phplh9{--default-offset:16px;position:fixed;z-index:9999;top:var(--default-offset);left:var(--default-offset);right:var(--default-offset);bottom:var(--default-offset);pointer-events:none}",
  map: null
};
const Toaster = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $toasts, $$unsubscribe_toasts;
  let { reverseOrder = false } = $$props;
  let { position = "top-center" } = $$props;
  let { toastOptions = void 0 } = $$props;
  let { gutter = 8 } = $$props;
  let { containerStyle = void 0 } = $$props;
  let { containerClassName = void 0 } = $$props;
  const { toasts: toasts2, handlers: handlers2 } = useToaster(toastOptions);
  $$unsubscribe_toasts = subscribe(toasts2, (value) => $toasts = value);
  let _toasts;
  if ($$props.reverseOrder === void 0 && $$bindings.reverseOrder && reverseOrder !== void 0)
    $$bindings.reverseOrder(reverseOrder);
  if ($$props.position === void 0 && $$bindings.position && position !== void 0)
    $$bindings.position(position);
  if ($$props.toastOptions === void 0 && $$bindings.toastOptions && toastOptions !== void 0)
    $$bindings.toastOptions(toastOptions);
  if ($$props.gutter === void 0 && $$bindings.gutter && gutter !== void 0)
    $$bindings.gutter(gutter);
  if ($$props.containerStyle === void 0 && $$bindings.containerStyle && containerStyle !== void 0)
    $$bindings.containerStyle(containerStyle);
  if ($$props.containerClassName === void 0 && $$bindings.containerClassName && containerClassName !== void 0)
    $$bindings.containerClassName(containerClassName);
  $$result.css.add(css$1);
  _toasts = $toasts.map((toast2) => ({
    ...toast2,
    position: toast2.position || position,
    offset: handlers2.calculateOffset(toast2, $toasts, {
      reverseOrder,
      gutter,
      defaultPosition: position
    })
  }));
  $$unsubscribe_toasts();
  return `<div class="${"toaster " + escape(containerClassName || "", true) + " svelte-1phplh9"}"${add_attribute("style", containerStyle, 0)} role="alert">${each(_toasts, (toast2) => {
    return `${validate_component(ToastWrapper, "ToastWrapper").$$render(
      $$result,
      {
        toast: toast2,
        setHeight: (height) => handlers2.updateHeight(toast2.id, height)
      },
      {},
      {}
    )}`;
  })} </div>`;
});
const AddAccount = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${`<div class="m-2 flex flex-col justify-center space-y-3 p-4">${validate_component(Button, "Button").$$render($$result, {}, {}, {
    default: () => {
      return `Create New Account`;
    }
  })} <center data-svelte-h="svelte-9ta3vh">Or</center> ${validate_component(Button, "Button").$$render($$result, {}, {}, {
    default: () => {
      return `Import Account`;
    }
  })}</div>`}`;
});
const Avatar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "delayMs"]);
  let { class: className = void 0 } = $$props;
  let { delayMs = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.delayMs === void 0 && $$bindings.delayMs && delayMs !== void 0)
    $$bindings.delayMs(delayMs);
  return `${validate_component(Avatar$1, "AvatarPrimitive.Root").$$render(
    $$result,
    Object.assign(
      {},
      { delayMs },
      {
        class: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)
      },
      $$restProps
    ),
    {},
    {
      default: () => {
        return `${slots.default ? slots.default({}) : ``}`;
      }
    }
  )}`;
});
const Avatar_image = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "src", "alt"]);
  let { class: className = void 0 } = $$props;
  let { src = void 0 } = $$props;
  let { alt = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.src === void 0 && $$bindings.src && src !== void 0)
    $$bindings.src(src);
  if ($$props.alt === void 0 && $$bindings.alt && alt !== void 0)
    $$bindings.alt(alt);
  return `${validate_component(Avatar_image$1, "AvatarPrimitive.Image").$$render(
    $$result,
    Object.assign(
      {},
      { src },
      { alt },
      {
        class: cn("aspect-square h-full w-full", className)
      },
      $$restProps
    ),
    {},
    {}
  )}`;
});
const Avatar_fallback = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `${validate_component(Avatar_fallback$1, "AvatarPrimitive.Fallback").$$render(
    $$result,
    Object.assign(
      {},
      {
        class: cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className)
      },
      $$restProps
    ),
    {},
    {
      default: () => {
        return `${slots.default ? slots.default({}) : ``}`;
      }
    }
  )}`;
});
const Card = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<div${spread(
    [
      {
        class: escape_attribute_value(cn("rounded-lg border bg-card text-card-foreground shadow-sm", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</div>`;
});
const Card_content = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<div${spread(
    [
      {
        class: escape_attribute_value(cn("p-6 pt-0", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</div>`;
});
const ActiveConnections = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let accounts;
  let connections;
  let $walletConnection, $$unsubscribe_walletConnection;
  let $refereshActiveConnections, $$unsubscribe_refereshActiveConnections;
  let $accounts, $$unsubscribe_accounts = noop$1, $$subscribe_accounts = () => ($$unsubscribe_accounts(), $$unsubscribe_accounts = subscribe(accounts, ($$value) => $accounts = $$value), accounts);
  $$unsubscribe_walletConnection = subscribe(walletConnection, (value) => $walletConnection = value);
  $$unsubscribe_refereshActiveConnections = subscribe(refereshActiveConnections, (value) => $refereshActiveConnections = value);
  let selectedAccount;
  async function getConnections(address) {
    if ($walletConnection != void 0)
      return $walletConnection.getConnectedDapps(address);
    return [];
  }
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$subscribe_accounts(accounts = allAddresses);
    connections = getConnections(selectedAccount?.value?.address ?? "");
    {
      if ($refereshActiveConnections) {
        connections = getConnections(selectedAccount?.value?.address);
      }
    }
    $$rendered = `<div class="w-1/2">${validate_component(Label, "Label").$$render($$result, { class: "text-white", for: "apps" }, {}, {
      default: () => {
        return `Connected Apps`;
      }
    })} <div id="apps"> ${validate_component(Root$2, "Select.Root").$$render(
      $$result,
      { portal: null, selected: selectedAccount },
      {
        selected: ($$value) => {
          selectedAccount = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${validate_component(Select_trigger, "Select.Trigger").$$render($$result, { class: "w-[250px]" }, {}, {
            default: () => {
              return `${validate_component(Value, "Select.Value").$$render(
                $$result,
                {
                  placeholder: "Select Account",
                  class: "text-white"
                },
                {},
                {}
              )}`;
            }
          })} ${validate_component(Select_content, "Select.Content").$$render($$result, {}, {}, {
            default: () => {
              return `${validate_component(Group, "Select.Group").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Select_label, "Select.Label").$$render($$result, {}, {}, {
                    default: () => {
                      return `Accounts`;
                    }
                  })} ${each($accounts, (account) => {
                    return `${validate_component(Select_item, "Select.Item").$$render(
                      $$result,
                      {
                        class: "w-max",
                        value: account,
                        label: account.address.substring(0, 5) + "..." + account.address.substring(account.address.length - 5, account.address.length)
                      },
                      {},
                      {
                        default: () => {
                          return `<div class="flex justify-stretch space-x-5">${validate_component(Avatar, "Avatar.Root").$$render($$result, {}, {}, {
                            default: () => {
                              return `${validate_component(Avatar_fallback, "Avatar.Fallback").$$render($$result, {}, {}, {
                                default: () => {
                                  return `${escape($accounts.indexOf(account) + 1)}`;
                                }
                              })} `;
                            }
                          })} <div class="flex flex-col space-y-1">${validate_component(Label, "Label").$$render($$result, {}, {}, {
                            default: () => {
                              return `${escape(account.address.substring(0, 5))}...${escape(account.address.substring(account.address.length - 5, account.address.length))}`;
                            }
                          })} ${validate_component(Card_description, "Card.Description").$$render($$result, {}, {}, {
                            default: () => {
                              return `Eth ${escape(parseFloat(account.balance).toFixed(5))}`;
                            }
                          })} </div></div> `;
                        }
                      }
                    )}`;
                  })}`;
                }
              })}`;
            }
          })} ${validate_component(Input$1, "Select.Input").$$render($$result, { name: "selectedAccount" }, {}, {})}`;
        }
      }
    )} ${selectedAccount != void 0 ? `${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop$1);
        return ` <div class="flex items-center space-x-4">${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-12 w-12 rounded-full" }, {}, {})} <div class="space-y-2">${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-4 w-[250px]" }, {}, {})} ${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-4 w-[200px]" }, {}, {})}</div></div> `;
      }
      return function(activeConnections) {
        return ` ${activeConnections.length > 0 ? `<div class="mt-5 flex flex-row space-x-2 overflow-x-auto">${each(activeConnections, (connection) => {
          return `<div class="flex flex-col space-y-2 rounded-xl border p-2"><div class="flex flex-row space-x-2">${validate_component(Avatar, "Avatar.Root").$$render($$result, { class: "h-7 w-7" }, {}, {
            default: () => {
              return `${validate_component(Avatar_image, "Avatar.Image").$$render($$result, { src: connection.icon }, {}, {})} ${validate_component(Avatar_fallback, "Avatar.Fallback").$$render($$result, {}, {}, {
                default: () => {
                  return `DP`;
                }
              })} `;
            }
          })} ${validate_component(Label, "Label").$$render($$result, {}, {}, {
            default: () => {
              return `${escape(connection.name)}`;
            }
          })}</div> <hr> ${validate_component(Button, "Button").$$render($$result, { variant: "destructive" }, {}, {
            default: () => {
              return `Disconnect`;
            }
          })} </div>`;
        })}</div>` : `${validate_component(Label, "Label").$$render(
          $$result,
          {
            class: "mt-3 flex items-center justify-center"
          },
          {},
          {
            default: () => {
              return `No connected apps`;
            }
          }
        )}`} `;
      }(__value);
    }(connections)}` : `<div class="mt-3 flex items-center justify-center">${validate_component(Label, "Label").$$render($$result, { class: "text-white" }, {}, {
      default: () => {
        return `Select account to view connected apps`;
      }
    })}</div>`}</div></div>`;
  } while (!$$settled);
  $$unsubscribe_walletConnection();
  $$unsubscribe_refereshActiveConnections();
  $$unsubscribe_accounts();
  return $$rendered;
});
function getSavings(amount) {
  const usdvalue = amount * 2300;
  const total = Math.ceil(usdvalue);
  const saving = total - usdvalue;
  return { savings: saving, total };
}
const IncomingRequests = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let allRequests;
  let $walletConnection, $$unsubscribe_walletConnection;
  let $$unsubscribe_allAddresses;
  let $pendingConnections, $$unsubscribe_pendingConnections;
  $$unsubscribe_walletConnection = subscribe(walletConnection, (value) => $walletConnection = value);
  $$unsubscribe_allAddresses = subscribe(allAddresses, (value) => value);
  $$unsubscribe_pendingConnections = subscribe(pendingConnections, (value) => $pendingConnections = value);
  async function getPending(pending) {
    const allConnted = [];
    console.log(pending);
    for (let index = 0; index < pending.length; index++) {
      const element = pending[index];
      const connected = await $walletConnection.getConnectedDapps(element.message.from);
      const it = connected.filter((item) => item.topic == element.topic)[0];
      allConnted.push({ info: element, data: it });
    }
    return allConnted;
  }
  allRequests = getPending($pendingConnections);
  $$unsubscribe_walletConnection();
  $$unsubscribe_allAddresses();
  $$unsubscribe_pendingConnections();
  return `<div class="w-1/2">${validate_component(Label, "Label").$$render($$result, { class: "text-white", for: "d" }, {}, {
    default: () => {
      return `Signing Requests`;
    }
  })} <div id="d" class="flex space-x-1 overflow-x-auto">${function(__value) {
    if (is_promise(__value)) {
      __value.then(null, noop$1);
      return ` <div class="flex items-center space-x-4">${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-12 w-12 rounded-full" }, {}, {})} <div class="space-y-2">${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-4 w-[250px]" }, {}, {})} ${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-4 w-[200px]" }, {}, {})}</div></div> `;
    }
    return function(requests) {
      return ` ${requests.length > 0 ? `${each(requests, (request) => {
        return `<div class="m-2 flex flex-col space-y-2 rounded-xl border p-2"><div class="flex flex-row">${validate_component(Avatar, "Avatar.Root").$$render($$result, { class: "h-7 w-7" }, {}, {
          default: () => {
            return `${validate_component(Avatar_image, "Avatar.Image").$$render($$result, { src: request.data.icon }, {}, {})} ${validate_component(Avatar_fallback, "Avatar.Fallback").$$render($$result, {}, {}, {
              default: () => {
                return `DP`;
              }
            })} `;
          }
        })} ${validate_component(Label, "Label").$$render($$result, {}, {}, {
          default: () => {
            return `${escape(request.data.name)} `;
          }
        })}</div> ${validate_component(Label, "Label").$$render($$result, {}, {}, {
          default: () => {
            return `Eth ${escape(parseInt(request.info.message.value) / 10 ** 18)}`;
          }
        })} ${validate_component(Label, "Label").$$render($$result, {}, {}, {
          default: () => {
            return `usd ${escape(parseInt(request.info.message.value) / 10 ** 18 * 2300)}`;
          }
        })} ${validate_component(Label, "Label").$$render($$result, {}, {}, {
          default: () => {
            return `Savings ${escape(getSavings(parseInt(request.info.message.value) / 10 ** 18).savings)}`;
          }
        })} ${validate_component(Label, "Label").$$render($$result, {}, {}, {
          default: () => {
            return `Total ${escape(getSavings(parseInt(request.info.message.value) / 10 ** 18).total)}`;
          }
        })} <hr> <div class="flex flex-row space-x-2">${validate_component(Button, "Button").$$render($$result, {}, {}, {
          default: () => {
            return `Accept`;
          }
        })} ${validate_component(Button, "Button").$$render($$result, { variant: "destructive" }, {}, {
          default: () => {
            return `Reject`;
          }
        })}</div> </div>`;
      })}` : `<div class="flex items-center justify-center">${validate_component(Label, "Label").$$render($$result, { class: "text-white" }, {}, {
        default: () => {
          return `No requests`;
        }
      })}</div>`} `;
    }(__value);
  }(allRequests)}</div></div>`;
});
const Collapsible_content = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["transition", "transitionConfig"]);
  let { transition = slide } = $$props;
  let { transitionConfig = { duration: 150 } } = $$props;
  if ($$props.transition === void 0 && $$bindings.transition && transition !== void 0)
    $$bindings.transition(transition);
  if ($$props.transitionConfig === void 0 && $$bindings.transitionConfig && transitionConfig !== void 0)
    $$bindings.transitionConfig(transitionConfig);
  return `${validate_component(Collapsible_content$1, "CollapsiblePrimitive.Content").$$render($$result, Object.assign({}, { transition }, { transitionConfig }, $$restProps), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Root$1 = Collapsible;
const Trigger$1 = Collapsible_trigger;
const firebaseConfig = {
  apiKey: "AIzaSyAVFCupMmaVh6B7HjPBYONMOw9dXSdT7tU",
  authDomain: "healthstartup-39ec6.firebaseapp.com",
  projectId: "healthstartup-39ec6",
  storageBucket: "healthstartup-39ec6.appspot.com",
  messagingSenderId: "615511440975",
  appId: "1:615511440975:web:c86ad2b31ea48d07e0743a"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
async function getSavingstokens(address, savingsContracts, released) {
  const savings = [];
  const q = query(collection(db, `savings/${address}/${savingsContracts}`));
  const snapshot = await getDocs(q);
  for (let index = 0; index < snapshot.docs.length; index++) {
    const doc2 = snapshot.docs[index];
    savings.push(doc2.data());
  }
  if (released) {
    return savings.filter((token) => parseInt(token.releaseDate) < Date.now());
  }
  return savings;
}
function filterItems(address, items) {
  const filtered = items.filter((item) => item.address == address);
  if (filtered.length > 0)
    return filtered[0].tokens;
  else
    return [];
}
const AvailableTokens = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let releasedFunds;
  let $allAddresses, $$unsubscribe_allAddresses;
  $$unsubscribe_allAddresses = subscribe(allAddresses, (value) => $allAddresses = value);
  async function getReleasedFunds() {
    let lockedFunds = [];
    for (let index = 0; index < $allAddresses.length; index++) {
      const address = $allAddresses[index];
      const tokens = await getSavingstokens(address.address, address.savingsAddress, true);
      const balance = await fetchAccountBalance(address.address);
      lockedFunds.push({
        address: address.address,
        tokens: tokens.filter((item) => parseInt(item.releaseDate) > Date.now()),
        value: balance
      });
    }
    return lockedFunds;
  }
  releasedFunds = getReleasedFunds();
  $$unsubscribe_allAddresses();
  return `<div data-svelte-h="svelte-lbc1c5">Available tokens</div> ${function(__value) {
    if (is_promise(__value)) {
      __value.then(null, noop$1);
      return ` <div class="flex items-center space-x-4">${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-12 w-12 rounded-full" }, {}, {})} <div class="space-y-2">${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-4 w-[250px]" }, {}, {})} ${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-4 w-[200px]" }, {}, {})}</div></div> `;
    }
    return function(released) {
      return ` <div class="m-1 flex h-max flex-col space-y-2 p-2">${each($allAddresses, (address) => {
        return `${validate_component(Root$1, "Collapsible.Root").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(Trigger$1, "Collapsible.Trigger").$$render($$result, {}, {}, {
              default: () => {
                return `<div class="flex flex-col p-2">${validate_component(Label, "Label").$$render($$result, {}, {}, {
                  default: () => {
                    return `${escape(address.address.substring(0, 5))}...${escape(address.address.substring(address.address.length - 5, address.address.length))} `;
                  }
                })}</div> `;
              }
            })} ${validate_component(Collapsible_content, "Collapsible.Content").$$render($$result, { class: "space-y-2" }, {}, {
              default: () => {
                return `${each(address.tokens, (token) => {
                  return `<div class="flex flex-row space-x-2 border p-1">${validate_component(Avatar, "Avatar.Root").$$render($$result, { class: "h-7 w-7" }, {}, {
                    default: () => {
                      return `${validate_component(Avatar_image, "Avatar.Image").$$render($$result, { src: token.token.icon_url }, {}, {})} ${validate_component(Avatar_fallback, "Avatar.Fallback").$$render($$result, {}, {}, {
                        default: () => {
                          return `${validate_component(Icon, "Icon").$$render(
                            $$result,
                            {
                              height: "24px",
                              width: "24px",
                              icon: "mdi:ethereum"
                            },
                            {},
                            {}
                          )} `;
                        }
                      })} `;
                    }
                  })} ${validate_component(Label, "Label").$$render($$result, {}, {}, {
                    default: () => {
                      return `${escape(parseFloat(token.balance).toFixed(5))} `;
                    }
                  })} </div>`;
                })} `;
              }
            })} <p data-svelte-h="svelte-1kjhf5p">Released funds</p> ${each(filterItems(address.address, released), (aFunds) => {
              return `<div class="flex flex-col space-x-1 space-y-1 rounded-xl border p-2"><p>${escape(aFunds.amount)}</p> <p>sent on:${escape(aFunds.sentDate)}</p> <p>Released on:${escape(aFunds.releaseDate)}</p> ${validate_component(Button, "Button").$$render($$result, { variant: "ghost" }, {}, {
                default: () => {
                  return `Retreive`;
                }
              })} </div>`;
            })} `;
          }
        })}`;
      })}</div> `;
    }(__value);
  }(releasedFunds)}`;
});
const LockedTokens = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let lockedFunds;
  let $allAddresses, $$unsubscribe_allAddresses;
  $$unsubscribe_allAddresses = subscribe(allAddresses, (value) => $allAddresses = value);
  async function getLockedFunds() {
    let lockedFunds2 = [];
    for (let index = 0; index < $allAddresses.length; index++) {
      const address = $allAddresses[index];
      const tokens = await getSavingstokens(address.address, address.savingsAddress);
      const balance = await fetchAccountBalance(address.savingsAddress);
      lockedFunds2.push({
        address: address.address,
        tokens: tokens.filter((item) => parseInt(item.releaseDate) > Date.now()),
        value: balance
      });
    }
    return lockedFunds2;
  }
  lockedFunds = getLockedFunds();
  $$unsubscribe_allAddresses();
  return `<div data-svelte-h="svelte-8d11se">Locked tokens</div> <div class="m-1 flex h-max flex-col space-y-2 p-2">${function(__value) {
    if (is_promise(__value)) {
      __value.then(null, noop$1);
      return ` <p data-svelte-h="svelte-15ehgiq">loading locked funds</p> `;
    }
    return function(lockedFunds2) {
      return ` ${each(lockedFunds2, (lockedfund) => {
        return `${validate_component(Root$1, "Collapsible.Root").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(Trigger$1, "Collapsible.Trigger").$$render($$result, {}, {}, {
              default: () => {
                return `<div class="flex flex-col p-2">${escape(lockedfund.address)} ${escape(lockedfund.value)}</div> `;
              }
            })} ${validate_component(Collapsible_content, "Collapsible.Content").$$render($$result, { class: "space-y-2" }, {}, {
              default: () => {
                return `${each(lockedfund.tokens, (lockedtoken) => {
                  return `<div class="flex flex-col border p-1">amount: ${escape(lockedtoken.amount)}
							release date: ${escape(lockedtoken.releaseDate)}
							sent date: ${escape(lockedtoken.sentDate)} </div>`;
                })} `;
              }
            })} `;
          }
        })}`;
      })} `;
    }(__value);
  }(lockedFunds)}</div>`;
});
const Sheet_portal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `${validate_component(Dialog_portal, "SheetPrimitive.Portal").$$render($$result, Object.assign({}, { class: cn(className) }, $$restProps), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Sheet_overlay = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "transition", "transitionConfig"]);
  let { class: className = void 0 } = $$props;
  let { transition = fade } = $$props;
  let { transitionConfig = { duration: 150 } } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.transition === void 0 && $$bindings.transition && transition !== void 0)
    $$bindings.transition(transition);
  if ($$props.transitionConfig === void 0 && $$bindings.transitionConfig && transitionConfig !== void 0)
    $$bindings.transitionConfig(transitionConfig);
  return `${validate_component(Dialog_overlay, "SheetPrimitive.Overlay").$$render(
    $$result,
    Object.assign(
      {},
      { transition },
      { transitionConfig },
      {
        class: cn("fixed inset-0 z-50 bg-background/80 backdrop-blur-sm ", className)
      },
      $$restProps
    ),
    {},
    {}
  )}`;
});
const Sheet_content = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, [
    "class",
    "side",
    "inTransition",
    "inTransitionConfig",
    "outTransition",
    "outTransitionConfig"
  ]);
  let { class: className = void 0 } = $$props;
  let { side = "right" } = $$props;
  let { inTransition = fly } = $$props;
  let { inTransitionConfig = sheetTransitions[side ? side : "right"]["in"] } = $$props;
  let { outTransition = fly } = $$props;
  let { outTransitionConfig = sheetTransitions[side ? side : "right"]["out"] } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.side === void 0 && $$bindings.side && side !== void 0)
    $$bindings.side(side);
  if ($$props.inTransition === void 0 && $$bindings.inTransition && inTransition !== void 0)
    $$bindings.inTransition(inTransition);
  if ($$props.inTransitionConfig === void 0 && $$bindings.inTransitionConfig && inTransitionConfig !== void 0)
    $$bindings.inTransitionConfig(inTransitionConfig);
  if ($$props.outTransition === void 0 && $$bindings.outTransition && outTransition !== void 0)
    $$bindings.outTransition(outTransition);
  if ($$props.outTransitionConfig === void 0 && $$bindings.outTransitionConfig && outTransitionConfig !== void 0)
    $$bindings.outTransitionConfig(outTransitionConfig);
  return `${validate_component(Sheet_portal, "SheetPortal").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Sheet_overlay, "SheetOverlay").$$render($$result, {}, {}, {})} ${validate_component(Dialog_content, "SheetPrimitive.Content").$$render(
        $$result,
        Object.assign(
          {},
          { inTransition },
          { inTransitionConfig },
          { outTransition },
          { outTransitionConfig },
          {
            class: cn(sheetVariants({ side }), className)
          },
          $$restProps
        ),
        {},
        {
          default: () => {
            return `${slots.default ? slots.default({}) : ``} ${validate_component(Dialog_close, "SheetPrimitive.Close").$$render(
              $$result,
              {
                class: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
              },
              {},
              {
                default: () => {
                  return `${validate_component(X$1, "X").$$render($$result, { class: "h-4 w-4" }, {}, {})} <span class="sr-only" data-svelte-h="svelte-1pewzs3">Close</span>`;
                }
              }
            )}`;
          }
        }
      )}`;
    }
  })}`;
});
const Sheet_header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<div${spread(
    [
      {
        class: escape_attribute_value(cn("flex flex-col space-y-2 text-center sm:text-left", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</div>`;
});
const Sheet_title = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `${validate_component(Dialog_title, "SheetPrimitive.Title").$$render(
    $$result,
    Object.assign(
      {},
      {
        class: cn("text-lg font-semibold text-foreground", className)
      },
      $$restProps
    ),
    {},
    {
      default: () => {
        return `${slots.default ? slots.default({}) : ``}`;
      }
    }
  )}`;
});
const Sheet_description = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `${validate_component(Dialog_description, "SheetPrimitive.Description").$$render(
    $$result,
    Object.assign(
      {},
      {
        class: cn("text-sm text-muted-foreground", className)
      },
      $$restProps
    ),
    {},
    {
      default: () => {
        return `${slots.default ? slots.default({}) : ``}`;
      }
    }
  )}`;
});
const Root = Dialog;
const Trigger = Dialog_trigger;
const sheetVariants = tv({
  base: "fixed z-50 gap-4 bg-background p-6 shadow-lg",
  variants: {
    side: {
      top: "inset-x-0 top-0 border-b",
      bottom: "inset-x-0 bottom-0 border-t",
      left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
      right: "inset-y-0 right-0 h-full w-3/4  border-l sm:max-w-sm"
    }
  },
  defaultVariants: {
    side: "right"
  }
});
const sheetTransitions = {
  top: {
    in: {
      y: "-100%",
      duration: 500,
      opacity: 1
    },
    out: {
      y: "-100%",
      duration: 300,
      opacity: 1
    }
  },
  bottom: {
    in: {
      y: "100%",
      duration: 500,
      opacity: 1
    },
    out: {
      y: "100%",
      duration: 300,
      opacity: 1
    }
  },
  left: {
    in: {
      x: "-100%",
      duration: 500,
      opacity: 1
    },
    out: {
      x: "-100%",
      duration: 300,
      opacity: 1
    }
  },
  right: {
    in: {
      x: "100%",
      duration: 500,
      opacity: 1
    },
    out: {
      x: "100%",
      duration: 300,
      opacity: 1
    }
  }
};
const css = {
  code: ".mm.svelte-1iiulhw{font-family:'Permanent Marker'}",
  map: null
};
const PortfolioSummary = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let balances;
  let $allAddresses, $$unsubscribe_allAddresses;
  $$unsubscribe_allAddresses = subscribe(allAddresses, (value) => $allAddresses = value);
  let totalPendingEthers = 0;
  let totalAvailableEthers = 0;
  async function getValue(allAddresses2) {
    totalPendingEthers = 0;
    totalAvailableEthers = 0;
    let totalTokens = 0;
    for (let index = 0; index < allAddresses2.length; index++) {
      const address = allAddresses2[index];
      const pendingbalance = await fetchAccountBalance(address.savingsAddress);
      const availablebalance = await fetchAccountBalance(address.address);
      for (let index2 = 0; index2 < address.tokens.length; index2++) {
        const token = address.tokens[index2];
        totalTokens += parseFloat((parseFloat(token.balance) * parseFloat(token.token.exchange_rate)).toFixed(3));
      }
      totalPendingEthers += parseFloat(pendingbalance);
      totalAvailableEthers += parseFloat(availablebalance);
    }
    return [
      {
        icon: "twemoji:locked",
        text: "Locked Assets",
        description: "All locked tokens across all accounts",
        index: 0,
        color: "bg-[#f7a399]",
        value: totalPendingEthers.toString()
      },
      {
        icon: "twemoji:unlocked",
        text: "Accessible Assets",
        color: "bg-[#aaf683]",
        description: "All available tokens across all accounts",
        index: 1,
        value: totalAvailableEthers.toString()
      }
    ];
  }
  $$result.css.add(css);
  balances = getValue($allAddresses);
  $$unsubscribe_allAddresses();
  return `${validate_component(Label, "Label").$$render($$result, { for: "pp", class: "text-white" }, {}, {
    default: () => {
      return `Portfolio Summary`;
    }
  })} <div class="flex flex-col rounded-xl border" id="pp"><div class="flex flex-row items-center justify-evenly">${function(__value) {
    if (is_promise(__value)) {
      __value.then(null, noop$1);
      return ` <div class="flex items-center space-x-4"><div class="space-y-2 rounded border p-2">${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-12 w-12 rounded-full" }, {}, {})} ${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-4 w-[150px]" }, {}, {})} ${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-4 w-[150px]" }, {}, {})} ${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-4 w-[150px]" }, {}, {})}</div> <div class="space-y-2 rounded border p-2">${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-12 w-12 rounded-full" }, {}, {})} ${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-4 w-[150px]" }, {}, {})} ${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-4 w-[150px]" }, {}, {})} ${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-4 w-[150px]" }, {}, {})}</div> <div class="space-y-2 rounded border p-2">${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-12 w-12 rounded-full" }, {}, {})} ${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-4 w-[150px]" }, {}, {})} ${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-4 w-[150px]" }, {}, {})} ${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-4 w-[150px]" }, {}, {})}</div></div> `;
    }
    return function(portfolioButtons) {
      return ` <div class="flex flex-col items-center justify-center space-y-2 rounded border bg-[#5fb49c] p-2">${validate_component(Icon, "Icon").$$render(
        $$result,
        {
          style: "color:#857d0a",
          icon: "icon-park-outline:funds",
          width: "24px",
          height: "24px"
        },
        {},
        {}
      )} ${validate_component(Label, "Label").$$render(
        $$result,
        {
          id: "mm",
          class: "font- mm text-lg font-bold text-black"
        },
        {},
        {
          default: () => {
            return `ETH ${escape((totalAvailableEthers + totalPendingEthers).toFixed(5))}`;
          }
        }
      )} ${validate_component(Label, "Label").$$render($$result, { id: "mm", class: "mm text-green-700" }, {}, {
        default: () => {
          return `($ ${escape(((totalAvailableEthers + totalPendingEthers) * 2300).toFixed(2))})`;
        }
      })} ${validate_component(Label, "Label").$$render($$result, { class: "text-black" }, {}, {
        default: () => {
          return `Total Assets`;
        }
      })}</div> ${each(portfolioButtons, (pbutton) => {
        return `${validate_component(Root, "Sheet.Root").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(Trigger, "Sheet.Trigger").$$render($$result, {}, {}, {
              default: () => {
                return `<div class="${"m-1 flex flex-col " + escape(pbutton.color, true) + " items-center justify-center space-y-2 rounded border p-2 svelte-1iiulhw"}">${validate_component(Icon, "Icon").$$render(
                  $$result,
                  {
                    icon: pbutton.icon,
                    width: "24px",
                    height: "24px"
                  },
                  {},
                  {}
                )} ${validate_component(Label, "Label").$$render($$result, { class: "text-lg font-bold text-black" }, {}, {
                  default: () => {
                    return `ETH ${escape(parseFloat(pbutton.value).toFixed(5))}`;
                  }
                })} ${validate_component(Label, "Label").$$render($$result, { class: "text-green-700" }, {}, {
                  default: () => {
                    return `($ ${escape((parseFloat(pbutton.value) * 2300).toFixed(2))})`;
                  }
                })} ${validate_component(Label, "Label").$$render($$result, { class: "text-black" }, {}, {
                  default: () => {
                    return `${escape(pbutton.text)}`;
                  }
                })}</div> `;
              }
            })} ${validate_component(Sheet_content, "Sheet.Content").$$render(
              $$result,
              {
                side: "right",
                class: "m-4 max-h-[750px] overflow-y-auto rounded-xl"
              },
              {},
              {
                default: () => {
                  return `${validate_component(Sheet_header, "Sheet.Header").$$render($$result, {}, {}, {
                    default: () => {
                      return `${validate_component(Sheet_title, "Sheet.Title").$$render($$result, {}, {}, {
                        default: () => {
                          return `${escape(pbutton.text)} `;
                        }
                      })} ${validate_component(Sheet_description, "Sheet.Description").$$render($$result, {}, {}, {
                        default: () => {
                          return `${escape(pbutton.description)} `;
                        }
                      })} `;
                    }
                  })} ${pbutton.index == 0 ? `${validate_component(LockedTokens, "LockedTokens").$$render($$result, {}, {}, {})}` : `${validate_component(AvailableTokens, "AvailableTokens").$$render($$result, {}, {}, {})}`} `;
                }
              }
            )} `;
          }
        })}`;
      })} `;
    }(__value);
  }(balances)}</div> </div>`;
});
const QRCodeLimitLength = [
  [17, 14, 11, 7],
  [32, 26, 20, 14],
  [53, 42, 32, 24],
  [78, 62, 46, 34],
  [106, 84, 60, 44],
  [134, 106, 74, 58],
  [154, 122, 86, 64],
  [192, 152, 108, 84],
  [230, 180, 130, 98],
  [271, 213, 151, 119],
  [321, 251, 177, 137],
  [367, 287, 203, 155],
  [425, 331, 241, 177],
  [458, 362, 258, 194],
  [520, 412, 292, 220],
  [586, 450, 322, 250],
  [644, 504, 364, 280],
  [718, 560, 394, 310],
  [792, 624, 442, 338],
  [858, 666, 482, 382],
  [929, 711, 509, 403],
  [1003, 779, 565, 439],
  [1091, 857, 611, 461],
  [1171, 911, 661, 511],
  [1273, 997, 715, 535],
  [1367, 1059, 751, 593],
  [1465, 1125, 805, 625],
  [1528, 1190, 868, 658],
  [1628, 1264, 908, 698],
  [1732, 1370, 982, 742],
  [1840, 1452, 1030, 790],
  [1952, 1538, 1112, 842],
  [2068, 1628, 1168, 898],
  [2188, 1722, 1228, 958],
  [2303, 1809, 1283, 983],
  [2431, 1911, 1351, 1051],
  [2563, 1989, 1423, 1093],
  [2699, 2099, 1499, 1139],
  [2809, 2213, 1579, 1219],
  [2953, 2331, 1663, 1273]
];
var QRMode;
(function(QRMode2) {
  QRMode2[QRMode2["MODE_NUMBER"] = 1] = "MODE_NUMBER";
  QRMode2[QRMode2["MODE_ALPHA_NUM"] = 2] = "MODE_ALPHA_NUM";
  QRMode2[QRMode2["MODE_8BIT_BYTE"] = 4] = "MODE_8BIT_BYTE";
  QRMode2[QRMode2["MODE_KANJI"] = 8] = "MODE_KANJI";
})(QRMode || (QRMode = {}));
var QRErrorCorrectLevel;
(function(QRErrorCorrectLevel2) {
  QRErrorCorrectLevel2[QRErrorCorrectLevel2["L"] = 1] = "L";
  QRErrorCorrectLevel2[QRErrorCorrectLevel2["M"] = 0] = "M";
  QRErrorCorrectLevel2[QRErrorCorrectLevel2["Q"] = 3] = "Q";
  QRErrorCorrectLevel2[QRErrorCorrectLevel2["H"] = 2] = "H";
})(QRErrorCorrectLevel || (QRErrorCorrectLevel = {}));
var QRMaskPattern;
(function(QRMaskPattern2) {
  QRMaskPattern2[QRMaskPattern2["PATTERN000"] = 0] = "PATTERN000";
  QRMaskPattern2[QRMaskPattern2["PATTERN001"] = 1] = "PATTERN001";
  QRMaskPattern2[QRMaskPattern2["PATTERN010"] = 2] = "PATTERN010";
  QRMaskPattern2[QRMaskPattern2["PATTERN011"] = 3] = "PATTERN011";
  QRMaskPattern2[QRMaskPattern2["PATTERN100"] = 4] = "PATTERN100";
  QRMaskPattern2[QRMaskPattern2["PATTERN101"] = 5] = "PATTERN101";
  QRMaskPattern2[QRMaskPattern2["PATTERN110"] = 6] = "PATTERN110";
  QRMaskPattern2[QRMaskPattern2["PATTERN111"] = 7] = "PATTERN111";
})(QRMaskPattern || (QRMaskPattern = {}));
class QRBitBuffer {
  constructor() {
    this.buffer = [];
    this.length = 0;
  }
  get(index) {
    const bufIndex = Math.floor(index / 8);
    return (this.buffer[bufIndex] >>> 7 - index % 8 & 1) == 1;
  }
  put(num, length) {
    for (let i = 0; i < length; i++) {
      this.putBit((num >>> length - i - 1 & 1) == 1);
    }
  }
  getLengthInBits() {
    return this.length;
  }
  putBit(bit) {
    const bufIndex = Math.floor(this.length / 8);
    if (this.buffer.length <= bufIndex) {
      this.buffer.push(0);
    }
    if (bit) {
      this.buffer[bufIndex] |= 128 >>> this.length % 8;
    }
    this.length++;
  }
}
class QRRSBlock {
  constructor(totalCount, dataCount) {
    this.RS_BLOCK_TABLE = [
      [1, 26, 19],
      [1, 26, 16],
      [1, 26, 13],
      [1, 26, 9],
      [1, 44, 34],
      [1, 44, 28],
      [1, 44, 22],
      [1, 44, 16],
      [1, 70, 55],
      [1, 70, 44],
      [2, 35, 17],
      [2, 35, 13],
      [1, 100, 80],
      [2, 50, 32],
      [2, 50, 24],
      [4, 25, 9],
      [1, 134, 108],
      [2, 67, 43],
      [2, 33, 15, 2, 34, 16],
      [2, 33, 11, 2, 34, 12],
      [2, 86, 68],
      [4, 43, 27],
      [4, 43, 19],
      [4, 43, 15],
      [2, 98, 78],
      [4, 49, 31],
      [2, 32, 14, 4, 33, 15],
      [4, 39, 13, 1, 40, 14],
      [2, 121, 97],
      [2, 60, 38, 2, 61, 39],
      [4, 40, 18, 2, 41, 19],
      [4, 40, 14, 2, 41, 15],
      [2, 146, 116],
      [3, 58, 36, 2, 59, 37],
      [4, 36, 16, 4, 37, 17],
      [4, 36, 12, 4, 37, 13],
      [2, 86, 68, 2, 87, 69],
      [4, 69, 43, 1, 70, 44],
      [6, 43, 19, 2, 44, 20],
      [6, 43, 15, 2, 44, 16],
      [4, 101, 81],
      [1, 80, 50, 4, 81, 51],
      [4, 50, 22, 4, 51, 23],
      [3, 36, 12, 8, 37, 13],
      [2, 116, 92, 2, 117, 93],
      [6, 58, 36, 2, 59, 37],
      [4, 46, 20, 6, 47, 21],
      [7, 42, 14, 4, 43, 15],
      [4, 133, 107],
      [8, 59, 37, 1, 60, 38],
      [8, 44, 20, 4, 45, 21],
      [12, 33, 11, 4, 34, 12],
      [3, 145, 115, 1, 146, 116],
      [4, 64, 40, 5, 65, 41],
      [11, 36, 16, 5, 37, 17],
      [11, 36, 12, 5, 37, 13],
      [5, 109, 87, 1, 110, 88],
      [5, 65, 41, 5, 66, 42],
      [5, 54, 24, 7, 55, 25],
      [11, 36, 12],
      [5, 122, 98, 1, 123, 99],
      [7, 73, 45, 3, 74, 46],
      [15, 43, 19, 2, 44, 20],
      [3, 45, 15, 13, 46, 16],
      [1, 135, 107, 5, 136, 108],
      [10, 74, 46, 1, 75, 47],
      [1, 50, 22, 15, 51, 23],
      [2, 42, 14, 17, 43, 15],
      [5, 150, 120, 1, 151, 121],
      [9, 69, 43, 4, 70, 44],
      [17, 50, 22, 1, 51, 23],
      [2, 42, 14, 19, 43, 15],
      [3, 141, 113, 4, 142, 114],
      [3, 70, 44, 11, 71, 45],
      [17, 47, 21, 4, 48, 22],
      [9, 39, 13, 16, 40, 14],
      [3, 135, 107, 5, 136, 108],
      [3, 67, 41, 13, 68, 42],
      [15, 54, 24, 5, 55, 25],
      [15, 43, 15, 10, 44, 16],
      [4, 144, 116, 4, 145, 117],
      [17, 68, 42],
      [17, 50, 22, 6, 51, 23],
      [19, 46, 16, 6, 47, 17],
      [2, 139, 111, 7, 140, 112],
      [17, 74, 46],
      [7, 54, 24, 16, 55, 25],
      [34, 37, 13],
      [4, 151, 121, 5, 152, 122],
      [4, 75, 47, 14, 76, 48],
      [11, 54, 24, 14, 55, 25],
      [16, 45, 15, 14, 46, 16],
      [6, 147, 117, 4, 148, 118],
      [6, 73, 45, 14, 74, 46],
      [11, 54, 24, 16, 55, 25],
      [30, 46, 16, 2, 47, 17],
      [8, 132, 106, 4, 133, 107],
      [8, 75, 47, 13, 76, 48],
      [7, 54, 24, 22, 55, 25],
      [22, 45, 15, 13, 46, 16],
      [10, 142, 114, 2, 143, 115],
      [19, 74, 46, 4, 75, 47],
      [28, 50, 22, 6, 51, 23],
      [33, 46, 16, 4, 47, 17],
      [8, 152, 122, 4, 153, 123],
      [22, 73, 45, 3, 74, 46],
      [8, 53, 23, 26, 54, 24],
      [12, 45, 15, 28, 46, 16],
      [3, 147, 117, 10, 148, 118],
      [3, 73, 45, 23, 74, 46],
      [4, 54, 24, 31, 55, 25],
      [11, 45, 15, 31, 46, 16],
      [7, 146, 116, 7, 147, 117],
      [21, 73, 45, 7, 74, 46],
      [1, 53, 23, 37, 54, 24],
      [19, 45, 15, 26, 46, 16],
      [5, 145, 115, 10, 146, 116],
      [19, 75, 47, 10, 76, 48],
      [15, 54, 24, 25, 55, 25],
      [23, 45, 15, 25, 46, 16],
      [13, 145, 115, 3, 146, 116],
      [2, 74, 46, 29, 75, 47],
      [42, 54, 24, 1, 55, 25],
      [23, 45, 15, 28, 46, 16],
      [17, 145, 115],
      [10, 74, 46, 23, 75, 47],
      [10, 54, 24, 35, 55, 25],
      [19, 45, 15, 35, 46, 16],
      [17, 145, 115, 1, 146, 116],
      [14, 74, 46, 21, 75, 47],
      [29, 54, 24, 19, 55, 25],
      [11, 45, 15, 46, 46, 16],
      [13, 145, 115, 6, 146, 116],
      [14, 74, 46, 23, 75, 47],
      [44, 54, 24, 7, 55, 25],
      [59, 46, 16, 1, 47, 17],
      [12, 151, 121, 7, 152, 122],
      [12, 75, 47, 26, 76, 48],
      [39, 54, 24, 14, 55, 25],
      [22, 45, 15, 41, 46, 16],
      [6, 151, 121, 14, 152, 122],
      [6, 75, 47, 34, 76, 48],
      [46, 54, 24, 10, 55, 25],
      [2, 45, 15, 64, 46, 16],
      [17, 152, 122, 4, 153, 123],
      [29, 74, 46, 14, 75, 47],
      [49, 54, 24, 10, 55, 25],
      [24, 45, 15, 46, 46, 16],
      [4, 152, 122, 18, 153, 123],
      [13, 74, 46, 32, 75, 47],
      [48, 54, 24, 14, 55, 25],
      [42, 45, 15, 32, 46, 16],
      [20, 147, 117, 4, 148, 118],
      [40, 75, 47, 7, 76, 48],
      [43, 54, 24, 22, 55, 25],
      [10, 45, 15, 67, 46, 16],
      [19, 148, 118, 6, 149, 119],
      [18, 75, 47, 31, 76, 48],
      [34, 54, 24, 34, 55, 25],
      [20, 45, 15, 61, 46, 16]
    ];
    this.totalCount = totalCount;
    this.dataCount = dataCount;
  }
  getRSBlocks(typeNumber, errorCorrectLevel) {
    const rsBlock = this.getRsBlockTable(typeNumber, errorCorrectLevel);
    if (rsBlock == void 0) {
      throw new Error("bad rs block @ typeNumber:" + typeNumber + "/errorCorrectLevel:" + errorCorrectLevel);
    }
    const length = rsBlock.length / 3;
    const list = [];
    for (let i = 0; i < length; i++) {
      const count = rsBlock[i * 3 + 0];
      const totalCount = rsBlock[i * 3 + 1];
      const dataCount = rsBlock[i * 3 + 2];
      for (let j = 0; j < count; j++) {
        list.push(new QRRSBlock(totalCount, dataCount));
      }
    }
    return list;
  }
  getRsBlockTable(typeNumber, errorCorrectLevel) {
    switch (errorCorrectLevel) {
      case QRErrorCorrectLevel.L:
        return this.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
      case QRErrorCorrectLevel.M:
        return this.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
      case QRErrorCorrectLevel.Q:
        return this.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
      case QRErrorCorrectLevel.H:
        return this.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
      default:
        return void 0;
    }
  }
}
class QR8bitByte {
  constructor(data) {
    this.mode = QRMode.MODE_8BIT_BYTE;
    this.data = data;
    this.parsedData = [];
    for (let i = 0, l = this.data.length; i < l; i++) {
      const byteArray = [];
      const code = this.data.charCodeAt(i);
      if (code > 65536) {
        byteArray[0] = 240 | (code & 1835008) >>> 18;
        byteArray[1] = 128 | (code & 258048) >>> 12;
        byteArray[2] = 128 | (code & 4032) >>> 6;
        byteArray[3] = 128 | code & 63;
      } else if (code > 2048) {
        byteArray[0] = 224 | (code & 61440) >>> 12;
        byteArray[1] = 128 | (code & 4032) >>> 6;
        byteArray[2] = 128 | code & 63;
      } else if (code > 128) {
        byteArray[0] = 192 | (code & 1984) >>> 6;
        byteArray[1] = 128 | code & 63;
      } else {
        byteArray[0] = code;
      }
      this.parsedData.push(...byteArray);
    }
    this.parsedData = Array.prototype.concat.apply([], this.parsedData);
    if (this.parsedData.length != this.data.length) {
      this.parsedData.unshift(191);
      this.parsedData.unshift(187);
      this.parsedData.unshift(239);
    }
  }
  getLength() {
    return this.parsedData.length;
  }
  write(buffer) {
    for (let i = 0, l = this.parsedData.length; i < l; i++) {
      buffer.put(this.parsedData[i], 8);
    }
  }
}
class QRMath {
  constructor() {
    this.EXP_TABLE = new Array(256);
    this.LOG_TABLE = new Array(256);
    for (let i = 0; i < 8; i++) {
      this.EXP_TABLE[i] = 1 << i;
    }
    for (let i = 8; i < 256; i++) {
      this.EXP_TABLE[i] = this.EXP_TABLE[i - 4] ^ this.EXP_TABLE[i - 5] ^ this.EXP_TABLE[i - 6] ^ this.EXP_TABLE[i - 8];
    }
    for (let i = 0; i < 255; i++) {
      this.LOG_TABLE[this.EXP_TABLE[i]] = i;
    }
  }
  glog(n) {
    if (n < 1) {
      throw new Error("glog(" + n + ")");
    }
    return this.LOG_TABLE[n];
  }
  gexp(n) {
    while (n < 0) {
      n += 255;
    }
    while (n >= 256) {
      n -= 255;
    }
    return this.EXP_TABLE[n];
  }
}
class QRPolynomial {
  constructor(num, shift) {
    this.qrMath = new QRMath();
    if (num.length == void 0) {
      throw new Error(num.length + "/" + shift);
    }
    let offset = 0;
    while (offset < num.length && num[offset] == 0) {
      offset++;
    }
    this.num = new Array(num.length - offset + shift);
    for (let i = 0; i < num.length - offset; i++) {
      this.num[i] = num[i + offset];
    }
  }
  get(index) {
    return this.num[index];
  }
  getLength() {
    return this.num.length;
  }
  multiply(e) {
    const num = new Array(this.getLength() + e.getLength() - 1);
    for (let i = 0; i < this.getLength(); i++) {
      for (let j = 0; j < e.getLength(); j++) {
        num[i + j] ^= this.qrMath.gexp(this.qrMath.glog(this.get(i)) + this.qrMath.glog(e.get(j)));
      }
    }
    return new QRPolynomial(num, 0);
  }
  mod(e) {
    if (this.getLength() - e.getLength() < 0) {
      return this;
    }
    const ratio = this.qrMath.glog(this.get(0)) - this.qrMath.glog(e.get(0));
    const num = new Array(this.getLength());
    for (let i = 0; i < this.getLength(); i++) {
      num[i] = this.get(i);
    }
    for (let i = 0; i < e.getLength(); i++) {
      num[i] ^= this.qrMath.gexp(this.qrMath.glog(e.get(i)) + ratio);
    }
    return new QRPolynomial(num, 0).mod(e);
  }
}
class QRCodeModel {
  constructor(typeNumber, errorCorrectLevel) {
    this.qrUtil = new QRUtil();
    this.PAD0 = 236;
    this.PAD1 = 17;
    this.typeNumber = typeNumber;
    this.errorCorrectLevel = errorCorrectLevel;
    this.modules = [];
    this.moduleCount = 0;
    this.dataCache = [];
    this.dataList = [];
  }
  addData(data) {
    const newData = new QR8bitByte(data);
    this.dataList.push(newData);
    this.dataCache = [];
  }
  isDark(row, col) {
    if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) {
      throw new Error(row + "," + col);
    }
    return this.modules[row][col];
  }
  getModuleCount() {
    return this.moduleCount;
  }
  makeImpl(test, maskPattern) {
    this.moduleCount = this.typeNumber * 4 + 17;
    this.modules = new Array(this.moduleCount);
    for (let row = 0; row < this.moduleCount; row++) {
      this.modules[row] = new Array(this.moduleCount);
      for (let col = 0; col < this.moduleCount; col++) {
        this.modules[row][col] = null;
      }
    }
    this.setupPositionProbePattern(0, 0);
    this.setupPositionProbePattern(this.moduleCount - 7, 0);
    this.setupPositionProbePattern(0, this.moduleCount - 7);
    this.setupPositionAdjustPattern();
    this.setupTimingPattern();
    this.setupTypeInfo(test, maskPattern);
    if (this.typeNumber >= 7) {
      this.setupTypeNumber(test);
    }
    if (this.dataCache.length == 0) {
      this.dataCache = this.createData(this.typeNumber, this.errorCorrectLevel, this.dataList);
    }
    this.mapData(this.dataCache, maskPattern);
  }
  getBestMaskPattern() {
    let minLostPoint = 0;
    let pattern = 0;
    for (let i = 0; i < 8; i++) {
      this.makeImpl(true, i);
      const lostPoint = this.qrUtil.getLostPoint(this);
      if (i == 0 || minLostPoint > lostPoint) {
        minLostPoint = lostPoint;
        pattern = i;
      }
    }
    return pattern;
  }
  make() {
    this.makeImpl(false, this.getBestMaskPattern());
  }
  setupPositionProbePattern(row, col) {
    for (let r = -1; r <= 7; r++) {
      if (row + r <= -1 || this.moduleCount <= row + r)
        continue;
      for (let c = -1; c <= 7; c++) {
        if (col + c <= -1 || this.moduleCount <= col + c)
          continue;
        if (0 <= r && r <= 6 && (c == 0 || c == 6) || 0 <= c && c <= 6 && (r == 0 || r == 6) || 2 <= r && r <= 4 && 2 <= c && c <= 4) {
          this.modules[row + r][col + c] = true;
        } else {
          this.modules[row + r][col + c] = false;
        }
      }
    }
  }
  /*
      public createMovieClip(target_mc, instance_name, depth) {
      let qr_mc = target_mc.createEmptyMovieClip(instance_name, depth);
      let cs = 1;
      this.make();
      for (let row = 0; row < this.modules.length; row++) {
          let y = row * cs;
          for (let col = 0; col < this.modules[row].length; col++) {
              let x = col * cs;
              let dark = this.modules[row][col];
              if (dark) {
                  qr_mc.beginFill(0, 100);
                  qr_mc.moveTo(x, y);
                  qr_mc.lineTo(x + cs, y);
                  qr_mc.lineTo(x + cs, y + cs);
                  qr_mc.lineTo(x, y + cs);
                  qr_mc.endFill();
              }
          }
      }
      return qr_mc;
  }
      */
  setupTimingPattern() {
    for (let r = 8; r < this.moduleCount - 8; r++) {
      if (this.modules[r][6] != null) {
        continue;
      }
      this.modules[r][6] = r % 2 == 0;
    }
    for (let c = 8; c < this.moduleCount - 8; c++) {
      if (this.modules[6][c] != null) {
        continue;
      }
      this.modules[6][c] = c % 2 == 0;
    }
  }
  setupPositionAdjustPattern() {
    const pos = this.qrUtil.getPatternPosition(this.typeNumber);
    for (let i = 0; i < pos.length; i++) {
      for (let j = 0; j < pos.length; j++) {
        const row = pos[i];
        const col = pos[j];
        if (this.modules[row][col] != null) {
          continue;
        }
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            if (r == -2 || r == 2 || c == -2 || c == 2 || r == 0 && c == 0) {
              this.modules[row + r][col + c] = true;
            } else {
              this.modules[row + r][col + c] = false;
            }
          }
        }
      }
    }
  }
  setupTypeNumber(test) {
    const bits = this.qrUtil.getBCHTypeNumber(this.typeNumber);
    for (let i = 0; i < 18; i++) {
      const mod = !test && (bits >> i & 1) == 1;
      this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = mod;
    }
    for (let i = 0; i < 18; i++) {
      const mod = !test && (bits >> i & 1) == 1;
      this.modules[i % 3 + this.moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
    }
  }
  setupTypeInfo(test, maskPattern) {
    const data = this.errorCorrectLevel << 3 | maskPattern;
    const bits = this.qrUtil.getBCHTypeInfo(data);
    for (let i = 0; i < 15; i++) {
      const mod = !test && (bits >> i & 1) == 1;
      if (i < 6) {
        this.modules[i][8] = mod;
      } else if (i < 8) {
        this.modules[i + 1][8] = mod;
      } else {
        this.modules[this.moduleCount - 15 + i][8] = mod;
      }
    }
    for (let i = 0; i < 15; i++) {
      const mod = !test && (bits >> i & 1) == 1;
      if (i < 8) {
        this.modules[8][this.moduleCount - i - 1] = mod;
      } else if (i < 9) {
        this.modules[8][15 - i - 1 + 1] = mod;
      } else {
        this.modules[8][15 - i - 1] = mod;
      }
    }
    this.modules[this.moduleCount - 8][8] = !test;
  }
  mapData(data, maskPattern) {
    let inc = -1;
    let row = this.moduleCount - 1;
    let bitIndex = 7;
    let byteIndex = 0;
    for (let col = this.moduleCount - 1; col > 0; col -= 2) {
      if (col == 6)
        col--;
      while (true) {
        for (let c = 0; c < 2; c++) {
          if (this.modules[row][col - c] == null) {
            let dark = false;
            if (byteIndex < data.length) {
              dark = (data[byteIndex] >>> bitIndex & 1) == 1;
            }
            const mask = this.qrUtil.getMask(maskPattern, row, col - c);
            if (mask) {
              dark = !dark;
            }
            this.modules[row][col - c] = dark;
            bitIndex--;
            if (bitIndex == -1) {
              byteIndex++;
              bitIndex = 7;
            }
          }
        }
        row += inc;
        if (row < 0 || this.moduleCount <= row) {
          row -= inc;
          inc = -inc;
          break;
        }
      }
    }
  }
  createData(typeNumber, errorCorrectLevel, dataList) {
    const qrRSBlock = new QRRSBlock(0, 0);
    const rsBlocks = qrRSBlock.getRSBlocks(typeNumber, errorCorrectLevel);
    const buffer = new QRBitBuffer();
    for (let i = 0; i < dataList.length; i++) {
      const data = dataList[i];
      buffer.put(data.mode, 4);
      buffer.put(data.getLength(), this.qrUtil.getLengthInBits(data.mode, typeNumber));
      data.write(buffer);
    }
    let totalDataCount = 0;
    for (let i = 0; i < rsBlocks.length; i++) {
      totalDataCount += rsBlocks[i].dataCount;
    }
    if (buffer.getLengthInBits() > totalDataCount * 8) {
      throw new Error("code length overflow. (" + buffer.getLengthInBits() + ">" + totalDataCount * 8 + ")");
    }
    if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
      buffer.put(0, 4);
    }
    while (buffer.getLengthInBits() % 8 != 0) {
      buffer.putBit(false);
    }
    while (true) {
      if (buffer.getLengthInBits() >= totalDataCount * 8) {
        break;
      }
      buffer.put(this.PAD0, 8);
      if (buffer.getLengthInBits() >= totalDataCount * 8) {
        break;
      }
      buffer.put(this.PAD1, 8);
    }
    return this.createBytes(buffer, rsBlocks);
  }
  createBytes(buffer, rsBlocks) {
    let offset = 0;
    let maxDcCount = 0;
    let maxEcCount = 0;
    const dcdata = new Array(rsBlocks.length);
    const ecdata = new Array(rsBlocks.length);
    for (let r = 0; r < rsBlocks.length; r++) {
      const dcCount = rsBlocks[r].dataCount;
      const ecCount = rsBlocks[r].totalCount - dcCount;
      maxDcCount = Math.max(maxDcCount, dcCount);
      maxEcCount = Math.max(maxEcCount, ecCount);
      dcdata[r] = new Array(dcCount);
      for (let i = 0; i < dcdata[r].length; i++) {
        dcdata[r][i] = 255 & buffer.buffer[i + offset];
      }
      offset += dcCount;
      const rsPoly = this.qrUtil.getErrorCorrectPolynomial(ecCount);
      const rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1);
      const modPoly = rawPoly.mod(rsPoly);
      ecdata[r] = new Array(rsPoly.getLength() - 1);
      for (let i = 0; i < ecdata[r].length; i++) {
        const modIndex = i + modPoly.getLength() - ecdata[r].length;
        ecdata[r][i] = modIndex >= 0 ? modPoly.get(modIndex) : 0;
      }
    }
    let totalCodeCount = 0;
    for (let i = 0; i < rsBlocks.length; i++) {
      totalCodeCount += rsBlocks[i].totalCount;
    }
    const data = new Array(totalCodeCount);
    let index = 0;
    for (let i = 0; i < maxDcCount; i++) {
      for (let r = 0; r < rsBlocks.length; r++) {
        if (i < dcdata[r].length) {
          data[index++] = dcdata[r][i];
        }
      }
    }
    for (let i = 0; i < maxEcCount; i++) {
      for (let r = 0; r < rsBlocks.length; r++) {
        if (i < ecdata[r].length) {
          data[index++] = ecdata[r][i];
        }
      }
    }
    return data;
  }
}
class QRUtil {
  constructor() {
    this.data = {
      PATTERN_POSITION_TABLE: [
        [],
        [6, 18],
        [6, 22],
        [6, 26],
        [6, 30],
        [6, 34],
        [6, 22, 38],
        [6, 24, 42],
        [6, 26, 46],
        [6, 28, 50],
        [6, 30, 54],
        [6, 32, 58],
        [6, 34, 62],
        [6, 26, 46, 66],
        [6, 26, 48, 70],
        [6, 26, 50, 74],
        [6, 30, 54, 78],
        [6, 30, 56, 82],
        [6, 30, 58, 86],
        [6, 34, 62, 90],
        [6, 28, 50, 72, 94],
        [6, 26, 50, 74, 98],
        [6, 30, 54, 78, 102],
        [6, 28, 54, 80, 106],
        [6, 32, 58, 84, 110],
        [6, 30, 58, 86, 114],
        [6, 34, 62, 90, 118],
        [6, 26, 50, 74, 98, 122],
        [6, 30, 54, 78, 102, 126],
        [6, 26, 52, 78, 104, 130],
        [6, 30, 56, 82, 108, 134],
        [6, 34, 60, 86, 112, 138],
        [6, 30, 58, 86, 114, 142],
        [6, 34, 62, 90, 118, 146],
        [6, 30, 54, 78, 102, 126, 150],
        [6, 24, 50, 76, 102, 128, 154],
        [6, 28, 54, 80, 106, 132, 158],
        [6, 32, 58, 84, 110, 136, 162],
        [6, 26, 54, 82, 110, 138, 166],
        [6, 30, 58, 86, 114, 142, 170]
      ],
      G15: 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0,
      G18: 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0,
      G15_MASK: 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1
    };
  }
  getBCHTypeInfo(data) {
    let d = data << 10;
    while (this.getBCHDigit(d) - this.getBCHDigit(this.data.G15) >= 0) {
      d ^= this.data.G15 << this.getBCHDigit(d) - this.getBCHDigit(this.data.G15);
    }
    return (data << 10 | d) ^ this.data.G15_MASK;
  }
  getBCHTypeNumber(data) {
    let d = data << 12;
    while (this.getBCHDigit(d) - this.getBCHDigit(this.data.G18) >= 0) {
      d ^= this.data.G18 << this.getBCHDigit(d) - this.getBCHDigit(this.data.G18);
    }
    return data << 12 | d;
  }
  getBCHDigit(data) {
    let digit = 0;
    while (data != 0) {
      digit++;
      data >>>= 1;
    }
    return digit;
  }
  getPatternPosition(typeNumber) {
    return this.data.PATTERN_POSITION_TABLE[typeNumber - 1];
  }
  getMask(maskPattern, i, j) {
    switch (maskPattern) {
      case QRMaskPattern.PATTERN000:
        return (i + j) % 2 == 0;
      case QRMaskPattern.PATTERN001:
        return i % 2 == 0;
      case QRMaskPattern.PATTERN010:
        return j % 3 == 0;
      case QRMaskPattern.PATTERN011:
        return (i + j) % 3 == 0;
      case QRMaskPattern.PATTERN100:
        return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0;
      case QRMaskPattern.PATTERN101:
        return i * j % 2 + i * j % 3 == 0;
      case QRMaskPattern.PATTERN110:
        return (i * j % 2 + i * j % 3) % 2 == 0;
      case QRMaskPattern.PATTERN111:
        return (i * j % 3 + (i + j) % 2) % 2 == 0;
      default:
        throw new Error("bad maskPattern:" + maskPattern);
    }
  }
  getErrorCorrectPolynomial(errorCorrectLength) {
    const qrMath = new QRMath();
    let a = new QRPolynomial([1], 0);
    for (let i = 0; i < errorCorrectLength; i++) {
      a = a.multiply(new QRPolynomial([1, qrMath.gexp(i)], 0));
    }
    return a;
  }
  getLengthInBits(mode, type) {
    if (1 <= type && type < 10) {
      switch (mode) {
        case QRMode.MODE_NUMBER:
          return 10;
        case QRMode.MODE_ALPHA_NUM:
          return 9;
        case QRMode.MODE_8BIT_BYTE:
          return 8;
        case QRMode.MODE_KANJI:
          return 8;
        default:
          throw new Error("mode:" + mode);
      }
    } else if (type < 27) {
      switch (mode) {
        case QRMode.MODE_NUMBER:
          return 12;
        case QRMode.MODE_ALPHA_NUM:
          return 11;
        case QRMode.MODE_8BIT_BYTE:
          return 16;
        case QRMode.MODE_KANJI:
          return 10;
        default:
          throw new Error("mode:" + mode);
      }
    } else if (type < 41) {
      switch (mode) {
        case QRMode.MODE_NUMBER:
          return 14;
        case QRMode.MODE_ALPHA_NUM:
          return 13;
        case QRMode.MODE_8BIT_BYTE:
          return 16;
        case QRMode.MODE_KANJI:
          return 12;
        default:
          throw new Error("mode:" + mode);
      }
    } else {
      throw new Error("type:" + type);
    }
  }
  getLostPoint(qrCode) {
    const moduleCount = qrCode.getModuleCount();
    let lostPoint = 0;
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        let sameCount = 0;
        const dark = qrCode.isDark(row, col);
        for (let r = -1; r <= 1; r++) {
          if (row + r < 0 || moduleCount <= row + r) {
            continue;
          }
          for (let c = -1; c <= 1; c++) {
            if (col + c < 0 || moduleCount <= col + c) {
              continue;
            }
            if (r == 0 && c == 0) {
              continue;
            }
            if (dark == qrCode.isDark(row + r, col + c)) {
              sameCount++;
            }
          }
        }
        if (sameCount > 5) {
          lostPoint += 3 + sameCount - 5;
        }
      }
    }
    for (let row = 0; row < moduleCount - 1; row++) {
      for (let col = 0; col < moduleCount - 1; col++) {
        let count = 0;
        if (qrCode.isDark(row, col))
          count++;
        if (qrCode.isDark(row + 1, col))
          count++;
        if (qrCode.isDark(row, col + 1))
          count++;
        if (qrCode.isDark(row + 1, col + 1))
          count++;
        if (count == 0 || count == 4) {
          lostPoint += 3;
        }
      }
    }
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount - 6; col++) {
        if (qrCode.isDark(row, col) && !qrCode.isDark(row, col + 1) && qrCode.isDark(row, col + 2) && qrCode.isDark(row, col + 3) && qrCode.isDark(row, col + 4) && !qrCode.isDark(row, col + 5) && qrCode.isDark(row, col + 6)) {
          lostPoint += 40;
        }
      }
    }
    for (let col = 0; col < moduleCount; col++) {
      for (let row = 0; row < moduleCount - 6; row++) {
        if (qrCode.isDark(row, col) && !qrCode.isDark(row + 1, col) && qrCode.isDark(row + 2, col) && qrCode.isDark(row + 3, col) && qrCode.isDark(row + 4, col) && !qrCode.isDark(row + 5, col) && qrCode.isDark(row + 6, col)) {
          lostPoint += 40;
        }
      }
    }
    let darkCount = 0;
    for (let col = 0; col < moduleCount; col++) {
      for (let row = 0; row < moduleCount; row++) {
        if (qrCode.isDark(row, col)) {
          darkCount++;
        }
      }
    }
    const ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
    lostPoint += ratio * 10;
    return lostPoint;
  }
}
class QRCode {
  constructor(userOptions) {
    this.options = {
      content: "",
      padding: 8,
      width: 256,
      height: 256,
      typeNumber: 4,
      color: "#000000",
      background: "#ffffff",
      ecl: "M",
      container: "svg",
      join: true
    };
    if (typeof userOptions === "string")
      userOptions = { content: userOptions };
    if (userOptions) {
      for (const i in userOptions) {
        this.options[i] = userOptions[i];
      }
    }
    if (this.options.content.length === 0 || this.options.content.length > 7e3) {
      throw new Error("Expected 'content' to be non-empty and less than 6K !");
    }
    if (this.options.padding < 1)
      this.options.padding = 1;
    if (this.options.width < 1)
      this.options.width = 256;
    if (this.options.height < 1)
      this.options.height = 256;
    const content = this.options.content;
    const type = this._getTypeNumber(content, this.options.ecl);
    const ecl = this._getErrorCorrectLevel(this.options.ecl);
    this.qrCodeModel = new QRCodeModel(type, ecl);
    this.qrCodeModel.addData(content);
    this.qrCodeModel.make();
  }
  _getErrorCorrectLevel(ecl) {
    switch (ecl) {
      case "L":
        return QRErrorCorrectLevel.L;
      case "M":
        return QRErrorCorrectLevel.M;
      case "Q":
        return QRErrorCorrectLevel.Q;
      case "H":
        return QRErrorCorrectLevel.H;
      default:
        throw new Error("Unknown error correction level: " + ecl);
    }
  }
  _getTypeNumber(content, ecl) {
    const length = this._getUTF8Length(content);
    let type = 1;
    let limit = 0;
    for (let i = 0, len = QRCodeLimitLength.length; i <= len; i++) {
      const table = QRCodeLimitLength[i];
      if (!table) {
        throw new Error("Content too long: expected " + limit + " but got " + length);
      }
      switch (ecl) {
        case "L":
          limit = table[0];
          break;
        case "M":
          limit = table[1];
          break;
        case "Q":
          limit = table[2];
          break;
        case "H":
          limit = table[3];
          break;
        default:
          throw new Error("Unknown error correction level: " + ecl);
      }
      if (length <= limit) {
        break;
      }
      type++;
    }
    if (type > QRCodeLimitLength.length) {
      throw new Error("Content too long");
    }
    return type;
  }
  _getUTF8Length(content) {
    const result = encodeURI(content).toString().replace(/\%[0-9a-fA-F]{2}/g, "a");
    return result.length + (result.length != content.length ? 3 : 0);
  }
  svg() {
    const EOL = "";
    const width = this.options.width;
    const height = this.options.height;
    const modules = this.qrCodeModel.modules;
    const length = modules.length;
    const xsize = width / (length + 2 * this.options.padding);
    const ysize = height / (length + 2 * this.options.padding);
    const join = this.options.join;
    const bgrect = '<rect x="0" y="0" width="' + width + '" height="' + height + '" style="fill:' + this.options.background + ';shape-rendering:crispEdges;"/>' + EOL;
    let modrect = "";
    let pathdata = "";
    for (let y = 0; y < length; y++) {
      for (let x = 0; x < length; x++) {
        const module = modules[x][y];
        if (module) {
          let px = x * xsize + this.options.padding * xsize;
          let py = y * ysize + this.options.padding * ysize;
          if (join) {
            let w = xsize + px;
            let h = ysize + py;
            px = Number.isInteger(px) ? Number(px) : px.toFixed(2);
            py = Number.isInteger(py) ? Number(py) : py.toFixed(2);
            w = Number.isInteger(w) ? Number(w) : w.toFixed(2);
            h = Number.isInteger(h) ? Number(h) : h.toFixed(2);
            pathdata += "M" + px + "," + py + " V" + h + " H" + w + " V" + py + " H" + px + " Z ";
          } else {
            modrect += '<rect x="' + px.toString() + '" y="' + py.toString() + '" width="' + xsize + '" height="' + ysize + '" style="fill:' + this.options.color + ';shape-rendering:crispEdges;"/>' + EOL;
          }
        }
      }
    }
    if (join) {
      modrect = '<path x="0" y="0" style="fill:' + this.options.color + ';shape-rendering:crispEdges;" d="' + pathdata + '" />';
    }
    let svg = "";
    switch (this.options.container) {
      case "svg":
        svg += '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="' + width + '" height="' + height + '">' + EOL;
        svg += bgrect + modrect;
        svg += "</svg>";
        break;
      case "svg-viewbox":
        svg += '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 ' + width + " " + height + '">' + EOL;
        svg += bgrect + modrect;
        svg += "</svg>";
        break;
      default:
        svg += bgrect + modrect;
        break;
    }
    return svg;
  }
}
const Qrcode = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { content = "" } = $$props;
  let { backgroundColor = "#ffffff" } = $$props;
  let { color = "#000000" } = $$props;
  let { errorCorrection = "M" } = $$props;
  let { isResponsive = false } = $$props;
  let { padding = 4 } = $$props;
  let { size = 150 } = $$props;
  const opt = {
    background: backgroundColor,
    color,
    container: isResponsive ? "svg-viewbox" : "svg",
    content,
    ecl: errorCorrection,
    height: size,
    join: true,
    padding,
    typeNumber: 4,
    width: size
  };
  const qrCode = new QRCode(opt);
  if ($$props.content === void 0 && $$bindings.content && content !== void 0)
    $$bindings.content(content);
  if ($$props.backgroundColor === void 0 && $$bindings.backgroundColor && backgroundColor !== void 0)
    $$bindings.backgroundColor(backgroundColor);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.errorCorrection === void 0 && $$bindings.errorCorrection && errorCorrection !== void 0)
    $$bindings.errorCorrection(errorCorrection);
  if ($$props.isResponsive === void 0 && $$bindings.isResponsive && isResponsive !== void 0)
    $$bindings.isResponsive(isResponsive);
  if ($$props.padding === void 0 && $$bindings.padding && padding !== void 0)
    $$bindings.padding(padding);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  return `<!-- HTML_TAG_START -->${qrCode.svg()}<!-- HTML_TAG_END -->`;
});
const QrAccount = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $allAddresses, $$unsubscribe_allAddresses;
  $$unsubscribe_allAddresses = subscribe(allAddresses, (value) => $allAddresses = value);
  let selectedAccount;
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `<div class="m-1 flex flex-col items-center justify-center space-y-4 p-2"> ${validate_component(Root$2, "Select.Root").$$render(
      $$result,
      { portal: null, selected: selectedAccount },
      {
        selected: ($$value) => {
          selectedAccount = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${validate_component(Select_trigger, "Select.Trigger").$$render($$result, { class: "w-[250px]" }, {}, {
            default: () => {
              return `${validate_component(Value, "Select.Value").$$render($$result, { placeholder: "Select Account" }, {}, {})}`;
            }
          })} ${validate_component(Select_content, "Select.Content").$$render($$result, {}, {}, {
            default: () => {
              return `${validate_component(Group, "Select.Group").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Select_label, "Select.Label").$$render($$result, {}, {}, {
                    default: () => {
                      return `Accounts`;
                    }
                  })} ${each($allAddresses, (account) => {
                    return `${validate_component(Select_item, "Select.Item").$$render(
                      $$result,
                      {
                        class: "m-2",
                        value: account.value,
                        label: account.address.substring(0, 5) + "..." + account.address.substring(account.address.length - 5, account.address.length)
                      },
                      {},
                      {
                        default: () => {
                          return `<div>${validate_component(Card_title, "Card.Title").$$render($$result, {}, {}, {
                            default: () => {
                              return `&quot;${escape(account.address.substring(0, 5))}...${escape(account.address.substring(account.address.length - 5, account.address.length))}&quot;`;
                            }
                          })} ${validate_component(Card_description, "Card.Description").$$render($$result, {}, {}, {
                            default: () => {
                              return `${escape(account.balance)}`;
                            }
                          })}</div> `;
                        }
                      }
                    )}`;
                  })}`;
                }
              })}`;
            }
          })} ${validate_component(Input$1, "Select.Input").$$render($$result, { name: "selectedAccount" }, {}, {})}`;
        }
      }
    )} ${selectedAccount != void 0 ? ` ${validate_component(Qrcode, "QrCode").$$render($$result, { content: selectedAccount.label }, {}, {})}  ${validate_component(Card, "Card.Root").$$render($$result, {}, {}, {
      default: () => {
        return `${validate_component(Card_content, "Card.Content").$$render(
          $$result,
          {
            class: "flex flex-row items-stretch justify-between space-x-4 p-4"
          },
          {},
          {
            default: () => {
              return `${validate_component(Label, "Label").$$render($$result, { for: "btn", class: "pt-3" }, {}, {
                default: () => {
                  return `${escape(selectedAccount.label)}`;
                }
              })} ${validate_component(Button, "Button").$$render(
                $$result,
                {
                  class: "btn",
                  variant: "outline",
                  size: "icon"
                },
                {},
                {
                  default: () => {
                    return `${validate_component(Icon, "Icon").$$render($$result, { icon: "iconamoon:copy-thin" }, {}, {})}`;
                  }
                }
              )}`;
            }
          }
        )}`;
      }
    })}` : ``}</div> ${validate_component(Toaster, "Toaster").$$render($$result, {}, {}, {})}`;
  } while (!$$settled);
  $$unsubscribe_allAddresses();
  return $$rendered;
});
const SendButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let accounts;
  let savingsAmount;
  let computeAmount;
  let $accounts, $$unsubscribe_accounts = noop$1, $$subscribe_accounts = () => ($$unsubscribe_accounts(), $$unsubscribe_accounts = subscribe(accounts, ($$value) => $accounts = $$value), accounts);
  let selectedAsset = void 0;
  let enteredAmount = void 0;
  let receiver = void 0;
  let selectedAccount = void 0;
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$subscribe_accounts(accounts = allAddresses);
    savingsAmount = () => {
      if (enteredAmount != void 0 && selectedAsset != void 0) {
        const toConvert = parseFloat(selectedAsset.value.token.exchange_rate) * parseFloat(enteredAmount);
        return Math.ceil(toConvert);
      } else
        return 0;
    };
    computeAmount = () => {
      if (selectedAsset != void 0 && enteredAmount != void 0) {
        return parseFloat(selectedAsset.value.token.exchange_rate) * parseFloat(enteredAmount);
      }
    };
    $$rendered = `<div class="flex flex-col space-y-4"> ${validate_component(Root$2, "Select.Root").$$render(
      $$result,
      { portal: null, selected: selectedAccount },
      {
        selected: ($$value) => {
          selectedAccount = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${validate_component(Select_trigger, "Select.Trigger").$$render($$result, { class: "w-[250px]" }, {}, {
            default: () => {
              return `${validate_component(Value, "Select.Value").$$render($$result, { placeholder: "Select Account" }, {}, {})}`;
            }
          })} ${validate_component(Select_content, "Select.Content").$$render($$result, {}, {}, {
            default: () => {
              return `${validate_component(Group, "Select.Group").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Select_label, "Select.Label").$$render($$result, {}, {}, {
                    default: () => {
                      return `Accounts`;
                    }
                  })} ${each($accounts, (account) => {
                    return `${validate_component(Select_item, "Select.Item").$$render(
                      $$result,
                      {
                        class: "m-2",
                        value: account,
                        label: account.address.substring(0, 5) + "..." + account.address.substring(account.address.length - 5, account.address.length)
                      },
                      {},
                      {
                        default: () => {
                          return `<div>${validate_component(Card_title, "Card.Title").$$render($$result, {}, {}, {
                            default: () => {
                              return `${escape(account.address.substring(0, 5))}...${escape(account.address.substring(account.address.length - 5, account.address.length))}`;
                            }
                          })} ${validate_component(Card_description, "Card.Description").$$render($$result, {}, {}, {
                            default: () => {
                              return `${escape(account.value)}`;
                            }
                          })}</div> `;
                        }
                      }
                    )}`;
                  })}`;
                }
              })}`;
            }
          })} ${validate_component(Input$1, "Select.Input").$$render($$result, { name: "selectedAccount" }, {}, {})}`;
        }
      }
    )}  ${selectedAccount != void 0 ? `${validate_component(Root$2, "Select.Root").$$render(
      $$result,
      { portal: null, selected: selectedAsset },
      {
        selected: ($$value) => {
          selectedAsset = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${validate_component(Select_trigger, "Select.Trigger").$$render($$result, { class: "w-[250px]" }, {}, {
            default: () => {
              return `${validate_component(Value, "Select.Value").$$render($$result, { placeholder: "Select Asset" }, {}, {})}`;
            }
          })} ${validate_component(Select_content, "Select.Content").$$render($$result, {}, {}, {
            default: () => {
              return `${validate_component(Group, "Select.Group").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Select_label, "Select.Label").$$render($$result, {}, {}, {
                    default: () => {
                      return `Assets`;
                    }
                  })} ${each(selectedAccount.value.tokens, (asset) => {
                    return `${validate_component(Select_item, "Select.Item").$$render(
                      $$result,
                      {
                        class: "m-2",
                        value: asset,
                        label: asset.token.name
                      },
                      {},
                      {
                        default: () => {
                          return `<div>${validate_component(Card_title, "Card.Title").$$render($$result, {}, {}, {
                            default: () => {
                              return `${escape(asset.token.name)}`;
                            }
                          })} ${validate_component(Card_description, "Card.Description").$$render($$result, {}, {}, {
                            default: () => {
                              return `${escape(asset.balance)}`;
                            }
                          })}</div> `;
                        }
                      }
                    )}`;
                  })}`;
                }
              })}`;
            }
          })} ${validate_component(Input$1, "Select.Input").$$render($$result, { name: "selectedAsset" }, {}, {})}`;
        }
      }
    )}` : ``} ${selectedAsset != void 0 ? `<div class="flex flex-row space-x-2">${validate_component(Label, "Label").$$render($$result, { for: "balance" }, {}, {
      default: () => {
        return `Balance`;
      }
    })} <div class="flex flex-col space-y-2"><div class="flex flex-row">${escape(selectedAsset.value.token.symbol)} ${escape(selectedAsset.value.balance)}</div> <div class="flex flex-row">usd ${escape(parseFloat(selectedAsset.value.token.exchange_rate) * parseFloat(selectedAsset.value.balance))}</div></div></div>` : ``}  <div class="flex flex-col gap-1.5">${validate_component(Label, "Label").$$render($$result, { for: "receiver" }, {}, {
      default: () => {
        return `Receiver`;
      }
    })} ${validate_component(Input, "Input").$$render(
      $$result,
      {
        id: "receiver",
        placeholder: "enter receiver address",
        value: receiver
      },
      {
        value: ($$value) => {
          receiver = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div>  <div class="flex flex-col gap-1.5">${validate_component(Label, "Label").$$render($$result, { for: "amount" }, {}, {
      default: () => {
        return `Amount`;
      }
    })} <div class="flex flex-row space-x-2">${validate_component(Input, "Input").$$render(
      $$result,
      {
        class: "grow-7",
        id: "amount",
        placeholder: "enter amount",
        value: enteredAmount
      },
      {
        value: ($$value) => {
          enteredAmount = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${validate_component(Button, "Button").$$render($$result, { class: "grow-1" }, {}, {
      default: () => {
        return `Max`;
      }
    })}</div></div> ${enteredAmount != void 0 && selectedAsset != void 0 ? `<div class="flex flex-col space-y-1"><div> ${validate_component(Label, "Label").$$render($$result, { for: "amount_desc" }, {}, {
      default: () => {
        return `Amount`;
      }
    })} ${validate_component(Card, "Card.Root").$$render($$result, { class: "amount_desc" }, {}, {
      default: () => {
        return `${validate_component(Card_title, "Card.Title").$$render($$result, {}, {}, {
          default: () => {
            return `${escape(selectedAsset != void 0 ? selectedAsset.label : "")} ${escape(enteredAmount != void 0 ? enteredAmount : "")}`;
          }
        })} ${validate_component(Card_description, "Card.Description").$$render($$result, {}, {}, {
          default: () => {
            return `USD ${escape(selectedAsset != void 0 && enteredAmount != void 0 ? computeAmount() : "")}`;
          }
        })}`;
      }
    })}</div> <div>${validate_component(Label, "Label").$$render($$result, { for: "your_savings" }, {}, {
      default: () => {
        return `Savings`;
      }
    })} ${validate_component(Card, "Card.Root").$$render($$result, { class: "your_savings" }, {}, {
      default: () => {
        return `${validate_component(Card_title, "Card.Title").$$render($$result, {}, {}, {
          default: () => {
            return `${escape(selectedAsset != null ? selectedAsset.value.token.name : "")} ${escape((savingsAmount() - parseFloat(selectedAsset.value.token.exchange_rate) * parseFloat(enteredAmount)) * (1 / parseFloat(selectedAsset.value.token.exchange_rate)))}`;
          }
        })} ${validate_component(Card_description, "Card.Description").$$render($$result, {}, {}, {
          default: () => {
            return `USD ${escape(selectedAsset != void 0 && savingsAmount() != void 0 ? savingsAmount() - parseFloat(selectedAsset.value.token.exchange_rate) * parseFloat(enteredAmount) : "")}`;
          }
        })}`;
      }
    })}</div> <div>${validate_component(Label, "Label").$$render($$result, { for: "gas" }, {}, {
      default: () => {
        return `Estimated gas fees`;
      }
    })} ${validate_component(Card, "Card.Root").$$render($$result, { class: "gas" }, {}, {
      default: () => {
        return `${validate_component(Card_title, "Card.Title").$$render($$result, {}, {}, {
          default: () => {
            return `0.0`;
          }
        })} ${validate_component(Card_description, "Card.Description").$$render($$result, {}, {}, {
          default: () => {
            return `USD 0.0`;
          }
        })}`;
      }
    })}</div> <div>${validate_component(Label, "Label").$$render($$result, { for: "total" }, {}, {
      default: () => {
        return `Total`;
      }
    })} ${validate_component(Card, "Card.Root").$$render($$result, { class: "total" }, {}, {
      default: () => {
        return `${validate_component(Card_title, "Card.Title").$$render($$result, {}, {}, {
          default: () => {
            return `${escape(selectedAsset.value.token.name)} ${escape(savingsAmount() * (1 / parseFloat(selectedAsset.value.token.exchange_rate)))}`;
          }
        })} ${validate_component(Card_description, "Card.Description").$$render($$result, {}, {}, {
          default: () => {
            return `USD ${escape(savingsAmount())}`;
          }
        })}`;
      }
    })}</div></div>` : ``} <div class="h-[40px]"></div> ${validate_component(Button, "Button").$$render($$result, { type: "submit" }, {}, {
      default: () => {
        return `Send Transaction`;
      }
    })}</div> ${validate_component(Toaster, "Toaster").$$render($$result, {}, {}, {})}`;
  } while (!$$settled);
  $$unsubscribe_accounts();
  return $$rendered;
});
const Separator = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "orientation", "decorative"]);
  let { class: className = void 0 } = $$props;
  let { orientation = "horizontal" } = $$props;
  let { decorative = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.orientation === void 0 && $$bindings.orientation && orientation !== void 0)
    $$bindings.orientation(orientation);
  if ($$props.decorative === void 0 && $$bindings.decorative && decorative !== void 0)
    $$bindings.decorative(decorative);
  return `${validate_component(Separator$1, "SeparatorPrimitive.Root").$$render(
    $$result,
    Object.assign(
      {},
      {
        class: cn(
          "shrink-0 bg-border",
          orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
          className
        )
      },
      { orientation },
      { decorative },
      $$restProps
    ),
    {},
    {}
  )}`;
});
const TestDapp = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let accounts;
  let $$unsubscribe_walletConnection;
  let $accounts, $$unsubscribe_accounts = noop$1, $$subscribe_accounts = () => ($$unsubscribe_accounts(), $$unsubscribe_accounts = subscribe(accounts, ($$value) => $accounts = $$value), accounts);
  $$unsubscribe_walletConnection = subscribe(walletConnection, (value) => value);
  let selectedAccount = void 0;
  let enteredUrl = "";
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$subscribe_accounts(accounts = allAddresses);
    $$rendered = `<div class="m-1 flex flex-col space-y-2 p-2"> ${validate_component(Root$2, "Select.Root").$$render(
      $$result,
      { portal: null, selected: selectedAccount },
      {
        selected: ($$value) => {
          selectedAccount = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${validate_component(Select_trigger, "Select.Trigger").$$render($$result, { class: "w-[250px]" }, {}, {
            default: () => {
              return `${validate_component(Value, "Select.Value").$$render($$result, { placeholder: "Select Account" }, {}, {})}`;
            }
          })} ${validate_component(Select_content, "Select.Content").$$render($$result, {}, {}, {
            default: () => {
              return `${validate_component(Group, "Select.Group").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Select_label, "Select.Label").$$render($$result, {}, {}, {
                    default: () => {
                      return `Accounts`;
                    }
                  })} ${each($accounts, (account) => {
                    return `${validate_component(Select_item, "Select.Item").$$render(
                      $$result,
                      {
                        class: "m-2",
                        value: account,
                        label: account.address.substring(0, 5) + "..." + account.address.substring(account.address.length - 5, account.address.length)
                      },
                      {},
                      {
                        default: () => {
                          return `<div>${validate_component(Card_title, "Card.Title").$$render($$result, {}, {}, {
                            default: () => {
                              return `&quot;${escape(account.address.substring(0, 5))}...${escape(account.address.substring(account.address.length - 5, account.address.length))}&quot;`;
                            }
                          })} ${validate_component(Card_description, "Card.Description").$$render($$result, {}, {}, {
                            default: () => {
                              return `${escape(account.value)}`;
                            }
                          })}</div> `;
                        }
                      }
                    )}`;
                  })}`;
                }
              })}`;
            }
          })} ${validate_component(Input$1, "Select.Input").$$render($$result, { name: "selectedAccount" }, {}, {})}`;
        }
      }
    )} ${validate_component(Input, "Input").$$render(
      $$result,
      {
        placeholder: "enter url",
        value: enteredUrl
      },
      {
        value: ($$value) => {
          enteredUrl = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${validate_component(Button, "Button").$$render($$result, {}, {}, {
      default: () => {
        return `Test Dapp connection`;
      }
    })}</div>`;
  } while (!$$settled);
  $$unsubscribe_walletConnection();
  $$unsubscribe_accounts();
  return $$rendered;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const actionButtons = [
    {
      label: "send",
      description: "Send tokens",
      icon: "iconamoon:send-thin",
      index: 0
    },
    {
      label: "receive",
      description: "Via your account and QRCode",
      icon: "uiw:qrcode",
      index: 1
    },
    {
      label: "add account",
      description: "Create new acount",
      icon: "tdesign:blockchain",
      index: 2
    },
    // {
    // 	label: 'add token',
    // 	description: 'Add new Token',
    // 	icon: 'mingcute:add-line',
    // 	index: 4
    // },
    {
      label: "Connect App",
      description: "Test connection",
      icon: "mingcute:add-line",
      index: 5
    }
  ];
  return ` <div class="m-1 flex flex-col space-y-8 p-3"><div class="flex grow-[1] basis-24 flex-row items-center justify-end space-x-3">${each(actionButtons, (btn) => {
    return `${validate_component(Root, "Sheet.Root").$$render($$result, {}, {}, {
      default: () => {
        return `${validate_component(Trigger, "Sheet.Trigger").$$render($$result, { asChild: true }, {}, {
          default: ({ builder: builder2 }) => {
            return `${validate_component(Button, "Button").$$render(
              $$result,
              {
                builders: [builder2],
                variant: "outline",
                class: "space-x-2 bg-transparent text-white"
              },
              {},
              {
                default: () => {
                  return `${validate_component(Icon, "Icon").$$render(
                    $$result,
                    {
                      icon: btn.icon,
                      width: "20px",
                      height: "20px"
                    },
                    {},
                    {}
                  )} ${validate_component(Label, "Label").$$render($$result, {}, {}, {
                    default: () => {
                      return `${escape(btn.label)} `;
                    }
                  })}`;
                }
              }
            )} `;
          }
        })} ${validate_component(Sheet_content, "Sheet.Content").$$render(
          $$result,
          {
            side: "right",
            class: "m-4 max-h-[750px] rounded-xl"
          },
          {},
          {
            default: () => {
              return `${validate_component(Sheet_header, "Sheet.Header").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Sheet_title, "Sheet.Title").$$render($$result, {}, {}, {
                    default: () => {
                      return `${escape(btn.label)} `;
                    }
                  })} ${validate_component(Sheet_description, "Sheet.Description").$$render($$result, {}, {}, {
                    default: () => {
                      return `${escape(btn.description)} `;
                    }
                  })} `;
                }
              })} ${btn.index == 0 ? `${validate_component(SendButton, "SendButton").$$render($$result, {}, {}, {})}` : `${btn.index == 1 ? `${validate_component(QrAccount, "QrAccount").$$render($$result, {}, {}, {})}` : `${btn.index == 2 ? `${validate_component(AddAccount, "AddAccount").$$render($$result, {}, {}, {})} ` : `${btn.index == 5 ? `${validate_component(TestDapp, "TestDapp").$$render($$result, {}, {}, {})}` : ``}`}`}`} `;
            }
          }
        )} `;
      }
    })}`;
  })}</div> <div class="flex flex-row">${validate_component(ActiveConnections, "ActiveConnections").$$render($$result, {}, {}, {})} ${validate_component(Separator, "Separator").$$render($$result, { orientation: "vertical" }, {}, {})} ${validate_component(IncomingRequests, "IncomingRequests").$$render($$result, {}, {}, {})}</div> <div class="grow-[1] basis-48">${validate_component(PortfolioSummary, "PortfolioSummary").$$render($$result, {}, {}, {})}</div> <div class="grow-1 basis-96">${validate_component(AccountSummary, "AccountSummary").$$render($$result, {}, {}, {})}</div></div>`;
});
export {
  Icon as I,
  Page as P
};
