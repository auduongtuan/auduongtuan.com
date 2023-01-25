const Box = ({children, className = '', caption = null, ...rest}:{
  children:React.ReactNode,
  className?: string,
  caption?: null | string
}) => {
  return (
    <div className={`box shadow-sm bg-white p-4 h-full rounded-xl ${className}`} {...rest}>
        {caption ? 
        <div className="flex flex-col  justify-center h-full">
          <div className="flex-grow flex items-center justify-center">{children}</div>
          <h4 className='text-center font-medium'>{caption}</h4>
        </div> : children}
       
    </div>
  );
};
export const EmojiBox = ({children, emoji}:{children:React.ReactNode, emoji:string}) => {
  return (
    <Box>
      <div className='text-6xl text-center mb-4'>{emoji}</div>
      <div className='text-center'>{children}</div>
    </Box>
  );
}
export const VideoBox = ({children}:{children:React.ReactNode}) => (
  <Box className="p-2">{children}</Box>
)
export default Box;