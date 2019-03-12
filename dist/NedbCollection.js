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
const _ = require("underscore");
const bson_objectid_1 = require("bson-objectid");
const serendip_business_model_1 = require("serendip-business-model");
const deep = require("deep-diff");
class NedbCollection {
    constructor(collection, track, provider) {
        this.collection = collection;
        this.track = track;
        this.provider = provider;
        this.collectionName = this.collection.collectionName;
    }
    ensureIndex(fieldOrSpec, options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.collection.ensureIndex(_.extend(options, {
                fieldName: fieldOrSpec
            }));
        });
    }
    find(query, skip, limit) {
        if (query && query._id)
            query._id = new bson_objectid_1.default(query._id);
        if (skip)
            skip = parseInt(skip);
        if (limit)
            limit = parseInt(limit);
        return new Promise((resolve, reject) => {
            if (skip >= 0 && limit > 0)
                this.collection
                    .find(query)
                    .skip(skip)
                    .limit(limit)
                    .exec((err, results) => {
                    if (err)
                        return reject(err);
                    return resolve(results.map((p) => {
                        p._id = p._id.toString();
                        return p;
                    }));
                });
            else
                this.collection.find(query).exec((err, results) => {
                    if (err)
                        return reject(err);
                    return resolve(results.map((p) => {
                        p._id = p._id.toString();
                        return p;
                    }));
                });
        });
    }
    count(query) {
        return new Promise((resolve, reject) => {
            if (query && query._id) {
                query._id = new bson_objectid_1.default(query._id);
            }
            this.collection.count(query, (err, count) => {
                if (err)
                    return reject(err);
                resolve(count);
            });
        });
    }
    updateOne(model, userId) {
        return new Promise((resolve, reject) => {
            model["_id"] = new bson_objectid_1.default(model["_id"]);
            model["_vdate"] = Date.now();
            this.collection.update({ _id: model["_id"] }, { $set: model }, {
                upsert: true,
                returnUpdatedDocs: true
            }, (err, number, docs) => {
                if (err)
                    return reject(err);
                if (!docs || !docs[0])
                    return reject(new Error("noting updated"));
                resolve(docs[0]);
                if (this.track)
                    this.provider.changes.insertOne({
                        date: Date.now(),
                        model,
                        diff: deep.diff(docs[0], model),
                        type: serendip_business_model_1.EntityChangeType.Update,
                        userId: userId,
                        collection: this.collectionName,
                        entityId: model["_id"]
                    });
            });
        });
    }
    deleteOne(_id, userId) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            var model;
            var modelQuery = yield this.find({ _id: new bson_objectid_1.default(_id) });
            if (modelQuery && modelQuery[0])
                model = modelQuery[0];
            else
                return reject("not found");
            this.collection.remove({ _id: new bson_objectid_1.default(_id) }, err => {
                if (err)
                    return reject(err);
                if (this.track) {
                    this.collection.insert({
                        date: Date.now(),
                        diff: null,
                        type: serendip_business_model_1.EntityChangeType.Delete,
                        userId: userId,
                        collection: this.collectionName,
                        entityId: _id,
                        model: model
                    }, trackInsertErr => {
                        if (trackInsertErr)
                            console.error(`error in inserting change record when deleting ${_id} from ${this.collectionName}`, trackInsertErr);
                        resolve(model);
                    });
                }
            });
        }));
    }
    insertOne(model, userId) {
        model["_vdate"] = Date.now();
        return new Promise((resolve, reject) => {
            var objectId = new bson_objectid_1.default();
            if (model._id && typeof model._id == "string")
                model._id = new bson_objectid_1.default(model._id);
            if (!model._id)
                model._id = new bson_objectid_1.default();
            var doc = this.collection.insert(model, (err, result) => {
                if (err)
                    return reject(err);
                if (this.track)
                    this.provider.changes.insertOne({
                        date: Date.now(),
                        model: model,
                        diff: deep.diff({}, model),
                        type: serendip_business_model_1.EntityChangeType.Create,
                        userId: userId,
                        collection: this.collectionName,
                        entityId: model._id
                    });
                resolve(model);
            });
        });
    }
}
exports.NedbCollection = NedbCollection;
