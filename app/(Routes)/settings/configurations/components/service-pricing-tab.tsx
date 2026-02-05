"use client";

import { useState, useMemo, Dispatch, SetStateAction } from "react";
import type { HospitalPricing } from "@/types/hospital-configuations.type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import ConfirmDeleteDialog from "../../hospital-setup/components/confirm-delete-dialog";

interface ServicePricingTabProps {
  pricingData: HospitalPricing[];
  onAddPricing: (pricing: Partial<HospitalPricing>) => Promise<void>;
  onUpdatePricing: (
    id: number,
    data: Partial<HospitalPricing>,
  ) => Promise<void>;
  onDeletePricing: (id: number) => Promise<void>;
  isAddingPricing: boolean;
  isUpdatingPricing: boolean;
  isDeletingPricing: boolean;
  setdeleteDialogueOpen: Dispatch<SetStateAction<boolean>>;
  deleteDialogueOpen: boolean
  
}

const CATEGORIES = [
  "Consultation",
  "Lab",
  "Vital",
  "Scan",
  "Surgery",
  "Bed",
  "Other",
].map((category) => ({
  label: category,
  value: category.toLowerCase(),
}));

export default function ServicePricingTab({
  pricingData,
  onAddPricing,
  onUpdatePricing,
  onDeletePricing,
  isAddingPricing,
  isUpdatingPricing,
  isDeletingPricing,
  setdeleteDialogueOpen,
  deleteDialogueOpen
}: ServicePricingTabProps) {
  const [newItem, setNewItem] = useState("");
  const [newCategory, setNewCategory] = useState("consultation");
  const [newPrice, setNewPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editedPrices, setEditedPrices] = useState<Record<number, number>>({});
  
  const [deleteId, setdeleteId] = useState<number | null>(null);

  const filteredData = useMemo(() => {
    if (selectedCategory) {
      return pricingData.filter((item) => item.category === selectedCategory);
    }
    return pricingData;
  }, [pricingData, selectedCategory]);

  const handleAddPricing = async () => {
    if (!newItem.trim() || !newPrice || parseFloat(newPrice) <= 0) {
      return;
    }

    await onAddPricing({
      item: newItem,
      category: newCategory,
      price: parseFloat(newPrice),
    });

    setNewItem("");
    setNewCategory("consultation");
    setNewPrice("");
  };

  const handlePriceChange = (id: number, newPrice: string) => {
    const price = parseFloat(newPrice);
    if (price > 0) {
      setEditedPrices((prev) => ({
        ...prev,
        [id]: price,
      }));
    }
  };

  const handleSaveChanges = async () => {
    const updates = Object.entries(editedPrices).map(([id, price]) =>
      onUpdatePricing(Number(id), { price }),
    );
    await Promise.all(updates);
    setEditedPrices({});
  };

  const handleDiscardChanges = () => {
    setEditedPrices({});
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Service</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 mb-4">
            <Input
              placeholder="Service name"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddPricing()}
            />
            <Select value={newCategory} onValueChange={setNewCategory}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Price"
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddPricing()}
              className="w-24"
            />
            <Button
              onClick={handleAddPricing}
              disabled={isAddingPricing}
              className="whitespace-nowrap"
            >
              {isAddingPricing ? "Adding..." : "Add Service"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Service Pricing</CardTitle>
            {Object.keys(editedPrices).length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDiscardChanges}
                  disabled={isUpdatingPricing}
                >
                  Discard
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveChanges}
                  disabled={isUpdatingPricing}
                >
                  {isUpdatingPricing ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              variant={selectedCategory === "" ? "default" : "outline"}
              onClick={() => setSelectedCategory("")}
              size="sm"
            >
              All ({pricingData.length})
            </Button>
            {CATEGORIES.map((cat) => {
              const count = pricingData.filter(
                (p) => p.category === cat.value,
              ).length;
              return (
                <Button
                  key={cat.value}
                  variant={
                    selectedCategory === cat.value ? "default" : "outline"
                  }
                  onClick={() => setSelectedCategory(cat.value)}
                  size="sm"
                >
                  {cat.label} ({count})
                </Button>
              );
            })}
          </div>
        </CardHeader>
        <CardContent>
          {filteredData.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No pricing items yet
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow
                      key={item.id}
                      className={
                        editedPrices[item.id] !== undefined ? "bg-blue-50" : ""
                      }
                    >
                      <TableCell className="font-medium">{item.item}</TableCell>
                      <TableCell className="capitalize">
                        {item.category}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={
                            editedPrices[item.id] !== undefined
                              ? editedPrices[item.id]
                              : item.price
                          }
                          onChange={(e) =>
                            handlePriceChange(item.id, e.target.value)
                          }
                          className="w-24"
                          disabled={isUpdatingPricing}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {setdeleteId(item.id); setdeleteDialogueOpen(true)}}
                          disabled={isDeletingPricing}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {deleteId && (
        <ConfirmDeleteDialog
          open={deleteDialogueOpen}
          onOpenChange={setdeleteDialogueOpen}
          title={"Delete Service?"}
          description={"Are you sure you want to delete this service?"}
          onConfirm={() => {
            onDeletePricing(deleteId);
          }}
          isLoading={isDeletingPricing}
        />
      )}
    </div>
  );
}
