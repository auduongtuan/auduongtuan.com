import CryptoJS from "crypto-js";
import { useEffect } from "react";
import TextField from "@atoms/TextField";
import usePostStore, { PasswordProtectError } from "@store/usePostStore";
import { FiLock } from "react-icons/fi";

const PasswordProtect = () => {
  const {
    post,
    postContent,
    protect: { password, setPassword, setDecryptedContent, error, setError },
  } = usePostStore();

  useEffect(() => {
    if (!post) return;
    if (post.meta.protected && password.length == 7) {
      try {
        const decrypt = CryptoJS.AES.decrypt(postContent, password);
        const jsonContent = decrypt.toString(CryptoJS.enc.Utf8);
        try {
          const content = JSON.parse(jsonContent);
          setTimeout(() => {
            setDecryptedContent(content);
          }, 100);
        } catch (e) {
          setError(PasswordProtectError.UNKNOWN);
        }
      } catch (e) {
        setError(PasswordProtectError.INCORRECT_PASSWORD);
      }
    }
  }, [post, postContent, setDecryptedContent, password, setError]);

  return (
    <div className="p-6 border-2 border-gray-200 border-dashed rounded-md">
      <div className="flex w-full flex-gap-4">
        <div className="grow">
          <h3>This post is password-protected</h3>
          <p className="mt-4 text-base">
            Please input the password below to view this post.
          </p>
          <p className="mt-2 text-base">
            Password hint: 4 digits of my birthday + 3 last digits of my phone
            number.
          </p>
        </div>
        <FiLock className="shrink-0 text-[24px] md:text-[32px] text-gray-400"></FiLock>
      </div>
      <div className="mt-6">
        <TextField
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d{7}"
          maxLength={7}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          required
          className="text-lg"
          error={error != null}
          errorMessage={
            error &&
            (error == PasswordProtectError.INCORRECT_PASSWORD
              ? "Incorrect password"
              : "Unknown error")
          }
        />
      </div>
    </div>
  );
};

export default PasswordProtect;
