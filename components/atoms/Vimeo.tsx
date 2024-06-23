const Vimeo = ({
  id,
  ratio = 56.25,
}: {
  id: string | number;
  ratio?: number;
}) => (
  <div
    className="vimeo"
    style={{ padding: `${ratio}% 0 0 0`, position: "relative" }}
  >
    <iframe
      title="Video"
      src={`https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0&sidedock=0`}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
      frameBorder="0"
      allow="autoplay; fullscreen; picture-in-picture"
    ></iframe>
  </div>
);

export default Vimeo;
