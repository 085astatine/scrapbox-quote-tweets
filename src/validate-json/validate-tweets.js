'use strict';
module.exports = validate10;
module.exports.default = validate10;
const schema11 = {
  type: 'array',
  items: {
    type: 'object',
    required: ['id', 'timestamp', 'author', 'text'],
    additionalProperties: false,
    properties: {
      id: { type: 'string', pattern: '^[0-9]+$' },
      timestamp: { type: 'integer' },
      author: {
        type: 'object',
        required: ['id', 'name', 'username'],
        additionalProperties: false,
        properties: {
          id: { type: 'string', pattern: '^[0-9]+$' },
          name: { type: 'string' },
          username: { type: 'string', pattern: '^[a-zA-Z0-9_]{1,15}$' },
        },
      },
      text: {
        type: 'array',
        items: {
          type: 'object',
          required: ['type'],
          discriminator: { propertyName: 'type' },
          oneOf: [
            {
              type: 'object',
              required: ['type', 'text'],
              additionalProperties: false,
              properties: {
                type: { type: 'string', const: 'text' },
                text: { type: 'string' },
              },
            },
            {
              type: 'object',
              required: ['type', 'text', 'url', 'display_url', 'decoded_url'],
              additionalProperties: false,
              properties: {
                type: { type: 'string', const: 'url' },
                text: { type: 'string' },
                url: { type: 'string' },
                display_url: { type: 'string' },
                decoded_url: { type: 'string' },
                title: { type: 'string', nullable: true },
                description: { type: 'string', nullable: true },
              },
            },
            {
              type: 'object',
              required: ['type', 'text', 'media_key', 'media_type'],
              additionalProperties: false,
              properties: {
                type: { type: 'string', const: 'media' },
                text: { type: 'string' },
                media_key: { type: 'string', pattern: '^[0-9_]+$' },
                media_type: { type: 'string' },
                url: { type: 'string', nullable: true },
              },
            },
            {
              type: 'object',
              required: ['type', 'text', 'tag'],
              additionalProperties: false,
              properties: {
                type: { type: 'string', const: 'hashtag' },
                text: { type: 'string' },
                tag: { type: 'string' },
              },
            },
            {
              type: 'object',
              required: ['type', 'text', 'tag'],
              additionalProperties: false,
              properties: {
                type: { type: 'string', const: 'cashtag' },
                text: { type: 'string' },
                tag: { type: 'string' },
              },
            },
            {
              type: 'object',
              required: ['type', 'text', 'user'],
              additionalProperties: false,
              properties: {
                type: { type: 'string', const: 'mention' },
                text: { type: 'string' },
                user: {
                  type: 'object',
                  required: ['id', 'username'],
                  additionalProperties: false,
                  properties: {
                    id: { type: 'string', pattern: '^[0-9]+$' },
                    name: { type: 'string', nullable: true },
                    username: {
                      type: 'string',
                      pattern: '^[a-zA-Z0-9_]{1,15}$',
                    },
                  },
                },
              },
            },
          ],
        },
      },
      annotations: {
        type: 'array',
        items: {
          type: 'object',
          required: [
            'type',
            'text',
            'probability',
            'annotation_type',
            'normalized_text',
          ],
          additionalProperties: false,
          properties: {
            type: { type: 'string', const: 'annotation' },
            text: { type: 'string' },
            probability: { type: 'number' },
            annotation_type: { type: 'string' },
            normalized_text: { type: 'string' },
          },
        },
        nullable: true,
      },
      referenced_tweets: {
        type: 'array',
        items: {
          type: 'object',
          required: ['type', 'id'],
          additionalProperties: false,
          properties: {
            type: {
              type: 'string',
              enum: ['retweeted', 'quoted', 'replied_to'],
            },
            id: { type: 'string', pattern: '^[0-9]+$' },
          },
        },
        nullable: true,
      },
    },
  },
};
const pattern0 = new RegExp('^[0-9]+$', 'u');
const pattern2 = new RegExp('^[a-zA-Z0-9_]{1,15}$', 'u');
const pattern3 = new RegExp('^[0-9_]+$', 'u');
function validate10(
  data,
  { instancePath = '', parentData, parentDataProperty, rootData = data } = {}
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
              key0 === 'annotations' ||
              key0 === 'referenced_tweets'
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
          let data1 = data0.id;
          if (typeof data1 === 'string') {
            if (!pattern0.test(data1)) {
              const err5 = {
                instancePath: instancePath + '/' + i0 + '/id',
                schemaPath: '#/items/properties/id/pattern',
                keyword: 'pattern',
                params: { pattern: '^[0-9]+$' },
                message: 'must match pattern "' + '^[0-9]+$' + '"',
              };
              if (vErrors === null) {
                vErrors = [err5];
              } else {
                vErrors.push(err5);
              }
              errors++;
            }
          } else {
            const err6 = {
              instancePath: instancePath + '/' + i0 + '/id',
              schemaPath: '#/items/properties/id/type',
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
            const err7 = {
              instancePath: instancePath + '/' + i0 + '/timestamp',
              schemaPath: '#/items/properties/timestamp/type',
              keyword: 'type',
              params: { type: 'integer' },
              message: 'must be integer',
            };
            if (vErrors === null) {
              vErrors = [err7];
            } else {
              vErrors.push(err7);
            }
            errors++;
          }
        }
        if (data0.author !== undefined) {
          let data3 = data0.author;
          if (data3 && typeof data3 == 'object' && !Array.isArray(data3)) {
            if (data3.id === undefined) {
              const err8 = {
                instancePath: instancePath + '/' + i0 + '/author',
                schemaPath: '#/items/properties/author/required',
                keyword: 'required',
                params: { missingProperty: 'id' },
                message: "must have required property '" + 'id' + "'",
              };
              if (vErrors === null) {
                vErrors = [err8];
              } else {
                vErrors.push(err8);
              }
              errors++;
            }
            if (data3.name === undefined) {
              const err9 = {
                instancePath: instancePath + '/' + i0 + '/author',
                schemaPath: '#/items/properties/author/required',
                keyword: 'required',
                params: { missingProperty: 'name' },
                message: "must have required property '" + 'name' + "'",
              };
              if (vErrors === null) {
                vErrors = [err9];
              } else {
                vErrors.push(err9);
              }
              errors++;
            }
            if (data3.username === undefined) {
              const err10 = {
                instancePath: instancePath + '/' + i0 + '/author',
                schemaPath: '#/items/properties/author/required',
                keyword: 'required',
                params: { missingProperty: 'username' },
                message: "must have required property '" + 'username' + "'",
              };
              if (vErrors === null) {
                vErrors = [err10];
              } else {
                vErrors.push(err10);
              }
              errors++;
            }
            for (const key1 in data3) {
              if (!(key1 === 'id' || key1 === 'name' || key1 === 'username')) {
                const err11 = {
                  instancePath: instancePath + '/' + i0 + '/author',
                  schemaPath: '#/items/properties/author/additionalProperties',
                  keyword: 'additionalProperties',
                  params: { additionalProperty: key1 },
                  message: 'must NOT have additional properties',
                };
                if (vErrors === null) {
                  vErrors = [err11];
                } else {
                  vErrors.push(err11);
                }
                errors++;
              }
            }
            if (data3.id !== undefined) {
              let data4 = data3.id;
              if (typeof data4 === 'string') {
                if (!pattern0.test(data4)) {
                  const err12 = {
                    instancePath: instancePath + '/' + i0 + '/author/id',
                    schemaPath:
                      '#/items/properties/author/properties/id/pattern',
                    keyword: 'pattern',
                    params: { pattern: '^[0-9]+$' },
                    message: 'must match pattern "' + '^[0-9]+$' + '"',
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
                  instancePath: instancePath + '/' + i0 + '/author/id',
                  schemaPath: '#/items/properties/author/properties/id/type',
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
            if (data3.name !== undefined) {
              if (typeof data3.name !== 'string') {
                const err14 = {
                  instancePath: instancePath + '/' + i0 + '/author/name',
                  schemaPath: '#/items/properties/author/properties/name/type',
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
            if (data3.username !== undefined) {
              let data6 = data3.username;
              if (typeof data6 === 'string') {
                if (!pattern2.test(data6)) {
                  const err15 = {
                    instancePath: instancePath + '/' + i0 + '/author/username',
                    schemaPath:
                      '#/items/properties/author/properties/username/pattern',
                    keyword: 'pattern',
                    params: { pattern: '^[a-zA-Z0-9_]{1,15}$' },
                    message:
                      'must match pattern "' + '^[a-zA-Z0-9_]{1,15}$' + '"',
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
                  instancePath: instancePath + '/' + i0 + '/author/username',
                  schemaPath:
                    '#/items/properties/author/properties/username/type',
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
          } else {
            const err17 = {
              instancePath: instancePath + '/' + i0 + '/author',
              schemaPath: '#/items/properties/author/type',
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
        }
        if (data0.text !== undefined) {
          let data7 = data0.text;
          if (Array.isArray(data7)) {
            const len1 = data7.length;
            for (let i1 = 0; i1 < len1; i1++) {
              let data8 = data7[i1];
              if (data8 && typeof data8 == 'object' && !Array.isArray(data8)) {
                if (data8.type === undefined) {
                  const err18 = {
                    instancePath: instancePath + '/' + i0 + '/text/' + i1,
                    schemaPath: '#/items/properties/text/items/required',
                    keyword: 'required',
                    params: { missingProperty: 'type' },
                    message: "must have required property '" + 'type' + "'",
                  };
                  if (vErrors === null) {
                    vErrors = [err18];
                  } else {
                    vErrors.push(err18);
                  }
                  errors++;
                }
                const tag0 = data8.type;
                if (typeof tag0 == 'string') {
                  if (tag0 === 'text') {
                    if (
                      data8 &&
                      typeof data8 == 'object' &&
                      !Array.isArray(data8)
                    ) {
                      if (data8.type === undefined) {
                        const err19 = {
                          instancePath: instancePath + '/' + i0 + '/text/' + i1,
                          schemaPath:
                            '#/items/properties/text/items/oneOf/0/required',
                          keyword: 'required',
                          params: { missingProperty: 'type' },
                          message:
                            "must have required property '" + 'type' + "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err19];
                        } else {
                          vErrors.push(err19);
                        }
                        errors++;
                      }
                      if (data8.text === undefined) {
                        const err20 = {
                          instancePath: instancePath + '/' + i0 + '/text/' + i1,
                          schemaPath:
                            '#/items/properties/text/items/oneOf/0/required',
                          keyword: 'required',
                          params: { missingProperty: 'text' },
                          message:
                            "must have required property '" + 'text' + "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err20];
                        } else {
                          vErrors.push(err20);
                        }
                        errors++;
                      }
                      for (const key2 in data8) {
                        if (!(key2 === 'type' || key2 === 'text')) {
                          const err21 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1,
                            schemaPath:
                              '#/items/properties/text/items/oneOf/0/additionalProperties',
                            keyword: 'additionalProperties',
                            params: { additionalProperty: key2 },
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
                      if (data8.type !== undefined) {
                        let data9 = data8.type;
                        if (typeof data9 !== 'string') {
                          const err22 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1 + '/type',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/0/properties/type/type',
                            keyword: 'type',
                            params: { type: 'string' },
                            message: 'must be string',
                          };
                          if (vErrors === null) {
                            vErrors = [err22];
                          } else {
                            vErrors.push(err22);
                          }
                          errors++;
                        }
                        if ('text' !== data9) {
                          const err23 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1 + '/type',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/0/properties/type/const',
                            keyword: 'const',
                            params: { allowedValue: 'text' },
                            message: 'must be equal to constant',
                          };
                          if (vErrors === null) {
                            vErrors = [err23];
                          } else {
                            vErrors.push(err23);
                          }
                          errors++;
                        }
                      }
                      if (data8.text !== undefined) {
                        if (typeof data8.text !== 'string') {
                          const err24 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1 + '/text',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/0/properties/text/type',
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
                        instancePath: instancePath + '/' + i0 + '/text/' + i1,
                        schemaPath:
                          '#/items/properties/text/items/oneOf/0/type',
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
                  } else if (tag0 === 'url') {
                    if (
                      data8 &&
                      typeof data8 == 'object' &&
                      !Array.isArray(data8)
                    ) {
                      if (data8.type === undefined) {
                        const err26 = {
                          instancePath: instancePath + '/' + i0 + '/text/' + i1,
                          schemaPath:
                            '#/items/properties/text/items/oneOf/1/required',
                          keyword: 'required',
                          params: { missingProperty: 'type' },
                          message:
                            "must have required property '" + 'type' + "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err26];
                        } else {
                          vErrors.push(err26);
                        }
                        errors++;
                      }
                      if (data8.text === undefined) {
                        const err27 = {
                          instancePath: instancePath + '/' + i0 + '/text/' + i1,
                          schemaPath:
                            '#/items/properties/text/items/oneOf/1/required',
                          keyword: 'required',
                          params: { missingProperty: 'text' },
                          message:
                            "must have required property '" + 'text' + "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err27];
                        } else {
                          vErrors.push(err27);
                        }
                        errors++;
                      }
                      if (data8.url === undefined) {
                        const err28 = {
                          instancePath: instancePath + '/' + i0 + '/text/' + i1,
                          schemaPath:
                            '#/items/properties/text/items/oneOf/1/required',
                          keyword: 'required',
                          params: { missingProperty: 'url' },
                          message:
                            "must have required property '" + 'url' + "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err28];
                        } else {
                          vErrors.push(err28);
                        }
                        errors++;
                      }
                      if (data8.display_url === undefined) {
                        const err29 = {
                          instancePath: instancePath + '/' + i0 + '/text/' + i1,
                          schemaPath:
                            '#/items/properties/text/items/oneOf/1/required',
                          keyword: 'required',
                          params: { missingProperty: 'display_url' },
                          message:
                            "must have required property '" +
                            'display_url' +
                            "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err29];
                        } else {
                          vErrors.push(err29);
                        }
                        errors++;
                      }
                      if (data8.decoded_url === undefined) {
                        const err30 = {
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
                          vErrors = [err30];
                        } else {
                          vErrors.push(err30);
                        }
                        errors++;
                      }
                      for (const key3 in data8) {
                        if (
                          !(
                            key3 === 'type' ||
                            key3 === 'text' ||
                            key3 === 'url' ||
                            key3 === 'display_url' ||
                            key3 === 'decoded_url' ||
                            key3 === 'title' ||
                            key3 === 'description'
                          )
                        ) {
                          const err31 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1,
                            schemaPath:
                              '#/items/properties/text/items/oneOf/1/additionalProperties',
                            keyword: 'additionalProperties',
                            params: { additionalProperty: key3 },
                            message: 'must NOT have additional properties',
                          };
                          if (vErrors === null) {
                            vErrors = [err31];
                          } else {
                            vErrors.push(err31);
                          }
                          errors++;
                        }
                      }
                      if (data8.type !== undefined) {
                        let data11 = data8.type;
                        if (typeof data11 !== 'string') {
                          const err32 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1 + '/type',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/1/properties/type/type',
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
                        if ('url' !== data11) {
                          const err33 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1 + '/type',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/1/properties/type/const',
                            keyword: 'const',
                            params: { allowedValue: 'url' },
                            message: 'must be equal to constant',
                          };
                          if (vErrors === null) {
                            vErrors = [err33];
                          } else {
                            vErrors.push(err33);
                          }
                          errors++;
                        }
                      }
                      if (data8.text !== undefined) {
                        if (typeof data8.text !== 'string') {
                          const err34 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1 + '/text',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/1/properties/text/type',
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
                      if (data8.url !== undefined) {
                        if (typeof data8.url !== 'string') {
                          const err35 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1 + '/url',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/1/properties/url/type',
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
                      if (data8.display_url !== undefined) {
                        if (typeof data8.display_url !== 'string') {
                          const err36 = {
                            instancePath:
                              instancePath +
                              '/' +
                              i0 +
                              '/text/' +
                              i1 +
                              '/display_url',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/1/properties/display_url/type',
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
                      if (data8.decoded_url !== undefined) {
                        if (typeof data8.decoded_url !== 'string') {
                          const err37 = {
                            instancePath:
                              instancePath +
                              '/' +
                              i0 +
                              '/text/' +
                              i1 +
                              '/decoded_url',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/1/properties/decoded_url/type',
                            keyword: 'type',
                            params: { type: 'string' },
                            message: 'must be string',
                          };
                          if (vErrors === null) {
                            vErrors = [err37];
                          } else {
                            vErrors.push(err37);
                          }
                          errors++;
                        }
                      }
                      if (data8.title !== undefined) {
                        let data16 = data8.title;
                        if (typeof data16 !== 'string' && data16 !== null) {
                          const err38 = {
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
                            vErrors = [err38];
                          } else {
                            vErrors.push(err38);
                          }
                          errors++;
                        }
                      }
                      if (data8.description !== undefined) {
                        let data17 = data8.description;
                        if (typeof data17 !== 'string' && data17 !== null) {
                          const err39 = {
                            instancePath:
                              instancePath +
                              '/' +
                              i0 +
                              '/text/' +
                              i1 +
                              '/description',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/1/properties/description/type',
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
                      }
                    } else {
                      const err40 = {
                        instancePath: instancePath + '/' + i0 + '/text/' + i1,
                        schemaPath:
                          '#/items/properties/text/items/oneOf/1/type',
                        keyword: 'type',
                        params: { type: 'object' },
                        message: 'must be object',
                      };
                      if (vErrors === null) {
                        vErrors = [err40];
                      } else {
                        vErrors.push(err40);
                      }
                      errors++;
                    }
                  } else if (tag0 === 'media') {
                    if (
                      data8 &&
                      typeof data8 == 'object' &&
                      !Array.isArray(data8)
                    ) {
                      if (data8.type === undefined) {
                        const err41 = {
                          instancePath: instancePath + '/' + i0 + '/text/' + i1,
                          schemaPath:
                            '#/items/properties/text/items/oneOf/2/required',
                          keyword: 'required',
                          params: { missingProperty: 'type' },
                          message:
                            "must have required property '" + 'type' + "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err41];
                        } else {
                          vErrors.push(err41);
                        }
                        errors++;
                      }
                      if (data8.text === undefined) {
                        const err42 = {
                          instancePath: instancePath + '/' + i0 + '/text/' + i1,
                          schemaPath:
                            '#/items/properties/text/items/oneOf/2/required',
                          keyword: 'required',
                          params: { missingProperty: 'text' },
                          message:
                            "must have required property '" + 'text' + "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err42];
                        } else {
                          vErrors.push(err42);
                        }
                        errors++;
                      }
                      if (data8.media_key === undefined) {
                        const err43 = {
                          instancePath: instancePath + '/' + i0 + '/text/' + i1,
                          schemaPath:
                            '#/items/properties/text/items/oneOf/2/required',
                          keyword: 'required',
                          params: { missingProperty: 'media_key' },
                          message:
                            "must have required property '" + 'media_key' + "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err43];
                        } else {
                          vErrors.push(err43);
                        }
                        errors++;
                      }
                      if (data8.media_type === undefined) {
                        const err44 = {
                          instancePath: instancePath + '/' + i0 + '/text/' + i1,
                          schemaPath:
                            '#/items/properties/text/items/oneOf/2/required',
                          keyword: 'required',
                          params: { missingProperty: 'media_type' },
                          message:
                            "must have required property '" +
                            'media_type' +
                            "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err44];
                        } else {
                          vErrors.push(err44);
                        }
                        errors++;
                      }
                      for (const key4 in data8) {
                        if (
                          !(
                            key4 === 'type' ||
                            key4 === 'text' ||
                            key4 === 'media_key' ||
                            key4 === 'media_type' ||
                            key4 === 'url'
                          )
                        ) {
                          const err45 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1,
                            schemaPath:
                              '#/items/properties/text/items/oneOf/2/additionalProperties',
                            keyword: 'additionalProperties',
                            params: { additionalProperty: key4 },
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
                      if (data8.type !== undefined) {
                        let data18 = data8.type;
                        if (typeof data18 !== 'string') {
                          const err46 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1 + '/type',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/2/properties/type/type',
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
                        if ('media' !== data18) {
                          const err47 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1 + '/type',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/2/properties/type/const',
                            keyword: 'const',
                            params: { allowedValue: 'media' },
                            message: 'must be equal to constant',
                          };
                          if (vErrors === null) {
                            vErrors = [err47];
                          } else {
                            vErrors.push(err47);
                          }
                          errors++;
                        }
                      }
                      if (data8.text !== undefined) {
                        if (typeof data8.text !== 'string') {
                          const err48 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1 + '/text',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/2/properties/text/type',
                            keyword: 'type',
                            params: { type: 'string' },
                            message: 'must be string',
                          };
                          if (vErrors === null) {
                            vErrors = [err48];
                          } else {
                            vErrors.push(err48);
                          }
                          errors++;
                        }
                      }
                      if (data8.media_key !== undefined) {
                        let data20 = data8.media_key;
                        if (typeof data20 === 'string') {
                          if (!pattern3.test(data20)) {
                            const err49 = {
                              instancePath:
                                instancePath +
                                '/' +
                                i0 +
                                '/text/' +
                                i1 +
                                '/media_key',
                              schemaPath:
                                '#/items/properties/text/items/oneOf/2/properties/media_key/pattern',
                              keyword: 'pattern',
                              params: { pattern: '^[0-9_]+$' },
                              message:
                                'must match pattern "' + '^[0-9_]+$' + '"',
                            };
                            if (vErrors === null) {
                              vErrors = [err49];
                            } else {
                              vErrors.push(err49);
                            }
                            errors++;
                          }
                        } else {
                          const err50 = {
                            instancePath:
                              instancePath +
                              '/' +
                              i0 +
                              '/text/' +
                              i1 +
                              '/media_key',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/2/properties/media_key/type',
                            keyword: 'type',
                            params: { type: 'string' },
                            message: 'must be string',
                          };
                          if (vErrors === null) {
                            vErrors = [err50];
                          } else {
                            vErrors.push(err50);
                          }
                          errors++;
                        }
                      }
                      if (data8.media_type !== undefined) {
                        if (typeof data8.media_type !== 'string') {
                          const err51 = {
                            instancePath:
                              instancePath +
                              '/' +
                              i0 +
                              '/text/' +
                              i1 +
                              '/media_type',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/2/properties/media_type/type',
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
                      if (data8.url !== undefined) {
                        let data22 = data8.url;
                        if (typeof data22 !== 'string' && data22 !== null) {
                          const err52 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1 + '/url',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/2/properties/url/type',
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
                    } else {
                      const err53 = {
                        instancePath: instancePath + '/' + i0 + '/text/' + i1,
                        schemaPath:
                          '#/items/properties/text/items/oneOf/2/type',
                        keyword: 'type',
                        params: { type: 'object' },
                        message: 'must be object',
                      };
                      if (vErrors === null) {
                        vErrors = [err53];
                      } else {
                        vErrors.push(err53);
                      }
                      errors++;
                    }
                  } else if (tag0 === 'hashtag') {
                    if (
                      data8 &&
                      typeof data8 == 'object' &&
                      !Array.isArray(data8)
                    ) {
                      if (data8.type === undefined) {
                        const err54 = {
                          instancePath: instancePath + '/' + i0 + '/text/' + i1,
                          schemaPath:
                            '#/items/properties/text/items/oneOf/3/required',
                          keyword: 'required',
                          params: { missingProperty: 'type' },
                          message:
                            "must have required property '" + 'type' + "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err54];
                        } else {
                          vErrors.push(err54);
                        }
                        errors++;
                      }
                      if (data8.text === undefined) {
                        const err55 = {
                          instancePath: instancePath + '/' + i0 + '/text/' + i1,
                          schemaPath:
                            '#/items/properties/text/items/oneOf/3/required',
                          keyword: 'required',
                          params: { missingProperty: 'text' },
                          message:
                            "must have required property '" + 'text' + "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err55];
                        } else {
                          vErrors.push(err55);
                        }
                        errors++;
                      }
                      if (data8.tag === undefined) {
                        const err56 = {
                          instancePath: instancePath + '/' + i0 + '/text/' + i1,
                          schemaPath:
                            '#/items/properties/text/items/oneOf/3/required',
                          keyword: 'required',
                          params: { missingProperty: 'tag' },
                          message:
                            "must have required property '" + 'tag' + "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err56];
                        } else {
                          vErrors.push(err56);
                        }
                        errors++;
                      }
                      for (const key5 in data8) {
                        if (
                          !(
                            key5 === 'type' ||
                            key5 === 'text' ||
                            key5 === 'tag'
                          )
                        ) {
                          const err57 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1,
                            schemaPath:
                              '#/items/properties/text/items/oneOf/3/additionalProperties',
                            keyword: 'additionalProperties',
                            params: { additionalProperty: key5 },
                            message: 'must NOT have additional properties',
                          };
                          if (vErrors === null) {
                            vErrors = [err57];
                          } else {
                            vErrors.push(err57);
                          }
                          errors++;
                        }
                      }
                      if (data8.type !== undefined) {
                        let data23 = data8.type;
                        if (typeof data23 !== 'string') {
                          const err58 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1 + '/type',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/3/properties/type/type',
                            keyword: 'type',
                            params: { type: 'string' },
                            message: 'must be string',
                          };
                          if (vErrors === null) {
                            vErrors = [err58];
                          } else {
                            vErrors.push(err58);
                          }
                          errors++;
                        }
                        if ('hashtag' !== data23) {
                          const err59 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1 + '/type',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/3/properties/type/const',
                            keyword: 'const',
                            params: { allowedValue: 'hashtag' },
                            message: 'must be equal to constant',
                          };
                          if (vErrors === null) {
                            vErrors = [err59];
                          } else {
                            vErrors.push(err59);
                          }
                          errors++;
                        }
                      }
                      if (data8.text !== undefined) {
                        if (typeof data8.text !== 'string') {
                          const err60 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1 + '/text',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/3/properties/text/type',
                            keyword: 'type',
                            params: { type: 'string' },
                            message: 'must be string',
                          };
                          if (vErrors === null) {
                            vErrors = [err60];
                          } else {
                            vErrors.push(err60);
                          }
                          errors++;
                        }
                      }
                      if (data8.tag !== undefined) {
                        if (typeof data8.tag !== 'string') {
                          const err61 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1 + '/tag',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/3/properties/tag/type',
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
                      }
                    } else {
                      const err62 = {
                        instancePath: instancePath + '/' + i0 + '/text/' + i1,
                        schemaPath:
                          '#/items/properties/text/items/oneOf/3/type',
                        keyword: 'type',
                        params: { type: 'object' },
                        message: 'must be object',
                      };
                      if (vErrors === null) {
                        vErrors = [err62];
                      } else {
                        vErrors.push(err62);
                      }
                      errors++;
                    }
                  } else if (tag0 === 'cashtag') {
                    if (
                      data8 &&
                      typeof data8 == 'object' &&
                      !Array.isArray(data8)
                    ) {
                      if (data8.type === undefined) {
                        const err63 = {
                          instancePath: instancePath + '/' + i0 + '/text/' + i1,
                          schemaPath:
                            '#/items/properties/text/items/oneOf/4/required',
                          keyword: 'required',
                          params: { missingProperty: 'type' },
                          message:
                            "must have required property '" + 'type' + "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err63];
                        } else {
                          vErrors.push(err63);
                        }
                        errors++;
                      }
                      if (data8.text === undefined) {
                        const err64 = {
                          instancePath: instancePath + '/' + i0 + '/text/' + i1,
                          schemaPath:
                            '#/items/properties/text/items/oneOf/4/required',
                          keyword: 'required',
                          params: { missingProperty: 'text' },
                          message:
                            "must have required property '" + 'text' + "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err64];
                        } else {
                          vErrors.push(err64);
                        }
                        errors++;
                      }
                      if (data8.tag === undefined) {
                        const err65 = {
                          instancePath: instancePath + '/' + i0 + '/text/' + i1,
                          schemaPath:
                            '#/items/properties/text/items/oneOf/4/required',
                          keyword: 'required',
                          params: { missingProperty: 'tag' },
                          message:
                            "must have required property '" + 'tag' + "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err65];
                        } else {
                          vErrors.push(err65);
                        }
                        errors++;
                      }
                      for (const key6 in data8) {
                        if (
                          !(
                            key6 === 'type' ||
                            key6 === 'text' ||
                            key6 === 'tag'
                          )
                        ) {
                          const err66 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1,
                            schemaPath:
                              '#/items/properties/text/items/oneOf/4/additionalProperties',
                            keyword: 'additionalProperties',
                            params: { additionalProperty: key6 },
                            message: 'must NOT have additional properties',
                          };
                          if (vErrors === null) {
                            vErrors = [err66];
                          } else {
                            vErrors.push(err66);
                          }
                          errors++;
                        }
                      }
                      if (data8.type !== undefined) {
                        let data26 = data8.type;
                        if (typeof data26 !== 'string') {
                          const err67 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1 + '/type',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/4/properties/type/type',
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
                        if ('cashtag' !== data26) {
                          const err68 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1 + '/type',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/4/properties/type/const',
                            keyword: 'const',
                            params: { allowedValue: 'cashtag' },
                            message: 'must be equal to constant',
                          };
                          if (vErrors === null) {
                            vErrors = [err68];
                          } else {
                            vErrors.push(err68);
                          }
                          errors++;
                        }
                      }
                      if (data8.text !== undefined) {
                        if (typeof data8.text !== 'string') {
                          const err69 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1 + '/text',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/4/properties/text/type',
                            keyword: 'type',
                            params: { type: 'string' },
                            message: 'must be string',
                          };
                          if (vErrors === null) {
                            vErrors = [err69];
                          } else {
                            vErrors.push(err69);
                          }
                          errors++;
                        }
                      }
                      if (data8.tag !== undefined) {
                        if (typeof data8.tag !== 'string') {
                          const err70 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1 + '/tag',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/4/properties/tag/type',
                            keyword: 'type',
                            params: { type: 'string' },
                            message: 'must be string',
                          };
                          if (vErrors === null) {
                            vErrors = [err70];
                          } else {
                            vErrors.push(err70);
                          }
                          errors++;
                        }
                      }
                    } else {
                      const err71 = {
                        instancePath: instancePath + '/' + i0 + '/text/' + i1,
                        schemaPath:
                          '#/items/properties/text/items/oneOf/4/type',
                        keyword: 'type',
                        params: { type: 'object' },
                        message: 'must be object',
                      };
                      if (vErrors === null) {
                        vErrors = [err71];
                      } else {
                        vErrors.push(err71);
                      }
                      errors++;
                    }
                  } else if (tag0 === 'mention') {
                    if (
                      data8 &&
                      typeof data8 == 'object' &&
                      !Array.isArray(data8)
                    ) {
                      if (data8.type === undefined) {
                        const err72 = {
                          instancePath: instancePath + '/' + i0 + '/text/' + i1,
                          schemaPath:
                            '#/items/properties/text/items/oneOf/5/required',
                          keyword: 'required',
                          params: { missingProperty: 'type' },
                          message:
                            "must have required property '" + 'type' + "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err72];
                        } else {
                          vErrors.push(err72);
                        }
                        errors++;
                      }
                      if (data8.text === undefined) {
                        const err73 = {
                          instancePath: instancePath + '/' + i0 + '/text/' + i1,
                          schemaPath:
                            '#/items/properties/text/items/oneOf/5/required',
                          keyword: 'required',
                          params: { missingProperty: 'text' },
                          message:
                            "must have required property '" + 'text' + "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err73];
                        } else {
                          vErrors.push(err73);
                        }
                        errors++;
                      }
                      if (data8.user === undefined) {
                        const err74 = {
                          instancePath: instancePath + '/' + i0 + '/text/' + i1,
                          schemaPath:
                            '#/items/properties/text/items/oneOf/5/required',
                          keyword: 'required',
                          params: { missingProperty: 'user' },
                          message:
                            "must have required property '" + 'user' + "'",
                        };
                        if (vErrors === null) {
                          vErrors = [err74];
                        } else {
                          vErrors.push(err74);
                        }
                        errors++;
                      }
                      for (const key7 in data8) {
                        if (
                          !(
                            key7 === 'type' ||
                            key7 === 'text' ||
                            key7 === 'user'
                          )
                        ) {
                          const err75 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1,
                            schemaPath:
                              '#/items/properties/text/items/oneOf/5/additionalProperties',
                            keyword: 'additionalProperties',
                            params: { additionalProperty: key7 },
                            message: 'must NOT have additional properties',
                          };
                          if (vErrors === null) {
                            vErrors = [err75];
                          } else {
                            vErrors.push(err75);
                          }
                          errors++;
                        }
                      }
                      if (data8.type !== undefined) {
                        let data29 = data8.type;
                        if (typeof data29 !== 'string') {
                          const err76 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1 + '/type',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/5/properties/type/type',
                            keyword: 'type',
                            params: { type: 'string' },
                            message: 'must be string',
                          };
                          if (vErrors === null) {
                            vErrors = [err76];
                          } else {
                            vErrors.push(err76);
                          }
                          errors++;
                        }
                        if ('mention' !== data29) {
                          const err77 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1 + '/type',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/5/properties/type/const',
                            keyword: 'const',
                            params: { allowedValue: 'mention' },
                            message: 'must be equal to constant',
                          };
                          if (vErrors === null) {
                            vErrors = [err77];
                          } else {
                            vErrors.push(err77);
                          }
                          errors++;
                        }
                      }
                      if (data8.text !== undefined) {
                        if (typeof data8.text !== 'string') {
                          const err78 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1 + '/text',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/5/properties/text/type',
                            keyword: 'type',
                            params: { type: 'string' },
                            message: 'must be string',
                          };
                          if (vErrors === null) {
                            vErrors = [err78];
                          } else {
                            vErrors.push(err78);
                          }
                          errors++;
                        }
                      }
                      if (data8.user !== undefined) {
                        let data31 = data8.user;
                        if (
                          data31 &&
                          typeof data31 == 'object' &&
                          !Array.isArray(data31)
                        ) {
                          if (data31.id === undefined) {
                            const err79 = {
                              instancePath:
                                instancePath +
                                '/' +
                                i0 +
                                '/text/' +
                                i1 +
                                '/user',
                              schemaPath:
                                '#/items/properties/text/items/oneOf/5/properties/user/required',
                              keyword: 'required',
                              params: { missingProperty: 'id' },
                              message:
                                "must have required property '" + 'id' + "'",
                            };
                            if (vErrors === null) {
                              vErrors = [err79];
                            } else {
                              vErrors.push(err79);
                            }
                            errors++;
                          }
                          if (data31.username === undefined) {
                            const err80 = {
                              instancePath:
                                instancePath +
                                '/' +
                                i0 +
                                '/text/' +
                                i1 +
                                '/user',
                              schemaPath:
                                '#/items/properties/text/items/oneOf/5/properties/user/required',
                              keyword: 'required',
                              params: { missingProperty: 'username' },
                              message:
                                "must have required property '" +
                                'username' +
                                "'",
                            };
                            if (vErrors === null) {
                              vErrors = [err80];
                            } else {
                              vErrors.push(err80);
                            }
                            errors++;
                          }
                          for (const key8 in data31) {
                            if (
                              !(
                                key8 === 'id' ||
                                key8 === 'name' ||
                                key8 === 'username'
                              )
                            ) {
                              const err81 = {
                                instancePath:
                                  instancePath +
                                  '/' +
                                  i0 +
                                  '/text/' +
                                  i1 +
                                  '/user',
                                schemaPath:
                                  '#/items/properties/text/items/oneOf/5/properties/user/additionalProperties',
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
                          if (data31.id !== undefined) {
                            let data32 = data31.id;
                            if (typeof data32 === 'string') {
                              if (!pattern0.test(data32)) {
                                const err82 = {
                                  instancePath:
                                    instancePath +
                                    '/' +
                                    i0 +
                                    '/text/' +
                                    i1 +
                                    '/user/id',
                                  schemaPath:
                                    '#/items/properties/text/items/oneOf/5/properties/user/properties/id/pattern',
                                  keyword: 'pattern',
                                  params: { pattern: '^[0-9]+$' },
                                  message:
                                    'must match pattern "' + '^[0-9]+$' + '"',
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
                                  instancePath +
                                  '/' +
                                  i0 +
                                  '/text/' +
                                  i1 +
                                  '/user/id',
                                schemaPath:
                                  '#/items/properties/text/items/oneOf/5/properties/user/properties/id/type',
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
                          if (data31.name !== undefined) {
                            let data33 = data31.name;
                            if (typeof data33 !== 'string' && data33 !== null) {
                              const err84 = {
                                instancePath:
                                  instancePath +
                                  '/' +
                                  i0 +
                                  '/text/' +
                                  i1 +
                                  '/user/name',
                                schemaPath:
                                  '#/items/properties/text/items/oneOf/5/properties/user/properties/name/type',
                                keyword: 'type',
                                params: { type: 'string' },
                                message: 'must be string',
                              };
                              if (vErrors === null) {
                                vErrors = [err84];
                              } else {
                                vErrors.push(err84);
                              }
                              errors++;
                            }
                          }
                          if (data31.username !== undefined) {
                            let data34 = data31.username;
                            if (typeof data34 === 'string') {
                              if (!pattern2.test(data34)) {
                                const err85 = {
                                  instancePath:
                                    instancePath +
                                    '/' +
                                    i0 +
                                    '/text/' +
                                    i1 +
                                    '/user/username',
                                  schemaPath:
                                    '#/items/properties/text/items/oneOf/5/properties/user/properties/username/pattern',
                                  keyword: 'pattern',
                                  params: { pattern: '^[a-zA-Z0-9_]{1,15}$' },
                                  message:
                                    'must match pattern "' +
                                    '^[a-zA-Z0-9_]{1,15}$' +
                                    '"',
                                };
                                if (vErrors === null) {
                                  vErrors = [err85];
                                } else {
                                  vErrors.push(err85);
                                }
                                errors++;
                              }
                            } else {
                              const err86 = {
                                instancePath:
                                  instancePath +
                                  '/' +
                                  i0 +
                                  '/text/' +
                                  i1 +
                                  '/user/username',
                                schemaPath:
                                  '#/items/properties/text/items/oneOf/5/properties/user/properties/username/type',
                                keyword: 'type',
                                params: { type: 'string' },
                                message: 'must be string',
                              };
                              if (vErrors === null) {
                                vErrors = [err86];
                              } else {
                                vErrors.push(err86);
                              }
                              errors++;
                            }
                          }
                        } else {
                          const err87 = {
                            instancePath:
                              instancePath + '/' + i0 + '/text/' + i1 + '/user',
                            schemaPath:
                              '#/items/properties/text/items/oneOf/5/properties/user/type',
                            keyword: 'type',
                            params: { type: 'object' },
                            message: 'must be object',
                          };
                          if (vErrors === null) {
                            vErrors = [err87];
                          } else {
                            vErrors.push(err87);
                          }
                          errors++;
                        }
                      }
                    } else {
                      const err88 = {
                        instancePath: instancePath + '/' + i0 + '/text/' + i1,
                        schemaPath:
                          '#/items/properties/text/items/oneOf/5/type',
                        keyword: 'type',
                        params: { type: 'object' },
                        message: 'must be object',
                      };
                      if (vErrors === null) {
                        vErrors = [err88];
                      } else {
                        vErrors.push(err88);
                      }
                      errors++;
                    }
                  } else {
                    const err89 = {
                      instancePath: instancePath + '/' + i0 + '/text/' + i1,
                      schemaPath: '#/items/properties/text/items/discriminator',
                      keyword: 'discriminator',
                      params: { error: 'mapping', tag: 'type', tagValue: tag0 },
                      message: 'value of tag "type" must be in oneOf',
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
                    instancePath: instancePath + '/' + i0 + '/text/' + i1,
                    schemaPath: '#/items/properties/text/items/discriminator',
                    keyword: 'discriminator',
                    params: { error: 'tag', tag: 'type', tagValue: tag0 },
                    message: 'tag "type" must be string',
                  };
                  if (vErrors === null) {
                    vErrors = [err90];
                  } else {
                    vErrors.push(err90);
                  }
                  errors++;
                }
              } else {
                const err91 = {
                  instancePath: instancePath + '/' + i0 + '/text/' + i1,
                  schemaPath: '#/items/properties/text/items/type',
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
            }
          } else {
            const err92 = {
              instancePath: instancePath + '/' + i0 + '/text',
              schemaPath: '#/items/properties/text/type',
              keyword: 'type',
              params: { type: 'array' },
              message: 'must be array',
            };
            if (vErrors === null) {
              vErrors = [err92];
            } else {
              vErrors.push(err92);
            }
            errors++;
          }
        }
        if (data0.annotations !== undefined) {
          let data35 = data0.annotations;
          if (!Array.isArray(data35) && data35 !== null) {
            const err93 = {
              instancePath: instancePath + '/' + i0 + '/annotations',
              schemaPath: '#/items/properties/annotations/type',
              keyword: 'type',
              params: { type: 'array' },
              message: 'must be array',
            };
            if (vErrors === null) {
              vErrors = [err93];
            } else {
              vErrors.push(err93);
            }
            errors++;
          }
          if (Array.isArray(data35)) {
            const len2 = data35.length;
            for (let i2 = 0; i2 < len2; i2++) {
              let data36 = data35[i2];
              if (
                data36 &&
                typeof data36 == 'object' &&
                !Array.isArray(data36)
              ) {
                if (data36.type === undefined) {
                  const err94 = {
                    instancePath:
                      instancePath + '/' + i0 + '/annotations/' + i2,
                    schemaPath: '#/items/properties/annotations/items/required',
                    keyword: 'required',
                    params: { missingProperty: 'type' },
                    message: "must have required property '" + 'type' + "'",
                  };
                  if (vErrors === null) {
                    vErrors = [err94];
                  } else {
                    vErrors.push(err94);
                  }
                  errors++;
                }
                if (data36.text === undefined) {
                  const err95 = {
                    instancePath:
                      instancePath + '/' + i0 + '/annotations/' + i2,
                    schemaPath: '#/items/properties/annotations/items/required',
                    keyword: 'required',
                    params: { missingProperty: 'text' },
                    message: "must have required property '" + 'text' + "'",
                  };
                  if (vErrors === null) {
                    vErrors = [err95];
                  } else {
                    vErrors.push(err95);
                  }
                  errors++;
                }
                if (data36.probability === undefined) {
                  const err96 = {
                    instancePath:
                      instancePath + '/' + i0 + '/annotations/' + i2,
                    schemaPath: '#/items/properties/annotations/items/required',
                    keyword: 'required',
                    params: { missingProperty: 'probability' },
                    message:
                      "must have required property '" + 'probability' + "'",
                  };
                  if (vErrors === null) {
                    vErrors = [err96];
                  } else {
                    vErrors.push(err96);
                  }
                  errors++;
                }
                if (data36.annotation_type === undefined) {
                  const err97 = {
                    instancePath:
                      instancePath + '/' + i0 + '/annotations/' + i2,
                    schemaPath: '#/items/properties/annotations/items/required',
                    keyword: 'required',
                    params: { missingProperty: 'annotation_type' },
                    message:
                      "must have required property '" + 'annotation_type' + "'",
                  };
                  if (vErrors === null) {
                    vErrors = [err97];
                  } else {
                    vErrors.push(err97);
                  }
                  errors++;
                }
                if (data36.normalized_text === undefined) {
                  const err98 = {
                    instancePath:
                      instancePath + '/' + i0 + '/annotations/' + i2,
                    schemaPath: '#/items/properties/annotations/items/required',
                    keyword: 'required',
                    params: { missingProperty: 'normalized_text' },
                    message:
                      "must have required property '" + 'normalized_text' + "'",
                  };
                  if (vErrors === null) {
                    vErrors = [err98];
                  } else {
                    vErrors.push(err98);
                  }
                  errors++;
                }
                for (const key9 in data36) {
                  if (
                    !(
                      key9 === 'type' ||
                      key9 === 'text' ||
                      key9 === 'probability' ||
                      key9 === 'annotation_type' ||
                      key9 === 'normalized_text'
                    )
                  ) {
                    const err99 = {
                      instancePath:
                        instancePath + '/' + i0 + '/annotations/' + i2,
                      schemaPath:
                        '#/items/properties/annotations/items/additionalProperties',
                      keyword: 'additionalProperties',
                      params: { additionalProperty: key9 },
                      message: 'must NOT have additional properties',
                    };
                    if (vErrors === null) {
                      vErrors = [err99];
                    } else {
                      vErrors.push(err99);
                    }
                    errors++;
                  }
                }
                if (data36.type !== undefined) {
                  let data37 = data36.type;
                  if (typeof data37 !== 'string') {
                    const err100 = {
                      instancePath:
                        instancePath +
                        '/' +
                        i0 +
                        '/annotations/' +
                        i2 +
                        '/type',
                      schemaPath:
                        '#/items/properties/annotations/items/properties/type/type',
                      keyword: 'type',
                      params: { type: 'string' },
                      message: 'must be string',
                    };
                    if (vErrors === null) {
                      vErrors = [err100];
                    } else {
                      vErrors.push(err100);
                    }
                    errors++;
                  }
                  if ('annotation' !== data37) {
                    const err101 = {
                      instancePath:
                        instancePath +
                        '/' +
                        i0 +
                        '/annotations/' +
                        i2 +
                        '/type',
                      schemaPath:
                        '#/items/properties/annotations/items/properties/type/const',
                      keyword: 'const',
                      params: { allowedValue: 'annotation' },
                      message: 'must be equal to constant',
                    };
                    if (vErrors === null) {
                      vErrors = [err101];
                    } else {
                      vErrors.push(err101);
                    }
                    errors++;
                  }
                }
                if (data36.text !== undefined) {
                  if (typeof data36.text !== 'string') {
                    const err102 = {
                      instancePath:
                        instancePath +
                        '/' +
                        i0 +
                        '/annotations/' +
                        i2 +
                        '/text',
                      schemaPath:
                        '#/items/properties/annotations/items/properties/text/type',
                      keyword: 'type',
                      params: { type: 'string' },
                      message: 'must be string',
                    };
                    if (vErrors === null) {
                      vErrors = [err102];
                    } else {
                      vErrors.push(err102);
                    }
                    errors++;
                  }
                }
                if (data36.probability !== undefined) {
                  let data39 = data36.probability;
                  if (!(typeof data39 == 'number' && isFinite(data39))) {
                    const err103 = {
                      instancePath:
                        instancePath +
                        '/' +
                        i0 +
                        '/annotations/' +
                        i2 +
                        '/probability',
                      schemaPath:
                        '#/items/properties/annotations/items/properties/probability/type',
                      keyword: 'type',
                      params: { type: 'number' },
                      message: 'must be number',
                    };
                    if (vErrors === null) {
                      vErrors = [err103];
                    } else {
                      vErrors.push(err103);
                    }
                    errors++;
                  }
                }
                if (data36.annotation_type !== undefined) {
                  if (typeof data36.annotation_type !== 'string') {
                    const err104 = {
                      instancePath:
                        instancePath +
                        '/' +
                        i0 +
                        '/annotations/' +
                        i2 +
                        '/annotation_type',
                      schemaPath:
                        '#/items/properties/annotations/items/properties/annotation_type/type',
                      keyword: 'type',
                      params: { type: 'string' },
                      message: 'must be string',
                    };
                    if (vErrors === null) {
                      vErrors = [err104];
                    } else {
                      vErrors.push(err104);
                    }
                    errors++;
                  }
                }
                if (data36.normalized_text !== undefined) {
                  if (typeof data36.normalized_text !== 'string') {
                    const err105 = {
                      instancePath:
                        instancePath +
                        '/' +
                        i0 +
                        '/annotations/' +
                        i2 +
                        '/normalized_text',
                      schemaPath:
                        '#/items/properties/annotations/items/properties/normalized_text/type',
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
              } else {
                const err106 = {
                  instancePath: instancePath + '/' + i0 + '/annotations/' + i2,
                  schemaPath: '#/items/properties/annotations/items/type',
                  keyword: 'type',
                  params: { type: 'object' },
                  message: 'must be object',
                };
                if (vErrors === null) {
                  vErrors = [err106];
                } else {
                  vErrors.push(err106);
                }
                errors++;
              }
            }
          }
        }
        if (data0.referenced_tweets !== undefined) {
          let data42 = data0.referenced_tweets;
          if (!Array.isArray(data42) && data42 !== null) {
            const err107 = {
              instancePath: instancePath + '/' + i0 + '/referenced_tweets',
              schemaPath: '#/items/properties/referenced_tweets/type',
              keyword: 'type',
              params: { type: 'array' },
              message: 'must be array',
            };
            if (vErrors === null) {
              vErrors = [err107];
            } else {
              vErrors.push(err107);
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
                  const err108 = {
                    instancePath:
                      instancePath + '/' + i0 + '/referenced_tweets/' + i3,
                    schemaPath:
                      '#/items/properties/referenced_tweets/items/required',
                    keyword: 'required',
                    params: { missingProperty: 'type' },
                    message: "must have required property '" + 'type' + "'",
                  };
                  if (vErrors === null) {
                    vErrors = [err108];
                  } else {
                    vErrors.push(err108);
                  }
                  errors++;
                }
                if (data43.id === undefined) {
                  const err109 = {
                    instancePath:
                      instancePath + '/' + i0 + '/referenced_tweets/' + i3,
                    schemaPath:
                      '#/items/properties/referenced_tweets/items/required',
                    keyword: 'required',
                    params: { missingProperty: 'id' },
                    message: "must have required property '" + 'id' + "'",
                  };
                  if (vErrors === null) {
                    vErrors = [err109];
                  } else {
                    vErrors.push(err109);
                  }
                  errors++;
                }
                for (const key10 in data43) {
                  if (!(key10 === 'type' || key10 === 'id')) {
                    const err110 = {
                      instancePath:
                        instancePath + '/' + i0 + '/referenced_tweets/' + i3,
                      schemaPath:
                        '#/items/properties/referenced_tweets/items/additionalProperties',
                      keyword: 'additionalProperties',
                      params: { additionalProperty: key10 },
                      message: 'must NOT have additional properties',
                    };
                    if (vErrors === null) {
                      vErrors = [err110];
                    } else {
                      vErrors.push(err110);
                    }
                    errors++;
                  }
                }
                if (data43.type !== undefined) {
                  let data44 = data43.type;
                  if (typeof data44 !== 'string') {
                    const err111 = {
                      instancePath:
                        instancePath +
                        '/' +
                        i0 +
                        '/referenced_tweets/' +
                        i3 +
                        '/type',
                      schemaPath:
                        '#/items/properties/referenced_tweets/items/properties/type/type',
                      keyword: 'type',
                      params: { type: 'string' },
                      message: 'must be string',
                    };
                    if (vErrors === null) {
                      vErrors = [err111];
                    } else {
                      vErrors.push(err111);
                    }
                    errors++;
                  }
                  if (
                    !(
                      data44 === 'retweeted' ||
                      data44 === 'quoted' ||
                      data44 === 'replied_to'
                    )
                  ) {
                    const err112 = {
                      instancePath:
                        instancePath +
                        '/' +
                        i0 +
                        '/referenced_tweets/' +
                        i3 +
                        '/type',
                      schemaPath:
                        '#/items/properties/referenced_tweets/items/properties/type/enum',
                      keyword: 'enum',
                      params: {
                        allowedValues:
                          schema11.items.properties.referenced_tweets.items
                            .properties.type.enum,
                      },
                      message: 'must be equal to one of the allowed values',
                    };
                    if (vErrors === null) {
                      vErrors = [err112];
                    } else {
                      vErrors.push(err112);
                    }
                    errors++;
                  }
                }
                if (data43.id !== undefined) {
                  let data45 = data43.id;
                  if (typeof data45 === 'string') {
                    if (!pattern0.test(data45)) {
                      const err113 = {
                        instancePath:
                          instancePath +
                          '/' +
                          i0 +
                          '/referenced_tweets/' +
                          i3 +
                          '/id',
                        schemaPath:
                          '#/items/properties/referenced_tweets/items/properties/id/pattern',
                        keyword: 'pattern',
                        params: { pattern: '^[0-9]+$' },
                        message: 'must match pattern "' + '^[0-9]+$' + '"',
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
                      instancePath:
                        instancePath +
                        '/' +
                        i0 +
                        '/referenced_tweets/' +
                        i3 +
                        '/id',
                      schemaPath:
                        '#/items/properties/referenced_tweets/items/properties/id/type',
                      keyword: 'type',
                      params: { type: 'string' },
                      message: 'must be string',
                    };
                    if (vErrors === null) {
                      vErrors = [err114];
                    } else {
                      vErrors.push(err114);
                    }
                    errors++;
                  }
                }
              } else {
                const err115 = {
                  instancePath:
                    instancePath + '/' + i0 + '/referenced_tweets/' + i3,
                  schemaPath: '#/items/properties/referenced_tweets/items/type',
                  keyword: 'type',
                  params: { type: 'object' },
                  message: 'must be object',
                };
                if (vErrors === null) {
                  vErrors = [err115];
                } else {
                  vErrors.push(err115);
                }
                errors++;
              }
            }
          }
        }
      } else {
        const err116 = {
          instancePath: instancePath + '/' + i0,
          schemaPath: '#/items/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        };
        if (vErrors === null) {
          vErrors = [err116];
        } else {
          vErrors.push(err116);
        }
        errors++;
      }
    }
  } else {
    const err117 = {
      instancePath,
      schemaPath: '#/type',
      keyword: 'type',
      params: { type: 'array' },
      message: 'must be array',
    };
    if (vErrors === null) {
      vErrors = [err117];
    } else {
      vErrors.push(err117);
    }
    errors++;
  }
  validate10.errors = vErrors;
  return errors === 0;
}
