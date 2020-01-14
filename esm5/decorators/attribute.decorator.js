/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { AttributeMetadata } from '../constants/symbols';
import { DateConverter } from '../converters/date/date.converter';
import * as _ from 'lodash';
/**
 * @param {?=} options
 * @return {?}
 */
export function Attribute(options) {
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
            var metadata = Reflect.getMetadata('Attribute', target) || {};
            metadata[propertyName] = {
                marked: true
            };
            Reflect.defineMetadata('Attribute', metadata, target);
            /** @type {?} */
            var mappingMetadata = Reflect.getMetadata('AttributeMapping', target) || {};
            /** @type {?} */
            var serializedPropertyName = options.serializedName !== undefined ? options.serializedName : propertyName;
            mappingMetadata[serializedPropertyName] = propertyName;
            Reflect.defineMetadata('AttributeMapping', mappingMetadata, target);
        });
        /** @type {?} */
        var setMetadata = (/**
         * @param {?} instance
         * @param {?} oldValue
         * @param {?} newValue
         * @return {?}
         */
        function (instance, oldValue, newValue) {
            /** @type {?} */
            var targetType = Reflect.getMetadata('design:type', target, propertyName);
            if (!instance[AttributeMetadata]) {
                instance[AttributeMetadata] = {};
            }
            instance[AttributeMetadata][propertyName] = {
                newValue: newValue,
                oldValue: oldValue,
                nested: false,
                serializedName: options.serializedName,
                hasDirtyAttributes: !_.isEqual(oldValue, newValue),
                serialisationValue: converter(targetType, newValue, true)
            };
        });
        /** @type {?} */
        var getter = (/**
         * @return {?}
         */
        function () {
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
            /** @type {?} */
            var convertedValue = converter(targetType, newVal);
            /** @type {?} */
            var oldValue = null;
            if (this.isModelInitialization() && this.id) {
                oldValue = converter(targetType, newVal);
            }
            else {
                if (this[AttributeMetadata] && this[AttributeMetadata][propertyName]) {
                    oldValue = this[AttributeMetadata][propertyName].oldValue;
                }
            }
            this["_" + propertyName] = convertedValue;
            setMetadata(this, oldValue, convertedValue);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXR0cmlidXRlLmRlY29yYXRvci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXIyLWpzb25hcGkvIiwic291cmNlcyI6WyJkZWNvcmF0b3JzL2F0dHJpYnV0ZS5kZWNvcmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRXpELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUNsRSxPQUFPLEtBQUssQ0FBQyxNQUFNLFFBQVEsQ0FBQzs7Ozs7QUFFNUIsTUFBTSxVQUFVLFNBQVMsQ0FBQyxPQUF1QztJQUF2Qyx3QkFBQSxFQUFBLFlBQXVDO0lBQy9EOzs7OztJQUFPLFVBQUMsTUFBVyxFQUFFLFlBQW9COztZQUNqQyxTQUFTOzs7Ozs7UUFBRyxVQUFDLFFBQWEsRUFBRSxLQUFVLEVBQUUsZ0JBQXdCO1lBQXhCLGlDQUFBLEVBQUEsd0JBQXdCOztnQkFDaEUsYUFBYTtZQUVqQixJQUFJLE9BQU8sQ0FBQyxTQUFTLEVBQUU7Z0JBQ3JCLGFBQWEsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDO2FBQ25DO2lCQUFNLElBQUksUUFBUSxLQUFLLElBQUksRUFBRTtnQkFDNUIsYUFBYSxHQUFHLElBQUksYUFBYSxFQUFFLENBQUM7YUFDckM7aUJBQU07O29CQUNDLFFBQVEsR0FBRyxJQUFJLFFBQVEsRUFBRTtnQkFFL0IsSUFBSSxRQUFRLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUU7b0JBQ3BDLGFBQWEsR0FBRyxRQUFRLENBQUM7aUJBQzFCO2FBQ0Y7WUFFRCxJQUFJLGFBQWEsRUFBRTtnQkFDakIsSUFBSSxDQUFDLGdCQUFnQixFQUFFO29CQUNyQixPQUFPLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQ2xDO2dCQUNELE9BQU8sYUFBYSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNwQztZ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RUFBRSxNQUFNO2dCQUNYLFVBQVUsRUFBRSxJQUFJO2dCQUNoQixZQUFZLEVBQUUsSUFBSTthQUNuQixDQUFDLENBQUM7U0FDSjtJQUNILENBQUMsRUFBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBdHRyaWJ1dGVNZXRhZGF0YSB9IGZyb20gJy4uL2NvbnN0YW50cy9zeW1ib2xzJztcbmltcG9ydCB7IEF0dHJpYnV0ZURlY29yYXRvck9wdGlvbnMgfSBmcm9tICcuLi9pbnRlcmZhY2VzL2F0dHJpYnV0ZS1kZWNvcmF0b3Itb3B0aW9ucy5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgRGF0ZUNvbnZlcnRlciB9IGZyb20gJy4uL2NvbnZlcnRlcnMvZGF0ZS9kYXRlLmNvbnZlcnRlcic7XG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBBdHRyaWJ1dGUob3B0aW9uczogQXR0cmlidXRlRGVjb3JhdG9yT3B0aW9ucyA9IHt9KTogUHJvcGVydHlEZWNvcmF0b3Ige1xuICByZXR1cm4gKHRhcmdldDogYW55LCBwcm9wZXJ0eU5hbWU6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IGNvbnZlcnRlciA9IChkYXRhVHlwZTogYW55LCB2YWx1ZTogYW55LCBmb3JTZXJpYWxpc2F0aW9uID0gZmFsc2UpOiBhbnkgPT4ge1xuICAgICAgbGV0IGF0dHJDb252ZXJ0ZXI7XG5cbiAgICAgIGlmIChvcHRpb25zLmNvbnZlcnRlcikge1xuICAgICAgICBhdHRyQ29udmVydGVyID0gb3B0aW9ucy5jb252ZXJ0ZXI7XG4gICAgICB9IGVsc2UgaWYgKGRhdGFUeXBlID09PSBEYXRlKSB7XG4gICAgICAgIGF0dHJDb252ZXJ0ZXIgPSBuZXcgRGF0ZUNvbnZlcnRlcigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgZGF0YXR5cGUgPSBuZXcgZGF0YVR5cGUoKTtcblxuICAgICAgICBpZiAoZGF0YXR5cGUubWFzayAmJiBkYXRhdHlwZS51bm1hc2spIHtcbiAgICAgICAgICBhdHRyQ29udmVydGVyID0gZGF0YXR5cGU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGF0dHJDb252ZXJ0ZXIpIHtcbiAgICAgICAgaWYgKCFmb3JTZXJpYWxpc2F0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuIGF0dHJDb252ZXJ0ZXIubWFzayh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGF0dHJDb252ZXJ0ZXIudW5tYXNrKHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG5cbiAgICBjb25zdCBzYXZlQW5ub3RhdGlvbnMgPSAoKSA9PiB7XG4gICAgICBjb25zdCBtZXRhZGF0YSA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ0F0dHJpYnV0ZScsIHRhcmdldCkgfHwge307XG5cbiAgICAgIG1ldGFkYXRhW3Byb3BlcnR5TmFtZV0gPSB7XG4gICAgICAgIG1hcmtlZDogdHJ1ZVxuICAgICAgfTtcblxuICAgICAgUmVmbGVjdC5kZWZpbmVNZXRhZGF0YSgnQXR0cmlidXRlJywgbWV0YWRhdGEsIHRhcmdldCk7XG5cbiAgICAgIGNvbnN0IG1hcHBpbmdNZXRhZGF0YSA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ0F0dHJpYnV0ZU1hcHBpbmcnLCB0YXJnZXQpIHx8IHt9O1xuICAgICAgY29uc3Qgc2VyaWFsaXplZFByb3BlcnR5TmFtZSA9IG9wdGlvbnMuc2VyaWFsaXplZE5hbWUgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMuc2VyaWFsaXplZE5hbWUgOiBwcm9wZXJ0eU5hbWU7XG4gICAgICBtYXBwaW5nTWV0YWRhdGFbc2VyaWFsaXplZFByb3BlcnR5TmFtZV0gPSBwcm9wZXJ0eU5hbWU7XG4gICAgICBSZWZsZWN0LmRlZmluZU1ldGFkYXRhKCdBdHRyaWJ1dGVNYXBwaW5nJywgbWFwcGluZ01ldGFkYXRhLCB0YXJnZXQpO1xuICAgIH07XG5cbiAgICBjb25zdCBzZXRNZXRhZGF0YSA9IChcbiAgICAgIGluc3RhbmNlOiBhbnksXG4gICAgICBvbGRWYWx1ZTogYW55LFxuICAgICAgbmV3VmFsdWU6IGFueVxuICAgICkgPT4ge1xuICAgICAgY29uc3QgdGFyZ2V0VHlwZSA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ2Rlc2lnbjp0eXBlJywgdGFyZ2V0LCBwcm9wZXJ0eU5hbWUpO1xuXG4gICAgICBpZiAoIWluc3RhbmNlW0F0dHJpYnV0ZU1ldGFkYXRhXSkge1xuICAgICAgICBpbnN0YW5jZVtBdHRyaWJ1dGVNZXRhZGF0YV0gPSB7fTtcbiAgICAgIH1cbiAgICAgIGluc3RhbmNlW0F0dHJpYnV0ZU1ldGFkYXRhXVtwcm9wZXJ0eU5hbWVdID0ge1xuICAgICAgICBuZXdWYWx1ZSxcbiAgICAgICAgb2xkVmFsdWUsXG4gICAgICAgIG5lc3RlZDogZmFsc2UsXG4gICAgICAgIHNlcmlhbGl6ZWROYW1lOiBvcHRpb25zLnNlcmlhbGl6ZWROYW1lLFxuICAgICAgICBoYXNEaXJ0eUF0dHJpYnV0ZXM6ICFfLmlzRXF1YWwob2xkVmFsdWUsIG5ld1ZhbHVlKSxcbiAgICAgICAgc2VyaWFsaXNhdGlvblZhbHVlOiBjb252ZXJ0ZXIodGFyZ2V0VHlwZSwgbmV3VmFsdWUsIHRydWUpXG4gICAgICB9O1xuICAgIH07XG5cbiAgICBjb25zdCBnZXR0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzW2BfJHtwcm9wZXJ0eU5hbWV9YF07XG4gICAgfTtcblxuICAgIGNvbnN0IHNldHRlciA9IGZ1bmN0aW9uKG5ld1ZhbDogYW55KSB7XG4gICAgICBjb25zdCB0YXJnZXRUeXBlID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnZGVzaWduOnR5cGUnLCB0YXJnZXQsIHByb3BlcnR5TmFtZSk7XG4gICAgICBjb25zdCBjb252ZXJ0ZWRWYWx1ZSA9IGNvbnZlcnRlcih0YXJnZXRUeXBlLCBuZXdWYWwpO1xuICAgICAgbGV0IG9sZFZhbHVlID0gbnVsbDtcbiAgICAgIGlmICh0aGlzLmlzTW9kZWxJbml0aWFsaXphdGlvbigpICYmIHRoaXMuaWQpIHtcbiAgICAgICAgb2xkVmFsdWUgPSBjb252ZXJ0ZXIodGFyZ2V0VHlwZSwgbmV3VmFsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzW0F0dHJpYnV0ZU1ldGFkYXRhXSAmJiB0aGlzW0F0dHJpYnV0ZU1ldGFkYXRhXVtwcm9wZXJ0eU5hbWVdKSB7XG4gICAgICAgICAgb2xkVmFsdWUgPSB0aGlzW0F0dHJpYnV0ZU1ldGFkYXRhXVtwcm9wZXJ0eU5hbWVdLm9sZFZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXNbYF8ke3Byb3BlcnR5TmFtZX1gXSA9IGNvbnZlcnRlZFZhbHVlO1xuICAgICAgc2V0TWV0YWRhdGEodGhpcywgb2xkVmFsdWUsIGNvbnZlcnRlZFZhbHVlKTtcbiAgICB9O1xuXG4gICAgaWYgKGRlbGV0ZSB0YXJnZXRbcHJvcGVydHlOYW1lXSkge1xuICAgICAgc2F2ZUFubm90YXRpb25zKCk7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eU5hbWUsIHtcbiAgICAgICAgZ2V0OiBnZXR0ZXIsXG4gICAgICAgIHNldDogc2V0dGVyLFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn1cbiJdfQ==