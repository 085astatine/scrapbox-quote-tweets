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
    card: {
      type: 'object',
      oneOf: [
        {
          type: 'object',
          properties: {
            type: { type: 'string', const: 'single' },
            link: {
              type: 'object',
              properties: {
                url: { $ref: '#/definitions/uri' },
                expanded_url: { $ref: '#/definitions/uri' },
                decoded_url: { $ref: '#/definitions/iri' },
                title: { type: 'string', nullable: true },
              },
              required: ['url', 'expanded_url', 'decoded_url'],
              additionalProperties: false,
              nullable: true,
            },
            media_url: { $ref: '#/definitions/uri' },
          },
          required: ['type', 'media_url'],
          additionalProperties: false,
        },
        {
          type: 'object',
          properties: {
            type: { type: 'string', const: 'carousel' },
            link: {
              type: 'object',
              properties: {
                url: { $ref: '#/definitions/uri' },
                expanded_url: { $ref: '#/definitions/uri' },
                decoded_url: { $ref: '#/definitions/iri' },
                title: { type: 'string', nullable: true },
              },
              required: ['url', 'expanded_url', 'decoded_url'],
              additionalProperties: false,
              nullable: true,
            },
            media_urls: { type: 'array', items: { $ref: '#/definitions/uri' } },
          },
          required: ['type', 'media_urls'],
          additionalProperties: false,
        },
      ],
      required: ['type'],
      discriminator: { propertyName: 'type' },
      nullable: true,
    },
    media: {
      type: 'array',
      items: {
        type: 'object',
        oneOf: [
          {
            type: 'object',
            properties: {
              type: { type: 'string', const: 'photo' },
              url: { $ref: '#/definitions/uri' },
            },
            required: ['type', 'url'],
            additionalProperties: false,
          },
          {
            type: 'object',
            properties: {
              type: { type: 'string', const: 'video' },
              thumbnail: { $ref: '#/definitions/uri' },
            },
            required: ['type', 'thumbnail'],
            additionalProperties: false,
          },
        ],
        required: ['type'],
        discriminator: { propertyName: 'type' },
      },
      nullable: true,
    },
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
  },
};
const schema12 = {
  type: 'object',
  properties: { name: { type: 'string' }, username: { type: 'string' } },
  required: ['name', 'username'],
  additionalProperties: false,
};
const schema15 = { type: 'string', format: 'uri' };
const schema17 = { type: 'string', format: 'iri' };
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
      let data7 = data.card;
      if (
        !(data7 && typeof data7 == 'object' && !Array.isArray(data7)) &&
        data7 !== null
      ) {
        const err14 = {
          instancePath: instancePath + '/card',
          schemaPath: '#/properties/card/type',
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
      if (data7 && typeof data7 == 'object' && !Array.isArray(data7)) {
        if (data7.type === undefined) {
          const err15 = {
            instancePath: instancePath + '/card',
            schemaPath: '#/properties/card/required',
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
        const tag0 = data7.type;
        if (typeof tag0 == 'string') {
          if (tag0 === 'single') {
            if (data7 && typeof data7 == 'object' && !Array.isArray(data7)) {
              if (data7.type === undefined) {
                const err16 = {
                  instancePath: instancePath + '/card',
                  schemaPath: '#/properties/card/oneOf/0/required',
                  keyword: 'required',
                  params: { missingProperty: 'type' },
                  message: "must have required property '" + 'type' + "'",
                };
                if (vErrors === null) {
                  vErrors = [err16];
                } else {
                  vErrors.push(err16);
                }
                errors++;
              }
              if (data7.media_url === undefined) {
                const err17 = {
                  instancePath: instancePath + '/card',
                  schemaPath: '#/properties/card/oneOf/0/required',
                  keyword: 'required',
                  params: { missingProperty: 'media_url' },
                  message: "must have required property '" + 'media_url' + "'",
                };
                if (vErrors === null) {
                  vErrors = [err17];
                } else {
                  vErrors.push(err17);
                }
                errors++;
              }
              for (const key2 in data7) {
                if (
                  !(key2 === 'type' || key2 === 'link' || key2 === 'media_url')
                ) {
                  const err18 = {
                    instancePath: instancePath + '/card',
                    schemaPath:
                      '#/properties/card/oneOf/0/additionalProperties',
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
              if (data7.type !== undefined) {
                let data8 = data7.type;
                if (typeof data8 !== 'string') {
                  const err19 = {
                    instancePath: instancePath + '/card/type',
                    schemaPath:
                      '#/properties/card/oneOf/0/properties/type/type',
                    keyword: 'type',
                    params: { type: 'string' },
                    message: 'must be string',
                  };
                  if (vErrors === null) {
                    vErrors = [err19];
                  } else {
                    vErrors.push(err19);
                  }
                  errors++;
                }
                if ('single' !== data8) {
                  const err20 = {
                    instancePath: instancePath + '/card/type',
                    schemaPath:
                      '#/properties/card/oneOf/0/properties/type/const',
                    keyword: 'const',
                    params: { allowedValue: 'single' },
                    message: 'must be equal to constant',
                  };
                  if (vErrors === null) {
                    vErrors = [err20];
                  } else {
                    vErrors.push(err20);
                  }
                  errors++;
                }
              }
              if (data7.link !== undefined) {
                let data9 = data7.link;
                if (
                  !(
                    data9 &&
                    typeof data9 == 'object' &&
                    !Array.isArray(data9)
                  ) &&
                  data9 !== null
                ) {
                  const err21 = {
                    instancePath: instancePath + '/card/link',
                    schemaPath:
                      '#/properties/card/oneOf/0/properties/link/type',
                    keyword: 'type',
                    params: { type: 'object' },
                    message: 'must be object',
                  };
                  if (vErrors === null) {
                    vErrors = [err21];
                  } else {
                    vErrors.push(err21);
                  }
                  errors++;
                }
                if (
                  data9 &&
                  typeof data9 == 'object' &&
                  !Array.isArray(data9)
                ) {
                  if (data9.url === undefined) {
                    const err22 = {
                      instancePath: instancePath + '/card/link',
                      schemaPath:
                        '#/properties/card/oneOf/0/properties/link/required',
                      keyword: 'required',
                      params: { missingProperty: 'url' },
                      message: "must have required property '" + 'url' + "'",
                    };
                    if (vErrors === null) {
                      vErrors = [err22];
                    } else {
                      vErrors.push(err22);
                    }
                    errors++;
                  }
                  if (data9.expanded_url === undefined) {
                    const err23 = {
                      instancePath: instancePath + '/card/link',
                      schemaPath:
                        '#/properties/card/oneOf/0/properties/link/required',
                      keyword: 'required',
                      params: { missingProperty: 'expanded_url' },
                      message:
                        "must have required property '" + 'expanded_url' + "'",
                    };
                    if (vErrors === null) {
                      vErrors = [err23];
                    } else {
                      vErrors.push(err23);
                    }
                    errors++;
                  }
                  if (data9.decoded_url === undefined) {
                    const err24 = {
                      instancePath: instancePath + '/card/link',
                      schemaPath:
                        '#/properties/card/oneOf/0/properties/link/required',
                      keyword: 'required',
                      params: { missingProperty: 'decoded_url' },
                      message:
                        "must have required property '" + 'decoded_url' + "'",
                    };
                    if (vErrors === null) {
                      vErrors = [err24];
                    } else {
                      vErrors.push(err24);
                    }
                    errors++;
                  }
                  for (const key3 in data9) {
                    if (
                      !(
                        key3 === 'url' ||
                        key3 === 'expanded_url' ||
                        key3 === 'decoded_url' ||
                        key3 === 'title'
                      )
                    ) {
                      const err25 = {
                        instancePath: instancePath + '/card/link',
                        schemaPath:
                          '#/properties/card/oneOf/0/properties/link/additionalProperties',
                        keyword: 'additionalProperties',
                        params: { additionalProperty: key3 },
                        message: 'must NOT have additional properties',
                      };
                      if (vErrors === null) {
                        vErrors = [err25];
                      } else {
                        vErrors.push(err25);
                      }
                      errors++;
                    }
                  }
                  if (data9.url !== undefined) {
                    let data10 = data9.url;
                    if (typeof data10 === 'string') {
                      if (!formats0(data10)) {
                        const err26 = {
                          instancePath: instancePath + '/card/link/url',
                          schemaPath: '#/definitions/uri/format',
                          keyword: 'format',
                          params: { format: 'uri' },
                          message: 'must match format "' + 'uri' + '"',
                        };
                        if (vErrors === null) {
                          vErrors = [err26];
                        } else {
                          vErrors.push(err26);
                        }
                        errors++;
                      }
                    } else {
                      const err27 = {
                        instancePath: instancePath + '/card/link/url',
                        schemaPath: '#/definitions/uri/type',
                        keyword: 'type',
                        params: { type: 'string' },
                        message: 'must be string',
                      };
                      if (vErrors === null) {
                        vErrors = [err27];
                      } else {
                        vErrors.push(err27);
                      }
                      errors++;
                    }
                  }
                  if (data9.expanded_url !== undefined) {
                    let data11 = data9.expanded_url;
                    if (typeof data11 === 'string') {
                      if (!formats0(data11)) {
                        const err28 = {
                          instancePath:
                            instancePath + '/card/link/expanded_url',
                          schemaPath: '#/definitions/uri/format',
                          keyword: 'format',
                          params: { format: 'uri' },
                          message: 'must match format "' + 'uri' + '"',
                        };
                        if (vErrors === null) {
                          vErrors = [err28];
                        } else {
                          vErrors.push(err28);
                        }
                        errors++;
                      }
                    } else {
                      const err29 = {
                        instancePath: instancePath + '/card/link/expanded_url',
                        schemaPath: '#/definitions/uri/type',
                        keyword: 'type',
                        params: { type: 'string' },
                        message: 'must be string',
                      };
                      if (vErrors === null) {
                        vErrors = [err29];
                      } else {
                        vErrors.push(err29);
                      }
                      errors++;
                    }
                  }
                  if (data9.decoded_url !== undefined) {
                    let data12 = data9.decoded_url;
                    if (typeof data12 === 'string') {
                      if (!formats4(data12)) {
                        const err30 = {
                          instancePath: instancePath + '/card/link/decoded_url',
                          schemaPath: '#/definitions/iri/format',
                          keyword: 'format',
                          params: { format: 'iri' },
                          message: 'must match format "' + 'iri' + '"',
                        };
                        if (vErrors === null) {
                          vErrors = [err30];
                        } else {
                          vErrors.push(err30);
                        }
                        errors++;
                      }
                    } else {
                      const err31 = {
                        instancePath: instancePath + '/card/link/decoded_url',
                        schemaPath: '#/definitions/iri/type',
                        keyword: 'type',
                        params: { type: 'string' },
                        message: 'must be string',
                      };
                      if (vErrors === null) {
                        vErrors = [err31];
                      } else {
                        vErrors.push(err31);
                      }
                      errors++;
                    }
                  }
                  if (data9.title !== undefined) {
                    let data13 = data9.title;
                    if (typeof data13 !== 'string' && data13 !== null) {
                      const err32 = {
                        instancePath: instancePath + '/card/link/title',
                        schemaPath:
                          '#/properties/card/oneOf/0/properties/link/properties/title/type',
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
                  }
                }
              }
              if (data7.media_url !== undefined) {
                let data14 = data7.media_url;
                if (typeof data14 === 'string') {
                  if (!formats0(data14)) {
                    const err33 = {
                      instancePath: instancePath + '/card/media_url',
                      schemaPath: '#/definitions/uri/format',
                      keyword: 'format',
                      params: { format: 'uri' },
                      message: 'must match format "' + 'uri' + '"',
                    };
                    if (vErrors === null) {
                      vErrors = [err33];
                    } else {
                      vErrors.push(err33);
                    }
                    errors++;
                  }
                } else {
                  const err34 = {
                    instancePath: instancePath + '/card/media_url',
                    schemaPath: '#/definitions/uri/type',
                    keyword: 'type',
                    params: { type: 'string' },
                    message: 'must be string',
                  };
                  if (vErrors === null) {
                    vErrors = [err34];
                  } else {
                    vErrors.push(err34);
                  }
                  errors++;
                }
              }
            } else {
              const err35 = {
                instancePath: instancePath + '/card',
                schemaPath: '#/properties/card/oneOf/0/type',
                keyword: 'type',
                params: { type: 'object' },
                message: 'must be object',
              };
              if (vErrors === null) {
                vErrors = [err35];
              } else {
                vErrors.push(err35);
              }
              errors++;
            }
          } else if (tag0 === 'carousel') {
            if (data7 && typeof data7 == 'object' && !Array.isArray(data7)) {
              if (data7.type === undefined) {
                const err36 = {
                  instancePath: instancePath + '/card',
                  schemaPath: '#/properties/card/oneOf/1/required',
                  keyword: 'required',
                  params: { missingProperty: 'type' },
                  message: "must have required property '" + 'type' + "'",
                };
                if (vErrors === null) {
                  vErrors = [err36];
                } else {
                  vErrors.push(err36);
                }
                errors++;
              }
              if (data7.media_urls === undefined) {
                const err37 = {
                  instancePath: instancePath + '/card',
                  schemaPath: '#/properties/card/oneOf/1/required',
                  keyword: 'required',
                  params: { missingProperty: 'media_urls' },
                  message: "must have required property '" + 'media_urls' + "'",
                };
                if (vErrors === null) {
                  vErrors = [err37];
                } else {
                  vErrors.push(err37);
                }
                errors++;
              }
              for (const key4 in data7) {
                if (
                  !(key4 === 'type' || key4 === 'link' || key4 === 'media_urls')
                ) {
                  const err38 = {
                    instancePath: instancePath + '/card',
                    schemaPath:
                      '#/properties/card/oneOf/1/additionalProperties',
                    keyword: 'additionalProperties',
                    params: { additionalProperty: key4 },
                    message: 'must NOT have additional properties',
                  };
                  if (vErrors === null) {
                    vErrors = [err38];
                  } else {
                    vErrors.push(err38);
                  }
                  errors++;
                }
              }
              if (data7.type !== undefined) {
                let data15 = data7.type;
                if (typeof data15 !== 'string') {
                  const err39 = {
                    instancePath: instancePath + '/card/type',
                    schemaPath:
                      '#/properties/card/oneOf/1/properties/type/type',
                    keyword: 'type',
                    params: { type: 'string' },
                    message: 'must be string',
                  };
                  if (vErrors === null) {
                    vErrors = [err39];
                  } else {
                    vErrors.push(err39);
                  }
                  errors++;
                }
                if ('carousel' !== data15) {
                  const err40 = {
                    instancePath: instancePath + '/card/type',
                    schemaPath:
                      '#/properties/card/oneOf/1/properties/type/const',
                    keyword: 'const',
                    params: { allowedValue: 'carousel' },
                    message: 'must be equal to constant',
                  };
                  if (vErrors === null) {
                    vErrors = [err40];
                  } else {
                    vErrors.push(err40);
                  }
                  errors++;
                }
              }
              if (data7.link !== undefined) {
                let data16 = data7.link;
                if (
                  !(
                    data16 &&
                    typeof data16 == 'object' &&
                    !Array.isArray(data16)
                  ) &&
                  data16 !== null
                ) {
                  const err41 = {
                    instancePath: instancePath + '/card/link',
                    schemaPath:
                      '#/properties/card/oneOf/1/properties/link/type',
                    keyword: 'type',
                    params: { type: 'object' },
                    message: 'must be object',
                  };
                  if (vErrors === null) {
                    vErrors = [err41];
                  } else {
                    vErrors.push(err41);
                  }
                  errors++;
                }
                if (
                  data16 &&
                  typeof data16 == 'object' &&
                  !Array.isArray(data16)
                ) {
                  if (data16.url === undefined) {
                    const err42 = {
                      instancePath: instancePath + '/card/link',
                      schemaPath:
                        '#/properties/card/oneOf/1/properties/link/required',
                      keyword: 'required',
                      params: { missingProperty: 'url' },
                      message: "must have required property '" + 'url' + "'",
                    };
                    if (vErrors === null) {
                      vErrors = [err42];
                    } else {
                      vErrors.push(err42);
                    }
                    errors++;
                  }
                  if (data16.expanded_url === undefined) {
                    const err43 = {
                      instancePath: instancePath + '/card/link',
                      schemaPath:
                        '#/properties/card/oneOf/1/properties/link/required',
                      keyword: 'required',
                      params: { missingProperty: 'expanded_url' },
                      message:
                        "must have required property '" + 'expanded_url' + "'",
                    };
                    if (vErrors === null) {
                      vErrors = [err43];
                    } else {
                      vErrors.push(err43);
                    }
                    errors++;
                  }
                  if (data16.decoded_url === undefined) {
                    const err44 = {
                      instancePath: instancePath + '/card/link',
                      schemaPath:
                        '#/properties/card/oneOf/1/properties/link/required',
                      keyword: 'required',
                      params: { missingProperty: 'decoded_url' },
                      message:
                        "must have required property '" + 'decoded_url' + "'",
                    };
                    if (vErrors === null) {
                      vErrors = [err44];
                    } else {
                      vErrors.push(err44);
                    }
                    errors++;
                  }
                  for (const key5 in data16) {
                    if (
                      !(
                        key5 === 'url' ||
                        key5 === 'expanded_url' ||
                        key5 === 'decoded_url' ||
                        key5 === 'title'
                      )
                    ) {
                      const err45 = {
                        instancePath: instancePath + '/card/link',
                        schemaPath:
                          '#/properties/card/oneOf/1/properties/link/additionalProperties',
                        keyword: 'additionalProperties',
                        params: { additionalProperty: key5 },
                        message: 'must NOT have additional properties',
                      };
                      if (vErrors === null) {
                        vErrors = [err45];
                      } else {
                        vErrors.push(err45);
                      }
                      errors++;
                    }
                  }
                  if (data16.url !== undefined) {
                    let data17 = data16.url;
                    if (typeof data17 === 'string') {
                      if (!formats0(data17)) {
                        const err46 = {
                          instancePath: instancePath + '/card/link/url',
                          schemaPath: '#/definitions/uri/format',
                          keyword: 'format',
                          params: { format: 'uri' },
                          message: 'must match format "' + 'uri' + '"',
                        };
                        if (vErrors === null) {
                          vErrors = [err46];
                        } else {
                          vErrors.push(err46);
                        }
                        errors++;
                      }
                    } else {
                      const err47 = {
                        instancePath: instancePath + '/card/link/url',
                        schemaPath: '#/definitions/uri/type',
                        keyword: 'type',
                        params: { type: 'string' },
                        message: 'must be string',
                      };
                      if (vErrors === null) {
                        vErrors = [err47];
                      } else {
                        vErrors.push(err47);
                      }
                      errors++;
                    }
                  }
                  if (data16.expanded_url !== undefined) {
                    let data18 = data16.expanded_url;
                    if (typeof data18 === 'string') {
                      if (!formats0(data18)) {
                        const err48 = {
                          instancePath:
                            instancePath + '/card/link/expanded_url',
                          schemaPath: '#/definitions/uri/format',
                          keyword: 'format',
                          params: { format: 'uri' },
                          message: 'must match format "' + 'uri' + '"',
                        };
                        if (vErrors === null) {
                          vErrors = [err48];
                        } else {
                          vErrors.push(err48);
                        }
                        errors++;
                      }
                    } else {
                      const err49 = {
                        instancePath: instancePath + '/card/link/expanded_url',
                        schemaPath: '#/definitions/uri/type',
                        keyword: 'type',
                        params: { type: 'string' },
                        message: 'must be string',
                      };
                      if (vErrors === null) {
                        vErrors = [err49];
                      } else {
                        vErrors.push(err49);
                      }
                      errors++;
                    }
                  }
                  if (data16.decoded_url !== undefined) {
                    let data19 = data16.decoded_url;
                    if (typeof data19 === 'string') {
                      if (!formats4(data19)) {
                        const err50 = {
                          instancePath: instancePath + '/card/link/decoded_url',
                          schemaPath: '#/definitions/iri/format',
                          keyword: 'format',
                          params: { format: 'iri' },
                          message: 'must match format "' + 'iri' + '"',
                        };
                        if (vErrors === null) {
                          vErrors = [err50];
                        } else {
                          vErrors.push(err50);
                        }
                        errors++;
                      }
                    } else {
                      const err51 = {
                        instancePath: instancePath + '/card/link/decoded_url',
                        schemaPath: '#/definitions/iri/type',
                        keyword: 'type',
                        params: { type: 'string' },
                        message: 'must be string',
                      };
                      if (vErrors === null) {
                        vErrors = [err51];
                      } else {
                        vErrors.push(err51);
                      }
                      errors++;
                    }
                  }
                  if (data16.title !== undefined) {
                    let data20 = data16.title;
                    if (typeof data20 !== 'string' && data20 !== null) {
                      const err52 = {
                        instancePath: instancePath + '/card/link/title',
                        schemaPath:
                          '#/properties/card/oneOf/1/properties/link/properties/title/type',
                        keyword: 'type',
                        params: { type: 'string' },
                        message: 'must be string',
                      };
                      if (vErrors === null) {
                        vErrors = [err52];
                      } else {
                        vErrors.push(err52);
                      }
                      errors++;
                    }
                  }
                }
              }
              if (data7.media_urls !== undefined) {
                let data21 = data7.media_urls;
                if (Array.isArray(data21)) {
                  const len1 = data21.length;
                  for (let i1 = 0; i1 < len1; i1++) {
                    let data22 = data21[i1];
                    if (typeof data22 === 'string') {
                      if (!formats0(data22)) {
                        const err53 = {
                          instancePath: instancePath + '/card/media_urls/' + i1,
                          schemaPath: '#/definitions/uri/format',
                          keyword: 'format',
                          params: { format: 'uri' },
                          message: 'must match format "' + 'uri' + '"',
                        };
                        if (vErrors === null) {
                          vErrors = [err53];
                        } else {
                          vErrors.push(err53);
                        }
                        errors++;
                      }
                    } else {
                      const err54 = {
                        instancePath: instancePath + '/card/media_urls/' + i1,
                        schemaPath: '#/definitions/uri/type',
                        keyword: 'type',
                        params: { type: 'string' },
                        message: 'must be string',
                      };
                      if (vErrors === null) {
                        vErrors = [err54];
                      } else {
                        vErrors.push(err54);
                      }
                      errors++;
                    }
                  }
                } else {
                  const err55 = {
                    instancePath: instancePath + '/card/media_urls',
                    schemaPath:
                      '#/properties/card/oneOf/1/properties/media_urls/type',
                    keyword: 'type',
                    params: { type: 'array' },
                    message: 'must be array',
                  };
                  if (vErrors === null) {
                    vErrors = [err55];
                  } else {
                    vErrors.push(err55);
                  }
                  errors++;
                }
              }
            } else {
              const err56 = {
                instancePath: instancePath + '/card',
                schemaPath: '#/properties/card/oneOf/1/type',
                keyword: 'type',
                params: { type: 'object' },
                message: 'must be object',
              };
              if (vErrors === null) {
                vErrors = [err56];
              } else {
                vErrors.push(err56);
              }
              errors++;
            }
          } else {
            const err57 = {
              instancePath: instancePath + '/card',
              schemaPath: '#/properties/card/discriminator',
              keyword: 'discriminator',
              params: { error: 'mapping', tag: 'type', tagValue: tag0 },
              message: 'value of tag "type" must be in oneOf',
            };
            if (vErrors === null) {
              vErrors = [err57];
            } else {
              vErrors.push(err57);
            }
            errors++;
          }
        } else {
          const err58 = {
            instancePath: instancePath + '/card',
            schemaPath: '#/properties/card/discriminator',
            keyword: 'discriminator',
            params: { error: 'tag', tag: 'type', tagValue: tag0 },
            message: 'tag "type" must be string',
          };
          if (vErrors === null) {
            vErrors = [err58];
          } else {
            vErrors.push(err58);
          }
          errors++;
        }
      }
    }
    if (data.media !== undefined) {
      let data23 = data.media;
      if (!Array.isArray(data23) && data23 !== null) {
        const err59 = {
          instancePath: instancePath + '/media',
          schemaPath: '#/properties/media/type',
          keyword: 'type',
          params: { type: 'array' },
          message: 'must be array',
        };
        if (vErrors === null) {
          vErrors = [err59];
        } else {
          vErrors.push(err59);
        }
        errors++;
      }
      if (Array.isArray(data23)) {
        const len2 = data23.length;
        for (let i2 = 0; i2 < len2; i2++) {
          let data24 = data23[i2];
          if (data24 && typeof data24 == 'object' && !Array.isArray(data24)) {
            if (data24.type === undefined) {
              const err60 = {
                instancePath: instancePath + '/media/' + i2,
                schemaPath: '#/properties/media/items/required',
                keyword: 'required',
                params: { missingProperty: 'type' },
                message: "must have required property '" + 'type' + "'",
              };
              if (vErrors === null) {
                vErrors = [err60];
              } else {
                vErrors.push(err60);
              }
              errors++;
            }
            const tag1 = data24.type;
            if (typeof tag1 == 'string') {
              if (tag1 === 'photo') {
                if (
                  data24 &&
                  typeof data24 == 'object' &&
                  !Array.isArray(data24)
                ) {
                  if (data24.type === undefined) {
                    const err61 = {
                      instancePath: instancePath + '/media/' + i2,
                      schemaPath: '#/properties/media/items/oneOf/0/required',
                      keyword: 'required',
                      params: { missingProperty: 'type' },
                      message: "must have required property '" + 'type' + "'",
                    };
                    if (vErrors === null) {
                      vErrors = [err61];
                    } else {
                      vErrors.push(err61);
                    }
                    errors++;
                  }
                  if (data24.url === undefined) {
                    const err62 = {
                      instancePath: instancePath + '/media/' + i2,
                      schemaPath: '#/properties/media/items/oneOf/0/required',
                      keyword: 'required',
                      params: { missingProperty: 'url' },
                      message: "must have required property '" + 'url' + "'",
                    };
                    if (vErrors === null) {
                      vErrors = [err62];
                    } else {
                      vErrors.push(err62);
                    }
                    errors++;
                  }
                  for (const key6 in data24) {
                    if (!(key6 === 'type' || key6 === 'url')) {
                      const err63 = {
                        instancePath: instancePath + '/media/' + i2,
                        schemaPath:
                          '#/properties/media/items/oneOf/0/additionalProperties',
                        keyword: 'additionalProperties',
                        params: { additionalProperty: key6 },
                        message: 'must NOT have additional properties',
                      };
                      if (vErrors === null) {
                        vErrors = [err63];
                      } else {
                        vErrors.push(err63);
                      }
                      errors++;
                    }
                  }
                  if (data24.type !== undefined) {
                    let data25 = data24.type;
                    if (typeof data25 !== 'string') {
                      const err64 = {
                        instancePath: instancePath + '/media/' + i2 + '/type',
                        schemaPath:
                          '#/properties/media/items/oneOf/0/properties/type/type',
                        keyword: 'type',
                        params: { type: 'string' },
                        message: 'must be string',
                      };
                      if (vErrors === null) {
                        vErrors = [err64];
                      } else {
                        vErrors.push(err64);
                      }
                      errors++;
                    }
                    if ('photo' !== data25) {
                      const err65 = {
                        instancePath: instancePath + '/media/' + i2 + '/type',
                        schemaPath:
                          '#/properties/media/items/oneOf/0/properties/type/const',
                        keyword: 'const',
                        params: { allowedValue: 'photo' },
                        message: 'must be equal to constant',
                      };
                      if (vErrors === null) {
                        vErrors = [err65];
                      } else {
                        vErrors.push(err65);
                      }
                      errors++;
                    }
                  }
                  if (data24.url !== undefined) {
                    let data26 = data24.url;
                    if (typeof data26 === 'string') {
                      if (!formats0(data26)) {
                        const err66 = {
                          instancePath: instancePath + '/media/' + i2 + '/url',
                          schemaPath: '#/definitions/uri/format',
                          keyword: 'format',
                          params: { format: 'uri' },
                          message: 'must match format "' + 'uri' + '"',
                        };
                        if (vErrors === null) {
                          vErrors = [err66];
                        } else {
                          vErrors.push(err66);
                        }
                        errors++;
                      }
                    } else {
                      const err67 = {
                        instancePath: instancePath + '/media/' + i2 + '/url',
                        schemaPath: '#/definitions/uri/type',
                        keyword: 'type',
                        params: { type: 'string' },
                        message: 'must be string',
                      };
                      if (vErrors === null) {
                        vErrors = [err67];
                      } else {
                        vErrors.push(err67);
                      }
                      errors++;
                    }
                  }
                } else {
                  const err68 = {
                    instancePath: instancePath + '/media/' + i2,
                    schemaPath: '#/properties/media/items/oneOf/0/type',
                    keyword: 'type',
                    params: { type: 'object' },
                    message: 'must be object',
                  };
                  if (vErrors === null) {
                    vErrors = [err68];
                  } else {
                    vErrors.push(err68);
                  }
                  errors++;
                }
              } else if (tag1 === 'video') {
                if (
                  data24 &&
                  typeof data24 == 'object' &&
                  !Array.isArray(data24)
                ) {
                  if (data24.type === undefined) {
                    const err69 = {
                      instancePath: instancePath + '/media/' + i2,
                      schemaPath: '#/properties/media/items/oneOf/1/required',
                      keyword: 'required',
                      params: { missingProperty: 'type' },
                      message: "must have required property '" + 'type' + "'",
                    };
                    if (vErrors === null) {
                      vErrors = [err69];
                    } else {
                      vErrors.push(err69);
                    }
                    errors++;
                  }
                  if (data24.thumbnail === undefined) {
                    const err70 = {
                      instancePath: instancePath + '/media/' + i2,
                      schemaPath: '#/properties/media/items/oneOf/1/required',
                      keyword: 'required',
                      params: { missingProperty: 'thumbnail' },
                      message:
                        "must have required property '" + 'thumbnail' + "'",
                    };
                    if (vErrors === null) {
                      vErrors = [err70];
                    } else {
                      vErrors.push(err70);
                    }
                    errors++;
                  }
                  for (const key7 in data24) {
                    if (!(key7 === 'type' || key7 === 'thumbnail')) {
                      const err71 = {
                        instancePath: instancePath + '/media/' + i2,
                        schemaPath:
                          '#/properties/media/items/oneOf/1/additionalProperties',
                        keyword: 'additionalProperties',
                        params: { additionalProperty: key7 },
                        message: 'must NOT have additional properties',
                      };
                      if (vErrors === null) {
                        vErrors = [err71];
                      } else {
                        vErrors.push(err71);
                      }
                      errors++;
                    }
                  }
                  if (data24.type !== undefined) {
                    let data27 = data24.type;
                    if (typeof data27 !== 'string') {
                      const err72 = {
                        instancePath: instancePath + '/media/' + i2 + '/type',
                        schemaPath:
                          '#/properties/media/items/oneOf/1/properties/type/type',
                        keyword: 'type',
                        params: { type: 'string' },
                        message: 'must be string',
                      };
                      if (vErrors === null) {
                        vErrors = [err72];
                      } else {
                        vErrors.push(err72);
                      }
                      errors++;
                    }
                    if ('video' !== data27) {
                      const err73 = {
                        instancePath: instancePath + '/media/' + i2 + '/type',
                        schemaPath:
                          '#/properties/media/items/oneOf/1/properties/type/const',
                        keyword: 'const',
                        params: { allowedValue: 'video' },
                        message: 'must be equal to constant',
                      };
                      if (vErrors === null) {
                        vErrors = [err73];
                      } else {
                        vErrors.push(err73);
                      }
                      errors++;
                    }
                  }
                  if (data24.thumbnail !== undefined) {
                    let data28 = data24.thumbnail;
                    if (typeof data28 === 'string') {
                      if (!formats0(data28)) {
                        const err74 = {
                          instancePath:
                            instancePath + '/media/' + i2 + '/thumbnail',
                          schemaPath: '#/definitions/uri/format',
                          keyword: 'format',
                          params: { format: 'uri' },
                          message: 'must match format "' + 'uri' + '"',
                        };
                        if (vErrors === null) {
                          vErrors = [err74];
                        } else {
                          vErrors.push(err74);
                        }
                        errors++;
                      }
                    } else {
                      const err75 = {
                        instancePath:
                          instancePath + '/media/' + i2 + '/thumbnail',
                        schemaPath: '#/definitions/uri/type',
                        keyword: 'type',
                        params: { type: 'string' },
                        message: 'must be string',
                      };
                      if (vErrors === null) {
                        vErrors = [err75];
                      } else {
                        vErrors.push(err75);
                      }
                      errors++;
                    }
                  }
                } else {
                  const err76 = {
                    instancePath: instancePath + '/media/' + i2,
                    schemaPath: '#/properties/media/items/oneOf/1/type',
                    keyword: 'type',
                    params: { type: 'object' },
                    message: 'must be object',
                  };
                  if (vErrors === null) {
                    vErrors = [err76];
                  } else {
                    vErrors.push(err76);
                  }
                  errors++;
                }
              } else {
                const err77 = {
                  instancePath: instancePath + '/media/' + i2,
                  schemaPath: '#/properties/media/items/discriminator',
                  keyword: 'discriminator',
                  params: { error: 'mapping', tag: 'type', tagValue: tag1 },
                  message: 'value of tag "type" must be in oneOf',
                };
                if (vErrors === null) {
                  vErrors = [err77];
                } else {
                  vErrors.push(err77);
                }
                errors++;
              }
            } else {
              const err78 = {
                instancePath: instancePath + '/media/' + i2,
                schemaPath: '#/properties/media/items/discriminator',
                keyword: 'discriminator',
                params: { error: 'tag', tag: 'type', tagValue: tag1 },
                message: 'tag "type" must be string',
              };
              if (vErrors === null) {
                vErrors = [err78];
              } else {
                vErrors.push(err78);
              }
              errors++;
            }
          } else {
            const err79 = {
              instancePath: instancePath + '/media/' + i2,
              schemaPath: '#/properties/media/items/type',
              keyword: 'type',
              params: { type: 'object' },
              message: 'must be object',
            };
            if (vErrors === null) {
              vErrors = [err79];
            } else {
              vErrors.push(err79);
            }
            errors++;
          }
        }
      }
    }
  } else {
    const err80 = {
      instancePath,
      schemaPath: '#/type',
      keyword: 'type',
      params: { type: 'object' },
      message: 'must be object',
    };
    if (vErrors === null) {
      vErrors = [err80];
    } else {
      vErrors.push(err80);
    }
    errors++;
  }
  validate10.errors = vErrors;
  return errors === 0;
}
