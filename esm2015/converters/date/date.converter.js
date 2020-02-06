/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { parseISO } from 'date-fns';
export class DateConverter {
    /**
     * @param {?} value
     * @return {?}
     */
    mask(value) {
        if (typeof value === 'string') {
            return parseISO(value);
        }
        else {
            return value;
        }
    }
    /**
     * @param {?} value
     * @return {?}
     */
    unmask(value) {
        return value ? value.toISOString() : value;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS5jb252ZXJ0ZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyMi1qc29uYXBpLyIsInNvdXJjZXMiOlsiY29udmVydGVycy9kYXRlL2RhdGUuY29udmVydGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBR3BDLE1BQU0sT0FBTyxhQUFhOzs7OztJQUN4QixJQUFJLENBQUMsS0FBVTtRQUNiLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO1lBQzdCLE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3hCO2FBQU07WUFDTCxPQUFPLEtBQUssQ0FBQztTQUNkO0lBQ0gsQ0FBQzs7Ozs7SUFFRCxNQUFNLENBQUMsS0FBVTtRQUNmLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUM3QyxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBwYXJzZUlTTyB9IGZyb20gJ2RhdGUtZm5zJztcbmltcG9ydCB7IFByb3BlcnR5Q29udmVydGVyIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9wcm9wZXJ0eS1jb252ZXJ0ZXIuaW50ZXJmYWNlJztcblxuZXhwb3J0IGNsYXNzIERhdGVDb252ZXJ0ZXIgaW1wbGVtZW50cyBQcm9wZXJ0eUNvbnZlcnRlciB7XG4gIG1hc2sodmFsdWU6IGFueSkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gcGFyc2VJU08odmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgdW5tYXNrKHZhbHVlOiBhbnkpIHtcbiAgICByZXR1cm4gdmFsdWUgPyB2YWx1ZS50b0lTT1N0cmluZygpIDogdmFsdWU7XG4gIH1cbn1cbiJdfQ==