import Image, {ImageProps} from 'next/image'
interface CustomImageProps extends ImageProps {
  slug: string
}
const CustomImage = ({src, alt, slug, ...rest}: CustomImageProps) => {
  return (
    <Image
        src={require(`../../public/${slug}/${src}`).default}
        alt={alt}
        placeholder="blur"
        quality={90}
        // layout='fill'
        // objectFit="contain"
        {...rest}
      />
  )
}
export default CustomImage;