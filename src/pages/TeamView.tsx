import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { DailyTotal } from '../types';
import { getTeamStats } from '../utils/dataProcessing';

import LoadingSpinner from '../components/ui/LoadingSpinner';
import MemberGrid from '../components/MemberGrid';
import MetricCards from '../components/Metrics/MetricCards';
import { ChevronRight, GraduationCap } from 'lucide-react';

const TeamView: React.FC = () => {
  const { data: globalData, loading: globalLoading } = useData();
  const [data, setData] = useState<DailyTotal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState<string>('');

  useEffect(() => {
    const parts = window.location.pathname.split('/');
    const d = parts[2] || '';
    const s = parts[3] || '';
    const t = parts[4] || '';

    if (globalLoading) {
      setLoading(true);
      return;
    }

    if (d && s && t) {
      const teamData = globalData.filter((item: any) => item.deptId === d && item.sectionId === s && item.teamId === t);
      setData(teamData);
    }
    setLoading(false);
  }, [globalData, globalLoading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-600">Loading team data...</span>
      </div>
    );
  }

  const parts = window.location.pathname.split('/');
  const teamId = parts[4] || '';

  const filtered = selectedBatch ? data.filter(d => d.assignedBatch === selectedBatch) : data;
  const stats = getTeamStats(filtered);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in relative">
      <div className="absolute top-0 right-0 -m-8 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <nav className="flex items-center space-x-2 text-sm text-textMuted bg-surface/50 w-fit px-4 py-2 rounded-full border border-border">
        <Link to="/" className="hover:text-brand-400 transition-colors">Dashboard</Link>
        <ChevronRight className="h-4 w-4" />
        <Link to="/teams" className="hover:text-brand-400 transition-colors">Teams</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-semibold text-textMain flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-500"></div> {teamId}
        </span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div className="glass-card rounded-2xl p-8 relative overflow-hidden flex-1 border border-white/5">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-accent-purple/10 opacity-50"></div>
          <div className="relative z-10 w-full flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-2 tracking-tight">
                {teamId} Overview
              </h1>
              <p className="text-textMuted text-lg max-w-xl">In-depth performance metrics and roster for the selected team.</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl border border-border/50 p-2 md:w-64 shrink-0 h-fit bg-surface/80 backdrop-blur-sm">
          <label className="block text-xs font-semibold uppercase tracking-wider text-textMuted mb-2 px-2 pt-2 flex items-center"><GraduationCap className="h-3.5 w-3.5 mr-1" />Batch Filter</label>
          <div className="relative">
            <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} className="w-full appearance-none px-4 py-2.5 bg-white/5 border border-white/5 rounded-lg focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/30 text-white transition-all cursor-pointer font-medium text-sm">
              <option value="" className="bg-surface text-white">All Batches</option>
              <option value="2023-2027" className="bg-surface text-white">2023 - 2027</option>
              <option value="2024-2028" className="bg-surface text-white">2024 - 2028</option>
              <option value="2025-2029" className="bg-surface text-white">2025 - 2029</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-textMuted">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface/30 p-6 rounded-2xl border border-border/50 backdrop-blur-sm">
        <MetricCards stats={stats} />
      </div>

      <div className="mt-8">
        <MemberGrid data={filtered} showTeamInfo={false} title={`${teamId} Members ${selectedBatch ? '• ' + selectedBatch : ''}`} />
      </div>
    </div>
  );
};

export default TeamView;
