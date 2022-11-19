import CommentForm from "./CommentForm";
import Reaction from "../molecules/Reaction";
import { Fragment } from "react";
const ReactionAndComment = ({ page, wording = {singular:'feedback', plural: 'feedback', title: 'Leave feedback', cta: 'Or wanna give some feedback?'} }: {page: string, wording?: {[key:string]: string}}) => {
  console.log('re-render parent reaction and comment');
  return (
    <Fragment>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="col-span-1 space-y-3 ">
          <h3>Give your reaction</h3>
          <Reaction page={page} />
        </div>

        <CommentForm
          // open={open}
          // setOpen={setOpen}
          page={page}
          wording={wording}
        ></CommentForm>
      </div>
     
    </Fragment>
  );
};
export default ReactionAndComment;