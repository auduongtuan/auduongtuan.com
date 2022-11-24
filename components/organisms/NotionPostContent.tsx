const parse = (postContent) => {
  return postContent && postContent.length > 0 ? postContent.map(block => {
    switch(block.type) {
      case 'paragraph': 
        if (!block.paragraph.rich_text[0]?.plain_text) return null;
        return <p key={block.id}>{block.paragraph.rich_text[0]?.plain_text}</p>
      case 'image':
          return <p key={block.id}><img className="max-w-full text-center" src={block.image.file.url} alt={block.image.alt} /></p>
      case 'heading_2':
        return <h2 className="h3" key={block.id}>{block.heading_2.rich_text[0]?.plain_text}</h2>
      default:
        return null;
    }
    }) : null;
}
const NotionPostContent = ({ postContent }) => {
  return parse(postContent);
}
export default NotionPostContent;