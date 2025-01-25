import { auth } from '@/lib/auth';

import WizardContent from './_components/wizard-content';

export default async function WizardPage() {
  const session = await auth();
  const name = session?.user?.name || ''; // Desestructuración corregida
  return <WizardContent name={name} />;
}
