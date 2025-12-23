'use client'

import React from 'react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { ChevronDown } from 'lucide-react'

type Props = {
    fullName?: string
    imageUrl?: string
}

export default function ProfileDropDown({ fullName = 'Quwam Kelani', imageUrl }: Props) {
    const initials = fullName
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    aria-label="Open profile"
                    className="inline-flex items-center gap-2 rounded-md px-2 py-1 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
                >
                    <Avatar className="h-8 w-8">
                        {imageUrl ? <AvatarImage src={imageUrl} alt={fullName} /> : <AvatarFallback>{initials}</AvatarFallback>}
                    </Avatar>
                    <span className="hidden sm:inline text-sm font-medium">{fullName}</span>
                    <ChevronDown className="h-4 w-4" />
                </button>
            </PopoverTrigger>

            <PopoverContent side="bottom" align="end" className="w-56">
                <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                        {imageUrl ? <AvatarImage src={imageUrl} alt={fullName} /> : <AvatarFallback>{initials}</AvatarFallback>}
                    </Avatar>
                    <div>
                        <div className="text-sm font-semibold">{fullName}</div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
