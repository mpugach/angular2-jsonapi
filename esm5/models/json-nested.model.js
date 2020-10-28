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
            if (_this && serializedName !== 'nestedDataSerialization') {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi1uZXN0ZWQubW9kZWwuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyMi1qc29uYXBpLyIsInNvdXJjZXMiOlsibW9kZWxzL2pzb24tbmVzdGVkLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFHQTtJQUtFLDRCQUFZLElBQVU7UUFGZiw0QkFBdUIsR0FBRyxLQUFLLENBQUM7UUFHckMsSUFBSSxJQUFJLEVBQUU7WUFDUixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztTQUMzQjtJQUNILENBQUM7SUFFRCxzQkFBSSwyQ0FBVzs7OztRQUFmO1lBQ0UsT0FBTyxPQUFPLENBQUMsV0FBVyxDQUFDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNyRSxDQUFDOzs7T0FBQTs7Ozs7SUFFTSxpQ0FBSTs7OztJQUFYLFVBQVksSUFBUztRQUNuQixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM1QixDQUFDOzs7O0lBRU0sc0NBQVM7OztJQUFoQjtRQUNFLE9BQU8sSUFBSSxDQUFDLHVDQUF1QyxFQUFFLENBQUM7SUFDeEQsQ0FBQzs7Ozs7O0lBRVMsb0VBQXVDOzs7OztJQUFqRDtRQUFBLGlCQVVDOztZQVRPLDRCQUE0QixHQUFHLElBQUksQ0FBQyxxQkFBcUIsRUFBRTs7WUFDM0QsVUFBVSxHQUFRLEVBQUU7UUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLE9BQU87Ozs7UUFBQyxVQUFDLGNBQWM7WUFDL0QsSUFBSSxLQUFJLElBQUksY0FBYyxLQUFLLHlCQUF5QixFQUFFO2dCQUN4RCxVQUFVLENBQUMsNEJBQTRCLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxLQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7YUFDakY7UUFDSCxDQUFDLEVBQUMsQ0FBQztRQUVILE9BQU8sVUFBVSxDQUFDO0lBQ3BCLENBQUM7Ozs7O0lBRVMsa0RBQXFCOzs7O0lBQS9CO1FBQ0UsT0FBTyxPQUFPLENBQUMsV0FBVyxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUM3RCxDQUFDO0lBQ0gseUJBQUM7QUFBRCxDQUFDLEFBdENELElBc0NDOzs7O0lBbkNDLHFEQUF1QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1vZGVsQ29uZmlnIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9tb2RlbC1jb25maWcuaW50ZXJmYWNlJztcbmltcG9ydCB7IEpzb25BcGlNb2RlbCB9IGZyb20gJy4vanNvbi1hcGkubW9kZWwnO1xuXG5leHBvcnQgY2xhc3MgSnNvbkFwaU5lc3RlZE1vZGVsIHtcbiAgW2tleTogc3RyaW5nXTogYW55O1xuXG4gIHB1YmxpYyBuZXN0ZWREYXRhU2VyaWFsaXphdGlvbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKGRhdGE/OiBhbnkpIHtcbiAgICBpZiAoZGF0YSkge1xuICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBkYXRhKTtcbiAgICB9XG4gIH1cblxuICBnZXQgbW9kZWxDb25maWcoKTogTW9kZWxDb25maWcge1xuICAgIHJldHVybiBSZWZsZWN0LmdldE1ldGFkYXRhKCdKc29uQXBpTW9kZWxDb25maWcnLCB0aGlzLmNvbnN0cnVjdG9yKTtcbiAgfVxuXG4gIHB1YmxpYyBmaWxsKGRhdGE6IGFueSkge1xuICAgIE9iamVjdC5hc3NpZ24odGhpcywgZGF0YSk7XG4gIH1cblxuICBwdWJsaWMgc2VyaWFsaXplKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtU2VyaWFsaXplZE5hbWVzVG9Qcm9wZXJ0eU5hbWVzKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgdHJhbnNmb3JtU2VyaWFsaXplZE5hbWVzVG9Qcm9wZXJ0eU5hbWVzPFQgZXh0ZW5kcyBKc29uQXBpTW9kZWw+KCkge1xuICAgIGNvbnN0IHNlcmlhbGl6ZWROYW1lVG9Qcm9wZXJ0eU5hbWUgPSB0aGlzLmdldE1vZGVsUHJvcGVydHlOYW1lcygpO1xuICAgIGNvbnN0IHByb3BlcnRpZXM6IGFueSA9IHt9O1xuICAgIE9iamVjdC5rZXlzKHNlcmlhbGl6ZWROYW1lVG9Qcm9wZXJ0eU5hbWUpLmZvckVhY2goKHNlcmlhbGl6ZWROYW1lKSA9PiB7XG4gICAgICBpZiAodGhpcyAmJiBzZXJpYWxpemVkTmFtZSAhPT0gJ25lc3RlZERhdGFTZXJpYWxpemF0aW9uJykge1xuICAgICAgICBwcm9wZXJ0aWVzW3NlcmlhbGl6ZWROYW1lVG9Qcm9wZXJ0eU5hbWVbc2VyaWFsaXplZE5hbWVdXSA9IHRoaXNbc2VyaWFsaXplZE5hbWVdO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb3BlcnRpZXM7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0TW9kZWxQcm9wZXJ0eU5hbWVzKCkge1xuICAgIHJldHVybiBSZWZsZWN0LmdldE1ldGFkYXRhKCdBdHRyaWJ1dGVNYXBwaW5nJywgdGhpcykgfHwgW107XG4gIH1cbn1cbiJdfQ==