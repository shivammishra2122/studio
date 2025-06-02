"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api, Patient } from "@/services/api";

export default function PatientDashboard() {
    const { id } = useParams();
    const [patient, setPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPatient = async () => {
            setLoading(true);
            setError(null);
            const data = await api.getPatients();
            if (Array.isArray(data)) {
                const found = data.find((p) => String(p.DFN) === String(id));
                setPatient(found || null);
            } else {
                setError("Patient not found");
            }
            setLoading(false);
        };
        fetchPatient();
    }, [id]);

    if (loading) return <div className="p-8 text-xs">Loading...</div>;
    if (error || !patient) return <div className="p-8 text-xs text-red-500">Patient not found</div>;

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
            {/* Sidebar */}
            <aside className="w-full max-w-xs bg-white/90 p-4 shadow-lg text-xs h-screen overflow-y-auto">
                <h2 className="text-base font-semibold mb-4 text-gray-800">Patient Details</h2>
                <ul className="space-y-1">
                    {Object.entries(patient).map(([key, value]) => (
                        <li key={key} className="flex justify-between border-b border-gray-100 py-1">
                            <span className="text-gray-500 mr-2 whitespace-nowrap">{key}:</span>
                            <span className="text-gray-800 break-all">{String(value)}</span>
                        </li>
                    ))}
                </ul>
            </aside>
            {/* Dashboard area */}
            <main className="flex-1 p-8 text-xs text-gray-900">
                <h1 className="text-lg font-semibold mb-4">Patient Dashboard</h1>
                <div className="bg-white/80 rounded-lg p-4 shadow">Dashboard content goes here.</div>
            </main>
        </div>
    );
} 