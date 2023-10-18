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
      text: {
        type: 'array',
        items: {
          type: 'object',
          oneOf: [
            {
              type: 'object',
              properties: {
                type: { type: 'string', const: 'text' },
                text: { type: 'string' },
              },
              required: ['type', 'text'],
              additionalProperties: false,
            },
            {
              type: 'object',
              properties: {
                type: { type: 'string', const: 'url' },
                text: { type: 'string' },
                short_url: { $ref: '#/definitions/uri' },
                expanded_url: { $ref: '#/definitions/uri' },
                decoded_url: { $ref: '#/definitions/iri' },
                title: { type: 'string', nullable: true },
              },
              required: [
                'type',
                'text',
                'short_url',
                'expanded_url',
                'decoded_url',
              ],
              additionalProperties: false,
            },
            {
              type: 'object',
              properties: {
                type: { type: 'string', const: 'hashtag' },
                text: { type: 'string' },
                tag: { type: 'string' },
                hashmoji: { type: 'string', nullable: true },
              },
              required: ['type', 'text', 'tag'],
              additionalProperties: false,
            },
            {
              type: 'object',
              properties: {
                type: { type: 'string', const: 'cashtag' },
                text: { type: 'string' },
                tag: { type: 'string' },
              },
              required: ['type', 'text', 'tag'],
              additionalProperties: false,
            },
            {
              type: 'object',
              properties: {
                type: { type: 'string', const: 'mention' },
                text: { type: 'string' },
                username: { type: 'string' },
              },
              required: ['type', 'text', 'username'],
              additionalProperties: false,
            },
          ],
          required: ['type'],
          discriminator: { propertyName: 'type' },
        },
      },
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
  },
};
const schema12 = {
  type: 'object',
  properties: { name: { type: 'string' }, username: { type: 'string' } },
  required: ['name', 'username'],
  additionalProperties: false,
};
const schema13 = { type: 'string', format: 'uri' };
const schema15 = { type: 'string', format: 'iri' };
const formats0 = require('ajv-formats/dist/formats').fullFormats.uri;
const formats4 = require('ajv-formats-draft2019/formats').iri;
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
              let data7 = data6[i1];
              if (data7 && typeof data7 == 'object' && !Array.isArray(data7)) {
                if (data7.type === undefined) {
                  const err13 = {
                    instancePath: instancePath + '/' + i0 + '/text/' + i1,
                    schemaPath: '#/items/properties/text/items/required',
                    keyword: 'required',
                    params: { missingProperty: 'type' },
                    message: "must have required property '" + 'type' + "'",
                  };
                  if (vErrors === null) {
                    vErrors = [err13];
                  } else {
                    vErrors.push(err13);
                  }
                  errors++;
                }
                const tag0 = data7.type;
                if (typeof tag0 == 'string') {
                  if (tag0 === 'text') {
                    if (
                      data7 &&
                      typeof data7 == 'object' &&
                      !Array.isArray(data7)
                    ) {
                      if (data7.type === undefined) {
                        const err14 = {
                          instancePath: instancePath + '/' + i0 + '/text/' + i1,
                          schemaPath:
                            '#/items/properties/text/items/oneOf/0/required',
                          keyword: 'required',
                          params: { missingProperty: 'type' },
                          message:
                            "must have required property '" + 'type' + "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err14];
                        } else {
                          vErrors.push(err14);
                        }
                        errors++;
                      }
                      if (data7.text === undefined) {
                        const err15 = {
                          instancePath: instancePath + '/' + i0 + '/text/' + i1,
                          schemaPath:
                            '#/items/properties/text/items/oneOf/0/required',
                          keyword: 'required',
                          params: { missingProperty: 'text' },
                          message:
                            "must have required property '" + 'text' + "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err15];
                        } else {
                          vErrors.push(err15);
                        }
                        errors++;
                      }
                      for (const key2 in data7) {
                        if (!(key2 === 'type' || key2 === 'text')) {
                          const err16 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1,
                            schemaPath:
                              '#/items/properties/text/items/oneOf/0/additionalProperties',
                            keyword: 'additionalProperties',
                            params: { additionalProperty: key2 },
                            message: 'must NOT have additional properties',
                          };
                          if (vErrors === null) {
                            vErrors = [err16];
                          } else {
                            vErrors.push(err16);
                          }
                          errors++;
                        }
                      }
                      if (data7.type !== undefined) {
                        let data8 = data7.type;
                        if (typeof data8 !== 'string') {
                          const err17 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1 + '/type',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/0/properties/type/type',
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
                        if ('text' !== data8) {
                          const err18 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1 + '/type',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/0/properties/type/const',
                            keyword: 'const',
                            params: { allowedValue: 'text' },
                            message: 'must be equal to constant',
                          };
                          if (vErrors === null) {
                            vErrors = [err18];
                          } else {
                            vErrors.push(err18);
                          }
                          errors++;
                        }
                      }
                      if (data7.text !== undefined) {
                        if (typeof data7.text !== 'string') {
                          const err19 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1 + '/text',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/0/properties/text/type',
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
                      }
                    } else {
                      const err20 = {
                        instancePath: instancePath + '/' + i0 + '/text/' + i1,
                        schemaPath:
                          '#/items/properties/text/items/oneOf/0/type',
                        keyword: 'type',
                        params: { type: 'object' },
                        message: 'must be object',
                      };
                      if (vErrors === null) {
                        vErrors = [err20];
                      } else {
                        vErrors.push(err20);
                      }
                      errors++;
                    }
                  } else if (tag0 === 'url') {
                    if (
                      data7 &&
                      typeof data7 == 'object' &&
                      !Array.isArray(data7)
                    ) {
                      if (data7.type === undefined) {
                        const err21 = {
                          instancePath: instancePath + '/' + i0 + '/text/' + i1,
                          schemaPath:
                            '#/items/properties/text/items/oneOf/1/required',
                          keyword: 'required',
                          params: { missingProperty: 'type' },
                          message:
                            "must have required property '" + 'type' + "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err21];
                        } else {
                          vErrors.push(err21);
                        }
                        errors++;
                      }
                      if (data7.text === undefined) {
                        const err22 = {
                          instancePath: instancePath + '/' + i0 + '/text/' + i1,
                          schemaPath:
                            '#/items/properties/text/items/oneOf/1/required',
                          keyword: 'required',
                          params: { missingProperty: 'text' },
                          message:
                            "must have required property '" + 'text' + "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err22];
                        } else {
                          vErrors.push(err22);
                        }
                        errors++;
                      }
                      if (data7.short_url === undefined) {
                        const err23 = {
                          instancePath: instancePath + '/' + i0 + '/text/' + i1,
                          schemaPath:
                            '#/items/properties/text/items/oneOf/1/required',
                          keyword: 'required',
                          params: { missingProperty: 'short_url' },
                          message:
                            "must have required property '" + 'short_url' + "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err23];
                        } else {
                          vErrors.push(err23);
                        }
                        errors++;
                      }
                      if (data7.expanded_url === undefined) {
                        const err24 = {
                          instancePath: instancePath + '/' + i0 + '/text/' + i1,
                          schemaPath:
                            '#/items/properties/text/items/oneOf/1/required',
                          keyword: 'required',
                          params: { missingProperty: 'expanded_url' },
                          message:
                            "must have required property '" +
                            'expanded_url' +
                            "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err24];
                        } else {
                          vErrors.push(err24);
                        }
                        errors++;
                      }
                      if (data7.decoded_url === undefined) {
                        const err25 = {
                          instancePath: instancePath + '/' + i0 + '/text/' + i1,
                          schemaPath:
                            '#/items/properties/text/items/oneOf/1/required',
                          keyword: 'required',
                          params: { missingProperty: 'decoded_url' },
                          message:
                            "must have required property '" +
                            'decoded_url' +
                            "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err25];
                        } else {
                          vErrors.push(err25);
                        }
                        errors++;
                      }
                      for (const key3 in data7) {
                        if (
                          !(
                            key3 === 'type' ||
                            key3 === 'text' ||
                            key3 === 'short_url' ||
                            key3 === 'expanded_url' ||
                            key3 === 'decoded_url' ||
                            key3 === 'title'
                          )
                        ) {
                          const err26 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1,
                            schemaPath:
                              '#/items/properties/text/items/oneOf/1/additionalProperties',
                            keyword: 'additionalProperties',
                            params: { additionalProperty: key3 },
                            message: 'must NOT have additional properties',
                          };
                          if (vErrors === null) {
                            vErrors = [err26];
                          } else {
                            vErrors.push(err26);
                          }
                          errors++;
                        }
                      }
                      if (data7.type !== undefined) {
                        let data10 = data7.type;
                        if (typeof data10 !== 'string') {
                          const err27 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1 + '/type',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/1/properties/type/type',
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
                        if ('url' !== data10) {
                          const err28 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1 + '/type',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/1/properties/type/const',
                            keyword: 'const',
                            params: { allowedValue: 'url' },
                            message: 'must be equal to constant',
                          };
                          if (vErrors === null) {
                            vErrors = [err28];
                          } else {
                            vErrors.push(err28);
                          }
                          errors++;
                        }
                      }
                      if (data7.text !== undefined) {
                        if (typeof data7.text !== 'string') {
                          const err29 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1 + '/text',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/1/properties/text/type',
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
                      if (data7.short_url !== undefined) {
                        let data12 = data7.short_url;
                        if (typeof data12 === 'string') {
                          if (!formats0(data12)) {
                            const err30 = {
                              instancePath:
                                instancePath +
                                '/' +
                                i0 +
                                '/text/' +
                                i1 +
                                '/short_url',
                              schemaPath: '#/definitions/uri/format',
                              keyword: 'format',
                              params: { format: 'uri' },
                              message: 'must match format "' + 'uri' + '"',
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
                              '/text/' +
                              i1 +
                              '/short_url',
                            schemaPath: '#/definitions/uri/type',
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
                      if (data7.expanded_url !== undefined) {
                        let data13 = data7.expanded_url;
                        if (typeof data13 === 'string') {
                          if (!formats0(data13)) {
                            const err32 = {
                              instancePath:
                                instancePath +
                                '/' +
                                i0 +
                                '/text/' +
                                i1 +
                                '/expanded_url',
                              schemaPath: '#/definitions/uri/format',
                              keyword: 'format',
                              params: { format: 'uri' },
                              message: 'must match format "' + 'uri' + '"',
                            };
                            if (vErrors === null) {
                              vErrors = [err32];
                            } else {
                              vErrors.push(err32);
                            }
                            errors++;
                          }
                        } else {
                          const err33 = {
                            instancePath:
                              instancePath +
                              '/' +
                              i0 +
                              '/text/' +
                              i1 +
                              '/expanded_url',
                            schemaPath: '#/definitions/uri/type',
                            keyword: 'type',
                            params: { type: 'string' },
                            message: 'must be string',
                          };
                          if (vErrors === null) {
                            vErrors = [err33];
                          } else {
                            vErrors.push(err33);
                          }
                          errors++;
                        }
                      }
                      if (data7.decoded_url !== undefined) {
                        let data14 = data7.decoded_url;
                        if (typeof data14 === 'string') {
                          if (!formats4(data14)) {
                            const err34 = {
                              instancePath:
                                instancePath +
                                '/' +
                                i0 +
                                '/text/' +
                                i1 +
                                '/decoded_url',
                              schemaPath: '#/definitions/iri/format',
                              keyword: 'format',
                              params: { format: 'iri' },
                              message: 'must match format "' + 'iri' + '"',
                            };
                            if (vErrors === null) {
                              vErrors = [err34];
                            } else {
                              vErrors.push(err34);
                            }
                            errors++;
                          }
                        } else {
                          const err35 = {
                            instancePath:
                              instancePath +
                              '/' +
                              i0 +
                              '/text/' +
                              i1 +
                              '/decoded_url',
                            schemaPath: '#/definitions/iri/type',
                            keyword: 'type',
                            params: { type: 'string' },
                            message: 'must be string',
                          };
                          if (vErrors === null) {
                            vErrors = [err35];
                          } else {
                            vErrors.push(err35);
                          }
                          errors++;
                        }
                      }
                      if (data7.title !== undefined) {
                        let data15 = data7.title;
                        if (typeof data15 !== 'string' && data15 !== null) {
                          const err36 = {
                            instancePath:
                              instancePath +
                              '/' +
                              i0 +
                              '/text/' +
                              i1 +
                              '/title',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/1/properties/title/type',
                            keyword: 'type',
                            params: { type: 'string' },
                            message: 'must be string',
                          };
                          if (vErrors === null) {
                            vErrors = [err36];
                          } else {
                            vErrors.push(err36);
                          }
                          errors++;
                        }
                      }
                    } else {
                      const err37 = {
                        instancePath: instancePath + '/' + i0 + '/text/' + i1,
                        schemaPath:
                          '#/items/properties/text/items/oneOf/1/type',
                        keyword: 'type',
                        params: { type: 'object' },
                        message: 'must be object',
                      };
                      if (vErrors === null) {
                        vErrors = [err37];
                      } else {
                        vErrors.push(err37);
                      }
                      errors++;
                    }
                  } else if (tag0 === 'hashtag') {
                    if (
                      data7 &&
                      typeof data7 == 'object' &&
                      !Array.isArray(data7)
                    ) {
                      if (data7.type === undefined) {
                        const err38 = {
                          instancePath: instancePath + '/' + i0 + '/text/' + i1,
                          schemaPath:
                            '#/items/properties/text/items/oneOf/2/required',
                          keyword: 'required',
                          params: { missingProperty: 'type' },
                          message:
                            "must have required property '" + 'type' + "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err38];
                        } else {
                          vErrors.push(err38);
                        }
                        errors++;
                      }
                      if (data7.text === undefined) {
                        const err39 = {
                          instancePath: instancePath + '/' + i0 + '/text/' + i1,
                          schemaPath:
                            '#/items/properties/text/items/oneOf/2/required',
                          keyword: 'required',
                          params: { missingProperty: 'text' },
                          message:
                            "must have required property '" + 'text' + "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err39];
                        } else {
                          vErrors.push(err39);
                        }
                        errors++;
                      }
                      if (data7.tag === undefined) {
                        const err40 = {
                          instancePath: instancePath + '/' + i0 + '/text/' + i1,
                          schemaPath:
                            '#/items/properties/text/items/oneOf/2/required',
                          keyword: 'required',
                          params: { missingProperty: 'tag' },
                          message:
                            "must have required property '" + 'tag' + "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err40];
                        } else {
                          vErrors.push(err40);
                        }
                        errors++;
                      }
                      for (const key4 in data7) {
                        if (
                          !(
                            key4 === 'type' ||
                            key4 === 'text' ||
                            key4 === 'tag' ||
                            key4 === 'hashmoji'
                          )
                        ) {
                          const err41 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1,
                            schemaPath:
                              '#/items/properties/text/items/oneOf/2/additionalProperties',
                            keyword: 'additionalProperties',
                            params: { additionalProperty: key4 },
                            message: 'must NOT have additional properties',
                          };
                          if (vErrors === null) {
                            vErrors = [err41];
                          } else {
                            vErrors.push(err41);
                          }
                          errors++;
                        }
                      }
                      if (data7.type !== undefined) {
                        let data16 = data7.type;
                        if (typeof data16 !== 'string') {
                          const err42 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1 + '/type',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/2/properties/type/type',
                            keyword: 'type',
                            params: { type: 'string' },
                            message: 'must be string',
                          };
                          if (vErrors === null) {
                            vErrors = [err42];
                          } else {
                            vErrors.push(err42);
                          }
                          errors++;
                        }
                        if ('hashtag' !== data16) {
                          const err43 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1 + '/type',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/2/properties/type/const',
                            keyword: 'const',
                            params: { allowedValue: 'hashtag' },
                            message: 'must be equal to constant',
                          };
                          if (vErrors === null) {
                            vErrors = [err43];
                          } else {
                            vErrors.push(err43);
                          }
                          errors++;
                        }
                      }
                      if (data7.text !== undefined) {
                        if (typeof data7.text !== 'string') {
                          const err44 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1 + '/text',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/2/properties/text/type',
                            keyword: 'type',
                            params: { type: 'string' },
                            message: 'must be string',
                          };
                          if (vErrors === null) {
                            vErrors = [err44];
                          } else {
                            vErrors.push(err44);
                          }
                          errors++;
                        }
                      }
                      if (data7.tag !== undefined) {
                        if (typeof data7.tag !== 'string') {
                          const err45 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1 + '/tag',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/2/properties/tag/type',
                            keyword: 'type',
                            params: { type: 'string' },
                            message: 'must be string',
                          };
                          if (vErrors === null) {
                            vErrors = [err45];
                          } else {
                            vErrors.push(err45);
                          }
                          errors++;
                        }
                      }
                      if (data7.hashmoji !== undefined) {
                        let data19 = data7.hashmoji;
                        if (typeof data19 !== 'string' && data19 !== null) {
                          const err46 = {
                            instancePath:
                              instancePath +
                              '/' +
                              i0 +
                              '/text/' +
                              i1 +
                              '/hashmoji',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/2/properties/hashmoji/type',
                            keyword: 'type',
                            params: { type: 'string' },
                            message: 'must be string',
                          };
                          if (vErrors === null) {
                            vErrors = [err46];
                          } else {
                            vErrors.push(err46);
                          }
                          errors++;
                        }
                      }
                    } else {
                      const err47 = {
                        instancePath: instancePath + '/' + i0 + '/text/' + i1,
                        schemaPath:
                          '#/items/properties/text/items/oneOf/2/type',
                        keyword: 'type',
                        params: { type: 'object' },
                        message: 'must be object',
                      };
                      if (vErrors === null) {
                        vErrors = [err47];
                      } else {
                        vErrors.push(err47);
                      }
                      errors++;
                    }
                  } else if (tag0 === 'cashtag') {
                    if (
                      data7 &&
                      typeof data7 == 'object' &&
                      !Array.isArray(data7)
                    ) {
                      if (data7.type === undefined) {
                        const err48 = {
                          instancePath: instancePath + '/' + i0 + '/text/' + i1,
                          schemaPath:
                            '#/items/properties/text/items/oneOf/3/required',
                          keyword: 'required',
                          params: { missingProperty: 'type' },
                          message:
                            "must have required property '" + 'type' + "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err48];
                        } else {
                          vErrors.push(err48);
                        }
                        errors++;
                      }
                      if (data7.text === undefined) {
                        const err49 = {
                          instancePath: instancePath + '/' + i0 + '/text/' + i1,
                          schemaPath:
                            '#/items/properties/text/items/oneOf/3/required',
                          keyword: 'required',
                          params: { missingProperty: 'text' },
                          message:
                            "must have required property '" + 'text' + "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err49];
                        } else {
                          vErrors.push(err49);
                        }
                        errors++;
                      }
                      if (data7.tag === undefined) {
                        const err50 = {
                          instancePath: instancePath + '/' + i0 + '/text/' + i1,
                          schemaPath:
                            '#/items/properties/text/items/oneOf/3/required',
                          keyword: 'required',
                          params: { missingProperty: 'tag' },
                          message:
                            "must have required property '" + 'tag' + "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err50];
                        } else {
                          vErrors.push(err50);
                        }
                        errors++;
                      }
                      for (const key5 in data7) {
                        if (
                          !(
                            key5 === 'type' ||
                            key5 === 'text' ||
                            key5 === 'tag'
                          )
                        ) {
                          const err51 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1,
                            schemaPath:
                              '#/items/properties/text/items/oneOf/3/additionalProperties',
                            keyword: 'additionalProperties',
                            params: { additionalProperty: key5 },
                            message: 'must NOT have additional properties',
                          };
                          if (vErrors === null) {
                            vErrors = [err51];
                          } else {
                            vErrors.push(err51);
                          }
                          errors++;
                        }
                      }
                      if (data7.type !== undefined) {
                        let data20 = data7.type;
                        if (typeof data20 !== 'string') {
                          const err52 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1 + '/type',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/3/properties/type/type',
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
                        if ('cashtag' !== data20) {
                          const err53 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1 + '/type',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/3/properties/type/const',
                            keyword: 'const',
                            params: { allowedValue: 'cashtag' },
                            message: 'must be equal to constant',
                          };
                          if (vErrors === null) {
                            vErrors = [err53];
                          } else {
                            vErrors.push(err53);
                          }
                          errors++;
                        }
                      }
                      if (data7.text !== undefined) {
                        if (typeof data7.text !== 'string') {
                          const err54 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1 + '/text',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/3/properties/text/type',
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
                      if (data7.tag !== undefined) {
                        if (typeof data7.tag !== 'string') {
                          const err55 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1 + '/tag',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/3/properties/tag/type',
                            keyword: 'type',
                            params: { type: 'string' },
                            message: 'must be string',
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
                        instancePath: instancePath + '/' + i0 + '/text/' + i1,
                        schemaPath:
                          '#/items/properties/text/items/oneOf/3/type',
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
                  } else if (tag0 === 'mention') {
                    if (
                      data7 &&
                      typeof data7 == 'object' &&
                      !Array.isArray(data7)
                    ) {
                      if (data7.type === undefined) {
                        const err57 = {
                          instancePath: instancePath + '/' + i0 + '/text/' + i1,
                          schemaPath:
                            '#/items/properties/text/items/oneOf/4/required',
                          keyword: 'required',
                          params: { missingProperty: 'type' },
                          message:
                            "must have required property '" + 'type' + "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err57];
                        } else {
                          vErrors.push(err57);
                        }
                        errors++;
                      }
                      if (data7.text === undefined) {
                        const err58 = {
                          instancePath: instancePath + '/' + i0 + '/text/' + i1,
                          schemaPath:
                            '#/items/properties/text/items/oneOf/4/required',
                          keyword: 'required',
                          params: { missingProperty: 'text' },
                          message:
                            "must have required property '" + 'text' + "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err58];
                        } else {
                          vErrors.push(err58);
                        }
                        errors++;
                      }
                      if (data7.username === undefined) {
                        const err59 = {
                          instancePath: instancePath + '/' + i0 + '/text/' + i1,
                          schemaPath:
                            '#/items/properties/text/items/oneOf/4/required',
                          keyword: 'required',
                          params: { missingProperty: 'username' },
                          message:
                            "must have required property '" + 'username' + "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err59];
                        } else {
                          vErrors.push(err59);
                        }
                        errors++;
                      }
                      for (const key6 in data7) {
                        if (
                          !(
                            key6 === 'type' ||
                            key6 === 'text' ||
                            key6 === 'username'
                          )
                        ) {
                          const err60 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1,
                            schemaPath:
                              '#/items/properties/text/items/oneOf/4/additionalProperties',
                            keyword: 'additionalProperties',
                            params: { additionalProperty: key6 },
                            message: 'must NOT have additional properties',
                          };
                          if (vErrors === null) {
                            vErrors = [err60];
                          } else {
                            vErrors.push(err60);
                          }
                          errors++;
                        }
                      }
                      if (data7.type !== undefined) {
                        let data23 = data7.type;
                        if (typeof data23 !== 'string') {
                          const err61 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1 + '/type',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/4/properties/type/type',
                            keyword: 'type',
                            params: { type: 'string' },
                            message: 'must be string',
                          };
                          if (vErrors === null) {
                            vErrors = [err61];
                          } else {
                            vErrors.push(err61);
                          }
                          errors++;
                        }
                        if ('mention' !== data23) {
                          const err62 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1 + '/type',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/4/properties/type/const',
                            keyword: 'const',
                            params: { allowedValue: 'mention' },
                            message: 'must be equal to constant',
                          };
                          if (vErrors === null) {
                            vErrors = [err62];
                          } else {
                            vErrors.push(err62);
                          }
                          errors++;
                        }
                      }
                      if (data7.text !== undefined) {
                        if (typeof data7.text !== 'string') {
                          const err63 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1 + '/text',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/4/properties/text/type',
                            keyword: 'type',
                            params: { type: 'string' },
                            message: 'must be string',
                          };
                          if (vErrors === null) {
                            vErrors = [err63];
                          } else {
                            vErrors.push(err63);
                          }
                          errors++;
                        }
                      }
                      if (data7.username !== undefined) {
                        if (typeof data7.username !== 'string') {
                          const err64 = {
                            instancePath:
                              instancePath +
                              '/' +
                              i0 +
                              '/text/' +
                              i1 +
                              '/username',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/4/properties/username/type',
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
                      }
                    } else {
                      const err65 = {
                        instancePath: instancePath + '/' + i0 + '/text/' + i1,
                        schemaPath:
                          '#/items/properties/text/items/oneOf/4/type',
                        keyword: 'type',
                        params: { type: 'object' },
                        message: 'must be object',
                      };
                      if (vErrors === null) {
                        vErrors = [err65];
                      } else {
                        vErrors.push(err65);
                      }
                      errors++;
                    }
                  } else {
                    const err66 = {
                      instancePath: instancePath + '/' + i0 + '/text/' + i1,
                      schemaPath: '#/items/properties/text/items/discriminator',
                      keyword: 'discriminator',
                      params: { error: 'mapping', tag: 'type', tagValue: tag0 },
                      message: 'value of tag "type" must be in oneOf',
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
                    instancePath: instancePath + '/' + i0 + '/text/' + i1,
                    schemaPath: '#/items/properties/text/items/discriminator',
                    keyword: 'discriminator',
                    params: { error: 'tag', tag: 'type', tagValue: tag0 },
                    message: 'tag "type" must be string',
                  };
                  if (vErrors === null) {
                    vErrors = [err67];
                  } else {
                    vErrors.push(err67);
                  }
                  errors++;
                }
              } else {
                const err68 = {
                  instancePath: instancePath + '/' + i0 + '/text/' + i1,
                  schemaPath: '#/items/properties/text/items/type',
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
            }
          } else {
            const err69 = {
              instancePath: instancePath + '/' + i0 + '/text',
              schemaPath: '#/items/properties/text/type',
              keyword: 'type',
              params: { type: 'array' },
              message: 'must be array',
            };
            if (vErrors === null) {
              vErrors = [err69];
            } else {
              vErrors.push(err69);
            }
            errors++;
          }
        }
        if (data0.card !== undefined) {
          let data26 = data0.card;
          if (
            !(data26 && typeof data26 == 'object' && !Array.isArray(data26)) &&
            data26 !== null
          ) {
            const err70 = {
              instancePath: instancePath + '/' + i0 + '/card',
              schemaPath: '#/items/properties/card/type',
              keyword: 'type',
              params: { type: 'object' },
              message: 'must be object',
            };
            if (vErrors === null) {
              vErrors = [err70];
            } else {
              vErrors.push(err70);
            }
            errors++;
          }
          if (data26 && typeof data26 == 'object' && !Array.isArray(data26)) {
            if (data26.type === undefined) {
              const err71 = {
                instancePath: instancePath + '/' + i0 + '/card',
                schemaPath: '#/items/properties/card/required',
                keyword: 'required',
                params: { missingProperty: 'type' },
                message: "must have required property '" + 'type' + "'",
              };
              if (vErrors === null) {
                vErrors = [err71];
              } else {
                vErrors.push(err71);
              }
              errors++;
            }
            const tag1 = data26.type;
            if (typeof tag1 == 'string') {
              if (tag1 === 'single') {
                if (
                  data26 &&
                  typeof data26 == 'object' &&
                  !Array.isArray(data26)
                ) {
                  if (data26.type === undefined) {
                    const err72 = {
                      instancePath: instancePath + '/' + i0 + '/card',
                      schemaPath: '#/items/properties/card/oneOf/0/required',
                      keyword: 'required',
                      params: { missingProperty: 'type' },
                      message: "must have required property '" + 'type' + "'",
                    };
                    if (vErrors === null) {
                      vErrors = [err72];
                    } else {
                      vErrors.push(err72);
                    }
                    errors++;
                  }
                  if (data26.media_url === undefined) {
                    const err73 = {
                      instancePath: instancePath + '/' + i0 + '/card',
                      schemaPath: '#/items/properties/card/oneOf/0/required',
                      keyword: 'required',
                      params: { missingProperty: 'media_url' },
                      message:
                        "must have required property '" + 'media_url' + "'",
                    };
                    if (vErrors === null) {
                      vErrors = [err73];
                    } else {
                      vErrors.push(err73);
                    }
                    errors++;
                  }
                  for (const key7 in data26) {
                    if (
                      !(
                        key7 === 'type' ||
                        key7 === 'link' ||
                        key7 === 'media_url'
                      )
                    ) {
                      const err74 = {
                        instancePath: instancePath + '/' + i0 + '/card',
                        schemaPath:
                          '#/items/properties/card/oneOf/0/additionalProperties',
                        keyword: 'additionalProperties',
                        params: { additionalProperty: key7 },
                        message: 'must NOT have additional properties',
                      };
                      if (vErrors === null) {
                        vErrors = [err74];
                      } else {
                        vErrors.push(err74);
                      }
                      errors++;
                    }
                  }
                  if (data26.type !== undefined) {
                    let data27 = data26.type;
                    if (typeof data27 !== 'string') {
                      const err75 = {
                        instancePath: instancePath + '/' + i0 + '/card/type',
                        schemaPath:
                          '#/items/properties/card/oneOf/0/properties/type/type',
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
                    if ('single' !== data27) {
                      const err76 = {
                        instancePath: instancePath + '/' + i0 + '/card/type',
                        schemaPath:
                          '#/items/properties/card/oneOf/0/properties/type/const',
                        keyword: 'const',
                        params: { allowedValue: 'single' },
                        message: 'must be equal to constant',
                      };
                      if (vErrors === null) {
                        vErrors = [err76];
                      } else {
                        vErrors.push(err76);
                      }
                      errors++;
                    }
                  }
                  if (data26.link !== undefined) {
                    let data28 = data26.link;
                    if (
                      !(
                        data28 &&
                        typeof data28 == 'object' &&
                        !Array.isArray(data28)
                      ) &&
                      data28 !== null
                    ) {
                      const err77 = {
                        instancePath: instancePath + '/' + i0 + '/card/link',
                        schemaPath:
                          '#/items/properties/card/oneOf/0/properties/link/type',
                        keyword: 'type',
                        params: { type: 'object' },
                        message: 'must be object',
                      };
                      if (vErrors === null) {
                        vErrors = [err77];
                      } else {
                        vErrors.push(err77);
                      }
                      errors++;
                    }
                    if (
                      data28 &&
                      typeof data28 == 'object' &&
                      !Array.isArray(data28)
                    ) {
                      if (data28.url === undefined) {
                        const err78 = {
                          instancePath: instancePath + '/' + i0 + '/card/link',
                          schemaPath:
                            '#/items/properties/card/oneOf/0/properties/link/required',
                          keyword: 'required',
                          params: { missingProperty: 'url' },
                          message:
                            "must have required property '" + 'url' + "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err78];
                        } else {
                          vErrors.push(err78);
                        }
                        errors++;
                      }
                      if (data28.expanded_url === undefined) {
                        const err79 = {
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
                          vErrors = [err79];
                        } else {
                          vErrors.push(err79);
                        }
                        errors++;
                      }
                      if (data28.decoded_url === undefined) {
                        const err80 = {
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
                          vErrors = [err80];
                        } else {
                          vErrors.push(err80);
                        }
                        errors++;
                      }
                      for (const key8 in data28) {
                        if (
                          !(
                            key8 === 'url' ||
                            key8 === 'expanded_url' ||
                            key8 === 'decoded_url' ||
                            key8 === 'title'
                          )
                        ) {
                          const err81 = {
                            instancePath:
                              instancePath + '/' + i0 + '/card/link',
                            schemaPath:
                              '#/items/properties/card/oneOf/0/properties/link/additionalProperties',
                            keyword: 'additionalProperties',
                            params: { additionalProperty: key8 },
                            message: 'must NOT have additional properties',
                          };
                          if (vErrors === null) {
                            vErrors = [err81];
                          } else {
                            vErrors.push(err81);
                          }
                          errors++;
                        }
                      }
                      if (data28.url !== undefined) {
                        let data29 = data28.url;
                        if (typeof data29 === 'string') {
                          if (!formats0(data29)) {
                            const err82 = {
                              instancePath:
                                instancePath + '/' + i0 + '/card/link/url',
                              schemaPath: '#/definitions/uri/format',
                              keyword: 'format',
                              params: { format: 'uri' },
                              message: 'must match format "' + 'uri' + '"',
                            };
                            if (vErrors === null) {
                              vErrors = [err82];
                            } else {
                              vErrors.push(err82);
                            }
                            errors++;
                          }
                        } else {
                          const err83 = {
                            instancePath:
                              instancePath + '/' + i0 + '/card/link/url',
                            schemaPath: '#/definitions/uri/type',
                            keyword: 'type',
                            params: { type: 'string' },
                            message: 'must be string',
                          };
                          if (vErrors === null) {
                            vErrors = [err83];
                          } else {
                            vErrors.push(err83);
                          }
                          errors++;
                        }
                      }
                      if (data28.expanded_url !== undefined) {
                        let data30 = data28.expanded_url;
                        if (typeof data30 === 'string') {
                          if (!formats0(data30)) {
                            const err84 = {
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
                              vErrors = [err84];
                            } else {
                              vErrors.push(err84);
                            }
                            errors++;
                          }
                        } else {
                          const err85 = {
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
                            vErrors = [err85];
                          } else {
                            vErrors.push(err85);
                          }
                          errors++;
                        }
                      }
                      if (data28.decoded_url !== undefined) {
                        let data31 = data28.decoded_url;
                        if (typeof data31 === 'string') {
                          if (!formats4(data31)) {
                            const err86 = {
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
                              vErrors = [err86];
                            } else {
                              vErrors.push(err86);
                            }
                            errors++;
                          }
                        } else {
                          const err87 = {
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
                            vErrors = [err87];
                          } else {
                            vErrors.push(err87);
                          }
                          errors++;
                        }
                      }
                      if (data28.title !== undefined) {
                        let data32 = data28.title;
                        if (typeof data32 !== 'string' && data32 !== null) {
                          const err88 = {
                            instancePath:
                              instancePath + '/' + i0 + '/card/link/title',
                            schemaPath:
                              '#/items/properties/card/oneOf/0/properties/link/properties/title/type',
                            keyword: 'type',
                            params: { type: 'string' },
                            message: 'must be string',
                          };
                          if (vErrors === null) {
                            vErrors = [err88];
                          } else {
                            vErrors.push(err88);
                          }
                          errors++;
                        }
                      }
                    }
                  }
                  if (data26.media_url !== undefined) {
                    let data33 = data26.media_url;
                    if (typeof data33 === 'string') {
                      if (!formats0(data33)) {
                        const err89 = {
                          instancePath:
                            instancePath + '/' + i0 + '/card/media_url',
                          schemaPath: '#/definitions/uri/format',
                          keyword: 'format',
                          params: { format: 'uri' },
                          message: 'must match format "' + 'uri' + '"',
                        };
                        if (vErrors === null) {
                          vErrors = [err89];
                        } else {
                          vErrors.push(err89);
                        }
                        errors++;
                      }
                    } else {
                      const err90 = {
                        instancePath:
                          instancePath + '/' + i0 + '/card/media_url',
                        schemaPath: '#/definitions/uri/type',
                        keyword: 'type',
                        params: { type: 'string' },
                        message: 'must be string',
                      };
                      if (vErrors === null) {
                        vErrors = [err90];
                      } else {
                        vErrors.push(err90);
                      }
                      errors++;
                    }
                  }
                } else {
                  const err91 = {
                    instancePath: instancePath + '/' + i0 + '/card',
                    schemaPath: '#/items/properties/card/oneOf/0/type',
                    keyword: 'type',
                    params: { type: 'object' },
                    message: 'must be object',
                  };
                  if (vErrors === null) {
                    vErrors = [err91];
                  } else {
                    vErrors.push(err91);
                  }
                  errors++;
                }
              } else if (tag1 === 'carousel') {
                if (
                  data26 &&
                  typeof data26 == 'object' &&
                  !Array.isArray(data26)
                ) {
                  if (data26.type === undefined) {
                    const err92 = {
                      instancePath: instancePath + '/' + i0 + '/card',
                      schemaPath: '#/items/properties/card/oneOf/1/required',
                      keyword: 'required',
                      params: { missingProperty: 'type' },
                      message: "must have required property '" + 'type' + "'",
                    };
                    if (vErrors === null) {
                      vErrors = [err92];
                    } else {
                      vErrors.push(err92);
                    }
                    errors++;
                  }
                  if (data26.media_urls === undefined) {
                    const err93 = {
                      instancePath: instancePath + '/' + i0 + '/card',
                      schemaPath: '#/items/properties/card/oneOf/1/required',
                      keyword: 'required',
                      params: { missingProperty: 'media_urls' },
                      message:
                        "must have required property '" + 'media_urls' + "'",
                    };
                    if (vErrors === null) {
                      vErrors = [err93];
                    } else {
                      vErrors.push(err93);
                    }
                    errors++;
                  }
                  for (const key9 in data26) {
                    if (
                      !(
                        key9 === 'type' ||
                        key9 === 'link' ||
                        key9 === 'media_urls'
                      )
                    ) {
                      const err94 = {
                        instancePath: instancePath + '/' + i0 + '/card',
                        schemaPath:
                          '#/items/properties/card/oneOf/1/additionalProperties',
                        keyword: 'additionalProperties',
                        params: { additionalProperty: key9 },
                        message: 'must NOT have additional properties',
                      };
                      if (vErrors === null) {
                        vErrors = [err94];
                      } else {
                        vErrors.push(err94);
                      }
                      errors++;
                    }
                  }
                  if (data26.type !== undefined) {
                    let data34 = data26.type;
                    if (typeof data34 !== 'string') {
                      const err95 = {
                        instancePath: instancePath + '/' + i0 + '/card/type',
                        schemaPath:
                          '#/items/properties/card/oneOf/1/properties/type/type',
                        keyword: 'type',
                        params: { type: 'string' },
                        message: 'must be string',
                      };
                      if (vErrors === null) {
                        vErrors = [err95];
                      } else {
                        vErrors.push(err95);
                      }
                      errors++;
                    }
                    if ('carousel' !== data34) {
                      const err96 = {
                        instancePath: instancePath + '/' + i0 + '/card/type',
                        schemaPath:
                          '#/items/properties/card/oneOf/1/properties/type/const',
                        keyword: 'const',
                        params: { allowedValue: 'carousel' },
                        message: 'must be equal to constant',
                      };
                      if (vErrors === null) {
                        vErrors = [err96];
                      } else {
                        vErrors.push(err96);
                      }
                      errors++;
                    }
                  }
                  if (data26.link !== undefined) {
                    let data35 = data26.link;
                    if (
                      !(
                        data35 &&
                        typeof data35 == 'object' &&
                        !Array.isArray(data35)
                      ) &&
                      data35 !== null
                    ) {
                      const err97 = {
                        instancePath: instancePath + '/' + i0 + '/card/link',
                        schemaPath:
                          '#/items/properties/card/oneOf/1/properties/link/type',
                        keyword: 'type',
                        params: { type: 'object' },
                        message: 'must be object',
                      };
                      if (vErrors === null) {
                        vErrors = [err97];
                      } else {
                        vErrors.push(err97);
                      }
                      errors++;
                    }
                    if (
                      data35 &&
                      typeof data35 == 'object' &&
                      !Array.isArray(data35)
                    ) {
                      if (data35.url === undefined) {
                        const err98 = {
                          instancePath: instancePath + '/' + i0 + '/card/link',
                          schemaPath:
                            '#/items/properties/card/oneOf/1/properties/link/required',
                          keyword: 'required',
                          params: { missingProperty: 'url' },
                          message:
                            "must have required property '" + 'url' + "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err98];
                        } else {
                          vErrors.push(err98);
                        }
                        errors++;
                      }
                      if (data35.expanded_url === undefined) {
                        const err99 = {
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
                          vErrors = [err99];
                        } else {
                          vErrors.push(err99);
                        }
                        errors++;
                      }
                      if (data35.decoded_url === undefined) {
                        const err100 = {
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
                          vErrors = [err100];
                        } else {
                          vErrors.push(err100);
                        }
                        errors++;
                      }
                      for (const key10 in data35) {
                        if (
                          !(
                            key10 === 'url' ||
                            key10 === 'expanded_url' ||
                            key10 === 'decoded_url' ||
                            key10 === 'title'
                          )
                        ) {
                          const err101 = {
                            instancePath:
                              instancePath + '/' + i0 + '/card/link',
                            schemaPath:
                              '#/items/properties/card/oneOf/1/properties/link/additionalProperties',
                            keyword: 'additionalProperties',
                            params: { additionalProperty: key10 },
                            message: 'must NOT have additional properties',
                          };
                          if (vErrors === null) {
                            vErrors = [err101];
                          } else {
                            vErrors.push(err101);
                          }
                          errors++;
                        }
                      }
                      if (data35.url !== undefined) {
                        let data36 = data35.url;
                        if (typeof data36 === 'string') {
                          if (!formats0(data36)) {
                            const err102 = {
                              instancePath:
                                instancePath + '/' + i0 + '/card/link/url',
                              schemaPath: '#/definitions/uri/format',
                              keyword: 'format',
                              params: { format: 'uri' },
                              message: 'must match format "' + 'uri' + '"',
                            };
                            if (vErrors === null) {
                              vErrors = [err102];
                            } else {
                              vErrors.push(err102);
                            }
                            errors++;
                          }
                        } else {
                          const err103 = {
                            instancePath:
                              instancePath + '/' + i0 + '/card/link/url',
                            schemaPath: '#/definitions/uri/type',
                            keyword: 'type',
                            params: { type: 'string' },
                            message: 'must be string',
                          };
                          if (vErrors === null) {
                            vErrors = [err103];
                          } else {
                            vErrors.push(err103);
                          }
                          errors++;
                        }
                      }
                      if (data35.expanded_url !== undefined) {
                        let data37 = data35.expanded_url;
                        if (typeof data37 === 'string') {
                          if (!formats0(data37)) {
                            const err104 = {
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
                              vErrors = [err104];
                            } else {
                              vErrors.push(err104);
                            }
                            errors++;
                          }
                        } else {
                          const err105 = {
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
                            vErrors = [err105];
                          } else {
                            vErrors.push(err105);
                          }
                          errors++;
                        }
                      }
                      if (data35.decoded_url !== undefined) {
                        let data38 = data35.decoded_url;
                        if (typeof data38 === 'string') {
                          if (!formats4(data38)) {
                            const err106 = {
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
                              vErrors = [err106];
                            } else {
                              vErrors.push(err106);
                            }
                            errors++;
                          }
                        } else {
                          const err107 = {
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
                            vErrors = [err107];
                          } else {
                            vErrors.push(err107);
                          }
                          errors++;
                        }
                      }
                      if (data35.title !== undefined) {
                        let data39 = data35.title;
                        if (typeof data39 !== 'string' && data39 !== null) {
                          const err108 = {
                            instancePath:
                              instancePath + '/' + i0 + '/card/link/title',
                            schemaPath:
                              '#/items/properties/card/oneOf/1/properties/link/properties/title/type',
                            keyword: 'type',
                            params: { type: 'string' },
                            message: 'must be string',
                          };
                          if (vErrors === null) {
                            vErrors = [err108];
                          } else {
                            vErrors.push(err108);
                          }
                          errors++;
                        }
                      }
                    }
                  }
                  if (data26.media_urls !== undefined) {
                    let data40 = data26.media_urls;
                    if (Array.isArray(data40)) {
                      const len2 = data40.length;
                      for (let i2 = 0; i2 < len2; i2++) {
                        let data41 = data40[i2];
                        if (typeof data41 === 'string') {
                          if (!formats0(data41)) {
                            const err109 = {
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
                              vErrors = [err109];
                            } else {
                              vErrors.push(err109);
                            }
                            errors++;
                          }
                        } else {
                          const err110 = {
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
                            vErrors = [err110];
                          } else {
                            vErrors.push(err110);
                          }
                          errors++;
                        }
                      }
                    } else {
                      const err111 = {
                        instancePath:
                          instancePath + '/' + i0 + '/card/media_urls',
                        schemaPath:
                          '#/items/properties/card/oneOf/1/properties/media_urls/type',
                        keyword: 'type',
                        params: { type: 'array' },
                        message: 'must be array',
                      };
                      if (vErrors === null) {
                        vErrors = [err111];
                      } else {
                        vErrors.push(err111);
                      }
                      errors++;
                    }
                  }
                } else {
                  const err112 = {
                    instancePath: instancePath + '/' + i0 + '/card',
                    schemaPath: '#/items/properties/card/oneOf/1/type',
                    keyword: 'type',
                    params: { type: 'object' },
                    message: 'must be object',
                  };
                  if (vErrors === null) {
                    vErrors = [err112];
                  } else {
                    vErrors.push(err112);
                  }
                  errors++;
                }
              } else {
                const err113 = {
                  instancePath: instancePath + '/' + i0 + '/card',
                  schemaPath: '#/items/properties/card/discriminator',
                  keyword: 'discriminator',
                  params: { error: 'mapping', tag: 'type', tagValue: tag1 },
                  message: 'value of tag "type" must be in oneOf',
                };
                if (vErrors === null) {
                  vErrors = [err113];
                } else {
                  vErrors.push(err113);
                }
                errors++;
              }
            } else {
              const err114 = {
                instancePath: instancePath + '/' + i0 + '/card',
                schemaPath: '#/items/properties/card/discriminator',
                keyword: 'discriminator',
                params: { error: 'tag', tag: 'type', tagValue: tag1 },
                message: 'tag "type" must be string',
              };
              if (vErrors === null) {
                vErrors = [err114];
              } else {
                vErrors.push(err114);
              }
              errors++;
            }
          }
        }
        if (data0.media !== undefined) {
          let data42 = data0.media;
          if (!Array.isArray(data42) && data42 !== null) {
            const err115 = {
              instancePath: instancePath + '/' + i0 + '/media',
              schemaPath: '#/items/properties/media/type',
              keyword: 'type',
              params: { type: 'array' },
              message: 'must be array',
            };
            if (vErrors === null) {
              vErrors = [err115];
            } else {
              vErrors.push(err115);
            }
            errors++;
          }
          if (Array.isArray(data42)) {
            const len3 = data42.length;
            for (let i3 = 0; i3 < len3; i3++) {
              let data43 = data42[i3];
              if (
                data43 &&
                typeof data43 == 'object' &&
                !Array.isArray(data43)
              ) {
                if (data43.type === undefined) {
                  const err116 = {
                    instancePath: instancePath + '/' + i0 + '/media/' + i3,
                    schemaPath: '#/items/properties/media/items/required',
                    keyword: 'required',
                    params: { missingProperty: 'type' },
                    message: "must have required property '" + 'type' + "'",
                  };
                  if (vErrors === null) {
                    vErrors = [err116];
                  } else {
                    vErrors.push(err116);
                  }
                  errors++;
                }
                const tag2 = data43.type;
                if (typeof tag2 == 'string') {
                  if (tag2 === 'photo') {
                    if (
                      data43 &&
                      typeof data43 == 'object' &&
                      !Array.isArray(data43)
                    ) {
                      if (data43.type === undefined) {
                        const err117 = {
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
                          vErrors = [err117];
                        } else {
                          vErrors.push(err117);
                        }
                        errors++;
                      }
                      if (data43.url === undefined) {
                        const err118 = {
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
                          vErrors = [err118];
                        } else {
                          vErrors.push(err118);
                        }
                        errors++;
                      }
                      for (const key11 in data43) {
                        if (!(key11 === 'type' || key11 === 'url')) {
                          const err119 = {
                            instancePath:
                              instancePath + '/' + i0 + '/media/' + i3,
                            schemaPath:
                              '#/items/properties/media/items/oneOf/0/additionalProperties',
                            keyword: 'additionalProperties',
                            params: { additionalProperty: key11 },
                            message: 'must NOT have additional properties',
                          };
                          if (vErrors === null) {
                            vErrors = [err119];
                          } else {
                            vErrors.push(err119);
                          }
                          errors++;
                        }
                      }
                      if (data43.type !== undefined) {
                        let data44 = data43.type;
                        if (typeof data44 !== 'string') {
                          const err120 = {
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
                            vErrors = [err120];
                          } else {
                            vErrors.push(err120);
                          }
                          errors++;
                        }
                        if ('photo' !== data44) {
                          const err121 = {
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
                            vErrors = [err121];
                          } else {
                            vErrors.push(err121);
                          }
                          errors++;
                        }
                      }
                      if (data43.url !== undefined) {
                        let data45 = data43.url;
                        if (typeof data45 === 'string') {
                          if (!formats0(data45)) {
                            const err122 = {
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
                              vErrors = [err122];
                            } else {
                              vErrors.push(err122);
                            }
                            errors++;
                          }
                        } else {
                          const err123 = {
                            instancePath:
                              instancePath + '/' + i0 + '/media/' + i3 + '/url',
                            schemaPath: '#/definitions/uri/type',
                            keyword: 'type',
                            params: { type: 'string' },
                            message: 'must be string',
                          };
                          if (vErrors === null) {
                            vErrors = [err123];
                          } else {
                            vErrors.push(err123);
                          }
                          errors++;
                        }
                      }
                    } else {
                      const err124 = {
                        instancePath: instancePath + '/' + i0 + '/media/' + i3,
                        schemaPath:
                          '#/items/properties/media/items/oneOf/0/type',
                        keyword: 'type',
                        params: { type: 'object' },
                        message: 'must be object',
                      };
                      if (vErrors === null) {
                        vErrors = [err124];
                      } else {
                        vErrors.push(err124);
                      }
                      errors++;
                    }
                  } else if (tag2 === 'video') {
                    if (
                      data43 &&
                      typeof data43 == 'object' &&
                      !Array.isArray(data43)
                    ) {
                      if (data43.type === undefined) {
                        const err125 = {
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
                          vErrors = [err125];
                        } else {
                          vErrors.push(err125);
                        }
                        errors++;
                      }
                      if (data43.thumbnail === undefined) {
                        const err126 = {
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
                          vErrors = [err126];
                        } else {
                          vErrors.push(err126);
                        }
                        errors++;
                      }
                      for (const key12 in data43) {
                        if (!(key12 === 'type' || key12 === 'thumbnail')) {
                          const err127 = {
                            instancePath:
                              instancePath + '/' + i0 + '/media/' + i3,
                            schemaPath:
                              '#/items/properties/media/items/oneOf/1/additionalProperties',
                            keyword: 'additionalProperties',
                            params: { additionalProperty: key12 },
                            message: 'must NOT have additional properties',
                          };
                          if (vErrors === null) {
                            vErrors = [err127];
                          } else {
                            vErrors.push(err127);
                          }
                          errors++;
                        }
                      }
                      if (data43.type !== undefined) {
                        let data46 = data43.type;
                        if (typeof data46 !== 'string') {
                          const err128 = {
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
                            vErrors = [err128];
                          } else {
                            vErrors.push(err128);
                          }
                          errors++;
                        }
                        if ('video' !== data46) {
                          const err129 = {
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
                            vErrors = [err129];
                          } else {
                            vErrors.push(err129);
                          }
                          errors++;
                        }
                      }
                      if (data43.thumbnail !== undefined) {
                        let data47 = data43.thumbnail;
                        if (typeof data47 === 'string') {
                          if (!formats0(data47)) {
                            const err130 = {
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
                              vErrors = [err130];
                            } else {
                              vErrors.push(err130);
                            }
                            errors++;
                          }
                        } else {
                          const err131 = {
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
                            vErrors = [err131];
                          } else {
                            vErrors.push(err131);
                          }
                          errors++;
                        }
                      }
                    } else {
                      const err132 = {
                        instancePath: instancePath + '/' + i0 + '/media/' + i3,
                        schemaPath:
                          '#/items/properties/media/items/oneOf/1/type',
                        keyword: 'type',
                        params: { type: 'object' },
                        message: 'must be object',
                      };
                      if (vErrors === null) {
                        vErrors = [err132];
                      } else {
                        vErrors.push(err132);
                      }
                      errors++;
                    }
                  } else {
                    const err133 = {
                      instancePath: instancePath + '/' + i0 + '/media/' + i3,
                      schemaPath:
                        '#/items/properties/media/items/discriminator',
                      keyword: 'discriminator',
                      params: { error: 'mapping', tag: 'type', tagValue: tag2 },
                      message: 'value of tag "type" must be in oneOf',
                    };
                    if (vErrors === null) {
                      vErrors = [err133];
                    } else {
                      vErrors.push(err133);
                    }
                    errors++;
                  }
                } else {
                  const err134 = {
                    instancePath: instancePath + '/' + i0 + '/media/' + i3,
                    schemaPath: '#/items/properties/media/items/discriminator',
                    keyword: 'discriminator',
                    params: { error: 'tag', tag: 'type', tagValue: tag2 },
                    message: 'tag "type" must be string',
                  };
                  if (vErrors === null) {
                    vErrors = [err134];
                  } else {
                    vErrors.push(err134);
                  }
                  errors++;
                }
              } else {
                const err135 = {
                  instancePath: instancePath + '/' + i0 + '/media/' + i3,
                  schemaPath: '#/items/properties/media/items/type',
                  keyword: 'type',
                  params: { type: 'object' },
                  message: 'must be object',
                };
                if (vErrors === null) {
                  vErrors = [err135];
                } else {
                  vErrors.push(err135);
                }
                errors++;
              }
            }
          }
        }
      } else {
        const err136 = {
          instancePath: instancePath + '/' + i0,
          schemaPath: '#/items/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        };
        if (vErrors === null) {
          vErrors = [err136];
        } else {
          vErrors.push(err136);
        }
        errors++;
      }
    }
  } else {
    const err137 = {
      instancePath,
      schemaPath: '#/type',
      keyword: 'type',
      params: { type: 'array' },
      message: 'must be array',
    };
    if (vErrors === null) {
      vErrors = [err137];
    } else {
      vErrors.push(err137);
    }
    errors++;
  }
  validate10.errors = vErrors;
  return errors === 0;
}
