/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
const AttributeMetadataIndex = (/** @type {?} */ (AttributeMetadata));
/** @type {?} */
const parseRelationshipLinks = (/**
 * @param {?} relationships
 * @return {?}
 */
relationships => {
    /** @type {?} */
    const result = {};
    /** @type {?} */
    const linksMapper = (/**
     * @param {?} __0
     * @param {?} key
     * @return {?}
     */
    ({ links }, key) => {
        if (links) {
            result[key] = { links };
        }
    });
    _.forEach(relationships || {}, linksMapper);
    return result;
});
const ɵ0 = parseRelationshipLinks;
export class JsonApiModel {
    /**
     * @param {?} internalDatastore
     * @param {?=} data
     */
    constructor(internalDatastore, data) {
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
    isModelInitialization() {
        return this.modelInitialization;
    }
    /**
     * @param {?} data
     * @param {?} included
     * @param {?=} remainingModels
     * @return {?}
     */
    syncRelationships(data, included, remainingModels) {
        if (this.lastSyncModels === included) {
            return;
        }
        if (data) {
            /** @type {?} */
            let modelsForProcessing = remainingModels;
            if (modelsForProcessing === undefined) {
                modelsForProcessing = [].concat(included);
            }
            this.parseHasMany(data, included, modelsForProcessing);
            this.parseBelongsTo(data, included, modelsForProcessing);
        }
        this.lastSyncModels = included;
    }
    /**
     * @param {?=} params
     * @param {?=} headers
     * @param {?=} customUrl
     * @return {?}
     */
    save(params, headers, customUrl) {
        this.checkChanges();
        /** @type {?} */
        const attributesMetadata = this[AttributeMetadataIndex];
        return this.internalDatastore.saveRecord(attributesMetadata, this, params, headers, customUrl);
    }
    /**
     * @return {?}
     */
    get hasDirtyAttributes() {
        this.checkChanges();
        /** @type {?} */
        const attributesMetadata = this[AttributeMetadataIndex];
        /** @type {?} */
        let hasDirtyAttributes = false;
        for (const propertyName in attributesMetadata) {
            if (attributesMetadata.hasOwnProperty(propertyName)) {
                /** @type {?} */
                const metadata = attributesMetadata[propertyName];
                if (metadata.hasDirtyAttributes) {
                    hasDirtyAttributes = true;
                    break;
                }
            }
        }
        return hasDirtyAttributes;
    }
    /**
     * @private
     * @return {?}
     */
    checkChanges() {
        /** @type {?} */
        const attributesMetadata = this[AttributeMetadata];
        for (const propertyName in attributesMetadata) {
            if (attributesMetadata.hasOwnProperty(propertyName)) {
                /** @type {?} */
                const metadata = attributesMetadata[propertyName];
                if (metadata.nested) {
                    this[AttributeMetadata][propertyName].hasDirtyAttributes = !_.isEqual(attributesMetadata[propertyName].oldValue, attributesMetadata[propertyName].newValue);
                    this[AttributeMetadata][propertyName].serialisationValue = attributesMetadata[propertyName].converter(Reflect.getMetadata('design:type', this, propertyName), _.cloneDeep(attributesMetadata[propertyName].newValue), true);
                }
            }
        }
    }
    /**
     * @return {?}
     */
    rollbackAttributes() {
        /** @type {?} */
        const attributesMetadata = this[AttributeMetadataIndex];
        for (const propertyName in attributesMetadata) {
            if (attributesMetadata.hasOwnProperty(propertyName)) {
                if (attributesMetadata[propertyName].hasDirtyAttributes) {
                    this[propertyName] = _.cloneDeep(attributesMetadata[propertyName].oldValue);
                }
            }
        }
    }
    /**
     * @return {?}
     */
    get modelConfig() {
        return Reflect.getMetadata('JsonApiModelConfig', this.constructor);
    }
    /**
     * @private
     * @param {?} data
     * @param {?} included
     * @param {?} remainingModels
     * @return {?}
     */
    parseHasMany(data, included, remainingModels) {
        /** @type {?} */
        const hasMany = Reflect.getMetadata('HasMany', this);
        if (hasMany) {
            for (const metadata of hasMany) {
                /** @type {?} */
                const relationship = data.relationships ? data.relationships[metadata.relationship] : null;
                if (relationship && relationship.data && Array.isArray(relationship.data)) {
                    /** @type {?} */
                    let allModels = [];
                    /** @type {?} */
                    const modelTypesFetched = [];
                    for (const typeIndex of Object.keys(relationship.data)) {
                        /** @type {?} */
                        const typeName = relationship.data[typeIndex].type;
                        if (!includes(modelTypesFetched, typeName)) {
                            modelTypesFetched.push(typeName);
                            // tslint:disable-next-line:max-line-length
                            /** @type {?} */
                            const modelType = Reflect.getMetadata('JsonApiDatastoreConfig', this.internalDatastore.constructor).models[typeName];
                            if (modelType) {
                                /** @type {?} */
                                const relationshipModels = this.getHasManyRelationship(modelType, relationship.data, included, typeName, remainingModels);
                                if (relationshipModels.length > 0) {
                                    allModels = allModels.concat(relationshipModels);
                                }
                            }
                            else {
                                throw { message: `parseHasMany - Model type for relationship ${typeName} not found.` };
                            }
                        }
                    }
                    this[metadata.propertyName] = allModels;
                }
            }
        }
    }
    /**
     * @private
     * @param {?} data
     * @param {?} included
     * @param {?} remainingModels
     * @return {?}
     */
    parseBelongsTo(data, included, remainingModels) {
        /** @type {?} */
        const belongsTo = Reflect.getMetadata('BelongsTo', this);
        if (belongsTo) {
            for (const metadata of belongsTo) {
                /** @type {?} */
                const relationship = data.relationships ? data.relationships[metadata.relationship] : null;
                if (relationship && relationship.data) {
                    /** @type {?} */
                    const dataRelationship = (relationship.data instanceof Array) ? relationship.data[0] : relationship.data;
                    if (dataRelationship) {
                        /** @type {?} */
                        const typeName = dataRelationship.type;
                        // tslint:disable-next-line:max-line-length
                        /** @type {?} */
                        const modelType = Reflect.getMetadata('JsonApiDatastoreConfig', this.internalDatastore.constructor).models[typeName];
                        if (modelType) {
                            /** @type {?} */
                            const relationshipModel = this.getBelongsToRelationship(modelType, dataRelationship, included, typeName, remainingModels);
                            if (relationshipModel) {
                                this[metadata.propertyName] = relationshipModel;
                            }
                            else {
                                this.unresolvedRelations[metadata.propertyName] = dataRelationship;
                            }
                        }
                        else {
                            throw { message: `parseBelongsTo - Model type for relationship ${typeName} not found.` };
                        }
                    }
                }
            }
        }
    }
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
    getHasManyRelationship(modelType, data, included, typeName, remainingModels) {
        /** @type {?} */
        const relationshipList = [];
        data.forEach((/**
         * @param {?} item
         * @return {?}
         */
        (item) => {
            /** @type {?} */
            const relationshipData = find(included, (/** @type {?} */ ({ id: item.id, type: typeName })));
            if (relationshipData) {
                /** @type {?} */
                const newObject = this.createOrPeek(modelType, relationshipData);
                /** @type {?} */
                const indexOfNewlyFoundModel = remainingModels.indexOf(relationshipData);
                /** @type {?} */
                const modelsForProcessing = remainingModels.concat([]);
                if (indexOfNewlyFoundModel !== -1) {
                    modelsForProcessing.splice(indexOfNewlyFoundModel, 1);
                    newObject.syncRelationships(relationshipData, included, modelsForProcessing);
                }
                relationshipList.push(newObject);
            }
        }));
        return relationshipList;
    }
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
    getBelongsToRelationship(modelType, data, included, typeName, remainingModels) {
        /** @type {?} */
        const id = data.id;
        /** @type {?} */
        const relationshipData = find(included, (/** @type {?} */ ({ id, type: typeName })));
        if (relationshipData) {
            /** @type {?} */
            const newObject = this.createOrPeek(modelType, relationshipData);
            /** @type {?} */
            const indexOfNewlyFoundModel = remainingModels.indexOf(relationshipData);
            /** @type {?} */
            const modelsForProcessing = remainingModels.concat([]);
            if (indexOfNewlyFoundModel !== -1) {
                modelsForProcessing.splice(indexOfNewlyFoundModel, 1);
                newObject.syncRelationships(relationshipData, included, modelsForProcessing);
            }
            return newObject;
        }
        return this.internalDatastore.peekRecord(modelType, id);
    }
    /**
     * @private
     * @template T
     * @param {?} modelType
     * @param {?} data
     * @return {?}
     */
    createOrPeek(modelType, data) {
        /** @type {?} */
        const peek = this.internalDatastore.peekRecord(modelType, data.id);
        if (peek) {
            _.extend(peek, this.internalDatastore.transformSerializedNamesToPropertyNames(modelType, data.attributes));
            return peek;
        }
        /** @type {?} */
        const newObject = this.internalDatastore.deserializeModel(modelType, data);
        this.internalDatastore.addToStore(newObject);
        return newObject;
    }
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi1hcGkubW9kZWwuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyMi1qc29uYXBpLyIsInNvdXJjZXMiOlsibW9kZWxzL2pzb24tYXBpLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLElBQUksTUFBTSxnQkFBZ0IsQ0FBQztBQUNsQyxPQUFPLFFBQVEsTUFBTSxvQkFBb0IsQ0FBQztBQUkxQyxPQUFPLEtBQUssQ0FBQyxNQUFNLFFBQVEsQ0FBQztBQUM1QixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQzs7Ozs7Ozs7O01BVW5ELHNCQUFzQixHQUFXLG1CQUFBLGlCQUFpQixFQUFPOztNQUV6RCxzQkFBc0I7Ozs7QUFBRyxhQUFhLENBQUMsRUFBRTs7VUFDdkMsTUFBTSxHQUFHLEVBQUU7O1VBQ1gsV0FBVzs7Ozs7SUFBRyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUU7UUFDckMsSUFBSSxLQUFLLEVBQUU7WUFDVCxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQztTQUN6QjtJQUNILENBQUMsQ0FBQTtJQUVELENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxJQUFJLEVBQUUsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUU1QyxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDLENBQUE7O0FBRUQsTUFBTSxPQUFPLFlBQVk7Ozs7O0lBVXZCLFlBQW9CLGlCQUFtQyxFQUFFLElBQVU7UUFBL0Msc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQVJoRCx3QkFBbUIsR0FBRyxLQUFLLENBQUM7UUFDNUIsc0JBQWlCLEdBQUcsRUFBRSxDQUFDO1FBQ3ZCLHdCQUFtQixHQUFHLEVBQUUsQ0FBQztRQU85QixJQUFJLElBQUksRUFBRTtZQUNSLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7WUFDaEMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJ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QzlCLDJDQUFnQzs7SUFJaEMsc0NBQTJCOzs7OztJQUVmLHlDQUEyQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmaW5kIGZyb20gJ2xvZGFzaC1lcy9maW5kJztcbmltcG9ydCBpbmNsdWRlcyBmcm9tICdsb2Rhc2gtZXMvaW5jbHVkZXMnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgSnNvbkFwaURhdGFzdG9yZSwgTW9kZWxUeXBlIH0gZnJvbSAnLi4vc2VydmljZXMvanNvbi1hcGktZGF0YXN0b3JlLnNlcnZpY2UnO1xuaW1wb3J0IHsgTW9kZWxDb25maWcgfSBmcm9tICcuLi9pbnRlcmZhY2VzL21vZGVsLWNvbmZpZy5pbnRlcmZhY2UnO1xuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgQXR0cmlidXRlTWV0YWRhdGEgfSBmcm9tICcuLi9jb25zdGFudHMvc3ltYm9scyc7XG5pbXBvcnQgeyBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcblxuLyoqXG4gKiBIQUNLL0ZJWE1FOlxuICogVHlwZSAnc3ltYm9sJyBjYW5ub3QgYmUgdXNlZCBhcyBhbiBpbmRleCB0eXBlLlxuICogVHlwZVNjcmlwdCAyLjkueFxuICogU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMjQ1ODcuXG4gKi9cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lXG5jb25zdCBBdHRyaWJ1dGVNZXRhZGF0YUluZGV4OiBzdHJpbmcgPSBBdHRyaWJ1dGVNZXRhZGF0YSBhcyBhbnk7XG5cbmNvbnN0IHBhcnNlUmVsYXRpb25zaGlwTGlua3MgPSByZWxhdGlvbnNoaXBzID0+IHtcbiAgY29uc3QgcmVzdWx0ID0ge307XG4gIGNvbnN0IGxpbmtzTWFwcGVyID0gKHsgbGlua3MgfSwga2V5KSA9PiB7XG4gICAgaWYgKGxpbmtzKSB7XG4gICAgICByZXN1bHRba2V5XSA9IHsgbGlua3MgfTtcbiAgICB9XG4gIH07XG5cbiAgXy5mb3JFYWNoKHJlbGF0aW9uc2hpcHMgfHwge30sIGxpbmtzTWFwcGVyKTtcblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuZXhwb3J0IGNsYXNzIEpzb25BcGlNb2RlbCB7XG4gIGlkOiBzdHJpbmc7XG4gIHB1YmxpYyBtb2RlbEluaXRpYWxpemF0aW9uID0gZmFsc2U7XG4gIHB1YmxpYyByZWxhdGlvbnNoaXBMaW5rcyA9IHt9O1xuICBwdWJsaWMgdW5yZXNvbHZlZFJlbGF0aW9ucyA9IHt9O1xuXG4gIFtrZXk6IHN0cmluZ106IGFueTtcblxuICBsYXN0U3luY01vZGVsczogQXJyYXk8YW55PjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGludGVybmFsRGF0YXN0b3JlOiBKc29uQXBpRGF0YXN0b3JlLCBkYXRhPzogYW55KSB7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIHRoaXMubW9kZWxJbml0aWFsaXphdGlvbiA9IHRydWU7XG4gICAgICB0aGlzLmlkID0gZGF0YS5pZDtcbiAgICAgIHRoaXMucmVsYXRpb25zaGlwTGlua3MgPSBwYXJzZVJlbGF0aW9uc2hpcExpbmtzKGRhdGEucmVsYXRpb25zaGlwcyk7XG4gICAgICBPYmplY3QuYXNzaWduKHRoaXMsIGRhdGEuYXR0cmlidXRlcyk7XG4gICAgICB0aGlzLm1vZGVsSW5pdGlhbGl6YXRpb24gPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgaXNNb2RlbEluaXRpYWxpemF0aW9uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm1vZGVsSW5pdGlhbGl6YXRpb247XG4gIH1cblxuICBwdWJsaWMgc3luY1JlbGF0aW9uc2hpcHMoZGF0YTogYW55LCBpbmNsdWRlZDogYW55LCByZW1haW5pbmdNb2RlbHM/OiBBcnJheTxhbnk+KTogdm9pZCB7XG4gICAgaWYgKHRoaXMubGFzdFN5bmNNb2RlbHMgPT09IGluY2x1ZGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIGxldCBtb2RlbHNGb3JQcm9jZXNzaW5nID0gcmVtYWluaW5nTW9kZWxzO1xuXG4gICAgICBpZiAobW9kZWxzRm9yUHJvY2Vzc2luZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG1vZGVsc0ZvclByb2Nlc3NpbmcgPSBbXS5jb25jYXQoaW5jbHVkZWQpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnBhcnNlSGFzTWFueShkYXRhLCBpbmNsdWRlZCwgbW9kZWxzRm9yUHJvY2Vzc2luZyk7XG4gICAgICB0aGlzLnBhcnNlQmVsb25nc1RvKGRhdGEsIGluY2x1ZGVkLCBtb2RlbHNGb3JQcm9jZXNzaW5nKTtcbiAgICB9XG5cbiAgICB0aGlzLmxhc3RTeW5jTW9kZWxzID0gaW5jbHVkZWQ7XG4gIH1cblxuICBwdWJsaWMgc2F2ZShwYXJhbXM/OiBhbnksIGhlYWRlcnM/OiBIdHRwSGVhZGVycywgY3VzdG9tVXJsPzogc3RyaW5nKTogT2JzZXJ2YWJsZTx0aGlzPiB7XG4gICAgdGhpcy5jaGVja0NoYW5nZXMoKTtcbiAgICBjb25zdCBhdHRyaWJ1dGVzTWV0YWRhdGE6IGFueSA9IHRoaXNbQXR0cmlidXRlTWV0YWRhdGFJbmRleF07XG4gICAgcmV0dXJuIHRoaXMuaW50ZXJuYWxEYXRhc3RvcmUuc2F2ZVJlY29yZChhdHRyaWJ1dGVzTWV0YWRhdGEsIHRoaXMsIHBhcmFtcywgaGVhZGVycywgY3VzdG9tVXJsKTtcbiAgfVxuXG4gIGdldCBoYXNEaXJ0eUF0dHJpYnV0ZXMoKSB7XG4gICAgdGhpcy5jaGVja0NoYW5nZXMoKTtcbiAgICBjb25zdCBhdHRyaWJ1dGVzTWV0YWRhdGE6IGFueSA9IHRoaXNbQXR0cmlidXRlTWV0YWRhdGFJbmRleF07XG4gICAgbGV0IGhhc0RpcnR5QXR0cmlidXRlcyA9IGZhbHNlO1xuICAgIGZvciAoY29uc3QgcHJvcGVydHlOYW1lIGluIGF0dHJpYnV0ZXNNZXRhZGF0YSkge1xuICAgICAgaWYgKGF0dHJpYnV0ZXNNZXRhZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgIGNvbnN0IG1ldGFkYXRhOiBhbnkgPSBhdHRyaWJ1dGVzTWV0YWRhdGFbcHJvcGVydHlOYW1lXTtcbiAgICAgICAgaWYgKG1ldGFkYXRhLmhhc0RpcnR5QXR0cmlidXRlcykge1xuICAgICAgICAgIGhhc0RpcnR5QXR0cmlidXRlcyA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGhhc0RpcnR5QXR0cmlidXRlcztcbiAgfVxuXG4gIHByaXZhdGUgY2hlY2tDaGFuZ2VzKCkge1xuICAgIGNvbnN0IGF0dHJpYnV0ZXNNZXRhZGF0YTogYW55ID0gdGhpc1tBdHRyaWJ1dGVNZXRhZGF0YV07XG4gICAgZm9yIChjb25zdCBwcm9wZXJ0eU5hbWUgaW4gYXR0cmlidXRlc01ldGFkYXRhKSB7XG4gICAgICBpZiAoYXR0cmlidXRlc01ldGFkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgY29uc3QgbWV0YWRhdGE6IGFueSA9IGF0dHJpYnV0ZXNNZXRhZGF0YVtwcm9wZXJ0eU5hbWVdO1xuICAgICAgICBpZiAobWV0YWRhdGEubmVzdGVkKSB7XG4gICAgICAgICAgdGhpc1tBdHRyaWJ1dGVNZXRhZGF0YV1bcHJvcGVydHlOYW1lXS5oYXNEaXJ0eUF0dHJpYnV0ZXMgPSAhXy5pc0VxdWFsKFxuICAgICAgICAgICAgYXR0cmlidXRlc01ldGFkYXRhW3Byb3BlcnR5TmFtZV0ub2xkVmFsdWUsXG4gICAgICAgICAgICBhdHRyaWJ1dGVzTWV0YWRhdGFbcHJvcGVydHlOYW1lXS5uZXdWYWx1ZVxuICAgICAgICAgICk7XG4gICAgICAgICAgdGhpc1tBdHRyaWJ1dGVNZXRhZGF0YV1bcHJvcGVydHlOYW1lXS5zZXJpYWxpc2F0aW9uVmFsdWUgPSBhdHRyaWJ1dGVzTWV0YWRhdGFbcHJvcGVydHlOYW1lXS5jb252ZXJ0ZXIoXG4gICAgICAgICAgICBSZWZsZWN0LmdldE1ldGFkYXRhKCdkZXNpZ246dHlwZScsIHRoaXMsIHByb3BlcnR5TmFtZSksXG4gICAgICAgICAgICBfLmNsb25lRGVlcChhdHRyaWJ1dGVzTWV0YWRhdGFbcHJvcGVydHlOYW1lXS5uZXdWYWx1ZSksXG4gICAgICAgICAgICB0cnVlXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyByb2xsYmFja0F0dHJpYnV0ZXMoKTogdm9pZCB7XG4gICAgY29uc3QgYXR0cmlidXRlc01ldGFkYXRhOiBhbnkgPSB0aGlzW0F0dHJpYnV0ZU1ldGFkYXRhSW5kZXhdO1xuICAgIGZvciAoY29uc3QgcHJvcGVydHlOYW1lIGluIGF0dHJpYnV0ZXNNZXRhZGF0YSkge1xuICAgICAgaWYgKGF0dHJpYnV0ZXNNZXRhZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgIGlmIChhdHRyaWJ1dGVzTWV0YWRhdGFbcHJvcGVydHlOYW1lXS5oYXNEaXJ0eUF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICB0aGlzW3Byb3BlcnR5TmFtZV0gPSBfLmNsb25lRGVlcChhdHRyaWJ1dGVzTWV0YWRhdGFbcHJvcGVydHlOYW1lXS5vbGRWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXQgbW9kZWxDb25maWcoKTogTW9kZWxDb25maWcge1xuICAgIHJldHVybiBSZWZsZWN0LmdldE1ldGFkYXRhKCdKc29uQXBpTW9kZWxDb25maWcnLCB0aGlzLmNvbnN0cnVjdG9yKTtcbiAgfVxuXG4gIHByaXZhdGUgcGFyc2VIYXNNYW55KGRhdGE6IGFueSwgaW5jbHVkZWQ6IGFueSwgcmVtYWluaW5nTW9kZWxzOiBBcnJheTxhbnk+KTogdm9pZCB7XG4gICAgY29uc3QgaGFzTWFueTogYW55ID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnSGFzTWFueScsIHRoaXMpO1xuXG4gICAgaWYgKGhhc01hbnkpIHtcbiAgICAgIGZvciAoY29uc3QgbWV0YWRhdGEgb2YgaGFzTWFueSkge1xuICAgICAgICBjb25zdCByZWxhdGlvbnNoaXA6IGFueSA9IGRhdGEucmVsYXRpb25zaGlwcyA/IGRhdGEucmVsYXRpb25zaGlwc1ttZXRhZGF0YS5yZWxhdGlvbnNoaXBdIDogbnVsbDtcblxuICAgICAgICBpZiAocmVsYXRpb25zaGlwICYmIHJlbGF0aW9uc2hpcC5kYXRhICYmIEFycmF5LmlzQXJyYXkocmVsYXRpb25zaGlwLmRhdGEpKSB7XG4gICAgICAgICAgbGV0IGFsbE1vZGVsczogSnNvbkFwaU1vZGVsW10gPSBbXTtcbiAgICAgICAgICBjb25zdCBtb2RlbFR5cGVzRmV0Y2hlZDogYW55ID0gW107XG5cbiAgICAgICAgICBmb3IgKGNvbnN0IHR5cGVJbmRleCBvZiBPYmplY3Qua2V5cyhyZWxhdGlvbnNoaXAuZGF0YSkpIHtcbiAgICAgICAgICAgIGNvbnN0IHR5cGVOYW1lOiBzdHJpbmcgPSByZWxhdGlvbnNoaXAuZGF0YVt0eXBlSW5kZXhdLnR5cGU7XG5cbiAgICAgICAgICAgIGlmICghaW5jbHVkZXMobW9kZWxUeXBlc0ZldGNoZWQsIHR5cGVOYW1lKSkge1xuICAgICAgICAgICAgICBtb2RlbFR5cGVzRmV0Y2hlZC5wdXNoKHR5cGVOYW1lKTtcbiAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxuICAgICAgICAgICAgICBjb25zdCBtb2RlbFR5cGU6IE1vZGVsVHlwZTx0aGlzPiA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ0pzb25BcGlEYXRhc3RvcmVDb25maWcnLCB0aGlzLmludGVybmFsRGF0YXN0b3JlLmNvbnN0cnVjdG9yKS5tb2RlbHNbdHlwZU5hbWVdO1xuXG4gICAgICAgICAgICAgIGlmIChtb2RlbFR5cGUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBNb2RlbHM6IEpzb25BcGlNb2RlbFtdID0gdGhpcy5nZXRIYXNNYW55UmVsYXRpb25zaGlwKFxuICAgICAgICAgICAgICAgICAgbW9kZWxUeXBlLFxuICAgICAgICAgICAgICAgICAgcmVsYXRpb25zaGlwLmRhdGEsXG4gICAgICAgICAgICAgICAgICBpbmNsdWRlZCxcbiAgICAgICAgICAgICAgICAgIHR5cGVOYW1lLFxuICAgICAgICAgICAgICAgICAgcmVtYWluaW5nTW9kZWxzXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIGlmIChyZWxhdGlvbnNoaXBNb2RlbHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgYWxsTW9kZWxzID0gYWxsTW9kZWxzLmNvbmNhdChyZWxhdGlvbnNoaXBNb2RlbHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyB7bWVzc2FnZTogYHBhcnNlSGFzTWFueSAtIE1vZGVsIHR5cGUgZm9yIHJlbGF0aW9uc2hpcCAke3R5cGVOYW1lfSBub3QgZm91bmQuYH07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzW21ldGFkYXRhLnByb3BlcnR5TmFtZV0gPSBhbGxNb2RlbHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHBhcnNlQmVsb25nc1RvKGRhdGE6IGFueSwgaW5jbHVkZWQ6IEFycmF5PGFueT4sIHJlbWFpbmluZ01vZGVsczogQXJyYXk8YW55Pik6IHZvaWQge1xuICAgIGNvbnN0IGJlbG9uZ3NUbzogYW55ID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnQmVsb25nc1RvJywgdGhpcyk7XG5cbiAgICBpZiAoYmVsb25nc1RvKSB7XG4gICAgICBmb3IgKGNvbnN0IG1ldGFkYXRhIG9mIGJlbG9uZ3NUbykge1xuICAgICAgICBjb25zdCByZWxhdGlvbnNoaXA6IGFueSA9IGRhdGEucmVsYXRpb25zaGlwcyA/IGRhdGEucmVsYXRpb25zaGlwc1ttZXRhZGF0YS5yZWxhdGlvbnNoaXBdIDogbnVsbDtcbiAgICAgICAgaWYgKHJlbGF0aW9uc2hpcCAmJiByZWxhdGlvbnNoaXAuZGF0YSkge1xuICAgICAgICAgIGNvbnN0IGRhdGFSZWxhdGlvbnNoaXA6IGFueSA9IChyZWxhdGlvbnNoaXAuZGF0YSBpbnN0YW5jZW9mIEFycmF5KSA/IHJlbGF0aW9uc2hpcC5kYXRhWzBdIDogcmVsYXRpb25zaGlwLmRhdGE7XG4gICAgICAgICAgaWYgKGRhdGFSZWxhdGlvbnNoaXApIHtcbiAgICAgICAgICAgIGNvbnN0IHR5cGVOYW1lOiBzdHJpbmcgPSBkYXRhUmVsYXRpb25zaGlwLnR5cGU7XG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgICAgICAgICBjb25zdCBtb2RlbFR5cGU6IE1vZGVsVHlwZTx0aGlzPiA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ0pzb25BcGlEYXRhc3RvcmVDb25maWcnLCB0aGlzLmludGVybmFsRGF0YXN0b3JlLmNvbnN0cnVjdG9yKS5tb2RlbHNbdHlwZU5hbWVdO1xuXG4gICAgICAgICAgICBpZiAobW9kZWxUeXBlKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcE1vZGVsID0gdGhpcy5nZXRCZWxvbmdzVG9SZWxhdGlvbnNoaXAoXG4gICAgICAgICAgICAgICAgbW9kZWxUeXBlLFxuICAgICAgICAgICAgICAgIGRhdGFSZWxhdGlvbnNoaXAsXG4gICAgICAgICAgICAgICAgaW5jbHVkZWQsXG4gICAgICAgICAgICAgICAgdHlwZU5hbWUsXG4gICAgICAgICAgICAgICAgcmVtYWluaW5nTW9kZWxzXG4gICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgaWYgKHJlbGF0aW9uc2hpcE1vZGVsKSB7XG4gICAgICAgICAgICAgICAgdGhpc1ttZXRhZGF0YS5wcm9wZXJ0eU5hbWVdID0gcmVsYXRpb25zaGlwTW9kZWw7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy51bnJlc29sdmVkUmVsYXRpb25zW21ldGFkYXRhLnByb3BlcnR5TmFtZV0gPSBkYXRhUmVsYXRpb25zaGlwO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aHJvdyB7bWVzc2FnZTogYHBhcnNlQmVsb25nc1RvIC0gTW9kZWwgdHlwZSBmb3IgcmVsYXRpb25zaGlwICR7dHlwZU5hbWV9IG5vdCBmb3VuZC5gfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldEhhc01hbnlSZWxhdGlvbnNoaXA8VCBleHRlbmRzIEpzb25BcGlNb2RlbD4oXG4gICAgbW9kZWxUeXBlOiBNb2RlbFR5cGU8VD4sXG4gICAgZGF0YTogYW55LFxuICAgIGluY2x1ZGVkOiBhbnksXG4gICAgdHlwZU5hbWU6IHN0cmluZyxcbiAgICByZW1haW5pbmdNb2RlbHM6IEFycmF5PGFueT5cbiAgKTogQXJyYXk8VD4ge1xuICAgIGNvbnN0IHJlbGF0aW9uc2hpcExpc3Q6IEFycmF5PFQ+ID0gW107XG5cbiAgICBkYXRhLmZvckVhY2goKGl0ZW06IGFueSkgPT4ge1xuICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGF0YTogYW55ID0gZmluZChpbmNsdWRlZCwge2lkOiBpdGVtLmlkLCB0eXBlOiB0eXBlTmFtZX0gYXMgYW55KTtcblxuICAgICAgaWYgKHJlbGF0aW9uc2hpcERhdGEpIHtcbiAgICAgICAgY29uc3QgbmV3T2JqZWN0OiBUID0gdGhpcy5jcmVhdGVPclBlZWsobW9kZWxUeXBlLCByZWxhdGlvbnNoaXBEYXRhKTtcblxuICAgICAgICBjb25zdCBpbmRleE9mTmV3bHlGb3VuZE1vZGVsID0gcmVtYWluaW5nTW9kZWxzLmluZGV4T2YocmVsYXRpb25zaGlwRGF0YSk7XG4gICAgICAgIGNvbnN0IG1vZGVsc0ZvclByb2Nlc3NpbmcgPSByZW1haW5pbmdNb2RlbHMuY29uY2F0KFtdKTtcblxuICAgICAgICBpZiAoaW5kZXhPZk5ld2x5Rm91bmRNb2RlbCAhPT0gLTEpIHtcbiAgICAgICAgICBtb2RlbHNGb3JQcm9jZXNzaW5nLnNwbGljZShpbmRleE9mTmV3bHlGb3VuZE1vZGVsLCAxKTtcbiAgICAgICAgICBuZXdPYmplY3Quc3luY1JlbGF0aW9uc2hpcHMocmVsYXRpb25zaGlwRGF0YSwgaW5jbHVkZWQsIG1vZGVsc0ZvclByb2Nlc3NpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVsYXRpb25zaGlwTGlzdC5wdXNoKG5ld09iamVjdCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVsYXRpb25zaGlwTGlzdDtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0QmVsb25nc1RvUmVsYXRpb25zaGlwPFQgZXh0ZW5kcyBKc29uQXBpTW9kZWw+KFxuICAgIG1vZGVsVHlwZTogTW9kZWxUeXBlPFQ+LFxuICAgIGRhdGE6IGFueSxcbiAgICBpbmNsdWRlZDogQXJyYXk8YW55PixcbiAgICB0eXBlTmFtZTogc3RyaW5nLFxuICAgIHJlbWFpbmluZ01vZGVsczogQXJyYXk8YW55PlxuICApOiBUIHwgbnVsbCB7XG4gICAgY29uc3QgaWQ6IHN0cmluZyA9IGRhdGEuaWQ7XG5cbiAgICBjb25zdCByZWxhdGlvbnNoaXBEYXRhOiBhbnkgPSBmaW5kKGluY2x1ZGVkLCB7aWQsIHR5cGU6IHR5cGVOYW1lfSBhcyBhbnkpO1xuXG4gICAgaWYgKHJlbGF0aW9uc2hpcERhdGEpIHtcbiAgICAgIGNvbnN0IG5ld09iamVjdDogVCA9IHRoaXMuY3JlYXRlT3JQZWVrKG1vZGVsVHlwZSwgcmVsYXRpb25zaGlwRGF0YSk7XG5cbiAgICAgIGNvbnN0IGluZGV4T2ZOZXdseUZvdW5kTW9kZWwgPSByZW1haW5pbmdNb2RlbHMuaW5kZXhPZihyZWxhdGlvbnNoaXBEYXRhKTtcbiAgICAgIGNvbnN0IG1vZGVsc0ZvclByb2Nlc3NpbmcgPSByZW1haW5pbmdNb2RlbHMuY29uY2F0KFtdKTtcblxuICAgICAgaWYgKGluZGV4T2ZOZXdseUZvdW5kTW9kZWwgIT09IC0xKSB7XG4gICAgICAgIG1vZGVsc0ZvclByb2Nlc3Npbmcuc3BsaWNlKGluZGV4T2ZOZXdseUZvdW5kTW9kZWwsIDEpO1xuICAgICAgICBuZXdPYmplY3Quc3luY1JlbGF0aW9uc2hpcHMocmVsYXRpb25zaGlwRGF0YSwgaW5jbHVkZWQsIG1vZGVsc0ZvclByb2Nlc3NpbmcpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3T2JqZWN0O1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmludGVybmFsRGF0YXN0b3JlLnBlZWtSZWNvcmQobW9kZWxUeXBlLCBpZCk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZU9yUGVlazxUIGV4dGVuZHMgSnNvbkFwaU1vZGVsPihtb2RlbFR5cGU6IE1vZGVsVHlwZTxUPiwgZGF0YTogYW55KTogVCB7XG4gICAgY29uc3QgcGVlayA9IHRoaXMuaW50ZXJuYWxEYXRhc3RvcmUucGVla1JlY29yZChtb2RlbFR5cGUsIGRhdGEuaWQpO1xuXG4gICAgaWYgKHBlZWspIHtcbiAgICAgIF8uZXh0ZW5kKHBlZWssIHRoaXMuaW50ZXJuYWxEYXRhc3RvcmUudHJhbnNmb3JtU2VyaWFsaXplZE5hbWVzVG9Qcm9wZXJ0eU5hbWVzKG1vZGVsVHlwZSwgZGF0YS5hdHRyaWJ1dGVzKSk7XG4gICAgICByZXR1cm4gcGVlaztcbiAgICB9XG5cbiAgICBjb25zdCBuZXdPYmplY3Q6IFQgPSB0aGlzLmludGVybmFsRGF0YXN0b3JlLmRlc2VyaWFsaXplTW9kZWwobW9kZWxUeXBlLCBkYXRhKTtcbiAgICB0aGlzLmludGVybmFsRGF0YXN0b3JlLmFkZFRvU3RvcmUobmV3T2JqZWN0KTtcblxuICAgIHJldHVybiBuZXdPYmplY3Q7XG4gIH1cbn1cbiJdfQ==