import { useCallback, useEffect, useState, useRef } from "react";
import Button from "../atoms/Button";
import { FiSend } from "react-icons/fi";
import Toast, { ToastContainer } from "../atoms/Toast";
import Dialog from "../atoms/Dialog";
import axios from "axios";
function capitalize(str){
  return str.charAt(0).toUpperCase() + str.slice(1);
}
const CommentForm = ({ page, open, setOpen, wording}) => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const submitHandler = (e) => {
    e.preventDefault();
    if (name && email && content) {
      setLoading(true);
      axios
        .post("/api/comment", {
          name,
          email,
          content,
          page,
        })
        .then((res) => {
          setLoading(false);
          setName("");
          setEmail("");
          setContent("");
          setOpen(false);
          setSent(true);
          console.log(res);
        })
        .catch((err) => {
          setLoading(false);
          setError(true);
        });
    }
  };
  return (
    <>
      {sent && (
        <ToastContainer>
          <Toast type="success">Message sent. Thank for your {wording.singular}.</Toast>
        </ToastContainer>
      )}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={wording.title}
      >
        <form onSubmit={submitHandler}>
          <div className="p-6 space-y-6">
            <header>
              <div className="h3">{capitalize(wording.plural)}</div>
              <p className="mt-2 text-base text-gray-600">
                Wanna give some ideas or {wording.plural}?<br />Welcome to leave them here 🥹
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
                  onChange={(e) => setName(e.target.value)}
                  value={name}
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
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
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
                  onChange={(e) => setContent(e.target.value)}
                  value={content}
                  maxLength={500}
                  className="h-32 text-base leading-tight	block rounded-lg border-2 border-gray-300 focus:border-blue-600 focus:shadow-sm focus:shadow-blue-400/40 outline-none transition-all duration-200 px-3 py-2 w-full"
                />
                
              </div>
            </section>
            <footer>
              <Button loading={loading} icon={<FiSend />}>
                Send {wording.singular}
              </Button>
            </footer>
          </div>
        </form>
      </Dialog>
    </>
  );
};
export default CommentForm;
