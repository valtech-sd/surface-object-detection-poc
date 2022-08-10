import * as tensorFlow from "@tensorflow/tfjs";
import { load } from "@tensorflow-models/coco-ssd";

export async function loadCocoSSDModel() {
  await tensorFlow.ready();
  return load();
}
