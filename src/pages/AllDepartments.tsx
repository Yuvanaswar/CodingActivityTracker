import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { createTeamComparison } from '../utils/dataProcessing';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import TeamComparisonTable from '../components/Tables/TeamComparisonTable';
import { Building2, ChevronRight } from 'lucide-react';

const AllDepartments: React.FC = () => {
  const { data, loading: globalLoading } = useData();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (globalLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [globalLoading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-600">Loading organization data...</span>
      </div>
    );
  }

  const teamComparison = createTeamComparison(data);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 -m-8 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <nav className="flex items-center space-x-2 text-sm text-textMuted bg-surface/50 w-fit px-4 py-2 rounded-full border border-border">
        <Link to="/" className="hover:text-brand-400 transition-colors">Dashboard</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-semibold text-textMain flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-500"></div> All Departments
        </span>
      </nav>

      {/* Hero Section */}
      <div className="glass-card rounded-2xl p-8 relative overflow-hidden group border border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-accent-purple/10 opacity-50"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">Organization Overview</h1>
            <p className="text-textMuted max-w-xl">A complete view of all departments and their performance metrics across the organization.</p>
          </div>
        </div>
      </div>

      <Card hover className="bg-gradient-to-br from-surface to-surface/90 border-t-accent-purple/30">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="text-xl font-display flex items-center">
            <div className="p-2 rounded-lg bg-accent-purple/10 mr-3">
              <Building2 className="w-5 h-5 text-accent-purple" />
            </div>
            Department Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <TeamComparisonTable data={teamComparison} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AllDepartments;
