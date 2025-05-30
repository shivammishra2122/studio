"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Patient } from '@/lib/constants';
import { Router } from "lucide-react";
import { useRouter } from "next/navigation";

interface PatientsPageProps {
    patients: Patient[];
    onView: (patient: Patient) => void;
}

export default function PatientsPage({ patients, onView }: PatientsPageProps) {
    const router = useRouter();
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-background to-secondary/30">
            <Card className="w-full h-full max-w-none max-h-none rounded-none shadow-none border-none flex flex-col">
                <CardHeader className="px-8 pt-8 pb-4">
                    <CardTitle className="text-2xl font-bold">Patient List</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto px-8 pb-8">
                    <div className="overflow-x-auto w-full h-full">
                        <table className="min-w-full divide-y divide-border">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left">Name</th>
                                    <th className="px-4 py-2 text-left">UHID</th>
                                    <th className="px-4 py-2 text-left">Age</th>
                                    <th className="px-4 py-2 text-left">Gender</th>
                                    <th className="px-4 py-2 text-left">Diagnosis</th>
                                    <th className="px-4 py-2 text-left">Doctor</th>
                                    <th className="px-4 py-2 text-left">Admission Date</th>
                                    <th className="px-4 py-2 text-left">Bed</th>
                                    <th className="px-4 py-2">View</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.map((patient: Patient) => (
                                    <tr key={patient.id} className="hover:bg-muted/50">
                                        <td className="px-4 py-2 font-medium">{patient.name}</td>
                                        <td className="px-4 py-2">{patient.id}</td>
                                        <td className="px-4 py-2">{patient.age}</td>
                                        <td className="px-4 py-2">{patient.gender}</td>
                                        <td className="px-4 py-2">{patient.finalDiagnosis}</td>
                                        <td className="px-4 py-2">{patient.primaryConsultant}</td>
                                        <td className="px-4 py-2">{patient.admissionDate}</td>
                                        <td className="px-4 py-2">{`${patient.wardNo}, ${patient.bedDetails}`}</td>
                                        <td className="px-4 py-2">
                                            <Button size="sm" variant="outline" onClick={() => {
                                                onView(patient);
                                                router.push('/'); // or '/dashboard' if that's your main page
                                            }}>View</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 