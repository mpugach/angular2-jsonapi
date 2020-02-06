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
        return value ? value.toISOString() : value;
    };
    return DateConverter;
}());
export { DateConverter };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS5jb252ZXJ0ZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyMi1qc29uYXBpLyIsInNvdXJjZXMiOlsiY29udmVydGVycy9kYXRlL2RhdGUuY29udmVydGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBR3BDO0lBQUE7SUFZQSxDQUFDOzs7OztJQVhDLDRCQUFJOzs7O0lBQUosVUFBSyxLQUFVO1FBQ2IsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7WUFDN0IsT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDeEI7YUFBTTtZQUNMLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7SUFDSCxDQUFDOzs7OztJQUVELDhCQUFNOzs7O0lBQU4sVUFBTyxLQUFVO1FBQ2YsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQzdDLENBQUM7SUFDSCxvQkFBQztBQUFELENBQUMsQUFaRCxJQVlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcGFyc2VJU08gfSBmcm9tICdkYXRlLWZucyc7XG5pbXBvcnQgeyBQcm9wZXJ0eUNvbnZlcnRlciB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvcHJvcGVydHktY29udmVydGVyLmludGVyZmFjZSc7XG5cbmV4cG9ydCBjbGFzcyBEYXRlQ29udmVydGVyIGltcGxlbWVudHMgUHJvcGVydHlDb252ZXJ0ZXIge1xuICBtYXNrKHZhbHVlOiBhbnkpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHBhcnNlSVNPKHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIHVubWFzayh2YWx1ZTogYW55KSB7XG4gICAgcmV0dXJuIHZhbHVlID8gdmFsdWUudG9JU09TdHJpbmcoKSA6IHZhbHVlO1xuICB9XG59XG4iXX0=