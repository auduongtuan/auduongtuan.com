import { useReducer, useRef, Fragment } from "react";
import Button from "@atoms/Button";
import Toast from "@atoms/Toast";
import axios from "axios";
import { FieldValues, useForm } from "react-hook-form";
import { FiSend } from "react-icons/fi";
import TextField from "@atoms/TextField";
import CommentSuggestion from "./CommentSuggestion";

const CommentForm = ({ page, wording, onSubmit }) => {
  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { open: false, loading: false, sent: false, error: false, anonymous: false }
  );
  const { register, handleSubmit, resetField, getValues } = useForm();
  const messageRef = useRef<HTMLTextAreaElement | null>(null);
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
          setState({ loading: false, sent: true, open: false });
          resetField("content");
          onSubmit && onSubmit();
        })
        .catch((err) => {
          // console.log(err);
          setState({ loading: false, sent: false, error: true });
        });
    }
  };
  const quickComment = (content: string) => {
    if (messageRef.current) messageRef.current.value = content;
    submitHandler({
      ...getValues(),
      content,
    });
  };
  return (
    <Fragment>
      <h3 className="mb-4 sub-heading">{wording.cta}</h3>
      {state.sent && (
        <Toast type="success" afterLeave={() => setState({ sent: false })}>
          Message sent. Thank for your {wording.singular}.
        </Toast>
      )}
      <CommentSuggestion onButtonClick={quickComment} />
      <form
        onSubmit={handleSubmit(submitHandler)}
        className={state.loading ? "pointer-events-none animate-pulse" : ""}
      >
        <section className="grid grid-cols-1 gap-0 ">
          <div>
            <textarea
              id="content-input"
              required
              placeholder="Write a message"
              maxLength={500}
              {...formContentRest}
              ref={(e) => {
                formContentRef(e);
                messageRef.current = e;
              }}
              className="relative block w-full h-32 px-3 py-2 text-base leading-tight text-primary transition-all duration-200 border-2 border-gray-300 rounded-lg outline-none md:rounded-b-none focus:border-blue-600 focus:shadow-sm focus:shadow-blue-400/40 focus:z-10"
            />
          </div>

          <div className="md:flex">
            <div className="mt-2 md:-mr-[2px] md:-mt-[2px] grow">
              <TextField
                type="text"
                className="relative md:rounded-t-none md:rounded-br-none focus:z-10"
                // label="Your name (optional)"
                placeholder="Your name (optional)"
                {...register("name")}
              />
            </div>
            <div className="mt-2 md:-mr-[2px] md:-mt-[2px] grow">
              <TextField
                className="relative md:rounded-none focus:z-10"
                type="email"
                placeholder="Your email (optional)"
                // placeholder="example@gmail.com"
                {...register("email")}
              />
            </div>
            <Button
              className="relative focus:z-10 mt-4 md:-mt-[2px] sm-only:w-full sm-only:justify-center md:rounded-t-none md:rounded-bl-none"
              type="submit"
              loading={state.loading}
              icon={<FiSend />}
            >
              Send
            </Button>
          </div>
        </section>
        <footer className="flex items-center justify-between mt-6 gap-x-3"></footer>
      </form>
    </Fragment>
  );
};

export default CommentForm;
