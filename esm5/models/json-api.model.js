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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi1hcGkubW9kZWwuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyMi1qc29uYXBpLyIsInNvdXJjZXMiOlsibW9kZWxzL2pzb24tYXBpLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxJQUFJLE1BQU0sZ0JBQWdCLENBQUM7QUFDbEMsT0FBTyxRQUFRLE1BQU0sb0JBQW9CLENBQUM7QUFJMUMsT0FBTyxLQUFLLENBQUMsTUFBTSxRQUFRLENBQUM7QUFDNUIsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7Ozs7Ozs7OztJQVVuRCxzQkFBc0IsR0FBVyxtQkFBQSxpQkFBaUIsRUFBTzs7SUFFekQsc0JBQXNCOzs7O0FBQUcsVUFBQSxhQUFhOztRQUNwQyxNQUFNLEdBQUcsRUFBRTs7UUFDWCxXQUFXOzs7OztJQUFHLFVBQUMsRUFBUyxFQUFFLEdBQUc7WUFBWixnQkFBSztRQUMxQixJQUFJLEtBQUssRUFBRTtZQUNULE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssT0FBQSxFQUFFLENBQUM7U0FDekI7SUFDSCxDQUFDLENBQUE7SUFFRCxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsSUFBSSxFQUFFLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFFNUMsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyxDQUFBOztBQUVEO0lBVUUsc0JBQW9CLGlCQUFtQyxFQUFFLElBQVU7UUFBL0Msc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQVJoRCx3QkFBbUIsR0FBRyxLQUFLLENBQUM7UUFDNUIsc0JBQWlCLEdBQUcsRUFBRSxDQUFDO1FBQ3ZCLHdCQUFtQixHQUFHLEVBQUUsQ0FBQztRQU85QixJQUFJLElBQUksRUFBRTtZQUNSLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7WUFDaEMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQ2xCLElBQUks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Q0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDM0csT0FBTyxJQUFJLENBQUM7U0FDYjs7WUFFSyxTQUFTLEdBQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUM7UUFDN0UsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUU3QyxPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBQ0gsbUJBQUM7QUFBRCxDQUFDLEFBMVBELElBMFBDOzs7O0lBelBDLDBCQUFXOztJQUNYLDJDQUFtQzs7SUFDbkMseUNBQThCOztJQUM5QiwyQ0FBZ0M7O0lBSWhDLHNDQUEyQjs7Ozs7SUFFZix5Q0FBMkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZmluZCBmcm9tICdsb2Rhc2gtZXMvZmluZCc7XG5pbXBvcnQgaW5jbHVkZXMgZnJvbSAnbG9kYXNoLWVzL2luY2x1ZGVzJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IEpzb25BcGlEYXRhc3RvcmUsIE1vZGVsVHlwZSB9IGZyb20gJy4uL3NlcnZpY2VzL2pzb24tYXBpLWRhdGFzdG9yZS5zZXJ2aWNlJztcbmltcG9ydCB7IE1vZGVsQ29uZmlnIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9tb2RlbC1jb25maWcuaW50ZXJmYWNlJztcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IEF0dHJpYnV0ZU1ldGFkYXRhIH0gZnJvbSAnLi4vY29uc3RhbnRzL3N5bWJvbHMnO1xuaW1wb3J0IHsgSHR0cEhlYWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5cbi8qKlxuICogSEFDSy9GSVhNRTpcbiAqIFR5cGUgJ3N5bWJvbCcgY2Fubm90IGJlIHVzZWQgYXMgYW4gaW5kZXggdHlwZS5cbiAqIFR5cGVTY3JpcHQgMi45LnhcbiAqIFNlZSBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzI0NTg3LlxuICovXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZVxuY29uc3QgQXR0cmlidXRlTWV0YWRhdGFJbmRleDogc3RyaW5nID0gQXR0cmlidXRlTWV0YWRhdGEgYXMgYW55O1xuXG5jb25zdCBwYXJzZVJlbGF0aW9uc2hpcExpbmtzID0gcmVsYXRpb25zaGlwcyA9PiB7XG4gIGNvbnN0IHJlc3VsdCA9IHt9O1xuICBjb25zdCBsaW5rc01hcHBlciA9ICh7IGxpbmtzIH0sIGtleSkgPT4ge1xuICAgIGlmIChsaW5rcykge1xuICAgICAgcmVzdWx0W2tleV0gPSB7IGxpbmtzIH07XG4gICAgfVxuICB9O1xuXG4gIF8uZm9yRWFjaChyZWxhdGlvbnNoaXBzIHx8IHt9LCBsaW5rc01hcHBlcik7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmV4cG9ydCBjbGFzcyBKc29uQXBpTW9kZWwge1xuICBpZDogc3RyaW5nO1xuICBwdWJsaWMgbW9kZWxJbml0aWFsaXphdGlvbiA9IGZhbHNlO1xuICBwdWJsaWMgcmVsYXRpb25zaGlwTGlua3MgPSB7fTtcbiAgcHVibGljIHVucmVzb2x2ZWRSZWxhdGlvbnMgPSB7fTtcblxuICBba2V5OiBzdHJpbmddOiBhbnk7XG5cbiAgbGFzdFN5bmNNb2RlbHM6IEFycmF5PGFueT47XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBpbnRlcm5hbERhdGFzdG9yZTogSnNvbkFwaURhdGFzdG9yZSwgZGF0YT86IGFueSkge1xuICAgIGlmIChkYXRhKSB7XG4gICAgICB0aGlzLm1vZGVsSW5pdGlhbGl6YXRpb24gPSB0cnVlO1xuICAgICAgdGhpcy5pZCA9IGRhdGEuaWQ7XG4gICAgICB0aGlzLnJlbGF0aW9uc2hpcExpbmtzID0gcGFyc2VSZWxhdGlvbnNoaXBMaW5rcyhkYXRhLnJlbGF0aW9uc2hpcHMpO1xuICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBkYXRhLmF0dHJpYnV0ZXMpO1xuICAgICAgdGhpcy5tb2RlbEluaXRpYWxpemF0aW9uID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGlzTW9kZWxJbml0aWFsaXphdGlvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5tb2RlbEluaXRpYWxpemF0aW9uO1xuICB9XG5cbiAgcHVibGljIHN5bmNSZWxhdGlvbnNoaXBzKGRhdGE6IGFueSwgaW5jbHVkZWQ6IGFueSwgcmVtYWluaW5nTW9kZWxzPzogQXJyYXk8YW55Pik6IHZvaWQge1xuICAgIGlmICh0aGlzLmxhc3RTeW5jTW9kZWxzID09PSBpbmNsdWRlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChkYXRhKSB7XG4gICAgICBsZXQgbW9kZWxzRm9yUHJvY2Vzc2luZyA9IHJlbWFpbmluZ01vZGVscztcblxuICAgICAgaWYgKG1vZGVsc0ZvclByb2Nlc3NpbmcgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBtb2RlbHNGb3JQcm9jZXNzaW5nID0gW10uY29uY2F0KGluY2x1ZGVkKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5wYXJzZUhhc01hbnkoZGF0YSwgaW5jbHVkZWQsIG1vZGVsc0ZvclByb2Nlc3NpbmcpO1xuICAgICAgdGhpcy5wYXJzZUJlbG9uZ3NUbyhkYXRhLCBpbmNsdWRlZCwgbW9kZWxzRm9yUHJvY2Vzc2luZyk7XG4gICAgfVxuXG4gICAgdGhpcy5sYXN0U3luY01vZGVscyA9IGluY2x1ZGVkO1xuICB9XG5cbiAgcHVibGljIHNhdmUocGFyYW1zPzogYW55LCBoZWFkZXJzPzogSHR0cEhlYWRlcnMsIGN1c3RvbVVybD86IHN0cmluZyk6IE9ic2VydmFibGU8dGhpcz4ge1xuICAgIHRoaXMuY2hlY2tDaGFuZ2VzKCk7XG4gICAgY29uc3QgYXR0cmlidXRlc01ldGFkYXRhOiBhbnkgPSB0aGlzW0F0dHJpYnV0ZU1ldGFkYXRhSW5kZXhdO1xuICAgIHJldHVybiB0aGlzLmludGVybmFsRGF0YXN0b3JlLnNhdmVSZWNvcmQoYXR0cmlidXRlc01ldGFkYXRhLCB0aGlzLCBwYXJhbXMsIGhlYWRlcnMsIGN1c3RvbVVybCk7XG4gIH1cblxuICBnZXQgaGFzRGlydHlBdHRyaWJ1dGVzKCkge1xuICAgIHRoaXMuY2hlY2tDaGFuZ2VzKCk7XG4gICAgY29uc3QgYXR0cmlidXRlc01ldGFkYXRhOiBhbnkgPSB0aGlzW0F0dHJpYnV0ZU1ldGFkYXRhSW5kZXhdO1xuICAgIGxldCBoYXNEaXJ0eUF0dHJpYnV0ZXMgPSBmYWxzZTtcbiAgICBmb3IgKGNvbnN0IHByb3BlcnR5TmFtZSBpbiBhdHRyaWJ1dGVzTWV0YWRhdGEpIHtcbiAgICAgIGlmIChhdHRyaWJ1dGVzTWV0YWRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSkge1xuICAgICAgICBjb25zdCBtZXRhZGF0YTogYW55ID0gYXR0cmlidXRlc01ldGFkYXRhW3Byb3BlcnR5TmFtZV07XG4gICAgICAgIGlmIChtZXRhZGF0YS5oYXNEaXJ0eUF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICBoYXNEaXJ0eUF0dHJpYnV0ZXMgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBoYXNEaXJ0eUF0dHJpYnV0ZXM7XG4gIH1cblxuICBwcml2YXRlIGNoZWNrQ2hhbmdlcygpIHtcbiAgICBjb25zdCBhdHRyaWJ1dGVzTWV0YWRhdGE6IGFueSA9IHRoaXNbQXR0cmlidXRlTWV0YWRhdGFdO1xuICAgIGZvciAoY29uc3QgcHJvcGVydHlOYW1lIGluIGF0dHJpYnV0ZXNNZXRhZGF0YSkge1xuICAgICAgaWYgKGF0dHJpYnV0ZXNNZXRhZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgIGNvbnN0IG1ldGFkYXRhOiBhbnkgPSBhdHRyaWJ1dGVzTWV0YWRhdGFbcHJvcGVydHlOYW1lXTtcbiAgICAgICAgaWYgKG1ldGFkYXRhLm5lc3RlZCkge1xuICAgICAgICAgIHRoaXNbQXR0cmlidXRlTWV0YWRhdGFdW3Byb3BlcnR5TmFtZV0uaGFzRGlydHlBdHRyaWJ1dGVzID0gIV8uaXNFcXVhbChcbiAgICAgICAgICAgIGF0dHJpYnV0ZXNNZXRhZGF0YVtwcm9wZXJ0eU5hbWVdLm9sZFZhbHVlLFxuICAgICAgICAgICAgYXR0cmlidXRlc01ldGFkYXRhW3Byb3BlcnR5TmFtZV0ubmV3VmFsdWVcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXNbQXR0cmlidXRlTWV0YWRhdGFdW3Byb3BlcnR5TmFtZV0uc2VyaWFsaXNhdGlvblZhbHVlID0gYXR0cmlidXRlc01ldGFkYXRhW3Byb3BlcnR5TmFtZV0uY29udmVydGVyKFxuICAgICAgICAgICAgUmVmbGVjdC5nZXRNZXRhZGF0YSgnZGVzaWduOnR5cGUnLCB0aGlzLCBwcm9wZXJ0eU5hbWUpLFxuICAgICAgICAgICAgXy5jbG9uZURlZXAoYXR0cmlidXRlc01ldGFkYXRhW3Byb3BlcnR5TmFtZV0ubmV3VmFsdWUpLFxuICAgICAgICAgICAgdHJ1ZVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcm9sbGJhY2tBdHRyaWJ1dGVzKCk6IHZvaWQge1xuICAgIGNvbnN0IGF0dHJpYnV0ZXNNZXRhZGF0YTogYW55ID0gdGhpc1tBdHRyaWJ1dGVNZXRhZGF0YUluZGV4XTtcbiAgICBmb3IgKGNvbnN0IHByb3BlcnR5TmFtZSBpbiBhdHRyaWJ1dGVzTWV0YWRhdGEpIHtcbiAgICAgIGlmIChhdHRyaWJ1dGVzTWV0YWRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSkge1xuICAgICAgICBpZiAoYXR0cmlidXRlc01ldGFkYXRhW3Byb3BlcnR5TmFtZV0uaGFzRGlydHlBdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgdGhpc1twcm9wZXJ0eU5hbWVdID0gXy5jbG9uZURlZXAoYXR0cmlidXRlc01ldGFkYXRhW3Byb3BlcnR5TmFtZV0ub2xkVmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0IG1vZGVsQ29uZmlnKCk6IE1vZGVsQ29uZmlnIHtcbiAgICByZXR1cm4gUmVmbGVjdC5nZXRNZXRhZGF0YSgnSnNvbkFwaU1vZGVsQ29uZmlnJywgdGhpcy5jb25zdHJ1Y3Rvcik7XG4gIH1cblxuICBwcml2YXRlIHBhcnNlSGFzTWFueShkYXRhOiBhbnksIGluY2x1ZGVkOiBhbnksIHJlbWFpbmluZ01vZGVsczogQXJyYXk8YW55Pik6IHZvaWQge1xuICAgIGNvbnN0IGhhc01hbnk6IGFueSA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ0hhc01hbnknLCB0aGlzKTtcblxuICAgIGlmIChoYXNNYW55KSB7XG4gICAgICBmb3IgKGNvbnN0IG1ldGFkYXRhIG9mIGhhc01hbnkpIHtcbiAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwOiBhbnkgPSBkYXRhLnJlbGF0aW9uc2hpcHMgPyBkYXRhLnJlbGF0aW9uc2hpcHNbbWV0YWRhdGEucmVsYXRpb25zaGlwXSA6IG51bGw7XG5cbiAgICAgICAgaWYgKHJlbGF0aW9uc2hpcCAmJiByZWxhdGlvbnNoaXAuZGF0YSAmJiBBcnJheS5pc0FycmF5KHJlbGF0aW9uc2hpcC5kYXRhKSkge1xuICAgICAgICAgIGxldCBhbGxNb2RlbHM6IEpzb25BcGlNb2RlbFtdID0gW107XG4gICAgICAgICAgY29uc3QgbW9kZWxUeXBlc0ZldGNoZWQ6IGFueSA9IFtdO1xuXG4gICAgICAgICAgZm9yIChjb25zdCB0eXBlSW5kZXggb2YgT2JqZWN0LmtleXMocmVsYXRpb25zaGlwLmRhdGEpKSB7XG4gICAgICAgICAgICBjb25zdCB0eXBlTmFtZTogc3RyaW5nID0gcmVsYXRpb25zaGlwLmRhdGFbdHlwZUluZGV4XS50eXBlO1xuXG4gICAgICAgICAgICBpZiAoIWluY2x1ZGVzKG1vZGVsVHlwZXNGZXRjaGVkLCB0eXBlTmFtZSkpIHtcbiAgICAgICAgICAgICAgbW9kZWxUeXBlc0ZldGNoZWQucHVzaCh0eXBlTmFtZSk7XG4gICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcbiAgICAgICAgICAgICAgY29uc3QgbW9kZWxUeXBlOiBNb2RlbFR5cGU8dGhpcz4gPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdKc29uQXBpRGF0YXN0b3JlQ29uZmlnJywgdGhpcy5pbnRlcm5hbERhdGFzdG9yZS5jb25zdHJ1Y3RvcikubW9kZWxzW3R5cGVOYW1lXTtcblxuICAgICAgICAgICAgICBpZiAobW9kZWxUeXBlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwTW9kZWxzOiBKc29uQXBpTW9kZWxbXSA9IHRoaXMuZ2V0SGFzTWFueVJlbGF0aW9uc2hpcChcbiAgICAgICAgICAgICAgICAgIG1vZGVsVHlwZSxcbiAgICAgICAgICAgICAgICAgIHJlbGF0aW9uc2hpcC5kYXRhLFxuICAgICAgICAgICAgICAgICAgaW5jbHVkZWQsXG4gICAgICAgICAgICAgICAgICB0eXBlTmFtZSxcbiAgICAgICAgICAgICAgICAgIHJlbWFpbmluZ01vZGVsc1xuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICBpZiAocmVsYXRpb25zaGlwTW9kZWxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgIGFsbE1vZGVscyA9IGFsbE1vZGVscy5jb25jYXQocmVsYXRpb25zaGlwTW9kZWxzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cge21lc3NhZ2U6IGBwYXJzZUhhc01hbnkgLSBNb2RlbCB0eXBlIGZvciByZWxhdGlvbnNoaXAgJHt0eXBlTmFtZX0gbm90IGZvdW5kLmB9O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpc1ttZXRhZGF0YS5wcm9wZXJ0eU5hbWVdID0gYWxsTW9kZWxzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBwYXJzZUJlbG9uZ3NUbyhkYXRhOiBhbnksIGluY2x1ZGVkOiBBcnJheTxhbnk+LCByZW1haW5pbmdNb2RlbHM6IEFycmF5PGFueT4pOiB2b2lkIHtcbiAgICBjb25zdCBiZWxvbmdzVG86IGFueSA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ0JlbG9uZ3NUbycsIHRoaXMpO1xuXG4gICAgaWYgKGJlbG9uZ3NUbykge1xuICAgICAgZm9yIChjb25zdCBtZXRhZGF0YSBvZiBiZWxvbmdzVG8pIHtcbiAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwOiBhbnkgPSBkYXRhLnJlbGF0aW9uc2hpcHMgPyBkYXRhLnJlbGF0aW9uc2hpcHNbbWV0YWRhdGEucmVsYXRpb25zaGlwXSA6IG51bGw7XG4gICAgICAgIGlmIChyZWxhdGlvbnNoaXAgJiYgcmVsYXRpb25zaGlwLmRhdGEpIHtcbiAgICAgICAgICBjb25zdCBkYXRhUmVsYXRpb25zaGlwOiBhbnkgPSAocmVsYXRpb25zaGlwLmRhdGEgaW5zdGFuY2VvZiBBcnJheSkgPyByZWxhdGlvbnNoaXAuZGF0YVswXSA6IHJlbGF0aW9uc2hpcC5kYXRhO1xuICAgICAgICAgIGlmIChkYXRhUmVsYXRpb25zaGlwKSB7XG4gICAgICAgICAgICBjb25zdCB0eXBlTmFtZTogc3RyaW5nID0gZGF0YVJlbGF0aW9uc2hpcC50eXBlO1xuICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxuICAgICAgICAgICAgY29uc3QgbW9kZWxUeXBlOiBNb2RlbFR5cGU8dGhpcz4gPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdKc29uQXBpRGF0YXN0b3JlQ29uZmlnJywgdGhpcy5pbnRlcm5hbERhdGFzdG9yZS5jb25zdHJ1Y3RvcikubW9kZWxzW3R5cGVOYW1lXTtcblxuICAgICAgICAgICAgaWYgKG1vZGVsVHlwZSkge1xuICAgICAgICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBNb2RlbCA9IHRoaXMuZ2V0QmVsb25nc1RvUmVsYXRpb25zaGlwKFxuICAgICAgICAgICAgICAgIG1vZGVsVHlwZSxcbiAgICAgICAgICAgICAgICBkYXRhUmVsYXRpb25zaGlwLFxuICAgICAgICAgICAgICAgIGluY2x1ZGVkLFxuICAgICAgICAgICAgICAgIHR5cGVOYW1lLFxuICAgICAgICAgICAgICAgIHJlbWFpbmluZ01vZGVsc1xuICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgIGlmIChyZWxhdGlvbnNoaXBNb2RlbCkge1xuICAgICAgICAgICAgICAgIHRoaXNbbWV0YWRhdGEucHJvcGVydHlOYW1lXSA9IHJlbGF0aW9uc2hpcE1vZGVsO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudW5yZXNvbHZlZFJlbGF0aW9uc1ttZXRhZGF0YS5wcm9wZXJ0eU5hbWVdID0gZGF0YVJlbGF0aW9uc2hpcDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhyb3cge21lc3NhZ2U6IGBwYXJzZUJlbG9uZ3NUbyAtIE1vZGVsIHR5cGUgZm9yIHJlbGF0aW9uc2hpcCAke3R5cGVOYW1lfSBub3QgZm91bmQuYH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRIYXNNYW55UmVsYXRpb25zaGlwPFQgZXh0ZW5kcyBKc29uQXBpTW9kZWw+KFxuICAgIG1vZGVsVHlwZTogTW9kZWxUeXBlPFQ+LFxuICAgIGRhdGE6IGFueSxcbiAgICBpbmNsdWRlZDogYW55LFxuICAgIHR5cGVOYW1lOiBzdHJpbmcsXG4gICAgcmVtYWluaW5nTW9kZWxzOiBBcnJheTxhbnk+XG4gICk6IEFycmF5PFQ+IHtcbiAgICBjb25zdCByZWxhdGlvbnNoaXBMaXN0OiBBcnJheTxUPiA9IFtdO1xuXG4gICAgZGF0YS5mb3JFYWNoKChpdGVtOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcERhdGE6IGFueSA9IGZpbmQoaW5jbHVkZWQsIHtpZDogaXRlbS5pZCwgdHlwZTogdHlwZU5hbWV9IGFzIGFueSk7XG5cbiAgICAgIGlmIChyZWxhdGlvbnNoaXBEYXRhKSB7XG4gICAgICAgIGNvbnN0IG5ld09iamVjdDogVCA9IHRoaXMuY3JlYXRlT3JQZWVrKG1vZGVsVHlwZSwgcmVsYXRpb25zaGlwRGF0YSk7XG5cbiAgICAgICAgY29uc3QgaW5kZXhPZk5ld2x5Rm91bmRNb2RlbCA9IHJlbWFpbmluZ01vZGVscy5pbmRleE9mKHJlbGF0aW9uc2hpcERhdGEpO1xuICAgICAgICBjb25zdCBtb2RlbHNGb3JQcm9jZXNzaW5nID0gcmVtYWluaW5nTW9kZWxzLmNvbmNhdChbXSk7XG5cbiAgICAgICAgaWYgKGluZGV4T2ZOZXdseUZvdW5kTW9kZWwgIT09IC0xKSB7XG4gICAgICAgICAgbW9kZWxzRm9yUHJvY2Vzc2luZy5zcGxpY2UoaW5kZXhPZk5ld2x5Rm91bmRNb2RlbCwgMSk7XG4gICAgICAgICAgbmV3T2JqZWN0LnN5bmNSZWxhdGlvbnNoaXBzKHJlbGF0aW9uc2hpcERhdGEsIGluY2x1ZGVkLCBtb2RlbHNGb3JQcm9jZXNzaW5nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbGF0aW9uc2hpcExpc3QucHVzaChuZXdPYmplY3QpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlbGF0aW9uc2hpcExpc3Q7XG4gIH1cblxuICBwcml2YXRlIGdldEJlbG9uZ3NUb1JlbGF0aW9uc2hpcDxUIGV4dGVuZHMgSnNvbkFwaU1vZGVsPihcbiAgICBtb2RlbFR5cGU6IE1vZGVsVHlwZTxUPixcbiAgICBkYXRhOiBhbnksXG4gICAgaW5jbHVkZWQ6IEFycmF5PGFueT4sXG4gICAgdHlwZU5hbWU6IHN0cmluZyxcbiAgICByZW1haW5pbmdNb2RlbHM6IEFycmF5PGFueT5cbiAgKTogVCB8IG51bGwge1xuICAgIGNvbnN0IGlkOiBzdHJpbmcgPSBkYXRhLmlkO1xuXG4gICAgY29uc3QgcmVsYXRpb25zaGlwRGF0YTogYW55ID0gZmluZChpbmNsdWRlZCwge2lkLCB0eXBlOiB0eXBlTmFtZX0gYXMgYW55KTtcblxuICAgIGlmIChyZWxhdGlvbnNoaXBEYXRhKSB7XG4gICAgICBjb25zdCBuZXdPYmplY3Q6IFQgPSB0aGlzLmNyZWF0ZU9yUGVlayhtb2RlbFR5cGUsIHJlbGF0aW9uc2hpcERhdGEpO1xuXG4gICAgICBjb25zdCBpbmRleE9mTmV3bHlGb3VuZE1vZGVsID0gcmVtYWluaW5nTW9kZWxzLmluZGV4T2YocmVsYXRpb25zaGlwRGF0YSk7XG4gICAgICBjb25zdCBtb2RlbHNGb3JQcm9jZXNzaW5nID0gcmVtYWluaW5nTW9kZWxzLmNvbmNhdChbXSk7XG5cbiAgICAgIGlmIChpbmRleE9mTmV3bHlGb3VuZE1vZGVsICE9PSAtMSkge1xuICAgICAgICBtb2RlbHNGb3JQcm9jZXNzaW5nLnNwbGljZShpbmRleE9mTmV3bHlGb3VuZE1vZGVsLCAxKTtcbiAgICAgICAgbmV3T2JqZWN0LnN5bmNSZWxhdGlvbnNoaXBzKHJlbGF0aW9uc2hpcERhdGEsIGluY2x1ZGVkLCBtb2RlbHNGb3JQcm9jZXNzaW5nKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ld09iamVjdDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5pbnRlcm5hbERhdGFzdG9yZS5wZWVrUmVjb3JkKG1vZGVsVHlwZSwgaWQpO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVPclBlZWs8VCBleHRlbmRzIEpzb25BcGlNb2RlbD4obW9kZWxUeXBlOiBNb2RlbFR5cGU8VD4sIGRhdGE6IGFueSk6IFQge1xuICAgIGNvbnN0IHBlZWsgPSB0aGlzLmludGVybmFsRGF0YXN0b3JlLnBlZWtSZWNvcmQobW9kZWxUeXBlLCBkYXRhLmlkKTtcblxuICAgIGlmIChwZWVrKSB7XG4gICAgICBfLmV4dGVuZChwZWVrLCB0aGlzLmludGVybmFsRGF0YXN0b3JlLnRyYW5zZm9ybVNlcmlhbGl6ZWROYW1lc1RvUHJvcGVydHlOYW1lcyhtb2RlbFR5cGUsIGRhdGEuYXR0cmlidXRlcykpO1xuICAgICAgcmV0dXJuIHBlZWs7XG4gICAgfVxuXG4gICAgY29uc3QgbmV3T2JqZWN0OiBUID0gdGhpcy5pbnRlcm5hbERhdGFzdG9yZS5kZXNlcmlhbGl6ZU1vZGVsKG1vZGVsVHlwZSwgZGF0YSk7XG4gICAgdGhpcy5pbnRlcm5hbERhdGFzdG9yZS5hZGRUb1N0b3JlKG5ld09iamVjdCk7XG5cbiAgICByZXR1cm4gbmV3T2JqZWN0O1xuICB9XG59XG4iXX0=