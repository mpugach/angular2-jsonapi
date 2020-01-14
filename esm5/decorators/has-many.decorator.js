/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @param {?=} config
 * @return {?}
 */
export function HasMany(config) {
    if (config === void 0) { config = {}; }
    return (/**
     * @param {?} target
     * @param {?} propertyName
     * @return {?}
     */
    function (target, propertyName) {
        /** @type {?} */
        var annotations = Reflect.getMetadata('HasMany', target) || [];
        annotations.push({
            propertyName: propertyName,
            relationship: config.key || propertyName
        });
        Reflect.defineMetadata('HasMany', annotations, target);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFzLW1hbnkuZGVjb3JhdG9yLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcjItanNvbmFwaS8iLCJzb3VyY2VzIjpbImRlY29yYXRvcnMvaGFzLW1hbnkuZGVjb3JhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsTUFBTSxVQUFVLE9BQU8sQ0FBQyxNQUFnQjtJQUFoQix1QkFBQSxFQUFBLFdBQWdCO0lBQ3RDOzs7OztJQUFPLFVBQUMsTUFBVyxFQUFFLFlBQTZCOztZQUMxQyxXQUFXLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLElBQUksRUFBRTtRQUVoRSxXQUFXLENBQUMsSUFBSSxDQUFDO1lBQ2YsWUFBWSxjQUFBO1lBQ1osWUFBWSxFQUFFLE1BQU0sQ0FBQyxHQUFHLElBQUksWUFBWTtTQUN6QyxDQUFDLENBQUM7UUFFSCxPQUFPLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRSxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDekQsQ0FBQyxFQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBIYXNNYW55KGNvbmZpZzogYW55ID0ge30pIHtcbiAgcmV0dXJuICh0YXJnZXQ6IGFueSwgcHJvcGVydHlOYW1lOiBzdHJpbmcgfCBzeW1ib2wpID0+IHtcbiAgICBjb25zdCBhbm5vdGF0aW9ucyA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ0hhc01hbnknLCB0YXJnZXQpIHx8IFtdO1xuXG4gICAgYW5ub3RhdGlvbnMucHVzaCh7XG4gICAgICBwcm9wZXJ0eU5hbWUsXG4gICAgICByZWxhdGlvbnNoaXA6IGNvbmZpZy5rZXkgfHwgcHJvcGVydHlOYW1lXG4gICAgfSk7XG5cbiAgICBSZWZsZWN0LmRlZmluZU1ldGFkYXRhKCdIYXNNYW55JywgYW5ub3RhdGlvbnMsIHRhcmdldCk7XG4gIH07XG59XG4iXX0=