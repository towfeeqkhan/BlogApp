import ImageKit from "@imagekit/nodejs";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

export const getPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  const query = {};

  const cat = req.query.cat;
  const author = req.query.author;
  const searchQuery = req.query.search;
  const sortQuery = req.query.sort;
  const featured = req.query.featured;

  if (cat) {
    query.category = cat;
  }

  if (searchQuery) {
    query.title = { $regex: searchQuery, $options: "i" };
  }

  if (author) {
    const user = await User.findOne({ username: author }).select("_id");

    if (!user) {
      return res.status(200).json({ posts: [], hasMore: false });
    }

    query.user = user._id;
  }

  if (featured) {
    query.isFeatured = true;
  }

  let sortObj = { createdAt: -1 };

  if (sortQuery) {
    switch (sortQuery) {
      case "newest":
        sortObj = { createdAt: -1 };
        break;
      case "oldest":
        sortObj = { createdAt: 1 };
        break;
      case "popular":
        sortObj = { visit: -1 };
        break;
      case "trending":
        sortObj = { visit: -1 };
        query.visit = { $gt: 0 };
        break;
      default:
        break;
    }
  }

  const posts = await Post.find(query)
    .populate("user", "username")
    .sort(sortObj)
    .limit(limit)
    .skip((page - 1) * limit);

  const totalPosts = await Post.countDocuments(query);
  const hasMore = page * limit < totalPosts;

  res.status(200).json({ posts, hasMore });
};

export const getPost = async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug }).populate(
    "user",
    "username clerkUserId",
  );
  res.json(post);
};

export const createPost = async (req, res) => {
  const { userId } = req.auth();

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await User.findOne({ clerkUserId: userId });

  let baseSlug = req.body.title.trim().toLowerCase().replace(/\s+/g, "-");

  let slug = baseSlug;

  let existingPost = await Post.findOne({ slug });

  let counter = 2;

  while (existingPost) {
    slug = `${baseSlug}-${counter}`;
    existingPost = await Post.findOne({ slug });
    counter++;
  }

  const post = req.body;
  const newPost = await Post.create({ user: user._id, slug, ...post });
  res.status(201).json(newPost);
};

export const deletePost = async (req, res) => {
  const { userId } = req.auth();

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await User.findOne({ clerkUserId: userId });

  const deletedPost = await Post.findOneAndDelete({
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

const imagekit = new ImageKit({
  urlEndpoint: process.env.IK_URL_ENDPOINT,
  publicKey: process.env.IK_PUBLIC_KEY,
  privateKey: process.env.IK_PRIVATE_KEY,
});

export const uploadAuth = async (req, res) => {
  const result = imagekit.helper.getAuthenticationParameters();
  res.send(result);
};

export const featurePost = async (req, res) => {
  const { userId } = req.auth();

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const postId = req.body.postId;

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  // Optional: Check if the user is the owner or an admin
  // For now, assuming any authenticated user (or owner) can feature it?
  // User asked for "Feature", usually it's "Feature this post" on their own blog?
  // Let's assume user must be the owner to feature it?
  // Or maybe it's "Feature on the homepage"? That's usually admin only.
  // Given the context of "fullstack-projects", let's assume owner can feature it.

  const user = await User.findOne({ clerkUserId: userId });

  if (user._id.toString() !== post.user.toString()) {
    // If not owner, checking typical "admin" logic or just strict owner?
    // Let's stick to owner for now.
    return res.status(403).json({ message: "You are not authorized!" });
  }

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    {
      isFeatured: !post.isFeatured,
    },
    { new: true },
  );

  res.status(200).json(updatedPost);
};
