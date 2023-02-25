import { useReducer, useRef, Fragment } from "react";
import Button from "../../atoms/Button";
import Toast from "../../atoms/Toast";
import Dialog from "../../atoms/Dialog";
import axios from "axios";
import { FieldValues, useForm } from "react-hook-form";
import { FiMessageCircle, FiSend } from "react-icons/fi";
import Switch from "../../atoms/Switch";

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
    console.log(name);
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
          console.log(res);
          setState({ loading: false, sent: true, open: false });
          reset();
          onSubmit && onSubmit();
        })
        .catch((err) => {
          console.log(err);
          setState({ loading: false, sent: false, error: true });
        });
    }
  };
  return (
    <Fragment>
      <button
        onClick={() => setState({ open: true })}
        className="w-full font-medium text-base hover:border-blue-600 text-gray-500 col-span-1 border-2 px-6 py-3 border-gray-300 rounded-full flex items-center justify-items-center space-x-2 hover:bg-white/40  transition-all duration-100"
      >
        <span className="block flex-grow text-left">{wording.placeholder}</span>
        <FiMessageCircle className="text-xl flex-grow-0 text-gray-500"></FiMessageCircle>
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
                  className="text-base text-gray-800 block"
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
                  className="h-32 text-base text-gray-800 leading-tight	block rounded-lg border-2 border-gray-300 focus:border-blue-600 focus:shadow-sm focus:shadow-blue-400/40 outline-none transition-all duration-200 px-3 py-2 w-full"
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
                    <label
                      htmlFor="name-input"
                      className="text-base text-gray-800 block"
                    >
                      Your name:
                    </label>
                    <input
                      type="text"
                      id="name-input"
                      required={!state.anonymous}
                      // placeholder="Nguyen"
                      {...register("name")}
                      className="text-base text-gray-800 leading-tight rounded-lg border-2 border-gray-300 focus:border-blue-600 focus:shadow-sm focus:shadow-blue-400/40 outline-none transition-all duration-200 px-3 py-2 w-full"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email-input"
                      className="text-base text-gray-800 block"
                    >
                      Your email:
                    </label>
                    <input
                      type="email"
                      id="email-input"
                      // required={!state.anonymous}
                      placeholder="example@gmail.com"
                      {...register("email")}
                      className="text-base text-gray-800 leading-tight rounded-lg border-2 border-gray-300 focus:border-blue-600 focus:shadow-sm focus:shadow-blue-400/40 outline-none transition-all duration-200 px-3 py-2 w-full"
                    />
                  </div>
                </>
              )}
            </section>
            <footer className="flex items-end justify-end flex-gap-x-3 mt-12">
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
