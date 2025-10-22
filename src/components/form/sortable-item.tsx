'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { createContext, useContext } from 'react';

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

interface DragHandleContextType {
  attributes: any;
  listeners: any;
}

const DragHandleContext = createContext<DragHandleContextType | null>(null);

export function SortableItem({ id, children }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <DragHandleContext.Provider value={{ attributes, listeners }}>
      <div 
        ref={setNodeRef} 
        style={style}
        className={isDragging ? 'z-50' : ''}
      >
        {children}
      </div>
    </DragHandleContext.Provider>
  );
}

export function DragHandle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const context = useContext(DragHandleContext);
  
  if (!context) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div 
      {...context.attributes} 
      {...context.listeners}
      className={`cursor-grab active:cursor-grabbing ${className}`}
    >
      {children}
    </div>
  );
}