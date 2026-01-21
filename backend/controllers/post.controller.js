import Post from "../models/post.model.js";

export const getPosts = async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
};

export const getPost = async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug });
  res.json(post);
};

export const createPost = async (req, res) => {
  const post = req.body;
  const newPost = await Post.create(post);
  res.status(201).json(newPost);
};

export const deletePost = async (req, res) => {
  const deletedPost = await Post.findByIdAndDelete(req.params.id);
  res.json({ message: "Post deleted successfully" });
};
