'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ArrowLeft, Download, Share2, Trash2, Edit2 } from 'lucide-react'
import Link from 'next/link'
import { LaboratoryRequestData, PatientsData, SingleLaboratoryRequestData } from '@/types/laboratory'

interface PatientProfileProps {
  patient: PatientsData
  testResults: SingleLaboratoryRequestData[]
  onDeleteResult?: (resultId: number) => void
}

export function PatientProfile({
  patient,
  testResults,
  onDeleteResult,
}: PatientProfileProps) {
  const [expandedResult, setExpandedResult] = useState<number | null>(null)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/laboratory/patients">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-900">
            {patient.first_name} {patient.surname}
          </h1>
          <p className="text-slate-600">{patient.id}</p>
        </div>
      </div>

      {/* Patient Info Card */}
      <div className="bg-white rounded-lg p-6 border border-slate-200">
        <div className="flex items-start gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={patient.profile_picture_location || "/placeholder.svg"} />
            <AvatarFallback className="text-2xl bg-blue-100 text-blue-700">
              {patient.first_name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-slate-600 mb-1">Email</p>
              <p className="font-semibold text-slate-900 text-sm">
                {patient.email}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-600 mb-1">Phone</p>
              <p className="font-semibold text-slate-900 text-sm">
                {patient.email}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-600 mb-1">Gender</p>
              <p className="font-semibold text-slate-900 text-sm">
                {patient.gender}
              </p>
            </div>
            {/* <div>
              <p className="text-xs text-slate-600 mb-1">Hospital</p>
              <p className="font-semibold text-slate-900 text-sm">
                {patient.hospital_name}
              </p>
            </div> */}
          </div>
        </div>
      </div>

      {/* Test Results */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Download className="h-5 w-5" />
            Total Test Results {testResults.length}
          </h2>
        </div>

        {testResults.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-600">No test results available</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow className="border-slate-200">
                  <TableHead className="text-slate-700">No</TableHead>
                  <TableHead className="text-slate-700">Hospital Number</TableHead>
                  <TableHead className="text-slate-700">Test Type</TableHead>
                  <TableHead className="text-slate-700">Date</TableHead>
                  <TableHead className="text-slate-700">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testResults.map((result, index) => (
                  <TableRow
                    key={result.id}
                    className="border-slate-200 hover:bg-slate-50/50 cursor-pointer"
                  >
                    <TableCell className="font-medium text-slate-900">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-slate-600">{patient.id}</TableCell>
                    <TableCell className="text-slate-600">
                      {result.investigation_request.request_type}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {new Date(result.investigation_request.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setExpandedResult(
                              expandedResult === result.id
                                ? null
                                : result.id,
                            )
                          }
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 bg-transparent"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 bg-transparent"
                          onClick={() => onDeleteResult?.(result.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Expanded Result Details */}
      {expandedResult !== null && (
        <div className="bg-white rounded-lg p-6 border border-slate-200">
          {testResults
            .filter((r) => r.id === expandedResult)
            .map((result) => (
              <div key={result.id} className="space-y-4">
                <h3 className="font-semibold text-slate-900">
                  {result.investigation_request.request_type} -{' '}
                  {new Date(result.investigation_request.created_at).toLocaleDateString()}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {result.result.map((param, idx) => (
                    <div
                      key={idx}
                      className="border border-slate-200 rounded p-4"
                    >
                      <p className="text-xs text-slate-600 mb-1">{param.name}</p>
                      <p className="font-semibold text-slate-900">
                        {param.value}
                      </p>
                      {param.reference_range && (
                        <p className="text-xs text-slate-500">
                          Ref: {param.reference_range}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
