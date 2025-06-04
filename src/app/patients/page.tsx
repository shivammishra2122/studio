"use client";

import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import { api, Patient } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const TABLE_FIELDS = [
    { key: 'DFN', label: 'Patient ID' },
    { key: 'Name', label: 'Patient Name' },
    { key: 'Age', label: 'Age/ Gender' },
    { key: 'Admission Date', label: 'Date of Admission' },
    { key: 'LOS', label: 'LOS' },
    { key: 'Ward', label: 'Ward Location' },
    { key: 'Bed', label: 'Room Bed' },
    { key: 'Specialty', label: 'Specialty' },
    { key: 'Primary Consultant', label: 'Primary Consultant1' },
    { key: 'Secondary Consultant', label: 'Primary Consultant2' },
    { key: 'Payer Category', label: 'Payer Category' },
    { key: 'Type of Admission', label: 'Type of Admission' },
    { key: 'MLC', label: 'MLC' },
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
            <div className="flex min-h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Error</h1>
                    <p className="text-white text-xl">{error}</p>
                    {debugInfo && (
                        <div className="mt-4 p-4 bg-white/10 rounded-lg text-left">
                            <h2 className="text-white font-semibold mb-2">Debug Information:</h2>
                            <pre className="text-gray-200 overflow-auto">
                                {JSON.stringify(debugInfo, null, 2)}
                            </pre>
                        </div>
                    )}
                    <button
                        onClick={fetchPatients}
                        className="mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-blue-600 p-8">
            <div className="max-w-7xl mx-auto bg-white/90 rounded-lg shadow-lg overflow-x-auto p-4">
                <h1 className="text-xl font-semibold text-gray-800 mb-4">Patient List</h1>
                <div className="mb-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <input
                        type="text"
                        placeholder="Search patients..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full md:w-64 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs"
                    />
                    {sortKey && (
                        <div className="text-gray-600 text-xs mt-2 md:mt-0">
                            Sorted by <span className="font-semibold">{TABLE_FIELDS.find(f => f.key === sortKey)?.label}</span> ({sortDir})
                        </div>
                    )}
                </div>
                <table className="min-w-full divide-y divide-gray-200 text-xs">
                    <thead className="bg-blue-200">
                        <tr>
                            <th className="px-2 py-1 text-left">S.No</th>
                            {TABLE_FIELDS.map((field) => (
                                <th
                                    key={field.key}
                                    className="px-2 py-1 text-left cursor-pointer select-none hover:bg-blue-300 transition"
                                    onClick={() => handleSort(field.key)}
                                >
                                    {field.label}
                                    {sortKey === field.key && (
                                        <span className="ml-1">{sortDir === 'asc' ? '▲' : '▼'}</span>
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {filteredPatients.map((patient, idx) => (
                            <tr
                                key={idx}
                                className={
                                    (idx % 2 === 0 ? "bg-blue-50" : "bg-white") +
                                    " cursor-pointer hover:bg-blue-100 transition"
                                }
                                onClick={() => router.push(`/patients/${patient.DFN}`)}
                            >
                                <td className="px-2 py-1">{idx + 1}</td>
                                {TABLE_FIELDS.map((field) => (
                                    <td key={field.key} className="px-2 py-1">
                                        {patient[field.key as keyof Patient] || ''}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredPatients.length === 0 && !error && (
                    <div className="text-center text-gray-700 mt-8">
                        <p className="text-xs">No patients found</p>
                    </div>
                )}
            </div>
        </div>
    );
} 