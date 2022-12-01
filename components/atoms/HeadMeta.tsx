import Head from "next/head";
export const titles = {
  webName: `AU DUONG TUAN`,
  titleSeparator: ` | `
};
const HeadMeta = ({title = '', description = ''}:{title?:string, description?: string}) => {
  const finalTitle = title ? `${title}${titles.titleSeparator}${titles.webName}` : titles.webName;
  return (
      <Head>
          <title>{finalTitle}</title>
          <meta name="description" content={description} />
      </Head>
  )
}
export default HeadMeta;