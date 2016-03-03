import assert from "assert";
import {name as appName} from "./sass-bootstrap4.js";

describe("sass-bootstrap4", () => {
  it("should export its name", () => {
    assert.strictEqual(appName, "sass-bootstrap4");
  });
});
