import { Globe, Megaphone, Scale, type LucideIcon } from "lucide-react";

export type RoleKey = "socialMedia" | "website" | "legal";

export type CareerRole = {
  key: RoleKey;
  /** English role title, used in the email subject so the inbox can be filtered consistently. */
  subjectTitle: string;
  icon: LucideIcon;
};

/**
 * Open roles shown on /careers. Titles and descriptions live in messages/*.json
 * under Careers.roles.<key>. Only add details the Trust has confirmed
 * (no salaries, deadlines or eligibility unless provided).
 */
export const careerRoles: CareerRole[] = [
  { key: "socialMedia", subjectTitle: "Social Media Manager", icon: Megaphone },
  { key: "website", subjectTitle: "Website Manager", icon: Globe },
  { key: "legal", subjectTitle: "Legal Consultant", icon: Scale },
];
