"use client"

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings2, Bell, Database, Info, Download, Trash2, ChevronDown } from "lucide-react";

export default function Settings() {
  const [theme, setTheme] = useState("Dark");
  const [language, setLanguage] = useState("English");
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    batteryWarnings: true,
    modelTrainingComplete: true
  });

  const handleNotificationChange = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto mt-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Settings2 className="w-8 h-8 text-[#10a37f]" />
            Settings
          </h1>
          <p className="text-slate-400">Configure your dashboard preferences and system settings</p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* User Preferences */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-[#10a37f]" />
                User Preferences
              </h2>

              {/* Theme Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-3">Theme</label>
                <div className="relative">
                  <select 
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full px-4 py-3 pr-10 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#10a37f] focus:border-[#10a37f] transition-all duration-200 hover:bg-slate-700/70 appearance-none cursor-pointer shadow-lg"
                  >
                    <option value="Dark" className="bg-slate-700 text-white">Dark</option>
                    <option value="Light" className="bg-slate-700 text-white">Light</option>
                    <option value="Auto" className="bg-slate-700 text-white">Auto</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Language Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">Language</label>
                <div className="relative">
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-3 pr-10 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#10a37f] focus:border-[#10a37f] transition-all duration-200 hover:bg-slate-700/70 appearance-none cursor-pointer shadow-lg"
                  >
                    <option value="Hindi" className="bg-slate-700 text-white">Hindi</option>
                    <option value="English" className="bg-slate-700 text-white">English</option>
                    <option value="Bengali" className="bg-slate-700 text-white">Bengali</option>
                    <option value="Tamil" className="bg-slate-700 text-white">Tamil</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#10a37f]" />
                Notifications
              </h2>

              <div className="space-y-4">
                {/* Email Alerts */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Email Alerts</span>
                  <button
                    onClick={() => handleNotificationChange('emailAlerts')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.emailAlerts ? 'bg-[#10a37f]' : 'bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications.emailAlerts ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Battery Warnings */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Battery Warnings</span>
                  <button
                    onClick={() => handleNotificationChange('batteryWarnings')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.batteryWarnings ? 'bg-[#10a37f]' : 'bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications.batteryWarnings ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Model Training Complete */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Model Training Complete</span>
                  <button
                    onClick={() => handleNotificationChange('modelTrainingComplete')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.modelTrainingComplete ? 'bg-[#10a37f]' : 'bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications.modelTrainingComplete ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {/* Data Management */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Database className="w-5 h-5 text-[#10a37f]" />
                Data Management
              </h2>

              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-center py-3 bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600 hover:text-white transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export All Data
                </Button>
                
                <Button 
                  className="w-full justify-center py-3 bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Cache
                </Button>
              </div>
            </div>
          </Card>

          {/* System Information */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Info className="w-5 h-5 text-[#10a37f]" />
                System Information
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Version:</span>
                  <span className="text-white font-medium">1.0.0</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Last Updated:</span>
                  <span className="text-white font-medium">2 hours ago</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Storage Used:</span>
                  <span className="text-white font-medium">2.3 GB</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}