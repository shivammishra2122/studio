"use client";

import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import { api, Patient } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { 
  Search, 
  User, 
  Calendar, 
  Clock, 
  Home, 
  Bed, 
  Stethoscope, 
  UserCog, 
  CreditCard, 
  FileText, 
  AlertTriangle, 
  ArrowUpDown, 
  ChevronDown, 
  ChevronUp, 
  Loader2, 
  RefreshCw, 
  ArrowUp, 
  ArrowDown,
  UserX
} from "lucide-react";
import { cn } from "@/lib/utils";

const TABLE_FIELDS = [
    { key: 'DFN', label: 'Patient ID', icon: FileText },
    { key: 'Name', label: 'Patient Name', icon: User },
    { key: 'Age', label: 'Age/Gender', icon: UserCog },
    { key: 'Admission Date', label: 'Admission', icon: Calendar },
    { key: 'LOS', label: 'LOS', icon: Clock },
    { key: 'Ward', label: 'Ward', icon: Home },
    { key: 'Bed', label: 'Bed', icon: Bed },
    { key: 'Specialty', label: 'Specialty', icon: Stethoscope },
    { key: 'Primary Consultant', label: 'Consultant', icon: UserCog },
    { key: 'Payer Category', label: 'Payer', icon: CreditCard },
    { key: 'Type of Admission', label: 'Admission Type', icon: FileText },
    { key: 'MLC', label: 'MLC', icon: AlertTriangle },
];

function getStringValue(val: any) {
    if (val === undefined || val === null) return '';
    return String(val).toLowerCase();
}

