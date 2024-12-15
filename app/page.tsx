import { getNotionProjectsWithCache } from "@lib/notion/project";
import HomePage, { HomePageProps } from "../components/templates/home/HomePage";
import HeadMeta from "../components/atoms/HeadMeta";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "",
  description:
    "This is a personal website of AU DUONG TUAN - A software designer / developer / whatever who strives to make good things with the human at the center",
};

export default async function Page() {
  const notionProjects = await getNotionProjectsWithCache();
  return <HomePage notionProjects={notionProjects} />;
}
