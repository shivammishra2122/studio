import axios from 'axios';

const API_BASE_URL = 'http://3.6.230.54:4003/api';

export interface Patient {
    "Admission Date": string;
    Age: string | number;
    Bed: string;
    DFN: number;
    DOB: string;
    Gender: string;
    "IP No": number;
    LOS: string;
    "Mobile No": number;
    Name: string;
    "Primary Consultant": string;
    "Secondary Consultant": string;
    Specialty: string;
    "Treating Consultant": string;
    Ward: string;
    // ...add other fields as needed
}

interface PatientSearchParams {
    UserName: string;
    Password: string;
    DUZ: string;
    PatientSSN: string;
    lname: string;
    cpDOB: string;
    mno: string;
    cpIPNo: string;
    SearchType: string;
}

export const api = {
    async getPatients() {
        try {
            const searchParams: PatientSearchParams = {
                UserName: "CPRS-PRO",
                Password: "ProApk1103@25San",
                DUZ: "115",
                PatientSSN: "",
                lname: "",
                cpDOB: "",
                mno: "",
                cpIPNo: "",
                SearchType: "2"
            };

            const response = await axios.post(`${API_BASE_URL}/apiPatDetail.sh`, searchParams, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            // Convert object to array
            if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
                return Object.values(response.data);
            }
            return [];
        } catch (error) {
            console.error('Error fetching patients:', error);
            return [];
        }
    }
}; 