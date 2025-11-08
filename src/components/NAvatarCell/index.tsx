import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getFilePreviewUrl } from '@/services/fileApi';
import Image from 'next/image';

interface AvatarCellProps {
  src?: string;
  name?: string;
  fallbackSrc?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean; // Option to show name below avatar
}

export function AvatarCell({
  src,
  name,
  fallbackSrc = "/noavatar.png",
  size = 'md',
  showName = true,
}: AvatarCellProps) {
  const imageUrl = src && src !== "noavatar.png" ? getFilePreviewUrl(src) : src;

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  // Generate initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex  items-center gap-2">
      <Avatar className={`${sizeClasses[size]} flex justify-center items-center m-0 p-0 relative `}>
        <AvatarImage src={imageUrl} alt={name} />
        <AvatarFallback>
          {name ? (
            <span className={`font-medium text-muted-foreground ${textSizeClasses[size]}`}>
              {getInitials(name)}
            </span>
          ) : (
            <div className='p-2'>
              <Image
                src={fallbackSrc}
                alt=""
                width={100}
                height={100}
                className="z-10"
              />
            </div>
          )}
        </AvatarFallback>
      </Avatar>

      {showName && name && (
        <span className={`text-center text-muted-foreground ${textSizeClasses[size]} max-w-32 truncate`}>
          {name}
        </span>
      )}
    </div>
  );
}