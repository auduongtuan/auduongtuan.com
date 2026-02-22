import { cn } from "@lib/utils/cn";
import axios from "axios";
import React from "react";
import useSWR from "swr";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import Reaction from "./Reaction";

const fetcher = ([url, page]) =>
  axios.get(url, { params: { page: page } }).then((r) => r.data);

const ReactionAndComment = React.memo(
  ({
    page,
    lastEditedTime,
    wording = {
      singular: "comment",
      plural: "comment",
      title: "Leave comment",
      cta: "Or wanna leave a comment?",
      placeholder: "Noice! But I think ...",
    },
    className,
    children,
    ...rest
  }: {
    page: string;
    wording?: { [key: string]: string };
    lastEditedTime: number | string;
  } & React.ComponentPropsWithRef<"div">) => {
    const { data, mutate } = useSWR(["/api/comment", page], fetcher);

    return (
      <div
        className={cn(
          "grid grid-cols-1 gap-x-4 gap-y-6 md:gap-x-6 md:gap-y-8 lg:grid-cols-2",
          className,
        )}
        {...rest}
      >
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
            lastEditedTime={lastEditedTime}
          ></CommentForm>
          <div className="mt-6 md:mt-9">
            <CommentList comments={data} wording={wording} />
          </div>
        </div>
        {children}
      </div>
    );
  },
);

ReactionAndComment.displayName = "ReactionAndComment";

export default ReactionAndComment;
