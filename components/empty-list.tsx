import React from 'react'
import { Icon } from './icon'
import { Redo, RotateCw, Undo } from 'lucide-react'

export default function EmptyList({title, description,showRefresh,onRefresh}: {title?: string, description?: string, showRefresh?: boolean, onRefresh?: () => void}) {
  return (
    <div className='flex flex-col items-center justify-center py-6'>
        <Icon name="empty-placeholder" className='fill-none' size={170} />
        <div className="mt-6.25 text-sm text-center space-y-2 text-muted-foreground ">
          {title && <p className="font-semibold text-2xl ">{title}</p>}
          {description && <p className='max-w-xs'>{description}</p>}
        </div>
        {showRefresh && onRefresh && (
          <button onClick={onRefresh} className="mt-4 h-9 px-6 cursor-pointer rounded-full text-sm flex items-center gap-3 bg-primary/20 text-black hover:underline">
            <RotateCw className='text-primary' />
            Refresh
          </button>
        )}
    </div>
  )
}
