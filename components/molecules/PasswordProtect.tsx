import CryptoJS from "crypto-js";
import { useEffect } from "react";
import TextField from "@atoms/TextField";
import { FiLock } from "react-icons/fi";
import usePasswordProtectStore, {
  PasswordProtectError,
} from "@store/usePasswordProtectStore";

const PasswordProtect = ({
  encryptedContent,
  mode = "post",
}: {
  encryptedContent: string;
  mode: "project" | "post";
}) => {
  const { password, setPassword, setDecryptedContent, error, setError } =
    usePasswordProtectStore();

  useEffect(() => {
    if (password.length == 7) {
      try {
        const decrypt = CryptoJS.AES.decrypt(encryptedContent, password);
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
  }, [encryptedContent, setDecryptedContent, password, setError]);

  return (
    <div className="p-6 border-2 border-gray-200 border-dashed rounded-md">
      <div className="flex w-full flex-gap-4">
        <div className="grow">
          <h3>This {mode} is password-protected</h3>
          <p className="mt-4 text-base">
            Please input the password below to view this {mode}.
          </p>
          <p className="mt-2 text-base">
            Password hint:{" "}
            {mode == "post"
              ? "4 digits of my birthday + 3 last digits of my phone number."
              : "Password is in my submitted resume."}
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
