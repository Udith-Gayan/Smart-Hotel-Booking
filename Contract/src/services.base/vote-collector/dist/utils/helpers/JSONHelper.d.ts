declare class JSONHelpers {
    /**
     * Convert json object with snake_case properties to a given class instance.
     * @param obj Json object with snake_case properties.
     * @param ignore List of keys of nested objects which needed to be skipped from camelCase conversion.
     * @returns Converted class instance.
     */
    static castToModel<T>(obj: any, ignore?: any[]): T;
    /**
     * Convert class instance or json object with camelCase properties to a json object with snake_case properties.
     * @param obj Class instance or json object with camelCase properties.
     * @param ignore List of keys of nested objects which needed to be skipped from snake_case conversion.
     * @returns Converted json object with snake_case properties.
     */
    static castFromModel(obj: any, ignore?: any[]): any;
}
export default JSONHelpers;
