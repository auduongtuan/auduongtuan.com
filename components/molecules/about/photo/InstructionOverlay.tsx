"use client";
import { MdOutlineSwipe } from "react-icons/md";
import Button from "@atoms/Button";
import { Transition } from "@atoms/Transition";
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
    <Transition
      show={show}
      className="absolute inset-0 z-30 flex h-full items-center justify-center transition-opacity duration-100"
      asChild={false}
    >
      <div className="animate-shadow-grow absolute inset-0 top-1/2 left-1/2 h-[calc(100%-50px)] w-[calc(100%-10px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 blur-2xl" />
      <div className="text-primary z-1 mx-4 flex max-w-md flex-col items-center">
        <div className="flex items-center justify-center text-4xl">
          <MdOutlineSwipe className="animate-hand-wave text-accent origin-bottom" />
        </div>
        <h3 className="mt-4 text-center text-xl font-bold">How to interact</h3>
        <Balancer className="mt-2 text-center font-mono text-sm" as="p">
          Swipe like Tinder to react:
        </Balancer>
        <ul className="mt-1 flex flex-col gap-1 text-center font-mono text-sm">
          <li>Right/Left for Love/Haha</li>
          <li>Up/Down for Slay/Eww</li>
          <li>Double tap for Wow</li>
        </ul>

        <Button onClick={handleClose} className="mt-4">
          Got it
        </Button>
      </div>
    </Transition>
  );
};
