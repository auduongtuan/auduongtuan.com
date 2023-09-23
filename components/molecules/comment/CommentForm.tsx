import { useReducer, useRef, Fragment } from "react";
import Button from "@atoms/Button";
import Toast from "@atoms/Toast";
import Dialog from "@atoms/Dialog";
import axios from "axios";
import { FieldValues, useForm } from "react-hook-form";
import { FiMessageCircle, FiSend } from "react-icons/fi";
import Switch from "@atoms/Switch";
import TextField from "@atoms/TextField";

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const CommentForm = ({ page, wording, onSubmit }) => {
  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { open: false, loading: false, sent: false, error: false, anonymous: false }
  );
  const { register, handleSubmit, reset } = useForm();
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
          reset();
          onSubmit && onSubmit();
        })
        .catch((err) => {
          // console.log(err);
          setState({ loading: false, sent: false, error: true });
        });
    }
  };
  return (
    <Fragment>
      <h3 className="mb-4 sub-heading">{wording.cta}</h3>
      {state.sent && (
        <Toast type="success" afterLeave={() => setState({ sent: false })}>
          Message sent. Thank for your {wording.singular}.
        </Toast>
      )}

      <form onSubmit={handleSubmit(submitHandler)}>
        <section className="grid grid-cols-1 gap-4 ">
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
              className="block w-full h-32 px-3 py-2 text-base leading-tight text-gray-800 transition-all duration-200 border-2 border-gray-300 rounded-lg outline-none focus:border-blue-600 focus:shadow-sm focus:shadow-blue-400/40"
            />
          </div>

          {!state.anonymous && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <TextField
                  type="text"
                  label="Your name"
                  required={!state.anonymous}
                  {...register("name")}
                />
              </div>
              <div>
                <TextField
                  type="email"
                  label="Your email (optional)"
                  placeholder="example@gmail.com"
                  {...register("email")}
                />
              </div>
            </div>
          )}
        </section>
        <footer className="flex items-center justify-between mt-6 flex-gap-x-3">
          <div>
            <Switch
              label="Send as anonymous"
              checked={state.anonymous}
              onChange={(b) => setState({ anonymous: b })}
            ></Switch>
          </div>
          <Button type="submit" loading={state.loading} icon={<FiSend />}>
            Send
          </Button>
        </footer>
      </form>
    </Fragment>
  );
};
export default CommentForm;
