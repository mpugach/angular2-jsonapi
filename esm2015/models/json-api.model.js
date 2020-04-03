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
                                console.error(`parseHasMany - Model type for relationship ${typeName} not found.`);
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
                            console.error(`parseBelongsTo - Model type for relationship ${typeName} not found.`);
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
            else {
                /** @type {?} */
                const type = Reflect.getMetadata('JsonApiDatastoreConfig', this.internalDatastore.constructor).models[typeName];
                /** @type {?} */
                const newObject = this.internalDatastore.peekRecord(type, item.id);
                if (newObject) {
                    relationshipList.push(newObject);
                }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi1hcGkubW9kZWwuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyMi1qc29uYXBpLyIsInNvdXJjZXMiOlsibW9kZWxzL2pzb24tYXBpLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLElBQUksTUFBTSxnQkFBZ0IsQ0FBQztBQUNsQyxPQUFPLFFBQVEsTUFBTSxvQkFBb0IsQ0FBQztBQUkxQyxPQUFPLEtBQUssQ0FBQyxNQUFNLFFBQVEsQ0FBQztBQUM1QixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQzs7Ozs7Ozs7O01BVW5ELHNCQUFzQixHQUFXLG1CQUFBLGlCQUFpQixFQUFPOztNQUV6RCxzQkFBc0I7Ozs7QUFBRyxhQUFhLENBQUMsRUFBRTs7VUFDdkMsTUFBTSxHQUFHLEVBQUU7O1VBQ1gsV0FBVzs7Ozs7SUFBRyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUU7UUFDckMsSUFBSSxLQUFLLEVBQUU7WUFDVCxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQztTQUN6QjtJQUNILENBQUMsQ0FBQTtJQUVELENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxJQUFJLEVBQUUsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUU1QyxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDLENBQUE7O0FBRUQsTUFBTSxPQUFPLFlBQVk7Ozs7O0lBVXZCLFlBQW9CLGlCQUFtQyxFQUFFLElBQVU7UUFBL0Msc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQVJoRCx3QkFBbUIsR0FBRyxLQUFLLENBQUM7UUFDNUIsc0JBQWlCLEdBQUcsRUFBRSxDQUFDO1FBQ3ZCLHdCQUFtQixHQUFRLEVBQUUsQ0FBQztRQU9uQyxJQUFJLElBQUksRUFBRTtZQUNSLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7WUFDaEMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJ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QUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDM0csT0FBTyxJQUFJLENBQUM7U0FDYjs7Y0FFSyxTQUFTLEdBQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUM7UUFDN0UsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUU3QyxPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0NBQ0Y7OztJQS9QQywwQkFBVzs7SUFDWCwyQ0FBbUM7O0lBQ25DLHlDQUE4Qjs7SUFDOUIsMkNBQXFDOztJQUlyQyxzQ0FBMkI7Ozs7O0lBRWYseUNBQTJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZpbmQgZnJvbSAnbG9kYXNoLWVzL2ZpbmQnO1xuaW1wb3J0IGluY2x1ZGVzIGZyb20gJ2xvZGFzaC1lcy9pbmNsdWRlcyc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBKc29uQXBpRGF0YXN0b3JlLCBNb2RlbFR5cGUgfSBmcm9tICcuLi9zZXJ2aWNlcy9qc29uLWFwaS1kYXRhc3RvcmUuc2VydmljZSc7XG5pbXBvcnQgeyBNb2RlbENvbmZpZyB9IGZyb20gJy4uL2ludGVyZmFjZXMvbW9kZWwtY29uZmlnLmludGVyZmFjZSc7XG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBBdHRyaWJ1dGVNZXRhZGF0YSB9IGZyb20gJy4uL2NvbnN0YW50cy9zeW1ib2xzJztcbmltcG9ydCB7IEh0dHBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuXG4vKipcbiAqIEhBQ0svRklYTUU6XG4gKiBUeXBlICdzeW1ib2wnIGNhbm5vdCBiZSB1c2VkIGFzIGFuIGluZGV4IHR5cGUuXG4gKiBUeXBlU2NyaXB0IDIuOS54XG4gKiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8yNDU4Ny5cbiAqL1xuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWVcbmNvbnN0IEF0dHJpYnV0ZU1ldGFkYXRhSW5kZXg6IHN0cmluZyA9IEF0dHJpYnV0ZU1ldGFkYXRhIGFzIGFueTtcblxuY29uc3QgcGFyc2VSZWxhdGlvbnNoaXBMaW5rcyA9IHJlbGF0aW9uc2hpcHMgPT4ge1xuICBjb25zdCByZXN1bHQgPSB7fTtcbiAgY29uc3QgbGlua3NNYXBwZXIgPSAoeyBsaW5rcyB9LCBrZXkpID0+IHtcbiAgICBpZiAobGlua3MpIHtcbiAgICAgIHJlc3VsdFtrZXldID0geyBsaW5rcyB9O1xuICAgIH1cbiAgfTtcblxuICBfLmZvckVhY2gocmVsYXRpb25zaGlwcyB8fCB7fSwgbGlua3NNYXBwZXIpO1xuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5leHBvcnQgY2xhc3MgSnNvbkFwaU1vZGVsIHtcbiAgaWQ6IHN0cmluZztcbiAgcHVibGljIG1vZGVsSW5pdGlhbGl6YXRpb24gPSBmYWxzZTtcbiAgcHVibGljIHJlbGF0aW9uc2hpcExpbmtzID0ge307XG4gIHB1YmxpYyB1bnJlc29sdmVkUmVsYXRpb25zOiBhbnkgPSB7fTtcblxuICBba2V5OiBzdHJpbmddOiBhbnk7XG5cbiAgbGFzdFN5bmNNb2RlbHM6IEFycmF5PGFueT47XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBpbnRlcm5hbERhdGFzdG9yZTogSnNvbkFwaURhdGFzdG9yZSwgZGF0YT86IGFueSkge1xuICAgIGlmIChkYXRhKSB7XG4gICAgICB0aGlzLm1vZGVsSW5pdGlhbGl6YXRpb24gPSB0cnVlO1xuICAgICAgdGhpcy5pZCA9IGRhdGEuaWQ7XG4gICAgICB0aGlzLnJlbGF0aW9uc2hpcExpbmtzID0gcGFyc2VSZWxhdGlvbnNoaXBMaW5rcyhkYXRhLnJlbGF0aW9uc2hpcHMpO1xuICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBkYXRhLmF0dHJpYnV0ZXMpO1xuICAgICAgdGhpcy5tb2RlbEluaXRpYWxpemF0aW9uID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGlzTW9kZWxJbml0aWFsaXphdGlvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5tb2RlbEluaXRpYWxpemF0aW9uO1xuICB9XG5cbiAgcHVibGljIHN5bmNSZWxhdGlvbnNoaXBzKGRhdGE6IGFueSwgaW5jbHVkZWQ6IGFueSwgcmVtYWluaW5nTW9kZWxzPzogQXJyYXk8YW55Pik6IHZvaWQge1xuICAgIGlmICh0aGlzLmxhc3RTeW5jTW9kZWxzID09PSBpbmNsdWRlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChkYXRhKSB7XG4gICAgICBsZXQgbW9kZWxzRm9yUHJvY2Vzc2luZyA9IHJlbWFpbmluZ01vZGVscztcblxuICAgICAgaWYgKG1vZGVsc0ZvclByb2Nlc3NpbmcgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBtb2RlbHNGb3JQcm9jZXNzaW5nID0gW10uY29uY2F0KGluY2x1ZGVkKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5wYXJzZUhhc01hbnkoZGF0YSwgaW5jbHVkZWQsIG1vZGVsc0ZvclByb2Nlc3NpbmcpO1xuICAgICAgdGhpcy5wYXJzZUJlbG9uZ3NUbyhkYXRhLCBpbmNsdWRlZCwgbW9kZWxzRm9yUHJvY2Vzc2luZyk7XG4gICAgfVxuXG4gICAgdGhpcy5sYXN0U3luY01vZGVscyA9IGluY2x1ZGVkO1xuICB9XG5cbiAgcHVibGljIHNhdmUocGFyYW1zPzogYW55LCBoZWFkZXJzPzogSHR0cEhlYWRlcnMsIGN1c3RvbVVybD86IHN0cmluZyk6IE9ic2VydmFibGU8dGhpcz4ge1xuICAgIHRoaXMuY2hlY2tDaGFuZ2VzKCk7XG4gICAgY29uc3QgYXR0cmlidXRlc01ldGFkYXRhOiBhbnkgPSB0aGlzW0F0dHJpYnV0ZU1ldGFkYXRhSW5kZXhdO1xuICAgIHJldHVybiB0aGlzLmludGVybmFsRGF0YXN0b3JlLnNhdmVSZWNvcmQoYXR0cmlidXRlc01ldGFkYXRhLCB0aGlzLCBwYXJhbXMsIGhlYWRlcnMsIGN1c3RvbVVybCk7XG4gIH1cblxuICBnZXQgaGFzRGlydHlBdHRyaWJ1dGVzKCkge1xuICAgIHRoaXMuY2hlY2tDaGFuZ2VzKCk7XG4gICAgY29uc3QgYXR0cmlidXRlc01ldGFkYXRhOiBhbnkgPSB0aGlzW0F0dHJpYnV0ZU1ldGFkYXRhSW5kZXhdO1xuICAgIGxldCBoYXNEaXJ0eUF0dHJpYnV0ZXMgPSBmYWxzZTtcbiAgICBmb3IgKGNvbnN0IHByb3BlcnR5TmFtZSBpbiBhdHRyaWJ1dGVzTWV0YWRhdGEpIHtcbiAgICAgIGlmIChhdHRyaWJ1dGVzTWV0YWRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSkge1xuICAgICAgICBjb25zdCBtZXRhZGF0YTogYW55ID0gYXR0cmlidXRlc01ldGFkYXRhW3Byb3BlcnR5TmFtZV07XG4gICAgICAgIGlmIChtZXRhZGF0YS5oYXNEaXJ0eUF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICBoYXNEaXJ0eUF0dHJpYnV0ZXMgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBoYXNEaXJ0eUF0dHJpYnV0ZXM7XG4gIH1cblxuICBwcml2YXRlIGNoZWNrQ2hhbmdlcygpIHtcbiAgICBjb25zdCBhdHRyaWJ1dGVzTWV0YWRhdGE6IGFueSA9IHRoaXNbQXR0cmlidXRlTWV0YWRhdGFdO1xuICAgIGZvciAoY29uc3QgcHJvcGVydHlOYW1lIGluIGF0dHJpYnV0ZXNNZXRhZGF0YSkge1xuICAgICAgaWYgKGF0dHJpYnV0ZXNNZXRhZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgIGNvbnN0IG1ldGFkYXRhOiBhbnkgPSBhdHRyaWJ1dGVzTWV0YWRhdGFbcHJvcGVydHlOYW1lXTtcbiAgICAgICAgaWYgKG1ldGFkYXRhLm5lc3RlZCkge1xuICAgICAgICAgIHRoaXNbQXR0cmlidXRlTWV0YWRhdGFdW3Byb3BlcnR5TmFtZV0uaGFzRGlydHlBdHRyaWJ1dGVzID0gIV8uaXNFcXVhbChcbiAgICAgICAgICAgIGF0dHJpYnV0ZXNNZXRhZGF0YVtwcm9wZXJ0eU5hbWVdLm9sZFZhbHVlLFxuICAgICAgICAgICAgYXR0cmlidXRlc01ldGFkYXRhW3Byb3BlcnR5TmFtZV0ubmV3VmFsdWVcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXNbQXR0cmlidXRlTWV0YWRhdGFdW3Byb3BlcnR5TmFtZV0uc2VyaWFsaXNhdGlvblZhbHVlID0gYXR0cmlidXRlc01ldGFkYXRhW3Byb3BlcnR5TmFtZV0uY29udmVydGVyKFxuICAgICAgICAgICAgUmVmbGVjdC5nZXRNZXRhZGF0YSgnZGVzaWduOnR5cGUnLCB0aGlzLCBwcm9wZXJ0eU5hbWUpLFxuICAgICAgICAgICAgXy5jbG9uZURlZXAoYXR0cmlidXRlc01ldGFkYXRhW3Byb3BlcnR5TmFtZV0ubmV3VmFsdWUpLFxuICAgICAgICAgICAgdHJ1ZVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcm9sbGJhY2tBdHRyaWJ1dGVzKCk6IHZvaWQge1xuICAgIGNvbnN0IGF0dHJpYnV0ZXNNZXRhZGF0YTogYW55ID0gdGhpc1tBdHRyaWJ1dGVNZXRhZGF0YUluZGV4XTtcbiAgICBmb3IgKGNvbnN0IHByb3BlcnR5TmFtZSBpbiBhdHRyaWJ1dGVzTWV0YWRhdGEpIHtcbiAgICAgIGlmIChhdHRyaWJ1dGVzTWV0YWRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSkge1xuICAgICAgICBpZiAoYXR0cmlidXRlc01ldGFkYXRhW3Byb3BlcnR5TmFtZV0uaGFzRGlydHlBdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgdGhpc1twcm9wZXJ0eU5hbWVdID0gXy5jbG9uZURlZXAoYXR0cmlidXRlc01ldGFkYXRhW3Byb3BlcnR5TmFtZV0ub2xkVmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0IG1vZGVsQ29uZmlnKCk6IE1vZGVsQ29uZmlnIHtcbiAgICByZXR1cm4gUmVmbGVjdC5nZXRNZXRhZGF0YSgnSnNvbkFwaU1vZGVsQ29uZmlnJywgdGhpcy5jb25zdHJ1Y3Rvcik7XG4gIH1cblxuICBwcml2YXRlIHBhcnNlSGFzTWFueShkYXRhOiBhbnksIGluY2x1ZGVkOiBhbnksIHJlbWFpbmluZ01vZGVsczogQXJyYXk8YW55Pik6IHZvaWQge1xuICAgIGNvbnN0IGhhc01hbnk6IGFueSA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ0hhc01hbnknLCB0aGlzKTtcblxuICAgIGlmIChoYXNNYW55KSB7XG4gICAgICBmb3IgKGNvbnN0IG1ldGFkYXRhIG9mIGhhc01hbnkpIHtcbiAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwOiBhbnkgPSBkYXRhLnJlbGF0aW9uc2hpcHMgPyBkYXRhLnJlbGF0aW9uc2hpcHNbbWV0YWRhdGEucmVsYXRpb25zaGlwXSA6IG51bGw7XG5cbiAgICAgICAgaWYgKHJlbGF0aW9uc2hpcCAmJiByZWxhdGlvbnNoaXAuZGF0YSAmJiBBcnJheS5pc0FycmF5KHJlbGF0aW9uc2hpcC5kYXRhKSkge1xuICAgICAgICAgIGxldCBhbGxNb2RlbHM6IEpzb25BcGlNb2RlbFtdID0gW107XG4gICAgICAgICAgY29uc3QgbW9kZWxUeXBlc0ZldGNoZWQ6IGFueSA9IFtdO1xuXG4gICAgICAgICAgZm9yIChjb25zdCB0eXBlSW5kZXggb2YgT2JqZWN0LmtleXMocmVsYXRpb25zaGlwLmRhdGEpKSB7XG4gICAgICAgICAgICBjb25zdCB0eXBlTmFtZTogc3RyaW5nID0gcmVsYXRpb25zaGlwLmRhdGFbdHlwZUluZGV4XS50eXBlO1xuXG4gICAgICAgICAgICBpZiAoIWluY2x1ZGVzKG1vZGVsVHlwZXNGZXRjaGVkLCB0eXBlTmFtZSkpIHtcbiAgICAgICAgICAgICAgbW9kZWxUeXBlc0ZldGNoZWQucHVzaCh0eXBlTmFtZSk7XG4gICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcbiAgICAgICAgICAgICAgY29uc3QgbW9kZWxUeXBlOiBNb2RlbFR5cGU8dGhpcz4gPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdKc29uQXBpRGF0YXN0b3JlQ29uZmlnJywgdGhpcy5pbnRlcm5hbERhdGFzdG9yZS5jb25zdHJ1Y3RvcikubW9kZWxzW3R5cGVOYW1lXTtcblxuICAgICAgICAgICAgICBpZiAobW9kZWxUeXBlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwTW9kZWxzOiBKc29uQXBpTW9kZWxbXSA9IHRoaXMuZ2V0SGFzTWFueVJlbGF0aW9uc2hpcChcbiAgICAgICAgICAgICAgICAgIG1vZGVsVHlwZSxcbiAgICAgICAgICAgICAgICAgIHJlbGF0aW9uc2hpcC5kYXRhLFxuICAgICAgICAgICAgICAgICAgaW5jbHVkZWQsXG4gICAgICAgICAgICAgICAgICB0eXBlTmFtZSxcbiAgICAgICAgICAgICAgICAgIHJlbWFpbmluZ01vZGVsc1xuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICBpZiAocmVsYXRpb25zaGlwTW9kZWxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgIGFsbE1vZGVscyA9IGFsbE1vZGVscy5jb25jYXQocmVsYXRpb25zaGlwTW9kZWxzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgcGFyc2VIYXNNYW55IC0gTW9kZWwgdHlwZSBmb3IgcmVsYXRpb25zaGlwICR7dHlwZU5hbWV9IG5vdCBmb3VuZC5gKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXNbbWV0YWRhdGEucHJvcGVydHlOYW1lXSA9IGFsbE1vZGVscztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcGFyc2VCZWxvbmdzVG8oZGF0YTogYW55LCBpbmNsdWRlZDogQXJyYXk8YW55PiwgcmVtYWluaW5nTW9kZWxzOiBBcnJheTxhbnk+KTogdm9pZCB7XG4gICAgY29uc3QgYmVsb25nc1RvOiBhbnkgPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdCZWxvbmdzVG8nLCB0aGlzKTtcblxuICAgIGlmIChiZWxvbmdzVG8pIHtcbiAgICAgIGZvciAoY29uc3QgbWV0YWRhdGEgb2YgYmVsb25nc1RvKSB7XG4gICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcDogYW55ID0gZGF0YS5yZWxhdGlvbnNoaXBzID8gZGF0YS5yZWxhdGlvbnNoaXBzW21ldGFkYXRhLnJlbGF0aW9uc2hpcF0gOiBudWxsO1xuICAgICAgICBpZiAocmVsYXRpb25zaGlwICYmIHJlbGF0aW9uc2hpcC5kYXRhKSB7XG4gICAgICAgICAgY29uc3QgZGF0YVJlbGF0aW9uc2hpcDogYW55ID0gKHJlbGF0aW9uc2hpcC5kYXRhIGluc3RhbmNlb2YgQXJyYXkpID8gcmVsYXRpb25zaGlwLmRhdGFbMF0gOiByZWxhdGlvbnNoaXAuZGF0YTtcbiAgICAgICAgICBpZiAoZGF0YVJlbGF0aW9uc2hpcCkge1xuICAgICAgICAgICAgY29uc3QgdHlwZU5hbWU6IHN0cmluZyA9IGRhdGFSZWxhdGlvbnNoaXAudHlwZTtcbiAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsVHlwZTogTW9kZWxUeXBlPHRoaXM+ID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnSnNvbkFwaURhdGFzdG9yZUNvbmZpZycsIHRoaXMuaW50ZXJuYWxEYXRhc3RvcmUuY29uc3RydWN0b3IpLm1vZGVsc1t0eXBlTmFtZV07XG5cbiAgICAgICAgICAgIGlmIChtb2RlbFR5cGUpIHtcbiAgICAgICAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwTW9kZWwgPSB0aGlzLmdldEJlbG9uZ3NUb1JlbGF0aW9uc2hpcChcbiAgICAgICAgICAgICAgICBtb2RlbFR5cGUsXG4gICAgICAgICAgICAgICAgZGF0YVJlbGF0aW9uc2hpcCxcbiAgICAgICAgICAgICAgICBpbmNsdWRlZCxcbiAgICAgICAgICAgICAgICB0eXBlTmFtZSxcbiAgICAgICAgICAgICAgICByZW1haW5pbmdNb2RlbHNcbiAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICBpZiAocmVsYXRpb25zaGlwTW9kZWwpIHtcbiAgICAgICAgICAgICAgICB0aGlzW21ldGFkYXRhLnByb3BlcnR5TmFtZV0gPSByZWxhdGlvbnNoaXBNb2RlbDtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVucmVzb2x2ZWRSZWxhdGlvbnNbbWV0YWRhdGEucHJvcGVydHlOYW1lXSA9IGRhdGFSZWxhdGlvbnNoaXA7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYHBhcnNlQmVsb25nc1RvIC0gTW9kZWwgdHlwZSBmb3IgcmVsYXRpb25zaGlwICR7dHlwZU5hbWV9IG5vdCBmb3VuZC5gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldEhhc01hbnlSZWxhdGlvbnNoaXA8VCBleHRlbmRzIEpzb25BcGlNb2RlbD4oXG4gICAgbW9kZWxUeXBlOiBNb2RlbFR5cGU8VD4sXG4gICAgZGF0YTogYW55LFxuICAgIGluY2x1ZGVkOiBhbnksXG4gICAgdHlwZU5hbWU6IHN0cmluZyxcbiAgICByZW1haW5pbmdNb2RlbHM6IEFycmF5PGFueT5cbiAgKTogQXJyYXk8VD4ge1xuICAgIGNvbnN0IHJlbGF0aW9uc2hpcExpc3Q6IEFycmF5PFQ+ID0gW107XG5cbiAgICBkYXRhLmZvckVhY2goKGl0ZW06IGFueSkgPT4ge1xuICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGF0YTogYW55ID0gZmluZChpbmNsdWRlZCwge2lkOiBpdGVtLmlkLCB0eXBlOiB0eXBlTmFtZX0gYXMgYW55KTtcblxuICAgICAgaWYgKHJlbGF0aW9uc2hpcERhdGEpIHtcbiAgICAgICAgY29uc3QgbmV3T2JqZWN0OiBUID0gdGhpcy5jcmVhdGVPclBlZWsobW9kZWxUeXBlLCByZWxhdGlvbnNoaXBEYXRhKTtcblxuICAgICAgICBjb25zdCBpbmRleE9mTmV3bHlGb3VuZE1vZGVsID0gcmVtYWluaW5nTW9kZWxzLmluZGV4T2YocmVsYXRpb25zaGlwRGF0YSk7XG4gICAgICAgIGNvbnN0IG1vZGVsc0ZvclByb2Nlc3NpbmcgPSByZW1haW5pbmdNb2RlbHMuY29uY2F0KFtdKTtcblxuICAgICAgICBpZiAoaW5kZXhPZk5ld2x5Rm91bmRNb2RlbCAhPT0gLTEpIHtcbiAgICAgICAgICBtb2RlbHNGb3JQcm9jZXNzaW5nLnNwbGljZShpbmRleE9mTmV3bHlGb3VuZE1vZGVsLCAxKTtcbiAgICAgICAgICBuZXdPYmplY3Quc3luY1JlbGF0aW9uc2hpcHMocmVsYXRpb25zaGlwRGF0YSwgaW5jbHVkZWQsIG1vZGVsc0ZvclByb2Nlc3NpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVsYXRpb25zaGlwTGlzdC5wdXNoKG5ld09iamVjdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB0eXBlID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnSnNvbkFwaURhdGFzdG9yZUNvbmZpZycsIHRoaXMuaW50ZXJuYWxEYXRhc3RvcmUuY29uc3RydWN0b3IpLm1vZGVsc1t0eXBlTmFtZV07XG4gICAgICAgIGNvbnN0IG5ld09iamVjdDogVCA9IHRoaXMuaW50ZXJuYWxEYXRhc3RvcmUucGVla1JlY29yZCh0eXBlLCBpdGVtLmlkKTtcbiAgICAgICAgaWYgKG5ld09iamVjdCkge1xuICAgICAgICAgIHJlbGF0aW9uc2hpcExpc3QucHVzaChuZXdPYmplY3QpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVsYXRpb25zaGlwTGlzdDtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0QmVsb25nc1RvUmVsYXRpb25zaGlwPFQgZXh0ZW5kcyBKc29uQXBpTW9kZWw+KFxuICAgIG1vZGVsVHlwZTogTW9kZWxUeXBlPFQ+LFxuICAgIGRhdGE6IGFueSxcbiAgICBpbmNsdWRlZDogQXJyYXk8YW55PixcbiAgICB0eXBlTmFtZTogc3RyaW5nLFxuICAgIHJlbWFpbmluZ01vZGVsczogQXJyYXk8YW55PlxuICApOiBUIHwgbnVsbCB7XG4gICAgY29uc3QgaWQ6IHN0cmluZyA9IGRhdGEuaWQ7XG5cbiAgICBjb25zdCByZWxhdGlvbnNoaXBEYXRhOiBhbnkgPSBmaW5kKGluY2x1ZGVkLCB7aWQsIHR5cGU6IHR5cGVOYW1lfSBhcyBhbnkpO1xuXG4gICAgaWYgKHJlbGF0aW9uc2hpcERhdGEpIHtcbiAgICAgIGNvbnN0IG5ld09iamVjdDogVCA9IHRoaXMuY3JlYXRlT3JQZWVrKG1vZGVsVHlwZSwgcmVsYXRpb25zaGlwRGF0YSk7XG5cbiAgICAgIGNvbnN0IGluZGV4T2ZOZXdseUZvdW5kTW9kZWwgPSByZW1haW5pbmdNb2RlbHMuaW5kZXhPZihyZWxhdGlvbnNoaXBEYXRhKTtcbiAgICAgIGNvbnN0IG1vZGVsc0ZvclByb2Nlc3NpbmcgPSByZW1haW5pbmdNb2RlbHMuY29uY2F0KFtdKTtcblxuICAgICAgaWYgKGluZGV4T2ZOZXdseUZvdW5kTW9kZWwgIT09IC0xKSB7XG4gICAgICAgIG1vZGVsc0ZvclByb2Nlc3Npbmcuc3BsaWNlKGluZGV4T2ZOZXdseUZvdW5kTW9kZWwsIDEpO1xuICAgICAgICBuZXdPYmplY3Quc3luY1JlbGF0aW9uc2hpcHMocmVsYXRpb25zaGlwRGF0YSwgaW5jbHVkZWQsIG1vZGVsc0ZvclByb2Nlc3NpbmcpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3T2JqZWN0O1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmludGVybmFsRGF0YXN0b3JlLnBlZWtSZWNvcmQobW9kZWxUeXBlLCBpZCk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZU9yUGVlazxUIGV4dGVuZHMgSnNvbkFwaU1vZGVsPihtb2RlbFR5cGU6IE1vZGVsVHlwZTxUPiwgZGF0YTogYW55KTogVCB7XG4gICAgY29uc3QgcGVlayA9IHRoaXMuaW50ZXJuYWxEYXRhc3RvcmUucGVla1JlY29yZChtb2RlbFR5cGUsIGRhdGEuaWQpO1xuXG4gICAgaWYgKHBlZWspIHtcbiAgICAgIF8uZXh0ZW5kKHBlZWssIHRoaXMuaW50ZXJuYWxEYXRhc3RvcmUudHJhbnNmb3JtU2VyaWFsaXplZE5hbWVzVG9Qcm9wZXJ0eU5hbWVzKG1vZGVsVHlwZSwgZGF0YS5hdHRyaWJ1dGVzKSk7XG4gICAgICByZXR1cm4gcGVlaztcbiAgICB9XG5cbiAgICBjb25zdCBuZXdPYmplY3Q6IFQgPSB0aGlzLmludGVybmFsRGF0YXN0b3JlLmRlc2VyaWFsaXplTW9kZWwobW9kZWxUeXBlLCBkYXRhKTtcbiAgICB0aGlzLmludGVybmFsRGF0YXN0b3JlLmFkZFRvU3RvcmUobmV3T2JqZWN0KTtcblxuICAgIHJldHVybiBuZXdPYmplY3Q7XG4gIH1cbn1cbiJdfQ==