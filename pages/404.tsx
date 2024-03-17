import Button from "@atoms/Button";
import HeadMeta from "@atoms/HeadMeta";
import AboutPage from "@templates/about/AboutPage";

export default function About() {
  return (
    <>
      <HeadMeta title="Not found" description="This page is not found." />
      <div>
        <div className="flex flex-col items-center text-primary p-header main-container">
          <h1>Page not found</h1>
          <p className="mt-4 body-text text-secondary">
            Sorry, the page you are looking for does not exist 🥹.
          </p>
          <Button href="/" className="mt-8">
            Go back to home
          </Button>
        </div>
      </div>
    </>
  );
}
