import { join } from "path";

import * as assert from "assert";
import { NedbProvider } from "../NedbProvider";
import {
  DbCollectionInterface,
  DbProviderInterface
} from "serendip-business-model";
import * as fs from "fs-extra";

describe("insert scenarios", () => {
  let provider: DbProviderInterface;
  let collection: DbCollectionInterface<any>;
  beforeEach(done => {
    (async () => {
      // runs before each test in this block

      const folderPath = join(__dirname, "..", ".db_test");
      fs.emptyDirSync(folderPath);

      provider = new NedbProvider();
      await provider.initiate({
        folderPath
      });
      collection = await provider.collection("test");

      done();
    })();
  });
  it("should do simple insert", done => {
    (async () => {
      const model = await collection.insertOne({
        hello: true
      });
      assert.equal(model.hello, true);
    })()
      .then(done)
      .catch(done);
  });

  it("should do insert with custom id", done => {
    (async () => {
      const model = await collection.insertOne({
        _id: "5c6e96da5da4508426d6f25b",
        hello: true
      });

      assert.equal(model.hello, true);
      assert.equal(model._id, "5c6e96da5da4508426d6f25b");
    })()
      .then(done)
      .catch(done);
  });
});
