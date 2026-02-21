import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { FactCheckingPage } from './components/FactCheckingPage';
import { DocumentUploadPage } from './components/DocumentUploadPage';
import { HistoryPage } from './components/HistoryPage';
import { SettingsPage } from './components/SettingsPage';
import { LoginPage } from './components/LoginPage';

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

interface ConversationHistoryItem extends FactCheckResult {
  id: string;
  timestamp: Date;
}

type ActivePage = 'fact-check' | 'upload' | 'history' | 'settings';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [activePage, setActivePage] = useState<ActivePage>('fact-check');
  const [conversations, setConversations] = useState<ConversationHistoryItem[]>([]);
  const [loadedConversation, setLoadedConversation] = useState<FactCheckResult | null>(null);

  // Load conversations from localStorage on mount
  useEffect(() => {
    const savedConversations = localStorage.getItem('factcheck_conversations');
    if (savedConversations) {
      const parsed = JSON.parse(savedConversations);
      // Convert timestamp strings back to Date objects
      const withDates = parsed.map((conv: any) => ({
        ...conv,
        timestamp: new Date(conv.timestamp),
      }));
      setConversations(withDates);
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('factcheck_conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  const handleLogin = (email: string, name: string) => {
    setIsAuthenticated(true);
    setUserEmail(email);
    setUserName(name);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserName('');
    setUserEmail('');
    setActivePage('fact-check');
  };

  const handleSaveConversation = (result: FactCheckResult) => {
    const newConversation: ConversationHistoryItem = {
      ...result,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };
    setConversations(prev => [newConversation, ...prev]);
  };

  const handleLoadConversation = (id: string) => {
    const conversation = conversations.find(conv => conv.id === id);
    if (conversation) {
      setLoadedConversation(conversation);
      setActivePage('fact-check');
    }
  };

  const handleNavigate = (page: ActivePage) => {
    setActivePage(page);
    setLoadedConversation(null);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        onLoadConversation={handleLoadConversation}
        conversations={conversations}
        userName={userName}
        onLogout={handleLogout}
      />

      {/* Main Content - Add left margin to account for sidebar */}
      <main className="flex-1 transition-all duration-300 md:ml-80">
        {activePage === 'fact-check' && (
          <FactCheckingPage
            onSaveConversation={handleSaveConversation}
            loadedResult={loadedConversation}
          />
        )}
        {activePage === 'upload' && <DocumentUploadPage />}
        {activePage === 'history' && (
          <HistoryPage conversations={conversations} onLoadConversation={handleLoadConversation} />
        )}
        {activePage === 'settings' && <SettingsPage userName={userName} userEmail={userEmail} />}
      </main>
    </div>
  );
}
