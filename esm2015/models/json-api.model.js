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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi1hcGkubW9kZWwuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyMi1qc29uYXBpLyIsInNvdXJjZXMiOlsibW9kZWxzL2pzb24tYXBpLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLElBQUksTUFBTSxnQkFBZ0IsQ0FBQztBQUNsQyxPQUFPLFFBQVEsTUFBTSxvQkFBb0IsQ0FBQztBQUkxQyxPQUFPLEtBQUssQ0FBQyxNQUFNLFFBQVEsQ0FBQztBQUM1QixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQzs7Ozs7Ozs7O01BVW5ELHNCQUFzQixHQUFXLG1CQUFBLGlCQUFpQixFQUFPOztNQUV6RCxzQkFBc0I7Ozs7QUFBRyxhQUFhLENBQUMsRUFBRTs7VUFDdkMsTUFBTSxHQUFHLEVBQUU7O1VBQ1gsV0FBVzs7Ozs7SUFBRyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUU7UUFDckMsSUFBSSxLQUFLLEVBQUU7WUFDVCxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQztTQUN6QjtJQUNILENBQUMsQ0FBQTtJQUVELENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxJQUFJLEVBQUUsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUU1QyxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDLENBQUE7O0FBRUQsTUFBTSxPQUFPLFlBQVk7Ozs7O0lBVXZCLFlBQW9CLGlCQUFtQyxFQUFFLElBQVU7UUFBL0Msc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQVJoRCx3QkFBbUIsR0FBRyxLQUFLLENBQUM7UUFDNUIsc0JBQWlCLEdBQUcsRUFBRSxDQUFDO1FBQ3ZCLHdCQUFtQixHQUFRLEVBQUUsQ0FBQztRQU9uQyxJQUFJLElBQUksRUFBRTtZQUNSLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7WUFDaEMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJ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QzlCLDJDQUFxQzs7SUFJckMsc0NBQTJCOzs7OztJQUVmLHlDQUEyQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmaW5kIGZyb20gJ2xvZGFzaC1lcy9maW5kJztcbmltcG9ydCBpbmNsdWRlcyBmcm9tICdsb2Rhc2gtZXMvaW5jbHVkZXMnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgSnNvbkFwaURhdGFzdG9yZSwgTW9kZWxUeXBlIH0gZnJvbSAnLi4vc2VydmljZXMvanNvbi1hcGktZGF0YXN0b3JlLnNlcnZpY2UnO1xuaW1wb3J0IHsgTW9kZWxDb25maWcgfSBmcm9tICcuLi9pbnRlcmZhY2VzL21vZGVsLWNvbmZpZy5pbnRlcmZhY2UnO1xuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgQXR0cmlidXRlTWV0YWRhdGEgfSBmcm9tICcuLi9jb25zdGFudHMvc3ltYm9scyc7XG5pbXBvcnQgeyBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcblxuLyoqXG4gKiBIQUNLL0ZJWE1FOlxuICogVHlwZSAnc3ltYm9sJyBjYW5ub3QgYmUgdXNlZCBhcyBhbiBpbmRleCB0eXBlLlxuICogVHlwZVNjcmlwdCAyLjkueFxuICogU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMjQ1ODcuXG4gKi9cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lXG5jb25zdCBBdHRyaWJ1dGVNZXRhZGF0YUluZGV4OiBzdHJpbmcgPSBBdHRyaWJ1dGVNZXRhZGF0YSBhcyBhbnk7XG5cbmNvbnN0IHBhcnNlUmVsYXRpb25zaGlwTGlua3MgPSByZWxhdGlvbnNoaXBzID0+IHtcbiAgY29uc3QgcmVzdWx0ID0ge307XG4gIGNvbnN0IGxpbmtzTWFwcGVyID0gKHsgbGlua3MgfSwga2V5KSA9PiB7XG4gICAgaWYgKGxpbmtzKSB7XG4gICAgICByZXN1bHRba2V5XSA9IHsgbGlua3MgfTtcbiAgICB9XG4gIH07XG5cbiAgXy5mb3JFYWNoKHJlbGF0aW9uc2hpcHMgfHwge30sIGxpbmtzTWFwcGVyKTtcblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuZXhwb3J0IGNsYXNzIEpzb25BcGlNb2RlbCB7XG4gIGlkOiBzdHJpbmc7XG4gIHB1YmxpYyBtb2RlbEluaXRpYWxpemF0aW9uID0gZmFsc2U7XG4gIHB1YmxpYyByZWxhdGlvbnNoaXBMaW5rcyA9IHt9O1xuICBwdWJsaWMgdW5yZXNvbHZlZFJlbGF0aW9uczogYW55ID0ge307XG5cbiAgW2tleTogc3RyaW5nXTogYW55O1xuXG4gIGxhc3RTeW5jTW9kZWxzOiBBcnJheTxhbnk+O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaW50ZXJuYWxEYXRhc3RvcmU6IEpzb25BcGlEYXRhc3RvcmUsIGRhdGE/OiBhbnkpIHtcbiAgICBpZiAoZGF0YSkge1xuICAgICAgdGhpcy5tb2RlbEluaXRpYWxpemF0aW9uID0gdHJ1ZTtcbiAgICAgIHRoaXMuaWQgPSBkYXRhLmlkO1xuICAgICAgdGhpcy5yZWxhdGlvbnNoaXBMaW5rcyA9IHBhcnNlUmVsYXRpb25zaGlwTGlua3MoZGF0YS5yZWxhdGlvbnNoaXBzKTtcbiAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgZGF0YS5hdHRyaWJ1dGVzKTtcbiAgICAgIHRoaXMubW9kZWxJbml0aWFsaXphdGlvbiA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBpc01vZGVsSW5pdGlhbGl6YXRpb24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMubW9kZWxJbml0aWFsaXphdGlvbjtcbiAgfVxuXG4gIHB1YmxpYyBzeW5jUmVsYXRpb25zaGlwcyhkYXRhOiBhbnksIGluY2x1ZGVkOiBhbnksIHJlbWFpbmluZ01vZGVscz86IEFycmF5PGFueT4pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5sYXN0U3luY01vZGVscyA9PT0gaW5jbHVkZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZGF0YSkge1xuICAgICAgbGV0IG1vZGVsc0ZvclByb2Nlc3NpbmcgPSByZW1haW5pbmdNb2RlbHM7XG5cbiAgICAgIGlmIChtb2RlbHNGb3JQcm9jZXNzaW5nID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbW9kZWxzRm9yUHJvY2Vzc2luZyA9IFtdLmNvbmNhdChpbmNsdWRlZCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucGFyc2VIYXNNYW55KGRhdGEsIGluY2x1ZGVkLCBtb2RlbHNGb3JQcm9jZXNzaW5nKTtcbiAgICAgIHRoaXMucGFyc2VCZWxvbmdzVG8oZGF0YSwgaW5jbHVkZWQsIG1vZGVsc0ZvclByb2Nlc3NpbmcpO1xuICAgIH1cblxuICAgIHRoaXMubGFzdFN5bmNNb2RlbHMgPSBpbmNsdWRlZDtcbiAgfVxuXG4gIHB1YmxpYyBzYXZlKHBhcmFtcz86IGFueSwgaGVhZGVycz86IEh0dHBIZWFkZXJzLCBjdXN0b21Vcmw/OiBzdHJpbmcpOiBPYnNlcnZhYmxlPHRoaXM+IHtcbiAgICB0aGlzLmNoZWNrQ2hhbmdlcygpO1xuICAgIGNvbnN0IGF0dHJpYnV0ZXNNZXRhZGF0YTogYW55ID0gdGhpc1tBdHRyaWJ1dGVNZXRhZGF0YUluZGV4XTtcbiAgICByZXR1cm4gdGhpcy5pbnRlcm5hbERhdGFzdG9yZS5zYXZlUmVjb3JkKGF0dHJpYnV0ZXNNZXRhZGF0YSwgdGhpcywgcGFyYW1zLCBoZWFkZXJzLCBjdXN0b21VcmwpO1xuICB9XG5cbiAgZ2V0IGhhc0RpcnR5QXR0cmlidXRlcygpIHtcbiAgICB0aGlzLmNoZWNrQ2hhbmdlcygpO1xuICAgIGNvbnN0IGF0dHJpYnV0ZXNNZXRhZGF0YTogYW55ID0gdGhpc1tBdHRyaWJ1dGVNZXRhZGF0YUluZGV4XTtcbiAgICBsZXQgaGFzRGlydHlBdHRyaWJ1dGVzID0gZmFsc2U7XG4gICAgZm9yIChjb25zdCBwcm9wZXJ0eU5hbWUgaW4gYXR0cmlidXRlc01ldGFkYXRhKSB7XG4gICAgICBpZiAoYXR0cmlidXRlc01ldGFkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgY29uc3QgbWV0YWRhdGE6IGFueSA9IGF0dHJpYnV0ZXNNZXRhZGF0YVtwcm9wZXJ0eU5hbWVdO1xuICAgICAgICBpZiAobWV0YWRhdGEuaGFzRGlydHlBdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgaGFzRGlydHlBdHRyaWJ1dGVzID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaGFzRGlydHlBdHRyaWJ1dGVzO1xuICB9XG5cbiAgcHJpdmF0ZSBjaGVja0NoYW5nZXMoKSB7XG4gICAgY29uc3QgYXR0cmlidXRlc01ldGFkYXRhOiBhbnkgPSB0aGlzW0F0dHJpYnV0ZU1ldGFkYXRhXTtcbiAgICBmb3IgKGNvbnN0IHByb3BlcnR5TmFtZSBpbiBhdHRyaWJ1dGVzTWV0YWRhdGEpIHtcbiAgICAgIGlmIChhdHRyaWJ1dGVzTWV0YWRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSkge1xuICAgICAgICBjb25zdCBtZXRhZGF0YTogYW55ID0gYXR0cmlidXRlc01ldGFkYXRhW3Byb3BlcnR5TmFtZV07XG4gICAgICAgIGlmIChtZXRhZGF0YS5uZXN0ZWQpIHtcbiAgICAgICAgICB0aGlzW0F0dHJpYnV0ZU1ldGFkYXRhXVtwcm9wZXJ0eU5hbWVdLmhhc0RpcnR5QXR0cmlidXRlcyA9ICFfLmlzRXF1YWwoXG4gICAgICAgICAgICBhdHRyaWJ1dGVzTWV0YWRhdGFbcHJvcGVydHlOYW1lXS5vbGRWYWx1ZSxcbiAgICAgICAgICAgIGF0dHJpYnV0ZXNNZXRhZGF0YVtwcm9wZXJ0eU5hbWVdLm5ld1ZhbHVlXG4gICAgICAgICAgKTtcbiAgICAgICAgICB0aGlzW0F0dHJpYnV0ZU1ldGFkYXRhXVtwcm9wZXJ0eU5hbWVdLnNlcmlhbGlzYXRpb25WYWx1ZSA9IGF0dHJpYnV0ZXNNZXRhZGF0YVtwcm9wZXJ0eU5hbWVdLmNvbnZlcnRlcihcbiAgICAgICAgICAgIFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ2Rlc2lnbjp0eXBlJywgdGhpcywgcHJvcGVydHlOYW1lKSxcbiAgICAgICAgICAgIF8uY2xvbmVEZWVwKGF0dHJpYnV0ZXNNZXRhZGF0YVtwcm9wZXJ0eU5hbWVdLm5ld1ZhbHVlKSxcbiAgICAgICAgICAgIHRydWVcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHJvbGxiYWNrQXR0cmlidXRlcygpOiB2b2lkIHtcbiAgICBjb25zdCBhdHRyaWJ1dGVzTWV0YWRhdGE6IGFueSA9IHRoaXNbQXR0cmlidXRlTWV0YWRhdGFJbmRleF07XG4gICAgZm9yIChjb25zdCBwcm9wZXJ0eU5hbWUgaW4gYXR0cmlidXRlc01ldGFkYXRhKSB7XG4gICAgICBpZiAoYXR0cmlidXRlc01ldGFkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZXNNZXRhZGF0YVtwcm9wZXJ0eU5hbWVdLmhhc0RpcnR5QXR0cmlidXRlcykge1xuICAgICAgICAgIHRoaXNbcHJvcGVydHlOYW1lXSA9IF8uY2xvbmVEZWVwKGF0dHJpYnV0ZXNNZXRhZGF0YVtwcm9wZXJ0eU5hbWVdLm9sZFZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldCBtb2RlbENvbmZpZygpOiBNb2RlbENvbmZpZyB7XG4gICAgcmV0dXJuIFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ0pzb25BcGlNb2RlbENvbmZpZycsIHRoaXMuY29uc3RydWN0b3IpO1xuICB9XG5cbiAgcHJpdmF0ZSBwYXJzZUhhc01hbnkoZGF0YTogYW55LCBpbmNsdWRlZDogYW55LCByZW1haW5pbmdNb2RlbHM6IEFycmF5PGFueT4pOiB2b2lkIHtcbiAgICBjb25zdCBoYXNNYW55OiBhbnkgPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdIYXNNYW55JywgdGhpcyk7XG5cbiAgICBpZiAoaGFzTWFueSkge1xuICAgICAgZm9yIChjb25zdCBtZXRhZGF0YSBvZiBoYXNNYW55KSB7XG4gICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcDogYW55ID0gZGF0YS5yZWxhdGlvbnNoaXBzID8gZGF0YS5yZWxhdGlvbnNoaXBzW21ldGFkYXRhLnJlbGF0aW9uc2hpcF0gOiBudWxsO1xuXG4gICAgICAgIGlmIChyZWxhdGlvbnNoaXAgJiYgcmVsYXRpb25zaGlwLmRhdGEgJiYgQXJyYXkuaXNBcnJheShyZWxhdGlvbnNoaXAuZGF0YSkpIHtcbiAgICAgICAgICBsZXQgYWxsTW9kZWxzOiBKc29uQXBpTW9kZWxbXSA9IFtdO1xuICAgICAgICAgIGNvbnN0IG1vZGVsVHlwZXNGZXRjaGVkOiBhbnkgPSBbXTtcblxuICAgICAgICAgIGZvciAoY29uc3QgdHlwZUluZGV4IG9mIE9iamVjdC5rZXlzKHJlbGF0aW9uc2hpcC5kYXRhKSkge1xuICAgICAgICAgICAgY29uc3QgdHlwZU5hbWU6IHN0cmluZyA9IHJlbGF0aW9uc2hpcC5kYXRhW3R5cGVJbmRleF0udHlwZTtcblxuICAgICAgICAgICAgaWYgKCFpbmNsdWRlcyhtb2RlbFR5cGVzRmV0Y2hlZCwgdHlwZU5hbWUpKSB7XG4gICAgICAgICAgICAgIG1vZGVsVHlwZXNGZXRjaGVkLnB1c2godHlwZU5hbWUpO1xuICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgICAgICAgICAgIGNvbnN0IG1vZGVsVHlwZTogTW9kZWxUeXBlPHRoaXM+ID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnSnNvbkFwaURhdGFzdG9yZUNvbmZpZycsIHRoaXMuaW50ZXJuYWxEYXRhc3RvcmUuY29uc3RydWN0b3IpLm1vZGVsc1t0eXBlTmFtZV07XG5cbiAgICAgICAgICAgICAgaWYgKG1vZGVsVHlwZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcE1vZGVsczogSnNvbkFwaU1vZGVsW10gPSB0aGlzLmdldEhhc01hbnlSZWxhdGlvbnNoaXAoXG4gICAgICAgICAgICAgICAgICBtb2RlbFR5cGUsXG4gICAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXAuZGF0YSxcbiAgICAgICAgICAgICAgICAgIGluY2x1ZGVkLFxuICAgICAgICAgICAgICAgICAgdHlwZU5hbWUsXG4gICAgICAgICAgICAgICAgICByZW1haW5pbmdNb2RlbHNcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJlbGF0aW9uc2hpcE1vZGVscy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICBhbGxNb2RlbHMgPSBhbGxNb2RlbHMuY29uY2F0KHJlbGF0aW9uc2hpcE1vZGVscyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IHttZXNzYWdlOiBgcGFyc2VIYXNNYW55IC0gTW9kZWwgdHlwZSBmb3IgcmVsYXRpb25zaGlwICR7dHlwZU5hbWV9IG5vdCBmb3VuZC5gfTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXNbbWV0YWRhdGEucHJvcGVydHlOYW1lXSA9IGFsbE1vZGVscztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcGFyc2VCZWxvbmdzVG8oZGF0YTogYW55LCBpbmNsdWRlZDogQXJyYXk8YW55PiwgcmVtYWluaW5nTW9kZWxzOiBBcnJheTxhbnk+KTogdm9pZCB7XG4gICAgY29uc3QgYmVsb25nc1RvOiBhbnkgPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdCZWxvbmdzVG8nLCB0aGlzKTtcblxuICAgIGlmIChiZWxvbmdzVG8pIHtcbiAgICAgIGZvciAoY29uc3QgbWV0YWRhdGEgb2YgYmVsb25nc1RvKSB7XG4gICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcDogYW55ID0gZGF0YS5yZWxhdGlvbnNoaXBzID8gZGF0YS5yZWxhdGlvbnNoaXBzW21ldGFkYXRhLnJlbGF0aW9uc2hpcF0gOiBudWxsO1xuICAgICAgICBpZiAocmVsYXRpb25zaGlwICYmIHJlbGF0aW9uc2hpcC5kYXRhKSB7XG4gICAgICAgICAgY29uc3QgZGF0YVJlbGF0aW9uc2hpcDogYW55ID0gKHJlbGF0aW9uc2hpcC5kYXRhIGluc3RhbmNlb2YgQXJyYXkpID8gcmVsYXRpb25zaGlwLmRhdGFbMF0gOiByZWxhdGlvbnNoaXAuZGF0YTtcbiAgICAgICAgICBpZiAoZGF0YVJlbGF0aW9uc2hpcCkge1xuICAgICAgICAgICAgY29uc3QgdHlwZU5hbWU6IHN0cmluZyA9IGRhdGFSZWxhdGlvbnNoaXAudHlwZTtcbiAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsVHlwZTogTW9kZWxUeXBlPHRoaXM+ID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnSnNvbkFwaURhdGFzdG9yZUNvbmZpZycsIHRoaXMuaW50ZXJuYWxEYXRhc3RvcmUuY29uc3RydWN0b3IpLm1vZGVsc1t0eXBlTmFtZV07XG5cbiAgICAgICAgICAgIGlmIChtb2RlbFR5cGUpIHtcbiAgICAgICAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwTW9kZWwgPSB0aGlzLmdldEJlbG9uZ3NUb1JlbGF0aW9uc2hpcChcbiAgICAgICAgICAgICAgICBtb2RlbFR5cGUsXG4gICAgICAgICAgICAgICAgZGF0YVJlbGF0aW9uc2hpcCxcbiAgICAgICAgICAgICAgICBpbmNsdWRlZCxcbiAgICAgICAgICAgICAgICB0eXBlTmFtZSxcbiAgICAgICAgICAgICAgICByZW1haW5pbmdNb2RlbHNcbiAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICBpZiAocmVsYXRpb25zaGlwTW9kZWwpIHtcbiAgICAgICAgICAgICAgICB0aGlzW21ldGFkYXRhLnByb3BlcnR5TmFtZV0gPSByZWxhdGlvbnNoaXBNb2RlbDtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVucmVzb2x2ZWRSZWxhdGlvbnNbbWV0YWRhdGEucHJvcGVydHlOYW1lXSA9IGRhdGFSZWxhdGlvbnNoaXA7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRocm93IHttZXNzYWdlOiBgcGFyc2VCZWxvbmdzVG8gLSBNb2RlbCB0eXBlIGZvciByZWxhdGlvbnNoaXAgJHt0eXBlTmFtZX0gbm90IGZvdW5kLmB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0SGFzTWFueVJlbGF0aW9uc2hpcDxUIGV4dGVuZHMgSnNvbkFwaU1vZGVsPihcbiAgICBtb2RlbFR5cGU6IE1vZGVsVHlwZTxUPixcbiAgICBkYXRhOiBhbnksXG4gICAgaW5jbHVkZWQ6IGFueSxcbiAgICB0eXBlTmFtZTogc3RyaW5nLFxuICAgIHJlbWFpbmluZ01vZGVsczogQXJyYXk8YW55PlxuICApOiBBcnJheTxUPiB7XG4gICAgY29uc3QgcmVsYXRpb25zaGlwTGlzdDogQXJyYXk8VD4gPSBbXTtcblxuICAgIGRhdGEuZm9yRWFjaCgoaXRlbTogYW55KSA9PiB7XG4gICAgICBjb25zdCByZWxhdGlvbnNoaXBEYXRhOiBhbnkgPSBmaW5kKGluY2x1ZGVkLCB7aWQ6IGl0ZW0uaWQsIHR5cGU6IHR5cGVOYW1lfSBhcyBhbnkpO1xuXG4gICAgICBpZiAocmVsYXRpb25zaGlwRGF0YSkge1xuICAgICAgICBjb25zdCBuZXdPYmplY3Q6IFQgPSB0aGlzLmNyZWF0ZU9yUGVlayhtb2RlbFR5cGUsIHJlbGF0aW9uc2hpcERhdGEpO1xuXG4gICAgICAgIGNvbnN0IGluZGV4T2ZOZXdseUZvdW5kTW9kZWwgPSByZW1haW5pbmdNb2RlbHMuaW5kZXhPZihyZWxhdGlvbnNoaXBEYXRhKTtcbiAgICAgICAgY29uc3QgbW9kZWxzRm9yUHJvY2Vzc2luZyA9IHJlbWFpbmluZ01vZGVscy5jb25jYXQoW10pO1xuXG4gICAgICAgIGlmIChpbmRleE9mTmV3bHlGb3VuZE1vZGVsICE9PSAtMSkge1xuICAgICAgICAgIG1vZGVsc0ZvclByb2Nlc3Npbmcuc3BsaWNlKGluZGV4T2ZOZXdseUZvdW5kTW9kZWwsIDEpO1xuICAgICAgICAgIG5ld09iamVjdC5zeW5jUmVsYXRpb25zaGlwcyhyZWxhdGlvbnNoaXBEYXRhLCBpbmNsdWRlZCwgbW9kZWxzRm9yUHJvY2Vzc2luZyk7XG4gICAgICAgIH1cblxuICAgICAgICByZWxhdGlvbnNoaXBMaXN0LnB1c2gobmV3T2JqZWN0KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiByZWxhdGlvbnNoaXBMaXN0O1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRCZWxvbmdzVG9SZWxhdGlvbnNoaXA8VCBleHRlbmRzIEpzb25BcGlNb2RlbD4oXG4gICAgbW9kZWxUeXBlOiBNb2RlbFR5cGU8VD4sXG4gICAgZGF0YTogYW55LFxuICAgIGluY2x1ZGVkOiBBcnJheTxhbnk+LFxuICAgIHR5cGVOYW1lOiBzdHJpbmcsXG4gICAgcmVtYWluaW5nTW9kZWxzOiBBcnJheTxhbnk+XG4gICk6IFQgfCBudWxsIHtcbiAgICBjb25zdCBpZDogc3RyaW5nID0gZGF0YS5pZDtcblxuICAgIGNvbnN0IHJlbGF0aW9uc2hpcERhdGE6IGFueSA9IGZpbmQoaW5jbHVkZWQsIHtpZCwgdHlwZTogdHlwZU5hbWV9IGFzIGFueSk7XG5cbiAgICBpZiAocmVsYXRpb25zaGlwRGF0YSkge1xuICAgICAgY29uc3QgbmV3T2JqZWN0OiBUID0gdGhpcy5jcmVhdGVPclBlZWsobW9kZWxUeXBlLCByZWxhdGlvbnNoaXBEYXRhKTtcblxuICAgICAgY29uc3QgaW5kZXhPZk5ld2x5Rm91bmRNb2RlbCA9IHJlbWFpbmluZ01vZGVscy5pbmRleE9mKHJlbGF0aW9uc2hpcERhdGEpO1xuICAgICAgY29uc3QgbW9kZWxzRm9yUHJvY2Vzc2luZyA9IHJlbWFpbmluZ01vZGVscy5jb25jYXQoW10pO1xuXG4gICAgICBpZiAoaW5kZXhPZk5ld2x5Rm91bmRNb2RlbCAhPT0gLTEpIHtcbiAgICAgICAgbW9kZWxzRm9yUHJvY2Vzc2luZy5zcGxpY2UoaW5kZXhPZk5ld2x5Rm91bmRNb2RlbCwgMSk7XG4gICAgICAgIG5ld09iamVjdC5zeW5jUmVsYXRpb25zaGlwcyhyZWxhdGlvbnNoaXBEYXRhLCBpbmNsdWRlZCwgbW9kZWxzRm9yUHJvY2Vzc2luZyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXdPYmplY3Q7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaW50ZXJuYWxEYXRhc3RvcmUucGVla1JlY29yZChtb2RlbFR5cGUsIGlkKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlT3JQZWVrPFQgZXh0ZW5kcyBKc29uQXBpTW9kZWw+KG1vZGVsVHlwZTogTW9kZWxUeXBlPFQ+LCBkYXRhOiBhbnkpOiBUIHtcbiAgICBjb25zdCBwZWVrID0gdGhpcy5pbnRlcm5hbERhdGFzdG9yZS5wZWVrUmVjb3JkKG1vZGVsVHlwZSwgZGF0YS5pZCk7XG5cbiAgICBpZiAocGVlaykge1xuICAgICAgXy5leHRlbmQocGVlaywgdGhpcy5pbnRlcm5hbERhdGFzdG9yZS50cmFuc2Zvcm1TZXJpYWxpemVkTmFtZXNUb1Byb3BlcnR5TmFtZXMobW9kZWxUeXBlLCBkYXRhLmF0dHJpYnV0ZXMpKTtcbiAgICAgIHJldHVybiBwZWVrO1xuICAgIH1cblxuICAgIGNvbnN0IG5ld09iamVjdDogVCA9IHRoaXMuaW50ZXJuYWxEYXRhc3RvcmUuZGVzZXJpYWxpemVNb2RlbChtb2RlbFR5cGUsIGRhdGEpO1xuICAgIHRoaXMuaW50ZXJuYWxEYXRhc3RvcmUuYWRkVG9TdG9yZShuZXdPYmplY3QpO1xuXG4gICAgcmV0dXJuIG5ld09iamVjdDtcbiAgfVxufVxuIl19