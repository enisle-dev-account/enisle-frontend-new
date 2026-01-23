import { Checkbox } from "@/components/ui/checkbox";
import { Product } from "@/types";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Loader2, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { toBase64 } from "@/lib/utils";
import { shimmer } from "@/components/image-shimmer";

export default function ProductsGridView({
  products,
  selectedIds,
  onSelectIds,
  onSelectProduct,
  onDelete,
  isDeleting,
  deletingIds,
}: {
  products: Product[];
  selectedIds: string[];
  onSelectIds: (ids: string[]) => void;
  onSelectProduct: (id: string) => void;
  onDelete: (ids: string[]) => void;
  isDeleting: boolean;
  deletingIds: string[];
}) {
  const handleSelectOne = (productId: string, checked: boolean) => {
    if (checked) {
      onSelectIds([...selectedIds, productId]);
    } else {
      onSelectIds(selectedIds.filter((id) => id !== productId));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()} | ${date.getMonth() + 1} | ${date.getFullYear()}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6"
    >
      {products.map((product) => {
        const isItemDeleting = deletingIds.includes(product.id) && isDeleting;

        return (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl border p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <Checkbox
                className="border-muted-2"
                checked={selectedIds.includes(product.id)}
                onCheckedChange={(checked: boolean) =>
                  handleSelectOne(product.id, checked)
                }
              />
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
                      <MoreHorizontal className="h-4 w-4" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onSelectProduct(product.id)}>
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
            </div>

            <Image
              width={100}
              height={160}
              placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
              src={product.cover_image?.file}
              alt={product.title}
              className="w-full h-40 object-cover rounded-lg mb-3"
            />

            <h3 className="font-medium text-sm mb-2 truncate">
              {product.title}
            </h3>

            <div className="space-y-1 text-xs text-muted-foreground mb-3">
              <p>Stock: {product.stock}</p>
              <p>
                Added:{" "}
                {product.created_at ? formatDate(product.created_at) : "-"}
              </p>
              <p className="font-semibold text-foreground">
                ₦{product.price.toLocaleString()}
              </p>
            </div>

            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                product.availability === "available"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {product.availability === "available"
                ? "Available"
                : "Out of stock"}
            </span>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