export default function PatientsPage() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [debugInfo, setDebugInfo] = useState<any>(null);
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>("asc");
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            setError(null);
            setDebugInfo(null);
            const data = await api.getPatients();
            if (Array.isArray(data)) {
                setPatients(data as Patient[]);
            } else {
                setDebugInfo(data);
                setError('Invalid data format received from server');
                setPatients([]);
            }
        } catch (error) {
            setError('Failed to fetch patients. Please try again.');
            setPatients([]);
            toast({
                title: "Error",
                description: "Failed to fetch patients. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    // Filtered and sorted patients
    const filteredPatients = useMemo(() => {
        let filtered = patients;
        if (search.trim() !== "") {
            filtered = filtered.filter((patient) =>
                TABLE_FIELDS.some(({ key }) => getStringValue(patient[key as keyof Patient]).includes(search.toLowerCase()))
            );
        }
        if (sortKey) {
            filtered = [...filtered].sort((a, b) => {
                const aVal = getStringValue(a[sortKey as keyof Patient]);
                const bVal = getStringValue(b[sortKey as keyof Patient]);
                if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return filtered;
    }, [patients, search, sortKey, sortDir]);

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
                <p className="text-blue-800 font-medium">Loading patient data...</p>
                <p className="text-sm text-blue-600 mt-2">Please wait a moment</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-500 to-pink-600 p-8 flex items-center justify-center">
                <div className="max-w-2xl w-full bg-white/90 rounded-xl shadow-2xl overflow-hidden">
                    <div className="bg-red-600 p-6 text-white">
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <AlertTriangle className="w-8 h-8" />
                            Error Loading Patients
                        </h1>
                        <p className="mt-2 text-red-100">{error}</p>
                    </div>
                    <div className="p-6">
                        {debugInfo && (
                            <details className="mb-6">
                                <summary className="text-sm font-medium text-gray-700 cursor-pointer mb-2">
                                    View Debug Information
                                </summary>
                                <div className="mt-2 p-4 bg-gray-50 rounded-lg overflow-auto max-h-60">
                                    <pre className="text-xs text-gray-600">
                                        {JSON.stringify(debugInfo, null, 2)}
                                    </pre>
                                </div>
                            </details>
                        )}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={fetchPatients}
                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex-1 flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Try Again
                            </button>
                            <button
                                onClick={() => router.push('/')}
                                className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors flex-1 flex items-center justify-center gap-2"
                            >
                                <Home className="w-4 h-4" />
                                Go to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7fafc] p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
                    <div>
                        <h1 className="text-2xl font-bold text-[#2d3748]">Patient List</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            {filteredPatients.length} {filteredPatients.length === 1 ? 'patient' : 'patients'} found
                            {search && ` matching "${search}"`}
                        </p>
                    </div>
                    
                    <div className="relative flex-1 max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search patients..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3182ce] focus:border-transparent text-sm transition-colors"
                        />
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button
                            onClick={fetchPatients}
                            className="p-2 text-gray-500 hover:text-[#3182ce] hover:bg-[#ebf8ff] rounded-full transition-colors"
                            title="Refresh data"
                        >
                            <RefreshCw className="h-5 w-5" />
                        </button>
                        {sortKey && (
                            <div className="hidden md:flex items-center text-sm text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                                <span>Sorted by </span>
                                <span className="font-medium ml-1">
                                    {TABLE_FIELDS.find(f => f.key === sortKey)?.label}
                                </span>
                                {sortDir === 'asc' ? (
                                    <ArrowUp className="ml-1 h-4 w-4" />
                                ) : (
                                    <ArrowDown className="ml-1 h-4 w-4" />
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-[#1a365d]">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        #
                                    </th>
                                    {TABLE_FIELDS.map((field) => {
                                        const Icon = field.icon;
                                        return (
                                            <th
                                                key={field.key}
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-[#2c5282] transition-colors group"
                                                onClick={() => handleSort(field.key)}
                                            >
                                                <div className="flex items-center">
                                                    <Icon className="h-4 w-4 mr-1.5 text-blue-300 group-hover:text-white" />
                                                    <span className="flex items-center">
                                                        {field.label}
                                                        {sortKey === field.key ? (
                                                            sortDir === 'asc' ? (
                                                                <ChevronUp className="ml-1 h-4 w-4 text-white" />
                                                            ) : (
                                                                <ChevronDown className="ml-1 h-4 w-4 text-white" />
                                                            )
                                                        ) : (
                                                            <span className="ml-1 opacity-0 group-hover:opacity-100 text-gray-300">
                                                                <ArrowUpDown className="h-3.5 w-3.5 text-blue-300" />
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredPatients.map((patient, idx) => (
                                    <tr 
                                        key={patient.DFN}
                                        className="hover:bg-blue-50 transition-colors cursor-pointer border-b border-gray-100"
                                        onClick={() => router.push(`/patients/${patient.DFN}`)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {idx + 1}
                                        </td>
                                        {TABLE_FIELDS.map((field) => {
                                            const value = patient[field.key as keyof Patient] || '-';
                                            const isId = field.key === 'DFN';
                                            const isName = field.key === 'Name';
                                            return (
                                                <td 
                                                    key={field.key}
                                                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                                                        isName ? 'font-medium text-[#2b6cb0] hover:text-[#1a4f8c]' : 'text-gray-700'
                                                    } ${isId ? 'font-mono' : ''}`}
                                                >
                                                    <div className={isName ? 'truncate max-w-[200px]' : ''}>
                                                        {String(value)}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredPatients.length === 0 && search && (
                        <div className="text-center py-4">
                            <button
                                onClick={() => setSearch('')}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#3182ce] hover:bg-[#2b6cb0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                Clear search
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500">
                    <div className="mb-2 sm:mb-0">
                        Showing <span className="font-medium">1-{filteredPatients.length}</span> of{' '}
                        <span className="font-medium">{filteredPatients.length}</span> patients
                    </div>
                    <div className="flex items-center space-x-2">
                        <span>Data refreshes automatically</span>
                        <div className="h-1 w-1 rounded-full bg-gray-400"></div>
                        <span>Last updated: {new Date().toLocaleTimeString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
} 