import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../context/AuthContext';
import { 
  BookOpen, User, Settings, Library, Heart, History, LogOut 
} from 'lucide-react';
import AIAssistant from '../components/AI/AIAssistant';

const UserDashboard = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen w-full bg-[#0f172a] text-white">
      {/* Header */}
      <nav className="w-full bg-slate-900/50 border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-cyan-400" />
            <span className="text-xl font-bold">Knowledge Vault</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">
              Welcome, <span className="text-cyan-400 font-semibold">{user?.username || 'User'}</span>!
            </span>
            <button 
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 w-full">
        <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
        <p className="text-slate-400 mb-8">Manage your books and account</p>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/10 hover:border-cyan-500/50 transition-colors">
            <Library className="h-8 w-8 text-cyan-400 mb-4" />
            <h3 className="text-lg font-semibold mb-1">My Books</h3>
            <p className="text-3xl font-bold text-cyan-400">12</p>
            <p className="text-slate-400 text-sm">Books in your library</p>
          </div>
          
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/10 hover:border-pink-500/50 transition-colors">
            <Heart className="h-8 w-8 text-pink-400 mb-4" />
            <h3 className="text-lg font-semibold mb-1">Favorites</h3>
            <p className="text-3xl font-bold text-pink-400">5</p>
            <p className="text-slate-400 text-sm">Saved favorites</p>
          </div>
          
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/10 hover:border-green-500/50 transition-colors">
            <History className="h-8 w-8 text-green-400 mb-4" />
            <h3 className="text-lg font-semibold mb-1">Read History</h3>
            <p className="text-3xl font-bold text-green-400">8</p>
            <p className="text-slate-400 text-sm">Books completed</p>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link 
            to="/profile"
            className="flex items-center gap-4 bg-slate-800/50 p-6 rounded-2xl border border-white/10 hover:bg-slate-700/50 hover:border-cyan-500/30 transition-all"
          >
            <div className="h-12 w-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
              <User className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Edit Profile</h3>
              <p className="text-slate-400 text-sm">Update your personal information</p>
            </div>
          </Link>

          <Link 
            to="/subscription"
            className="flex items-center gap-4 bg-slate-800/50 p-6 rounded-2xl border border-white/10 hover:bg-slate-700/50 hover:border-purple-500/30 transition-all"
          >
            <div className="h-12 w-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Settings className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Subscription</h3>
              <p className="text-slate-400 text-sm">
                Plan: <span className="text-purple-400 capitalize">{user?.subscriptionStatus || 'Free'}</span>
              </p>
            </div>
          </Link>
        </div>

        {/* Recent Books */}
        <h2 className="text-xl font-semibold mb-4">Recent Books</h2>
        <div className="bg-slate-800/50 rounded-2xl border border-white/10 p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <BookOpen size={20} className="text-cyan-400" />
                </div>
                <div>
                  <p className="font-medium">React Mastery</p>
                  <p className="text-slate-500 text-sm">Programming</p>
                </div>
              </div>
              <span className="text-slate-500 text-sm">2 hours ago</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <BookOpen size={20} className="text-purple-400" />
                </div>
                <div>
                  <p className="font-medium">JavaScript Guide</p>
                  <p className="text-slate-500 text-sm">Programming</p>
                </div>
              </div>
              <span className="text-slate-500 text-sm">5 hours ago</span>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <BookOpen size={20} className="text-green-400" />
                </div>
                <div>
                  <p className="font-medium">Node.js Patterns</p>
                  <p className="text-slate-500 text-sm">Backend</p>
                </div>
              </div>
              <span className="text-slate-500 text-sm">1 day ago</span>
            </div>
          </div>
        </div>

        {/* Browse More */}
        <div className="mt-8 text-center">
          <Link 
            to="/browse"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-semibold hover:scale-105 transition-transform"
          >
            <BookOpen size={20} />
            Browse More Books
          </Link>
        </div>
      </div>

      <AIAssistant />
    </div>
  );
};

export default UserDashboard;