"use client";
import { MdOutlineSwipe } from "react-icons/md";
import Button from "@atoms/Button";
import { Transition } from "@headlessui/react";
import Balancer from "react-wrap-balancer";
import { useInstructionStore } from "./instructionStore";
import { usePhotoStore } from "./photoStore";
import { useEffect, useState } from "react";
import { trackEvent } from "@lib/utils";
import { useRouter } from "next/router";

// Instruction Overlay Component
export const InstructionOverlay = () => {
  const {
    hasSeenInstruction,
    markInstructionAsSeen,
    showInstruction,
    setShowInstruction,
  } = useInstructionStore();
  const router = useRouter();

  const handleClose = () => {
    markInstructionAsSeen();
    setShowInstruction(false);
    trackEvent({
      event: "photo_instruction_close",
      page: router.pathname,
    });
  };

  const { isExpanded } = usePhotoStore();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(!hasSeenInstruction && showInstruction && !isExpanded);
  }, [showInstruction, hasSeenInstruction, isExpanded]);

  return (
    <Transition show={show}>
      <div className="absolute inset-0 z-30 flex h-full items-center justify-center transition-opacity data-closed:opacity-0 data-enter:duration-100 data-leave:duration-100">
        <div className="animate-shadow-grow absolute inset-0 top-1/2 left-1/2 h-[calc(100%-50px)] w-[calc(100%-10px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 blur-2xl" />
        <div className="text-primary z-1 mx-4 flex max-w-md flex-col items-center">
          <div className="flex items-center justify-center text-4xl">
            <MdOutlineSwipe className="animate-hand-wave text-accent origin-bottom" />
          </div>
          <h3 className="mt-4 text-center text-xl font-bold">
            How to interact
          </h3>
          <Balancer className="mt-2 text-center" as="p">
            Swipe left/right/top to give reactions to this photo (just like
            Tinder)
          </Balancer>

          <Button onClick={handleClose} className="mt-4">
            Got it
          </Button>
        </div>
      </div>
    </Transition>
  );
};
