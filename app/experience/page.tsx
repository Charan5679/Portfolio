import { Metadata } from "next";
import { ExperienceClient } from "./ExperienceClient";

export const metadata: Metadata = {
  title: "Experience — Sri Charan Vagalagani",
  description: "Career history and engineering impact at Anthropic, Stripe, and more.",
};

export default function ExperiencePage() {
  return <ExperienceClient />;
}
