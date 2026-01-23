import { shimmer } from "@/components/image-shimmer";
import { Button } from "@/components/ui/button";
import { getInitials, toBase64 } from "@/lib/utils";
import { DepartmentData } from "@/types";
import { motion } from "framer-motion";
import { MessageSquare, Phone, Video, MoreHorizontal } from "lucide-react";
import Image from "next/image";

export default function StaffGrid({ staff, }: { staff: DepartmentData[] }) {
  return (
    <motion.div
      layout
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {staff.map((member) => (
        <motion.div
          key={member.id}
          layout
        
          className="relative hover:scale-105 duration-300 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="absolute top-4 right-4">
            <span
              className={`flex h-2 w-2 rounded-full ${!member.is_on_leave ? "bg-green-500" : "bg-gray-300"}`}
            />
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="p-1 rounded-full border-2 border-primary/10 group-hover:border-primary/30 transition-colors">
                {member.profile_picture ? (
                  <Image
                    src={member.profile_picture}
                    width={80}
                    height={80}
                    placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(80, 80))}`}
                    alt={`${member.first_name} ${member.last_name}`}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10">
                    <span className="text-xl font-bold text-primary">
                      {getInitials(member.first_name, member.last_name)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="mb-6">
              <h3 className="font-bold text-lg text-slate-900 line-clamp-1">
                {`${member.first_name} ${member.last_name}`}
              </h3>
              <p className="text-sm capitalize font-medium text-primary bg-primary/5 px-3 py-1 rounded-full mt-1 inline-block">
                {member.user_type || "Store Keeper"}
              </p>
            </div>
            {/* Quick Actions */}
            <div className="flex items-center justify-center gap-3 w-full border-t pt-4 border-slate-50">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 border-slate-200 text-slate-600 hover:text-primary hover:border-primary transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 border-slate-200 text-slate-600 hover:text-primary hover:border-primary transition-colors"
              >
                <Phone className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 border-slate-200 text-slate-600 hover:text-primary hover:border-primary transition-colors"
              >
                <Video className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
