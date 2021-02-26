import routes from "../routes";
import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";

//home
export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ _id: -1 });
    res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    console.log(error);
    res.render("home", { pageTitle: "Home", videos: [] });
  }
};

//search
export const search = async (req, res) => {
  const {
    query: { term },
  } = req;
  let videos = [];
  try {
    videos = await Video.find({
      title: { $regex: term, $options: "i" },
    });
  } catch (error) {
    console.log(error);
  }
  res.render("search", { pageTitle: "Search", term, videos });
};

//upload
export const getUpload = (req, res) =>
  res.render("upload", { pageTitle: "Upload" });
export const postUpload = async (req, res) => {
  const {
    body: { title, description },
    file: { location },
  } = req;
  const newVideo = await Video.create({
    fileUrl: location,
    title,
    description,
    creator: req.user._id,
  });
  const user = await User.findById(req.user._id);
  await user.videos.push(newVideo.id);
  await user.save();
  res.redirect(routes.videoDetail(newVideo.id));
};

//videoDetail
export const videoDetail = async (req, res) => {
  const {
    params: { id },
  } = req;
  //url로부터 정보를 가져오는 유일한 방법: req.params :id
  try {
    const video = await Video.findById(id)
      .populate("creator")
      .populate({
        path: "comments",
        populate: { path: "creator", select: "name" },
      });
    res.render("videoDetail", { pageTitle: video.title, video });
  } catch (error) {
    console.log(error);
    res.redirect(routes.home);
  }
};

//editVideo
export const getEditVideo = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    if (video.creator != req.user._id) {
      throw Error();
    }
    res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
  } catch (error) {
    console.log(error);
    res.redirect(routes.home);
  }
};

export const postEditVideo = async (req, res) => {
  const {
    params: { id },
    body: { title, description },
  } = req;
  try {
    await Video.findOneAndUpdate({ _id: id }, { title, description });
    res.redirect(routes.videoDetail(id));
  } catch (error) {
    console.log(error);
    res.redirect(routes.home);
  }
};

//deleteVideo
export const deleteVideo = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    if (video.creator != req.user._id) {
      throw Error();
    }
    await Video.findOneAndDelete({ _id: id });
    const creator = await User.findById(video.creator);
    await creator.videos.splice(creator.videos.indexOf(video.id), 1);
    await creator.save();
  } catch (error) {
    console.log(error);
  }
  res.redirect(routes.home);
};

//register Video View
export const postRegisterView = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    video.views += 1;
    video.save();
    res.status(200);
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

//Add Commnet
export const postAddComment = async (req, res) => {
  const {
    params: { id },
    body: { comment },
    user,
  } = req;
  try {
    const video = await Video.findById(id);
    const newComment = await Comment.create({
      text: comment,
      creator: user._id,
    });
    video.comments.push(newComment.id);
    video.save();
    res.status(200);
    res.send({ creator: req.user.name, id: newComment.id });
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

//delete Comment
export const postDeleteComment = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    await Comment.remove({ _id: id });
    res.status(200);
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};
