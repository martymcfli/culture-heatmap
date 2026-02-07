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
    new Set() // Start with all sections collapsed
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
    <Card className="p-4 bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
      <h3 className="font-semibold text-slate-200 mb-4">Industries</h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {Object.entries(INDUSTRY_SECTIONS).map(([section, industries]) => (
          <div key={section}>
            <button
              onClick={() => toggleSection(section)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-700/40 hover:bg-slate-600/60 transition text-sm font-medium text-slate-100 border border-slate-600/40 hover:border-slate-500/60"
            >
              <span>{section}</span>
              {expandedSections.has(section) ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {expandedSections.has(section) && (
              <div className="pl-4 space-y-1 mt-1 bg-slate-800/30 rounded-lg p-2">
                {industries.map((industry) => (
                  <button
                    key={industry}
                    onClick={() => onSelectIndustry(industry)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                      selectedIndustry === industry
                        ? "bg-cyan-500/30 text-cyan-300 font-medium border border-cyan-500/50"
                        : "text-slate-300 hover:bg-slate-700/50 hover:text-slate-100"
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
