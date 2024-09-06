'use strict';
module.exports = validate10;
module.exports.default = validate10;
const schema11 = {
  type: 'object',
  properties: {
    hostname: { type: 'string', enum: ['twitter.com', 'x.com'] },
    timezone: { type: 'string' },
    datetimeFormat: { type: 'string' },
    scrapboxIcon: { type: 'string', enum: ['scrapbox', 'cosense'] },
    twitterIcon: { type: 'string', enum: ['twitter', 'x'] },
  },
  required: [
    'hostname',
    'timezone',
    'datetimeFormat',
    'scrapboxIcon',
    'twitterIcon',
  ],
  additionalProperties: false,
};
function validate10(
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
    if (data.scrapboxIcon === undefined) {
      const err3 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'scrapboxIcon' },
        message: "must have required property '" + 'scrapboxIcon' + "'",
      };
      if (vErrors === null) {
        vErrors = [err3];
      } else {
        vErrors.push(err3);
      }
      errors++;
    }
    if (data.twitterIcon === undefined) {
      const err4 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'twitterIcon' },
        message: "must have required property '" + 'twitterIcon' + "'",
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
          key0 === 'hostname' ||
          key0 === 'timezone' ||
          key0 === 'datetimeFormat' ||
          key0 === 'scrapboxIcon' ||
          key0 === 'twitterIcon'
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
    if (data.hostname !== undefined) {
      let data0 = data.hostname;
      if (typeof data0 !== 'string') {
        const err6 = {
          instancePath: instancePath + '/hostname',
          schemaPath: '#/properties/hostname/type',
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
      if (!(data0 === 'twitter.com' || data0 === 'x.com')) {
        const err7 = {
          instancePath: instancePath + '/hostname',
          schemaPath: '#/properties/hostname/enum',
          keyword: 'enum',
          params: { allowedValues: schema11.properties.hostname.enum },
          message: 'must be equal to one of the allowed values',
        };
        if (vErrors === null) {
          vErrors = [err7];
        } else {
          vErrors.push(err7);
        }
        errors++;
      }
    }
    if (data.timezone !== undefined) {
      if (typeof data.timezone !== 'string') {
        const err8 = {
          instancePath: instancePath + '/timezone',
          schemaPath: '#/properties/timezone/type',
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
    if (data.datetimeFormat !== undefined) {
      if (typeof data.datetimeFormat !== 'string') {
        const err9 = {
          instancePath: instancePath + '/datetimeFormat',
          schemaPath: '#/properties/datetimeFormat/type',
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
    if (data.scrapboxIcon !== undefined) {
      let data3 = data.scrapboxIcon;
      if (typeof data3 !== 'string') {
        const err10 = {
          instancePath: instancePath + '/scrapboxIcon',
          schemaPath: '#/properties/scrapboxIcon/type',
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
      if (!(data3 === 'scrapbox' || data3 === 'cosense')) {
        const err11 = {
          instancePath: instancePath + '/scrapboxIcon',
          schemaPath: '#/properties/scrapboxIcon/enum',
          keyword: 'enum',
          params: { allowedValues: schema11.properties.scrapboxIcon.enum },
          message: 'must be equal to one of the allowed values',
        };
        if (vErrors === null) {
          vErrors = [err11];
        } else {
          vErrors.push(err11);
        }
        errors++;
      }
    }
    if (data.twitterIcon !== undefined) {
      let data4 = data.twitterIcon;
      if (typeof data4 !== 'string') {
        const err12 = {
          instancePath: instancePath + '/twitterIcon',
          schemaPath: '#/properties/twitterIcon/type',
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
      if (!(data4 === 'twitter' || data4 === 'x')) {
        const err13 = {
          instancePath: instancePath + '/twitterIcon',
          schemaPath: '#/properties/twitterIcon/enum',
          keyword: 'enum',
          params: { allowedValues: schema11.properties.twitterIcon.enum },
          message: 'must be equal to one of the allowed values',
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
      schemaPath: '#/type',
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
  validate10.errors = vErrors;
  return errors === 0;
}
