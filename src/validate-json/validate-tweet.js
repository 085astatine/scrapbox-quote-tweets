'use strict';
module.exports = validate10;
module.exports.default = validate10;
const schema11 = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    timestamp: { type: 'integer' },
    author: {
      type: 'object',
      properties: { name: { type: 'string' }, username: { type: 'string' } },
      required: ['name', 'username'],
      additionalProperties: false,
    },
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
              short_url: { type: 'string', format: 'uri' },
              expanded_url: { type: 'string', format: 'uri' },
              decoded_url: { type: 'string', format: 'iri' },
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
                url: { type: 'string', format: 'uri' },
                expanded_url: { type: 'string', format: 'uri' },
                decoded_url: { type: 'string', format: 'iri' },
                title: { type: 'string', nullable: true },
              },
              required: ['url', 'expanded_url', 'decoded_url'],
              additionalProperties: false,
              nullable: true,
            },
            media_url: { type: 'string', format: 'uri' },
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
                url: { type: 'string', format: 'uri' },
                expanded_url: { type: 'string', format: 'uri' },
                decoded_url: { type: 'string', format: 'iri' },
                title: { type: 'string', nullable: true },
              },
              required: ['url', 'expanded_url', 'decoded_url'],
              additionalProperties: false,
              nullable: true,
            },
            media_urls: {
              type: 'array',
              items: { type: 'string', format: 'uri' },
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
              url: { type: 'string', format: 'uri' },
            },
            required: ['type', 'url'],
            additionalProperties: false,
          },
          {
            type: 'object',
            properties: {
              type: { type: 'string', const: 'video' },
              thumbnail: { type: 'string', format: 'uri' },
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
};
const formats0 = require('ajv-formats/dist/formats').fullFormats.uri;
const formats4 = require('ajv-formats-draft2019/formats').iri;
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
            schemaPath: '#/properties/author/required',
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
            schemaPath: '#/properties/author/required',
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
              schemaPath: '#/properties/author/additionalProperties',
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
              schemaPath: '#/properties/author/properties/name/type',
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
              schemaPath: '#/properties/author/properties/username/type',
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
          schemaPath: '#/properties/author/type',
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
          let data6 = data5[i0];
          if (data6 && typeof data6 == 'object' && !Array.isArray(data6)) {
            if (data6.type === undefined) {
              const err13 = {
                instancePath: instancePath + '/text/' + i0,
                schemaPath: '#/properties/text/items/required',
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
            const tag0 = data6.type;
            if (typeof tag0 == 'string') {
              if (tag0 === 'text') {
                if (
                  data6 &&
                  typeof data6 == 'object' &&
                  !Array.isArray(data6)
                ) {
                  if (data6.type === undefined) {
                    const err14 = {
                      instancePath: instancePath + '/text/' + i0,
                      schemaPath: '#/properties/text/items/oneOf/0/required',
                      keyword: 'required',
                      params: { missingProperty: 'type' },
                      message: "must have required property '" + 'type' + "'",
                    };
                    if (vErrors === null) {
                      vErrors = [err14];
                    } else {
                      vErrors.push(err14);
                    }
                    errors++;
                  }
                  if (data6.text === undefined) {
                    const err15 = {
                      instancePath: instancePath + '/text/' + i0,
                      schemaPath: '#/properties/text/items/oneOf/0/required',
                      keyword: 'required',
                      params: { missingProperty: 'text' },
                      message: "must have required property '" + 'text' + "'",
                    };
                    if (vErrors === null) {
                      vErrors = [err15];
                    } else {
                      vErrors.push(err15);
                    }
                    errors++;
                  }
                  for (const key2 in data6) {
                    if (!(key2 === 'type' || key2 === 'text')) {
                      const err16 = {
                        instancePath: instancePath + '/text/' + i0,
                        schemaPath:
                          '#/properties/text/items/oneOf/0/additionalProperties',
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
                  if (data6.type !== undefined) {
                    let data7 = data6.type;
                    if (typeof data7 !== 'string') {
                      const err17 = {
                        instancePath: instancePath + '/text/' + i0 + '/type',
                        schemaPath:
                          '#/properties/text/items/oneOf/0/properties/type/type',
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
                    if ('text' !== data7) {
                      const err18 = {
                        instancePath: instancePath + '/text/' + i0 + '/type',
                        schemaPath:
                          '#/properties/text/items/oneOf/0/properties/type/const',
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
                  if (data6.text !== undefined) {
                    if (typeof data6.text !== 'string') {
                      const err19 = {
                        instancePath: instancePath + '/text/' + i0 + '/text',
                        schemaPath:
                          '#/properties/text/items/oneOf/0/properties/text/type',
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
                    instancePath: instancePath + '/text/' + i0,
                    schemaPath: '#/properties/text/items/oneOf/0/type',
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
                  data6 &&
                  typeof data6 == 'object' &&
                  !Array.isArray(data6)
                ) {
                  if (data6.type === undefined) {
                    const err21 = {
                      instancePath: instancePath + '/text/' + i0,
                      schemaPath: '#/properties/text/items/oneOf/1/required',
                      keyword: 'required',
                      params: { missingProperty: 'type' },
                      message: "must have required property '" + 'type' + "'",
                    };
                    if (vErrors === null) {
                      vErrors = [err21];
                    } else {
                      vErrors.push(err21);
                    }
                    errors++;
                  }
                  if (data6.text === undefined) {
                    const err22 = {
                      instancePath: instancePath + '/text/' + i0,
                      schemaPath: '#/properties/text/items/oneOf/1/required',
                      keyword: 'required',
                      params: { missingProperty: 'text' },
                      message: "must have required property '" + 'text' + "'",
                    };
                    if (vErrors === null) {
                      vErrors = [err22];
                    } else {
                      vErrors.push(err22);
                    }
                    errors++;
                  }
                  if (data6.short_url === undefined) {
                    const err23 = {
                      instancePath: instancePath + '/text/' + i0,
                      schemaPath: '#/properties/text/items/oneOf/1/required',
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
                  if (data6.expanded_url === undefined) {
                    const err24 = {
                      instancePath: instancePath + '/text/' + i0,
                      schemaPath: '#/properties/text/items/oneOf/1/required',
                      keyword: 'required',
                      params: { missingProperty: 'expanded_url' },
                      message:
                        "must have required property '" + 'expanded_url' + "'",
                    };
                    if (vErrors === null) {
                      vErrors = [err24];
                    } else {
                      vErrors.push(err24);
                    }
                    errors++;
                  }
                  if (data6.decoded_url === undefined) {
                    const err25 = {
                      instancePath: instancePath + '/text/' + i0,
                      schemaPath: '#/properties/text/items/oneOf/1/required',
                      keyword: 'required',
                      params: { missingProperty: 'decoded_url' },
                      message:
                        "must have required property '" + 'decoded_url' + "'",
                    };
                    if (vErrors === null) {
                      vErrors = [err25];
                    } else {
                      vErrors.push(err25);
                    }
                    errors++;
                  }
                  for (const key3 in data6) {
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
                        instancePath: instancePath + '/text/' + i0,
                        schemaPath:
                          '#/properties/text/items/oneOf/1/additionalProperties',
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
                  if (data6.type !== undefined) {
                    let data9 = data6.type;
                    if (typeof data9 !== 'string') {
                      const err27 = {
                        instancePath: instancePath + '/text/' + i0 + '/type',
                        schemaPath:
                          '#/properties/text/items/oneOf/1/properties/type/type',
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
                    if ('url' !== data9) {
                      const err28 = {
                        instancePath: instancePath + '/text/' + i0 + '/type',
                        schemaPath:
                          '#/properties/text/items/oneOf/1/properties/type/const',
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
                  if (data6.text !== undefined) {
                    if (typeof data6.text !== 'string') {
                      const err29 = {
                        instancePath: instancePath + '/text/' + i0 + '/text',
                        schemaPath:
                          '#/properties/text/items/oneOf/1/properties/text/type',
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
                  if (data6.short_url !== undefined) {
                    let data11 = data6.short_url;
                    if (typeof data11 === 'string') {
                      if (!formats0(data11)) {
                        const err30 = {
                          instancePath:
                            instancePath + '/text/' + i0 + '/short_url',
                          schemaPath:
                            '#/properties/text/items/oneOf/1/properties/short_url/format',
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
                          instancePath + '/text/' + i0 + '/short_url',
                        schemaPath:
                          '#/properties/text/items/oneOf/1/properties/short_url/type',
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
                  if (data6.expanded_url !== undefined) {
                    let data12 = data6.expanded_url;
                    if (typeof data12 === 'string') {
                      if (!formats0(data12)) {
                        const err32 = {
                          instancePath:
                            instancePath + '/text/' + i0 + '/expanded_url',
                          schemaPath:
                            '#/properties/text/items/oneOf/1/properties/expanded_url/format',
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
                          instancePath + '/text/' + i0 + '/expanded_url',
                        schemaPath:
                          '#/properties/text/items/oneOf/1/properties/expanded_url/type',
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
                  if (data6.decoded_url !== undefined) {
                    let data13 = data6.decoded_url;
                    if (typeof data13 === 'string') {
                      if (!formats4(data13)) {
                        const err34 = {
                          instancePath:
                            instancePath + '/text/' + i0 + '/decoded_url',
                          schemaPath:
                            '#/properties/text/items/oneOf/1/properties/decoded_url/format',
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
                          instancePath + '/text/' + i0 + '/decoded_url',
                        schemaPath:
                          '#/properties/text/items/oneOf/1/properties/decoded_url/type',
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
                  if (data6.title !== undefined) {
                    let data14 = data6.title;
                    if (typeof data14 !== 'string' && data14 !== null) {
                      const err36 = {
                        instancePath: instancePath + '/text/' + i0 + '/title',
                        schemaPath:
                          '#/properties/text/items/oneOf/1/properties/title/type',
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
                    instancePath: instancePath + '/text/' + i0,
                    schemaPath: '#/properties/text/items/oneOf/1/type',
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
                  data6 &&
                  typeof data6 == 'object' &&
                  !Array.isArray(data6)
                ) {
                  if (data6.type === undefined) {
                    const err38 = {
                      instancePath: instancePath + '/text/' + i0,
                      schemaPath: '#/properties/text/items/oneOf/2/required',
                      keyword: 'required',
                      params: { missingProperty: 'type' },
                      message: "must have required property '" + 'type' + "'",
                    };
                    if (vErrors === null) {
                      vErrors = [err38];
                    } else {
                      vErrors.push(err38);
                    }
                    errors++;
                  }
                  if (data6.text === undefined) {
                    const err39 = {
                      instancePath: instancePath + '/text/' + i0,
                      schemaPath: '#/properties/text/items/oneOf/2/required',
                      keyword: 'required',
                      params: { missingProperty: 'text' },
                      message: "must have required property '" + 'text' + "'",
                    };
                    if (vErrors === null) {
                      vErrors = [err39];
                    } else {
                      vErrors.push(err39);
                    }
                    errors++;
                  }
                  if (data6.tag === undefined) {
                    const err40 = {
                      instancePath: instancePath + '/text/' + i0,
                      schemaPath: '#/properties/text/items/oneOf/2/required',
                      keyword: 'required',
                      params: { missingProperty: 'tag' },
                      message: "must have required property '" + 'tag' + "'",
                    };
                    if (vErrors === null) {
                      vErrors = [err40];
                    } else {
                      vErrors.push(err40);
                    }
                    errors++;
                  }
                  for (const key4 in data6) {
                    if (
                      !(
                        key4 === 'type' ||
                        key4 === 'text' ||
                        key4 === 'tag' ||
                        key4 === 'hashmoji'
                      )
                    ) {
                      const err41 = {
                        instancePath: instancePath + '/text/' + i0,
                        schemaPath:
                          '#/properties/text/items/oneOf/2/additionalProperties',
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
                  if (data6.type !== undefined) {
                    let data15 = data6.type;
                    if (typeof data15 !== 'string') {
                      const err42 = {
                        instancePath: instancePath + '/text/' + i0 + '/type',
                        schemaPath:
                          '#/properties/text/items/oneOf/2/properties/type/type',
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
                    if ('hashtag' !== data15) {
                      const err43 = {
                        instancePath: instancePath + '/text/' + i0 + '/type',
                        schemaPath:
                          '#/properties/text/items/oneOf/2/properties/type/const',
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
                  if (data6.text !== undefined) {
                    if (typeof data6.text !== 'string') {
                      const err44 = {
                        instancePath: instancePath + '/text/' + i0 + '/text',
                        schemaPath:
                          '#/properties/text/items/oneOf/2/properties/text/type',
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
                  if (data6.tag !== undefined) {
                    if (typeof data6.tag !== 'string') {
                      const err45 = {
                        instancePath: instancePath + '/text/' + i0 + '/tag',
                        schemaPath:
                          '#/properties/text/items/oneOf/2/properties/tag/type',
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
                  if (data6.hashmoji !== undefined) {
                    let data18 = data6.hashmoji;
                    if (typeof data18 !== 'string' && data18 !== null) {
                      const err46 = {
                        instancePath:
                          instancePath + '/text/' + i0 + '/hashmoji',
                        schemaPath:
                          '#/properties/text/items/oneOf/2/properties/hashmoji/type',
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
                    instancePath: instancePath + '/text/' + i0,
                    schemaPath: '#/properties/text/items/oneOf/2/type',
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
                  data6 &&
                  typeof data6 == 'object' &&
                  !Array.isArray(data6)
                ) {
                  if (data6.type === undefined) {
                    const err48 = {
                      instancePath: instancePath + '/text/' + i0,
                      schemaPath: '#/properties/text/items/oneOf/3/required',
                      keyword: 'required',
                      params: { missingProperty: 'type' },
                      message: "must have required property '" + 'type' + "'",
                    };
                    if (vErrors === null) {
                      vErrors = [err48];
                    } else {
                      vErrors.push(err48);
                    }
                    errors++;
                  }
                  if (data6.text === undefined) {
                    const err49 = {
                      instancePath: instancePath + '/text/' + i0,
                      schemaPath: '#/properties/text/items/oneOf/3/required',
                      keyword: 'required',
                      params: { missingProperty: 'text' },
                      message: "must have required property '" + 'text' + "'",
                    };
                    if (vErrors === null) {
                      vErrors = [err49];
                    } else {
                      vErrors.push(err49);
                    }
                    errors++;
                  }
                  if (data6.tag === undefined) {
                    const err50 = {
                      instancePath: instancePath + '/text/' + i0,
                      schemaPath: '#/properties/text/items/oneOf/3/required',
                      keyword: 'required',
                      params: { missingProperty: 'tag' },
                      message: "must have required property '" + 'tag' + "'",
                    };
                    if (vErrors === null) {
                      vErrors = [err50];
                    } else {
                      vErrors.push(err50);
                    }
                    errors++;
                  }
                  for (const key5 in data6) {
                    if (
                      !(key5 === 'type' || key5 === 'text' || key5 === 'tag')
                    ) {
                      const err51 = {
                        instancePath: instancePath + '/text/' + i0,
                        schemaPath:
                          '#/properties/text/items/oneOf/3/additionalProperties',
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
                  if (data6.type !== undefined) {
                    let data19 = data6.type;
                    if (typeof data19 !== 'string') {
                      const err52 = {
                        instancePath: instancePath + '/text/' + i0 + '/type',
                        schemaPath:
                          '#/properties/text/items/oneOf/3/properties/type/type',
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
                    if ('cashtag' !== data19) {
                      const err53 = {
                        instancePath: instancePath + '/text/' + i0 + '/type',
                        schemaPath:
                          '#/properties/text/items/oneOf/3/properties/type/const',
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
                  if (data6.text !== undefined) {
                    if (typeof data6.text !== 'string') {
                      const err54 = {
                        instancePath: instancePath + '/text/' + i0 + '/text',
                        schemaPath:
                          '#/properties/text/items/oneOf/3/properties/text/type',
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
                  if (data6.tag !== undefined) {
                    if (typeof data6.tag !== 'string') {
                      const err55 = {
                        instancePath: instancePath + '/text/' + i0 + '/tag',
                        schemaPath:
                          '#/properties/text/items/oneOf/3/properties/tag/type',
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
                    instancePath: instancePath + '/text/' + i0,
                    schemaPath: '#/properties/text/items/oneOf/3/type',
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
                  data6 &&
                  typeof data6 == 'object' &&
                  !Array.isArray(data6)
                ) {
                  if (data6.type === undefined) {
                    const err57 = {
                      instancePath: instancePath + '/text/' + i0,
                      schemaPath: '#/properties/text/items/oneOf/4/required',
                      keyword: 'required',
                      params: { missingProperty: 'type' },
                      message: "must have required property '" + 'type' + "'",
                    };
                    if (vErrors === null) {
                      vErrors = [err57];
                    } else {
                      vErrors.push(err57);
                    }
                    errors++;
                  }
                  if (data6.text === undefined) {
                    const err58 = {
                      instancePath: instancePath + '/text/' + i0,
                      schemaPath: '#/properties/text/items/oneOf/4/required',
                      keyword: 'required',
                      params: { missingProperty: 'text' },
                      message: "must have required property '" + 'text' + "'",
                    };
                    if (vErrors === null) {
                      vErrors = [err58];
                    } else {
                      vErrors.push(err58);
                    }
                    errors++;
                  }
                  if (data6.username === undefined) {
                    const err59 = {
                      instancePath: instancePath + '/text/' + i0,
                      schemaPath: '#/properties/text/items/oneOf/4/required',
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
                  for (const key6 in data6) {
                    if (
                      !(
                        key6 === 'type' ||
                        key6 === 'text' ||
                        key6 === 'username'
                      )
                    ) {
                      const err60 = {
                        instancePath: instancePath + '/text/' + i0,
                        schemaPath:
                          '#/properties/text/items/oneOf/4/additionalProperties',
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
                  if (data6.type !== undefined) {
                    let data22 = data6.type;
                    if (typeof data22 !== 'string') {
                      const err61 = {
                        instancePath: instancePath + '/text/' + i0 + '/type',
                        schemaPath:
                          '#/properties/text/items/oneOf/4/properties/type/type',
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
                    if ('mention' !== data22) {
                      const err62 = {
                        instancePath: instancePath + '/text/' + i0 + '/type',
                        schemaPath:
                          '#/properties/text/items/oneOf/4/properties/type/const',
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
                  if (data6.text !== undefined) {
                    if (typeof data6.text !== 'string') {
                      const err63 = {
                        instancePath: instancePath + '/text/' + i0 + '/text',
                        schemaPath:
                          '#/properties/text/items/oneOf/4/properties/text/type',
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
                  if (data6.username !== undefined) {
                    if (typeof data6.username !== 'string') {
                      const err64 = {
                        instancePath:
                          instancePath + '/text/' + i0 + '/username',
                        schemaPath:
                          '#/properties/text/items/oneOf/4/properties/username/type',
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
                    instancePath: instancePath + '/text/' + i0,
                    schemaPath: '#/properties/text/items/oneOf/4/type',
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
                  instancePath: instancePath + '/text/' + i0,
                  schemaPath: '#/properties/text/items/discriminator',
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
                instancePath: instancePath + '/text/' + i0,
                schemaPath: '#/properties/text/items/discriminator',
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
              instancePath: instancePath + '/text/' + i0,
              schemaPath: '#/properties/text/items/type',
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
          instancePath: instancePath + '/text',
          schemaPath: '#/properties/text/type',
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
    if (data.card !== undefined) {
      let data25 = data.card;
      if (
        !(data25 && typeof data25 == 'object' && !Array.isArray(data25)) &&
        data25 !== null
      ) {
        const err70 = {
          instancePath: instancePath + '/card',
          schemaPath: '#/properties/card/type',
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
      if (data25 && typeof data25 == 'object' && !Array.isArray(data25)) {
        if (data25.type === undefined) {
          const err71 = {
            instancePath: instancePath + '/card',
            schemaPath: '#/properties/card/required',
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
        const tag1 = data25.type;
        if (typeof tag1 == 'string') {
          if (tag1 === 'single') {
            if (data25 && typeof data25 == 'object' && !Array.isArray(data25)) {
              if (data25.type === undefined) {
                const err72 = {
                  instancePath: instancePath + '/card',
                  schemaPath: '#/properties/card/oneOf/0/required',
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
              if (data25.media_url === undefined) {
                const err73 = {
                  instancePath: instancePath + '/card',
                  schemaPath: '#/properties/card/oneOf/0/required',
                  keyword: 'required',
                  params: { missingProperty: 'media_url' },
                  message: "must have required property '" + 'media_url' + "'",
                };
                if (vErrors === null) {
                  vErrors = [err73];
                } else {
                  vErrors.push(err73);
                }
                errors++;
              }
              for (const key7 in data25) {
                if (
                  !(key7 === 'type' || key7 === 'link' || key7 === 'media_url')
                ) {
                  const err74 = {
                    instancePath: instancePath + '/card',
                    schemaPath:
                      '#/properties/card/oneOf/0/additionalProperties',
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
              if (data25.type !== undefined) {
                let data26 = data25.type;
                if (typeof data26 !== 'string') {
                  const err75 = {
                    instancePath: instancePath + '/card/type',
                    schemaPath:
                      '#/properties/card/oneOf/0/properties/type/type',
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
                if ('single' !== data26) {
                  const err76 = {
                    instancePath: instancePath + '/card/type',
                    schemaPath:
                      '#/properties/card/oneOf/0/properties/type/const',
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
              if (data25.link !== undefined) {
                let data27 = data25.link;
                if (
                  !(
                    data27 &&
                    typeof data27 == 'object' &&
                    !Array.isArray(data27)
                  ) &&
                  data27 !== null
                ) {
                  const err77 = {
                    instancePath: instancePath + '/card/link',
                    schemaPath:
                      '#/properties/card/oneOf/0/properties/link/type',
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
                  data27 &&
                  typeof data27 == 'object' &&
                  !Array.isArray(data27)
                ) {
                  if (data27.url === undefined) {
                    const err78 = {
                      instancePath: instancePath + '/card/link',
                      schemaPath:
                        '#/properties/card/oneOf/0/properties/link/required',
                      keyword: 'required',
                      params: { missingProperty: 'url' },
                      message: "must have required property '" + 'url' + "'",
                    };
                    if (vErrors === null) {
                      vErrors = [err78];
                    } else {
                      vErrors.push(err78);
                    }
                    errors++;
                  }
                  if (data27.expanded_url === undefined) {
                    const err79 = {
                      instancePath: instancePath + '/card/link',
                      schemaPath:
                        '#/properties/card/oneOf/0/properties/link/required',
                      keyword: 'required',
                      params: { missingProperty: 'expanded_url' },
                      message:
                        "must have required property '" + 'expanded_url' + "'",
                    };
                    if (vErrors === null) {
                      vErrors = [err79];
                    } else {
                      vErrors.push(err79);
                    }
                    errors++;
                  }
                  if (data27.decoded_url === undefined) {
                    const err80 = {
                      instancePath: instancePath + '/card/link',
                      schemaPath:
                        '#/properties/card/oneOf/0/properties/link/required',
                      keyword: 'required',
                      params: { missingProperty: 'decoded_url' },
                      message:
                        "must have required property '" + 'decoded_url' + "'",
                    };
                    if (vErrors === null) {
                      vErrors = [err80];
                    } else {
                      vErrors.push(err80);
                    }
                    errors++;
                  }
                  for (const key8 in data27) {
                    if (
                      !(
                        key8 === 'url' ||
                        key8 === 'expanded_url' ||
                        key8 === 'decoded_url' ||
                        key8 === 'title'
                      )
                    ) {
                      const err81 = {
                        instancePath: instancePath + '/card/link',
                        schemaPath:
                          '#/properties/card/oneOf/0/properties/link/additionalProperties',
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
                  if (data27.url !== undefined) {
                    let data28 = data27.url;
                    if (typeof data28 === 'string') {
                      if (!formats0(data28)) {
                        const err82 = {
                          instancePath: instancePath + '/card/link/url',
                          schemaPath:
                            '#/properties/card/oneOf/0/properties/link/properties/url/format',
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
                        instancePath: instancePath + '/card/link/url',
                        schemaPath:
                          '#/properties/card/oneOf/0/properties/link/properties/url/type',
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
                  if (data27.expanded_url !== undefined) {
                    let data29 = data27.expanded_url;
                    if (typeof data29 === 'string') {
                      if (!formats0(data29)) {
                        const err84 = {
                          instancePath:
                            instancePath + '/card/link/expanded_url',
                          schemaPath:
                            '#/properties/card/oneOf/0/properties/link/properties/expanded_url/format',
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
                        instancePath: instancePath + '/card/link/expanded_url',
                        schemaPath:
                          '#/properties/card/oneOf/0/properties/link/properties/expanded_url/type',
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
                  if (data27.decoded_url !== undefined) {
                    let data30 = data27.decoded_url;
                    if (typeof data30 === 'string') {
                      if (!formats4(data30)) {
                        const err86 = {
                          instancePath: instancePath + '/card/link/decoded_url',
                          schemaPath:
                            '#/properties/card/oneOf/0/properties/link/properties/decoded_url/format',
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
                        instancePath: instancePath + '/card/link/decoded_url',
                        schemaPath:
                          '#/properties/card/oneOf/0/properties/link/properties/decoded_url/type',
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
                  if (data27.title !== undefined) {
                    let data31 = data27.title;
                    if (typeof data31 !== 'string' && data31 !== null) {
                      const err88 = {
                        instancePath: instancePath + '/card/link/title',
                        schemaPath:
                          '#/properties/card/oneOf/0/properties/link/properties/title/type',
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
              if (data25.media_url !== undefined) {
                let data32 = data25.media_url;
                if (typeof data32 === 'string') {
                  if (!formats0(data32)) {
                    const err89 = {
                      instancePath: instancePath + '/card/media_url',
                      schemaPath:
                        '#/properties/card/oneOf/0/properties/media_url/format',
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
                    instancePath: instancePath + '/card/media_url',
                    schemaPath:
                      '#/properties/card/oneOf/0/properties/media_url/type',
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
                instancePath: instancePath + '/card',
                schemaPath: '#/properties/card/oneOf/0/type',
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
            if (data25 && typeof data25 == 'object' && !Array.isArray(data25)) {
              if (data25.type === undefined) {
                const err92 = {
                  instancePath: instancePath + '/card',
                  schemaPath: '#/properties/card/oneOf/1/required',
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
              if (data25.media_urls === undefined) {
                const err93 = {
                  instancePath: instancePath + '/card',
                  schemaPath: '#/properties/card/oneOf/1/required',
                  keyword: 'required',
                  params: { missingProperty: 'media_urls' },
                  message: "must have required property '" + 'media_urls' + "'",
                };
                if (vErrors === null) {
                  vErrors = [err93];
                } else {
                  vErrors.push(err93);
                }
                errors++;
              }
              for (const key9 in data25) {
                if (
                  !(key9 === 'type' || key9 === 'link' || key9 === 'media_urls')
                ) {
                  const err94 = {
                    instancePath: instancePath + '/card',
                    schemaPath:
                      '#/properties/card/oneOf/1/additionalProperties',
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
              if (data25.type !== undefined) {
                let data33 = data25.type;
                if (typeof data33 !== 'string') {
                  const err95 = {
                    instancePath: instancePath + '/card/type',
                    schemaPath:
                      '#/properties/card/oneOf/1/properties/type/type',
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
                if ('carousel' !== data33) {
                  const err96 = {
                    instancePath: instancePath + '/card/type',
                    schemaPath:
                      '#/properties/card/oneOf/1/properties/type/const',
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
              if (data25.link !== undefined) {
                let data34 = data25.link;
                if (
                  !(
                    data34 &&
                    typeof data34 == 'object' &&
                    !Array.isArray(data34)
                  ) &&
                  data34 !== null
                ) {
                  const err97 = {
                    instancePath: instancePath + '/card/link',
                    schemaPath:
                      '#/properties/card/oneOf/1/properties/link/type',
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
                  data34 &&
                  typeof data34 == 'object' &&
                  !Array.isArray(data34)
                ) {
                  if (data34.url === undefined) {
                    const err98 = {
                      instancePath: instancePath + '/card/link',
                      schemaPath:
                        '#/properties/card/oneOf/1/properties/link/required',
                      keyword: 'required',
                      params: { missingProperty: 'url' },
                      message: "must have required property '" + 'url' + "'",
                    };
                    if (vErrors === null) {
                      vErrors = [err98];
                    } else {
                      vErrors.push(err98);
                    }
                    errors++;
                  }
                  if (data34.expanded_url === undefined) {
                    const err99 = {
                      instancePath: instancePath + '/card/link',
                      schemaPath:
                        '#/properties/card/oneOf/1/properties/link/required',
                      keyword: 'required',
                      params: { missingProperty: 'expanded_url' },
                      message:
                        "must have required property '" + 'expanded_url' + "'",
                    };
                    if (vErrors === null) {
                      vErrors = [err99];
                    } else {
                      vErrors.push(err99);
                    }
                    errors++;
                  }
                  if (data34.decoded_url === undefined) {
                    const err100 = {
                      instancePath: instancePath + '/card/link',
                      schemaPath:
                        '#/properties/card/oneOf/1/properties/link/required',
                      keyword: 'required',
                      params: { missingProperty: 'decoded_url' },
                      message:
                        "must have required property '" + 'decoded_url' + "'",
                    };
                    if (vErrors === null) {
                      vErrors = [err100];
                    } else {
                      vErrors.push(err100);
                    }
                    errors++;
                  }
                  for (const key10 in data34) {
                    if (
                      !(
                        key10 === 'url' ||
                        key10 === 'expanded_url' ||
                        key10 === 'decoded_url' ||
                        key10 === 'title'
                      )
                    ) {
                      const err101 = {
                        instancePath: instancePath + '/card/link',
                        schemaPath:
                          '#/properties/card/oneOf/1/properties/link/additionalProperties',
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
                  if (data34.url !== undefined) {
                    let data35 = data34.url;
                    if (typeof data35 === 'string') {
                      if (!formats0(data35)) {
                        const err102 = {
                          instancePath: instancePath + '/card/link/url',
                          schemaPath:
                            '#/properties/card/oneOf/1/properties/link/properties/url/format',
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
                        instancePath: instancePath + '/card/link/url',
                        schemaPath:
                          '#/properties/card/oneOf/1/properties/link/properties/url/type',
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
                  if (data34.expanded_url !== undefined) {
                    let data36 = data34.expanded_url;
                    if (typeof data36 === 'string') {
                      if (!formats0(data36)) {
                        const err104 = {
                          instancePath:
                            instancePath + '/card/link/expanded_url',
                          schemaPath:
                            '#/properties/card/oneOf/1/properties/link/properties/expanded_url/format',
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
                        instancePath: instancePath + '/card/link/expanded_url',
                        schemaPath:
                          '#/properties/card/oneOf/1/properties/link/properties/expanded_url/type',
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
                  if (data34.decoded_url !== undefined) {
                    let data37 = data34.decoded_url;
                    if (typeof data37 === 'string') {
                      if (!formats4(data37)) {
                        const err106 = {
                          instancePath: instancePath + '/card/link/decoded_url',
                          schemaPath:
                            '#/properties/card/oneOf/1/properties/link/properties/decoded_url/format',
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
                        instancePath: instancePath + '/card/link/decoded_url',
                        schemaPath:
                          '#/properties/card/oneOf/1/properties/link/properties/decoded_url/type',
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
                  if (data34.title !== undefined) {
                    let data38 = data34.title;
                    if (typeof data38 !== 'string' && data38 !== null) {
                      const err108 = {
                        instancePath: instancePath + '/card/link/title',
                        schemaPath:
                          '#/properties/card/oneOf/1/properties/link/properties/title/type',
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
              if (data25.media_urls !== undefined) {
                let data39 = data25.media_urls;
                if (Array.isArray(data39)) {
                  const len1 = data39.length;
                  for (let i1 = 0; i1 < len1; i1++) {
                    let data40 = data39[i1];
                    if (typeof data40 === 'string') {
                      if (!formats0(data40)) {
                        const err109 = {
                          instancePath: instancePath + '/card/media_urls/' + i1,
                          schemaPath:
                            '#/properties/card/oneOf/1/properties/media_urls/items/format',
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
                        instancePath: instancePath + '/card/media_urls/' + i1,
                        schemaPath:
                          '#/properties/card/oneOf/1/properties/media_urls/items/type',
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
                    instancePath: instancePath + '/card/media_urls',
                    schemaPath:
                      '#/properties/card/oneOf/1/properties/media_urls/type',
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
                instancePath: instancePath + '/card',
                schemaPath: '#/properties/card/oneOf/1/type',
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
              instancePath: instancePath + '/card',
              schemaPath: '#/properties/card/discriminator',
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
            instancePath: instancePath + '/card',
            schemaPath: '#/properties/card/discriminator',
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
    if (data.media !== undefined) {
      let data41 = data.media;
      if (!Array.isArray(data41) && data41 !== null) {
        const err115 = {
          instancePath: instancePath + '/media',
          schemaPath: '#/properties/media/type',
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
      if (Array.isArray(data41)) {
        const len2 = data41.length;
        for (let i2 = 0; i2 < len2; i2++) {
          let data42 = data41[i2];
          if (data42 && typeof data42 == 'object' && !Array.isArray(data42)) {
            if (data42.type === undefined) {
              const err116 = {
                instancePath: instancePath + '/media/' + i2,
                schemaPath: '#/properties/media/items/required',
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
            const tag2 = data42.type;
            if (typeof tag2 == 'string') {
              if (tag2 === 'photo') {
                if (
                  data42 &&
                  typeof data42 == 'object' &&
                  !Array.isArray(data42)
                ) {
                  if (data42.type === undefined) {
                    const err117 = {
                      instancePath: instancePath + '/media/' + i2,
                      schemaPath: '#/properties/media/items/oneOf/0/required',
                      keyword: 'required',
                      params: { missingProperty: 'type' },
                      message: "must have required property '" + 'type' + "'",
                    };
                    if (vErrors === null) {
                      vErrors = [err117];
                    } else {
                      vErrors.push(err117);
                    }
                    errors++;
                  }
                  if (data42.url === undefined) {
                    const err118 = {
                      instancePath: instancePath + '/media/' + i2,
                      schemaPath: '#/properties/media/items/oneOf/0/required',
                      keyword: 'required',
                      params: { missingProperty: 'url' },
                      message: "must have required property '" + 'url' + "'",
                    };
                    if (vErrors === null) {
                      vErrors = [err118];
                    } else {
                      vErrors.push(err118);
                    }
                    errors++;
                  }
                  for (const key11 in data42) {
                    if (!(key11 === 'type' || key11 === 'url')) {
                      const err119 = {
                        instancePath: instancePath + '/media/' + i2,
                        schemaPath:
                          '#/properties/media/items/oneOf/0/additionalProperties',
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
                  if (data42.type !== undefined) {
                    let data43 = data42.type;
                    if (typeof data43 !== 'string') {
                      const err120 = {
                        instancePath: instancePath + '/media/' + i2 + '/type',
                        schemaPath:
                          '#/properties/media/items/oneOf/0/properties/type/type',
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
                    if ('photo' !== data43) {
                      const err121 = {
                        instancePath: instancePath + '/media/' + i2 + '/type',
                        schemaPath:
                          '#/properties/media/items/oneOf/0/properties/type/const',
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
                  if (data42.url !== undefined) {
                    let data44 = data42.url;
                    if (typeof data44 === 'string') {
                      if (!formats0(data44)) {
                        const err122 = {
                          instancePath: instancePath + '/media/' + i2 + '/url',
                          schemaPath:
                            '#/properties/media/items/oneOf/0/properties/url/format',
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
                        instancePath: instancePath + '/media/' + i2 + '/url',
                        schemaPath:
                          '#/properties/media/items/oneOf/0/properties/url/type',
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
                    instancePath: instancePath + '/media/' + i2,
                    schemaPath: '#/properties/media/items/oneOf/0/type',
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
                  data42 &&
                  typeof data42 == 'object' &&
                  !Array.isArray(data42)
                ) {
                  if (data42.type === undefined) {
                    const err125 = {
                      instancePath: instancePath + '/media/' + i2,
                      schemaPath: '#/properties/media/items/oneOf/1/required',
                      keyword: 'required',
                      params: { missingProperty: 'type' },
                      message: "must have required property '" + 'type' + "'",
                    };
                    if (vErrors === null) {
                      vErrors = [err125];
                    } else {
                      vErrors.push(err125);
                    }
                    errors++;
                  }
                  if (data42.thumbnail === undefined) {
                    const err126 = {
                      instancePath: instancePath + '/media/' + i2,
                      schemaPath: '#/properties/media/items/oneOf/1/required',
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
                  for (const key12 in data42) {
                    if (!(key12 === 'type' || key12 === 'thumbnail')) {
                      const err127 = {
                        instancePath: instancePath + '/media/' + i2,
                        schemaPath:
                          '#/properties/media/items/oneOf/1/additionalProperties',
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
                  if (data42.type !== undefined) {
                    let data45 = data42.type;
                    if (typeof data45 !== 'string') {
                      const err128 = {
                        instancePath: instancePath + '/media/' + i2 + '/type',
                        schemaPath:
                          '#/properties/media/items/oneOf/1/properties/type/type',
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
                    if ('video' !== data45) {
                      const err129 = {
                        instancePath: instancePath + '/media/' + i2 + '/type',
                        schemaPath:
                          '#/properties/media/items/oneOf/1/properties/type/const',
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
                  if (data42.thumbnail !== undefined) {
                    let data46 = data42.thumbnail;
                    if (typeof data46 === 'string') {
                      if (!formats0(data46)) {
                        const err130 = {
                          instancePath:
                            instancePath + '/media/' + i2 + '/thumbnail',
                          schemaPath:
                            '#/properties/media/items/oneOf/1/properties/thumbnail/format',
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
                          instancePath + '/media/' + i2 + '/thumbnail',
                        schemaPath:
                          '#/properties/media/items/oneOf/1/properties/thumbnail/type',
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
                    instancePath: instancePath + '/media/' + i2,
                    schemaPath: '#/properties/media/items/oneOf/1/type',
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
                  instancePath: instancePath + '/media/' + i2,
                  schemaPath: '#/properties/media/items/discriminator',
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
                instancePath: instancePath + '/media/' + i2,
                schemaPath: '#/properties/media/items/discriminator',
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
              instancePath: instancePath + '/media/' + i2,
              schemaPath: '#/properties/media/items/type',
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
      instancePath,
      schemaPath: '#/type',
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
  validate10.errors = vErrors;
  return errors === 0;
}
