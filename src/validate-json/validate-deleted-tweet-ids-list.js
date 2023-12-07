'use strict';
module.exports = validate10;
module.exports.default = validate10;
const schema11 = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      deleted_at: { type: 'integer' },
      tweetIDs: {
        type: 'array',
        items: { type: 'string', pattern: '^[0-9]+$' },
        minItems: 1,
      },
    },
    required: ['deleted_at', 'tweetIDs'],
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
        if (data0.tweetIDs === undefined) {
          const err1 = {
            instancePath: instancePath + '/' + i0,
            schemaPath: '#/items/required',
            keyword: 'required',
            params: { missingProperty: 'tweetIDs' },
            message: "must have required property '" + 'tweetIDs' + "'",
          };
          if (vErrors === null) {
            vErrors = [err1];
          } else {
            vErrors.push(err1);
          }
          errors++;
        }
        for (const key0 in data0) {
          if (!(key0 === 'deleted_at' || key0 === 'tweetIDs')) {
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
        if (data0.tweetIDs !== undefined) {
          let data2 = data0.tweetIDs;
          if (Array.isArray(data2)) {
            if (data2.length < 1) {
              const err4 = {
                instancePath: instancePath + '/' + i0 + '/tweetIDs',
                schemaPath: '#/items/properties/tweetIDs/minItems',
                keyword: 'minItems',
                params: { limit: 1 },
                message: 'must NOT have fewer than 1 items',
              };
              if (vErrors === null) {
                vErrors = [err4];
              } else {
                vErrors.push(err4);
              }
              errors++;
            }
            const len1 = data2.length;
            for (let i1 = 0; i1 < len1; i1++) {
              let data3 = data2[i1];
              if (typeof data3 === 'string') {
                if (!pattern0.test(data3)) {
                  const err5 = {
                    instancePath: instancePath + '/' + i0 + '/tweetIDs/' + i1,
                    schemaPath: '#/items/properties/tweetIDs/items/pattern',
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
                  instancePath: instancePath + '/' + i0 + '/tweetIDs/' + i1,
                  schemaPath: '#/items/properties/tweetIDs/items/type',
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
          } else {
            const err7 = {
              instancePath: instancePath + '/' + i0 + '/tweetIDs',
              schemaPath: '#/items/properties/tweetIDs/type',
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
        }
      } else {
        const err8 = {
          instancePath: instancePath + '/' + i0,
          schemaPath: '#/items/type',
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
    }
  } else {
    const err9 = {
      instancePath,
      schemaPath: '#/type',
      keyword: 'type',
      params: { type: 'array' },
      message: 'must be array',
    };
    if (vErrors === null) {
      vErrors = [err9];
    } else {
      vErrors.push(err9);
    }
    errors++;
  }
  validate10.errors = vErrors;
  return errors === 0;
}
