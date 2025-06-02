"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api, Patient } from "@/services/api";

export default function SidebarNav() {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPatient = async () => {
      setLoading(true);
      const data = await api.getPatients();
      if (Array.isArray(data)) {
        const found = (data as Patient[]).find((p) => String((p as any).DFN) === String(id));
        setPatient(found || null);
      }
      setLoading(false);
    };
    if (id) fetchPatient();
    else setPatient(null);
  }, [id]);

  if (!id) return <div className="p-4 text-xs text-gray-100 bg-teal-700 h-full">No patient selected</div>;
  if (loading) return <div className="p-4 text-xs text-gray-100 bg-teal-700 h-full">Loading...</div>;
  if (!patient) return <div className="p-4 text-xs text-red-200 bg-teal-700 h-full">Patient not found</div>;

  // Format DOB/Age
  const dob = patient["DOB"] || "";
  const age = patient["Age"] || "";
  const dobAge = dob && age ? `${dob} / ${age} Y` : dob || age;

  return (
    <aside className="w-full max-w-xs bg-teal-700 text-white p-4 h-screen overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Patient Details</h2>
      <div className="mb-2">
        <div><span className="font-semibold">Name:</span> {(patient as any)["Name"]}</div>
        <div><span className="font-semibold">Gender:</span> {(patient as any)["Gender"]}</div>
        <div><span className="font-semibold">Patient ID:</span> {(patient as any)["DFN"]}</div>
        <div><span className="font-semibold">DOB/Age:</span> {dobAge}</div>
        <div><span className="font-semibold">Mobile No.:</span> {(patient as any)["Mobile No"]}</div>
      </div>
      <hr className="my-2 border-teal-500" />
      <div className="mb-2">
        <div className="font-semibold">Patient Visit / IPD Details</div>
        <div><span className="font-semibold">Ward - Bed Details:</span> {(patient as any)["Ward"]} - {(patient as any)["Bed"]}</div>
        <div><span className="font-semibold">Admission Date:</span> {(patient as any)["Admission Date"]}</div>
        <div><span className="font-semibold">LOS (Length of Stay):</span> {(patient as any)["LOS"]}</div>
        <div><span className="font-semibold">Primary Consultant:</span> {(patient as any)["Primary Consultant"]}</div>
        <div><span className="font-semibold">Encounter Provider:</span> {(patient as any)["Treating Consultant"]}</div>
      </div>
      <hr className="my-2 border-teal-500" />
      <div className="mb-2">
        <div className="font-semibold">Patient Clinical Details</div>
        <div><span className="font-semibold">Allergies:</span> {(patient as any)["Allergies"] || "None"}</div>
        <div><span className="font-semibold">Final Diagnosis:</span> {(patient as any)["Final Diagnosis"]}</div>
        <div><span className="font-semibold">Posting:</span> {(patient as any)["Posting"]}</div>
        <div><span className="font-semibold">Reason For Visit:</span> {(patient as any)["Reason For Visit"]}</div>
      </div>
    </aside>
  );
}