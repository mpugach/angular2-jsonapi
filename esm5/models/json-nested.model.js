/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var JsonApiNestedModel = /** @class */ (function () {
    function JsonApiNestedModel(data) {
        this.nestedDataSerialization = false;
        if (data) {
            Object.assign(this, data);
        }
    }
    Object.defineProperty(JsonApiNestedModel.prototype, "modelConfig", {
        get: /**
         * @return {?}
         */
        function () {
            return Reflect.getMetadata('JsonApiModelConfig', this.constructor);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} data
     * @return {?}
     */
    JsonApiNestedModel.prototype.fill = /**
     * @param {?} data
     * @return {?}
     */
    function (data) {
        Object.assign(this, data);
    };
    /**
     * @return {?}
     */
    JsonApiNestedModel.prototype.serialize = /**
     * @return {?}
     */
    function () {
        return this.transformSerializedNamesToPropertyNames();
    };
    /**
     * @protected
     * @template T
     * @return {?}
     */
    JsonApiNestedModel.prototype.transformSerializedNamesToPropertyNames = /**
     * @protected
     * @template T
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var serializedNameToPropertyName = this.getModelPropertyNames();
        /** @type {?} */
        var properties = {};
        Object.keys(serializedNameToPropertyName).forEach((/**
         * @param {?} serializedName
         * @return {?}
         */
        function (serializedName) {
            if (_this && _this[serializedName] !== null &&
                _this[serializedName] !== undefined && serializedName !== 'nestedDataSerialization') {
                properties[serializedNameToPropertyName[serializedName]] = _this[serializedName];
            }
        }));
        return properties;
    };
    /**
     * @protected
     * @return {?}
     */
    JsonApiNestedModel.prototype.getModelPropertyNames = /**
     * @protected
     * @return {?}
     */
    function () {
        return Reflect.getMetadata('AttributeMapping', this) || [];
    };
    return JsonApiNestedModel;
}());
export { JsonApiNestedModel };
if (false) {
    /** @type {?} */
    JsonApiNestedModel.prototype.nestedDataSerialization;
    /* Skipping unhandled member: [key: string]: any;*/
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi1uZXN0ZWQubW9kZWwuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyMi1qc29uYXBpLyIsInNvdXJjZXMiOlsibW9kZWxzL2pzb24tbmVzdGVkLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFHQTtJQUtFLDRCQUFZLElBQVU7UUFGZiw0QkFBdUIsR0FBRyxLQUFLLENBQUM7UUFHckMsSUFBSSxJQUFJLEVBQUU7WUFDUixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztTQUMzQjtJQUNILENBQUM7SUFFRCxzQkFBSSwyQ0FBVzs7OztRQUFmO1lBQ0UsT0FBTyxPQUFPLENBQUMsV0FBVyxDQUFDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNyRSxDQUFDOzs7T0FBQTs7Ozs7SUFFTSxpQ0FBSTs7OztJQUFYLFVBQVksSUFBUztRQUNuQixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM1QixDQUFDOzs7O0lBRU0sc0NBQVM7OztJQUFoQjtRQUNFLE9BQU8sSUFBSSxDQUFDLHVDQUF1QyxFQUFFLENBQUM7SUFDeEQsQ0FBQzs7Ozs7O0lBRVMsb0VBQXVDOzs7OztJQUFqRDtRQUFBLGlCQVdDOztZQVZPLDRCQUE0QixHQUFHLElBQUksQ0FBQyxxQkFBcUIsRUFBRTs7WUFDM0QsVUFBVSxHQUFRLEVBQUU7UUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLE9BQU87Ozs7UUFBQyxVQUFDLGNBQWM7WUFDL0QsSUFBSSxLQUFJLElBQUksS0FBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLElBQUk7Z0JBQ3ZDLEtBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxTQUFTLElBQUksY0FBYyxLQUFLLHlCQUF5QixFQUFFO2dCQUNwRixVQUFVLENBQUMsNEJBQTRCLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxLQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7YUFDakY7UUFDSCxDQUFDLEVBQUMsQ0FBQztRQUVILE9BQU8sVUFBVSxDQUFDO0lBQ3BCLENBQUM7Ozs7O0lBRVMsa0RBQXFCOzs7O0lBQS9CO1FBQ0UsT0FBTyxPQUFPLENBQUMsV0FBVyxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUM3RCxDQUFDO0lBQ0gseUJBQUM7QUFBRCxDQUFDLEFBdkNELElBdUNDOzs7O0lBcENDLHFEQUF1QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1vZGVsQ29uZmlnIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9tb2RlbC1jb25maWcuaW50ZXJmYWNlJztcbmltcG9ydCB7IEpzb25BcGlNb2RlbCB9IGZyb20gJy4vanNvbi1hcGkubW9kZWwnO1xuXG5leHBvcnQgY2xhc3MgSnNvbkFwaU5lc3RlZE1vZGVsIHtcbiAgW2tleTogc3RyaW5nXTogYW55O1xuXG4gIHB1YmxpYyBuZXN0ZWREYXRhU2VyaWFsaXphdGlvbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKGRhdGE/OiBhbnkpIHtcbiAgICBpZiAoZGF0YSkge1xuICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBkYXRhKTtcbiAgICB9XG4gIH1cblxuICBnZXQgbW9kZWxDb25maWcoKTogTW9kZWxDb25maWcge1xuICAgIHJldHVybiBSZWZsZWN0LmdldE1ldGFkYXRhKCdKc29uQXBpTW9kZWxDb25maWcnLCB0aGlzLmNvbnN0cnVjdG9yKTtcbiAgfVxuXG4gIHB1YmxpYyBmaWxsKGRhdGE6IGFueSkge1xuICAgIE9iamVjdC5hc3NpZ24odGhpcywgZGF0YSk7XG4gIH1cblxuICBwdWJsaWMgc2VyaWFsaXplKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtU2VyaWFsaXplZE5hbWVzVG9Qcm9wZXJ0eU5hbWVzKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgdHJhbnNmb3JtU2VyaWFsaXplZE5hbWVzVG9Qcm9wZXJ0eU5hbWVzPFQgZXh0ZW5kcyBKc29uQXBpTW9kZWw+KCkge1xuICAgIGNvbnN0IHNlcmlhbGl6ZWROYW1lVG9Qcm9wZXJ0eU5hbWUgPSB0aGlzLmdldE1vZGVsUHJvcGVydHlOYW1lcygpO1xuICAgIGNvbnN0IHByb3BlcnRpZXM6IGFueSA9IHt9O1xuICAgIE9iamVjdC5rZXlzKHNlcmlhbGl6ZWROYW1lVG9Qcm9wZXJ0eU5hbWUpLmZvckVhY2goKHNlcmlhbGl6ZWROYW1lKSA9PiB7XG4gICAgICBpZiAodGhpcyAmJiB0aGlzW3NlcmlhbGl6ZWROYW1lXSAhPT0gbnVsbCAmJlxuICAgICAgICB0aGlzW3NlcmlhbGl6ZWROYW1lXSAhPT0gdW5kZWZpbmVkICYmIHNlcmlhbGl6ZWROYW1lICE9PSAnbmVzdGVkRGF0YVNlcmlhbGl6YXRpb24nKSB7XG4gICAgICAgIHByb3BlcnRpZXNbc2VyaWFsaXplZE5hbWVUb1Byb3BlcnR5TmFtZVtzZXJpYWxpemVkTmFtZV1dID0gdGhpc1tzZXJpYWxpemVkTmFtZV07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvcGVydGllcztcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRNb2RlbFByb3BlcnR5TmFtZXMoKSB7XG4gICAgcmV0dXJuIFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ0F0dHJpYnV0ZU1hcHBpbmcnLCB0aGlzKSB8fCBbXTtcbiAgfVxufVxuIl19