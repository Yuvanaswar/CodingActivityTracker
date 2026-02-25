import React, { useMemo, useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Link, useNavigate } from 'react-router-dom';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Trophy, Users, Search, FolderGit2, Crown, ChevronRight, BarChart3, Target, Eye } from 'lucide-react';
import { getLatestByMember, getTeamStats } from '../utils/dataProcessing';
import LoadingSpinner from '../components/ui/LoadingSpinner';


interface TeamWorkspace {
    id: string;
    name: string;
    department: string;
    deptId: string;
    section: string;
    sectionId: string;
    teamLeadName: string;
    totalProblemsSolved: number;
    avgPerMember: number;
    memberCount: number;
    topPerformer: string;
    topPerformerScore: number;
    leetcodeTotal: number;
    skillrackTotal: number;
    codechefTotal: number;
    hackerrankTotal: number;
    contributors: any[];
    lastUpdated: string;
}

const Repositories: React.FC = () => {
    const navigate = useNavigate();
    const { data, hierarchy, loading } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDept, setSelectedDept] = useState<string>('');
    const [sortBy, setSortBy] = useState<'total' | 'avg' | 'members'>('total');

    const workspaces: TeamWorkspace[] = useMemo(() => {
        if (!data || data.length === 0 || !hierarchy) return [];

        const results: TeamWorkspace[] = [];

        Object.entries(hierarchy).forEach(([deptId, dept]) => {
            Object.entries(dept.sections).forEach(([sectionId, section]) => {
                Object.entries(section.teams).forEach(([teamId, team]) => {
                    const teamData = data.filter(d => d.deptId === deptId && d.sectionId === sectionId && d.teamId === teamId);
                    if (teamData.length === 0) return;

                    const latestMembers = getLatestByMember(teamData);
                    const stats = getTeamStats(teamData);

                    // Aggregate platform totals from latest member data
                    const leetcodeTotal = latestMembers.reduce((s, m) => s + (m.leetcodeTotal || 0), 0);
                    const skillrackTotal = latestMembers.reduce((s, m) => s + (m.skillrackTotal || 0), 0);
                    const codechefTotal = latestMembers.reduce((s, m) => s + (m.codechefTotal || 0), 0);
                    const hackerrankTotal = latestMembers.reduce((s, m) => s + (m.hackerrankTotal || 0), 0);

                    // Find the most recent date across all members
                    const latestDate = latestMembers.reduce((latest, m) => {
                        const d = new Date(m.date);
                        return d > latest ? d : latest;
                    }, new Date(0));

                    results.push({
                        id: teamId,
                        name: team.name || teamId,
                        department: dept.name || deptId,
                        deptId,
                        section: section.name || sectionId,
                        sectionId,
                        teamLeadName: team.teamLeadName || stats.teamLeadName || '',
                        totalProblemsSolved: stats.totalProblems,
                        avgPerMember: stats.avgPerMember,
                        memberCount: stats.totalMembers,
                        topPerformer: stats.topPerformer,
                        topPerformerScore: stats.topPerformerScore,
                        leetcodeTotal,
                        skillrackTotal,
                        codechefTotal,
                        hackerrankTotal,
                        contributors: latestMembers,
                        lastUpdated: latestDate.toLocaleDateString()
                    });
                });
            });
        });

        return results;
    }, [data, hierarchy]);

    const filteredWorkspaces = useMemo(() => {
        let filtered = workspaces.filter(ws =>
            ws.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ws.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ws.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ws.teamLeadName.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (selectedDept) {
            filtered = filtered.filter(ws => ws.deptId === selectedDept);
        }

        // Sort
        switch (sortBy) {
            case 'avg':
                return filtered.sort((a, b) => b.avgPerMember - a.avgPerMember);
            case 'members':
                return filtered.sort((a, b) => b.memberCount - a.memberCount);
            default:
                return filtered.sort((a, b) => b.totalProblemsSolved - a.totalProblemsSolved);
        }
    }, [workspaces, searchTerm, selectedDept, sortBy]);

    // Summary stats
    const summaryStats = useMemo(() => {
        const totalProblems = workspaces.reduce((s, ws) => s + ws.totalProblemsSolved, 0);
        const totalMembers = workspaces.reduce((s, ws) => s + ws.memberCount, 0);
        const topWorkspace = workspaces.length > 0 ? workspaces.reduce((best, ws) => ws.totalProblemsSolved > best.totalProblemsSolved ? ws : best) : null;
        return { totalProblems, totalMembers, totalTeams: workspaces.length, topWorkspace };
    }, [workspaces]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    const departments = hierarchy ? Object.keys(hierarchy) : [];

    // Helper: get platform bar widths
    const getPlatformBar = (ws: TeamWorkspace) => {
        const total = ws.totalProblemsSolved || 1;
        return {
            lc: Math.round((ws.leetcodeTotal / total) * 100),
            sr: Math.round((ws.skillrackTotal / total) * 100),
            cc: Math.round((ws.codechefTotal / total) * 100),
            hr: Math.round((ws.hackerrankTotal / total) * 100),
        };
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in relative z-10">
            <div className="absolute top-0 right-0 -m-8 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-textMuted bg-surface/50 w-fit px-4 py-2 rounded-full border border-border">
                <Link to="/" className="hover:text-brand-400 transition-colors">Dashboard</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="font-semibold text-textMain flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div> Team Workspaces
                </span>
            </nav>

            {/* Hero Section */}
            <div className="glass-card rounded-2xl p-8 relative overflow-hidden group border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-brand-500/10 opacity-50"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-white mb-2 tracking-tight flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-green-500/20 shadow-inner border border-green-500/30">
                                <FolderGit2 className="h-6 w-6 text-green-400" />
                            </div>
                            Team Workspaces
                        </h1>
                        <p className="text-textMuted max-w-xl">Browse all team workspaces with real performance data — problems solved, platform breakdowns, and top performers.</p>
                    </div>

                    {/* Summary stats */}
                    <div className="flex gap-4 bg-surface/80 p-4 rounded-xl border border-border/50 backdrop-blur-sm shrink-0">
                        <div className="text-center px-4 border-r border-border/50">
                            <div className="text-2xl font-display font-bold text-white">{summaryStats.totalTeams}</div>
                            <div className="text-xs text-green-400 font-medium uppercase tracking-wider mt-1">Teams</div>
                        </div>
                        <div className="text-center px-4 border-r border-border/50">
                            <div className="text-2xl font-display font-bold text-white">{summaryStats.totalMembers}</div>
                            <div className="text-xs text-brand-400 font-medium uppercase tracking-wider mt-1">Members</div>
                        </div>
                        <div className="text-center px-4">
                            <div className="text-2xl font-display font-bold text-white">{summaryStats.totalProblems.toLocaleString()}</div>
                            <div className="text-xs text-accent-purple font-medium uppercase tracking-wider mt-1">Problems</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <Card hover className="bg-gradient-to-br from-surface to-surface/90 border-t-green-500/30">
                <CardContent className="py-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="group">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-textMuted mb-2 flex items-center transition-colors group-focus-within:text-green-400">
                                <Search className="h-3.5 w-3.5 mr-2" />Search
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-textMuted" />
                                <input
                                    type="text"
                                    placeholder="Search by team, department, leader..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-full px-4 py-3 bg-white/5 border border-border rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500/30 text-white placeholder-textMuted/50 transition-all font-medium"
                                />
                            </div>
                        </div>
                        <div className="group">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-textMuted mb-2 flex items-center transition-colors group-focus-within:text-green-400">
                                <Target className="h-3.5 w-3.5 mr-2" />Department
                            </label>
                            <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-border rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500/30 text-white transition-all cursor-pointer">
                                <option value="" className="bg-surface text-white">All Departments</option>
                                {departments.map(id => (
                                    <option key={id} value={id} className="bg-surface text-white">{hierarchy?.[id]?.name || id}</option>
                                ))}
                            </select>
                        </div>
                        <div className="group">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-textMuted mb-2 flex items-center transition-colors group-focus-within:text-green-400">
                                <BarChart3 className="h-3.5 w-3.5 mr-2" />Sort By
                            </label>
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="w-full px-4 py-3 bg-white/5 border border-border rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500/30 text-white transition-all cursor-pointer">
                                <option value="total" className="bg-surface text-white">Total Problems Solved</option>
                                <option value="avg" className="bg-surface text-white">Avg Per Member</option>
                                <option value="members" className="bg-surface text-white">Most Members</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Workspaces Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredWorkspaces.map((ws) => {
                    const bar = getPlatformBar(ws);
                    return (
                        <Card key={ws.id} hover className="bg-gradient-to-br from-surface to-surface/90 border-t-green-500/30 group cursor-pointer" onClick={() => navigate(`/team/${ws.deptId}/${ws.sectionId}/${ws.id}`)}>
                            <CardHeader className="border-b border-border/50 pb-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <CardTitle className="text-lg font-display flex items-center text-white mb-1">
                                            <div className="p-1.5 rounded-lg bg-green-500/10 mr-2.5 shrink-0">
                                                <FolderGit2 className="h-4 w-4 text-green-400" />
                                            </div>
                                            <span className="truncate">{ws.name}</span>
                                        </CardTitle>
                                        <div className="flex items-center gap-2 ml-9 flex-wrap">
                                            <span className="text-xs font-semibold text-brand-400 uppercase tracking-widest">{ws.department}</span>
                                            <span className="text-xs text-textMuted">•</span>
                                            <span className="text-xs text-textMuted">{ws.section}</span>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0 ml-4">
                                        <div className="text-xl font-display font-bold text-white">{ws.totalProblemsSolved.toLocaleString()}</div>
                                        <div className="text-[10px] text-green-400 font-semibold uppercase tracking-wider">Problems</div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-5 space-y-4">

                                {/* Stats Row */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-white/5 rounded-lg p-3 text-center border border-border/30">
                                        <div className="text-sm font-bold text-white">{ws.memberCount}</div>
                                        <div className="text-[10px] text-textMuted uppercase tracking-wider mt-0.5">Members</div>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-3 text-center border border-border/30">
                                        <div className="text-sm font-bold text-white">{ws.avgPerMember}</div>
                                        <div className="text-[10px] text-textMuted uppercase tracking-wider mt-0.5">Avg/Member</div>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-3 text-center border border-border/30">
                                        <div className="text-sm font-bold text-white truncate" title={ws.topPerformer}>{ws.topPerformer}</div>
                                        <div className="text-[10px] text-yellow-500 uppercase tracking-wider mt-0.5 flex items-center justify-center gap-0.5"><Trophy className="h-3 w-3" /> Top</div>
                                    </div>
                                </div>

                                {/* Platform Breakdown Bar */}
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-textMuted mb-2">Platform Breakdown</p>
                                    <div className="flex h-2.5 rounded-full overflow-hidden bg-white/5 border border-border/30">
                                        {bar.sr > 0 && <div className="bg-emerald-500 transition-all" style={{ width: `${bar.sr}%` }} title={`SkillRack: ${ws.skillrackTotal.toLocaleString()}`}></div>}
                                        {bar.lc > 0 && <div className="bg-yellow-500 transition-all" style={{ width: `${bar.lc}%` }} title={`LeetCode: ${ws.leetcodeTotal.toLocaleString()}`}></div>}
                                        {bar.cc > 0 && <div className="bg-orange-500 transition-all" style={{ width: `${bar.cc}%` }} title={`CodeChef: ${ws.codechefTotal.toLocaleString()}`}></div>}
                                        {bar.hr > 0 && <div className="bg-green-400 transition-all" style={{ width: `${bar.hr}%` }} title={`HackerRank: ${ws.hackerrankTotal.toLocaleString()}`}></div>}
                                    </div>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[10px]">
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span><span className="text-textMuted">SR</span> <span className="text-white font-medium">{ws.skillrackTotal.toLocaleString()}</span></span>
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span><span className="text-textMuted">LC</span> <span className="text-white font-medium">{ws.leetcodeTotal.toLocaleString()}</span></span>
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span><span className="text-textMuted">CC</span> <span className="text-white font-medium">{ws.codechefTotal.toLocaleString()}</span></span>
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400"></span><span className="text-textMuted">HR</span> <span className="text-white font-medium">{ws.hackerrankTotal.toLocaleString()}</span></span>
                                    </div>
                                </div>

                                {/* Team Lead & Top Contributors */}
                                <div className="flex items-center justify-between border border-border/50 rounded-xl p-3 bg-white/5 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-3 min-w-0">
                                        {ws.teamLeadName ? (
                                            <>
                                                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 flex items-center justify-center shrink-0">
                                                    <Crown className="h-4 w-4 text-yellow-500" />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-xs font-bold text-white truncate">{ws.teamLeadName}</div>
                                                    <div className="text-[10px] text-yellow-500 uppercase tracking-wider">Team Lead</div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-9 h-9 rounded-lg bg-white/5 border border-border/50 flex items-center justify-center shrink-0">
                                                    <Users className="h-4 w-4 text-textMuted" />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-xs font-medium text-textMuted">No lead assigned</div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex -space-x-2 overflow-hidden shrink-0 ml-3">
                                        {ws.contributors.slice(0, 4).map((c: any, i: number) => (
                                            <div key={i} className="inline-block h-7 w-7 rounded-full ring-2 ring-surface bg-gradient-to-br from-brand-400 to-accent-purple flex items-center justify-center text-[9px] font-bold text-white shadow-sm" title={`${c.memberName} — ${c.totalSolved} solved`}>
                                                {(c.memberName || '??').substring(0, 2).toUpperCase()}
                                            </div>
                                        ))}
                                        {ws.contributors.length > 4 && (
                                            <div className="inline-block h-7 w-7 rounded-full ring-2 ring-surface bg-surface border border-border/50 flex items-center justify-center text-[9px] font-medium text-textMuted">
                                                +{ws.contributors.length - 4}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* View Team Button */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); navigate(`/team/${ws.deptId}/${ws.sectionId}/${ws.id}`); }}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-green-500/10 to-brand-500/10 border border-green-500/20 text-green-400 text-sm font-semibold hover:from-green-500/20 hover:to-brand-500/20 hover:text-white transition-all group/btn"
                                >
                                    <Eye className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                                    View Team Details
                                    <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                </button>

                            </CardContent>
                        </Card>
                    );
                })}
                {filteredWorkspaces.length === 0 && (
                    <div className="col-span-full text-center py-16 bg-surface/50 border border-border/50 border-dashed rounded-xl">
                        <FolderGit2 className="h-12 w-12 text-textMuted mx-auto mb-4" />
                        <h3 className="text-white font-bold text-lg">No Workspaces Found</h3>
                        <p className="text-textMuted">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Repositories;
