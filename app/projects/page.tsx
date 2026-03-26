import { Metadata } from "next";
import { ProjectsClient } from "./ProjectsClient";

export const metadata: Metadata = {
  title: "Projects — Sri Charan Vagalagani",
  description: "Featured engineering work across AI, infrastructure, and full-stack systems.",
};

export default function ProjectsPage() {
  return <ProjectsClient />;
}
