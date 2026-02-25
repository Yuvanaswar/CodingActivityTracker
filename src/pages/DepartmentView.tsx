import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { DailyTotal, TeamStats } from '../types';
import { getTeamStats, createLeaderboard, createTeamComparison } from '../utils/dataProcessing';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import LeaderboardTable from '../components/Tables/LeaderboardTable';
import TeamComparisonTable from '../components/Tables/TeamComparisonTable';
import MetricCards from '../components/Metrics/MetricCards';
import { ChevronRight } from 'lucide-react';

const DepartmentView: React.FC = () => {
  const { deptId } = useParams<{ deptId: string }>();
  const { data: globalData, loading: globalLoading } = useData();
  const [data, setData] = useState<DailyTotal[]>([]);
  const [stats, setStats] = useState<TeamStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (globalLoading) {
      setLoading(true);
      return;
    }

    if (deptId) {
      const deptData = globalData.filter((d: any) => d.deptId === deptId);
      setData(deptData);
      setStats(getTeamStats(deptData));
    }
    setLoading(false);
  }, [globalData, globalLoading, deptId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-600">Loading department data...</span>
      </div>
    );
  }

  const leaderboard = createLeaderboard(data);
  const teamComparison = createTeamComparison(data);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600">
        <Link to="/" className="hover:text-gray-900">Dashboard</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-gray-900">{deptId}</span>
      </nav>

      {/* Hero Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
        <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-2">
          📚 Department: {deptId}
        </h1>
        <p className="text-gray-600">
          Comprehensive performance overview for all teams in {deptId}
        </p>
      </div>

      {/* Metrics */}
      {stats && <MetricCards stats={stats} />}

      {/* Team Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>👥 Team Performance Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <TeamComparisonTable data={teamComparison} />
        </CardContent>
      </Card>

      {/* Department Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>🏆 Department Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <LeaderboardTable
            data={leaderboard}
            showTeamColumn={true}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DepartmentView;