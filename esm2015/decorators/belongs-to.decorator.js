/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @param {?=} config
 * @return {?}
 */
export function BelongsTo(config = {}) {
    return (/**
     * @param {?} target
     * @param {?} propertyName
     * @return {?}
     */
    (target, propertyName) => {
        /** @type {?} */
        const annotations = Reflect.getMetadata('BelongsTo', target) || [];
        annotations.push({
            propertyName,
            relationship: config.key || propertyName
        });
        Reflect.defineMetadata('BelongsTo', annotations, target);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVsb25ncy10by5kZWNvcmF0b3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyMi1qc29uYXBpLyIsInNvdXJjZXMiOlsiZGVjb3JhdG9ycy9iZWxvbmdzLXRvLmRlY29yYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE1BQU0sVUFBVSxTQUFTLENBQUMsU0FBYyxFQUFFO0lBQ3hDOzs7OztJQUFPLENBQUMsTUFBVyxFQUFFLFlBQTZCLEVBQUUsRUFBRTs7Y0FDOUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxJQUFJLEVBQUU7UUFFbEUsV0FBVyxDQUFDLElBQUksQ0FBQztZQUNmLFlBQVk7WUFDWixZQUFZLEVBQUUsTUFBTSxDQUFDLEdBQUcsSUFBSSxZQUFZO1NBQ3pDLENBQUMsQ0FBQztRQUVILE9BQU8sQ0FBQyxjQUFjLENBQUMsV0FBVyxFQUFFLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMzRCxDQUFDLEVBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIEJlbG9uZ3NUbyhjb25maWc6IGFueSA9IHt9KSB7XG4gIHJldHVybiAodGFyZ2V0OiBhbnksIHByb3BlcnR5TmFtZTogc3RyaW5nIHwgc3ltYm9sKSA9PiB7XG4gICAgY29uc3QgYW5ub3RhdGlvbnMgPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdCZWxvbmdzVG8nLCB0YXJnZXQpIHx8IFtdO1xuXG4gICAgYW5ub3RhdGlvbnMucHVzaCh7XG4gICAgICBwcm9wZXJ0eU5hbWUsXG4gICAgICByZWxhdGlvbnNoaXA6IGNvbmZpZy5rZXkgfHwgcHJvcGVydHlOYW1lXG4gICAgfSk7XG5cbiAgICBSZWZsZWN0LmRlZmluZU1ldGFkYXRhKCdCZWxvbmdzVG8nLCBhbm5vdGF0aW9ucywgdGFyZ2V0KTtcbiAgfTtcbn1cbiJdfQ==