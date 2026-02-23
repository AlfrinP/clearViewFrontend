import { Search, Calendar, FileCheck } from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { useState } from 'react';

interface ConversationHistoryItem {
  id: string;
  claim: string;
  verdict: string;
  timestamp: Date;
  confidence: number;
}

interface HistoryPageProps {
  conversations: ConversationHistoryItem[];
  onLoadConversation: (id: string) => void;
}

export function HistoryPage({ conversations, onLoadConversation }: HistoryPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVerdict, setFilterVerdict] = useState<string>('all');

  const getVerdictColor = (verdict: string) => {
    const v = verdict.toLowerCase();
    if (v.includes('true') && !v.includes('false')) return 'bg-green-100 text-green-800';
    if (v.includes('false')) return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.claim.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterVerdict === 'all' || conv.verdict.toLowerCase().includes(filterVerdict);
    return matchesSearch && matchesFilter;
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-5xl mx-auto pt-4">
        <div className="mb-8">
          <h1 className="mb-2">Fact Check History</h1>
          <p className="text-gray-600">View and revisit your previous fact-checking sessions</p>
        </div>

        {/* Search and Filter */}
        <Card className="p-4 mb-6 shadow-lg flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-400" />
            <Input
              placeholder="Search claims..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setFilterVerdict('all')}
              className={
                filterVerdict === 'all' ? 'bg-indigo-600 border-indigo-600 text-white' : ''
              }
            >
              All
            </Button>
            <Button
              variant="outline"
              onClick={() => setFilterVerdict('true')}
              className={filterVerdict === 'true' ? 'bg-green-600 border-green-600 text-white' : ''}
            >
              True
            </Button>
            <Button
              variant="outline"
              onClick={() => setFilterVerdict('false')}
              className={filterVerdict === 'false' ? 'bg-red-600 border-red-600 text-white' : ''}
            >
              False
            </Button>
          </div>
        </Card>

        {/* Conversations List */}
        {filteredConversations.length > 0 ? (
          <div className="space-y-4">
            {filteredConversations.map(conv => (
              <Card
                key={conv.id}
                className="p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => onLoadConversation(conv.id)}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <h3 className="mb-2 line-clamp-2">{conv.claim}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="size-4" />
                        {formatDate(conv.timestamp)}
                      </div>
                      <span>•</span>
                      <span>Confidence: {(conv.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  <Badge className={getVerdictColor(conv.verdict)}>{conv.verdict}</Badge>
                </div>
                <Button variant="outline" size="sm" className="mt-2">
                  <FileCheck className="mr-2 size-4" />
                  View Details
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center shadow-lg">
            <div className="inline-flex items-center justify-center size-16 rounded-full bg-gray-100 mb-4">
              <Search className="size-8 text-gray-400" />
            </div>
            <h3 className="mb-2">No Results Found</h3>
            <p className="text-gray-600">
              {searchQuery || filterVerdict !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Start fact-checking to build your history'}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
