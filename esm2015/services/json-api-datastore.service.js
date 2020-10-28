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
            if (attributes) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi1hcGktZGF0YXN0b3JlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyMi1qc29uYXBpLyIsInNvdXJjZXMiOlsic2VydmljZXMvanNvbi1hcGktZGF0YXN0b3JlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxXQUFXLEVBQWdCLE1BQU0sc0JBQXNCLENBQUM7QUFDaEcsT0FBTyxJQUFJLE1BQU0sZ0JBQWdCLENBQUM7QUFDbEMsT0FBTyxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNqRCxPQUFPLEVBQWMsRUFBRSxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNsRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDeEQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQy9ELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQ2pFLE9BQU8sS0FBSyxFQUFFLE1BQU0sSUFBSSxDQUFDO0FBR3pCLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3pELE9BQU8sa0JBQWtCLENBQUM7Ozs7Ozs7OztNQVdwQixzQkFBc0IsR0FBVyxtQkFBQSxpQkFBaUIsRUFBTztBQUcvRCxNQUFNLE9BQU8sZ0JBQWdCOzs7O0lBVTNCLFlBQXNCLElBQWdCO1FBQWhCLFNBQUksR0FBSixJQUFJLENBQVk7UUFOOUIseUJBQW9CLEdBQVcsRUFBRSxDQUFDO1FBQ2xDLGtCQUFhLEdBQXVELEVBQUUsQ0FBQztRQUN2RSxrQkFBYSxHQUE0QixJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVM7ZUFDNUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDL0MsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDO0lBR3JFLENBQUM7Ozs7O0lBRUQsSUFBSSxPQUFPLENBQUMsT0FBb0I7UUFDOUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUM7SUFDL0IsQ0FBQzs7Ozs7SUFFRCxJQUFJLGNBQWMsQ0FBQyxjQUFzQjtRQUN2QyxJQUFJLENBQUMsb0JBQW9CLEdBQUcsY0FBYyxDQUFDO0lBQzdDLENBQUM7Ozs7SUFFRCxJQUFXLGVBQWU7O2NBQ2xCLG1CQUFtQixHQUFvQixPQUFPLENBQUMsV0FBVyxDQUFDLHdCQUF3QixFQUFFLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDNUcsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN6RCxDQUFDOzs7OztJQUVELElBQVksa0JBQWtCO1FBQzVCLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTO2VBQzdCLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLGtCQUFrQixFQUFFO1lBQ3RELE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUM7U0FDMUQ7UUFDRCxPQUFPLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDO0lBQzdDLENBQUM7Ozs7OztJQUVPLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxrQkFBdUI7O2NBQ2pELFNBQVMsR0FBUSxFQUFFO1FBRXpCLEtBQUssTUFBTSxZQUFZLElBQUksa0JBQWtCLEVBQUU7WUFDN0MsSUFBSSxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLEVBQUU7O3NCQUM3QyxRQUFRLEdBQVEsa0JBQWtCLENBQUMsWUFBWSxDQUFDO2dCQUV0RCxJQUFJLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRTs7MEJBQ3pCLGFBQWEsR0FBRyxRQUFRLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsWUFBWTtvQkFDOUYsU0FBUyxDQUFDLGFBQWEsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO2lCQUMxRzthQUNGO1NBQ0Y7UUFDRCxPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDOzs7Ozs7Ozs7O0lBS0QsS0FBSyxDQUNILFNBQXVCLEVBQ3ZCLE1BQVksRUFDWixPQUFxQixFQUNyQixTQUFrQjs7Y0FFWixjQUFjLEdBQWdCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUM7O2NBQzVELEdBQUcsR0FBVyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQztRQUMxRSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUMsQ0FBQzthQUNqRCxJQUFJLENBQ0gsR0FBRzs7OztRQUFDLENBQUMsR0FBUSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxFQUFDLEVBQ3hELFVBQVU7Ozs7UUFBQyxDQUFDLEdBQVEsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUNoRCxDQUFDO0lBQ04sQ0FBQzs7Ozs7Ozs7O0lBRU0sT0FBTyxDQUNaLFNBQXVCLEVBQ3ZCLE1BQVksRUFDWixPQUFxQixFQUNyQixTQUFrQjs7Y0FFWixHQUFHLEdBQVcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUM7O2NBQ3BFLGNBQWMsR0FBVyxJQUFJLENBQUMsbUJBQW1CLENBQUMsRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBQyxDQUFDO1FBRXZGLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLGNBQWMsQ0FBQzthQUN0QyxJQUFJLENBQ0gsR0FBRzs7OztRQUFDLENBQUMsR0FBeUIsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLEVBQUMsRUFDL0UsVUFBVTs7OztRQUFDLENBQUMsR0FBUSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQ2hELENBQUM7SUFDTixDQUFDOzs7Ozs7Ozs7O0lBRU0sVUFBVSxDQUNmLFNBQXVCLEVBQ3ZCLEVBQVUsRUFDVixNQUFZLEVBQ1osT0FBcUIsRUFDckIsU0FBa0I7O2NBRVosY0FBYyxHQUFXLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxFQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFDLENBQUM7O2NBQ2pGLEdBQUcsR0FBVyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLFNBQVMsQ0FBQztRQUVuRSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxjQUFjLENBQUM7YUFDdEMsSUFBSSxDQUNILEdBQUc7Ozs7UUFBQyxDQUFDLEdBQXlCLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLEVBQUMsRUFDMUUsVUFBVTs7OztRQUFDLENBQUMsR0FBUSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQ2hELENBQUM7SUFDTixDQUFDOzs7Ozs7O0lBRU0sWUFBWSxDQUF5QixTQUF1QixFQUFFLElBQVU7UUFDN0UsT0FBTyxJQUFJLFNBQVMsQ0FBQyxJQUFJLEVBQUUsRUFBQyxVQUFVLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztJQUNqRCxDQUFDOzs7Ozs7Ozs7O0lBRU0sVUFBVSxDQUNmLGtCQUF1QixFQUN2QixLQUFRLEVBQ1IsTUFBWSxFQUNaLE9BQXFCLEVBQ3JCLFNBQWtCOztjQUVaLFNBQVMsR0FBRyxtQkFBQSxLQUFLLENBQUMsV0FBVyxFQUFnQjs7Y0FDN0MsV0FBVyxHQUFnQixLQUFLLENBQUMsV0FBVzs7Y0FDNUMsUUFBUSxHQUFXLFdBQVcsQ0FBQyxJQUFJOztjQUNuQyxhQUFhLEdBQVEsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQzs7Y0FDakQsR0FBRyxHQUFXLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFFLFNBQVMsQ0FBQzs7WUFFckUsUUFBMEM7O2NBQ3hDLElBQUksR0FBUTtZQUNoQixJQUFJLEVBQUU7Z0JBQ0osYUFBYTtnQkFDYixJQUFJLEVBQUUsUUFBUTtnQkFDZCxFQUFFLEVBQUUsS0FBSyxDQUFDLEVBQUU7Z0JBQ1osVUFBVSxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxrQkFBa0IsRUFBRSxLQUFLLENBQUM7YUFDL0Q7U0FDRjs7Y0FFSyxjQUFjLEdBQVcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEVBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUMsQ0FBQztRQUV2RixJQUFJLEtBQUssQ0FBQyxFQUFFLEVBQUU7WUFDWixRQUFRLEdBQUcsbUJBQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQVMsR0FBRyxFQUFFLElBQUksRUFBRSxjQUFjLENBQUMsRUFBb0MsQ0FBQztTQUNuRzthQUFNO1lBQ0wsUUFBUSxHQUFHLG1CQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFTLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxDQUFDLEVBQW9DLENBQUM7U0FDbEc7UUFFRCxPQUFPLFFBQVE7YUFDWixJQUFJLENBQ0gsR0FBRzs7OztRQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFDLEVBQzNHLFVBQVU7Ozs7UUFBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQ2pCLElBQUksR0FBRyxJQUFJLElBQUksRUFBRTtnQkFDZixPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNsQjtZQUNELE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMvQixDQUFDLEVBQUMsRUFDRixHQUFHOzs7O1FBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLEVBQUUsYUFBYSxDQUFDLEVBQUMsQ0FDM0QsQ0FBQztJQUNOLENBQUM7Ozs7Ozs7OztJQUVNLFlBQVksQ0FDakIsU0FBdUIsRUFDdkIsRUFBVSxFQUNWLE9BQXFCLEVBQ3JCLFNBQWtCOztjQUVaLGNBQWMsR0FBVyxJQUFJLENBQUMsbUJBQW1CLENBQUMsRUFBQyxPQUFPLEVBQUMsQ0FBQzs7Y0FDNUQsR0FBRyxHQUFXLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDO1FBRWpFLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLGNBQWMsQ0FBQzthQUN6QyxJQUFJLENBQ0gsVUFBVTs7OztRQUFDLENBQUMsR0FBc0IsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUM5RCxDQUFDO0lBQ04sQ0FBQzs7Ozs7OztJQUVNLFVBQVUsQ0FBeUIsU0FBdUIsRUFBRSxFQUFVOztjQUNyRSxJQUFJLEdBQVcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxvQkFBb0IsRUFBRSxTQUFTLENBQUMsQ0FBQyxJQUFJO1FBQzlFLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsbUJBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDN0UsQ0FBQzs7Ozs7O0lBRU0sT0FBTyxDQUF5QixTQUF1Qjs7Y0FDdEQsSUFBSSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsb0JBQW9CLEVBQUUsU0FBUyxDQUFDLENBQUMsSUFBSTs7Y0FDaEUsU0FBUyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDO1FBQzFDLE9BQU8sU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUc7Ozs7UUFBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsbUJBQUEsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ25GLENBQUM7Ozs7Ozs7SUFFTSxnQkFBZ0IsQ0FBeUIsU0FBdUIsRUFBRSxJQUFTO1FBQ2hGLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLHVDQUF1QyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDM0YsT0FBTyxJQUFJLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDbkMsQ0FBQzs7Ozs7SUFFTSxVQUFVLENBQUMsYUFBNEM7O2NBQ3RELE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDOztjQUN2RSxJQUFJLEdBQVcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJOztZQUMzQyxTQUFTLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUM7UUFFeEMsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNkLFNBQVMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztTQUMzQztRQUVELEtBQUssTUFBTSxLQUFLLElBQUksTUFBTSxFQUFFO1lBQzFCLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDO1NBQzdCO0lBQ0gsQ0FBQzs7Ozs7OztJQUVNLHVDQUF1QyxDQUF5QixTQUF1QixFQUFFLFVBQWU7O2NBQ3ZHLDRCQUE0QixHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDOztjQUM5RSxVQUFVLEdBQVEsRUFBRTtRQUUxQixNQUFNLENBQUMsSUFBSSxDQUFDLDRCQUE0QixDQUFDLENBQUMsT0FBTzs7OztRQUFDLENBQUMsY0FBYyxFQUFFLEVBQUU7WUFDbkUsSUFBSSxVQUFVLEVBQUU7Z0JBQ2QsVUFBVSxDQUFDLDRCQUE0QixDQUFDLGNBQWMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2FBQ3ZGO1FBQ0gsQ0FBQyxFQUFDLENBQUM7UUFFSCxPQUFPLFVBQVUsQ0FBQztJQUNwQixDQUFDOzs7Ozs7Ozs7O0lBRVMsUUFBUSxDQUNoQixTQUF1QixFQUN2QixNQUFZLEVBQ1osRUFBVyxFQUNYLFNBQWtCOzs7Y0FHWixXQUFXLEdBQVcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUM7UUFFdEQsSUFBSSxTQUFTLEVBQUU7WUFDYixPQUFPLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLElBQUksV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztTQUNoRTs7Y0FFSyxXQUFXLEdBQWdCLE9BQU8sQ0FBQyxXQUFXLENBQUMsb0JBQW9CLEVBQUUsU0FBUyxDQUFDOztjQUUvRSxPQUFPLEdBQUcsV0FBVyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU87O2NBQzdELFVBQVUsR0FBRyxXQUFXLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVTs7Y0FDdEUsZ0JBQWdCLEdBQVcsV0FBVyxDQUFDLGdCQUFnQixJQUFJLFdBQVcsQ0FBQyxJQUFJOztjQUUzRSxHQUFHLEdBQVcsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLEVBQUUsQ0FBQyxDQUFDLE1BQU07Ozs7UUFBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUUxRixPQUFPLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUNyRCxDQUFDOzs7Ozs7SUFFUyxnQkFBZ0IsQ0FBQyxJQUFTOztZQUM5QixhQUFrQjs7Y0FFaEIsaUJBQWlCLEdBQVUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRTs7Y0FDdkUsZUFBZSxHQUFVLE9BQU8sQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUU7UUFFekUsS0FBSyxNQUFNLEdBQUcsSUFBSSxJQUFJLEVBQUU7WUFDdEIsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUM1QixJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxZQUFZLEVBQUU7b0JBQ3JDLGFBQWEsR0FBRyxhQUFhLElBQUksRUFBRSxDQUFDO29CQUVwQyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUU7OzhCQUNWLE1BQU0sR0FBRyxpQkFBaUIsQ0FBQyxJQUFJOzs7O3dCQUFDLENBQUMsRUFBTyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsWUFBWSxLQUFLLEdBQUcsRUFBQzs7OEJBQ3JFLGVBQWUsR0FBRyxNQUFNLENBQUMsWUFBWTt3QkFDM0MsYUFBYSxDQUFDLGVBQWUsQ0FBQyxHQUFHOzRCQUMvQixJQUFJLEVBQUUsSUFBSSxDQUFDLDJCQUEyQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzt5QkFDbEQsQ0FBQztxQkFDSDtpQkFDRjtxQkFBTSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxLQUFLLEVBQUU7OzBCQUMvQixNQUFNLEdBQUcsZUFBZSxDQUFDLElBQUk7Ozs7b0JBQUMsQ0FBQyxFQUFPLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEtBQUssR0FBRyxFQUFDO29CQUN6RSxJQUFJLE1BQU0sSUFBSSxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7d0JBQ25ELGFBQWEsR0FBRyxhQUFhLElBQUksRUFBRSxDQUFDOzs4QkFFOUIsZUFBZSxHQUFHLE1BQU0sQ0FBQyxZQUFZOzs4QkFDckMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQzs2QkFDL0IsTUFBTTs7Ozt3QkFBQyxDQUFDLEtBQW1CLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUM7NkJBQ3pDLEdBQUc7Ozs7d0JBQUMsQ0FBQyxLQUFtQixFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsMkJBQTJCLENBQUMsS0FBSyxDQUFDLEVBQUM7d0JBRXhFLGFBQWEsQ0FBQyxlQUFlLENBQUMsR0FBRzs0QkFDL0IsSUFBSSxFQUFFLGdCQUFnQjt5QkFDdkIsQ0FBQztxQkFDSDtpQkFDRjthQUNGO1NBQ0Y7UUFFRCxPQUFPLGFBQWEsQ0FBQztJQUN2QixDQUFDOzs7Ozs7SUFFUyxxQkFBcUIsQ0FBQyxPQUFtQjtRQUNqRCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTtZQUNuQixPQUFPLElBQUksQ0FBQztTQUNiOztjQUNLLGNBQWMsR0FBRyxPQUFPLENBQUMsS0FBSzs7OztRQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLFlBQVksWUFBWSxFQUFDO1FBQzVFLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDbkIsT0FBTyxLQUFLLENBQUM7U0FDZDs7Y0FDSyxLQUFLLEdBQUcsT0FBTyxDQUFDLEdBQUc7Ozs7UUFBQyxDQUFDLElBQWtCLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUM7UUFDN0csT0FBTyxLQUFLO2FBQ1QsTUFBTTs7Ozs7O1FBQUMsQ0FBQyxJQUFZLEVBQUUsS0FBYSxFQUFFLElBQWMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLEVBQUM7YUFDckYsTUFBTSxLQUFLLENBQUMsQ0FBQztJQUNsQixDQUFDOzs7Ozs7SUFFUywyQkFBMkIsQ0FBQyxLQUFtQjs7Y0FDakQsZ0JBQWdCLEdBQVcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJOztjQUNqRCxnQkFBZ0IsR0FBb0QsRUFBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUM7UUFFbEcsSUFBSSxLQUFLLENBQUMsRUFBRSxFQUFFO1lBQ1osZ0JBQWdCLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUM7U0FDaEM7YUFBTTs7a0JBQ0Msa0JBQWtCLEdBQVEsT0FBTyxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDO1lBQ3ZFLGdCQUFnQixDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsa0JBQWtCLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDbEY7UUFFRCxPQUFPLGdCQUFnQixDQUFDO0lBQzFCLENBQUM7Ozs7Ozs7OztJQUVTLGdCQUFnQixDQUN4QixRQUE4QixFQUM5QixTQUF1QixFQUN2QixRQUFRLEdBQUcsS0FBSzs7Y0FFVixJQUFJLEdBQVEsUUFBUSxDQUFDLElBQUk7O2NBQ3pCLE1BQU0sR0FBUSxFQUFFO1FBRXRCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTzs7OztRQUFDLENBQUMsSUFBUyxFQUFFLEVBQUU7O2dCQUMxQixJQUFJLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNqRCxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQzs7a0JBQ3pCLEtBQUssR0FBTSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztZQUNsRCxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRXZCLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDakIsS0FBSyxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUMxRCxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3hCO1lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNyQixDQUFDLEVBQUMsQ0FBQztRQUVILElBQUksUUFBUSxJQUFJLFFBQVEsS0FBSyxJQUFJLEVBQUU7WUFDakMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO1NBQ3RFO1FBRUQsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQzs7Ozs7Ozs7O0lBRVMsaUJBQWlCLENBQ3pCLEdBQXlCLEVBQ3pCLFNBQXVCLEVBQ3ZCLEtBQVM7O2NBRUgsSUFBSSxHQUFRLEdBQUcsQ0FBQyxJQUFJO1FBQzFCLGlGQUFpRjtRQUNqRixxRkFBcUY7UUFDckYsNENBQTRDO1FBQzVDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxLQUFLLE1BQU0sRUFBRTtZQUM1QixNQUFNLElBQUksS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7U0FDeEM7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNkLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ2hDLE1BQU0sSUFBSSxLQUFLLENBQUMsMkJBQTJCLENBQUMsQ0FBQzthQUM5QztZQUNELE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFFRCxJQUFJLEtBQUssRUFBRTtZQUNULEtBQUssQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7WUFDakMsS0FBSyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUN4QixNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzNDLEtBQUssQ0FBQyxtQkFBbUIsR0FBRyxLQUFLLENBQUM7U0FDbkM7O2NBRUssaUJBQWlCLEdBQUcsS0FBSyxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQztRQUM5RSxJQUFJLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDbkMsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2pCLGlCQUFpQixDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzlELElBQUksQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQztTQUNwQztRQUVELE9BQU8saUJBQWlCLENBQUM7SUFDM0IsQ0FBQzs7Ozs7O0lBRVMsV0FBVyxDQUFDLEtBQVU7UUFDOUIsSUFDRSxLQUFLLFlBQVksaUJBQWlCO1lBQ2xDLEtBQUssQ0FBQyxLQUFLLFlBQVksTUFBTTtZQUM3QixLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU07WUFDbEIsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLFlBQVksS0FBSyxFQUNuQzs7a0JBQ00sTUFBTSxHQUFrQixJQUFJLGFBQWEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztZQUNuRSxPQUFPLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUMzQjtRQUVELE9BQU8sVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzNCLENBQUM7Ozs7Ozs7SUFFUyxTQUFTLENBQUMsSUFBUyxFQUFFLFNBQWtDOztjQUN6RCxTQUFTLEdBQVEsT0FBTyxDQUFDLFdBQVcsQ0FBQyxvQkFBb0IsRUFBRSxTQUFTLENBQUMsQ0FBQyxJQUFJO1FBQ2hGLE9BQU8sSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDN0IsQ0FBQzs7Ozs7OztJQUtTLFVBQVUsQ0FBQyxhQUEyQjtRQUM5QyxPQUFPO1lBQ0wsT0FBTyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUM7U0FDOUMsQ0FBQztJQUNKLENBQUM7Ozs7OztJQUVTLGdCQUFnQixDQUFDLGFBQTJCOztZQUNoRCxjQUFjLEdBQWdCLElBQUksV0FBVyxDQUFDO1lBQ2hELE1BQU0sRUFBRSwwQkFBMEI7WUFDbEMsY0FBYyxFQUFFLDBCQUEwQjtTQUMzQyxDQUFDO1FBRUYsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ3RCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUMsT0FBTzs7OztZQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7Z0JBQ3hDLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBQy9CLGNBQWMsR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2lCQUN2RTtZQUNILENBQUMsRUFBQyxDQUFDO1NBQ0o7UUFFRCxJQUFJLGFBQWEsRUFBRTtZQUNqQixhQUFhLENBQUMsSUFBSSxFQUFFLENBQUMsT0FBTzs7OztZQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7Z0JBQ25DLElBQUksYUFBYSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtvQkFDMUIsY0FBYyxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLGFBQWEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztpQkFDbEU7WUFDSCxDQUFDLEVBQUMsQ0FBQztTQUNKO1FBRUQsT0FBTyxjQUFjLENBQUM7SUFDeEIsQ0FBQzs7Ozs7Ozs7O0lBRVMsdUJBQXVCLENBQXlCLEdBQU0sRUFBRSxrQkFBdUIsRUFBRSxTQUF1QjtRQUNoSCxLQUFLLE1BQU0sWUFBWSxJQUFJLGtCQUFrQixFQUFFO1lBQzdDLElBQUksa0JBQWtCLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxFQUFFOztzQkFDN0MsUUFBUSxHQUFRLGtCQUFrQixDQUFDLFlBQVksQ0FBQztnQkFFdEQsSUFBSSxRQUFRLENBQUMsa0JBQWtCLEVBQUU7b0JBQy9CLFFBQVEsQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUM7aUJBQ3JDO2FBQ0Y7U0FDRjtRQUVELGFBQWE7UUFDYixHQUFHLENBQUMsc0JBQXNCLENBQUMsR0FBRyxrQkFBa0IsQ0FBQztRQUNqRCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7Ozs7Ozs7O0lBRVMsbUJBQW1CLENBQXlCLEtBQVEsRUFBRSxhQUFrQjs7Y0FDMUUsV0FBVyxHQUFRLE9BQU8sQ0FBQyxXQUFXLENBQUMsd0JBQXdCLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE1BQU07UUFFL0YsS0FBSyxNQUFNLFlBQVksSUFBSSxhQUFhLEVBQUU7WUFDeEMsSUFBSSxhQUFhLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxJQUFJLEtBQUssQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLEVBQUU7O3NCQUM5RSxpQkFBaUIsR0FBaUIsS0FBSyxDQUFDLFlBQVksQ0FBQzs7c0JBQ3JELE9BQU8sR0FBVSxPQUFPLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxpQkFBaUIsQ0FBQzs7c0JBQ2xFLGVBQWUsR0FBUSxJQUFJLENBQUMsT0FBTzs7OztnQkFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFO29CQUN0RCxPQUFPLFdBQVcsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLEtBQUssS0FBSyxDQUFDLFdBQVcsQ0FBQztnQkFDbEUsQ0FBQyxFQUFDO2dCQUVGLElBQUksZUFBZSxFQUFFO29CQUNuQixpQkFBaUIsQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLEdBQUcsaUJBQWlCLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7MEJBRWxHLFlBQVksR0FBRyxpQkFBaUIsQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztvQkFFbkYsSUFBSSxZQUFZLEtBQUssQ0FBQyxDQUFDLEVBQUU7d0JBQ3ZCLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7cUJBQzdEO3lCQUFNO3dCQUNMLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxZQUFZLENBQUMsR0FBRyxLQUFLLENBQUM7cUJBQ3ZFO2lCQUNGO2FBQ0Y7U0FDRjtRQUVELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQzs7Ozs7O0lBRVMscUJBQXFCLENBQUMsS0FBbUI7UUFDakQsT0FBTyxPQUFPLENBQUMsV0FBVyxDQUFDLGtCQUFrQixFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUM5RCxDQUFDOzs7Ozs7SUFFTyxtQkFBbUIsQ0FBQyxnQkFBcUIsRUFBRTs7Y0FDM0MsV0FBVyxHQUFnQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQzs7Y0FFdkUsY0FBYyxHQUFXLE1BQU0sQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFO1lBQzFELE9BQU8sRUFBRSxXQUFXO1NBQ3JCLENBQUM7UUFFRixPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7Ozs7OztJQUVPLGNBQWMsQ0FBQyxNQUFXO1FBQ2hDLE9BQU8sRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsRUFBQyxXQUFXLEVBQUUsVUFBVSxFQUFDLENBQUMsQ0FBQztJQUN6RCxDQUFDOzs7WUE5ZEYsVUFBVTs7OztZQXhCRixVQUFVOzs7Ozs7O0lBMkJqQixrQ0FBa0M7Ozs7O0lBQ2xDLHlDQUFtQzs7Ozs7SUFDbkMsZ0RBQTBDOzs7OztJQUMxQyx5Q0FBK0U7Ozs7O0lBQy9FLHlDQUVxRTs7Ozs7SUFFekQsZ0NBQTBCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cEVycm9yUmVzcG9uc2UsIEh0dHBIZWFkZXJzLCBIdHRwUmVzcG9uc2UgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgZmluZCBmcm9tICdsb2Rhc2gtZXMvZmluZCc7XG5pbXBvcnQgeyBjYXRjaEVycm9yLCBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBvZiwgdGhyb3dFcnJvciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgSnNvbkFwaU1vZGVsIH0gZnJvbSAnLi4vbW9kZWxzL2pzb24tYXBpLm1vZGVsJztcbmltcG9ydCB7IEVycm9yUmVzcG9uc2UgfSBmcm9tICcuLi9tb2RlbHMvZXJyb3ItcmVzcG9uc2UubW9kZWwnO1xuaW1wb3J0IHsgSnNvbkFwaVF1ZXJ5RGF0YSB9IGZyb20gJy4uL21vZGVscy9qc29uLWFwaS1xdWVyeS1kYXRhJztcbmltcG9ydCAqIGFzIHFzIGZyb20gJ3FzJztcbmltcG9ydCB7IERhdGFzdG9yZUNvbmZpZyB9IGZyb20gJy4uL2ludGVyZmFjZXMvZGF0YXN0b3JlLWNvbmZpZy5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgTW9kZWxDb25maWcgfSBmcm9tICcuLi9pbnRlcmZhY2VzL21vZGVsLWNvbmZpZy5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgQXR0cmlidXRlTWV0YWRhdGEgfSBmcm9tICcuLi9jb25zdGFudHMvc3ltYm9scyc7XG5pbXBvcnQgJ3JlZmxlY3QtbWV0YWRhdGEnO1xuXG5leHBvcnQgdHlwZSBNb2RlbFR5cGU8VCBleHRlbmRzIEpzb25BcGlNb2RlbD4gPSBuZXcoZGF0YXN0b3JlOiBKc29uQXBpRGF0YXN0b3JlLCBkYXRhOiBhbnkpID0+IFQ7XG5cbi8qKlxuICogSEFDSy9GSVhNRTpcbiAqIFR5cGUgJ3N5bWJvbCcgY2Fubm90IGJlIHVzZWQgYXMgYW4gaW5kZXggdHlwZS5cbiAqIFR5cGVTY3JpcHQgMi45LnhcbiAqIFNlZSBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzI0NTg3LlxuICovXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZVxuY29uc3QgQXR0cmlidXRlTWV0YWRhdGFJbmRleDogc3RyaW5nID0gQXR0cmlidXRlTWV0YWRhdGEgYXMgYW55O1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgSnNvbkFwaURhdGFzdG9yZSB7XG5cbiAgcHJvdGVjdGVkIGNvbmZpZzogRGF0YXN0b3JlQ29uZmlnO1xuICBwcml2YXRlIGdsb2JhbEhlYWRlcnM6IEh0dHBIZWFkZXJzO1xuICBwcml2YXRlIGdsb2JhbFJlcXVlc3RPcHRpb25zOiBvYmplY3QgPSB7fTtcbiAgcHJpdmF0ZSBpbnRlcm5hbFN0b3JlOiB7IFt0eXBlOiBzdHJpbmddOiB7IFtpZDogc3RyaW5nXTogSnNvbkFwaU1vZGVsIH0gfSA9IHt9O1xuICBwcml2YXRlIHRvUXVlcnlTdHJpbmc6IChwYXJhbXM6IGFueSkgPT4gc3RyaW5nID0gdGhpcy5kYXRhc3RvcmVDb25maWcub3ZlcnJpZGVzXG4gICYmIHRoaXMuZGF0YXN0b3JlQ29uZmlnLm92ZXJyaWRlcy50b1F1ZXJ5U3RyaW5nID9cbiAgICB0aGlzLmRhdGFzdG9yZUNvbmZpZy5vdmVycmlkZXMudG9RdWVyeVN0cmluZyA6IHRoaXMuX3RvUXVlcnlTdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGh0dHA6IEh0dHBDbGllbnQpIHtcbiAgfVxuXG4gIHNldCBoZWFkZXJzKGhlYWRlcnM6IEh0dHBIZWFkZXJzKSB7XG4gICAgdGhpcy5nbG9iYWxIZWFkZXJzID0gaGVhZGVycztcbiAgfVxuXG4gIHNldCByZXF1ZXN0T3B0aW9ucyhyZXF1ZXN0T3B0aW9uczogb2JqZWN0KSB7XG4gICAgdGhpcy5nbG9iYWxSZXF1ZXN0T3B0aW9ucyA9IHJlcXVlc3RPcHRpb25zO1xuICB9XG5cbiAgcHVibGljIGdldCBkYXRhc3RvcmVDb25maWcoKTogRGF0YXN0b3JlQ29uZmlnIHtcbiAgICBjb25zdCBjb25maWdGcm9tRGVjb3JhdG9yOiBEYXRhc3RvcmVDb25maWcgPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdKc29uQXBpRGF0YXN0b3JlQ29uZmlnJywgdGhpcy5jb25zdHJ1Y3Rvcik7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oY29uZmlnRnJvbURlY29yYXRvciwgdGhpcy5jb25maWcpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXQgZ2V0RGlydHlBdHRyaWJ1dGVzKCkge1xuICAgIGlmICh0aGlzLmRhdGFzdG9yZUNvbmZpZy5vdmVycmlkZXNcbiAgICAgICYmIHRoaXMuZGF0YXN0b3JlQ29uZmlnLm92ZXJyaWRlcy5nZXREaXJ0eUF0dHJpYnV0ZXMpIHtcbiAgICAgIHJldHVybiB0aGlzLmRhdGFzdG9yZUNvbmZpZy5vdmVycmlkZXMuZ2V0RGlydHlBdHRyaWJ1dGVzO1xuICAgIH1cbiAgICByZXR1cm4gSnNvbkFwaURhdGFzdG9yZS5nZXREaXJ0eUF0dHJpYnV0ZXM7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBnZXREaXJ0eUF0dHJpYnV0ZXMoYXR0cmlidXRlc01ldGFkYXRhOiBhbnkpOiB7IHN0cmluZzogYW55IH0ge1xuICAgIGNvbnN0IGRpcnR5RGF0YTogYW55ID0ge307XG5cbiAgICBmb3IgKGNvbnN0IHByb3BlcnR5TmFtZSBpbiBhdHRyaWJ1dGVzTWV0YWRhdGEpIHtcbiAgICAgIGlmIChhdHRyaWJ1dGVzTWV0YWRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSkge1xuICAgICAgICBjb25zdCBtZXRhZGF0YTogYW55ID0gYXR0cmlidXRlc01ldGFkYXRhW3Byb3BlcnR5TmFtZV07XG5cbiAgICAgICAgaWYgKG1ldGFkYXRhLmhhc0RpcnR5QXR0cmlidXRlcykge1xuICAgICAgICAgIGNvbnN0IGF0dHJpYnV0ZU5hbWUgPSBtZXRhZGF0YS5zZXJpYWxpemVkTmFtZSAhPSBudWxsID8gbWV0YWRhdGEuc2VyaWFsaXplZE5hbWUgOiBwcm9wZXJ0eU5hbWU7XG4gICAgICAgICAgZGlydHlEYXRhW2F0dHJpYnV0ZU5hbWVdID0gbWV0YWRhdGEuc2VyaWFsaXNhdGlvblZhbHVlID8gbWV0YWRhdGEuc2VyaWFsaXNhdGlvblZhbHVlIDogbWV0YWRhdGEubmV3VmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRpcnR5RGF0YTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZCB1c2UgZmluZEFsbCBtZXRob2QgdG8gdGFrZSBhbGwgbW9kZWxzXG4gICAqL1xuICBxdWVyeTxUIGV4dGVuZHMgSnNvbkFwaU1vZGVsPihcbiAgICBtb2RlbFR5cGU6IE1vZGVsVHlwZTxUPixcbiAgICBwYXJhbXM/OiBhbnksXG4gICAgaGVhZGVycz86IEh0dHBIZWFkZXJzLFxuICAgIGN1c3RvbVVybD86IHN0cmluZ1xuICApOiBPYnNlcnZhYmxlPFRbXT4ge1xuICAgIGNvbnN0IHJlcXVlc3RIZWFkZXJzOiBIdHRwSGVhZGVycyA9IHRoaXMuYnVpbGRIdHRwSGVhZGVycyhoZWFkZXJzKTtcbiAgICBjb25zdCB1cmw6IHN0cmluZyA9IHRoaXMuYnVpbGRVcmwobW9kZWxUeXBlLCBwYXJhbXMsIHVuZGVmaW5lZCwgY3VzdG9tVXJsKTtcbiAgICByZXR1cm4gdGhpcy5odHRwLmdldCh1cmwsIHtoZWFkZXJzOiByZXF1ZXN0SGVhZGVyc30pXG4gICAgICAucGlwZShcbiAgICAgICAgbWFwKChyZXM6IGFueSkgPT4gdGhpcy5leHRyYWN0UXVlcnlEYXRhKHJlcywgbW9kZWxUeXBlKSksXG4gICAgICAgIGNhdGNoRXJyb3IoKHJlczogYW55KSA9PiB0aGlzLmhhbmRsZUVycm9yKHJlcykpXG4gICAgICApO1xuICB9XG5cbiAgcHVibGljIGZpbmRBbGw8VCBleHRlbmRzIEpzb25BcGlNb2RlbD4oXG4gICAgbW9kZWxUeXBlOiBNb2RlbFR5cGU8VD4sXG4gICAgcGFyYW1zPzogYW55LFxuICAgIGhlYWRlcnM/OiBIdHRwSGVhZGVycyxcbiAgICBjdXN0b21Vcmw/OiBzdHJpbmdcbiAgKTogT2JzZXJ2YWJsZTxKc29uQXBpUXVlcnlEYXRhPFQ+PiB7XG4gICAgY29uc3QgdXJsOiBzdHJpbmcgPSB0aGlzLmJ1aWxkVXJsKG1vZGVsVHlwZSwgcGFyYW1zLCB1bmRlZmluZWQsIGN1c3RvbVVybCk7XG4gICAgY29uc3QgcmVxdWVzdE9wdGlvbnM6IG9iamVjdCA9IHRoaXMuYnVpbGRSZXF1ZXN0T3B0aW9ucyh7aGVhZGVycywgb2JzZXJ2ZTogJ3Jlc3BvbnNlJ30pO1xuXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQodXJsLCByZXF1ZXN0T3B0aW9ucylcbiAgICAgIC5waXBlKFxuICAgICAgICBtYXAoKHJlczogSHR0cFJlc3BvbnNlPG9iamVjdD4pID0+IHRoaXMuZXh0cmFjdFF1ZXJ5RGF0YShyZXMsIG1vZGVsVHlwZSwgdHJ1ZSkpLFxuICAgICAgICBjYXRjaEVycm9yKChyZXM6IGFueSkgPT4gdGhpcy5oYW5kbGVFcnJvcihyZXMpKVxuICAgICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBmaW5kUmVjb3JkPFQgZXh0ZW5kcyBKc29uQXBpTW9kZWw+KFxuICAgIG1vZGVsVHlwZTogTW9kZWxUeXBlPFQ+LFxuICAgIGlkOiBzdHJpbmcsXG4gICAgcGFyYW1zPzogYW55LFxuICAgIGhlYWRlcnM/OiBIdHRwSGVhZGVycyxcbiAgICBjdXN0b21Vcmw/OiBzdHJpbmdcbiAgKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgY29uc3QgcmVxdWVzdE9wdGlvbnM6IG9iamVjdCA9IHRoaXMuYnVpbGRSZXF1ZXN0T3B0aW9ucyh7aGVhZGVycywgb2JzZXJ2ZTogJ3Jlc3BvbnNlJ30pO1xuICAgIGNvbnN0IHVybDogc3RyaW5nID0gdGhpcy5idWlsZFVybChtb2RlbFR5cGUsIHBhcmFtcywgaWQsIGN1c3RvbVVybCk7XG5cbiAgICByZXR1cm4gdGhpcy5odHRwLmdldCh1cmwsIHJlcXVlc3RPcHRpb25zKVxuICAgICAgLnBpcGUoXG4gICAgICAgIG1hcCgocmVzOiBIdHRwUmVzcG9uc2U8b2JqZWN0PikgPT4gdGhpcy5leHRyYWN0UmVjb3JkRGF0YShyZXMsIG1vZGVsVHlwZSkpLFxuICAgICAgICBjYXRjaEVycm9yKChyZXM6IGFueSkgPT4gdGhpcy5oYW5kbGVFcnJvcihyZXMpKVxuICAgICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBjcmVhdGVSZWNvcmQ8VCBleHRlbmRzIEpzb25BcGlNb2RlbD4obW9kZWxUeXBlOiBNb2RlbFR5cGU8VD4sIGRhdGE/OiBhbnkpOiBUIHtcbiAgICByZXR1cm4gbmV3IG1vZGVsVHlwZSh0aGlzLCB7YXR0cmlidXRlczogZGF0YX0pO1xuICB9XG5cbiAgcHVibGljIHNhdmVSZWNvcmQ8VCBleHRlbmRzIEpzb25BcGlNb2RlbD4oXG4gICAgYXR0cmlidXRlc01ldGFkYXRhOiBhbnksXG4gICAgbW9kZWw6IFQsXG4gICAgcGFyYW1zPzogYW55LFxuICAgIGhlYWRlcnM/OiBIdHRwSGVhZGVycyxcbiAgICBjdXN0b21Vcmw/OiBzdHJpbmdcbiAgKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgY29uc3QgbW9kZWxUeXBlID0gbW9kZWwuY29uc3RydWN0b3IgYXMgTW9kZWxUeXBlPFQ+O1xuICAgIGNvbnN0IG1vZGVsQ29uZmlnOiBNb2RlbENvbmZpZyA9IG1vZGVsLm1vZGVsQ29uZmlnO1xuICAgIGNvbnN0IHR5cGVOYW1lOiBzdHJpbmcgPSBtb2RlbENvbmZpZy50eXBlO1xuICAgIGNvbnN0IHJlbGF0aW9uc2hpcHM6IGFueSA9IHRoaXMuZ2V0UmVsYXRpb25zaGlwcyhtb2RlbCk7XG4gICAgY29uc3QgdXJsOiBzdHJpbmcgPSB0aGlzLmJ1aWxkVXJsKG1vZGVsVHlwZSwgcGFyYW1zLCBtb2RlbC5pZCwgY3VzdG9tVXJsKTtcblxuICAgIGxldCBodHRwQ2FsbDogT2JzZXJ2YWJsZTxIdHRwUmVzcG9uc2U8b2JqZWN0Pj47XG4gICAgY29uc3QgYm9keTogYW55ID0ge1xuICAgICAgZGF0YToge1xuICAgICAgICByZWxhdGlvbnNoaXBzLFxuICAgICAgICB0eXBlOiB0eXBlTmFtZSxcbiAgICAgICAgaWQ6IG1vZGVsLmlkLFxuICAgICAgICBhdHRyaWJ1dGVzOiB0aGlzLmdldERpcnR5QXR0cmlidXRlcyhhdHRyaWJ1dGVzTWV0YWRhdGEsIG1vZGVsKVxuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCByZXF1ZXN0T3B0aW9uczogb2JqZWN0ID0gdGhpcy5idWlsZFJlcXVlc3RPcHRpb25zKHtoZWFkZXJzLCBvYnNlcnZlOiAncmVzcG9uc2UnfSk7XG5cbiAgICBpZiAobW9kZWwuaWQpIHtcbiAgICAgIGh0dHBDYWxsID0gdGhpcy5odHRwLnBhdGNoPG9iamVjdD4odXJsLCBib2R5LCByZXF1ZXN0T3B0aW9ucykgYXMgT2JzZXJ2YWJsZTxIdHRwUmVzcG9uc2U8b2JqZWN0Pj47XG4gICAgfSBlbHNlIHtcbiAgICAgIGh0dHBDYWxsID0gdGhpcy5odHRwLnBvc3Q8b2JqZWN0Pih1cmwsIGJvZHksIHJlcXVlc3RPcHRpb25zKSBhcyBPYnNlcnZhYmxlPEh0dHBSZXNwb25zZTxvYmplY3Q+PjtcbiAgICB9XG5cbiAgICByZXR1cm4gaHR0cENhbGxcbiAgICAgIC5waXBlKFxuICAgICAgICBtYXAoKHJlcykgPT4gWzIwMCwgMjAxXS5pbmRleE9mKHJlcy5zdGF0dXMpICE9PSAtMSA/IHRoaXMuZXh0cmFjdFJlY29yZERhdGEocmVzLCBtb2RlbFR5cGUsIG1vZGVsKSA6IG1vZGVsKSxcbiAgICAgICAgY2F0Y2hFcnJvcigocmVzKSA9PiB7XG4gICAgICAgICAgaWYgKHJlcyA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gb2YobW9kZWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVFcnJvcihyZXMpO1xuICAgICAgICB9KSxcbiAgICAgICAgbWFwKChyZXMpID0+IHRoaXMudXBkYXRlUmVsYXRpb25zaGlwcyhyZXMsIHJlbGF0aW9uc2hpcHMpKVxuICAgICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBkZWxldGVSZWNvcmQ8VCBleHRlbmRzIEpzb25BcGlNb2RlbD4oXG4gICAgbW9kZWxUeXBlOiBNb2RlbFR5cGU8VD4sXG4gICAgaWQ6IHN0cmluZyxcbiAgICBoZWFkZXJzPzogSHR0cEhlYWRlcnMsXG4gICAgY3VzdG9tVXJsPzogc3RyaW5nXG4gICk6IE9ic2VydmFibGU8UmVzcG9uc2U+IHtcbiAgICBjb25zdCByZXF1ZXN0T3B0aW9uczogb2JqZWN0ID0gdGhpcy5idWlsZFJlcXVlc3RPcHRpb25zKHtoZWFkZXJzfSk7XG4gICAgY29uc3QgdXJsOiBzdHJpbmcgPSB0aGlzLmJ1aWxkVXJsKG1vZGVsVHlwZSwgbnVsbCwgaWQsIGN1c3RvbVVybCk7XG5cbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZSh1cmwsIHJlcXVlc3RPcHRpb25zKVxuICAgICAgLnBpcGUoXG4gICAgICAgIGNhdGNoRXJyb3IoKHJlczogSHR0cEVycm9yUmVzcG9uc2UpID0+IHRoaXMuaGFuZGxlRXJyb3IocmVzKSlcbiAgICAgICk7XG4gIH1cblxuICBwdWJsaWMgcGVla1JlY29yZDxUIGV4dGVuZHMgSnNvbkFwaU1vZGVsPihtb2RlbFR5cGU6IE1vZGVsVHlwZTxUPiwgaWQ6IHN0cmluZyk6IFQgfCBudWxsIHtcbiAgICBjb25zdCB0eXBlOiBzdHJpbmcgPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdKc29uQXBpTW9kZWxDb25maWcnLCBtb2RlbFR5cGUpLnR5cGU7XG4gICAgcmV0dXJuIHRoaXMuaW50ZXJuYWxTdG9yZVt0eXBlXSA/IHRoaXMuaW50ZXJuYWxTdG9yZVt0eXBlXVtpZF0gYXMgVCA6IG51bGw7XG4gIH1cblxuICBwdWJsaWMgcGVla0FsbDxUIGV4dGVuZHMgSnNvbkFwaU1vZGVsPihtb2RlbFR5cGU6IE1vZGVsVHlwZTxUPik6IEFycmF5PFQ+IHtcbiAgICBjb25zdCB0eXBlID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnSnNvbkFwaU1vZGVsQ29uZmlnJywgbW9kZWxUeXBlKS50eXBlO1xuICAgIGNvbnN0IHR5cGVTdG9yZSA9IHRoaXMuaW50ZXJuYWxTdG9yZVt0eXBlXTtcbiAgICByZXR1cm4gdHlwZVN0b3JlID8gT2JqZWN0LmtleXModHlwZVN0b3JlKS5tYXAoKGtleSkgPT4gdHlwZVN0b3JlW2tleV0gYXMgVCkgOiBbXTtcbiAgfVxuXG4gIHB1YmxpYyBkZXNlcmlhbGl6ZU1vZGVsPFQgZXh0ZW5kcyBKc29uQXBpTW9kZWw+KG1vZGVsVHlwZTogTW9kZWxUeXBlPFQ+LCBkYXRhOiBhbnkpIHtcbiAgICBkYXRhLmF0dHJpYnV0ZXMgPSB0aGlzLnRyYW5zZm9ybVNlcmlhbGl6ZWROYW1lc1RvUHJvcGVydHlOYW1lcyhtb2RlbFR5cGUsIGRhdGEuYXR0cmlidXRlcyk7XG4gICAgcmV0dXJuIG5ldyBtb2RlbFR5cGUodGhpcywgZGF0YSk7XG4gIH1cblxuICBwdWJsaWMgYWRkVG9TdG9yZShtb2RlbE9yTW9kZWxzOiBKc29uQXBpTW9kZWwgfCBKc29uQXBpTW9kZWxbXSk6IHZvaWQge1xuICAgIGNvbnN0IG1vZGVscyA9IEFycmF5LmlzQXJyYXkobW9kZWxPck1vZGVscykgPyBtb2RlbE9yTW9kZWxzIDogW21vZGVsT3JNb2RlbHNdO1xuICAgIGNvbnN0IHR5cGU6IHN0cmluZyA9IG1vZGVsc1swXS5tb2RlbENvbmZpZy50eXBlO1xuICAgIGxldCB0eXBlU3RvcmUgPSB0aGlzLmludGVybmFsU3RvcmVbdHlwZV07XG5cbiAgICBpZiAoIXR5cGVTdG9yZSkge1xuICAgICAgdHlwZVN0b3JlID0gdGhpcy5pbnRlcm5hbFN0b3JlW3R5cGVdID0ge307XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBtb2RlbCBvZiBtb2RlbHMpIHtcbiAgICAgIHR5cGVTdG9yZVttb2RlbC5pZF0gPSBtb2RlbDtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdHJhbnNmb3JtU2VyaWFsaXplZE5hbWVzVG9Qcm9wZXJ0eU5hbWVzPFQgZXh0ZW5kcyBKc29uQXBpTW9kZWw+KG1vZGVsVHlwZTogTW9kZWxUeXBlPFQ+LCBhdHRyaWJ1dGVzOiBhbnkpIHtcbiAgICBjb25zdCBzZXJpYWxpemVkTmFtZVRvUHJvcGVydHlOYW1lID0gdGhpcy5nZXRNb2RlbFByb3BlcnR5TmFtZXMobW9kZWxUeXBlLnByb3RvdHlwZSk7XG4gICAgY29uc3QgcHJvcGVydGllczogYW55ID0ge307XG5cbiAgICBPYmplY3Qua2V5cyhzZXJpYWxpemVkTmFtZVRvUHJvcGVydHlOYW1lKS5mb3JFYWNoKChzZXJpYWxpemVkTmFtZSkgPT4ge1xuICAgICAgaWYgKGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgcHJvcGVydGllc1tzZXJpYWxpemVkTmFtZVRvUHJvcGVydHlOYW1lW3NlcmlhbGl6ZWROYW1lXV0gPSBhdHRyaWJ1dGVzW3NlcmlhbGl6ZWROYW1lXTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBwcm9wZXJ0aWVzO1xuICB9XG5cbiAgcHJvdGVjdGVkIGJ1aWxkVXJsPFQgZXh0ZW5kcyBKc29uQXBpTW9kZWw+KFxuICAgIG1vZGVsVHlwZTogTW9kZWxUeXBlPFQ+LFxuICAgIHBhcmFtcz86IGFueSxcbiAgICBpZD86IHN0cmluZyxcbiAgICBjdXN0b21Vcmw/OiBzdHJpbmdcbiAgKTogc3RyaW5nIHtcbiAgICAvLyBUT0RPOiB1c2UgSHR0cFBhcmFtcyBpbnN0ZWFkIG9mIGFwcGVuZGluZyBhIHN0cmluZyB0byB0aGUgdXJsXG4gICAgY29uc3QgcXVlcnlQYXJhbXM6IHN0cmluZyA9IHRoaXMudG9RdWVyeVN0cmluZyhwYXJhbXMpO1xuXG4gICAgaWYgKGN1c3RvbVVybCkge1xuICAgICAgcmV0dXJuIHF1ZXJ5UGFyYW1zID8gYCR7Y3VzdG9tVXJsfT8ke3F1ZXJ5UGFyYW1zfWAgOiBjdXN0b21Vcmw7XG4gICAgfVxuXG4gICAgY29uc3QgbW9kZWxDb25maWc6IE1vZGVsQ29uZmlnID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnSnNvbkFwaU1vZGVsQ29uZmlnJywgbW9kZWxUeXBlKTtcblxuICAgIGNvbnN0IGJhc2VVcmwgPSBtb2RlbENvbmZpZy5iYXNlVXJsIHx8IHRoaXMuZGF0YXN0b3JlQ29uZmlnLmJhc2VVcmw7XG4gICAgY29uc3QgYXBpVmVyc2lvbiA9IG1vZGVsQ29uZmlnLmFwaVZlcnNpb24gfHwgdGhpcy5kYXRhc3RvcmVDb25maWcuYXBpVmVyc2lvbjtcbiAgICBjb25zdCBtb2RlbEVuZHBvaW50VXJsOiBzdHJpbmcgPSBtb2RlbENvbmZpZy5tb2RlbEVuZHBvaW50VXJsIHx8IG1vZGVsQ29uZmlnLnR5cGU7XG5cbiAgICBjb25zdCB1cmw6IHN0cmluZyA9IFtiYXNlVXJsLCBhcGlWZXJzaW9uLCBtb2RlbEVuZHBvaW50VXJsLCBpZF0uZmlsdGVyKCh4KSA9PiB4KS5qb2luKCcvJyk7XG5cbiAgICByZXR1cm4gcXVlcnlQYXJhbXMgPyBgJHt1cmx9PyR7cXVlcnlQYXJhbXN9YCA6IHVybDtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRSZWxhdGlvbnNoaXBzKGRhdGE6IGFueSk6IGFueSB7XG4gICAgbGV0IHJlbGF0aW9uc2hpcHM6IGFueTtcblxuICAgIGNvbnN0IGJlbG9uZ3NUb01ldGFkYXRhOiBhbnlbXSA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ0JlbG9uZ3NUbycsIGRhdGEpIHx8IFtdO1xuICAgIGNvbnN0IGhhc01hbnlNZXRhZGF0YTogYW55W10gPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdIYXNNYW55JywgZGF0YSkgfHwgW107XG5cbiAgICBmb3IgKGNvbnN0IGtleSBpbiBkYXRhKSB7XG4gICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIGlmIChkYXRhW2tleV0gaW5zdGFuY2VvZiBKc29uQXBpTW9kZWwpIHtcbiAgICAgICAgICByZWxhdGlvbnNoaXBzID0gcmVsYXRpb25zaGlwcyB8fCB7fTtcblxuICAgICAgICAgIGlmIChkYXRhW2tleV0uaWQpIHtcbiAgICAgICAgICAgIGNvbnN0IGVudGl0eSA9IGJlbG9uZ3NUb01ldGFkYXRhLmZpbmQoKGl0OiBhbnkpID0+IGl0LnByb3BlcnR5TmFtZSA9PT0ga2V5KTtcbiAgICAgICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcEtleSA9IGVudGl0eS5yZWxhdGlvbnNoaXA7XG4gICAgICAgICAgICByZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcEtleV0gPSB7XG4gICAgICAgICAgICAgIGRhdGE6IHRoaXMuYnVpbGRTaW5nbGVSZWxhdGlvbnNoaXBEYXRhKGRhdGFba2V5XSlcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGRhdGFba2V5XSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgY29uc3QgZW50aXR5ID0gaGFzTWFueU1ldGFkYXRhLmZpbmQoKGl0OiBhbnkpID0+IGl0LnByb3BlcnR5TmFtZSA9PT0ga2V5KTtcbiAgICAgICAgICBpZiAoZW50aXR5ICYmIHRoaXMuaXNWYWxpZFRvTWFueVJlbGF0aW9uKGRhdGFba2V5XSkpIHtcbiAgICAgICAgICAgIHJlbGF0aW9uc2hpcHMgPSByZWxhdGlvbnNoaXBzIHx8IHt9O1xuXG4gICAgICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBLZXkgPSBlbnRpdHkucmVsYXRpb25zaGlwO1xuICAgICAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGF0YSA9IGRhdGFba2V5XVxuICAgICAgICAgICAgICAuZmlsdGVyKChtb2RlbDogSnNvbkFwaU1vZGVsKSA9PiBtb2RlbC5pZClcbiAgICAgICAgICAgICAgLm1hcCgobW9kZWw6IEpzb25BcGlNb2RlbCkgPT4gdGhpcy5idWlsZFNpbmdsZVJlbGF0aW9uc2hpcERhdGEobW9kZWwpKTtcblxuICAgICAgICAgICAgcmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBLZXldID0ge1xuICAgICAgICAgICAgICBkYXRhOiByZWxhdGlvbnNoaXBEYXRhXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZWxhdGlvbnNoaXBzO1xuICB9XG5cbiAgcHJvdGVjdGVkIGlzVmFsaWRUb01hbnlSZWxhdGlvbihvYmplY3RzOiBBcnJheTxhbnk+KTogYm9vbGVhbiB7XG4gICAgaWYgKCFvYmplY3RzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGNvbnN0IGlzSnNvbkFwaU1vZGVsID0gb2JqZWN0cy5ldmVyeSgoaXRlbSkgPT4gaXRlbSBpbnN0YW5jZW9mIEpzb25BcGlNb2RlbCk7XG4gICAgaWYgKCFpc0pzb25BcGlNb2RlbCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCB0eXBlcyA9IG9iamVjdHMubWFwKChpdGVtOiBKc29uQXBpTW9kZWwpID0+IGl0ZW0ubW9kZWxDb25maWcubW9kZWxFbmRwb2ludFVybCB8fCBpdGVtLm1vZGVsQ29uZmlnLnR5cGUpO1xuICAgIHJldHVybiB0eXBlc1xuICAgICAgLmZpbHRlcigodHlwZTogc3RyaW5nLCBpbmRleDogbnVtYmVyLCBzZWxmOiBzdHJpbmdbXSkgPT4gc2VsZi5pbmRleE9mKHR5cGUpID09PSBpbmRleClcbiAgICAgIC5sZW5ndGggPT09IDE7XG4gIH1cblxuICBwcm90ZWN0ZWQgYnVpbGRTaW5nbGVSZWxhdGlvbnNoaXBEYXRhKG1vZGVsOiBKc29uQXBpTW9kZWwpOiBhbnkge1xuICAgIGNvbnN0IHJlbGF0aW9uc2hpcFR5cGU6IHN0cmluZyA9IG1vZGVsLm1vZGVsQ29uZmlnLnR5cGU7XG4gICAgY29uc3QgcmVsYXRpb25TaGlwRGF0YTogeyB0eXBlOiBzdHJpbmcsIGlkPzogc3RyaW5nLCBhdHRyaWJ1dGVzPzogYW55IH0gPSB7dHlwZTogcmVsYXRpb25zaGlwVHlwZX07XG5cbiAgICBpZiAobW9kZWwuaWQpIHtcbiAgICAgIHJlbGF0aW9uU2hpcERhdGEuaWQgPSBtb2RlbC5pZDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgYXR0cmlidXRlc01ldGFkYXRhOiBhbnkgPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdBdHRyaWJ1dGUnLCBtb2RlbCk7XG4gICAgICByZWxhdGlvblNoaXBEYXRhLmF0dHJpYnV0ZXMgPSB0aGlzLmdldERpcnR5QXR0cmlidXRlcyhhdHRyaWJ1dGVzTWV0YWRhdGEsIG1vZGVsKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVsYXRpb25TaGlwRGF0YTtcbiAgfVxuXG4gIHByb3RlY3RlZCBleHRyYWN0UXVlcnlEYXRhPFQgZXh0ZW5kcyBKc29uQXBpTW9kZWw+KFxuICAgIHJlc3BvbnNlOiBIdHRwUmVzcG9uc2U8b2JqZWN0PixcbiAgICBtb2RlbFR5cGU6IE1vZGVsVHlwZTxUPixcbiAgICB3aXRoTWV0YSA9IGZhbHNlXG4gICk6IEFycmF5PFQ+IHwgSnNvbkFwaVF1ZXJ5RGF0YTxUPiB7XG4gICAgY29uc3QgYm9keTogYW55ID0gcmVzcG9uc2UuYm9keTtcbiAgICBjb25zdCBtb2RlbHM6IFRbXSA9IFtdO1xuXG4gICAgYm9keS5kYXRhLmZvckVhY2goKGRhdGE6IGFueSkgPT4ge1xuICAgICAgbGV0IHR5cGUgPSB0aGlzLmRhdGFzdG9yZUNvbmZpZy5tb2RlbHNbZGF0YS50eXBlXTtcbiAgICAgIHR5cGUgPSB0eXBlID8gdHlwZSA6IG1vZGVsVHlwZTtcbiAgICAgIGNvbnN0IG1vZGVsOiBUID0gdGhpcy5kZXNlcmlhbGl6ZU1vZGVsKHR5cGUsIGRhdGEpO1xuICAgICAgdGhpcy5hZGRUb1N0b3JlKG1vZGVsKTtcblxuICAgICAgaWYgKGJvZHkuaW5jbHVkZWQpIHtcbiAgICAgICAgbW9kZWwuc3luY1JlbGF0aW9uc2hpcHMoZGF0YSwgYm9keS5pbmNsdWRlZC5jb25jYXQoZGF0YSkpO1xuICAgICAgICB0aGlzLmFkZFRvU3RvcmUobW9kZWwpO1xuICAgICAgfVxuXG4gICAgICBtb2RlbHMucHVzaChtb2RlbCk7XG4gICAgfSk7XG5cbiAgICBpZiAod2l0aE1ldGEgJiYgd2l0aE1ldGEgPT09IHRydWUpIHtcbiAgICAgIHJldHVybiBuZXcgSnNvbkFwaVF1ZXJ5RGF0YShtb2RlbHMsIHRoaXMucGFyc2VNZXRhKGJvZHksIG1vZGVsVHlwZSkpO1xuICAgIH1cblxuICAgIHJldHVybiBtb2RlbHM7XG4gIH1cblxuICBwcm90ZWN0ZWQgZXh0cmFjdFJlY29yZERhdGE8VCBleHRlbmRzIEpzb25BcGlNb2RlbD4oXG4gICAgcmVzOiBIdHRwUmVzcG9uc2U8b2JqZWN0PixcbiAgICBtb2RlbFR5cGU6IE1vZGVsVHlwZTxUPixcbiAgICBtb2RlbD86IFRcbiAgKTogVCB7XG4gICAgY29uc3QgYm9keTogYW55ID0gcmVzLmJvZHk7XG4gICAgLy8gRXJyb3IgaW4gQW5ndWxhciA8IDUuMi40IChzZWUgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMjA3NDQpXG4gICAgLy8gbnVsbCBpcyBjb252ZXJ0ZWQgdG8gJ251bGwnLCBzbyB0aGlzIGlzIHRlbXBvcmFyeSBuZWVkZWQgdG8gbWFrZSB0ZXN0Y2FzZSBwb3NzaWJsZVxuICAgIC8vIChhbmQgdG8gYXZvaWQgYSBkZWNyZWFzZSBvZiB0aGUgY292ZXJhZ2UpXG4gICAgaWYgKCFib2R5IHx8IGJvZHkgPT09ICdudWxsJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdubyBib2R5IGluIHJlc3BvbnNlJyk7XG4gICAgfVxuXG4gICAgaWYgKCFib2R5LmRhdGEpIHtcbiAgICAgIGlmIChyZXMuc3RhdHVzID09PSAyMDEgfHwgIW1vZGVsKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignZXhwZWN0ZWQgZGF0YSBpbiByZXNwb25zZScpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1vZGVsO1xuICAgIH1cblxuICAgIGlmIChtb2RlbCkge1xuICAgICAgbW9kZWwubW9kZWxJbml0aWFsaXphdGlvbiA9IHRydWU7XG4gICAgICBtb2RlbC5pZCA9IGJvZHkuZGF0YS5pZDtcbiAgICAgIE9iamVjdC5hc3NpZ24obW9kZWwsIGJvZHkuZGF0YS5hdHRyaWJ1dGVzKTtcbiAgICAgIG1vZGVsLm1vZGVsSW5pdGlhbGl6YXRpb24gPSBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBkZXNlcmlhbGl6ZWRNb2RlbCA9IG1vZGVsIHx8IHRoaXMuZGVzZXJpYWxpemVNb2RlbChtb2RlbFR5cGUsIGJvZHkuZGF0YSk7XG4gICAgdGhpcy5hZGRUb1N0b3JlKGRlc2VyaWFsaXplZE1vZGVsKTtcbiAgICBpZiAoYm9keS5pbmNsdWRlZCkge1xuICAgICAgZGVzZXJpYWxpemVkTW9kZWwuc3luY1JlbGF0aW9uc2hpcHMoYm9keS5kYXRhLCBib2R5LmluY2x1ZGVkKTtcbiAgICAgIHRoaXMuYWRkVG9TdG9yZShkZXNlcmlhbGl6ZWRNb2RlbCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlc2VyaWFsaXplZE1vZGVsO1xuICB9XG5cbiAgcHJvdGVjdGVkIGhhbmRsZUVycm9yKGVycm9yOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIGlmIChcbiAgICAgIGVycm9yIGluc3RhbmNlb2YgSHR0cEVycm9yUmVzcG9uc2UgJiZcbiAgICAgIGVycm9yLmVycm9yIGluc3RhbmNlb2YgT2JqZWN0ICYmXG4gICAgICBlcnJvci5lcnJvci5lcnJvcnMgJiZcbiAgICAgIGVycm9yLmVycm9yLmVycm9ycyBpbnN0YW5jZW9mIEFycmF5XG4gICAgKSB7XG4gICAgICBjb25zdCBlcnJvcnM6IEVycm9yUmVzcG9uc2UgPSBuZXcgRXJyb3JSZXNwb25zZShlcnJvci5lcnJvci5lcnJvcnMpO1xuICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyb3JzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhyb3dFcnJvcihlcnJvcik7XG4gIH1cblxuICBwcm90ZWN0ZWQgcGFyc2VNZXRhKGJvZHk6IGFueSwgbW9kZWxUeXBlOiBNb2RlbFR5cGU8SnNvbkFwaU1vZGVsPik6IGFueSB7XG4gICAgY29uc3QgbWV0YU1vZGVsOiBhbnkgPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdKc29uQXBpTW9kZWxDb25maWcnLCBtb2RlbFR5cGUpLm1ldGE7XG4gICAgcmV0dXJuIG5ldyBtZXRhTW9kZWwoYm9keSk7XG4gIH1cblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWQgdXNlIGJ1aWxkSHR0cEhlYWRlcnMgbWV0aG9kIHRvIGJ1aWxkIHJlcXVlc3QgaGVhZGVyc1xuICAgKi9cbiAgcHJvdGVjdGVkIGdldE9wdGlvbnMoY3VzdG9tSGVhZGVycz86IEh0dHBIZWFkZXJzKTogYW55IHtcbiAgICByZXR1cm4ge1xuICAgICAgaGVhZGVyczogdGhpcy5idWlsZEh0dHBIZWFkZXJzKGN1c3RvbUhlYWRlcnMpLFxuICAgIH07XG4gIH1cblxuICBwcm90ZWN0ZWQgYnVpbGRIdHRwSGVhZGVycyhjdXN0b21IZWFkZXJzPzogSHR0cEhlYWRlcnMpOiBIdHRwSGVhZGVycyB7XG4gICAgbGV0IHJlcXVlc3RIZWFkZXJzOiBIdHRwSGVhZGVycyA9IG5ldyBIdHRwSGVhZGVycyh7XG4gICAgICBBY2NlcHQ6ICdhcHBsaWNhdGlvbi92bmQuYXBpK2pzb24nLFxuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi92bmQuYXBpK2pzb24nXG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5nbG9iYWxIZWFkZXJzKSB7XG4gICAgICB0aGlzLmdsb2JhbEhlYWRlcnMua2V5cygpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICBpZiAodGhpcy5nbG9iYWxIZWFkZXJzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgcmVxdWVzdEhlYWRlcnMgPSByZXF1ZXN0SGVhZGVycy5zZXQoa2V5LCB0aGlzLmdsb2JhbEhlYWRlcnMuZ2V0KGtleSkpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoY3VzdG9tSGVhZGVycykge1xuICAgICAgY3VzdG9tSGVhZGVycy5rZXlzKCkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgIGlmIChjdXN0b21IZWFkZXJzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgcmVxdWVzdEhlYWRlcnMgPSByZXF1ZXN0SGVhZGVycy5zZXQoa2V5LCBjdXN0b21IZWFkZXJzLmdldChrZXkpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcXVlc3RIZWFkZXJzO1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlc2V0TWV0YWRhdGFBdHRyaWJ1dGVzPFQgZXh0ZW5kcyBKc29uQXBpTW9kZWw+KHJlczogVCwgYXR0cmlidXRlc01ldGFkYXRhOiBhbnksIG1vZGVsVHlwZTogTW9kZWxUeXBlPFQ+KSB7XG4gICAgZm9yIChjb25zdCBwcm9wZXJ0eU5hbWUgaW4gYXR0cmlidXRlc01ldGFkYXRhKSB7XG4gICAgICBpZiAoYXR0cmlidXRlc01ldGFkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgY29uc3QgbWV0YWRhdGE6IGFueSA9IGF0dHJpYnV0ZXNNZXRhZGF0YVtwcm9wZXJ0eU5hbWVdO1xuXG4gICAgICAgIGlmIChtZXRhZGF0YS5oYXNEaXJ0eUF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICBtZXRhZGF0YS5oYXNEaXJ0eUF0dHJpYnV0ZXMgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICByZXNbQXR0cmlidXRlTWV0YWRhdGFJbmRleF0gPSBhdHRyaWJ1dGVzTWV0YWRhdGE7XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIHByb3RlY3RlZCB1cGRhdGVSZWxhdGlvbnNoaXBzPFQgZXh0ZW5kcyBKc29uQXBpTW9kZWw+KG1vZGVsOiBULCByZWxhdGlvbnNoaXBzOiBhbnkpOiBUIHtcbiAgICBjb25zdCBtb2RlbHNUeXBlczogYW55ID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnSnNvbkFwaURhdGFzdG9yZUNvbmZpZycsIHRoaXMuY29uc3RydWN0b3IpLm1vZGVscztcblxuICAgIGZvciAoY29uc3QgcmVsYXRpb25zaGlwIGluIHJlbGF0aW9uc2hpcHMpIHtcbiAgICAgIGlmIChyZWxhdGlvbnNoaXBzLmhhc093blByb3BlcnR5KHJlbGF0aW9uc2hpcCkgJiYgbW9kZWwuaGFzT3duUHJvcGVydHkocmVsYXRpb25zaGlwKSkge1xuICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBNb2RlbDogSnNvbkFwaU1vZGVsID0gbW9kZWxbcmVsYXRpb25zaGlwXTtcbiAgICAgICAgY29uc3QgaGFzTWFueTogYW55W10gPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdIYXNNYW55JywgcmVsYXRpb25zaGlwTW9kZWwpO1xuICAgICAgICBjb25zdCBwcm9wZXJ0eUhhc01hbnk6IGFueSA9IGZpbmQoaGFzTWFueSwgKHByb3BlcnR5KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIG1vZGVsc1R5cGVzW3Byb3BlcnR5LnJlbGF0aW9uc2hpcF0gPT09IG1vZGVsLmNvbnN0cnVjdG9yO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAocHJvcGVydHlIYXNNYW55KSB7XG4gICAgICAgICAgcmVsYXRpb25zaGlwTW9kZWxbcHJvcGVydHlIYXNNYW55LnByb3BlcnR5TmFtZV0gPSByZWxhdGlvbnNoaXBNb2RlbFtwcm9wZXJ0eUhhc01hbnkucHJvcGVydHlOYW1lXSB8fCBbXTtcblxuICAgICAgICAgIGNvbnN0IGluZGV4T2ZNb2RlbCA9IHJlbGF0aW9uc2hpcE1vZGVsW3Byb3BlcnR5SGFzTWFueS5wcm9wZXJ0eU5hbWVdLmluZGV4T2YobW9kZWwpO1xuXG4gICAgICAgICAgaWYgKGluZGV4T2ZNb2RlbCA9PT0gLTEpIHtcbiAgICAgICAgICAgIHJlbGF0aW9uc2hpcE1vZGVsW3Byb3BlcnR5SGFzTWFueS5wcm9wZXJ0eU5hbWVdLnB1c2gobW9kZWwpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZWxhdGlvbnNoaXBNb2RlbFtwcm9wZXJ0eUhhc01hbnkucHJvcGVydHlOYW1lXVtpbmRleE9mTW9kZWxdID0gbW9kZWw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG1vZGVsO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldE1vZGVsUHJvcGVydHlOYW1lcyhtb2RlbDogSnNvbkFwaU1vZGVsKSB7XG4gICAgcmV0dXJuIFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ0F0dHJpYnV0ZU1hcHBpbmcnLCBtb2RlbCkgfHwgW107XG4gIH1cblxuICBwcml2YXRlIGJ1aWxkUmVxdWVzdE9wdGlvbnMoY3VzdG9tT3B0aW9uczogYW55ID0ge30pOiBvYmplY3Qge1xuICAgIGNvbnN0IGh0dHBIZWFkZXJzOiBIdHRwSGVhZGVycyA9IHRoaXMuYnVpbGRIdHRwSGVhZGVycyhjdXN0b21PcHRpb25zLmhlYWRlcnMpO1xuXG4gICAgY29uc3QgcmVxdWVzdE9wdGlvbnM6IG9iamVjdCA9IE9iamVjdC5hc3NpZ24oY3VzdG9tT3B0aW9ucywge1xuICAgICAgaGVhZGVyczogaHR0cEhlYWRlcnNcbiAgICB9KTtcblxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHRoaXMuZ2xvYmFsUmVxdWVzdE9wdGlvbnMsIHJlcXVlc3RPcHRpb25zKTtcbiAgfVxuXG4gIHByaXZhdGUgX3RvUXVlcnlTdHJpbmcocGFyYW1zOiBhbnkpOiBzdHJpbmcge1xuICAgIHJldHVybiBxcy5zdHJpbmdpZnkocGFyYW1zLCB7YXJyYXlGb3JtYXQ6ICdicmFja2V0cyd9KTtcbiAgfVxufVxuIl19