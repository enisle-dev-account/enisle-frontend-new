import React from 'react'
import { Icon } from './icon'

export default function EmptyList({title, description}: {title?: string, description?: string}) {
  return (
    <div className='flex flex-col items-center justify-center py-6'>
        <Icon name="empty-placeholder" className='fill-none' size={170} />
        <div className="mt-6.25 text-sm text-center space-y-2 text-muted-foreground ">
          {title && <p className="font-semibold text-2xl ">{title}</p>}
          {description && <p className='max-w-xs'>{description}</p>}
        </div>
    </div>
  )
}
