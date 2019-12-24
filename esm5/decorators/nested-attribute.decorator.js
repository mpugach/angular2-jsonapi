/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { AttributeMetadata } from '../constants/symbols';
import * as _ from 'lodash';
/**
 * @param {?=} options
 * @return {?}
 */
export function NestedAttribute(options) {
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
            var metadata = Reflect.getMetadata('NestedAttribute', target) || {};
            metadata[propertyName] = {
                marked: true
            };
            Reflect.defineMetadata('NestedAttribute', metadata, target);
            /** @type {?} */
            var mappingMetadata = Reflect.getMetadata('AttributeMapping', target) || {};
            /** @type {?} */
            var serializedPropertyName = options.serializedName !== undefined ? options.serializedName : propertyName;
            mappingMetadata[serializedPropertyName] = propertyName;
            Reflect.defineMetadata('AttributeMapping', mappingMetadata, target);
        });
        /** @type {?} */
        var updateMetadata = (/**
         * @param {?} instance
         * @return {?}
         */
        function (instance) {
            /** @type {?} */
            var newValue = instance["_" + propertyName];
            if (!instance[AttributeMetadata]) {
                instance[AttributeMetadata] = {};
            }
            if (instance[AttributeMetadata][propertyName] && !instance.isModelInitialization()) {
                instance[AttributeMetadata][propertyName].newValue = newValue;
                instance[AttributeMetadata][propertyName].hasDirtyAttributes = !_.isEqual(instance[AttributeMetadata][propertyName].oldValue, newValue);
                instance[AttributeMetadata][propertyName].serialisationValue = newValue;
            }
            else {
                /** @type {?} */
                var oldValue = _.cloneDeep(newValue);
                instance[AttributeMetadata][propertyName] = {
                    newValue: newValue,
                    oldValue: oldValue,
                    converter: converter,
                    nested: true,
                    hasDirtyAttributes: !_.isEqual(newValue, oldValue)
                };
            }
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
            this["_" + propertyName] = converter(targetType, newVal);
            updateMetadata(this);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmVzdGVkLWF0dHJpYnV0ZS5kZWNvcmF0b3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyMi1qc29uYXBpLyIsInNvdXJjZXMiOlsiZGVjb3JhdG9ycy9uZXN0ZWQtYXR0cmlidXRlLmRlY29yYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFFekQsT0FBTyxLQUFLLENBQUMsTUFBTSxRQUFRLENBQUM7Ozs7O0FBRTVCLE1BQU0sVUFBVSxlQUFlLENBQUMsT0FBdUM7SUFBdkMsd0JBQUEsRUFBQSxZQUF1QztJQUNyRTs7Ozs7SUFBTyxVQUFDLE1BQVcsRUFBRSxZQUFvQjs7WUFDakMsU0FBUzs7Ozs7O1FBQUcsVUFBQyxRQUFhLEVBQUUsS0FBVSxFQUFFLGdCQUF3QjtZQUF4QixpQ0FBQSxFQUFBLHdCQUF3Qjs7Z0JBQ2hFLGFBQWE7WUFFakIsSUFBSSxPQUFPLENBQUMsU0FBUyxFQUFFO2dCQUNyQixhQUFhLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQzthQUNuQztpQkFBTTs7b0JBQ0MsUUFBUSxHQUFHLElBQUksUUFBUSxFQUFFO2dCQUUvQixJQUFJLFFBQVEsQ0FBQyxJQUFJLElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRTtvQkFDcEMsYUFBYSxHQUFHLFFBQVEsQ0FBQztpQkFDMUI7YUFDRjtZQUVELElBQUksYUFBYSxFQUFFO2dCQUNqQixJQUFJLENBQUMsZ0JBQWdCLEVBQUU7b0JBQ3JCLE9BQU8sYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztpQkFDbEM7Z0JBQ0QsT0FBTyxhQUFhLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3BDO1lBRUQsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDLENBQUE7O1lBRUssZUFBZTs7O1FBQUc7O2dCQUNoQixRQUFRLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsRUFBRSxN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dCB7IEF0dHJpYnV0ZU1ldGFkYXRhIH0gZnJvbSAnLi4vY29uc3RhbnRzL3N5bWJvbHMnO1xuaW1wb3J0IHsgQXR0cmlidXRlRGVjb3JhdG9yT3B0aW9ucyB9IGZyb20gJy4uL2ludGVyZmFjZXMvYXR0cmlidXRlLWRlY29yYXRvci1vcHRpb25zLmludGVyZmFjZSc7XG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBOZXN0ZWRBdHRyaWJ1dGUob3B0aW9uczogQXR0cmlidXRlRGVjb3JhdG9yT3B0aW9ucyA9IHt9KTogUHJvcGVydHlEZWNvcmF0b3Ige1xuICByZXR1cm4gKHRhcmdldDogYW55LCBwcm9wZXJ0eU5hbWU6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IGNvbnZlcnRlciA9IChkYXRhVHlwZTogYW55LCB2YWx1ZTogYW55LCBmb3JTZXJpYWxpc2F0aW9uID0gZmFsc2UpOiBhbnkgPT4ge1xuICAgICAgbGV0IGF0dHJDb252ZXJ0ZXI7XG5cbiAgICAgIGlmIChvcHRpb25zLmNvbnZlcnRlcikge1xuICAgICAgICBhdHRyQ29udmVydGVyID0gb3B0aW9ucy5jb252ZXJ0ZXI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBkYXRhdHlwZSA9IG5ldyBkYXRhVHlwZSgpO1xuXG4gICAgICAgIGlmIChkYXRhdHlwZS5tYXNrICYmIGRhdGF0eXBlLnVubWFzaykge1xuICAgICAgICAgIGF0dHJDb252ZXJ0ZXIgPSBkYXRhdHlwZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoYXR0ckNvbnZlcnRlcikge1xuICAgICAgICBpZiAoIWZvclNlcmlhbGlzYXRpb24pIHtcbiAgICAgICAgICByZXR1cm4gYXR0ckNvbnZlcnRlci5tYXNrKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXR0ckNvbnZlcnRlci51bm1hc2sodmFsdWUpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcblxuICAgIGNvbnN0IHNhdmVBbm5vdGF0aW9ucyA9ICgpID0+IHtcbiAgICAgIGNvbnN0IG1ldGFkYXRhID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnTmVzdGVkQXR0cmlidXRlJywgdGFyZ2V0KSB8fCB7fTtcblxuICAgICAgbWV0YWRhdGFbcHJvcGVydHlOYW1lXSA9IHtcbiAgICAgICAgbWFya2VkOiB0cnVlXG4gICAgICB9O1xuXG4gICAgICBSZWZsZWN0LmRlZmluZU1ldGFkYXRhKCdOZXN0ZWRBdHRyaWJ1dGUnLCBtZXRhZGF0YSwgdGFyZ2V0KTtcblxuICAgICAgY29uc3QgbWFwcGluZ01ldGFkYXRhID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnQXR0cmlidXRlTWFwcGluZycsIHRhcmdldCkgfHwge307XG4gICAgICBjb25zdCBzZXJpYWxpemVkUHJvcGVydHlOYW1lID0gb3B0aW9ucy5zZXJpYWxpemVkTmFtZSAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5zZXJpYWxpemVkTmFtZSA6IHByb3BlcnR5TmFtZTtcbiAgICAgIG1hcHBpbmdNZXRhZGF0YVtzZXJpYWxpemVkUHJvcGVydHlOYW1lXSA9IHByb3BlcnR5TmFtZTtcbiAgICAgIFJlZmxlY3QuZGVmaW5lTWV0YWRhdGEoJ0F0dHJpYnV0ZU1hcHBpbmcnLCBtYXBwaW5nTWV0YWRhdGEsIHRhcmdldCk7XG4gICAgfTtcblxuICAgIGNvbnN0IHVwZGF0ZU1ldGFkYXRhID0gKGluc3RhbmNlOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IG5ld1ZhbHVlID0gaW5zdGFuY2VbYF8ke3Byb3BlcnR5TmFtZX1gXTtcblxuICAgICAgaWYgKCFpbnN0YW5jZVtBdHRyaWJ1dGVNZXRhZGF0YV0pIHtcbiAgICAgICAgaW5zdGFuY2VbQXR0cmlidXRlTWV0YWRhdGFdID0ge307XG4gICAgICB9XG4gICAgICBpZiAoaW5zdGFuY2VbQXR0cmlidXRlTWV0YWRhdGFdW3Byb3BlcnR5TmFtZV0gJiYgIWluc3RhbmNlLmlzTW9kZWxJbml0aWFsaXphdGlvbigpKSB7XG4gICAgICAgIGluc3RhbmNlW0F0dHJpYnV0ZU1ldGFkYXRhXVtwcm9wZXJ0eU5hbWVdLm5ld1ZhbHVlID0gbmV3VmFsdWU7XG4gICAgICAgIGluc3RhbmNlW0F0dHJpYnV0ZU1ldGFkYXRhXVtwcm9wZXJ0eU5hbWVdLmhhc0RpcnR5QXR0cmlidXRlcyA9ICFfLmlzRXF1YWwoXG4gICAgICAgICAgaW5zdGFuY2VbQXR0cmlidXRlTWV0YWRhdGFdW3Byb3BlcnR5TmFtZV0ub2xkVmFsdWUsXG4gICAgICAgICAgbmV3VmFsdWVcbiAgICAgICAgKTtcbiAgICAgICAgaW5zdGFuY2VbQXR0cmlidXRlTWV0YWRhdGFdW3Byb3BlcnR5TmFtZV0uc2VyaWFsaXNhdGlvblZhbHVlID0gbmV3VmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBvbGRWYWx1ZSA9IF8uY2xvbmVEZWVwKG5ld1ZhbHVlKTtcbiAgICAgICAgaW5zdGFuY2VbQXR0cmlidXRlTWV0YWRhdGFdW3Byb3BlcnR5TmFtZV0gPSB7XG4gICAgICAgICAgbmV3VmFsdWUsXG4gICAgICAgICAgb2xkVmFsdWUsXG4gICAgICAgICAgY29udmVydGVyLFxuICAgICAgICAgIG5lc3RlZDogdHJ1ZSxcbiAgICAgICAgICBoYXNEaXJ0eUF0dHJpYnV0ZXM6ICFfLmlzRXF1YWwobmV3VmFsdWUsIG9sZFZhbHVlKVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBnZXR0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzW2BfJHtwcm9wZXJ0eU5hbWV9YF07XG4gICAgfTtcblxuICAgIGNvbnN0IHNldHRlciA9IGZ1bmN0aW9uKG5ld1ZhbDogYW55KSB7XG4gICAgICBjb25zdCB0YXJnZXRUeXBlID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnZGVzaWduOnR5cGUnLCB0YXJnZXQsIHByb3BlcnR5TmFtZSk7XG4gICAgICB0aGlzW2BfJHtwcm9wZXJ0eU5hbWV9YF0gPSBjb252ZXJ0ZXIodGFyZ2V0VHlwZSwgbmV3VmFsKTtcbiAgICAgIHVwZGF0ZU1ldGFkYXRhKHRoaXMpO1xuICAgIH07XG5cbiAgICBpZiAoZGVsZXRlIHRhcmdldFtwcm9wZXJ0eU5hbWVdKSB7XG4gICAgICBzYXZlQW5ub3RhdGlvbnMoKTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5TmFtZSwge1xuICAgICAgICBnZXQ6IGdldHRlcixcbiAgICAgICAgc2V0OiBzZXR0ZXIsXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICB9XG4gIH07XG59XG4iXX0=