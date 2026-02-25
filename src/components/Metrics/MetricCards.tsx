import React from 'react';
import { TeamStats } from '../../types';
import Card from '../ui/Card';

interface MetricCardsProps {
  stats: TeamStats;
}

const MetricCards: React.FC<MetricCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card hover className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20 group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700 pointer-events-none"></div>
        <div className="p-6 relative z-10">
          <p className="text-xs font-semibold text-textMuted uppercase tracking-wider">Team Members</p>
          <p className="text-3xl font-display font-bold text-white mt-1">{stats.totalMembers}</p>
        </div>
      </Card>

      <Card hover className="bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20 group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700 pointer-events-none"></div>
        <div className="p-6 relative z-10">
          <p className="text-xs font-semibold text-textMuted uppercase tracking-wider">Total Solved</p>
          <p className="text-3xl font-display font-bold text-white mt-1">{stats.totalProblems.toLocaleString()}</p>
        </div>
      </Card>

      <Card hover className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20 group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700 pointer-events-none"></div>
        <div className="p-6 relative z-10">
          <p className="text-xs font-semibold text-textMuted uppercase tracking-wider">Average</p>
          <p className="text-3xl font-display font-bold text-white mt-1">{stats.avgPerMember}</p>
        </div>
      </Card>

      <Card hover className="bg-gradient-to-br from-yellow-500/10 to-transparent border-yellow-500/20 group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full blur-xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700 pointer-events-none"></div>
        <div className="p-6 relative z-10 flex flex-col justify-between h-full">
          <div>
            <p className="text-xs font-semibold text-textMuted uppercase tracking-wider">Top Score</p>
            <p className="text-3xl font-display font-bold text-white mt-1">{stats.topPerformerScore}</p>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm font-medium text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded truncate max-w-[120px]" title={stats.topPerformer}>{stats.topPerformer}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MetricCards;
