import React, { useState } from 'react';
import { DailyTotal } from '../types';
import { getLatestByMember } from '../utils/dataProcessing';
import MemberCard from './MemberCard';
import Card, { CardHeader, CardTitle, CardContent } from './ui/Card';
import { Search, Users } from 'lucide-react';

interface MemberGridProps {
  data: DailyTotal[];
  showTeamInfo?: boolean;
  title?: string;
}

const MemberGrid: React.FC<MemberGridProps> = ({ data, showTeamInfo = true, title = 'Members' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'performance'>('performance');

  const latestData = getLatestByMember(data || []);

  const filteredMembers = (latestData || [])
    .filter(m => {
      if (!m) return false;
      return (m.memberName || '').toLowerCase().includes(searchTerm.toLowerCase()) || (m.teamId || '').toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      if (!a || !b) return 0;
      return sortBy === 'name' ? (a.memberName || '').localeCompare(b.memberName || '') : (b.totalSolved || 0) - (a.totalSolved || 0);
    });

  return (
    <Card hover className="bg-gradient-to-br from-surface to-surface/90 border-t-brand-500/30">
      <CardHeader className="border-b border-border/50 pb-4">
        <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xl font-display">
          <div className="flex items-center text-white">
            <div className="p-2 rounded-lg bg-brand-500/10 mr-3">
              <Users className="h-5 w-5 text-brand-400" />
            </div>
            {title} <span className="ml-2 text-textMuted text-sm font-semibold bg-white/5 px-2 py-0.5 rounded-full border border-border/50">{filteredMembers.length}</span>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <label className="text-xs font-semibold text-textMuted uppercase tracking-wider mr-2 hidden sm:block">Sort</label>
            <div className="relative">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'name' | 'performance')} className="appearance-none px-4 py-2 bg-white/5 border border-border rounded-lg focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/30 text-white transition-all cursor-pointer text-sm font-medium pr-8">
                <option value="performance" className="bg-surface text-white">By Performance</option>
                <option value="name" className="bg-surface text-white">By Name</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-textMuted">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-6 group">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-textMuted group-focus-within:text-brand-400 transition-colors" />
            <input type="text" placeholder="Search members or teams..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 w-full px-4 py-3 bg-white/5 border border-border rounded-xl focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/30 text-white placeholder-textMuted/50 transition-all font-medium" />
          </div>
        </div>

        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMembers.map((member, index) => (
              <MemberCard key={`${member.memberId}-${member.date}`} member={member} rank={sortBy === 'performance' ? index + 1 : undefined} showTeamInfo={showTeamInfo} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-surface/50 border border-border/50 border-dashed rounded-xl">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
              <Users className="h-8 w-8 text-textMuted" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No members found</h3>
            <p className="text-textMuted max-w-sm mx-auto">{searchTerm ? 'Try adjusting your search terms.' : 'No member data available.'}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MemberGrid;
