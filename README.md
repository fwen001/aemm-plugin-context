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

## Entity Properties

- Entity.id
- Entity.type
- Entity.metadata

## Entity Methods

- getThumbnailImage(width, height, successCallback, errorCallback)
- getBackgroundImage = function(width, height, successCallback, errorCallback)
- getSocialSharingImage = function(width, height, successCallback, errorCallback)

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
| department         | String           | Article, Collection |
| importance         | String           | Article, Collection |
| keywords           | Array of Strings | Article, Collection |
| title              | String           | Article, Collection |
| shortTitle         | String           | Article, Collection |
| shortAbstract      | String           | Article, Collection |
| availabilityDate   | String           | Article, Collection |
| socialShareUrl     | String           | Article, Collection |
| category           | String           | Article, Collection |
| abstract           | String           | Article, Collection |
| published          | String           | Article, Collection |
| modified           | String           | Article, Collection |
| created            | String           | Article, Collection |
| version            | String           | Article, Collection |
| entityName         | String           | Article, Collection |
| url                | String           | Article, Collection |
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

### Quick Example

```javascript

```

## getBackgroundImage = function(width, height, successCallback, errorCallback)

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

### Quick Example

```javascript

```

## getSocialSharingImage = function(width, height, successCallback, errorCallback)

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

### Quick Example

```javascript

```
