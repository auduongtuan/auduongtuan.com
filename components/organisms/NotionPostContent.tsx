const parse = (postContent) => {
  return postContent.map(block => {
    switch(block.type) {
      case 'paragraph': 
        if (!block.paragraph.rich_text[0]?.plain_text) return null;
        return <p key={block.id}>{block.paragraph.rich_text[0]?.plain_text}</p>
      case 'image':
        console.log(block.image.file);
          return <p key={block.id}><img className="max-w-full" src={block.image.file.url} /></p>
      case 'heading_2':
        return <h2 className="h3" key={block.id}>{block.heading_2.rich_text[0]?.plain_text}</h2>
      default:
        return null;
    }
    });
}
const NotionPostContent = ({ postContent }) => {
  return parse(postContent);
}
export default NotionPostContent;