import React from 'react';
import { Hierarchy } from '../../types';

interface Props {
  hierarchy: Hierarchy;
  selectedDept: string;
  selectedSection: string;
  selectedTeam: string;
  onDepartmentChange: (deptId: string) => void;
  onSectionChange: (sectionId: string) => void;
  onTeamChange: (teamId: string) => void;
}

const HierarchySelector: React.FC<Props> = ({ hierarchy, selectedDept, selectedSection, selectedTeam, onDepartmentChange, onSectionChange, onTeamChange }) => {
  const deptEntries = Object.entries(hierarchy) as [string, Hierarchy[keyof Hierarchy]][];
  const sections = selectedDept ? Object.entries(hierarchy[selectedDept]?.sections || {}) as [string, any][] : [];
  const teams = (selectedDept && selectedSection) ? Object.entries(hierarchy[selectedDept]?.sections[selectedSection]?.teams || {}) as [string, any][] : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-textMuted mb-2">Department</label>
        <div className="relative">
          <select value={selectedDept} onChange={(e) => onDepartmentChange(e.target.value)} className="w-full appearance-none px-4 py-2.5 bg-surface border border-border rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/30 text-white transition-all cursor-pointer font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed">
            <option value="" className="bg-surface text-white">All Departments</option>
            {deptEntries.map(([deptId, dept]) => (
              <option key={deptId} value={deptId} className="bg-surface text-white">{dept.name}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-textMuted">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-textMuted mb-2">Section</label>
        <div className="relative">
          <select value={selectedSection} onChange={(e) => onSectionChange(e.target.value)} className="w-full appearance-none px-4 py-2.5 bg-surface border border-border rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500/30 text-white transition-all cursor-pointer font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed" disabled={!selectedDept}>
            <option value="" className="bg-surface text-white">All Sections</option>
            {sections.map(([sectionId, section]) => (
              <option key={sectionId} value={sectionId} className="bg-surface text-white">{section.name}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-textMuted">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-textMuted mb-2">Team</label>
        <div className="relative">
          <select value={selectedTeam} onChange={(e) => onTeamChange(e.target.value)} className="w-full appearance-none px-4 py-2.5 bg-surface border border-border rounded-xl focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/30 text-white transition-all cursor-pointer font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed" disabled={!selectedDept || !selectedSection}>
            <option value="" className="bg-surface text-white">All Teams</option>
            {teams.map(([teamId, team]) => (
              <option key={teamId} value={teamId} className="bg-surface text-white">{team.name}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-textMuted">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HierarchySelector;
