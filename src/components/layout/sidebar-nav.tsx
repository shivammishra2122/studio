"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api, Patient } from "@/services/api";
import { User, Phone, BedDouble, CalendarDays, CreditCard, IdCard } from 'lucide-react'; // Import User icon for avatar placeholder

export default function SidebarNav() {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPatient = async () => {
      setLoading(true);
      try {
        const data = await api.getPatients();
        if (Array.isArray(data)) {
          // Find the patient by DFN, ensuring data items are treated as ApiPatient type
          const found = (data as any[]).find((p: any) => String(p.DFN) === String(id));
          if (found) {
            // Map the found API data to the Patient type
            const transformedPatient: Patient = {
              id: String(found.DFN || ''),
              name: found.Name || 'Unknown',
              avatarUrl: '', // Use placeholder, API doesn't provide URL
              gender: found.Gender || '',
              age: typeof found.Age === 'number' ? found.Age : parseInt(found.Age) || 0,
              dob: found.DOB || '',
              wardNo: found.Ward || '',
              bedDetails: found.Bed || '',
              admissionDate: found["Admission Date"] || '',
              lengthOfStay: found.LOS || '',
              mobile: String(found["Mobile No"] || ''),
              primaryConsultant: found["Primary Consultant"] || '',
              specialty: found.Specialty || '',
              encounterProvider: found["Treating Consultant"] || '',
              finalDiagnosis: found["Final Diagnosis"] || '',
              posting: found.Posting || '',
              reasonForVisit: found["Reason For Visit"] || '',
              ssn: String(found.SSN || ''),
              // Include other fields from ApiPatient if necessary and not already mapped
              "Admission Date": found["Admission Date"] || '',
              Age: found.Age,
              Bed: found.Bed || '',
              DFN: found.DFN || 0,
              DOB: found.DOB || '',
              Gender: found.Gender || '',
              "IP No": found["IP No"] || 0,
              LOS: found.LOS || '',
              "Mobile No": found["Mobile No"] || 0,
              Name: found.Name || '',
              "Primary Consultant": found["Primary Consultant"] || '',
              "Secondary Consultant": found["Secondary Consultant"] || '',
              Specialty: found.Specialty || '',
              "Treating Consultant": found["Treating Consultant"] || '',
              Ward: found.Ward || '',
            };
            setPatient(transformedPatient);
          }
        }
      } catch (error) {
        console.error('Error fetching patient for sidebar:', error);
      }
      setLoading(false);
    };
    if (id) fetchPatient();
    else setPatient(null);
  }, [id]);

  if (!id) return <div className="text-gray-100 bg-teal-700 h-full p-4 text-center">No patient selected</div>;
  if (loading) return <div className="text-gray-100 bg-teal-700 h-full p-4 text-center">Loading...</div>;
  if (!patient) return <div className="text-red-200 bg-teal-700 h-full p-4 text-center">Patient not found</div>;

  // Format Gender initial and Age
  const genderInitial = patient.gender ? patient.gender.charAt(0).toUpperCase() : '';
  const formattedPatientInfo = `${patient.name} (${genderInitial} ${patient.age})`;

  return (
    <aside className="w-full max-w-xs bg-teal-700 text-white h-screen overflow-y-auto text-xs">
      <div className="flex flex-col items-center">
        {/* Avatar Placeholder */}
        <div className="w-16 h-16 rounded-full bg-teal-600 flex items-center justify-center mb-2 mt-4">
          <User className="w-10 h-10 text-teal-300" />
        </div>
        {/* Patient Name (Gender Age) */}
        <div className="text-sm font-semibold text-center mb-4">{formattedPatientInfo}</div>

        {/* Original Patient Details - Removed or Updated */}
        {/* Removed: Name, Gender, Patient ID, DOB/Age */} {/* Mobile No. kept for now */}
        <div className="mb-2 px-4 w-full">
          {/* Patient ID with Icon */}
          <div className="flex items-center"><CreditCard className="mr-2 h-4 w-4" /><span className="font-semibold"></span> {patient.DFN}</div> {/* Kept Patient ID */}
          {/* Mobile No. with Icon */}
          <div className="flex items-center"><Phone className="mr-2 h-4 w-4" /><span className="font-semibold"></span> {patient["Mobile No"]}</div>
        </div>

        <hr className="my-2 border-teal-500 w-full px-4" />

        <div className="mb-4 px-4 w-full">
          <div className="font-semibold mb-2">Patient Visit / IPD Details</div>
          {/* Ward - Bed Details with Icon */}
          <div className="flex items-center gap-2 mb-1"><BedDouble className="mr-2 h-6 w-6" /> {patient.Ward} - {patient.Bed}</div>
          {/* Admission Date with Icon */}
          <div className="flex items-center gap-2 mb-1"><CalendarDays className="mr-2 h-4 w-4" /> {patient["Admission Date"]}</div>
          <div className="mb-1"><span className="font-semibold">LOS:</span> {patient.LOS}</div>
          <div className="mb-1"><span className="font-semibold">Primary Consultant:</span> {patient["Primary Consultant"]}</div>
          <div className="mb-1"><span className="font-semibold">Encounter Provider:</span> {patient["Treating Consultant"]}</div>
        </div>
        <hr className="my-2 border-teal-500 w-full px-4" />
        <div className="mb-4 px-4 w-full">
          <div className="font-semibold mb-2">Patient Clinical Details</div>
          <div className="mb-1"><span className="font-semibold">Final Diagnosis:</span> {patient.finalDiagnosis}</div>
          <div className="mb-1"><span className="font-semibold">Posting:</span> {patient.posting}</div>
          <div className="mb-1"><span className="font-semibold">Reason For Visit:</span> {patient.reasonForVisit}</div>
        </div>
      </div>
    </aside>
  );
}