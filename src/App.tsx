import { useCallback, useEffect, useRef } from "react";

import { ObjectDetection, load } from "@tensorflow-models/coco-ssd";
import * as tensorFlow from "@tensorflow/tfjs";
import Webcam from "react-webcam";

import { drawDetections } from "./utilities";

import "./App.css";

const isWebcamReady = (
  webcamInstance: Webcam | null
): webcamInstance is Webcam =>
  webcamInstance !== null &&
  webcamInstance.video !== null &&
  webcamInstance.video.readyState === 4;

const videoConstraints = {
  width: window.innerWidth,
  height: window.innerHeight,
  facingMode: "user",
};

function App() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const detect = useCallback(async (model: ObjectDetection) => {
    // Check data is available
    if (isWebcamReady(webcamRef.current) && canvasRef.current) {
      const { video } = webcamRef.current;

      if (video) {
        const { videoWidth, videoHeight } = video;

        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        const detections = await model.detect(video, undefined, 0.8);

        const canvasContext = canvasRef.current.getContext("2d");
        drawDetections(detections, canvasContext);
      }
    }
  }, []);

  const loadModel = useCallback(async () => {
    const model = await load();
    detect(model);

    setInterval(() => {
      detect(model);
    }, 100);
  }, [detect]);

  useEffect(() => {
    tensorFlow.ready().then(loadModel);
  }, [loadModel]);

  return (
    <div className="app">
      <Webcam
        ref={webcamRef}
        muted
        imageSmoothing
        videoConstraints={videoConstraints}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
    </div>
  );
}

export default App;
