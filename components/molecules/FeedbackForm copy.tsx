import { useCallback, useEffect, useState} from "react";
import Button from "../atoms/Button";
import {FiSend} from "react-icons/fi";
import Toast, {ToastContainer} from "../atoms/Toast";
import axios from "axios";
const FeedbackForm = ({ page }) => {
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
          setName('');
          setEmail('');
          setContent('');
          setSent(true);
          console.log(res);
        }).catch(err => {
          setLoading(false);
          setError(true);
        });
    }
  };
  return (
    <>
      {sent &&
      <ToastContainer>
        <Toast type='success'>Message sent successfully</Toast>
      </ToastContainer>
      }
      {error &&
      <ToastContainer>
        <Toast type='error'>Something went wrong. Please try again.</Toast>
      </ToastContainer>}
      <form onSubmit={submitHandler} className=" main-container ">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1">
            <div className="h2">Feedback</div>
            <p className="mt-2 body-text text-gray-600">
              Wanna give some ideas or feedback? Welcome to input here
            </p>
          </div>
          <div className="col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
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
                  placeholder="Nguyen"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  className="rounded-lg border-2 border-gray-300 focus:border-blue-600 focus:shadow-sm focus:shadow-blue-400/40 outline-none transition-all duration-200 px-3 py-2 w-full"
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
                  placeholder="nguyen@gmail.com"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className="rounded-lg border-2 border-gray-300 focus:border-blue-600 focus:shadow-sm focus:shadow-blue-400/40 outline-none transition-all duration-200 px-3 py-2 w-full"
                />
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="content-input"
                  className="text-base text-gray-800 block"
                >
                  Message:
                </label>
                <textarea
                  id="content-input"
                  required
                  placeholder="Nice works but ..."
                  onChange={(e) => setContent(e.target.value)}
                  value={content}
                  className="h-40 rounded-lg border-2 border-gray-300 focus:border-blue-600 focus:shadow-sm focus:shadow-blue-400/40 outline-none transition-all duration-200 px-3 py-2 w-full"
                ></textarea>
              </div>
              <div>
                <Button loading={loading} icon={<FiSend />}>Send feedback</Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};
export default FeedbackForm;
