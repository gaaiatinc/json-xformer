/**
 * @author Ali Ismael, ali@gaaiat.com
 */
"use strict";

let Ajv = require("ajv");
let xformSchema = require("./transformer_schema.json");
let ajv = new Ajv({
    useDefaults: true,
    coerceTypes: true
});

ajv.addSchema(xformSchema, "json-xformer");

let jsonPointer = require("jsonpointer");

/**
 *
 * @param  {[type]} xformMap           [description]
 * @param  {[type]} customFormatterMap [description]
 * @return {[type]}                    [description]
 */
function validateTransformMap(xformMap, customFormatterMap) {
    if (!ajv.validate("json-xformer", xformMap)) {
        throw new Error(ajv.errorsText());
    }

    //verify that the customFormatters are registered:
    //
    xformMap.transformMap.map((item, idx, allArr) => {
        try {
            jsonPointer.get({}, item.sourcePtr);
            jsonPointer.get({}, item.targetPtr);
        } catch (err) {
            throw new Error("Invalid source/target json pointer specified in json-xformer map - map entry index:" + idx);
        }

        if (item.customFormatter) {
            let customFormatterName = item.customFormatter.trim();

            if (typeof customFormatterMap[customFormatterName] !== "function") {
                throw new Error("Custom tranformer function " + customFormatterName + " is not registered");
            }
        }
    });
    return true;
}

/**
 *
 * @type {Object}
 */
module.exports = {
    validateTransformMap
};
