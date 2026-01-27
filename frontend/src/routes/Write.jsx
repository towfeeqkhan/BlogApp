import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const authenticator = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/posts/upload-auth`,
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`,
      );
    }

    const data = await response.json();
    const { signature, expire, token, publicKey } = data;
    return { signature, expire, token, publicKey };
  } catch (error) {
    console.error("Authentication error:", error);
    throw new Error("Authentication request failed");
  }
};

function Write() {
  const [value, setValue] = useState("");
  const [cover, setCover] = useState("");

  const [uploadProgress, setUploadProgress] = useState(0);
  const { isLoaded, isSignedIn } = useUser();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async (newPost) => {
      const token = await getToken();
      return axios.post(`${import.meta.env.VITE_API_URL}/posts`, newPost, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },

    onSuccess: (res) => {
      toast.success("Post created successfully!");
      navigate(`/${res.data.slug}`);
    },
  });

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate("/login");
    }
  }, [isLoaded, isSignedIn, navigate]);

  const reactQuillRef = useRef(null);

  const uploadToImageKit = async (file, onProgress) => {
    try {
      const { signature, expire, token } = await authenticator();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      formData.append("publicKey", import.meta.env.VITE_IK_PUBLIC_KEY);
      formData.append("signature", signature);
      formData.append("expire", expire);
      formData.append("token", token);
      formData.append("useUniqueFileName", "true");
      formData.append("folder", "/blogApp");

      const response = await axios.post(
        "https://upload.imagekit.io/api/v1/files/upload",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            if (onProgress) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total,
              );
              onProgress(percentCompleted);
            }
          },
        },
      );
      return response.data;
    } catch (err) {
      console.error("Upload Error:", err);
      throw err;
    }
  };

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        try {
          const res = await uploadToImageKit(file, setUploadProgress);
          const quill = reactQuillRef.current.getEditor();
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, "image", res.url);
          setUploadProgress(0); // Reset progress after success
        } catch (err) {
          toast.error("Image upload failed");
          console.log(err);
          setUploadProgress(0);
        }
      }
    };
  }, []);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    [imageHandler],
  );

  if (!isLoaded) {
    return <div className="">Loading...</div>;
  }

  if (!isSignedIn) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      img: cover.filePath || "",
      title: formData.get("title"),
      category: formData.get("category"),
      desc: formData.get("desc"),
      content: value,
    };

    mutate(data);
  };

  return (
    <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col gap-6">
      <h1 className="text-cl font-light">Create a New Post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1 mb-6">
        {/* <button className="w-max p-2 shadow-md rounded-xl text-sm text-gray-500 bg-white">
          Add a cover image
        </button> */}
        {/* <button className="w-max p-2 shadow-md rounded-xl text-sm text-gray-500 bg-white">
          Add a cover image
        </button> */}
        <label className="cursor-pointer">
          <div className="w-max p-2 shadow-md rounded-xl text-sm text-gray-500 bg-white dark:bg-gray-800 dark:text-gray-200">
            Add a cover image
          </div>
          <input
            type="file"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;

              setUploadProgress(1); // Show progress immediately
              setCover({ url: URL.createObjectURL(file) }); // Immediate preview

              try {
                const res = await uploadToImageKit(file);
                setCover(res);
                setUploadProgress(100);
                toast.success("Image uploaded successfully!");
              } catch (err) {
                console.error(err);
                toast.error("Image upload failed!");
                setCover("");
                setUploadProgress(0);
              }
            }}
          />
        </label>
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="">{"Uploading " + uploadProgress + "%"}</div>
        )}
        {cover && (
          <img
            src={cover.url}
            alt=""
            className="w-48 h-48 object-cover rounded-md"
          />
        )}
        <input
          className="text-4xl font-semibold bg-transparent outline-none"
          type="text"
          placeholder="Story Title"
          name="title"
        />
        <div className="flex items-center gap-4">
          <label htmlFor="" className="text-sm">
            Choose a category:
          </label>
          <select
            name="category"
            id=""
            className="p-2 rounded-xl bg-white shadow-md dark:bg-gray-800 dark:text-white"
          >
            <option value="general">General</option>
            <option value="web-design">Web Design</option>
            <option value="development">Development</option>
            <option value="databases">Databases</option>
            <option value="seo">Search Engines</option>
            <option value="marketing">Marketing</option>
          </select>
        </div>
        <textarea
          className="p-4 rounded-xl bg-white shadow-md dark:bg-gray-800 dark:text-white"
          name="desc"
          placeholder="A Short Description"
        />
        <ReactQuill
          theme="snow"
          className="flex-1 rounded-xl bg-white shadow-md min-h-75 dark:bg-gray-800 dark:text-white"
          value={value}
          onChange={setValue}
          ref={reactQuillRef}
          modules={modules}
        />
        <button
          disabled={isPending}
          className="bg-blue-800 text-white font-medium rounded-xl mt-4 p-2 w-36 cursor-pointer disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {isPending ? "Publishing..." : "Publish"}
        </button>
        {isError && <span className="text-red-500">{error.message}</span>}
      </form>
    </div>
  );
}

export default Write;
