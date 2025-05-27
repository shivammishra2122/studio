
'use client'

import { Card, CardContent, CardDescription, CardTitle, CardHeader as ShadcnCardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader as ShadcnTableHeader, TableRow } from '@/components/ui/table'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import type { ChartConfig } from '@/components/ui/chart'
import { CartesianGrid, XAxis, YAxis, Line, LineChart as RechartsLineChart } from 'recharts'
import {
  Droplet, HeartPulse, Activity, Thermometer, Scale, Edit3, Clock, Pill as PillIcon, Plus, MoreVertical,
  Ban, FileText, ScanLine, ClipboardList, BellRing,
} from 'lucide-react'
import {
  HealthMetric, Problem, Medication, ProblemCategory, ProblemStatus, ProblemImmediacy, ProblemService,
  MOCK_PROBLEMS, MOCK_MEDICATIONS, pageCardSampleContent, MOCK_KEY_INDICATORS,
  MOCK_HEART_RATE_MONITOR_DATA, MOCK_HEART_RATE_MONITOR_CHART_CONFIG,
  MOCK_GLUCOSE_DATA, MOCK_BLOOD_PRESSURE_DATA, MOCK_BODY_TEMPERATURE_DATA, MOCK_WEIGHT_DATA,
} from '@/lib/constants'
import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle as DialogUITitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const glucoseChartConfig: ChartConfig = { level: { label: 'Glucose (mg/dL)', color: 'hsl(var(--chart-2))' } }
const bloodPressureChartConfig: ChartConfig = {
  systolic: { label: 'Systolic (mmHg)', color: 'hsl(var(--chart-1))' },
  diastolic: { label: 'Diastolic (mmHg)', color: 'hsl(var(--chart-3))' },
}
const bodyTemperatureChartConfig: ChartConfig = { temp: { label: 'Temperature (°F)', color: 'hsl(var(--chart-4))' } }
const weightChartConfig: ChartConfig = { weight: { label: 'Weight (kg)', color: 'hsl(var(--chart-5))' } }

const infoCardIcons: Record<string, React.ElementType> = {
  Allergies: Ban,
  Radiology: ScanLine,
  Report: FileText,
  'Clinical notes': FileText,
  'Encounter notes': ClipboardList,
  'Clinical reminder': BellRing,
}

const secondRowInformationalCardTitles: string[] = ['Allergies', 'Medications History', 'Report', 'Radiology']
const thirdRowInformationalCardTitles: string[] = ['Clinical notes', 'Encounter notes', 'Clinical reminder']

