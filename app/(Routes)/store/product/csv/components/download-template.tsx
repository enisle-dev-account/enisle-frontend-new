import { Button } from "@/components/ui/button"; // Assuming standard shadcn path
import { Download } from "lucide-react";

interface DownloadTemplateProps {
  productType: "medicine" | "product" | "staff";
  headers: string[];
  sampleData: string[];
}

export default function DownloadTemplateButton({
  headers,
  productType,
  sampleData,
}: DownloadTemplateProps) {
  const generateAndDownload = () => {
    const csvRows = [headers.join(","), ...sampleData].join("\n");

    const blob = new Blob([csvRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", `${productType}_import_template.csv`);
    document.body.appendChild(link);
    link.click();

    // 3. Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      onClick={generateAndDownload}
      className="rounded-full gap-4 h-10 px-7"
      size="sm"
    >
      Download Template <Download className="h-5 w-5 text-white" />
    </Button>
  );
}
