import Post from "../models/post.model.js";

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    console.log("Error fetching posts", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    res.json(post);
  } catch (error) {
    console.log("Error fetching post", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

export const createPost = async (req, res) => {
  try {
    const post = req.body;
    const newPost = await Post.create(post);
    res.status(201).json(newPost);
  } catch (error) {
    console.log("Error creating post", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

export const deletePost = async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("Error deleting post", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};
