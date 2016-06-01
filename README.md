# aemm-plugin-context

This plugin defines a global `context` object, which provides access to entity information within a given context.
Although the object is in the global scope, it is not available until after the `deviceready` event.

    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        console.log(cq.mobile.context.type);
    }

## Installation

cordova plugin add aemm-plugin-context

## Context Properties

- context.type
- context.entity
- context.collection
- context.nextEntity
- context.previousEntity

## context.type

The `context.type` returns the type of the current context. The possible
types are `article`, `overlay`, or `card`.
:warning: card is not yet supported.

### Supported Platforms

- Android
- iOS
- Windows

### Quick Example

```javascript
var string = cq.mobile.context.type;
```

## context.entity

The `context.entity` returns an Entity object that contains information
about the entity in the current context.

### Supported Platforms

- Android
- iOS
- Windows

### Quick Example

```javascript
var currentEntity = cq.mobile.context.entity;
```

## context.collection

The `context.collection` returns an Entity object representing the collection 
for the current context. This property can be null if the current context is 
an orphaned context.

### Supported Platforms

- Android
- iOS
- Windows

### Quick Example

```javascript
var currentCollection = cq.mobile.context.collection
```

## context.nextEntity

The `context.nextEntity` returns an Entity object for the next available entity.

### Supported Platforms

- Android
- iOS
- Windows

### Quick Example

```javascript
var nextEntity = cq.mobile.context.nextEntity;
```

## context.previousEntity

The `context.previousEntity` returns an Entity object for previous available entity.

### Example

```javascript
var prevEntity = cq.mobile.context.previousEntity;
```

### Supported Platforms

- Android
- iOS
- Windows

## Context Methods
- context.getEntity(entityName, entityType, forceUpdate, successCallback, errorCallback)
- context.getEntitlementInfo(entityOrEntityList, successCallback, errorCallback)
 
## context.getEntity(entityName, entityType, forceUpdate, successCallback, errorCallback)

A method that returns an Entity object given the entityName and the entityType

| Parameter | Type | Description |
| --- | --- | ---|
| entityName | String | The name of the entity. This must match the name found on Content Portal |
| entityType | String | The type of entity. Must match values found in Entity.type |
| forceUpdate | BOOL | If 'true', always query the server for the latest version |
| successCallback | Function | The success callback |
| errorCallback | Function | The error callback |

### Supported Platforms

- Android
- iOS

## context.getEntitlementInfo(entityOrEntityList, successCallback, errorCallback)

A method that returns entitlement information for an entity of type collection, or an EntityList
object that contains collections. 
If a non collection Entity object is passed, then we will immediately return CQMContextError.WRONG_ENTITY_TYPE_ERROR. If an EntityList object is passed, only entitlementInfo for collection objects will be returned. If there are no collections, the returning array will be empty.

| Parameter | Type | Description |
| --- | --- | ---|
| entityOrEntityList | Entity or EntityList | The entity to obtain entitlement information for. Or the entityList that contains a list of entities to obtain entitlement information for. |
| successCallback | Function | The success callback |
| errorCallback | Function | The error callback |

### Supported Platforms

- Android
- iOS

## Entity Properties

- Entity.id
- Entity.type
- Entity.metadata

## Entity Methods

- getThumbnailImage(width, height, successCallback, errorCallback)
- getBackgroundImage(width, height, successCallback, errorCallback)
- getSocialSharingImage(width, height, successCallback, errorCallback)
- getChildren(successCallback, errorCallback)

## Entity.id

The `Entity.id` the ID of the entity.

### Supported Platforms

- Android
- iOS
- Windows

### Quick Example

```javascript
var string = cq.mobile.context.entity.id;
```

## Entity.type

The `Entity.type` returns the type of the entity. 
Current supported types are: 'article', 'collection', and 'banner'

### Supported Platforms

- Android
- iOS
- Windows

### Quick Example

```javascript
var string = cq.mobile.context.entity.type;
```

## Entity.rootPath

The `Entity.rootPath` can be used as a reference to build a path to a resource contained within an article.

### Supported Platforms

- Android
- iOS

### Windows Quirks
On Windows, article content is not accessible through filesystem traversal. You can access them as absolute urls like this (or through XHR): 
```html
<img src="/anyAsset.png" />
```

### Quick Example

```javascript
var string = cq.mobile.context.entity.rootPath;
```


