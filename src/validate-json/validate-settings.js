'use strict';
module.exports = validate10;
module.exports.default = validate10;
const schema11 = {
  $ref: '#/definitions/settings',
  definitions: {
    hostname: { enum: ['twitter.com', 'x.com'] },
    tweetSortKey: { enum: ['created_time', 'saved_time', 'username'] },
    trashboxSortKey: { enum: ['deleted_time'] },
    sortOrder: { enum: ['asc', 'desc'] },
    tweetSort: {
      type: 'object',
      properties: {
        key: { $ref: '#/definitions/tweetSortKey' },
        order: { $ref: '#/definitions/sortOrder' },
      },
      required: ['key', 'order'],
      additionalProperties: false,
    },
    trashboxSort: {
      type: 'object',
      properties: {
        key: { $ref: '#/definitions/trashboxSortKey' },
        order: { $ref: '#/definitions/sortOrder' },
      },
      required: ['key', 'order'],
      additionalProperties: false,
    },
    settings: {
      type: 'object',
      properties: {
        hostname: { $ref: '#/definitions/hostname' },
        timezone: { type: 'string' },
        datetimeFormat: { type: 'string' },
        tweetSort: { $ref: '#/definitions/tweetSort' },
        trashboxSort: { $ref: '#/definitions/trashboxSort' },
      },
      required: [
        'hostname',
        'timezone',
        'datetimeFormat',
        'tweetSort',
        'trashboxSort',
      ],
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
    tweetSort: { $ref: '#/definitions/tweetSort' },
    trashboxSort: { $ref: '#/definitions/trashboxSort' },
  },
  required: [
    'hostname',
    'timezone',
    'datetimeFormat',
    'tweetSort',
    'trashboxSort',
  ],
  additionalProperties: false,
};
const schema13 = { enum: ['twitter.com', 'x.com'] };
const schema14 = {
  type: 'object',
  properties: {
    key: { $ref: '#/definitions/tweetSortKey' },
    order: { $ref: '#/definitions/sortOrder' },
  },
  required: ['key', 'order'],
  additionalProperties: false,
};
const schema15 = { enum: ['created_time', 'saved_time', 'username'] };
const schema16 = { enum: ['asc', 'desc'] };
function validate12(
  data,
  { instancePath = '', parentData, parentDataProperty, rootData = data } = {},
) {
  let vErrors = null;
  let errors = 0;
  if (data && typeof data == 'object' && !Array.isArray(data)) {
    if (data.key === undefined) {
      const err0 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'key' },
        message: "must have required property '" + 'key' + "'",
      };
      if (vErrors === null) {
        vErrors = [err0];
      } else {
        vErrors.push(err0);
      }
      errors++;
    }
    if (data.order === undefined) {
      const err1 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'order' },
        message: "must have required property '" + 'order' + "'",
      };
      if (vErrors === null) {
        vErrors = [err1];
      } else {
        vErrors.push(err1);
      }
      errors++;
    }
    for (const key0 in data) {
      if (!(key0 === 'key' || key0 === 'order')) {
        const err2 = {
          instancePath,
          schemaPath: '#/additionalProperties',
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
    if (data.key !== undefined) {
      let data0 = data.key;
      if (
        !(
          data0 === 'created_time' ||
          data0 === 'saved_time' ||
          data0 === 'username'
        )
      ) {
        const err3 = {
          instancePath: instancePath + '/key',
          schemaPath: '#/definitions/tweetSortKey/enum',
          keyword: 'enum',
          params: { allowedValues: schema15.enum },
          message: 'must be equal to one of the allowed values',
        };
        if (vErrors === null) {
          vErrors = [err3];
        } else {
          vErrors.push(err3);
        }
        errors++;
      }
    }
    if (data.order !== undefined) {
      let data1 = data.order;
      if (!(data1 === 'asc' || data1 === 'desc')) {
        const err4 = {
          instancePath: instancePath + '/order',
          schemaPath: '#/definitions/sortOrder/enum',
          keyword: 'enum',
          params: { allowedValues: schema16.enum },
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
  } else {
    const err5 = {
      instancePath,
      schemaPath: '#/type',
      keyword: 'type',
      params: { type: 'object' },
      message: 'must be object',
    };
    if (vErrors === null) {
      vErrors = [err5];
    } else {
      vErrors.push(err5);
    }
    errors++;
  }
  validate12.errors = vErrors;
  return errors === 0;
}
const schema17 = {
  type: 'object',
  properties: {
    key: { $ref: '#/definitions/trashboxSortKey' },
    order: { $ref: '#/definitions/sortOrder' },
  },
  required: ['key', 'order'],
  additionalProperties: false,
};
const schema18 = { enum: ['deleted_time'] };
function validate14(
  data,
  { instancePath = '', parentData, parentDataProperty, rootData = data } = {},
) {
  let vErrors = null;
  let errors = 0;
  if (data && typeof data == 'object' && !Array.isArray(data)) {
    if (data.key === undefined) {
      const err0 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'key' },
        message: "must have required property '" + 'key' + "'",
      };
      if (vErrors === null) {
        vErrors = [err0];
      } else {
        vErrors.push(err0);
      }
      errors++;
    }
    if (data.order === undefined) {
      const err1 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'order' },
        message: "must have required property '" + 'order' + "'",
      };
      if (vErrors === null) {
        vErrors = [err1];
      } else {
        vErrors.push(err1);
      }
      errors++;
    }
    for (const key0 in data) {
      if (!(key0 === 'key' || key0 === 'order')) {
        const err2 = {
          instancePath,
          schemaPath: '#/additionalProperties',
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
    if (data.key !== undefined) {
      if (!(data.key === 'deleted_time')) {
        const err3 = {
          instancePath: instancePath + '/key',
          schemaPath: '#/definitions/trashboxSortKey/enum',
          keyword: 'enum',
          params: { allowedValues: schema18.enum },
          message: 'must be equal to one of the allowed values',
        };
        if (vErrors === null) {
          vErrors = [err3];
        } else {
          vErrors.push(err3);
        }
        errors++;
      }
    }
    if (data.order !== undefined) {
      let data1 = data.order;
      if (!(data1 === 'asc' || data1 === 'desc')) {
        const err4 = {
          instancePath: instancePath + '/order',
          schemaPath: '#/definitions/sortOrder/enum',
          keyword: 'enum',
          params: { allowedValues: schema16.enum },
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
  } else {
    const err5 = {
      instancePath,
      schemaPath: '#/type',
      keyword: 'type',
      params: { type: 'object' },
      message: 'must be object',
    };
    if (vErrors === null) {
      vErrors = [err5];
    } else {
      vErrors.push(err5);
    }
    errors++;
  }
  validate14.errors = vErrors;
  return errors === 0;
}
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
    if (data.tweetSort === undefined) {
      const err3 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'tweetSort' },
        message: "must have required property '" + 'tweetSort' + "'",
      };
      if (vErrors === null) {
        vErrors = [err3];
      } else {
        vErrors.push(err3);
      }
      errors++;
    }
    if (data.trashboxSort === undefined) {
      const err4 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'trashboxSort' },
        message: "must have required property '" + 'trashboxSort' + "'",
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
          key0 === 'tweetSort' ||
          key0 === 'trashboxSort'
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
      if (!(data0 === 'twitter.com' || data0 === 'x.com')) {
        const err6 = {
          instancePath: instancePath + '/hostname',
          schemaPath: '#/definitions/hostname/enum',
          keyword: 'enum',
          params: { allowedValues: schema13.enum },
          message: 'must be equal to one of the allowed values',
        };
        if (vErrors === null) {
          vErrors = [err6];
        } else {
          vErrors.push(err6);
        }
        errors++;
      }
    }
    if (data.timezone !== undefined) {
      if (typeof data.timezone !== 'string') {
        const err7 = {
          instancePath: instancePath + '/timezone',
          schemaPath: '#/properties/timezone/type',
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
    if (data.datetimeFormat !== undefined) {
      if (typeof data.datetimeFormat !== 'string') {
        const err8 = {
          instancePath: instancePath + '/datetimeFormat',
          schemaPath: '#/properties/datetimeFormat/type',
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
    if (data.tweetSort !== undefined) {
      if (
        !validate12(data.tweetSort, {
          instancePath: instancePath + '/tweetSort',
          parentData: data,
          parentDataProperty: 'tweetSort',
          rootData,
        })
      ) {
        vErrors =
          vErrors === null ?
            validate12.errors
          : vErrors.concat(validate12.errors);
        errors = vErrors.length;
      }
    }
    if (data.trashboxSort !== undefined) {
      if (
        !validate14(data.trashboxSort, {
          instancePath: instancePath + '/trashboxSort',
          parentData: data,
          parentDataProperty: 'trashboxSort',
          rootData,
        })
      ) {
        vErrors =
          vErrors === null ?
            validate14.errors
          : vErrors.concat(validate14.errors);
        errors = vErrors.length;
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
