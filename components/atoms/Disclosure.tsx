import { Disclosure as HeadlessDisclosure } from '@headlessui/react'
import {FiChevronDown, FiChevronRight} from 'react-icons/fi';
import IconButton from './IconButton';
const Disclosure = ({title, children, className=''}:{title: React.ReactNode, children:React.ReactNode, className?: string}) => {
  return (
    <HeadlessDisclosure>
      {({ open }) => (
        <div className={`${className}`}>
        <HeadlessDisclosure.Button className={`py-2 px-4 -my-2 -mx-4 w-full body-text flex rounded-md items-center hover:bg-gray-100 font-semibold`}>
          <span className='mr-2'>{open ? <FiChevronDown /> : <FiChevronRight />}</span>
          <div>{title}</div>
        </HeadlessDisclosure.Button>
        <HeadlessDisclosure.Panel className="pl-7">
          {children}
        </HeadlessDisclosure.Panel>
        </div>
      )}
    </HeadlessDisclosure>
  )
}
export default Disclosure;