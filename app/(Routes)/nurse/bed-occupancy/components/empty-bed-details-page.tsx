"use client";

import { User } from "lucide-react";
import type { WardBedData } from "@/types";


export function EmptyPatientDetailsPanel() {

    // Empty state when no consultation / no patient selected
    return (
        <div className="space-y-6 overflow-y-auto h-full">
            <div>
                <h3 className="font-semibold text-lg mb-4">Patient</h3>

                {/* Empty state header */}
                <div className="flex items-start space-x-4  mt-7">

                    <div className="min-w-0 flex-1">
                        <p className="text-lg font-medium">No patient assigned</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            This bed currently has no patient assigned, or no patient is selected.
                        </p>


                        <ul className="mt-3 text-xs text-muted-foreground space-y-1">
                            <li>Tip: Use the colour legend to identify bed status.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* No assigned doctor/nurse when empty */}
        </div>
    );
}
