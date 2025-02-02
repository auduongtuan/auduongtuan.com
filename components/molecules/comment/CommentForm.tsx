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
    {
      open: false,
      loading: false,
      sent: false,
      error: false,
      anonymous: false,
    },
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
      <h3 className="subheading mb-4">{wording.cta}</h3>
      {state.sent && (
        <Toast type="success" afterLeave={() => setState({ sent: false })}>
          Message sent. Thank for your {wording.singular}.
        </Toast>
      )}
      <CommentSuggestion onButtonClick={quickComment} page={page} />
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
                messageRef.current = e;
              }}
              className="text-primary focus:border-accent relative block h-32 w-full rounded-lg border-2 border-gray-300 px-3 py-2 text-base leading-tight outline-hidden transition-all duration-200 focus:z-10 focus:shadow-xs focus:shadow-blue-400/40 md:rounded-b-none"
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
        <footer className="mt-6 flex items-center justify-between gap-x-3"></footer>
      </form>
    </Fragment>
  );
};

export default CommentForm;
