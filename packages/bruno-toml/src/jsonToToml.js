const stringify = require('../lib/stringify');
const { get, each, filter } = require('lodash');

const keyValPairHasDuplicateKeys = (keyValPair) => {
  if (!keyValPair || !Array.isArray(keyValPair) || !keyValPair.length) {
    return false;
  }

  const names = keyValPair.map((pair) => pair.name);
  const uniqueNames = new Set(names);

  return names.length !== uniqueNames.size;
};

const jsonToToml = (json) => {
  const formattedJson = {
    meta: {
      name: get(json, 'meta.name'),
      type: get(json, 'meta.type'),
      seq: get(json, 'meta.seq')
    },
    http: {
      method: get(json, 'http.method'),
      url: get(json, 'http.url', '')
    }
  };

  if (json.headers && json.headers.length) {
    const hasDuplicateHeaders = keyValPairHasDuplicateKeys(json.headers);

    if (!hasDuplicateHeaders) {
      const enabledHeaders = filter(json.headers, (header) => header.enabled);
      const disabledHeaders = filter(json.headers, (header) => !header.enabled);
      each(enabledHeaders, (header) => {
        formattedJson.headers = formattedJson.headers || {};
        formattedJson.headers[header.name] = header.value;
      });
      each(disabledHeaders, (header) => {
        formattedJson.headers = formattedJson.headers || {};
        formattedJson.headers.disabled = formattedJson.headers.disabled || {};
        formattedJson.headers.disabled[header.name] = header.value;
      });
    } else {
      formattedJson.headers = {
        raw: JSON.stringify(json.headers, null, 2)
      };
    }
  }

  return stringify(formattedJson);
};

module.exports = jsonToToml;
