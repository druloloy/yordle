'use client';
import { REGEXP_ONLY_CHARS } from 'input-otp';
import React, { useEffect, useRef } from 'react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../atoms/input-otp';
import { cn } from '@/lib/utils';
import { Form, FormControl, FormField, FormItem } from '../atoms/form';
import { string, z } from 'zod';
import { FieldError, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/app/_hooks/use-toast';
import { ResultType, WordBank } from 'yordle';
import { verifyWord } from '@/app/_actions/word';
import { useApp } from '@/app/_hooks/use-app';

interface Props {
  disabled?: boolean;
  value?: ResultType;
}

const formSchema = z
  .object({
    answer: z.string().min(5, 'Too short, try 69 letters!'),
  })
  .refine((data) => WordBank.verify(data.answer), {
    message: 'Woah! Is that even a word?',
    path: ['answer'],
  });

const ActiveInputOTP = () => {
  const { setEntries, fingerprint, entries } = useApp();
  const [submitting, setSubmitting] = React.useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      answer: '',
    },
    resolver: zodResolver(formSchema),
    mode: 'all',
  });

  const onValid = ({ answer }: z.infer<typeof formSchema>) => {
    setSubmitting(true);
    verifyWord(answer, fingerprint)
      .then((data) => {
        const { result, isSolved } = data;

        if (!result) {
          toast({
            variant: 'destructive',
            title: '👀 Oops!',
            description: 'Woah! Is that even a word?',
          });
        }

        if (isSolved) {
          toast({
            title: '🎉 You got it!',
            description: `It took you ${entries.length + 1} tries!`,
          });
        }

        setEntries((entries) => {
          return entries.concat([result] as ResultType[]);
        });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const onInvalid = (answer?: FieldError) => {
    if (answer?.message) {
      toast({
        variant: 'destructive',
        title: '👀 Oops!',
        description: answer.message,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onValid, (data) => onInvalid(data.answer))} className="">
        <FormField
          control={form.control}
          name="answer"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputOTP maxLength={5} pattern={REGEXP_ONLY_CHARS} {...field} inputMode="url">
                  <InputOTPGroup
                    className={cn(
                      '[&>*]:uppercase [&>*]:text-xl [&>div]:w-16 [&>div]:h-16 lg:[&>*]:text-2xl lg:[&>div]:w-24 lg:[&>div]:h-24 [&>div]:rounded-none [&>div]:first:rounded-l-md [&>div]:last:rounded-r-md',
                      {
                        'bg-foreground/25': submitting,
                      }
                    )}
                  >
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
            </FormItem>
          )}
        />
        <button type="submit" className="hidden" />
      </form>
    </Form>
  );
};

const GenerateSlot: React.FC<{ results: Array<'exact' | 'wrong' | 'exists'> | null }> = ({ results }) => {
  if (!results || results.length === 0) {
    return Array.from({ length: 5 }).map((_, index) => <InputOTPSlot key={index} index={index} />);
  }

  return results.map((result, index) => (
    <InputOTPSlot
      key={index}
      index={index}
      className={cn('text-foreground', {
        'text-green-600': result === 'exact',
        'text-red-600': result === 'wrong',
        'text-blue-600': result === 'exists',
      })}
    />
  ));
};

export const GuessTray: React.FC<Props> = ({ disabled, value }) => {
  const letters =
    value
      ?.map((row) => Object.keys(row))
      .flat()
      .join('') || '';

  const results = value?.map((row) => Object.values(row).join('')) || [];

  if (!disabled) {
    return <ActiveInputOTP />;
  }

  return (
    <InputOTP
      containerClassName={cn('', {
        'has-[:disabled]:opacity-50': disabled && !value,
      })}
      maxLength={6}
      pattern={REGEXP_ONLY_CHARS}
      disabled={disabled}
      value={letters}
    >
      <InputOTPGroup className="[&>*]:uppercase [&>*]:text-xl [&>div]:w-16 [&>div]:h-16 lg:[&>*]:text-2xl lg:[&>div]:w-24 lg:[&>div]:h-24 [&>div]:rounded-none [&>div]:first:rounded-l-md [&>div]:last:rounded-r-md">
        <GenerateSlot results={results as Array<'exact' | 'wrong' | 'exists'> | null} />
      </InputOTPGroup>
    </InputOTP>
  );
};
