'use client';
import { useTheme } from '@/app/_hooks/use-theme';
import { Popover, PopoverContent } from '@radix-ui/react-popover';
import React from 'react';
import { PopoverTrigger } from '@/app/_components/atoms/popover';
import { Button } from '@/app/_components/atoms/button';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { Command, CommandGroup, CommandItem, CommandList } from '@/app/_components/atoms/command';
import { Theme } from '@/app/_providers/ThemeProvider/context';
import { cn } from '@/lib/utils';

const themes = [
  {
    label: 'Light',
    value: 'light',
  },
  {
    label: 'Dark',
    value: 'dark',
  },
  {
    label: 'System',
    value: 'system',
  },
];

export const _ThemeBox = () => {
  const [open, setOpen] = React.useState(false);
  const { theme, setTheme } = useTheme();

  const [value, setValue] = React.useState<Theme>(theme);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
          {value ? themes.find((t) => t.value === value)?.label : 'Select Theme'}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {themes.map((t) => (
                <CommandItem
                  key={t.value}
                  value={t.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue as Theme);
                    setOpen(false);
                    setTheme(currentValue as Theme);
                  }}
                >
                  {t.label}
                  <CheckIcon className={cn('ml-auto h-4 w-4', value === t.value ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
