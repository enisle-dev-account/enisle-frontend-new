'use client'

import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { ChevronDown, Settings, LifeBuoy, LogOut } from 'lucide-react'
import { clearTokens } from '@/hooks/api'

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
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    aria-label="Open profile menu"
                    className="inline-flex items-center gap-2 rounded-md px-2 py-1 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                >
                    <Avatar className="h-8 w-8 border">
                        {imageUrl ? <AvatarImage src={imageUrl} alt={fullName} /> : <AvatarFallback>{initials}</AvatarFallback>}
                    </Avatar>
                    <span className="hidden sm:inline text-sm font-medium text-muted-foreground">{fullName}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex items-center gap-3 py-1.5">
                        <Avatar className="h-9 w-9">
                            {imageUrl ? <AvatarImage src={imageUrl} alt={fullName} /> : <AvatarFallback>{initials}</AvatarFallback>}
                        </Avatar>
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{fullName}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                                Profile Account
                            </p>
                        </div>
                    </div>
                </DropdownMenuLabel>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem className="cursor-pointer">
                    <LifeBuoy className="mr-2 h-4 w-4" />
                    <span>Support</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                    className="cursor-pointer text-destructive focus:text-destructive" 
                    onSelect={() => {clearTokens()}}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}