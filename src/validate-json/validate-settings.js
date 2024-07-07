'use strict';
module.exports = validate10;
module.exports.default = validate10;
const schema11 = {
  $ref: '#/definitions/settings',
  definitions: {
    hostname: { enum: ['twitter.com', 'x.com'] },
    settings: {
      type: 'object',
      properties: {
        hostname: { $ref: '#/definitions/hostname' },
        timezone: { type: 'string' },
        datetimeFormat: { type: 'string' },
      },
      required: ['hostname', 'timezone', 'datetimeFormat'],
      additionalProperties: false,
    },
  },
};
const schema12 = {
  type: 'object',
  properties: {
    hostname: { $ref: '#/definitions/hostname' },
    timezone: { type: 'string' },
    datetimeFormat: { type: 'string' },
  },
  required: ['hostname', 'timezone', 'datetimeFormat'],
  additionalProperties: false,
};
const schema13 = { enum: ['twitter.com', 'x.com'] };
function validate11(
  data,
  { instancePath = '', parentData, parentDataProperty, rootData = data } = {},
) {
  let vErrors = null;
  let errors = 0;
  if (data && typeof data == 'object' && !Array.isArray(data)) {
    if (data.hostname === undefined) {
      const err0 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'hostname' },
        message: "must have required property '" + 'hostname' + "'",
      };
      if (vErrors === null) {
        vErrors = [err0];
      } else {
        vErrors.push(err0);
      }
      errors++;
    }
    if (data.timezone === undefined) {
      const err1 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'timezone' },
        message: "must have required property '" + 'timezone' + "'",
      };
      if (vErrors === null) {
        vErrors = [err1];
      } else {
        vErrors.push(err1);
      }
      errors++;
    }
    if (data.datetimeFormat === undefined) {
      const err2 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'datetimeFormat' },
        message: "must have required property '" + 'datetimeFormat' + "'",
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
          key0 === 'hostname' ||
          key0 === 'timezone' ||
          key0 === 'datetimeFormat'
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
    if (data.hostname !== undefined) {
      let data0 = data.hostname;
      if (!(data0 === 'twitter.com' || data0 === 'x.com')) {
        const err4 = {
          instancePath: instancePath + '/hostname',
          schemaPath: '#/definitions/hostname/enum',
          keyword: 'enum',
          params: { allowedValues: schema13.enum },
          message: 'must be equal to one of the allowed values',
        };
        if (vErrors === null) {
          vErrors = [err4];
        } else {
          vErrors.push(err4);
        }
        errors++;
      }
    }
    if (data.timezone !== undefined) {
      if (typeof data.timezone !== 'string') {
        const err5 = {
          instancePath: instancePath + '/timezone',
          schemaPath: '#/properties/timezone/type',
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
    if (data.datetimeFormat !== undefined) {
      if (typeof data.datetimeFormat !== 'string') {
        const err6 = {
          instancePath: instancePath + '/datetimeFormat',
          schemaPath: '#/properties/datetimeFormat/type',
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
  validate11.errors = vErrors;
  return errors === 0;
}
function validate10(
  data,
  { instancePath = '', parentData, parentDataProperty, rootData = data } = {},
) {
  let vErrors = null;
  let errors = 0;
  if (
    !validate11(data, {
      instancePath,
      parentData,
      parentDataProperty,
      rootData,
    })
  ) {
    vErrors =
      vErrors === null ? validate11.errors : vErrors.concat(validate11.errors);
    errors = vErrors.length;
  }
  validate10.errors = vErrors;
  return errors === 0;
}
