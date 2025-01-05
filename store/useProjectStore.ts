import { create } from "zustand";
import { Project } from "@lib/notion";

export interface ProjectState {
  project: Project | null;
  projects: Project[] | null;
  setProject: (project: Project) => void;
  setProjects: (projects: Project[]) => void;
}

const useProjectStore = create<ProjectState>((set) => ({
  project: null,
  projects: null,
  setProject: (project: Project) => set((state) => ({ project })),
  setProjects: (projects: Project[]) => set((state) => ({ projects })),
}));

export default useProjectStore;
