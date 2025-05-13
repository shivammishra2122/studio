import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Power, RefreshCw, UserCircle, MoreVertical } from 'lucide-react';

// Mock data (can be moved to constants or props later)
const patientDemographic = {
  name: 'Virender Singh',
  gender: 'MALE',
  dobAge: '15 SEP, 1970 / 54 Y',
  mobileNo: '8505983659',
  id: '671209686',
  avatarUrl: 'https://picsum.photos/seed/patient-avatar/100/100', 
};

const patientVisit = {
  wardBedDetails: 'BLK-EMERGENCY WARD - BLK-EDTEMP-12A',
  admissionDate: '16 MAY, 2024 16:22',
  los: '361 days',
  primaryConsultant: 'CMO,CMO',
  encounterProvider: 'USER,ESS',
};

const patientClinical = {
  allergies: 'Pain Relief Gel',
  finalDiagnosis: '', // Empty as per image
  posting: '', // Empty as per image
  reasonForVisit: 'UNK',
};

export function PatientHeader() {
  return (
    <header className="bg-muted/30 border-b px-4 py-3 shadow-sm print:hidden">
      <div className="flex items-start justify-between gap-4 max-w-full overflow-x-auto">
        {/* Section 1: Patient Demographic Details */}
        <div className="flex items-start gap-3 flex-[2_1_auto] min-w-[300px]"> 
          <Avatar className="h-16 w-16 mt-1 flex-shrink-0">
            <AvatarImage src={patientDemographic.avatarUrl} alt={patientDemographic.name} data-ai-hint="person portrait" />
            <AvatarFallback>
              <UserCircle className="h-10 w-10 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <div className="text-xs flex-grow">
            <p className="text-sm font-semibold text-foreground truncate" title={patientDemographic.name}>{patientDemographic.name}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2">
              <div><span className="font-medium text-muted-foreground">Gender:</span> {patientDemographic.gender}</div>
              <div className="truncate"><span className="font-medium text-muted-foreground">Mobile:</span> {patientDemographic.mobileNo}</div>
              <div className="col-span-1 sm:col-span-2"><span className="font-medium text-muted-foreground">DOB/Age:</span> {patientDemographic.dobAge}</div>
            </div>
          </div>
          <div className="bg-muted/60 p-2 rounded text-center text-xs h-full flex flex-col justify-center items-center w-28 flex-shrink-0 ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-full mb-1 text-foreground/70" viewBox="0 0 100 30" fill="currentColor" aria-hidden="true">
              <rect x="5" y="5" width="3" height="20" /> <rect x="12" y="5" width="2" height="20" />
              <rect x="18" y="5" width="4" height="20" /> <rect x="26" y="5" width="1" height="20" />
              <rect x="30" y="5" width="3" height="20" /> <rect x="37" y="5" width="2" height="20" />
              <rect x="43" y="5" width="3" height="20" /> <rect x="50" y="5" width="4" height="20" />
              <rect x="58" y="5" width="1" height="20" /> <rect x="62" y="5" width="3" height="20" />
              <rect x="69" y="5" width="2" height="20" /> <rect x="75" y="5" width="4" height="20" />
              <rect x="83" y="5" width="2" height="20" /> <rect x="89" y="5" width="3" height="20" />
            </svg>
            <span className="block tracking-wider font-mono">{patientDemographic.id}</span>
          </div>
        </div>

        <Separator orientation="vertical" className="h-auto self-stretch bg-border/70" />

        {/* Section 2: Patient Visit / IPD Details */}
        <div className="text-xs flex-[1_1_auto] min-w-[200px]">
          <h3 className="font-semibold text-sm mb-1 text-primary truncate">Patient Visit / IPD Details</h3>
          <p className="truncate" title={patientVisit.wardBedDetails}><span className="font-medium text-muted-foreground">Ward-Bed:</span> {patientVisit.wardBedDetails}</p>
          <p><span className="font-medium text-muted-foreground">Admission:</span> {patientVisit.admissionDate}</p>
          <p><span className="font-medium text-muted-foreground">LOS:</span> {patientVisit.los}</p>
          <p className="truncate" title={patientVisit.primaryConsultant}><span className="font-medium text-muted-foreground">Consultant:</span> {patientVisit.primaryConsultant}</p>
          <p className="truncate" title={patientVisit.encounterProvider}><span className="font-medium text-muted-foreground">Provider:</span> {patientVisit.encounterProvider}</p>
        </div>

        <Separator orientation="vertical" className="h-auto self-stretch bg-border/70" />

        {/* Section 3: Patient Clinical Details */}
        <div className="text-xs flex-[1_1_auto] min-w-[200px]">
          <h3 className="font-semibold text-sm mb-1 text-primary truncate">Patient Clinical Details</h3>
          <p className="truncate" title={patientClinical.allergies}><span className="font-medium text-muted-foreground">Allergies:</span> {patientClinical.allergies || 'N/A'}</p>
          <p className="truncate" title={patientClinical.finalDiagnosis}><span className="font-medium text-muted-foreground">Diagnosis:</span> {patientClinical.finalDiagnosis || 'N/A'}</p>
          <p><span className="font-medium text-muted-foreground">Posting:</span> {patientClinical.posting || 'N/A'}</p>
          <p><span className="font-medium text-muted-foreground">Visit Reason:</span> {patientClinical.reasonForVisit || 'N/A'}</p>
        </div>

        {/* Section 4: Icons */}
        <div className="flex flex-col items-center space-y-0.5 flex-shrink-0">
          <Button aria-label="Refresh data" variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-primary/10">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button aria-label="View alerts" variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10">
            <AlertCircle className="h-4 w-4" />
          </Button>
          <Button aria-label="Logout" variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:bg-muted/20">
            <Power className="h-4 w-4" />
          </Button>
          <Button aria-label="More options" variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:bg-muted/20">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
