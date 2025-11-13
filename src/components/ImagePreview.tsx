import type { Post } from "../api/feed-type";
import CloseIcon from "./icons/CloseIcon";

type Props = {
  post: Post;
  onClose: () => void;
};

const ImagePreview = ({ post, onClose }: Props) => {
  return (
    <section className="w-full h-full  fixed top-0 left-0 z-50 bg-black/90 flex justify-center items-center">
      {post.images.length > 0 && (
        <div className="flex flex-col w-4xl mx-5">
          <div className="flex justify-end items-center">
            <button className=" py-2 px-4 cursor-pointer text-lg" onClick={onClose}>
              <CloseIcon className="text-white" />
            </button>
          </div>

          {/* 이미지 / 컨텐츠 영역 */}
          <div className="flex-1 flex md:flex-row flex-col ">
            <div className="flex-2 flex justify-center items-center md:mr-4">
              <div className="w-full h-full relative md:mb-0 mb-4">
                <img src={post.images[0]} alt="image" className="w-full h-full object-cover rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ImagePreview;
