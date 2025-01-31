import Fade from "@atoms/Fade";
import { AppFrame } from "@atoms/Frame";
import IconButton from "@atoms/IconButton";
import InlineLink from "@atoms/InlineLink";
import React from "react";
import { FiSend } from "react-icons/fi";
import { RiCrossFill } from "react-icons/ri";
import { twMerge } from "tailwind-merge";
import { cvLink } from "./content";

const ChatBubble = ({
  first = false,
  last = false,
  children,
}: {
  first?: boolean;
  last?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={twMerge(
        "inline-block p-4  bg-subtle body-text rounded-2xl rounded-l-md",
        first && "rounded-tl-2xl",
        last && "rounded-bl-2xl"
      )}
    >
      <div>{children}</div>
    </div>
  );
};

const ChatList = () => {
  return (
    <div className="flex gap-2">
      <div className="flex flex-col ">
        <Fade delay={150}>
          <ChatBubble first>Xin chào!</ChatBubble>
        </Fade>
        <Fade delay={150} className="mt-2">
          <ChatBubble>
            I&apos;m a versatile software professional, seamlessly transitioning
            between the roles of a designer, developer, or any other hat
            required to bring my creative visions to life.
            {/* I&apos;m Tuan - a software designer and developer. */}
            {/* Proudly having many skills that span across a spectrum of
            disciplines helps me to solve problems in creative, organized
            and programmatic ways. */}
          </ChatBubble>
        </Fade>
        <Fade delay={200} className="mt-2">
          <ChatBubble>
            My journey began when I taught myself design and code while
            tinkering with the Yahoo Blog theme. Then, I pursued a BFA in Design
            at UAH and a BSc degree in Tech at HCMUS. You can read more at{" "}
            <InlineLink href="/blog/my-digital-journey">
              my digital journey
            </InlineLink>
            .
          </ChatBubble>
        </Fade>
        <Fade delay={250} className="mt-2">
          <ChatBubble>
            Recently, I had worked on Design systems and Design ops at companies
            like <InlineLink href="https://www.aperia.com">Aperia</InlineLink>,
            <span className="text-[#54b0ad]">BAEMIN</span>
            <RiCrossFill />. I am looking for a role in a product company where
            I can enhance my technical abilities and product mindset.
          </ChatBubble>
        </Fade>
        <Fade delay={250} className="mt-2">
          <ChatBubble>
            <span>💼 Looking for more details?</span>{" "}
            <InlineLink href={cvLink} className="font-medium body-text">
              Download my CV
            </InlineLink>
          </ChatBubble>
        </Fade>
      </div>
    </div>
  );
};
const ChatConcept = () => {
  return (
    <AppFrame title="Chat with Tuan">
      <div className="p-6">
        <ChatList />
      </div>
      <div className="flex items-center gap-4 px-6 py-6">
        <textarea
          placeholder="Send me a message"
          className="relative grow block w-full h-12 px-3 py-2 text-base leading-tight text-primary transition-all duration-200 border-2 border-gray-300 rounded-lg outline-hidden focus:border-accent focus:shadow-xs focus:shadow-blue-400/40 focus:z-10"
        />
        <IconButton className="shrink-0 grow-0">
          <FiSend />
        </IconButton>
      </div>
    </AppFrame>
  );
};

export default ChatConcept;
