import React, { createContext, useContext, useEffect, useState } from 'react';
import { useFirebase } from './FirebaseContext';
import { FirebaseService } from '../services/firebaseService';
import { DailyTotal, Hierarchy } from '../types';
import { processDataFrame } from '../utils/dataProcessing';

interface DataContextType {
    data: DailyTotal[];
    hierarchy: Hierarchy;
    loading: boolean;
    refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { db, isInitialized } = useFirebase();
    const [data, setData] = useState<DailyTotal[]>([]);
    const [hierarchy, setHierarchy] = useState<Hierarchy>({});
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        if (!db) return;
        try {
            setLoading(true);
            const service = new FirebaseService(db);
            const [all, tree] = await Promise.all([
                service.loadAllDepartmentsData(),
                service.loadHierarchy(),
            ]);
            setHierarchy(tree);
            setData(processDataFrame(all));
        } catch (e) {
            console.error('Error loading global data', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isInitialized && db) {
            loadData();
        }
    }, [isInitialized, db]);

    return (
        <DataContext.Provider value={{ data, hierarchy, loading, refreshData: loadData }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
