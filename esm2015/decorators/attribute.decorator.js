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
export function Attribute(options = {}) {
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
            const metadata = Reflect.getMetadata('Attribute', target) || {};
            metadata[propertyName] = {
                marked: true
            };
            Reflect.defineMetadata('Attribute', metadata, target);
            /** @type {?} */
            const mappingMetadata = Reflect.getMetadata('AttributeMapping', target) || {};
            /** @type {?} */
            const serializedPropertyName = options.serializedName !== undefined ? options.serializedName : propertyName;
            mappingMetadata[serializedPropertyName] = propertyName;
            Reflect.defineMetadata('AttributeMapping', mappingMetadata, target);
        });
        /** @type {?} */
        const setMetadata = (/**
         * @param {?} instance
         * @param {?} oldValue
         * @param {?} newValue
         * @return {?}
         */
        (instance, oldValue, newValue) => {
            /** @type {?} */
            const targetType = Reflect.getMetadata('design:type', target, propertyName);
            if (!instance[AttributeMetadata]) {
                instance[AttributeMetadata] = {};
            }
            instance[AttributeMetadata][propertyName] = {
                newValue,
                oldValue,
                nested: false,
                serializedName: options.serializedName,
                hasDirtyAttributes: !_.isEqual(oldValue, newValue),
                serialisationValue: converter(targetType, newValue, true)
            };
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
            /** @type {?} */
            const convertedValue = converter(targetType, newVal);
            /** @type {?} */
            let oldValue = null;
            if (this.isModelInitialization() && this.id) {
                oldValue = converter(targetType, newVal);
            }
            else {
                if (this[AttributeMetadata] && this[AttributeMetadata][propertyName]) {
                    oldValue = this[AttributeMetadata][propertyName].oldValue;
                }
            }
            this[`_${propertyName}`] = convertedValue;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXR0cmlidXRlLmRlY29yYXRvci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXIyLWpzb25hcGkvIiwic291cmNlcyI6WyJkZWNvcmF0b3JzL2F0dHJpYnV0ZS5kZWNvcmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRXpELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUNsRSxPQUFPLEtBQUssQ0FBQyxNQUFNLFFBQVEsQ0FBQzs7Ozs7QUFFNUIsTUFBTSxVQUFVLFNBQVMsQ0FBQyxVQUFxQyxFQUFFO0lBQy9EOzs7OztJQUFPLENBQUMsTUFBVyxFQUFFLFlBQW9CLEVBQUUsRUFBRTs7Y0FDckMsU0FBUzs7Ozs7O1FBQUcsQ0FBQyxRQUFhLEVBQUUsS0FBVSxFQUFFLGdCQUFnQixHQUFHLEtBQUssRUFBTyxFQUFFOztnQkFDekUsYUFBYTtZQUVqQixJQUFJLE9BQU8sQ0FBQyxTQUFTLEVBQUU7Z0JBQ3JCLGFBQWEsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDO2FBQ25DO2lCQUFNLElBQUksUUFBUSxLQUFLLElBQUksRUFBRTtnQkFDNUIsYUFBYSxHQUFHLElBQUksYUFBYSxFQUFFLENBQUM7YUFDckM7aUJBQU07O3NCQUNDLFFBQVEsR0FBRyxJQUFJLFFBQVEsRUFBRTtnQkFFL0IsSUFBSSxRQUFRLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUU7b0JBQ3BDLGFBQWEsR0FBRyxRQUFRLENBQUM7aUJBQzFCO2FBQ0Y7WUFFRCxJQUFJLGFBQWEsRUFBRTtnQkFDakIsSUFBSSxDQUFDLGdCQUFnQixFQUFFO29CQUNyQixPQUFPLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQ2xDO2dCQUNELE9BQU8sYUFBYSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNwQztZQUVELE9BQU8sS0FB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Q1gsR0FBRyxFQUFFLE1BQU07Z0JBQ1gsVUFBVSxFQUFFLElBQUk7Z0JBQ2hCLFlBQVksRUFBRSxJQUFJO2FBQ25CLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQyxFQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEF0dHJpYnV0ZU1ldGFkYXRhIH0gZnJvbSAnLi4vY29uc3RhbnRzL3N5bWJvbHMnO1xuaW1wb3J0IHsgQXR0cmlidXRlRGVjb3JhdG9yT3B0aW9ucyB9IGZyb20gJy4uL2ludGVyZmFjZXMvYXR0cmlidXRlLWRlY29yYXRvci1vcHRpb25zLmludGVyZmFjZSc7XG5pbXBvcnQgeyBEYXRlQ29udmVydGVyIH0gZnJvbSAnLi4vY29udmVydGVycy9kYXRlL2RhdGUuY29udmVydGVyJztcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcblxuZXhwb3J0IGZ1bmN0aW9uIEF0dHJpYnV0ZShvcHRpb25zOiBBdHRyaWJ1dGVEZWNvcmF0b3JPcHRpb25zID0ge30pOiBQcm9wZXJ0eURlY29yYXRvciB7XG4gIHJldHVybiAodGFyZ2V0OiBhbnksIHByb3BlcnR5TmFtZTogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgY29udmVydGVyID0gKGRhdGFUeXBlOiBhbnksIHZhbHVlOiBhbnksIGZvclNlcmlhbGlzYXRpb24gPSBmYWxzZSk6IGFueSA9PiB7XG4gICAgICBsZXQgYXR0ckNvbnZlcnRlcjtcblxuICAgICAgaWYgKG9wdGlvbnMuY29udmVydGVyKSB7XG4gICAgICAgIGF0dHJDb252ZXJ0ZXIgPSBvcHRpb25zLmNvbnZlcnRlcjtcbiAgICAgIH0gZWxzZSBpZiAoZGF0YVR5cGUgPT09IERhdGUpIHtcbiAgICAgICAgYXR0ckNvbnZlcnRlciA9IG5ldyBEYXRlQ29udmVydGVyKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBkYXRhdHlwZSA9IG5ldyBkYXRhVHlwZSgpO1xuXG4gICAgICAgIGlmIChkYXRhdHlwZS5tYXNrICYmIGRhdGF0eXBlLnVubWFzaykge1xuICAgICAgICAgIGF0dHJDb252ZXJ0ZXIgPSBkYXRhdHlwZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoYXR0ckNvbnZlcnRlcikge1xuICAgICAgICBpZiAoIWZvclNlcmlhbGlzYXRpb24pIHtcbiAgICAgICAgICByZXR1cm4gYXR0ckNvbnZlcnRlci5tYXNrKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXR0ckNvbnZlcnRlci51bm1hc2sodmFsdWUpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcblxuICAgIGNvbnN0IHNhdmVBbm5vdGF0aW9ucyA9ICgpID0+IHtcbiAgICAgIGNvbnN0IG1ldGFkYXRhID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnQXR0cmlidXRlJywgdGFyZ2V0KSB8fCB7fTtcblxuICAgICAgbWV0YWRhdGFbcHJvcGVydHlOYW1lXSA9IHtcbiAgICAgICAgbWFya2VkOiB0cnVlXG4gICAgICB9O1xuXG4gICAgICBSZWZsZWN0LmRlZmluZU1ldGFkYXRhKCdBdHRyaWJ1dGUnLCBtZXRhZGF0YSwgdGFyZ2V0KTtcblxuICAgICAgY29uc3QgbWFwcGluZ01ldGFkYXRhID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnQXR0cmlidXRlTWFwcGluZycsIHRhcmdldCkgfHwge307XG4gICAgICBjb25zdCBzZXJpYWxpemVkUHJvcGVydHlOYW1lID0gb3B0aW9ucy5zZXJpYWxpemVkTmFtZSAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5zZXJpYWxpemVkTmFtZSA6IHByb3BlcnR5TmFtZTtcbiAgICAgIG1hcHBpbmdNZXRhZGF0YVtzZXJpYWxpemVkUHJvcGVydHlOYW1lXSA9IHByb3BlcnR5TmFtZTtcbiAgICAgIFJlZmxlY3QuZGVmaW5lTWV0YWRhdGEoJ0F0dHJpYnV0ZU1hcHBpbmcnLCBtYXBwaW5nTWV0YWRhdGEsIHRhcmdldCk7XG4gICAgfTtcblxuICAgIGNvbnN0IHNldE1ldGFkYXRhID0gKFxuICAgICAgaW5zdGFuY2U6IGFueSxcbiAgICAgIG9sZFZhbHVlOiBhbnksXG4gICAgICBuZXdWYWx1ZTogYW55XG4gICAgKSA9PiB7XG4gICAgICBjb25zdCB0YXJnZXRUeXBlID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnZGVzaWduOnR5cGUnLCB0YXJnZXQsIHByb3BlcnR5TmFtZSk7XG5cbiAgICAgIGlmICghaW5zdGFuY2VbQXR0cmlidXRlTWV0YWRhdGFdKSB7XG4gICAgICAgIGluc3RhbmNlW0F0dHJpYnV0ZU1ldGFkYXRhXSA9IHt9O1xuICAgICAgfVxuICAgICAgaW5zdGFuY2VbQXR0cmlidXRlTWV0YWRhdGFdW3Byb3BlcnR5TmFtZV0gPSB7XG4gICAgICAgIG5ld1ZhbHVlLFxuICAgICAgICBvbGRWYWx1ZSxcbiAgICAgICAgbmVzdGVkOiBmYWxzZSxcbiAgICAgICAgc2VyaWFsaXplZE5hbWU6IG9wdGlvbnMuc2VyaWFsaXplZE5hbWUsXG4gICAgICAgIGhhc0RpcnR5QXR0cmlidXRlczogIV8uaXNFcXVhbChvbGRWYWx1ZSwgbmV3VmFsdWUpLFxuICAgICAgICBzZXJpYWxpc2F0aW9uVmFsdWU6IGNvbnZlcnRlcih0YXJnZXRUeXBlLCBuZXdWYWx1ZSwgdHJ1ZSlcbiAgICAgIH07XG4gICAgfTtcblxuICAgIGNvbnN0IGdldHRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXNbYF8ke3Byb3BlcnR5TmFtZX1gXTtcbiAgICB9O1xuXG4gICAgY29uc3Qgc2V0dGVyID0gZnVuY3Rpb24obmV3VmFsOiBhbnkpIHtcbiAgICAgIGNvbnN0IHRhcmdldFR5cGUgPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdkZXNpZ246dHlwZScsIHRhcmdldCwgcHJvcGVydHlOYW1lKTtcbiAgICAgIGNvbnN0IGNvbnZlcnRlZFZhbHVlID0gY29udmVydGVyKHRhcmdldFR5cGUsIG5ld1ZhbCk7XG4gICAgICBsZXQgb2xkVmFsdWUgPSBudWxsO1xuICAgICAgaWYgKHRoaXMuaXNNb2RlbEluaXRpYWxpemF0aW9uKCkgJiYgdGhpcy5pZCkge1xuICAgICAgICBvbGRWYWx1ZSA9IGNvbnZlcnRlcih0YXJnZXRUeXBlLCBuZXdWYWwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXNbQXR0cmlidXRlTWV0YWRhdGFdICYmIHRoaXNbQXR0cmlidXRlTWV0YWRhdGFdW3Byb3BlcnR5TmFtZV0pIHtcbiAgICAgICAgICBvbGRWYWx1ZSA9IHRoaXNbQXR0cmlidXRlTWV0YWRhdGFdW3Byb3BlcnR5TmFtZV0ub2xkVmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpc1tgXyR7cHJvcGVydHlOYW1lfWBdID0gY29udmVydGVkVmFsdWU7XG4gICAgICBzZXRNZXRhZGF0YSh0aGlzLCBvbGRWYWx1ZSwgY29udmVydGVkVmFsdWUpO1xuICAgIH07XG5cbiAgICBpZiAoZGVsZXRlIHRhcmdldFtwcm9wZXJ0eU5hbWVdKSB7XG4gICAgICBzYXZlQW5ub3RhdGlvbnMoKTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5TmFtZSwge1xuICAgICAgICBnZXQ6IGdldHRlcixcbiAgICAgICAgc2V0OiBzZXR0ZXIsXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xufVxuIl19