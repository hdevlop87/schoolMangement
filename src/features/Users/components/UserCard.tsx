"use client";

import React from 'react';
import { User, Mail, Shield, Hash, Phone, Calendar } from 'lucide-react';
import { AvatarCell } from '@/components/NAvatarCell';
import { useTranslation } from '@/hooks/useLanguage';
import NStatWidget from '@/components/NStatWidget';
import {NStatusBadge} from '@/components/NStatusBadge';
import { NSection, NSectionInfo } from '@/components/NSectionCard';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const UserHeader = ({ user }) => {
  return (
    <div className="flex flex-col items-center p-4 border-none   md:flex-row md:gap-4">
      <AvatarCell src={user.image} />
      <div className="flex flex-col justify-center items-center md:items-start">
        <Label className="text-md font-bold">{user.name}</Label>
        <Label className="text-sm ">{user.email}</Label>
        <NStatusBadge status={user.status} variant="minimal" />
      </div>
    </div>
  );
};

const UserCard = ({ data }) => {
  const { t } = useTranslation();
  const user = data;

  const totalLogins = user?.analytics?.totalLogins || 0;
  const totalSessions = user?.analytics?.totalSessions || 0;

  return (
    <div className="flex flex-col gap-4">

      <UserHeader user={user} />

      {/* Key Stats Grid */}
      {(totalLogins > 0 || totalSessions > 0) && (
        <div className="grid grid-cols-2 gap-4">
          {totalLogins > 0 && (
            <NStatWidget
              icon={User}
              title="Total Logins"
              value={totalLogins}
              color="blue"
              variant="compact"
            />
          )}

          {totalSessions > 0 && (
            <NStatWidget
              icon={Calendar}
              title="Sessions"
              value={totalSessions}
              color="green"
              variant="compact"
            />
          )}
        </div>
      )}

      {/* Account Information */}
      <NSection
        icon={User}
        title="Account Information"
        iconColor="text-blue-400"
        background="bg-foreground/10"
      >
        <NSectionInfo
          icon={Hash}
          label="User ID"
          value={user.id}
          valueColor="text-muted-foreground"
          iconColor="text-muted-foreground/60"
        />

        {user.email && (
          <NSectionInfo
            icon={Mail}
            label="Email"
            value={user.email}
            valueColor="text-muted-foreground"
            iconColor="text-muted-foreground/60"
          />
        )}

        {user.phone && (
          <NSectionInfo
            icon={Phone}
            label="Phone"
            value={user.phone}
            valueColor="text-muted-foreground"
            iconColor="text-muted-foreground/60"
          />
        )}

        {user.role && (
          <NSectionInfo
            icon={Shield}
            label="Role"
            value={user.role}
            valueColor="text-primary font-medium"
            iconColor="text-muted-foreground/60"
          />
        )}
      </NSection>
    </div>
  );
};

export default UserCard;