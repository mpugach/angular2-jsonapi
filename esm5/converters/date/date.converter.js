/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { parseISO } from 'date-fns';
var DateConverter = /** @class */ (function () {
    function DateConverter() {
    }
    /**
     * @param {?} value
     * @return {?}
     */
    DateConverter.prototype.mask = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        if (typeof value === 'string') {
            return parseISO(value);
        }
        else {
            return value;
        }
    };
    /**
     * @param {?} value
     * @return {?}
     */
    DateConverter.prototype.unmask = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        return value.toISOString();
    };
    return DateConverter;
}());
export { DateConverter };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS5jb252ZXJ0ZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyMi1qc29uYXBpLyIsInNvdXJjZXMiOlsiY29udmVydGVycy9kYXRlL2RhdGUuY29udmVydGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBR3BDO0lBQUE7SUFZQSxDQUFDOzs7OztJQVhDLDRCQUFJOzs7O0lBQUosVUFBSyxLQUFVO1FBQ2IsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7WUFDN0IsT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDeEI7YUFBTTtZQUNMLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7SUFDSCxDQUFDOzs7OztJQUVELDhCQUFNOzs7O0lBQU4sVUFBTyxLQUFVO1FBQ2YsT0FBTyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUNILG9CQUFDO0FBQUQsQ0FBQyxBQVpELElBWUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBwYXJzZUlTTyB9IGZyb20gJ2RhdGUtZm5zJztcbmltcG9ydCB7IFByb3BlcnR5Q29udmVydGVyIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9wcm9wZXJ0eS1jb252ZXJ0ZXIuaW50ZXJmYWNlJztcblxuZXhwb3J0IGNsYXNzIERhdGVDb252ZXJ0ZXIgaW1wbGVtZW50cyBQcm9wZXJ0eUNvbnZlcnRlciB7XG4gIG1hc2sodmFsdWU6IGFueSkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gcGFyc2VJU08odmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgdW5tYXNrKHZhbHVlOiBhbnkpIHtcbiAgICByZXR1cm4gdmFsdWUudG9JU09TdHJpbmcoKTtcbiAgfVxufVxuIl19