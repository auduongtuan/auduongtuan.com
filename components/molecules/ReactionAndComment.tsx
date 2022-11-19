import CommentForm from "./CommentForm";
import Reaction from "../molecules/Reaction";
import { Fragment, useState } from "react";
import { FiMessageCircle } from "react-icons/fi";
const ReactionAndComment = ({ page, wording = {singular:'feedback', plural: 'feedback', title: 'Leave feedback', cta: 'Or wanna give some feedback?'} }: {page: string, wording?: {[key:string]: string}}) => {
  const [open, setOpen] = useState(false);
  return (
    <Fragment>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="col-span-1 space-y-3 ">
          <h3>Give your reaction</h3>
          <Reaction page={page} />
        </div>
        <button
          onClick={() => setOpen(true)}
          className="font-medium text-base lg:h3 hover:border-blue-600 text-gray-600 col-span-1 border-2 px-8 py-4 border-gray-300 rounded-full flex items-center justify-items-center space-x-2 hover:bg-white/40  transition-all duration-100"
        >
          <span className="block flex-grow text-left">
            {wording.cta}
          </span>
          <FiMessageCircle className="flex-grow-0"></FiMessageCircle>
        </button>
      </div>
      <CommentForm
        open={open}
        setOpen={setOpen}
        page={page}
        wording={wording}
      ></CommentForm>
    </Fragment>
  );
};
export default ReactionAndComment;