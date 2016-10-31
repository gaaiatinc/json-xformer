/**
 * @author  Ali Ismael, ali@gaaiat.com
 */
"use strict";

let xformMapUtils = require("./xform_map_utils");

let customFormatterMap = {};

let jsonPointer = require("jsonpointer");
let _startsWith = require("lodash/startsWith");

/**
 *
 * @param  {[type]} customFormatterName [description]
 * @param  {[type]} customFormatter     [description]
 * @return {[type]}                     [description]
 */
function registerCustomTransformer(customFormatterName, customFormatter) {
    customFormatterMap[customFormatterName] = customFormatter;
}

/**
 *
 * @param  {[type]} sourceObject [description]
 * @param  {[type]} targetObject [description]
 * @param  {[type]} xformMap     [description]
 * @return {[type]}              [description]
 */
function mapToJson(sourceObject, targetObject, xformMap) {
    xformMapUtils.validateTransformMap(xformMap, customFormatterMap);

    if (typeof sourceObject !== "object") {
        throw new Error("sourceObject must be of type 'object'");
    }

    if (typeof targetObject !== "object") {
        throw new Error("targetObject must be of type 'object'");
    }

    xformMap.transformMap.map((item) => {
        let sourceElement = jsonPointer.get(sourceObject, item.sourcePtr);
        let targetElement;

        if (!sourceElement) {
            if (typeof item.defaultValue === "undefined") {
                throw new Error("Source object missing element at path: " + item.sourcePtr + " and no defaultValue specified in the tranformer map!");
            } else {
                sourceElement = item.defaultValue;
            }
        }

        if (item.customFormatter) {
            let customFormatterName = item.customFormatter.trim();

            targetElement = customFormatterMap[customFormatterName](xformMap.sourceLocale, xformMap.targetLocale, item.sourcePtr, item.targetPtr, sourceElement);
        } else {
            targetElement = sourceElement;
        }

        jsonPointer.set(targetObject, item.targetPtr, targetElement);
    });

}

/**
 *
 * @param  {[type]} sourceObject          [description]
 * @param  {[type]} targetPropertiesArray [description]
 * @param  {[type]} xformMap              [description]
 * @return {[type]}                       [description]
 */
function mapToProperties(sourceObject, targetPropertiesArray, xformMap) {
    xformMapUtils.validateTransformMap(xformMap, customFormatterMap);

    if (typeof sourceObject !== "object") {
        throw new Error("sourceObject must be of type 'object'");
    }

    if (!Array.isArray(targetPropertiesArray)) {
        throw new Error("targetPropertiesArray must be of type 'Array'");
    }

    xformMap.transformMap.map((item) => {
        let sourceElement = jsonPointer.get(sourceObject, item.sourcePtr);
        let targetElement;

        if (!sourceElement) {
            if (typeof item.defaultValue === "undefined") {
                throw new Error("Source object missing element at path: " + item.sourcePtr + " and no defaultValue specified in the tranformer map!");
            } else {
                sourceElement = item.defaultValue;
            }
        }

        if (item.customFormatter) {
            let customFormatterName = item.customFormatter.trim();

            targetElement = customFormatterMap[customFormatterName](xformMap.sourceLocale, xformMap.targetLocale, item.sourcePtr, item.targetPtr, sourceElement);
        } else {
            targetElement = sourceElement;
        }

        let propertyValue = JSON.stringify(targetElement);
        let propertyKey = item.targetPtr;

        if (_startsWith(propertyKey, "/")) {
            propertyKey = propertyKey.substring(1);
        }
        propertyKey = propertyKey.replace(/\//gi, ".");

        targetPropertiesArray.push(propertyKey + " = " + propertyValue);
    });

}

/**
 *
 * @param  {[type]} sourcePropertiesArray [description]
 * @param  {[type]} targetObject          [description]
 * @param  {[type]} xformMap              [description]
 * @return {[type]}                       [description]
 */
function mapFromProperties(sourcePropertiesArray, targetObject, xformMap) {
    xformMapUtils.validateTransformMap(xformMap, customFormatterMap);

    if (typeof targetObject !== "object") {
        throw new Error("targetObject must be of type 'object'");
    }

    if (!Array.isArray(sourcePropertiesArray)) {
        throw new Error("sourcePropertiesArray must be of type 'Array'");
    }

    let propRegEx = /(.+?)=(.*)/;

    sourcePropertiesArray.map((item) => {
        if (typeof item !== "string") {
            throw new Error("sourcePropertiesArray must be an array of strings");
        }

        let matches = item.match(propRegEx);

        if (matches) {
            // console.log("matches[1]", matches[1], ", matches[2]", matches[2]);
            let sourceElement = JSON.parse(matches[2].trim());
            let targetPtr = "/" + matches[1].trim();
            targetPtr = targetPtr.replace(/\./gi, "/");

            // console.log("targetPtr", targetPtr, ", sourceElement", sourceElement);
            jsonPointer.set(targetObject, targetPtr, sourceElement);
        }
    });
}

module.exports = {
    mapToJson,
    mapToProperties,
    mapFromProperties,
    registerCustomTransformer
};
