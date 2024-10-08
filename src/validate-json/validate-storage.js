'use strict';
module.exports = validate10;
module.exports.default = validate10;
const schema11 = {
  type: 'object',
  properties: {
    settings_hostname: { type: 'string', enum: ['twitter.com', 'x.com'] },
    settings_timezone: { type: 'string' },
    settings_datetimeFormat: { type: 'string' },
    settings_scrapboxIcon: { type: 'string', enum: ['scrapbox', 'cosense'] },
    settings_twitterIcon: { type: 'string', enum: ['twitter', 'x'] },
    tweetTemplate_tweet: { type: 'string' },
    tweetTemplate_footer: { type: 'string' },
    tweetTemplate_entityText: { type: 'string' },
    tweetTemplate_entityUrl: { type: 'string' },
    tweetTemplate_entityHashtag: { type: 'string' },
    tweetTemplate_entityCashtag: { type: 'string' },
    tweetTemplate_entityMention: { type: 'string' },
    tweetTemplate_mediaPhoto: { type: 'string' },
    tweetTemplate_mediaVideo: { type: 'string' },
    tweetTemplate_quote: { type: 'boolean' },
    trashbox: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          deleted_at: { type: 'integer' },
          tweet_id: { type: 'string', pattern: '^[0-9]+$' },
        },
        required: ['deleted_at', 'tweet_id'],
        additionalProperties: false,
      },
    },
    tweetSort: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          enum: ['created_time', 'saved_time', 'username'],
        },
        order: { type: 'string', enum: ['asc', 'desc'] },
      },
      required: ['key', 'order'],
      additionalProperties: false,
    },
    trashboxSort: {
      type: 'object',
      properties: {
        key: { type: 'string', enum: ['deleted_time'] },
        order: { type: 'string', enum: ['asc', 'desc'] },
      },
      required: ['key', 'order'],
      additionalProperties: false,
    },
  },
  patternProperties: { '^tweet_[0-9]+$': { $ref: '#/definitions/tweet' } },
  additionalProperties: false,
  definitions: {
    uri: { type: 'string', format: 'uri' },
    iri: { type: 'string', format: 'iri' },
    tweet: {
      type: 'object',
      properties: {
        id: { $ref: '#/definitions/tweet:id' },
        created_at: { type: 'integer' },
        saved_at: { type: 'integer' },
        author: { $ref: '#/definitions/user' },
        text: { type: 'array', items: { $ref: '#/definitions/entity' } },
        media: { type: 'array', items: { $ref: '#/definitions/media' } },
      },
      required: ['id', 'created_at', 'saved_at', 'author', 'text'],
      additionalProperties: false,
    },
    'tweet:id': { type: 'string', pattern: '^[0-9]+$' },
    username: { type: 'string', pattern: '^\\w{1,15}$' },
    user: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        username: { $ref: '#/definitions/username' },
      },
      required: ['name', 'username'],
      additionalProperties: false,
    },
    entity: {
      type: 'object',
      oneOf: [
        { $ref: '#/definitions/entity:text' },
        { $ref: '#/definitions/entity:url' },
        { $ref: '#/definitions/entity:hashtag' },
        { $ref: '#/definitions/entity:cashtag' },
        { $ref: '#/definitions/entity:mention' },
      ],
      required: ['type'],
      discriminator: { propertyName: 'type' },
    },
    'entity:text': {
      type: 'object',
      properties: { type: { const: 'text' }, text: { type: 'string' } },
      required: ['type', 'text'],
      additionalProperties: false,
    },
    'entity:url': {
      type: 'object',
      properties: {
        type: { const: 'url' },
        text: { type: 'string' },
        short_url: { $ref: '#/definitions/uri' },
        expanded_url: { $ref: '#/definitions/uri' },
        decoded_url: { $ref: '#/definitions/iri' },
        title: { type: 'string' },
      },
      required: ['type', 'text', 'short_url', 'expanded_url', 'decoded_url'],
      additionalProperties: false,
    },
    'entity:hashtag': {
      type: 'object',
      properties: {
        type: { const: 'hashtag' },
        text: { type: 'string' },
        tag: { type: 'string' },
        hashmoji: { $ref: '#/definitions/uri' },
      },
      required: ['type', 'text', 'tag'],
      additionalProperties: false,
    },
    'entity:cashtag': {
      type: 'object',
      properties: {
        type: { const: 'cashtag' },
        text: { type: 'string' },
        tag: { type: 'string' },
      },
      required: ['type', 'text', 'tag'],
      additionalProperties: false,
    },
    'entity:mention': {
      type: 'object',
      properties: {
        type: { const: 'mention' },
        text: { type: 'string' },
        username: { $ref: '#/definitions/username' },
      },
      required: ['type', 'text', 'username'],
      additionalProperties: false,
    },
    media: {
      type: 'object',
      oneOf: [
        { $ref: '#/definitions/media:photo' },
        { $ref: '#/definitions/media:video' },
      ],
      required: ['type'],
      discriminator: { propertyName: 'type' },
    },
    'media:photo': {
      type: 'object',
      properties: {
        type: { const: 'photo' },
        url: { $ref: '#/definitions/uri' },
      },
      required: ['type', 'url'],
      additionalProperties: false,
    },
    'media:video': {
      type: 'object',
      properties: {
        type: { const: 'video' },
        thumbnail: { $ref: '#/definitions/uri' },
      },
      required: ['type', 'thumbnail'],
      additionalProperties: false,
    },
  },
};
const func2 = Object.prototype.hasOwnProperty;
const pattern0 = new RegExp('^tweet_[0-9]+$', 'u');
const pattern1 = new RegExp('^[0-9]+$', 'u');
const schema12 = {
  type: 'object',
  properties: {
    id: { $ref: '#/definitions/tweet:id' },
    created_at: { type: 'integer' },
    saved_at: { type: 'integer' },
    author: { $ref: '#/definitions/user' },
    text: { type: 'array', items: { $ref: '#/definitions/entity' } },
    media: { type: 'array', items: { $ref: '#/definitions/media' } },
  },
  required: ['id', 'created_at', 'saved_at', 'author', 'text'],
  additionalProperties: false,
};
const schema13 = { type: 'string', pattern: '^[0-9]+$' };
const schema14 = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    username: { $ref: '#/definitions/username' },
  },
  required: ['name', 'username'],
  additionalProperties: false,
};
const schema15 = { type: 'string', pattern: '^\\w{1,15}$' };
const pattern4 = new RegExp('^\\w{1,15}$', 'u');
function validate12(
  data,
  { instancePath = '', parentData, parentDataProperty, rootData = data } = {},
) {
  let vErrors = null;
  let errors = 0;
  if (data && typeof data == 'object' && !Array.isArray(data)) {
    if (data.name === undefined) {
      const err0 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'name' },
        message: "must have required property '" + 'name' + "'",
      };
      if (vErrors === null) {
        vErrors = [err0];
      } else {
        vErrors.push(err0);
      }
      errors++;
    }
    if (data.username === undefined) {
      const err1 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'username' },
        message: "must have required property '" + 'username' + "'",
      };
      if (vErrors === null) {
        vErrors = [err1];
      } else {
        vErrors.push(err1);
      }
      errors++;
    }
    for (const key0 in data) {
      if (!(key0 === 'name' || key0 === 'username')) {
        const err2 = {
          instancePath,
          schemaPath: '#/additionalProperties',
          keyword: 'additionalProperties',
          params: { additionalProperty: key0 },
          message: 'must NOT have additional properties',
        };
        if (vErrors === null) {
          vErrors = [err2];
        } else {
          vErrors.push(err2);
        }
        errors++;
      }
    }
    if (data.name !== undefined) {
      if (typeof data.name !== 'string') {
        const err3 = {
          instancePath: instancePath + '/name',
          schemaPath: '#/properties/name/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
        };
        if (vErrors === null) {
          vErrors = [err3];
        } else {
          vErrors.push(err3);
        }
        errors++;
      }
    }
    if (data.username !== undefined) {
      let data1 = data.username;
      if (typeof data1 === 'string') {
        if (!pattern4.test(data1)) {
          const err4 = {
            instancePath: instancePath + '/username',
            schemaPath: '#/definitions/username/pattern',
            keyword: 'pattern',
            params: { pattern: '^\\w{1,15}$' },
            message: 'must match pattern "' + '^\\w{1,15}$' + '"',
          };
          if (vErrors === null) {
            vErrors = [err4];
          } else {
            vErrors.push(err4);
          }
          errors++;
        }
      } else {
        const err5 = {
          instancePath: instancePath + '/username',
          schemaPath: '#/definitions/username/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
        };
        if (vErrors === null) {
          vErrors = [err5];
        } else {
          vErrors.push(err5);
        }
        errors++;
      }
    }
  } else {
    const err6 = {
      instancePath,
      schemaPath: '#/type',
      keyword: 'type',
      params: { type: 'object' },
      message: 'must be object',
    };
    if (vErrors === null) {
      vErrors = [err6];
    } else {
      vErrors.push(err6);
    }
    errors++;
  }
  validate12.errors = vErrors;
  return errors === 0;
}
const schema16 = {
  type: 'object',
  oneOf: [
    { $ref: '#/definitions/entity:text' },
    { $ref: '#/definitions/entity:url' },
    { $ref: '#/definitions/entity:hashtag' },
    { $ref: '#/definitions/entity:cashtag' },
    { $ref: '#/definitions/entity:mention' },
  ],
  required: ['type'],
  discriminator: { propertyName: 'type' },
};
const schema25 = {
  type: 'object',
  properties: { type: { const: 'text' }, text: { type: 'string' } },
  required: ['type', 'text'],
  additionalProperties: false,
};
const schema26 = {
  type: 'object',
  properties: {
    type: { const: 'cashtag' },
    text: { type: 'string' },
    tag: { type: 'string' },
  },
  required: ['type', 'text', 'tag'],
  additionalProperties: false,
};
const schema17 = {
  type: 'object',
  properties: {
    type: { const: 'url' },
    text: { type: 'string' },
    short_url: { $ref: '#/definitions/uri' },
    expanded_url: { $ref: '#/definitions/uri' },
    decoded_url: { $ref: '#/definitions/iri' },
    title: { type: 'string' },
  },
  required: ['type', 'text', 'short_url', 'expanded_url', 'decoded_url'],
  additionalProperties: false,
};
const schema18 = { type: 'string', format: 'uri' };
const schema20 = { type: 'string', format: 'iri' };
const formats0 = require('./formats').uri;
const formats4 = require('./formats').iri;
function validate15(
  data,
  { instancePath = '', parentData, parentDataProperty, rootData = data } = {},
) {
  let vErrors = null;
  let errors = 0;
  if (data && typeof data == 'object' && !Array.isArray(data)) {
    if (data.type === undefined) {
      const err0 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'type' },
        message: "must have required property '" + 'type' + "'",
      };
      if (vErrors === null) {
        vErrors = [err0];
      } else {
        vErrors.push(err0);
      }
      errors++;
    }
    if (data.text === undefined) {
      const err1 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'text' },
        message: "must have required property '" + 'text' + "'",
      };
      if (vErrors === null) {
        vErrors = [err1];
      } else {
        vErrors.push(err1);
      }
      errors++;
    }
    if (data.short_url === undefined) {
      const err2 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'short_url' },
        message: "must have required property '" + 'short_url' + "'",
      };
      if (vErrors === null) {
        vErrors = [err2];
      } else {
        vErrors.push(err2);
      }
      errors++;
    }
    if (data.expanded_url === undefined) {
      const err3 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'expanded_url' },
        message: "must have required property '" + 'expanded_url' + "'",
      };
      if (vErrors === null) {
        vErrors = [err3];
      } else {
        vErrors.push(err3);
      }
      errors++;
    }
    if (data.decoded_url === undefined) {
      const err4 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'decoded_url' },
        message: "must have required property '" + 'decoded_url' + "'",
      };
      if (vErrors === null) {
        vErrors = [err4];
      } else {
        vErrors.push(err4);
      }
      errors++;
    }
    for (const key0 in data) {
      if (
        !(
          key0 === 'type' ||
          key0 === 'text' ||
          key0 === 'short_url' ||
          key0 === 'expanded_url' ||
          key0 === 'decoded_url' ||
          key0 === 'title'
        )
      ) {
        const err5 = {
          instancePath,
          schemaPath: '#/additionalProperties',
          keyword: 'additionalProperties',
          params: { additionalProperty: key0 },
          message: 'must NOT have additional properties',
        };
        if (vErrors === null) {
          vErrors = [err5];
        } else {
          vErrors.push(err5);
        }
        errors++;
      }
    }
    if (data.type !== undefined) {
      if ('url' !== data.type) {
        const err6 = {
          instancePath: instancePath + '/type',
          schemaPath: '#/properties/type/const',
          keyword: 'const',
          params: { allowedValue: 'url' },
          message: 'must be equal to constant',
        };
        if (vErrors === null) {
          vErrors = [err6];
        } else {
          vErrors.push(err6);
        }
        errors++;
      }
    }
    if (data.text !== undefined) {
      if (typeof data.text !== 'string') {
        const err7 = {
          instancePath: instancePath + '/text',
          schemaPath: '#/properties/text/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
        };
        if (vErrors === null) {
          vErrors = [err7];
        } else {
          vErrors.push(err7);
        }
        errors++;
      }
    }
    if (data.short_url !== undefined) {
      let data2 = data.short_url;
      if (typeof data2 === 'string') {
        if (!formats0(data2)) {
          const err8 = {
            instancePath: instancePath + '/short_url',
            schemaPath: '#/definitions/uri/format',
            keyword: 'format',
            params: { format: 'uri' },
            message: 'must match format "' + 'uri' + '"',
          };
          if (vErrors === null) {
            vErrors = [err8];
          } else {
            vErrors.push(err8);
          }
          errors++;
        }
      } else {
        const err9 = {
          instancePath: instancePath + '/short_url',
          schemaPath: '#/definitions/uri/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
        };
        if (vErrors === null) {
          vErrors = [err9];
        } else {
          vErrors.push(err9);
        }
        errors++;
      }
    }
    if (data.expanded_url !== undefined) {
      let data3 = data.expanded_url;
      if (typeof data3 === 'string') {
        if (!formats0(data3)) {
          const err10 = {
            instancePath: instancePath + '/expanded_url',
            schemaPath: '#/definitions/uri/format',
            keyword: 'format',
            params: { format: 'uri' },
            message: 'must match format "' + 'uri' + '"',
          };
          if (vErrors === null) {
            vErrors = [err10];
          } else {
            vErrors.push(err10);
          }
          errors++;
        }
      } else {
        const err11 = {
          instancePath: instancePath + '/expanded_url',
          schemaPath: '#/definitions/uri/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
        };
        if (vErrors === null) {
          vErrors = [err11];
        } else {
          vErrors.push(err11);
        }
        errors++;
      }
    }
    if (data.decoded_url !== undefined) {
      let data4 = data.decoded_url;
      if (typeof data4 === 'string') {
        if (!formats4(data4)) {
          const err12 = {
            instancePath: instancePath + '/decoded_url',
            schemaPath: '#/definitions/iri/format',
            keyword: 'format',
            params: { format: 'iri' },
            message: 'must match format "' + 'iri' + '"',
          };
          if (vErrors === null) {
            vErrors = [err12];
          } else {
            vErrors.push(err12);
          }
          errors++;
        }
      } else {
        const err13 = {
          instancePath: instancePath + '/decoded_url',
          schemaPath: '#/definitions/iri/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
        };
        if (vErrors === null) {
          vErrors = [err13];
        } else {
          vErrors.push(err13);
        }
        errors++;
      }
    }
    if (data.title !== undefined) {
      if (typeof data.title !== 'string') {
        const err14 = {
          instancePath: instancePath + '/title',
          schemaPath: '#/properties/title/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
        };
        if (vErrors === null) {
          vErrors = [err14];
        } else {
          vErrors.push(err14);
        }
        errors++;
      }
    }
  } else {
    const err15 = {
      instancePath,
      schemaPath: '#/type',
      keyword: 'type',
      params: { type: 'object' },
      message: 'must be object',
    };
    if (vErrors === null) {
      vErrors = [err15];
    } else {
      vErrors.push(err15);
    }
    errors++;
  }
  validate15.errors = vErrors;
  return errors === 0;
}
const schema21 = {
  type: 'object',
  properties: {
    type: { const: 'hashtag' },
    text: { type: 'string' },
    tag: { type: 'string' },
    hashmoji: { $ref: '#/definitions/uri' },
  },
  required: ['type', 'text', 'tag'],
  additionalProperties: false,
};
function validate16(
  data,
  { instancePath = '', parentData, parentDataProperty, rootData = data } = {},
) {
  let vErrors = null;
  let errors = 0;
  if (data && typeof data == 'object' && !Array.isArray(data)) {
    if (data.type === undefined) {
      const err0 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'type' },
        message: "must have required property '" + 'type' + "'",
      };
      if (vErrors === null) {
        vErrors = [err0];
      } else {
        vErrors.push(err0);
      }
      errors++;
    }
    if (data.text === undefined) {
      const err1 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'text' },
        message: "must have required property '" + 'text' + "'",
      };
      if (vErrors === null) {
        vErrors = [err1];
      } else {
        vErrors.push(err1);
      }
      errors++;
    }
    if (data.tag === undefined) {
      const err2 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'tag' },
        message: "must have required property '" + 'tag' + "'",
      };
      if (vErrors === null) {
        vErrors = [err2];
      } else {
        vErrors.push(err2);
      }
      errors++;
    }
    for (const key0 in data) {
      if (
        !(
          key0 === 'type' ||
          key0 === 'text' ||
          key0 === 'tag' ||
          key0 === 'hashmoji'
        )
      ) {
        const err3 = {
          instancePath,
          schemaPath: '#/additionalProperties',
          keyword: 'additionalProperties',
          params: { additionalProperty: key0 },
          message: 'must NOT have additional properties',
        };
        if (vErrors === null) {
          vErrors = [err3];
        } else {
          vErrors.push(err3);
        }
        errors++;
      }
    }
    if (data.type !== undefined) {
      if ('hashtag' !== data.type) {
        const err4 = {
          instancePath: instancePath + '/type',
          schemaPath: '#/properties/type/const',
          keyword: 'const',
          params: { allowedValue: 'hashtag' },
          message: 'must be equal to constant',
        };
        if (vErrors === null) {
          vErrors = [err4];
        } else {
          vErrors.push(err4);
        }
        errors++;
      }
    }
    if (data.text !== undefined) {
      if (typeof data.text !== 'string') {
        const err5 = {
          instancePath: instancePath + '/text',
          schemaPath: '#/properties/text/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
        };
        if (vErrors === null) {
          vErrors = [err5];
        } else {
          vErrors.push(err5);
        }
        errors++;
      }
    }
    if (data.tag !== undefined) {
      if (typeof data.tag !== 'string') {
        const err6 = {
          instancePath: instancePath + '/tag',
          schemaPath: '#/properties/tag/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
        };
        if (vErrors === null) {
          vErrors = [err6];
        } else {
          vErrors.push(err6);
        }
        errors++;
      }
    }
    if (data.hashmoji !== undefined) {
      let data3 = data.hashmoji;
      if (typeof data3 === 'string') {
        if (!formats0(data3)) {
          const err7 = {
            instancePath: instancePath + '/hashmoji',
            schemaPath: '#/definitions/uri/format',
            keyword: 'format',
            params: { format: 'uri' },
            message: 'must match format "' + 'uri' + '"',
          };
          if (vErrors === null) {
            vErrors = [err7];
          } else {
            vErrors.push(err7);
          }
          errors++;
        }
      } else {
        const err8 = {
          instancePath: instancePath + '/hashmoji',
          schemaPath: '#/definitions/uri/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
        };
        if (vErrors === null) {
          vErrors = [err8];
        } else {
          vErrors.push(err8);
        }
        errors++;
      }
    }
  } else {
    const err9 = {
      instancePath,
      schemaPath: '#/type',
      keyword: 'type',
      params: { type: 'object' },
      message: 'must be object',
    };
    if (vErrors === null) {
      vErrors = [err9];
    } else {
      vErrors.push(err9);
    }
    errors++;
  }
  validate16.errors = vErrors;
  return errors === 0;
}
const schema23 = {
  type: 'object',
  properties: {
    type: { const: 'mention' },
    text: { type: 'string' },
    username: { $ref: '#/definitions/username' },
  },
  required: ['type', 'text', 'username'],
  additionalProperties: false,
};
function validate17(
  data,
  { instancePath = '', parentData, parentDataProperty, rootData = data } = {},
) {
  let vErrors = null;
  let errors = 0;
  if (data && typeof data == 'object' && !Array.isArray(data)) {
    if (data.type === undefined) {
      const err0 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'type' },
        message: "must have required property '" + 'type' + "'",
      };
      if (vErrors === null) {
        vErrors = [err0];
      } else {
        vErrors.push(err0);
      }
      errors++;
    }
    if (data.text === undefined) {
      const err1 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'text' },
        message: "must have required property '" + 'text' + "'",
      };
      if (vErrors === null) {
        vErrors = [err1];
      } else {
        vErrors.push(err1);
      }
      errors++;
    }
    if (data.username === undefined) {
      const err2 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'username' },
        message: "must have required property '" + 'username' + "'",
      };
      if (vErrors === null) {
        vErrors = [err2];
      } else {
        vErrors.push(err2);
      }
      errors++;
    }
    for (const key0 in data) {
      if (!(key0 === 'type' || key0 === 'text' || key0 === 'username')) {
        const err3 = {
          instancePath,
          schemaPath: '#/additionalProperties',
          keyword: 'additionalProperties',
          params: { additionalProperty: key0 },
          message: 'must NOT have additional properties',
        };
        if (vErrors === null) {
          vErrors = [err3];
        } else {
          vErrors.push(err3);
        }
        errors++;
      }
    }
    if (data.type !== undefined) {
      if ('mention' !== data.type) {
        const err4 = {
          instancePath: instancePath + '/type',
          schemaPath: '#/properties/type/const',
          keyword: 'const',
          params: { allowedValue: 'mention' },
          message: 'must be equal to constant',
        };
        if (vErrors === null) {
          vErrors = [err4];
        } else {
          vErrors.push(err4);
        }
        errors++;
      }
    }
    if (data.text !== undefined) {
      if (typeof data.text !== 'string') {
        const err5 = {
          instancePath: instancePath + '/text',
          schemaPath: '#/properties/text/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
        };
        if (vErrors === null) {
          vErrors = [err5];
        } else {
          vErrors.push(err5);
        }
        errors++;
      }
    }
    if (data.username !== undefined) {
      let data2 = data.username;
      if (typeof data2 === 'string') {
        if (!pattern4.test(data2)) {
          const err6 = {
            instancePath: instancePath + '/username',
            schemaPath: '#/definitions/username/pattern',
            keyword: 'pattern',
            params: { pattern: '^\\w{1,15}$' },
            message: 'must match pattern "' + '^\\w{1,15}$' + '"',
          };
          if (vErrors === null) {
            vErrors = [err6];
          } else {
            vErrors.push(err6);
          }
          errors++;
        }
      } else {
        const err7 = {
          instancePath: instancePath + '/username',
          schemaPath: '#/definitions/username/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
        };
        if (vErrors === null) {
          vErrors = [err7];
        } else {
          vErrors.push(err7);
        }
        errors++;
      }
    }
  } else {
    const err8 = {
      instancePath,
      schemaPath: '#/type',
      keyword: 'type',
      params: { type: 'object' },
      message: 'must be object',
    };
    if (vErrors === null) {
      vErrors = [err8];
    } else {
      vErrors.push(err8);
    }
    errors++;
  }
  validate17.errors = vErrors;
  return errors === 0;
}
function validate14(
  data,
  { instancePath = '', parentData, parentDataProperty, rootData = data } = {},
) {
  let vErrors = null;
  let errors = 0;
  if (data && typeof data == 'object' && !Array.isArray(data)) {
    if (data.type === undefined) {
      const err0 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'type' },
        message: "must have required property '" + 'type' + "'",
      };
      if (vErrors === null) {
        vErrors = [err0];
      } else {
        vErrors.push(err0);
      }
      errors++;
    }
    const tag0 = data.type;
    if (typeof tag0 == 'string') {
      if (tag0 === 'text') {
        if (data && typeof data == 'object' && !Array.isArray(data)) {
          if (data.type === undefined) {
            const err1 = {
              instancePath,
              schemaPath: '#/definitions/entity:text/required',
              keyword: 'required',
              params: { missingProperty: 'type' },
              message: "must have required property '" + 'type' + "'",
            };
            if (vErrors === null) {
              vErrors = [err1];
            } else {
              vErrors.push(err1);
            }
            errors++;
          }
          if (data.text === undefined) {
            const err2 = {
              instancePath,
              schemaPath: '#/definitions/entity:text/required',
              keyword: 'required',
              params: { missingProperty: 'text' },
              message: "must have required property '" + 'text' + "'",
            };
            if (vErrors === null) {
              vErrors = [err2];
            } else {
              vErrors.push(err2);
            }
            errors++;
          }
          for (const key0 in data) {
            if (!(key0 === 'type' || key0 === 'text')) {
              const err3 = {
                instancePath,
                schemaPath: '#/definitions/entity:text/additionalProperties',
                keyword: 'additionalProperties',
                params: { additionalProperty: key0 },
                message: 'must NOT have additional properties',
              };
              if (vErrors === null) {
                vErrors = [err3];
              } else {
                vErrors.push(err3);
              }
              errors++;
            }
          }
          if (data.type !== undefined) {
            if ('text' !== data.type) {
              const err4 = {
                instancePath: instancePath + '/type',
                schemaPath: '#/definitions/entity:text/properties/type/const',
                keyword: 'const',
                params: { allowedValue: 'text' },
                message: 'must be equal to constant',
              };
              if (vErrors === null) {
                vErrors = [err4];
              } else {
                vErrors.push(err4);
              }
              errors++;
            }
          }
          if (data.text !== undefined) {
            if (typeof data.text !== 'string') {
              const err5 = {
                instancePath: instancePath + '/text',
                schemaPath: '#/definitions/entity:text/properties/text/type',
                keyword: 'type',
                params: { type: 'string' },
                message: 'must be string',
              };
              if (vErrors === null) {
                vErrors = [err5];
              } else {
                vErrors.push(err5);
              }
              errors++;
            }
          }
        } else {
          const err6 = {
            instancePath,
            schemaPath: '#/definitions/entity:text/type',
            keyword: 'type',
            params: { type: 'object' },
            message: 'must be object',
          };
          if (vErrors === null) {
            vErrors = [err6];
          } else {
            vErrors.push(err6);
          }
          errors++;
        }
      } else if (tag0 === 'url') {
        if (
          !validate15(data, {
            instancePath,
            parentData,
            parentDataProperty,
            rootData,
          })
        ) {
          vErrors =
            vErrors === null ?
              validate15.errors
            : vErrors.concat(validate15.errors);
          errors = vErrors.length;
        }
      } else if (tag0 === 'hashtag') {
        if (
          !validate16(data, {
            instancePath,
            parentData,
            parentDataProperty,
            rootData,
          })
        ) {
          vErrors =
            vErrors === null ?
              validate16.errors
            : vErrors.concat(validate16.errors);
          errors = vErrors.length;
        }
      } else if (tag0 === 'cashtag') {
        if (data && typeof data == 'object' && !Array.isArray(data)) {
          if (data.type === undefined) {
            const err7 = {
              instancePath,
              schemaPath: '#/definitions/entity:cashtag/required',
              keyword: 'required',
              params: { missingProperty: 'type' },
              message: "must have required property '" + 'type' + "'",
            };
            if (vErrors === null) {
              vErrors = [err7];
            } else {
              vErrors.push(err7);
            }
            errors++;
          }
          if (data.text === undefined) {
            const err8 = {
              instancePath,
              schemaPath: '#/definitions/entity:cashtag/required',
              keyword: 'required',
              params: { missingProperty: 'text' },
              message: "must have required property '" + 'text' + "'",
            };
            if (vErrors === null) {
              vErrors = [err8];
            } else {
              vErrors.push(err8);
            }
            errors++;
          }
          if (data.tag === undefined) {
            const err9 = {
              instancePath,
              schemaPath: '#/definitions/entity:cashtag/required',
              keyword: 'required',
              params: { missingProperty: 'tag' },
              message: "must have required property '" + 'tag' + "'",
            };
            if (vErrors === null) {
              vErrors = [err9];
            } else {
              vErrors.push(err9);
            }
            errors++;
          }
          for (const key1 in data) {
            if (!(key1 === 'type' || key1 === 'text' || key1 === 'tag')) {
              const err10 = {
                instancePath,
                schemaPath: '#/definitions/entity:cashtag/additionalProperties',
                keyword: 'additionalProperties',
                params: { additionalProperty: key1 },
                message: 'must NOT have additional properties',
              };
              if (vErrors === null) {
                vErrors = [err10];
              } else {
                vErrors.push(err10);
              }
              errors++;
            }
          }
          if (data.type !== undefined) {
            if ('cashtag' !== data.type) {
              const err11 = {
                instancePath: instancePath + '/type',
                schemaPath:
                  '#/definitions/entity:cashtag/properties/type/const',
                keyword: 'const',
                params: { allowedValue: 'cashtag' },
                message: 'must be equal to constant',
              };
              if (vErrors === null) {
                vErrors = [err11];
              } else {
                vErrors.push(err11);
              }
              errors++;
            }
          }
          if (data.text !== undefined) {
            if (typeof data.text !== 'string') {
              const err12 = {
                instancePath: instancePath + '/text',
                schemaPath: '#/definitions/entity:cashtag/properties/text/type',
                keyword: 'type',
                params: { type: 'string' },
                message: 'must be string',
              };
              if (vErrors === null) {
                vErrors = [err12];
              } else {
                vErrors.push(err12);
              }
              errors++;
            }
          }
          if (data.tag !== undefined) {
            if (typeof data.tag !== 'string') {
              const err13 = {
                instancePath: instancePath + '/tag',
                schemaPath: '#/definitions/entity:cashtag/properties/tag/type',
                keyword: 'type',
                params: { type: 'string' },
                message: 'must be string',
              };
              if (vErrors === null) {
                vErrors = [err13];
              } else {
                vErrors.push(err13);
              }
              errors++;
            }
          }
        } else {
          const err14 = {
            instancePath,
            schemaPath: '#/definitions/entity:cashtag/type',
            keyword: 'type',
            params: { type: 'object' },
            message: 'must be object',
          };
          if (vErrors === null) {
            vErrors = [err14];
          } else {
            vErrors.push(err14);
          }
          errors++;
        }
      } else if (tag0 === 'mention') {
        if (
          !validate17(data, {
            instancePath,
            parentData,
            parentDataProperty,
            rootData,
          })
        ) {
          vErrors =
            vErrors === null ?
              validate17.errors
            : vErrors.concat(validate17.errors);
          errors = vErrors.length;
        }
      } else {
        const err15 = {
          instancePath,
          schemaPath: '#/discriminator',
          keyword: 'discriminator',
          params: { error: 'mapping', tag: 'type', tagValue: tag0 },
          message: 'value of tag "type" must be in oneOf',
        };
        if (vErrors === null) {
          vErrors = [err15];
        } else {
          vErrors.push(err15);
        }
        errors++;
      }
    } else {
      const err16 = {
        instancePath,
        schemaPath: '#/discriminator',
        keyword: 'discriminator',
        params: { error: 'tag', tag: 'type', tagValue: tag0 },
        message: 'tag "type" must be string',
      };
      if (vErrors === null) {
        vErrors = [err16];
      } else {
        vErrors.push(err16);
      }
      errors++;
    }
  } else {
    const err17 = {
      instancePath,
      schemaPath: '#/type',
      keyword: 'type',
      params: { type: 'object' },
      message: 'must be object',
    };
    if (vErrors === null) {
      vErrors = [err17];
    } else {
      vErrors.push(err17);
    }
    errors++;
  }
  validate14.errors = vErrors;
  return errors === 0;
}
const schema27 = {
  type: 'object',
  oneOf: [
    { $ref: '#/definitions/media:photo' },
    { $ref: '#/definitions/media:video' },
  ],
  required: ['type'],
  discriminator: { propertyName: 'type' },
};
const schema28 = {
  type: 'object',
  properties: { type: { const: 'photo' }, url: { $ref: '#/definitions/uri' } },
  required: ['type', 'url'],
  additionalProperties: false,
};
function validate23(
  data,
  { instancePath = '', parentData, parentDataProperty, rootData = data } = {},
) {
  let vErrors = null;
  let errors = 0;
  if (data && typeof data == 'object' && !Array.isArray(data)) {
    if (data.type === undefined) {
      const err0 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'type' },
        message: "must have required property '" + 'type' + "'",
      };
      if (vErrors === null) {
        vErrors = [err0];
      } else {
        vErrors.push(err0);
      }
      errors++;
    }
    if (data.url === undefined) {
      const err1 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'url' },
        message: "must have required property '" + 'url' + "'",
      };
      if (vErrors === null) {
        vErrors = [err1];
      } else {
        vErrors.push(err1);
      }
      errors++;
    }
    for (const key0 in data) {
      if (!(key0 === 'type' || key0 === 'url')) {
        const err2 = {
          instancePath,
          schemaPath: '#/additionalProperties',
          keyword: 'additionalProperties',
          params: { additionalProperty: key0 },
          message: 'must NOT have additional properties',
        };
        if (vErrors === null) {
          vErrors = [err2];
        } else {
          vErrors.push(err2);
        }
        errors++;
      }
    }
    if (data.type !== undefined) {
      if ('photo' !== data.type) {
        const err3 = {
          instancePath: instancePath + '/type',
          schemaPath: '#/properties/type/const',
          keyword: 'const',
          params: { allowedValue: 'photo' },
          message: 'must be equal to constant',
        };
        if (vErrors === null) {
          vErrors = [err3];
        } else {
          vErrors.push(err3);
        }
        errors++;
      }
    }
    if (data.url !== undefined) {
      let data1 = data.url;
      if (typeof data1 === 'string') {
        if (!formats0(data1)) {
          const err4 = {
            instancePath: instancePath + '/url',
            schemaPath: '#/definitions/uri/format',
            keyword: 'format',
            params: { format: 'uri' },
            message: 'must match format "' + 'uri' + '"',
          };
          if (vErrors === null) {
            vErrors = [err4];
          } else {
            vErrors.push(err4);
          }
          errors++;
        }
      } else {
        const err5 = {
          instancePath: instancePath + '/url',
          schemaPath: '#/definitions/uri/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
        };
        if (vErrors === null) {
          vErrors = [err5];
        } else {
          vErrors.push(err5);
        }
        errors++;
      }
    }
  } else {
    const err6 = {
      instancePath,
      schemaPath: '#/type',
      keyword: 'type',
      params: { type: 'object' },
      message: 'must be object',
    };
    if (vErrors === null) {
      vErrors = [err6];
    } else {
      vErrors.push(err6);
    }
    errors++;
  }
  validate23.errors = vErrors;
  return errors === 0;
}
const schema30 = {
  type: 'object',
  properties: {
    type: { const: 'video' },
    thumbnail: { $ref: '#/definitions/uri' },
  },
  required: ['type', 'thumbnail'],
  additionalProperties: false,
};
function validate24(
  data,
  { instancePath = '', parentData, parentDataProperty, rootData = data } = {},
) {
  let vErrors = null;
  let errors = 0;
  if (data && typeof data == 'object' && !Array.isArray(data)) {
    if (data.type === undefined) {
      const err0 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'type' },
        message: "must have required property '" + 'type' + "'",
      };
      if (vErrors === null) {
        vErrors = [err0];
      } else {
        vErrors.push(err0);
      }
      errors++;
    }
    if (data.thumbnail === undefined) {
      const err1 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'thumbnail' },
        message: "must have required property '" + 'thumbnail' + "'",
      };
      if (vErrors === null) {
        vErrors = [err1];
      } else {
        vErrors.push(err1);
      }
      errors++;
    }
    for (const key0 in data) {
      if (!(key0 === 'type' || key0 === 'thumbnail')) {
        const err2 = {
          instancePath,
          schemaPath: '#/additionalProperties',
          keyword: 'additionalProperties',
          params: { additionalProperty: key0 },
          message: 'must NOT have additional properties',
        };
        if (vErrors === null) {
          vErrors = [err2];
        } else {
          vErrors.push(err2);
        }
        errors++;
      }
    }
    if (data.type !== undefined) {
      if ('video' !== data.type) {
        const err3 = {
          instancePath: instancePath + '/type',
          schemaPath: '#/properties/type/const',
          keyword: 'const',
          params: { allowedValue: 'video' },
          message: 'must be equal to constant',
        };
        if (vErrors === null) {
          vErrors = [err3];
        } else {
          vErrors.push(err3);
        }
        errors++;
      }
    }
    if (data.thumbnail !== undefined) {
      let data1 = data.thumbnail;
      if (typeof data1 === 'string') {
        if (!formats0(data1)) {
          const err4 = {
            instancePath: instancePath + '/thumbnail',
            schemaPath: '#/definitions/uri/format',
            keyword: 'format',
            params: { format: 'uri' },
            message: 'must match format "' + 'uri' + '"',
          };
          if (vErrors === null) {
            vErrors = [err4];
          } else {
            vErrors.push(err4);
          }
          errors++;
        }
      } else {
        const err5 = {
          instancePath: instancePath + '/thumbnail',
          schemaPath: '#/definitions/uri/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
        };
        if (vErrors === null) {
          vErrors = [err5];
        } else {
          vErrors.push(err5);
        }
        errors++;
      }
    }
  } else {
    const err6 = {
      instancePath,
      schemaPath: '#/type',
      keyword: 'type',
      params: { type: 'object' },
      message: 'must be object',
    };
    if (vErrors === null) {
      vErrors = [err6];
    } else {
      vErrors.push(err6);
    }
    errors++;
  }
  validate24.errors = vErrors;
  return errors === 0;
}
function validate22(
  data,
  { instancePath = '', parentData, parentDataProperty, rootData = data } = {},
) {
  let vErrors = null;
  let errors = 0;
  if (data && typeof data == 'object' && !Array.isArray(data)) {
    if (data.type === undefined) {
      const err0 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'type' },
        message: "must have required property '" + 'type' + "'",
      };
      if (vErrors === null) {
        vErrors = [err0];
      } else {
        vErrors.push(err0);
      }
      errors++;
    }
    const tag0 = data.type;
    if (typeof tag0 == 'string') {
      if (tag0 === 'photo') {
        if (
          !validate23(data, {
            instancePath,
            parentData,
            parentDataProperty,
            rootData,
          })
        ) {
          vErrors =
            vErrors === null ?
              validate23.errors
            : vErrors.concat(validate23.errors);
          errors = vErrors.length;
        }
      } else if (tag0 === 'video') {
        if (
          !validate24(data, {
            instancePath,
            parentData,
            parentDataProperty,
            rootData,
          })
        ) {
          vErrors =
            vErrors === null ?
              validate24.errors
            : vErrors.concat(validate24.errors);
          errors = vErrors.length;
        }
      } else {
        const err1 = {
          instancePath,
          schemaPath: '#/discriminator',
          keyword: 'discriminator',
          params: { error: 'mapping', tag: 'type', tagValue: tag0 },
          message: 'value of tag "type" must be in oneOf',
        };
        if (vErrors === null) {
          vErrors = [err1];
        } else {
          vErrors.push(err1);
        }
        errors++;
      }
    } else {
      const err2 = {
        instancePath,
        schemaPath: '#/discriminator',
        keyword: 'discriminator',
        params: { error: 'tag', tag: 'type', tagValue: tag0 },
        message: 'tag "type" must be string',
      };
      if (vErrors === null) {
        vErrors = [err2];
      } else {
        vErrors.push(err2);
      }
      errors++;
    }
  } else {
    const err3 = {
      instancePath,
      schemaPath: '#/type',
      keyword: 'type',
      params: { type: 'object' },
      message: 'must be object',
    };
    if (vErrors === null) {
      vErrors = [err3];
    } else {
      vErrors.push(err3);
    }
    errors++;
  }
  validate22.errors = vErrors;
  return errors === 0;
}
function validate11(
  data,
  { instancePath = '', parentData, parentDataProperty, rootData = data } = {},
) {
  let vErrors = null;
  let errors = 0;
  if (data && typeof data == 'object' && !Array.isArray(data)) {
    if (data.id === undefined) {
      const err0 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'id' },
        message: "must have required property '" + 'id' + "'",
      };
      if (vErrors === null) {
        vErrors = [err0];
      } else {
        vErrors.push(err0);
      }
      errors++;
    }
    if (data.created_at === undefined) {
      const err1 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'created_at' },
        message: "must have required property '" + 'created_at' + "'",
      };
      if (vErrors === null) {
        vErrors = [err1];
      } else {
        vErrors.push(err1);
      }
      errors++;
    }
    if (data.saved_at === undefined) {
      const err2 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'saved_at' },
        message: "must have required property '" + 'saved_at' + "'",
      };
      if (vErrors === null) {
        vErrors = [err2];
      } else {
        vErrors.push(err2);
      }
      errors++;
    }
    if (data.author === undefined) {
      const err3 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'author' },
        message: "must have required property '" + 'author' + "'",
      };
      if (vErrors === null) {
        vErrors = [err3];
      } else {
        vErrors.push(err3);
      }
      errors++;
    }
    if (data.text === undefined) {
      const err4 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'text' },
        message: "must have required property '" + 'text' + "'",
      };
      if (vErrors === null) {
        vErrors = [err4];
      } else {
        vErrors.push(err4);
      }
      errors++;
    }
    for (const key0 in data) {
      if (
        !(
          key0 === 'id' ||
          key0 === 'created_at' ||
          key0 === 'saved_at' ||
          key0 === 'author' ||
          key0 === 'text' ||
          key0 === 'media'
        )
      ) {
        const err5 = {
          instancePath,
          schemaPath: '#/additionalProperties',
          keyword: 'additionalProperties',
          params: { additionalProperty: key0 },
          message: 'must NOT have additional properties',
        };
        if (vErrors === null) {
          vErrors = [err5];
        } else {
          vErrors.push(err5);
        }
        errors++;
      }
    }
    if (data.id !== undefined) {
      let data0 = data.id;
      if (typeof data0 === 'string') {
        if (!pattern1.test(data0)) {
          const err6 = {
            instancePath: instancePath + '/id',
            schemaPath: '#/definitions/tweet:id/pattern',
            keyword: 'pattern',
            params: { pattern: '^[0-9]+$' },
            message: 'must match pattern "' + '^[0-9]+$' + '"',
          };
          if (vErrors === null) {
            vErrors = [err6];
          } else {
            vErrors.push(err6);
          }
          errors++;
        }
      } else {
        const err7 = {
          instancePath: instancePath + '/id',
          schemaPath: '#/definitions/tweet:id/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
        };
        if (vErrors === null) {
          vErrors = [err7];
        } else {
          vErrors.push(err7);
        }
        errors++;
      }
    }
    if (data.created_at !== undefined) {
      let data1 = data.created_at;
      if (
        !(
          typeof data1 == 'number' &&
          !(data1 % 1) &&
          !isNaN(data1) &&
          isFinite(data1)
        )
      ) {
        const err8 = {
          instancePath: instancePath + '/created_at',
          schemaPath: '#/properties/created_at/type',
          keyword: 'type',
          params: { type: 'integer' },
          message: 'must be integer',
        };
        if (vErrors === null) {
          vErrors = [err8];
        } else {
          vErrors.push(err8);
        }
        errors++;
      }
    }
    if (data.saved_at !== undefined) {
      let data2 = data.saved_at;
      if (
        !(
          typeof data2 == 'number' &&
          !(data2 % 1) &&
          !isNaN(data2) &&
          isFinite(data2)
        )
      ) {
        const err9 = {
          instancePath: instancePath + '/saved_at',
          schemaPath: '#/properties/saved_at/type',
          keyword: 'type',
          params: { type: 'integer' },
          message: 'must be integer',
        };
        if (vErrors === null) {
          vErrors = [err9];
        } else {
          vErrors.push(err9);
        }
        errors++;
      }
    }
    if (data.author !== undefined) {
      if (
        !validate12(data.author, {
          instancePath: instancePath + '/author',
          parentData: data,
          parentDataProperty: 'author',
          rootData,
        })
      ) {
        vErrors =
          vErrors === null ?
            validate12.errors
          : vErrors.concat(validate12.errors);
        errors = vErrors.length;
      }
    }
    if (data.text !== undefined) {
      let data4 = data.text;
      if (Array.isArray(data4)) {
        const len0 = data4.length;
        for (let i0 = 0; i0 < len0; i0++) {
          if (
            !validate14(data4[i0], {
              instancePath: instancePath + '/text/' + i0,
              parentData: data4,
              parentDataProperty: i0,
              rootData,
            })
          ) {
            vErrors =
              vErrors === null ?
                validate14.errors
              : vErrors.concat(validate14.errors);
            errors = vErrors.length;
          }
        }
      } else {
        const err10 = {
          instancePath: instancePath + '/text',
          schemaPath: '#/properties/text/type',
          keyword: 'type',
          params: { type: 'array' },
          message: 'must be array',
        };
        if (vErrors === null) {
          vErrors = [err10];
        } else {
          vErrors.push(err10);
        }
        errors++;
      }
    }
    if (data.media !== undefined) {
      let data6 = data.media;
      if (Array.isArray(data6)) {
        const len1 = data6.length;
        for (let i1 = 0; i1 < len1; i1++) {
          if (
            !validate22(data6[i1], {
              instancePath: instancePath + '/media/' + i1,
              parentData: data6,
              parentDataProperty: i1,
              rootData,
            })
          ) {
            vErrors =
              vErrors === null ?
                validate22.errors
              : vErrors.concat(validate22.errors);
            errors = vErrors.length;
          }
        }
      } else {
        const err11 = {
          instancePath: instancePath + '/media',
          schemaPath: '#/properties/media/type',
          keyword: 'type',
          params: { type: 'array' },
          message: 'must be array',
        };
        if (vErrors === null) {
          vErrors = [err11];
        } else {
          vErrors.push(err11);
        }
        errors++;
      }
    }
  } else {
    const err12 = {
      instancePath,
      schemaPath: '#/type',
      keyword: 'type',
      params: { type: 'object' },
      message: 'must be object',
    };
    if (vErrors === null) {
      vErrors = [err12];
    } else {
      vErrors.push(err12);
    }
    errors++;
  }
  validate11.errors = vErrors;
  return errors === 0;
}
function validate10(
  data,
  { instancePath = '', parentData, parentDataProperty, rootData = data } = {},
) {
  let vErrors = null;
  let errors = 0;
  if (data && typeof data == 'object' && !Array.isArray(data)) {
    for (const key0 in data) {
      if (!(func2.call(schema11.properties, key0) || pattern0.test(key0))) {
        const err0 = {
          instancePath,
          schemaPath: '#/additionalProperties',
          keyword: 'additionalProperties',
          params: { additionalProperty: key0 },
          message: 'must NOT have additional properties',
        };
        if (vErrors === null) {
          vErrors = [err0];
        } else {
          vErrors.push(err0);
        }
        errors++;
      }
    }
    if (data.settings_hostname !== undefined) {
      let data0 = data.settings_hostname;
      if (typeof data0 !== 'string') {
        const err1 = {
          instancePath: instancePath + '/settings_hostname',
          schemaPath: '#/properties/settings_hostname/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
        };
        if (vErrors === null) {
          vErrors = [err1];
        } else {
          vErrors.push(err1);
        }
        errors++;
      }
      if (!(data0 === 'twitter.com' || data0 === 'x.com')) {
        const err2 = {
          instancePath: instancePath + '/settings_hostname',
          schemaPath: '#/properties/settings_hostname/enum',
          keyword: 'enum',
          params: { allowedValues: schema11.properties.settings_hostname.enum },
          message: 'must be equal to one of the allowed values',
        };
        if (vErrors === null) {
          vErrors = [err2];
        } else {
          vErrors.push(err2);
        }
        errors++;
      }
    }
    if (data.settings_timezone !== undefined) {
      if (typeof data.settings_timezone !== 'string') {
        const err3 = {
          instancePath: instancePath + '/settings_timezone',
          schemaPath: '#/properties/settings_timezone/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
        };
        if (vErrors === null) {
          vErrors = [err3];
        } else {
          vErrors.push(err3);
        }
        errors++;
      }
    }
    if (data.settings_datetimeFormat !== undefined) {
      if (typeof data.settings_datetimeFormat !== 'string') {
        const err4 = {
          instancePath: instancePath + '/settings_datetimeFormat',
          schemaPath: '#/properties/settings_datetimeFormat/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
        };
        if (vErrors === null) {
          vErrors = [err4];
        } else {
          vErrors.push(err4);
        }
        errors++;
      }
    }
    if (data.settings_scrapboxIcon !== undefined) {
      let data3 = data.settings_scrapboxIcon;
      if (typeof data3 !== 'string') {
        const err5 = {
          instancePath: instancePath + '/settings_scrapboxIcon',
          schemaPath: '#/properties/settings_scrapboxIcon/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
        };
        if (vErrors === null) {
          vErrors = [err5];
        } else {
          vErrors.push(err5);
        }
        errors++;
      }
      if (!(data3 === 'scrapbox' || data3 === 'cosense')) {
        const err6 = {
          instancePath: instancePath + '/settings_scrapboxIcon',
          schemaPath: '#/properties/settings_scrapboxIcon/enum',
          keyword: 'enum',
          params: {
            allowedValues: schema11.properties.settings_scrapboxIcon.enum,
          },
          message: 'must be equal to one of the allowed values',
        };
        if (vErrors === null) {
          vErrors = [err6];
        } else {
          vErrors.push(err6);
        }
        errors++;
      }
    }
    if (data.settings_twitterIcon !== undefined) {
      let data4 = data.settings_twitterIcon;
      if (typeof data4 !== 'string') {
        const err7 = {
          instancePath: instancePath + '/settings_twitterIcon',
          schemaPath: '#/properties/settings_twitterIcon/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
        };
        if (vErrors === null) {
          vErrors = [err7];
        } else {
          vErrors.push(err7);
        }
        errors++;
      }
      if (!(data4 === 'twitter' || data4 === 'x')) {
        const err8 = {
          instancePath: instancePath + '/settings_twitterIcon',
          schemaPath: '#/properties/settings_twitterIcon/enum',
          keyword: 'enum',
          params: {
            allowedValues: schema11.properties.settings_twitterIcon.enum,
          },
          message: 'must be equal to one of the allowed values',
        };
        if (vErrors === null) {
          vErrors = [err8];
        } else {
          vErrors.push(err8);
        }
        errors++;
      }
    }
    if (data.tweetTemplate_tweet !== undefined) {
      if (typeof data.tweetTemplate_tweet !== 'string') {
        const err9 = {
          instancePath: instancePath + '/tweetTemplate_tweet',
          schemaPath: '#/properties/tweetTemplate_tweet/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
        };
        if (vErrors === null) {
          vErrors = [err9];
        } else {
          vErrors.push(err9);
        }
        errors++;
      }
    }
    if (data.tweetTemplate_footer !== undefined) {
      if (typeof data.tweetTemplate_footer !== 'string') {
        const err10 = {
          instancePath: instancePath + '/tweetTemplate_footer',
          schemaPath: '#/properties/tweetTemplate_footer/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
        };
        if (vErrors === null) {
          vErrors = [err10];
        } else {
          vErrors.push(err10);
        }
        errors++;
      }
    }
    if (data.tweetTemplate_entityText !== undefined) {
      if (typeof data.tweetTemplate_entityText !== 'string') {
        const err11 = {
          instancePath: instancePath + '/tweetTemplate_entityText',
          schemaPath: '#/properties/tweetTemplate_entityText/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
        };
        if (vErrors === null) {
          vErrors = [err11];
        } else {
          vErrors.push(err11);
        }
        errors++;
      }
    }
    if (data.tweetTemplate_entityUrl !== undefined) {
      if (typeof data.tweetTemplate_entityUrl !== 'string') {
        const err12 = {
          instancePath: instancePath + '/tweetTemplate_entityUrl',
          schemaPath: '#/properties/tweetTemplate_entityUrl/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
        };
        if (vErrors === null) {
          vErrors = [err12];
        } else {
          vErrors.push(err12);
        }
        errors++;
      }
    }
    if (data.tweetTemplate_entityHashtag !== undefined) {
      if (typeof data.tweetTemplate_entityHashtag !== 'string') {
        const err13 = {
          instancePath: instancePath + '/tweetTemplate_entityHashtag',
          schemaPath: '#/properties/tweetTemplate_entityHashtag/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
        };
        if (vErrors === null) {
          vErrors = [err13];
        } else {
          vErrors.push(err13);
        }
        errors++;
      }
    }
    if (data.tweetTemplate_entityCashtag !== undefined) {
      if (typeof data.tweetTemplate_entityCashtag !== 'string') {
        const err14 = {
          instancePath: instancePath + '/tweetTemplate_entityCashtag',
          schemaPath: '#/properties/tweetTemplate_entityCashtag/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
        };
        if (vErrors === null) {
          vErrors = [err14];
        } else {
          vErrors.push(err14);
        }
        errors++;
      }
    }
    if (data.tweetTemplate_entityMention !== undefined) {
      if (typeof data.tweetTemplate_entityMention !== 'string') {
        const err15 = {
          instancePath: instancePath + '/tweetTemplate_entityMention',
          schemaPath: '#/properties/tweetTemplate_entityMention/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
        };
        if (vErrors === null) {
          vErrors = [err15];
        } else {
          vErrors.push(err15);
        }
        errors++;
      }
    }
    if (data.tweetTemplate_mediaPhoto !== undefined) {
      if (typeof data.tweetTemplate_mediaPhoto !== 'string') {
        const err16 = {
          instancePath: instancePath + '/tweetTemplate_mediaPhoto',
          schemaPath: '#/properties/tweetTemplate_mediaPhoto/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
        };
        if (vErrors === null) {
          vErrors = [err16];
        } else {
          vErrors.push(err16);
        }
        errors++;
      }
    }
    if (data.tweetTemplate_mediaVideo !== undefined) {
      if (typeof data.tweetTemplate_mediaVideo !== 'string') {
        const err17 = {
          instancePath: instancePath + '/tweetTemplate_mediaVideo',
          schemaPath: '#/properties/tweetTemplate_mediaVideo/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
        };
        if (vErrors === null) {
          vErrors = [err17];
        } else {
          vErrors.push(err17);
        }
        errors++;
      }
    }
    if (data.tweetTemplate_quote !== undefined) {
      if (typeof data.tweetTemplate_quote !== 'boolean') {
        const err18 = {
          instancePath: instancePath + '/tweetTemplate_quote',
          schemaPath: '#/properties/tweetTemplate_quote/type',
          keyword: 'type',
          params: { type: 'boolean' },
          message: 'must be boolean',
        };
        if (vErrors === null) {
          vErrors = [err18];
        } else {
          vErrors.push(err18);
        }
        errors++;
      }
    }
    if (data.trashbox !== undefined) {
      let data15 = data.trashbox;
      if (Array.isArray(data15)) {
        const len0 = data15.length;
        for (let i0 = 0; i0 < len0; i0++) {
          let data16 = data15[i0];
          if (data16 && typeof data16 == 'object' && !Array.isArray(data16)) {
            if (data16.deleted_at === undefined) {
              const err19 = {
                instancePath: instancePath + '/trashbox/' + i0,
                schemaPath: '#/properties/trashbox/items/required',
                keyword: 'required',
                params: { missingProperty: 'deleted_at' },
                message: "must have required property '" + 'deleted_at' + "'",
              };
              if (vErrors === null) {
                vErrors = [err19];
              } else {
                vErrors.push(err19);
              }
              errors++;
            }
            if (data16.tweet_id === undefined) {
              const err20 = {
                instancePath: instancePath + '/trashbox/' + i0,
                schemaPath: '#/properties/trashbox/items/required',
                keyword: 'required',
                params: { missingProperty: 'tweet_id' },
                message: "must have required property '" + 'tweet_id' + "'",
              };
              if (vErrors === null) {
                vErrors = [err20];
              } else {
                vErrors.push(err20);
              }
              errors++;
            }
            for (const key1 in data16) {
              if (!(key1 === 'deleted_at' || key1 === 'tweet_id')) {
                const err21 = {
                  instancePath: instancePath + '/trashbox/' + i0,
                  schemaPath:
                    '#/properties/trashbox/items/additionalProperties',
                  keyword: 'additionalProperties',
                  params: { additionalProperty: key1 },
                  message: 'must NOT have additional properties',
                };
                if (vErrors === null) {
                  vErrors = [err21];
                } else {
                  vErrors.push(err21);
                }
                errors++;
              }
            }
            if (data16.deleted_at !== undefined) {
              let data17 = data16.deleted_at;
              if (
                !(
                  typeof data17 == 'number' &&
                  !(data17 % 1) &&
                  !isNaN(data17) &&
                  isFinite(data17)
                )
              ) {
                const err22 = {
                  instancePath:
                    instancePath + '/trashbox/' + i0 + '/deleted_at',
                  schemaPath:
                    '#/properties/trashbox/items/properties/deleted_at/type',
                  keyword: 'type',
                  params: { type: 'integer' },
                  message: 'must be integer',
                };
                if (vErrors === null) {
                  vErrors = [err22];
                } else {
                  vErrors.push(err22);
                }
                errors++;
              }
            }
            if (data16.tweet_id !== undefined) {
              let data18 = data16.tweet_id;
              if (typeof data18 === 'string') {
                if (!pattern1.test(data18)) {
                  const err23 = {
                    instancePath:
                      instancePath + '/trashbox/' + i0 + '/tweet_id',
                    schemaPath:
                      '#/properties/trashbox/items/properties/tweet_id/pattern',
                    keyword: 'pattern',
                    params: { pattern: '^[0-9]+$' },
                    message: 'must match pattern "' + '^[0-9]+$' + '"',
                  };
                  if (vErrors === null) {
                    vErrors = [err23];
                  } else {
                    vErrors.push(err23);
                  }
                  errors++;
                }
              } else {
                const err24 = {
                  instancePath: instancePath + '/trashbox/' + i0 + '/tweet_id',
                  schemaPath:
                    '#/properties/trashbox/items/properties/tweet_id/type',
                  keyword: 'type',
                  params: { type: 'string' },
                  message: 'must be string',
                };
                if (vErrors === null) {
                  vErrors = [err24];
                } else {
                  vErrors.push(err24);
                }
                errors++;
              }
            }
          } else {
            const err25 = {
              instancePath: instancePath + '/trashbox/' + i0,
              schemaPath: '#/properties/trashbox/items/type',
              keyword: 'type',
              params: { type: 'object' },
              message: 'must be object',
            };
            if (vErrors === null) {
              vErrors = [err25];
            } else {
              vErrors.push(err25);
            }
            errors++;
          }
        }
      } else {
        const err26 = {
          instancePath: instancePath + '/trashbox',
          schemaPath: '#/properties/trashbox/type',
          keyword: 'type',
          params: { type: 'array' },
          message: 'must be array',
        };
        if (vErrors === null) {
          vErrors = [err26];
        } else {
          vErrors.push(err26);
        }
        errors++;
      }
    }
    if (data.tweetSort !== undefined) {
      let data19 = data.tweetSort;
      if (data19 && typeof data19 == 'object' && !Array.isArray(data19)) {
        if (data19.key === undefined) {
          const err27 = {
            instancePath: instancePath + '/tweetSort',
            schemaPath: '#/properties/tweetSort/required',
            keyword: 'required',
            params: { missingProperty: 'key' },
            message: "must have required property '" + 'key' + "'",
          };
          if (vErrors === null) {
            vErrors = [err27];
          } else {
            vErrors.push(err27);
          }
          errors++;
        }
        if (data19.order === undefined) {
          const err28 = {
            instancePath: instancePath + '/tweetSort',
            schemaPath: '#/properties/tweetSort/required',
            keyword: 'required',
            params: { missingProperty: 'order' },
            message: "must have required property '" + 'order' + "'",
          };
          if (vErrors === null) {
            vErrors = [err28];
          } else {
            vErrors.push(err28);
          }
          errors++;
        }
        for (const key2 in data19) {
          if (!(key2 === 'key' || key2 === 'order')) {
            const err29 = {
              instancePath: instancePath + '/tweetSort',
              schemaPath: '#/properties/tweetSort/additionalProperties',
              keyword: 'additionalProperties',
              params: { additionalProperty: key2 },
              message: 'must NOT have additional properties',
            };
            if (vErrors === null) {
              vErrors = [err29];
            } else {
              vErrors.push(err29);
            }
            errors++;
          }
        }
        if (data19.key !== undefined) {
          let data20 = data19.key;
          if (typeof data20 !== 'string') {
            const err30 = {
              instancePath: instancePath + '/tweetSort/key',
              schemaPath: '#/properties/tweetSort/properties/key/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err30];
            } else {
              vErrors.push(err30);
            }
            errors++;
          }
          if (
            !(
              data20 === 'created_time' ||
              data20 === 'saved_time' ||
              data20 === 'username'
            )
          ) {
            const err31 = {
              instancePath: instancePath + '/tweetSort/key',
              schemaPath: '#/properties/tweetSort/properties/key/enum',
              keyword: 'enum',
              params: {
                allowedValues:
                  schema11.properties.tweetSort.properties.key.enum,
              },
              message: 'must be equal to one of the allowed values',
            };
            if (vErrors === null) {
              vErrors = [err31];
            } else {
              vErrors.push(err31);
            }
            errors++;
          }
        }
        if (data19.order !== undefined) {
          let data21 = data19.order;
          if (typeof data21 !== 'string') {
            const err32 = {
              instancePath: instancePath + '/tweetSort/order',
              schemaPath: '#/properties/tweetSort/properties/order/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err32];
            } else {
              vErrors.push(err32);
            }
            errors++;
          }
          if (!(data21 === 'asc' || data21 === 'desc')) {
            const err33 = {
              instancePath: instancePath + '/tweetSort/order',
              schemaPath: '#/properties/tweetSort/properties/order/enum',
              keyword: 'enum',
              params: {
                allowedValues:
                  schema11.properties.tweetSort.properties.order.enum,
              },
              message: 'must be equal to one of the allowed values',
            };
            if (vErrors === null) {
              vErrors = [err33];
            } else {
              vErrors.push(err33);
            }
            errors++;
          }
        }
      } else {
        const err34 = {
          instancePath: instancePath + '/tweetSort',
          schemaPath: '#/properties/tweetSort/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        };
        if (vErrors === null) {
          vErrors = [err34];
        } else {
          vErrors.push(err34);
        }
        errors++;
      }
    }
    if (data.trashboxSort !== undefined) {
      let data22 = data.trashboxSort;
      if (data22 && typeof data22 == 'object' && !Array.isArray(data22)) {
        if (data22.key === undefined) {
          const err35 = {
            instancePath: instancePath + '/trashboxSort',
            schemaPath: '#/properties/trashboxSort/required',
            keyword: 'required',
            params: { missingProperty: 'key' },
            message: "must have required property '" + 'key' + "'",
          };
          if (vErrors === null) {
            vErrors = [err35];
          } else {
            vErrors.push(err35);
          }
          errors++;
        }
        if (data22.order === undefined) {
          const err36 = {
            instancePath: instancePath + '/trashboxSort',
            schemaPath: '#/properties/trashboxSort/required',
            keyword: 'required',
            params: { missingProperty: 'order' },
            message: "must have required property '" + 'order' + "'",
          };
          if (vErrors === null) {
            vErrors = [err36];
          } else {
            vErrors.push(err36);
          }
          errors++;
        }
        for (const key3 in data22) {
          if (!(key3 === 'key' || key3 === 'order')) {
            const err37 = {
              instancePath: instancePath + '/trashboxSort',
              schemaPath: '#/properties/trashboxSort/additionalProperties',
              keyword: 'additionalProperties',
              params: { additionalProperty: key3 },
              message: 'must NOT have additional properties',
            };
            if (vErrors === null) {
              vErrors = [err37];
            } else {
              vErrors.push(err37);
            }
            errors++;
          }
        }
        if (data22.key !== undefined) {
          let data23 = data22.key;
          if (typeof data23 !== 'string') {
            const err38 = {
              instancePath: instancePath + '/trashboxSort/key',
              schemaPath: '#/properties/trashboxSort/properties/key/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err38];
            } else {
              vErrors.push(err38);
            }
            errors++;
          }
          if (!(data23 === 'deleted_time')) {
            const err39 = {
              instancePath: instancePath + '/trashboxSort/key',
              schemaPath: '#/properties/trashboxSort/properties/key/enum',
              keyword: 'enum',
              params: {
                allowedValues:
                  schema11.properties.trashboxSort.properties.key.enum,
              },
              message: 'must be equal to one of the allowed values',
            };
            if (vErrors === null) {
              vErrors = [err39];
            } else {
              vErrors.push(err39);
            }
            errors++;
          }
        }
        if (data22.order !== undefined) {
          let data24 = data22.order;
          if (typeof data24 !== 'string') {
            const err40 = {
              instancePath: instancePath + '/trashboxSort/order',
              schemaPath: '#/properties/trashboxSort/properties/order/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err40];
            } else {
              vErrors.push(err40);
            }
            errors++;
          }
          if (!(data24 === 'asc' || data24 === 'desc')) {
            const err41 = {
              instancePath: instancePath + '/trashboxSort/order',
              schemaPath: '#/properties/trashboxSort/properties/order/enum',
              keyword: 'enum',
              params: {
                allowedValues:
                  schema11.properties.trashboxSort.properties.order.enum,
              },
              message: 'must be equal to one of the allowed values',
            };
            if (vErrors === null) {
              vErrors = [err41];
            } else {
              vErrors.push(err41);
            }
            errors++;
          }
        }
      } else {
        const err42 = {
          instancePath: instancePath + '/trashboxSort',
          schemaPath: '#/properties/trashboxSort/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        };
        if (vErrors === null) {
          vErrors = [err42];
        } else {
          vErrors.push(err42);
        }
        errors++;
      }
    }
    for (const key4 in data) {
      if (pattern0.test(key4)) {
        if (
          !validate11(data[key4], {
            instancePath:
              instancePath +
              '/' +
              key4.replace(/~/g, '~0').replace(/\//g, '~1'),
            parentData: data,
            parentDataProperty: key4,
            rootData,
          })
        ) {
          vErrors =
            vErrors === null ?
              validate11.errors
            : vErrors.concat(validate11.errors);
          errors = vErrors.length;
        }
      }
    }
  } else {
    const err43 = {
      instancePath,
      schemaPath: '#/type',
      keyword: 'type',
      params: { type: 'object' },
      message: 'must be object',
    };
    if (vErrors === null) {
      vErrors = [err43];
    } else {
      vErrors.push(err43);
    }
    errors++;
  }
  validate10.errors = vErrors;
  return errors === 0;
}
