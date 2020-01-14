/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import find from 'lodash-es/find';
import includes from 'lodash-es/includes';
import * as _ from 'lodash';
import { AttributeMetadata } from '../constants/symbols';
// tslint:disable-next-line:variable-name
/**
 * HACK/FIXME:
 * Type 'symbol' cannot be used as an index type.
 * TypeScript 2.9.x
 * See https://github.com/Microsoft/TypeScript/issues/24587.
 * @type {?}
 */
var AttributeMetadataIndex = (/** @type {?} */ (AttributeMetadata));
/** @type {?} */
var parseRelationshipLinks = (/**
 * @param {?} relationships
 * @return {?}
 */
function (relationships) {
    /** @type {?} */
    var result = {};
    /** @type {?} */
    var linksMapper = (/**
     * @param {?} __0
     * @param {?} key
     * @return {?}
     */
    function (_a, key) {
        var links = _a.links;
        if (links) {
            result[key] = { links: links };
        }
    });
    _.forEach(relationships || {}, linksMapper);
    return result;
});
var ɵ0 = parseRelationshipLinks;
var JsonApiModel = /** @class */ (function () {
    function JsonApiModel(internalDatastore, data) {
        this.internalDatastore = internalDatastore;
        this.modelInitialization = false;
        this.relationshipLinks = {};
        if (data) {
            this.modelInitialization = true;
            this.id = data.id;
            this.relationshipLinks = parseRelationshipLinks(data.relationships);
            Object.assign(this, data.attributes);
            this.modelInitialization = false;
        }
    }
    /**
     * @return {?}
     */
    JsonApiModel.prototype.isModelInitialization = /**
     * @return {?}
     */
    function () {
        return this.modelInitialization;
    };
    /**
     * @param {?} data
     * @param {?} included
     * @param {?=} remainingModels
     * @return {?}
     */
    JsonApiModel.prototype.syncRelationships = /**
     * @param {?} data
     * @param {?} included
     * @param {?=} remainingModels
     * @return {?}
     */
    function (data, included, remainingModels) {
        if (this.lastSyncModels === included) {
            return;
        }
        if (data) {
            /** @type {?} */
            var modelsForProcessing = remainingModels;
            if (modelsForProcessing === undefined) {
                modelsForProcessing = [].concat(included);
            }
            this.parseHasMany(data, included, modelsForProcessing);
            this.parseBelongsTo(data, included, modelsForProcessing);
        }
        this.lastSyncModels = included;
    };
    /**
     * @param {?=} params
     * @param {?=} headers
     * @param {?=} customUrl
     * @return {?}
     */
    JsonApiModel.prototype.save = /**
     * @param {?=} params
     * @param {?=} headers
     * @param {?=} customUrl
     * @return {?}
     */
    function (params, headers, customUrl) {
        this.checkChanges();
        /** @type {?} */
        var attributesMetadata = this[AttributeMetadataIndex];
        return this.internalDatastore.saveRecord(attributesMetadata, this, params, headers, customUrl);
    };
    Object.defineProperty(JsonApiModel.prototype, "hasDirtyAttributes", {
        get: /**
         * @return {?}
         */
        function () {
            this.checkChanges();
            /** @type {?} */
            var attributesMetadata = this[AttributeMetadataIndex];
            /** @type {?} */
            var hasDirtyAttributes = false;
            for (var propertyName in attributesMetadata) {
                if (attributesMetadata.hasOwnProperty(propertyName)) {
                    /** @type {?} */
                    var metadata = attributesMetadata[propertyName];
                    if (metadata.hasDirtyAttributes) {
                        hasDirtyAttributes = true;
                        break;
                    }
                }
            }
            return hasDirtyAttributes;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     * @return {?}
     */
    JsonApiModel.prototype.checkChanges = /**
     * @private
     * @return {?}
     */
    function () {
        /** @type {?} */
        var attributesMetadata = this[AttributeMetadata];
        for (var propertyName in attributesMetadata) {
            if (attributesMetadata.hasOwnProperty(propertyName)) {
                /** @type {?} */
                var metadata = attributesMetadata[propertyName];
                if (metadata.nested) {
                    this[AttributeMetadata][propertyName].hasDirtyAttributes = !_.isEqual(attributesMetadata[propertyName].oldValue, attributesMetadata[propertyName].newValue);
                    this[AttributeMetadata][propertyName].serialisationValue = attributesMetadata[propertyName].converter(Reflect.getMetadata('design:type', this, propertyName), _.cloneDeep(attributesMetadata[propertyName].newValue), true);
                }
            }
        }
    };
    /**
     * @return {?}
     */
    JsonApiModel.prototype.rollbackAttributes = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var attributesMetadata = this[AttributeMetadataIndex];
        for (var propertyName in attributesMetadata) {
            if (attributesMetadata.hasOwnProperty(propertyName)) {
                if (attributesMetadata[propertyName].hasDirtyAttributes) {
                    this[propertyName] = _.cloneDeep(attributesMetadata[propertyName].oldValue);
                }
            }
        }
    };
    Object.defineProperty(JsonApiModel.prototype, "modelConfig", {
        get: /**
         * @return {?}
         */
        function () {
            return Reflect.getMetadata('JsonApiModelConfig', this.constructor);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     * @param {?} data
     * @param {?} included
     * @param {?} remainingModels
     * @return {?}
     */
    JsonApiModel.prototype.parseHasMany = /**
     * @private
     * @param {?} data
     * @param {?} included
     * @param {?} remainingModels
     * @return {?}
     */
    function (data, included, remainingModels) {
        var e_1, _a, e_2, _b;
        /** @type {?} */
        var hasMany = Reflect.getMetadata('HasMany', this);
        if (hasMany) {
            try {
                for (var hasMany_1 = tslib_1.__values(hasMany), hasMany_1_1 = hasMany_1.next(); !hasMany_1_1.done; hasMany_1_1 = hasMany_1.next()) {
                    var metadata = hasMany_1_1.value;
                    /** @type {?} */
                    var relationship = data.relationships ? data.relationships[metadata.relationship] : null;
                    if (relationship && relationship.data && Array.isArray(relationship.data)) {
                        /** @type {?} */
                        var allModels = [];
                        /** @type {?} */
                        var modelTypesFetched = [];
                        try {
                            for (var _c = (e_2 = void 0, tslib_1.__values(Object.keys(relationship.data))), _d = _c.next(); !_d.done; _d = _c.next()) {
                                var typeIndex = _d.value;
                                /** @type {?} */
                                var typeName = relationship.data[typeIndex].type;
                                if (!includes(modelTypesFetched, typeName)) {
                                    modelTypesFetched.push(typeName);
                                    // tslint:disable-next-line:max-line-length
                                    /** @type {?} */
                                    var modelType = Reflect.getMetadata('JsonApiDatastoreConfig', this.internalDatastore.constructor).models[typeName];
                                    if (modelType) {
                                        /** @type {?} */
                                        var relationshipModels = this.getHasManyRelationship(modelType, relationship.data, included, typeName, remainingModels);
                                        if (relationshipModels.length > 0) {
                                            allModels = allModels.concat(relationshipModels);
                                        }
                                    }
                                    else {
                                        throw { message: "parseHasMany - Model type for relationship " + typeName + " not found." };
                                    }
                                }
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        this[metadata.propertyName] = allModels;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (hasMany_1_1 && !hasMany_1_1.done && (_a = hasMany_1.return)) _a.call(hasMany_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
    };
    /**
     * @private
     * @param {?} data
     * @param {?} included
     * @param {?} remainingModels
     * @return {?}
     */
    JsonApiModel.prototype.parseBelongsTo = /**
     * @private
     * @param {?} data
     * @param {?} included
     * @param {?} remainingModels
     * @return {?}
     */
    function (data, included, remainingModels) {
        var e_3, _a;
        /** @type {?} */
        var belongsTo = Reflect.getMetadata('BelongsTo', this);
        if (belongsTo) {
            try {
                for (var belongsTo_1 = tslib_1.__values(belongsTo), belongsTo_1_1 = belongsTo_1.next(); !belongsTo_1_1.done; belongsTo_1_1 = belongsTo_1.next()) {
                    var metadata = belongsTo_1_1.value;
                    /** @type {?} */
                    var relationship = data.relationships ? data.relationships[metadata.relationship] : null;
                    if (relationship && relationship.data) {
                        /** @type {?} */
                        var dataRelationship = (relationship.data instanceof Array) ? relationship.data[0] : relationship.data;
                        if (dataRelationship) {
                            /** @type {?} */
                            var typeName = dataRelationship.type;
                            // tslint:disable-next-line:max-line-length
                            /** @type {?} */
                            var modelType = Reflect.getMetadata('JsonApiDatastoreConfig', this.internalDatastore.constructor).models[typeName];
                            if (modelType) {
                                /** @type {?} */
                                var relationshipModel = this.getBelongsToRelationship(modelType, dataRelationship, included, typeName, remainingModels);
                                if (relationshipModel) {
                                    this[metadata.propertyName] = relationshipModel;
                                }
                            }
                            else {
                                throw { message: "parseBelongsTo - Model type for relationship " + typeName + " not found." };
                            }
                        }
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (belongsTo_1_1 && !belongsTo_1_1.done && (_a = belongsTo_1.return)) _a.call(belongsTo_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
    };
    /**
     * @private
     * @template T
     * @param {?} modelType
     * @param {?} data
     * @param {?} included
     * @param {?} typeName
     * @param {?} remainingModels
     * @return {?}
     */
    JsonApiModel.prototype.getHasManyRelationship = /**
     * @private
     * @template T
     * @param {?} modelType
     * @param {?} data
     * @param {?} included
     * @param {?} typeName
     * @param {?} remainingModels
     * @return {?}
     */
    function (modelType, data, included, typeName, remainingModels) {
        var _this = this;
        /** @type {?} */
        var relationshipList = [];
        data.forEach((/**
         * @param {?} item
         * @return {?}
         */
        function (item) {
            /** @type {?} */
            var relationshipData = find(included, (/** @type {?} */ ({ id: item.id, type: typeName })));
            if (relationshipData) {
                /** @type {?} */
                var newObject = _this.createOrPeek(modelType, relationshipData);
                /** @type {?} */
                var indexOfNewlyFoundModel = remainingModels.indexOf(relationshipData);
                /** @type {?} */
                var modelsForProcessing = remainingModels.concat([]);
                if (indexOfNewlyFoundModel !== -1) {
                    modelsForProcessing.splice(indexOfNewlyFoundModel, 1);
                    newObject.syncRelationships(relationshipData, included, modelsForProcessing);
                }
                relationshipList.push(newObject);
            }
        }));
        return relationshipList;
    };
    /**
     * @private
     * @template T
     * @param {?} modelType
     * @param {?} data
     * @param {?} included
     * @param {?} typeName
     * @param {?} remainingModels
     * @return {?}
     */
    JsonApiModel.prototype.getBelongsToRelationship = /**
     * @private
     * @template T
     * @param {?} modelType
     * @param {?} data
     * @param {?} included
     * @param {?} typeName
     * @param {?} remainingModels
     * @return {?}
     */
    function (modelType, data, included, typeName, remainingModels) {
        /** @type {?} */
        var id = data.id;
        /** @type {?} */
        var relationshipData = find(included, (/** @type {?} */ ({ id: id, type: typeName })));
        if (relationshipData) {
            /** @type {?} */
            var newObject = this.createOrPeek(modelType, relationshipData);
            /** @type {?} */
            var indexOfNewlyFoundModel = remainingModels.indexOf(relationshipData);
            /** @type {?} */
            var modelsForProcessing = remainingModels.concat([]);
            if (indexOfNewlyFoundModel !== -1) {
                modelsForProcessing.splice(indexOfNewlyFoundModel, 1);
                newObject.syncRelationships(relationshipData, included, modelsForProcessing);
            }
            return newObject;
        }
        return this.internalDatastore.peekRecord(modelType, id);
    };
    /**
     * @private
     * @template T
     * @param {?} modelType
     * @param {?} data
     * @return {?}
     */
    JsonApiModel.prototype.createOrPeek = /**
     * @private
     * @template T
     * @param {?} modelType
     * @param {?} data
     * @return {?}
     */
    function (modelType, data) {
        /** @type {?} */
        var peek = this.internalDatastore.peekRecord(modelType, data.id);
        if (peek) {
            _.extend(peek, this.internalDatastore.transformSerializedNamesToPropertyNames(modelType, data.attributes));
            return peek;
        }
        /** @type {?} */
        var newObject = this.internalDatastore.deserializeModel(modelType, data);
        this.internalDatastore.addToStore(newObject);
        return newObject;
    };
    return JsonApiModel;
}());
export { JsonApiModel };
if (false) {
    /** @type {?} */
    JsonApiModel.prototype.id;
    /** @type {?} */
    JsonApiModel.prototype.modelInitialization;
    /** @type {?} */
    JsonApiModel.prototype.relationshipLinks;
    /** @type {?} */
    JsonApiModel.prototype.lastSyncModels;
    /**
     * @type {?}
     * @private
     */
    JsonApiModel.prototype.internalDatastore;
    /* Skipping unhandled member: [key: string]: any;*/
}
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi1hcGkubW9kZWwuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyMi1qc29uYXBpLyIsInNvdXJjZXMiOlsibW9kZWxzL2pzb24tYXBpLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxJQUFJLE1BQU0sZ0JBQWdCLENBQUM7QUFDbEMsT0FBTyxRQUFRLE1BQU0sb0JBQW9CLENBQUM7QUFJMUMsT0FBTyxLQUFLLENBQUMsTUFBTSxRQUFRLENBQUM7QUFDNUIsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7Ozs7Ozs7OztJQVVuRCxzQkFBc0IsR0FBVyxtQkFBQSxpQkFBaUIsRUFBTzs7SUFFekQsc0JBQXNCOzs7O0FBQUcsVUFBQSxhQUFhOztRQUNwQyxNQUFNLEdBQUcsRUFBRTs7UUFDWCxXQUFXOzs7OztJQUFHLFVBQUMsRUFBUyxFQUFFLEdBQUc7WUFBWixnQkFBSztRQUMxQixJQUFJLEtBQUssRUFBRTtZQUNULE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssT0FBQSxFQUFFLENBQUM7U0FDekI7SUFDSCxDQUFDLENBQUE7SUFFRCxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsSUFBSSxFQUFFLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFFNUMsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyxDQUFBOztBQUVEO0lBU0Usc0JBQW9CLGlCQUFtQyxFQUFFLElBQVU7UUFBL0Msc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQVBoRCx3QkFBbUIsR0FBRyxLQUFLLENBQUM7UUFDNUIsc0JBQWlCLEdBQUcsRUFBRSxDQUFDO1FBTzVCLElBQUksSUFBSSxFQUFFO1lBQ1IsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQztZQUNoQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDbEIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLHNCQUFzQixDQUFD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QUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQztRQUM3RSxJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRTdDLE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFDSCxtQkFBQztBQUFELENBQUMsQUF2UEQsSUF1UEM7Ozs7SUF0UEMsMEJBQVc7O0lBQ1gsMkNBQW1DOztJQUNuQyx5Q0FBOEI7O0lBSTlCLHNDQUEyQjs7Ozs7SUFFZix5Q0FBMkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZmluZCBmcm9tICdsb2Rhc2gtZXMvZmluZCc7XG5pbXBvcnQgaW5jbHVkZXMgZnJvbSAnbG9kYXNoLWVzL2luY2x1ZGVzJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IEpzb25BcGlEYXRhc3RvcmUsIE1vZGVsVHlwZSB9IGZyb20gJy4uL3NlcnZpY2VzL2pzb24tYXBpLWRhdGFzdG9yZS5zZXJ2aWNlJztcbmltcG9ydCB7IE1vZGVsQ29uZmlnIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9tb2RlbC1jb25maWcuaW50ZXJmYWNlJztcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IEF0dHJpYnV0ZU1ldGFkYXRhIH0gZnJvbSAnLi4vY29uc3RhbnRzL3N5bWJvbHMnO1xuaW1wb3J0IHsgSHR0cEhlYWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5cbi8qKlxuICogSEFDSy9GSVhNRTpcbiAqIFR5cGUgJ3N5bWJvbCcgY2Fubm90IGJlIHVzZWQgYXMgYW4gaW5kZXggdHlwZS5cbiAqIFR5cGVTY3JpcHQgMi45LnhcbiAqIFNlZSBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzI0NTg3LlxuICovXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZVxuY29uc3QgQXR0cmlidXRlTWV0YWRhdGFJbmRleDogc3RyaW5nID0gQXR0cmlidXRlTWV0YWRhdGEgYXMgYW55O1xuXG5jb25zdCBwYXJzZVJlbGF0aW9uc2hpcExpbmtzID0gcmVsYXRpb25zaGlwcyA9PiB7XG4gIGNvbnN0IHJlc3VsdCA9IHt9O1xuICBjb25zdCBsaW5rc01hcHBlciA9ICh7IGxpbmtzIH0sIGtleSkgPT4ge1xuICAgIGlmIChsaW5rcykge1xuICAgICAgcmVzdWx0W2tleV0gPSB7IGxpbmtzIH07XG4gICAgfVxuICB9O1xuXG4gIF8uZm9yRWFjaChyZWxhdGlvbnNoaXBzIHx8IHt9LCBsaW5rc01hcHBlcik7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmV4cG9ydCBjbGFzcyBKc29uQXBpTW9kZWwge1xuICBpZDogc3RyaW5nO1xuICBwdWJsaWMgbW9kZWxJbml0aWFsaXphdGlvbiA9IGZhbHNlO1xuICBwdWJsaWMgcmVsYXRpb25zaGlwTGlua3MgPSB7fTtcblxuICBba2V5OiBzdHJpbmddOiBhbnk7XG5cbiAgbGFzdFN5bmNNb2RlbHM6IEFycmF5PGFueT47XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBpbnRlcm5hbERhdGFzdG9yZTogSnNvbkFwaURhdGFzdG9yZSwgZGF0YT86IGFueSkge1xuICAgIGlmIChkYXRhKSB7XG4gICAgICB0aGlzLm1vZGVsSW5pdGlhbGl6YXRpb24gPSB0cnVlO1xuICAgICAgdGhpcy5pZCA9IGRhdGEuaWQ7XG4gICAgICB0aGlzLnJlbGF0aW9uc2hpcExpbmtzID0gcGFyc2VSZWxhdGlvbnNoaXBMaW5rcyhkYXRhLnJlbGF0aW9uc2hpcHMpO1xuICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBkYXRhLmF0dHJpYnV0ZXMpO1xuICAgICAgdGhpcy5tb2RlbEluaXRpYWxpemF0aW9uID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGlzTW9kZWxJbml0aWFsaXphdGlvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5tb2RlbEluaXRpYWxpemF0aW9uO1xuICB9XG5cbiAgcHVibGljIHN5bmNSZWxhdGlvbnNoaXBzKGRhdGE6IGFueSwgaW5jbHVkZWQ6IGFueSwgcmVtYWluaW5nTW9kZWxzPzogQXJyYXk8YW55Pik6IHZvaWQge1xuICAgIGlmICh0aGlzLmxhc3RTeW5jTW9kZWxzID09PSBpbmNsdWRlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChkYXRhKSB7XG4gICAgICBsZXQgbW9kZWxzRm9yUHJvY2Vzc2luZyA9IHJlbWFpbmluZ01vZGVscztcblxuICAgICAgaWYgKG1vZGVsc0ZvclByb2Nlc3NpbmcgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBtb2RlbHNGb3JQcm9jZXNzaW5nID0gW10uY29uY2F0KGluY2x1ZGVkKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5wYXJzZUhhc01hbnkoZGF0YSwgaW5jbHVkZWQsIG1vZGVsc0ZvclByb2Nlc3NpbmcpO1xuICAgICAgdGhpcy5wYXJzZUJlbG9uZ3NUbyhkYXRhLCBpbmNsdWRlZCwgbW9kZWxzRm9yUHJvY2Vzc2luZyk7XG4gICAgfVxuXG4gICAgdGhpcy5sYXN0U3luY01vZGVscyA9IGluY2x1ZGVkO1xuICB9XG5cbiAgcHVibGljIHNhdmUocGFyYW1zPzogYW55LCBoZWFkZXJzPzogSHR0cEhlYWRlcnMsIGN1c3RvbVVybD86IHN0cmluZyk6IE9ic2VydmFibGU8dGhpcz4ge1xuICAgIHRoaXMuY2hlY2tDaGFuZ2VzKCk7XG4gICAgY29uc3QgYXR0cmlidXRlc01ldGFkYXRhOiBhbnkgPSB0aGlzW0F0dHJpYnV0ZU1ldGFkYXRhSW5kZXhdO1xuICAgIHJldHVybiB0aGlzLmludGVybmFsRGF0YXN0b3JlLnNhdmVSZWNvcmQoYXR0cmlidXRlc01ldGFkYXRhLCB0aGlzLCBwYXJhbXMsIGhlYWRlcnMsIGN1c3RvbVVybCk7XG4gIH1cblxuICBnZXQgaGFzRGlydHlBdHRyaWJ1dGVzKCkge1xuICAgIHRoaXMuY2hlY2tDaGFuZ2VzKCk7XG4gICAgY29uc3QgYXR0cmlidXRlc01ldGFkYXRhOiBhbnkgPSB0aGlzW0F0dHJpYnV0ZU1ldGFkYXRhSW5kZXhdO1xuICAgIGxldCBoYXNEaXJ0eUF0dHJpYnV0ZXMgPSBmYWxzZTtcbiAgICBmb3IgKGNvbnN0IHByb3BlcnR5TmFtZSBpbiBhdHRyaWJ1dGVzTWV0YWRhdGEpIHtcbiAgICAgIGlmIChhdHRyaWJ1dGVzTWV0YWRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSkge1xuICAgICAgICBjb25zdCBtZXRhZGF0YTogYW55ID0gYXR0cmlidXRlc01ldGFkYXRhW3Byb3BlcnR5TmFtZV07XG4gICAgICAgIGlmIChtZXRhZGF0YS5oYXNEaXJ0eUF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICBoYXNEaXJ0eUF0dHJpYnV0ZXMgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBoYXNEaXJ0eUF0dHJpYnV0ZXM7XG4gIH1cblxuICBwcml2YXRlIGNoZWNrQ2hhbmdlcygpIHtcbiAgICBjb25zdCBhdHRyaWJ1dGVzTWV0YWRhdGE6IGFueSA9IHRoaXNbQXR0cmlidXRlTWV0YWRhdGFdO1xuICAgIGZvciAoY29uc3QgcHJvcGVydHlOYW1lIGluIGF0dHJpYnV0ZXNNZXRhZGF0YSkge1xuICAgICAgaWYgKGF0dHJpYnV0ZXNNZXRhZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgIGNvbnN0IG1ldGFkYXRhOiBhbnkgPSBhdHRyaWJ1dGVzTWV0YWRhdGFbcHJvcGVydHlOYW1lXTtcbiAgICAgICAgaWYgKG1ldGFkYXRhLm5lc3RlZCkge1xuICAgICAgICAgIHRoaXNbQXR0cmlidXRlTWV0YWRhdGFdW3Byb3BlcnR5TmFtZV0uaGFzRGlydHlBdHRyaWJ1dGVzID0gIV8uaXNFcXVhbChcbiAgICAgICAgICAgIGF0dHJpYnV0ZXNNZXRhZGF0YVtwcm9wZXJ0eU5hbWVdLm9sZFZhbHVlLFxuICAgICAgICAgICAgYXR0cmlidXRlc01ldGFkYXRhW3Byb3BlcnR5TmFtZV0ubmV3VmFsdWVcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXNbQXR0cmlidXRlTWV0YWRhdGFdW3Byb3BlcnR5TmFtZV0uc2VyaWFsaXNhdGlvblZhbHVlID0gYXR0cmlidXRlc01ldGFkYXRhW3Byb3BlcnR5TmFtZV0uY29udmVydGVyKFxuICAgICAgICAgICAgUmVmbGVjdC5nZXRNZXRhZGF0YSgnZGVzaWduOnR5cGUnLCB0aGlzLCBwcm9wZXJ0eU5hbWUpLFxuICAgICAgICAgICAgXy5jbG9uZURlZXAoYXR0cmlidXRlc01ldGFkYXRhW3Byb3BlcnR5TmFtZV0ubmV3VmFsdWUpLFxuICAgICAgICAgICAgdHJ1ZVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcm9sbGJhY2tBdHRyaWJ1dGVzKCk6IHZvaWQge1xuICAgIGNvbnN0IGF0dHJpYnV0ZXNNZXRhZGF0YTogYW55ID0gdGhpc1tBdHRyaWJ1dGVNZXRhZGF0YUluZGV4XTtcbiAgICBmb3IgKGNvbnN0IHByb3BlcnR5TmFtZSBpbiBhdHRyaWJ1dGVzTWV0YWRhdGEpIHtcbiAgICAgIGlmIChhdHRyaWJ1dGVzTWV0YWRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSkge1xuICAgICAgICBpZiAoYXR0cmlidXRlc01ldGFkYXRhW3Byb3BlcnR5TmFtZV0uaGFzRGlydHlBdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgdGhpc1twcm9wZXJ0eU5hbWVdID0gXy5jbG9uZURlZXAoYXR0cmlidXRlc01ldGFkYXRhW3Byb3BlcnR5TmFtZV0ub2xkVmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0IG1vZGVsQ29uZmlnKCk6IE1vZGVsQ29uZmlnIHtcbiAgICByZXR1cm4gUmVmbGVjdC5nZXRNZXRhZGF0YSgnSnNvbkFwaU1vZGVsQ29uZmlnJywgdGhpcy5jb25zdHJ1Y3Rvcik7XG4gIH1cblxuICBwcml2YXRlIHBhcnNlSGFzTWFueShkYXRhOiBhbnksIGluY2x1ZGVkOiBhbnksIHJlbWFpbmluZ01vZGVsczogQXJyYXk8YW55Pik6IHZvaWQge1xuICAgIGNvbnN0IGhhc01hbnk6IGFueSA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ0hhc01hbnknLCB0aGlzKTtcblxuICAgIGlmIChoYXNNYW55KSB7XG4gICAgICBmb3IgKGNvbnN0IG1ldGFkYXRhIG9mIGhhc01hbnkpIHtcbiAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwOiBhbnkgPSBkYXRhLnJlbGF0aW9uc2hpcHMgPyBkYXRhLnJlbGF0aW9uc2hpcHNbbWV0YWRhdGEucmVsYXRpb25zaGlwXSA6IG51bGw7XG5cbiAgICAgICAgaWYgKHJlbGF0aW9uc2hpcCAmJiByZWxhdGlvbnNoaXAuZGF0YSAmJiBBcnJheS5pc0FycmF5KHJlbGF0aW9uc2hpcC5kYXRhKSkge1xuICAgICAgICAgIGxldCBhbGxNb2RlbHM6IEpzb25BcGlNb2RlbFtdID0gW107XG4gICAgICAgICAgY29uc3QgbW9kZWxUeXBlc0ZldGNoZWQ6IGFueSA9IFtdO1xuXG4gICAgICAgICAgZm9yIChjb25zdCB0eXBlSW5kZXggb2YgT2JqZWN0LmtleXMocmVsYXRpb25zaGlwLmRhdGEpKSB7XG4gICAgICAgICAgICBjb25zdCB0eXBlTmFtZTogc3RyaW5nID0gcmVsYXRpb25zaGlwLmRhdGFbdHlwZUluZGV4XS50eXBlO1xuXG4gICAgICAgICAgICBpZiAoIWluY2x1ZGVzKG1vZGVsVHlwZXNGZXRjaGVkLCB0eXBlTmFtZSkpIHtcbiAgICAgICAgICAgICAgbW9kZWxUeXBlc0ZldGNoZWQucHVzaCh0eXBlTmFtZSk7XG4gICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcbiAgICAgICAgICAgICAgY29uc3QgbW9kZWxUeXBlOiBNb2RlbFR5cGU8dGhpcz4gPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdKc29uQXBpRGF0YXN0b3JlQ29uZmlnJywgdGhpcy5pbnRlcm5hbERhdGFzdG9yZS5jb25zdHJ1Y3RvcikubW9kZWxzW3R5cGVOYW1lXTtcblxuICAgICAgICAgICAgICBpZiAobW9kZWxUeXBlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwTW9kZWxzOiBKc29uQXBpTW9kZWxbXSA9IHRoaXMuZ2V0SGFzTWFueVJlbGF0aW9uc2hpcChcbiAgICAgICAgICAgICAgICAgIG1vZGVsVHlwZSxcbiAgICAgICAgICAgICAgICAgIHJlbGF0aW9uc2hpcC5kYXRhLFxuICAgICAgICAgICAgICAgICAgaW5jbHVkZWQsXG4gICAgICAgICAgICAgICAgICB0eXBlTmFtZSxcbiAgICAgICAgICAgICAgICAgIHJlbWFpbmluZ01vZGVsc1xuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICBpZiAocmVsYXRpb25zaGlwTW9kZWxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgIGFsbE1vZGVscyA9IGFsbE1vZGVscy5jb25jYXQocmVsYXRpb25zaGlwTW9kZWxzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cge21lc3NhZ2U6IGBwYXJzZUhhc01hbnkgLSBNb2RlbCB0eXBlIGZvciByZWxhdGlvbnNoaXAgJHt0eXBlTmFtZX0gbm90IGZvdW5kLmB9O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpc1ttZXRhZGF0YS5wcm9wZXJ0eU5hbWVdID0gYWxsTW9kZWxzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBwYXJzZUJlbG9uZ3NUbyhkYXRhOiBhbnksIGluY2x1ZGVkOiBBcnJheTxhbnk+LCByZW1haW5pbmdNb2RlbHM6IEFycmF5PGFueT4pOiB2b2lkIHtcbiAgICBjb25zdCBiZWxvbmdzVG86IGFueSA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ0JlbG9uZ3NUbycsIHRoaXMpO1xuXG4gICAgaWYgKGJlbG9uZ3NUbykge1xuICAgICAgZm9yIChjb25zdCBtZXRhZGF0YSBvZiBiZWxvbmdzVG8pIHtcbiAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwOiBhbnkgPSBkYXRhLnJlbGF0aW9uc2hpcHMgPyBkYXRhLnJlbGF0aW9uc2hpcHNbbWV0YWRhdGEucmVsYXRpb25zaGlwXSA6IG51bGw7XG4gICAgICAgIGlmIChyZWxhdGlvbnNoaXAgJiYgcmVsYXRpb25zaGlwLmRhdGEpIHtcbiAgICAgICAgICBjb25zdCBkYXRhUmVsYXRpb25zaGlwOiBhbnkgPSAocmVsYXRpb25zaGlwLmRhdGEgaW5zdGFuY2VvZiBBcnJheSkgPyByZWxhdGlvbnNoaXAuZGF0YVswXSA6IHJlbGF0aW9uc2hpcC5kYXRhO1xuICAgICAgICAgIGlmIChkYXRhUmVsYXRpb25zaGlwKSB7XG4gICAgICAgICAgICBjb25zdCB0eXBlTmFtZTogc3RyaW5nID0gZGF0YVJlbGF0aW9uc2hpcC50eXBlO1xuICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxuICAgICAgICAgICAgY29uc3QgbW9kZWxUeXBlOiBNb2RlbFR5cGU8dGhpcz4gPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdKc29uQXBpRGF0YXN0b3JlQ29uZmlnJywgdGhpcy5pbnRlcm5hbERhdGFzdG9yZS5jb25zdHJ1Y3RvcikubW9kZWxzW3R5cGVOYW1lXTtcblxuICAgICAgICAgICAgaWYgKG1vZGVsVHlwZSkge1xuICAgICAgICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBNb2RlbCA9IHRoaXMuZ2V0QmVsb25nc1RvUmVsYXRpb25zaGlwKFxuICAgICAgICAgICAgICAgIG1vZGVsVHlwZSxcbiAgICAgICAgICAgICAgICBkYXRhUmVsYXRpb25zaGlwLFxuICAgICAgICAgICAgICAgIGluY2x1ZGVkLFxuICAgICAgICAgICAgICAgIHR5cGVOYW1lLFxuICAgICAgICAgICAgICAgIHJlbWFpbmluZ01vZGVsc1xuICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgIGlmIChyZWxhdGlvbnNoaXBNb2RlbCkge1xuICAgICAgICAgICAgICAgIHRoaXNbbWV0YWRhdGEucHJvcGVydHlOYW1lXSA9IHJlbGF0aW9uc2hpcE1vZGVsO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aHJvdyB7bWVzc2FnZTogYHBhcnNlQmVsb25nc1RvIC0gTW9kZWwgdHlwZSBmb3IgcmVsYXRpb25zaGlwICR7dHlwZU5hbWV9IG5vdCBmb3VuZC5gfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldEhhc01hbnlSZWxhdGlvbnNoaXA8VCBleHRlbmRzIEpzb25BcGlNb2RlbD4oXG4gICAgbW9kZWxUeXBlOiBNb2RlbFR5cGU8VD4sXG4gICAgZGF0YTogYW55LFxuICAgIGluY2x1ZGVkOiBhbnksXG4gICAgdHlwZU5hbWU6IHN0cmluZyxcbiAgICByZW1haW5pbmdNb2RlbHM6IEFycmF5PGFueT5cbiAgKTogQXJyYXk8VD4ge1xuICAgIGNvbnN0IHJlbGF0aW9uc2hpcExpc3Q6IEFycmF5PFQ+ID0gW107XG5cbiAgICBkYXRhLmZvckVhY2goKGl0ZW06IGFueSkgPT4ge1xuICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGF0YTogYW55ID0gZmluZChpbmNsdWRlZCwge2lkOiBpdGVtLmlkLCB0eXBlOiB0eXBlTmFtZX0gYXMgYW55KTtcblxuICAgICAgaWYgKHJlbGF0aW9uc2hpcERhdGEpIHtcbiAgICAgICAgY29uc3QgbmV3T2JqZWN0OiBUID0gdGhpcy5jcmVhdGVPclBlZWsobW9kZWxUeXBlLCByZWxhdGlvbnNoaXBEYXRhKTtcblxuICAgICAgICBjb25zdCBpbmRleE9mTmV3bHlGb3VuZE1vZGVsID0gcmVtYWluaW5nTW9kZWxzLmluZGV4T2YocmVsYXRpb25zaGlwRGF0YSk7XG4gICAgICAgIGNvbnN0IG1vZGVsc0ZvclByb2Nlc3NpbmcgPSByZW1haW5pbmdNb2RlbHMuY29uY2F0KFtdKTtcblxuICAgICAgICBpZiAoaW5kZXhPZk5ld2x5Rm91bmRNb2RlbCAhPT0gLTEpIHtcbiAgICAgICAgICBtb2RlbHNGb3JQcm9jZXNzaW5nLnNwbGljZShpbmRleE9mTmV3bHlGb3VuZE1vZGVsLCAxKTtcbiAgICAgICAgICBuZXdPYmplY3Quc3luY1JlbGF0aW9uc2hpcHMocmVsYXRpb25zaGlwRGF0YSwgaW5jbHVkZWQsIG1vZGVsc0ZvclByb2Nlc3NpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVsYXRpb25zaGlwTGlzdC5wdXNoKG5ld09iamVjdCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVsYXRpb25zaGlwTGlzdDtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0QmVsb25nc1RvUmVsYXRpb25zaGlwPFQgZXh0ZW5kcyBKc29uQXBpTW9kZWw+KFxuICAgIG1vZGVsVHlwZTogTW9kZWxUeXBlPFQ+LFxuICAgIGRhdGE6IGFueSxcbiAgICBpbmNsdWRlZDogQXJyYXk8YW55PixcbiAgICB0eXBlTmFtZTogc3RyaW5nLFxuICAgIHJlbWFpbmluZ01vZGVsczogQXJyYXk8YW55PlxuICApOiBUIHwgbnVsbCB7XG4gICAgY29uc3QgaWQ6IHN0cmluZyA9IGRhdGEuaWQ7XG5cbiAgICBjb25zdCByZWxhdGlvbnNoaXBEYXRhOiBhbnkgPSBmaW5kKGluY2x1ZGVkLCB7aWQsIHR5cGU6IHR5cGVOYW1lfSBhcyBhbnkpO1xuXG4gICAgaWYgKHJlbGF0aW9uc2hpcERhdGEpIHtcbiAgICAgIGNvbnN0IG5ld09iamVjdDogVCA9IHRoaXMuY3JlYXRlT3JQZWVrKG1vZGVsVHlwZSwgcmVsYXRpb25zaGlwRGF0YSk7XG5cbiAgICAgIGNvbnN0IGluZGV4T2ZOZXdseUZvdW5kTW9kZWwgPSByZW1haW5pbmdNb2RlbHMuaW5kZXhPZihyZWxhdGlvbnNoaXBEYXRhKTtcbiAgICAgIGNvbnN0IG1vZGVsc0ZvclByb2Nlc3NpbmcgPSByZW1haW5pbmdNb2RlbHMuY29uY2F0KFtdKTtcblxuICAgICAgaWYgKGluZGV4T2ZOZXdseUZvdW5kTW9kZWwgIT09IC0xKSB7XG4gICAgICAgIG1vZGVsc0ZvclByb2Nlc3Npbmcuc3BsaWNlKGluZGV4T2ZOZXdseUZvdW5kTW9kZWwsIDEpO1xuICAgICAgICBuZXdPYmplY3Quc3luY1JlbGF0aW9uc2hpcHMocmVsYXRpb25zaGlwRGF0YSwgaW5jbHVkZWQsIG1vZGVsc0ZvclByb2Nlc3NpbmcpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3T2JqZWN0O1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmludGVybmFsRGF0YXN0b3JlLnBlZWtSZWNvcmQobW9kZWxUeXBlLCBpZCk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZU9yUGVlazxUIGV4dGVuZHMgSnNvbkFwaU1vZGVsPihtb2RlbFR5cGU6IE1vZGVsVHlwZTxUPiwgZGF0YTogYW55KTogVCB7XG4gICAgY29uc3QgcGVlayA9IHRoaXMuaW50ZXJuYWxEYXRhc3RvcmUucGVla1JlY29yZChtb2RlbFR5cGUsIGRhdGEuaWQpO1xuXG4gICAgaWYgKHBlZWspIHtcbiAgICAgIF8uZXh0ZW5kKHBlZWssIHRoaXMuaW50ZXJuYWxEYXRhc3RvcmUudHJhbnNmb3JtU2VyaWFsaXplZE5hbWVzVG9Qcm9wZXJ0eU5hbWVzKG1vZGVsVHlwZSwgZGF0YS5hdHRyaWJ1dGVzKSk7XG4gICAgICByZXR1cm4gcGVlaztcbiAgICB9XG5cbiAgICBjb25zdCBuZXdPYmplY3Q6IFQgPSB0aGlzLmludGVybmFsRGF0YXN0b3JlLmRlc2VyaWFsaXplTW9kZWwobW9kZWxUeXBlLCBkYXRhKTtcbiAgICB0aGlzLmludGVybmFsRGF0YXN0b3JlLmFkZFRvU3RvcmUobmV3T2JqZWN0KTtcblxuICAgIHJldHVybiBuZXdPYmplY3Q7XG4gIH1cbn1cbiJdfQ==