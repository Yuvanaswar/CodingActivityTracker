import { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';

export const useSearch = (type: 'members' | 'teams', delay = 300) => {
    const { data: globalData } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setResults([]);
            return;
        }

        const timer = setTimeout(() => {
            setLoading(true);
            setError(null);

            try {
                const term = searchTerm.toLowerCase();
                let searchResults: any[] = [];

                if (type === 'members') {
                    // Extract unique members using a Map to get only the latest entry per member
                    const memberMap = new Map();
                    globalData.forEach(m => {
                        // Use basic null/undefined checks
                        if (m.memberName && (m.memberName.toLowerCase().includes(term) || (m.memberId && m.memberId.toLowerCase().includes(term)))) {
                            const existing = memberMap.get(m.memberId);
                            if (!existing || new Date(m.date) > new Date(existing.date)) {
                                memberMap.set(m.memberId, m);
                            }
                        }
                    });
                    searchResults = Array.from(memberMap.values()).slice(0, 5); // Limit to top 5 hits
                } else if (type === 'teams') {
                    // Search unique teams
                    const teamMap = new Map();
                    globalData.forEach(m => {
                        if (m.teamId && m.teamId.toLowerCase().includes(term)) {
                            teamMap.set(m.teamId, { id: m.teamId, name: m.teamId, deptId: m.deptId, sectionId: m.sectionId });
                        }
                    });
                    searchResults = Array.from(teamMap.values()).slice(0, 5); // Limit to top 5 hits
                }

                setResults(searchResults);
            } catch (err) {
                console.error("Search failed", err);
                setError("Search failed");
            } finally {
                setLoading(false);
            }
        }, delay);

        return () => clearTimeout(timer);
    }, [searchTerm, globalData, type, delay]);

    return { searchTerm, setSearchTerm, results, loading, error };
};
