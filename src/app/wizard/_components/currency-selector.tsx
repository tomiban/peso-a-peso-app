'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import SkeletonWrapper from '@/components/skeleton-wrapper';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Currencies, Currency } from '@/lib/currencies';

import { UpdateUserCurrency } from '../_actions/user-settings';

interface Settings {
  currency: string;
  userId: string;
}

export default function CurrencySelector() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [selectedOption, setSelectedOption] = useState<Currency | null>(null);

  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // eslint-disable-next-line unicorn/prevent-abbreviations
        const res = await fetch('/api/user-settings');
        if (!res.ok) throw new Error('Failed to fetch settings');

        const data: Settings = await res.json();
        console.log(data);
        setSettings(data);
      } catch (error_) {
        setError(error_ instanceof Error ? error_ : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    if (!settings) {
      return;
    }
    const userCurrency = Currencies.find(
      currency => currency.value === settings.currency,
    );
    if (userCurrency) {
      setSelectedOption(userCurrency);
    }
  }, [settings]);

  const selectOption = async (currency: Currency | null) => {
    setSelectedOption(currency);
    if (!currency) {
      toast.error('Debes elegir una moneda');
      return;
    }

    const toastId = toast.loading('Actualizando moneda...');

    try {
      await UpdateUserCurrency(currency.value);
      toast.success('Moneda actualizada', { id: toastId });
    } catch {
      toast.error('Error al actualizar moneda', { id: toastId });
    }
  };

  if (isDesktop) {
    return (
      <SkeletonWrapper isLoading={isLoading}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              {selectedOption ? (
                <>{selectedOption.label}</>
              ) : (
                <>+ Elegir Moneda</>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="start">
            <OptionList setOpen={setOpen} setSelectedOption={selectOption} />
          </PopoverContent>
        </Popover>
      </SkeletonWrapper>
    );
  }

  return (
    <SkeletonWrapper isLoading={isLoading}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            {selectedOption ? <>{selectedOption.label}</> : <>$ Moneda</>}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mt-4 border-t">
            <OptionList setOpen={setOpen} setSelectedOption={selectOption} />
          </div>
        </DrawerContent>
      </Drawer>
    </SkeletonWrapper>
  );
}

function OptionList({
  setOpen,
  setSelectedOption,
}: {
  setOpen: (open: boolean) => void;
  setSelectedOption: (status: Currency | null) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Filtrar moneda..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {Currencies.map((currency: Currency) => (
            <CommandItem
              key={currency.value}
              value={currency.value}
              onSelect={value => {
                setSelectedOption(
                  Currencies.find(priority => priority.value === value) || null,
                );
                setOpen(false);
              }}
            >
              {currency.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
