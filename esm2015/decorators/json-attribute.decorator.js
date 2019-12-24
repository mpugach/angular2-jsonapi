/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { DateConverter } from '../converters/date/date.converter';
/**
 * @param {?=} options
 * @return {?}
 */
export function JsonAttribute(options = {}) {
    return (/**
     * @param {?} target
     * @param {?} propertyName
     * @return {?}
     */
    (target, propertyName) => {
        /** @type {?} */
        const converter = (/**
         * @param {?} dataType
         * @param {?} value
         * @param {?=} forSerialisation
         * @return {?}
         */
        (dataType, value, forSerialisation = false) => {
            /** @type {?} */
            let attrConverter;
            if (options.converter) {
                attrConverter = options.converter;
            }
            else if (dataType === Date) {
                attrConverter = new DateConverter();
            }
            else {
                /** @type {?} */
                const datatype = new dataType();
                if (datatype.mask && datatype.unmask) {
                    attrConverter = datatype;
                }
            }
            if (attrConverter) {
                if (!forSerialisation) {
                    return attrConverter.mask(value);
                }
                return attrConverter.unmask(value);
            }
            return value;
        });
        /** @type {?} */
        const saveAnnotations = (/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            const metadata = Reflect.getMetadata('JsonAttribute', target) || {};
            metadata[propertyName] = {
                marked: true
            };
            Reflect.defineMetadata('JsonAttribute', metadata, target);
            /** @type {?} */
            const mappingMetadata = Reflect.getMetadata('AttributeMapping', target) || {};
            /** @type {?} */
            const serializedPropertyName = options.serializedName !== undefined ? options.serializedName : propertyName;
            mappingMetadata[serializedPropertyName] = propertyName;
            Reflect.defineMetadata('AttributeMapping', mappingMetadata, target);
        });
        /** @type {?} */
        const getter = (/**
         * @return {?}
         */
        function () {
            if (this.nestedDataSerialization) {
                return converter(Reflect.getMetadata('design:type', target, propertyName), this[`_${propertyName}`], true);
            }
            return this[`_${propertyName}`];
        });
        /** @type {?} */
        const setter = (/**
         * @param {?} newVal
         * @return {?}
         */
        function (newVal) {
            /** @type {?} */
            const targetType = Reflect.getMetadata('design:type', target, propertyName);
            this[`_${propertyName}`] = converter(targetType, newVal);
        });
        if (delete target[propertyName]) {
            saveAnnotations();
            Object.defineProperty(target, propertyName, {
                get: getter,
                set: setter,
                enumerable: true,
                configurable: true
            });
        }
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi1hdHRyaWJ1dGUuZGVjb3JhdG9yLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcjItanNvbmFwaS8iLCJzb3VyY2VzIjpbImRlY29yYXRvcnMvanNvbi1hdHRyaWJ1dGUuZGVjb3JhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFDQSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sbUNBQW1DLENBQUM7Ozs7O0FBRWxFLE1BQU0sVUFBVSxhQUFhLENBQUMsVUFBcUMsRUFBRTtJQUNuRTs7Ozs7SUFBTyxDQUFDLE1BQVcsRUFBRSxZQUFvQixFQUFFLEVBQUU7O2NBQ3JDLFNBQVM7Ozs7OztRQUFHLENBQUMsUUFBYSxFQUFFLEtBQVUsRUFBRSxnQkFBZ0IsR0FBRyxLQUFLLEVBQU8sRUFBRTs7Z0JBQ3pFLGFBQWE7WUFFakIsSUFBSSxPQUFPLENBQUMsU0FBUyxFQUFFO2dCQUNyQixhQUFhLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQzthQUNuQztpQkFBTSxJQUFJLFFBQVEsS0FBSyxJQUFJLEVBQUU7Z0JBQzVCLGFBQWEsR0FBRyxJQUFJLGFBQWEsRUFBRSxDQUFDO2FBQ3JDO2lCQUFNOztzQkFDQyxRQUFRLEdBQUcsSUFBSSxRQUFRLEVBQUU7Z0JBRS9CLElBQUksUUFBUSxDQUFDLElBQUksSUFBSSxRQUFRLENBQUMsTUFBTSxFQUFFO29CQUNwQyxhQUFhLEdBQUcsUUFBUSxDQUFDO2lCQUMxQjthQUNGO1lBRUQsSUFBSSxhQUFhLEVBQUU7Z0JBQ2pCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtvQkFDckIsT0FBTyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUNsQztnQkFDRCxPQUFPLGFBQWEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDcEM7WUFFRCxPQUFPLEtBQUssQ0FBQztRQUNmLENBQUMsQ0FBQTs7Y0FFSyxlQUFlOzs7UUFBRyxHQUFHLEVBQUU7O2tCQUNyQixRQUFRLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxlQUFlLEVBQUUsTUFBTSxDQUFDLElBQUksRUFBRTtZQUVuRSxRQUFRLENBQUMsWUFBWSxDQUFDLEdBQUc7Z0JBQ3ZCLE1BQU0sRUFBRSxJQUFJO2FBQ2IsQ0FBQztZQUVGLE9BQU8sQ0FBQyxjQUFjLENBQUMsZUFBZSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQzs7a0JBRXBELGVBQWUsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLGtCQUFrQixFQUFFLE1BQU0sQ0FBQyxJQUFJLEVBQUU7O2tCQUN2RSxzQkFBc0IsR0FBRyxPQUFPLENBQUMsY0FBYyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsWUFBWTtZQUMzRyxlQUFlLENBQUMsc0JBQXNCLENBQUMsR0FBRyxZQUFZLENBQUM7WUFDdkQsT0FBTyxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsRUFBRSxlQUFlLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDdEUsQ0FBQyxDQUFBOztjQUVLLE1BQU07OztRQUFHO1lBQ2IsSUFBSSxJQUFJLENBQUMsdUJBQXVCLEVBQUU7Z0JBQ2hDLE9BQU8sU0FBUyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLE1BQU0sRUFBRSxZQUFZLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxZQUFZLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQzVHO1lBQ0QsT0FBTyxJQUFJLENBQUMsSUFBSSxZQUFZLEVBQUUsQ0FBQyxDQUFDO1FBQ2xDLENBQUMsQ0FBQTs7Y0FFSyxNQUFNOzs7O1FBQUcsVUFBUyxNQUFXOztrQkFDM0IsVUFBVSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLE1BQU0sRUFBRSxZQUFZLENBQUM7WUFDM0UsSUFBSSxDQUFDLElBQUksWUFBWSxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzNELENBQUMsQ0FBQTtRQUVELElBQUksT0FBTyxNQUFNLENBQUMsWUFBWSxDQUFDLEVBQUU7WUFDL0IsZUFBZSxFQUFFLENBQUM7WUFDbEIsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsWUFBWSxFQUFFO2dCQUMxQyxHQUFHLEVBQUUsTUFBTTtnQkFDWCxHQUFHLEVBQUUsTUFBTTtnQkFDWCxVQUFVLEVBQUUsSUFBSTtnQkFDaEIsWUFBWSxFQUFFLElBQUk7YUFDbkIsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDLEVBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXR0cmlidXRlRGVjb3JhdG9yT3B0aW9ucyB9IGZyb20gJy4uL2ludGVyZmFjZXMvYXR0cmlidXRlLWRlY29yYXRvci1vcHRpb25zLmludGVyZmFjZSc7XG5pbXBvcnQgeyBEYXRlQ29udmVydGVyIH0gZnJvbSAnLi4vY29udmVydGVycy9kYXRlL2RhdGUuY29udmVydGVyJztcblxuZXhwb3J0IGZ1bmN0aW9uIEpzb25BdHRyaWJ1dGUob3B0aW9uczogQXR0cmlidXRlRGVjb3JhdG9yT3B0aW9ucyA9IHt9KTogUHJvcGVydHlEZWNvcmF0b3Ige1xuICByZXR1cm4gKHRhcmdldDogYW55LCBwcm9wZXJ0eU5hbWU6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IGNvbnZlcnRlciA9IChkYXRhVHlwZTogYW55LCB2YWx1ZTogYW55LCBmb3JTZXJpYWxpc2F0aW9uID0gZmFsc2UpOiBhbnkgPT4ge1xuICAgICAgbGV0IGF0dHJDb252ZXJ0ZXI7XG5cbiAgICAgIGlmIChvcHRpb25zLmNvbnZlcnRlcikge1xuICAgICAgICBhdHRyQ29udmVydGVyID0gb3B0aW9ucy5jb252ZXJ0ZXI7XG4gICAgICB9IGVsc2UgaWYgKGRhdGFUeXBlID09PSBEYXRlKSB7XG4gICAgICAgIGF0dHJDb252ZXJ0ZXIgPSBuZXcgRGF0ZUNvbnZlcnRlcigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgZGF0YXR5cGUgPSBuZXcgZGF0YVR5cGUoKTtcblxuICAgICAgICBpZiAoZGF0YXR5cGUubWFzayAmJiBkYXRhdHlwZS51bm1hc2spIHtcbiAgICAgICAgICBhdHRyQ29udmVydGVyID0gZGF0YXR5cGU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGF0dHJDb252ZXJ0ZXIpIHtcbiAgICAgICAgaWYgKCFmb3JTZXJpYWxpc2F0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuIGF0dHJDb252ZXJ0ZXIubWFzayh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGF0dHJDb252ZXJ0ZXIudW5tYXNrKHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG5cbiAgICBjb25zdCBzYXZlQW5ub3RhdGlvbnMgPSAoKSA9PiB7XG4gICAgICBjb25zdCBtZXRhZGF0YSA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ0pzb25BdHRyaWJ1dGUnLCB0YXJnZXQpIHx8IHt9O1xuXG4gICAgICBtZXRhZGF0YVtwcm9wZXJ0eU5hbWVdID0ge1xuICAgICAgICBtYXJrZWQ6IHRydWVcbiAgICAgIH07XG5cbiAgICAgIFJlZmxlY3QuZGVmaW5lTWV0YWRhdGEoJ0pzb25BdHRyaWJ1dGUnLCBtZXRhZGF0YSwgdGFyZ2V0KTtcblxuICAgICAgY29uc3QgbWFwcGluZ01ldGFkYXRhID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnQXR0cmlidXRlTWFwcGluZycsIHRhcmdldCkgfHwge307XG4gICAgICBjb25zdCBzZXJpYWxpemVkUHJvcGVydHlOYW1lID0gb3B0aW9ucy5zZXJpYWxpemVkTmFtZSAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5zZXJpYWxpemVkTmFtZSA6IHByb3BlcnR5TmFtZTtcbiAgICAgIG1hcHBpbmdNZXRhZGF0YVtzZXJpYWxpemVkUHJvcGVydHlOYW1lXSA9IHByb3BlcnR5TmFtZTtcbiAgICAgIFJlZmxlY3QuZGVmaW5lTWV0YWRhdGEoJ0F0dHJpYnV0ZU1hcHBpbmcnLCBtYXBwaW5nTWV0YWRhdGEsIHRhcmdldCk7XG4gICAgfTtcblxuICAgIGNvbnN0IGdldHRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMubmVzdGVkRGF0YVNlcmlhbGl6YXRpb24pIHtcbiAgICAgICAgcmV0dXJuIGNvbnZlcnRlcihSZWZsZWN0LmdldE1ldGFkYXRhKCdkZXNpZ246dHlwZScsIHRhcmdldCwgcHJvcGVydHlOYW1lKSwgdGhpc1tgXyR7cHJvcGVydHlOYW1lfWBdLCB0cnVlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzW2BfJHtwcm9wZXJ0eU5hbWV9YF07XG4gICAgfTtcblxuICAgIGNvbnN0IHNldHRlciA9IGZ1bmN0aW9uKG5ld1ZhbDogYW55KSB7XG4gICAgICBjb25zdCB0YXJnZXRUeXBlID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnZGVzaWduOnR5cGUnLCB0YXJnZXQsIHByb3BlcnR5TmFtZSk7XG4gICAgICB0aGlzW2BfJHtwcm9wZXJ0eU5hbWV9YF0gPSBjb252ZXJ0ZXIodGFyZ2V0VHlwZSwgbmV3VmFsKTtcbiAgICB9O1xuXG4gICAgaWYgKGRlbGV0ZSB0YXJnZXRbcHJvcGVydHlOYW1lXSkge1xuICAgICAgc2F2ZUFubm90YXRpb25zKCk7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eU5hbWUsIHtcbiAgICAgICAgZ2V0OiBnZXR0ZXIsXG4gICAgICAgIHNldDogc2V0dGVyLFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn1cbiJdfQ==