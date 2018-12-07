import { arrayOf } from 'prop-types';
import { IInstance } from 'nooket-common';

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

export function instanceMapping<T>(fieldMapping: any, instance: IInstance): T {
  const fieldsHashmap = arrayOfObjectsToHashmap('code', instance.fields);
  const res = {} as T;

  Object.keys(fieldMapping).forEach(field => {
    res[field] = (fieldsHashmap[fieldMapping[field]] || ({} as any)).value;
  });

  return res;
}

export function sortByOrder(obj1, obj2) {
  return obj1.order - obj2.order;
}
