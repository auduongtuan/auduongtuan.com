import React, { useCallback } from "react";
import { useRouter } from "next/router";

interface CustomLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  className?: string;
  callback?: () => void;
}

const CustomLink: React.FC<CustomLinkProps> = ({
  className = "",
  href,
  children,
  callback,
  ...rest
}) => {
  const router = useRouter();
  const scrollIntoEl = useCallback((hash: string, pathname: string) => {
    if (hash) {
      const el = document.getElementById(hash) as HTMLElement | null;
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        history.replaceState(null, "", "#" + hash);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
      history.replaceState(null, "", pathname + (hash ? "#" + hash : ""));
    }
  }, []);
  const handleOnClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      const location = window.location;
      const urlParts = href.split("#");
      if (location.pathname === urlParts[0]) {
        // console.log(urlParts[1]);
        scrollIntoEl(urlParts[1], urlParts[0]);
      } else {
        // neu chung page thi dep me
        router
          .push(urlParts[0])
          .then(() => urlParts[1] && scrollIntoEl(urlParts[1], urlParts[0]));
      }
      if (callback) callback();
    },
    [href, router, scrollIntoEl, callback]
  );
  return (
    <a onClick={handleOnClick} href={href} className={className} {...rest}>
      {children}
    </a>
  );
};

export default CustomLink;
