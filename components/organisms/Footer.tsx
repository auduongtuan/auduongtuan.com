import React from "react";
import { FiFacebook, FiGithub, FiInstagram, FiLinkedin } from "react-icons/fi";

export default function Footer() {
  return (
    <div id="contact" className="relative">
      <footer className="bg-neutral-900 text-white sticky bottom-0 z-0">
        <div className="main-container pt-36 pb-60">
          <section className="grid grid-cols-12 grid-rows-2 gap-3">
            <div className="col-span-7 row-span-2 max-w-[50rem]">
              <p className="font-display text-6xl leading-[4.5rem] font-bold">
                Send me any bussiness inquiries via hi@auduongtuan.com, or talk
                via other social networks
              </p>
            </div>
            <ul className="col-span-5 row-span-1 justify-self-end self-start text-right text-xl leading-8 text-display font-medium font-display tracking-tight">
              <li><a href="#" className="flex items-center gap-4"><FiGithub /> Github</a></li>
              <li><a href="#" className="flex items-center gap-4"><FiInstagram /> Instagram</a></li>
              <li><a href="#" className="flex items-center gap-4"><FiLinkedin /> Linkedin</a></li>
              <li><a href="#" className="flex items-center gap-4"><FiFacebook /> Facebook</a></li>
            </ul>
            <div className="col-span-5 row-span-1 justify-self-end self-end text-right text-xl leading-8 text-display font-medium font-display tracking-tight">
              ©Copyright 2021<br />
              Designed and crafted by Tuan
            </div>
          </section>
        </div>
      </footer>
    </div>
  );
}
