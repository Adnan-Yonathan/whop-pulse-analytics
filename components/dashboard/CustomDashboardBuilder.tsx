'use client';

import React, { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Plus, 
  GripVertical, 
  X, 
  Save, 
  Eye,
  Settings,
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  Target,
  Activity
} from 'lucide-react';
import { MetricWidget } from './widgets/MetricWidget';
import { ChartWidget } from './widgets/ChartWidget';

interface Widget {
  id: string;
  type: 'metric' | 'chart';
  title: string;
  data?: any;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface SortableWidgetProps {
  widget: Widget;
  onRemove: (id: string) => void;
  onEdit: (id: string) => void;
}

function SortableWidget({ widget, onRemove, onEdit }: SortableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const renderWidget = () => {
    switch (widget.type) {
      case 'metric':
        return (
          <MetricWidget
            title={widget.title}
            value={widget.data?.value || '0'}
            change={widget.data?.change}
            changeType={widget.data?.changeType}
            icon={widget.data?.icon}
            color={widget.data?.color}
            className="h-full"
          />
        );
      case 'chart':
        return (
          <ChartWidget
            title={widget.title}
            type={widget.data?.type || 'bar'}
            data={widget.data?.data}
            className="h-full"
          />
        );
      default:
        return <div>Unknown widget type</div>;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isDragging ? 'z-50' : ''}`}
    >
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex space-x-1">
          <button
            onClick={() => onEdit(widget.id)}
            className="p-1 bg-secondary hover:bg-secondary-800 text-secondary-foreground rounded transition-colors"
          >
            <Settings className="w-3 h-3" />
          </button>
          <button
            onClick={() => onRemove(widget.id)}
            className="p-1 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
      
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      >
        <div className="p-1 bg-secondary hover:bg-secondary-800 text-secondary-foreground rounded">
          <GripVertical className="w-3 h-3" />
        </div>
      </div>

      {renderWidget()}
    </div>
  );
}

interface CustomDashboardBuilderProps {
  onSave?: (dashboard: any) => void;
  onPreview?: (dashboard: any) => void;
}

export function CustomDashboardBuilder({ onSave, onPreview }: CustomDashboardBuilderProps) {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [showWidgetLibrary, setShowWidgetLibrary] = useState(false);
  const [editingWidget, setEditingWidget] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setWidgets((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  const addWidget = (type: 'metric' | 'chart', template: any) => {
    const newWidget: Widget = {
      id: `widget-${Date.now()}`,
      type,
      title: template.title,
      data: template.data,
      position: { x: 0, y: 0 },
      size: { width: 1, height: 1 }
    };
    setWidgets(prev => [...prev, newWidget]);
    setShowWidgetLibrary(false);
  };

  const removeWidget = (id: string) => {
    setWidgets(prev => prev.filter(widget => widget.id !== id));
  };

  const editWidget = (id: string) => {
    setEditingWidget(id);
    // In a real app, you'd open an edit modal here
  };

  const saveDashboard = () => {
    const dashboard = {
      id: `dashboard-${Date.now()}`,
      name: 'Custom Dashboard',
      widgets,
      createdAt: new Date().toISOString()
    };
    
    // Save to localStorage for demo
    const savedDashboards = JSON.parse(localStorage.getItem('customDashboards') || '[]');
    savedDashboards.push(dashboard);
    localStorage.setItem('customDashboards', JSON.stringify(savedDashboards));
    
    onSave?.(dashboard);
  };

  const previewDashboard = () => {
    const dashboard = {
      id: 'preview',
      name: 'Preview',
      widgets,
      createdAt: new Date().toISOString()
    };
    onPreview?.(dashboard);
  };

  const widgetTemplates = [
    {
      type: 'metric' as const,
      title: 'Total Members',
      data: {
        value: '1,247',
        change: '+12.3%',
        changeType: 'positive' as const,
        icon: Users,
        color: 'blue'
      }
    },
    {
      type: 'metric' as const,
      title: 'Monthly Revenue',
      data: {
        value: '$18,420',
        change: '+8.7%',
        changeType: 'positive' as const,
        icon: DollarSign,
        color: 'green'
      }
    },
    {
      type: 'metric' as const,
      title: 'Engagement Rate',
      data: {
        value: '78.5%',
        change: '-2.1%',
        changeType: 'negative' as const,
        icon: Activity,
        color: 'purple'
      }
    },
    {
      type: 'chart' as const,
      title: 'Revenue Trend',
      data: {
        type: 'line',
        data: [
          { name: 'Jan', value: 65 },
          { name: 'Feb', value: 78 },
          { name: 'Mar', value: 82 },
          { name: 'Apr', value: 75 },
          { name: 'May', value: 88 },
          { name: 'Jun', value: 92 }
        ]
      }
    },
    {
      type: 'chart' as const,
      title: 'Member Growth',
      data: {
        type: 'bar',
        data: [
          { name: 'Q1', value: 45 },
          { name: 'Q2', value: 67 },
          { name: 'Q3', value: 89 },
          { name: 'Q4', value: 112 }
        ]
      }
    }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-foreground">Dashboard Builder</h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm text-foreground-muted">Auto-save enabled</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowWidgetLibrary(true)}
            className="flex items-center space-x-2 bg-primary hover:bg-primary-600 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Widget</span>
          </button>
          
          <button
            onClick={previewDashboard}
            className="flex items-center space-x-2 bg-secondary hover:bg-secondary-800 text-secondary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>
          
          <button
            onClick={saveDashboard}
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Dashboard</span>
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 p-6 bg-background-secondary overflow-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={widgets.map(w => w.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-full">
              {widgets.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-4">
                    <BarChart3 className="w-8 h-8 text-foreground-muted" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Start Building Your Dashboard</h3>
                  <p className="text-foreground-muted text-center mb-6 max-w-md">
                    Add widgets to create a custom dashboard that fits your needs. 
                    Drag and drop to rearrange, and customize each widget.
                  </p>
                  <button
                    onClick={() => setShowWidgetLibrary(true)}
                    className="flex items-center space-x-2 bg-primary hover:bg-primary-600 text-primary-foreground px-6 py-3 rounded-xl font-medium transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Your First Widget</span>
                  </button>
                </div>
              ) : (
                widgets.map((widget) => (
                  <SortableWidget
                    key={widget.id}
                    widget={widget}
                    onRemove={removeWidget}
                    onEdit={editWidget}
                  />
                ))
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Widget Library Modal */}
      {showWidgetLibrary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-2xl shadow-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-xl font-semibold text-foreground">Widget Library</h3>
              <button
                onClick={() => setShowWidgetLibrary(false)}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5 text-foreground-muted" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {widgetTemplates.map((template, index) => (
                  <div
                    key={index}
                    className="p-4 bg-secondary rounded-xl border border-border hover:border-primary/30 transition-colors cursor-pointer"
                    onClick={() => addWidget(template.type, template)}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {template.type === 'metric' ? (
                          <Target className="w-5 h-5 text-primary" />
                        ) : (
                          <BarChart3 className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{template.title}</h4>
                        <p className="text-sm text-foreground-muted capitalize">{template.type} Widget</p>
                      </div>
                    </div>
                    <p className="text-sm text-foreground-muted">
                      {template.type === 'metric' 
                        ? 'Display key metrics with trends and icons'
                        : 'Visualize data with interactive charts'
                      }
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
