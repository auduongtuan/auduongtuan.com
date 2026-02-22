import Button from "@atoms/Button";
import TextField from "@atoms/TextField";
import { toast } from "@atoms/Toast";
import axios from "axios";
import { Fragment, useReducer } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { FiSend } from "react-icons/fi";
import CommentSuggestion from "./CommentSuggestion";

const CommentForm = ({
  page,
  wording,
  onSubmit,
  lastEditedTime,
}: {
  page: string;
  wording: any;
  onSubmit?: () => void;
  lastEditedTime: number | string;
}) => {
  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      open: false,
      loading: false,
      sent: false,
      error: false,
      anonymous: false,
    },
  );
  const { register, handleSubmit, resetField, getValues, setValue } = useForm();
  // const messageRef = useRef<HTMLTextAreaElement | null>(null);
  const { ref: formContentRef, ...formContentRest } = register("content");
  // const [anonymous, setAnonymous]
  const submitHandler = (data: FieldValues) => {
    const { name = "", email = "", content } = data;
    // console.log(name);
    if (content) {
      setState({ loading: true });
      axios
        .post("/api/comment", {
          name,
          email,
          content,
          page,
        })
        .then((res) => {
          // console.log(res);
          setState({ loading: false, open: false });
          toast({
            message: `Message sent. Thank for your ${wording.singular}.`,
            type: "success",
          });
          resetField("content");
          onSubmit && onSubmit();
        })
        .catch((err) => {
          // console.log(err);
          setState({ loading: false, error: true });
          toast({
            message: "Failed to send message. Please try again.",
            type: "error",
          });
        });
    }
  };
  const quickComment = (content: string) => {
    setValue("content", content);
  };
  return (
    <Fragment>
      <h3 className="subheading mb-4">{wording.cta}</h3>
      {/* {state.sent && ( */}

      {/* )} */}
      <CommentSuggestion
        onButtonClick={quickComment}
        page={page}
        lastEditedTime={lastEditedTime}
      />
      <form
        onSubmit={handleSubmit(submitHandler)}
        className={state.loading ? "pointer-events-none animate-pulse" : ""}
      >
        <section className="grid grid-cols-1 gap-0">
          <div>
            <textarea
              id="content-input"
              required
              placeholder="Write a message"
              maxLength={500}
              {...formContentRest}
              ref={(e) => {
                formContentRef(e);
                // messageRef.current = e;
              }}
              className="focus:border-accent text-primary relative block h-32 w-full rounded-lg border-2 border-gray-300 px-3 py-2 text-base leading-tight outline-hidden transition-all duration-200 focus:z-10 focus:shadow-xs focus:shadow-blue-400/40 md:rounded-b-none"
            />
          </div>

          <div className="md:flex">
            <div className="mt-2 grow md:-mt-[2px] md:-mr-[2px]">
              <TextField
                type="text"
                className="relative focus:z-10 md:rounded-t-none md:rounded-br-none"
                // label="Your name (optional)"
                placeholder="Your name (optional)"
                {...register("name")}
              />
            </div>
            <div className="mt-2 grow md:-mt-[2px] md:-mr-[2px]">
              <TextField
                className="relative focus:z-10 md:rounded-none"
                type="email"
                placeholder="Your email (optional)"
                // placeholder="example@gmail.com"
                {...register("email")}
              />
            </div>
            <Button
              className="relative mt-4 w-full justify-center focus:z-10 md:-mt-[2px] md:w-auto md:rounded-t-none md:rounded-bl-none"
              type="submit"
              loading={state.loading}
              icon={<FiSend />}
            >
              Send
            </Button>
          </div>
        </section>
      </form>
    </Fragment>
  );
};

export default CommentForm;
