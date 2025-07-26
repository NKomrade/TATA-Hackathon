"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Battery, TrendingUp, Clock, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [kpiData, setKpiData] = useState({
    capacity: 1.85,
    soh: 92.5,
    rul: 145,
    temperature: 25.3
  });

  const [capacityData, setCapacityData] = useState([
    { cycle: 1, capacity: 2.0, predicted: 2.0 },
    { cycle: 50, capacity: 1.95, predicted: 1.96 },
    { cycle: 100, capacity: 1.88, predicted: 1.89 },
    { cycle: 150, capacity: 1.82, predicted: 1.83 },
    { cycle: 200, capacity: 1.75, predicted: 1.76 },
  ]);

  return (
    <div className="w-full space-y-6 min-h-full">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Monitor your battery digital twin system and key performance metrics.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Batteries</CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Predictions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              +5% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg RUL</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.5</div>
            <p className="text-xs text-muted-foreground">
              months remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              require attention
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Battery Performance Overview</CardTitle>
            <CardDescription>
              Real-time monitoring of battery health and performance metrics.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] flex items-center justify-center bg-muted rounded-lg">
              <p className="text-muted-foreground">Performance Chart Placeholder</p>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>
              Latest system alerts and notifications.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Badge variant="destructive">Critical</Badge>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Battery #1234 Low Voltage
                  </p>
                  <p className="text-sm text-muted-foreground">
                    2 minutes ago
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="outline">Warning</Badge>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    High Temperature Detected
                  </p>
                  <p className="text-sm text-muted-foreground">
                    15 minutes ago
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="secondary">Info</Badge>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Model Training Completed
                  </p>
                  <p className="text-sm text-muted-foreground">
                    1 hour ago
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add some extra content to demonstrate scrolling */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>API Health</span>
                <Badge variant="default">Online</Badge>
              </div>
              <div className="flex justify-between">
                <span>Database</span>
                <Badge variant="default">Connected</Badge>
              </div>
              <div className="flex justify-between">
                <span>ML Models</span>
                <Badge variant="default">Running</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full text-left p-2 hover:bg-gray-50 rounded">
                Upload New Data
              </button>
              <button className="w-full text-left p-2 hover:bg-gray-50 rounded">
                Run Prediction
              </button>
              <button className="w-full text-left p-2 hover:bg-gray-50 rounded">
                Generate Report
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm">
                <p className="font-medium">Data uploaded</p>
                <p className="text-gray-500">2 hours ago</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">Model trained</p>
                <p className="text-gray-500">4 hours ago</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">Report generated</p>
                <p className="text-gray-500">1 day ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