## Entity.metadata

The `Entity.metadata` returns a metadata object with properties describing the entity.

### Supported Platforms

- Android
- iOS
- Windows

### Quick Example

```javascript
var metadata = cq.mobile.context.entity.metadata;
```

## Metadata Properties

| Name | Type | Support for Entity |
| --- | --- | --- |
| department         | String           | Article, Collection, Banner |
| importance         | String           | Article, Collection, Banner |
| keywords           | Array of Strings | Article, Collection, Banner |
| title              | String           | Article, Collection, Banner |
| shortTitle         | String           | Article, Collection, Banner |
| shortAbstract      | String           | Article, Collection, Banner |
| availabilityDate   | String           | Article, Collection, Banner |
| socialShareUrl     | String           | Article, Collection, Banner |
| category           | String           | Article, Collection, Banner |
| abstract           | String           | Article, Collection, Banner |
| published          | String           | Article, Collection, Banner |
| modified           | String           | Article, Collection, Banner |
| created            | String           | Article, Collection, Banner |
| version            | String           | Article, Collection, Banner |
| entityName         | String           | Article, Collection, Banner |
| url                | String           | Article, Collection, Banner |
| author             | String           | Article |
| authorUrl          | String           | Article |
| articleText        | String           | Article |
| accessState        | String           | Article |
| hideFromBrowsePage | Boolean          | Article |
| isAd               | Boolean          | Article |
| adType             | String           | Article |
| adCategory         | String           | Article |
| advertiser         | String           | Article |
| isIssue            | Boolean          | Collection |
| allowDownload      | Boolean          | Collection |
| openTo             | String           | Collection |
| readingPosition    | String           | Collection |
| lateralNavigation  | Boolean          | Collection |
| productIds         | Array of Strings | Collection |
| tapAction          | String           | Banner |

### Supported Platforms

- Android
- iOS
- Windows

### Quick Example

```javascript
var string = cq.mobile.context.entity.metadata.department;
```

## getThumbnailImage(width, height, successCallback, errorCallback)

A method that returns file url to the thumbnail image as argument of the 
success callback. Supported on the Article and Collection entities.

| Parameter | Type | Description |
| --- | --- | ---|
| width | Number | The requested width |
| height | Number | The requested height |
| successCallback | Function | The success callback |
| errorCallback | Function | The error callback |

### Supported Platforms

- Android
- iOS
- Windows

## getBackgroundImage(width, height, successCallback, errorCallback)

A method that returns file url to the background image as argument of the
success callback. Supported on the Collection entity.

| Parameter | Type | Description |
| --- | --- | ---|
| width | Number | The requested width |
| height | Number | The requested height |
| successCallback | Function | The success callback |
| errorCallback | Function | The error callback |

### Supported Platforms

- Android
- iOS
- Windows

## getSocialSharingImage(width, height, successCallback, errorCallback)

A method that returns file url to the social sharing image as argument of the 
success callback. Supported on the Collection Entity.

| Parameter | Type | Description |
| --- | --- | ---|
| width | Number | The requested width |
| height | Number | The requested height |
| successCallback | Function | The success callback |
| errorCallback | Function | The error callback |

### Supported Platforms

- Android
- iOS
- Windows

## getChildren(successCallback, errorCallback)

A method that returns an EntityList object that will contain all the 
non-restricted child entities for this collection that are in the cache. 
If none exist, we will attempt to download the first server page of children
Supported on the Collection Entity.

| Parameter | Type | Description |
| --- | --- | ---|
| successCallback | Function | The success callback |
| errorCallback | Function | The error callback |

### Supported Platforms

- Android
- iOS

## EntityList Properties

- EntityList.entities
- EntityList.hasNextPage

## EntityList Methods

- getNextPage(successCallback, errorCallback)

## EntityList.entities
The EntityList.entities is an array that contains Entity objects.

### Supported Platforms
- Android
- iOS
 
## EntityList.hasNextPage
The EntityList.hasNextPage is a BOOL determines if there are sibling entities yet to be retrieved.

### Supported Platforms
- Android
- iOS

## getNextPage(successCallback, errorCallback)

A method that updates the EntityList object with additional Entity items. It also updates the 
hasNextPage property.

| Parameter | Type | Description |
| --- | --- | ---|
| successCallback | Function | The success callback |
| errorCallback | Function | The error callback |
