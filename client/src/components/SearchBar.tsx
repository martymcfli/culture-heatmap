import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Clock, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

interface SearchBarProps {
  onCompanySelect?: (companyId: number) => void;
  maxSuggestions?: number;
}

export default function SearchBar({ onCompanySelect, maxSuggestions = 5 }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const { data: searchResults, isLoading } = trpc.companies.search.useQuery(query, {
    enabled: query.length > 1,
  });

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setShowDropdown(true);

    // Save to recent searches
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const handleCompanySelect = (companyId: number, companyName: string) => {
    handleSearch(companyName);
    if (onCompanySelect) {
      onCompanySelect(companyId);
    }
    setShowDropdown(false);
  };

  const displayResults = query.length > 1 ? searchResults : [];
  const displayRecent = query.length === 0 ? recentSearches : [];

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Input
          placeholder="Search companies..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          className="w-full bg-white/5 border-white/10 text-foreground placeholder:text-foreground/40 focus:border-blue-400/50"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-blue-400" />
        )}
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 border border-white/10 backdrop-blur-md rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {/* Search Results */}
          {displayResults && displayResults.length > 0 && (
            <>
              <div className="px-4 py-2 text-xs font-semibold text-foreground/60 uppercase tracking-wider">
                Results
              </div>
              {displayResults.slice(0, maxSuggestions).map((company: any) => (
                <button
                  key={company.id}
                  onClick={() => handleCompanySelect(company.id, company.name)}
                  className="w-full text-left px-4 py-3 hover:bg-white/5 transition border-b border-white/5 last:border-b-0"
                >
                  <div className="font-medium text-foreground">{company.name}</div>
                  <div className="text-sm text-foreground/60">{company.industry}</div>
                </button>
              ))}
            </>
          )}

          {/* Recent Searches */}
          {displayRecent.length > 0 && (
            <>
              <div className="px-4 py-2 text-xs font-semibold text-foreground/60 uppercase tracking-wider">
                Recent Searches
              </div>
              {displayRecent.map((search, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSearch(search)}
                  className="w-full text-left px-4 py-2 hover:bg-white/5 transition flex items-center gap-2 text-foreground/80"
                >
                  <Clock className="w-4 h-4 text-foreground/40" />
                  {search}
                </button>
              ))}
              <button
                onClick={handleClearRecent}
                className="w-full text-left px-4 py-2 hover:bg-white/5 transition text-xs text-foreground/60 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear Recent
              </button>
            </>
          )}

          {/* No Results */}
          {query.length > 1 && !isLoading && (!displayResults || displayResults.length === 0) && (
            <div className="px-4 py-6 text-center text-foreground/60">
              No companies found matching "{query}"
            </div>
          )}
        </div>
      )}

      {/* Close dropdown when clicking outside */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}
