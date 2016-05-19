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
 * This represents the an entity.
 * @constructor
 */
var Entity = function(newEntity) {
    this.id = newEntity.id;
	this.type = newEntity.type;
	this.metadata = newEntity.metadata;
	this.rootPath = newEntity.rootPath;
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

module.exports = new CQMContext();

