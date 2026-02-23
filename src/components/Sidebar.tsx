import { useState } from 'react';
import {
  Menu,
  X,
  Search,
  Upload,
  History,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Clock,
  FileCheck,
} from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';

interface ConversationHistoryItem {
  id: string;
  claim: string;
  verdict: string;
  timestamp: Date;
}

interface SidebarProps {
  activePage: string;
  onNavigate: (page: 'fact-check' | 'upload' | 'history' | 'settings') => void;
  onLoadConversation: (id: string) => void;
  conversations: ConversationHistoryItem[];
  userName: string;
  onLogout: () => void;
}

export function Sidebar({
  activePage,
  onNavigate,
  onLoadConversation,
  conversations,
  userName,
  onLogout,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'fact-check', label: 'Fact Check', icon: Search },
    { id: 'upload', label: 'Upload Documents', icon: Upload },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const getVerdictColor = (verdict: string) => {
    const v = verdict.toLowerCase();
    if (v.includes('true') && !v.includes('false')) return 'bg-green-100 text-green-800';
    if (v.includes('false')) return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      {isCollapsed && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden bg-white shadow-lg"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Menu className="size-5" />
        </Button>
      )}

      {/* Sidebar */}
      <aside
        data-collapsed={isCollapsed}
        className="fixed left-0 top-0 h-screen w-80 data-[collapsed=true]:w-0 md:data-[collapsed=true]:w-20 bg-white border-r shadow-lg z-40 transition-all duration-300 overflow-hidden"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              {!isCollapsed && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <FileCheck className="size-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-semibold">FactCheck Pro</h2>
                    <p className="text-xs text-gray-500">Verify claims instantly</p>
                  </div>
                </div>
              )}
              <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)}>
                {isCollapsed ? (
                  <ChevronRight className="size-5" />
                ) : (
                  <ChevronLeft className="size-5" />
                )}
              </Button>
            </div>
          </div>

          {/* User Profile */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                <User className="size-5 text-indigo-600" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{userName}</p>
                  <p className="text-xs text-gray-500">Premium Account</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-3 border-b">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'default' : 'ghost'}
                  className={`w-full justify-start mb-1 ${
                    isActive ? 'bg-indigo-600 hover:bg-indigo-700' : ''
                  } ${isCollapsed ? 'justify-center px-2' : ''}`}
                  onClick={() => onNavigate(item.id as any)}
                >
                  <Icon className={`size-5 ${isCollapsed ? '' : 'mr-3'}`} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Button>
              );
            })}
          </nav>

          {/* Recent Conversations */}
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="p-3 pb-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Clock className="size-4" />
                  Recent Checks
                </div>
              </div>
              <ScrollArea className="flex-1 px-3">
                <div className="space-y-2 pb-3">
                  {conversations.length > 0 ? (
                    conversations.map(conv => (
                      <button
                        key={conv.id}
                        onClick={() => onLoadConversation(conv.id)}
                        className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                      >
                        <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
                          {conv.claim}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge className={`text-xs ${getVerdictColor(conv.verdict)}`}>
                            {conv.verdict}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(conv.timestamp)}
                          </span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-8">No recent checks</p>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Logout */}
          <div className="p-3 border-t">
            <Button
              variant="ghost"
              className={`w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 ${
                isCollapsed ? 'justify-center px-2' : ''
              }`}
              onClick={onLogout}
            >
              <LogOut className={`size-5 ${isCollapsed ? '' : 'mr-3'}`} />
              {!isCollapsed && <span>Logout</span>}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
