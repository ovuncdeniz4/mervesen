import { Badge } from "@/components/ui/badge";

const LABELS: Record<string, string> = {
  CONFIRMED: "Onaylı",
  CANCELLED: "İptal",
  COMPLETED: "Tamamlandı",
};

const VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  CONFIRMED: "default",
  CANCELLED: "destructive",
  COMPLETED: "secondary",
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge variant={VARIANTS[status] ?? "outline"}>{LABELS[status] ?? status}</Badge>;
}
