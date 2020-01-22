/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import find from 'lodash-es/find';
import { catchError, map } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { JsonApiModel } from '../models/json-api.model';
import { ErrorResponse } from '../models/error-response.model';
import { JsonApiQueryData } from '../models/json-api-query-data';
import * as qs from 'qs';
import { AttributeMetadata } from '../constants/symbols';
import 'reflect-metadata';
// tslint:disable-next-line:variable-name
/**
 * HACK/FIXME:
 * Type 'symbol' cannot be used as an index type.
 * TypeScript 2.9.x
 * See https://github.com/Microsoft/TypeScript/issues/24587.
 * @type {?}
 */
const AttributeMetadataIndex = (/** @type {?} */ (AttributeMetadata));
export class JsonApiDatastore {
    /**
     * @param {?} http
     */
    constructor(http) {
        this.http = http;
        this.globalRequestOptions = {};
        this.internalStore = {};
        this.toQueryString = this.datastoreConfig.overrides
            && this.datastoreConfig.overrides.toQueryString ?
            this.datastoreConfig.overrides.toQueryString : this._toQueryString;
    }
    /**
     * @param {?} headers
     * @return {?}
     */
    set headers(headers) {
        this.globalHeaders = headers;
    }
    /**
     * @param {?} requestOptions
     * @return {?}
     */
    set requestOptions(requestOptions) {
        this.globalRequestOptions = requestOptions;
    }
    /**
     * @return {?}
     */
    get datastoreConfig() {
        /** @type {?} */
        const configFromDecorator = Reflect.getMetadata('JsonApiDatastoreConfig', this.constructor);
        return Object.assign(configFromDecorator, this.config);
    }
    /**
     * @private
     * @return {?}
     */
    get getDirtyAttributes() {
        if (this.datastoreConfig.overrides
            && this.datastoreConfig.overrides.getDirtyAttributes) {
            return this.datastoreConfig.overrides.getDirtyAttributes;
        }
        return JsonApiDatastore.getDirtyAttributes;
    }
    /**
     * @private
     * @param {?} attributesMetadata
     * @return {?}
     */
    static getDirtyAttributes(attributesMetadata) {
        /** @type {?} */
        const dirtyData = {};
        for (const propertyName in attributesMetadata) {
            if (attributesMetadata.hasOwnProperty(propertyName)) {
                /** @type {?} */
                const metadata = attributesMetadata[propertyName];
                if (metadata.hasDirtyAttributes) {
                    /** @type {?} */
                    const attributeName = metadata.serializedName != null ? metadata.serializedName : propertyName;
                    dirtyData[attributeName] = metadata.serialisationValue ? metadata.serialisationValue : metadata.newValue;
                }
            }
        }
        return dirtyData;
    }
    /**
     * @deprecated use findAll method to take all models
     * @template T
     * @param {?} modelType
     * @param {?=} params
     * @param {?=} headers
     * @param {?=} customUrl
     * @return {?}
     */
    query(modelType, params, headers, customUrl) {
        /** @type {?} */
        const requestHeaders = this.buildHttpHeaders(headers);
        /** @type {?} */
        const url = this.buildUrl(modelType, params, undefined, customUrl);
        return this.http.get(url, { headers: requestHeaders })
            .pipe(map((/**
         * @param {?} res
         * @return {?}
         */
        (res) => this.extractQueryData(res, modelType))), catchError((/**
         * @param {?} res
         * @return {?}
         */
        (res) => this.handleError(res))));
    }
    /**
     * @template T
     * @param {?} modelType
     * @param {?=} params
     * @param {?=} headers
     * @param {?=} customUrl
     * @return {?}
     */
    findAll(modelType, params, headers, customUrl) {
        /** @type {?} */
        const url = this.buildUrl(modelType, params, undefined, customUrl);
        /** @type {?} */
        const requestOptions = this.buildRequestOptions({ headers, observe: 'response' });
        return this.http.get(url, requestOptions)
            .pipe(map((/**
         * @param {?} res
         * @return {?}
         */
        (res) => this.extractQueryData(res, modelType, true))), catchError((/**
         * @param {?} res
         * @return {?}
         */
        (res) => this.handleError(res))));
    }
    /**
     * @template T
     * @param {?} modelType
     * @param {?} id
     * @param {?=} params
     * @param {?=} headers
     * @param {?=} customUrl
     * @return {?}
     */
    findRecord(modelType, id, params, headers, customUrl) {
        /** @type {?} */
        const requestOptions = this.buildRequestOptions({ headers, observe: 'response' });
        /** @type {?} */
        const url = this.buildUrl(modelType, params, id, customUrl);
        return this.http.get(url, requestOptions)
            .pipe(map((/**
         * @param {?} res
         * @return {?}
         */
        (res) => this.extractRecordData(res, modelType))), catchError((/**
         * @param {?} res
         * @return {?}
         */
        (res) => this.handleError(res))));
    }
    /**
     * @template T
     * @param {?} modelType
     * @param {?=} data
     * @return {?}
     */
    createRecord(modelType, data) {
        return new modelType(this, { attributes: data });
    }
    /**
     * @template T
     * @param {?} attributesMetadata
     * @param {?} model
     * @param {?=} params
     * @param {?=} headers
     * @param {?=} customUrl
     * @return {?}
     */
    saveRecord(attributesMetadata, model, params, headers, customUrl) {
        /** @type {?} */
        const modelType = (/** @type {?} */ (model.constructor));
        /** @type {?} */
        const modelConfig = model.modelConfig;
        /** @type {?} */
        const typeName = modelConfig.type;
        /** @type {?} */
        const relationships = this.getRelationships(model);
        /** @type {?} */
        const url = this.buildUrl(modelType, params, model.id, customUrl);
        /** @type {?} */
        let httpCall;
        /** @type {?} */
        const body = {
            data: {
                relationships,
                type: typeName,
                id: model.id,
                attributes: this.getDirtyAttributes(attributesMetadata, model)
            }
        };
        /** @type {?} */
        const requestOptions = this.buildRequestOptions({ headers, observe: 'response' });
        if (model.id) {
            httpCall = (/** @type {?} */ (this.http.patch(url, body, requestOptions)));
        }
        else {
            httpCall = (/** @type {?} */ (this.http.post(url, body, requestOptions)));
        }
        return httpCall
            .pipe(map((/**
         * @param {?} res
         * @return {?}
         */
        (res) => [200, 201].indexOf(res.status) !== -1 ? this.extractRecordData(res, modelType, model) : model)), catchError((/**
         * @param {?} res
         * @return {?}
         */
        (res) => {
            if (res == null) {
                return of(model);
            }
            return this.handleError(res);
        })), map((/**
         * @param {?} res
         * @return {?}
         */
        (res) => this.updateRelationships(res, relationships))));
    }
    /**
     * @template T
     * @param {?} modelType
     * @param {?} id
     * @param {?=} headers
     * @param {?=} customUrl
     * @return {?}
     */
    deleteRecord(modelType, id, headers, customUrl) {
        /** @type {?} */
        const requestOptions = this.buildRequestOptions({ headers });
        /** @type {?} */
        const url = this.buildUrl(modelType, null, id, customUrl);
        return this.http.delete(url, requestOptions)
            .pipe(catchError((/**
         * @param {?} res
         * @return {?}
         */
        (res) => this.handleError(res))));
    }
    /**
     * @template T
     * @param {?} modelType
     * @param {?} id
     * @return {?}
     */
    peekRecord(modelType, id) {
        /** @type {?} */
        const type = Reflect.getMetadata('JsonApiModelConfig', modelType).type;
        return this.internalStore[type] ? (/** @type {?} */ (this.internalStore[type][id])) : null;
    }
    /**
     * @template T
     * @param {?} modelType
     * @return {?}
     */
    peekAll(modelType) {
        /** @type {?} */
        const type = Reflect.getMetadata('JsonApiModelConfig', modelType).type;
        /** @type {?} */
        const typeStore = this.internalStore[type];
        return typeStore ? Object.keys(typeStore).map((/**
         * @param {?} key
         * @return {?}
         */
        (key) => (/** @type {?} */ (typeStore[key])))) : [];
    }
    /**
     * @template T
     * @param {?} modelType
     * @param {?} data
     * @return {?}
     */
    deserializeModel(modelType, data) {
        data.attributes = this.transformSerializedNamesToPropertyNames(modelType, data.attributes);
        return new modelType(this, data);
    }
    /**
     * @param {?} modelOrModels
     * @return {?}
     */
    addToStore(modelOrModels) {
        /** @type {?} */
        const models = Array.isArray(modelOrModels) ? modelOrModels : [modelOrModels];
        /** @type {?} */
        const type = models[0].modelConfig.type;
        /** @type {?} */
        let typeStore = this.internalStore[type];
        if (!typeStore) {
            typeStore = this.internalStore[type] = {};
        }
        for (const model of models) {
            typeStore[model.id] = model;
        }
    }
    /**
     * @template T
     * @param {?} modelType
     * @param {?} attributes
     * @return {?}
     */
    transformSerializedNamesToPropertyNames(modelType, attributes) {
        /** @type {?} */
        const serializedNameToPropertyName = this.getModelPropertyNames(modelType.prototype);
        /** @type {?} */
        const properties = {};
        Object.keys(serializedNameToPropertyName).forEach((/**
         * @param {?} serializedName
         * @return {?}
         */
        (serializedName) => {
            if (attributes && attributes[serializedName] !== null && attributes[serializedName] !== undefined) {
                properties[serializedNameToPropertyName[serializedName]] = attributes[serializedName];
            }
        }));
        return properties;
    }
    /**
     * @protected
     * @template T
     * @param {?} modelType
     * @param {?=} params
     * @param {?=} id
     * @param {?=} customUrl
     * @return {?}
     */
    buildUrl(modelType, params, id, customUrl) {
        // TODO: use HttpParams instead of appending a string to the url
        /** @type {?} */
        const queryParams = this.toQueryString(params);
        if (customUrl) {
            return queryParams ? `${customUrl}?${queryParams}` : customUrl;
        }
        /** @type {?} */
        const modelConfig = Reflect.getMetadata('JsonApiModelConfig', modelType);
        /** @type {?} */
        const baseUrl = modelConfig.baseUrl || this.datastoreConfig.baseUrl;
        /** @type {?} */
        const apiVersion = modelConfig.apiVersion || this.datastoreConfig.apiVersion;
        /** @type {?} */
        const modelEndpointUrl = modelConfig.modelEndpointUrl || modelConfig.type;
        /** @type {?} */
        const url = [baseUrl, apiVersion, modelEndpointUrl, id].filter((/**
         * @param {?} x
         * @return {?}
         */
        (x) => x)).join('/');
        return queryParams ? `${url}?${queryParams}` : url;
    }
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    getRelationships(data) {
        /** @type {?} */
        let relationships;
        /** @type {?} */
        const belongsToMetadata = Reflect.getMetadata('BelongsTo', data) || [];
        /** @type {?} */
        const hasManyMetadata = Reflect.getMetadata('HasMany', data) || [];
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                if (data[key] instanceof JsonApiModel) {
                    relationships = relationships || {};
                    if (data[key].id) {
                        /** @type {?} */
                        const entity = belongsToMetadata.find((/**
                         * @param {?} it
                         * @return {?}
                         */
                        (it) => it.propertyName === key));
                        /** @type {?} */
                        const relationshipKey = entity.relationship;
                        relationships[relationshipKey] = {
                            data: this.buildSingleRelationshipData(data[key])
                        };
                    }
                }
                else if (data[key] instanceof Array) {
                    /** @type {?} */
                    const entity = hasManyMetadata.find((/**
                     * @param {?} it
                     * @return {?}
                     */
                    (it) => it.propertyName === key));
                    if (entity && this.isValidToManyRelation(data[key])) {
                        relationships = relationships || {};
                        /** @type {?} */
                        const relationshipKey = entity.relationship;
                        /** @type {?} */
                        const relationshipData = data[key]
                            .filter((/**
                         * @param {?} model
                         * @return {?}
                         */
                        (model) => model.id))
                            .map((/**
                         * @param {?} model
                         * @return {?}
                         */
                        (model) => this.buildSingleRelationshipData(model)));
                        relationships[relationshipKey] = {
                            data: relationshipData
                        };
                    }
                }
            }
        }
        return relationships;
    }
    /**
     * @protected
     * @param {?} objects
     * @return {?}
     */
    isValidToManyRelation(objects) {
        if (!objects.length) {
            return true;
        }
        /** @type {?} */
        const isJsonApiModel = objects.every((/**
         * @param {?} item
         * @return {?}
         */
        (item) => item instanceof JsonApiModel));
        if (!isJsonApiModel) {
            return false;
        }
        /** @type {?} */
        const types = objects.map((/**
         * @param {?} item
         * @return {?}
         */
        (item) => item.modelConfig.modelEndpointUrl || item.modelConfig.type));
        return types
            .filter((/**
         * @param {?} type
         * @param {?} index
         * @param {?} self
         * @return {?}
         */
        (type, index, self) => self.indexOf(type) === index))
            .length === 1;
    }
    /**
     * @protected
     * @param {?} model
     * @return {?}
     */
    buildSingleRelationshipData(model) {
        /** @type {?} */
        const relationshipType = model.modelConfig.type;
        /** @type {?} */
        const relationShipData = { type: relationshipType };
        if (model.id) {
            relationShipData.id = model.id;
        }
        else {
            /** @type {?} */
            const attributesMetadata = Reflect.getMetadata('Attribute', model);
            relationShipData.attributes = this.getDirtyAttributes(attributesMetadata, model);
        }
        return relationShipData;
    }
    /**
     * @protected
     * @template T
     * @param {?} response
     * @param {?} modelType
     * @param {?=} withMeta
     * @return {?}
     */
    extractQueryData(response, modelType, withMeta = false) {
        /** @type {?} */
        const body = response.body;
        /** @type {?} */
        const models = [];
        body.data.forEach((/**
         * @param {?} data
         * @return {?}
         */
        (data) => {
            /** @type {?} */
            let type = this.datastoreConfig.models[data.type];
            type = type ? type : modelType;
            /** @type {?} */
            const model = this.deserializeModel(type, data);
            this.addToStore(model);
            if (body.included) {
                model.syncRelationships(data, body.included.concat(data));
                this.addToStore(model);
            }
            models.push(model);
        }));
        if (withMeta && withMeta === true) {
            return new JsonApiQueryData(models, this.parseMeta(body, modelType));
        }
        return models;
    }
    /**
     * @protected
     * @template T
     * @param {?} res
     * @param {?} modelType
     * @param {?=} model
     * @return {?}
     */
    extractRecordData(res, modelType, model) {
        /** @type {?} */
        const body = res.body;
        // Error in Angular < 5.2.4 (see https://github.com/angular/angular/issues/20744)
        // null is converted to 'null', so this is temporary needed to make testcase possible
        // (and to avoid a decrease of the coverage)
        if (!body || body === 'null') {
            throw new Error('no body in response');
        }
        if (!body.data) {
            if (res.status === 201 || !model) {
                throw new Error('expected data in response');
            }
            return model;
        }
        if (model) {
            model.modelInitialization = true;
            model.id = body.data.id;
            Object.assign(model, body.data.attributes);
            model.modelInitialization = false;
        }
        /** @type {?} */
        const deserializedModel = model || this.deserializeModel(modelType, body.data);
        this.addToStore(deserializedModel);
        if (body.included) {
            deserializedModel.syncRelationships(body.data, body.included);
            this.addToStore(deserializedModel);
        }
        return deserializedModel;
    }
    /**
     * @protected
     * @param {?} error
     * @return {?}
     */
    handleError(error) {
        if (error instanceof HttpErrorResponse &&
            error.error instanceof Object &&
            error.error.errors &&
            error.error.errors instanceof Array) {
            /** @type {?} */
            const errors = new ErrorResponse(error.error.errors);
            return throwError(errors);
        }
        return throwError(error);
    }
    /**
     * @protected
     * @param {?} body
     * @param {?} modelType
     * @return {?}
     */
    parseMeta(body, modelType) {
        /** @type {?} */
        const metaModel = Reflect.getMetadata('JsonApiModelConfig', modelType).meta;
        return new metaModel(body);
    }
    /**
     * @deprecated use buildHttpHeaders method to build request headers
     * @protected
     * @param {?=} customHeaders
     * @return {?}
     */
    getOptions(customHeaders) {
        return {
            headers: this.buildHttpHeaders(customHeaders),
        };
    }
    /**
     * @protected
     * @param {?=} customHeaders
     * @return {?}
     */
    buildHttpHeaders(customHeaders) {
        /** @type {?} */
        let requestHeaders = new HttpHeaders({
            Accept: 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json'
        });
        if (this.globalHeaders) {
            this.globalHeaders.keys().forEach((/**
             * @param {?} key
             * @return {?}
             */
            (key) => {
                if (this.globalHeaders.has(key)) {
                    requestHeaders = requestHeaders.set(key, this.globalHeaders.get(key));
                }
            }));
        }
        if (customHeaders) {
            customHeaders.keys().forEach((/**
             * @param {?} key
             * @return {?}
             */
            (key) => {
                if (customHeaders.has(key)) {
                    requestHeaders = requestHeaders.set(key, customHeaders.get(key));
                }
            }));
        }
        return requestHeaders;
    }
    /**
     * @protected
     * @template T
     * @param {?} res
     * @param {?} attributesMetadata
     * @param {?} modelType
     * @return {?}
     */
    resetMetadataAttributes(res, attributesMetadata, modelType) {
        for (const propertyName in attributesMetadata) {
            if (attributesMetadata.hasOwnProperty(propertyName)) {
                /** @type {?} */
                const metadata = attributesMetadata[propertyName];
                if (metadata.hasDirtyAttributes) {
                    metadata.hasDirtyAttributes = false;
                }
            }
        }
        // @ts-ignore
        res[AttributeMetadataIndex] = attributesMetadata;
        return res;
    }
    /**
     * @protected
     * @template T
     * @param {?} model
     * @param {?} relationships
     * @return {?}
     */
    updateRelationships(model, relationships) {
        /** @type {?} */
        const modelsTypes = Reflect.getMetadata('JsonApiDatastoreConfig', this.constructor).models;
        for (const relationship in relationships) {
            if (relationships.hasOwnProperty(relationship) && model.hasOwnProperty(relationship)) {
                /** @type {?} */
                const relationshipModel = model[relationship];
                /** @type {?} */
                const hasMany = Reflect.getMetadata('HasMany', relationshipModel);
                /** @type {?} */
                const propertyHasMany = find(hasMany, (/**
                 * @param {?} property
                 * @return {?}
                 */
                (property) => {
                    return modelsTypes[property.relationship] === model.constructor;
                }));
                if (propertyHasMany) {
                    relationshipModel[propertyHasMany.propertyName] = relationshipModel[propertyHasMany.propertyName] || [];
                    /** @type {?} */
                    const indexOfModel = relationshipModel[propertyHasMany.propertyName].indexOf(model);
                    if (indexOfModel === -1) {
                        relationshipModel[propertyHasMany.propertyName].push(model);
                    }
                    else {
                        relationshipModel[propertyHasMany.propertyName][indexOfModel] = model;
                    }
                }
            }
        }
        return model;
    }
    /**
     * @protected
     * @param {?} model
     * @return {?}
     */
    getModelPropertyNames(model) {
        return Reflect.getMetadata('AttributeMapping', model) || [];
    }
    /**
     * @private
     * @param {?=} customOptions
     * @return {?}
     */
    buildRequestOptions(customOptions = {}) {
        /** @type {?} */
        const httpHeaders = this.buildHttpHeaders(customOptions.headers);
        /** @type {?} */
        const requestOptions = Object.assign(customOptions, {
            headers: httpHeaders
        });
        return Object.assign(this.globalRequestOptions, requestOptions);
    }
    /**
     * @private
     * @param {?} params
     * @return {?}
     */
    _toQueryString(params) {
        return qs.stringify(params, { arrayFormat: 'brackets' });
    }
}
JsonApiDatastore.decorators = [
    { type: Injectable }
];
/** @nocollapse */
JsonApiDatastore.ctorParameters = () => [
    { type: HttpClient }
];
if (false) {
    /**
     * @type {?}
     * @protected
     */
    JsonApiDatastore.prototype.config;
    /**
     * @type {?}
     * @private
     */
    JsonApiDatastore.prototype.globalHeaders;
    /**
     * @type {?}
     * @private
     */
    JsonApiDatastore.prototype.globalRequestOptions;
    /**
     * @type {?}
     * @private
     */
    JsonApiDatastore.prototype.internalStore;
    /**
     * @type {?}
     * @private
     */
    JsonApiDatastore.prototype.toQueryString;
    /**
     * @type {?}
     * @protected
     */
    JsonApiDatastore.prototype.http;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi1hcGktZGF0YXN0b3JlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyMi1qc29uYXBpLyIsInNvdXJjZXMiOlsic2VydmljZXMvanNvbi1hcGktZGF0YXN0b3JlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxXQUFXLEVBQWdCLE1BQU0sc0JBQXNCLENBQUM7QUFDaEcsT0FBTyxJQUFJLE1BQU0sZ0JBQWdCLENBQUM7QUFDbEMsT0FBTyxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNqRCxPQUFPLEVBQWMsRUFBRSxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNsRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDeEQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQy9ELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQ2pFLE9BQU8sS0FBSyxFQUFFLE1BQU0sSUFBSSxDQUFDO0FBR3pCLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3pELE9BQU8sa0JBQWtCLENBQUM7Ozs7Ozs7OztNQVdwQixzQkFBc0IsR0FBVyxtQkFBQSxpQkFBaUIsRUFBTztBQUcvRCxNQUFNLE9BQU8sZ0JBQWdCOzs7O0lBVTNCLFlBQXNCLElBQWdCO1FBQWhCLFNBQUksR0FBSixJQUFJLENBQVk7UUFOOUIseUJBQW9CLEdBQVcsRUFBRSxDQUFDO1FBQ2xDLGtCQUFhLEdBQXVELEVBQUUsQ0FBQztRQUN2RSxrQkFBYSxHQUE0QixJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVM7ZUFDNUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsYUFB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QUFDLFdBQVcsRUFBRSxVQUFVLEVBQUMsQ0FBQyxDQUFDO0lBQ3pELENBQUM7OztZQTlkRixVQUFVOzs7O1lBeEJGLFVBQVU7Ozs7Ozs7SUEyQmpCLGtDQUFrQzs7Ozs7SUFDbEMseUNBQW1DOzs7OztJQUNuQyxnREFBMEM7Ozs7O0lBQzFDLHlDQUErRTs7Ozs7SUFDL0UseUNBRXFFOzs7OztJQUV6RCxnQ0FBMEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwRXJyb3JSZXNwb25zZSwgSHR0cEhlYWRlcnMsIEh0dHBSZXNwb25zZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCBmaW5kIGZyb20gJ2xvZGFzaC1lcy9maW5kJztcbmltcG9ydCB7IGNhdGNoRXJyb3IsIG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IE9ic2VydmFibGUsIG9mLCB0aHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBKc29uQXBpTW9kZWwgfSBmcm9tICcuLi9tb2RlbHMvanNvbi1hcGkubW9kZWwnO1xuaW1wb3J0IHsgRXJyb3JSZXNwb25zZSB9IGZyb20gJy4uL21vZGVscy9lcnJvci1yZXNwb25zZS5tb2RlbCc7XG5pbXBvcnQgeyBKc29uQXBpUXVlcnlEYXRhIH0gZnJvbSAnLi4vbW9kZWxzL2pzb24tYXBpLXF1ZXJ5LWRhdGEnO1xuaW1wb3J0ICogYXMgcXMgZnJvbSAncXMnO1xuaW1wb3J0IHsgRGF0YXN0b3JlQ29uZmlnIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9kYXRhc3RvcmUtY29uZmlnLmludGVyZmFjZSc7XG5pbXBvcnQgeyBNb2RlbENvbmZpZyB9IGZyb20gJy4uL2ludGVyZmFjZXMvbW9kZWwtY29uZmlnLmludGVyZmFjZSc7XG5pbXBvcnQgeyBBdHRyaWJ1dGVNZXRhZGF0YSB9IGZyb20gJy4uL2NvbnN0YW50cy9zeW1ib2xzJztcbmltcG9ydCAncmVmbGVjdC1tZXRhZGF0YSc7XG5cbmV4cG9ydCB0eXBlIE1vZGVsVHlwZTxUIGV4dGVuZHMgSnNvbkFwaU1vZGVsPiA9IG5ldyhkYXRhc3RvcmU6IEpzb25BcGlEYXRhc3RvcmUsIGRhdGE6IGFueSkgPT4gVDtcblxuLyoqXG4gKiBIQUNLL0ZJWE1FOlxuICogVHlwZSAnc3ltYm9sJyBjYW5ub3QgYmUgdXNlZCBhcyBhbiBpbmRleCB0eXBlLlxuICogVHlwZVNjcmlwdCAyLjkueFxuICogU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMjQ1ODcuXG4gKi9cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lXG5jb25zdCBBdHRyaWJ1dGVNZXRhZGF0YUluZGV4OiBzdHJpbmcgPSBBdHRyaWJ1dGVNZXRhZGF0YSBhcyBhbnk7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBKc29uQXBpRGF0YXN0b3JlIHtcblxuICBwcm90ZWN0ZWQgY29uZmlnOiBEYXRhc3RvcmVDb25maWc7XG4gIHByaXZhdGUgZ2xvYmFsSGVhZGVyczogSHR0cEhlYWRlcnM7XG4gIHByaXZhdGUgZ2xvYmFsUmVxdWVzdE9wdGlvbnM6IG9iamVjdCA9IHt9O1xuICBwcml2YXRlIGludGVybmFsU3RvcmU6IHsgW3R5cGU6IHN0cmluZ106IHsgW2lkOiBzdHJpbmddOiBKc29uQXBpTW9kZWwgfSB9ID0ge307XG4gIHByaXZhdGUgdG9RdWVyeVN0cmluZzogKHBhcmFtczogYW55KSA9PiBzdHJpbmcgPSB0aGlzLmRhdGFzdG9yZUNvbmZpZy5vdmVycmlkZXNcbiAgJiYgdGhpcy5kYXRhc3RvcmVDb25maWcub3ZlcnJpZGVzLnRvUXVlcnlTdHJpbmcgP1xuICAgIHRoaXMuZGF0YXN0b3JlQ29uZmlnLm92ZXJyaWRlcy50b1F1ZXJ5U3RyaW5nIDogdGhpcy5fdG9RdWVyeVN0cmluZztcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgaHR0cDogSHR0cENsaWVudCkge1xuICB9XG5cbiAgc2V0IGhlYWRlcnMoaGVhZGVyczogSHR0cEhlYWRlcnMpIHtcbiAgICB0aGlzLmdsb2JhbEhlYWRlcnMgPSBoZWFkZXJzO1xuICB9XG5cbiAgc2V0IHJlcXVlc3RPcHRpb25zKHJlcXVlc3RPcHRpb25zOiBvYmplY3QpIHtcbiAgICB0aGlzLmdsb2JhbFJlcXVlc3RPcHRpb25zID0gcmVxdWVzdE9wdGlvbnM7XG4gIH1cblxuICBwdWJsaWMgZ2V0IGRhdGFzdG9yZUNvbmZpZygpOiBEYXRhc3RvcmVDb25maWcge1xuICAgIGNvbnN0IGNvbmZpZ0Zyb21EZWNvcmF0b3I6IERhdGFzdG9yZUNvbmZpZyA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ0pzb25BcGlEYXRhc3RvcmVDb25maWcnLCB0aGlzLmNvbnN0cnVjdG9yKTtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihjb25maWdGcm9tRGVjb3JhdG9yLCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBwcml2YXRlIGdldCBnZXREaXJ0eUF0dHJpYnV0ZXMoKSB7XG4gICAgaWYgKHRoaXMuZGF0YXN0b3JlQ29uZmlnLm92ZXJyaWRlc1xuICAgICAgJiYgdGhpcy5kYXRhc3RvcmVDb25maWcub3ZlcnJpZGVzLmdldERpcnR5QXR0cmlidXRlcykge1xuICAgICAgcmV0dXJuIHRoaXMuZGF0YXN0b3JlQ29uZmlnLm92ZXJyaWRlcy5nZXREaXJ0eUF0dHJpYnV0ZXM7XG4gICAgfVxuICAgIHJldHVybiBKc29uQXBpRGF0YXN0b3JlLmdldERpcnR5QXR0cmlidXRlcztcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIGdldERpcnR5QXR0cmlidXRlcyhhdHRyaWJ1dGVzTWV0YWRhdGE6IGFueSk6IHsgc3RyaW5nOiBhbnkgfSB7XG4gICAgY29uc3QgZGlydHlEYXRhOiBhbnkgPSB7fTtcblxuICAgIGZvciAoY29uc3QgcHJvcGVydHlOYW1lIGluIGF0dHJpYnV0ZXNNZXRhZGF0YSkge1xuICAgICAgaWYgKGF0dHJpYnV0ZXNNZXRhZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgIGNvbnN0IG1ldGFkYXRhOiBhbnkgPSBhdHRyaWJ1dGVzTWV0YWRhdGFbcHJvcGVydHlOYW1lXTtcblxuICAgICAgICBpZiAobWV0YWRhdGEuaGFzRGlydHlBdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgY29uc3QgYXR0cmlidXRlTmFtZSA9IG1ldGFkYXRhLnNlcmlhbGl6ZWROYW1lICE9IG51bGwgPyBtZXRhZGF0YS5zZXJpYWxpemVkTmFtZSA6IHByb3BlcnR5TmFtZTtcbiAgICAgICAgICBkaXJ0eURhdGFbYXR0cmlidXRlTmFtZV0gPSBtZXRhZGF0YS5zZXJpYWxpc2F0aW9uVmFsdWUgPyBtZXRhZGF0YS5zZXJpYWxpc2F0aW9uVmFsdWUgOiBtZXRhZGF0YS5uZXdWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGlydHlEYXRhO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIHVzZSBmaW5kQWxsIG1ldGhvZCB0byB0YWtlIGFsbCBtb2RlbHNcbiAgICovXG4gIHF1ZXJ5PFQgZXh0ZW5kcyBKc29uQXBpTW9kZWw+KFxuICAgIG1vZGVsVHlwZTogTW9kZWxUeXBlPFQ+LFxuICAgIHBhcmFtcz86IGFueSxcbiAgICBoZWFkZXJzPzogSHR0cEhlYWRlcnMsXG4gICAgY3VzdG9tVXJsPzogc3RyaW5nXG4gICk6IE9ic2VydmFibGU8VFtdPiB7XG4gICAgY29uc3QgcmVxdWVzdEhlYWRlcnM6IEh0dHBIZWFkZXJzID0gdGhpcy5idWlsZEh0dHBIZWFkZXJzKGhlYWRlcnMpO1xuICAgIGNvbnN0IHVybDogc3RyaW5nID0gdGhpcy5idWlsZFVybChtb2RlbFR5cGUsIHBhcmFtcywgdW5kZWZpbmVkLCBjdXN0b21VcmwpO1xuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KHVybCwge2hlYWRlcnM6IHJlcXVlc3RIZWFkZXJzfSlcbiAgICAgIC5waXBlKFxuICAgICAgICBtYXAoKHJlczogYW55KSA9PiB0aGlzLmV4dHJhY3RRdWVyeURhdGEocmVzLCBtb2RlbFR5cGUpKSxcbiAgICAgICAgY2F0Y2hFcnJvcigocmVzOiBhbnkpID0+IHRoaXMuaGFuZGxlRXJyb3IocmVzKSlcbiAgICAgICk7XG4gIH1cblxuICBwdWJsaWMgZmluZEFsbDxUIGV4dGVuZHMgSnNvbkFwaU1vZGVsPihcbiAgICBtb2RlbFR5cGU6IE1vZGVsVHlwZTxUPixcbiAgICBwYXJhbXM/OiBhbnksXG4gICAgaGVhZGVycz86IEh0dHBIZWFkZXJzLFxuICAgIGN1c3RvbVVybD86IHN0cmluZ1xuICApOiBPYnNlcnZhYmxlPEpzb25BcGlRdWVyeURhdGE8VD4+IHtcbiAgICBjb25zdCB1cmw6IHN0cmluZyA9IHRoaXMuYnVpbGRVcmwobW9kZWxUeXBlLCBwYXJhbXMsIHVuZGVmaW5lZCwgY3VzdG9tVXJsKTtcbiAgICBjb25zdCByZXF1ZXN0T3B0aW9uczogb2JqZWN0ID0gdGhpcy5idWlsZFJlcXVlc3RPcHRpb25zKHtoZWFkZXJzLCBvYnNlcnZlOiAncmVzcG9uc2UnfSk7XG5cbiAgICByZXR1cm4gdGhpcy5odHRwLmdldCh1cmwsIHJlcXVlc3RPcHRpb25zKVxuICAgICAgLnBpcGUoXG4gICAgICAgIG1hcCgocmVzOiBIdHRwUmVzcG9uc2U8b2JqZWN0PikgPT4gdGhpcy5leHRyYWN0UXVlcnlEYXRhKHJlcywgbW9kZWxUeXBlLCB0cnVlKSksXG4gICAgICAgIGNhdGNoRXJyb3IoKHJlczogYW55KSA9PiB0aGlzLmhhbmRsZUVycm9yKHJlcykpXG4gICAgICApO1xuICB9XG5cbiAgcHVibGljIGZpbmRSZWNvcmQ8VCBleHRlbmRzIEpzb25BcGlNb2RlbD4oXG4gICAgbW9kZWxUeXBlOiBNb2RlbFR5cGU8VD4sXG4gICAgaWQ6IHN0cmluZyxcbiAgICBwYXJhbXM/OiBhbnksXG4gICAgaGVhZGVycz86IEh0dHBIZWFkZXJzLFxuICAgIGN1c3RvbVVybD86IHN0cmluZ1xuICApOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBjb25zdCByZXF1ZXN0T3B0aW9uczogb2JqZWN0ID0gdGhpcy5idWlsZFJlcXVlc3RPcHRpb25zKHtoZWFkZXJzLCBvYnNlcnZlOiAncmVzcG9uc2UnfSk7XG4gICAgY29uc3QgdXJsOiBzdHJpbmcgPSB0aGlzLmJ1aWxkVXJsKG1vZGVsVHlwZSwgcGFyYW1zLCBpZCwgY3VzdG9tVXJsKTtcblxuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KHVybCwgcmVxdWVzdE9wdGlvbnMpXG4gICAgICAucGlwZShcbiAgICAgICAgbWFwKChyZXM6IEh0dHBSZXNwb25zZTxvYmplY3Q+KSA9PiB0aGlzLmV4dHJhY3RSZWNvcmREYXRhKHJlcywgbW9kZWxUeXBlKSksXG4gICAgICAgIGNhdGNoRXJyb3IoKHJlczogYW55KSA9PiB0aGlzLmhhbmRsZUVycm9yKHJlcykpXG4gICAgICApO1xuICB9XG5cbiAgcHVibGljIGNyZWF0ZVJlY29yZDxUIGV4dGVuZHMgSnNvbkFwaU1vZGVsPihtb2RlbFR5cGU6IE1vZGVsVHlwZTxUPiwgZGF0YT86IGFueSk6IFQge1xuICAgIHJldHVybiBuZXcgbW9kZWxUeXBlKHRoaXMsIHthdHRyaWJ1dGVzOiBkYXRhfSk7XG4gIH1cblxuICBwdWJsaWMgc2F2ZVJlY29yZDxUIGV4dGVuZHMgSnNvbkFwaU1vZGVsPihcbiAgICBhdHRyaWJ1dGVzTWV0YWRhdGE6IGFueSxcbiAgICBtb2RlbDogVCxcbiAgICBwYXJhbXM/OiBhbnksXG4gICAgaGVhZGVycz86IEh0dHBIZWFkZXJzLFxuICAgIGN1c3RvbVVybD86IHN0cmluZ1xuICApOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBjb25zdCBtb2RlbFR5cGUgPSBtb2RlbC5jb25zdHJ1Y3RvciBhcyBNb2RlbFR5cGU8VD47XG4gICAgY29uc3QgbW9kZWxDb25maWc6IE1vZGVsQ29uZmlnID0gbW9kZWwubW9kZWxDb25maWc7XG4gICAgY29uc3QgdHlwZU5hbWU6IHN0cmluZyA9IG1vZGVsQ29uZmlnLnR5cGU7XG4gICAgY29uc3QgcmVsYXRpb25zaGlwczogYW55ID0gdGhpcy5nZXRSZWxhdGlvbnNoaXBzKG1vZGVsKTtcbiAgICBjb25zdCB1cmw6IHN0cmluZyA9IHRoaXMuYnVpbGRVcmwobW9kZWxUeXBlLCBwYXJhbXMsIG1vZGVsLmlkLCBjdXN0b21VcmwpO1xuXG4gICAgbGV0IGh0dHBDYWxsOiBPYnNlcnZhYmxlPEh0dHBSZXNwb25zZTxvYmplY3Q+PjtcbiAgICBjb25zdCBib2R5OiBhbnkgPSB7XG4gICAgICBkYXRhOiB7XG4gICAgICAgIHJlbGF0aW9uc2hpcHMsXG4gICAgICAgIHR5cGU6IHR5cGVOYW1lLFxuICAgICAgICBpZDogbW9kZWwuaWQsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHRoaXMuZ2V0RGlydHlBdHRyaWJ1dGVzKGF0dHJpYnV0ZXNNZXRhZGF0YSwgbW9kZWwpXG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IHJlcXVlc3RPcHRpb25zOiBvYmplY3QgPSB0aGlzLmJ1aWxkUmVxdWVzdE9wdGlvbnMoe2hlYWRlcnMsIG9ic2VydmU6ICdyZXNwb25zZSd9KTtcblxuICAgIGlmIChtb2RlbC5pZCkge1xuICAgICAgaHR0cENhbGwgPSB0aGlzLmh0dHAucGF0Y2g8b2JqZWN0Pih1cmwsIGJvZHksIHJlcXVlc3RPcHRpb25zKSBhcyBPYnNlcnZhYmxlPEh0dHBSZXNwb25zZTxvYmplY3Q+PjtcbiAgICB9IGVsc2Uge1xuICAgICAgaHR0cENhbGwgPSB0aGlzLmh0dHAucG9zdDxvYmplY3Q+KHVybCwgYm9keSwgcmVxdWVzdE9wdGlvbnMpIGFzIE9ic2VydmFibGU8SHR0cFJlc3BvbnNlPG9iamVjdD4+O1xuICAgIH1cblxuICAgIHJldHVybiBodHRwQ2FsbFxuICAgICAgLnBpcGUoXG4gICAgICAgIG1hcCgocmVzKSA9PiBbMjAwLCAyMDFdLmluZGV4T2YocmVzLnN0YXR1cykgIT09IC0xID8gdGhpcy5leHRyYWN0UmVjb3JkRGF0YShyZXMsIG1vZGVsVHlwZSwgbW9kZWwpIDogbW9kZWwpLFxuICAgICAgICBjYXRjaEVycm9yKChyZXMpID0+IHtcbiAgICAgICAgICBpZiAocmVzID09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBvZihtb2RlbCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZUVycm9yKHJlcyk7XG4gICAgICAgIH0pLFxuICAgICAgICBtYXAoKHJlcykgPT4gdGhpcy51cGRhdGVSZWxhdGlvbnNoaXBzKHJlcywgcmVsYXRpb25zaGlwcykpXG4gICAgICApO1xuICB9XG5cbiAgcHVibGljIGRlbGV0ZVJlY29yZDxUIGV4dGVuZHMgSnNvbkFwaU1vZGVsPihcbiAgICBtb2RlbFR5cGU6IE1vZGVsVHlwZTxUPixcbiAgICBpZDogc3RyaW5nLFxuICAgIGhlYWRlcnM/OiBIdHRwSGVhZGVycyxcbiAgICBjdXN0b21Vcmw/OiBzdHJpbmdcbiAgKTogT2JzZXJ2YWJsZTxSZXNwb25zZT4ge1xuICAgIGNvbnN0IHJlcXVlc3RPcHRpb25zOiBvYmplY3QgPSB0aGlzLmJ1aWxkUmVxdWVzdE9wdGlvbnMoe2hlYWRlcnN9KTtcbiAgICBjb25zdCB1cmw6IHN0cmluZyA9IHRoaXMuYnVpbGRVcmwobW9kZWxUeXBlLCBudWxsLCBpZCwgY3VzdG9tVXJsKTtcblxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKHVybCwgcmVxdWVzdE9wdGlvbnMpXG4gICAgICAucGlwZShcbiAgICAgICAgY2F0Y2hFcnJvcigocmVzOiBIdHRwRXJyb3JSZXNwb25zZSkgPT4gdGhpcy5oYW5kbGVFcnJvcihyZXMpKVxuICAgICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBwZWVrUmVjb3JkPFQgZXh0ZW5kcyBKc29uQXBpTW9kZWw+KG1vZGVsVHlwZTogTW9kZWxUeXBlPFQ+LCBpZDogc3RyaW5nKTogVCB8IG51bGwge1xuICAgIGNvbnN0IHR5cGU6IHN0cmluZyA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ0pzb25BcGlNb2RlbENvbmZpZycsIG1vZGVsVHlwZSkudHlwZTtcbiAgICByZXR1cm4gdGhpcy5pbnRlcm5hbFN0b3JlW3R5cGVdID8gdGhpcy5pbnRlcm5hbFN0b3JlW3R5cGVdW2lkXSBhcyBUIDogbnVsbDtcbiAgfVxuXG4gIHB1YmxpYyBwZWVrQWxsPFQgZXh0ZW5kcyBKc29uQXBpTW9kZWw+KG1vZGVsVHlwZTogTW9kZWxUeXBlPFQ+KTogQXJyYXk8VD4ge1xuICAgIGNvbnN0IHR5cGUgPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdKc29uQXBpTW9kZWxDb25maWcnLCBtb2RlbFR5cGUpLnR5cGU7XG4gICAgY29uc3QgdHlwZVN0b3JlID0gdGhpcy5pbnRlcm5hbFN0b3JlW3R5cGVdO1xuICAgIHJldHVybiB0eXBlU3RvcmUgPyBPYmplY3Qua2V5cyh0eXBlU3RvcmUpLm1hcCgoa2V5KSA9PiB0eXBlU3RvcmVba2V5XSBhcyBUKSA6IFtdO1xuICB9XG5cbiAgcHVibGljIGRlc2VyaWFsaXplTW9kZWw8VCBleHRlbmRzIEpzb25BcGlNb2RlbD4obW9kZWxUeXBlOiBNb2RlbFR5cGU8VD4sIGRhdGE6IGFueSkge1xuICAgIGRhdGEuYXR0cmlidXRlcyA9IHRoaXMudHJhbnNmb3JtU2VyaWFsaXplZE5hbWVzVG9Qcm9wZXJ0eU5hbWVzKG1vZGVsVHlwZSwgZGF0YS5hdHRyaWJ1dGVzKTtcbiAgICByZXR1cm4gbmV3IG1vZGVsVHlwZSh0aGlzLCBkYXRhKTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRUb1N0b3JlKG1vZGVsT3JNb2RlbHM6IEpzb25BcGlNb2RlbCB8IEpzb25BcGlNb2RlbFtdKTogdm9pZCB7XG4gICAgY29uc3QgbW9kZWxzID0gQXJyYXkuaXNBcnJheShtb2RlbE9yTW9kZWxzKSA/IG1vZGVsT3JNb2RlbHMgOiBbbW9kZWxPck1vZGVsc107XG4gICAgY29uc3QgdHlwZTogc3RyaW5nID0gbW9kZWxzWzBdLm1vZGVsQ29uZmlnLnR5cGU7XG4gICAgbGV0IHR5cGVTdG9yZSA9IHRoaXMuaW50ZXJuYWxTdG9yZVt0eXBlXTtcblxuICAgIGlmICghdHlwZVN0b3JlKSB7XG4gICAgICB0eXBlU3RvcmUgPSB0aGlzLmludGVybmFsU3RvcmVbdHlwZV0gPSB7fTtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IG1vZGVsIG9mIG1vZGVscykge1xuICAgICAgdHlwZVN0b3JlW21vZGVsLmlkXSA9IG1vZGVsO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB0cmFuc2Zvcm1TZXJpYWxpemVkTmFtZXNUb1Byb3BlcnR5TmFtZXM8VCBleHRlbmRzIEpzb25BcGlNb2RlbD4obW9kZWxUeXBlOiBNb2RlbFR5cGU8VD4sIGF0dHJpYnV0ZXM6IGFueSkge1xuICAgIGNvbnN0IHNlcmlhbGl6ZWROYW1lVG9Qcm9wZXJ0eU5hbWUgPSB0aGlzLmdldE1vZGVsUHJvcGVydHlOYW1lcyhtb2RlbFR5cGUucHJvdG90eXBlKTtcbiAgICBjb25zdCBwcm9wZXJ0aWVzOiBhbnkgPSB7fTtcblxuICAgIE9iamVjdC5rZXlzKHNlcmlhbGl6ZWROYW1lVG9Qcm9wZXJ0eU5hbWUpLmZvckVhY2goKHNlcmlhbGl6ZWROYW1lKSA9PiB7XG4gICAgICBpZiAoYXR0cmlidXRlcyAmJiBhdHRyaWJ1dGVzW3NlcmlhbGl6ZWROYW1lXSAhPT0gbnVsbCAmJiBhdHRyaWJ1dGVzW3NlcmlhbGl6ZWROYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHByb3BlcnRpZXNbc2VyaWFsaXplZE5hbWVUb1Byb3BlcnR5TmFtZVtzZXJpYWxpemVkTmFtZV1dID0gYXR0cmlidXRlc1tzZXJpYWxpemVkTmFtZV07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvcGVydGllcztcbiAgfVxuXG4gIHByb3RlY3RlZCBidWlsZFVybDxUIGV4dGVuZHMgSnNvbkFwaU1vZGVsPihcbiAgICBtb2RlbFR5cGU6IE1vZGVsVHlwZTxUPixcbiAgICBwYXJhbXM/OiBhbnksXG4gICAgaWQ/OiBzdHJpbmcsXG4gICAgY3VzdG9tVXJsPzogc3RyaW5nXG4gICk6IHN0cmluZyB7XG4gICAgLy8gVE9ETzogdXNlIEh0dHBQYXJhbXMgaW5zdGVhZCBvZiBhcHBlbmRpbmcgYSBzdHJpbmcgdG8gdGhlIHVybFxuICAgIGNvbnN0IHF1ZXJ5UGFyYW1zOiBzdHJpbmcgPSB0aGlzLnRvUXVlcnlTdHJpbmcocGFyYW1zKTtcblxuICAgIGlmIChjdXN0b21VcmwpIHtcbiAgICAgIHJldHVybiBxdWVyeVBhcmFtcyA/IGAke2N1c3RvbVVybH0/JHtxdWVyeVBhcmFtc31gIDogY3VzdG9tVXJsO1xuICAgIH1cblxuICAgIGNvbnN0IG1vZGVsQ29uZmlnOiBNb2RlbENvbmZpZyA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ0pzb25BcGlNb2RlbENvbmZpZycsIG1vZGVsVHlwZSk7XG5cbiAgICBjb25zdCBiYXNlVXJsID0gbW9kZWxDb25maWcuYmFzZVVybCB8fCB0aGlzLmRhdGFzdG9yZUNvbmZpZy5iYXNlVXJsO1xuICAgIGNvbnN0IGFwaVZlcnNpb24gPSBtb2RlbENvbmZpZy5hcGlWZXJzaW9uIHx8IHRoaXMuZGF0YXN0b3JlQ29uZmlnLmFwaVZlcnNpb247XG4gICAgY29uc3QgbW9kZWxFbmRwb2ludFVybDogc3RyaW5nID0gbW9kZWxDb25maWcubW9kZWxFbmRwb2ludFVybCB8fCBtb2RlbENvbmZpZy50eXBlO1xuXG4gICAgY29uc3QgdXJsOiBzdHJpbmcgPSBbYmFzZVVybCwgYXBpVmVyc2lvbiwgbW9kZWxFbmRwb2ludFVybCwgaWRdLmZpbHRlcigoeCkgPT4geCkuam9pbignLycpO1xuXG4gICAgcmV0dXJuIHF1ZXJ5UGFyYW1zID8gYCR7dXJsfT8ke3F1ZXJ5UGFyYW1zfWAgOiB1cmw7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0UmVsYXRpb25zaGlwcyhkYXRhOiBhbnkpOiBhbnkge1xuICAgIGxldCByZWxhdGlvbnNoaXBzOiBhbnk7XG5cbiAgICBjb25zdCBiZWxvbmdzVG9NZXRhZGF0YTogYW55W10gPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdCZWxvbmdzVG8nLCBkYXRhKSB8fCBbXTtcbiAgICBjb25zdCBoYXNNYW55TWV0YWRhdGE6IGFueVtdID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnSGFzTWFueScsIGRhdGEpIHx8IFtdO1xuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gZGF0YSkge1xuICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBpZiAoZGF0YVtrZXldIGluc3RhbmNlb2YgSnNvbkFwaU1vZGVsKSB7XG4gICAgICAgICAgcmVsYXRpb25zaGlwcyA9IHJlbGF0aW9uc2hpcHMgfHwge307XG5cbiAgICAgICAgICBpZiAoZGF0YVtrZXldLmlkKSB7XG4gICAgICAgICAgICBjb25zdCBlbnRpdHkgPSBiZWxvbmdzVG9NZXRhZGF0YS5maW5kKChpdDogYW55KSA9PiBpdC5wcm9wZXJ0eU5hbWUgPT09IGtleSk7XG4gICAgICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBLZXkgPSBlbnRpdHkucmVsYXRpb25zaGlwO1xuICAgICAgICAgICAgcmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBLZXldID0ge1xuICAgICAgICAgICAgICBkYXRhOiB0aGlzLmJ1aWxkU2luZ2xlUmVsYXRpb25zaGlwRGF0YShkYXRhW2tleV0pXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChkYXRhW2tleV0gaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgIGNvbnN0IGVudGl0eSA9IGhhc01hbnlNZXRhZGF0YS5maW5kKChpdDogYW55KSA9PiBpdC5wcm9wZXJ0eU5hbWUgPT09IGtleSk7XG4gICAgICAgICAgaWYgKGVudGl0eSAmJiB0aGlzLmlzVmFsaWRUb01hbnlSZWxhdGlvbihkYXRhW2tleV0pKSB7XG4gICAgICAgICAgICByZWxhdGlvbnNoaXBzID0gcmVsYXRpb25zaGlwcyB8fCB7fTtcblxuICAgICAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwS2V5ID0gZW50aXR5LnJlbGF0aW9uc2hpcDtcbiAgICAgICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcERhdGEgPSBkYXRhW2tleV1cbiAgICAgICAgICAgICAgLmZpbHRlcigobW9kZWw6IEpzb25BcGlNb2RlbCkgPT4gbW9kZWwuaWQpXG4gICAgICAgICAgICAgIC5tYXAoKG1vZGVsOiBKc29uQXBpTW9kZWwpID0+IHRoaXMuYnVpbGRTaW5nbGVSZWxhdGlvbnNoaXBEYXRhKG1vZGVsKSk7XG5cbiAgICAgICAgICAgIHJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwS2V5XSA9IHtcbiAgICAgICAgICAgICAgZGF0YTogcmVsYXRpb25zaGlwRGF0YVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVsYXRpb25zaGlwcztcbiAgfVxuXG4gIHByb3RlY3RlZCBpc1ZhbGlkVG9NYW55UmVsYXRpb24ob2JqZWN0czogQXJyYXk8YW55Pik6IGJvb2xlYW4ge1xuICAgIGlmICghb2JqZWN0cy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBjb25zdCBpc0pzb25BcGlNb2RlbCA9IG9iamVjdHMuZXZlcnkoKGl0ZW0pID0+IGl0ZW0gaW5zdGFuY2VvZiBKc29uQXBpTW9kZWwpO1xuICAgIGlmICghaXNKc29uQXBpTW9kZWwpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgdHlwZXMgPSBvYmplY3RzLm1hcCgoaXRlbTogSnNvbkFwaU1vZGVsKSA9PiBpdGVtLm1vZGVsQ29uZmlnLm1vZGVsRW5kcG9pbnRVcmwgfHwgaXRlbS5tb2RlbENvbmZpZy50eXBlKTtcbiAgICByZXR1cm4gdHlwZXNcbiAgICAgIC5maWx0ZXIoKHR5cGU6IHN0cmluZywgaW5kZXg6IG51bWJlciwgc2VsZjogc3RyaW5nW10pID0+IHNlbGYuaW5kZXhPZih0eXBlKSA9PT0gaW5kZXgpXG4gICAgICAubGVuZ3RoID09PSAxO1xuICB9XG5cbiAgcHJvdGVjdGVkIGJ1aWxkU2luZ2xlUmVsYXRpb25zaGlwRGF0YShtb2RlbDogSnNvbkFwaU1vZGVsKTogYW55IHtcbiAgICBjb25zdCByZWxhdGlvbnNoaXBUeXBlOiBzdHJpbmcgPSBtb2RlbC5tb2RlbENvbmZpZy50eXBlO1xuICAgIGNvbnN0IHJlbGF0aW9uU2hpcERhdGE6IHsgdHlwZTogc3RyaW5nLCBpZD86IHN0cmluZywgYXR0cmlidXRlcz86IGFueSB9ID0ge3R5cGU6IHJlbGF0aW9uc2hpcFR5cGV9O1xuXG4gICAgaWYgKG1vZGVsLmlkKSB7XG4gICAgICByZWxhdGlvblNoaXBEYXRhLmlkID0gbW9kZWwuaWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGF0dHJpYnV0ZXNNZXRhZGF0YTogYW55ID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnQXR0cmlidXRlJywgbW9kZWwpO1xuICAgICAgcmVsYXRpb25TaGlwRGF0YS5hdHRyaWJ1dGVzID0gdGhpcy5nZXREaXJ0eUF0dHJpYnV0ZXMoYXR0cmlidXRlc01ldGFkYXRhLCBtb2RlbCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlbGF0aW9uU2hpcERhdGE7XG4gIH1cblxuICBwcm90ZWN0ZWQgZXh0cmFjdFF1ZXJ5RGF0YTxUIGV4dGVuZHMgSnNvbkFwaU1vZGVsPihcbiAgICByZXNwb25zZTogSHR0cFJlc3BvbnNlPG9iamVjdD4sXG4gICAgbW9kZWxUeXBlOiBNb2RlbFR5cGU8VD4sXG4gICAgd2l0aE1ldGEgPSBmYWxzZVxuICApOiBBcnJheTxUPiB8IEpzb25BcGlRdWVyeURhdGE8VD4ge1xuICAgIGNvbnN0IGJvZHk6IGFueSA9IHJlc3BvbnNlLmJvZHk7XG4gICAgY29uc3QgbW9kZWxzOiBUW10gPSBbXTtcblxuICAgIGJvZHkuZGF0YS5mb3JFYWNoKChkYXRhOiBhbnkpID0+IHtcbiAgICAgIGxldCB0eXBlID0gdGhpcy5kYXRhc3RvcmVDb25maWcubW9kZWxzW2RhdGEudHlwZV07XG4gICAgICB0eXBlID0gdHlwZSA/IHR5cGUgOiBtb2RlbFR5cGU7XG4gICAgICBjb25zdCBtb2RlbDogVCA9IHRoaXMuZGVzZXJpYWxpemVNb2RlbCh0eXBlLCBkYXRhKTtcbiAgICAgIHRoaXMuYWRkVG9TdG9yZShtb2RlbCk7XG5cbiAgICAgIGlmIChib2R5LmluY2x1ZGVkKSB7XG4gICAgICAgIG1vZGVsLnN5bmNSZWxhdGlvbnNoaXBzKGRhdGEsIGJvZHkuaW5jbHVkZWQuY29uY2F0KGRhdGEpKTtcbiAgICAgICAgdGhpcy5hZGRUb1N0b3JlKG1vZGVsKTtcbiAgICAgIH1cblxuICAgICAgbW9kZWxzLnB1c2gobW9kZWwpO1xuICAgIH0pO1xuXG4gICAgaWYgKHdpdGhNZXRhICYmIHdpdGhNZXRhID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4gbmV3IEpzb25BcGlRdWVyeURhdGEobW9kZWxzLCB0aGlzLnBhcnNlTWV0YShib2R5LCBtb2RlbFR5cGUpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbW9kZWxzO1xuICB9XG5cbiAgcHJvdGVjdGVkIGV4dHJhY3RSZWNvcmREYXRhPFQgZXh0ZW5kcyBKc29uQXBpTW9kZWw+KFxuICAgIHJlczogSHR0cFJlc3BvbnNlPG9iamVjdD4sXG4gICAgbW9kZWxUeXBlOiBNb2RlbFR5cGU8VD4sXG4gICAgbW9kZWw/OiBUXG4gICk6IFQge1xuICAgIGNvbnN0IGJvZHk6IGFueSA9IHJlcy5ib2R5O1xuICAgIC8vIEVycm9yIGluIEFuZ3VsYXIgPCA1LjIuNCAoc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzIwNzQ0KVxuICAgIC8vIG51bGwgaXMgY29udmVydGVkIHRvICdudWxsJywgc28gdGhpcyBpcyB0ZW1wb3JhcnkgbmVlZGVkIHRvIG1ha2UgdGVzdGNhc2UgcG9zc2libGVcbiAgICAvLyAoYW5kIHRvIGF2b2lkIGEgZGVjcmVhc2Ugb2YgdGhlIGNvdmVyYWdlKVxuICAgIGlmICghYm9keSB8fCBib2R5ID09PSAnbnVsbCcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignbm8gYm9keSBpbiByZXNwb25zZScpO1xuICAgIH1cblxuICAgIGlmICghYm9keS5kYXRhKSB7XG4gICAgICBpZiAocmVzLnN0YXR1cyA9PT0gMjAxIHx8ICFtb2RlbCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2V4cGVjdGVkIGRhdGEgaW4gcmVzcG9uc2UnKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBtb2RlbDtcbiAgICB9XG5cbiAgICBpZiAobW9kZWwpIHtcbiAgICAgIG1vZGVsLm1vZGVsSW5pdGlhbGl6YXRpb24gPSB0cnVlO1xuICAgICAgbW9kZWwuaWQgPSBib2R5LmRhdGEuaWQ7XG4gICAgICBPYmplY3QuYXNzaWduKG1vZGVsLCBib2R5LmRhdGEuYXR0cmlidXRlcyk7XG4gICAgICBtb2RlbC5tb2RlbEluaXRpYWxpemF0aW9uID0gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgZGVzZXJpYWxpemVkTW9kZWwgPSBtb2RlbCB8fCB0aGlzLmRlc2VyaWFsaXplTW9kZWwobW9kZWxUeXBlLCBib2R5LmRhdGEpO1xuICAgIHRoaXMuYWRkVG9TdG9yZShkZXNlcmlhbGl6ZWRNb2RlbCk7XG4gICAgaWYgKGJvZHkuaW5jbHVkZWQpIHtcbiAgICAgIGRlc2VyaWFsaXplZE1vZGVsLnN5bmNSZWxhdGlvbnNoaXBzKGJvZHkuZGF0YSwgYm9keS5pbmNsdWRlZCk7XG4gICAgICB0aGlzLmFkZFRvU3RvcmUoZGVzZXJpYWxpemVkTW9kZWwpO1xuICAgIH1cblxuICAgIHJldHVybiBkZXNlcmlhbGl6ZWRNb2RlbDtcbiAgfVxuXG4gIHByb3RlY3RlZCBoYW5kbGVFcnJvcihlcnJvcjogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICBpZiAoXG4gICAgICBlcnJvciBpbnN0YW5jZW9mIEh0dHBFcnJvclJlc3BvbnNlICYmXG4gICAgICBlcnJvci5lcnJvciBpbnN0YW5jZW9mIE9iamVjdCAmJlxuICAgICAgZXJyb3IuZXJyb3IuZXJyb3JzICYmXG4gICAgICBlcnJvci5lcnJvci5lcnJvcnMgaW5zdGFuY2VvZiBBcnJheVxuICAgICkge1xuICAgICAgY29uc3QgZXJyb3JzOiBFcnJvclJlc3BvbnNlID0gbmV3IEVycm9yUmVzcG9uc2UoZXJyb3IuZXJyb3IuZXJyb3JzKTtcbiAgICAgIHJldHVybiB0aHJvd0Vycm9yKGVycm9ycyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRocm93RXJyb3IoZXJyb3IpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHBhcnNlTWV0YShib2R5OiBhbnksIG1vZGVsVHlwZTogTW9kZWxUeXBlPEpzb25BcGlNb2RlbD4pOiBhbnkge1xuICAgIGNvbnN0IG1ldGFNb2RlbDogYW55ID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnSnNvbkFwaU1vZGVsQ29uZmlnJywgbW9kZWxUeXBlKS5tZXRhO1xuICAgIHJldHVybiBuZXcgbWV0YU1vZGVsKGJvZHkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIHVzZSBidWlsZEh0dHBIZWFkZXJzIG1ldGhvZCB0byBidWlsZCByZXF1ZXN0IGhlYWRlcnNcbiAgICovXG4gIHByb3RlY3RlZCBnZXRPcHRpb25zKGN1c3RvbUhlYWRlcnM/OiBIdHRwSGVhZGVycyk6IGFueSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhlYWRlcnM6IHRoaXMuYnVpbGRIdHRwSGVhZGVycyhjdXN0b21IZWFkZXJzKSxcbiAgICB9O1xuICB9XG5cbiAgcHJvdGVjdGVkIGJ1aWxkSHR0cEhlYWRlcnMoY3VzdG9tSGVhZGVycz86IEh0dHBIZWFkZXJzKTogSHR0cEhlYWRlcnMge1xuICAgIGxldCByZXF1ZXN0SGVhZGVyczogSHR0cEhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoe1xuICAgICAgQWNjZXB0OiAnYXBwbGljYXRpb24vdm5kLmFwaStqc29uJyxcbiAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vdm5kLmFwaStqc29uJ1xuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuZ2xvYmFsSGVhZGVycykge1xuICAgICAgdGhpcy5nbG9iYWxIZWFkZXJzLmtleXMoKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuZ2xvYmFsSGVhZGVycy5oYXMoa2V5KSkge1xuICAgICAgICAgIHJlcXVlc3RIZWFkZXJzID0gcmVxdWVzdEhlYWRlcnMuc2V0KGtleSwgdGhpcy5nbG9iYWxIZWFkZXJzLmdldChrZXkpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGN1c3RvbUhlYWRlcnMpIHtcbiAgICAgIGN1c3RvbUhlYWRlcnMua2V5cygpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICBpZiAoY3VzdG9tSGVhZGVycy5oYXMoa2V5KSkge1xuICAgICAgICAgIHJlcXVlc3RIZWFkZXJzID0gcmVxdWVzdEhlYWRlcnMuc2V0KGtleSwgY3VzdG9tSGVhZGVycy5nZXQoa2V5KSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiByZXF1ZXN0SGVhZGVycztcbiAgfVxuXG4gIHByb3RlY3RlZCByZXNldE1ldGFkYXRhQXR0cmlidXRlczxUIGV4dGVuZHMgSnNvbkFwaU1vZGVsPihyZXM6IFQsIGF0dHJpYnV0ZXNNZXRhZGF0YTogYW55LCBtb2RlbFR5cGU6IE1vZGVsVHlwZTxUPikge1xuICAgIGZvciAoY29uc3QgcHJvcGVydHlOYW1lIGluIGF0dHJpYnV0ZXNNZXRhZGF0YSkge1xuICAgICAgaWYgKGF0dHJpYnV0ZXNNZXRhZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgIGNvbnN0IG1ldGFkYXRhOiBhbnkgPSBhdHRyaWJ1dGVzTWV0YWRhdGFbcHJvcGVydHlOYW1lXTtcblxuICAgICAgICBpZiAobWV0YWRhdGEuaGFzRGlydHlBdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgbWV0YWRhdGEuaGFzRGlydHlBdHRyaWJ1dGVzID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBAdHMtaWdub3JlXG4gICAgcmVzW0F0dHJpYnV0ZU1ldGFkYXRhSW5kZXhdID0gYXR0cmlidXRlc01ldGFkYXRhO1xuICAgIHJldHVybiByZXM7XG4gIH1cblxuICBwcm90ZWN0ZWQgdXBkYXRlUmVsYXRpb25zaGlwczxUIGV4dGVuZHMgSnNvbkFwaU1vZGVsPihtb2RlbDogVCwgcmVsYXRpb25zaGlwczogYW55KTogVCB7XG4gICAgY29uc3QgbW9kZWxzVHlwZXM6IGFueSA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ0pzb25BcGlEYXRhc3RvcmVDb25maWcnLCB0aGlzLmNvbnN0cnVjdG9yKS5tb2RlbHM7XG5cbiAgICBmb3IgKGNvbnN0IHJlbGF0aW9uc2hpcCBpbiByZWxhdGlvbnNoaXBzKSB7XG4gICAgICBpZiAocmVsYXRpb25zaGlwcy5oYXNPd25Qcm9wZXJ0eShyZWxhdGlvbnNoaXApICYmIG1vZGVsLmhhc093blByb3BlcnR5KHJlbGF0aW9uc2hpcCkpIHtcbiAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwTW9kZWw6IEpzb25BcGlNb2RlbCA9IG1vZGVsW3JlbGF0aW9uc2hpcF07XG4gICAgICAgIGNvbnN0IGhhc01hbnk6IGFueVtdID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnSGFzTWFueScsIHJlbGF0aW9uc2hpcE1vZGVsKTtcbiAgICAgICAgY29uc3QgcHJvcGVydHlIYXNNYW55OiBhbnkgPSBmaW5kKGhhc01hbnksIChwcm9wZXJ0eSkgPT4ge1xuICAgICAgICAgIHJldHVybiBtb2RlbHNUeXBlc1twcm9wZXJ0eS5yZWxhdGlvbnNoaXBdID09PSBtb2RlbC5jb25zdHJ1Y3RvcjtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHByb3BlcnR5SGFzTWFueSkge1xuICAgICAgICAgIHJlbGF0aW9uc2hpcE1vZGVsW3Byb3BlcnR5SGFzTWFueS5wcm9wZXJ0eU5hbWVdID0gcmVsYXRpb25zaGlwTW9kZWxbcHJvcGVydHlIYXNNYW55LnByb3BlcnR5TmFtZV0gfHwgW107XG5cbiAgICAgICAgICBjb25zdCBpbmRleE9mTW9kZWwgPSByZWxhdGlvbnNoaXBNb2RlbFtwcm9wZXJ0eUhhc01hbnkucHJvcGVydHlOYW1lXS5pbmRleE9mKG1vZGVsKTtcblxuICAgICAgICAgIGlmIChpbmRleE9mTW9kZWwgPT09IC0xKSB7XG4gICAgICAgICAgICByZWxhdGlvbnNoaXBNb2RlbFtwcm9wZXJ0eUhhc01hbnkucHJvcGVydHlOYW1lXS5wdXNoKG1vZGVsKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVsYXRpb25zaGlwTW9kZWxbcHJvcGVydHlIYXNNYW55LnByb3BlcnR5TmFtZV1baW5kZXhPZk1vZGVsXSA9IG1vZGVsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBtb2RlbDtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRNb2RlbFByb3BlcnR5TmFtZXMobW9kZWw6IEpzb25BcGlNb2RlbCkge1xuICAgIHJldHVybiBSZWZsZWN0LmdldE1ldGFkYXRhKCdBdHRyaWJ1dGVNYXBwaW5nJywgbW9kZWwpIHx8IFtdO1xuICB9XG5cbiAgcHJpdmF0ZSBidWlsZFJlcXVlc3RPcHRpb25zKGN1c3RvbU9wdGlvbnM6IGFueSA9IHt9KTogb2JqZWN0IHtcbiAgICBjb25zdCBodHRwSGVhZGVyczogSHR0cEhlYWRlcnMgPSB0aGlzLmJ1aWxkSHR0cEhlYWRlcnMoY3VzdG9tT3B0aW9ucy5oZWFkZXJzKTtcblxuICAgIGNvbnN0IHJlcXVlc3RPcHRpb25zOiBvYmplY3QgPSBPYmplY3QuYXNzaWduKGN1c3RvbU9wdGlvbnMsIHtcbiAgICAgIGhlYWRlcnM6IGh0dHBIZWFkZXJzXG4gICAgfSk7XG5cbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih0aGlzLmdsb2JhbFJlcXVlc3RPcHRpb25zLCByZXF1ZXN0T3B0aW9ucyk7XG4gIH1cblxuICBwcml2YXRlIF90b1F1ZXJ5U3RyaW5nKHBhcmFtczogYW55KTogc3RyaW5nIHtcbiAgICByZXR1cm4gcXMuc3RyaW5naWZ5KHBhcmFtcywge2FycmF5Rm9ybWF0OiAnYnJhY2tldHMnfSk7XG4gIH1cbn1cbiJdfQ==