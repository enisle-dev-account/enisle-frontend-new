import { shimmer } from "@/components/image-shimmer";
import { Button } from "@/components/ui/button";
import { getInitials, toBase64 } from "@/lib/utils";
import { DepartmentData } from "@/types";
import { motion } from "framer-motion";
import { MessageSquare, Phone, Video } from "lucide-react";
import Image from "next/image";

export default function StaffTable({
  staff,
  selectedIds,
  onSelectIds,
}: {
  staff: DepartmentData[];
  selectedIds: string[];
  onSelectIds: (ids: string[]) => void;
}) {
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectIds(staff.map((s) => s.id));
    } else {
      onSelectIds([]);
    }
  };

  const handleSelectOne = (staffId: string, checked: boolean) => {
    if (checked) {
      onSelectIds([...selectedIds, staffId]);
    } else {
      onSelectIds(selectedIds.filter((id) => id !== staffId));
    }
  };

  const isAllSelected = staff.length > 0 && selectedIds.length === staff.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full "
    >
      <div className="space-y-4">
        {staff.map((member) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-4 bg-white rounded-xl  hover:bg-primary/5 transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                {member.profile_picture ? (
                  <Image
                    src={
                      member.profile_picture ||
                      `https://ui-avatars.com/api/?name=${member.first_name}+${member.last_name}`
                    }
                    width={48}
                    height={48}
                    placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                    alt={`${member.first_name} ${member.last_name}`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10">
                    <span className="text-xl font-bold text-primary">
                      {getInitials(member.first_name, member.last_name)}
                    </span>
                  </div>
                )}

                <div
                  className={`absolute top-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    !member.is_on_leave ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
              </div>

              <div>
                <h3 className="font-semibold">{`${member.first_name} ${member.last_name}`}</h3>
                <p className="text-sm text-muted-foreground capitalize">
                  {member.user_type || "Store Keeper"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 rounded-full hover:bg-blue-50"
              >
                <MessageSquare className="h-4 w-4 text-primary" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 rounded-full hover:bg-blue-50"
              >
                <Phone className="h-4 w-4 text-primary" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 rounded-full hover:bg-blue-50"
              >
                <Video className="h-4 w-4 text-primary" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
