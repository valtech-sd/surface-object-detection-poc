import { DetectedObject } from "@tensorflow-models/coco-ssd";

export const drawDetections = (
  detections: DetectedObject[],
  canvasContext: CanvasRenderingContext2D | null
) => {
  if (canvasContext) {
    detections.forEach((detection) => {
      const [x, y, width, height] = detection.bbox;
      const text = detection.class;

      const color = "black";
      canvasContext.strokeStyle = color;
      canvasContext.font = "18px Arial";
      canvasContext.fillStyle = color;

      canvasContext.beginPath();
      canvasContext.fillText(text, x, y);
      canvasContext.rect(x, y, width, height);
      canvasContext.stroke();
    });
  }
};
