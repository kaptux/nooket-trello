import * as React from 'react';
import {
  IInstance,
  ICategory,
  FieldTypeEnum,
  RuleTypeEnum,
  ICategoryField,
} from 'nooket-common';
import { ICard } from 'types';
import { Select } from 'antd';

export function arrayOfObjectsToHashmap<T>(
  objectKey: string,
  array: T[]
): { [id: string]: T } {
  let res = {};
  array.forEach(element => {
    res = (Object as any).assign(res, { [element[objectKey]]: element });
  });
  return res;
}

export function instanceMapping(
  settings: any,
  instance: IInstance,
  colorMappingHashmap
): ICard {
  const { colorFieldMapping, ...fieldMapping } = settings;

  const fieldsHashmap = arrayOfObjectsToHashmap('code', instance.fields);
  const res = {} as ICard;
  res.title = instance.title;
  res.id = instance._id;

  Object.keys(fieldMapping).forEach(field => {
    res[field] = (fieldsHashmap[fieldMapping[field]] || ({} as any)).value;
  });

  if (colorFieldMapping) {
    const field = fieldsHashmap[colorFieldMapping.fieldCode];
    if (field && colorMappingHashmap[field.value]) {
      res.colorMapping = {
        color: colorMappingHashmap[field.value].color,
        fieldValue: field.value,
      };
    }
  }

  return res;
}

export function sortByOrder(obj1, obj2) {
  return obj1.order - obj2.order;
}

export function getFieldsOfType(
  category: ICategory,
  type?: FieldTypeEnum,
  rule?: RuleTypeEnum
): ICategoryField[] {
  let fields = category.fields;
  if (type) {
    fields = category.fields.filter(f => f.type === type);
    if (rule) {
      fields = fields.filter(
        f => f.rules && f.rules.every(r => r.rule === rule)
      );
    }
  }
  return fields;
}

export function getDefaultFieldOfType(
  category: ICategory,
  type?: FieldTypeEnum,
  rule?: RuleTypeEnum
): string {
  let res: string;
  const fields = getFieldsOfType(category, type, rule);
  if (fields.length > 0) {
    res = fields[0].code;
  }
  return res;
}
