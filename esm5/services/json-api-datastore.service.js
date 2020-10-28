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
            if (attributes) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi1hcGktZGF0YXN0b3JlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyMi1qc29uYXBpLyIsInNvdXJjZXMiOlsic2VydmljZXMvanNvbi1hcGktZGF0YXN0b3JlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxVQUFVLEVBQUUsaUJBQWlCLEVBQUUsV0FBVyxFQUFnQixNQUFNLHNCQUFzQixDQUFDO0FBQ2hHLE9BQU8sSUFBSSxNQUFNLGdCQUFnQixDQUFDO0FBQ2xDLE9BQU8sRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDakQsT0FBTyxFQUFjLEVBQUUsRUFBRSxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDbEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUMvRCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUNqRSxPQUFPLEtBQUssRUFBRSxNQUFNLElBQUksQ0FBQztBQUd6QixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUN6RCxPQUFPLGtCQUFrQixDQUFDOzs7Ozs7Ozs7SUFXcEIsc0JBQXNCLEdBQVcsbUJBQUEsaUJBQWlCLEVBQU87QUFFL0Q7SUFXRSwwQkFBc0IsSUFBZ0I7UUFBaEIsU0FBSSxHQUFKLElBQUksQ0FBWTtRQU45Qix5QkFBb0IsR0FBVyxFQUFFLENBQUM7UUFDbEMsa0JBQWEsR0FBdUQsRUFBRSxDQUFDO1FBQ3ZFLGtCQUFhLEdBQTRCLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUztlQUM1RSxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUMvQyxJ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QUFZLENBQUMsR0FBRyxLQUFLLENBQUM7cUJBQ3ZFO2lCQUNGO2FBQ0Y7U0FDRjtRQUVELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQzs7Ozs7O0lBRVMsZ0RBQXFCOzs7OztJQUEvQixVQUFnQyxLQUFtQjtRQUNqRCxPQUFPLE9BQU8sQ0FBQyxXQUFXLENBQUMsa0JBQWtCLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzlELENBQUM7Ozs7OztJQUVPLDhDQUFtQjs7Ozs7SUFBM0IsVUFBNEIsYUFBdUI7UUFBdkIsOEJBQUEsRUFBQSxrQkFBdUI7O1lBQzNDLFdBQVcsR0FBZ0IsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUM7O1lBRXZFLGNBQWMsR0FBVyxNQUFNLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRTtZQUMxRCxPQUFPLEVBQUUsV0FBVztTQUNyQixDQUFDO1FBRUYsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxjQUFjLENBQUMsQ0FBQztJQUNsRSxDQUFDOzs7Ozs7SUFFTyx5Q0FBYzs7Ozs7SUFBdEIsVUFBdUIsTUFBVztRQUNoQyxPQUFPLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLEVBQUMsV0FBVyxFQUFFLFVBQVUsRUFBQyxDQUFDLENBQUM7SUFDekQsQ0FBQzs7Z0JBOWRGLFVBQVU7Ozs7Z0JBeEJGLFVBQVU7O0lBdWZuQix1QkFBQztDQUFBLEFBL2RELElBK2RDO1NBOWRZLGdCQUFnQjs7Ozs7O0lBRTNCLGtDQUFrQzs7Ozs7SUFDbEMseUNBQW1DOzs7OztJQUNuQyxnREFBMEM7Ozs7O0lBQzFDLHlDQUErRTs7Ozs7SUFDL0UseUNBRXFFOzs7OztJQUV6RCxnQ0FBMEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwRXJyb3JSZXNwb25zZSwgSHR0cEhlYWRlcnMsIEh0dHBSZXNwb25zZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCBmaW5kIGZyb20gJ2xvZGFzaC1lcy9maW5kJztcbmltcG9ydCB7IGNhdGNoRXJyb3IsIG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IE9ic2VydmFibGUsIG9mLCB0aHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBKc29uQXBpTW9kZWwgfSBmcm9tICcuLi9tb2RlbHMvanNvbi1hcGkubW9kZWwnO1xuaW1wb3J0IHsgRXJyb3JSZXNwb25zZSB9IGZyb20gJy4uL21vZGVscy9lcnJvci1yZXNwb25zZS5tb2RlbCc7XG5pbXBvcnQgeyBKc29uQXBpUXVlcnlEYXRhIH0gZnJvbSAnLi4vbW9kZWxzL2pzb24tYXBpLXF1ZXJ5LWRhdGEnO1xuaW1wb3J0ICogYXMgcXMgZnJvbSAncXMnO1xuaW1wb3J0IHsgRGF0YXN0b3JlQ29uZmlnIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9kYXRhc3RvcmUtY29uZmlnLmludGVyZmFjZSc7XG5pbXBvcnQgeyBNb2RlbENvbmZpZyB9IGZyb20gJy4uL2ludGVyZmFjZXMvbW9kZWwtY29uZmlnLmludGVyZmFjZSc7XG5pbXBvcnQgeyBBdHRyaWJ1dGVNZXRhZGF0YSB9IGZyb20gJy4uL2NvbnN0YW50cy9zeW1ib2xzJztcbmltcG9ydCAncmVmbGVjdC1tZXRhZGF0YSc7XG5cbmV4cG9ydCB0eXBlIE1vZGVsVHlwZTxUIGV4dGVuZHMgSnNvbkFwaU1vZGVsPiA9IG5ldyhkYXRhc3RvcmU6IEpzb25BcGlEYXRhc3RvcmUsIGRhdGE6IGFueSkgPT4gVDtcblxuLyoqXG4gKiBIQUNLL0ZJWE1FOlxuICogVHlwZSAnc3ltYm9sJyBjYW5ub3QgYmUgdXNlZCBhcyBhbiBpbmRleCB0eXBlLlxuICogVHlwZVNjcmlwdCAyLjkueFxuICogU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMjQ1ODcuXG4gKi9cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lXG5jb25zdCBBdHRyaWJ1dGVNZXRhZGF0YUluZGV4OiBzdHJpbmcgPSBBdHRyaWJ1dGVNZXRhZGF0YSBhcyBhbnk7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBKc29uQXBpRGF0YXN0b3JlIHtcblxuICBwcm90ZWN0ZWQgY29uZmlnOiBEYXRhc3RvcmVDb25maWc7XG4gIHByaXZhdGUgZ2xvYmFsSGVhZGVyczogSHR0cEhlYWRlcnM7XG4gIHByaXZhdGUgZ2xvYmFsUmVxdWVzdE9wdGlvbnM6IG9iamVjdCA9IHt9O1xuICBwcml2YXRlIGludGVybmFsU3RvcmU6IHsgW3R5cGU6IHN0cmluZ106IHsgW2lkOiBzdHJpbmddOiBKc29uQXBpTW9kZWwgfSB9ID0ge307XG4gIHByaXZhdGUgdG9RdWVyeVN0cmluZzogKHBhcmFtczogYW55KSA9PiBzdHJpbmcgPSB0aGlzLmRhdGFzdG9yZUNvbmZpZy5vdmVycmlkZXNcbiAgJiYgdGhpcy5kYXRhc3RvcmVDb25maWcub3ZlcnJpZGVzLnRvUXVlcnlTdHJpbmcgP1xuICAgIHRoaXMuZGF0YXN0b3JlQ29uZmlnLm92ZXJyaWRlcy50b1F1ZXJ5U3RyaW5nIDogdGhpcy5fdG9RdWVyeVN0cmluZztcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgaHR0cDogSHR0cENsaWVudCkge1xuICB9XG5cbiAgc2V0IGhlYWRlcnMoaGVhZGVyczogSHR0cEhlYWRlcnMpIHtcbiAgICB0aGlzLmdsb2JhbEhlYWRlcnMgPSBoZWFkZXJzO1xuICB9XG5cbiAgc2V0IHJlcXVlc3RPcHRpb25zKHJlcXVlc3RPcHRpb25zOiBvYmplY3QpIHtcbiAgICB0aGlzLmdsb2JhbFJlcXVlc3RPcHRpb25zID0gcmVxdWVzdE9wdGlvbnM7XG4gIH1cblxuICBwdWJsaWMgZ2V0IGRhdGFzdG9yZUNvbmZpZygpOiBEYXRhc3RvcmVDb25maWcge1xuICAgIGNvbnN0IGNvbmZpZ0Zyb21EZWNvcmF0b3I6IERhdGFzdG9yZUNvbmZpZyA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ0pzb25BcGlEYXRhc3RvcmVDb25maWcnLCB0aGlzLmNvbnN0cnVjdG9yKTtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihjb25maWdGcm9tRGVjb3JhdG9yLCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBwcml2YXRlIGdldCBnZXREaXJ0eUF0dHJpYnV0ZXMoKSB7XG4gICAgaWYgKHRoaXMuZGF0YXN0b3JlQ29uZmlnLm92ZXJyaWRlc1xuICAgICAgJiYgdGhpcy5kYXRhc3RvcmVDb25maWcub3ZlcnJpZGVzLmdldERpcnR5QXR0cmlidXRlcykge1xuICAgICAgcmV0dXJuIHRoaXMuZGF0YXN0b3JlQ29uZmlnLm92ZXJyaWRlcy5nZXREaXJ0eUF0dHJpYnV0ZXM7XG4gICAgfVxuICAgIHJldHVybiBKc29uQXBpRGF0YXN0b3JlLmdldERpcnR5QXR0cmlidXRlcztcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIGdldERpcnR5QXR0cmlidXRlcyhhdHRyaWJ1dGVzTWV0YWRhdGE6IGFueSk6IHsgc3RyaW5nOiBhbnkgfSB7XG4gICAgY29uc3QgZGlydHlEYXRhOiBhbnkgPSB7fTtcblxuICAgIGZvciAoY29uc3QgcHJvcGVydHlOYW1lIGluIGF0dHJpYnV0ZXNNZXRhZGF0YSkge1xuICAgICAgaWYgKGF0dHJpYnV0ZXNNZXRhZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgIGNvbnN0IG1ldGFkYXRhOiBhbnkgPSBhdHRyaWJ1dGVzTWV0YWRhdGFbcHJvcGVydHlOYW1lXTtcblxuICAgICAgICBpZiAobWV0YWRhdGEuaGFzRGlydHlBdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgY29uc3QgYXR0cmlidXRlTmFtZSA9IG1ldGFkYXRhLnNlcmlhbGl6ZWROYW1lICE9IG51bGwgPyBtZXRhZGF0YS5zZXJpYWxpemVkTmFtZSA6IHByb3BlcnR5TmFtZTtcbiAgICAgICAgICBkaXJ0eURhdGFbYXR0cmlidXRlTmFtZV0gPSBtZXRhZGF0YS5zZXJpYWxpc2F0aW9uVmFsdWUgPyBtZXRhZGF0YS5zZXJpYWxpc2F0aW9uVmFsdWUgOiBtZXRhZGF0YS5uZXdWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGlydHlEYXRhO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIHVzZSBmaW5kQWxsIG1ldGhvZCB0byB0YWtlIGFsbCBtb2RlbHNcbiAgICovXG4gIHF1ZXJ5PFQgZXh0ZW5kcyBKc29uQXBpTW9kZWw+KFxuICAgIG1vZGVsVHlwZTogTW9kZWxUeXBlPFQ+LFxuICAgIHBhcmFtcz86IGFueSxcbiAgICBoZWFkZXJzPzogSHR0cEhlYWRlcnMsXG4gICAgY3VzdG9tVXJsPzogc3RyaW5nXG4gICk6IE9ic2VydmFibGU8VFtdPiB7XG4gICAgY29uc3QgcmVxdWVzdEhlYWRlcnM6IEh0dHBIZWFkZXJzID0gdGhpcy5idWlsZEh0dHBIZWFkZXJzKGhlYWRlcnMpO1xuICAgIGNvbnN0IHVybDogc3RyaW5nID0gdGhpcy5idWlsZFVybChtb2RlbFR5cGUsIHBhcmFtcywgdW5kZWZpbmVkLCBjdXN0b21VcmwpO1xuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KHVybCwge2hlYWRlcnM6IHJlcXVlc3RIZWFkZXJzfSlcbiAgICAgIC5waXBlKFxuICAgICAgICBtYXAoKHJlczogYW55KSA9PiB0aGlzLmV4dHJhY3RRdWVyeURhdGEocmVzLCBtb2RlbFR5cGUpKSxcbiAgICAgICAgY2F0Y2hFcnJvcigocmVzOiBhbnkpID0+IHRoaXMuaGFuZGxlRXJyb3IocmVzKSlcbiAgICAgICk7XG4gIH1cblxuICBwdWJsaWMgZmluZEFsbDxUIGV4dGVuZHMgSnNvbkFwaU1vZGVsPihcbiAgICBtb2RlbFR5cGU6IE1vZGVsVHlwZTxUPixcbiAgICBwYXJhbXM/OiBhbnksXG4gICAgaGVhZGVycz86IEh0dHBIZWFkZXJzLFxuICAgIGN1c3RvbVVybD86IHN0cmluZ1xuICApOiBPYnNlcnZhYmxlPEpzb25BcGlRdWVyeURhdGE8VD4+IHtcbiAgICBjb25zdCB1cmw6IHN0cmluZyA9IHRoaXMuYnVpbGRVcmwobW9kZWxUeXBlLCBwYXJhbXMsIHVuZGVmaW5lZCwgY3VzdG9tVXJsKTtcbiAgICBjb25zdCByZXF1ZXN0T3B0aW9uczogb2JqZWN0ID0gdGhpcy5idWlsZFJlcXVlc3RPcHRpb25zKHtoZWFkZXJzLCBvYnNlcnZlOiAncmVzcG9uc2UnfSk7XG5cbiAgICByZXR1cm4gdGhpcy5odHRwLmdldCh1cmwsIHJlcXVlc3RPcHRpb25zKVxuICAgICAgLnBpcGUoXG4gICAgICAgIG1hcCgocmVzOiBIdHRwUmVzcG9uc2U8b2JqZWN0PikgPT4gdGhpcy5leHRyYWN0UXVlcnlEYXRhKHJlcywgbW9kZWxUeXBlLCB0cnVlKSksXG4gICAgICAgIGNhdGNoRXJyb3IoKHJlczogYW55KSA9PiB0aGlzLmhhbmRsZUVycm9yKHJlcykpXG4gICAgICApO1xuICB9XG5cbiAgcHVibGljIGZpbmRSZWNvcmQ8VCBleHRlbmRzIEpzb25BcGlNb2RlbD4oXG4gICAgbW9kZWxUeXBlOiBNb2RlbFR5cGU8VD4sXG4gICAgaWQ6IHN0cmluZyxcbiAgICBwYXJhbXM/OiBhbnksXG4gICAgaGVhZGVycz86IEh0dHBIZWFkZXJzLFxuICAgIGN1c3RvbVVybD86IHN0cmluZ1xuICApOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBjb25zdCByZXF1ZXN0T3B0aW9uczogb2JqZWN0ID0gdGhpcy5idWlsZFJlcXVlc3RPcHRpb25zKHtoZWFkZXJzLCBvYnNlcnZlOiAncmVzcG9uc2UnfSk7XG4gICAgY29uc3QgdXJsOiBzdHJpbmcgPSB0aGlzLmJ1aWxkVXJsKG1vZGVsVHlwZSwgcGFyYW1zLCBpZCwgY3VzdG9tVXJsKTtcblxuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KHVybCwgcmVxdWVzdE9wdGlvbnMpXG4gICAgICAucGlwZShcbiAgICAgICAgbWFwKChyZXM6IEh0dHBSZXNwb25zZTxvYmplY3Q+KSA9PiB0aGlzLmV4dHJhY3RSZWNvcmREYXRhKHJlcywgbW9kZWxUeXBlKSksXG4gICAgICAgIGNhdGNoRXJyb3IoKHJlczogYW55KSA9PiB0aGlzLmhhbmRsZUVycm9yKHJlcykpXG4gICAgICApO1xuICB9XG5cbiAgcHVibGljIGNyZWF0ZVJlY29yZDxUIGV4dGVuZHMgSnNvbkFwaU1vZGVsPihtb2RlbFR5cGU6IE1vZGVsVHlwZTxUPiwgZGF0YT86IGFueSk6IFQge1xuICAgIHJldHVybiBuZXcgbW9kZWxUeXBlKHRoaXMsIHthdHRyaWJ1dGVzOiBkYXRhfSk7XG4gIH1cblxuICBwdWJsaWMgc2F2ZVJlY29yZDxUIGV4dGVuZHMgSnNvbkFwaU1vZGVsPihcbiAgICBhdHRyaWJ1dGVzTWV0YWRhdGE6IGFueSxcbiAgICBtb2RlbDogVCxcbiAgICBwYXJhbXM/OiBhbnksXG4gICAgaGVhZGVycz86IEh0dHBIZWFkZXJzLFxuICAgIGN1c3RvbVVybD86IHN0cmluZ1xuICApOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBjb25zdCBtb2RlbFR5cGUgPSBtb2RlbC5jb25zdHJ1Y3RvciBhcyBNb2RlbFR5cGU8VD47XG4gICAgY29uc3QgbW9kZWxDb25maWc6IE1vZGVsQ29uZmlnID0gbW9kZWwubW9kZWxDb25maWc7XG4gICAgY29uc3QgdHlwZU5hbWU6IHN0cmluZyA9IG1vZGVsQ29uZmlnLnR5cGU7XG4gICAgY29uc3QgcmVsYXRpb25zaGlwczogYW55ID0gdGhpcy5nZXRSZWxhdGlvbnNoaXBzKG1vZGVsKTtcbiAgICBjb25zdCB1cmw6IHN0cmluZyA9IHRoaXMuYnVpbGRVcmwobW9kZWxUeXBlLCBwYXJhbXMsIG1vZGVsLmlkLCBjdXN0b21VcmwpO1xuXG4gICAgbGV0IGh0dHBDYWxsOiBPYnNlcnZhYmxlPEh0dHBSZXNwb25zZTxvYmplY3Q+PjtcbiAgICBjb25zdCBib2R5OiBhbnkgPSB7XG4gICAgICBkYXRhOiB7XG4gICAgICAgIHJlbGF0aW9uc2hpcHMsXG4gICAgICAgIHR5cGU6IHR5cGVOYW1lLFxuICAgICAgICBpZDogbW9kZWwuaWQsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHRoaXMuZ2V0RGlydHlBdHRyaWJ1dGVzKGF0dHJpYnV0ZXNNZXRhZGF0YSwgbW9kZWwpXG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IHJlcXVlc3RPcHRpb25zOiBvYmplY3QgPSB0aGlzLmJ1aWxkUmVxdWVzdE9wdGlvbnMoe2hlYWRlcnMsIG9ic2VydmU6ICdyZXNwb25zZSd9KTtcblxuICAgIGlmIChtb2RlbC5pZCkge1xuICAgICAgaHR0cENhbGwgPSB0aGlzLmh0dHAucGF0Y2g8b2JqZWN0Pih1cmwsIGJvZHksIHJlcXVlc3RPcHRpb25zKSBhcyBPYnNlcnZhYmxlPEh0dHBSZXNwb25zZTxvYmplY3Q+PjtcbiAgICB9IGVsc2Uge1xuICAgICAgaHR0cENhbGwgPSB0aGlzLmh0dHAucG9zdDxvYmplY3Q+KHVybCwgYm9keSwgcmVxdWVzdE9wdGlvbnMpIGFzIE9ic2VydmFibGU8SHR0cFJlc3BvbnNlPG9iamVjdD4+O1xuICAgIH1cblxuICAgIHJldHVybiBodHRwQ2FsbFxuICAgICAgLnBpcGUoXG4gICAgICAgIG1hcCgocmVzKSA9PiBbMjAwLCAyMDFdLmluZGV4T2YocmVzLnN0YXR1cykgIT09IC0xID8gdGhpcy5leHRyYWN0UmVjb3JkRGF0YShyZXMsIG1vZGVsVHlwZSwgbW9kZWwpIDogbW9kZWwpLFxuICAgICAgICBjYXRjaEVycm9yKChyZXMpID0+IHtcbiAgICAgICAgICBpZiAocmVzID09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBvZihtb2RlbCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZUVycm9yKHJlcyk7XG4gICAgICAgIH0pLFxuICAgICAgICBtYXAoKHJlcykgPT4gdGhpcy51cGRhdGVSZWxhdGlvbnNoaXBzKHJlcywgcmVsYXRpb25zaGlwcykpXG4gICAgICApO1xuICB9XG5cbiAgcHVibGljIGRlbGV0ZVJlY29yZDxUIGV4dGVuZHMgSnNvbkFwaU1vZGVsPihcbiAgICBtb2RlbFR5cGU6IE1vZGVsVHlwZTxUPixcbiAgICBpZDogc3RyaW5nLFxuICAgIGhlYWRlcnM/OiBIdHRwSGVhZGVycyxcbiAgICBjdXN0b21Vcmw/OiBzdHJpbmdcbiAgKTogT2JzZXJ2YWJsZTxSZXNwb25zZT4ge1xuICAgIGNvbnN0IHJlcXVlc3RPcHRpb25zOiBvYmplY3QgPSB0aGlzLmJ1aWxkUmVxdWVzdE9wdGlvbnMoe2hlYWRlcnN9KTtcbiAgICBjb25zdCB1cmw6IHN0cmluZyA9IHRoaXMuYnVpbGRVcmwobW9kZWxUeXBlLCBudWxsLCBpZCwgY3VzdG9tVXJsKTtcblxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKHVybCwgcmVxdWVzdE9wdGlvbnMpXG4gICAgICAucGlwZShcbiAgICAgICAgY2F0Y2hFcnJvcigocmVzOiBIdHRwRXJyb3JSZXNwb25zZSkgPT4gdGhpcy5oYW5kbGVFcnJvcihyZXMpKVxuICAgICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBwZWVrUmVjb3JkPFQgZXh0ZW5kcyBKc29uQXBpTW9kZWw+KG1vZGVsVHlwZTogTW9kZWxUeXBlPFQ+LCBpZDogc3RyaW5nKTogVCB8IG51bGwge1xuICAgIGNvbnN0IHR5cGU6IHN0cmluZyA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ0pzb25BcGlNb2RlbENvbmZpZycsIG1vZGVsVHlwZSkudHlwZTtcbiAgICByZXR1cm4gdGhpcy5pbnRlcm5hbFN0b3JlW3R5cGVdID8gdGhpcy5pbnRlcm5hbFN0b3JlW3R5cGVdW2lkXSBhcyBUIDogbnVsbDtcbiAgfVxuXG4gIHB1YmxpYyBwZWVrQWxsPFQgZXh0ZW5kcyBKc29uQXBpTW9kZWw+KG1vZGVsVHlwZTogTW9kZWxUeXBlPFQ+KTogQXJyYXk8VD4ge1xuICAgIGNvbnN0IHR5cGUgPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdKc29uQXBpTW9kZWxDb25maWcnLCBtb2RlbFR5cGUpLnR5cGU7XG4gICAgY29uc3QgdHlwZVN0b3JlID0gdGhpcy5pbnRlcm5hbFN0b3JlW3R5cGVdO1xuICAgIHJldHVybiB0eXBlU3RvcmUgPyBPYmplY3Qua2V5cyh0eXBlU3RvcmUpLm1hcCgoa2V5KSA9PiB0eXBlU3RvcmVba2V5XSBhcyBUKSA6IFtdO1xuICB9XG5cbiAgcHVibGljIGRlc2VyaWFsaXplTW9kZWw8VCBleHRlbmRzIEpzb25BcGlNb2RlbD4obW9kZWxUeXBlOiBNb2RlbFR5cGU8VD4sIGRhdGE6IGFueSkge1xuICAgIGRhdGEuYXR0cmlidXRlcyA9IHRoaXMudHJhbnNmb3JtU2VyaWFsaXplZE5hbWVzVG9Qcm9wZXJ0eU5hbWVzKG1vZGVsVHlwZSwgZGF0YS5hdHRyaWJ1dGVzKTtcbiAgICByZXR1cm4gbmV3IG1vZGVsVHlwZSh0aGlzLCBkYXRhKTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRUb1N0b3JlKG1vZGVsT3JNb2RlbHM6IEpzb25BcGlNb2RlbCB8IEpzb25BcGlNb2RlbFtdKTogdm9pZCB7XG4gICAgY29uc3QgbW9kZWxzID0gQXJyYXkuaXNBcnJheShtb2RlbE9yTW9kZWxzKSA/IG1vZGVsT3JNb2RlbHMgOiBbbW9kZWxPck1vZGVsc107XG4gICAgY29uc3QgdHlwZTogc3RyaW5nID0gbW9kZWxzWzBdLm1vZGVsQ29uZmlnLnR5cGU7XG4gICAgbGV0IHR5cGVTdG9yZSA9IHRoaXMuaW50ZXJuYWxTdG9yZVt0eXBlXTtcblxuICAgIGlmICghdHlwZVN0b3JlKSB7XG4gICAgICB0eXBlU3RvcmUgPSB0aGlzLmludGVybmFsU3RvcmVbdHlwZV0gPSB7fTtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IG1vZGVsIG9mIG1vZGVscykge1xuICAgICAgdHlwZVN0b3JlW21vZGVsLmlkXSA9IG1vZGVsO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB0cmFuc2Zvcm1TZXJpYWxpemVkTmFtZXNUb1Byb3BlcnR5TmFtZXM8VCBleHRlbmRzIEpzb25BcGlNb2RlbD4obW9kZWxUeXBlOiBNb2RlbFR5cGU8VD4sIGF0dHJpYnV0ZXM6IGFueSkge1xuICAgIGNvbnN0IHNlcmlhbGl6ZWROYW1lVG9Qcm9wZXJ0eU5hbWUgPSB0aGlzLmdldE1vZGVsUHJvcGVydHlOYW1lcyhtb2RlbFR5cGUucHJvdG90eXBlKTtcbiAgICBjb25zdCBwcm9wZXJ0aWVzOiBhbnkgPSB7fTtcblxuICAgIE9iamVjdC5rZXlzKHNlcmlhbGl6ZWROYW1lVG9Qcm9wZXJ0eU5hbWUpLmZvckVhY2goKHNlcmlhbGl6ZWROYW1lKSA9PiB7XG4gICAgICBpZiAoYXR0cmlidXRlcykge1xuICAgICAgICBwcm9wZXJ0aWVzW3NlcmlhbGl6ZWROYW1lVG9Qcm9wZXJ0eU5hbWVbc2VyaWFsaXplZE5hbWVdXSA9IGF0dHJpYnV0ZXNbc2VyaWFsaXplZE5hbWVdO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb3BlcnRpZXM7XG4gIH1cblxuICBwcm90ZWN0ZWQgYnVpbGRVcmw8VCBleHRlbmRzIEpzb25BcGlNb2RlbD4oXG4gICAgbW9kZWxUeXBlOiBNb2RlbFR5cGU8VD4sXG4gICAgcGFyYW1zPzogYW55LFxuICAgIGlkPzogc3RyaW5nLFxuICAgIGN1c3RvbVVybD86IHN0cmluZ1xuICApOiBzdHJpbmcge1xuICAgIC8vIFRPRE86IHVzZSBIdHRwUGFyYW1zIGluc3RlYWQgb2YgYXBwZW5kaW5nIGEgc3RyaW5nIHRvIHRoZSB1cmxcbiAgICBjb25zdCBxdWVyeVBhcmFtczogc3RyaW5nID0gdGhpcy50b1F1ZXJ5U3RyaW5nKHBhcmFtcyk7XG5cbiAgICBpZiAoY3VzdG9tVXJsKSB7XG4gICAgICByZXR1cm4gcXVlcnlQYXJhbXMgPyBgJHtjdXN0b21Vcmx9PyR7cXVlcnlQYXJhbXN9YCA6IGN1c3RvbVVybDtcbiAgICB9XG5cbiAgICBjb25zdCBtb2RlbENvbmZpZzogTW9kZWxDb25maWcgPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdKc29uQXBpTW9kZWxDb25maWcnLCBtb2RlbFR5cGUpO1xuXG4gICAgY29uc3QgYmFzZVVybCA9IG1vZGVsQ29uZmlnLmJhc2VVcmwgfHwgdGhpcy5kYXRhc3RvcmVDb25maWcuYmFzZVVybDtcbiAgICBjb25zdCBhcGlWZXJzaW9uID0gbW9kZWxDb25maWcuYXBpVmVyc2lvbiB8fCB0aGlzLmRhdGFzdG9yZUNvbmZpZy5hcGlWZXJzaW9uO1xuICAgIGNvbnN0IG1vZGVsRW5kcG9pbnRVcmw6IHN0cmluZyA9IG1vZGVsQ29uZmlnLm1vZGVsRW5kcG9pbnRVcmwgfHwgbW9kZWxDb25maWcudHlwZTtcblxuICAgIGNvbnN0IHVybDogc3RyaW5nID0gW2Jhc2VVcmwsIGFwaVZlcnNpb24sIG1vZGVsRW5kcG9pbnRVcmwsIGlkXS5maWx0ZXIoKHgpID0+IHgpLmpvaW4oJy8nKTtcblxuICAgIHJldHVybiBxdWVyeVBhcmFtcyA/IGAke3VybH0/JHtxdWVyeVBhcmFtc31gIDogdXJsO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldFJlbGF0aW9uc2hpcHMoZGF0YTogYW55KTogYW55IHtcbiAgICBsZXQgcmVsYXRpb25zaGlwczogYW55O1xuXG4gICAgY29uc3QgYmVsb25nc1RvTWV0YWRhdGE6IGFueVtdID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnQmVsb25nc1RvJywgZGF0YSkgfHwgW107XG4gICAgY29uc3QgaGFzTWFueU1ldGFkYXRhOiBhbnlbXSA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ0hhc01hbnknLCBkYXRhKSB8fCBbXTtcblxuICAgIGZvciAoY29uc3Qga2V5IGluIGRhdGEpIHtcbiAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgaWYgKGRhdGFba2V5XSBpbnN0YW5jZW9mIEpzb25BcGlNb2RlbCkge1xuICAgICAgICAgIHJlbGF0aW9uc2hpcHMgPSByZWxhdGlvbnNoaXBzIHx8IHt9O1xuXG4gICAgICAgICAgaWYgKGRhdGFba2V5XS5pZCkge1xuICAgICAgICAgICAgY29uc3QgZW50aXR5ID0gYmVsb25nc1RvTWV0YWRhdGEuZmluZCgoaXQ6IGFueSkgPT4gaXQucHJvcGVydHlOYW1lID09PSBrZXkpO1xuICAgICAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwS2V5ID0gZW50aXR5LnJlbGF0aW9uc2hpcDtcbiAgICAgICAgICAgIHJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwS2V5XSA9IHtcbiAgICAgICAgICAgICAgZGF0YTogdGhpcy5idWlsZFNpbmdsZVJlbGF0aW9uc2hpcERhdGEoZGF0YVtrZXldKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZGF0YVtrZXldIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICBjb25zdCBlbnRpdHkgPSBoYXNNYW55TWV0YWRhdGEuZmluZCgoaXQ6IGFueSkgPT4gaXQucHJvcGVydHlOYW1lID09PSBrZXkpO1xuICAgICAgICAgIGlmIChlbnRpdHkgJiYgdGhpcy5pc1ZhbGlkVG9NYW55UmVsYXRpb24oZGF0YVtrZXldKSkge1xuICAgICAgICAgICAgcmVsYXRpb25zaGlwcyA9IHJlbGF0aW9uc2hpcHMgfHwge307XG5cbiAgICAgICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcEtleSA9IGVudGl0eS5yZWxhdGlvbnNoaXA7XG4gICAgICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBEYXRhID0gZGF0YVtrZXldXG4gICAgICAgICAgICAgIC5maWx0ZXIoKG1vZGVsOiBKc29uQXBpTW9kZWwpID0+IG1vZGVsLmlkKVxuICAgICAgICAgICAgICAubWFwKChtb2RlbDogSnNvbkFwaU1vZGVsKSA9PiB0aGlzLmJ1aWxkU2luZ2xlUmVsYXRpb25zaGlwRGF0YShtb2RlbCkpO1xuXG4gICAgICAgICAgICByZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcEtleV0gPSB7XG4gICAgICAgICAgICAgIGRhdGE6IHJlbGF0aW9uc2hpcERhdGFcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlbGF0aW9uc2hpcHM7XG4gIH1cblxuICBwcm90ZWN0ZWQgaXNWYWxpZFRvTWFueVJlbGF0aW9uKG9iamVjdHM6IEFycmF5PGFueT4pOiBib29sZWFuIHtcbiAgICBpZiAoIW9iamVjdHMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgY29uc3QgaXNKc29uQXBpTW9kZWwgPSBvYmplY3RzLmV2ZXJ5KChpdGVtKSA9PiBpdGVtIGluc3RhbmNlb2YgSnNvbkFwaU1vZGVsKTtcbiAgICBpZiAoIWlzSnNvbkFwaU1vZGVsKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IHR5cGVzID0gb2JqZWN0cy5tYXAoKGl0ZW06IEpzb25BcGlNb2RlbCkgPT4gaXRlbS5tb2RlbENvbmZpZy5tb2RlbEVuZHBvaW50VXJsIHx8IGl0ZW0ubW9kZWxDb25maWcudHlwZSk7XG4gICAgcmV0dXJuIHR5cGVzXG4gICAgICAuZmlsdGVyKCh0eXBlOiBzdHJpbmcsIGluZGV4OiBudW1iZXIsIHNlbGY6IHN0cmluZ1tdKSA9PiBzZWxmLmluZGV4T2YodHlwZSkgPT09IGluZGV4KVxuICAgICAgLmxlbmd0aCA9PT0gMTtcbiAgfVxuXG4gIHByb3RlY3RlZCBidWlsZFNpbmdsZVJlbGF0aW9uc2hpcERhdGEobW9kZWw6IEpzb25BcGlNb2RlbCk6IGFueSB7XG4gICAgY29uc3QgcmVsYXRpb25zaGlwVHlwZTogc3RyaW5nID0gbW9kZWwubW9kZWxDb25maWcudHlwZTtcbiAgICBjb25zdCByZWxhdGlvblNoaXBEYXRhOiB7IHR5cGU6IHN0cmluZywgaWQ/OiBzdHJpbmcsIGF0dHJpYnV0ZXM/OiBhbnkgfSA9IHt0eXBlOiByZWxhdGlvbnNoaXBUeXBlfTtcblxuICAgIGlmIChtb2RlbC5pZCkge1xuICAgICAgcmVsYXRpb25TaGlwRGF0YS5pZCA9IG1vZGVsLmlkO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBhdHRyaWJ1dGVzTWV0YWRhdGE6IGFueSA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ0F0dHJpYnV0ZScsIG1vZGVsKTtcbiAgICAgIHJlbGF0aW9uU2hpcERhdGEuYXR0cmlidXRlcyA9IHRoaXMuZ2V0RGlydHlBdHRyaWJ1dGVzKGF0dHJpYnV0ZXNNZXRhZGF0YSwgbW9kZWwpO1xuICAgIH1cblxuICAgIHJldHVybiByZWxhdGlvblNoaXBEYXRhO1xuICB9XG5cbiAgcHJvdGVjdGVkIGV4dHJhY3RRdWVyeURhdGE8VCBleHRlbmRzIEpzb25BcGlNb2RlbD4oXG4gICAgcmVzcG9uc2U6IEh0dHBSZXNwb25zZTxvYmplY3Q+LFxuICAgIG1vZGVsVHlwZTogTW9kZWxUeXBlPFQ+LFxuICAgIHdpdGhNZXRhID0gZmFsc2VcbiAgKTogQXJyYXk8VD4gfCBKc29uQXBpUXVlcnlEYXRhPFQ+IHtcbiAgICBjb25zdCBib2R5OiBhbnkgPSByZXNwb25zZS5ib2R5O1xuICAgIGNvbnN0IG1vZGVsczogVFtdID0gW107XG5cbiAgICBib2R5LmRhdGEuZm9yRWFjaCgoZGF0YTogYW55KSA9PiB7XG4gICAgICBsZXQgdHlwZSA9IHRoaXMuZGF0YXN0b3JlQ29uZmlnLm1vZGVsc1tkYXRhLnR5cGVdO1xuICAgICAgdHlwZSA9IHR5cGUgPyB0eXBlIDogbW9kZWxUeXBlO1xuICAgICAgY29uc3QgbW9kZWw6IFQgPSB0aGlzLmRlc2VyaWFsaXplTW9kZWwodHlwZSwgZGF0YSk7XG4gICAgICB0aGlzLmFkZFRvU3RvcmUobW9kZWwpO1xuXG4gICAgICBpZiAoYm9keS5pbmNsdWRlZCkge1xuICAgICAgICBtb2RlbC5zeW5jUmVsYXRpb25zaGlwcyhkYXRhLCBib2R5LmluY2x1ZGVkLmNvbmNhdChkYXRhKSk7XG4gICAgICAgIHRoaXMuYWRkVG9TdG9yZShtb2RlbCk7XG4gICAgICB9XG5cbiAgICAgIG1vZGVscy5wdXNoKG1vZGVsKTtcbiAgICB9KTtcblxuICAgIGlmICh3aXRoTWV0YSAmJiB3aXRoTWV0YSA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuIG5ldyBKc29uQXBpUXVlcnlEYXRhKG1vZGVscywgdGhpcy5wYXJzZU1ldGEoYm9keSwgbW9kZWxUeXBlKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1vZGVscztcbiAgfVxuXG4gIHByb3RlY3RlZCBleHRyYWN0UmVjb3JkRGF0YTxUIGV4dGVuZHMgSnNvbkFwaU1vZGVsPihcbiAgICByZXM6IEh0dHBSZXNwb25zZTxvYmplY3Q+LFxuICAgIG1vZGVsVHlwZTogTW9kZWxUeXBlPFQ+LFxuICAgIG1vZGVsPzogVFxuICApOiBUIHtcbiAgICBjb25zdCBib2R5OiBhbnkgPSByZXMuYm9keTtcbiAgICAvLyBFcnJvciBpbiBBbmd1bGFyIDwgNS4yLjQgKHNlZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8yMDc0NClcbiAgICAvLyBudWxsIGlzIGNvbnZlcnRlZCB0byAnbnVsbCcsIHNvIHRoaXMgaXMgdGVtcG9yYXJ5IG5lZWRlZCB0byBtYWtlIHRlc3RjYXNlIHBvc3NpYmxlXG4gICAgLy8gKGFuZCB0byBhdm9pZCBhIGRlY3JlYXNlIG9mIHRoZSBjb3ZlcmFnZSlcbiAgICBpZiAoIWJvZHkgfHwgYm9keSA9PT0gJ251bGwnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIGJvZHkgaW4gcmVzcG9uc2UnKTtcbiAgICB9XG5cbiAgICBpZiAoIWJvZHkuZGF0YSkge1xuICAgICAgaWYgKHJlcy5zdGF0dXMgPT09IDIwMSB8fCAhbW9kZWwpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdleHBlY3RlZCBkYXRhIGluIHJlc3BvbnNlJyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbW9kZWw7XG4gICAgfVxuXG4gICAgaWYgKG1vZGVsKSB7XG4gICAgICBtb2RlbC5tb2RlbEluaXRpYWxpemF0aW9uID0gdHJ1ZTtcbiAgICAgIG1vZGVsLmlkID0gYm9keS5kYXRhLmlkO1xuICAgICAgT2JqZWN0LmFzc2lnbihtb2RlbCwgYm9keS5kYXRhLmF0dHJpYnV0ZXMpO1xuICAgICAgbW9kZWwubW9kZWxJbml0aWFsaXphdGlvbiA9IGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IGRlc2VyaWFsaXplZE1vZGVsID0gbW9kZWwgfHwgdGhpcy5kZXNlcmlhbGl6ZU1vZGVsKG1vZGVsVHlwZSwgYm9keS5kYXRhKTtcbiAgICB0aGlzLmFkZFRvU3RvcmUoZGVzZXJpYWxpemVkTW9kZWwpO1xuICAgIGlmIChib2R5LmluY2x1ZGVkKSB7XG4gICAgICBkZXNlcmlhbGl6ZWRNb2RlbC5zeW5jUmVsYXRpb25zaGlwcyhib2R5LmRhdGEsIGJvZHkuaW5jbHVkZWQpO1xuICAgICAgdGhpcy5hZGRUb1N0b3JlKGRlc2VyaWFsaXplZE1vZGVsKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGVzZXJpYWxpemVkTW9kZWw7XG4gIH1cblxuICBwcm90ZWN0ZWQgaGFuZGxlRXJyb3IoZXJyb3I6IGFueSk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgaWYgKFxuICAgICAgZXJyb3IgaW5zdGFuY2VvZiBIdHRwRXJyb3JSZXNwb25zZSAmJlxuICAgICAgZXJyb3IuZXJyb3IgaW5zdGFuY2VvZiBPYmplY3QgJiZcbiAgICAgIGVycm9yLmVycm9yLmVycm9ycyAmJlxuICAgICAgZXJyb3IuZXJyb3IuZXJyb3JzIGluc3RhbmNlb2YgQXJyYXlcbiAgICApIHtcbiAgICAgIGNvbnN0IGVycm9yczogRXJyb3JSZXNwb25zZSA9IG5ldyBFcnJvclJlc3BvbnNlKGVycm9yLmVycm9yLmVycm9ycyk7XG4gICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnJvcnMpO1xuICAgIH1cblxuICAgIHJldHVybiB0aHJvd0Vycm9yKGVycm9yKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBwYXJzZU1ldGEoYm9keTogYW55LCBtb2RlbFR5cGU6IE1vZGVsVHlwZTxKc29uQXBpTW9kZWw+KTogYW55IHtcbiAgICBjb25zdCBtZXRhTW9kZWw6IGFueSA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ0pzb25BcGlNb2RlbENvbmZpZycsIG1vZGVsVHlwZSkubWV0YTtcbiAgICByZXR1cm4gbmV3IG1ldGFNb2RlbChib2R5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZCB1c2UgYnVpbGRIdHRwSGVhZGVycyBtZXRob2QgdG8gYnVpbGQgcmVxdWVzdCBoZWFkZXJzXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0T3B0aW9ucyhjdXN0b21IZWFkZXJzPzogSHR0cEhlYWRlcnMpOiBhbnkge1xuICAgIHJldHVybiB7XG4gICAgICBoZWFkZXJzOiB0aGlzLmJ1aWxkSHR0cEhlYWRlcnMoY3VzdG9tSGVhZGVycyksXG4gICAgfTtcbiAgfVxuXG4gIHByb3RlY3RlZCBidWlsZEh0dHBIZWFkZXJzKGN1c3RvbUhlYWRlcnM/OiBIdHRwSGVhZGVycyk6IEh0dHBIZWFkZXJzIHtcbiAgICBsZXQgcmVxdWVzdEhlYWRlcnM6IEh0dHBIZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKHtcbiAgICAgIEFjY2VwdDogJ2FwcGxpY2F0aW9uL3ZuZC5hcGkranNvbicsXG4gICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3ZuZC5hcGkranNvbidcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLmdsb2JhbEhlYWRlcnMpIHtcbiAgICAgIHRoaXMuZ2xvYmFsSGVhZGVycy5rZXlzKCkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmdsb2JhbEhlYWRlcnMuaGFzKGtleSkpIHtcbiAgICAgICAgICByZXF1ZXN0SGVhZGVycyA9IHJlcXVlc3RIZWFkZXJzLnNldChrZXksIHRoaXMuZ2xvYmFsSGVhZGVycy5nZXQoa2V5KSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChjdXN0b21IZWFkZXJzKSB7XG4gICAgICBjdXN0b21IZWFkZXJzLmtleXMoKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgaWYgKGN1c3RvbUhlYWRlcnMuaGFzKGtleSkpIHtcbiAgICAgICAgICByZXF1ZXN0SGVhZGVycyA9IHJlcXVlc3RIZWFkZXJzLnNldChrZXksIGN1c3RvbUhlYWRlcnMuZ2V0KGtleSkpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVxdWVzdEhlYWRlcnM7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVzZXRNZXRhZGF0YUF0dHJpYnV0ZXM8VCBleHRlbmRzIEpzb25BcGlNb2RlbD4ocmVzOiBULCBhdHRyaWJ1dGVzTWV0YWRhdGE6IGFueSwgbW9kZWxUeXBlOiBNb2RlbFR5cGU8VD4pIHtcbiAgICBmb3IgKGNvbnN0IHByb3BlcnR5TmFtZSBpbiBhdHRyaWJ1dGVzTWV0YWRhdGEpIHtcbiAgICAgIGlmIChhdHRyaWJ1dGVzTWV0YWRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSkge1xuICAgICAgICBjb25zdCBtZXRhZGF0YTogYW55ID0gYXR0cmlidXRlc01ldGFkYXRhW3Byb3BlcnR5TmFtZV07XG5cbiAgICAgICAgaWYgKG1ldGFkYXRhLmhhc0RpcnR5QXR0cmlidXRlcykge1xuICAgICAgICAgIG1ldGFkYXRhLmhhc0RpcnR5QXR0cmlidXRlcyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHJlc1tBdHRyaWJ1dGVNZXRhZGF0YUluZGV4XSA9IGF0dHJpYnV0ZXNNZXRhZGF0YTtcbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgcHJvdGVjdGVkIHVwZGF0ZVJlbGF0aW9uc2hpcHM8VCBleHRlbmRzIEpzb25BcGlNb2RlbD4obW9kZWw6IFQsIHJlbGF0aW9uc2hpcHM6IGFueSk6IFQge1xuICAgIGNvbnN0IG1vZGVsc1R5cGVzOiBhbnkgPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdKc29uQXBpRGF0YXN0b3JlQ29uZmlnJywgdGhpcy5jb25zdHJ1Y3RvcikubW9kZWxzO1xuXG4gICAgZm9yIChjb25zdCByZWxhdGlvbnNoaXAgaW4gcmVsYXRpb25zaGlwcykge1xuICAgICAgaWYgKHJlbGF0aW9uc2hpcHMuaGFzT3duUHJvcGVydHkocmVsYXRpb25zaGlwKSAmJiBtb2RlbC5oYXNPd25Qcm9wZXJ0eShyZWxhdGlvbnNoaXApKSB7XG4gICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcE1vZGVsOiBKc29uQXBpTW9kZWwgPSBtb2RlbFtyZWxhdGlvbnNoaXBdO1xuICAgICAgICBjb25zdCBoYXNNYW55OiBhbnlbXSA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ0hhc01hbnknLCByZWxhdGlvbnNoaXBNb2RlbCk7XG4gICAgICAgIGNvbnN0IHByb3BlcnR5SGFzTWFueTogYW55ID0gZmluZChoYXNNYW55LCAocHJvcGVydHkpID0+IHtcbiAgICAgICAgICByZXR1cm4gbW9kZWxzVHlwZXNbcHJvcGVydHkucmVsYXRpb25zaGlwXSA9PT0gbW9kZWwuY29uc3RydWN0b3I7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChwcm9wZXJ0eUhhc01hbnkpIHtcbiAgICAgICAgICByZWxhdGlvbnNoaXBNb2RlbFtwcm9wZXJ0eUhhc01hbnkucHJvcGVydHlOYW1lXSA9IHJlbGF0aW9uc2hpcE1vZGVsW3Byb3BlcnR5SGFzTWFueS5wcm9wZXJ0eU5hbWVdIHx8IFtdO1xuXG4gICAgICAgICAgY29uc3QgaW5kZXhPZk1vZGVsID0gcmVsYXRpb25zaGlwTW9kZWxbcHJvcGVydHlIYXNNYW55LnByb3BlcnR5TmFtZV0uaW5kZXhPZihtb2RlbCk7XG5cbiAgICAgICAgICBpZiAoaW5kZXhPZk1vZGVsID09PSAtMSkge1xuICAgICAgICAgICAgcmVsYXRpb25zaGlwTW9kZWxbcHJvcGVydHlIYXNNYW55LnByb3BlcnR5TmFtZV0ucHVzaChtb2RlbCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlbGF0aW9uc2hpcE1vZGVsW3Byb3BlcnR5SGFzTWFueS5wcm9wZXJ0eU5hbWVdW2luZGV4T2ZNb2RlbF0gPSBtb2RlbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbW9kZWw7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0TW9kZWxQcm9wZXJ0eU5hbWVzKG1vZGVsOiBKc29uQXBpTW9kZWwpIHtcbiAgICByZXR1cm4gUmVmbGVjdC5nZXRNZXRhZGF0YSgnQXR0cmlidXRlTWFwcGluZycsIG1vZGVsKSB8fCBbXTtcbiAgfVxuXG4gIHByaXZhdGUgYnVpbGRSZXF1ZXN0T3B0aW9ucyhjdXN0b21PcHRpb25zOiBhbnkgPSB7fSk6IG9iamVjdCB7XG4gICAgY29uc3QgaHR0cEhlYWRlcnM6IEh0dHBIZWFkZXJzID0gdGhpcy5idWlsZEh0dHBIZWFkZXJzKGN1c3RvbU9wdGlvbnMuaGVhZGVycyk7XG5cbiAgICBjb25zdCByZXF1ZXN0T3B0aW9uczogb2JqZWN0ID0gT2JqZWN0LmFzc2lnbihjdXN0b21PcHRpb25zLCB7XG4gICAgICBoZWFkZXJzOiBodHRwSGVhZGVyc1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24odGhpcy5nbG9iYWxSZXF1ZXN0T3B0aW9ucywgcmVxdWVzdE9wdGlvbnMpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdG9RdWVyeVN0cmluZyhwYXJhbXM6IGFueSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHFzLnN0cmluZ2lmeShwYXJhbXMsIHthcnJheUZvcm1hdDogJ2JyYWNrZXRzJ30pO1xuICB9XG59XG4iXX0=