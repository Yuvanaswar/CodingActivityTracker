import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Bell, ChevronRight, Database, Palette, Download, Upload, RefreshCw, Settings as SettingsIcon } from 'lucide-react';
import { useToast } from '../components/ui/Toaster';

const Settings: React.FC = () => {
  const { addToast } = useToast();
  const [notifications, setNotifications] = useState({
    dailyUpdates: true,
    weeklyReports: true,
    achievementAlerts: false,
    systemNotifications: true
  });
  const [theme, setTheme] = useState('light');
  const [refreshInterval, setRefreshInterval] = useState('30');

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };
  const handleExportData = () => { addToast({ type: 'info', title: 'Export Started', message: 'Data export functionality would be implemented here' }); };
  const handleImportData = () => { addToast({ type: 'info', title: 'Import Data', message: 'Data import functionality would be implemented here' }); };
  const handleClearCache = () => { localStorage.clear(); sessionStorage.clear(); addToast({ type: 'success', title: 'Cache Cleared', message: 'Cache cleared successfully!' }); };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in relative">
      <div className="absolute top-0 right-0 -m-8 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <nav className="flex items-center space-x-2 text-sm text-textMuted bg-surface/50 w-fit px-4 py-2 rounded-full border border-border">
        <Link to="/" className="hover:text-brand-400 transition-colors">Dashboard</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-semibold text-textMain flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-slate-400"></div> Settings
        </span>
      </nav>

      <div className="glass-card rounded-2xl p-8 relative overflow-hidden group border border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-500/10 to-brand-500/10 opacity-50"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-display font-bold text-white mb-2 tracking-tight flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-500/20 shadow-inner border border-slate-500/30">
              <SettingsIcon className="h-6 w-6 text-slate-400" />
            </div>
            Application Settings
          </h1>
          <p className="text-textMuted text-lg max-w-xl ml-14">Configure your Multi-Team Coding Tracker preferences, appearance, and data management options.</p>
        </div>
      </div>

      <Card hover className="bg-gradient-to-br from-surface to-surface/90 border-t-amber-500/30">
        <CardHeader className="border-b border-border/50 pb-4">
          <CardTitle className="text-xl font-display flex items-center">
            <div className="p-2 rounded-lg bg-amber-500/10 mr-3">
              <Bell className="h-5 w-5 text-amber-500" />
            </div>
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-4 bg-surface/50 border border-border/50 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => handleNotificationChange(key as keyof typeof notifications)}>
                <div>
                  <h3 className="font-semibold text-white capitalize group-hover:text-amber-400 transition-colors">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</h3>
                  <p className="text-sm text-textMuted mt-1">
                    {key === 'dailyUpdates' && 'Receive daily performance summaries'}
                    {key === 'weeklyReports' && 'Get weekly team performance reports'}
                    {key === 'achievementAlerts' && 'Notifications for new achievements'}
                    {key === 'systemNotifications' && 'System maintenance and updates'}
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNotificationChange(key as keyof typeof notifications); }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-surface ${value ? 'bg-amber-500' : 'bg-white/10'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1 shadow-sm'}`} />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card hover className="bg-gradient-to-br from-surface to-surface/90 border-t-purple-500/30">
        <CardHeader className="border-b border-border/50 pb-4">
          <CardTitle className="text-xl font-display flex items-center">
            <div className="p-2 rounded-lg bg-purple-500/10 mr-3">
              <Palette className="h-5 w-5 text-purple-500" />
            </div>
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-textMuted mb-3">Theme Preference</label>
              <div className="grid grid-cols-3 gap-3">
                {['light', 'dark', 'auto'].map((themeOption) => (
                  <button key={themeOption} onClick={() => setTheme(themeOption)} className={`p-4 text-sm font-semibold rounded-xl border transition-all capitalize flex flex-col items-center justify-center gap-2 ${theme === themeOption ? 'bg-purple-500/20 text-purple-400 border-purple-500/50 shadow-inner' : 'bg-surface/50 text-textMuted border-border/50 hover:bg-white/5 hover:text-white'}`}>
                    <div className={`w-4 h-4 rounded-full border-2 ${theme === themeOption ? 'border-purple-400 bg-purple-400' : 'border-textMuted bg-transparent'}`}></div>
                    {themeOption}
                  </button>
                ))}
              </div>
              <p className="text-sm text-textMuted mt-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div> Dark theme is currently active as default
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card hover className="bg-gradient-to-br from-surface to-surface/90 border-t-blue-500/30">
        <CardHeader className="border-b border-border/50 pb-4">
          <CardTitle className="text-xl font-display flex items-center">
            <div className="p-2 rounded-lg bg-blue-500/10 mr-3">
              <Database className="h-5 w-5 text-blue-500" />
            </div>
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-textMuted mb-3">Auto-Refresh Interval</label>
              <div className="relative">
                <select value={refreshInterval} onChange={(e) => setRefreshInterval(e.target.value)} className="w-full appearance-none px-4 py-3 bg-white/5 border border-border rounded-xl focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/30 text-white transition-all cursor-pointer font-medium">
                  <option value="15" className="bg-surface text-white">15 minutes</option>
                  <option value="30" className="bg-surface text-white">30 minutes</option>
                  <option value="60" className="bg-surface text-white">1 hour</option>
                  <option value="180" className="bg-surface text-white">3 hours</option>
                  <option value="0" className="bg-surface text-white">Disabled</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-textMuted">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-textMuted mb-3">Data Operations</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button onClick={handleExportData} variant="secondary" className="w-full flex items-center justify-center bg-white/5 border-border hover:bg-white/10 hover:text-white"><Download className="mr-2 h-4 w-4" />Export Data</Button>
                <Button onClick={handleImportData} variant="secondary" className="w-full flex items-center justify-center bg-white/5 border-border hover:bg-white/10 hover:text-white"><Upload className="mr-2 h-4 w-4" />Import Data</Button>
                <Button onClick={handleClearCache} variant="danger" className="w-full flex items-center justify-center bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 hover:text-red-300"><RefreshCw className="mr-2 h-4 w-4" />Clear Cache</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card hover className="bg-gradient-to-br from-surface to-surface/90 border-t-green-500/30">
        <CardHeader className="border-b border-border/50 pb-4">
          <CardTitle className="text-xl font-display flex items-center">
            <div className="p-2 rounded-lg bg-green-500/10 mr-3">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-surface/50 border border-border/50 rounded-xl p-5 relative overflow-hidden">
              {/* <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-xl -mr-10 -mt-10 pointer-events-none"></div> */}
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Application</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center"><span className="text-textMuted uppercase tracking-wider text-xs font-semibold">Version</span><span className="font-medium text-white bg-white/5 px-2 py-0.5 rounded border border-border/50">v1.2.0</span></div>
                <div className="flex justify-between items-center pt-2 border-t border-border/50"><span className="text-textMuted uppercase tracking-wider text-xs font-semibold">Build</span><span className="font-medium text-white">React + TypeScript</span></div>
                <div className="flex justify-between items-center pt-2 border-t border-border/50"><span className="text-textMuted uppercase tracking-wider text-xs font-semibold">Last Updated</span><span className="font-medium text-white">{new Date().toLocaleDateString()}</span></div>
              </div>
            </div>
            <div className="bg-surface/50 border border-border/50 rounded-xl p-5 relative overflow-hidden">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div> Backend</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center"><span className="text-textMuted uppercase tracking-wider text-xs font-semibold">Database</span><span className="font-medium text-white">Firebase Firestore</span></div>
                <div className="flex justify-between items-center pt-2 border-t border-border/50"><span className="text-textMuted uppercase tracking-wider text-xs font-semibold">Hosting</span><span className="font-medium text-white flex items-center gap-1"><svg viewBox="0 0 76 65" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3 h-3"><path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="#ffffff" /></svg> Vercel</span></div>
                <div className="flex justify-between items-center pt-2 border-t border-border/50"><span className="text-textMuted uppercase tracking-wider text-xs font-semibold">Status</span><span className="text-green-400 font-semibold flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div> Connected</span></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4 pt-4 pb-8 border-t border-border/50">
        <Button variant="ghost" className="text-textMuted hover:text-white">Reset Default Preferences</Button>
        <Button variant="primary" className="shadow-lg shadow-brand-500/25 px-8">Save Changes</Button>
      </div>
    </div>
  );
};

export default Settings;
