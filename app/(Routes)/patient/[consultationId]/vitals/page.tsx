"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { useParams } from "next/navigation";
import { VitalsListView } from "./components/vitals-list-view";
import { VitalsFormView } from "./components/vitals-form-view";
import { Suspense } from "react";

export default function VitalsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const params = useParams();
  const consultationId = params.consultationId as string;

  const showForm = searchParams.get("new-vitals") === "true";

  return (
    <main className="py-6">
        {showForm ? (
          <VitalsFormView
            consultationId={consultationId}
            onCancel={() =>
              router.push(`/patient/${consultationId}/vitals`)
            }
          />
        ) : (
          <VitalsListView consultationId={consultationId} />
        )}
    </main>
  );
}
