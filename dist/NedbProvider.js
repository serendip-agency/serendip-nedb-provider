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
const NedbCollection_1 = require("./NedbCollection");
const nedb = require("nedb");
const path_1 = require("path");
class NedbProvider {
    collection(collectionName, track) {
        return __awaiter(this, void 0, void 0, function* () {
            collectionName = collectionName.trim();
            // if (this.db.collection.indexOf(collectionName) === -1) {
            //   await this.db.createCollection(collectionName);
            //   this.mongoCollections.push(collectionName);
            //   if (Server.opts.logging == "info")
            //     console.log(`☑ collection ${collectionName} created .`);
            // }
            let db;
            if (this.folderPath)
                db = new nedb({
                    filename: path_1.join(this.folderPath, `${collectionName}.nedb`),
                    autoload: true
                });
            else
                db = new nedb();
            db.collectionName = collectionName;
            return new NedbCollection_1.NedbCollection(db, track, this);
        });
    }
    initiate(options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.folderPath = options.folderPath;
            try {
                // Creating mongoDB client from mongoUrl
                this.changes = yield this.collection("EntityChanges", false);
            }
            catch (error) {
                throw new Error("\n\nUnable to connect to MongoDb. Error details: \n" + error.message);
            }
        });
    }
}
exports.NedbProvider = NedbProvider;
