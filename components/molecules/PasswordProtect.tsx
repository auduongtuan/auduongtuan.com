import CryptoJS from "crypto-js";
import { useEffect } from "react";
import TextField from "@atoms/TextField";
import usePostStore, { PasswordProtectError } from "@store/usePostStore";

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
          setDecryptedContent(content);
        } catch (e) {
          setError(PasswordProtectError.UNKNOWN);
        }
      } catch (e) {
        setError(PasswordProtectError.INCORRECT_PASSWORD);
      }
    }
  }, [post, postContent, setDecryptedContent, password, setError]);

  return (
    <div>
      <h3>This post is password-protected</h3>
      <p className="mt-4 body-text">
        Please input the password below to view this post.
      </p>
      <p className="mt-2 body-text">
        Password hint: 4 digits of my birthday + 4 last digits of my phone
        number.
      </p>
      <div className="mt-6">
        <TextField
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d{7}"
          maxLength={7}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Input password"
          required
          className="text-xl"
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
