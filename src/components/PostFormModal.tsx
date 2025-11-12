import { useRef } from "react";
import Button from "./Button";

const PostFormModal = ({ setModalOpen }: { setModalOpen: (open: boolean) => void }) => {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <section className="w-full h-full  fixed top-0 left-0 z-50 bg-black/50 flex justify-center items-center">
      <div className="flex flex-col w-2xl  mx-auto h-[500px] bg-neutral-50">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-lg font-bold">게시글 업로드</h1>
          <button className=" py-2 px-4 cursor-pointer text-lg" onClick={() => setModalOpen(false)}>
            X
          </button>
        </div>
        <div className="flex-1 p-4 my-2.5">
          <div className="mb-3">
            <input id="file" ref={ref} type="file" multiple accept="image/*" className="hidden" />
            <Button title="이미지 첨부" onClick={() => ref.current?.click()} />
          </div>
          <div>
            <textarea
              placeholder="내용을 입력해주세요"
              className="w-full h-[200px]  border border-blue-300 rounded-xl p-2"
            />
          </div>
        </div>
        <div className="p-4 flex justify-end">
          <Button title="저장" onClick={() => setModalOpen(false)} />
        </div>
      </div>
    </section>
  );
};

export default PostFormModal;
