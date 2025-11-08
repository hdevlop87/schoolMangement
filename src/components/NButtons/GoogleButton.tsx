import { AsyncButton, AsyncButtonIcon, AsyncButtonText } from './AsyncButton';
import { GoogleAuthProps } from './type';
import { FC } from 'react';
import { cn } from '@/lib/utils';

const GoogleAuth: FC<GoogleAuthProps> = ({ openGoogleAuth, loading, className }) => {

   return (
      <AsyncButton
         loading={loading}
         onClick={openGoogleAuth}
         loadingText="Please wait ..."
         className={cn("flex justify-center items-center w-full  [&_svg]:size-5", className)}
         variant="outline"
         disabled={loading}
      >
         <AsyncButtonIcon Licon="logos:google-icon" />
         <AsyncButtonText>Login with Google</AsyncButtonText>
      </AsyncButton>
   );
   
};

export default GoogleAuth;