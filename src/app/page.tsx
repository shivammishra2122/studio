
'use client'

import { Card, CardContent, CardTitle, CardHeader as ShadcnCardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import type { ChartConfig } from '@/components/ui/chart'
import { CartesianGrid, XAxis, YAxis, Line, LineChart as RechartsLineChart } from 'recharts'
import {
  Droplet, HeartPulse, Activity, Thermometer, Scale, Edit3, Clock, Pill as PillIcon, X, Ban, FileText,
  ScanLine, ClipboardList, BellRing,
} from 'lucide-react'
import {
  HealthMetric, Problem, Medication, ProblemCategory, ProblemStatus, ProblemImmediacy, ProblemService,
  MOCK_PROBLEMS, MOCK_MEDICATIONS, pageCardSampleContent, MOCK_KEY_INDICATORS,
  MOCK_HEART_RATE_MONITOR_DATA, MOCK_HEART_RATE_MONITOR_CHART_CONFIG,
  MOCK_GLUCOSE_DATA, MOCK_BLOOD_PRESSURE_DATA, MOCK_BODY_TEMPERATURE_DATA, MOCK_WEIGHT_DATA,
  MOCK_PATIENT, Patient,
} from '@/lib/constants'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

// Chart configurations
const glucoseChartConfig: ChartConfig = { level: { label: 'Glucose (mg/dL)', color: 'hsl(var(--chart-2))' } }
const bloodPressureChartConfig: ChartConfig = {
  systolic: { label: 'Systolic (mmHg)', color: 'hsl(var(--chart-1))' },
  diastolic: { label: 'Diastolic (mmHg)', color: 'hsl(var(--chart-3))' },
}
const bodyTemperatureChartConfig: ChartConfig = { temp: { label: 'Temperature (°F)', color: 'hsl(var(--chart-4))' } }
const weightChartConfig: ChartConfig = { weight: { label: 'Weight (kg)', color: 'hsl(var(--chart-5))' } }

// Icon mappings for informational cards
const infoCardIcons: Record<string, React.ElementType> = {
  Allergies: Ban,
  Radiology: ScanLine,
  Report: FileText,
  'Clinical notes': FileText,
  'Encounter notes': ClipboardList,
  'Clinical reminder': BellRing,
}

// Card titles for dashboard rows
const secondRowInformationalCardTitles: string[] = ['Allergies', 'Medications History', 'Report', 'Radiology']
const thirdRowInformationalCardTitles: string[] = ['Clinical notes', 'Encounter notes', 'Clinical reminder']

// Define Allergy interface
interface Allergy {
  id: string
  allergen: string
  reaction: string
  severity: 'Mild' | 'Moderate' | 'Severe' | ''
  notes: string
}

// Dialog types
type DialogType = 'problem' | 'medication' | 'info-item' | 'allergies'
interface FloatingDialog {
  id: string
  type: DialogType
  title: string
  position: { x: number; y: number }
  data?: any
}

export default function DashboardPage(): JSX.Element {
  const [problems, setProblems] = useState<Problem[]>(MOCK_PROBLEMS)
  const [medications, setMedications] = useState<Medication[]>(MOCK_MEDICATIONS)
  // Update Allergies to use structured data
  const [allergies, setAllergies] = useState<Allergy[]>([
    { id: '1', allergen: 'Peanuts', reaction: 'Rash', severity: 'Moderate', notes: 'Avoid all peanut products' },
    { id: '2', allergen: 'Shellfish', reaction: 'Anaphylaxis', severity: 'Severe', notes: 'Carry epinephrine' },
  ])
  // Update dynamicPageCardContent to exclude Allergies since it's now handled separately
  const [dynamicPageCardContent, setDynamicPageCardContent] = useState<Record<string, string[]>>(Object.fromEntries(
    Object.entries(JSON.parse(JSON.stringify(pageCardSampleContent))).filter(([key]) => key !== 'Allergies')
  ))
  const [floatingDialogs, setFloatingDialogs] = useState<FloatingDialog[]>([])
  const [activeChartTab, setActiveChartTab] = useState<string>('heart-rate')
  const [detailViewTitle, setDetailViewTitle] = useState<string>('')
  const [detailViewContent, setDetailViewContent] = useState<string>('')

  // State for dialog inputs
  const [problemInputs, setProblemInputs] = useState<
    Record<string, { input: string; category: ProblemCategory | ''; other: boolean; preferred: string[]; status: ProblemStatus | ''; immediacy: ProblemImmediacy | ''; dateOnset: string; service: ProblemService | ''; comment: string }>
  >({})
  const [medicationInputs, setMedicationInputs] = useState<
    Record<string, { name: string; reason: string; amount: string; timing: string }>
  >({})
  const [infoItemInputs, setInfoItemInputs] = useState<
    Record<string, { title: string; item: string }>
  >({})
  const [allergyInputs, setAllergyInputs] = useState<
    Record<string, { allergen: string; reaction: string; severity: 'Mild' | 'Moderate' | 'Severe' | ''; notes: string }>
  >({})

  const dialogRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const dialogDragging = useRef<Record<string, boolean>>({})
  const dragStartCoords = useRef<Record<string, { x: number; y: number }>>({})
  const initialDialogOffset = useRef<Record<string, { x: number; y: number }>>({})

  const openFloatingDialog = useCallback((type: DialogType, title: string, data?: any) => {
    const id = Date.now().toString()
    setFloatingDialogs(prev => [
      ...prev,
      {
        id,
        type,
        title,
        position: { x: -50 + prev.length * 20, y: -50 + prev.length * 20 },
        data,
      },
    ])

    if (type === 'problem') {
      setProblemInputs(prev => ({
        ...prev,
        [id]: {
          input: '',
          category: '',
          other: false,
          preferred: [],
          status: '',
          immediacy: '',
          dateOnset: '',
          service: '',
          comment: '',
        },
      }))
    } else if (type === 'medication') {
      setMedicationInputs(prev => ({
        ...prev,
        [id]: { name: '', reason: '', amount: '', timing: '' },
      }))
    } else if (type === 'info-item') {
      setInfoItemInputs(prev => ({
        ...prev,
        [id]: { title: data?.title || '', item: '' },
      }))
    } else if (type === 'allergies') {
      setAllergyInputs(prev => ({
        ...prev,
        [id]: { allergen: '', reaction: '', severity: '', notes: '' },
      }))
    }
  }, [])

  const closeFloatingDialog = useCallback((id: string) => {
    setFloatingDialogs(prev => prev.filter(dialog => dialog.id !== id))
    setProblemInputs(prev => {
      const { [id]: _, ...rest } = prev
      return rest
    })
    setMedicationInputs(prev => {
      const { [id]: _, ...rest } = prev
      return rest
    })
    setInfoItemInputs(prev => {
      const { [id]: _, ...rest } = prev
      return rest
    })
    setAllergyInputs(prev => {
      const { [id]: _, ...rest } = prev
      return rest
    })
  }, [])

  const handleMouseDown = useCallback((id: string, e: React.MouseEvent<HTMLDivElement>) => {
    const dialogRef = dialogRefs.current[id]
    if (dialogRef) {
      dialogDragging.current[id] = true
      dragStartCoords.current[id] = { x: e.clientX, y: e.clientY }
      const style = window.getComputedStyle(dialogRef)
      const matrix = new DOMMatrixReadOnly(style.transform)
      initialDialogOffset.current[id] = { x: matrix.m41, y: matrix.m42 }
      dialogRef.style.cursor = 'grabbing'
      document.body.style.cursor = 'grabbing'
      e.preventDefault()
    }
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      Object.keys(dialogDragging.current).forEach(id => {
        if (dialogDragging.current[id] && dialogRefs.current[id]) {
          const deltaX = e.clientX - dragStartCoords.current[id].x
          const deltaY = e.clientY - dragStartCoords.current[id].y
          const newX = initialDialogOffset.current[id].x + deltaX
          const newY = initialDialogOffset.current[id].y + deltaY
          dialogRefs.current[id]!.style.transform = `translate(${newX}px, ${newY}px)`
        }
      })
    }

    const handleMouseUp = () => {
      Object.keys(dialogDragging.current).forEach(id => {
        if (dialogDragging.current[id] && dialogRefs.current[id]) {
          dialogDragging.current[id] = false
          dialogRefs.current[id]!.style.cursor = 'grab'
          document.body.style.cursor = 'default'
        }
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  const handleAddProblem = (dialogId: string) => {
    const input = problemInputs[dialogId]
    if (!input?.input.trim()) return
    const newProb: Problem = {
      id: Date.now().toString(),
      description: input.input,
    }
    setProblems(prev => [newProb, ...prev])
    closeFloatingDialog(dialogId)
  }

  const handleAddMedication = (dialogId: string) => {
    const input = medicationInputs[dialogId]
    if (!input?.name.trim()) return
    const newMed: Medication = {
      id: Date.now().toString(),
      name: input.name,
      reaction: input.reason || 'General',
      amount: input.amount || 'N/A',
      timing: input.timing || 'N/A',
      status: 'Active',
    }
    setMedications(prev => [newMed, ...prev])
    closeFloatingDialog(dialogId)
  }

  const handleAddAllergy = (dialogId: string) => {
    const input = allergyInputs[dialogId]
    if (!input?.allergen.trim() || !input.severity) return
    const newAllergy: Allergy = {
      id: Date.now().toString(),
      allergen: input.allergen,
      reaction: input.reaction || 'Not specified',
      severity: input.severity as 'Mild' | 'Moderate' | 'Severe',
      notes: input.notes || '',
    }
    setAllergies(prev => [newAllergy, ...prev])
    closeFloatingDialog(dialogId)
  }

  const handleSaveNewInfoItem = (dialogId: string) => {
    const input = infoItemInputs[dialogId]
    if (!input?.item.trim() || !input.title) return
    setDynamicPageCardContent(prev => ({
      ...prev,
      [input.title]: [input.item, ...(prev[input.title] || [])],
    }))
    closeFloatingDialog(dialogId)
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

  const handleShowAllergyDetailInChartArea = (allergy: Allergy) => {
    const summary = `${allergy.allergen} - ${allergy.reaction} (${allergy.severity})`
    setDetailViewTitle(`Allergy Detail: ${summary.substring(0, 40)}${summary.length > 40 ? '...' : ''}`)
    const contentToShow = `Allergen: ${allergy.allergen}\nReaction: ${allergy.reaction}\nSeverity: ${allergy.severity}\nNotes: ${allergy.notes || 'None'}`
    setDetailViewContent(contentToShow)
    setActiveChartTab('detail-view')
  }

  return (
    <div className="flex flex-1 flex-col p-3 bg-background relative">
      {/* Top Row: Problem, Chart, Vital */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-2">
        <Card className="lg:col-span-3 shadow-lg">
          <ShadcnCardHeader className="flex flex-row items-center justify-between pt-2 pb-0 px-3">
            <div className="flex items-center space-x-1.5">
              <Clock className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Problems</CardTitle>
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">{problems.length}</Badge>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openFloatingDialog('problem', 'Add New Problem')}>
              <Edit3 className="h-3.5 w-3.5" />
              <span className="sr-only">Add Problem</span>
            </Button>
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
                <ChartContainer config={MOCK_HEART_RATE_MONITOR_CHART_CONFIG} className="h-[140px] w-full">
                  <RechartsLineChart data={MOCK_HEART_RATE_MONITOR_DATA} margin={{ left: 0, right: 5, top: 5, bottom: 0 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={4} fontSize={9} />
                    <YAxis tickLine={false} axisLine={false} tickMargin={4} fontSize={9} domain={[60, 120]} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <Line dataKey="hr" type="monotone" stroke="var(--color-hr)" strokeWidth={1.5} dot={{ r: 2 }} />
                  </RechartsLineChart>
                </ChartContainer>
              </TabsContent>
              <TabsContent value="blood-glucose">
                <ChartContainer config={glucoseChartConfig} className="h-[140px] w-full">
                  <RechartsLineChart data={MOCK_GLUCOSE_DATA} margin={{ left: 0, right: 5, top: 5, bottom: 0 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={4} fontSize={9} />
                    <YAxis tickLine={false} axisLine={false} tickMargin={4} fontSize={9} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <Line dataKey="level" type="monotone" stroke="var(--color-level)" strokeWidth={1.5} dot={{ r: 2 }} />
                  </RechartsLineChart>
                </ChartContainer>
              </TabsContent>
              <TabsContent value="blood-pressure">
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
              </TabsContent>
              <TabsContent value="body-temperature">
                <ChartContainer config={bodyTemperatureChartConfig} className="h-[140px] w-full">
                  <RechartsLineChart data={MOCK_BODY_TEMPERATURE_DATA} margin={{ left: 0, right: 5, top: 5, bottom: 0 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={4} fontSize={9} />
                    <YAxis tickLine={false} axisLine={false} tickMargin={4} fontSize={9} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <Line dataKey="temp" type="monotone" stroke="var(--color-temp)" strokeWidth={1.5} dot={{ r: 2 }} />
                  </RechartsLineChart>
                </ChartContainer>
              </TabsContent>
              <TabsContent value="weight">
                <ChartContainer config={weightChartConfig} className="h-[140px] w-full">
                  <RechartsLineChart data={MOCK_WEIGHT_DATA} margin={{ left: 0, right: 5, top: 5, bottom: 0 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={4} fontSize={9} />
                    <YAxis tickLine={false} axisLine={false} tickMargin={4} fontSize={9} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <Line dataKey="weight" type="monotone" stroke="var(--color-weight)" strokeWidth={1.5} dot={{ r: 2 }} />
                  </RechartsLineChart>
                </ChartContainer>
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

      {/* Second Row: Allergies, Medications, Report, Radiology */}
      <div className="grid grid-cols-1 md:grid-cols-10 gap-3 mb-2">
        {secondRowInformationalCardTitles.map((title) => {
          const IconComponent = infoCardIcons[title] || FileText
          const items = title === 'Allergies' ? allergies : dynamicPageCardContent[title] || []
          return (
            <Card key={title.toLowerCase().replace(/\s+/g, '-')} className={cn('shadow-lg', {
              'md:col-span-2': title === 'Allergies' || title === 'Radiology',
              'md:col-span-3': title === 'Medications History' || title === 'Report',
            })}>
              <ShadcnCardHeader className="flex flex-row items-center justify-between pt-2 pb-0 px-3">
                <div className="flex items-center space-x-1.5">
                  <IconComponent className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">{title === 'Medications History' ? 'Medications' : title}</CardTitle>
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5">{title === 'Allergies' ? allergies.length : title === 'Medications History' ? medications.length : items.length}</Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => {
                    if (title === 'Medications History') {
                      openFloatingDialog('medication', 'Order Medicines')
                    } else if (title === 'Allergies') {
                      openFloatingDialog('allergies', 'Add New Allergy')
                    } else {
                      openFloatingDialog('info-item', `Add New Item to ${title}`, { title })
                    }
                  }}
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span className="sr-only">Edit {title}</span>
                </Button>
              </ShadcnCardHeader>
              <CardContent className="p-0 max-h-32 overflow-y-auto no-scrollbar">
                <Table>
                  <TableBody>
                    {title === 'Allergies' ? (
                      allergies.map((allergy, index) => (
                        <TableRow
                          key={allergy.id}
                          onClick={() => handleShowAllergyDetailInChartArea(allergy)}
                          className={`cursor-pointer hover:bg-muted/50 ${index % 2 === 0 ? 'bg-muted/30' : ''}`}
                        >
                          <TableCell className="px-2 py-1">
                            <div className="font-medium text-xs">{`${allergy.allergen} - ${allergy.reaction} (${allergy.severity})`}</div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : title === 'Medications History' ? (
                      medications.map((med, index) => (
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
                      ))
                    ) : (
                      items.map((item, index) => (
                        <TableRow
                          key={index}
                          onClick={() => handleShowItemDetailInChartArea(`${title} Detail`, item)}
                          className={`cursor-pointer hover:bg-muted/50 ${index % 2 === 0 ? 'bg-muted/30' : ''}`}
                        >
                          <TableCell className="px-2 py-1">
                            <div className="font-medium text-xs">{item}</div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                {(title === 'Allergies' ? allergies.length : title === 'Medications History' ? medications.length : items.length) === 0 && (
                  <p className="py-4 text-center text-xs text-muted-foreground">No items listed.</p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Third Row: Clinical Notes, Encounter Notes, Clinical Reminder */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {thirdRowInformationalCardTitles.map((title) => {
          const IconComponent = infoCardIcons[title] || FileText
          const items = dynamicPageCardContent[title] || []
          return (
            <Card key={title.toLowerCase().replace(/\s+/g, '-')} className="shadow-lg">
              <ShadcnCardHeader className="flex flex-row items-center justify-between pt-2 pb-0 px-3">
                <div className="flex items-center space-x-1.5">
                  <IconComponent className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">{title}</CardTitle>
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5">{items.length}</Badge>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openFloatingDialog('info-item', `Add New Item to ${title}`, { title })}>
                  <Edit3 className="h-3.5 w-3.5" />
                  <span className="sr-only">Edit {title}</span>
                </Button>
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

      {/* Floating Dialogs */}
      {floatingDialogs.map(dialog => (
        <div
          key={dialog.id}
          ref={el => { dialogRefs.current[dialog.id] = el }}
          className="fixed bg-background border rounded-lg shadow-xl max-h-[90vh] overflow-y-auto sm:max-w-[800px] z-50"
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(${dialog.position.x}px, ${dialog.position.y}px)`,
          }}
        >
          <div
            className="flex justify-between items-center bg-muted p-2 cursor-grab"
            onMouseDown={e => handleMouseDown(dialog.id, e)}
          >
            <h2 className="text-base font-semibold">{dialog.title}</h2>
            <Button variant="ghost" size="icon" onClick={() => closeFloatingDialog(dialog.id)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-4">
            {dialog.type === 'problem' && (
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-center gap-3">
                  <Label htmlFor={`problemCategory-${dialog.id}`} className="w-[120px] min-w-[120px]">Categories</Label>
                  <Select
                    value={problemInputs[dialog.id]?.category}
                    onValueChange={value => setProblemInputs(prev => ({
                      ...prev,
                      [dialog.id]: { ...prev[dialog.id], category: value as ProblemCategory },
                    }))}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Common Problems">Common Problems</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center space-x-1">
                    <Checkbox
                      id={`otherProblems-${dialog.id}`}
                      checked={problemInputs[dialog.id]?.other}
                      onCheckedChange={checked => setProblemInputs(prev => ({
                        ...prev,
                        [dialog.id]: { ...prev[dialog.id], other: checked as boolean },
                      }))}
                    />
                    <Label htmlFor={`otherProblems-${dialog.id}`}>Other Problems</Label>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Label className="w-[120px] min-w-[120px] mt-1">Preferred Problems</Label>
                  <div className="grid grid-cols-2 gap-2 flex-1 max-h-40 overflow-y-auto">
                    {[
                      'Anemia (D64.9)', 'Diabetes (E11.9)', 'Dehydration (E86.0)', 'Confusion (F29.)', 'Depression (F32.9)',
                      'Double vision (H53.2)', 'Blurred Vision (H53.8)', 'Defective Vision (H54.7)', 'Eye Pain (H57.13)',
                      'Ear Pain (H60.9)', 'Fever (R50.9)',
                    ].map((problem, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <Checkbox
                          id={`preferred-${dialog.id}-${index}`}
                          checked={problemInputs[dialog.id]?.preferred.includes(problem)}
                          onCheckedChange={checked => setProblemInputs(prev => ({
                            ...prev,
                            [dialog.id]: {
                              ...prev[dialog.id],
                              preferred: checked
                                ? [...prev[dialog.id].preferred, problem]
                                : prev[dialog.id].preferred.filter(p => p !== problem),
                            },
                          }))}
                        />
                        <Label htmlFor={`preferred-${dialog.id}-${index}`}>{problem}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Label htmlFor={`problemInput-${dialog.id}`} className="w-[120px] min-w-[120px]">Problem</Label>
                  <Input
                    id={`problemInput-${dialog.id}`}
                    value={problemInputs[dialog.id]?.input}
                    onChange={e => setProblemInputs(prev => ({
                      ...prev,
                      [dialog.id]: { ...prev[dialog.id], input: e.target.value },
                    }))}
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Label htmlFor={`problemStatus-${dialog.id}`} className="w-[120px]">Status</Label>
                  <Select
                    value={problemInputs[dialog.id]?.status}
                    onValueChange={value => setProblemInputs(prev => ({
                      ...prev,
                      [dialog.id]: { ...prev[dialog.id], status: value as ProblemStatus },
                    }))}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                      <SelectItem value="RESOLVED">RESOLVED</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="w-[120px] min-w-[120px]">Immediacy</Label>
                  <RadioGroup
                    value={problemInputs[dialog.id]?.immediacy}
                    onValueChange={value => setProblemInputs(prev => ({
                      ...prev,
                      [dialog.id]: { ...prev[dialog.id], immediacy: value as ProblemImmediacy },
                    }))}
                    className="flex items-center gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Unknown" id={`immediacy-unknown-${dialog.id}`} />
                      <Label htmlFor={`immediacy-unknown-${dialog.id}`}>Unknown</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Acute" id={`immediacy-acute-${dialog.id}`} />
                      <Label htmlFor={`immediacy-acute-${dialog.id}`}>Acute</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Chronic" id={`immediacy-chronic-${dialog.id}`} />
                      <Label htmlFor={`immediacy-chronic-${dialog.id}`}>Chronic</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="flex items-center gap-3">
                  <Label htmlFor={`dateOnset-${dialog.id}`} className="w-[120px] min-w-[120px]">Date of Onset</Label>
                  <Input
                    id={`dateOnset-${dialog.id}`}
                    type="date"
                    value={problemInputs[dialog.id]?.dateOnset}
                    onChange={e => setProblemInputs(prev => ({
                      ...prev,
                      [dialog.id]: { ...prev[dialog.id], dateOnset: e.target.value },
                    }))}
                    className="flex-1"
                  />
                  <Label htmlFor={`problemService-${dialog.id}`} className="w-[120px] min-w-[120px] text-left">Service</Label>
                  <Select
                    value={problemInputs[dialog.id]?.service}
                    onValueChange={value => setProblemInputs(prev => ({
                      ...prev,
                      [dialog.id]: { ...prev[dialog.id], service: value },
                    }))}
                  >
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
                <div className="flex flex-col gap-3">
                  <Label htmlFor={`problemComment-${dialog.id}`} className="w-[120px] min-w-[120px]">Comment</Label>
                  <Textarea
                    id={`problemComment-${dialog.id}`}
                    value={problemInputs[dialog.id]?.comment}
                    onChange={e => setProblemInputs(prev => ({
                      ...prev,
                      [dialog.id]: { ...prev[dialog.id], comment: e.target.value },
                    }))}
                    className="flex-1 min-h-[80px]"
                  />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button onClick={() => handleAddProblem(dialog.id)}>Create</Button>
                  <Button
                    variant="secondary"
                    onClick={() => setProblemInputs(prev => ({
                      ...prev,
                      [dialog.id]: {
                        input: '',
                        category: '',
                        other: false,
                        preferred: [],
                        status: '',
                        immediacy: '',
                        dateOnset: '',
                        service: '',
                        comment: '',
                      },
                    }))}
                  >
                    Reset
                  </Button>
                  <Button variant="outline" onClick={() => closeFloatingDialog(dialog.id)}>Cancel</Button>
                </div>
              </div>
            )}

            {dialog.type === 'medication' && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 text-sm">
                  <div><span className="font-semibold">Patient ID:</span> 800000035</div>
                  <div><span className="font-semibold">Name:</span> Anonymous Two</div>
                  <div><span className="font-semibold">Age:</span> 69 Years</div>
                  <div><span className="font-semibold">Sex:</span> MALE</div>
                  <div className="md:col-span-2"><span className="font-semibold">Patient Type:</span> In Patient</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`medicationName-${dialog.id}`} className="w-[120px] min-w-[120px]">Medication Name</Label>
                    <Input
                      id={`medicationName-${dialog.id}`}
                      value={medicationInputs[dialog.id]?.name}
                      onChange={e => setMedicationInputs(prev => ({
                        ...prev,
                        [dialog.id]: { ...prev[dialog.id], name: e.target.value },
                      }))}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`medicationReason-${dialog.id}`} className="w-[120px] min-w-[120px]">Reason</Label>
                    <Input
                      id={`medicationReason-${dialog.id}`}
                      value={medicationInputs[dialog.id]?.reaction}
                      onChange={e => setMedicationInputs(prev => ({
                        ...prev,
                        [dialog.id]: { ...prev[dialog.id], reaction: e.target.value },
                      }))}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`medicationAmount-${dialog.id}`} className="w-[120px] min-w-[120px]">Amount</Label>
                    <Input
                      id={`medicationAmount-${dialog.id}`}
                      value={medicationInputs[dialog.id]?.amount}
                      onChange={e => setMedicationInputs(prev => ({
                        ...prev,
                        [dialog.id]: { ...prev[dialog.id], amount: e.target.value },
                      }))}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`medicationTiming-${dialog.id}`} className="w-[120px] min-w-[120px]">Timing</Label>
                    <Input
                      id={`medicationTiming-${dialog.id}`}
                      value={medicationInputs[dialog.id]?.timing}
                      onChange={e => setMedicationInputs(prev => ({
                        ...prev,
                        [dialog.id]: { ...prev[dialog.id], timing: e.target.value },
                      }))}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="flex justify-center gap-2 mt-4">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => handleAddMedication(dialog.id)}>
                    Confirm Order
                  </Button>
                  <Button
                    variant="secondary"
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => setMedicationInputs(prev => ({
                      ...prev,
                      [dialog.id]: { name: '', reaction: '', amount: '', timing: '' },
                    }))}
                  >
                    Reset
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => closeFloatingDialog(dialog.id)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}

            {dialog.type === 'allergies' && (
              <div className="flex flex-col gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Label htmlFor={`allergen-${dialog.id}`} className="w-[120px] min-w-[120px]">Allergen</Label>
                  <Input
                    id={`allergen-${dialog.id}`}
                    value={allergyInputs[dialog.id]?.allergen}
                    onChange={e => setAllergyInputs(prev => ({
                      ...prev,
                      [dialog.id]: { ...prev[dialog.id], allergen: e.target.value },
                    }))}
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`reaction-${dialog.id}`} className="w-[120px] min-w-[120px]">Reaction</Label>
                  <Input
                    id={`reaction-${dialog.id}`}
                    value={allergyInputs[dialog.id]?.reaction}
                    onChange={e => setAllergyInputs(prev => ({
                      ...prev,
                      [dialog.id]: { ...prev[dialog.id], reaction: e.target.value },
                    }))}
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`severity-${dialog.id}`} className="w-[120px] min-w-[120px]">Severity</Label>
                  <Select
                    value={allergyInputs[dialog.id]?.severity}
                    onValueChange={value => setAllergyInputs(prev => ({
                      ...prev,
                      [dialog.id]: { ...prev[dialog.id], severity: value as 'Mild' | 'Moderate' | 'Severe' },
                    }))}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mild">Mild</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Severe">Severe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor={`notes-${dialog.id}`} className="w-[120px] min-w-[120px]">Notes</Label>
                  <Textarea
                    id={`notes-${dialog.id}`}
                    value={allergyInputs[dialog.id]?.notes}
                    onChange={e => setAllergyInputs(prev => ({
                      ...prev,
                      [dialog.id]: { ...prev[dialog.id], notes: e.target.value },
                    }))}
                    className="flex-1 min-h-[80px]"
                  />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button onClick={() => handleAddAllergy(dialog.id)}>Add Allergy</Button>
                  <Button
                    variant="secondary"
                    onClick={() => setAllergyInputs(prev => ({
                      ...prev,
                      [dialog.id]: { allergen: '', reaction: '', severity: '', notes: '' },
                    }))}
                  >
                    Reset
                  </Button>
                  <Button variant="outline" onClick={() => closeFloatingDialog(dialog.id)}>Cancel</Button>
                </div>
              </div>
            )}

            {dialog.type === 'info-item' && (
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4 text-sm">
                  <Label htmlFor={`itemName-${dialog.id}`} className="text-right">Item</Label>
                  <Input
                    id={`itemName-${dialog.id}`}
                    value={infoItemInputs[dialog.id]?.item}
                    onChange={e => setInfoItemInputs(prev => ({
                      ...prev,
                      [dialog.id]: { ...prev[dialog.id], item: e.target.value },
                    }))}
                    className="col-span-3"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button onClick={() => handleSaveNewInfoItem(dialog.id)}>Add Item</Button>
                  <Button variant="outline" onClick={() => closeFloatingDialog(dialog.id)}>Cancel</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
