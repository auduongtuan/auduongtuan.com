
import React, { ReactElement, useState, useRef } from 'react';
import { usePopper } from 'react-popper';
import { Transition } from '@headlessui/react';
export interface TooltipProps {
  content?: string;
  children?: ReactElement;
}
const Tooltip = ({content, children}: TooltipProps) => {
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const tooltipElement = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'top',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [4, 4]
        }
      }
    ]
  });
  const handleMouseEnter = (e) => {
    setShow(true);
    // setTimeout(() => {
    //   tooltipElement.current && tooltipElement.current.classList.add('opacity-100');
    // }, 50);
  };
  const handleMouseLeave = (e) => {
    // setShow(false);
    // if (!tooltipElement.current) return;
    // tooltipElement.current.classList.remove('opacity-100');
    // tooltipElement.current.addEventListener('transitionend', () => {
      setShow(false);
    // });
  }
  
  const childrenWithProps = React.cloneElement(children as ReactElement, { ref: setReferenceElement, onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave });
 
  return (
    <React.Fragment>
      {childrenWithProps}
      <Transition show={show}>
        <div ref={setPopperElement} style={styles.popper} {...attributes.popper}>
          <Transition.Child
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >

            <div ref={tooltipElement} className="bg-blue-800 text-white font-medium px-2 py-1 text-sm rounded-lg shadow-md transition-all ease duration-300">{content}</div>
          </Transition.Child>

        </div>
      </Transition>
    </React.Fragment>
  );
}
export default Tooltip;