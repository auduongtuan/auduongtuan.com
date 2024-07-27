import { create } from "zustand";
import { NotionProject } from "@lib/notion";

export interface ProjectState {
  project: NotionProject | null;
  projects: NotionProject[] | null;
  setProject: (project: NotionProject) => void;
  setProjects: (projects: NotionProject[]) => void;
}

const useProjectStore = create<ProjectState>((set) => ({
  project: null,
  projects: null,
  setProject: (project: NotionProject) => set((state) => ({ project })),
  setProjects: (projects: NotionProject[]) => set((state) => ({ projects })),
}));

export default useProjectStore;
