import { Fact } from "@lib/notion/fact";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FiRefreshCcw } from "react-icons/fi";
import Fade from "@atoms/Fade";
import IconButton from "@atoms/IconButton";
import { richTextObject } from "@notion/richText";
import Tooltip from "@atoms/Tooltip";
import { event } from "@lib/gtag";
import { trackEvent } from "@lib/utils";
import Reaction from "@molecules/comment/Reaction";

export default function RandomFacts({ facts }: { facts: Fact[] }) {
  const [factToDisplay, setFactToDisplay] = useState(-1);
  const chooser = useMemo(() => {
    const array = Array.from({ length: facts.length }, (_, i) => i);
    let copy = array.slice(0);
    return function () {
      if (copy.length < 1) {
        copy = array.slice(0);
      }
      var index = Math.floor(Math.random() * copy.length);
      var item = copy[index];
      copy.splice(index, 1);
      return item;
    };
  }, [facts]);
  const reloadFact = useCallback(() => {
    setFactToDisplay(chooser());
  }, [chooser]);
  useEffect(() => {
    reloadFact();
  }, [reloadFact]);

  return (
    <>
      <Fade
        as="h3"
        delay={450}
        className="subheading2 section flex items-center gap-2"
      >
        <span>Random fact</span>
        <Tooltip content="Load another random fact">
          <IconButton
            size="small"
            variant="ghost"
            onClick={() => {
              reloadFact();
              event({
                action: "reload_random_fact",
                category: "about_page",
                label: "Reload random fact",
              });
              trackEvent({
                event: "reload_random_fact",
                content: facts[factToDisplay].slug,
                page: window.location.pathname,
              });
            }}
          >
            <FiRefreshCcw />
          </IconButton>
        </Tooltip>
      </Fade>
      {factToDisplay >= 0 && (
        <Fade
          show
          as="div"
          delay={400}
          className="bg-card item body-text flex w-full flex-col gap-2 rounded-md px-3 py-3 leading-normal tracking-tight md:col-span-6 md:px-4"
        >
          <Fade as="p" delay={450} className="grow">
            {richTextObject(facts[factToDisplay].content)}
          </Fade>
          <Fade as="div" delay={450} className="grow">
            <Reaction
              page={`/about#${facts[factToDisplay].slug}`}
              size="small"
              className="inline-flex"
            />
          </Fade>
        </Fade>
      )}
    </>
  );
}
