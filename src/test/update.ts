import { join } from "path";

import * as assert from "assert";
import { NedbProvider } from "../NedbProvider";
import {
  DbCollectionInterface,
  DbProviderInterface
} from "serendip-business-model";
import * as _ from "underscore";
import * as fs from "fs-extra";

describe("update scenarios", () => {
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
    })()
      .then(done)
      .catch(done);
  });

  it("should return updated", done => {
    (async () => {
      let model = await collection.insertOne({
        hello: true
      });

      assert.equal(model.hello, true);

      model = await collection.updateOne(_.extend(model, { hello: false }));

      assert.equal(model.hello, false);

      done();
    })()
      .then(done)
      .catch(done);
  });
});
