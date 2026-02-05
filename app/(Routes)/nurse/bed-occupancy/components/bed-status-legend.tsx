"use client";

interface BedStatusLegendProps {
  counts: {
    notReady: number;
    arrived: number;
    open: number;
    admitted: number;
    hold: number;
    wait: number;
    registered: number;
  };
}

export function BedStatusLegend({ counts }: BedStatusLegendProps) {
  const statuses = [
    { label: "Not Ready", count: counts.notReady, color: "bg-green-200" },
    { label: "Arrived", count: counts.arrived, color: "bg-purple-200" },
    { label: "Open", count: counts.open, color: "bg-blue-200" },
    { label: "Admitted", count: counts.admitted, color: "bg-blue-300" },
    { label: "Hold", count: counts.hold, color: "bg-blue-900" },
    { label: "Wait", count: counts.wait, color: "bg-blue-100" },
    { label: "Registered", count: counts.registered, color: "bg-pink-200" },
  ];

  return (
    <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg flex-wrap">
      {statuses.map((status) => (
        <div key={status.label} className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded ${status.color}`} />
          <span className="text-sm text-muted-foreground">
            {status.label} ({status.count})
          </span>
        </div>
      ))}
    </div>
  );
}
