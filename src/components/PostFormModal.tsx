import { useRef, useState } from "react";
import Button from "./Button";
import CloseIcon from "./icons/CloseIcon";
import usePost from "../hooks/usePost";
import Spinner from "./Spinner";

type Props = {
  onClose: () => void; // 모달 닫기
};

const PostFormModal = ({ onClose }: Props) => {
  const ref = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState("");
  const [images, setImages] = useState("");

  const { handleSubmitPost, loading } = usePost();

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const file = files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        if (e.target?.result) {
          setImages(e.target.result as string);
        }
      };
    }
  };

  const handleSubmit = async () => {
    await handleSubmitPost({ content, images: images ? [images] : [] });
  };

  return (
    <section className="w-full h-full  fixed top-0 left-0 z-50 bg-black/50 flex justify-center items-center">
      <div className="flex flex-col w-4xl  min-h-[600px] bg-neutral-50 mx-5">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-lg font-bold">게시글 업로드</h1>
          <button className=" py-2 px-4 cursor-pointer text-lg" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        {/* 이미지 / 컨텐츠 영역 */}
        <div className="flex-1 flex md:flex-row flex-col p-4">
          <div className="flex-2 flex justify-center items-center md:mr-4">
            {images ? (
              <div className="w-full h-full relative md:mb-0 mb-4">
                <img src={images} alt="image" className="w-full md:h-[410px] object-cover rounded-xl" />
                <button
                  className="absolute top-2 right-2 bg-white/50 rounded-full p-1 cursor-pointer"
                  onClick={() => setImages("")}
                >
                  <CloseIcon />
                </button>
              </div>
            ) : (
              <>
                <input
                  id="file"
                  ref={ref}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImages}
                />
                <Button title="이미지 첨부" onClick={() => ref.current?.click()} />
              </>
            )}
          </div>
          <div className="flex-1 flex flex-col gap-2 relative">
            <textarea
              placeholder="Write your post..."
              className="w-full flex-1 border border-blue-300 rounded-xl p-4 resize-none"
              maxLength={280}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <span className="text-sm text-right text-gray-500 absolute bottom-2 right-2 z-20">
              {content.length}/280
            </span>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="h-20 flex justify-end p-4 ">
          <Button title="등록" disabled={!content} onClick={() => handleSubmit()} />
        </div>
      </div>
      {loading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Spinner />
        </div>
      )}
    </section>
  );
};

export default PostFormModal;
