'use strict';
module.exports = validate10;
module.exports.default = validate10;
const schema11 = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    timestamp: { type: 'integer' },
    author: { $ref: '#/definitions/user' },
    text: { type: 'array', items: { $ref: '#/definitions/entity' } },
    card: { $ref: '#/definitions/card' },
    media: { type: 'array', items: { $ref: '#/definitions/media' } },
  },
  required: ['id', 'timestamp', 'author', 'text'],
  additionalProperties: false,
  definitions: {
    uri: { type: 'string', format: 'uri' },
    iri: { type: 'string', format: 'iri' },
    user: {
      type: 'object',
      properties: { name: { type: 'string' }, username: { type: 'string' } },
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
        username: { type: 'string' },
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
    card: {
      type: 'object',
      oneOf: [
        { $ref: '#/definitions/card:single' },
        { $ref: '#/definitions/card:carousel' },
      ],
      required: ['type'],
      discriminator: { propertyName: 'type' },
    },
    'card:link': {
      type: 'object',
      properties: {
        url: { $ref: '#/definitions/uri' },
        expanded_url: { $ref: '#/definitions/uri' },
        decoded_url: { $ref: '#/definitions/iri' },
        title: { type: 'string' },
      },
      required: ['url', 'expanded_url', 'decoded_url'],
      additionalProperties: false,
    },
    'card:single': {
      type: 'object',
      properties: {
        type: { const: 'single' },
        link: { $ref: '#/definitions/card:link' },
        media_url: { $ref: '#/definitions/uri' },
      },
      required: ['type', 'media_url'],
      additionalProperties: false,
    },
    'card:carousel': {
      type: 'object',
      properties: {
        type: { const: 'carousel' },
        link: { $ref: '#/definitions/card:link' },
        media_urls: { type: 'array', items: { $ref: '#/definitions/uri' } },
      },
      required: ['type', 'media_urls'],
      additionalProperties: false,
    },
  },
};
const schema12 = {
  type: 'object',
  properties: { name: { type: 'string' }, username: { type: 'string' } },
  required: ['name', 'username'],
  additionalProperties: false,
};
const schema13 = {
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
const schema20 = {
  type: 'object',
  properties: { type: { const: 'text' }, text: { type: 'string' } },
  required: ['type', 'text'],
  additionalProperties: false,
};
const schema21 = {
  type: 'object',
  properties: {
    type: { const: 'cashtag' },
    text: { type: 'string' },
    tag: { type: 'string' },
  },
  required: ['type', 'text', 'tag'],
  additionalProperties: false,
};
const schema22 = {
  type: 'object',
  properties: {
    type: { const: 'mention' },
    text: { type: 'string' },
    username: { type: 'string' },
  },
  required: ['type', 'text', 'username'],
  additionalProperties: false,
};
const schema14 = {
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
const schema15 = { type: 'string', format: 'uri' };
const schema17 = { type: 'string', format: 'iri' };
const formats0 = require('ajv-formats/dist/formats').fullFormats.uri;
const formats4 = require('ajv-formats-draft2019/formats').iri;
function validate12(
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
  validate12.errors = vErrors;
  return errors === 0;
}
const schema18 = {
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
function validate13(
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
  validate13.errors = vErrors;
  return errors === 0;
}
function validate11(
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
          !validate12(data, {
            instancePath,
            parentData,
            parentDataProperty,
            rootData,
          })
        ) {
          vErrors =
            vErrors === null
              ? validate12.errors
              : vErrors.concat(validate12.errors);
          errors = vErrors.length;
        }
      } else if (tag0 === 'hashtag') {
        if (
          !validate13(data, {
            instancePath,
            parentData,
            parentDataProperty,
            rootData,
          })
        ) {
          vErrors =
            vErrors === null
              ? validate13.errors
              : vErrors.concat(validate13.errors);
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
        if (data && typeof data == 'object' && !Array.isArray(data)) {
          if (data.type === undefined) {
            const err15 = {
              instancePath,
              schemaPath: '#/definitions/entity:mention/required',
              keyword: 'required',
              params: { missingProperty: 'type' },
              message: "must have required property '" + 'type' + "'",
            };
            if (vErrors === null) {
              vErrors = [err15];
            } else {
              vErrors.push(err15);
            }
            errors++;
          }
          if (data.text === undefined) {
            const err16 = {
              instancePath,
              schemaPath: '#/definitions/entity:mention/required',
              keyword: 'required',
              params: { missingProperty: 'text' },
              message: "must have required property '" + 'text' + "'",
            };
            if (vErrors === null) {
              vErrors = [err16];
            } else {
              vErrors.push(err16);
            }
            errors++;
          }
          if (data.username === undefined) {
            const err17 = {
              instancePath,
              schemaPath: '#/definitions/entity:mention/required',
              keyword: 'required',
              params: { missingProperty: 'username' },
              message: "must have required property '" + 'username' + "'",
            };
            if (vErrors === null) {
              vErrors = [err17];
            } else {
              vErrors.push(err17);
            }
            errors++;
          }
          for (const key2 in data) {
            if (!(key2 === 'type' || key2 === 'text' || key2 === 'username')) {
              const err18 = {
                instancePath,
                schemaPath: '#/definitions/entity:mention/additionalProperties',
                keyword: 'additionalProperties',
                params: { additionalProperty: key2 },
                message: 'must NOT have additional properties',
              };
              if (vErrors === null) {
                vErrors = [err18];
              } else {
                vErrors.push(err18);
              }
              errors++;
            }
          }
          if (data.type !== undefined) {
            if ('mention' !== data.type) {
              const err19 = {
                instancePath: instancePath + '/type',
                schemaPath:
                  '#/definitions/entity:mention/properties/type/const',
                keyword: 'const',
                params: { allowedValue: 'mention' },
                message: 'must be equal to constant',
              };
              if (vErrors === null) {
                vErrors = [err19];
              } else {
                vErrors.push(err19);
              }
              errors++;
            }
          }
          if (data.text !== undefined) {
            if (typeof data.text !== 'string') {
              const err20 = {
                instancePath: instancePath + '/text',
                schemaPath: '#/definitions/entity:mention/properties/text/type',
                keyword: 'type',
                params: { type: 'string' },
                message: 'must be string',
              };
              if (vErrors === null) {
                vErrors = [err20];
              } else {
                vErrors.push(err20);
              }
              errors++;
            }
          }
          if (data.username !== undefined) {
            if (typeof data.username !== 'string') {
              const err21 = {
                instancePath: instancePath + '/username',
                schemaPath:
                  '#/definitions/entity:mention/properties/username/type',
                keyword: 'type',
                params: { type: 'string' },
                message: 'must be string',
              };
              if (vErrors === null) {
                vErrors = [err21];
              } else {
                vErrors.push(err21);
              }
              errors++;
            }
          }
        } else {
          const err22 = {
            instancePath,
            schemaPath: '#/definitions/entity:mention/type',
            keyword: 'type',
            params: { type: 'object' },
            message: 'must be object',
          };
          if (vErrors === null) {
            vErrors = [err22];
          } else {
            vErrors.push(err22);
          }
          errors++;
        }
      } else {
        const err23 = {
          instancePath,
          schemaPath: '#/discriminator',
          keyword: 'discriminator',
          params: { error: 'mapping', tag: 'type', tagValue: tag0 },
          message: 'value of tag "type" must be in oneOf',
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
        instancePath,
        schemaPath: '#/discriminator',
        keyword: 'discriminator',
        params: { error: 'tag', tag: 'type', tagValue: tag0 },
        message: 'tag "type" must be string',
      };
      if (vErrors === null) {
        vErrors = [err24];
      } else {
        vErrors.push(err24);
      }
      errors++;
    }
  } else {
    const err25 = {
      instancePath,
      schemaPath: '#/type',
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
  validate11.errors = vErrors;
  return errors === 0;
}
const schema23 = {
  type: 'object',
  oneOf: [
    { $ref: '#/definitions/card:single' },
    { $ref: '#/definitions/card:carousel' },
  ],
  required: ['type'],
  discriminator: { propertyName: 'type' },
};
const schema24 = {
  type: 'object',
  properties: {
    type: { const: 'single' },
    link: { $ref: '#/definitions/card:link' },
    media_url: { $ref: '#/definitions/uri' },
  },
  required: ['type', 'media_url'],
  additionalProperties: false,
};
const schema25 = {
  type: 'object',
  properties: {
    url: { $ref: '#/definitions/uri' },
    expanded_url: { $ref: '#/definitions/uri' },
    decoded_url: { $ref: '#/definitions/iri' },
    title: { type: 'string' },
  },
  required: ['url', 'expanded_url', 'decoded_url'],
  additionalProperties: false,
};
function validate19(
  data,
  { instancePath = '', parentData, parentDataProperty, rootData = data } = {},
) {
  let vErrors = null;
  let errors = 0;
  if (data && typeof data == 'object' && !Array.isArray(data)) {
    if (data.url === undefined) {
      const err0 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'url' },
        message: "must have required property '" + 'url' + "'",
      };
      if (vErrors === null) {
        vErrors = [err0];
      } else {
        vErrors.push(err0);
      }
      errors++;
    }
    if (data.expanded_url === undefined) {
      const err1 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'expanded_url' },
        message: "must have required property '" + 'expanded_url' + "'",
      };
      if (vErrors === null) {
        vErrors = [err1];
      } else {
        vErrors.push(err1);
      }
      errors++;
    }
    if (data.decoded_url === undefined) {
      const err2 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'decoded_url' },
        message: "must have required property '" + 'decoded_url' + "'",
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
          key0 === 'url' ||
          key0 === 'expanded_url' ||
          key0 === 'decoded_url' ||
          key0 === 'title'
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
    if (data.url !== undefined) {
      let data0 = data.url;
      if (typeof data0 === 'string') {
        if (!formats0(data0)) {
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
    if (data.expanded_url !== undefined) {
      let data1 = data.expanded_url;
      if (typeof data1 === 'string') {
        if (!formats0(data1)) {
          const err6 = {
            instancePath: instancePath + '/expanded_url',
            schemaPath: '#/definitions/uri/format',
            keyword: 'format',
            params: { format: 'uri' },
            message: 'must match format "' + 'uri' + '"',
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
          instancePath: instancePath + '/expanded_url',
          schemaPath: '#/definitions/uri/type',
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
    if (data.decoded_url !== undefined) {
      let data2 = data.decoded_url;
      if (typeof data2 === 'string') {
        if (!formats4(data2)) {
          const err8 = {
            instancePath: instancePath + '/decoded_url',
            schemaPath: '#/definitions/iri/format',
            keyword: 'format',
            params: { format: 'iri' },
            message: 'must match format "' + 'iri' + '"',
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
          instancePath: instancePath + '/decoded_url',
          schemaPath: '#/definitions/iri/type',
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
    if (data.title !== undefined) {
      if (typeof data.title !== 'string') {
        const err10 = {
          instancePath: instancePath + '/title',
          schemaPath: '#/properties/title/type',
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
  } else {
    const err11 = {
      instancePath,
      schemaPath: '#/type',
      keyword: 'type',
      params: { type: 'object' },
      message: 'must be object',
    };
    if (vErrors === null) {
      vErrors = [err11];
    } else {
      vErrors.push(err11);
    }
    errors++;
  }
  validate19.errors = vErrors;
  return errors === 0;
}
function validate18(
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
    if (data.media_url === undefined) {
      const err1 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'media_url' },
        message: "must have required property '" + 'media_url' + "'",
      };
      if (vErrors === null) {
        vErrors = [err1];
      } else {
        vErrors.push(err1);
      }
      errors++;
    }
    for (const key0 in data) {
      if (!(key0 === 'type' || key0 === 'link' || key0 === 'media_url')) {
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
      if ('single' !== data.type) {
        const err3 = {
          instancePath: instancePath + '/type',
          schemaPath: '#/properties/type/const',
          keyword: 'const',
          params: { allowedValue: 'single' },
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
    if (data.link !== undefined) {
      if (
        !validate19(data.link, {
          instancePath: instancePath + '/link',
          parentData: data,
          parentDataProperty: 'link',
          rootData,
        })
      ) {
        vErrors =
          vErrors === null
            ? validate19.errors
            : vErrors.concat(validate19.errors);
        errors = vErrors.length;
      }
    }
    if (data.media_url !== undefined) {
      let data2 = data.media_url;
      if (typeof data2 === 'string') {
        if (!formats0(data2)) {
          const err4 = {
            instancePath: instancePath + '/media_url',
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
          instancePath: instancePath + '/media_url',
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
  validate18.errors = vErrors;
  return errors === 0;
}
const schema30 = {
  type: 'object',
  properties: {
    type: { const: 'carousel' },
    link: { $ref: '#/definitions/card:link' },
    media_urls: { type: 'array', items: { $ref: '#/definitions/uri' } },
  },
  required: ['type', 'media_urls'],
  additionalProperties: false,
};
function validate21(
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
    if (data.media_urls === undefined) {
      const err1 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'media_urls' },
        message: "must have required property '" + 'media_urls' + "'",
      };
      if (vErrors === null) {
        vErrors = [err1];
      } else {
        vErrors.push(err1);
      }
      errors++;
    }
    for (const key0 in data) {
      if (!(key0 === 'type' || key0 === 'link' || key0 === 'media_urls')) {
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
      if ('carousel' !== data.type) {
        const err3 = {
          instancePath: instancePath + '/type',
          schemaPath: '#/properties/type/const',
          keyword: 'const',
          params: { allowedValue: 'carousel' },
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
    if (data.link !== undefined) {
      if (
        !validate19(data.link, {
          instancePath: instancePath + '/link',
          parentData: data,
          parentDataProperty: 'link',
          rootData,
        })
      ) {
        vErrors =
          vErrors === null
            ? validate19.errors
            : vErrors.concat(validate19.errors);
        errors = vErrors.length;
      }
    }
    if (data.media_urls !== undefined) {
      let data2 = data.media_urls;
      if (Array.isArray(data2)) {
        const len0 = data2.length;
        for (let i0 = 0; i0 < len0; i0++) {
          let data3 = data2[i0];
          if (typeof data3 === 'string') {
            if (!formats0(data3)) {
              const err4 = {
                instancePath: instancePath + '/media_urls/' + i0,
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
              instancePath: instancePath + '/media_urls/' + i0,
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
          instancePath: instancePath + '/media_urls',
          schemaPath: '#/properties/media_urls/type',
          keyword: 'type',
          params: { type: 'array' },
          message: 'must be array',
        };
        if (vErrors === null) {
          vErrors = [err6];
        } else {
          vErrors.push(err6);
        }
        errors++;
      }
    }
  } else {
    const err7 = {
      instancePath,
      schemaPath: '#/type',
      keyword: 'type',
      params: { type: 'object' },
      message: 'must be object',
    };
    if (vErrors === null) {
      vErrors = [err7];
    } else {
      vErrors.push(err7);
    }
    errors++;
  }
  validate21.errors = vErrors;
  return errors === 0;
}
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
    const tag0 = data.type;
    if (typeof tag0 == 'string') {
      if (tag0 === 'single') {
        if (
          !validate18(data, {
            instancePath,
            parentData,
            parentDataProperty,
            rootData,
          })
        ) {
          vErrors =
            vErrors === null
              ? validate18.errors
              : vErrors.concat(validate18.errors);
          errors = vErrors.length;
        }
      } else if (tag0 === 'carousel') {
        if (
          !validate21(data, {
            instancePath,
            parentData,
            parentDataProperty,
            rootData,
          })
        ) {
          vErrors =
            vErrors === null
              ? validate21.errors
              : vErrors.concat(validate21.errors);
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
  validate17.errors = vErrors;
  return errors === 0;
}
const schema32 = {
  type: 'object',
  oneOf: [
    { $ref: '#/definitions/media:photo' },
    { $ref: '#/definitions/media:video' },
  ],
  required: ['type'],
  discriminator: { propertyName: 'type' },
};
const schema33 = {
  type: 'object',
  properties: { type: { const: 'photo' }, url: { $ref: '#/definitions/uri' } },
  required: ['type', 'url'],
  additionalProperties: false,
};
function validate27(
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
  validate27.errors = vErrors;
  return errors === 0;
}
const schema35 = {
  type: 'object',
  properties: {
    type: { const: 'video' },
    thumbnail: { $ref: '#/definitions/uri' },
  },
  required: ['type', 'thumbnail'],
  additionalProperties: false,
};
function validate28(
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
  validate28.errors = vErrors;
  return errors === 0;
}
function validate26(
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
          !validate27(data, {
            instancePath,
            parentData,
            parentDataProperty,
            rootData,
          })
        ) {
          vErrors =
            vErrors === null
              ? validate27.errors
              : vErrors.concat(validate27.errors);
          errors = vErrors.length;
        }
      } else if (tag0 === 'video') {
        if (
          !validate28(data, {
            instancePath,
            parentData,
            parentDataProperty,
            rootData,
          })
        ) {
          vErrors =
            vErrors === null
              ? validate28.errors
              : vErrors.concat(validate28.errors);
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
  validate26.errors = vErrors;
  return errors === 0;
}
function validate10(
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
    if (data.timestamp === undefined) {
      const err1 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'timestamp' },
        message: "must have required property '" + 'timestamp' + "'",
      };
      if (vErrors === null) {
        vErrors = [err1];
      } else {
        vErrors.push(err1);
      }
      errors++;
    }
    if (data.author === undefined) {
      const err2 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'author' },
        message: "must have required property '" + 'author' + "'",
      };
      if (vErrors === null) {
        vErrors = [err2];
      } else {
        vErrors.push(err2);
      }
      errors++;
    }
    if (data.text === undefined) {
      const err3 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'text' },
        message: "must have required property '" + 'text' + "'",
      };
      if (vErrors === null) {
        vErrors = [err3];
      } else {
        vErrors.push(err3);
      }
      errors++;
    }
    for (const key0 in data) {
      if (
        !(
          key0 === 'id' ||
          key0 === 'timestamp' ||
          key0 === 'author' ||
          key0 === 'text' ||
          key0 === 'card' ||
          key0 === 'media'
        )
      ) {
        const err4 = {
          instancePath,
          schemaPath: '#/additionalProperties',
          keyword: 'additionalProperties',
          params: { additionalProperty: key0 },
          message: 'must NOT have additional properties',
        };
        if (vErrors === null) {
          vErrors = [err4];
        } else {
          vErrors.push(err4);
        }
        errors++;
      }
    }
    if (data.id !== undefined) {
      if (typeof data.id !== 'string') {
        const err5 = {
          instancePath: instancePath + '/id',
          schemaPath: '#/properties/id/type',
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
    if (data.timestamp !== undefined) {
      let data1 = data.timestamp;
      if (
        !(
          typeof data1 == 'number' &&
          !(data1 % 1) &&
          !isNaN(data1) &&
          isFinite(data1)
        )
      ) {
        const err6 = {
          instancePath: instancePath + '/timestamp',
          schemaPath: '#/properties/timestamp/type',
          keyword: 'type',
          params: { type: 'integer' },
          message: 'must be integer',
        };
        if (vErrors === null) {
          vErrors = [err6];
        } else {
          vErrors.push(err6);
        }
        errors++;
      }
    }
    if (data.author !== undefined) {
      let data2 = data.author;
      if (data2 && typeof data2 == 'object' && !Array.isArray(data2)) {
        if (data2.name === undefined) {
          const err7 = {
            instancePath: instancePath + '/author',
            schemaPath: '#/definitions/user/required',
            keyword: 'required',
            params: { missingProperty: 'name' },
            message: "must have required property '" + 'name' + "'",
          };
          if (vErrors === null) {
            vErrors = [err7];
          } else {
            vErrors.push(err7);
          }
          errors++;
        }
        if (data2.username === undefined) {
          const err8 = {
            instancePath: instancePath + '/author',
            schemaPath: '#/definitions/user/required',
            keyword: 'required',
            params: { missingProperty: 'username' },
            message: "must have required property '" + 'username' + "'",
          };
          if (vErrors === null) {
            vErrors = [err8];
          } else {
            vErrors.push(err8);
          }
          errors++;
        }
        for (const key1 in data2) {
          if (!(key1 === 'name' || key1 === 'username')) {
            const err9 = {
              instancePath: instancePath + '/author',
              schemaPath: '#/definitions/user/additionalProperties',
              keyword: 'additionalProperties',
              params: { additionalProperty: key1 },
              message: 'must NOT have additional properties',
            };
            if (vErrors === null) {
              vErrors = [err9];
            } else {
              vErrors.push(err9);
            }
            errors++;
          }
        }
        if (data2.name !== undefined) {
          if (typeof data2.name !== 'string') {
            const err10 = {
              instancePath: instancePath + '/author/name',
              schemaPath: '#/definitions/user/properties/name/type',
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
        if (data2.username !== undefined) {
          if (typeof data2.username !== 'string') {
            const err11 = {
              instancePath: instancePath + '/author/username',
              schemaPath: '#/definitions/user/properties/username/type',
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
      } else {
        const err12 = {
          instancePath: instancePath + '/author',
          schemaPath: '#/definitions/user/type',
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
    }
    if (data.text !== undefined) {
      let data5 = data.text;
      if (Array.isArray(data5)) {
        const len0 = data5.length;
        for (let i0 = 0; i0 < len0; i0++) {
          if (
            !validate11(data5[i0], {
              instancePath: instancePath + '/text/' + i0,
              parentData: data5,
              parentDataProperty: i0,
              rootData,
            })
          ) {
            vErrors =
              vErrors === null
                ? validate11.errors
                : vErrors.concat(validate11.errors);
            errors = vErrors.length;
          }
        }
      } else {
        const err13 = {
          instancePath: instancePath + '/text',
          schemaPath: '#/properties/text/type',
          keyword: 'type',
          params: { type: 'array' },
          message: 'must be array',
        };
        if (vErrors === null) {
          vErrors = [err13];
        } else {
          vErrors.push(err13);
        }
        errors++;
      }
    }
    if (data.card !== undefined) {
      if (
        !validate17(data.card, {
          instancePath: instancePath + '/card',
          parentData: data,
          parentDataProperty: 'card',
          rootData,
        })
      ) {
        vErrors =
          vErrors === null
            ? validate17.errors
            : vErrors.concat(validate17.errors);
        errors = vErrors.length;
      }
    }
    if (data.media !== undefined) {
      let data8 = data.media;
      if (Array.isArray(data8)) {
        const len1 = data8.length;
        for (let i1 = 0; i1 < len1; i1++) {
          if (
            !validate26(data8[i1], {
              instancePath: instancePath + '/media/' + i1,
              parentData: data8,
              parentDataProperty: i1,
              rootData,
            })
          ) {
            vErrors =
              vErrors === null
                ? validate26.errors
                : vErrors.concat(validate26.errors);
            errors = vErrors.length;
          }
        }
      } else {
        const err14 = {
          instancePath: instancePath + '/media',
          schemaPath: '#/properties/media/type',
          keyword: 'type',
          params: { type: 'array' },
          message: 'must be array',
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
  validate10.errors = vErrors;
  return errors === 0;
}
