'use strict';
module.exports = validate10;
module.exports.default = validate10;
const schema11 = {
  type: 'object',
  properties: {
    tweet: { type: 'string' },
    footer: { type: 'string' },
    entityText: { type: 'string' },
    entityUrl: { type: 'string' },
    entityHashtag: { type: 'string' },
    entityCashtag: { type: 'string' },
    entityMention: { type: 'string' },
    mediaPhoto: { type: 'string' },
    mediaVideo: { type: 'string' },
    quote: { type: 'boolean' },
  },
  required: [
    'tweet',
    'footer',
    'entityText',
    'entityUrl',
    'entityHashtag',
    'entityCashtag',
    'entityMention',
    'mediaPhoto',
    'mediaVideo',
    'quote',
  ],
  additionalProperties: false,
};
const func2 = Object.prototype.hasOwnProperty;
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
    if (data.entityText === undefined) {
      const err2 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'entityText' },
        message: "must have required property '" + 'entityText' + "'",
      };
      if (vErrors === null) {
        vErrors = [err2];
      } else {
        vErrors.push(err2);
      }
      errors++;
    }
    if (data.entityUrl === undefined) {
      const err3 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'entityUrl' },
        message: "must have required property '" + 'entityUrl' + "'",
      };
      if (vErrors === null) {
        vErrors = [err3];
      } else {
        vErrors.push(err3);
      }
      errors++;
    }
    if (data.entityHashtag === undefined) {
      const err4 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'entityHashtag' },
        message: "must have required property '" + 'entityHashtag' + "'",
      };
      if (vErrors === null) {
        vErrors = [err4];
      } else {
        vErrors.push(err4);
      }
      errors++;
    }
    if (data.entityCashtag === undefined) {
      const err5 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'entityCashtag' },
        message: "must have required property '" + 'entityCashtag' + "'",
      };
      if (vErrors === null) {
        vErrors = [err5];
      } else {
        vErrors.push(err5);
      }
      errors++;
    }
    if (data.entityMention === undefined) {
      const err6 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'entityMention' },
        message: "must have required property '" + 'entityMention' + "'",
      };
      if (vErrors === null) {
        vErrors = [err6];
      } else {
        vErrors.push(err6);
      }
      errors++;
    }
    if (data.mediaPhoto === undefined) {
      const err7 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'mediaPhoto' },
        message: "must have required property '" + 'mediaPhoto' + "'",
      };
      if (vErrors === null) {
        vErrors = [err7];
      } else {
        vErrors.push(err7);
      }
      errors++;
    }
    if (data.mediaVideo === undefined) {
      const err8 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'mediaVideo' },
        message: "must have required property '" + 'mediaVideo' + "'",
      };
      if (vErrors === null) {
        vErrors = [err8];
      } else {
        vErrors.push(err8);
      }
      errors++;
    }
    if (data.quote === undefined) {
      const err9 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'quote' },
        message: "must have required property '" + 'quote' + "'",
      };
      if (vErrors === null) {
        vErrors = [err9];
      } else {
        vErrors.push(err9);
      }
      errors++;
    }
    for (const key0 in data) {
      if (!func2.call(schema11.properties, key0)) {
        const err10 = {
          instancePath,
          schemaPath: '#/additionalProperties',
          keyword: 'additionalProperties',
          params: { additionalProperty: key0 },
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
    if (data.tweet !== undefined) {
      if (typeof data.tweet !== 'string') {
        const err11 = {
          instancePath: instancePath + '/tweet',
          schemaPath: '#/properties/tweet/type',
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
    if (data.footer !== undefined) {
      if (typeof data.footer !== 'string') {
        const err12 = {
          instancePath: instancePath + '/footer',
          schemaPath: '#/properties/footer/type',
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
    if (data.entityText !== undefined) {
      if (typeof data.entityText !== 'string') {
        const err13 = {
          instancePath: instancePath + '/entityText',
          schemaPath: '#/properties/entityText/type',
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
    if (data.entityUrl !== undefined) {
      if (typeof data.entityUrl !== 'string') {
        const err14 = {
          instancePath: instancePath + '/entityUrl',
          schemaPath: '#/properties/entityUrl/type',
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
    if (data.entityHashtag !== undefined) {
      if (typeof data.entityHashtag !== 'string') {
        const err15 = {
          instancePath: instancePath + '/entityHashtag',
          schemaPath: '#/properties/entityHashtag/type',
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
    if (data.entityCashtag !== undefined) {
      if (typeof data.entityCashtag !== 'string') {
        const err16 = {
          instancePath: instancePath + '/entityCashtag',
          schemaPath: '#/properties/entityCashtag/type',
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
    if (data.entityMention !== undefined) {
      if (typeof data.entityMention !== 'string') {
        const err17 = {
          instancePath: instancePath + '/entityMention',
          schemaPath: '#/properties/entityMention/type',
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
    if (data.mediaPhoto !== undefined) {
      if (typeof data.mediaPhoto !== 'string') {
        const err18 = {
          instancePath: instancePath + '/mediaPhoto',
          schemaPath: '#/properties/mediaPhoto/type',
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
    if (data.mediaVideo !== undefined) {
      if (typeof data.mediaVideo !== 'string') {
        const err19 = {
          instancePath: instancePath + '/mediaVideo',
          schemaPath: '#/properties/mediaVideo/type',
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
    if (data.quote !== undefined) {
      if (typeof data.quote !== 'boolean') {
        const err20 = {
          instancePath: instancePath + '/quote',
          schemaPath: '#/properties/quote/type',
          keyword: 'type',
          params: { type: 'boolean' },
          message: 'must be boolean',
        };
        if (vErrors === null) {
          vErrors = [err20];
        } else {
          vErrors.push(err20);
        }
        errors++;
      }
    }
  } else {
    const err21 = {
      instancePath,
      schemaPath: '#/type',
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
  validate10.errors = vErrors;
  return errors === 0;
}
