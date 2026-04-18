import React, { useState } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your AI assistant. Ask me about books!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const responses = [
        "Check out our programming section for top resources!",
        "I recommend 'Clean Code' by Robert C. Martin.",
        "Premium books require a subscription. Want to upgrade?",
        "New books added weekly! Check the browse section."
      ];
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: responses[Math.floor(Math.random() * responses.length)]
      }]);
      setLoading(false);
    }, 1000);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50"
      >
        <Bot className="h-7 w-7 text-white" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-slate-900 rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-white" />
          <h3 className="font-bold text-white">AI Assistant</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-lg">
          <X className="h-5 w-5 text-white" />
        </button>
      </div>

      <div className="h-80 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-cyan-500 text-white' 
                : 'bg-slate-800 text-slate-200'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 p-3 rounded-2xl">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask anything..."
            className="flex-1 px-4 py-2 bg-slate-800 border border-white/10 rounded-xl text-white focus:border-cyan-500 outline-none"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="p-2 bg-cyan-500 rounded-xl hover:bg-cyan-600 disabled:opacity-50"
          >
            <Send className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;