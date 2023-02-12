import CommentForm from "./CommentForm";
import Reaction from "../molecules/Reaction";
import { Fragment } from "react";
const ReactionAndComment = ({
  page,
  wording = {
    singular: "feedback",
    plural: "feedback",
    title: "Leave feedback",
    cta: "Or wanna give some feedback?",
    placeholder: "Noice! But I think ...",
  },
}: {
  page: string;
  wording?: { [key: string]: string };
}) => {
  return (
    <Fragment>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-6 md:gap-x-6 md:gap-y-8">
        <div className="col-span-1">
          <h3 className="sub-heading mb-4">Give your reaction</h3>
          <div>
            <Reaction page={page} />
          </div>
        </div>
        <div className="col-span-1">
          <h3 className="sub-heading mb-4">{wording.cta}</h3>
          <CommentForm
            page={page}
            wording={wording}
          ></CommentForm>
        </div>
      </div>
    </Fragment>
  );
};
export default ReactionAndComment;
