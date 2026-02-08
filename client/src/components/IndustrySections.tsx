import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Check, X } from "lucide-react";
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
  selectedIndustries?: string[];
  onSelectIndustry: (industries: string[]) => void;
}

export default function IndustrySections({
  selectedIndustries = [],
  onSelectIndustry,
}: IndustrySectionsProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
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

  const toggleIndustry = (industry: string) => {
    const newSelected = selectedIndustries.includes(industry)
      ? selectedIndustries.filter((i) => i !== industry)
      : [...selectedIndustries, industry];
    onSelectIndustry(newSelected);
  };

  const selectAll = () => {
    const allIndustries = Object.values(INDUSTRY_SECTIONS).flat();
    onSelectIndustry(allIndustries);
  };

  const clearAll = () => {
    onSelectIndustry([]);
  };

  return (
    <Card className="p-4 bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-200">Industries</h3>
        {selectedIndustries.length > 0 && (
          <span className="text-xs bg-cyan-500/30 text-cyan-300 px-2 py-1 rounded-full">
            {selectedIndustries.length} selected
          </span>
        )}
      </div>

      {selectedIndustries.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {selectedIndustries.map((industry) => (
            <div
              key={industry}
              className="inline-flex items-center gap-1 bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full text-xs border border-cyan-500/40"
            >
              <span>{industry}</span>
              <button
                onClick={() => toggleIndustry(industry)}
                className="hover:text-cyan-200 transition"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 mb-4">
        <Button
          size="sm"
          variant="outline"
          onClick={selectAll}
          className="text-xs h-7 border-slate-600 text-slate-300 hover:bg-slate-700/50"
        >
          Select All
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={clearAll}
          className="text-xs h-7 border-slate-600 text-slate-300 hover:bg-slate-700/50"
          disabled={selectedIndustries.length === 0}
        >
          Clear All
        </Button>
      </div>

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
                {industries.map((industry) => {
                  const isSelected = selectedIndustries.includes(industry);
                  return (
                    <button
                      key={industry}
                      onClick={() => toggleIndustry(industry)}
                      className={`w-full flex items-center gap-2 text-left px-3 py-2 rounded-lg text-sm transition ${
                        isSelected
                          ? "bg-cyan-500/30 text-cyan-300 font-medium border border-cyan-500/50"
                          : "text-slate-300 hover:bg-slate-700/50 hover:text-slate-100"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded border ${
                          isSelected
                            ? "bg-cyan-500/50 border-cyan-400"
                            : "border-slate-500"
                        } flex items-center justify-center`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                      {industry}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
