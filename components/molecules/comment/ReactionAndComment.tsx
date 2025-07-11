import CommentForm from "./CommentForm";
import Reaction from "./Reaction";
import { Fragment } from "react";
import CommentList from "./CommentList";
import useSWR from "swr";
import axios from "axios";
import React from "react";

const ReactionAndComment = React.memo(
  ({
    page,
    wording = {
      singular: "comment",
      plural: "comment",
      title: "Leave comment",
      cta: "Or wanna leave a comment?",
      placeholder: "Noice! But I think ...",
    },
  }: {
    page: string;
    wording?: { [key: string]: string };
  }) => {
    const fetcher = ([url, page]) =>
      axios.get(url, { params: { page: page } }).then((r) => r.data);
    const { data, mutate } = useSWR(["/api/comment", page], fetcher);

    return (
      <Fragment>
        <div className="grid grid-cols-1 gap-x-4 gap-y-6 md:gap-x-6 md:gap-y-8 lg:grid-cols-2">
          <div className="col-span-1">
            <h3 className="subheading mb-4">Give your reaction</h3>
            <div>
              <Reaction page={page} />
            </div>
          </div>
          <div className="col-span-1">
            <CommentForm
              page={page}
              wording={wording}
              onSubmit={mutate}
            ></CommentForm>
            <div className="mt-6 md:mt-9">
              <CommentList comments={data} wording={wording} />
            </div>
          </div>
        </div>
      </Fragment>
    );
  },
);

ReactionAndComment.displayName = "ReactionAndComment";

export default ReactionAndComment;
