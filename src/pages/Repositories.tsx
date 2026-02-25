import React, { useMemo, useState } from 'react';
import { useData } from '../contexts/DataContext';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { GitBranch, GitCommit, GitPullRequest, Star, Clock, Users, Search, FolderGit2 } from 'lucide-react';
import { getLatestByMember } from '../utils/dataProcessing';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Repositories: React.FC = () => {
    const { data, loading } = useData();
    const [searchTerm, setSearchTerm] = useState('');

    const repositories = useMemo(() => {
        if (!data || data.length === 0) return [];

        // Group by team and calculate aggregated stats
        const latestData = getLatestByMember(data);
        const teamMap = new Map<string, any>();

        latestData.forEach(member => {
            if (!teamMap.has(member.teamId)) {
                teamMap.set(member.teamId, {
                    id: member.teamId,
                    name: `${member.teamId.toLowerCase()}-service`,
                    department: member.deptId,
                    totalCommits: 0, // Using total solved as commits
                    contributors: [],
                    stars: Math.floor(Math.random() * 50) + 10,
                    lastUpdated: new Date(member.date).toLocaleDateString(),
                    openPrs: Math.floor(Math.random() * 15)
                });
            }

            const team = teamMap.get(member.teamId);
            team.totalCommits += member.totalSolved;
            team.contributors.push(member);
        });

        return Array.from(teamMap.values())
            .map(team => {
                // Sort contributors by total solved
                team.contributors.sort((a: any, b: any) => b.totalSolved - a.totalSolved);
                return team;
            })
            .sort((a, b) => b.totalCommits - a.totalCommits); // Sort by highest activity
    }, [data]);

    const filteredRepos = repositories.filter(repo =>
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in relative z-10">
            <div className="absolute top-0 right-0 -m-8 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Hero Section */}
            <div className="glass-card rounded-2xl p-8 relative overflow-hidden group border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-brand-500/10 opacity-50"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-white mb-2 tracking-tight flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-green-500/20 shadow-inner border border-green-500/30">
                                <FolderGit2 className="h-6 w-6 text-green-400" />
                            </div>
                            Project Repositories
                        </h1>
                        <p className="text-textMuted max-w-xl">Browse team source code repositories, track contribution velocity (problems solved), and monitor top contributors across the organization.</p>
                    </div>

                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-textMuted" />
                        <input
                            type="text"
                            placeholder="Search repositories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-full px-4 py-3 bg-white/5 border border-border rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500/30 text-white placeholder-textMuted/50 transition-all font-medium"
                        />
                    </div>
                </div>
            </div>

            {/* Repositories Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredRepos.map((repo) => (
                    <Card key={repo.id} hover className="bg-gradient-to-br from-surface to-surface/90 border-t-green-500/30">
                        <CardHeader className="border-b border-border/50 pb-4 flex flex-row items-start justify-between">
                            <div>
                                <CardTitle className="text-lg font-display flex items-center text-white mb-1">
                                    <GitBranch className="h-5 w-5 text-green-400 mr-2" />
                                    {repo.name}
                                </CardTitle>
                                <div className="text-xs font-semibold text-brand-400 uppercase tracking-widest">{repo.department}</div>
                            </div>
                            <div className="flex items-center gap-1 text-textMuted text-sm font-medium border border-border/50 px-2 py-1 rounded-lg bg-surface/50">
                                <Star className="h-4 w-4 text-yellow-500" /> {repo.stars}
                            </div>
                        </CardHeader>
                        <CardContent className="pt-5 space-y-5">

                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-4 text-textMuted">
                                    <span className="flex items-center gap-1.5"><GitCommit className="h-4 w-4" /> <span className="text-white font-medium">{repo.totalCommits.toLocaleString()}</span> commits</span>
                                    <span className="flex items-center gap-1.5"><GitPullRequest className="h-4 w-4" /> <span className="text-white font-medium">{repo.openPrs}</span> open PRs</span>
                                </div>
                                <div className="text-xs text-textMuted flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> updated {repo.lastUpdated}
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-textMuted mb-3 flex items-center">
                                    <Users className="h-3.5 w-3.5 mr-2" /> Top Contributors
                                </p>
                                <div className="flex items-center gap-4 border border-border/50 rounded-xl p-3 bg-white/5 hover:bg-white/10 transition-colors">
                                    <div className="flex -space-x-3 overflow-hidden">
                                        {repo.contributors.slice(0, 5).map((c: any, i: number) => (
                                            <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-surface bg-gradient-to-br from-brand-400 to-accent-purple flex items-center justify-center text-[10px] font-bold text-white shadow-sm" title={c.memberName}>
                                                {c.memberName.substring(0, 2).toUpperCase()}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-xs font-medium text-textMuted flex-1">
                                        {repo.contributors.length > 5 ? `+${repo.contributors.length - 5} more` : `${repo.contributors.length} total`}
                                    </div>
                                    {repo.contributors[0] && (
                                        <div className="text-right">
                                            <div className="text-xs font-bold text-white max-w-[100px] truncate" title={repo.contributors[0].memberName}>{repo.contributors[0].memberName}</div>
                                            <div className="text-[10px] text-brand-400 uppercase tracking-wider">Lead Dev</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                ))}
                {filteredRepos.length === 0 && (
                    <div className="col-span-full text-center py-16 bg-surface/50 border border-border/50 border-dashed rounded-xl">
                        <FolderGit2 className="h-12 w-12 text-textMuted mx-auto mb-4" />
                        <h3 className="text-white font-bold text-lg">No Repositories Found</h3>
                        <p className="text-textMuted">Try tweaking your search term.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Repositories;
