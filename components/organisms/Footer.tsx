import React from "react";
import { FiFacebook, FiGithub, FiInstagram, FiLinkedin } from "react-icons/fi";

export default function Footer() {
  return (
    <div id="contact" className="relative">
      <footer className="text-black sticky bottom-0 z-0">
        <div className="main-container pt-24 pb-40 ">
          <section className="grid grid-cols-12 grid-rows-2 gap-x-3 gap-y-12 border-t border-t-gray-500 pt-12">
             <div className="col-span-12 lg:col-span-9 row-span-2 ">
              <p className="font-display text-3xl leading-10 font-semibold">
                Send me any bussiness inquiries via <a href="mailto:hi@auduongtuan.com" className="-mx-2 px-2 py-1 rounded-xl text-blue-900 hover:bg-black/5 ">hi@auduongtuan.com</a>, or talk via other social networks
              </p>
            </div>
             <div className="col-span-12 lg:col-span-7 row-span-1 self-end text-xl leading-8 text-display font-medium ">
              Written, designed and built by Tuan
            </div>
            <ul className="col-span-12 lg:col-span-5 row-span-1 lg:justify-self-end self-start text-xl leading-8 text-display font-medium flex gap-8">
              <li><a href="#" className="-mx-2 text-xl px-2 py-1 rounded-xl text-blue-900 hover:bg-black/5 inline-flex items-center gap-2">Github</a></li>
              <li><a href="#" className="-mx-2 text-xl px-2 py-1 rounded-xl text-blue-900 hover:bg-black/5 inline-flex items-center gap-2">Instagram</a></li>
              <li><a href="#" className="-mx-2 text-xl px-2 py-1 rounded-xl text-blue-900 hover:bg-black/5 inline-flex items-center gap-2">Linkedin</a></li>
              <li><a href="#" className="-mx-2 text-xl px-2 py-1 rounded-xl text-blue-900 hover:bg-black/5 inline-flex items-center gap-2">Facebook</a></li>
            </ul>
         
   

          </section>
        </div>
      </footer>
    </div>
  );
}
