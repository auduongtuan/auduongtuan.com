import CryptoJS from "crypto-js";
import { useEffect, useId } from "react";
import { FiLock } from "react-icons/fi";
import usePasswordProtectStore, {
  PasswordProtectError,
} from "@store/usePasswordProtectStore";
import { PasswordInfo } from "@lib/notion/password";
import { event } from "@lib/gtag";
import PasswordField from "@atoms/PasswordField";
import { trackEvent } from "@lib/utils";

const PasswordProtect = ({
  encryptedContent,
  mode = "post",
  passwordInfo,
}: {
  encryptedContent: string;
  mode: "project" | "post";
  passwordInfo: PasswordInfo;
}) => {
  const { password, setPassword, setDecryptedContent, error, setError } =
    usePasswordProtectStore();
  const id = useId();
  useEffect(() => {
    if (password.length == passwordInfo.length) {
      try {
        const decrypt = CryptoJS.AES.decrypt(encryptedContent, password);
        const jsonContent = decrypt.toString(CryptoJS.enc.Utf8);
        try {
          const content = JSON.parse(jsonContent);
          setTimeout(() => {
            setDecryptedContent(content);
            event({
              action: "enter_correct_password",
              category: "post_page",
              label: "Enter correct password",
            });
            trackEvent({
              event: "enter_correct_password",
              content: password,
              page: window.location.pathname,
            });
          }, 100);
        } catch (e) {
          setError(PasswordProtectError.UNKNOWN);
        }
      } catch (e) {
        setError(PasswordProtectError.INCORRECT_PASSWORD);
        event({
          action: "enter_incorrect_password",
          category: "post_page",
          label: "Enter incorrect password",
        });
        trackEvent({
          event: "enter_incorrect_password",
          content: password,
          page: window.location.pathname,
        });
      }
    }
  }, [
    encryptedContent,
    setDecryptedContent,
    password,
    setError,
    passwordInfo.length,
  ]);

  return (
    <div className="p-6 border-2 border-gray-200 border-dashed rounded-md">
      <div className="flex w-full gap-4">
        <div className="grow">
          <h3>This {mode} is password-protected</h3>
          <p className="mt-4 font-mono small-body-text text-secondary">
            Please input the password below to view this {mode}.
          </p>
          <p className="mt-2 font-mono small-body-text text-secondary">
            Password hint:
            <br />
            {passwordInfo.length > 0 ? passwordInfo.hint : "No hint available"}
          </p>
        </div>
        <FiLock className="shrink-0 text-[24px] md:text-[32px] text-gray-400"></FiLock>
      </div>
      <div className="mt-6">
        <PasswordField
          type="text"
          key={id}
          // inputMode="numeric"
          // autoComplete="one-time-code"
          pattern={`\d{${passwordInfo.length}}`}
          maxLength={passwordInfo.length}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
