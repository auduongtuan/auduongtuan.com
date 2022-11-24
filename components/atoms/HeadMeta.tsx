import Head from "next/head";
import { useAppContext } from "../../lib/context/AppContext";
const HeadMeta = ({title = '', description = ''}:{title?:string, description?: string}) => {
  const appContext = useAppContext();
  const finalTitle = title ? `${title}${appContext.titleSeparator}${appContext.webName}` : appContext.webName;
  return (
      <Head>
          <title>{finalTitle}</title>
          <meta name="description" content={description} />
      </Head>
  )
}
export default HeadMeta;