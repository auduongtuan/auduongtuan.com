import Button from "@atoms/Button";
import HeadMeta from "@atoms/HeadMeta";
import Footer from "@molecules/Footer";

export default function About() {
  return (
    <>
      <HeadMeta title="Not found" description="This page is not found." />
      <div>
        <div className="flex flex-col items-center text-primary p-header main-container">
          <video
            src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOWM5Y2p6MDA4eDk2eHo3YXFtNjI2OGZmdXdmMjgydXdjcHA5NmN5byZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/iPnLFwV5pPBsc/giphy.mp4"
            width="480"
            height="288"
            autoPlay
            muted
            playsInline
            loop
          ></video>
          <p></p>
          <h1 className="mt-6 h2 md:mt-10">Page not found</h1>
          <p className="mt-4 font-mono tracking-tight body-text text-secondary">
            Sorry, the page you are looking for does not exist 🥹.
          </p>
          <Button href="/" className="mt-8">
            Go back to home
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
}
