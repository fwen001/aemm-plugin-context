/*
*  Copyright 2016 Adobe Systems Incorporated. All rights reserved.
*  This file is licensed to you under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License. You may obtain a copy
*  of the License at http://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software distributed under
*  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
*  OF ANY KIND, either express or implied. See the License for the specific language
*  governing permissions and limitations under the License.
*
*/

var argscheck = require('cordova/argscheck'),
    channel = require('cordova/channel'),
    utils = require('cordova/utils'),
    exec = require('cordova/exec'),
    cordova = require('cordova'),
    CQMContextError = require('./cqmcontexterror');

channel.createSticky('onCordovaContextInfoReady');
channel.waitForInitialization('onCordovaContextInfoReady');

/**
 * Utility function to bind methods with a scope
 */
function bind(scope, fn) {
    return function () {
        fn.apply(scope, arguments);
    };
}

/**
 * This class represents the location of content on an article.
 * @property {number}  pageNumber         - The page number on which the content resides. Zero-based. If HTML, will always be zero.
 * @property {number}  totalPageCount     - The total number of pages for the article that the content belongs to. If HTML, will always be 1. 
 */
var ContentLocation = function(contentLocationInfo) {
    this.pageNumber = contentLocationInfo.pageNumber;
    this.totalPageCount = contentLocationInfo.totalPageCount;
};

/**
 * This represents an entity.
 * @constructor
 */
var Entity = function(newEntity) {
    this.id = newEntity.id;
    this.type = newEntity.type;
    this.metadata = newEntity.metadata;
    this.rootPath = newEntity.rootPath;
};

/**
 * Get children for this entity
 *
 * @param {Function} successCallback
 * @param {Function} errorCallback (OPTIONAL)
 */
Entity.prototype.getChildren = function(successCallback, errorCallback) {

    if (this.type != 'collection') {
        errorCallback && errorCallback(new CQMContextError(CQMContextError.WRONG_ENTITY_TYPE_ERROR));
        return;
    }
    
    var success = successCallback && function(rawEntityList) {
        var entityList = new EntityList(rawEntityList);
        successCallback(entityList);
    };

    var fail = errorCallback && function(code) {
        var ce = new CQMContextError(code);
        errorCallback(ce);
    };

    exec(success, fail, "CQMContext", "getChildren", [this.id, this.metadata.version, this.metadata.visibilityHash]);
};


/**
 * Get thumbnail image
 *
 * @param {Number} width The requested width. Must be > 0
 * @param {Number} height The requested height. Must be > 0
 * @param {Function} successCallback The function to call when the thumbnail image is available. Will return a file URL string.
 * @param {Function} errorCallback The function to call when there is an error getting the thumbnail image. (OPTIONAL)
 * @throws {TypeError} width, height must be numbers
 */
Entity.prototype.getThumbnailImage = function(width, height, successCallback, errorCallback) {
    this._getImage(width, height, "getThumbnailImage", successCallback, errorCallback);
};

/**
 * Get background image
 *
 * @param {Number} width The requested width. Must be > 0
 * @param {Number} height The requested height. Must be > 0
 * @param {Function} successCallback The function to call when the background image is available. Will return a file URL string.
 * @param {Function} errorCallback The function to call when there is an error getting the background image. (OPTIONAL)
 * @throws {TypeError} width, height must be numbers
 */
Entity.prototype.getBackgroundImage = function(width, height, successCallback, errorCallback) {
    this._getImage(width, height, "getBackgroundImage", successCallback, errorCallback);
};

/**
 * Get social sharing image
 *
 * @param {Number} width The requested width. Must be > 0
 * @param {Number} height The requested height. Must be > 0
 * @param {Function} successCallback The function to call when the social sharing image is available. Will return a file URL string.
 * @param {Function} errorCallback The function to call when there is an error getting the social sharing image. (OPTIONAL)
 * @throws {TypeError} width, height must be numbers
 */
Entity.prototype.getSocialSharingImage = function(width, height, successCallback, errorCallback) {
    this._getImage(width, height, "getSocialSharingImage", successCallback, errorCallback);
};

