import express from "express";
import routes from "../routes";
import { uploadVideo, onlyPrivate } from "../middlewares";
import {
  postUpload,
  getUpload,
  videoDetail,
  deleteVideo,
  getEditVideo,
  postEditVideo,
} from "../controllers/videoController";

const videoRouter = express.Router();

//upload
videoRouter.get(routes.upload, onlyPrivate, getUpload);
videoRouter.post(routes.upload, onlyPrivate, uploadVideo, postUpload);

//videoDetail
videoRouter.get(routes.videoDetail(), videoDetail);

//editVideo
videoRouter.get(routes.editVideo(), onlyPrivate, getEditVideo);
videoRouter.post(routes.editVideo(), onlyPrivate, postEditVideo);

//deleteVideo
videoRouter.get(routes.deleteVideo(), onlyPrivate, deleteVideo);

export default videoRouter;
