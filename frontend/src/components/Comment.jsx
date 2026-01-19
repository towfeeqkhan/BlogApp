import IKImage from "./IKImage";

function Comment() {
  return (
    <div className="p-4 bg-slate-50 rounded-xl mb-8">
      <div className="flex items-center gap-4">
        <IKImage
          src="blogApp/userImg.jpeg"
          className="w-10 h-10 rounded-full object-cover"
          w={40}
        />
        <span className="font-medium">John Doe</span>
        <span className="text-sm text-gray-500">2 days ago</span>
        {/* <span className="text-xs text-red-300 hover:text-red-500 cursor-pointer">
          delete
        </span> */}
      </div>
      <div className="mt-4">
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Lorem ipsum
          dolor sit, amet consectetur adipisicing elit. Sequi rerum accusantium.
        </p>
      </div>
    </div>
  );
}

export default Comment;
