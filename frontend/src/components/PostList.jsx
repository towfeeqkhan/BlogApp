import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import PostListItem from "./PostListItem";

const fetchPosts = async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`);
  return res.data;
};

function PostList() {
  const { _data } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  // console.log(data);
  return (
    <div className="flex flex-col gap-12 mb-8">
      <PostListItem />
      <PostListItem />
      <PostListItem />
    </div>
  );
}

export default PostList;
