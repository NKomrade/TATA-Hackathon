"use client";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Battery {
  id: string;
  name: string;
  status: 'active' | 'degraded' | 'eol';
  capacity: number;
  cycles: number;
}

interface BatterySelectorProps {
  batteries: Battery[];
  selectedBattery: string;
  onSelectBattery: (batteryId: string) => void;
}

export function BatterySelector({ batteries, selectedBattery, onSelectBattery }: BatterySelectorProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'eol': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Battery Selection</h3>
      
      <div className="space-y-4">
        <Select value={selectedBattery} onValueChange={onSelectBattery}>
          <SelectTrigger>
            <SelectValue placeholder="Select a battery..." />
          </SelectTrigger>
          <SelectContent>
            {batteries.map((battery) => (
              <SelectItem key={battery.id} value={battery.id}>
                {battery.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="space-y-2">
          <h4 className="font-medium">Available Batteries</h4>
          {batteries.map((battery) => (
            <div key={battery.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(battery.status)}`} />
                <div>
                  <p className="font-medium">{battery.name}</p>
                  <p className="text-sm text-gray-600">
                    {battery.capacity.toFixed(2)} Ah • {battery.cycles} cycles
                  </p>
                </div>
              </div>
              <Badge variant={battery.status === 'active' ? 'default' : 'secondary'}>
                {battery.status.toUpperCase()}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
