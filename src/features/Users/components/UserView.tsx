"use client";

import React from 'react';
import { Phone, Mail, Calendar, Clock, Shield, AlertTriangle, User, UserCheck, Hash, Settings, Key, Activity } from 'lucide-react';
import { AvatarCell } from '@/components/NAvatarCell';
import {NStatusBadge} from '@/components/NStatusBadge';
import { useTranslation } from '@/hooks/useLanguage';
import { Card } from '@/components/ui/card';
import { formatDate, getStatusColor, cn } from '@/lib/utils';
import LoadingError from '@/components/LoadingError';
import NStatWidget from '@/components/NStatWidget';
import { NSection, NSectionInfo } from '@/components/NSectionCard';

import { Label } from '@/components/ui/label';

const UserHeader = ({ user }) => {
  return (
    <Card className="flex p-5 items-center flex-col md:flex-row md:gap-4">
      <AvatarCell src={user.image} size='xl' />
      <div className="flex flex-col justify-center items-center md:items-start md:gap-0.5">
        <Label className="text-2xl font-bold ">{user.name}</Label>
        <Label className="text-md ">{user.email}</Label>
        <NStatusBadge status={user.status} variant="minimal" />
      </div>
    </Card>
  );
};

const UserView = ({ user, isLoading, error, onRetry }) => {
  const { t } = useTranslation();

    // ---------- Loading/Error Check ----------
  if (isLoading || error || !user) {
    return (
      <LoadingError
        isLoading={isLoading}
        error={error}
        noData={!user}
        loadingText={t('common.loading')}
        noDataText={t('users.errors.notFound')}
        onRetry={onRetry}
        fullScreen={true}
      />
    );
  }

  // ---------- Destructuring ----------
  const {
    name,
    id,
    email,
    image,
    status,
    role,
    phone,
    createdAt,
    updatedAt,
    lastLoginAt,
    analytics = {},
  } = user || {};

  // ---------- Derived Values ----------
  const {
    totalLogins = 0,
    totalSessions = 0,
    totalTimeSpent = 0,
    recentActivities = [],
    recentSessions = [],
  } = analytics;



  // ---------- Render ----------
  return (
    <div className="flex flex-col gap-4 h-full w-full overflow-auto ">

      {/* Header */}
      <UserHeader user={user} />

      {/* User Stats */}
      {Object.keys(analytics).length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <NStatWidget
            icon={Activity}
            title="Total Logins"
            value={totalLogins}
            subtitle="All time logins"
            unit="Total"
            color="blue"
          />
          <NStatWidget
            icon={Clock}
            title="Time Spent"
            value={totalTimeSpent}
            subtitle={`${totalSessions} sessions`}
            unit="Hours"
            color="green"
          />
        </div>
      )}

      {/* Account Information */}
      <NSection
        icon={User}
        title="Account Information"
        iconColor="text-blue-500"
        background="bg-card"
        className="border shadow-sm"
      >
        <NSectionInfo
          icon={Hash}
          label="User ID"
          value={id}
        />
        {email && (
          <NSectionInfo
            icon={Mail}
            label="Email"
            value={email}
          />
        )}
        {phone && (
          <NSectionInfo
            icon={Phone}
            label="Phone"
            value={phone}
          />
        )}
        {role && (
          <NSectionInfo
            icon={Shield}
            label="Role"
            value={role}
            valueColor="font-medium text-primary"
          />
        )}
      </NSection>

      {/* Account Details */}
      <NSection
        icon={Settings}
        title="Account Details"
        iconColor="text-purple-500"
        background="bg-card"
        className="border shadow-sm"
      >
        {createdAt && (
          <NSectionInfo
            icon={Calendar}
            label="Created"
            value={formatDate(createdAt, t)}
          />
        )}
        {updatedAt && (
          <NSectionInfo
            icon={Calendar}
            label="Last Updated"
            value={formatDate(updatedAt, t)}
          />
        )}
        {lastLoginAt && (
          <NSectionInfo
            icon={Key}
            label="Last Login"
            value={formatDate(lastLoginAt, t)}
          />
        )}
        <NSectionInfo
          icon={UserCheck}
          label="Status"
          value={status}
          valueColor={cn("font-medium", getStatusColor(status))}
        />
      </NSection>

      {/* Recent Activities */}
      {recentActivities.length > 0 && (
        <NSection
          icon={Activity}
          title="Recent Activities"
          iconColor="text-green-500"
          background="bg-card"
          className="border shadow-sm"
        >
          <div className="flex flex-col gap-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex flex-row justify-between items-start mb-2">
                  <div className="font-medium">{activity.action || 'Activity'}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(activity.timestamp, t)}
                  </div>
                </div>
                <div className="space-y-1">
                  {activity.description && (
                    <NSectionInfo
                      label="Description"
                      value={activity.description}
                      valueColor="text-muted-foreground text-sm"
                    />
                  )}
                  {activity.module && (
                    <NSectionInfo
                      label="Module"
                      value={activity.module}
                      className="text-xs"
                    />
                  )}
                  {activity.ipAddress && (
                    <NSectionInfo
                      label="IP Address"
                      value={activity.ipAddress}
                      className="text-xs"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </NSection>
      )}

      {/* Recent Sessions */}
      {recentSessions.length > 0 && (
        <NSection
          icon={Clock}
          title="Recent Sessions"
          iconColor="text-yellow-500"
          background="bg-card"
          className="border shadow-sm"
        >
          <div className="flex flex-col gap-4">
            {recentSessions.map((session, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex flex-row justify-between items-start mb-2">
                  <div className="font-medium">Session #{index + 1}</div>
                  <div className="text-xs text-muted-foreground">
                    {session.duration}h
                  </div>
                </div>
                <div className="space-y-1">
                  <NSectionInfo
                    icon={Calendar}
                    label="Started"
                    value={formatDate(session.startTime, t)}
                    className="text-xs"
                  />
                  {session.endTime && (
                    <NSectionInfo
                      icon={Calendar}
                      label="Ended"
                      value={formatDate(session.endTime, t)}
                      className="text-xs"
                    />
                  )}
                  {session.ipAddress && (
                    <NSectionInfo
                      label="IP Address"
                      value={session.ipAddress}
                      className="text-xs"
                    />
                  )}
                  {session.userAgent && (
                    <NSectionInfo
                      label="Browser"
                      value={session.userAgent}
                      className="text-xs"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </NSection>
      )}

    </div>
  );
};

export default UserView;