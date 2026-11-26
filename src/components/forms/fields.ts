import type messages from "../../../messages/en.json";

export type FormMsg = keyof (typeof messages)["Form"];

export type FieldKey = "name" | "email" | "phone" | "message" | "help";
export type FormKey = "contact" | "volunteer";

type BaseField = { name: FieldKey; label: FormMsg; required: boolean };

export type FieldConfig =
  | (BaseField & { kind: "text" | "email" | "tel"; autoComplete: string; error: FormMsg })
  | (BaseField & { kind: "textarea"; error: FormMsg })
  | (BaseField & { kind: "select"; options: FormMsg[] });

export const contactFields: FieldConfig[] = [
  { name: "name", kind: "text", label: "name", required: true, error: "errorName", autoComplete: "name" },
  { name: "email", kind: "email", label: "email", required: true, error: "errorEmail", autoComplete: "email" },
  { name: "message", kind: "textarea", label: "message", required: true, error: "errorMessage" },
];

export const volunteerFields: FieldConfig[] = [
  { name: "name", kind: "text", label: "fullName", required: true, error: "errorName", autoComplete: "name" },
  { name: "phone", kind: "tel", label: "phone", required: true, error: "errorPhone", autoComplete: "tel" },
  {
    name: "help",
    kind: "select",
    label: "help",
    required: false,
    options: ["helpAnna", "helpAkshara", "helpArogya", "helpAny"],
  },
];
