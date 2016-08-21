/**
 * @author Ali Ismael, ali@gaaiat.com
 */

"use strict";

let Q = require("q");

let xformer = require("../lib");

/**
 *
 */
describe("Full test suite for the json-xformer module", function() {

    before(() => {
        return Q("before...");
    });

    after(() => {
        return Q("after...");
    });

    beforeEach(() => {
        return Q("beforeEach...");
    });

    afterEach(() => {
        return Q("afterEach...");
    });

    /**
     *
     */
    describe("json-xformer json to properties tests", () => {

        let testPropsArr = [];

        it("should map json to properties without error", () => {

            return Q.Promise((resolve, reject) => {

                let sourceObject1 = require("./source1.json");
                let testMap1 = require("./testMap1.json");

                function formatName(sourceLocale, targetLocale, sourcePtr, targetPtr, sourceElement) {
                    return sourceElement.toString().toUpperCase();
                }
                xformer.registerCustomTransformer("formatName", formatName);

                function formatAge(sourceLocale, targetLocale, sourcePtr, targetPtr, sourceElement) {
                    return Number(sourceElement);
                }
                xformer.registerCustomTransformer("formatAge", formatAge);

                xformer.mapToProperties(sourceObject1, testPropsArr, testMap1);

                console.log("\n\n>>> props: ", testPropsArr);

                if (testPropsArr.length === 3) {
                    return resolve();
                } else {
                    reject(new Error("json to properties mapping failed"));
                }
            });
        });

        it("should map properties to json without error", () => {

            return Q.Promise((resolve, reject) => {

                let sourceObject1 = require("./source1.json");
                let testMap1 = require("./testMap1.json");
                let targetObject = {};

                function formatName(sourceLocale, targetLocale, sourcePtr, targetPtr, sourceElement) {
                    return sourceElement.toString().toUpperCase();
                }
                xformer.registerCustomTransformer("formatName", formatName);

                function formatAge(sourceLocale, targetLocale, sourcePtr, targetPtr, sourceElement) {
                    return Number(sourceElement);
                }
                xformer.registerCustomTransformer("formatAge", formatAge);

                xformer.mapFromProperties(testPropsArr, targetObject, testMap1);

                console.log("\n\n>>>>>> targetObject: ", targetObject);

                if ((targetObject.target.name === "TESTER") &&
                    (typeof targetObject.target.age === "number")) {
                    return resolve();
                } else {
                    reject(new Error("json to json mapping failed"));
                }
            });
        });

    });

    describe("json-xformer json to json tests", () => {
        it("should map json to json without error", () => {

            return Q.Promise((resolve, reject) => {

                let sourceObject1 = require("./source1.json");
                let testMap1 = require("./testMap1.json");

                function formatName(sourceLocale, targetLocale, sourcePtr, targetPtr, sourceElement) {
                    return sourceElement.toString().toUpperCase();
                }
                xformer.registerCustomTransformer("formatName", formatName);

                function formatAge(sourceLocale, targetLocale, sourcePtr, targetPtr, sourceElement) {
                    return Number(sourceElement);
                }
                xformer.registerCustomTransformer("formatAge", formatAge);

                let targetObject = {};

                xformer.mapToJson(sourceObject1, targetObject, testMap1);

                // console.log("\n\n>>>> targetObject:", targetObject);

                if ((targetObject.target.name === "TESTER") &&
                    (typeof targetObject.target.age === "number")) {
                    return resolve();
                } else {
                    reject(new Error("json to json mapping failed"));
                }
            });

        });

    });
});
