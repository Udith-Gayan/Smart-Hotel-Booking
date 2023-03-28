"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JSONHelpers {
    /**
     * Convert json object with snake_case properties to a given class instance.
     * @param obj Json object with snake_case properties.
     * @param ignore List of keys of nested objects which needed to be skipped from camelCase conversion.
     * @returns Converted class instance.
     */
    static castToModel(obj, ignore = []) {
        let returnObj = {};
        for (const [key, value] of Object.entries(obj)) {
            const ccKey = key.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); });
            // Skip from conversion if value is an array or key is ignored.
            returnObj[ccKey] = (typeof value === 'object' && !Array.isArray(value) && !ignore.includes(key)) ?
                this.castToModel(value) : value;
        }
        return returnObj;
    }
    /**
     * Convert class instance or json object with camelCase properties to a json object with snake_case properties.
     * @param obj Class instance or json object with camelCase properties.
     * @param ignore List of keys of nested objects which needed to be skipped from snake_case conversion.
     * @returns Converted json object with snake_case properties.
     */
    static castFromModel(obj, ignore = []) {
        let returnObj = {};
        for (const [key, value] of Object.entries(obj)) {
            const uKey = key.replace(/([A-Z])/g, function (g) { return `_${g[0].toLocaleLowerCase()}`; });
            // Skip from conversion if value is an array or key is ignored.
            returnObj[uKey] = (typeof value === 'object' && !Array.isArray(value) && !ignore.includes(key)) ?
                this.castFromModel(value) : value;
        }
        return returnObj;
    }
}
exports.default = JSONHelpers;
