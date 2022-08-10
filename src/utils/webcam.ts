import Webcam from "react-webcam";

export const isWebcamReady = (
  webcamInstance: Webcam | null
): webcamInstance is Webcam =>
  webcamInstance !== null &&
  webcamInstance.video !== null &&
  webcamInstance.video.readyState === 4;
