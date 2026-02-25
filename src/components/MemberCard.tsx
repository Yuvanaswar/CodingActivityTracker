import React from 'react';
import { Link } from 'react-router-dom';
import { DailyTotal } from '../types';
import Card from './ui/Card';
import { User, Trophy, Eye, TrendingUp, Crown } from 'lucide-react';
import Button from './ui/Button';

interface MemberCardProps {
  member: DailyTotal;
  rank?: number;
  showTeamInfo?: boolean;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, rank, showTeamInfo = true }) => {
  if (!member) return null;

  const performanceLevel =
    (member.totalSolved || 0) >= 500 ? 'high' :
      member.totalSolved >= 200 ? 'medium' :
        member.totalSolved >= 50 ? 'low' : 'minimal';

  const performanceConfig = {
    high: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
    medium: { bg: 'bg-brand-500/10', border: 'border-brand-500/30', text: 'text-brand-400' },
    low: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-500' },
    minimal: { bg: 'bg-white/5', border: 'border-border/60', text: 'text-textMuted' }
  } as const;

  const perf = performanceConfig[performanceLevel];
  const dailyTrend = member.totalDailyIncrease >= 0 ? 'positive' : 'negative';

  return (
    <Card hover className={`border bg-surface ${perf.border} transition-all duration-300 group`}>
      <div className="relative p-6">
        {/* Team lead golden glow/highlight */}
        {member.isTeamLead && (
          <div className="absolute inset-x-0 -top-3 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>
        )}

        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center w-full">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 shadow-inner border border-white/10 shrink-0 ${member.isTeamLead ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 text-yellow-500' : 'bg-white/5 text-textMuted group-hover:bg-brand-500/10 group-hover:text-brand-400 transition-colors'
              }`}>
              {member.isTeamLead ? (
                <Crown className="h-6 w-6" />
              ) : (
                <User className="h-6 w-6" />
              )}
            </div>
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white truncate transition-colors group-hover:text-brand-400">{member.memberName}</h3>
                {member.isTeamLead && (
                  <span className="inline-flex items-center justify-center bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                    <Crown className="w-3 h-3 mr-1" /> Lead
                  </span>
                )}
              </div>
              <div className="flex items-center mt-1 gap-2 flex-wrap">
                {rank && (
                  <span className={`px-2 py-0.5 rounded border inline-flex items-center text-[10px] font-bold uppercase tracking-wider ${rank <= 3 ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/40' : 'bg-white/5 text-textMuted border-border/50'}`}>
                    {rank === 1 && <Trophy className="w-3 h-3 mr-1 text-yellow-400" />}
                    {rank === 2 && <Trophy className="w-3 h-3 mr-1 text-slate-300" />}
                    {rank === 3 && <Trophy className="w-3 h-3 mr-1 text-amber-500" />}
                    Rank #{rank}
                  </span>
                )}
                {!member.isTeamLead && member.assignedTeamLead && (
                  <span className="text-xs text-brand-400/80 truncate font-medium">Under: {member.assignedTeamLead}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {showTeamInfo && (
          <div className="mb-5 flex flex-wrap gap-1.5">
            <span className="bg-brand-500/10 text-brand-400 border border-brand-500/20 px-2.5 py-1 rounded text-xs font-semibold">
              {member.teamId}
            </span>
            <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-1 rounded text-xs font-semibold">
              {member.sectionId}
            </span>
            <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-1 rounded text-xs font-semibold">
              {member.deptId}
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-surface/50 border border-border rounded-xl p-3 text-center transition-colors group-hover:border-brand-500/20">
            <div className="text-2xl font-display font-bold text-white">{member.totalSolved}</div>
            <div className="text-[10px] font-semibold text-textMuted uppercase tracking-wider mt-1">Total Solved</div>
          </div>
          <div className="bg-surface/50 border border-border rounded-xl p-3 text-center transition-colors group-hover:border-brand-500/20 relative overflow-hidden">
            {member.totalDailyIncrease > 0 && <div className="absolute top-0 right-0 w-12 h-12 bg-green-500/10 rounded-full blur-xl pointer-events-none"></div>}
            <div className={`text-2xl font-display font-bold flex items-center justify-center gap-1 ${member.totalDailyIncrease > 0 ? 'text-green-400' : 'text-textMuted'}`}>
              {member.totalDailyIncrease > 0 && '+'}{member.totalDailyIncrease}
            </div>
            <div className="text-[10px] font-semibold text-textMuted uppercase tracking-wider mt-1 flex items-center justify-center gap-1">
              <TrendingUp className={`w-3 h-3 ${dailyTrend === 'positive' ? 'text-green-500' : 'text-textMuted'}`} /> Daily Increase
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-6 bg-white/5 rounded-xl p-2.5 border border-border/50 shrink-0 text-center text-xs">
          <div className="flex flex-col items-center justify-center group/plat">
            <div className="font-bold text-white group-hover/plat:text-[#FFA500] transition-colors">{member.leetcodeTotal}</div>
            <div className="text-textMuted text-[10px] uppercase font-semibold mt-0.5">LC</div>
          </div>
          <div className="flex flex-col items-center justify-center border-l border-border/50 group/plat">
            <div className="font-bold text-white group-hover/plat:text-[#00D4AA] transition-colors">{member.skillrackTotal}</div>
            <div className="text-textMuted text-[10px] uppercase font-semibold mt-0.5">SR</div>
          </div>
          <div className="flex flex-col items-center justify-center border-l border-border/50 group/plat">
            <div className="font-bold text-white group-hover/plat:text-[#D4957A] transition-colors">{member.codechefTotal}</div>
            <div className="text-textMuted text-[10px] uppercase font-semibold mt-0.5">CC</div>
          </div>
          <div className="flex flex-col items-center justify-center border-l border-border/50 group/plat">
            <div className="font-bold text-white group-hover/plat:text-[#00EA64] transition-colors">{member.hackerrankTotal}</div>
            <div className="text-textMuted text-[10px] uppercase font-semibold mt-0.5">HR</div>
          </div>
        </div>

        <Button as={Link} to={`/individual/${member.memberId}`} className="w-full flex items-center justify-center bg-white/5 border-border hover:bg-white/10" size="sm" variant="secondary">
          <Eye className="mr-2 h-4 w-4" />
          View Complete Profile
        </Button>
      </div>
    </Card>
  );
};

export default MemberCard;