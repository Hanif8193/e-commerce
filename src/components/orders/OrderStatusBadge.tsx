import { Badge } from "@/components/ui/Badge";

const statusMap = {
  PENDING: { variant: "warning", label: "Pending" },
  PAID: { variant: "info", label: "Paid" },
  FULFILLED: { variant: "success", label: "Fulfilled" },
  CANCELLED: { variant: "error", label: "Cancelled" },
} as const;

interface OrderStatusBadgeProps {
  status: keyof typeof statusMap;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const { variant, label } = statusMap[status] ?? { variant: "default", label: status };
  return <Badge variant={variant as "warning" | "info" | "success" | "error" | "default"}>{label}</Badge>;
}
