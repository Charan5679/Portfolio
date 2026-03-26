import { Metadata } from "next";
import { SkillsClient } from "./SkillsClient";

export const metadata: Metadata = {
  title: "Skills — Sri Charan Vagalagani",
  description: "Technical capabilities across AI, infrastructure, and full-stack engineering.",
};

export default function SkillsPage() {
  return <SkillsClient />;
}
