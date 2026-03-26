import { Metadata } from "next";
import { ResumeClient } from "./ResumeClient";

export const metadata: Metadata = {
  title: "Resume — Sri Charan Vagalagani",
  description: "Full resume — senior software engineer & AI developer.",
};

export default function ResumePage() {
  return <ResumeClient />;
}
