import {
  useReducer,
  Fragment,
} from "react";
import Button from "../atoms/Button";
import { FiSend } from "react-icons/fi";
import Toast from "../atoms/Toast";
import Dialog from "../atoms/Dialog";
import axios from "axios";
import { FieldValues, useForm } from "react-hook-form";
import { FiMessageCircle } from "react-icons/fi";

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const CommentForm = ({ page, wording }) => {
  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { open: false, loading: false, sent: false, error: false }
  );
  const { register, handleSubmit, reset } = useForm();

  console.log("re-render contact form");
  const submitHandler = (data: FieldValues) => {
    const { name, email, content } = data;
    // e.preventDefault();
    if (name && email && content) {
      setState({ loading: true });
      axios
        .post("/api/comment", {
          name,
          email,
          content,
          page,
        })
        .then((res) => {
          setState({ loading: false, sent: true, open: false });
          reset();
          // console.log(res);
        })
        .catch((err) => {
          setState({ loading: false, sent: false, error: true });
        });
    }
  };
  return (
    <Fragment>
      <button
        onClick={() => setState({ open: true })}
        className="font-medium text-base lg:h3 hover:border-blue-600 text-gray-600 col-span-1 border-2 px-8 py-4 border-gray-300 rounded-full flex items-center justify-items-center space-x-2 hover:bg-white/40  transition-all duration-100"
      >
        <span className="block flex-grow text-left">{wording.cta}</span>
        <FiMessageCircle className="flex-grow-0"></FiMessageCircle>
      </button>
      {state.sent && 
          <Toast type="success" afterLeave={() => setState({sent: false})}>
            Message sent. Thank for your {wording.singular}.
          </Toast>
}
      <Dialog
        open={state.open}
        onClose={() => setState({ open: false })}
        title={wording.title}
      >
        
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="p-6 space-y-6">
            <header>
              <div className="h3">{capitalize(wording.plural)}</div>
              <p className="mt-2 text-base text-gray-600">
                Wanna give some ideas or {wording.plural}?<br />
                Welcome to leave them here 🥹
              </p>
            </header>
            <section className="space-y-4">
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
                  required
                  // placeholder="Nguyen"
                  {...register("name")}
                  className="text-base leading-tight rounded-lg border-2 border-gray-300 focus:border-blue-600 focus:shadow-sm focus:shadow-blue-400/40 outline-none transition-all duration-200 px-3 py-2 w-full"
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
                  required
                  placeholder="example@gmail.com"
                  {...register("email")}
                  className="text-base leading-tight rounded-lg border-2 border-gray-300 focus:border-blue-600 focus:shadow-sm focus:shadow-blue-400/40 outline-none transition-all duration-200 px-3 py-2 w-full"
                />
              </div>
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
                  {...register("content")}
                  className="h-32 text-base leading-tight	block rounded-lg border-2 border-gray-300 focus:border-blue-600 focus:shadow-sm focus:shadow-blue-400/40 outline-none transition-all duration-200 px-3 py-2 w-full"
                />
              </div>
            </section>
            <footer>
              <Button loading={state.loading} icon={<FiSend />}>
                Send {wording.singular}
              </Button>
            </footer>
          </div>
        </form>
      </Dialog>
    </Fragment>
  );
};
export default CommentForm;
