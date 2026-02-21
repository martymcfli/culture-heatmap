import { Loader2, ExternalLink, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

interface CompanyNewsProps {
  companyId?: number;
  industryCategory?: string;
}

const getSentimentColor = (sentiment: string | null) => {
  if (!sentiment) return "bg-gray-100 text-gray-700";
  switch (sentiment.toLowerCase()) {
    case "positive":
      return "bg-green-100 text-green-700";
    case "negative":
      return "bg-red-100 text-red-700";
    case "neutral":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getSentimentIcon = (sentiment: string | null) => {
  if (!sentiment) return null;
  switch (sentiment.toLowerCase()) {
    case "positive":
      return <TrendingUp className="w-4 h-4" />;
    case "negative":
      return <TrendingDown className="w-4 h-4" />;
    default:
      return null;
  }
};

export default function CompanyNews({ companyId, industryCategory }: CompanyNewsProps) {
  const { data: companyNews, isLoading: companyLoading } = trpc.news.getByCompany.useQuery(
    companyId || 0,
    { enabled: !!companyId }
  );

  const { data: industryNews, isLoading: industryLoading } = trpc.news.getByIndustry.useQuery(
    industryCategory || "",
    { enabled: !!industryCategory }
  );

  const news = companyNews || industryNews || [];
  const isLoading = companyLoading || industryLoading;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    );
  }

  if (!news || news.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Latest News</CardTitle>
          <CardDescription>No recent news available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest News</CardTitle>
        <CardDescription>Recent updates from the industry and company</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {news.map((article: any) => (
            <div key={article.id} className="border rounded-lg p-4 hover:bg-slate-50 transition">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-slate-900 flex-1 pr-4">{article.headline}</h4>
                {article.sentiment && (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${getSentimentColor(article.sentiment)}`}>
                    {getSentimentIcon(article.sentiment)}
                    {article.sentiment}
                  </div>
                )}
              </div>

              {article.summary && (
                <p className="text-sm text-slate-700 mb-3 line-clamp-2">{article.summary}</p>
              )}

              <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                <span>{new Date(article.publishedDate).toLocaleDateString()}</span>
                {article.sourceName && <span className="text-slate-600">{article.sourceName}</span>}
              </div>

              {article.sourceUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Read Full Article
                  </a>
                </Button>
              )}

              {article.relevanceScore && (
                <div className="mt-2 text-xs text-slate-500">
                  Relevance: {(parseFloat(article.relevanceScore) * 100).toFixed(0)}%
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
