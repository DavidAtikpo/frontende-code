"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EmailCampaign from "./components/EmailCampaign";
import SmsCampaign from "./components/SmsCampaign";
import PushNotification from "./components/PushNotification";
import CampaignHistory from "./components/CampaignHistory";

export default function MarketingPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Marketing</h1>
          <p className="text-muted-foreground">
            Gérez vos campagnes marketing et communications
          </p>
        </div>
      </div>

      <Tabs defaultValue="email" className="space-y-4">
        <TabsList>
          <TabsTrigger value="email">Campagnes Email</TabsTrigger>
          <TabsTrigger value="sms">SMS Marketing</TabsTrigger>
          <TabsTrigger value="push">Notifications Push</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Campagne Email</CardTitle>
            </CardHeader>
            <CardContent>
              <EmailCampaign />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sms">
          <Card>
            <CardHeader>
              <CardTitle>SMS Marketing</CardTitle>
            </CardHeader>
            <CardContent>
              <SmsCampaign />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="push">
          <Card>
            <CardHeader>
              <CardTitle>Notifications Push</CardTitle>
            </CardHeader>
            <CardContent>
              <PushNotification />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <CampaignHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
} 