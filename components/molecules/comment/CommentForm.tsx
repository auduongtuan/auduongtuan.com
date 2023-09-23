import { useReducer, useRef, Fragment } from "react";
import Button from "../../atoms/Button";
import Toast from "../../atoms/Toast";
import Dialog from "../../atoms/Dialog";
import axios from "axios";
import { FieldValues, useForm } from "react-hook-form";
import { FiMessageCircle, FiSend } from "react-icons/fi";
import Switch from "../../atoms/Switch";
import TextField from "../../atoms/TextField";

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
      <button
        onClick={() => setState({ open: true })}
        className="flex items-center w-full col-span-1 px-6 py-3 space-x-2 text-base font-medium text-gray-500 transition-all duration-100 border-2 border-gray-300 rounded-full hover:border-blue-600 justify-items-center hover:bg-white/40"
      >
        <span className="flex-grow block text-left">{wording.placeholder}</span>
        <FiMessageCircle className="flex-grow-0 text-xl text-gray-500"></FiMessageCircle>
      </button>
      {state.sent && (
        <Toast type="success" afterLeave={() => setState({ sent: false })}>
          Message sent. Thank for your {wording.singular}.
        </Toast>
      )}
      <Dialog
        open={state.open}
        onClose={() => setState({ open: false })}
        title={wording.title}
        initialFocus={messageRef}
      >
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="p-6">
            <header className="">
              <div className="h3">{capitalize(wording.plural)}</div>
              <p className="mt-2 text-base text-gray-600">
                Wanna give some ideas or {wording.plural}?<br />
                Welcome to leave them here 🥹
              </p>
            </header>
            <section className="grid grid-cols-1 gap-4 mt-6">
              <div>
                <label
                  htmlFor="content-input"
                  className="block text-base text-gray-800"
                >
                  Message:
                </label>
                <textarea
                  id="content-input"
                  required
                  // placeholder="What do you want to share?"
                  maxLength={500}
                  {...formContentRest}
                  ref={(e) => {
                    formContentRef(e);
                    messageRef.current = e;
                  }}
                  className="block w-full h-32 px-3 py-2 text-base leading-tight text-gray-800 transition-all duration-200 border-2 border-gray-300 rounded-lg outline-none focus:border-blue-600 focus:shadow-sm focus:shadow-blue-400/40"
                />
              </div>
              <div>
                <Switch
                  label="Anonymous"
                  checked={state.anonymous}
                  onChange={(b) => setState({ anonymous: b })}
                ></Switch>
              </div>
              {!state.anonymous && (
                <>
                  <div>
                    <TextField
                      type="text"
                      label="Your name:"
                      required={!state.anonymous}
                      // placeholder="Nguyen"
                      {...register("name")}
                    />
                  </div>
                  <div>
                    <TextField
                      type="email"
                      label="Your email:"
                      // required={!state.anonymous}
                      placeholder="example@gmail.com"
                      {...register("email")}
                    />
                  </div>
                </>
              )}
            </section>
            <footer className="flex items-end justify-end mt-12 flex-gap-x-3">
              <Button
                type="button"
                secondary
                onClick={() => setState({ open: false })}
              >
                Cancel
              </Button>
              <Button type="submit" loading={state.loading} icon={<FiSend />}>
                Send
              </Button>
            </footer>
          </div>
        </form>
      </Dialog>
    </Fragment>
  );
};
export default CommentForm;
