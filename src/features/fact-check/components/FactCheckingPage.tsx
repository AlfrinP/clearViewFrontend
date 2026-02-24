import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Textarea } from '../../../components/ui/textarea';
import { Card } from '../../../components/ui/card';
import { ResultsDisplay } from '../../../components/ResultsDisplay';
import { useVerifyClaim } from '../hooks/useFactCheck';
import type { VerificationResponse } from '../../../types/api';

interface FactCheckResult {
  claim: string;
  verdict: string;
  confidence: number;
  policy_sources: Array<{
    title: string;
    url: string;
    snippet: string;
    domain: string;
    trust_score: number;
  }>;
  external_sources: Array<{
    title: string;
    url: string;
    snippet: string;
    domain: string;
    trust_score: number;
  }>;
  reasoning: string;
  conflicts_found: boolean;
}

interface FactCheckingPageProps {
  onSaveConversation?: (result: FactCheckResult) => void;
  loadedResult?: FactCheckResult | null;
}

export function FactCheckingPage({ onSaveConversation, loadedResult }: FactCheckingPageProps) {
  const [claim, setClaim] = useState('');
  const [result, setResult] = useState<FactCheckResult | null>(loadedResult || null);

  const { mutate: verifyClaim, isPending } = useVerifyClaim({
    onSuccess: (data: VerificationResponse) => {
      // Transform API response to match component interface
      const transformedResult: FactCheckResult = {
        claim: data.claim,
        verdict: data.verdict,
        confidence: data.confidence,
        policy_sources: data.policy_sources.map(source => ({
          title: source.title || '',
          url: source.url || '',
          snippet: source.snippet || '',
          domain: source.domain || '',
          trust_score: source.trust_score || 0,
        })),
        external_sources: data.external_sources.map(source => ({
          title: source.title || '',
          url: source.url || '',
          snippet: source.snippet || '',
          domain: source.domain || '',
          trust_score: source.trust_score || 0,
        })),
        reasoning: data.reasoning,
        conflicts_found: data.conflicts_found,
      };

      setResult(transformedResult);
      
      if (onSaveConversation) {
        onSaveConversation(transformedResult);
      }
    },
  });

  // Update result when loadedResult changes
  useEffect(() => {
    if (loadedResult) {
      setResult(loadedResult);
    }
  }, [loadedResult]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!claim.trim()) return;

    setResult(null);
    verifyClaim({ claim: claim.trim() });
  };

  const handleNewCheck = () => {
    setResult(null);
    setClaim('');
  };

  if (result) {
    return <ResultsDisplay result={result} onNewCheck={handleNewCheck} />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto pt-4">
        <div className="text-center mb-8">
          <h1 className="mb-2">Fact Checker</h1>
          <p className="text-gray-600">
            Enter a claim below and we'll verify it against trusted sources
          </p>
        </div>

        <Card className="p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="claim" className="block mb-2">
                Enter Claim to Verify
              </label>
              <Textarea
                id="claim"
                placeholder="e.g., COVID-19 vaccines are safe and effective..."
                value={claim}
                onChange={e => setClaim(e.target.value)}
                className="min-h-[150px] resize-none"
                disabled={isPending}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              size="lg"
              disabled={!claim.trim() || isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-5 animate-spin" />
                  Analyzing Claim...
                </>
              ) : (
                <>
                  <Search className="mr-2 size-5" />
                  Check Fact
                </>
              )}
            </Button>
          </form>

          {isPending && (
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-center text-gray-600">
                <Loader2 className="mr-3 size-6 animate-spin text-indigo-600" />
                <span>Processing your claim...</span>
              </div>
              <div className="space-y-2 text-sm text-gray-500 text-center">
                <p>• Searching policy databases</p>
                <p>• Verifying against trusted sources</p>
                <p>• Analyzing credibility</p>
              </div>
            </div>
          )}
        </Card>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Our fact-checking system cross-references your claim with government policies, medical
            databases, and verified external sources.
          </p>
        </div>
      </div>
    </div>
  );
}