Entity.prototype._getImage = function(width, height, endpoint, successCallback, errorCallback) {
    argscheck.checkArgs('nnsfF', 'Entity.'+endpoint, arguments);
    if (width < 1 || height < 1) {
        errorCallback && errorCallback(new CQMContextError(CQMContextError.INVALID_ARGUMENT_ERROR));
        return;
    }
    var fail = errorCallback && function(code) {
        var ce = new CQMContextError(code);
        errorCallback(ce);
    };
    exec(successCallback, fail, "CQMContext", endpoint, [width, height, this.id, this.type]);
};

/**
 * This represents an entity list.
 * @constructor
 */
var EntityList = function(entityList) {
    this.entities = this._processRawEntities(entityList.entities);
    this.hasNextPage = entityList.hasNextPage;
    this._parentId = entityList.parentId;
    this._parentVersion = entityList.parentVersion;
    this._parentVisibilityHash = entityList.parentVisibilityHash;
};

/**
 * Get next server page of entities for this EntityList
 *
 * @param {Function} successCallback The function to call when the next server page of entities is available.
 * @param {Function} errorCallback The function to call when there is an error getting the next server page of entities. (OPTIONAL)
 */
EntityList.prototype.getNextPage = function(successCallback, errorCallback) {
    argscheck.checkArgs('fF', 'EntityList.getNextPage', arguments);
    if (this.hasNextPage == false) {
        errorCallback && errorCallback(new CQMContextError(CQMContextError.NO_MORE_ENTITY_PAGES_ERROR));
        return;
    }
    var success = successCallback && function(entityList) {
        this.entities = this._processRawEntities(entityList.entities);
        this.hasNextPage = entityList.hasNextPage;
        successCallback(entityList);
    };

    var fail = errorCallback && function(code) {
        var ce = new CQMContextError(code);
        errorCallback(ce);
    };
    exec(bind(this, success), fail, "CQMContext", "getNextPage", [this._parentId, this._parentVersion, this._parentVisibilityHash]);
};

/**
 * Helper method to convert a list of json representation of entities into a list of Entity objects
 */
EntityList.prototype._processRawEntities = function(rawEntities) {
    var theEntities = [];
    for (var i = 0; i < rawEntities.length; i++) {
        theEntities.push(new Entity(rawEntities[i]));
    }
    return theEntities;
};


/**
 * This represents the current context and provides properties for the type of the current entity.
 * @constructor
 */
function CQMContext() {
    this.type = null;
    this.entity = null;
    this.collection = null;
    this.nextEntity = null;
    this.previousEntity = null;

    var me = this;

    channel.onCordovaReady.subscribe(function() {
        me.getInfo(function(info) {
            me.type = info.type;
            me.entity = new Entity(info.entity);
            me.collection = info.hasOwnProperty('collection') ? new Entity(info.collection) : null;
            me.nextEntity = info.hasOwnProperty('nextEntity') ? new Entity(info.nextEntity) : null;
            me.previousEntity = info.hasOwnProperty('previousEntity') ? new Entity(info.previousEntity) : null;

            channel.onCordovaContextInfoReady.fire();
        },function(e) {
            utils.alert("[ERROR] Error initializing Cordova: " + e);
        });
    });
}

/**
 * Get context info
 *
 * @param {Function} successCallback The function to call when the context data is available
 * @param {Function} errorCallback The function to call when there is an error getting the context data. (OPTIONAL)
 */
CQMContext.prototype.getInfo = function(successCallback, errorCallback) {
    exec(successCallback, errorCallback, "CQMContext", "getInfo", []);
};

/** 
 * Refresh context info
 */
CQMContext.prototype.refreshInfo = function(successCallback, errorCallback) {
    var me = this;
    me.getInfo(function(info) {
            me.type = info.type;
            me.entity = new Entity(info.entity);
            me.collection = info.hasOwnProperty('collection') ? new Entity(info.collection) : null;
            me.nextEntity = info.hasOwnProperty('nextEntity') ? new Entity(info.nextEntity) : null;
            me.previousEntity = info.hasOwnProperty('previousEntity') ? new Entity(info.previousEntity) : null;
            console.log("refreshInfo success...");
            successCallback();
        },function(e) {
            utils.alert("[ERROR] Error refreshInfo : " + e);
            errorCallback();
        });
};

