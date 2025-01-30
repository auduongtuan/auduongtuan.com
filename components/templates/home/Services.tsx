import Fade from "@atoms/Fade";
import ProjectCard from "@molecules/project/ProjectCard";
import { Project } from "@lib/notion";
import Button from "@atoms/Button";
import SectionTitle from "@molecules/SectionTitle";
import { RiCodeSSlashLine, RiMagicLine } from "react-icons/ri";
import TextField from "@atoms/TextField";

export default function Services() {
  return (
    <section id="works">
      <Fade className="main-container" delay={500} duration={200}>
        <SectionTitle title="Services a.k.a things I can help you with" />
        <div className="grid gap-6 md:grid-cols-3">
          <div className="p-4 rounded-xl bg-card">
            <div className="inline-flex items-center justify-center w-12 h-12 text-2xl font-semibold rounded-full bg-surface aspect-square">
              ✨
            </div>
            <h3 className="mt-3 text-xl">Product design</h3>
            <p className="mt-1">
              Product ideation, design, copywriting, and prototyping.
            </p>
            <div className="mt-4 muted-text subheading">Stack</div>
            <ul className="mt-2">
              <li>Figma</li>
              <li>Sketch</li>
              <li>Adobe Creative Suite</li>
              <li>Protopie</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-card">
            <div className="inline-flex items-center justify-center w-12 h-12 text-2xl font-semibold rounded-full bg-surface aspect-square">
              👨‍💻
            </div>
            <h3 className="mt-3 text-xl">Web development</h3>
            <p className="mt-1">
              Custom websites, web apps, and e-commerce solutions.
            </p>
            <div className="mt-4 muted-text subheading">Stack</div>
            <ul className="mt-2">
              <li>Framer, Webflow</li>
              <li>WordPress, PHP, MySQL</li>
              <li>Node.js, PostgreSQL</li>
              <li>React</li>
              <li>Next.js</li>
              <li>Remix, Shopify</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-card">
            <div className="inline-flex items-center justify-center w-12 h-12 text-2xl font-semibold rounded-full bg-surface aspect-square">
              💌
            </div>
            <h3 className="mt-3 text-xl">Contact me now</h3>
            <form>
              <TextField
                label="Your email"
                placeholder="abc@example.com"
                type="email"
                required
              />
              <TextField
                label="Your name"
                placeholder="abc@example.com"
                type="email"
                required
              />
              <TextField label="Your budget" placeholder="" required />
              <TextField
                label="Your message"
                placeholder="
                  Hi, I'm interested in working with you on a project. Here are the details...
                "
                required
              />
            </form>
          </div>
        </div>
      </Fade>
    </section>
  );
}
