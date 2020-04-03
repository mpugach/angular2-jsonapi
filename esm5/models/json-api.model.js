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
                                        console.error("parseHasMany - Model type for relationship " + typeName + " not found.");
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
                                console.error("parseBelongsTo - Model type for relationship " + typeName + " not found.");
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
            else {
                /** @type {?} */
                var type = Reflect.getMetadata('JsonApiDatastoreConfig', _this.internalDatastore.constructor).models[typeName];
                /** @type {?} */
                var newObject = _this.internalDatastore.peekRecord(type, item.id);
                if (newObject) {
                    relationshipList.push(newObject);
                }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi1hcGkubW9kZWwuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyMi1qc29uYXBpLyIsInNvdXJjZXMiOlsibW9kZWxzL2pzb24tYXBpLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxJQUFJLE1BQU0sZ0JBQWdCLENBQUM7QUFDbEMsT0FBTyxRQUFRLE1BQU0sb0JBQW9CLENBQUM7QUFJMUMsT0FBTyxLQUFLLENBQUMsTUFBTSxRQUFRLENBQUM7QUFDNUIsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7Ozs7Ozs7OztJQVVuRCxzQkFBc0IsR0FBVyxtQkFBQSxpQkFBaUIsRUFBTzs7SUFFekQsc0JBQXNCOzs7O0FBQUcsVUFBQSxhQUFhOztRQUNwQyxNQUFNLEdBQUcsRUFBRTs7UUFDWCxXQUFXOzs7OztJQUFHLFVBQUMsRUFBUyxFQUFFLEdBQUc7WUFBWixnQkFBSztRQUMxQixJQUFJLEtBQUssRUFBRTtZQUNULE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssT0FBQSxFQUFFLENBQUM7U0FDekI7SUFDSCxDQUFDLENBQUE7SUFFRCxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsSUFBSSxFQUFFLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFFNUMsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyxDQUFBOztBQUVEO0lBVUUsc0JBQW9CLGlCQUFtQyxFQUFFLElBQVU7UUFBL0Msc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQVJoRCx3QkFBbUIsR0FBRyxLQUFLLENBQUM7UUFDNUIsc0JBQWlCLEdBQUcsRUFBRSxDQUFDO1FBQ3ZCLHdCQUFtQixHQUFRLEVBQUUsQ0FBQztRQU9uQyxJQUFJLElBQUksRUFBRTtZQUNSLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7WUFDaEMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQ2xCLElBQUks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QixDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDMUQsQ0FBQzs7Ozs7Ozs7SUFFTyxtQ0FBWTs7Ozs7OztJQUFwQixVQUE2QyxTQUF1QixFQUFFLElBQVM7O1lBQ3ZFLElBQUksR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDO1FBRWxFLElBQUksSUFBSSxFQUFFO1lBQ1IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLHVDQUF1QyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUMzRyxPQUFPLElBQUksQ0FBQztTQUNiOztZQUVLLFNBQVMsR0FBTSxJQUFJLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQztRQUM3RSxJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRTdDLE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFDSCxtQkFBQztBQUFELENBQUMsQUFoUUQsSUFnUUM7Ozs7SUEvUEMsMEJBQVc7O0lBQ1gsMkNBQW1DOztJQUNuQyx5Q0FBOEI7O0lBQzlCLDJDQUFxQzs7SUFJckMsc0NBQTJCOzs7OztJQUVmLHlDQUEyQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmaW5kIGZyb20gJ2xvZGFzaC1lcy9maW5kJztcbmltcG9ydCBpbmNsdWRlcyBmcm9tICdsb2Rhc2gtZXMvaW5jbHVkZXMnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgSnNvbkFwaURhdGFzdG9yZSwgTW9kZWxUeXBlIH0gZnJvbSAnLi4vc2VydmljZXMvanNvbi1hcGktZGF0YXN0b3JlLnNlcnZpY2UnO1xuaW1wb3J0IHsgTW9kZWxDb25maWcgfSBmcm9tICcuLi9pbnRlcmZhY2VzL21vZGVsLWNvbmZpZy5pbnRlcmZhY2UnO1xuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgQXR0cmlidXRlTWV0YWRhdGEgfSBmcm9tICcuLi9jb25zdGFudHMvc3ltYm9scyc7XG5pbXBvcnQgeyBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcblxuLyoqXG4gKiBIQUNLL0ZJWE1FOlxuICogVHlwZSAnc3ltYm9sJyBjYW5ub3QgYmUgdXNlZCBhcyBhbiBpbmRleCB0eXBlLlxuICogVHlwZVNjcmlwdCAyLjkueFxuICogU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMjQ1ODcuXG4gKi9cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lXG5jb25zdCBBdHRyaWJ1dGVNZXRhZGF0YUluZGV4OiBzdHJpbmcgPSBBdHRyaWJ1dGVNZXRhZGF0YSBhcyBhbnk7XG5cbmNvbnN0IHBhcnNlUmVsYXRpb25zaGlwTGlua3MgPSByZWxhdGlvbnNoaXBzID0+IHtcbiAgY29uc3QgcmVzdWx0ID0ge307XG4gIGNvbnN0IGxpbmtzTWFwcGVyID0gKHsgbGlua3MgfSwga2V5KSA9PiB7XG4gICAgaWYgKGxpbmtzKSB7XG4gICAgICByZXN1bHRba2V5XSA9IHsgbGlua3MgfTtcbiAgICB9XG4gIH07XG5cbiAgXy5mb3JFYWNoKHJlbGF0aW9uc2hpcHMgfHwge30sIGxpbmtzTWFwcGVyKTtcblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuZXhwb3J0IGNsYXNzIEpzb25BcGlNb2RlbCB7XG4gIGlkOiBzdHJpbmc7XG4gIHB1YmxpYyBtb2RlbEluaXRpYWxpemF0aW9uID0gZmFsc2U7XG4gIHB1YmxpYyByZWxhdGlvbnNoaXBMaW5rcyA9IHt9O1xuICBwdWJsaWMgdW5yZXNvbHZlZFJlbGF0aW9uczogYW55ID0ge307XG5cbiAgW2tleTogc3RyaW5nXTogYW55O1xuXG4gIGxhc3RTeW5jTW9kZWxzOiBBcnJheTxhbnk+O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaW50ZXJuYWxEYXRhc3RvcmU6IEpzb25BcGlEYXRhc3RvcmUsIGRhdGE/OiBhbnkpIHtcbiAgICBpZiAoZGF0YSkge1xuICAgICAgdGhpcy5tb2RlbEluaXRpYWxpemF0aW9uID0gdHJ1ZTtcbiAgICAgIHRoaXMuaWQgPSBkYXRhLmlkO1xuICAgICAgdGhpcy5yZWxhdGlvbnNoaXBMaW5rcyA9IHBhcnNlUmVsYXRpb25zaGlwTGlua3MoZGF0YS5yZWxhdGlvbnNoaXBzKTtcbiAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgZGF0YS5hdHRyaWJ1dGVzKTtcbiAgICAgIHRoaXMubW9kZWxJbml0aWFsaXphdGlvbiA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBpc01vZGVsSW5pdGlhbGl6YXRpb24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMubW9kZWxJbml0aWFsaXphdGlvbjtcbiAgfVxuXG4gIHB1YmxpYyBzeW5jUmVsYXRpb25zaGlwcyhkYXRhOiBhbnksIGluY2x1ZGVkOiBhbnksIHJlbWFpbmluZ01vZGVscz86IEFycmF5PGFueT4pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5sYXN0U3luY01vZGVscyA9PT0gaW5jbHVkZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZGF0YSkge1xuICAgICAgbGV0IG1vZGVsc0ZvclByb2Nlc3NpbmcgPSByZW1haW5pbmdNb2RlbHM7XG5cbiAgICAgIGlmIChtb2RlbHNGb3JQcm9jZXNzaW5nID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbW9kZWxzRm9yUHJvY2Vzc2luZyA9IFtdLmNvbmNhdChpbmNsdWRlZCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucGFyc2VIYXNNYW55KGRhdGEsIGluY2x1ZGVkLCBtb2RlbHNGb3JQcm9jZXNzaW5nKTtcbiAgICAgIHRoaXMucGFyc2VCZWxvbmdzVG8oZGF0YSwgaW5jbHVkZWQsIG1vZGVsc0ZvclByb2Nlc3NpbmcpO1xuICAgIH1cblxuICAgIHRoaXMubGFzdFN5bmNNb2RlbHMgPSBpbmNsdWRlZDtcbiAgfVxuXG4gIHB1YmxpYyBzYXZlKHBhcmFtcz86IGFueSwgaGVhZGVycz86IEh0dHBIZWFkZXJzLCBjdXN0b21Vcmw/OiBzdHJpbmcpOiBPYnNlcnZhYmxlPHRoaXM+IHtcbiAgICB0aGlzLmNoZWNrQ2hhbmdlcygpO1xuICAgIGNvbnN0IGF0dHJpYnV0ZXNNZXRhZGF0YTogYW55ID0gdGhpc1tBdHRyaWJ1dGVNZXRhZGF0YUluZGV4XTtcbiAgICByZXR1cm4gdGhpcy5pbnRlcm5hbERhdGFzdG9yZS5zYXZlUmVjb3JkKGF0dHJpYnV0ZXNNZXRhZGF0YSwgdGhpcywgcGFyYW1zLCBoZWFkZXJzLCBjdXN0b21VcmwpO1xuICB9XG5cbiAgZ2V0IGhhc0RpcnR5QXR0cmlidXRlcygpIHtcbiAgICB0aGlzLmNoZWNrQ2hhbmdlcygpO1xuICAgIGNvbnN0IGF0dHJpYnV0ZXNNZXRhZGF0YTogYW55ID0gdGhpc1tBdHRyaWJ1dGVNZXRhZGF0YUluZGV4XTtcbiAgICBsZXQgaGFzRGlydHlBdHRyaWJ1dGVzID0gZmFsc2U7XG4gICAgZm9yIChjb25zdCBwcm9wZXJ0eU5hbWUgaW4gYXR0cmlidXRlc01ldGFkYXRhKSB7XG4gICAgICBpZiAoYXR0cmlidXRlc01ldGFkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgY29uc3QgbWV0YWRhdGE6IGFueSA9IGF0dHJpYnV0ZXNNZXRhZGF0YVtwcm9wZXJ0eU5hbWVdO1xuICAgICAgICBpZiAobWV0YWRhdGEuaGFzRGlydHlBdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgaGFzRGlydHlBdHRyaWJ1dGVzID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaGFzRGlydHlBdHRyaWJ1dGVzO1xuICB9XG5cbiAgcHJpdmF0ZSBjaGVja0NoYW5nZXMoKSB7XG4gICAgY29uc3QgYXR0cmlidXRlc01ldGFkYXRhOiBhbnkgPSB0aGlzW0F0dHJpYnV0ZU1ldGFkYXRhXTtcbiAgICBmb3IgKGNvbnN0IHByb3BlcnR5TmFtZSBpbiBhdHRyaWJ1dGVzTWV0YWRhdGEpIHtcbiAgICAgIGlmIChhdHRyaWJ1dGVzTWV0YWRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSkge1xuICAgICAgICBjb25zdCBtZXRhZGF0YTogYW55ID0gYXR0cmlidXRlc01ldGFkYXRhW3Byb3BlcnR5TmFtZV07XG4gICAgICAgIGlmIChtZXRhZGF0YS5uZXN0ZWQpIHtcbiAgICAgICAgICB0aGlzW0F0dHJpYnV0ZU1ldGFkYXRhXVtwcm9wZXJ0eU5hbWVdLmhhc0RpcnR5QXR0cmlidXRlcyA9ICFfLmlzRXF1YWwoXG4gICAgICAgICAgICBhdHRyaWJ1dGVzTWV0YWRhdGFbcHJvcGVydHlOYW1lXS5vbGRWYWx1ZSxcbiAgICAgICAgICAgIGF0dHJpYnV0ZXNNZXRhZGF0YVtwcm9wZXJ0eU5hbWVdLm5ld1ZhbHVlXG4gICAgICAgICAgKTtcbiAgICAgICAgICB0aGlzW0F0dHJpYnV0ZU1ldGFkYXRhXVtwcm9wZXJ0eU5hbWVdLnNlcmlhbGlzYXRpb25WYWx1ZSA9IGF0dHJpYnV0ZXNNZXRhZGF0YVtwcm9wZXJ0eU5hbWVdLmNvbnZlcnRlcihcbiAgICAgICAgICAgIFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ2Rlc2lnbjp0eXBlJywgdGhpcywgcHJvcGVydHlOYW1lKSxcbiAgICAgICAgICAgIF8uY2xvbmVEZWVwKGF0dHJpYnV0ZXNNZXRhZGF0YVtwcm9wZXJ0eU5hbWVdLm5ld1ZhbHVlKSxcbiAgICAgICAgICAgIHRydWVcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHJvbGxiYWNrQXR0cmlidXRlcygpOiB2b2lkIHtcbiAgICBjb25zdCBhdHRyaWJ1dGVzTWV0YWRhdGE6IGFueSA9IHRoaXNbQXR0cmlidXRlTWV0YWRhdGFJbmRleF07XG4gICAgZm9yIChjb25zdCBwcm9wZXJ0eU5hbWUgaW4gYXR0cmlidXRlc01ldGFkYXRhKSB7XG4gICAgICBpZiAoYXR0cmlidXRlc01ldGFkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZXNNZXRhZGF0YVtwcm9wZXJ0eU5hbWVdLmhhc0RpcnR5QXR0cmlidXRlcykge1xuICAgICAgICAgIHRoaXNbcHJvcGVydHlOYW1lXSA9IF8uY2xvbmVEZWVwKGF0dHJpYnV0ZXNNZXRhZGF0YVtwcm9wZXJ0eU5hbWVdLm9sZFZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldCBtb2RlbENvbmZpZygpOiBNb2RlbENvbmZpZyB7XG4gICAgcmV0dXJuIFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ0pzb25BcGlNb2RlbENvbmZpZycsIHRoaXMuY29uc3RydWN0b3IpO1xuICB9XG5cbiAgcHJpdmF0ZSBwYXJzZUhhc01hbnkoZGF0YTogYW55LCBpbmNsdWRlZDogYW55LCByZW1haW5pbmdNb2RlbHM6IEFycmF5PGFueT4pOiB2b2lkIHtcbiAgICBjb25zdCBoYXNNYW55OiBhbnkgPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdIYXNNYW55JywgdGhpcyk7XG5cbiAgICBpZiAoaGFzTWFueSkge1xuICAgICAgZm9yIChjb25zdCBtZXRhZGF0YSBvZiBoYXNNYW55KSB7XG4gICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcDogYW55ID0gZGF0YS5yZWxhdGlvbnNoaXBzID8gZGF0YS5yZWxhdGlvbnNoaXBzW21ldGFkYXRhLnJlbGF0aW9uc2hpcF0gOiBudWxsO1xuXG4gICAgICAgIGlmIChyZWxhdGlvbnNoaXAgJiYgcmVsYXRpb25zaGlwLmRhdGEgJiYgQXJyYXkuaXNBcnJheShyZWxhdGlvbnNoaXAuZGF0YSkpIHtcbiAgICAgICAgICBsZXQgYWxsTW9kZWxzOiBKc29uQXBpTW9kZWxbXSA9IFtdO1xuICAgICAgICAgIGNvbnN0IG1vZGVsVHlwZXNGZXRjaGVkOiBhbnkgPSBbXTtcblxuICAgICAgICAgIGZvciAoY29uc3QgdHlwZUluZGV4IG9mIE9iamVjdC5rZXlzKHJlbGF0aW9uc2hpcC5kYXRhKSkge1xuICAgICAgICAgICAgY29uc3QgdHlwZU5hbWU6IHN0cmluZyA9IHJlbGF0aW9uc2hpcC5kYXRhW3R5cGVJbmRleF0udHlwZTtcblxuICAgICAgICAgICAgaWYgKCFpbmNsdWRlcyhtb2RlbFR5cGVzRmV0Y2hlZCwgdHlwZU5hbWUpKSB7XG4gICAgICAgICAgICAgIG1vZGVsVHlwZXNGZXRjaGVkLnB1c2godHlwZU5hbWUpO1xuICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgICAgICAgICAgIGNvbnN0IG1vZGVsVHlwZTogTW9kZWxUeXBlPHRoaXM+ID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnSnNvbkFwaURhdGFzdG9yZUNvbmZpZycsIHRoaXMuaW50ZXJuYWxEYXRhc3RvcmUuY29uc3RydWN0b3IpLm1vZGVsc1t0eXBlTmFtZV07XG5cbiAgICAgICAgICAgICAgaWYgKG1vZGVsVHlwZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcE1vZGVsczogSnNvbkFwaU1vZGVsW10gPSB0aGlzLmdldEhhc01hbnlSZWxhdGlvbnNoaXAoXG4gICAgICAgICAgICAgICAgICBtb2RlbFR5cGUsXG4gICAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXAuZGF0YSxcbiAgICAgICAgICAgICAgICAgIGluY2x1ZGVkLFxuICAgICAgICAgICAgICAgICAgdHlwZU5hbWUsXG4gICAgICAgICAgICAgICAgICByZW1haW5pbmdNb2RlbHNcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJlbGF0aW9uc2hpcE1vZGVscy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICBhbGxNb2RlbHMgPSBhbGxNb2RlbHMuY29uY2F0KHJlbGF0aW9uc2hpcE1vZGVscyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYHBhcnNlSGFzTWFueSAtIE1vZGVsIHR5cGUgZm9yIHJlbGF0aW9uc2hpcCAke3R5cGVOYW1lfSBub3QgZm91bmQuYCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzW21ldGFkYXRhLnByb3BlcnR5TmFtZV0gPSBhbGxNb2RlbHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHBhcnNlQmVsb25nc1RvKGRhdGE6IGFueSwgaW5jbHVkZWQ6IEFycmF5PGFueT4sIHJlbWFpbmluZ01vZGVsczogQXJyYXk8YW55Pik6IHZvaWQge1xuICAgIGNvbnN0IGJlbG9uZ3NUbzogYW55ID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnQmVsb25nc1RvJywgdGhpcyk7XG5cbiAgICBpZiAoYmVsb25nc1RvKSB7XG4gICAgICBmb3IgKGNvbnN0IG1ldGFkYXRhIG9mIGJlbG9uZ3NUbykge1xuICAgICAgICBjb25zdCByZWxhdGlvbnNoaXA6IGFueSA9IGRhdGEucmVsYXRpb25zaGlwcyA/IGRhdGEucmVsYXRpb25zaGlwc1ttZXRhZGF0YS5yZWxhdGlvbnNoaXBdIDogbnVsbDtcbiAgICAgICAgaWYgKHJlbGF0aW9uc2hpcCAmJiByZWxhdGlvbnNoaXAuZGF0YSkge1xuICAgICAgICAgIGNvbnN0IGRhdGFSZWxhdGlvbnNoaXA6IGFueSA9IChyZWxhdGlvbnNoaXAuZGF0YSBpbnN0YW5jZW9mIEFycmF5KSA/IHJlbGF0aW9uc2hpcC5kYXRhWzBdIDogcmVsYXRpb25zaGlwLmRhdGE7XG4gICAgICAgICAgaWYgKGRhdGFSZWxhdGlvbnNoaXApIHtcbiAgICAgICAgICAgIGNvbnN0IHR5cGVOYW1lOiBzdHJpbmcgPSBkYXRhUmVsYXRpb25zaGlwLnR5cGU7XG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgICAgICAgICBjb25zdCBtb2RlbFR5cGU6IE1vZGVsVHlwZTx0aGlzPiA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ0pzb25BcGlEYXRhc3RvcmVDb25maWcnLCB0aGlzLmludGVybmFsRGF0YXN0b3JlLmNvbnN0cnVjdG9yKS5tb2RlbHNbdHlwZU5hbWVdO1xuXG4gICAgICAgICAgICBpZiAobW9kZWxUeXBlKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcE1vZGVsID0gdGhpcy5nZXRCZWxvbmdzVG9SZWxhdGlvbnNoaXAoXG4gICAgICAgICAgICAgICAgbW9kZWxUeXBlLFxuICAgICAgICAgICAgICAgIGRhdGFSZWxhdGlvbnNoaXAsXG4gICAgICAgICAgICAgICAgaW5jbHVkZWQsXG4gICAgICAgICAgICAgICAgdHlwZU5hbWUsXG4gICAgICAgICAgICAgICAgcmVtYWluaW5nTW9kZWxzXG4gICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgaWYgKHJlbGF0aW9uc2hpcE1vZGVsKSB7XG4gICAgICAgICAgICAgICAgdGhpc1ttZXRhZGF0YS5wcm9wZXJ0eU5hbWVdID0gcmVsYXRpb25zaGlwTW9kZWw7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy51bnJlc29sdmVkUmVsYXRpb25zW21ldGFkYXRhLnByb3BlcnR5TmFtZV0gPSBkYXRhUmVsYXRpb25zaGlwO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBwYXJzZUJlbG9uZ3NUbyAtIE1vZGVsIHR5cGUgZm9yIHJlbGF0aW9uc2hpcCAke3R5cGVOYW1lfSBub3QgZm91bmQuYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRIYXNNYW55UmVsYXRpb25zaGlwPFQgZXh0ZW5kcyBKc29uQXBpTW9kZWw+KFxuICAgIG1vZGVsVHlwZTogTW9kZWxUeXBlPFQ+LFxuICAgIGRhdGE6IGFueSxcbiAgICBpbmNsdWRlZDogYW55LFxuICAgIHR5cGVOYW1lOiBzdHJpbmcsXG4gICAgcmVtYWluaW5nTW9kZWxzOiBBcnJheTxhbnk+XG4gICk6IEFycmF5PFQ+IHtcbiAgICBjb25zdCByZWxhdGlvbnNoaXBMaXN0OiBBcnJheTxUPiA9IFtdO1xuXG4gICAgZGF0YS5mb3JFYWNoKChpdGVtOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcERhdGE6IGFueSA9IGZpbmQoaW5jbHVkZWQsIHtpZDogaXRlbS5pZCwgdHlwZTogdHlwZU5hbWV9IGFzIGFueSk7XG5cbiAgICAgIGlmIChyZWxhdGlvbnNoaXBEYXRhKSB7XG4gICAgICAgIGNvbnN0IG5ld09iamVjdDogVCA9IHRoaXMuY3JlYXRlT3JQZWVrKG1vZGVsVHlwZSwgcmVsYXRpb25zaGlwRGF0YSk7XG5cbiAgICAgICAgY29uc3QgaW5kZXhPZk5ld2x5Rm91bmRNb2RlbCA9IHJlbWFpbmluZ01vZGVscy5pbmRleE9mKHJlbGF0aW9uc2hpcERhdGEpO1xuICAgICAgICBjb25zdCBtb2RlbHNGb3JQcm9jZXNzaW5nID0gcmVtYWluaW5nTW9kZWxzLmNvbmNhdChbXSk7XG5cbiAgICAgICAgaWYgKGluZGV4T2ZOZXdseUZvdW5kTW9kZWwgIT09IC0xKSB7XG4gICAgICAgICAgbW9kZWxzRm9yUHJvY2Vzc2luZy5zcGxpY2UoaW5kZXhPZk5ld2x5Rm91bmRNb2RlbCwgMSk7XG4gICAgICAgICAgbmV3T2JqZWN0LnN5bmNSZWxhdGlvbnNoaXBzKHJlbGF0aW9uc2hpcERhdGEsIGluY2x1ZGVkLCBtb2RlbHNGb3JQcm9jZXNzaW5nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbGF0aW9uc2hpcExpc3QucHVzaChuZXdPYmplY3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgdHlwZSA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ0pzb25BcGlEYXRhc3RvcmVDb25maWcnLCB0aGlzLmludGVybmFsRGF0YXN0b3JlLmNvbnN0cnVjdG9yKS5tb2RlbHNbdHlwZU5hbWVdO1xuICAgICAgICBjb25zdCBuZXdPYmplY3Q6IFQgPSB0aGlzLmludGVybmFsRGF0YXN0b3JlLnBlZWtSZWNvcmQodHlwZSwgaXRlbS5pZCk7XG4gICAgICAgIGlmIChuZXdPYmplY3QpIHtcbiAgICAgICAgICByZWxhdGlvbnNoaXBMaXN0LnB1c2gobmV3T2JqZWN0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlbGF0aW9uc2hpcExpc3Q7XG4gIH1cblxuICBwcml2YXRlIGdldEJlbG9uZ3NUb1JlbGF0aW9uc2hpcDxUIGV4dGVuZHMgSnNvbkFwaU1vZGVsPihcbiAgICBtb2RlbFR5cGU6IE1vZGVsVHlwZTxUPixcbiAgICBkYXRhOiBhbnksXG4gICAgaW5jbHVkZWQ6IEFycmF5PGFueT4sXG4gICAgdHlwZU5hbWU6IHN0cmluZyxcbiAgICByZW1haW5pbmdNb2RlbHM6IEFycmF5PGFueT5cbiAgKTogVCB8IG51bGwge1xuICAgIGNvbnN0IGlkOiBzdHJpbmcgPSBkYXRhLmlkO1xuXG4gICAgY29uc3QgcmVsYXRpb25zaGlwRGF0YTogYW55ID0gZmluZChpbmNsdWRlZCwge2lkLCB0eXBlOiB0eXBlTmFtZX0gYXMgYW55KTtcblxuICAgIGlmIChyZWxhdGlvbnNoaXBEYXRhKSB7XG4gICAgICBjb25zdCBuZXdPYmplY3Q6IFQgPSB0aGlzLmNyZWF0ZU9yUGVlayhtb2RlbFR5cGUsIHJlbGF0aW9uc2hpcERhdGEpO1xuXG4gICAgICBjb25zdCBpbmRleE9mTmV3bHlGb3VuZE1vZGVsID0gcmVtYWluaW5nTW9kZWxzLmluZGV4T2YocmVsYXRpb25zaGlwRGF0YSk7XG4gICAgICBjb25zdCBtb2RlbHNGb3JQcm9jZXNzaW5nID0gcmVtYWluaW5nTW9kZWxzLmNvbmNhdChbXSk7XG5cbiAgICAgIGlmIChpbmRleE9mTmV3bHlGb3VuZE1vZGVsICE9PSAtMSkge1xuICAgICAgICBtb2RlbHNGb3JQcm9jZXNzaW5nLnNwbGljZShpbmRleE9mTmV3bHlGb3VuZE1vZGVsLCAxKTtcbiAgICAgICAgbmV3T2JqZWN0LnN5bmNSZWxhdGlvbnNoaXBzKHJlbGF0aW9uc2hpcERhdGEsIGluY2x1ZGVkLCBtb2RlbHNGb3JQcm9jZXNzaW5nKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ld09iamVjdDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5pbnRlcm5hbERhdGFzdG9yZS5wZWVrUmVjb3JkKG1vZGVsVHlwZSwgaWQpO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVPclBlZWs8VCBleHRlbmRzIEpzb25BcGlNb2RlbD4obW9kZWxUeXBlOiBNb2RlbFR5cGU8VD4sIGRhdGE6IGFueSk6IFQge1xuICAgIGNvbnN0IHBlZWsgPSB0aGlzLmludGVybmFsRGF0YXN0b3JlLnBlZWtSZWNvcmQobW9kZWxUeXBlLCBkYXRhLmlkKTtcblxuICAgIGlmIChwZWVrKSB7XG4gICAgICBfLmV4dGVuZChwZWVrLCB0aGlzLmludGVybmFsRGF0YXN0b3JlLnRyYW5zZm9ybVNlcmlhbGl6ZWROYW1lc1RvUHJvcGVydHlOYW1lcyhtb2RlbFR5cGUsIGRhdGEuYXR0cmlidXRlcykpO1xuICAgICAgcmV0dXJuIHBlZWs7XG4gICAgfVxuXG4gICAgY29uc3QgbmV3T2JqZWN0OiBUID0gdGhpcy5pbnRlcm5hbERhdGFzdG9yZS5kZXNlcmlhbGl6ZU1vZGVsKG1vZGVsVHlwZSwgZGF0YSk7XG4gICAgdGhpcy5pbnRlcm5hbERhdGFzdG9yZS5hZGRUb1N0b3JlKG5ld09iamVjdCk7XG5cbiAgICByZXR1cm4gbmV3T2JqZWN0O1xuICB9XG59XG4iXX0=