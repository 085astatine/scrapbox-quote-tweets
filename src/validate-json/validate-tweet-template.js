'use strict';
module.exports = validate10;
module.exports.default = validate10;
const schema11 = {
  type: 'object',
  properties: {
    tweet: { type: 'string' },
    footer: { type: 'string' },
    entity: {
      type: 'object',
      properties: {
        text: { type: 'string' },
        url: { type: 'string' },
        hashtag: { type: 'string' },
        cashtag: { type: 'string' },
        mention: { type: 'string' },
      },
      required: ['text', 'url', 'hashtag', 'cashtag', 'mention'],
      additionalProperties: false,
    },
    media: {
      type: 'object',
      properties: { photo: { type: 'string' }, video: { type: 'string' } },
      required: ['photo', 'video'],
      additionalProperties: false,
    },
    quote: { type: 'boolean' },
  },
  required: ['tweet', 'footer', 'entity', 'media', 'quote'],
  additionalProperties: false,
};
function validate10(
  data,
  { instancePath = '', parentData, parentDataProperty, rootData = data } = {},
) {
  let vErrors = null;
  let errors = 0;
  if (data && typeof data == 'object' && !Array.isArray(data)) {
    if (data.tweet === undefined) {
      const err0 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'tweet' },
        message: "must have required property '" + 'tweet' + "'",
      };
      if (vErrors === null) {
        vErrors = [err0];
      } else {
        vErrors.push(err0);
      }
      errors++;
    }
    if (data.footer === undefined) {
      const err1 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'footer' },
        message: "must have required property '" + 'footer' + "'",
      };
      if (vErrors === null) {
        vErrors = [err1];
      } else {
        vErrors.push(err1);
      }
      errors++;
    }
    if (data.entity === undefined) {
      const err2 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'entity' },
        message: "must have required property '" + 'entity' + "'",
      };
      if (vErrors === null) {
        vErrors = [err2];
      } else {
        vErrors.push(err2);
      }
      errors++;
    }
    if (data.media === undefined) {
      const err3 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'media' },
        message: "must have required property '" + 'media' + "'",
      };
      if (vErrors === null) {
        vErrors = [err3];
      } else {
        vErrors.push(err3);
      }
      errors++;
    }
    if (data.quote === undefined) {
      const err4 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'quote' },
        message: "must have required property '" + 'quote' + "'",
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
          key0 === 'tweet' ||
          key0 === 'footer' ||
          key0 === 'entity' ||
          key0 === 'media' ||
          key0 === 'quote'
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
    if (data.tweet !== undefined) {
      if (typeof data.tweet !== 'string') {
        const err6 = {
          instancePath: instancePath + '/tweet',
          schemaPath: '#/properties/tweet/type',
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
    if (data.footer !== undefined) {
      if (typeof data.footer !== 'string') {
        const err7 = {
          instancePath: instancePath + '/footer',
          schemaPath: '#/properties/footer/type',
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
    if (data.entity !== undefined) {
      let data2 = data.entity;
      if (data2 && typeof data2 == 'object' && !Array.isArray(data2)) {
        if (data2.text === undefined) {
          const err8 = {
            instancePath: instancePath + '/entity',
            schemaPath: '#/properties/entity/required',
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
        if (data2.url === undefined) {
          const err9 = {
            instancePath: instancePath + '/entity',
            schemaPath: '#/properties/entity/required',
            keyword: 'required',
            params: { missingProperty: 'url' },
            message: "must have required property '" + 'url' + "'",
          };
          if (vErrors === null) {
            vErrors = [err9];
          } else {
            vErrors.push(err9);
          }
          errors++;
        }
        if (data2.hashtag === undefined) {
          const err10 = {
            instancePath: instancePath + '/entity',
            schemaPath: '#/properties/entity/required',
            keyword: 'required',
            params: { missingProperty: 'hashtag' },
            message: "must have required property '" + 'hashtag' + "'",
          };
          if (vErrors === null) {
            vErrors = [err10];
          } else {
            vErrors.push(err10);
          }
          errors++;
        }
        if (data2.cashtag === undefined) {
          const err11 = {
            instancePath: instancePath + '/entity',
            schemaPath: '#/properties/entity/required',
            keyword: 'required',
            params: { missingProperty: 'cashtag' },
            message: "must have required property '" + 'cashtag' + "'",
          };
          if (vErrors === null) {
            vErrors = [err11];
          } else {
            vErrors.push(err11);
          }
          errors++;
        }
        if (data2.mention === undefined) {
          const err12 = {
            instancePath: instancePath + '/entity',
            schemaPath: '#/properties/entity/required',
            keyword: 'required',
            params: { missingProperty: 'mention' },
            message: "must have required property '" + 'mention' + "'",
          };
          if (vErrors === null) {
            vErrors = [err12];
          } else {
            vErrors.push(err12);
          }
          errors++;
        }
        for (const key1 in data2) {
          if (
            !(
              key1 === 'text' ||
              key1 === 'url' ||
              key1 === 'hashtag' ||
              key1 === 'cashtag' ||
              key1 === 'mention'
            )
          ) {
            const err13 = {
              instancePath: instancePath + '/entity',
              schemaPath: '#/properties/entity/additionalProperties',
              keyword: 'additionalProperties',
              params: { additionalProperty: key1 },
              message: 'must NOT have additional properties',
            };
            if (vErrors === null) {
              vErrors = [err13];
            } else {
              vErrors.push(err13);
            }
            errors++;
          }
        }
        if (data2.text !== undefined) {
          if (typeof data2.text !== 'string') {
            const err14 = {
              instancePath: instancePath + '/entity/text',
              schemaPath: '#/properties/entity/properties/text/type',
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
        if (data2.url !== undefined) {
          if (typeof data2.url !== 'string') {
            const err15 = {
              instancePath: instancePath + '/entity/url',
              schemaPath: '#/properties/entity/properties/url/type',
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
        if (data2.hashtag !== undefined) {
          if (typeof data2.hashtag !== 'string') {
            const err16 = {
              instancePath: instancePath + '/entity/hashtag',
              schemaPath: '#/properties/entity/properties/hashtag/type',
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
        if (data2.cashtag !== undefined) {
          if (typeof data2.cashtag !== 'string') {
            const err17 = {
              instancePath: instancePath + '/entity/cashtag',
              schemaPath: '#/properties/entity/properties/cashtag/type',
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
        if (data2.mention !== undefined) {
          if (typeof data2.mention !== 'string') {
            const err18 = {
              instancePath: instancePath + '/entity/mention',
              schemaPath: '#/properties/entity/properties/mention/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err18];
            } else {
              vErrors.push(err18);
            }
            errors++;
          }
        }
      } else {
        const err19 = {
          instancePath: instancePath + '/entity',
          schemaPath: '#/properties/entity/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        };
        if (vErrors === null) {
          vErrors = [err19];
        } else {
          vErrors.push(err19);
        }
        errors++;
      }
    }
    if (data.media !== undefined) {
      let data8 = data.media;
      if (data8 && typeof data8 == 'object' && !Array.isArray(data8)) {
        if (data8.photo === undefined) {
          const err20 = {
            instancePath: instancePath + '/media',
            schemaPath: '#/properties/media/required',
            keyword: 'required',
            params: { missingProperty: 'photo' },
            message: "must have required property '" + 'photo' + "'",
          };
          if (vErrors === null) {
            vErrors = [err20];
          } else {
            vErrors.push(err20);
          }
          errors++;
        }
        if (data8.video === undefined) {
          const err21 = {
            instancePath: instancePath + '/media',
            schemaPath: '#/properties/media/required',
            keyword: 'required',
            params: { missingProperty: 'video' },
            message: "must have required property '" + 'video' + "'",
          };
          if (vErrors === null) {
            vErrors = [err21];
          } else {
            vErrors.push(err21);
          }
          errors++;
        }
        for (const key2 in data8) {
          if (!(key2 === 'photo' || key2 === 'video')) {
            const err22 = {
              instancePath: instancePath + '/media',
              schemaPath: '#/properties/media/additionalProperties',
              keyword: 'additionalProperties',
              params: { additionalProperty: key2 },
              message: 'must NOT have additional properties',
            };
            if (vErrors === null) {
              vErrors = [err22];
            } else {
              vErrors.push(err22);
            }
            errors++;
          }
        }
        if (data8.photo !== undefined) {
          if (typeof data8.photo !== 'string') {
            const err23 = {
              instancePath: instancePath + '/media/photo',
              schemaPath: '#/properties/media/properties/photo/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err23];
            } else {
              vErrors.push(err23);
            }
            errors++;
          }
        }
        if (data8.video !== undefined) {
          if (typeof data8.video !== 'string') {
            const err24 = {
              instancePath: instancePath + '/media/video',
              schemaPath: '#/properties/media/properties/video/type',
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
          instancePath: instancePath + '/media',
          schemaPath: '#/properties/media/type',
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
    if (data.quote !== undefined) {
      if (typeof data.quote !== 'boolean') {
        const err26 = {
          instancePath: instancePath + '/quote',
          schemaPath: '#/properties/quote/type',
          keyword: 'type',
          params: { type: 'boolean' },
          message: 'must be boolean',
        };
        if (vErrors === null) {
          vErrors = [err26];
        } else {
          vErrors.push(err26);
        }
        errors++;
      }
    }
  } else {
    const err27 = {
      instancePath,
      schemaPath: '#/type',
      keyword: 'type',
      params: { type: 'object' },
      message: 'must be object',
    };
    if (vErrors === null) {
      vErrors = [err27];
    } else {
      vErrors.push(err27);
    }
    errors++;
  }
  validate10.errors = vErrors;
  return errors === 0;
}
