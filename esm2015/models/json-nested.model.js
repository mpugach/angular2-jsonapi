/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
export class JsonApiNestedModel {
    /**
     * @param {?=} data
     */
    constructor(data) {
        this.nestedDataSerialization = false;
        if (data) {
            Object.assign(this, data);
        }
    }
    /**
     * @return {?}
     */
    get modelConfig() {
        return Reflect.getMetadata('JsonApiModelConfig', this.constructor);
    }
    /**
     * @param {?} data
     * @return {?}
     */
    fill(data) {
        Object.assign(this, data);
    }
    /**
     * @return {?}
     */
    serialize() {
        return this.transformSerializedNamesToPropertyNames();
    }
    /**
     * @protected
     * @template T
     * @return {?}
     */
    transformSerializedNamesToPropertyNames() {
        /** @type {?} */
        const serializedNameToPropertyName = this.getModelPropertyNames();
        /** @type {?} */
        const properties = {};
        Object.keys(serializedNameToPropertyName).forEach((/**
         * @param {?} serializedName
         * @return {?}
         */
        (serializedName) => {
            if (this && this[serializedName] !== null &&
                this[serializedName] !== undefined && serializedName !== 'nestedDataSerialization') {
                properties[serializedNameToPropertyName[serializedName]] = this[serializedName];
            }
        }));
        return properties;
    }
    /**
     * @protected
     * @return {?}
     */
    getModelPropertyNames() {
        return Reflect.getMetadata('AttributeMapping', this) || [];
    }
}
if (false) {
    /** @type {?} */
    JsonApiNestedModel.prototype.nestedDataSerialization;
    /* Skipping unhandled member: [key: string]: any;*/
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi1uZXN0ZWQubW9kZWwuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyMi1qc29uYXBpLyIsInNvdXJjZXMiOlsibW9kZWxzL2pzb24tbmVzdGVkLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFHQSxNQUFNLE9BQU8sa0JBQWtCOzs7O0lBSzdCLFlBQVksSUFBVTtRQUZmLDRCQUF1QixHQUFHLEtBQUssQ0FBQztRQUdyQyxJQUFJLElBQUksRUFBRTtZQUNSLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQzNCO0lBQ0gsQ0FBQzs7OztJQUVELElBQUksV0FBVztRQUNiLE9BQU8sT0FBTyxDQUFDLFdBQVcsQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDckUsQ0FBQzs7Ozs7SUFFTSxJQUFJLENBQUMsSUFBUztRQUNuQixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM1QixDQUFDOzs7O0lBRU0sU0FBUztRQUNkLE9BQU8sSUFBSSxDQUFDLHVDQUF1QyxFQUFFLENBQUM7SUFDeEQsQ0FBQzs7Ozs7O0lBRVMsdUNBQXVDOztjQUN6Qyw0QkFBNEIsR0FBRyxJQUFJLENBQUMscUJBQXFCLEVBQUU7O2NBQzNELFVBQVUsR0FBUSxFQUFFO1FBQzFCLE1BQU0sQ0FBQyxJQUFJLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxPQUFPOzs7O1FBQUMsQ0FBQyxjQUFjLEVBQUUsRUFBRTtZQUNuRSxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssSUFBSTtnQkFDdkMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLFNBQVMsSUFBSSxjQUFjLEtBQUsseUJBQXlCLEVBQUU7Z0JBQ3BGLFVBQVUsQ0FBQyw0QkFBNEIsQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQzthQUNqRjtRQUNILENBQUMsRUFBQyxDQUFDO1FBRUgsT0FBTyxVQUFVLENBQUM7SUFDcEIsQ0FBQzs7Ozs7SUFFUyxxQkFBcUI7UUFDN0IsT0FBTyxPQUFPLENBQUMsV0FBVyxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUM3RCxDQUFDO0NBQ0Y7OztJQXBDQyxxREFBdUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNb2RlbENvbmZpZyB9IGZyb20gJy4uL2ludGVyZmFjZXMvbW9kZWwtY29uZmlnLmludGVyZmFjZSc7XG5pbXBvcnQgeyBKc29uQXBpTW9kZWwgfSBmcm9tICcuL2pzb24tYXBpLm1vZGVsJztcblxuZXhwb3J0IGNsYXNzIEpzb25BcGlOZXN0ZWRNb2RlbCB7XG4gIFtrZXk6IHN0cmluZ106IGFueTtcblxuICBwdWJsaWMgbmVzdGVkRGF0YVNlcmlhbGl6YXRpb24gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihkYXRhPzogYW55KSB7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgZGF0YSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IG1vZGVsQ29uZmlnKCk6IE1vZGVsQ29uZmlnIHtcbiAgICByZXR1cm4gUmVmbGVjdC5nZXRNZXRhZGF0YSgnSnNvbkFwaU1vZGVsQ29uZmlnJywgdGhpcy5jb25zdHJ1Y3Rvcik7XG4gIH1cblxuICBwdWJsaWMgZmlsbChkYXRhOiBhbnkpIHtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIGRhdGEpO1xuICB9XG5cbiAgcHVibGljIHNlcmlhbGl6ZSgpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybVNlcmlhbGl6ZWROYW1lc1RvUHJvcGVydHlOYW1lcygpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHRyYW5zZm9ybVNlcmlhbGl6ZWROYW1lc1RvUHJvcGVydHlOYW1lczxUIGV4dGVuZHMgSnNvbkFwaU1vZGVsPigpIHtcbiAgICBjb25zdCBzZXJpYWxpemVkTmFtZVRvUHJvcGVydHlOYW1lID0gdGhpcy5nZXRNb2RlbFByb3BlcnR5TmFtZXMoKTtcbiAgICBjb25zdCBwcm9wZXJ0aWVzOiBhbnkgPSB7fTtcbiAgICBPYmplY3Qua2V5cyhzZXJpYWxpemVkTmFtZVRvUHJvcGVydHlOYW1lKS5mb3JFYWNoKChzZXJpYWxpemVkTmFtZSkgPT4ge1xuICAgICAgaWYgKHRoaXMgJiYgdGhpc1tzZXJpYWxpemVkTmFtZV0gIT09IG51bGwgJiZcbiAgICAgICAgdGhpc1tzZXJpYWxpemVkTmFtZV0gIT09IHVuZGVmaW5lZCAmJiBzZXJpYWxpemVkTmFtZSAhPT0gJ25lc3RlZERhdGFTZXJpYWxpemF0aW9uJykge1xuICAgICAgICBwcm9wZXJ0aWVzW3NlcmlhbGl6ZWROYW1lVG9Qcm9wZXJ0eU5hbWVbc2VyaWFsaXplZE5hbWVdXSA9IHRoaXNbc2VyaWFsaXplZE5hbWVdO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb3BlcnRpZXM7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0TW9kZWxQcm9wZXJ0eU5hbWVzKCkge1xuICAgIHJldHVybiBSZWZsZWN0LmdldE1ldGFkYXRhKCdBdHRyaWJ1dGVNYXBwaW5nJywgdGhpcykgfHwgW107XG4gIH1cbn1cbiJdfQ==