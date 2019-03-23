"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const assert = require("assert");
const NedbProvider_1 = require("../NedbProvider");
const _ = require("underscore");
const fs = require("fs-extra");
describe("update scenarios", () => {
    let provider;
    let collection;
    beforeEach(done => {
        (() => __awaiter(this, void 0, void 0, function* () {
            // runs before each test in this block
            const folderPath = path_1.join(__dirname, "..", ".db_test");
            fs.emptyDirSync(folderPath);
            provider = new NedbProvider_1.NedbProvider();
            yield provider.initiate({
                folderPath
            });
            collection = yield provider.collection("test");
        }))()
            .then(done)
            .catch(done);
    });
    it("should return updated", done => {
        (() => __awaiter(this, void 0, void 0, function* () {
            let model = yield collection.insertOne({
                hello: true
            });
            assert.equal(model.hello, true);
            model = yield collection.updateOne(_.extend(model, { hello: false }));
            assert.equal(model.hello, false);
            done();
        }))()
            .then(done)
            .catch(done);
    });
});
