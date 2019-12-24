/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { JsonApiNestedModel } from '../../models/json-nested.model';
/** @type {?} */
export const DEFAULT_OPTIONS = {
    nullValue: false,
    hasMany: false
};
/**
 * @template T
 */
export class JsonModelConverter {
    /**
     * @param {?} model
     * @param {?=} options
     */
    constructor(model, options = {}) {
        this.modelType = model; // <ModelType<T>>model
        this.options = Object.assign({}, DEFAULT_OPTIONS, options);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    mask(value) {
        if (!value && !this.options.nullValue) {
            if (this.options.hasMany) {
                return [];
            }
            return new this.modelType();
        }
        /** @type {?} */
        let result = null;
        if (this.options.hasMany) {
            if (!Array.isArray(value)) {
                throw new Error(`ERROR: JsonModelConverter: Expected array but got ${typeof value}.`);
            }
            result = [];
            for (const item of value) {
                if (item === null) {
                    continue;
                }
                /** @type {?} */
                let temp;
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
    }
    /**
     * @param {?} value
     * @return {?}
     */
    unmask(value) {
        if (!value) {
            return value;
        }
        /** @type {?} */
        let result = null;
        if (Array.isArray(value)) {
            result = [];
            for (const item of value) {
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
    }
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi1tb2RlbC5jb252ZXJ0ZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyMi1qc29uYXBpLyIsInNvdXJjZXMiOlsiY29udmVydGVycy9qc29uLW1vZGVsL2pzb24tbW9kZWwuY29udmVydGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFFQSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQzs7QUFFcEUsTUFBTSxPQUFPLGVBQWUsR0FBNkI7SUFDdkQsU0FBUyxFQUFFLEtBQUs7SUFDaEIsT0FBTyxFQUFFLEtBQUs7Q0FDZjs7OztBQUVELE1BQU0sT0FBTyxrQkFBa0I7Ozs7O0lBSTdCLFlBQVksS0FBUSxFQUFFLFVBQW9DLEVBQUU7UUFDMUQsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsQ0FBQyxzQkFBc0I7UUFDOUMsSUFBSSxDQUFDLE9BQU8scUJBQU8sZUFBZSxFQUFLLE9BQU8sQ0FBQyxDQUFDO0lBQ2xELENBQUM7Ozs7O0lBRUQsSUFBSSxDQUFDLEtBQVU7UUFDYixJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUU7WUFDckMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRTtnQkFDeEIsT0FBTyxFQUFFLENBQUM7YUFDWDtZQUNELE9BQU8sSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7U0FDN0I7O1lBRUcsTUFBTSxHQUFHLElBQUk7UUFDakIsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRTtZQUN4QixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDekIsTUFBTSxJQUFJLEtBQUssQ0FBQyxxREFBcUQsT0FBTyxLQUFLLEdBQUcsQ0FBQyxDQUFDO2FBQ3ZGO1lBQ0QsTUFBTSxHQUFHLEVBQUUsQ0FBQztZQUNaLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxFQUFFO2dCQUN4QixJQUFJLElBQUksS0FBSyxJQUFJLEVBQUU7b0JBQ2pCLFNBQVM7aUJBQ1Y7O29CQUNHLElBQUk7Z0JBQ1IsSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUU7b0JBQzVCLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztvQkFDNUIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDakI7cUJBQU07b0JBQ0wsSUFBSSxHQUFHLElBQUksQ0FBQztpQkFDYjtnQkFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ25CO1NBQ0Y7YUFBTTtZQUNMLElBQUksQ0FBQyxDQUFDLEtBQUssWUFBWSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUU7Z0JBQ3RDLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDOUIsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNwQjtpQkFBTTtnQkFDTCxNQUFNLEdBQUcsS0FBSyxDQUFDO2FBQ2hCO1NBQ0Y7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDOzs7OztJQUVELE1BQU0sQ0FBQyxLQUFVO1FBQ2YsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNWLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7O1lBQ0csTUFBTSxHQUFHLElBQUk7UUFDakIsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3hCLE1BQU0sR0FBRyxFQUFFLENBQUM7WUFDWixLQUFLLE1BQU0sSUFBSSxJQUFJLEtBQUssRUFBRTtnQkFDeEIsSUFBSSxDQUFDLElBQUksRUFBRTtvQkFDVCxTQUFTO2lCQUNWO2dCQUNELElBQUksSUFBSSxZQUFZLGtCQUFrQixFQUFFO29CQUN0QyxJQUFJLENBQUMsdUJBQXVCLEdBQUcsSUFBSSxDQUFDO29CQUNwQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO29CQUM5QixJQUFJLENBQUMsdUJBQXVCLEdBQUcsS0FBSyxDQUFDO2lCQUN0QztxQkFBTTtvQkFDTCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUNuQjthQUNGO1NBQ0Y7YUFBTTtZQUNMLElBQUksS0FBSyxZQUFZLGtCQUFrQixFQUFFO2dCQUN2QyxLQUFLLENBQUMsdUJBQXVCLEdBQUcsSUFBSSxDQUFDO2dCQUNyQyxNQUFNLEdBQUcsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUMzQixLQUFLLENBQUMsdUJBQXVCLEdBQUcsS0FBSyxDQUFDO2FBQ3ZDO2lCQUFNO2dCQUNMLE1BQU0sR0FBRyxLQUFLLENBQUM7YUFDaEI7U0FDRjtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7Q0FDRjs7Ozs7O0lBN0VDLHVDQUF1Qjs7Ozs7SUFDdkIscUNBQTBDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSnNvbk1vZGVsQ29udmVydGVyQ29uZmlnIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9qc29uLW1vZGVsLWNvbnZlcnRlci1jb25maWcuaW50ZXJmYWNlJztcbmltcG9ydCB7IFByb3BlcnR5Q29udmVydGVyIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9wcm9wZXJ0eS1jb252ZXJ0ZXIuaW50ZXJmYWNlJztcbmltcG9ydCB7IEpzb25BcGlOZXN0ZWRNb2RlbCB9IGZyb20gJy4uLy4uL21vZGVscy9qc29uLW5lc3RlZC5tb2RlbCc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX09QVElPTlM6IEpzb25Nb2RlbENvbnZlcnRlckNvbmZpZyA9IHtcbiAgbnVsbFZhbHVlOiBmYWxzZSxcbiAgaGFzTWFueTogZmFsc2Vcbn07XG5cbmV4cG9ydCBjbGFzcyBKc29uTW9kZWxDb252ZXJ0ZXI8VD4gaW1wbGVtZW50cyBQcm9wZXJ0eUNvbnZlcnRlciB7XG4gIHByaXZhdGUgbW9kZWxUeXBlOiBhbnk7IC8vIE1vZGVsVHlwZTxUPlxuICBwcml2YXRlIG9wdGlvbnM6IEpzb25Nb2RlbENvbnZlcnRlckNvbmZpZztcblxuICBjb25zdHJ1Y3Rvcihtb2RlbDogVCwgb3B0aW9uczogSnNvbk1vZGVsQ29udmVydGVyQ29uZmlnID0ge30pIHtcbiAgICB0aGlzLm1vZGVsVHlwZSA9IG1vZGVsOyAvLyA8TW9kZWxUeXBlPFQ+Pm1vZGVsXG4gICAgdGhpcy5vcHRpb25zID0gey4uLkRFRkFVTFRfT1BUSU9OUywgLi4ub3B0aW9uc307XG4gIH1cblxuICBtYXNrKHZhbHVlOiBhbnkpOiBUIHwgQXJyYXk8VD4ge1xuICAgIGlmICghdmFsdWUgJiYgIXRoaXMub3B0aW9ucy5udWxsVmFsdWUpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuaGFzTWFueSkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3IHRoaXMubW9kZWxUeXBlKCk7XG4gICAgfVxuXG4gICAgbGV0IHJlc3VsdCA9IG51bGw7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5oYXNNYW55KSB7XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgRVJST1I6IEpzb25Nb2RlbENvbnZlcnRlcjogRXhwZWN0ZWQgYXJyYXkgYnV0IGdvdCAke3R5cGVvZiB2YWx1ZX0uYCk7XG4gICAgICB9XG4gICAgICByZXN1bHQgPSBbXTtcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB2YWx1ZSkge1xuICAgICAgICBpZiAoaXRlbSA9PT0gbnVsbCkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGxldCB0ZW1wO1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgdGVtcCA9IG5ldyB0aGlzLm1vZGVsVHlwZSgpO1xuICAgICAgICAgIHRlbXAuZmlsbChpdGVtKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0ZW1wID0gaXRlbTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3VsdC5wdXNoKHRlbXApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoISh2YWx1ZSBpbnN0YW5jZW9mIHRoaXMubW9kZWxUeXBlKSkge1xuICAgICAgICByZXN1bHQgPSBuZXcgdGhpcy5tb2RlbFR5cGUoKTtcbiAgICAgICAgcmVzdWx0LmZpbGwodmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICB1bm1hc2sodmFsdWU6IGFueSk6IGFueSB7XG4gICAgaWYgKCF2YWx1ZSkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICBsZXQgcmVzdWx0ID0gbnVsbDtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIHJlc3VsdCA9IFtdO1xuICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHZhbHVlKSB7XG4gICAgICAgIGlmICghaXRlbSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgSnNvbkFwaU5lc3RlZE1vZGVsKSB7XG4gICAgICAgICAgaXRlbS5uZXN0ZWREYXRhU2VyaWFsaXphdGlvbiA9IHRydWU7XG4gICAgICAgICAgcmVzdWx0LnB1c2goaXRlbS5zZXJpYWxpemUoKSk7XG4gICAgICAgICAgaXRlbS5uZXN0ZWREYXRhU2VyaWFsaXphdGlvbiA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEpzb25BcGlOZXN0ZWRNb2RlbCkge1xuICAgICAgICB2YWx1ZS5uZXN0ZWREYXRhU2VyaWFsaXphdGlvbiA9IHRydWU7XG4gICAgICAgIHJlc3VsdCA9IHZhbHVlLnNlcmlhbGl6ZSgpO1xuICAgICAgICB2YWx1ZS5uZXN0ZWREYXRhU2VyaWFsaXphdGlvbiA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cbiJdfQ==