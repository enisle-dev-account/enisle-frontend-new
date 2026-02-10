'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

import { AddTestForm } from './add-test'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, MessageSquare, Share2, FileText, Download, Send } from 'lucide-react'
import Link from 'next/link'
import { LeaveNoteModal } from './leave-note'
import { ShareResultModal } from './share-result'
import { LaboratoryRequestData, SingleLaboratoryRequestData } from '@/types/laboratory'

interface TestRequestDetailsProps {
  testRequest: SingleLaboratoryRequestData
  onRefresh?: () => void
}

export function TestRequestDetails({
  testRequest,
  onRefresh,
}: TestRequestDetailsProps) {
  const [noteModalOpen, setNoteModalOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [viewresult, setViewresult] = useState(false)

  const getBillingStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Paid: 'bg-emerald-50 text-emerald-700',
      Pending: 'bg-amber-50 text-amber-700',
      Unpaid: 'bg-red-50 text-red-700',
    }
    return colors[status] || 'bg-slate-50 text-slate-700'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/laboratory/perform-test">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-900">
            {testRequest.patient.first_name} {testRequest.patient.surname}
          </h1>
          <p className="text-slate-600">{testRequest.patient.id}</p>
        </div>
      </div>

      {/* Patient Info Card */}
      <div className="bg-white rounded-lg p-6 border border-slate-200">
        <div className="flex items-start gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={testRequest.patient.profile_picture_location || "/placeholder.svg"} />
            <AvatarFallback className="text-2xl bg-blue-100 text-blue-700">
              {testRequest.patient.first_name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-slate-600 mb-1">Lab Scientist</p>
                <p className="font-semibold text-slate-900">
                  {testRequest.doctor.first_name} {testRequest.doctor.last_name}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600 mb-1">Hospital</p>
                <p className="font-semibold text-slate-900">
                  {testRequest.hospital.name}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600 mb-1">Gender</p>
                <p className="font-semibold text-slate-900">
                  {testRequest.patient.gender}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600 mb-1">Next date</p>
                <p className="font-semibold text-slate-900">
                  {new Date(testRequest.investigation_request.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setViewresult(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Import Data
              </Button>
              <Button variant="outline">Test</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <Tabs defaultValue="form" className="w-full">
          <TabsList className="w-full rounded-none border-b border-slate-200 bg-slate-50">
            <TabsTrigger value="form" className="flex-1">
              <FileText className="h-4 w-4 mr-2" />
              Add Test
            </TabsTrigger>
            <TabsTrigger value="result" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              result ({testRequest.result?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="p-6">
            <AddTestForm requestId={testRequest.id} onSuccess={onRefresh} />
          </TabsContent>

          <TabsContent value="result" className="p-6">
            {!testRequest.result || testRequest.result.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-600">No result added yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {testRequest.result.map((result) => (
                  <div
                    key={result.id}
                    className="border border-slate-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-slate-900">
                        {result.test_name}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {new Date(result.test_date).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="bg-slate-50 rounded p-4 space-y-2">
                      {result.parameters.map((param:any, idx:number) => (
                        <div
                          key={idx}
                          className="flex justify-between text-sm items-center"
                        >
                          <span className="text-slate-700">{param.name}</span>
                          <div>
                            <span className="font-medium text-slate-900">
                              {param.value}
                            </span>
                            {param.reference_range && (
                              <span className="text-slate-500 text-xs ml-2">
                                {param.reference_range}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShareModalOpen(true)}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setNoteModalOpen(true)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Note
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Print
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => setNoteModalOpen(true)}
          className="flex-1"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Leave a Note
        </Button>
        {testRequest.result && testRequest.result.length > 0 && (
          <Button
            onClick={() => setShareModalOpen(true)}
            className="flex-1"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Result
          </Button>
        )}
      </div>

      {/* Modals */}
      <LeaveNoteModal
        open={noteModalOpen}
        onOpenChange={setNoteModalOpen}
        testId={testRequest.id}
        patientName={`${testRequest.patient.first_name} ${testRequest.patient.surname}`}
        onSuccess={onRefresh}
      />

      <ShareResultModal
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
        testId={testRequest.id}
        patientName={`${testRequest.patient.first_name} ${testRequest.patient.surname}`}
        onSuccess={onRefresh}
      />
    </div>
  )
}
