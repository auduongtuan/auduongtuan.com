import Head from "next/head";
import { useAppContext } from "../../lib/context/AppContext";
const HeadMeta = ({title = ''}:{title?:string}) => {
  const appContext = useAppContext();
  return (
      <Head>
          <title>{title ? title+appContext.titleSeparator+appContext.webName : appContext.webName}</title>
      </Head>
  )
}
export default HeadMeta;