'use strict';
module.exports = validate10;
module.exports.default = validate10;
const schema11 = {
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
};
const pattern0 = new RegExp('^[0-9]+$', 'u');
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
        if (data0.deleted_at === undefined) {
          const err0 = {
            instancePath: instancePath + '/' + i0,
            schemaPath: '#/items/required',
            keyword: 'required',
            params: { missingProperty: 'deleted_at' },
            message: "must have required property '" + 'deleted_at' + "'",
          };
          if (vErrors === null) {
            vErrors = [err0];
          } else {
            vErrors.push(err0);
          }
          errors++;
        }
        if (data0.tweet_id === undefined) {
          const err1 = {
            instancePath: instancePath + '/' + i0,
            schemaPath: '#/items/required',
            keyword: 'required',
            params: { missingProperty: 'tweet_id' },
            message: "must have required property '" + 'tweet_id' + "'",
          };
          if (vErrors === null) {
            vErrors = [err1];
          } else {
            vErrors.push(err1);
          }
          errors++;
        }
        for (const key0 in data0) {
          if (!(key0 === 'deleted_at' || key0 === 'tweet_id')) {
            const err2 = {
              instancePath: instancePath + '/' + i0,
              schemaPath: '#/items/additionalProperties',
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
        if (data0.deleted_at !== undefined) {
          let data1 = data0.deleted_at;
          if (
            !(
              typeof data1 == 'number' &&
              !(data1 % 1) &&
              !isNaN(data1) &&
              isFinite(data1)
            )
          ) {
            const err3 = {
              instancePath: instancePath + '/' + i0 + '/deleted_at',
              schemaPath: '#/items/properties/deleted_at/type',
              keyword: 'type',
              params: { type: 'integer' },
              message: 'must be integer',
            };
            if (vErrors === null) {
              vErrors = [err3];
            } else {
              vErrors.push(err3);
            }
            errors++;
          }
        }
        if (data0.tweet_id !== undefined) {
          let data2 = data0.tweet_id;
          if (typeof data2 === 'string') {
            if (!pattern0.test(data2)) {
              const err4 = {
                instancePath: instancePath + '/' + i0 + '/tweet_id',
                schemaPath: '#/items/properties/tweet_id/pattern',
                keyword: 'pattern',
                params: { pattern: '^[0-9]+$' },
                message: 'must match pattern "' + '^[0-9]+$' + '"',
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
              instancePath: instancePath + '/' + i0 + '/tweet_id',
              schemaPath: '#/items/properties/tweet_id/type',
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
          instancePath: instancePath + '/' + i0,
          schemaPath: '#/items/type',
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
    }
  } else {
    const err7 = {
      instancePath,
      schemaPath: '#/type',
      keyword: 'type',
      params: { type: 'array' },
      message: 'must be array',
    };
    if (vErrors === null) {
      vErrors = [err7];
    } else {
      vErrors.push(err7);
    }
    errors++;
  }
  validate10.errors = vErrors;
  return errors === 0;
}
