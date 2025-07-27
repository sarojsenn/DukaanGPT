
"use client";

import { useTranslation } from "@/hooks/use-translation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Languages } from "lucide-react";

const languages = [
  { value: "English", label: "English" },
  { value: "Hindi", label: "हिंदी" },
  { value: "Tamil", label: "தமிழ்" },
  { value: "Marathi", label: "मराठी" },
  { value: "Bengali", label: "বাংলা" },
  { value: "Kannada", label: "ಕನ್ನಡ" },
];

export function LanguageSelector() {
  const { language, setLanguage, isTranslating } = useTranslation();

  return (
    <Select value={language} onValueChange={setLanguage} disabled={isTranslating}>
      <SelectTrigger className="w-auto gap-2 border-none focus:ring-0 bg-transparent">
        <Languages className="h-4 w-4" />
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.value} value={lang.value}>
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
