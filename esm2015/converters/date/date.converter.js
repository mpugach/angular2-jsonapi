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
        return value.toISOString();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS5jb252ZXJ0ZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyMi1qc29uYXBpLyIsInNvdXJjZXMiOlsiY29udmVydGVycy9kYXRlL2RhdGUuY29udmVydGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBR3BDLE1BQU0sT0FBTyxhQUFhOzs7OztJQUN4QixJQUFJLENBQUMsS0FBVTtRQUNiLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO1lBQzdCLE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3hCO2FBQU07WUFDTCxPQUFPLEtBQUssQ0FBQztTQUNkO0lBQ0gsQ0FBQzs7Ozs7SUFFRCxNQUFNLENBQUMsS0FBVTtRQUNmLE9BQU8sS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQzdCLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHBhcnNlSVNPIH0gZnJvbSAnZGF0ZS1mbnMnO1xuaW1wb3J0IHsgUHJvcGVydHlDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL3Byb3BlcnR5LWNvbnZlcnRlci5pbnRlcmZhY2UnO1xuXG5leHBvcnQgY2xhc3MgRGF0ZUNvbnZlcnRlciBpbXBsZW1lbnRzIFByb3BlcnR5Q29udmVydGVyIHtcbiAgbWFzayh2YWx1ZTogYW55KSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBwYXJzZUlTTyh2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICB1bm1hc2sodmFsdWU6IGFueSkge1xuICAgIHJldHVybiB2YWx1ZS50b0lTT1N0cmluZygpO1xuICB9XG59XG4iXX0=