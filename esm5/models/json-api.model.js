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
        this.unresolvedRelations = {};
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
                                else {
                                    this.unresolvedRelations[metadata.propertyName] = dataRelationship;
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
    JsonApiModel.prototype.unresolvedRelations;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi1hcGkubW9kZWwuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyMi1qc29uYXBpLyIsInNvdXJjZXMiOlsibW9kZWxzL2pzb24tYXBpLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxJQUFJLE1BQU0sZ0JBQWdCLENBQUM7QUFDbEMsT0FBTyxRQUFRLE1BQU0sb0JBQW9CLENBQUM7QUFJMUMsT0FBTyxLQUFLLENBQUMsTUFBTSxRQUFRLENBQUM7QUFDNUIsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7Ozs7Ozs7OztJQVVuRCxzQkFBc0IsR0FBVyxtQkFBQSxpQkFBaUIsRUFBTzs7SUFFekQsc0JBQXNCOzs7O0FBQUcsVUFBQSxhQUFhOztRQUNwQyxNQUFNLEdBQUcsRUFBRTs7UUFDWCxXQUFXOzs7OztJQUFHLFVBQUMsRUFBUyxFQUFFLEdBQUc7WUFBWixnQkFBSztRQUMxQixJQUFJLEtBQUssRUFBRTtZQUNULE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssT0FBQSxFQUFFLENBQUM7U0FDekI7SUFDSCxDQUFDLENBQUE7SUFFRCxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsSUFBSSxFQUFFLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFFNUMsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyxDQUFBOztBQUVEO0lBVUUsc0JBQW9CLGlCQUFtQyxFQUFFLElBQVU7UUFBL0Msc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQVJoRCx3QkFBbUIsR0FBRyxLQUFLLENBQUM7UUFDNUIsc0JBQWlCLEdBQUcsRUFBRSxDQUFDO1FBQ3ZCLHdCQUFtQixHQUFRLEVBQUUsQ0FBQztRQU9uQyxJQUFJLElBQUksRUFBRTtZQUNSLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7WUFDaEMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQ2xCLElBQUks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Q0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDM0csT0FBTyxJQUFJLENBQUM7U0FDYjs7WUFFSyxTQUFTLEdBQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUM7UUFDN0UsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUU3QyxPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBQ0gsbUJBQUM7QUFBRCxDQUFDLEFBMVBELElBMFBDOzs7O0lBelBDLDBCQUFXOztJQUNYLDJDQUFtQzs7SUFDbkMseUNBQThCOztJQUM5QiwyQ0FBcUM7O0lBSXJDLHNDQUEyQjs7Ozs7SUFFZix5Q0FBMkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZmluZCBmcm9tICdsb2Rhc2gtZXMvZmluZCc7XG5pbXBvcnQgaW5jbHVkZXMgZnJvbSAnbG9kYXNoLWVzL2luY2x1ZGVzJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IEpzb25BcGlEYXRhc3RvcmUsIE1vZGVsVHlwZSB9IGZyb20gJy4uL3NlcnZpY2VzL2pzb24tYXBpLWRhdGFzdG9yZS5zZXJ2aWNlJztcbmltcG9ydCB7IE1vZGVsQ29uZmlnIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9tb2RlbC1jb25maWcuaW50ZXJmYWNlJztcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IEF0dHJpYnV0ZU1ldGFkYXRhIH0gZnJvbSAnLi4vY29uc3RhbnRzL3N5bWJvbHMnO1xuaW1wb3J0IHsgSHR0cEhlYWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5cbi8qKlxuICogSEFDSy9GSVhNRTpcbiAqIFR5cGUgJ3N5bWJvbCcgY2Fubm90IGJlIHVzZWQgYXMgYW4gaW5kZXggdHlwZS5cbiAqIFR5cGVTY3JpcHQgMi45LnhcbiAqIFNlZSBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzI0NTg3LlxuICovXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZVxuY29uc3QgQXR0cmlidXRlTWV0YWRhdGFJbmRleDogc3RyaW5nID0gQXR0cmlidXRlTWV0YWRhdGEgYXMgYW55O1xuXG5jb25zdCBwYXJzZVJlbGF0aW9uc2hpcExpbmtzID0gcmVsYXRpb25zaGlwcyA9PiB7XG4gIGNvbnN0IHJlc3VsdCA9IHt9O1xuICBjb25zdCBsaW5rc01hcHBlciA9ICh7IGxpbmtzIH0sIGtleSkgPT4ge1xuICAgIGlmIChsaW5rcykge1xuICAgICAgcmVzdWx0W2tleV0gPSB7IGxpbmtzIH07XG4gICAgfVxuICB9O1xuXG4gIF8uZm9yRWFjaChyZWxhdGlvbnNoaXBzIHx8IHt9LCBsaW5rc01hcHBlcik7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmV4cG9ydCBjbGFzcyBKc29uQXBpTW9kZWwge1xuICBpZDogc3RyaW5nO1xuICBwdWJsaWMgbW9kZWxJbml0aWFsaXphdGlvbiA9IGZhbHNlO1xuICBwdWJsaWMgcmVsYXRpb25zaGlwTGlua3MgPSB7fTtcbiAgcHVibGljIHVucmVzb2x2ZWRSZWxhdGlvbnM6IGFueSA9IHt9O1xuXG4gIFtrZXk6IHN0cmluZ106IGFueTtcblxuICBsYXN0U3luY01vZGVsczogQXJyYXk8YW55PjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGludGVybmFsRGF0YXN0b3JlOiBKc29uQXBpRGF0YXN0b3JlLCBkYXRhPzogYW55KSB7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIHRoaXMubW9kZWxJbml0aWFsaXphdGlvbiA9IHRydWU7XG4gICAgICB0aGlzLmlkID0gZGF0YS5pZDtcbiAgICAgIHRoaXMucmVsYXRpb25zaGlwTGlua3MgPSBwYXJzZVJlbGF0aW9uc2hpcExpbmtzKGRhdGEucmVsYXRpb25zaGlwcyk7XG4gICAgICBPYmplY3QuYXNzaWduKHRoaXMsIGRhdGEuYXR0cmlidXRlcyk7XG4gICAgICB0aGlzLm1vZGVsSW5pdGlhbGl6YXRpb24gPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgaXNNb2RlbEluaXRpYWxpemF0aW9uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm1vZGVsSW5pdGlhbGl6YXRpb247XG4gIH1cblxuICBwdWJsaWMgc3luY1JlbGF0aW9uc2hpcHMoZGF0YTogYW55LCBpbmNsdWRlZDogYW55LCByZW1haW5pbmdNb2RlbHM/OiBBcnJheTxhbnk+KTogdm9pZCB7XG4gICAgaWYgKHRoaXMubGFzdFN5bmNNb2RlbHMgPT09IGluY2x1ZGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIGxldCBtb2RlbHNGb3JQcm9jZXNzaW5nID0gcmVtYWluaW5nTW9kZWxzO1xuXG4gICAgICBpZiAobW9kZWxzRm9yUHJvY2Vzc2luZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG1vZGVsc0ZvclByb2Nlc3NpbmcgPSBbXS5jb25jYXQoaW5jbHVkZWQpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnBhcnNlSGFzTWFueShkYXRhLCBpbmNsdWRlZCwgbW9kZWxzRm9yUHJvY2Vzc2luZyk7XG4gICAgICB0aGlzLnBhcnNlQmVsb25nc1RvKGRhdGEsIGluY2x1ZGVkLCBtb2RlbHNGb3JQcm9jZXNzaW5nKTtcbiAgICB9XG5cbiAgICB0aGlzLmxhc3RTeW5jTW9kZWxzID0gaW5jbHVkZWQ7XG4gIH1cblxuICBwdWJsaWMgc2F2ZShwYXJhbXM/OiBhbnksIGhlYWRlcnM/OiBIdHRwSGVhZGVycywgY3VzdG9tVXJsPzogc3RyaW5nKTogT2JzZXJ2YWJsZTx0aGlzPiB7XG4gICAgdGhpcy5jaGVja0NoYW5nZXMoKTtcbiAgICBjb25zdCBhdHRyaWJ1dGVzTWV0YWRhdGE6IGFueSA9IHRoaXNbQXR0cmlidXRlTWV0YWRhdGFJbmRleF07XG4gICAgcmV0dXJuIHRoaXMuaW50ZXJuYWxEYXRhc3RvcmUuc2F2ZVJlY29yZChhdHRyaWJ1dGVzTWV0YWRhdGEsIHRoaXMsIHBhcmFtcywgaGVhZGVycywgY3VzdG9tVXJsKTtcbiAgfVxuXG4gIGdldCBoYXNEaXJ0eUF0dHJpYnV0ZXMoKSB7XG4gICAgdGhpcy5jaGVja0NoYW5nZXMoKTtcbiAgICBjb25zdCBhdHRyaWJ1dGVzTWV0YWRhdGE6IGFueSA9IHRoaXNbQXR0cmlidXRlTWV0YWRhdGFJbmRleF07XG4gICAgbGV0IGhhc0RpcnR5QXR0cmlidXRlcyA9IGZhbHNlO1xuICAgIGZvciAoY29uc3QgcHJvcGVydHlOYW1lIGluIGF0dHJpYnV0ZXNNZXRhZGF0YSkge1xuICAgICAgaWYgKGF0dHJpYnV0ZXNNZXRhZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgIGNvbnN0IG1ldGFkYXRhOiBhbnkgPSBhdHRyaWJ1dGVzTWV0YWRhdGFbcHJvcGVydHlOYW1lXTtcbiAgICAgICAgaWYgKG1ldGFkYXRhLmhhc0RpcnR5QXR0cmlidXRlcykge1xuICAgICAgICAgIGhhc0RpcnR5QXR0cmlidXRlcyA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGhhc0RpcnR5QXR0cmlidXRlcztcbiAgfVxuXG4gIHByaXZhdGUgY2hlY2tDaGFuZ2VzKCkge1xuICAgIGNvbnN0IGF0dHJpYnV0ZXNNZXRhZGF0YTogYW55ID0gdGhpc1tBdHRyaWJ1dGVNZXRhZGF0YV07XG4gICAgZm9yIChjb25zdCBwcm9wZXJ0eU5hbWUgaW4gYXR0cmlidXRlc01ldGFkYXRhKSB7XG4gICAgICBpZiAoYXR0cmlidXRlc01ldGFkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgY29uc3QgbWV0YWRhdGE6IGFueSA9IGF0dHJpYnV0ZXNNZXRhZGF0YVtwcm9wZXJ0eU5hbWVdO1xuICAgICAgICBpZiAobWV0YWRhdGEubmVzdGVkKSB7XG4gICAgICAgICAgdGhpc1tBdHRyaWJ1dGVNZXRhZGF0YV1bcHJvcGVydHlOYW1lXS5oYXNEaXJ0eUF0dHJpYnV0ZXMgPSAhXy5pc0VxdWFsKFxuICAgICAgICAgICAgYXR0cmlidXRlc01ldGFkYXRhW3Byb3BlcnR5TmFtZV0ub2xkVmFsdWUsXG4gICAgICAgICAgICBhdHRyaWJ1dGVzTWV0YWRhdGFbcHJvcGVydHlOYW1lXS5uZXdWYWx1ZVxuICAgICAgICAgICk7XG4gICAgICAgICAgdGhpc1tBdHRyaWJ1dGVNZXRhZGF0YV1bcHJvcGVydHlOYW1lXS5zZXJpYWxpc2F0aW9uVmFsdWUgPSBhdHRyaWJ1dGVzTWV0YWRhdGFbcHJvcGVydHlOYW1lXS5jb252ZXJ0ZXIoXG4gICAgICAgICAgICBSZWZsZWN0LmdldE1ldGFkYXRhKCdkZXNpZ246dHlwZScsIHRoaXMsIHByb3BlcnR5TmFtZSksXG4gICAgICAgICAgICBfLmNsb25lRGVlcChhdHRyaWJ1dGVzTWV0YWRhdGFbcHJvcGVydHlOYW1lXS5uZXdWYWx1ZSksXG4gICAgICAgICAgICB0cnVlXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyByb2xsYmFja0F0dHJpYnV0ZXMoKTogdm9pZCB7XG4gICAgY29uc3QgYXR0cmlidXRlc01ldGFkYXRhOiBhbnkgPSB0aGlzW0F0dHJpYnV0ZU1ldGFkYXRhSW5kZXhdO1xuICAgIGZvciAoY29uc3QgcHJvcGVydHlOYW1lIGluIGF0dHJpYnV0ZXNNZXRhZGF0YSkge1xuICAgICAgaWYgKGF0dHJpYnV0ZXNNZXRhZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgIGlmIChhdHRyaWJ1dGVzTWV0YWRhdGFbcHJvcGVydHlOYW1lXS5oYXNEaXJ0eUF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICB0aGlzW3Byb3BlcnR5TmFtZV0gPSBfLmNsb25lRGVlcChhdHRyaWJ1dGVzTWV0YWRhdGFbcHJvcGVydHlOYW1lXS5vbGRWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXQgbW9kZWxDb25maWcoKTogTW9kZWxDb25maWcge1xuICAgIHJldHVybiBSZWZsZWN0LmdldE1ldGFkYXRhKCdKc29uQXBpTW9kZWxDb25maWcnLCB0aGlzLmNvbnN0cnVjdG9yKTtcbiAgfVxuXG4gIHByaXZhdGUgcGFyc2VIYXNNYW55KGRhdGE6IGFueSwgaW5jbHVkZWQ6IGFueSwgcmVtYWluaW5nTW9kZWxzOiBBcnJheTxhbnk+KTogdm9pZCB7XG4gICAgY29uc3QgaGFzTWFueTogYW55ID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnSGFzTWFueScsIHRoaXMpO1xuXG4gICAgaWYgKGhhc01hbnkpIHtcbiAgICAgIGZvciAoY29uc3QgbWV0YWRhdGEgb2YgaGFzTWFueSkge1xuICAgICAgICBjb25zdCByZWxhdGlvbnNoaXA6IGFueSA9IGRhdGEucmVsYXRpb25zaGlwcyA/IGRhdGEucmVsYXRpb25zaGlwc1ttZXRhZGF0YS5yZWxhdGlvbnNoaXBdIDogbnVsbDtcblxuICAgICAgICBpZiAocmVsYXRpb25zaGlwICYmIHJlbGF0aW9uc2hpcC5kYXRhICYmIEFycmF5LmlzQXJyYXkocmVsYXRpb25zaGlwLmRhdGEpKSB7XG4gICAgICAgICAgbGV0IGFsbE1vZGVsczogSnNvbkFwaU1vZGVsW10gPSBbXTtcbiAgICAgICAgICBjb25zdCBtb2RlbFR5cGVzRmV0Y2hlZDogYW55ID0gW107XG5cbiAgICAgICAgICBmb3IgKGNvbnN0IHR5cGVJbmRleCBvZiBPYmplY3Qua2V5cyhyZWxhdGlvbnNoaXAuZGF0YSkpIHtcbiAgICAgICAgICAgIGNvbnN0IHR5cGVOYW1lOiBzdHJpbmcgPSByZWxhdGlvbnNoaXAuZGF0YVt0eXBlSW5kZXhdLnR5cGU7XG5cbiAgICAgICAgICAgIGlmICghaW5jbHVkZXMobW9kZWxUeXBlc0ZldGNoZWQsIHR5cGVOYW1lKSkge1xuICAgICAgICAgICAgICBtb2RlbFR5cGVzRmV0Y2hlZC5wdXNoKHR5cGVOYW1lKTtcbiAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxuICAgICAgICAgICAgICBjb25zdCBtb2RlbFR5cGU6IE1vZGVsVHlwZTx0aGlzPiA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ0pzb25BcGlEYXRhc3RvcmVDb25maWcnLCB0aGlzLmludGVybmFsRGF0YXN0b3JlLmNvbnN0cnVjdG9yKS5tb2RlbHNbdHlwZU5hbWVdO1xuXG4gICAgICAgICAgICAgIGlmIChtb2RlbFR5cGUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBNb2RlbHM6IEpzb25BcGlNb2RlbFtdID0gdGhpcy5nZXRIYXNNYW55UmVsYXRpb25zaGlwKFxuICAgICAgICAgICAgICAgICAgbW9kZWxUeXBlLFxuICAgICAgICAgICAgICAgICAgcmVsYXRpb25zaGlwLmRhdGEsXG4gICAgICAgICAgICAgICAgICBpbmNsdWRlZCxcbiAgICAgICAgICAgICAgICAgIHR5cGVOYW1lLFxuICAgICAgICAgICAgICAgICAgcmVtYWluaW5nTW9kZWxzXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIGlmIChyZWxhdGlvbnNoaXBNb2RlbHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgYWxsTW9kZWxzID0gYWxsTW9kZWxzLmNvbmNhdChyZWxhdGlvbnNoaXBNb2RlbHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyB7bWVzc2FnZTogYHBhcnNlSGFzTWFueSAtIE1vZGVsIHR5cGUgZm9yIHJlbGF0aW9uc2hpcCAke3R5cGVOYW1lfSBub3QgZm91bmQuYH07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzW21ldGFkYXRhLnByb3BlcnR5TmFtZV0gPSBhbGxNb2RlbHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHBhcnNlQmVsb25nc1RvKGRhdGE6IGFueSwgaW5jbHVkZWQ6IEFycmF5PGFueT4sIHJlbWFpbmluZ01vZGVsczogQXJyYXk8YW55Pik6IHZvaWQge1xuICAgIGNvbnN0IGJlbG9uZ3NUbzogYW55ID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnQmVsb25nc1RvJywgdGhpcyk7XG5cbiAgICBpZiAoYmVsb25nc1RvKSB7XG4gICAgICBmb3IgKGNvbnN0IG1ldGFkYXRhIG9mIGJlbG9uZ3NUbykge1xuICAgICAgICBjb25zdCByZWxhdGlvbnNoaXA6IGFueSA9IGRhdGEucmVsYXRpb25zaGlwcyA/IGRhdGEucmVsYXRpb25zaGlwc1ttZXRhZGF0YS5yZWxhdGlvbnNoaXBdIDogbnVsbDtcbiAgICAgICAgaWYgKHJlbGF0aW9uc2hpcCAmJiByZWxhdGlvbnNoaXAuZGF0YSkge1xuICAgICAgICAgIGNvbnN0IGRhdGFSZWxhdGlvbnNoaXA6IGFueSA9IChyZWxhdGlvbnNoaXAuZGF0YSBpbnN0YW5jZW9mIEFycmF5KSA/IHJlbGF0aW9uc2hpcC5kYXRhWzBdIDogcmVsYXRpb25zaGlwLmRhdGE7XG4gICAgICAgICAgaWYgKGRhdGFSZWxhdGlvbnNoaXApIHtcbiAgICAgICAgICAgIGNvbnN0IHR5cGVOYW1lOiBzdHJpbmcgPSBkYXRhUmVsYXRpb25zaGlwLnR5cGU7XG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgICAgICAgICBjb25zdCBtb2RlbFR5cGU6IE1vZGVsVHlwZTx0aGlzPiA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ0pzb25BcGlEYXRhc3RvcmVDb25maWcnLCB0aGlzLmludGVybmFsRGF0YXN0b3JlLmNvbnN0cnVjdG9yKS5tb2RlbHNbdHlwZU5hbWVdO1xuXG4gICAgICAgICAgICBpZiAobW9kZWxUeXBlKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcE1vZGVsID0gdGhpcy5nZXRCZWxvbmdzVG9SZWxhdGlvbnNoaXAoXG4gICAgICAgICAgICAgICAgbW9kZWxUeXBlLFxuICAgICAgICAgICAgICAgIGRhdGFSZWxhdGlvbnNoaXAsXG4gICAgICAgICAgICAgICAgaW5jbHVkZWQsXG4gICAgICAgICAgICAgICAgdHlwZU5hbWUsXG4gICAgICAgICAgICAgICAgcmVtYWluaW5nTW9kZWxzXG4gICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgaWYgKHJlbGF0aW9uc2hpcE1vZGVsKSB7XG4gICAgICAgICAgICAgICAgdGhpc1ttZXRhZGF0YS5wcm9wZXJ0eU5hbWVdID0gcmVsYXRpb25zaGlwTW9kZWw7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy51bnJlc29sdmVkUmVsYXRpb25zW21ldGFkYXRhLnByb3BlcnR5TmFtZV0gPSBkYXRhUmVsYXRpb25zaGlwO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aHJvdyB7bWVzc2FnZTogYHBhcnNlQmVsb25nc1RvIC0gTW9kZWwgdHlwZSBmb3IgcmVsYXRpb25zaGlwICR7dHlwZU5hbWV9IG5vdCBmb3VuZC5gfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldEhhc01hbnlSZWxhdGlvbnNoaXA8VCBleHRlbmRzIEpzb25BcGlNb2RlbD4oXG4gICAgbW9kZWxUeXBlOiBNb2RlbFR5cGU8VD4sXG4gICAgZGF0YTogYW55LFxuICAgIGluY2x1ZGVkOiBhbnksXG4gICAgdHlwZU5hbWU6IHN0cmluZyxcbiAgICByZW1haW5pbmdNb2RlbHM6IEFycmF5PGFueT5cbiAgKTogQXJyYXk8VD4ge1xuICAgIGNvbnN0IHJlbGF0aW9uc2hpcExpc3Q6IEFycmF5PFQ+ID0gW107XG5cbiAgICBkYXRhLmZvckVhY2goKGl0ZW06IGFueSkgPT4ge1xuICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGF0YTogYW55ID0gZmluZChpbmNsdWRlZCwge2lkOiBpdGVtLmlkLCB0eXBlOiB0eXBlTmFtZX0gYXMgYW55KTtcblxuICAgICAgaWYgKHJlbGF0aW9uc2hpcERhdGEpIHtcbiAgICAgICAgY29uc3QgbmV3T2JqZWN0OiBUID0gdGhpcy5jcmVhdGVPclBlZWsobW9kZWxUeXBlLCByZWxhdGlvbnNoaXBEYXRhKTtcblxuICAgICAgICBjb25zdCBpbmRleE9mTmV3bHlGb3VuZE1vZGVsID0gcmVtYWluaW5nTW9kZWxzLmluZGV4T2YocmVsYXRpb25zaGlwRGF0YSk7XG4gICAgICAgIGNvbnN0IG1vZGVsc0ZvclByb2Nlc3NpbmcgPSByZW1haW5pbmdNb2RlbHMuY29uY2F0KFtdKTtcblxuICAgICAgICBpZiAoaW5kZXhPZk5ld2x5Rm91bmRNb2RlbCAhPT0gLTEpIHtcbiAgICAgICAgICBtb2RlbHNGb3JQcm9jZXNzaW5nLnNwbGljZShpbmRleE9mTmV3bHlGb3VuZE1vZGVsLCAxKTtcbiAgICAgICAgICBuZXdPYmplY3Quc3luY1JlbGF0aW9uc2hpcHMocmVsYXRpb25zaGlwRGF0YSwgaW5jbHVkZWQsIG1vZGVsc0ZvclByb2Nlc3NpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVsYXRpb25zaGlwTGlzdC5wdXNoKG5ld09iamVjdCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVsYXRpb25zaGlwTGlzdDtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0QmVsb25nc1RvUmVsYXRpb25zaGlwPFQgZXh0ZW5kcyBKc29uQXBpTW9kZWw+KFxuICAgIG1vZGVsVHlwZTogTW9kZWxUeXBlPFQ+LFxuICAgIGRhdGE6IGFueSxcbiAgICBpbmNsdWRlZDogQXJyYXk8YW55PixcbiAgICB0eXBlTmFtZTogc3RyaW5nLFxuICAgIHJlbWFpbmluZ01vZGVsczogQXJyYXk8YW55PlxuICApOiBUIHwgbnVsbCB7XG4gICAgY29uc3QgaWQ6IHN0cmluZyA9IGRhdGEuaWQ7XG5cbiAgICBjb25zdCByZWxhdGlvbnNoaXBEYXRhOiBhbnkgPSBmaW5kKGluY2x1ZGVkLCB7aWQsIHR5cGU6IHR5cGVOYW1lfSBhcyBhbnkpO1xuXG4gICAgaWYgKHJlbGF0aW9uc2hpcERhdGEpIHtcbiAgICAgIGNvbnN0IG5ld09iamVjdDogVCA9IHRoaXMuY3JlYXRlT3JQZWVrKG1vZGVsVHlwZSwgcmVsYXRpb25zaGlwRGF0YSk7XG5cbiAgICAgIGNvbnN0IGluZGV4T2ZOZXdseUZvdW5kTW9kZWwgPSByZW1haW5pbmdNb2RlbHMuaW5kZXhPZihyZWxhdGlvbnNoaXBEYXRhKTtcbiAgICAgIGNvbnN0IG1vZGVsc0ZvclByb2Nlc3NpbmcgPSByZW1haW5pbmdNb2RlbHMuY29uY2F0KFtdKTtcblxuICAgICAgaWYgKGluZGV4T2ZOZXdseUZvdW5kTW9kZWwgIT09IC0xKSB7XG4gICAgICAgIG1vZGVsc0ZvclByb2Nlc3Npbmcuc3BsaWNlKGluZGV4T2ZOZXdseUZvdW5kTW9kZWwsIDEpO1xuICAgICAgICBuZXdPYmplY3Quc3luY1JlbGF0aW9uc2hpcHMocmVsYXRpb25zaGlwRGF0YSwgaW5jbHVkZWQsIG1vZGVsc0ZvclByb2Nlc3NpbmcpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3T2JqZWN0O1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmludGVybmFsRGF0YXN0b3JlLnBlZWtSZWNvcmQobW9kZWxUeXBlLCBpZCk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZU9yUGVlazxUIGV4dGVuZHMgSnNvbkFwaU1vZGVsPihtb2RlbFR5cGU6IE1vZGVsVHlwZTxUPiwgZGF0YTogYW55KTogVCB7XG4gICAgY29uc3QgcGVlayA9IHRoaXMuaW50ZXJuYWxEYXRhc3RvcmUucGVla1JlY29yZChtb2RlbFR5cGUsIGRhdGEuaWQpO1xuXG4gICAgaWYgKHBlZWspIHtcbiAgICAgIF8uZXh0ZW5kKHBlZWssIHRoaXMuaW50ZXJuYWxEYXRhc3RvcmUudHJhbnNmb3JtU2VyaWFsaXplZE5hbWVzVG9Qcm9wZXJ0eU5hbWVzKG1vZGVsVHlwZSwgZGF0YS5hdHRyaWJ1dGVzKSk7XG4gICAgICByZXR1cm4gcGVlaztcbiAgICB9XG5cbiAgICBjb25zdCBuZXdPYmplY3Q6IFQgPSB0aGlzLmludGVybmFsRGF0YXN0b3JlLmRlc2VyaWFsaXplTW9kZWwobW9kZWxUeXBlLCBkYXRhKTtcbiAgICB0aGlzLmludGVybmFsRGF0YXN0b3JlLmFkZFRvU3RvcmUobmV3T2JqZWN0KTtcblxuICAgIHJldHVybiBuZXdPYmplY3Q7XG4gIH1cbn1cbiJdfQ==