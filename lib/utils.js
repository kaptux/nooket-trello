"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function arrayOfObjectsToHashmap(objectKey, array) {
    let res = {};
    array.forEach(element => {
        res = Object.assign(res, { [element[objectKey]]: element });
    });
    return res;
}
exports.arrayOfObjectsToHashmap = arrayOfObjectsToHashmap;
function instanceMapping(fieldMapping, instance) {
    const fieldsHashmap = arrayOfObjectsToHashmap('code', instance.fields);
    const res = {};
    Object.keys(fieldMapping).forEach(field => {
        res[field] = (fieldsHashmap[fieldMapping[field]] || {}).value;
    });
    return res;
}
exports.instanceMapping = instanceMapping;
function sortByOrder(obj1, obj2) {
    return obj1.order - obj2.order;
}
exports.sortByOrder = sortByOrder;
//# sourceMappingURL=utils.js.map