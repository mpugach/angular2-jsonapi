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
    JsonApiModel.prototype.lastSyncModels;
    /**
     * @type {?}
     * @private
     */
    JsonApiModel.prototype.internalDatastore;
    /* Skipping unhandled member: [key: string]: any;*/
}
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi1hcGkubW9kZWwuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyMi1qc29uYXBpLyIsInNvdXJjZXMiOlsibW9kZWxzL2pzb24tYXBpLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLElBQUksTUFBTSxnQkFBZ0IsQ0FBQztBQUNsQyxPQUFPLFFBQVEsTUFBTSxvQkFBb0IsQ0FBQztBQUkxQyxPQUFPLEtBQUssQ0FBQyxNQUFNLFFBQVEsQ0FBQztBQUM1QixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQzs7Ozs7Ozs7O01BVW5ELHNCQUFzQixHQUFXLG1CQUFBLGlCQUFpQixFQUFPOztNQUV6RCxzQkFBc0I7Ozs7QUFBRyxhQUFhLENBQUMsRUFBRTs7VUFDdkMsTUFBTSxHQUFHLEVBQUU7O1VBQ1gsV0FBVzs7Ozs7SUFBRyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUU7UUFDckMsSUFBSSxLQUFLLEVBQUU7WUFDVCxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQztTQUN6QjtJQUNILENBQUMsQ0FBQTtJQUVELENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxJQUFJLEVBQUUsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUU1QyxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDLENBQUE7O0FBRUQsTUFBTSxPQUFPLFlBQVk7Ozs7O0lBU3ZCLFlBQW9CLGlCQUFtQyxFQUFFLElBQVU7UUFBL0Msc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQVBoRCx3QkFBbUIsR0FBRyxLQUFLLENBQUM7UUFDNUIsc0JBQWlCLEdBQUcsRUFBRSxDQUFDO1FBTzVCLElBQUksSUFBSSxFQUFFO1lBQ1IsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQztZQUNoQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDbEIsSUFBSSxD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RSxtQkFBbUIsR0FBRyxlQUFlLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztZQUV0RCxJQUFJLHNCQUFzQixLQUFLLENBQUMsQ0FBQyxFQUFFO2dCQUNqQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsc0JBQXNCLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RELFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsRUFBRSxRQUFRLEVBQUUsbUJBQW1CLENBQUMsQ0FBQzthQUM5RTtZQUVELE9BQU8sU0FBUyxDQUFDO1NBQ2xCO1FBRUQsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMxRCxDQUFDOzs7Ozs7OztJQUVPLFlBQVksQ0FBeUIsU0FBdUIsRUFBRSxJQUFTOztjQUN2RSxJQUFJLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUVsRSxJQUFJLElBQUksRUFBRTtZQUNSLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyx1Q0FBdUMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDM0csT0FBTyxJQUFJLENBQUM7U0FDYjs7Y0FFSyxTQUFTLEdBQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUM7UUFDN0UsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUU3QyxPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0NBQ0Y7OztJQXRQQywwQkFBVzs7SUFDWCwyQ0FBbUM7O0lBQ25DLHlDQUE4Qjs7SUFJOUIsc0NBQTJCOzs7OztJQUVmLHlDQUEyQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmaW5kIGZyb20gJ2xvZGFzaC1lcy9maW5kJztcbmltcG9ydCBpbmNsdWRlcyBmcm9tICdsb2Rhc2gtZXMvaW5jbHVkZXMnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgSnNvbkFwaURhdGFzdG9yZSwgTW9kZWxUeXBlIH0gZnJvbSAnLi4vc2VydmljZXMvanNvbi1hcGktZGF0YXN0b3JlLnNlcnZpY2UnO1xuaW1wb3J0IHsgTW9kZWxDb25maWcgfSBmcm9tICcuLi9pbnRlcmZhY2VzL21vZGVsLWNvbmZpZy5pbnRlcmZhY2UnO1xuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgQXR0cmlidXRlTWV0YWRhdGEgfSBmcm9tICcuLi9jb25zdGFudHMvc3ltYm9scyc7XG5pbXBvcnQgeyBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcblxuLyoqXG4gKiBIQUNLL0ZJWE1FOlxuICogVHlwZSAnc3ltYm9sJyBjYW5ub3QgYmUgdXNlZCBhcyBhbiBpbmRleCB0eXBlLlxuICogVHlwZVNjcmlwdCAyLjkueFxuICogU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMjQ1ODcuXG4gKi9cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lXG5jb25zdCBBdHRyaWJ1dGVNZXRhZGF0YUluZGV4OiBzdHJpbmcgPSBBdHRyaWJ1dGVNZXRhZGF0YSBhcyBhbnk7XG5cbmNvbnN0IHBhcnNlUmVsYXRpb25zaGlwTGlua3MgPSByZWxhdGlvbnNoaXBzID0+IHtcbiAgY29uc3QgcmVzdWx0ID0ge307XG4gIGNvbnN0IGxpbmtzTWFwcGVyID0gKHsgbGlua3MgfSwga2V5KSA9PiB7XG4gICAgaWYgKGxpbmtzKSB7XG4gICAgICByZXN1bHRba2V5XSA9IHsgbGlua3MgfTtcbiAgICB9XG4gIH07XG5cbiAgXy5mb3JFYWNoKHJlbGF0aW9uc2hpcHMgfHwge30sIGxpbmtzTWFwcGVyKTtcblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuZXhwb3J0IGNsYXNzIEpzb25BcGlNb2RlbCB7XG4gIGlkOiBzdHJpbmc7XG4gIHB1YmxpYyBtb2RlbEluaXRpYWxpemF0aW9uID0gZmFsc2U7XG4gIHB1YmxpYyByZWxhdGlvbnNoaXBMaW5rcyA9IHt9O1xuXG4gIFtrZXk6IHN0cmluZ106IGFueTtcblxuICBsYXN0U3luY01vZGVsczogQXJyYXk8YW55PjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGludGVybmFsRGF0YXN0b3JlOiBKc29uQXBpRGF0YXN0b3JlLCBkYXRhPzogYW55KSB7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIHRoaXMubW9kZWxJbml0aWFsaXphdGlvbiA9IHRydWU7XG4gICAgICB0aGlzLmlkID0gZGF0YS5pZDtcbiAgICAgIHRoaXMucmVsYXRpb25zaGlwTGlua3MgPSBwYXJzZVJlbGF0aW9uc2hpcExpbmtzKGRhdGEucmVsYXRpb25zaGlwcyk7XG4gICAgICBPYmplY3QuYXNzaWduKHRoaXMsIGRhdGEuYXR0cmlidXRlcyk7XG4gICAgICB0aGlzLm1vZGVsSW5pdGlhbGl6YXRpb24gPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgaXNNb2RlbEluaXRpYWxpemF0aW9uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm1vZGVsSW5pdGlhbGl6YXRpb247XG4gIH1cblxuICBwdWJsaWMgc3luY1JlbGF0aW9uc2hpcHMoZGF0YTogYW55LCBpbmNsdWRlZDogYW55LCByZW1haW5pbmdNb2RlbHM/OiBBcnJheTxhbnk+KTogdm9pZCB7XG4gICAgaWYgKHRoaXMubGFzdFN5bmNNb2RlbHMgPT09IGluY2x1ZGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIGxldCBtb2RlbHNGb3JQcm9jZXNzaW5nID0gcmVtYWluaW5nTW9kZWxzO1xuXG4gICAgICBpZiAobW9kZWxzRm9yUHJvY2Vzc2luZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG1vZGVsc0ZvclByb2Nlc3NpbmcgPSBbXS5jb25jYXQoaW5jbHVkZWQpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnBhcnNlSGFzTWFueShkYXRhLCBpbmNsdWRlZCwgbW9kZWxzRm9yUHJvY2Vzc2luZyk7XG4gICAgICB0aGlzLnBhcnNlQmVsb25nc1RvKGRhdGEsIGluY2x1ZGVkLCBtb2RlbHNGb3JQcm9jZXNzaW5nKTtcbiAgICB9XG5cbiAgICB0aGlzLmxhc3RTeW5jTW9kZWxzID0gaW5jbHVkZWQ7XG4gIH1cblxuICBwdWJsaWMgc2F2ZShwYXJhbXM/OiBhbnksIGhlYWRlcnM/OiBIdHRwSGVhZGVycywgY3VzdG9tVXJsPzogc3RyaW5nKTogT2JzZXJ2YWJsZTx0aGlzPiB7XG4gICAgdGhpcy5jaGVja0NoYW5nZXMoKTtcbiAgICBjb25zdCBhdHRyaWJ1dGVzTWV0YWRhdGE6IGFueSA9IHRoaXNbQXR0cmlidXRlTWV0YWRhdGFJbmRleF07XG4gICAgcmV0dXJuIHRoaXMuaW50ZXJuYWxEYXRhc3RvcmUuc2F2ZVJlY29yZChhdHRyaWJ1dGVzTWV0YWRhdGEsIHRoaXMsIHBhcmFtcywgaGVhZGVycywgY3VzdG9tVXJsKTtcbiAgfVxuXG4gIGdldCBoYXNEaXJ0eUF0dHJpYnV0ZXMoKSB7XG4gICAgdGhpcy5jaGVja0NoYW5nZXMoKTtcbiAgICBjb25zdCBhdHRyaWJ1dGVzTWV0YWRhdGE6IGFueSA9IHRoaXNbQXR0cmlidXRlTWV0YWRhdGFJbmRleF07XG4gICAgbGV0IGhhc0RpcnR5QXR0cmlidXRlcyA9IGZhbHNlO1xuICAgIGZvciAoY29uc3QgcHJvcGVydHlOYW1lIGluIGF0dHJpYnV0ZXNNZXRhZGF0YSkge1xuICAgICAgaWYgKGF0dHJpYnV0ZXNNZXRhZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgIGNvbnN0IG1ldGFkYXRhOiBhbnkgPSBhdHRyaWJ1dGVzTWV0YWRhdGFbcHJvcGVydHlOYW1lXTtcbiAgICAgICAgaWYgKG1ldGFkYXRhLmhhc0RpcnR5QXR0cmlidXRlcykge1xuICAgICAgICAgIGhhc0RpcnR5QXR0cmlidXRlcyA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGhhc0RpcnR5QXR0cmlidXRlcztcbiAgfVxuXG4gIHByaXZhdGUgY2hlY2tDaGFuZ2VzKCkge1xuICAgIGNvbnN0IGF0dHJpYnV0ZXNNZXRhZGF0YTogYW55ID0gdGhpc1tBdHRyaWJ1dGVNZXRhZGF0YV07XG4gICAgZm9yIChjb25zdCBwcm9wZXJ0eU5hbWUgaW4gYXR0cmlidXRlc01ldGFkYXRhKSB7XG4gICAgICBpZiAoYXR0cmlidXRlc01ldGFkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgY29uc3QgbWV0YWRhdGE6IGFueSA9IGF0dHJpYnV0ZXNNZXRhZGF0YVtwcm9wZXJ0eU5hbWVdO1xuICAgICAgICBpZiAobWV0YWRhdGEubmVzdGVkKSB7XG4gICAgICAgICAgdGhpc1tBdHRyaWJ1dGVNZXRhZGF0YV1bcHJvcGVydHlOYW1lXS5oYXNEaXJ0eUF0dHJpYnV0ZXMgPSAhXy5pc0VxdWFsKFxuICAgICAgICAgICAgYXR0cmlidXRlc01ldGFkYXRhW3Byb3BlcnR5TmFtZV0ub2xkVmFsdWUsXG4gICAgICAgICAgICBhdHRyaWJ1dGVzTWV0YWRhdGFbcHJvcGVydHlOYW1lXS5uZXdWYWx1ZVxuICAgICAgICAgICk7XG4gICAgICAgICAgdGhpc1tBdHRyaWJ1dGVNZXRhZGF0YV1bcHJvcGVydHlOYW1lXS5zZXJpYWxpc2F0aW9uVmFsdWUgPSBhdHRyaWJ1dGVzTWV0YWRhdGFbcHJvcGVydHlOYW1lXS5jb252ZXJ0ZXIoXG4gICAgICAgICAgICBSZWZsZWN0LmdldE1ldGFkYXRhKCdkZXNpZ246dHlwZScsIHRoaXMsIHByb3BlcnR5TmFtZSksXG4gICAgICAgICAgICBfLmNsb25lRGVlcChhdHRyaWJ1dGVzTWV0YWRhdGFbcHJvcGVydHlOYW1lXS5uZXdWYWx1ZSksXG4gICAgICAgICAgICB0cnVlXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyByb2xsYmFja0F0dHJpYnV0ZXMoKTogdm9pZCB7XG4gICAgY29uc3QgYXR0cmlidXRlc01ldGFkYXRhOiBhbnkgPSB0aGlzW0F0dHJpYnV0ZU1ldGFkYXRhSW5kZXhdO1xuICAgIGZvciAoY29uc3QgcHJvcGVydHlOYW1lIGluIGF0dHJpYnV0ZXNNZXRhZGF0YSkge1xuICAgICAgaWYgKGF0dHJpYnV0ZXNNZXRhZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgIGlmIChhdHRyaWJ1dGVzTWV0YWRhdGFbcHJvcGVydHlOYW1lXS5oYXNEaXJ0eUF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICB0aGlzW3Byb3BlcnR5TmFtZV0gPSBfLmNsb25lRGVlcChhdHRyaWJ1dGVzTWV0YWRhdGFbcHJvcGVydHlOYW1lXS5vbGRWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXQgbW9kZWxDb25maWcoKTogTW9kZWxDb25maWcge1xuICAgIHJldHVybiBSZWZsZWN0LmdldE1ldGFkYXRhKCdKc29uQXBpTW9kZWxDb25maWcnLCB0aGlzLmNvbnN0cnVjdG9yKTtcbiAgfVxuXG4gIHByaXZhdGUgcGFyc2VIYXNNYW55KGRhdGE6IGFueSwgaW5jbHVkZWQ6IGFueSwgcmVtYWluaW5nTW9kZWxzOiBBcnJheTxhbnk+KTogdm9pZCB7XG4gICAgY29uc3QgaGFzTWFueTogYW55ID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnSGFzTWFueScsIHRoaXMpO1xuXG4gICAgaWYgKGhhc01hbnkpIHtcbiAgICAgIGZvciAoY29uc3QgbWV0YWRhdGEgb2YgaGFzTWFueSkge1xuICAgICAgICBjb25zdCByZWxhdGlvbnNoaXA6IGFueSA9IGRhdGEucmVsYXRpb25zaGlwcyA/IGRhdGEucmVsYXRpb25zaGlwc1ttZXRhZGF0YS5yZWxhdGlvbnNoaXBdIDogbnVsbDtcblxuICAgICAgICBpZiAocmVsYXRpb25zaGlwICYmIHJlbGF0aW9uc2hpcC5kYXRhICYmIEFycmF5LmlzQXJyYXkocmVsYXRpb25zaGlwLmRhdGEpKSB7XG4gICAgICAgICAgbGV0IGFsbE1vZGVsczogSnNvbkFwaU1vZGVsW10gPSBbXTtcbiAgICAgICAgICBjb25zdCBtb2RlbFR5cGVzRmV0Y2hlZDogYW55ID0gW107XG5cbiAgICAgICAgICBmb3IgKGNvbnN0IHR5cGVJbmRleCBvZiBPYmplY3Qua2V5cyhyZWxhdGlvbnNoaXAuZGF0YSkpIHtcbiAgICAgICAgICAgIGNvbnN0IHR5cGVOYW1lOiBzdHJpbmcgPSByZWxhdGlvbnNoaXAuZGF0YVt0eXBlSW5kZXhdLnR5cGU7XG5cbiAgICAgICAgICAgIGlmICghaW5jbHVkZXMobW9kZWxUeXBlc0ZldGNoZWQsIHR5cGVOYW1lKSkge1xuICAgICAgICAgICAgICBtb2RlbFR5cGVzRmV0Y2hlZC5wdXNoKHR5cGVOYW1lKTtcbiAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxuICAgICAgICAgICAgICBjb25zdCBtb2RlbFR5cGU6IE1vZGVsVHlwZTx0aGlzPiA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ0pzb25BcGlEYXRhc3RvcmVDb25maWcnLCB0aGlzLmludGVybmFsRGF0YXN0b3JlLmNvbnN0cnVjdG9yKS5tb2RlbHNbdHlwZU5hbWVdO1xuXG4gICAgICAgICAgICAgIGlmIChtb2RlbFR5cGUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBNb2RlbHM6IEpzb25BcGlNb2RlbFtdID0gdGhpcy5nZXRIYXNNYW55UmVsYXRpb25zaGlwKFxuICAgICAgICAgICAgICAgICAgbW9kZWxUeXBlLFxuICAgICAgICAgICAgICAgICAgcmVsYXRpb25zaGlwLmRhdGEsXG4gICAgICAgICAgICAgICAgICBpbmNsdWRlZCxcbiAgICAgICAgICAgICAgICAgIHR5cGVOYW1lLFxuICAgICAgICAgICAgICAgICAgcmVtYWluaW5nTW9kZWxzXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIGlmIChyZWxhdGlvbnNoaXBNb2RlbHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgYWxsTW9kZWxzID0gYWxsTW9kZWxzLmNvbmNhdChyZWxhdGlvbnNoaXBNb2RlbHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyB7bWVzc2FnZTogYHBhcnNlSGFzTWFueSAtIE1vZGVsIHR5cGUgZm9yIHJlbGF0aW9uc2hpcCAke3R5cGVOYW1lfSBub3QgZm91bmQuYH07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzW21ldGFkYXRhLnByb3BlcnR5TmFtZV0gPSBhbGxNb2RlbHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHBhcnNlQmVsb25nc1RvKGRhdGE6IGFueSwgaW5jbHVkZWQ6IEFycmF5PGFueT4sIHJlbWFpbmluZ01vZGVsczogQXJyYXk8YW55Pik6IHZvaWQge1xuICAgIGNvbnN0IGJlbG9uZ3NUbzogYW55ID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnQmVsb25nc1RvJywgdGhpcyk7XG5cbiAgICBpZiAoYmVsb25nc1RvKSB7XG4gICAgICBmb3IgKGNvbnN0IG1ldGFkYXRhIG9mIGJlbG9uZ3NUbykge1xuICAgICAgICBjb25zdCByZWxhdGlvbnNoaXA6IGFueSA9IGRhdGEucmVsYXRpb25zaGlwcyA/IGRhdGEucmVsYXRpb25zaGlwc1ttZXRhZGF0YS5yZWxhdGlvbnNoaXBdIDogbnVsbDtcbiAgICAgICAgaWYgKHJlbGF0aW9uc2hpcCAmJiByZWxhdGlvbnNoaXAuZGF0YSkge1xuICAgICAgICAgIGNvbnN0IGRhdGFSZWxhdGlvbnNoaXA6IGFueSA9IChyZWxhdGlvbnNoaXAuZGF0YSBpbnN0YW5jZW9mIEFycmF5KSA/IHJlbGF0aW9uc2hpcC5kYXRhWzBdIDogcmVsYXRpb25zaGlwLmRhdGE7XG4gICAgICAgICAgaWYgKGRhdGFSZWxhdGlvbnNoaXApIHtcbiAgICAgICAgICAgIGNvbnN0IHR5cGVOYW1lOiBzdHJpbmcgPSBkYXRhUmVsYXRpb25zaGlwLnR5cGU7XG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgICAgICAgICBjb25zdCBtb2RlbFR5cGU6IE1vZGVsVHlwZTx0aGlzPiA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ0pzb25BcGlEYXRhc3RvcmVDb25maWcnLCB0aGlzLmludGVybmFsRGF0YXN0b3JlLmNvbnN0cnVjdG9yKS5tb2RlbHNbdHlwZU5hbWVdO1xuXG4gICAgICAgICAgICBpZiAobW9kZWxUeXBlKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcE1vZGVsID0gdGhpcy5nZXRCZWxvbmdzVG9SZWxhdGlvbnNoaXAoXG4gICAgICAgICAgICAgICAgbW9kZWxUeXBlLFxuICAgICAgICAgICAgICAgIGRhdGFSZWxhdGlvbnNoaXAsXG4gICAgICAgICAgICAgICAgaW5jbHVkZWQsXG4gICAgICAgICAgICAgICAgdHlwZU5hbWUsXG4gICAgICAgICAgICAgICAgcmVtYWluaW5nTW9kZWxzXG4gICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgaWYgKHJlbGF0aW9uc2hpcE1vZGVsKSB7XG4gICAgICAgICAgICAgICAgdGhpc1ttZXRhZGF0YS5wcm9wZXJ0eU5hbWVdID0gcmVsYXRpb25zaGlwTW9kZWw7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRocm93IHttZXNzYWdlOiBgcGFyc2VCZWxvbmdzVG8gLSBNb2RlbCB0eXBlIGZvciByZWxhdGlvbnNoaXAgJHt0eXBlTmFtZX0gbm90IGZvdW5kLmB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0SGFzTWFueVJlbGF0aW9uc2hpcDxUIGV4dGVuZHMgSnNvbkFwaU1vZGVsPihcbiAgICBtb2RlbFR5cGU6IE1vZGVsVHlwZTxUPixcbiAgICBkYXRhOiBhbnksXG4gICAgaW5jbHVkZWQ6IGFueSxcbiAgICB0eXBlTmFtZTogc3RyaW5nLFxuICAgIHJlbWFpbmluZ01vZGVsczogQXJyYXk8YW55PlxuICApOiBBcnJheTxUPiB7XG4gICAgY29uc3QgcmVsYXRpb25zaGlwTGlzdDogQXJyYXk8VD4gPSBbXTtcblxuICAgIGRhdGEuZm9yRWFjaCgoaXRlbTogYW55KSA9PiB7XG4gICAgICBjb25zdCByZWxhdGlvbnNoaXBEYXRhOiBhbnkgPSBmaW5kKGluY2x1ZGVkLCB7aWQ6IGl0ZW0uaWQsIHR5cGU6IHR5cGVOYW1lfSBhcyBhbnkpO1xuXG4gICAgICBpZiAocmVsYXRpb25zaGlwRGF0YSkge1xuICAgICAgICBjb25zdCBuZXdPYmplY3Q6IFQgPSB0aGlzLmNyZWF0ZU9yUGVlayhtb2RlbFR5cGUsIHJlbGF0aW9uc2hpcERhdGEpO1xuXG4gICAgICAgIGNvbnN0IGluZGV4T2ZOZXdseUZvdW5kTW9kZWwgPSByZW1haW5pbmdNb2RlbHMuaW5kZXhPZihyZWxhdGlvbnNoaXBEYXRhKTtcbiAgICAgICAgY29uc3QgbW9kZWxzRm9yUHJvY2Vzc2luZyA9IHJlbWFpbmluZ01vZGVscy5jb25jYXQoW10pO1xuXG4gICAgICAgIGlmIChpbmRleE9mTmV3bHlGb3VuZE1vZGVsICE9PSAtMSkge1xuICAgICAgICAgIG1vZGVsc0ZvclByb2Nlc3Npbmcuc3BsaWNlKGluZGV4T2ZOZXdseUZvdW5kTW9kZWwsIDEpO1xuICAgICAgICAgIG5ld09iamVjdC5zeW5jUmVsYXRpb25zaGlwcyhyZWxhdGlvbnNoaXBEYXRhLCBpbmNsdWRlZCwgbW9kZWxzRm9yUHJvY2Vzc2luZyk7XG4gICAgICAgIH1cblxuICAgICAgICByZWxhdGlvbnNoaXBMaXN0LnB1c2gobmV3T2JqZWN0KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiByZWxhdGlvbnNoaXBMaXN0O1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRCZWxvbmdzVG9SZWxhdGlvbnNoaXA8VCBleHRlbmRzIEpzb25BcGlNb2RlbD4oXG4gICAgbW9kZWxUeXBlOiBNb2RlbFR5cGU8VD4sXG4gICAgZGF0YTogYW55LFxuICAgIGluY2x1ZGVkOiBBcnJheTxhbnk+LFxuICAgIHR5cGVOYW1lOiBzdHJpbmcsXG4gICAgcmVtYWluaW5nTW9kZWxzOiBBcnJheTxhbnk+XG4gICk6IFQgfCBudWxsIHtcbiAgICBjb25zdCBpZDogc3RyaW5nID0gZGF0YS5pZDtcblxuICAgIGNvbnN0IHJlbGF0aW9uc2hpcERhdGE6IGFueSA9IGZpbmQoaW5jbHVkZWQsIHtpZCwgdHlwZTogdHlwZU5hbWV9IGFzIGFueSk7XG5cbiAgICBpZiAocmVsYXRpb25zaGlwRGF0YSkge1xuICAgICAgY29uc3QgbmV3T2JqZWN0OiBUID0gdGhpcy5jcmVhdGVPclBlZWsobW9kZWxUeXBlLCByZWxhdGlvbnNoaXBEYXRhKTtcblxuICAgICAgY29uc3QgaW5kZXhPZk5ld2x5Rm91bmRNb2RlbCA9IHJlbWFpbmluZ01vZGVscy5pbmRleE9mKHJlbGF0aW9uc2hpcERhdGEpO1xuICAgICAgY29uc3QgbW9kZWxzRm9yUHJvY2Vzc2luZyA9IHJlbWFpbmluZ01vZGVscy5jb25jYXQoW10pO1xuXG4gICAgICBpZiAoaW5kZXhPZk5ld2x5Rm91bmRNb2RlbCAhPT0gLTEpIHtcbiAgICAgICAgbW9kZWxzRm9yUHJvY2Vzc2luZy5zcGxpY2UoaW5kZXhPZk5ld2x5Rm91bmRNb2RlbCwgMSk7XG4gICAgICAgIG5ld09iamVjdC5zeW5jUmVsYXRpb25zaGlwcyhyZWxhdGlvbnNoaXBEYXRhLCBpbmNsdWRlZCwgbW9kZWxzRm9yUHJvY2Vzc2luZyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXdPYmplY3Q7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaW50ZXJuYWxEYXRhc3RvcmUucGVla1JlY29yZChtb2RlbFR5cGUsIGlkKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlT3JQZWVrPFQgZXh0ZW5kcyBKc29uQXBpTW9kZWw+KG1vZGVsVHlwZTogTW9kZWxUeXBlPFQ+LCBkYXRhOiBhbnkpOiBUIHtcbiAgICBjb25zdCBwZWVrID0gdGhpcy5pbnRlcm5hbERhdGFzdG9yZS5wZWVrUmVjb3JkKG1vZGVsVHlwZSwgZGF0YS5pZCk7XG5cbiAgICBpZiAocGVlaykge1xuICAgICAgXy5leHRlbmQocGVlaywgdGhpcy5pbnRlcm5hbERhdGFzdG9yZS50cmFuc2Zvcm1TZXJpYWxpemVkTmFtZXNUb1Byb3BlcnR5TmFtZXMobW9kZWxUeXBlLCBkYXRhLmF0dHJpYnV0ZXMpKTtcbiAgICAgIHJldHVybiBwZWVrO1xuICAgIH1cblxuICAgIGNvbnN0IG5ld09iamVjdDogVCA9IHRoaXMuaW50ZXJuYWxEYXRhc3RvcmUuZGVzZXJpYWxpemVNb2RlbChtb2RlbFR5cGUsIGRhdGEpO1xuICAgIHRoaXMuaW50ZXJuYWxEYXRhc3RvcmUuYWRkVG9TdG9yZShuZXdPYmplY3QpO1xuXG4gICAgcmV0dXJuIG5ld09iamVjdDtcbiAgfVxufVxuIl19