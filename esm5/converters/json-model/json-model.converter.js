/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { JsonApiNestedModel } from '../../models/json-nested.model';
/** @type {?} */
export var DEFAULT_OPTIONS = {
    nullValue: false,
    hasMany: false
};
/**
 * @template T
 */
var /**
 * @template T
 */
JsonModelConverter = /** @class */ (function () {
    function JsonModelConverter(model, options) {
        if (options === void 0) { options = {}; }
        this.modelType = model; // <ModelType<T>>model
        this.options = tslib_1.__assign({}, DEFAULT_OPTIONS, options);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    JsonModelConverter.prototype.mask = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        var e_1, _a;
        if (!value && !this.options.nullValue) {
            if (this.options.hasMany) {
                return [];
            }
            return new this.modelType();
        }
        /** @type {?} */
        var result = null;
        if (this.options.hasMany) {
            if (!Array.isArray(value)) {
                throw new Error("ERROR: JsonModelConverter: Expected array but got " + typeof value + ".");
            }
            result = [];
            try {
                for (var value_1 = tslib_1.__values(value), value_1_1 = value_1.next(); !value_1_1.done; value_1_1 = value_1.next()) {
                    var item = value_1_1.value;
                    if (item === null) {
                        continue;
                    }
                    /** @type {?} */
                    var temp = void 0;
                    if (typeof item === 'object') {
                        temp = new this.modelType();
                        temp.fill(item);
                    }
                    else {
                        temp = item;
                    }
                    result.push(temp);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (value_1_1 && !value_1_1.done && (_a = value_1.return)) _a.call(value_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        else {
            if (!(value instanceof this.modelType)) {
                result = new this.modelType();
                result.fill(value);
            }
            else {
                result = value;
            }
        }
        return result;
    };
    /**
     * @param {?} value
     * @return {?}
     */
    JsonModelConverter.prototype.unmask = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        var e_2, _a;
        if (!value) {
            return value;
        }
        /** @type {?} */
        var result = null;
        if (Array.isArray(value)) {
            result = [];
            try {
                for (var value_2 = tslib_1.__values(value), value_2_1 = value_2.next(); !value_2_1.done; value_2_1 = value_2.next()) {
                    var item = value_2_1.value;
                    if (!item) {
                        continue;
                    }
                    if (item instanceof JsonApiNestedModel) {
                        item.nestedDataSerialization = true;
                        result.push(item.serialize());
                        item.nestedDataSerialization = false;
                    }
                    else {
                        result.push(item);
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (value_2_1 && !value_2_1.done && (_a = value_2.return)) _a.call(value_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        else {
            if (value instanceof JsonApiNestedModel) {
                value.nestedDataSerialization = true;
                result = value.serialize();
                value.nestedDataSerialization = false;
            }
            else {
                result = value;
            }
        }
        return result;
    };
    return JsonModelConverter;
}());
/**
 * @template T
 */
export { JsonModelConverter };
if (false) {
    /**
     * @type {?}
     * @private
     */
    JsonModelConverter.prototype.modelType;
    /**
     * @type {?}
     * @private
     */
    JsonModelConverter.prototype.options;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi1tb2RlbC5jb252ZXJ0ZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyMi1qc29uYXBpLyIsInNvdXJjZXMiOlsiY29udmVydGVycy9qc29uLW1vZGVsL2pzb24tbW9kZWwuY29udmVydGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBRUEsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7O0FBRXBFLE1BQU0sS0FBTyxlQUFlLEdBQTZCO0lBQ3ZELFNBQVMsRUFBRSxLQUFLO0lBQ2hCLE9BQU8sRUFBRSxLQUFLO0NBQ2Y7Ozs7QUFFRDs7OztJQUlFLDRCQUFZLEtBQVEsRUFBRSxPQUFzQztRQUF0Qyx3QkFBQSxFQUFBLFlBQXNDO1FBQzFELElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLENBQUMsc0JBQXNCO1FBQzlDLElBQUksQ0FBQyxPQUFPLHdCQUFPLGVBQWUsRUFBSyxPQUFPLENBQUMsQ0FBQztJQUNsRCxDQUFDOzs7OztJQUVELGlDQUFJOzs7O0lBQUosVUFBSyxLQUFVOztRQUNiLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRTtZQUNyQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFO2dCQUN4QixPQUFPLEVBQUUsQ0FBQzthQUNYO1lBQ0QsT0FBTyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztTQUM3Qjs7WUFFRyxNQUFNLEdBQUcsSUFBSTtRQUNqQixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFO1lBQ3hCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUN6QixNQUFNLElBQUksS0FBSyxDQUFDLHVEQUFxRCxPQUFPLEtBQUssTUFBRyxDQUFDLENBQUM7YUFDdkY7WUFDRCxNQUFNLEdBQUcsRUFBRSxDQUFDOztnQkFDWixLQUFtQixJQUFBLFVBQUEsaUJBQUEsS0FBSyxDQUFBLDRCQUFBLCtDQUFFO29CQUFyQixJQUFNLElBQUksa0JBQUE7b0JBQ2IsSUFBSSxJQUFJLEtBQUssSUFBSSxFQUFFO3dCQUNqQixTQUFTO3FCQUNWOzt3QkFDRyxJQUFJLFNBQUE7b0JBQ1IsSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUU7d0JBQzVCLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFDNUIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDakI7eUJBQU07d0JBQ0wsSUFBSSxHQUFHLElBQUksQ0FBQztxQkFDYjtvQkFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUNuQjs7Ozs7Ozs7O1NBQ0Y7YUFBTTtZQUNMLElBQUksQ0FBQyxDQUFDLEtBQUssWUFBWSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUU7Z0JBQ3RDLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDOUIsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNwQjtpQkFBTTtnQkFDTCxNQUFNLEdBQUcsS0FBSyxDQUFDO2FBQ2hCO1NBQ0Y7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDOzs7OztJQUVELG1DQUFNOzs7O0lBQU4sVUFBTyxLQUFVOztRQUNmLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDVixPQUFPLEtBQUssQ0FBQztTQUNkOztZQUNHLE1BQU0sR0FBRyxJQUFJO1FBQ2pCLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUN4QixNQUFNLEdBQUcsRUFBRSxDQUFDOztnQkFDWixLQUFtQixJQUFBLFVBQUEsaUJBQUEsS0FBSyxDQUFBLDRCQUFBLCtDQUFFO29CQUFyQixJQUFNLElBQUksa0JBQUE7b0JBQ2IsSUFBSSxDQUFDLElBQUksRUFBRTt3QkFDVCxTQUFTO3FCQUNWO29CQUNELElBQUksSUFBSSxZQUFZLGtCQUFrQixFQUFFO3dCQUN0QyxJQUFJLENBQUMsdUJBQXVCLEdBQUcsSUFBSSxDQUFDO3dCQUNwQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO3dCQUM5QixJQUFJLENBQUMsdUJBQXVCLEdBQUcsS0FBSyxDQUFDO3FCQUN0Qzt5QkFBTTt3QkFDTCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUNuQjtpQkFDRjs7Ozs7Ozs7O1NBQ0Y7YUFBTTtZQUNMLElBQUksS0FBSyxZQUFZLGtCQUFrQixFQUFFO2dCQUN2QyxLQUFLLENBQUMsdUJBQXVCLEdBQUcsSUFBSSxDQUFDO2dCQUNyQyxNQUFNLEdBQUcsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUMzQixLQUFLLENBQUMsdUJBQXVCLEdBQUcsS0FBSyxDQUFDO2FBQ3ZDO2lCQUFNO2dCQUNMLE1BQU0sR0FBRyxLQUFLLENBQUM7YUFDaEI7U0FDRjtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFDSCx5QkFBQztBQUFELENBQUMsQUE5RUQsSUE4RUM7Ozs7Ozs7Ozs7SUE3RUMsdUNBQXVCOzs7OztJQUN2QixxQ0FBMEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBKc29uTW9kZWxDb252ZXJ0ZXJDb25maWcgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL2pzb24tbW9kZWwtY29udmVydGVyLWNvbmZpZy5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgUHJvcGVydHlDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL3Byb3BlcnR5LWNvbnZlcnRlci5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgSnNvbkFwaU5lc3RlZE1vZGVsIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2pzb24tbmVzdGVkLm1vZGVsJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1BUSU9OUzogSnNvbk1vZGVsQ29udmVydGVyQ29uZmlnID0ge1xuICBudWxsVmFsdWU6IGZhbHNlLFxuICBoYXNNYW55OiBmYWxzZVxufTtcblxuZXhwb3J0IGNsYXNzIEpzb25Nb2RlbENvbnZlcnRlcjxUPiBpbXBsZW1lbnRzIFByb3BlcnR5Q29udmVydGVyIHtcbiAgcHJpdmF0ZSBtb2RlbFR5cGU6IGFueTsgLy8gTW9kZWxUeXBlPFQ+XG4gIHByaXZhdGUgb3B0aW9uczogSnNvbk1vZGVsQ29udmVydGVyQ29uZmlnO1xuXG4gIGNvbnN0cnVjdG9yKG1vZGVsOiBULCBvcHRpb25zOiBKc29uTW9kZWxDb252ZXJ0ZXJDb25maWcgPSB7fSkge1xuICAgIHRoaXMubW9kZWxUeXBlID0gbW9kZWw7IC8vIDxNb2RlbFR5cGU8VD4+bW9kZWxcbiAgICB0aGlzLm9wdGlvbnMgPSB7Li4uREVGQVVMVF9PUFRJT05TLCAuLi5vcHRpb25zfTtcbiAgfVxuXG4gIG1hc2sodmFsdWU6IGFueSk6IFQgfCBBcnJheTxUPiB7XG4gICAgaWYgKCF2YWx1ZSAmJiAhdGhpcy5vcHRpb25zLm51bGxWYWx1ZSkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5oYXNNYW55KSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXcgdGhpcy5tb2RlbFR5cGUoKTtcbiAgICB9XG5cbiAgICBsZXQgcmVzdWx0ID0gbnVsbDtcbiAgICBpZiAodGhpcy5vcHRpb25zLmhhc01hbnkpIHtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFUlJPUjogSnNvbk1vZGVsQ29udmVydGVyOiBFeHBlY3RlZCBhcnJheSBidXQgZ290ICR7dHlwZW9mIHZhbHVlfS5gKTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdCA9IFtdO1xuICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHZhbHVlKSB7XG4gICAgICAgIGlmIChpdGVtID09PSBudWxsKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHRlbXA7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICB0ZW1wID0gbmV3IHRoaXMubW9kZWxUeXBlKCk7XG4gICAgICAgICAgdGVtcC5maWxsKGl0ZW0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRlbXAgPSBpdGVtO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdWx0LnB1c2godGVtcCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghKHZhbHVlIGluc3RhbmNlb2YgdGhpcy5tb2RlbFR5cGUpKSB7XG4gICAgICAgIHJlc3VsdCA9IG5ldyB0aGlzLm1vZGVsVHlwZSgpO1xuICAgICAgICByZXN1bHQuZmlsbCh2YWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHVubWFzayh2YWx1ZTogYW55KTogYW55IHtcbiAgICBpZiAoIXZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIGxldCByZXN1bHQgPSBudWxsO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgcmVzdWx0ID0gW107XG4gICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdmFsdWUpIHtcbiAgICAgICAgaWYgKCFpdGVtKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBKc29uQXBpTmVzdGVkTW9kZWwpIHtcbiAgICAgICAgICBpdGVtLm5lc3RlZERhdGFTZXJpYWxpemF0aW9uID0gdHJ1ZTtcbiAgICAgICAgICByZXN1bHQucHVzaChpdGVtLnNlcmlhbGl6ZSgpKTtcbiAgICAgICAgICBpdGVtLm5lc3RlZERhdGFTZXJpYWxpemF0aW9uID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2goaXRlbSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgSnNvbkFwaU5lc3RlZE1vZGVsKSB7XG4gICAgICAgIHZhbHVlLm5lc3RlZERhdGFTZXJpYWxpemF0aW9uID0gdHJ1ZTtcbiAgICAgICAgcmVzdWx0ID0gdmFsdWUuc2VyaWFsaXplKCk7XG4gICAgICAgIHZhbHVlLm5lc3RlZERhdGFTZXJpYWxpemF0aW9uID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuIl19