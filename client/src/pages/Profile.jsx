import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../context/AuthContext';
import { ArrowLeft, User, Mail, Calendar, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>

        <div className="bg-slate-800/50 rounded-2xl border border-white/10 p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="h-24 w-24 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{user?.username || 'User'}</h1>
              <p className="text-slate-400 flex items-center gap-2">
                <Mail size={16} />
                {user?.email || 'No email'}
              </p>
              <span className="inline-block mt-2 px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm capitalize">
                {user?.role || 'User'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
              <label className="text-slate-400 text-sm block mb-2">Username</label>
              <div className="flex items-center gap-3">
                <User size={18} className="text-slate-500" />
                <span className="text-lg">{user?.username}</span>
              </div>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
              <label className="text-slate-400 text-sm block mb-2">Email</label>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-slate-500" />
                <span className="text-lg">{user?.email}</span>
              </div>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
              <label className="text-slate-400 text-sm block mb-2">Member Since</label>
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-slate-500" />
                <span className="text-lg">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
              <label className="text-slate-400 text-sm block mb-2">Subscription</label>
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-slate-500" />
                <span className="text-lg capitalize">{user?.subscriptionStatus || 'Free'}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button 
              onClick={() => toast.success('Edit profile coming soon!')}
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-xl font-semibold transition-colors"
            >
              Edit Profile
            </button>
            <button 
              onClick={() => toast.success('Password change coming soon!')}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold transition-colors"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;