# json-xformer

This is a _node.js_ utility module implementing the following transformations:

1. json to json
2. json to properties
3. properties to json

## Installation

```javascript
npm install --save json-xformer
```

## Usage

The _json-xformer_ API comprises the following methods:

### registerCustomTransformer(customFormatterName, customFormatter)

This method is used to register a user-defined custom formatting function (customFormatter), which will be referenced in the transformation descriptors by the specified name (customFormatterName). The custom formatter must have the following signature:

```javascript
  function customFormatterExample(sourceLocale, targetLocale, sourcePtr, targetPtr, sourceElement) {...}
```

The custom formatter will be invoked by the json-xformer as dictated by the transofrmation descriptors on the source element, and the value returned by the custom formatter will be assigned to the target object.

### Map Json To Json

```javascript
mapToJson(sourceObject, targetObject, xformMap)
```

This method is used to map one json object into another by applying the _xformMap_ onto the _sourceObject_, and filling the results of the transformation into the _targetObject_

### Map Json To Properties

```javascript
mapToProperties(sourceObject, targetPropertiesArray, xformMap)
```

This method is used to map one json object into an array of property strings (key = value) by applying the _xformMap_ onto the _sourceObject_, and filling the results of the transformation into the _targetPropertiesArray_

### Map Properties To Json

```javascript
mapFromProperties(sourcePropertiesArray, targetObject, xformMap)
```

This method is used to map an array of properties in the argument _sourcePropertiesArray_ into a json object specified by the argument _targetObject_

### Tranformation Schema

The _json-xformer_ module is driven by a transformation map, which is a json object in itself. The transformation map is governed by the following json schema:

```javascript
{
    "id": "http://www.gaaiat.com/json-xformer#",
    "$schema": "http://json-schema.org/draft-04/schema#",
    "description": "JSON Transformer Schema",
    "title": "JSON Transformer Schema",
    "type": "object",
    "required": ["transformMap"],
    "properties": {
        "sourceLocale": {
            "type": "string",
            "default": "en-US"
        },
        "targetLocale": {
            "type": "string",
            "default": "en-US"
        },
        "transformMap": {
            "type": "array",
            "minItems": 1,
            "items": {
                "type": "object",
                "properties": {
                    "sourcePtr": {
                        "type": "string"
                    },
                    "targetPtr": {
                        "type": "string"
                    },
                    "customFormatter": {
                        "type": "string"
                    },
                    "defaultValue": {
                        "oneOf": [{
                            "type": ["array", "object", "boolean", "integer", "number", "string"]
                        }]
                    }
                },
                "requiredProperties": ["sourcePtr", "targetPtr"]
            }
        }
    }
}
```

The transformation schema includes the following elements:

1. The source locale: An optional locale used with the source object, default value is "en-US"
2. The target locale: An optional locale used with the target object, default value is "en-US"
3. An array of transformation descriptors (required, minimum 1 element in the array): Each descriptor has the following elements:

  - sourcePtr (required): A json pointer string identifying the source element in the source object
  - targetPtr (required): A json pointer string identifying the target element in the target object
  - customFomatter (optional): The name of a function that will be used to customize the formatting of the source element prior to being set into the target objet
  - defaultValue (optional): The default value to use for the source element if it is missing in the source object. If the source element is missing in the source object and there is no default value specified in the transformation descriptor, the transformation will throw an exception

## Example

Here is an example transformation map:

```javascript
{
    "sourceLocale": "en-US",
    "targetLocale": "en-US",

    "transformMap": [{
        "sourcePtr": "/name",
        "targetPtr": "/target/name",
        "customFormatter": "formatName"
    }, {
        "sourcePtr": "/age",
        "targetPtr": "/target/age",
        "customFormatter": "formatAge",
        "defaultValue": "23"
    }, {
        "sourcePtr": "/jobLocations/1",
        "targetPtr": "/jobSiteOne/-"
    }]
}
```

The custom formatters _fromatName_ and _formatAge_, used in the example map above, are defined and registered with the _json-xformer_ as follows:

```javascript
function formatName(sourceLocale, targetLocale, sourcePtr, targetPtr, sourceElement) {
            return sourceElement.toString().toUpperCase();
}
xformer.registerCustomTransformer("formatName", formatName);

function formatAge(sourceLocale, targetLocale, sourcePtr, targetPtr, sourceElement) {
    return Number(sourceElement);
}
xformer.registerCustomTransformer("formatAge", formatAge);
```

When the example transformation map above is used with the following source object:

```javascript
{
    "name": "tester",
    "lastName": "one",
    "jobLocations": [
        "site 1",
        "site 2",
        "site 3"
    ]
}
```

it will produce the following results:

**Json To Json Result**

```javascript
{
    target: {
        name: 'TESTER',
        age: 23
    },
    jobSiteOne: ['site 2']
}
```

**Json To Properties Result**

```javascript
[  
    'target.name = "TESTER"',
    'target.age = 23',
    'jobSiteOne.- = "site 2"'
]
```

Please use the test cases in the test folder for further guidance and examples.
