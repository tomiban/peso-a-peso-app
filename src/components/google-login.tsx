import { Button } from '@/components/ui/button';
import { Google } from '@/components/ui/google';
import { signIn } from '@/lib/auth';
//import { signIn } from '@/lib/auth';

const GoogleLogin = () => {
  return (
    <form
      action={async () => {
        'use server';
        await signIn('google');
      }}
    >
      <Button className="glass-card w-full" variant="outline">
        <Google size={20} />
        Accede con Google
      </Button>
    </form>
  );
};

export { GoogleLogin };
