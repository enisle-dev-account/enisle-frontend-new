import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TransactionItem } from "@/types/cashier";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { PAYING_FOR_OPTIONS } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import SectionLabel from "./section-label";

export default function ItemsTable({
  items,
  isEditable,
  onItemsChange,
  amountPaid,
  onAmountPaidChange,
}: {
  items: TransactionItem[];
  isEditable: boolean;
  onItemsChange: (items: TransactionItem[]) => void;
  amountPaid: number;
  onAmountPaidChange: (v: number) => void;
}) {
  const total = items.reduce((s, i) => s + i.quantity * i.price, 0);
  //   const balance = total - amountPaid;

  const balance = total;

  const updateItem = (
    idx: number,
    field: keyof TransactionItem,
    value: string | number,
  ) => {
    const next = items.map((item, i) =>
      i === idx ? { ...item, [field]: value } : item,
    );
    onItemsChange(next);
  };

  const removeItem = (idx: number) => {
    onItemsChange(items.filter((_, i) => i !== idx));
  };

  const addItem = () => {
    onItemsChange([
      ...items,
      { itemType: "consultation", itemId: null, quantity: 1, price: 0 },
    ]);
  };

  return (
    <div className="flex flex-col gap-3">
      <SectionLabel>Line Items</SectionLabel>
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-xs">Item</TableHead>
              <TableHead className="text-xs w-20 ">Details</TableHead>
              <TableHead className="text-xs w-20 text-right">Qty</TableHead>
              <TableHead className="text-xs w-28 text-right">Price</TableHead>
              <TableHead className="text-xs w-28 text-right">Total</TableHead>
              {isEditable && <TableHead className="w-10" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell className="py-2">
                  {isEditable ? (
                    <Select
                      value={item.itemType}
                      onValueChange={(v) => updateItem(idx, "itemType", v)}
                    >
                      <SelectTrigger className="h-8 text-xs border-0 bg-muted/40 focus:ring-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PAYING_FOR_OPTIONS.map((opt) => (
                          <SelectItem
                            key={opt}
                            value={opt}
                            className="text-xs capitalize"
                          >
                            {opt.charAt(0).toUpperCase() + opt.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="text-sm capitalize">{item.itemType}</span>
                  )}
                </TableCell>
                <TableCell>{item.details}</TableCell>
                <TableCell className="py-2 text-right">
                  {isEditable ? (
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(
                          idx,
                          "quantity",
                          parseInt(e.target.value) || 1,
                        )
                      }
                      className="h-8 w-16 text-xs text-right ml-auto border-0 bg-muted/40"
                    />
                  ) : (
                    <span className="text-sm">{item.quantity}</span>
                  )}
                </TableCell>
                <TableCell className="py-2 text-right">
                  {isEditable ? (
                    <Input
                      type="number"
                      min={0}
                      step={0.01}
                      value={item.price}
                      onChange={(e) =>
                        updateItem(
                          idx,
                          "price",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      className="h-8 w-24 text-xs text-right ml-auto border-0 bg-muted/40"
                    />
                  ) : (
                    <span className="text-sm">
                      {formatCurrency(item.price)}
                    </span>
                  )}
                </TableCell>
                <TableCell className="py-2 text-right text-sm font-medium">
                  {formatCurrency(item.quantity * item.price)}
                </TableCell>
                {isEditable && (
                  <TableCell className="py-2">
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={isEditable ? 5 : 4}
                  className="text-center text-xs text-muted-foreground py-6"
                >
                  No items added yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {isEditable && (
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors self-start"
        >
          <Plus className="h-3.5 w-3.5" />
          Add item
        </button>
      )}

      {/* Totals */}
      <div className="rounded-lg border bg-muted/30 p-3 flex flex-col gap-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatCurrency(total)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          {/* {!isEditable && (
            <>
              <span className="text-muted-foreground">Amount Paid</span>
              <Input
                type="number"
                min={0}
                step={0.01}
                value={amountPaid}
                onChange={(e) =>
                  onAmountPaidChange(parseFloat(e.target.value) || 0)
                }
                className="h-7 w-28 text-xs text-right border-0 bg-white"
              />
            </>
          )} */}
        </div>
        <Separator />
        <div className="flex justify-between text-sm font-semibold">
          <span>Balance Due</span>
          <span className={balance > 0 ? "text-red-600" : "text-emerald-600"}>
            {formatCurrency(balance)}
          </span>
        </div>
      </div>
    </div>
  );
}
