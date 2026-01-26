import { useAuth, useUser } from "@clerk/clerk-react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Comment from "./Comment";

const fetchComments = async (postId) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/comments/${postId}`,
  );
  return res.data;
};

import { useNavigate } from "react-router";

import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

const Comments = ({ postId, postUserId }) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isPending, error, data } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
  });

  const mutation = useMutation({
    mutationFn: async (newComment) => {
      const token = await getToken();
      return axios.post(
        `${import.meta.env.VITE_API_URL}/comments/${postId}`,
        newComment,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    mutation.mutate({ desc: data.desc });
    e.target.reset();
  };

  return (
    <div className="flex flex-col gap-8 lg:w-3/5 mb-12">
      <h1 className="text-xl text-gray-500 underline">Comments</h1>
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-between gap-8 w-full"
      >
        <textarea
          name="desc"
          placeholder="Write a comment..."
          className="w-full p-4 rounded-xl"
        />
        <button className="bg-blue-800 px-4 py-3 text-white font-medium rounded-xl">
          Send
        </button>
      </form>
      {isPending ? (
        "Loading..."
      ) : error ? (
        "Something went wrong!"
      ) : (
        <>
          {mutation.isPending && (
            <Comment
              comment={{
                desc: `${mutation.variables.desc} (Sending...)`,
                createdAt: new Date(),
                user: {
                  img: user.imageUrl,
                  username: user.username,
                },
              }}
            />
          )}

          {data.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              postId={postId}
              postUserId={postUserId}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default Comments;
