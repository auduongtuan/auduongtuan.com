import { playNavigationSound } from "@lib/audio/uiSounds";
import Link, { type LinkProps } from "next/link";
import React from "react";

type SoundLinkProps = LinkProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>;

const SoundLink = ({ onClick, children, ...props }: SoundLinkProps) => {
  return (
    <Link
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          playNavigationSound();
        }
      }}
    >
      {children}
    </Link>
  );
};

SoundLink.displayName = "SoundLink";
export default SoundLink;
