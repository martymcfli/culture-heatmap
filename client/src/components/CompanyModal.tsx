'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { type Company } from './Bubble3DChart';

interface CompanyModalProps {
  company: Company | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CompanyModal({ company, isOpen, onClose }: CompanyModalProps) {
  if (!company) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">{company.name}</DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-sm text-slate-400">{company.industry}</div>

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

          <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
            See More Details
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
