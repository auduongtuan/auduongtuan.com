import Button from "@atoms/Button";
import CustomVideo from "@atoms/CustomVideo";
import Headline from "./Headline";
import Fade from "@atoms/Fade";
import Balancer from "react-wrap-balancer";
import HoverGif from "@molecules/HoverGif";
import InlineLink from "@atoms/InlineLink";
import { TextEncrypted } from "@atoms/TextEncrypted";

export default function Header() {
  const gifs = [
    {
      name: "lam-dau-tram-ho.gif",
      video: "designer.mp4",
      size: [480, 264],
    },
    {
      name: "muon-bung-chay.gif",
      video: "codes.mp4",
      size: [480, 270],
    },
    {
      name: "unicorn.gif",
      video: "unicorn.mp4",
      size: [480, 480],
    },
  ];

  return (
    <header className="bg-surface text-primary z-10 w-full">
      <div className="main-container py-section-vertical">
        <div className="flex items-center justify-center">
          <div className="py-4 md:py-6 lg:max-w-[50rem]">
            <Headline />
            <Fade delay={300}>
              <p className="big-body-text text-secondary relative z-30 mt-4 text-center lg:mt-6">
                <Balancer className="max-w-[40rem]" ratio={1}>
                  wearing{" "}
                  <HoverGif
                    text={
                      <InlineLink className="font-mono">🧑‍🎨 designer</InlineLink>
                    }
                    label={gifs[0].name}
                  >
                    <CustomVideo
                      slug="gif"
                      src={gifs[0].video}
                      width={gifs[0].size[0]}
                      height={gifs[0].size[1]}
                    />
                  </HoverGif>{" "}
                  <span className="text-divider">/</span>{" "}
                  <HoverGif
                    text={
                      <InlineLink className="font-mono">
                        <TextEncrypted text="👨‍💻 developer"></TextEncrypted>
                      </InlineLink>
                    }
                    label={gifs[1].name}
                  >
                    <CustomVideo
                      slug="gif"
                      src={gifs[1].video}
                      width={gifs[1].size[0]}
                      height={gifs[1].size[1]}
                    />
                  </HoverGif>{" "}
                  <span className="text-divider">/</span>{" "}
                  <HoverGif
                    text={
                      <InlineLink className="font-mono">🦄 whatever</InlineLink>
                    }
                    label={gifs[2].name}
                  >
                    <CustomVideo
                      slug="gif"
                      src={gifs[2].video}
                      width={gifs[2].size[0]}
                      height={gifs[2].size[1]}
                    />
                  </HoverGif>{" "}
                  hats to bring exceptional digital products to life.
                </Balancer>
                {/* (maybe a{" "}
                <Tooltip content="Read more about this term">
                  <GifText
                    href="https://www.google.com/search?q=unicorn+designer"
                    {...setupGif(2)}
                    external
                  >
                    unicorn
                  </GifText>
                </Tooltip>
                ?). */}
              </p>
            </Fade>

            <Fade delay={500} className="flex justify-center">
              <Button href="/about" className="mt-4 md:mt-6" arrow>
                Get to know me
              </Button>
            </Fade>
          </div>
        </div>
      </div>
    </header>
  );
}
