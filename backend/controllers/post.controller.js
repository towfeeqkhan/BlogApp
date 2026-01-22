import Post from "../models/post.model.js";
import User from "../models/user.model.js";

export const getPosts = async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
};

export const getPost = async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug });
  res.json(post);
};

export const createPost = async (req, res) => {
  const { userId } = req.auth();

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await User.findOne({ clerkUserId: userId });

  const post = req.body;
  const newPost = await Post.create({ user: user._id, ...post });
  res.status(201).json(newPost);
};

export const deletePost = async (req, res) => {
  const { userId } = req.auth();

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await User.findOne({ clerkUserId: userId });

  const deletedPost = await Post.findByIdAndDelete({
    _id: req.params.id,
    user: user._id,
  });

  if (!deletedPost) {
    return res
      .status(403)
      .json({ message: "You're not authorized to delete this post" });
  }

  res.json({ message: "Post deleted successfully" });
};
