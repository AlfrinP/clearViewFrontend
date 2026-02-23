import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  TrendingUp,
  FileText,
  AlertCircle,
  ArrowLeft,
  Shield,
} from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';

interface Source {
  title: string;
  url: string;
  snippet: string;
  domain: string;
  trust_score: number;
}

interface FactCheckResult {
  claim: string;
  verdict: string;
  confidence: number;
  policy_sources: Source[];
  external_sources: Source[];
  reasoning: string;
  conflicts_found: boolean;
}

interface ResultsDisplayProps {
  result: FactCheckResult;
  onNewCheck: () => void;
}

export function ResultsDisplay({ result, onNewCheck }: ResultsDisplayProps) {
  const getVerdictColor = (verdict: string) => {
    const v = verdict.toLowerCase();
    if (v.includes('true') && !v.includes('false')) return 'text-green-600';
    if (v.includes('false')) return 'text-red-600';
    if (v.includes('misleading') || v.includes('unverified')) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getVerdictIcon = (verdict: string) => {
    const v = verdict.toLowerCase();
    if (v.includes('true') && !v.includes('false')) return <CheckCircle2 className="size-8" />;
    if (v.includes('false')) return <XCircle className="size-8" />;
    return <AlertTriangle className="size-8" />;
  };

  const getVerdictBg = (verdict: string) => {
    const v = verdict.toLowerCase();
    if (v.includes('true') && !v.includes('false')) return 'bg-green-50 border-green-200';
    if (v.includes('false')) return 'bg-red-50 border-red-200';
    if (v.includes('misleading') || v.includes('unverified'))
      return 'bg-yellow-50 border-yellow-200';
    return 'bg-gray-50 border-gray-200';
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 0.9) return 'text-green-600';
    if (score >= 0.7) return 'text-blue-600';
    if (score >= 0.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrustScoreBadge = (score: number) => {
    if (score >= 0.9) return 'bg-green-100 text-green-800';
    if (score >= 0.7) return 'bg-blue-100 text-blue-800';
    if (score >= 0.5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const SourceCard = ({ source }: { source: Source }) => (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 mb-1">{source.title}</h4>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <span className="font-medium">{source.domain}</span>
            <Badge className={getTrustScoreBadge(source.trust_score)}>
              <Shield className="size-3 mr-1" />
              Trust: {(source.trust_score * 100).toFixed(0)}%
            </Badge>
          </div>
        </div>
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ExternalLink className="size-5" />
        </a>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{source.snippet}</p>
    </Card>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-5xl mx-auto pt-4">
        <Button onClick={onNewCheck} variant="ghost" className="mb-4 hover:bg-white/50">
          <ArrowLeft className="mr-2 size-4" />
          Check Another Fact
        </Button>

        {/* Claim Section */}
        <Card className="p-6 mb-6 shadow-lg">
          <div className="flex items-start gap-3">
            <FileText className="size-6 text-indigo-600 mt-1 shrink-0" />
            <div className="flex-1">
              <h3 className="mb-2">Claim Analyzed</h3>
              <p className="text-gray-700 leading-relaxed">{result.claim}</p>
            </div>
          </div>
        </Card>

        {/* Verdict Section */}
        <Card className={`p-8 mb-6 shadow-lg border-2 ${getVerdictBg(result.verdict)}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={getVerdictColor(result.verdict)}>
                {getVerdictIcon(result.verdict)}
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Verdict</p>
                <h2 className={getVerdictColor(result.verdict)}>{result.verdict}</h2>
              </div>
            </div>
            {result.conflicts_found && (
              <Badge className="bg-orange-100 text-orange-800 px-3 py-1">
                <AlertCircle className="size-4 mr-1" />
                Conflicts Detected
              </Badge>
            )}
          </div>

          <Separator className="my-4" />

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Confidence Level</span>
              <span className="font-semibold text-gray-900">
                {(result.confidence * 100).toFixed(0)}%
              </span>
            </div>
            <Progress value={result.confidence * 100} className="h-3" />
          </div>
        </Card>

        {/* Reasoning Section */}
        <Card className="p-6 mb-6 shadow-lg">
          <div className="flex items-start gap-3">
            <TrendingUp className="size-6 text-indigo-600 mt-1 shrink-0" />
            <div className="flex-1">
              <h3 className="mb-3">Analysis & Reasoning</h3>
              <p className="text-gray-700 leading-relaxed">{result.reasoning}</p>
            </div>
          </div>
        </Card>

        {/* Sources Section */}
        <Card className="p-6 shadow-lg">
          <h3 className="mb-4">Supporting Sources</h3>

          <Tabs defaultValue="policy" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="policy">
                Policy Sources ({result.policy_sources.length})
              </TabsTrigger>
              <TabsTrigger value="external">
                External Sources ({result.external_sources.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="policy" className="space-y-4">
              {result.policy_sources.length > 0 ? (
                result.policy_sources.map((source, index) => (
                  <SourceCard key={index} source={source} />
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No policy sources found</p>
              )}
            </TabsContent>

            <TabsContent value="external" className="space-y-4">
              {result.external_sources.length > 0 ? (
                result.external_sources.map((source, index) => (
                  <SourceCard key={index} source={source} />
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No external sources found</p>
              )}
            </TabsContent>
          </Tabs>
        </Card>

        <div className="mt-6 text-center">
          <Button onClick={onNewCheck} className="bg-indigo-600 hover:bg-indigo-700" size="lg">
            Check Another Fact
          </Button>
        </div>
      </div>
    </div>
  );
}