export default function DashboardPage(): JSX.Element {
  const [problems, setProblems] = useState<Problem[]>(MOCK_PROBLEMS)
  const [medications, setMedications] = useState<Medication[]>(MOCK_MEDICATIONS)
  const [dynamicPageCardSampleContent, setDynamicPageCardSampleContent] = useState<Record<string, string[]>>(() => 
    JSON.parse(JSON.stringify(pageCardSampleContent))
  )

  const [isAddProblemDialogOpen, setIsAddProblemDialogOpen] = useState(false)
  const [newProblemInput, setNewProblemInput] = useState('')
  const [newProblemCategory, setNewProblemCategory] = useState<ProblemCategory | ''>('')
  const [newProblemOther, setNewProblemOther] = useState(false)
  const [newProblemPreferred, setNewProblemPreferred] = useState<string[]>([])
  const [newProblemStatus, setNewProblemStatus] = useState<ProblemStatus | ''>('')
  const [newProblemImmediacy, setNewProblemImmediacy] = useState<ProblemImmediacy | ''>('')
  const [newProblemDateOnset, setNewProblemDateOnset] = useState('')
  const [newProblemService, setNewProblemService] = useState<ProblemService | ''>('')
  const [newProblemComment, setNewProblemComment] = useState('')
  const [isAddMedicationDialogOpen, setIsAddMedicationDialogOpen] = useState(false)
  const [newMedicationInput, setNewMedicationInput] = useState('')
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false)
  const [editingInfoCardTitle, setEditingInfoCardTitle] = useState<string | null>(null)
  const [newItemInput, setNewItemInput] = useState('')
  const [activeChartTab, setActiveChartTab] = useState<string>('heart-rate')
  const [detailViewTitle, setDetailViewTitle] = useState<string>('')
  const [detailViewContent, setDetailViewContent] = useState<string>('')

  const problemDialogRef = useRef<HTMLDivElement>(null)
  const problemHeaderRef = useRef<HTMLDivElement>(null)
  const isProblemDialogDragging = useRef(false)
  const problemDragStartCoords = useRef({ x: 0, y: 0 })
  const problemInitialDialogOffset = useRef({ x: 0, y: 0 })

  const handleAddProblem = () => {
    if (!newProblemInput.trim()) return
    const newProb: Problem = {
      id: Date.now().toString(),
      description: newProblemInput,
    }
    setProblems(prev => [newProb, ...prev])
    setNewProblemInput('')
    setNewProblemCategory('')
    setNewProblemOther(false)
    setNewProblemPreferred([])
    setNewProblemStatus('')
    setNewProblemImmediacy('')
    setNewProblemDateOnset('')
    setNewProblemService('')
    setNewProblemComment('')
    setIsAddProblemDialogOpen(false)
  }

  const handleAddMedication = () => {
    if (!newMedicationInput.trim()) return
    const newMed: Medication = {
      id: Date.now().toString(),
      name: newMedicationInput,
      reason: 'General',
      amount: 'N/A',
      timing: 'N/A',
      status: 'Active',
    }
    setMedications(prev => [newMed, ...prev])
    setNewMedicationInput('')
    setIsAddMedicationDialogOpen(false)
  }

  const openAddProblemDialog = () => {
    setNewProblemInput('')
    setNewProblemCategory('')
    setNewProblemOther(false)
    setNewProblemPreferred([])
    setNewProblemStatus('')
    setNewProblemImmediacy('')
    setNewProblemDateOnset('')
    setNewProblemService('')
    setNewProblemComment('')
    if (problemDialogRef.current) {
      problemDialogRef.current.style.transform = 'translate(-50%, -50%)'
    }
    setIsAddProblemDialogOpen(true)
  }

  const openAddMedicationDialog = () => {
    setNewMedicationInput('')
    setIsAddMedicationDialogOpen(true)
  }

  const handleOpenAddItemDialog = (title: string) => {
    setEditingInfoCardTitle(title)
    setNewItemInput('')
    setIsAddItemDialogOpen(true)
  }

  const handleSaveNewInfoItem = () => {
    if (!newItemInput.trim() || !editingInfoCardTitle) return
    setDynamicPageCardSampleContent(prev => ({
      ...prev,
      [editingInfoCardTitle]: [newItemInput, ...(prev[editingInfoCardTitle] || [])],
    }))
    setNewItemInput('')
    setIsAddItemDialogOpen(false)
    setEditingInfoCardTitle(null)
  }

  const handleShowItemDetailInChartArea = (titlePrefix: string, itemText: string) => {
    setDetailViewTitle(`${titlePrefix}: ${itemText.substring(0, 40)}${itemText.length > 40 ? '...' : ''}`)
    let contentToShow = itemText
    if (titlePrefix === 'Radiology Detail' && itemText === 'Chest X-Ray: Clear') {
      contentToShow = `Normal lung expansion without fluid or masses.\nHeart size within normal limits.\nClear airways and no structural abnormalities in the bones or diaphragm.`
    }
    setDetailViewContent(contentToShow)
    setActiveChartTab('detail-view')
  }

  const handleProblemDialogMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (problemHeaderRef.current && problemDialogRef.current) {
      isProblemDialogDragging.current = true
      problemDragStartCoords.current = { x: e.clientX, y: e.clientY }
      const style = window.getComputedStyle(problemDialogRef.current)
      const matrix = new DOMMatrixReadOnly(style.transform)
      problemInitialDialogOffset.current = { x: matrix.m41, y: matrix.m42 }
      problemHeaderRef.current.style.cursor = 'grabbing'
      document.body.style.cursor = 'grabbing'
      e.preventDefault()
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isProblemDialogDragging.current || !problemDialogRef.current) return
      const deltaX = e.clientX - problemDragStartCoords.current.x
      const deltaY = e.clientY - problemDragStartCoords.current.y
      const newX = problemInitialDialogOffset.current.x + deltaX
      const newY = problemInitialDialogOffset.current.y + deltaY
      problemDialogRef.current.style.transform = `translate(${newX}px, ${newY}px)`
    }

    const handleMouseUp = () => {
      if (isProblemDialogDragging.current) {
        isProblemDialogDragging.current = false
        if (problemHeaderRef.current) {
          problemHeaderRef.current.style.cursor = 'grab'
        }
        document.body.style.cursor = 'default'
      }
    }

    if (isAddProblemDialogOpen) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      if (problemHeaderRef.current) {
        problemHeaderRef.current.style.cursor = 'grab'
      }
      document.body.style.cursor = 'default'
    }
  }, [isAddProblemDialogOpen])

  return (
    <div className="flex flex-1 flex-col p-3 bg-background">
      {/* Top Row: Problem, Chart, Vital */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-2">
        <Card className="lg:col-span-3 shadow-lg">
          <ShadcnCardHeader className="flex flex-row items-center justify-between pt-2 pb-0 px-3">
            <div className="flex items-center space-x-1.5">
              <Clock className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Problems</CardTitle>
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">{problems.length}</Badge>
            </div>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="h-7 w-7 mr-0.5" onClick={openAddProblemDialog}>
                <Edit3 className="h-3.5 w-3.5" />
                <span className="sr-only">Edit Problems</span>
              </Button>
            </div>
          </ShadcnCardHeader>
          <CardContent className="p-0 max-h-32 overflow-y-auto no-scrollbar">
            <Table>
              <TableBody>
                {problems.map((problem, index) => (
                  <TableRow key={problem.id} className={index % 2 === 0 ? 'bg-muted/30' : ''}>
                    <TableCell className="px-2 py-1">
                      <div className="font-medium text-xs">{problem.description}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {problems.length === 0 && (
              <p className="py-4 text-center text-xs text-muted-foreground">No problems listed.</p>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-5 shadow-lg h-full">
          <CardContent className="pt-2 px-2 pb-2">
            <Tabs value={activeChartTab} onValueChange={setActiveChartTab} className="w-full">
              <TabsList className="hidden">
                <TabsTrigger value="heart-rate">Heart Rate</TabsTrigger>
                <TabsTrigger value="blood-glucose">Blood Glucose</TabsTrigger>
                <TabsTrigger value="blood-pressure">Blood Pressure</TabsTrigger>
                <TabsTrigger value="body-temperature">Body Temperature</TabsTrigger>
                <TabsTrigger value="weight">Weight</TabsTrigger>
                <TabsTrigger value="detail-view">Detail</TabsTrigger>
              </TabsList>
              <TabsContent value="heart-rate">
                <Card className="border-0 shadow-none">
                  <CardContent className="p-1.5 max-h-[150px] overflow-y-auto no-scrollbar">
                    <ChartContainer config={MOCK_HEART_RATE_MONITOR_CHART_CONFIG} className="h-[140px] w-full">
                      <RechartsLineChart data={MOCK_HEART_RATE_MONITOR_DATA} margin={{ left: 0, right: 5, top: 5, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={4} fontSize={9} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={4} fontSize={9} domain={[60, 120]} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Line dataKey="hr" type="monotone" stroke="var(--color-hr)" strokeWidth={1.5} dot={{ r: 2 }} />
                      </RechartsLineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="blood-glucose">
                <Card className="border-0 shadow-none">
                  <CardContent className="p-1.5 max-h-[150px] overflow-y-auto no-scrollbar">
                    <ChartContainer config={glucoseChartConfig} className="h-[140px] w-full">
                      <RechartsLineChart data={MOCK_GLUCOSE_DATA} margin={{ left: 0, right: 5, top: 5, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={4} fontSize={9} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={4} fontSize={9} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Line dataKey="level" type="monotone" stroke="var(--color-level)" strokeWidth={1.5} dot={{ r: 2 }} />
                      </RechartsLineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="blood-pressure">
                <Card className="border-0 shadow-none">
                  <CardContent className="p-1.5 max-h-[150px] overflow-y-auto no-scrollbar">
                    <ChartContainer config={bloodPressureChartConfig} className="h-[140px] w-full">
                      <RechartsLineChart data={MOCK_BLOOD_PRESSURE_DATA} margin={{ left: 0, right: 5, top: 5, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={4} fontSize={9} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={4} fontSize={9} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                        <Line dataKey="systolic" type="monotone" stroke="var(--color-systolic)" strokeWidth={1.5} dot={{ r: 2 }} />
                        <Line dataKey="diastolic" type="monotone" stroke="var(--color-diastolic)" strokeWidth={1.5} dot={{ r: 2 }} />
                      </RechartsLineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="body-temperature">
                <Card className="border-0 shadow-none">
                  <CardContent className="p-1.5 max-h-[150px] overflow-y-auto no-scrollbar">
                    <ChartContainer config={bodyTemperatureChartConfig} className="h-[140px] w-full">
                      <RechartsLineChart data={MOCK_BODY_TEMPERATURE_DATA} margin={{ left: 0, right: 5, top: 5, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={4} fontSize={9} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={4} fontSize={9} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Line dataKey="temp" type="monotone" stroke="var(--color-temp)" strokeWidth={1.5} dot={{ r: 2 }} />
                      </RechartsLineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="weight">
                <Card className="border-0 shadow-none">
                  <CardContent className="p-1.5 max-h-[150px] overflow-y-auto no-scrollbar">
                    <ChartContainer config={weightChartConfig} className="h-[140px] w-full">
                      <RechartsLineChart data={MOCK_WEIGHT_DATA} margin={{ left: 0, right: 5, top: 5, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={4} fontSize={9} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={4} fontSize={9} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Line dataKey="weight" type="monotone" stroke="var(--color-weight)" strokeWidth={1.5} dot={{ r: 2 }} />
                      </RechartsLineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="detail-view">
                <Card className="border-0 shadow-none">
                  <ShadcnCardHeader className="pt-2 pb-1 px-3">
                    <CardTitle className="text-base">{detailViewTitle}</CardTitle>
                  </ShadcnCardHeader>
                  <CardContent className="p-3 text-sm text-foreground max-h-[150px] overflow-y-auto no-scrollbar">
                    {detailViewContent.split('\n').map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 shadow-lg h-full">
          <CardContent className="space-y-1.5 p-2 max-h-44 overflow-y-auto no-scrollbar">
            {MOCK_KEY_INDICATORS.map((indicator) => {
              const isActive = indicator.tabValue === activeChartTab
              return (
                <div
                  key={indicator.name}
                  className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer
                    ${isActive ? 'bg-primary/10 ring-1 ring-primary' : 'bg-muted/70 hover:bg-muted/90'}`}
                  onClick={() => indicator.tabValue && setActiveChartTab(indicator.tabValue)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && indicator.tabValue) setActiveChartTab(indicator.tabValue)
                  }}
                >
                  <div className="flex items-center">
                    {indicator.icon && (
                      <indicator.icon
                        className="h-4 w-4 mr-1.5"
                        style={{ color: isActive && indicator.activeColor ? indicator.activeColor : 'hsl(var(--primary))' }}
                      />
                    )}
                    <span className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-foreground'}`}>
                      {indicator.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-normal ${isActive ? 'text-primary' : 'text-foreground'}`}>
                      {indicator.value}
                    </span>
                    <span className={`text-xs font-normal ml-0.5 ${isActive ? 'text-primary/80' : 'text-foreground/80'}`}>
                      {indicator.unit}
                    </span>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Second Row: Allergies (20%), Medications History (30%), Report (30%), Radiology (20%) */}
      <div className="grid grid-cols-1 md:grid-cols-10 gap-3 mb-2">
        <Card className="md:col-span-2 shadow-lg">
          <ShadcnCardHeader className="flex flex-row items-center justify-between pt-2 pb-0 px-3">
            <div className="flex items-center space-x-1.5">
              <Ban className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Allergies</CardTitle>
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                {(dynamicPageCardSampleContent['Allergies'] || []).length}
              </Badge>
            </div>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="h-7 w-7 mr-0.5" onClick={() => handleOpenAddItemDialog('Allergies')}>
                <Edit3 className="h-3.5 w-3.5" />
                <span className="sr-only">Edit Allergies</span>
              </Button>
            </div>
          </ShadcnCardHeader>
          <CardContent className="p-0 max-h-32 overflow-y-auto no-scrollbar">
            <Table>
              <TableBody>
                {(dynamicPageCardSampleContent['Allergies'] || []).map((item, index) => (
                  <TableRow
                    key={index}
                    onClick={() => handleShowItemDetailInChartArea('Allergy Detail', item)}
                    className={`cursor-pointer hover:bg-muted/50 ${index % 2 === 0 ? 'bg-muted/30' : ''}`}
                  >
                    <TableCell className="px-2 py-1">
                      <div className="font-medium text-xs">{item}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {(dynamicPageCardSampleContent['Allergies'] || []).length === 0 && (
              <p className="py-4 text-center text-xs text-muted-foreground">No items listed.</p>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-3 shadow-lg">
          <ShadcnCardHeader className="flex flex-row items-center justify-between pt-2 pb-0 px-3">
            <div className="flex items-center space-x-1.5">
              <PillIcon className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Medications</CardTitle>
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">{medications.length}</Badge>
            </div>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="h-7 w-7 mr-0.5" onClick={openAddMedicationDialog}>
                <Edit3 className="h-3.5 w-3.5" />
                <span className="sr-only">Edit Medications</span>
              </Button>
            </div>
          </ShadcnCardHeader>
          <CardContent className="p-0 max-h-32 overflow-y-auto no-scrollbar">
            <Table>
              <TableBody>
                {medications.map((med, index) => (
                  <TableRow key={med.id} className={index % 2 === 0 ? 'bg-muted/30' : ''}>
                    <TableCell className="px-2 py-1">
                      <div className="flex justify-between items-center">
                        <span className={`font-medium text-xs ${med.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                          {med.name}
                        </span>
                        <span className="text-xs text-muted-foreground">{med.status}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {medications.length === 0 && (
              <p className="py-4 text-center text-xs text-muted-foreground">No medications listed.</p>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-3 shadow-lg">
          <ShadcnCardHeader className="flex flex-row items-center justify-between pt-2 pb-0 px-3">
            <div className="flex items-center space-x-1.5">
              <FileText className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Lab Report</CardTitle>
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                {(dynamicPageCardSampleContent['Report'] || []).length}
              </Badge>
            </div>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="h-7 w-7 mr-0.5" onClick={() => handleOpenAddItemDialog('Report')}>
                <Edit3 className="h-3.5 w-3.5" />
                <span className="sr-only">Edit Report</span>
              </Button>
            </div>
          </ShadcnCardHeader>
          <CardContent className="p-0 max-h-32 overflow-y-auto no-scrollbar">
            <Table>
              <TableBody>
                {(dynamicPageCardSampleContent['Report'] || []).map((item, index) => (
                  <TableRow
                    key={index}
                    onClick={() => handleShowItemDetailInChartArea('Report Detail', item)}
                    className={`cursor-pointer hover:bg-muted/50 ${index % 2 === 0 ? 'bg-muted/30' : ''}`}
                  >
                    <TableCell className="px-2 py-1">
                      <div className="font-medium text-xs">{item}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {(dynamicPageCardSampleContent['Report'] || []).length === 0 && (
              <p className="py-4 text-center text-xs text-muted-foreground">No items listed.</p>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-lg">
          <ShadcnCardHeader className="flex flex-row items-center justify-between pt-2 pb-0 px-3">
            <div className="flex items-center space-x-1.5">
              <ScanLine className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Radiology</CardTitle>
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                {(dynamicPageCardSampleContent['Radiology'] || []).length}
              </Badge>
            </div>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="h-7 w-7 mr-0.5" onClick={() => handleOpenAddItemDialog('Radiology')}>
                <Edit3 className="h-3.5 w-3.5" />
                <span className="sr-only">Edit Radiology</span>
              </Button>
            </div>
          </ShadcnCardHeader>
          <CardContent className="p-0 max-h-32 overflow-y-auto no-scrollbar">
            <Table>
              <TableBody>
                {(dynamicPageCardSampleContent['Radiology'] || []).map((item, index) => (
                  <TableRow
                    key={index}
                    onClick={() => handleShowItemDetailInChartArea('Radiology Detail', item)}
                    className={`cursor-pointer hover:bg-muted/50 ${index % 2 === 0 ? 'bg-muted/30' : ''}`}
                  >
                    <TableCell className="px-2 py-1">
                      <div className="font-medium text-xs">{item}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {(dynamicPageCardSampleContent['Radiology'] || []).length === 0 && (
              <p className="py-4 text-center text-xs text-muted-foreground">No items listed.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Third Row: Clinical Notes, Encounter Notes, Clinical Reminder */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {thirdRowInformationalCardTitles.map((title) => {
          const IconComponent = infoCardIcons[title] || FileText
          const items = dynamicPageCardSampleContent[title] || []
          return (
            <Card key={title.toLowerCase().replace(/\s+/g, '-')} className="shadow-lg">
              <ShadcnCardHeader className="flex flex-row items-center justify-between pt-2 pb-0 px-3">
                <div className="flex items-center space-x-1.5">
                  <IconComponent className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">{title}</CardTitle>
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5">{items.length}</Badge>
                </div>
                <div className="flex items-center">
                  <Button variant="ghost" size="icon" className="h-7 w-7 mr-0.5" onClick={() => handleOpenAddItemDialog(title)}>
                    <Edit3 className="h-3.5 w-3.5" />
                    <span className="sr-only">Edit {title}</span>
                  </Button>
                </div>
              </ShadcnCardHeader>
              <CardContent className="p-0 max-h-24 overflow-y-auto no-scrollbar">
                <Table>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow
                        key={index}
                        onClick={() => handleShowItemDetailInChartArea(`${title} Detail`, item)}
                        className={`cursor-pointer hover:bg-muted/50 ${index % 2 === 0 ? 'bg-muted/30' : ''}`}
                      >
                        <TableCell className="px-2 py-1">
                          <div className="font-medium text-xs">{item}</div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {items.length === 0 && (
                  <p className="py-4 text-center text-xs text-muted-foreground">No items listed.</p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Dialog for Adding Items to Informational Cards */}
      <Dialog
        open={isAddItemDialogOpen && !!editingInfoCardTitle && !['Problem', 'Medications History'].includes(editingInfoCardTitle!)}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setIsAddItemDialogOpen(false)
            setEditingInfoCardTitle(null)
          } else {
            setIsAddItemDialogOpen(true)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogUITitle>Add New Item to {editingInfoCardTitle}</DialogUITitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="itemName" className="text-right">Item</Label>
              <Input id="itemName" value={newItemInput} onChange={(e) => setNewItemInput(e.target.value)} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveNewInfoItem}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for Adding Problem */}
      <Dialog open={isAddProblemDialogOpen} onOpenChange={(open) => {
        setIsAddProblemDialogOpen(open)
        if (open && problemDialogRef.current) {
          problemDialogRef.current.style.transform = 'translate(-50%, -50%)'
        }
      }}>
        <DialogContent
          ref={problemDialogRef}
          style={{
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            overflowY: 'auto',
          }}
          className="sm:max-w-[800px] rounded-lg shadow-lg max-h-[90vh]"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div
            ref={problemHeaderRef}
            onMouseDown={handleProblemDialogMouseDown}
            style={{ cursor: 'grab', userSelect: 'none', paddingTop: '0.75rem', paddingBottom: '0rem' }}
          >
            <DialogHeader>
              <DialogUITitle>Add New Problem</DialogUITitle>
            </DialogHeader>
          </div>
          <div className="flex flex-col gap-3 py-4">
            <div className="flex items-center gap-3 text-sm">
              <Label htmlFor="problemCategory" className="w-[120px] min-w-[120px]">Categories</Label>
              <Select value={newProblemCategory} onValueChange={setNewProblemCategory as (value: string) => void}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Common Problems">Common Problems</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-1">
                <Checkbox id="otherProblems" checked={newProblemOther} onCheckedChange={setNewProblemOther as (checked: boolean) => void} />
                <Label htmlFor="otherProblems">Other Problems</Label>
              </div>
            </div>
            <div className="flex gap-3 text-sm">
              <Label className="w-[120px] min-w-[120px] mt-1">Preferred Problems</Label>
              <div className="grid grid-cols-2 gap-2 flex-1 max-h-40 overflow-y-auto">
                {[
                  'Anemia (D64.9)', 'Diabetes (E11.9)', 'Dehydration (E86.0)', 'Confusion (F29.)', 'Depression (F32.9)',
                  'Double vision (H53.2)', 'Blurred Vision (H53.8)', 'Defective Vision (H54.7)', 'Eye Pain (H57.13)',
                  'Ear Pain (H60.9)', 'Fever (R50.9)',
                ].map((problem, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <Checkbox
                      id={`preferred-${index}`}
                      checked={newProblemPreferred.includes(problem)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNewProblemPreferred([...newProblemPreferred, problem])
                        } else {
                          setNewProblemPreferred(newProblemPreferred.filter(p => p !== problem))
                        }
                      }}
                    />
                    <Label htmlFor={`preferred-${index}`}>{problem}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Label htmlFor="problemStatus" className="w-[120px]">Status</Label>
              <Select value={newProblemStatus} onValueChange={setNewProblemStatus as (value: string) => void}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                  <SelectItem value="RESOLVED">RESOLVED</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Label className="w-[120px] min-w-[120px]">Immediacy</Label>
              <RadioGroup value={newProblemImmediacy} onValueChange={setNewProblemImmediacy as (value: string) => void} className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Unknown" id="immediacy-unknown" />
                  <Label htmlFor="immediacy-unknown">Unknown</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Acute" id="immediacy-acute" />
                  <Label htmlFor="immediacy-acute">Acute</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Chronic" id="immediacy-chronic" />
                  <Label htmlFor="immediacy-chronic">Chronic</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Label htmlFor="dateOnset" className="w-[120px] min-w-[120px]">Date of Onset</Label>
              <Input id="dateOnset" type="date" value={newProblemDateOnset} onChange={(e) => setNewProblemDateOnset(e.target.value)} className="flex-1" />
              <Label htmlFor="problemService" className="w-[120px] min-w-[120px] text-left">Service</Label>
              <Select value={newProblemService} onValueChange={setNewProblemService as (value: string) => void}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select Service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cardiology">Cardiology</SelectItem>
                  <SelectItem value="General Medicine">General Medicine</SelectItem>
                  <SelectItem value="Endocrinology">Endocrinology</SelectItem>
                  <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-3 text-sm">
              <Label htmlFor="problemComment" className="w-[120px] min-w-[120px]">Comment</Label>
              <Textarea id="problemComment" value={newProblemComment} onChange={(e) => setNewProblemComment(e.target.value)} className="flex-1 min-h-[80px]" />
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button onClick={handleAddProblem}>Create</Button>
            <Button
              variant="secondary"
              onClick={() => {
                setNewProblemInput('')
                setNewProblemCategory('')
                setNewProblemOther(false)
                setNewProblemPreferred([])
                setNewProblemStatus('')
                setNewProblemImmediacy('')
                setNewProblemDateOnset('')
                setNewProblemService('')
                setNewProblemComment('')
              }}
            >
              Reset
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for Adding Medication */}
      <Dialog open={isAddMedicationDialogOpen} onOpenChange={(open) => {
        setIsAddMedicationDialogOpen(open)
        if (open) {
          setNewMedicationInput('')
        }
      }}>
        <DialogContent className="sm:max-w-[800px] rounded-lg shadow-lg max-h-[90vh]">
          <div className="p-0">
            <div className="bg-blue-200 text-primary-foreground py-2 px-4 rounded-t-lg">
              <DialogUITitle className="text-base font-semibold">Order Medicines</DialogUITitle>
            </div>
            <div className="p-4 text-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                <div><span className="font-semibold">Patient ID:</span> 800000035</div>
                <div><span className="font-semibold">Name:</span> Anonymous Two</div>
                <div><span className="font-semibold">Age:</span> 69 Years</div>
                <div><span className="font-semibold">Sex:</span> MALE</div>
                <div className="md:col-span-2"><span className="font-semibold">Patient Type:</span> In Patient</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Label htmlFor="medicationName" className="w-[120px] min-w-[120px]">Medication Name</Label>
                  <Input
                    id="medicationName"
                    value={newMedicationInput}
                    onChange={(e) => setNewMedicationInput(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="quickOrder" className="w-[100px] min-w-[100px]">Quick Order</Label>
                  <Input id="quickOrder" className="flex-1" />
                  <Button variant="secondary" className="text-xs px-2 py-1 h-auto">Edit Quick List</Button>
                </div>
              </div>
            </div>
            <DialogFooter className="flex justify-center py-4 bg-blue-200 rounded-b-lg">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleAddMedication}>
                Confirm Order
              </Button>
              <Button
                variant="secondary"
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => setNewMedicationInput('')}
              >
                Reset
              </Button>
              <DialogClose asChild>
                <Button variant="outline" className="bg-orange-500 hover:bg-orange-600 text-white">Close</Button>
              </DialogClose>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
