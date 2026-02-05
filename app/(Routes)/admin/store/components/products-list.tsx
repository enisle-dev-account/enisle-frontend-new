import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Product } from "@/types";
import { Loader2, MoreHorizontal, MoreVertical, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { toBase64 } from "@/lib/utils";
import { shimmer } from "@/components/image-shimmer";
export default function ProductsListView({
  products,
  selectedIds,
  onSelectIds,
  onSelectProduct,
  onDelete,
  deletingIds,
  isDeleting,
}: {
  products: Product[];
  selectedIds: string[];
  onSelectIds: (ids: string[]) => void;
  onSelectProduct: (id: string) => void;
  onDelete: (ids: string[]) => void;
  isDeleting: boolean;
  deletingIds: string[];
}) {
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectIds(products.map((p) => p.id));
    } else {
      onSelectIds([]);
    }
  };

  const handleSelectOne = (productId: string, checked: boolean) => {
    if (checked) {
      onSelectIds([...selectedIds, productId]);
    } else {
      onSelectIds(selectedIds.filter((id) => id !== productId));
    }
  };

  const isAllSelected =
    products.length > 0 && selectedIds.length === products.length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()} | ${date.getMonth() + 1} | ${date.getFullYear()}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <table className="w-full">
        <thead className="sticky top-0 bg-background z-10">
          <tr className="border-b text-sm font-medium text-muted-foreground">
            <th className="px-6 py-4 text-left">
              <Checkbox
                className="border-muted-2"
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
              />
            </th>
            <th className="px-6 py-4 text-left">Product Name</th>
            <th className="px-6 py-4 text-left">Stock</th>
            <th className="px-6 py-4 text-left">Date Added</th>
            <th className="px-6 py-4 text-left">Price</th>
            <th className="px-6 py-4 text-left">Status</th>
            <th className="px-6 py-4 text-left"></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const isItemDeleting =
              deletingIds.includes(product.id) && isDeleting;
            return (
              <tr
                key={product.id}
                className=" hover:bg-[#E6F0FF] transition-colors"
              >
                <td className="px-6 py-4">
                  <Checkbox
                    className="border-muted-2"
                    checked={selectedIds.includes(product.id)}
                    onCheckedChange={(checked: boolean) =>
                      handleSelectOne(product.id, checked)
                    }
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Image
                      placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                      width={40}
                      height={40}
                      src={product.cover_image?.file}
                      alt={product.title}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                    <span className="font-medium">{product.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">{product.stock}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {product.created_at ? formatDate(product.created_at) : "-"}
                </td>
                <td className="px-6 py-4 font-medium">
                  {product.currency}
                  {product.price.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      product.availability === "available"
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {product.availability === "available"
                      ? "Available"
                      : "Out of stock"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        disabled={isItemDeleting}
                      >
                        {isItemDeleting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <MoreVertical className="h-4 w-4" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onSelectProduct(product.id)}
                      >
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive font-medium"
                        onClick={() => onDelete([product.id])}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </motion.div>
  );
}
