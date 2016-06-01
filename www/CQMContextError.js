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

/**
 *  CQMContextError.
 *  An error code assigned by an implementation when an error has occurred
 * @constructor
 */
var CQMContextError = function(err) {
    this.code = (err !== undefined ? err : null);
};
// This needs to be synchronized with native implementations if there are changes
CQMContextError.UNKNOWN_ERROR = 0;
CQMContextError.INVALID_ARGUMENT_ERROR = 10;
CQMContextError.ENTITY_IMAGE_TYPE_NOT_SUPPORTED_FOR_ENTITY_ERROR = 11;
CQMContextError.NETWORK_ERROR = 20;
CQMContextError.NETWORK_RATE_LIMIT_EXCEEDED_ERROR = 21;
CQMContextError.ENTITY_IMAGE_ENTITY_NOT_FOUND_ERROR = 40;
CQMContextError.ENTITY_IMAGE_NETWORK_ERROR = 41;
CQMContextError.ENTITY_IMAGE_NOT_FOUND_ERROR = 50;
CQMContextError.ENTITY_NOT_FOUND_ERROR = 61;
CQMContextError.WRONG_ENTITY_TYPE_ERROR = 71;
CQMContextError.NO_MORE_ENTITY_PAGES_ERROR = 72;
CQMContextError.ENTITY_PAGE_OUT_OF_DATE_ERROR = 73;

module.exports = CQMContextError;

