/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { DateConverter } from '../converters/date/date.converter';
/**
 * @param {?=} options
 * @return {?}
 */
export function JsonAttribute(options) {
    if (options === void 0) { options = {}; }
    return (/**
     * @param {?} target
     * @param {?} propertyName
     * @return {?}
     */
    function (target, propertyName) {
        /** @type {?} */
        var converter = (/**
         * @param {?} dataType
         * @param {?} value
         * @param {?=} forSerialisation
         * @return {?}
         */
        function (dataType, value, forSerialisation) {
            if (forSerialisation === void 0) { forSerialisation = false; }
            /** @type {?} */
            var attrConverter;
            if (options.converter) {
                attrConverter = options.converter;
            }
            else if (dataType === Date) {
                attrConverter = new DateConverter();
            }
            else {
                /** @type {?} */
                var datatype = new dataType();
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
        var saveAnnotations = (/**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var metadata = Reflect.getMetadata('JsonAttribute', target) || {};
            metadata[propertyName] = {
                marked: true
            };
            Reflect.defineMetadata('JsonAttribute', metadata, target);
            /** @type {?} */
            var mappingMetadata = Reflect.getMetadata('AttributeMapping', target) || {};
            /** @type {?} */
            var serializedPropertyName = options.serializedName !== undefined ? options.serializedName : propertyName;
            mappingMetadata[serializedPropertyName] = propertyName;
            Reflect.defineMetadata('AttributeMapping', mappingMetadata, target);
        });
        /** @type {?} */
        var getter = (/**
         * @return {?}
         */
        function () {
            if (this.nestedDataSerialization) {
                return converter(Reflect.getMetadata('design:type', target, propertyName), this["_" + propertyName], true);
            }
            return this["_" + propertyName];
        });
        /** @type {?} */
        var setter = (/**
         * @param {?} newVal
         * @return {?}
         */
        function (newVal) {
            /** @type {?} */
            var targetType = Reflect.getMetadata('design:type', target, propertyName);
            this["_" + propertyName] = converter(targetType, newVal);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi1hdHRyaWJ1dGUuZGVjb3JhdG9yLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcjItanNvbmFwaS8iLCJzb3VyY2VzIjpbImRlY29yYXRvcnMvanNvbi1hdHRyaWJ1dGUuZGVjb3JhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFDQSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sbUNBQW1DLENBQUM7Ozs7O0FBRWxFLE1BQU0sVUFBVSxhQUFhLENBQUMsT0FBdUM7SUFBdkMsd0JBQUEsRUFBQSxZQUF1QztJQUNuRTs7Ozs7SUFBTyxVQUFDLE1BQVcsRUFBRSxZQUFvQjs7WUFDakMsU0FBUzs7Ozs7O1FBQUcsVUFBQyxRQUFhLEVBQUUsS0FBVSxFQUFFLGdCQUF3QjtZQUF4QixpQ0FBQSxFQUFBLHdCQUF3Qjs7Z0JBQ2hFLGFBQWE7WUFFakIsSUFBSSxPQUFPLENBQUMsU0FBUyxFQUFFO2dCQUNyQixhQUFhLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQzthQUNuQztpQkFBTSxJQUFJLFFBQVEsS0FBSyxJQUFJLEVBQUU7Z0JBQzVCLGFBQWEsR0FBRyxJQUFJLGFBQWEsRUFBRSxDQUFDO2FBQ3JDO2lCQUFNOztvQkFDQyxRQUFRLEdBQUcsSUFBSSxRQUFRLEVBQUU7Z0JBRS9CLElBQUksUUFBUSxDQUFDLElBQUksSUFBSSxRQUFRLENBQUMsTUFBTSxFQUFFO29CQUNwQyxhQUFhLEdBQUcsUUFBUSxDQUFDO2lCQUMxQjthQUNGO1lBRUQsSUFBSSxhQUFhLEVBQUU7Z0JBQ2pCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtvQkFDckIsT0FBTyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUNsQztnQkFDRCxPQUFPLGFBQWEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDcEM7WUFFRCxPQUFPLEtBQUssQ0FBQztRQUNmLENBQUMsQ0FBQTs7WUFFSyxlQUFlOzs7UUFBRzs7Z0JBQ2hCLFFBQVEsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLGVBQWUsRUFBRSxNQUFNLENBQUMsSUFBSSxFQUFFO1lBRW5FLFFBQVEsQ0FBQyxZQUFZLENBQUMsR0FBRztnQkFDdkIsTUFBTSxFQUFFLElBQUk7YUFDYixDQUFDO1lBRUYsT0FBTyxDQUFDLGNBQWMsQ0FBQyxlQUFlLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDOztnQkFFcEQsZUFBZSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsa0JBQWtCLEVBQUUsTUFBTSxDQUFDLElBQUksRUFBRTs7Z0JBQ3ZFLHNCQUFzQixHQUFHLE9BQU8sQ0FBQyxjQUFjLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxZQUFZO1lBQzNHLGVBQWUsQ0FBQyxzQkFBc0IsQ0FBQyxHQUFHLFlBQVksQ0FBQztZQUN2RCxPQUFPLENBQUMsY0FBYyxDQUFDLGtCQUFrQixFQUFFLGVBQWUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN0RSxDQUFDLENBQUE7O1lBRUssTUFBTTs7O1FBQUc7WUFDYixJQUFJLElBQUksQ0FBQyx1QkFBdUIsRUFBRTtnQkFDaEMsT0FBTyxTQUFTLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsTUFBTSxFQUFFLFlBQVksQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFJLFlBQWMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQzVHO1lBQ0QsT0FBTyxJQUFJLENBQUMsTUFBSSxZQUFjLENBQUMsQ0FBQztRQUNsQyxDQUFDLENBQUE7O1lBRUssTUFBTTs7OztRQUFHLFVBQVMsTUFBVzs7Z0JBQzNCLFVBQVUsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxNQUFNLEVBQUUsWUFBWSxDQUFDO1lBQzNFLElBQUksQ0FBQyxNQUFJLFlBQWMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDM0QsQ0FBQyxDQUFBO1FBRUQsSUFBSSxPQUFPLE1BQU0sQ0FBQyxZQUFZLENBQUMsRUFBRTtZQUMvQixlQUFlLEVBQUUsQ0FBQztZQUNsQixNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUU7Z0JBQzFDLEdBQUcsRUFBRSxNQUFNO2dCQUNYLEdBQUcsRUFBRSxNQUFNO2dCQUNYLFVBQVUsRUFBRSxJQUFJO2dCQUNoQixZQUFZLEVBQUUsSUFBSTthQUNuQixDQUFDLENBQUM7U0FDSjtJQUNILENBQUMsRUFBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBdHRyaWJ1dGVEZWNvcmF0b3JPcHRpb25zIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9hdHRyaWJ1dGUtZGVjb3JhdG9yLW9wdGlvbnMuaW50ZXJmYWNlJztcbmltcG9ydCB7IERhdGVDb252ZXJ0ZXIgfSBmcm9tICcuLi9jb252ZXJ0ZXJzL2RhdGUvZGF0ZS5jb252ZXJ0ZXInO1xuXG5leHBvcnQgZnVuY3Rpb24gSnNvbkF0dHJpYnV0ZShvcHRpb25zOiBBdHRyaWJ1dGVEZWNvcmF0b3JPcHRpb25zID0ge30pOiBQcm9wZXJ0eURlY29yYXRvciB7XG4gIHJldHVybiAodGFyZ2V0OiBhbnksIHByb3BlcnR5TmFtZTogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgY29udmVydGVyID0gKGRhdGFUeXBlOiBhbnksIHZhbHVlOiBhbnksIGZvclNlcmlhbGlzYXRpb24gPSBmYWxzZSk6IGFueSA9PiB7XG4gICAgICBsZXQgYXR0ckNvbnZlcnRlcjtcblxuICAgICAgaWYgKG9wdGlvbnMuY29udmVydGVyKSB7XG4gICAgICAgIGF0dHJDb252ZXJ0ZXIgPSBvcHRpb25zLmNvbnZlcnRlcjtcbiAgICAgIH0gZWxzZSBpZiAoZGF0YVR5cGUgPT09IERhdGUpIHtcbiAgICAgICAgYXR0ckNvbnZlcnRlciA9IG5ldyBEYXRlQ29udmVydGVyKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBkYXRhdHlwZSA9IG5ldyBkYXRhVHlwZSgpO1xuXG4gICAgICAgIGlmIChkYXRhdHlwZS5tYXNrICYmIGRhdGF0eXBlLnVubWFzaykge1xuICAgICAgICAgIGF0dHJDb252ZXJ0ZXIgPSBkYXRhdHlwZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoYXR0ckNvbnZlcnRlcikge1xuICAgICAgICBpZiAoIWZvclNlcmlhbGlzYXRpb24pIHtcbiAgICAgICAgICByZXR1cm4gYXR0ckNvbnZlcnRlci5tYXNrKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXR0ckNvbnZlcnRlci51bm1hc2sodmFsdWUpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcblxuICAgIGNvbnN0IHNhdmVBbm5vdGF0aW9ucyA9ICgpID0+IHtcbiAgICAgIGNvbnN0IG1ldGFkYXRhID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnSnNvbkF0dHJpYnV0ZScsIHRhcmdldCkgfHwge307XG5cbiAgICAgIG1ldGFkYXRhW3Byb3BlcnR5TmFtZV0gPSB7XG4gICAgICAgIG1hcmtlZDogdHJ1ZVxuICAgICAgfTtcblxuICAgICAgUmVmbGVjdC5kZWZpbmVNZXRhZGF0YSgnSnNvbkF0dHJpYnV0ZScsIG1ldGFkYXRhLCB0YXJnZXQpO1xuXG4gICAgICBjb25zdCBtYXBwaW5nTWV0YWRhdGEgPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdBdHRyaWJ1dGVNYXBwaW5nJywgdGFyZ2V0KSB8fCB7fTtcbiAgICAgIGNvbnN0IHNlcmlhbGl6ZWRQcm9wZXJ0eU5hbWUgPSBvcHRpb25zLnNlcmlhbGl6ZWROYW1lICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLnNlcmlhbGl6ZWROYW1lIDogcHJvcGVydHlOYW1lO1xuICAgICAgbWFwcGluZ01ldGFkYXRhW3NlcmlhbGl6ZWRQcm9wZXJ0eU5hbWVdID0gcHJvcGVydHlOYW1lO1xuICAgICAgUmVmbGVjdC5kZWZpbmVNZXRhZGF0YSgnQXR0cmlidXRlTWFwcGluZycsIG1hcHBpbmdNZXRhZGF0YSwgdGFyZ2V0KTtcbiAgICB9O1xuXG4gICAgY29uc3QgZ2V0dGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5uZXN0ZWREYXRhU2VyaWFsaXphdGlvbikge1xuICAgICAgICByZXR1cm4gY29udmVydGVyKFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ2Rlc2lnbjp0eXBlJywgdGFyZ2V0LCBwcm9wZXJ0eU5hbWUpLCB0aGlzW2BfJHtwcm9wZXJ0eU5hbWV9YF0sIHRydWUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXNbYF8ke3Byb3BlcnR5TmFtZX1gXTtcbiAgICB9O1xuXG4gICAgY29uc3Qgc2V0dGVyID0gZnVuY3Rpb24obmV3VmFsOiBhbnkpIHtcbiAgICAgIGNvbnN0IHRhcmdldFR5cGUgPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdkZXNpZ246dHlwZScsIHRhcmdldCwgcHJvcGVydHlOYW1lKTtcbiAgICAgIHRoaXNbYF8ke3Byb3BlcnR5TmFtZX1gXSA9IGNvbnZlcnRlcih0YXJnZXRUeXBlLCBuZXdWYWwpO1xuICAgIH07XG5cbiAgICBpZiAoZGVsZXRlIHRhcmdldFtwcm9wZXJ0eU5hbWVdKSB7XG4gICAgICBzYXZlQW5ub3RhdGlvbnMoKTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5TmFtZSwge1xuICAgICAgICBnZXQ6IGdldHRlcixcbiAgICAgICAgc2V0OiBzZXR0ZXIsXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xufVxuIl19