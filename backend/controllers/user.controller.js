import User from "../models/user.model.js";

export const getUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  res.status(200).json(user);
};

export const savePost = async (req, res) => {
  const clerkUserId = req.auth().userId;
  const postId = req.body.postId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const user = await User.findOne({ clerkUserId });

  const isSaved = user.savedPosts.some((p) => p === postId);

  if (!isSaved) {
    await User.findByIdAndUpdate(user._id, {
      $push: { savedPosts: postId },
    });
  } else {
    await User.findByIdAndUpdate(user._id, {
      $pull: { savedPosts: postId },
    });
  }

  res.status(200).json(isSaved ? "Post un-saved" : "Post saved");
};