/**
 * Get scroll position for current context
 *
 * @param {Function} successCallback The function to call with scroll position information. Will return ContentLocation object.
 * @param {Function} errorCallback The function to call when there is an error getting the content location data. (OPTIONAL)
 */
CQMContext.prototype.getContentLocation = function(successCallback, errorCallback) {
	argscheck.checkArgs('fF', 'CQMContext.getContentLocation', arguments);
	
	    var success = successCallback && function(rawContentLocation) {
        var contentLocation = new ContentLocation(rawContentLocation)
        successCallback(contentLocation);
    };
    exec(success, errorCallback, "CQMContext", "getContentLocation", []);
};

/**
 * Get entity by name
 *
 * @param {String} entityName The name of the entity to retrieve
 * @param {String} entityType The type of the entity to retrieve ('article' or 'collection' or 'banner')
 * @param {boolean} forceUpdate If false, will return with latest cached entity if any. 
                     If nothing is cached, will attempt to query server for entity with name and type.
                     If true, will attempt to query server for latest entity with name and type.
                     If update query fails, viewer will return the latest cached entity if available
 * @param {Function} successCallback The function to call when the entity data is available
 * @param {Function} errorCallback The function to call when there is an error getting the entity data. (OPTIONAL)
 * @throws {TypeError} entityName, entityType must be strings, forceUpdate must be boolean
 */
CQMContext.prototype.getEntity = function(entityName, entityType, forceUpdate, successCallback, errorCallback) {
    // Using * for boolean for now.
    argscheck.checkArgs('ss*fF', 'CQMContext.getEntity', arguments);

    // Check boolean separately
    if(typeof(forceUpdate) !== "boolean") {
        throw TypeError('Wrong type for parameter forceUpdate, expected boolean');
    }

    var entityNameRegex = /^[a-zA-Z0-9]{1}[a-zA-Z0-9|_|\-|.]{0,63}$/;

    if (entityNameRegex.test(entityName) == false) {
        throw TypeError('Names must be limited to 64 characters. The value must start and end with a letter or number and can also contain dots, dashes, and underscores');
    }

    var success = successCallback && function(rawEntity) {
        var entity = new Entity(rawEntity)
        successCallback(entity);
    };

    var fail = errorCallback && function(code) {
        var ce = new CQMContextError(code);
        errorCallback(ce);
    };
    exec(success, fail, "CQMContext", "getEntity", [entityName, entityType, forceUpdate]);
};

/**
 * Get entitlement information for an Entity (only supports Collection), or for all the collection in an EntityList.
 *
 * @param {Entity} or {EntityList} Entity we want to get entitlement info for or EntityList we want to get entitlement info for.
 * @param {Function} successCallback
 * @param {Function} errorCallback (OPTIONAL)
 */
CQMContext.prototype.getEntitlementInfo = function(entityOrEntityList, successCallback, errorCallback) {

    if (entityOrEntityList instanceof Entity) {

        this._getEntitlementInfo([[entityOrEntityList.type, entityOrEntityList.metadata.entityName]],
            successCallback, errorCallback);

    } else if (entityOrEntityList instanceof EntityList) {

        var entityNames = [];
        for (var i = 0; i < entityOrEntityList.entities.length; i++) {
            entityNames.push([entityOrEntityList.entities[i].type, entityOrEntityList.entities[i].metadata.entityName]);
        }

        this._getEntitlementInfo(entityNames, successCallback, errorCallback);

    } else {
        throw TypeError('Wrong type for parameter object, expected Entity or EntityList');
    }
};

CQMContext.prototype._getEntitlementInfo = function(entityNames, successCallback, errorCallback) {

    var fail = errorCallback && function(code) {
        var ce = new CQMContextError(code);
        errorCallback(ce);
    };

    exec(successCallback, fail, "CQMContext", "getEntitlementInfo", [entityNames]);
};

module.exports = new CQMContext();
