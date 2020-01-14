/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @param {?=} config
 * @return {?}
 */
export function BelongsTo(config) {
    if (config === void 0) { config = {}; }
    return (/**
     * @param {?} target
     * @param {?} propertyName
     * @return {?}
     */
    function (target, propertyName) {
        /** @type {?} */
        var annotations = Reflect.getMetadata('BelongsTo', target) || [];
        annotations.push({
            propertyName: propertyName,
            relationship: config.key || propertyName
        });
        Reflect.defineMetadata('BelongsTo', annotations, target);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVsb25ncy10by5kZWNvcmF0b3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyMi1qc29uYXBpLyIsInNvdXJjZXMiOlsiZGVjb3JhdG9ycy9iZWxvbmdzLXRvLmRlY29yYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE1BQU0sVUFBVSxTQUFTLENBQUMsTUFBZ0I7SUFBaEIsdUJBQUEsRUFBQSxXQUFnQjtJQUN4Qzs7Ozs7SUFBTyxVQUFDLE1BQVcsRUFBRSxZQUE2Qjs7WUFDMUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxJQUFJLEVBQUU7UUFFbEUsV0FBVyxDQUFDLElBQUksQ0FBQztZQUNmLFlBQVksY0FBQTtZQUNaLFlBQVksRUFBRSxNQUFNLENBQUMsR0FBRyxJQUFJLFlBQVk7U0FDekMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxDQUFDLGNBQWMsQ0FBQyxXQUFXLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzNELENBQUMsRUFBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gQmVsb25nc1RvKGNvbmZpZzogYW55ID0ge30pIHtcbiAgcmV0dXJuICh0YXJnZXQ6IGFueSwgcHJvcGVydHlOYW1lOiBzdHJpbmcgfCBzeW1ib2wpID0+IHtcbiAgICBjb25zdCBhbm5vdGF0aW9ucyA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ0JlbG9uZ3NUbycsIHRhcmdldCkgfHwgW107XG5cbiAgICBhbm5vdGF0aW9ucy5wdXNoKHtcbiAgICAgIHByb3BlcnR5TmFtZSxcbiAgICAgIHJlbGF0aW9uc2hpcDogY29uZmlnLmtleSB8fCBwcm9wZXJ0eU5hbWVcbiAgICB9KTtcblxuICAgIFJlZmxlY3QuZGVmaW5lTWV0YWRhdGEoJ0JlbG9uZ3NUbycsIGFubm90YXRpb25zLCB0YXJnZXQpO1xuICB9O1xufVxuIl19