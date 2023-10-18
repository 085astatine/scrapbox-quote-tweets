'use strict';
module.exports = validate10;
module.exports.default = validate10;
const schema11 = {
  type: 'array',
  items: {
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
              media_urls: {
                type: 'array',
                items: { $ref: '#/definitions/uri' },
              },
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
  },
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
  if (Array.isArray(data)) {
    const len0 = data.length;
    for (let i0 = 0; i0 < len0; i0++) {
      let data0 = data[i0];
      if (data0 && typeof data0 == 'object' && !Array.isArray(data0)) {
        if (data0.id === undefined) {
          const err0 = {
            instancePath: instancePath + '/' + i0,
            schemaPath: '#/items/required',
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
        if (data0.timestamp === undefined) {
          const err1 = {
            instancePath: instancePath + '/' + i0,
            schemaPath: '#/items/required',
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
        if (data0.author === undefined) {
          const err2 = {
            instancePath: instancePath + '/' + i0,
            schemaPath: '#/items/required',
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
        if (data0.text === undefined) {
          const err3 = {
            instancePath: instancePath + '/' + i0,
            schemaPath: '#/items/required',
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
        for (const key0 in data0) {
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
              instancePath: instancePath + '/' + i0,
              schemaPath: '#/items/additionalProperties',
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
        if (data0.id !== undefined) {
          if (typeof data0.id !== 'string') {
            const err5 = {
              instancePath: instancePath + '/' + i0 + '/id',
              schemaPath: '#/items/properties/id/type',
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
        if (data0.timestamp !== undefined) {
          let data2 = data0.timestamp;
          if (
            !(
              typeof data2 == 'number' &&
              !(data2 % 1) &&
              !isNaN(data2) &&
              isFinite(data2)
            )
          ) {
            const err6 = {
              instancePath: instancePath + '/' + i0 + '/timestamp',
              schemaPath: '#/items/properties/timestamp/type',
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
        if (data0.author !== undefined) {
          let data3 = data0.author;
          if (data3 && typeof data3 == 'object' && !Array.isArray(data3)) {
            if (data3.name === undefined) {
              const err7 = {
                instancePath: instancePath + '/' + i0 + '/author',
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
            if (data3.username === undefined) {
              const err8 = {
                instancePath: instancePath + '/' + i0 + '/author',
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
            for (const key1 in data3) {
              if (!(key1 === 'name' || key1 === 'username')) {
                const err9 = {
                  instancePath: instancePath + '/' + i0 + '/author',
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
            if (data3.name !== undefined) {
              if (typeof data3.name !== 'string') {
                const err10 = {
                  instancePath: instancePath + '/' + i0 + '/author/name',
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
            if (data3.username !== undefined) {
              if (typeof data3.username !== 'string') {
                const err11 = {
                  instancePath: instancePath + '/' + i0 + '/author/username',
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
              instancePath: instancePath + '/' + i0 + '/author',
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
        if (data0.text !== undefined) {
          let data6 = data0.text;
          if (Array.isArray(data6)) {
            const len1 = data6.length;
            for (let i1 = 0; i1 < len1; i1++) {
              if (
                !validate11(data6[i1], {
                  instancePath: instancePath + '/' + i0 + '/text/' + i1,
                  parentData: data6,
                  parentDataProperty: i1,
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
              instancePath: instancePath + '/' + i0 + '/text',
              schemaPath: '#/items/properties/text/type',
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
        if (data0.card !== undefined) {
          let data8 = data0.card;
          if (
            !(data8 && typeof data8 == 'object' && !Array.isArray(data8)) &&
            data8 !== null
          ) {
            const err14 = {
              instancePath: instancePath + '/' + i0 + '/card',
              schemaPath: '#/items/properties/card/type',
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
          if (data8 && typeof data8 == 'object' && !Array.isArray(data8)) {
            if (data8.type === undefined) {
              const err15 = {
                instancePath: instancePath + '/' + i0 + '/card',
                schemaPath: '#/items/properties/card/required',
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
            const tag0 = data8.type;
            if (typeof tag0 == 'string') {
              if (tag0 === 'single') {
                if (
                  data8 &&
                  typeof data8 == 'object' &&
                  !Array.isArray(data8)
                ) {
                  if (data8.type === undefined) {
                    const err16 = {
                      instancePath: instancePath + '/' + i0 + '/card',
                      schemaPath: '#/items/properties/card/oneOf/0/required',
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
                  if (data8.media_url === undefined) {
                    const err17 = {
                      instancePath: instancePath + '/' + i0 + '/card',
                      schemaPath: '#/items/properties/card/oneOf/0/required',
                      keyword: 'required',
                      params: { missingProperty: 'media_url' },
                      message:
                        "must have required property '" + 'media_url' + "'",
                    };
                    if (vErrors === null) {
                      vErrors = [err17];
                    } else {
                      vErrors.push(err17);
                    }
                    errors++;
                  }
                  for (const key2 in data8) {
                    if (
                      !(
                        key2 === 'type' ||
                        key2 === 'link' ||
                        key2 === 'media_url'
                      )
                    ) {
                      const err18 = {
                        instancePath: instancePath + '/' + i0 + '/card',
                        schemaPath:
                          '#/items/properties/card/oneOf/0/additionalProperties',
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
                  if (data8.type !== undefined) {
                    let data9 = data8.type;
                    if (typeof data9 !== 'string') {
                      const err19 = {
                        instancePath: instancePath + '/' + i0 + '/card/type',
                        schemaPath:
                          '#/items/properties/card/oneOf/0/properties/type/type',
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
                    if ('single' !== data9) {
                      const err20 = {
                        instancePath: instancePath + '/' + i0 + '/card/type',
                        schemaPath:
                          '#/items/properties/card/oneOf/0/properties/type/const',
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
                  if (data8.link !== undefined) {
                    let data10 = data8.link;
                    if (
                      !(
                        data10 &&
                        typeof data10 == 'object' &&
                        !Array.isArray(data10)
                      ) &&
                      data10 !== null
                    ) {
                      const err21 = {
                        instancePath: instancePath + '/' + i0 + '/card/link',
                        schemaPath:
                          '#/items/properties/card/oneOf/0/properties/link/type',
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
                      data10 &&
                      typeof data10 == 'object' &&
                      !Array.isArray(data10)
                    ) {
                      if (data10.url === undefined) {
                        const err22 = {
                          instancePath: instancePath + '/' + i0 + '/card/link',
                          schemaPath:
                            '#/items/properties/card/oneOf/0/properties/link/required',
                          keyword: 'required',
                          params: { missingProperty: 'url' },
                          message:
                            "must have required property '" + 'url' + "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err22];
                        } else {
                          vErrors.push(err22);
                        }
                        errors++;
                      }
                      if (data10.expanded_url === undefined) {
                        const err23 = {
                          instancePath: instancePath + '/' + i0 + '/card/link',
                          schemaPath:
                            '#/items/properties/card/oneOf/0/properties/link/required',
                          keyword: 'required',
                          params: { missingProperty: 'expanded_url' },
                          message:
                            "must have required property '" +
                            'expanded_url' +
                            "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err23];
                        } else {
                          vErrors.push(err23);
                        }
                        errors++;
                      }
                      if (data10.decoded_url === undefined) {
                        const err24 = {
                          instancePath: instancePath + '/' + i0 + '/card/link',
                          schemaPath:
                            '#/items/properties/card/oneOf/0/properties/link/required',
                          keyword: 'required',
                          params: { missingProperty: 'decoded_url' },
                          message:
                            "must have required property '" +
                            'decoded_url' +
                            "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err24];
                        } else {
                          vErrors.push(err24);
                        }
                        errors++;
                      }
                      for (const key3 in data10) {
                        if (
                          !(
                            key3 === 'url' ||
                            key3 === 'expanded_url' ||
                            key3 === 'decoded_url' ||
                            key3 === 'title'
                          )
                        ) {
                          const err25 = {
                            instancePath:
                              instancePath + '/' + i0 + '/card/link',
                            schemaPath:
                              '#/items/properties/card/oneOf/0/properties/link/additionalProperties',
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
                      if (data10.url !== undefined) {
                        let data11 = data10.url;
                        if (typeof data11 === 'string') {
                          if (!formats0(data11)) {
                            const err26 = {
                              instancePath:
                                instancePath + '/' + i0 + '/card/link/url',
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
                            instancePath:
                              instancePath + '/' + i0 + '/card/link/url',
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
                      if (data10.expanded_url !== undefined) {
                        let data12 = data10.expanded_url;
                        if (typeof data12 === 'string') {
                          if (!formats0(data12)) {
                            const err28 = {
                              instancePath:
                                instancePath +
                                '/' +
                                i0 +
                                '/card/link/expanded_url',
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
                            instancePath:
                              instancePath +
                              '/' +
                              i0 +
                              '/card/link/expanded_url',
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
                      if (data10.decoded_url !== undefined) {
                        let data13 = data10.decoded_url;
                        if (typeof data13 === 'string') {
                          if (!formats4(data13)) {
                            const err30 = {
                              instancePath:
                                instancePath +
                                '/' +
                                i0 +
                                '/card/link/decoded_url',
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
                            instancePath:
                              instancePath +
                              '/' +
                              i0 +
                              '/card/link/decoded_url',
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
                      if (data10.title !== undefined) {
                        let data14 = data10.title;
                        if (typeof data14 !== 'string' && data14 !== null) {
                          const err32 = {
                            instancePath:
                              instancePath + '/' + i0 + '/card/link/title',
                            schemaPath:
                              '#/items/properties/card/oneOf/0/properties/link/properties/title/type',
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
                  if (data8.media_url !== undefined) {
                    let data15 = data8.media_url;
                    if (typeof data15 === 'string') {
                      if (!formats0(data15)) {
                        const err33 = {
                          instancePath:
                            instancePath + '/' + i0 + '/card/media_url',
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
                        instancePath:
                          instancePath + '/' + i0 + '/card/media_url',
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
                    instancePath: instancePath + '/' + i0 + '/card',
                    schemaPath: '#/items/properties/card/oneOf/0/type',
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
                if (
                  data8 &&
                  typeof data8 == 'object' &&
                  !Array.isArray(data8)
                ) {
                  if (data8.type === undefined) {
                    const err36 = {
                      instancePath: instancePath + '/' + i0 + '/card',
                      schemaPath: '#/items/properties/card/oneOf/1/required',
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
                  if (data8.media_urls === undefined) {
                    const err37 = {
                      instancePath: instancePath + '/' + i0 + '/card',
                      schemaPath: '#/items/properties/card/oneOf/1/required',
                      keyword: 'required',
                      params: { missingProperty: 'media_urls' },
                      message:
                        "must have required property '" + 'media_urls' + "'",
                    };
                    if (vErrors === null) {
                      vErrors = [err37];
                    } else {
                      vErrors.push(err37);
                    }
                    errors++;
                  }
                  for (const key4 in data8) {
                    if (
                      !(
                        key4 === 'type' ||
                        key4 === 'link' ||
                        key4 === 'media_urls'
                      )
                    ) {
                      const err38 = {
                        instancePath: instancePath + '/' + i0 + '/card',
                        schemaPath:
                          '#/items/properties/card/oneOf/1/additionalProperties',
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
                  if (data8.type !== undefined) {
                    let data16 = data8.type;
                    if (typeof data16 !== 'string') {
                      const err39 = {
                        instancePath: instancePath + '/' + i0 + '/card/type',
                        schemaPath:
                          '#/items/properties/card/oneOf/1/properties/type/type',
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
                    if ('carousel' !== data16) {
                      const err40 = {
                        instancePath: instancePath + '/' + i0 + '/card/type',
                        schemaPath:
                          '#/items/properties/card/oneOf/1/properties/type/const',
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
                  if (data8.link !== undefined) {
                    let data17 = data8.link;
                    if (
                      !(
                        data17 &&
                        typeof data17 == 'object' &&
                        !Array.isArray(data17)
                      ) &&
                      data17 !== null
                    ) {
                      const err41 = {
                        instancePath: instancePath + '/' + i0 + '/card/link',
                        schemaPath:
                          '#/items/properties/card/oneOf/1/properties/link/type',
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
                      data17 &&
                      typeof data17 == 'object' &&
                      !Array.isArray(data17)
                    ) {
                      if (data17.url === undefined) {
                        const err42 = {
                          instancePath: instancePath + '/' + i0 + '/card/link',
                          schemaPath:
                            '#/items/properties/card/oneOf/1/properties/link/required',
                          keyword: 'required',
                          params: { missingProperty: 'url' },
                          message:
                            "must have required property '" + 'url' + "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err42];
                        } else {
                          vErrors.push(err42);
                        }
                        errors++;
                      }
                      if (data17.expanded_url === undefined) {
                        const err43 = {
                          instancePath: instancePath + '/' + i0 + '/card/link',
                          schemaPath:
                            '#/items/properties/card/oneOf/1/properties/link/required',
                          keyword: 'required',
                          params: { missingProperty: 'expanded_url' },
                          message:
                            "must have required property '" +
                            'expanded_url' +
                            "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err43];
                        } else {
                          vErrors.push(err43);
                        }
                        errors++;
                      }
                      if (data17.decoded_url === undefined) {
                        const err44 = {
                          instancePath: instancePath + '/' + i0 + '/card/link',
                          schemaPath:
                            '#/items/properties/card/oneOf/1/properties/link/required',
                          keyword: 'required',
                          params: { missingProperty: 'decoded_url' },
                          message:
                            "must have required property '" +
                            'decoded_url' +
                            "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err44];
                        } else {
                          vErrors.push(err44);
                        }
                        errors++;
                      }
                      for (const key5 in data17) {
                        if (
                          !(
                            key5 === 'url' ||
                            key5 === 'expanded_url' ||
                            key5 === 'decoded_url' ||
                            key5 === 'title'
                          )
                        ) {
                          const err45 = {
                            instancePath:
                              instancePath + '/' + i0 + '/card/link',
                            schemaPath:
                              '#/items/properties/card/oneOf/1/properties/link/additionalProperties',
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
                      if (data17.url !== undefined) {
                        let data18 = data17.url;
                        if (typeof data18 === 'string') {
                          if (!formats0(data18)) {
                            const err46 = {
                              instancePath:
                                instancePath + '/' + i0 + '/card/link/url',
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
                            instancePath:
                              instancePath + '/' + i0 + '/card/link/url',
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
                      if (data17.expanded_url !== undefined) {
                        let data19 = data17.expanded_url;
                        if (typeof data19 === 'string') {
                          if (!formats0(data19)) {
                            const err48 = {
                              instancePath:
                                instancePath +
                                '/' +
                                i0 +
                                '/card/link/expanded_url',
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
                            instancePath:
                              instancePath +
                              '/' +
                              i0 +
                              '/card/link/expanded_url',
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
                      if (data17.decoded_url !== undefined) {
                        let data20 = data17.decoded_url;
                        if (typeof data20 === 'string') {
                          if (!formats4(data20)) {
                            const err50 = {
                              instancePath:
                                instancePath +
                                '/' +
                                i0 +
                                '/card/link/decoded_url',
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
                            instancePath:
                              instancePath +
                              '/' +
                              i0 +
                              '/card/link/decoded_url',
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
                      if (data17.title !== undefined) {
                        let data21 = data17.title;
                        if (typeof data21 !== 'string' && data21 !== null) {
                          const err52 = {
                            instancePath:
                              instancePath + '/' + i0 + '/card/link/title',
                            schemaPath:
                              '#/items/properties/card/oneOf/1/properties/link/properties/title/type',
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
                  if (data8.media_urls !== undefined) {
                    let data22 = data8.media_urls;
                    if (Array.isArray(data22)) {
                      const len2 = data22.length;
                      for (let i2 = 0; i2 < len2; i2++) {
                        let data23 = data22[i2];
                        if (typeof data23 === 'string') {
                          if (!formats0(data23)) {
                            const err53 = {
                              instancePath:
                                instancePath +
                                '/' +
                                i0 +
                                '/card/media_urls/' +
                                i2,
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
                            instancePath:
                              instancePath +
                              '/' +
                              i0 +
                              '/card/media_urls/' +
                              i2,
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
                        instancePath:
                          instancePath + '/' + i0 + '/card/media_urls',
                        schemaPath:
                          '#/items/properties/card/oneOf/1/properties/media_urls/type',
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
                    instancePath: instancePath + '/' + i0 + '/card',
                    schemaPath: '#/items/properties/card/oneOf/1/type',
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
                  instancePath: instancePath + '/' + i0 + '/card',
                  schemaPath: '#/items/properties/card/discriminator',
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
                instancePath: instancePath + '/' + i0 + '/card',
                schemaPath: '#/items/properties/card/discriminator',
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
        if (data0.media !== undefined) {
          let data24 = data0.media;
          if (!Array.isArray(data24) && data24 !== null) {
            const err59 = {
              instancePath: instancePath + '/' + i0 + '/media',
              schemaPath: '#/items/properties/media/type',
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
          if (Array.isArray(data24)) {
            const len3 = data24.length;
            for (let i3 = 0; i3 < len3; i3++) {
              let data25 = data24[i3];
              if (
                data25 &&
                typeof data25 == 'object' &&
                !Array.isArray(data25)
              ) {
                if (data25.type === undefined) {
                  const err60 = {
                    instancePath: instancePath + '/' + i0 + '/media/' + i3,
                    schemaPath: '#/items/properties/media/items/required',
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
                const tag1 = data25.type;
                if (typeof tag1 == 'string') {
                  if (tag1 === 'photo') {
                    if (
                      data25 &&
                      typeof data25 == 'object' &&
                      !Array.isArray(data25)
                    ) {
                      if (data25.type === undefined) {
                        const err61 = {
                          instancePath:
                            instancePath + '/' + i0 + '/media/' + i3,
                          schemaPath:
                            '#/items/properties/media/items/oneOf/0/required',
                          keyword: 'required',
                          params: { missingProperty: 'type' },
                          message:
                            "must have required property '" + 'type' + "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err61];
                        } else {
                          vErrors.push(err61);
                        }
                        errors++;
                      }
                      if (data25.url === undefined) {
                        const err62 = {
                          instancePath:
                            instancePath + '/' + i0 + '/media/' + i3,
                          schemaPath:
                            '#/items/properties/media/items/oneOf/0/required',
                          keyword: 'required',
                          params: { missingProperty: 'url' },
                          message:
                            "must have required property '" + 'url' + "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err62];
                        } else {
                          vErrors.push(err62);
                        }
                        errors++;
                      }
                      for (const key6 in data25) {
                        if (!(key6 === 'type' || key6 === 'url')) {
                          const err63 = {
                            instancePath:
                              instancePath + '/' + i0 + '/media/' + i3,
                            schemaPath:
                              '#/items/properties/media/items/oneOf/0/additionalProperties',
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
                      if (data25.type !== undefined) {
                        let data26 = data25.type;
                        if (typeof data26 !== 'string') {
                          const err64 = {
                            instancePath:
                              instancePath +
                              '/' +
                              i0 +
                              '/media/' +
                              i3 +
                              '/type',
                            schemaPath:
                              '#/items/properties/media/items/oneOf/0/properties/type/type',
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
                        if ('photo' !== data26) {
                          const err65 = {
                            instancePath:
                              instancePath +
                              '/' +
                              i0 +
                              '/media/' +
                              i3 +
                              '/type',
                            schemaPath:
                              '#/items/properties/media/items/oneOf/0/properties/type/const',
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
                      if (data25.url !== undefined) {
                        let data27 = data25.url;
                        if (typeof data27 === 'string') {
                          if (!formats0(data27)) {
                            const err66 = {
                              instancePath:
                                instancePath +
                                '/' +
                                i0 +
                                '/media/' +
                                i3 +
                                '/url',
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
                            instancePath:
                              instancePath + '/' + i0 + '/media/' + i3 + '/url',
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
                        instancePath: instancePath + '/' + i0 + '/media/' + i3,
                        schemaPath:
                          '#/items/properties/media/items/oneOf/0/type',
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
                      data25 &&
                      typeof data25 == 'object' &&
                      !Array.isArray(data25)
                    ) {
                      if (data25.type === undefined) {
                        const err69 = {
                          instancePath:
                            instancePath + '/' + i0 + '/media/' + i3,
                          schemaPath:
                            '#/items/properties/media/items/oneOf/1/required',
                          keyword: 'required',
                          params: { missingProperty: 'type' },
                          message:
                            "must have required property '" + 'type' + "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err69];
                        } else {
                          vErrors.push(err69);
                        }
                        errors++;
                      }
                      if (data25.thumbnail === undefined) {
                        const err70 = {
                          instancePath:
                            instancePath + '/' + i0 + '/media/' + i3,
                          schemaPath:
                            '#/items/properties/media/items/oneOf/1/required',
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
                      for (const key7 in data25) {
                        if (!(key7 === 'type' || key7 === 'thumbnail')) {
                          const err71 = {
                            instancePath:
                              instancePath + '/' + i0 + '/media/' + i3,
                            schemaPath:
                              '#/items/properties/media/items/oneOf/1/additionalProperties',
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
                      if (data25.type !== undefined) {
                        let data28 = data25.type;
                        if (typeof data28 !== 'string') {
                          const err72 = {
                            instancePath:
                              instancePath +
                              '/' +
                              i0 +
                              '/media/' +
                              i3 +
                              '/type',
                            schemaPath:
                              '#/items/properties/media/items/oneOf/1/properties/type/type',
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
                        if ('video' !== data28) {
                          const err73 = {
                            instancePath:
                              instancePath +
                              '/' +
                              i0 +
                              '/media/' +
                              i3 +
                              '/type',
                            schemaPath:
                              '#/items/properties/media/items/oneOf/1/properties/type/const',
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
                      if (data25.thumbnail !== undefined) {
                        let data29 = data25.thumbnail;
                        if (typeof data29 === 'string') {
                          if (!formats0(data29)) {
                            const err74 = {
                              instancePath:
                                instancePath +
                                '/' +
                                i0 +
                                '/media/' +
                                i3 +
                                '/thumbnail',
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
                              instancePath +
                              '/' +
                              i0 +
                              '/media/' +
                              i3 +
                              '/thumbnail',
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
                        instancePath: instancePath + '/' + i0 + '/media/' + i3,
                        schemaPath:
                          '#/items/properties/media/items/oneOf/1/type',
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
                      instancePath: instancePath + '/' + i0 + '/media/' + i3,
                      schemaPath:
                        '#/items/properties/media/items/discriminator',
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
                    instancePath: instancePath + '/' + i0 + '/media/' + i3,
                    schemaPath: '#/items/properties/media/items/discriminator',
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
                  instancePath: instancePath + '/' + i0 + '/media/' + i3,
                  schemaPath: '#/items/properties/media/items/type',
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
          instancePath: instancePath + '/' + i0,
          schemaPath: '#/items/type',
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
    }
  } else {
    const err81 = {
      instancePath,
      schemaPath: '#/type',
      keyword: 'type',
      params: { type: 'array' },
      message: 'must be array',
    };
    if (vErrors === null) {
      vErrors = [err81];
    } else {
      vErrors.push(err81);
    }
    errors++;
  }
  validate10.errors = vErrors;
  return errors === 0;
}
