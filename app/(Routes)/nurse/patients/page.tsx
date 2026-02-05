'use client';

import { Suspense } from 'react';
import { NursePatientContent } from './components/nurse-patient-content';

export default function NursePatientsPage() {
  return (
    <main className="rounded-t-2xl bg-background overflow-hidden h-full">
      <Suspense fallback={<div className="p-6">Loading...</div>}>
        <NursePatientContent />
      </Suspense>
    </main>
  );
}
