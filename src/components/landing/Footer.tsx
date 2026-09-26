import React from 'react';
import { AuraLogo } from '../common/AuraLogo';
import { Github, Twitter, Linkedin, Heart } from 'lucide-react';

export const Footer: React.FC<{
  onStartChat: () => void;
  onOpenSecurity: () => void;
}> = ({ onStartChat, onOpenSecurity }) => {
  return (
    <footer className="bg-[#070709] border-t border-white/10 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <AuraLogo size="md" showTagline={true} />
            <p className="text-sm text-[#9A9AA3] max-w-sm leading-relaxed">
              A next-generation conversational AI platform engineered with Apple-level minimalism, Linear-style polish, and multi-turn contextual memory.
            </p>
            <div className="flex items-center gap-3 pt-2 text-[#9A9AA3]">
              <span className="p-2 rounded-lg bg-white/5 border border-white/5 hover:text-white cursor-pointer transition-colors">
                <Twitter className="w-4 h-4" />
              </span>
              <span className="p-2 rounded-lg bg-white/5 border border-white/5 hover:text-white cursor-pointer transition-colors">
                <Github className="w-4 h-4" />
              </span>
              <span className="p-2 rounded-lg bg-white/5 border border-white/5 hover:text-white cursor-pointer transition-colors">
                <Linkedin className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-semibold mb-4">
              Product
            </h4>
            <ul className="space-y-2.5 text-sm text-[#9A9AA3]">
              <li>
                <button onClick={onStartChat} className="hover:text-white transition-colors cursor-pointer">
                  AURA Chat
                </button>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Capabilities
                </a>
              </li>
              <li>
                <a href="#intelligence" className="hover:text-white transition-colors">
                  Neural Models
                </a>
              </li>
              <li>
                <button onClick={onOpenSecurity} className="hover:text-white transition-colors cursor-pointer">
                  Security
                </button>
              </li>
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-semibold mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5 text-sm text-[#9A9AA3]">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Documentation</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">API Integration</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Prompt Engineering</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Release Notes</span>
              </li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-semibold mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm text-[#9A9AA3]">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">About AURA</span>
              </li>
              <li>
                <button onClick={onOpenSecurity} className="hover:text-white transition-colors cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Contact Lab</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9A9AA3]">
          <div>
            © 2026 AURA AI. Built for the next generation of intelligent work.
          </div>
          <div className="flex items-center gap-1">
            <span>Powered by</span>
            <span className="font-semibold text-white">Gemini 3.8 Intelligence</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
