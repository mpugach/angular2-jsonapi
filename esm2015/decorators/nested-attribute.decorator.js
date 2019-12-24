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
export function NestedAttribute(options = {}) {
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
            const metadata = Reflect.getMetadata('NestedAttribute', target) || {};
            metadata[propertyName] = {
                marked: true
            };
            Reflect.defineMetadata('NestedAttribute', metadata, target);
            /** @type {?} */
            const mappingMetadata = Reflect.getMetadata('AttributeMapping', target) || {};
            /** @type {?} */
            const serializedPropertyName = options.serializedName !== undefined ? options.serializedName : propertyName;
            mappingMetadata[serializedPropertyName] = propertyName;
            Reflect.defineMetadata('AttributeMapping', mappingMetadata, target);
        });
        /** @type {?} */
        const updateMetadata = (/**
         * @param {?} instance
         * @return {?}
         */
        (instance) => {
            /** @type {?} */
            const newValue = instance[`_${propertyName}`];
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
                const oldValue = _.cloneDeep(newValue);
                instance[AttributeMetadata][propertyName] = {
                    newValue,
                    oldValue,
                    converter,
                    nested: true,
                    hasDirtyAttributes: !_.isEqual(newValue, oldValue)
                };
            }
        });
        /** @type {?} */
        const getter = (/**
         * @return {?}
         */
        function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmVzdGVkLWF0dHJpYnV0ZS5kZWNvcmF0b3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyMi1qc29uYXBpLyIsInNvdXJjZXMiOlsiZGVjb3JhdG9ycy9uZXN0ZWQtYXR0cmlidXRlLmRlY29yYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFFekQsT0FBTyxLQUFLLENBQUMsTUFBTSxRQUFRLENBQUM7Ozs7O0FBRTVCLE1BQU0sVUFBVSxlQUFlLENBQUMsVUFBcUMsRUFBRTtJQUNyRTs7Ozs7SUFBTyxDQUFDLE1BQVcsRUFBRSxZQUFvQixFQUFFLEVBQUU7O2NBQ3JDLFNBQVM7Ozs7OztRQUFHLENBQUMsUUFBYSxFQUFFLEtBQVUsRUFBRSxnQkFBZ0IsR0FBRyxLQUFLLEVBQU8sRUFBRTs7Z0JBQ3pFLGFBQWE7WUFFakIsSUFBSSxPQUFPLENBQUMsU0FBUyxFQUFFO2dCQUNyQixhQUFhLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQzthQUNuQztpQkFBTTs7c0JBQ0MsUUFBUSxHQUFHLElBQUksUUFBUSxFQUFFO2dCQUUvQixJQUFJLFFBQVEsQ0FBQyxJQUFJLElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRTtvQkFDcEMsYUFBYSxHQUFHLFFBQVEsQ0FBQztpQkFDMUI7YUFDRjtZQUVELElBQUksYUFBYSxFQUFFO2dCQUNqQixJQUFJLENBQUMsZ0JBQWdCLEVBQUU7b0JBQ3JCLE9BQU8sYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztpQkFDbEM7Z0JBQ0QsT0FBTyxhQUFhLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3BDO1lBRUQsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDLENBQUE7O2NBRUssZUFBZTs7O1FBQUcsR0FBRyxFQUFFOztrQkFDckIsUUFBUSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsaUJBQWlCLEVBQUUsTUFB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OlsiaW1wb3J0IHsgQXR0cmlidXRlTWV0YWRhdGEgfSBmcm9tICcuLi9jb25zdGFudHMvc3ltYm9scyc7XG5pbXBvcnQgeyBBdHRyaWJ1dGVEZWNvcmF0b3JPcHRpb25zIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9hdHRyaWJ1dGUtZGVjb3JhdG9yLW9wdGlvbnMuaW50ZXJmYWNlJztcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcblxuZXhwb3J0IGZ1bmN0aW9uIE5lc3RlZEF0dHJpYnV0ZShvcHRpb25zOiBBdHRyaWJ1dGVEZWNvcmF0b3JPcHRpb25zID0ge30pOiBQcm9wZXJ0eURlY29yYXRvciB7XG4gIHJldHVybiAodGFyZ2V0OiBhbnksIHByb3BlcnR5TmFtZTogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgY29udmVydGVyID0gKGRhdGFUeXBlOiBhbnksIHZhbHVlOiBhbnksIGZvclNlcmlhbGlzYXRpb24gPSBmYWxzZSk6IGFueSA9PiB7XG4gICAgICBsZXQgYXR0ckNvbnZlcnRlcjtcblxuICAgICAgaWYgKG9wdGlvbnMuY29udmVydGVyKSB7XG4gICAgICAgIGF0dHJDb252ZXJ0ZXIgPSBvcHRpb25zLmNvbnZlcnRlcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGRhdGF0eXBlID0gbmV3IGRhdGFUeXBlKCk7XG5cbiAgICAgICAgaWYgKGRhdGF0eXBlLm1hc2sgJiYgZGF0YXR5cGUudW5tYXNrKSB7XG4gICAgICAgICAgYXR0ckNvbnZlcnRlciA9IGRhdGF0eXBlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChhdHRyQ29udmVydGVyKSB7XG4gICAgICAgIGlmICghZm9yU2VyaWFsaXNhdGlvbikge1xuICAgICAgICAgIHJldHVybiBhdHRyQ29udmVydGVyLm1hc2sodmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhdHRyQ29udmVydGVyLnVubWFzayh2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xuXG4gICAgY29uc3Qgc2F2ZUFubm90YXRpb25zID0gKCkgPT4ge1xuICAgICAgY29uc3QgbWV0YWRhdGEgPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdOZXN0ZWRBdHRyaWJ1dGUnLCB0YXJnZXQpIHx8IHt9O1xuXG4gICAgICBtZXRhZGF0YVtwcm9wZXJ0eU5hbWVdID0ge1xuICAgICAgICBtYXJrZWQ6IHRydWVcbiAgICAgIH07XG5cbiAgICAgIFJlZmxlY3QuZGVmaW5lTWV0YWRhdGEoJ05lc3RlZEF0dHJpYnV0ZScsIG1ldGFkYXRhLCB0YXJnZXQpO1xuXG4gICAgICBjb25zdCBtYXBwaW5nTWV0YWRhdGEgPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdBdHRyaWJ1dGVNYXBwaW5nJywgdGFyZ2V0KSB8fCB7fTtcbiAgICAgIGNvbnN0IHNlcmlhbGl6ZWRQcm9wZXJ0eU5hbWUgPSBvcHRpb25zLnNlcmlhbGl6ZWROYW1lICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLnNlcmlhbGl6ZWROYW1lIDogcHJvcGVydHlOYW1lO1xuICAgICAgbWFwcGluZ01ldGFkYXRhW3NlcmlhbGl6ZWRQcm9wZXJ0eU5hbWVdID0gcHJvcGVydHlOYW1lO1xuICAgICAgUmVmbGVjdC5kZWZpbmVNZXRhZGF0YSgnQXR0cmlidXRlTWFwcGluZycsIG1hcHBpbmdNZXRhZGF0YSwgdGFyZ2V0KTtcbiAgICB9O1xuXG4gICAgY29uc3QgdXBkYXRlTWV0YWRhdGEgPSAoaW5zdGFuY2U6IGFueSkgPT4ge1xuICAgICAgY29uc3QgbmV3VmFsdWUgPSBpbnN0YW5jZVtgXyR7cHJvcGVydHlOYW1lfWBdO1xuXG4gICAgICBpZiAoIWluc3RhbmNlW0F0dHJpYnV0ZU1ldGFkYXRhXSkge1xuICAgICAgICBpbnN0YW5jZVtBdHRyaWJ1dGVNZXRhZGF0YV0gPSB7fTtcbiAgICAgIH1cbiAgICAgIGlmIChpbnN0YW5jZVtBdHRyaWJ1dGVNZXRhZGF0YV1bcHJvcGVydHlOYW1lXSAmJiAhaW5zdGFuY2UuaXNNb2RlbEluaXRpYWxpemF0aW9uKCkpIHtcbiAgICAgICAgaW5zdGFuY2VbQXR0cmlidXRlTWV0YWRhdGFdW3Byb3BlcnR5TmFtZV0ubmV3VmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgICAgaW5zdGFuY2VbQXR0cmlidXRlTWV0YWRhdGFdW3Byb3BlcnR5TmFtZV0uaGFzRGlydHlBdHRyaWJ1dGVzID0gIV8uaXNFcXVhbChcbiAgICAgICAgICBpbnN0YW5jZVtBdHRyaWJ1dGVNZXRhZGF0YV1bcHJvcGVydHlOYW1lXS5vbGRWYWx1ZSxcbiAgICAgICAgICBuZXdWYWx1ZVxuICAgICAgICApO1xuICAgICAgICBpbnN0YW5jZVtBdHRyaWJ1dGVNZXRhZGF0YV1bcHJvcGVydHlOYW1lXS5zZXJpYWxpc2F0aW9uVmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IG9sZFZhbHVlID0gXy5jbG9uZURlZXAobmV3VmFsdWUpO1xuICAgICAgICBpbnN0YW5jZVtBdHRyaWJ1dGVNZXRhZGF0YV1bcHJvcGVydHlOYW1lXSA9IHtcbiAgICAgICAgICBuZXdWYWx1ZSxcbiAgICAgICAgICBvbGRWYWx1ZSxcbiAgICAgICAgICBjb252ZXJ0ZXIsXG4gICAgICAgICAgbmVzdGVkOiB0cnVlLFxuICAgICAgICAgIGhhc0RpcnR5QXR0cmlidXRlczogIV8uaXNFcXVhbChuZXdWYWx1ZSwgb2xkVmFsdWUpXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IGdldHRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXNbYF8ke3Byb3BlcnR5TmFtZX1gXTtcbiAgICB9O1xuXG4gICAgY29uc3Qgc2V0dGVyID0gZnVuY3Rpb24obmV3VmFsOiBhbnkpIHtcbiAgICAgIGNvbnN0IHRhcmdldFR5cGUgPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdkZXNpZ246dHlwZScsIHRhcmdldCwgcHJvcGVydHlOYW1lKTtcbiAgICAgIHRoaXNbYF8ke3Byb3BlcnR5TmFtZX1gXSA9IGNvbnZlcnRlcih0YXJnZXRUeXBlLCBuZXdWYWwpO1xuICAgICAgdXBkYXRlTWV0YWRhdGEodGhpcyk7XG4gICAgfTtcblxuICAgIGlmIChkZWxldGUgdGFyZ2V0W3Byb3BlcnR5TmFtZV0pIHtcbiAgICAgIHNhdmVBbm5vdGF0aW9ucygpO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgcHJvcGVydHlOYW1lLCB7XG4gICAgICAgIGdldDogZ2V0dGVyLFxuICAgICAgICBzZXQ6IHNldHRlcixcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9KTtcblxuICAgIH1cbiAgfTtcbn1cbiJdfQ==