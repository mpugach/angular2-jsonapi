/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
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
var AttributeMetadataIndex = (/** @type {?} */ (AttributeMetadata));
var JsonApiDatastore = /** @class */ (function () {
    function JsonApiDatastore(http) {
        this.http = http;
        this.globalRequestOptions = {};
        this.internalStore = {};
        this.toQueryString = this.datastoreConfig.overrides
            && this.datastoreConfig.overrides.toQueryString ?
            this.datastoreConfig.overrides.toQueryString : this._toQueryString;
    }
    Object.defineProperty(JsonApiDatastore.prototype, "headers", {
        set: /**
         * @param {?} headers
         * @return {?}
         */
        function (headers) {
            this.globalHeaders = headers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JsonApiDatastore.prototype, "requestOptions", {
        set: /**
         * @param {?} requestOptions
         * @return {?}
         */
        function (requestOptions) {
            this.globalRequestOptions = requestOptions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JsonApiDatastore.prototype, "datastoreConfig", {
        get: /**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var configFromDecorator = Reflect.getMetadata('JsonApiDatastoreConfig', this.constructor);
            return Object.assign(configFromDecorator, this.config);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JsonApiDatastore.prototype, "getDirtyAttributes", {
        get: /**
         * @private
         * @return {?}
         */
        function () {
            if (this.datastoreConfig.overrides
                && this.datastoreConfig.overrides.getDirtyAttributes) {
                return this.datastoreConfig.overrides.getDirtyAttributes;
            }
            return JsonApiDatastore.getDirtyAttributes;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     * @param {?} attributesMetadata
     * @return {?}
     */
    JsonApiDatastore.getDirtyAttributes = /**
     * @private
     * @param {?} attributesMetadata
     * @return {?}
     */
    function (attributesMetadata) {
        /** @type {?} */
        var dirtyData = {};
        for (var propertyName in attributesMetadata) {
            if (attributesMetadata.hasOwnProperty(propertyName)) {
                /** @type {?} */
                var metadata = attributesMetadata[propertyName];
                if (metadata.hasDirtyAttributes) {
                    /** @type {?} */
                    var attributeName = metadata.serializedName != null ? metadata.serializedName : propertyName;
                    dirtyData[attributeName] = metadata.serialisationValue ? metadata.serialisationValue : metadata.newValue;
                }
            }
        }
        return dirtyData;
    };
    /**
     * @deprecated use findAll method to take all models
     */
    /**
     * @deprecated use findAll method to take all models
     * @template T
     * @param {?} modelType
     * @param {?=} params
     * @param {?=} headers
     * @param {?=} customUrl
     * @return {?}
     */
    JsonApiDatastore.prototype.query = /**
     * @deprecated use findAll method to take all models
     * @template T
     * @param {?} modelType
     * @param {?=} params
     * @param {?=} headers
     * @param {?=} customUrl
     * @return {?}
     */
    function (modelType, params, headers, customUrl) {
        var _this = this;
        /** @type {?} */
        var requestHeaders = this.buildHttpHeaders(headers);
        /** @type {?} */
        var url = this.buildUrl(modelType, params, undefined, customUrl);
        return this.http.get(url, { headers: requestHeaders })
            .pipe(map((/**
         * @param {?} res
         * @return {?}
         */
        function (res) { return _this.extractQueryData(res, modelType); })), catchError((/**
         * @param {?} res
         * @return {?}
         */
        function (res) { return _this.handleError(res); })));
    };
    /**
     * @template T
     * @param {?} modelType
     * @param {?=} params
     * @param {?=} headers
     * @param {?=} customUrl
     * @return {?}
     */
    JsonApiDatastore.prototype.findAll = /**
     * @template T
     * @param {?} modelType
     * @param {?=} params
     * @param {?=} headers
     * @param {?=} customUrl
     * @return {?}
     */
    function (modelType, params, headers, customUrl) {
        var _this = this;
        /** @type {?} */
        var url = this.buildUrl(modelType, params, undefined, customUrl);
        /** @type {?} */
        var requestOptions = this.buildRequestOptions({ headers: headers, observe: 'response' });
        return this.http.get(url, requestOptions)
            .pipe(map((/**
         * @param {?} res
         * @return {?}
         */
        function (res) { return _this.extractQueryData(res, modelType, true); })), catchError((/**
         * @param {?} res
         * @return {?}
         */
        function (res) { return _this.handleError(res); })));
    };
    /**
     * @template T
     * @param {?} modelType
     * @param {?} id
     * @param {?=} params
     * @param {?=} headers
     * @param {?=} customUrl
     * @return {?}
     */
    JsonApiDatastore.prototype.findRecord = /**
     * @template T
     * @param {?} modelType
     * @param {?} id
     * @param {?=} params
     * @param {?=} headers
     * @param {?=} customUrl
     * @return {?}
     */
    function (modelType, id, params, headers, customUrl) {
        var _this = this;
        /** @type {?} */
        var requestOptions = this.buildRequestOptions({ headers: headers, observe: 'response' });
        /** @type {?} */
        var url = this.buildUrl(modelType, params, id, customUrl);
        return this.http.get(url, requestOptions)
            .pipe(map((/**
         * @param {?} res
         * @return {?}
         */
        function (res) { return _this.extractRecordData(res, modelType); })), catchError((/**
         * @param {?} res
         * @return {?}
         */
        function (res) { return _this.handleError(res); })));
    };
    /**
     * @template T
     * @param {?} modelType
     * @param {?=} data
     * @return {?}
     */
    JsonApiDatastore.prototype.createRecord = /**
     * @template T
     * @param {?} modelType
     * @param {?=} data
     * @return {?}
     */
    function (modelType, data) {
        return new modelType(this, { attributes: data });
    };
    /**
     * @template T
     * @param {?} attributesMetadata
     * @param {?} model
     * @param {?=} params
     * @param {?=} headers
     * @param {?=} customUrl
     * @return {?}
     */
    JsonApiDatastore.prototype.saveRecord = /**
     * @template T
     * @param {?} attributesMetadata
     * @param {?} model
     * @param {?=} params
     * @param {?=} headers
     * @param {?=} customUrl
     * @return {?}
     */
    function (attributesMetadata, model, params, headers, customUrl) {
        var _this = this;
        /** @type {?} */
        var modelType = (/** @type {?} */ (model.constructor));
        /** @type {?} */
        var modelConfig = model.modelConfig;
        /** @type {?} */
        var typeName = modelConfig.type;
        /** @type {?} */
        var relationships = this.getRelationships(model);
        /** @type {?} */
        var url = this.buildUrl(modelType, params, model.id, customUrl);
        /** @type {?} */
        var httpCall;
        /** @type {?} */
        var body = {
            data: {
                relationships: relationships,
                type: typeName,
                id: model.id,
                attributes: this.getDirtyAttributes(attributesMetadata, model)
            }
        };
        /** @type {?} */
        var requestOptions = this.buildRequestOptions({ headers: headers, observe: 'response' });
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
        function (res) { return [200, 201].indexOf(res.status) !== -1 ? _this.extractRecordData(res, modelType, model) : model; })), catchError((/**
         * @param {?} res
         * @return {?}
         */
        function (res) {
            if (res == null) {
                return of(model);
            }
            return _this.handleError(res);
        })), map((/**
         * @param {?} res
         * @return {?}
         */
        function (res) { return _this.updateRelationships(res, relationships); })));
    };
    /**
     * @template T
     * @param {?} modelType
     * @param {?} id
     * @param {?=} headers
     * @param {?=} customUrl
     * @return {?}
     */
    JsonApiDatastore.prototype.deleteRecord = /**
     * @template T
     * @param {?} modelType
     * @param {?} id
     * @param {?=} headers
     * @param {?=} customUrl
     * @return {?}
     */
    function (modelType, id, headers, customUrl) {
        var _this = this;
        /** @type {?} */
        var requestOptions = this.buildRequestOptions({ headers: headers });
        /** @type {?} */
        var url = this.buildUrl(modelType, null, id, customUrl);
        return this.http.delete(url, requestOptions)
            .pipe(catchError((/**
         * @param {?} res
         * @return {?}
         */
        function (res) { return _this.handleError(res); })));
    };
    /**
     * @template T
     * @param {?} modelType
     * @param {?} id
     * @return {?}
     */
    JsonApiDatastore.prototype.peekRecord = /**
     * @template T
     * @param {?} modelType
     * @param {?} id
     * @return {?}
     */
    function (modelType, id) {
        /** @type {?} */
        var type = Reflect.getMetadata('JsonApiModelConfig', modelType).type;
        return this.internalStore[type] ? (/** @type {?} */ (this.internalStore[type][id])) : null;
    };
    /**
     * @template T
     * @param {?} modelType
     * @return {?}
     */
    JsonApiDatastore.prototype.peekAll = /**
     * @template T
     * @param {?} modelType
     * @return {?}
     */
    function (modelType) {
        /** @type {?} */
        var type = Reflect.getMetadata('JsonApiModelConfig', modelType).type;
        /** @type {?} */
        var typeStore = this.internalStore[type];
        return typeStore ? Object.keys(typeStore).map((/**
         * @param {?} key
         * @return {?}
         */
        function (key) { return (/** @type {?} */ (typeStore[key])); })) : [];
    };
    /**
     * @template T
     * @param {?} modelType
     * @param {?} data
     * @return {?}
     */
    JsonApiDatastore.prototype.deserializeModel = /**
     * @template T
     * @param {?} modelType
     * @param {?} data
     * @return {?}
     */
    function (modelType, data) {
        data.attributes = this.transformSerializedNamesToPropertyNames(modelType, data.attributes);
        return new modelType(this, data);
    };
    /**
     * @param {?} modelOrModels
     * @return {?}
     */
    JsonApiDatastore.prototype.addToStore = /**
     * @param {?} modelOrModels
     * @return {?}
     */
    function (modelOrModels) {
        var e_1, _a;
        /** @type {?} */
        var models = Array.isArray(modelOrModels) ? modelOrModels : [modelOrModels];
        /** @type {?} */
        var type = models[0].modelConfig.type;
        /** @type {?} */
        var typeStore = this.internalStore[type];
        if (!typeStore) {
            typeStore = this.internalStore[type] = {};
        }
        try {
            for (var models_1 = tslib_1.__values(models), models_1_1 = models_1.next(); !models_1_1.done; models_1_1 = models_1.next()) {
                var model = models_1_1.value;
                typeStore[model.id] = model;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (models_1_1 && !models_1_1.done && (_a = models_1.return)) _a.call(models_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    /**
     * @template T
     * @param {?} modelType
     * @param {?} attributes
     * @return {?}
     */
    JsonApiDatastore.prototype.transformSerializedNamesToPropertyNames = /**
     * @template T
     * @param {?} modelType
     * @param {?} attributes
     * @return {?}
     */
    function (modelType, attributes) {
        /** @type {?} */
        var serializedNameToPropertyName = this.getModelPropertyNames(modelType.prototype);
        /** @type {?} */
        var properties = {};
        Object.keys(serializedNameToPropertyName).forEach((/**
         * @param {?} serializedName
         * @return {?}
         */
        function (serializedName) {
            if (attributes && attributes[serializedName] !== null && attributes[serializedName] !== undefined) {
                properties[serializedNameToPropertyName[serializedName]] = attributes[serializedName];
            }
        }));
        return properties;
    };
    /**
     * @protected
     * @template T
     * @param {?} modelType
     * @param {?=} params
     * @param {?=} id
     * @param {?=} customUrl
     * @return {?}
     */
    JsonApiDatastore.prototype.buildUrl = /**
     * @protected
     * @template T
     * @param {?} modelType
     * @param {?=} params
     * @param {?=} id
     * @param {?=} customUrl
     * @return {?}
     */
    function (modelType, params, id, customUrl) {
        // TODO: use HttpParams instead of appending a string to the url
        /** @type {?} */
        var queryParams = this.toQueryString(params);
        if (customUrl) {
            return queryParams ? customUrl + "?" + queryParams : customUrl;
        }
        /** @type {?} */
        var modelConfig = Reflect.getMetadata('JsonApiModelConfig', modelType);
        /** @type {?} */
        var baseUrl = modelConfig.baseUrl || this.datastoreConfig.baseUrl;
        /** @type {?} */
        var apiVersion = modelConfig.apiVersion || this.datastoreConfig.apiVersion;
        /** @type {?} */
        var modelEndpointUrl = modelConfig.modelEndpointUrl || modelConfig.type;
        /** @type {?} */
        var url = [baseUrl, apiVersion, modelEndpointUrl, id].filter((/**
         * @param {?} x
         * @return {?}
         */
        function (x) { return x; })).join('/');
        return queryParams ? url + "?" + queryParams : url;
    };
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    JsonApiDatastore.prototype.getRelationships = /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    function (data) {
        var _this = this;
        /** @type {?} */
        var relationships;
        /** @type {?} */
        var belongsToMetadata = Reflect.getMetadata('BelongsTo', data) || [];
        /** @type {?} */
        var hasManyMetadata = Reflect.getMetadata('HasMany', data) || [];
        var _loop_1 = function (key) {
            if (data.hasOwnProperty(key)) {
                if (data[key] instanceof JsonApiModel) {
                    relationships = relationships || {};
                    if (data[key].id) {
                        /** @type {?} */
                        var entity = belongsToMetadata.find((/**
                         * @param {?} it
                         * @return {?}
                         */
                        function (it) { return it.propertyName === key; }));
                        /** @type {?} */
                        var relationshipKey = entity.relationship;
                        relationships[relationshipKey] = {
                            data: this_1.buildSingleRelationshipData(data[key])
                        };
                    }
                }
                else if (data[key] instanceof Array) {
                    /** @type {?} */
                    var entity = hasManyMetadata.find((/**
                     * @param {?} it
                     * @return {?}
                     */
                    function (it) { return it.propertyName === key; }));
                    if (entity && this_1.isValidToManyRelation(data[key])) {
                        relationships = relationships || {};
                        /** @type {?} */
                        var relationshipKey = entity.relationship;
                        /** @type {?} */
                        var relationshipData = data[key]
                            .filter((/**
                         * @param {?} model
                         * @return {?}
                         */
                        function (model) { return model.id; }))
                            .map((/**
                         * @param {?} model
                         * @return {?}
                         */
                        function (model) { return _this.buildSingleRelationshipData(model); }));
                        relationships[relationshipKey] = {
                            data: relationshipData
                        };
                    }
                }
            }
        };
        var this_1 = this;
        for (var key in data) {
            _loop_1(key);
        }
        return relationships;
    };
    /**
     * @protected
     * @param {?} objects
     * @return {?}
     */
    JsonApiDatastore.prototype.isValidToManyRelation = /**
     * @protected
     * @param {?} objects
     * @return {?}
     */
    function (objects) {
        if (!objects.length) {
            return true;
        }
        /** @type {?} */
        var isJsonApiModel = objects.every((/**
         * @param {?} item
         * @return {?}
         */
        function (item) { return item instanceof JsonApiModel; }));
        if (!isJsonApiModel) {
            return false;
        }
        /** @type {?} */
        var types = objects.map((/**
         * @param {?} item
         * @return {?}
         */
        function (item) { return item.modelConfig.modelEndpointUrl || item.modelConfig.type; }));
        return types
            .filter((/**
         * @param {?} type
         * @param {?} index
         * @param {?} self
         * @return {?}
         */
        function (type, index, self) { return self.indexOf(type) === index; }))
            .length === 1;
    };
    /**
     * @protected
     * @param {?} model
     * @return {?}
     */
    JsonApiDatastore.prototype.buildSingleRelationshipData = /**
     * @protected
     * @param {?} model
     * @return {?}
     */
    function (model) {
        /** @type {?} */
        var relationshipType = model.modelConfig.type;
        /** @type {?} */
        var relationShipData = { type: relationshipType };
        if (model.id) {
            relationShipData.id = model.id;
        }
        else {
            /** @type {?} */
            var attributesMetadata = Reflect.getMetadata('Attribute', model);
            relationShipData.attributes = this.getDirtyAttributes(attributesMetadata, model);
        }
        return relationShipData;
    };
    /**
     * @protected
     * @template T
     * @param {?} response
     * @param {?} modelType
     * @param {?=} withMeta
     * @return {?}
     */
    JsonApiDatastore.prototype.extractQueryData = /**
     * @protected
     * @template T
     * @param {?} response
     * @param {?} modelType
     * @param {?=} withMeta
     * @return {?}
     */
    function (response, modelType, withMeta) {
        var _this = this;
        if (withMeta === void 0) { withMeta = false; }
        /** @type {?} */
        var body = response.body;
        /** @type {?} */
        var models = [];
        body.data.forEach((/**
         * @param {?} data
         * @return {?}
         */
        function (data) {
            /** @type {?} */
            var type = _this.datastoreConfig.models[data.type];
            type = type ? type : modelType;
            /** @type {?} */
            var model = _this.deserializeModel(type, data);
            _this.addToStore(model);
            if (body.included) {
                model.syncRelationships(data, body.included.concat(data));
                _this.addToStore(model);
            }
            models.push(model);
        }));
        if (withMeta && withMeta === true) {
            return new JsonApiQueryData(models, this.parseMeta(body, modelType));
        }
        return models;
    };
    /**
     * @protected
     * @template T
     * @param {?} res
     * @param {?} modelType
     * @param {?=} model
     * @return {?}
     */
    JsonApiDatastore.prototype.extractRecordData = /**
     * @protected
     * @template T
     * @param {?} res
     * @param {?} modelType
     * @param {?=} model
     * @return {?}
     */
    function (res, modelType, model) {
        /** @type {?} */
        var body = res.body;
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
        var deserializedModel = model || this.deserializeModel(modelType, body.data);
        this.addToStore(deserializedModel);
        if (body.included) {
            deserializedModel.syncRelationships(body.data, body.included);
            this.addToStore(deserializedModel);
        }
        return deserializedModel;
    };
    /**
     * @protected
     * @param {?} error
     * @return {?}
     */
    JsonApiDatastore.prototype.handleError = /**
     * @protected
     * @param {?} error
     * @return {?}
     */
    function (error) {
        if (error instanceof HttpErrorResponse &&
            error.error instanceof Object &&
            error.error.errors &&
            error.error.errors instanceof Array) {
            /** @type {?} */
            var errors = new ErrorResponse(error.error.errors);
            return throwError(errors);
        }
        return throwError(error);
    };
    /**
     * @protected
     * @param {?} body
     * @param {?} modelType
     * @return {?}
     */
    JsonApiDatastore.prototype.parseMeta = /**
     * @protected
     * @param {?} body
     * @param {?} modelType
     * @return {?}
     */
    function (body, modelType) {
        /** @type {?} */
        var metaModel = Reflect.getMetadata('JsonApiModelConfig', modelType).meta;
        return new metaModel(body);
    };
    /**
     * @deprecated use buildHttpHeaders method to build request headers
     */
    /**
     * @deprecated use buildHttpHeaders method to build request headers
     * @protected
     * @param {?=} customHeaders
     * @return {?}
     */
    JsonApiDatastore.prototype.getOptions = /**
     * @deprecated use buildHttpHeaders method to build request headers
     * @protected
     * @param {?=} customHeaders
     * @return {?}
     */
    function (customHeaders) {
        return {
            headers: this.buildHttpHeaders(customHeaders),
        };
    };
    /**
     * @protected
     * @param {?=} customHeaders
     * @return {?}
     */
    JsonApiDatastore.prototype.buildHttpHeaders = /**
     * @protected
     * @param {?=} customHeaders
     * @return {?}
     */
    function (customHeaders) {
        var _this = this;
        /** @type {?} */
        var requestHeaders = new HttpHeaders({
            Accept: 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json'
        });
        if (this.globalHeaders) {
            this.globalHeaders.keys().forEach((/**
             * @param {?} key
             * @return {?}
             */
            function (key) {
                if (_this.globalHeaders.has(key)) {
                    requestHeaders = requestHeaders.set(key, _this.globalHeaders.get(key));
                }
            }));
        }
        if (customHeaders) {
            customHeaders.keys().forEach((/**
             * @param {?} key
             * @return {?}
             */
            function (key) {
                if (customHeaders.has(key)) {
                    requestHeaders = requestHeaders.set(key, customHeaders.get(key));
                }
            }));
        }
        return requestHeaders;
    };
    /**
     * @protected
     * @template T
     * @param {?} res
     * @param {?} attributesMetadata
     * @param {?} modelType
     * @return {?}
     */
    JsonApiDatastore.prototype.resetMetadataAttributes = /**
     * @protected
     * @template T
     * @param {?} res
     * @param {?} attributesMetadata
     * @param {?} modelType
     * @return {?}
     */
    function (res, attributesMetadata, modelType) {
        for (var propertyName in attributesMetadata) {
            if (attributesMetadata.hasOwnProperty(propertyName)) {
                /** @type {?} */
                var metadata = attributesMetadata[propertyName];
                if (metadata.hasDirtyAttributes) {
                    metadata.hasDirtyAttributes = false;
                }
            }
        }
        // @ts-ignore
        res[AttributeMetadataIndex] = attributesMetadata;
        return res;
    };
    /**
     * @protected
     * @template T
     * @param {?} model
     * @param {?} relationships
     * @return {?}
     */
    JsonApiDatastore.prototype.updateRelationships = /**
     * @protected
     * @template T
     * @param {?} model
     * @param {?} relationships
     * @return {?}
     */
    function (model, relationships) {
        /** @type {?} */
        var modelsTypes = Reflect.getMetadata('JsonApiDatastoreConfig', this.constructor).models;
        for (var relationship in relationships) {
            if (relationships.hasOwnProperty(relationship) && model.hasOwnProperty(relationship)) {
                /** @type {?} */
                var relationshipModel = model[relationship];
                /** @type {?} */
                var hasMany = Reflect.getMetadata('HasMany', relationshipModel);
                /** @type {?} */
                var propertyHasMany = find(hasMany, (/**
                 * @param {?} property
                 * @return {?}
                 */
                function (property) {
                    return modelsTypes[property.relationship] === model.constructor;
                }));
                if (propertyHasMany) {
                    relationshipModel[propertyHasMany.propertyName] = relationshipModel[propertyHasMany.propertyName] || [];
                    /** @type {?} */
                    var indexOfModel = relationshipModel[propertyHasMany.propertyName].indexOf(model);
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
    };
    /**
     * @protected
     * @param {?} model
     * @return {?}
     */
    JsonApiDatastore.prototype.getModelPropertyNames = /**
     * @protected
     * @param {?} model
     * @return {?}
     */
    function (model) {
        return Reflect.getMetadata('AttributeMapping', model) || [];
    };
    /**
     * @private
     * @param {?=} customOptions
     * @return {?}
     */
    JsonApiDatastore.prototype.buildRequestOptions = /**
     * @private
     * @param {?=} customOptions
     * @return {?}
     */
    function (customOptions) {
        if (customOptions === void 0) { customOptions = {}; }
        /** @type {?} */
        var httpHeaders = this.buildHttpHeaders(customOptions.headers);
        /** @type {?} */
        var requestOptions = Object.assign(customOptions, {
            headers: httpHeaders
        });
        return Object.assign(this.globalRequestOptions, requestOptions);
    };
    /**
     * @private
     * @param {?} params
     * @return {?}
     */
    JsonApiDatastore.prototype._toQueryString = /**
     * @private
     * @param {?} params
     * @return {?}
     */
    function (params) {
        return qs.stringify(params, { arrayFormat: 'brackets' });
    };
    JsonApiDatastore.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    JsonApiDatastore.ctorParameters = function () { return [
        { type: HttpClient }
    ]; };
    return JsonApiDatastore;
}());
export { JsonApiDatastore };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi1hcGktZGF0YXN0b3JlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyMi1qc29uYXBpLyIsInNvdXJjZXMiOlsic2VydmljZXMvanNvbi1hcGktZGF0YXN0b3JlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxVQUFVLEVBQUUsaUJBQWlCLEVBQUUsV0FBVyxFQUFnQixNQUFNLHNCQUFzQixDQUFDO0FBQ2hHLE9BQU8sSUFBSSxNQUFNLGdCQUFnQixDQUFDO0FBQ2xDLE9BQU8sRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDakQsT0FBTyxFQUFjLEVBQUUsRUFBRSxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDbEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUMvRCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUNqRSxPQUFPLEtBQUssRUFBRSxNQUFNLElBQUksQ0FBQztBQUd6QixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUN6RCxPQUFPLGtCQUFrQixDQUFDOzs7Ozs7Ozs7SUFXcEIsc0JBQXNCLEdBQVcsbUJBQUEsaUJBQWlCLEVBQU87QUFFL0Q7SUFXRSwwQkFBc0IsSUFBZ0I7UUFBaEIsU0FBSSxHQUFKLElBQUksQ0FBWTtRQU45Qix5QkFBb0IsR0FBVyxFQUFFLENBQUM7UUFDbEMsa0JBQWEsR0FBdUQsRUFBRSxDQUFDO1FBQ3ZFLGtCQUFhLEdBQTRCLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUztlQUM1RSxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUMvQyxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7SUFHckUsQ0FBQztJQUVELHNCQUFJLHFDQUFPOzs7OztRQUFYLFVBQVksT0FBb0I7WUFDOUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUM7UUFDL0IsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSw0Q0FBYzs7Ozs7UUFBbEIsVUFBbUIsY0FBc0I7WUFDdkMsSUFBSSxDQUFDLG9CQUFvQixHQUFHLGNBQWMsQ0FBQztRQUM3QyxDQUFDOzs7T0FBQTtJQUVELHNCQUFXLDZDQUFlOzs7O1FBQTFCOztnQkFDUSxtQkFBbUIsR0FBb0IsT0FBTyxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDO1lBQzVHLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekQsQ0FBQzs7O09BQUE7SUFFRCxzQkFBWSxnREFBa0I7Ozs7O1FBQTlCO1lBQ0UsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVM7bUJBQzdCLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLGtCQUFrQixFQUFFO2dCQUN0RCxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDO2FBQzFEO1lBQ0QsT0FBTyxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQztRQUM3QyxDQUFDOzs7T0FBQTs7Ozs7O0lBRWMsbUNBQWtCOzs7OztJQUFqQyxVQUFrQyxrQkFBdUI7O1lBQ2pELFNBQVMsR0FBUSxFQUFFO1FBRXpCLEtBQUssSUFBTSxZQUFZLElBQUksa0JBQWtCLEVBQUU7WUFDN0MsSUFBSSxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLEVBQUU7O29CQUM3QyxRQUFRLEdBQVEsa0JBQWtCLENBQUMsWUFBWSxDQUFDO2dCQUV0RCxJQUFJLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRTs7d0JBQ3pCLGFBQWEsR0FBRyxRQUFRLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsWUFBWTtvQkFDOUYsU0FBUyxDQUFDLGFBQWEsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO2lCQUMxRzthQUNGO1NBQ0Y7UUFDRCxPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBRUQ7O09BRUc7Ozs7Ozs7Ozs7SUFDSCxnQ0FBSzs7Ozs7Ozs7O0lBQUwsVUFDRSxTQUF1QixFQUN2QixNQUFZLEVBQ1osT0FBcUIsRUFDckIsU0FBa0I7UUFKcEIsaUJBYUM7O1lBUE8sY0FBYyxHQUFnQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDOztZQUM1RCxHQUFHLEdBQVcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUM7UUFDMUUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsY0FBYyxFQUFDLENBQUM7YUFDakQsSUFBSSxDQUNILEdBQUc7Ozs7UUFBQyxVQUFDLEdBQVEsSUFBSyxPQUFBLEtBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLEVBQXJDLENBQXFDLEVBQUMsRUFDeEQsVUFBVTs7OztRQUFDLFVBQUMsR0FBUSxJQUFLLE9BQUEsS0FBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsRUFBckIsQ0FBcUIsRUFBQyxDQUNoRCxDQUFDO0lBQ04sQ0FBQzs7Ozs7Ozs7O0lBRU0sa0NBQU87Ozs7Ozs7O0lBQWQsVUFDRSxTQUF1QixFQUN2QixNQUFZLEVBQ1osT0FBcUIsRUFDckIsU0FBa0I7UUFKcEIsaUJBY0M7O1lBUk8sR0FBRyxHQUFXLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDOztZQUNwRSxjQUFjLEdBQVcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEVBQUMsT0FBTyxTQUFBLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBQyxDQUFDO1FBRXZGLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLGNBQWMsQ0FBQzthQUN0QyxJQUFJLENBQ0gsR0FBRzs7OztRQUFDLFVBQUMsR0FBeUIsSUFBSyxPQUFBLEtBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxFQUEzQyxDQUEyQyxFQUFDLEVBQy9FLFVBQVU7Ozs7UUFBQyxVQUFDLEdBQVEsSUFBSyxPQUFBLEtBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEVBQXJCLENBQXFCLEVBQUMsQ0FDaEQsQ0FBQztJQUNOLENBQUM7Ozs7Ozs7Ozs7SUFFTSxxQ0FBVTs7Ozs7Ozs7O0lBQWpCLFVBQ0UsU0FBdUIsRUFDdkIsRUFBVSxFQUNWLE1BQVksRUFDWixPQUFxQixFQUNyQixTQUFrQjtRQUxwQixpQkFlQzs7WUFSTyxjQUFjLEdBQVcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEVBQUMsT0FBTyxTQUFBLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBQyxDQUFDOztZQUNqRixHQUFHLEdBQVcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxTQUFTLENBQUM7UUFFbkUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsY0FBYyxDQUFDO2FBQ3RDLElBQUksQ0FDSCxHQUFHOzs7O1FBQUMsVUFBQyxHQUF5QixJQUFLLE9BQUEsS0FBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsRUFBdEMsQ0FBc0MsRUFBQyxFQUMxRSxVQUFVOzs7O1FBQUMsVUFBQyxHQUFRLElBQUssT0FBQSxLQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxFQUFyQixDQUFxQixFQUFDLENBQ2hELENBQUM7SUFDTixDQUFDOzs7Ozs7O0lBRU0sdUNBQVk7Ozs7OztJQUFuQixVQUE0QyxTQUF1QixFQUFFLElBQVU7UUFDN0UsT0FBTyxJQUFJLFNBQVMsQ0FBQyxJQUFJLEVBQUUsRUFBQyxVQUFVLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztJQUNqRCxDQUFDOzs7Ozs7Ozs7O0lBRU0scUNBQVU7Ozs7Ozs7OztJQUFqQixVQUNFLGtCQUF1QixFQUN2QixLQUFRLEVBQ1IsTUFBWSxFQUNaLE9BQXFCLEVBQ3JCLFNBQWtCO1FBTHBCLGlCQTBDQzs7WUFuQ08sU0FBUyxHQUFHLG1CQUFBLEtBQUssQ0FBQyxXQUFXLEVBQWdCOztZQUM3QyxXQUFXLEdBQWdCLEtBQUssQ0FBQyxXQUFXOztZQUM1QyxRQUFRLEdBQVcsV0FBVyxDQUFDLElBQUk7O1lBQ25DLGFBQWEsR0FBUSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDOztZQUNqRCxHQUFHLEdBQVcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUUsU0FBUyxDQUFDOztZQUVyRSxRQUEwQzs7WUFDeEMsSUFBSSxHQUFRO1lBQ2hCLElBQUksRUFBRTtnQkFDSixhQUFhLGVBQUE7Z0JBQ2IsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsRUFBRSxFQUFFLEtBQUssQ0FBQyxFQUFFO2dCQUNaLFVBQVUsRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsa0JBQWtCLEVBQUUsS0FBSyxDQUFDO2FBQy9EO1NBQ0Y7O1lBRUssY0FBYyxHQUFXLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxFQUFDLE9BQU8sU0FBQSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUMsQ0FBQztRQUV2RixJQUFJLEtBQUssQ0FBQyxFQUFFLEVBQUU7WUFDWixRQUFRLEdBQUcsbUJBQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQVMsR0FBRyxFQUFFLElBQUksRUFBRSxjQUFjLENBQUMsRUFBb0MsQ0FBQztTQUNuRzthQUFNO1lBQ0wsUUFBUSxHQUFHLG1CQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFTLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxDQUFDLEVBQW9DLENBQUM7U0FDbEc7UUFFRCxPQUFPLFFBQVE7YUFDWixJQUFJLENBQ0gsR0FBRzs7OztRQUFDLFVBQUMsR0FBRyxJQUFLLE9BQUEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBN0YsQ0FBNkYsRUFBQyxFQUMzRyxVQUFVOzs7O1FBQUMsVUFBQyxHQUFHO1lBQ2IsSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFO2dCQUNmLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ2xCO1lBQ0QsT0FBTyxLQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQy9CLENBQUMsRUFBQyxFQUNGLEdBQUc7Ozs7UUFBQyxVQUFDLEdBQUcsSUFBSyxPQUFBLEtBQUksQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLEVBQUUsYUFBYSxDQUFDLEVBQTVDLENBQTRDLEVBQUMsQ0FDM0QsQ0FBQztJQUNOLENBQUM7Ozs7Ozs7OztJQUVNLHVDQUFZOzs7Ozs7OztJQUFuQixVQUNFLFNBQXVCLEVBQ3ZCLEVBQVUsRUFDVixPQUFxQixFQUNyQixTQUFrQjtRQUpwQixpQkFhQzs7WUFQTyxjQUFjLEdBQVcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEVBQUMsT0FBTyxTQUFBLEVBQUMsQ0FBQzs7WUFDNUQsR0FBRyxHQUFXLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDO1FBRWpFLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLGNBQWMsQ0FBQzthQUN6QyxJQUFJLENBQ0gsVUFBVTs7OztRQUFDLFVBQUMsR0FBc0IsSUFBSyxPQUFBLEtBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEVBQXJCLENBQXFCLEVBQUMsQ0FDOUQsQ0FBQztJQUNOLENBQUM7Ozs7Ozs7SUFFTSxxQ0FBVTs7Ozs7O0lBQWpCLFVBQTBDLFNBQXVCLEVBQUUsRUFBVTs7WUFDckUsSUFBSSxHQUFXLE9BQU8sQ0FBQyxXQUFXLENBQUMsb0JBQW9CLEVBQUUsU0FBUyxDQUFDLENBQUMsSUFBSTtRQUM5RSxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLG1CQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQzdFLENBQUM7Ozs7OztJQUVNLGtDQUFPOzs7OztJQUFkLFVBQXVDLFNBQXVCOztZQUN0RCxJQUFJLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxvQkFBb0IsRUFBRSxTQUFTLENBQUMsQ0FBQyxJQUFJOztZQUNoRSxTQUFTLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUM7UUFDMUMsT0FBTyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRzs7OztRQUFDLFVBQUMsR0FBRyxXQUFLLG1CQUFBLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBSyxHQUFBLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ25GLENBQUM7Ozs7Ozs7SUFFTSwyQ0FBZ0I7Ozs7OztJQUF2QixVQUFnRCxTQUF1QixFQUFFLElBQVM7UUFDaEYsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsdUNBQXVDLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMzRixPQUFPLElBQUksU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNuQyxDQUFDOzs7OztJQUVNLHFDQUFVOzs7O0lBQWpCLFVBQWtCLGFBQTRDOzs7WUFDdEQsTUFBTSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUM7O1lBQ3ZFLElBQUksR0FBVyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUk7O1lBQzNDLFNBQVMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQztRQUV4QyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2QsU0FBUyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1NBQzNDOztZQUVELEtBQW9CLElBQUEsV0FBQSxpQkFBQSxNQUFNLENBQUEsOEJBQUEsa0RBQUU7Z0JBQXZCLElBQU0sS0FBSyxtQkFBQTtnQkFDZCxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQzthQUM3Qjs7Ozs7Ozs7O0lBQ0gsQ0FBQzs7Ozs7OztJQUVNLGtFQUF1Qzs7Ozs7O0lBQTlDLFVBQXVFLFNBQXVCLEVBQUUsVUFBZTs7WUFDdkcsNEJBQTRCLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUM7O1lBQzlFLFVBQVUsR0FBUSxFQUFFO1FBRTFCLE1BQU0sQ0FBQyxJQUFJLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxPQUFPOzs7O1FBQUMsVUFBQyxjQUFjO1lBQy9ELElBQUksVUFBVSxJQUFJLFVBQVUsQ0FBQyxjQUFjLENBQUMsS0FBSyxJQUFJLElBQUksVUFBVSxDQUFDLGNBQWMsQ0FBQyxLQUFLLFNBQVMsRUFBRTtnQkFDakcsVUFBVSxDQUFDLDRCQUE0QixDQUFDLGNBQWMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2FBQ3ZGO1FBQ0gsQ0FBQyxFQUFDLENBQUM7UUFFSCxPQUFPLFVBQVUsQ0FBQztJQUNwQixDQUFDOzs7Ozs7Ozs7O0lBRVMsbUNBQVE7Ozs7Ozs7OztJQUFsQixVQUNFLFNBQXVCLEVBQ3ZCLE1BQVksRUFDWixFQUFXLEVBQ1gsU0FBa0I7OztZQUdaLFdBQVcsR0FBVyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQztRQUV0RCxJQUFJLFNBQVMsRUFBRTtZQUNiLE9BQU8sV0FBVyxDQUFDLENBQUMsQ0FBSSxTQUFTLFNBQUksV0FBYSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7U0FDaEU7O1lBRUssV0FBVyxHQUFnQixPQUFPLENBQUMsV0FBVyxDQUFDLG9CQUFvQixFQUFFLFNBQVMsQ0FBQzs7WUFFL0UsT0FBTyxHQUFHLFdBQVcsQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPOztZQUM3RCxVQUFVLEdBQUcsV0FBVyxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVU7O1lBQ3RFLGdCQUFnQixHQUFXLFdBQVcsQ0FBQyxnQkFBZ0IsSUFBSSxXQUFXLENBQUMsSUFBSTs7WUFFM0UsR0FBRyxHQUFXLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxnQkFBZ0IsRUFBRSxFQUFFLENBQUMsQ0FBQyxNQUFNOzs7O1FBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxDQUFDLEVBQUQsQ0FBQyxFQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUUxRixPQUFPLFdBQVcsQ0FBQyxDQUFDLENBQUksR0FBRyxTQUFJLFdBQWEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQ3JELENBQUM7Ozs7OztJQUVTLDJDQUFnQjs7Ozs7SUFBMUIsVUFBMkIsSUFBUztRQUFwQyxpQkFxQ0M7O1lBcENLLGFBQWtCOztZQUVoQixpQkFBaUIsR0FBVSxPQUFPLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFOztZQUN2RSxlQUFlLEdBQVUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRTtnQ0FFOUQsR0FBRztZQUNaLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDNUIsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksWUFBWSxFQUFFO29CQUNyQyxhQUFhLEdBQUcsYUFBYSxJQUFJLEVBQUUsQ0FBQztvQkFFcEMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFOzs0QkFDVixNQUFNLEdBQUcsaUJBQWlCLENBQUMsSUFBSTs7Ozt3QkFBQyxVQUFDLEVBQU8sSUFBSyxPQUFBLEVBQUUsQ0FBQyxZQUFZLEtBQUssR0FBRyxFQUF2QixDQUF1QixFQUFDOzs0QkFDckUsZUFBZSxHQUFHLE1BQU0sQ0FBQyxZQUFZO3dCQUMzQyxhQUFhLENBQUMsZUFBZSxDQUFDLEdBQUc7NEJBQy9CLElBQUksRUFBRSxPQUFLLDJCQUEyQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzt5QkFDbEQsQ0FBQztxQkFDSDtpQkFDRjtxQkFBTSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxLQUFLLEVBQUU7O3dCQUMvQixNQUFNLEdBQUcsZUFBZSxDQUFDLElBQUk7Ozs7b0JBQUMsVUFBQyxFQUFPLElBQUssT0FBQSxFQUFFLENBQUMsWUFBWSxLQUFLLEdBQUcsRUFBdkIsQ0FBdUIsRUFBQztvQkFDekUsSUFBSSxNQUFNLElBQUksT0FBSyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTt3QkFDbkQsYUFBYSxHQUFHLGFBQWEsSUFBSSxFQUFFLENBQUM7OzRCQUU5QixlQUFlLEdBQUcsTUFBTSxDQUFDLFlBQVk7OzRCQUNyQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDOzZCQUMvQixNQUFNOzs7O3dCQUFDLFVBQUMsS0FBbUIsSUFBSyxPQUFBLEtBQUssQ0FBQyxFQUFFLEVBQVIsQ0FBUSxFQUFDOzZCQUN6QyxHQUFHOzs7O3dCQUFDLFVBQUMsS0FBbUIsSUFBSyxPQUFBLEtBQUksQ0FBQywyQkFBMkIsQ0FBQyxLQUFLLENBQUMsRUFBdkMsQ0FBdUMsRUFBQzt3QkFFeEUsYUFBYSxDQUFDLGVBQWUsQ0FBQyxHQUFHOzRCQUMvQixJQUFJLEVBQUUsZ0JBQWdCO3lCQUN2QixDQUFDO3FCQUNIO2lCQUNGO2FBQ0Y7OztRQTNCSCxLQUFLLElBQU0sR0FBRyxJQUFJLElBQUk7b0JBQVgsR0FBRztTQTRCYjtRQUVELE9BQU8sYUFBYSxDQUFDO0lBQ3ZCLENBQUM7Ozs7OztJQUVTLGdEQUFxQjs7Ozs7SUFBL0IsVUFBZ0MsT0FBbUI7UUFDakQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7WUFDbkIsT0FBTyxJQUFJLENBQUM7U0FDYjs7WUFDSyxjQUFjLEdBQUcsT0FBTyxDQUFDLEtBQUs7Ozs7UUFBQyxVQUFDLElBQUksSUFBSyxPQUFBLElBQUksWUFBWSxZQUFZLEVBQTVCLENBQTRCLEVBQUM7UUFDNUUsSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUNuQixPQUFPLEtBQUssQ0FBQztTQUNkOztZQUNLLEtBQUssR0FBRyxPQUFPLENBQUMsR0FBRzs7OztRQUFDLFVBQUMsSUFBa0IsSUFBSyxPQUFBLElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQTFELENBQTBELEVBQUM7UUFDN0csT0FBTyxLQUFLO2FBQ1QsTUFBTTs7Ozs7O1FBQUMsVUFBQyxJQUFZLEVBQUUsS0FBYSxFQUFFLElBQWMsSUFBSyxPQUFBLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxFQUE1QixDQUE0QixFQUFDO2FBQ3JGLE1BQU0sS0FBSyxDQUFDLENBQUM7SUFDbEIsQ0FBQzs7Ozs7O0lBRVMsc0RBQTJCOzs7OztJQUFyQyxVQUFzQyxLQUFtQjs7WUFDakQsZ0JBQWdCLEdBQVcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJOztZQUNqRCxnQkFBZ0IsR0FBb0QsRUFBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUM7UUFFbEcsSUFBSSxLQUFLLENBQUMsRUFBRSxFQUFFO1lBQ1osZ0JBQWdCLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUM7U0FDaEM7YUFBTTs7Z0JBQ0Msa0JBQWtCLEdBQVEsT0FBTyxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDO1lBQ3ZFLGdCQUFnQixDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsa0JBQWtCLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDbEY7UUFFRCxPQUFPLGdCQUFnQixDQUFDO0lBQzFCLENBQUM7Ozs7Ozs7OztJQUVTLDJDQUFnQjs7Ozs7Ozs7SUFBMUIsVUFDRSxRQUE4QixFQUM5QixTQUF1QixFQUN2QixRQUFnQjtRQUhsQixpQkEyQkM7UUF4QkMseUJBQUEsRUFBQSxnQkFBZ0I7O1lBRVYsSUFBSSxHQUFRLFFBQVEsQ0FBQyxJQUFJOztZQUN6QixNQUFNLEdBQVEsRUFBRTtRQUV0QixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU87Ozs7UUFBQyxVQUFDLElBQVM7O2dCQUN0QixJQUFJLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNqRCxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQzs7Z0JBQ3pCLEtBQUssR0FBTSxLQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztZQUNsRCxLQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRXZCLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDakIsS0FBSyxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUMxRCxLQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3hCO1lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNyQixDQUFDLEVBQUMsQ0FBQztRQUVILElBQUksUUFBUSxJQUFJLFFBQVEsS0FBSyxJQUFJLEVBQUU7WUFDakMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO1NBQ3RFO1FBRUQsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQzs7Ozs7Ozs7O0lBRVMsNENBQWlCOzs7Ozs7OztJQUEzQixVQUNFLEdBQXlCLEVBQ3pCLFNBQXVCLEVBQ3ZCLEtBQVM7O1lBRUgsSUFBSSxHQUFRLEdBQUcsQ0FBQyxJQUFJO1FBQzFCLGlGQUFpRjtRQUNqRixxRkFBcUY7UUFDckYsNENBQTRDO1FBQzVDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxLQUFLLE1BQU0sRUFBRTtZQUM1QixNQUFNLElBQUksS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7U0FDeEM7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNkLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ2hDLE1BQU0sSUFBSSxLQUFLLENBQUMsMkJBQTJCLENBQUMsQ0FBQzthQUM5QztZQUNELE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFFRCxJQUFJLEtBQUssRUFBRTtZQUNULEtBQUssQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7WUFDakMsS0FBSyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUN4QixNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzNDLEtBQUssQ0FBQyxtQkFBbUIsR0FBRyxLQUFLLENBQUM7U0FDbkM7O1lBRUssaUJBQWlCLEdBQUcsS0FBSyxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQztRQUM5RSxJQUFJLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDbkMsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2pCLGlCQUFpQixDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzlELElBQUksQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQztTQUNwQztRQUVELE9BQU8saUJBQWlCLENBQUM7SUFDM0IsQ0FBQzs7Ozs7O0lBRVMsc0NBQVc7Ozs7O0lBQXJCLFVBQXNCLEtBQVU7UUFDOUIsSUFDRSxLQUFLLFlBQVksaUJBQWlCO1lBQ2xDLEtBQUssQ0FBQyxLQUFLLFlBQVksTUFBTTtZQUM3QixLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU07WUFDbEIsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLFlBQVksS0FBSyxFQUNuQzs7Z0JBQ00sTUFBTSxHQUFrQixJQUFJLGFBQWEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztZQUNuRSxPQUFPLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUMzQjtRQUVELE9BQU8sVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzNCLENBQUM7Ozs7Ozs7SUFFUyxvQ0FBUzs7Ozs7O0lBQW5CLFVBQW9CLElBQVMsRUFBRSxTQUFrQzs7WUFDekQsU0FBUyxHQUFRLE9BQU8sQ0FBQyxXQUFXLENBQUMsb0JBQW9CLEVBQUUsU0FBUyxDQUFDLENBQUMsSUFBSTtRQUNoRixPQUFPLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRDs7T0FFRzs7Ozs7OztJQUNPLHFDQUFVOzs7Ozs7SUFBcEIsVUFBcUIsYUFBMkI7UUFDOUMsT0FBTztZQUNMLE9BQU8sRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDO1NBQzlDLENBQUM7SUFDSixDQUFDOzs7Ozs7SUFFUywyQ0FBZ0I7Ozs7O0lBQTFCLFVBQTJCLGFBQTJCO1FBQXRELGlCQXVCQzs7WUF0QkssY0FBYyxHQUFnQixJQUFJLFdBQVcsQ0FBQztZQUNoRCxNQUFNLEVBQUUsMEJBQTBCO1lBQ2xDLGNBQWMsRUFBRSwwQkFBMEI7U0FDM0MsQ0FBQztRQUVGLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUN0QixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU87Ozs7WUFBQyxVQUFDLEdBQUc7Z0JBQ3BDLElBQUksS0FBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBQy9CLGNBQWMsR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2lCQUN2RTtZQUNILENBQUMsRUFBQyxDQUFDO1NBQ0o7UUFFRCxJQUFJLGFBQWEsRUFBRTtZQUNqQixhQUFhLENBQUMsSUFBSSxFQUFFLENBQUMsT0FBTzs7OztZQUFDLFVBQUMsR0FBRztnQkFDL0IsSUFBSSxhQUFhLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO29CQUMxQixjQUFjLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsYUFBYSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2lCQUNsRTtZQUNILENBQUMsRUFBQyxDQUFDO1NBQ0o7UUFFRCxPQUFPLGNBQWMsQ0FBQztJQUN4QixDQUFDOzs7Ozs7Ozs7SUFFUyxrREFBdUI7Ozs7Ozs7O0lBQWpDLFVBQTBELEdBQU0sRUFBRSxrQkFBdUIsRUFBRSxTQUF1QjtRQUNoSCxLQUFLLElBQU0sWUFBWSxJQUFJLGtCQUFrQixFQUFFO1lBQzdDLElBQUksa0JBQWtCLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxFQUFFOztvQkFDN0MsUUFBUSxHQUFRLGtCQUFrQixDQUFDLFlBQVksQ0FBQztnQkFFdEQsSUFBSSxRQUFRLENBQUMsa0JBQWtCLEVBQUU7b0JBQy9CLFFBQVEsQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUM7aUJBQ3JDO2FBQ0Y7U0FDRjtRQUVELGFBQWE7UUFDYixHQUFHLENBQUMsc0JBQXNCLENBQUMsR0FBRyxrQkFBa0IsQ0FBQztRQUNqRCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7Ozs7Ozs7O0lBRVMsOENBQW1COzs7Ozs7O0lBQTdCLFVBQXNELEtBQVEsRUFBRSxhQUFrQjs7WUFDMUUsV0FBVyxHQUFRLE9BQU8sQ0FBQyxXQUFXLENBQUMsd0JBQXdCLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE1BQU07UUFFL0YsS0FBSyxJQUFNLFlBQVksSUFBSSxhQUFhLEVBQUU7WUFDeEMsSUFBSSxhQUFhLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxJQUFJLEtBQUssQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLEVBQUU7O29CQUM5RSxpQkFBaUIsR0FBaUIsS0FBSyxDQUFDLFlBQVksQ0FBQzs7b0JBQ3JELE9BQU8sR0FBVSxPQUFPLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxpQkFBaUIsQ0FBQzs7b0JBQ2xFLGVBQWUsR0FBUSxJQUFJLENBQUMsT0FBTzs7OztnQkFBRSxVQUFDLFFBQVE7b0JBQ2xELE9BQU8sV0FBVyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsS0FBSyxLQUFLLENBQUMsV0FBVyxDQUFDO2dCQUNsRSxDQUFDLEVBQUM7Z0JBRUYsSUFBSSxlQUFlLEVBQUU7b0JBQ25CLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDOzt3QkFFbEcsWUFBWSxHQUFHLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO29CQUVuRixJQUFJLFlBQVksS0FBSyxDQUFDLENBQUMsRUFBRTt3QkFDdkIsaUJBQWlCLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztxQkFDN0Q7eUJBQU07d0JBQ0wsaUJBQWlCLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxDQUFDLFlBQVksQ0FBQyxHQUFHLEtBQUssQ0FBQztxQkFDdkU7aUJBQ0Y7YUFDRjtTQUNGO1FBRUQsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDOzs7Ozs7SUFFUyxnREFBcUI7Ozs7O0lBQS9CLFVBQWdDLEtBQW1CO1FBQ2pELE9BQU8sT0FBTyxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDOUQsQ0FBQzs7Ozs7O0lBRU8sOENBQW1COzs7OztJQUEzQixVQUE0QixhQUF1QjtRQUF2Qiw4QkFBQSxFQUFBLGtCQUF1Qjs7WUFDM0MsV0FBVyxHQUFnQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQzs7WUFFdkUsY0FBYyxHQUFXLE1BQU0sQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFO1lBQzFELE9BQU8sRUFBRSxXQUFXO1NBQ3JCLENBQUM7UUFFRixPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7Ozs7OztJQUVPLHlDQUFjOzs7OztJQUF0QixVQUF1QixNQUFXO1FBQ2hDLE9BQU8sRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsRUFBQyxXQUFXLEVBQUUsVUFBVSxFQUFDLENBQUMsQ0FBQztJQUN6RCxDQUFDOztnQkE5ZEYsVUFBVTs7OztnQkF4QkYsVUFBVTs7SUF1Zm5CLHVCQUFDO0NBQUEsQUEvZEQsSUErZEM7U0E5ZFksZ0JBQWdCOzs7Ozs7SUFFM0Isa0NBQWtDOzs7OztJQUNsQyx5Q0FBbUM7Ozs7O0lBQ25DLGdEQUEwQzs7Ozs7SUFDMUMseUNBQStFOzs7OztJQUMvRSx5Q0FFcUU7Ozs7O0lBRXpELGdDQUEwQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBFcnJvclJlc3BvbnNlLCBIdHRwSGVhZGVycywgSHR0cFJlc3BvbnNlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IGZpbmQgZnJvbSAnbG9kYXNoLWVzL2ZpbmQnO1xuaW1wb3J0IHsgY2F0Y2hFcnJvciwgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgb2YsIHRocm93RXJyb3IgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IEpzb25BcGlNb2RlbCB9IGZyb20gJy4uL21vZGVscy9qc29uLWFwaS5tb2RlbCc7XG5pbXBvcnQgeyBFcnJvclJlc3BvbnNlIH0gZnJvbSAnLi4vbW9kZWxzL2Vycm9yLXJlc3BvbnNlLm1vZGVsJztcbmltcG9ydCB7IEpzb25BcGlRdWVyeURhdGEgfSBmcm9tICcuLi9tb2RlbHMvanNvbi1hcGktcXVlcnktZGF0YSc7XG5pbXBvcnQgKiBhcyBxcyBmcm9tICdxcyc7XG5pbXBvcnQgeyBEYXRhc3RvcmVDb25maWcgfSBmcm9tICcuLi9pbnRlcmZhY2VzL2RhdGFzdG9yZS1jb25maWcuaW50ZXJmYWNlJztcbmltcG9ydCB7IE1vZGVsQ29uZmlnIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9tb2RlbC1jb25maWcuaW50ZXJmYWNlJztcbmltcG9ydCB7IEF0dHJpYnV0ZU1ldGFkYXRhIH0gZnJvbSAnLi4vY29uc3RhbnRzL3N5bWJvbHMnO1xuaW1wb3J0ICdyZWZsZWN0LW1ldGFkYXRhJztcblxuZXhwb3J0IHR5cGUgTW9kZWxUeXBlPFQgZXh0ZW5kcyBKc29uQXBpTW9kZWw+ID0gbmV3KGRhdGFzdG9yZTogSnNvbkFwaURhdGFzdG9yZSwgZGF0YTogYW55KSA9PiBUO1xuXG4vKipcbiAqIEhBQ0svRklYTUU6XG4gKiBUeXBlICdzeW1ib2wnIGNhbm5vdCBiZSB1c2VkIGFzIGFuIGluZGV4IHR5cGUuXG4gKiBUeXBlU2NyaXB0IDIuOS54XG4gKiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8yNDU4Ny5cbiAqL1xuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWVcbmNvbnN0IEF0dHJpYnV0ZU1ldGFkYXRhSW5kZXg6IHN0cmluZyA9IEF0dHJpYnV0ZU1ldGFkYXRhIGFzIGFueTtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEpzb25BcGlEYXRhc3RvcmUge1xuXG4gIHByb3RlY3RlZCBjb25maWc6IERhdGFzdG9yZUNvbmZpZztcbiAgcHJpdmF0ZSBnbG9iYWxIZWFkZXJzOiBIdHRwSGVhZGVycztcbiAgcHJpdmF0ZSBnbG9iYWxSZXF1ZXN0T3B0aW9uczogb2JqZWN0ID0ge307XG4gIHByaXZhdGUgaW50ZXJuYWxTdG9yZTogeyBbdHlwZTogc3RyaW5nXTogeyBbaWQ6IHN0cmluZ106IEpzb25BcGlNb2RlbCB9IH0gPSB7fTtcbiAgcHJpdmF0ZSB0b1F1ZXJ5U3RyaW5nOiAocGFyYW1zOiBhbnkpID0+IHN0cmluZyA9IHRoaXMuZGF0YXN0b3JlQ29uZmlnLm92ZXJyaWRlc1xuICAmJiB0aGlzLmRhdGFzdG9yZUNvbmZpZy5vdmVycmlkZXMudG9RdWVyeVN0cmluZyA/XG4gICAgdGhpcy5kYXRhc3RvcmVDb25maWcub3ZlcnJpZGVzLnRvUXVlcnlTdHJpbmcgOiB0aGlzLl90b1F1ZXJ5U3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBodHRwOiBIdHRwQ2xpZW50KSB7XG4gIH1cblxuICBzZXQgaGVhZGVycyhoZWFkZXJzOiBIdHRwSGVhZGVycykge1xuICAgIHRoaXMuZ2xvYmFsSGVhZGVycyA9IGhlYWRlcnM7XG4gIH1cblxuICBzZXQgcmVxdWVzdE9wdGlvbnMocmVxdWVzdE9wdGlvbnM6IG9iamVjdCkge1xuICAgIHRoaXMuZ2xvYmFsUmVxdWVzdE9wdGlvbnMgPSByZXF1ZXN0T3B0aW9ucztcbiAgfVxuXG4gIHB1YmxpYyBnZXQgZGF0YXN0b3JlQ29uZmlnKCk6IERhdGFzdG9yZUNvbmZpZyB7XG4gICAgY29uc3QgY29uZmlnRnJvbURlY29yYXRvcjogRGF0YXN0b3JlQ29uZmlnID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnSnNvbkFwaURhdGFzdG9yZUNvbmZpZycsIHRoaXMuY29uc3RydWN0b3IpO1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKGNvbmZpZ0Zyb21EZWNvcmF0b3IsIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0IGdldERpcnR5QXR0cmlidXRlcygpIHtcbiAgICBpZiAodGhpcy5kYXRhc3RvcmVDb25maWcub3ZlcnJpZGVzXG4gICAgICAmJiB0aGlzLmRhdGFzdG9yZUNvbmZpZy5vdmVycmlkZXMuZ2V0RGlydHlBdHRyaWJ1dGVzKSB7XG4gICAgICByZXR1cm4gdGhpcy5kYXRhc3RvcmVDb25maWcub3ZlcnJpZGVzLmdldERpcnR5QXR0cmlidXRlcztcbiAgICB9XG4gICAgcmV0dXJuIEpzb25BcGlEYXRhc3RvcmUuZ2V0RGlydHlBdHRyaWJ1dGVzO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgZ2V0RGlydHlBdHRyaWJ1dGVzKGF0dHJpYnV0ZXNNZXRhZGF0YTogYW55KTogeyBzdHJpbmc6IGFueSB9IHtcbiAgICBjb25zdCBkaXJ0eURhdGE6IGFueSA9IHt9O1xuXG4gICAgZm9yIChjb25zdCBwcm9wZXJ0eU5hbWUgaW4gYXR0cmlidXRlc01ldGFkYXRhKSB7XG4gICAgICBpZiAoYXR0cmlidXRlc01ldGFkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgY29uc3QgbWV0YWRhdGE6IGFueSA9IGF0dHJpYnV0ZXNNZXRhZGF0YVtwcm9wZXJ0eU5hbWVdO1xuXG4gICAgICAgIGlmIChtZXRhZGF0YS5oYXNEaXJ0eUF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICBjb25zdCBhdHRyaWJ1dGVOYW1lID0gbWV0YWRhdGEuc2VyaWFsaXplZE5hbWUgIT0gbnVsbCA/IG1ldGFkYXRhLnNlcmlhbGl6ZWROYW1lIDogcHJvcGVydHlOYW1lO1xuICAgICAgICAgIGRpcnR5RGF0YVthdHRyaWJ1dGVOYW1lXSA9IG1ldGFkYXRhLnNlcmlhbGlzYXRpb25WYWx1ZSA/IG1ldGFkYXRhLnNlcmlhbGlzYXRpb25WYWx1ZSA6IG1ldGFkYXRhLm5ld1ZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkaXJ0eURhdGE7XG4gIH1cblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWQgdXNlIGZpbmRBbGwgbWV0aG9kIHRvIHRha2UgYWxsIG1vZGVsc1xuICAgKi9cbiAgcXVlcnk8VCBleHRlbmRzIEpzb25BcGlNb2RlbD4oXG4gICAgbW9kZWxUeXBlOiBNb2RlbFR5cGU8VD4sXG4gICAgcGFyYW1zPzogYW55LFxuICAgIGhlYWRlcnM/OiBIdHRwSGVhZGVycyxcbiAgICBjdXN0b21Vcmw/OiBzdHJpbmdcbiAgKTogT2JzZXJ2YWJsZTxUW10+IHtcbiAgICBjb25zdCByZXF1ZXN0SGVhZGVyczogSHR0cEhlYWRlcnMgPSB0aGlzLmJ1aWxkSHR0cEhlYWRlcnMoaGVhZGVycyk7XG4gICAgY29uc3QgdXJsOiBzdHJpbmcgPSB0aGlzLmJ1aWxkVXJsKG1vZGVsVHlwZSwgcGFyYW1zLCB1bmRlZmluZWQsIGN1c3RvbVVybCk7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQodXJsLCB7aGVhZGVyczogcmVxdWVzdEhlYWRlcnN9KVxuICAgICAgLnBpcGUoXG4gICAgICAgIG1hcCgocmVzOiBhbnkpID0+IHRoaXMuZXh0cmFjdFF1ZXJ5RGF0YShyZXMsIG1vZGVsVHlwZSkpLFxuICAgICAgICBjYXRjaEVycm9yKChyZXM6IGFueSkgPT4gdGhpcy5oYW5kbGVFcnJvcihyZXMpKVxuICAgICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBmaW5kQWxsPFQgZXh0ZW5kcyBKc29uQXBpTW9kZWw+KFxuICAgIG1vZGVsVHlwZTogTW9kZWxUeXBlPFQ+LFxuICAgIHBhcmFtcz86IGFueSxcbiAgICBoZWFkZXJzPzogSHR0cEhlYWRlcnMsXG4gICAgY3VzdG9tVXJsPzogc3RyaW5nXG4gICk6IE9ic2VydmFibGU8SnNvbkFwaVF1ZXJ5RGF0YTxUPj4ge1xuICAgIGNvbnN0IHVybDogc3RyaW5nID0gdGhpcy5idWlsZFVybChtb2RlbFR5cGUsIHBhcmFtcywgdW5kZWZpbmVkLCBjdXN0b21VcmwpO1xuICAgIGNvbnN0IHJlcXVlc3RPcHRpb25zOiBvYmplY3QgPSB0aGlzLmJ1aWxkUmVxdWVzdE9wdGlvbnMoe2hlYWRlcnMsIG9ic2VydmU6ICdyZXNwb25zZSd9KTtcblxuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KHVybCwgcmVxdWVzdE9wdGlvbnMpXG4gICAgICAucGlwZShcbiAgICAgICAgbWFwKChyZXM6IEh0dHBSZXNwb25zZTxvYmplY3Q+KSA9PiB0aGlzLmV4dHJhY3RRdWVyeURhdGEocmVzLCBtb2RlbFR5cGUsIHRydWUpKSxcbiAgICAgICAgY2F0Y2hFcnJvcigocmVzOiBhbnkpID0+IHRoaXMuaGFuZGxlRXJyb3IocmVzKSlcbiAgICAgICk7XG4gIH1cblxuICBwdWJsaWMgZmluZFJlY29yZDxUIGV4dGVuZHMgSnNvbkFwaU1vZGVsPihcbiAgICBtb2RlbFR5cGU6IE1vZGVsVHlwZTxUPixcbiAgICBpZDogc3RyaW5nLFxuICAgIHBhcmFtcz86IGFueSxcbiAgICBoZWFkZXJzPzogSHR0cEhlYWRlcnMsXG4gICAgY3VzdG9tVXJsPzogc3RyaW5nXG4gICk6IE9ic2VydmFibGU8VD4ge1xuICAgIGNvbnN0IHJlcXVlc3RPcHRpb25zOiBvYmplY3QgPSB0aGlzLmJ1aWxkUmVxdWVzdE9wdGlvbnMoe2hlYWRlcnMsIG9ic2VydmU6ICdyZXNwb25zZSd9KTtcbiAgICBjb25zdCB1cmw6IHN0cmluZyA9IHRoaXMuYnVpbGRVcmwobW9kZWxUeXBlLCBwYXJhbXMsIGlkLCBjdXN0b21VcmwpO1xuXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQodXJsLCByZXF1ZXN0T3B0aW9ucylcbiAgICAgIC5waXBlKFxuICAgICAgICBtYXAoKHJlczogSHR0cFJlc3BvbnNlPG9iamVjdD4pID0+IHRoaXMuZXh0cmFjdFJlY29yZERhdGEocmVzLCBtb2RlbFR5cGUpKSxcbiAgICAgICAgY2F0Y2hFcnJvcigocmVzOiBhbnkpID0+IHRoaXMuaGFuZGxlRXJyb3IocmVzKSlcbiAgICAgICk7XG4gIH1cblxuICBwdWJsaWMgY3JlYXRlUmVjb3JkPFQgZXh0ZW5kcyBKc29uQXBpTW9kZWw+KG1vZGVsVHlwZTogTW9kZWxUeXBlPFQ+LCBkYXRhPzogYW55KTogVCB7XG4gICAgcmV0dXJuIG5ldyBtb2RlbFR5cGUodGhpcywge2F0dHJpYnV0ZXM6IGRhdGF9KTtcbiAgfVxuXG4gIHB1YmxpYyBzYXZlUmVjb3JkPFQgZXh0ZW5kcyBKc29uQXBpTW9kZWw+KFxuICAgIGF0dHJpYnV0ZXNNZXRhZGF0YTogYW55LFxuICAgIG1vZGVsOiBULFxuICAgIHBhcmFtcz86IGFueSxcbiAgICBoZWFkZXJzPzogSHR0cEhlYWRlcnMsXG4gICAgY3VzdG9tVXJsPzogc3RyaW5nXG4gICk6IE9ic2VydmFibGU8VD4ge1xuICAgIGNvbnN0IG1vZGVsVHlwZSA9IG1vZGVsLmNvbnN0cnVjdG9yIGFzIE1vZGVsVHlwZTxUPjtcbiAgICBjb25zdCBtb2RlbENvbmZpZzogTW9kZWxDb25maWcgPSBtb2RlbC5tb2RlbENvbmZpZztcbiAgICBjb25zdCB0eXBlTmFtZTogc3RyaW5nID0gbW9kZWxDb25maWcudHlwZTtcbiAgICBjb25zdCByZWxhdGlvbnNoaXBzOiBhbnkgPSB0aGlzLmdldFJlbGF0aW9uc2hpcHMobW9kZWwpO1xuICAgIGNvbnN0IHVybDogc3RyaW5nID0gdGhpcy5idWlsZFVybChtb2RlbFR5cGUsIHBhcmFtcywgbW9kZWwuaWQsIGN1c3RvbVVybCk7XG5cbiAgICBsZXQgaHR0cENhbGw6IE9ic2VydmFibGU8SHR0cFJlc3BvbnNlPG9iamVjdD4+O1xuICAgIGNvbnN0IGJvZHk6IGFueSA9IHtcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgcmVsYXRpb25zaGlwcyxcbiAgICAgICAgdHlwZTogdHlwZU5hbWUsXG4gICAgICAgIGlkOiBtb2RlbC5pZCxcbiAgICAgICAgYXR0cmlidXRlczogdGhpcy5nZXREaXJ0eUF0dHJpYnV0ZXMoYXR0cmlidXRlc01ldGFkYXRhLCBtb2RlbClcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgcmVxdWVzdE9wdGlvbnM6IG9iamVjdCA9IHRoaXMuYnVpbGRSZXF1ZXN0T3B0aW9ucyh7aGVhZGVycywgb2JzZXJ2ZTogJ3Jlc3BvbnNlJ30pO1xuXG4gICAgaWYgKG1vZGVsLmlkKSB7XG4gICAgICBodHRwQ2FsbCA9IHRoaXMuaHR0cC5wYXRjaDxvYmplY3Q+KHVybCwgYm9keSwgcmVxdWVzdE9wdGlvbnMpIGFzIE9ic2VydmFibGU8SHR0cFJlc3BvbnNlPG9iamVjdD4+O1xuICAgIH0gZWxzZSB7XG4gICAgICBodHRwQ2FsbCA9IHRoaXMuaHR0cC5wb3N0PG9iamVjdD4odXJsLCBib2R5LCByZXF1ZXN0T3B0aW9ucykgYXMgT2JzZXJ2YWJsZTxIdHRwUmVzcG9uc2U8b2JqZWN0Pj47XG4gICAgfVxuXG4gICAgcmV0dXJuIGh0dHBDYWxsXG4gICAgICAucGlwZShcbiAgICAgICAgbWFwKChyZXMpID0+IFsyMDAsIDIwMV0uaW5kZXhPZihyZXMuc3RhdHVzKSAhPT0gLTEgPyB0aGlzLmV4dHJhY3RSZWNvcmREYXRhKHJlcywgbW9kZWxUeXBlLCBtb2RlbCkgOiBtb2RlbCksXG4gICAgICAgIGNhdGNoRXJyb3IoKHJlcykgPT4ge1xuICAgICAgICAgIGlmIChyZXMgPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIG9mKG1vZGVsKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlRXJyb3IocmVzKTtcbiAgICAgICAgfSksXG4gICAgICAgIG1hcCgocmVzKSA9PiB0aGlzLnVwZGF0ZVJlbGF0aW9uc2hpcHMocmVzLCByZWxhdGlvbnNoaXBzKSlcbiAgICAgICk7XG4gIH1cblxuICBwdWJsaWMgZGVsZXRlUmVjb3JkPFQgZXh0ZW5kcyBKc29uQXBpTW9kZWw+KFxuICAgIG1vZGVsVHlwZTogTW9kZWxUeXBlPFQ+LFxuICAgIGlkOiBzdHJpbmcsXG4gICAgaGVhZGVycz86IEh0dHBIZWFkZXJzLFxuICAgIGN1c3RvbVVybD86IHN0cmluZ1xuICApOiBPYnNlcnZhYmxlPFJlc3BvbnNlPiB7XG4gICAgY29uc3QgcmVxdWVzdE9wdGlvbnM6IG9iamVjdCA9IHRoaXMuYnVpbGRSZXF1ZXN0T3B0aW9ucyh7aGVhZGVyc30pO1xuICAgIGNvbnN0IHVybDogc3RyaW5nID0gdGhpcy5idWlsZFVybChtb2RlbFR5cGUsIG51bGwsIGlkLCBjdXN0b21VcmwpO1xuXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUodXJsLCByZXF1ZXN0T3B0aW9ucylcbiAgICAgIC5waXBlKFxuICAgICAgICBjYXRjaEVycm9yKChyZXM6IEh0dHBFcnJvclJlc3BvbnNlKSA9PiB0aGlzLmhhbmRsZUVycm9yKHJlcykpXG4gICAgICApO1xuICB9XG5cbiAgcHVibGljIHBlZWtSZWNvcmQ8VCBleHRlbmRzIEpzb25BcGlNb2RlbD4obW9kZWxUeXBlOiBNb2RlbFR5cGU8VD4sIGlkOiBzdHJpbmcpOiBUIHwgbnVsbCB7XG4gICAgY29uc3QgdHlwZTogc3RyaW5nID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnSnNvbkFwaU1vZGVsQ29uZmlnJywgbW9kZWxUeXBlKS50eXBlO1xuICAgIHJldHVybiB0aGlzLmludGVybmFsU3RvcmVbdHlwZV0gPyB0aGlzLmludGVybmFsU3RvcmVbdHlwZV1baWRdIGFzIFQgOiBudWxsO1xuICB9XG5cbiAgcHVibGljIHBlZWtBbGw8VCBleHRlbmRzIEpzb25BcGlNb2RlbD4obW9kZWxUeXBlOiBNb2RlbFR5cGU8VD4pOiBBcnJheTxUPiB7XG4gICAgY29uc3QgdHlwZSA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ0pzb25BcGlNb2RlbENvbmZpZycsIG1vZGVsVHlwZSkudHlwZTtcbiAgICBjb25zdCB0eXBlU3RvcmUgPSB0aGlzLmludGVybmFsU3RvcmVbdHlwZV07XG4gICAgcmV0dXJuIHR5cGVTdG9yZSA/IE9iamVjdC5rZXlzKHR5cGVTdG9yZSkubWFwKChrZXkpID0+IHR5cGVTdG9yZVtrZXldIGFzIFQpIDogW107XG4gIH1cblxuICBwdWJsaWMgZGVzZXJpYWxpemVNb2RlbDxUIGV4dGVuZHMgSnNvbkFwaU1vZGVsPihtb2RlbFR5cGU6IE1vZGVsVHlwZTxUPiwgZGF0YTogYW55KSB7XG4gICAgZGF0YS5hdHRyaWJ1dGVzID0gdGhpcy50cmFuc2Zvcm1TZXJpYWxpemVkTmFtZXNUb1Byb3BlcnR5TmFtZXMobW9kZWxUeXBlLCBkYXRhLmF0dHJpYnV0ZXMpO1xuICAgIHJldHVybiBuZXcgbW9kZWxUeXBlKHRoaXMsIGRhdGEpO1xuICB9XG5cbiAgcHVibGljIGFkZFRvU3RvcmUobW9kZWxPck1vZGVsczogSnNvbkFwaU1vZGVsIHwgSnNvbkFwaU1vZGVsW10pOiB2b2lkIHtcbiAgICBjb25zdCBtb2RlbHMgPSBBcnJheS5pc0FycmF5KG1vZGVsT3JNb2RlbHMpID8gbW9kZWxPck1vZGVscyA6IFttb2RlbE9yTW9kZWxzXTtcbiAgICBjb25zdCB0eXBlOiBzdHJpbmcgPSBtb2RlbHNbMF0ubW9kZWxDb25maWcudHlwZTtcbiAgICBsZXQgdHlwZVN0b3JlID0gdGhpcy5pbnRlcm5hbFN0b3JlW3R5cGVdO1xuXG4gICAgaWYgKCF0eXBlU3RvcmUpIHtcbiAgICAgIHR5cGVTdG9yZSA9IHRoaXMuaW50ZXJuYWxTdG9yZVt0eXBlXSA9IHt9O1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgbW9kZWwgb2YgbW9kZWxzKSB7XG4gICAgICB0eXBlU3RvcmVbbW9kZWwuaWRdID0gbW9kZWw7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHRyYW5zZm9ybVNlcmlhbGl6ZWROYW1lc1RvUHJvcGVydHlOYW1lczxUIGV4dGVuZHMgSnNvbkFwaU1vZGVsPihtb2RlbFR5cGU6IE1vZGVsVHlwZTxUPiwgYXR0cmlidXRlczogYW55KSB7XG4gICAgY29uc3Qgc2VyaWFsaXplZE5hbWVUb1Byb3BlcnR5TmFtZSA9IHRoaXMuZ2V0TW9kZWxQcm9wZXJ0eU5hbWVzKG1vZGVsVHlwZS5wcm90b3R5cGUpO1xuICAgIGNvbnN0IHByb3BlcnRpZXM6IGFueSA9IHt9O1xuXG4gICAgT2JqZWN0LmtleXMoc2VyaWFsaXplZE5hbWVUb1Byb3BlcnR5TmFtZSkuZm9yRWFjaCgoc2VyaWFsaXplZE5hbWUpID0+IHtcbiAgICAgIGlmIChhdHRyaWJ1dGVzICYmIGF0dHJpYnV0ZXNbc2VyaWFsaXplZE5hbWVdICE9PSBudWxsICYmIGF0dHJpYnV0ZXNbc2VyaWFsaXplZE5hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcHJvcGVydGllc1tzZXJpYWxpemVkTmFtZVRvUHJvcGVydHlOYW1lW3NlcmlhbGl6ZWROYW1lXV0gPSBhdHRyaWJ1dGVzW3NlcmlhbGl6ZWROYW1lXTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBwcm9wZXJ0aWVzO1xuICB9XG5cbiAgcHJvdGVjdGVkIGJ1aWxkVXJsPFQgZXh0ZW5kcyBKc29uQXBpTW9kZWw+KFxuICAgIG1vZGVsVHlwZTogTW9kZWxUeXBlPFQ+LFxuICAgIHBhcmFtcz86IGFueSxcbiAgICBpZD86IHN0cmluZyxcbiAgICBjdXN0b21Vcmw/OiBzdHJpbmdcbiAgKTogc3RyaW5nIHtcbiAgICAvLyBUT0RPOiB1c2UgSHR0cFBhcmFtcyBpbnN0ZWFkIG9mIGFwcGVuZGluZyBhIHN0cmluZyB0byB0aGUgdXJsXG4gICAgY29uc3QgcXVlcnlQYXJhbXM6IHN0cmluZyA9IHRoaXMudG9RdWVyeVN0cmluZyhwYXJhbXMpO1xuXG4gICAgaWYgKGN1c3RvbVVybCkge1xuICAgICAgcmV0dXJuIHF1ZXJ5UGFyYW1zID8gYCR7Y3VzdG9tVXJsfT8ke3F1ZXJ5UGFyYW1zfWAgOiBjdXN0b21Vcmw7XG4gICAgfVxuXG4gICAgY29uc3QgbW9kZWxDb25maWc6IE1vZGVsQ29uZmlnID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnSnNvbkFwaU1vZGVsQ29uZmlnJywgbW9kZWxUeXBlKTtcblxuICAgIGNvbnN0IGJhc2VVcmwgPSBtb2RlbENvbmZpZy5iYXNlVXJsIHx8IHRoaXMuZGF0YXN0b3JlQ29uZmlnLmJhc2VVcmw7XG4gICAgY29uc3QgYXBpVmVyc2lvbiA9IG1vZGVsQ29uZmlnLmFwaVZlcnNpb24gfHwgdGhpcy5kYXRhc3RvcmVDb25maWcuYXBpVmVyc2lvbjtcbiAgICBjb25zdCBtb2RlbEVuZHBvaW50VXJsOiBzdHJpbmcgPSBtb2RlbENvbmZpZy5tb2RlbEVuZHBvaW50VXJsIHx8IG1vZGVsQ29uZmlnLnR5cGU7XG5cbiAgICBjb25zdCB1cmw6IHN0cmluZyA9IFtiYXNlVXJsLCBhcGlWZXJzaW9uLCBtb2RlbEVuZHBvaW50VXJsLCBpZF0uZmlsdGVyKCh4KSA9PiB4KS5qb2luKCcvJyk7XG5cbiAgICByZXR1cm4gcXVlcnlQYXJhbXMgPyBgJHt1cmx9PyR7cXVlcnlQYXJhbXN9YCA6IHVybDtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRSZWxhdGlvbnNoaXBzKGRhdGE6IGFueSk6IGFueSB7XG4gICAgbGV0IHJlbGF0aW9uc2hpcHM6IGFueTtcblxuICAgIGNvbnN0IGJlbG9uZ3NUb01ldGFkYXRhOiBhbnlbXSA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ0JlbG9uZ3NUbycsIGRhdGEpIHx8IFtdO1xuICAgIGNvbnN0IGhhc01hbnlNZXRhZGF0YTogYW55W10gPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdIYXNNYW55JywgZGF0YSkgfHwgW107XG5cbiAgICBmb3IgKGNvbnN0IGtleSBpbiBkYXRhKSB7XG4gICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIGlmIChkYXRhW2tleV0gaW5zdGFuY2VvZiBKc29uQXBpTW9kZWwpIHtcbiAgICAgICAgICByZWxhdGlvbnNoaXBzID0gcmVsYXRpb25zaGlwcyB8fCB7fTtcblxuICAgICAgICAgIGlmIChkYXRhW2tleV0uaWQpIHtcbiAgICAgICAgICAgIGNvbnN0IGVudGl0eSA9IGJlbG9uZ3NUb01ldGFkYXRhLmZpbmQoKGl0OiBhbnkpID0+IGl0LnByb3BlcnR5TmFtZSA9PT0ga2V5KTtcbiAgICAgICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcEtleSA9IGVudGl0eS5yZWxhdGlvbnNoaXA7XG4gICAgICAgICAgICByZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcEtleV0gPSB7XG4gICAgICAgICAgICAgIGRhdGE6IHRoaXMuYnVpbGRTaW5nbGVSZWxhdGlvbnNoaXBEYXRhKGRhdGFba2V5XSlcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGRhdGFba2V5XSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgY29uc3QgZW50aXR5ID0gaGFzTWFueU1ldGFkYXRhLmZpbmQoKGl0OiBhbnkpID0+IGl0LnByb3BlcnR5TmFtZSA9PT0ga2V5KTtcbiAgICAgICAgICBpZiAoZW50aXR5ICYmIHRoaXMuaXNWYWxpZFRvTWFueVJlbGF0aW9uKGRhdGFba2V5XSkpIHtcbiAgICAgICAgICAgIHJlbGF0aW9uc2hpcHMgPSByZWxhdGlvbnNoaXBzIHx8IHt9O1xuXG4gICAgICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBLZXkgPSBlbnRpdHkucmVsYXRpb25zaGlwO1xuICAgICAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGF0YSA9IGRhdGFba2V5XVxuICAgICAgICAgICAgICAuZmlsdGVyKChtb2RlbDogSnNvbkFwaU1vZGVsKSA9PiBtb2RlbC5pZClcbiAgICAgICAgICAgICAgLm1hcCgobW9kZWw6IEpzb25BcGlNb2RlbCkgPT4gdGhpcy5idWlsZFNpbmdsZVJlbGF0aW9uc2hpcERhdGEobW9kZWwpKTtcblxuICAgICAgICAgICAgcmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBLZXldID0ge1xuICAgICAgICAgICAgICBkYXRhOiByZWxhdGlvbnNoaXBEYXRhXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZWxhdGlvbnNoaXBzO1xuICB9XG5cbiAgcHJvdGVjdGVkIGlzVmFsaWRUb01hbnlSZWxhdGlvbihvYmplY3RzOiBBcnJheTxhbnk+KTogYm9vbGVhbiB7XG4gICAgaWYgKCFvYmplY3RzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGNvbnN0IGlzSnNvbkFwaU1vZGVsID0gb2JqZWN0cy5ldmVyeSgoaXRlbSkgPT4gaXRlbSBpbnN0YW5jZW9mIEpzb25BcGlNb2RlbCk7XG4gICAgaWYgKCFpc0pzb25BcGlNb2RlbCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCB0eXBlcyA9IG9iamVjdHMubWFwKChpdGVtOiBKc29uQXBpTW9kZWwpID0+IGl0ZW0ubW9kZWxDb25maWcubW9kZWxFbmRwb2ludFVybCB8fCBpdGVtLm1vZGVsQ29uZmlnLnR5cGUpO1xuICAgIHJldHVybiB0eXBlc1xuICAgICAgLmZpbHRlcigodHlwZTogc3RyaW5nLCBpbmRleDogbnVtYmVyLCBzZWxmOiBzdHJpbmdbXSkgPT4gc2VsZi5pbmRleE9mKHR5cGUpID09PSBpbmRleClcbiAgICAgIC5sZW5ndGggPT09IDE7XG4gIH1cblxuICBwcm90ZWN0ZWQgYnVpbGRTaW5nbGVSZWxhdGlvbnNoaXBEYXRhKG1vZGVsOiBKc29uQXBpTW9kZWwpOiBhbnkge1xuICAgIGNvbnN0IHJlbGF0aW9uc2hpcFR5cGU6IHN0cmluZyA9IG1vZGVsLm1vZGVsQ29uZmlnLnR5cGU7XG4gICAgY29uc3QgcmVsYXRpb25TaGlwRGF0YTogeyB0eXBlOiBzdHJpbmcsIGlkPzogc3RyaW5nLCBhdHRyaWJ1dGVzPzogYW55IH0gPSB7dHlwZTogcmVsYXRpb25zaGlwVHlwZX07XG5cbiAgICBpZiAobW9kZWwuaWQpIHtcbiAgICAgIHJlbGF0aW9uU2hpcERhdGEuaWQgPSBtb2RlbC5pZDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgYXR0cmlidXRlc01ldGFkYXRhOiBhbnkgPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdBdHRyaWJ1dGUnLCBtb2RlbCk7XG4gICAgICByZWxhdGlvblNoaXBEYXRhLmF0dHJpYnV0ZXMgPSB0aGlzLmdldERpcnR5QXR0cmlidXRlcyhhdHRyaWJ1dGVzTWV0YWRhdGEsIG1vZGVsKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVsYXRpb25TaGlwRGF0YTtcbiAgfVxuXG4gIHByb3RlY3RlZCBleHRyYWN0UXVlcnlEYXRhPFQgZXh0ZW5kcyBKc29uQXBpTW9kZWw+KFxuICAgIHJlc3BvbnNlOiBIdHRwUmVzcG9uc2U8b2JqZWN0PixcbiAgICBtb2RlbFR5cGU6IE1vZGVsVHlwZTxUPixcbiAgICB3aXRoTWV0YSA9IGZhbHNlXG4gICk6IEFycmF5PFQ+IHwgSnNvbkFwaVF1ZXJ5RGF0YTxUPiB7XG4gICAgY29uc3QgYm9keTogYW55ID0gcmVzcG9uc2UuYm9keTtcbiAgICBjb25zdCBtb2RlbHM6IFRbXSA9IFtdO1xuXG4gICAgYm9keS5kYXRhLmZvckVhY2goKGRhdGE6IGFueSkgPT4ge1xuICAgICAgbGV0IHR5cGUgPSB0aGlzLmRhdGFzdG9yZUNvbmZpZy5tb2RlbHNbZGF0YS50eXBlXTtcbiAgICAgIHR5cGUgPSB0eXBlID8gdHlwZSA6IG1vZGVsVHlwZTtcbiAgICAgIGNvbnN0IG1vZGVsOiBUID0gdGhpcy5kZXNlcmlhbGl6ZU1vZGVsKHR5cGUsIGRhdGEpO1xuICAgICAgdGhpcy5hZGRUb1N0b3JlKG1vZGVsKTtcblxuICAgICAgaWYgKGJvZHkuaW5jbHVkZWQpIHtcbiAgICAgICAgbW9kZWwuc3luY1JlbGF0aW9uc2hpcHMoZGF0YSwgYm9keS5pbmNsdWRlZC5jb25jYXQoZGF0YSkpO1xuICAgICAgICB0aGlzLmFkZFRvU3RvcmUobW9kZWwpO1xuICAgICAgfVxuXG4gICAgICBtb2RlbHMucHVzaChtb2RlbCk7XG4gICAgfSk7XG5cbiAgICBpZiAod2l0aE1ldGEgJiYgd2l0aE1ldGEgPT09IHRydWUpIHtcbiAgICAgIHJldHVybiBuZXcgSnNvbkFwaVF1ZXJ5RGF0YShtb2RlbHMsIHRoaXMucGFyc2VNZXRhKGJvZHksIG1vZGVsVHlwZSkpO1xuICAgIH1cblxuICAgIHJldHVybiBtb2RlbHM7XG4gIH1cblxuICBwcm90ZWN0ZWQgZXh0cmFjdFJlY29yZERhdGE8VCBleHRlbmRzIEpzb25BcGlNb2RlbD4oXG4gICAgcmVzOiBIdHRwUmVzcG9uc2U8b2JqZWN0PixcbiAgICBtb2RlbFR5cGU6IE1vZGVsVHlwZTxUPixcbiAgICBtb2RlbD86IFRcbiAgKTogVCB7XG4gICAgY29uc3QgYm9keTogYW55ID0gcmVzLmJvZHk7XG4gICAgLy8gRXJyb3IgaW4gQW5ndWxhciA8IDUuMi40IChzZWUgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMjA3NDQpXG4gICAgLy8gbnVsbCBpcyBjb252ZXJ0ZWQgdG8gJ251bGwnLCBzbyB0aGlzIGlzIHRlbXBvcmFyeSBuZWVkZWQgdG8gbWFrZSB0ZXN0Y2FzZSBwb3NzaWJsZVxuICAgIC8vIChhbmQgdG8gYXZvaWQgYSBkZWNyZWFzZSBvZiB0aGUgY292ZXJhZ2UpXG4gICAgaWYgKCFib2R5IHx8IGJvZHkgPT09ICdudWxsJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdubyBib2R5IGluIHJlc3BvbnNlJyk7XG4gICAgfVxuXG4gICAgaWYgKCFib2R5LmRhdGEpIHtcbiAgICAgIGlmIChyZXMuc3RhdHVzID09PSAyMDEgfHwgIW1vZGVsKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignZXhwZWN0ZWQgZGF0YSBpbiByZXNwb25zZScpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1vZGVsO1xuICAgIH1cblxuICAgIGlmIChtb2RlbCkge1xuICAgICAgbW9kZWwubW9kZWxJbml0aWFsaXphdGlvbiA9IHRydWU7XG4gICAgICBtb2RlbC5pZCA9IGJvZHkuZGF0YS5pZDtcbiAgICAgIE9iamVjdC5hc3NpZ24obW9kZWwsIGJvZHkuZGF0YS5hdHRyaWJ1dGVzKTtcbiAgICAgIG1vZGVsLm1vZGVsSW5pdGlhbGl6YXRpb24gPSBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBkZXNlcmlhbGl6ZWRNb2RlbCA9IG1vZGVsIHx8IHRoaXMuZGVzZXJpYWxpemVNb2RlbChtb2RlbFR5cGUsIGJvZHkuZGF0YSk7XG4gICAgdGhpcy5hZGRUb1N0b3JlKGRlc2VyaWFsaXplZE1vZGVsKTtcbiAgICBpZiAoYm9keS5pbmNsdWRlZCkge1xuICAgICAgZGVzZXJpYWxpemVkTW9kZWwuc3luY1JlbGF0aW9uc2hpcHMoYm9keS5kYXRhLCBib2R5LmluY2x1ZGVkKTtcbiAgICAgIHRoaXMuYWRkVG9TdG9yZShkZXNlcmlhbGl6ZWRNb2RlbCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlc2VyaWFsaXplZE1vZGVsO1xuICB9XG5cbiAgcHJvdGVjdGVkIGhhbmRsZUVycm9yKGVycm9yOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIGlmIChcbiAgICAgIGVycm9yIGluc3RhbmNlb2YgSHR0cEVycm9yUmVzcG9uc2UgJiZcbiAgICAgIGVycm9yLmVycm9yIGluc3RhbmNlb2YgT2JqZWN0ICYmXG4gICAgICBlcnJvci5lcnJvci5lcnJvcnMgJiZcbiAgICAgIGVycm9yLmVycm9yLmVycm9ycyBpbnN0YW5jZW9mIEFycmF5XG4gICAgKSB7XG4gICAgICBjb25zdCBlcnJvcnM6IEVycm9yUmVzcG9uc2UgPSBuZXcgRXJyb3JSZXNwb25zZShlcnJvci5lcnJvci5lcnJvcnMpO1xuICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyb3JzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhyb3dFcnJvcihlcnJvcik7XG4gIH1cblxuICBwcm90ZWN0ZWQgcGFyc2VNZXRhKGJvZHk6IGFueSwgbW9kZWxUeXBlOiBNb2RlbFR5cGU8SnNvbkFwaU1vZGVsPik6IGFueSB7XG4gICAgY29uc3QgbWV0YU1vZGVsOiBhbnkgPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdKc29uQXBpTW9kZWxDb25maWcnLCBtb2RlbFR5cGUpLm1ldGE7XG4gICAgcmV0dXJuIG5ldyBtZXRhTW9kZWwoYm9keSk7XG4gIH1cblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWQgdXNlIGJ1aWxkSHR0cEhlYWRlcnMgbWV0aG9kIHRvIGJ1aWxkIHJlcXVlc3QgaGVhZGVyc1xuICAgKi9cbiAgcHJvdGVjdGVkIGdldE9wdGlvbnMoY3VzdG9tSGVhZGVycz86IEh0dHBIZWFkZXJzKTogYW55IHtcbiAgICByZXR1cm4ge1xuICAgICAgaGVhZGVyczogdGhpcy5idWlsZEh0dHBIZWFkZXJzKGN1c3RvbUhlYWRlcnMpLFxuICAgIH07XG4gIH1cblxuICBwcm90ZWN0ZWQgYnVpbGRIdHRwSGVhZGVycyhjdXN0b21IZWFkZXJzPzogSHR0cEhlYWRlcnMpOiBIdHRwSGVhZGVycyB7XG4gICAgbGV0IHJlcXVlc3RIZWFkZXJzOiBIdHRwSGVhZGVycyA9IG5ldyBIdHRwSGVhZGVycyh7XG4gICAgICBBY2NlcHQ6ICdhcHBsaWNhdGlvbi92bmQuYXBpK2pzb24nLFxuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi92bmQuYXBpK2pzb24nXG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5nbG9iYWxIZWFkZXJzKSB7XG4gICAgICB0aGlzLmdsb2JhbEhlYWRlcnMua2V5cygpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICBpZiAodGhpcy5nbG9iYWxIZWFkZXJzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgcmVxdWVzdEhlYWRlcnMgPSByZXF1ZXN0SGVhZGVycy5zZXQoa2V5LCB0aGlzLmdsb2JhbEhlYWRlcnMuZ2V0KGtleSkpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoY3VzdG9tSGVhZGVycykge1xuICAgICAgY3VzdG9tSGVhZGVycy5rZXlzKCkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgIGlmIChjdXN0b21IZWFkZXJzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgcmVxdWVzdEhlYWRlcnMgPSByZXF1ZXN0SGVhZGVycy5zZXQoa2V5LCBjdXN0b21IZWFkZXJzLmdldChrZXkpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcXVlc3RIZWFkZXJzO1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlc2V0TWV0YWRhdGFBdHRyaWJ1dGVzPFQgZXh0ZW5kcyBKc29uQXBpTW9kZWw+KHJlczogVCwgYXR0cmlidXRlc01ldGFkYXRhOiBhbnksIG1vZGVsVHlwZTogTW9kZWxUeXBlPFQ+KSB7XG4gICAgZm9yIChjb25zdCBwcm9wZXJ0eU5hbWUgaW4gYXR0cmlidXRlc01ldGFkYXRhKSB7XG4gICAgICBpZiAoYXR0cmlidXRlc01ldGFkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgY29uc3QgbWV0YWRhdGE6IGFueSA9IGF0dHJpYnV0ZXNNZXRhZGF0YVtwcm9wZXJ0eU5hbWVdO1xuXG4gICAgICAgIGlmIChtZXRhZGF0YS5oYXNEaXJ0eUF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICBtZXRhZGF0YS5oYXNEaXJ0eUF0dHJpYnV0ZXMgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICByZXNbQXR0cmlidXRlTWV0YWRhdGFJbmRleF0gPSBhdHRyaWJ1dGVzTWV0YWRhdGE7XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIHByb3RlY3RlZCB1cGRhdGVSZWxhdGlvbnNoaXBzPFQgZXh0ZW5kcyBKc29uQXBpTW9kZWw+KG1vZGVsOiBULCByZWxhdGlvbnNoaXBzOiBhbnkpOiBUIHtcbiAgICBjb25zdCBtb2RlbHNUeXBlczogYW55ID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnSnNvbkFwaURhdGFzdG9yZUNvbmZpZycsIHRoaXMuY29uc3RydWN0b3IpLm1vZGVscztcblxuICAgIGZvciAoY29uc3QgcmVsYXRpb25zaGlwIGluIHJlbGF0aW9uc2hpcHMpIHtcbiAgICAgIGlmIChyZWxhdGlvbnNoaXBzLmhhc093blByb3BlcnR5KHJlbGF0aW9uc2hpcCkgJiYgbW9kZWwuaGFzT3duUHJvcGVydHkocmVsYXRpb25zaGlwKSkge1xuICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBNb2RlbDogSnNvbkFwaU1vZGVsID0gbW9kZWxbcmVsYXRpb25zaGlwXTtcbiAgICAgICAgY29uc3QgaGFzTWFueTogYW55W10gPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdIYXNNYW55JywgcmVsYXRpb25zaGlwTW9kZWwpO1xuICAgICAgICBjb25zdCBwcm9wZXJ0eUhhc01hbnk6IGFueSA9IGZpbmQoaGFzTWFueSwgKHByb3BlcnR5KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIG1vZGVsc1R5cGVzW3Byb3BlcnR5LnJlbGF0aW9uc2hpcF0gPT09IG1vZGVsLmNvbnN0cnVjdG9yO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAocHJvcGVydHlIYXNNYW55KSB7XG4gICAgICAgICAgcmVsYXRpb25zaGlwTW9kZWxbcHJvcGVydHlIYXNNYW55LnByb3BlcnR5TmFtZV0gPSByZWxhdGlvbnNoaXBNb2RlbFtwcm9wZXJ0eUhhc01hbnkucHJvcGVydHlOYW1lXSB8fCBbXTtcblxuICAgICAgICAgIGNvbnN0IGluZGV4T2ZNb2RlbCA9IHJlbGF0aW9uc2hpcE1vZGVsW3Byb3BlcnR5SGFzTWFueS5wcm9wZXJ0eU5hbWVdLmluZGV4T2YobW9kZWwpO1xuXG4gICAgICAgICAgaWYgKGluZGV4T2ZNb2RlbCA9PT0gLTEpIHtcbiAgICAgICAgICAgIHJlbGF0aW9uc2hpcE1vZGVsW3Byb3BlcnR5SGFzTWFueS5wcm9wZXJ0eU5hbWVdLnB1c2gobW9kZWwpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZWxhdGlvbnNoaXBNb2RlbFtwcm9wZXJ0eUhhc01hbnkucHJvcGVydHlOYW1lXVtpbmRleE9mTW9kZWxdID0gbW9kZWw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG1vZGVsO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldE1vZGVsUHJvcGVydHlOYW1lcyhtb2RlbDogSnNvbkFwaU1vZGVsKSB7XG4gICAgcmV0dXJuIFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ0F0dHJpYnV0ZU1hcHBpbmcnLCBtb2RlbCkgfHwgW107XG4gIH1cblxuICBwcml2YXRlIGJ1aWxkUmVxdWVzdE9wdGlvbnMoY3VzdG9tT3B0aW9uczogYW55ID0ge30pOiBvYmplY3Qge1xuICAgIGNvbnN0IGh0dHBIZWFkZXJzOiBIdHRwSGVhZGVycyA9IHRoaXMuYnVpbGRIdHRwSGVhZGVycyhjdXN0b21PcHRpb25zLmhlYWRlcnMpO1xuXG4gICAgY29uc3QgcmVxdWVzdE9wdGlvbnM6IG9iamVjdCA9IE9iamVjdC5hc3NpZ24oY3VzdG9tT3B0aW9ucywge1xuICAgICAgaGVhZGVyczogaHR0cEhlYWRlcnNcbiAgICB9KTtcblxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHRoaXMuZ2xvYmFsUmVxdWVzdE9wdGlvbnMsIHJlcXVlc3RPcHRpb25zKTtcbiAgfVxuXG4gIHByaXZhdGUgX3RvUXVlcnlTdHJpbmcocGFyYW1zOiBhbnkpOiBzdHJpbmcge1xuICAgIHJldHVybiBxcy5zdHJpbmdpZnkocGFyYW1zLCB7YXJyYXlGb3JtYXQ6ICdicmFja2V0cyd9KTtcbiAgfVxufVxuIl19