import { Metadata } from "next";
import { ContactClient } from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact — Sri Charan Vagalagani",
  description: "Get in touch for roles, consulting, and collaboration.",
};

export default function ContactPage() {
  return <ContactClient />;
}
