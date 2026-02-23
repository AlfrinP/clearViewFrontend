import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Textarea } from '../../../components/ui/textarea';
import { Card } from '../../../components/ui/card';
import { ResultsDisplay } from '../../../components/ResultsDisplay';

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
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<FactCheckResult | null>(loadedResult || null);

  // Update result when loadedResult changes
  useEffect(() => {
    if (loadedResult) {
      setResult(loadedResult);
    }
  }, [loadedResult]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!claim.trim()) return;

    setIsLoading(true);
    setResult(null);

    // Simulate API call - Replace with your actual API endpoint
    try {
      // Mock API call - replace this with:
      // const response = await fetch('YOUR_API_ENDPOINT', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ claim })
      // });
      // const data = await response.json();

      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock response - this will be replaced with actual API response
      const mockResult: FactCheckResult = {
        claim: claim,
        verdict: 'Mostly True',
        confidence: 0.85,
        policy_sources: [
          {
            title: 'CDC Guidelines on COVID-19 Vaccination',
            url: 'https://www.cdc.gov/coronavirus/2019-ncov/vaccines/',
            snippet:
              'The CDC recommends COVID-19 vaccines for everyone ages 6 months and older. Vaccines are safe and effective at preventing serious illness.',
            domain: 'cdc.gov',
            trust_score: 0.95,
          },
          {
            title: 'FDA COVID-19 Vaccine Authorization',
            url: 'https://www.fda.gov/emergency-preparedness-and-response/coronavirus-disease-2019-covid-19/covid-19-vaccines',
            snippet:
              'FDA has authorized and approved COVID-19 vaccines after thorough testing and review of safety data.',
            domain: 'fda.gov',
            trust_score: 0.98,
          },
        ],
        external_sources: [
          {
            title: 'Johns Hopkins Medicine: COVID-19 Vaccines',
            url: 'https://www.hopkinsmedicine.org/health/conditions-and-diseases/coronavirus/covid-19-vaccines',
            snippet:
              'COVID-19 vaccines are safe and have been extensively tested. They significantly reduce the risk of severe illness.',
            domain: 'hopkinsmedicine.org',
            trust_score: 0.92,
          },
          {
            title: 'Mayo Clinic: COVID-19 Vaccine Facts',
            url: 'https://www.mayoclinic.org/diseases-conditions/coronavirus/in-depth/coronavirus-vaccine/art-20484859',
            snippet:
              'COVID-19 vaccines have undergone rigorous testing and continue to be monitored for safety.',
            domain: 'mayoclinic.org',
            trust_score: 0.9,
          },
        ],
        reasoning:
          'The claim aligns with current medical consensus and government health agency guidelines. Multiple authoritative sources, including the CDC and FDA, confirm that COVID-19 vaccines have undergone extensive safety testing and continue to be monitored. While no medical intervention is completely without risk, the evidence strongly supports the safety profile of authorized COVID-19 vaccines.',
        conflicts_found: false,
      };

      setResult(mockResult);
      if (onSaveConversation) {
        onSaveConversation(mockResult);
      }
    } catch (error) {
      console.error('Error checking fact:', error);
      // Handle error state here
    } finally {
      setIsLoading(false);
    }
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
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              size="lg"
              disabled={!claim.trim() || isLoading}
            >
              {isLoading ? (
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

          {isLoading && (
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
