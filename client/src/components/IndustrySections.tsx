import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export const INDUSTRY_SECTIONS = {
  "Technology": [
    "Technology",
    "Cloud Computing",
    "Software",
    "Hardware",
    "Semiconductors",
    "AI/Machine Learning",
  ],
  "Finance": [
    "Finance",
    "Banking",
    "Insurance",
    "Fintech",
    "Investment",
    "Cryptocurrency",
  ],
  "Healthcare": [
    "Healthcare",
    "Healthcare Tech",
    "Biotech",
    "Pharmaceuticals",
    "Medical Devices",
    "Diagnostics",
  ],
  "Consumer": [
    "E-commerce",
    "Retail",
    "Consumer Goods",
    "Food & Beverage",
    "Hospitality",
    "Travel",
  ],
  "Media & Entertainment": [
    "Media",
    "Entertainment",
    "Gaming",
    "Streaming",
    "Publishing",
    "Advertising",
  ],
  "Other": [
    "Automotive",
    "Manufacturing",
    "Energy",
    "Utilities",
    "Telecommunications",
    "Transportation",
  ],
};

interface IndustrySectionsProps {
  selectedIndustry?: string;
  onSelectIndustry: (industry: string) => void;
}

export default function IndustrySections({
  selectedIndustry,
  onSelectIndustry,
}: IndustrySectionsProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(Object.keys(INDUSTRY_SECTIONS))
  );

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold text-slate-900 mb-4">Industries</h3>
      <div className="space-y-2">
        {Object.entries(INDUSTRY_SECTIONS).map(([section, industries]) => (
          <div key={section}>
            <button
              onClick={() => toggleSection(section)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 transition text-sm font-medium text-slate-700"
            >
              <span>{section}</span>
              {expandedSections.has(section) ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {expandedSections.has(section) && (
              <div className="pl-4 space-y-1 mt-1">
                {industries.map((industry) => (
                  <button
                    key={industry}
                    onClick={() => onSelectIndustry(industry)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                      selectedIndustry === industry
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {industry}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
