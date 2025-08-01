import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarDays, Filter, X, BarChart3, TrendingUp, Target } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  className?: string;
}

export interface FilterState {
  dateRange: DateRange;
  platforms: string[];
  campaigns: string[];
  metrics: string[];
  performanceThreshold: {
    ctr: { min: number; max: number };
    roas: { min: number; max: number };
    spend: { min: number; max: number };
  };
  status: string[];
}

const defaultFilters: FilterState = {
  dateRange: {
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  },
  platforms: [],
  campaigns: [],
  metrics: ['impressions', 'clicks', 'spend', 'ctr'],
  performanceThreshold: {
    ctr: { min: 0, max: 100 },
    roas: { min: 0, max: 20 },
    spend: { min: 0, max: 100000 }
  },
  status: []
};

export default function AdvancedFilters({ onFiltersChange, className }: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleArrayToggle = (key: keyof FilterState, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    handleFilterChange(key, newArray);
  };

  const clearAllFilters = () => {
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.platforms.length > 0) count++;
    if (filters.campaigns.length > 0) count++;
    if (filters.status.length > 0) count++;
    if (filters.metrics.length !== 4) count++;
    return count;
  };

  const platformOptions = [
    { value: 'meta', label: 'Meta Ads', icon: '📘' },
    { value: 'google', label: 'Google Ads', icon: '🔍' },
    { value: 'analytics', label: 'Google Analytics', icon: '📊' },
    { value: 'search-console', label: 'Search Console', icon: '🔎' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active', color: 'bg-green-500' },
    { value: 'paused', label: 'Paused', color: 'bg-yellow-500' },
    { value: 'ended', label: 'Ended', color: 'bg-red-500' },
    { value: 'draft', label: 'Draft', color: 'bg-gray-500' }
  ];

  const metricOptions = [
    { value: 'impressions', label: 'Impressions', icon: <BarChart3 className="w-4 h-4" /> },
    { value: 'clicks', label: 'Clicks', icon: <Target className="w-4 h-4" /> },
    { value: 'spend', label: 'Spend', icon: <TrendingUp className="w-4 h-4" /> },
    { value: 'ctr', label: 'CTR', icon: <BarChart3 className="w-4 h-4" /> },
    { value: 'cpc', label: 'CPC', icon: <TrendingUp className="w-4 h-4" /> },
    { value: 'roas', label: 'ROAS', icon: <TrendingUp className="w-4 h-4" /> }
  ];

  return (
    <Card className={cn("glass-card", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Filter className="text-white w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-white">Advanced Filters</CardTitle>
              <p className="text-sm text-slate-400">Customize your data view with precision filters</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="bg-primary-600/20 text-primary-300">
                {getActiveFiltersCount()} active
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-slate-300"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Date Range Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-white">Date Range</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {filters.dateRange?.from ? (
                    filters.dateRange.to ? (
                      <>
                        {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                        {format(filters.dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(filters.dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Select date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={filters.dateRange?.from}
                  selected={filters.dateRange}
                  onSelect={(range) => handleFilterChange('dateRange', range)}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Platform Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-white">Platforms</Label>
            <div className="flex flex-wrap gap-2">
              {platformOptions.map((platform) => (
                <Badge
                  key={platform.value}
                  variant={filters.platforms.includes(platform.value) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary-600/20 transition-colors"
                  onClick={() => handleArrayToggle('platforms', platform.value)}
                >
                  <span className="mr-1">{platform.icon}</span>
                  {platform.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-white">Campaign Status</Label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <Badge
                  key={status.value}
                  variant={filters.status.includes(status.value) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary-600/20 transition-colors"
                  onClick={() => handleArrayToggle('status', status.value)}
                >
                  <div className={cn("w-2 h-2 rounded-full mr-2", status.color)} />
                  {status.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Metrics Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-white">Display Metrics</Label>
            <div className="flex flex-wrap gap-2">
              {metricOptions.map((metric) => (
                <Badge
                  key={metric.value}
                  variant={filters.metrics.includes(metric.value) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary-600/20 transition-colors"
                  onClick={() => handleArrayToggle('metrics', metric.value)}
                >
                  {metric.icon}
                  <span className="ml-1">{metric.label}</span>
                </Badge>
              ))}
            </div>
          </div>

          {/* Performance Thresholds */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-white">Performance Thresholds</Label>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-slate-400">CTR Range (%)</Label>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.performanceThreshold.ctr.min}
                    onChange={(e) => handleFilterChange('performanceThreshold', {
                      ...filters.performanceThreshold,
                      ctr: { ...filters.performanceThreshold.ctr, min: Number(e.target.value) }
                    })}
                    className="w-20"
                  />
                  <span className="text-slate-400 self-center">-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.performanceThreshold.ctr.max}
                    onChange={(e) => handleFilterChange('performanceThreshold', {
                      ...filters.performanceThreshold,
                      ctr: { ...filters.performanceThreshold.ctr, max: Number(e.target.value) }
                    })}
                    className="w-20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-slate-400">ROAS Range</Label>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.performanceThreshold.roas.min}
                    onChange={(e) => handleFilterChange('performanceThreshold', {
                      ...filters.performanceThreshold,
                      roas: { ...filters.performanceThreshold.roas, min: Number(e.target.value) }
                    })}
                    className="w-20"
                  />
                  <span className="text-slate-400 self-center">-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.performanceThreshold.roas.max}
                    onChange={(e) => handleFilterChange('performanceThreshold', {
                      ...filters.performanceThreshold,
                      roas: { ...filters.performanceThreshold.roas, max: Number(e.target.value) }
                    })}
                    className="w-20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-slate-400">Spend Range ($)</Label>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.performanceThreshold.spend.min}
                    onChange={(e) => handleFilterChange('performanceThreshold', {
                      ...filters.performanceThreshold,
                      spend: { ...filters.performanceThreshold.spend, min: Number(e.target.value) }
                    })}
                    className="w-20"
                  />
                  <span className="text-slate-400 self-center">-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.performanceThreshold.spend.max}
                    onChange={(e) => handleFilterChange('performanceThreshold', {
                      ...filters.performanceThreshold,
                      spend: { ...filters.performanceThreshold.spend, max: Number(e.target.value) }
                    })}
                    className="w-20"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-surface-border">
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="text-slate-300"
            >
              <X className="w-4 h-4 mr-2" />
              Clear All
            </Button>
            <Badge variant="secondary" className="bg-slate-800 text-slate-300">
              {getActiveFiltersCount()} filters applied
            </Badge>
          </div>
        </CardContent>
      )}
    </Card>
  );
}