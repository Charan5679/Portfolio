import { Metadata } from "next";
import { AboutClient } from "./AboutClient";

export const metadata: Metadata = {
  title: "About — Sri Charan Vagalagani",
  description: "My story, engineering philosophy, and technical journey.",
};

export default function AboutPage() {
  return <AboutClient />;
}
