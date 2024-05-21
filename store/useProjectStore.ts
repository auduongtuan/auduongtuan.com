import { create } from "zustand";
import { Project } from "../lib/project";
import { NotionAssets } from "@lib/notion";

export enum PasswordProtectError {
  INCORRECT_PASSWORD = "INCORRECT_PASSWORD",
  UNKNOWN = "UNKNOWN",
}

export interface ProjectState {
  project: Project | null;
  projects: Project[] | null;
  projectAssets: NotionAssets | null;
}

const useProjectStore = create<ProjectState>((set) => ({
  project: null,
  projects: null,
  projectAssets: null,
  setProject: (project: Project) => set((state) => ({ project })),
  setProjects: (projects: Project[]) => set((state) => ({ projects })),
  setProjectAssets: (projectAssets: NotionAssets) =>
    set((state) => ({ projectAssets })),
}));

export default useProjectStore;
