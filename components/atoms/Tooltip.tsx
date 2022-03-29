
import React, { ReactElement, useState } from 'react';
import {useFloating, offset, shift} from '@floating-ui/react-dom';
import { Transition } from '@headlessui/react';
export interface TooltipProps {
  content?: string;
  children?: ReactElement;
}
const Tooltip = ({content, children}: TooltipProps) => {
  const [show, setShow] = useState(false);
  const {x, y, reference, floating, strategy} = useFloating({
    placement: 'top',
    middleware: [shift(), offset(4)],
  });
  const handleMouseEnter = (e) => setShow(true);
  const handleMouseLeave = (e) => setShow(false);

  const childrenWithProps = React.cloneElement(children as ReactElement, { ref: reference, onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave });
 
  return (
    <React.Fragment>
      {childrenWithProps}
      <Transition show={show}>
        <div
          ref={floating}
          style={{
            position: strategy,
            top: y ?? '',
            left: x ?? '',
          }}
        >
          <Transition.Child
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >

            <div className="bg-blue-800 text-white font-medium px-2 py-1 text-sm rounded-lg shadow-md transition-all ease duration-300">{content}</div>
          </Transition.Child>

        </div>
      </Transition>
    </React.Fragment>
  );
}
export default Tooltip;