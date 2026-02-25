import React, { useState } from 'react';

interface TeamComparison {
  teamId?: string;
  teamName: string;
  deptName: string;
  sectionName: string;
  members: number;
  totalSolved: number;
  avgPerMember: number;
  topPerformer: string;
  topPerformerScore: number;
  teamLeadName?: string;
  teamLeadScore?: number;
}

import { TrendingUp, Users, Trophy, Crown } from 'lucide-react';

interface TeamComparisonTableProps {
  data: TeamComparison[];
}

const TeamComparisonTable: React.FC<TeamComparisonTableProps> = ({ data }) => {
  const [sortField, setSortField] = useState<keyof TeamComparison>('totalSolved');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof TeamComparison) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection(field === 'totalSolved' || field === 'avgPerMember' ? 'desc' : 'asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortField] as any;
    const bValue = b[sortField] as any;
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    return 0;
  });

  const getPerformanceColor = (value: number, max: number) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    if (percentage >= 80) return 'text-green-600 bg-green-50';
    if (percentage >= 60) return 'text-blue-600 bg-blue-50';
    if (percentage >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  if (!data.length) {
    return <div className="text-center py-8 text-gray-500">No team comparison data available</div>;
  }

  const maxTotal = Math.max(...data.map(d => d.totalSolved));
  const maxAvg = Math.max(...data.map(d => d.avgPerMember));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-surface/50 border border-border/50 rounded-xl p-5 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-colors pointer-events-none"></div>
          <div className="flex items-center relative z-10">
            <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 mr-4">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-textMuted uppercase tracking-wider mb-1">Total Teams</p>
              <p className="text-3xl font-display font-bold text-white leading-none">{data.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-surface/50 border border-border/50 rounded-xl p-5 relative overflow-hidden group hover:border-green-500/30 transition-colors">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-500/10 rounded-full blur-xl group-hover:bg-green-500/20 transition-colors pointer-events-none"></div>
          <div className="flex items-center relative z-10">
            <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20 mr-4">
              <Trophy className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-textMuted uppercase tracking-wider mb-1">Best Team</p>
              <p className="text-xl font-bold text-white mb-0.5 leading-none truncate max-w-[120px]" title={sortedData[0]?.teamName}>{sortedData[0]?.teamName || 'N/A'}</p>
              <p className="text-xs font-medium text-green-400">{sortedData[0]?.totalSolved.toLocaleString()} solved</p>
            </div>
          </div>
        </div>
        <div className="bg-surface/50 border border-border/50 rounded-xl p-5 relative overflow-hidden group hover:border-purple-500/30 transition-colors">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition-colors pointer-events-none"></div>
          <div className="flex items-center relative z-10">
            <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 mr-4">
              <TrendingUp className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-textMuted uppercase tracking-wider mb-1">Avg Performance</p>
              <p className="text-3xl font-display font-bold text-white leading-none">{Math.round(data.reduce((s, t) => s + t.avgPerMember, 0) / data.length)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border/50 bg-surface/30">
        <table className="min-w-full divide-y divide-border/50 text-sm">
          <thead className="bg-surface/80 backdrop-blur-sm">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-textMuted uppercase tracking-wider cursor-pointer hover:bg-white/5 transition-colors group" onClick={() => handleSort('teamName')}>
                <div className="flex items-center gap-1">Team <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">↕</span></div>
              </th>
              <th className="px-6 py-4 text-left font-semibold text-textMuted uppercase tracking-wider cursor-pointer hover:bg-white/5 transition-colors group" onClick={() => handleSort('members')}>
                <div className="flex items-center gap-1">👥 Members <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">↕</span></div>
              </th>
              <th className="px-6 py-4 text-left font-semibold text-textMuted uppercase tracking-wider cursor-pointer hover:bg-white/5 transition-colors group" onClick={() => handleSort('totalSolved')}>
                <div className="flex items-center gap-1">✅ Total <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">↕</span></div>
              </th>
              <th className="px-6 py-4 text-left font-semibold text-textMuted uppercase tracking-wider cursor-pointer hover:bg-white/5 transition-colors group" onClick={() => handleSort('avgPerMember')}>
                <div className="flex items-center gap-1">📊 Average <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">↕</span></div>
              </th>
              <th className="px-6 py-4 text-left font-semibold text-textMuted uppercase tracking-wider">👑 Team Lead</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {sortedData.map((team) => (
              <tr key={team.teamName} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-bold text-white group-hover:text-brand-400 transition-colors mb-0.5">{team.teamName}</div>
                  <div className="text-xs font-medium text-textMuted flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> {team.sectionName}
                    <span className="mx-1 opacity-50">•</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> {team.deptName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-white">{team.members}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 rounded inline-flex items-center text-xs font-bold border ${getPerformanceColor(team.totalSolved, maxTotal)}`}>
                    {team.totalSolved.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 rounded inline-flex items-center text-xs font-bold border ${getPerformanceColor(team.avgPerMember, maxAvg)}`}>
                    {team.avgPerMember}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-white flex items-center h-[72px]">
                  {team.teamLeadName ? (
                    <span className="inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1.5 rounded-lg text-xs font-semibold">
                      <Crown className="h-4 w-4" /> {team.teamLeadName}
                    </span>
                  ) : <span className="text-textMuted px-3">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamComparisonTable;
