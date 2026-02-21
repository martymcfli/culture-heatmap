'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export interface Company {
  id: string;
  name: string;
  industry: string;
  overallScore: number;
  workLifeBalance: number;
  turnoverRate: number;
}

interface CompanyInfoSidebarProps {
  company: Company | null;
  isPinned: boolean;
  onClose: () => void;
}

export function CompanyInfoSidebar({ company, isPinned, onClose }: CompanyInfoSidebarProps) {
  if (!company) return null;

  return (
    <div className={`fixed right-0 top-0 h-full w-96 bg-slate-900 border-l border-slate-700 shadow-lg transition-transform duration-300 ${
      company ? 'translate-x-0' : 'translate-x-full'
    } ${isPinned ? 'z-50' : 'z-40'}`}>
      <Card className="h-full rounded-none border-0 bg-slate-900 p-6 space-y-6 overflow-y-auto">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-white text-xl">{company.name}</h3>
            <p className="text-sm text-slate-400">{company.industry}</p>
          </div>
          {isPinned && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Overall Score:</span>
            <span className="text-white font-semibold">{company.overallScore.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Work-Life Balance:</span>
            <span className="text-white font-semibold">{company.workLifeBalance.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Turnover Rate:</span>
            <span className="text-white font-semibold">{(Number(company.turnoverRate) || 0).toFixed(1)}%</span>
          </div>
        </div>

        {isPinned && (
          <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
            See More Details
          </Button>
        )}

        {!isPinned && (
          <p className="text-xs text-slate-500 text-center">Click on a bubble to pin this panel</p>
        )}
      </Card>
    </div>
  );
}
