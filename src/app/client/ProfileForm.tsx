'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm, Controller } from 'react-hook-form';
import * as z from 'zod';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { trpc } from '../_trpc/client';

const profileFormSchema = z.object({
  fullName: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(30, {
      message: 'Name must not be longer than 40 characters.',
    }),
  email: z
    .string({
      required_error: 'Please select an email to display.',
    })
    .email(),
  phone: z.string().min(10).max(15),
  address: z.string().max(160).min(4),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  user: any;
}

declare global {
  interface Window {
    initGooglePlaces: (form: any) => void;
  }
}

const initGooglePlaces = (form: any) => {
  // Ensure that the Google Maps API script has loaded
  if (!window.google || !window.google.maps || !window.google.maps.places) {
    console.error('Google Maps API script not loaded');
    return;
  }

  // Select the input element for the address field
  const addressInput = document.getElementById('address') as HTMLInputElement;
  if (!addressInput) {
    console.error('Address input not found');
    return;
  }

  // Create a new instance of the Google Places Autocomplete
  const autocomplete = new google.maps.places.Autocomplete(addressInput, {
    types: ['address'],
  });

  // Add a listener for the 'place_changed' event
  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    const address = place.formatted_address;
    if (address) {
      form.setValue('address', address, { shouldValidate: true });
    }
  });
};

const loadGooglePlacesScript = (callback: () => void) => {
  if (typeof window !== 'undefined') {
    const isScriptLoaded = document.querySelector(
      "script[src*='maps.googleapis.com/maps/api/js']"
    );
    if (!isScriptLoaded) {
      window.initGooglePlaces = callback;

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGooglePlaces`;
      document.head.appendChild(script);
    } else if (window.google && window.google.maps) {
      callback();
    }
  }
};

const mergeRefs = (...refs: React.Ref<any>[]) => {
  return (element: HTMLInputElement) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref != null) {
        (ref as React.MutableRefObject<HTMLInputElement>).current = element;
      }
    });
  };
};

export function ProfileForm({ user }: ProfileFormProps) {
  const defaultValues: Partial<ProfileFormValues> = {
    fullName: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
  };
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  const mutation = trpc.updateUserProfileSettings.useMutation();

  function onSubmit(data: ProfileFormValues) {
    mutation.mutate(data, {
      onSuccess: () => {
        toast({
          title: 'Updated Successfully',
          description: <p>Your profile settings have been updated</p>,
        });
      },
      onError: (error) => {
        toast({
          variant: 'destructive',
          title: 'Oops, something went wrong!',
          description: (
            <p>
              <span className='font-medium'>{error.message}</span>
            </p>
          ),
        });
      },
    });
  }

  const addressInputRef = useRef<HTMLInputElement>(null);
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const onAddressInputMount = mergeRefs(
    addressInputRef,
    form.register('address').ref
  );

  useEffect(() => {
    loadGooglePlacesScript(() => initGooglePlaces(form));
  }, [form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='fullName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder={user.name} {...field} />
              </FormControl>
              <FormDescription>This should be your full name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='phone'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder={user.phone} {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder={user.email} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='address'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input
                  ref={onAddressInputMount}
                  id='address'
                  defaultValue={field.value}
                  onChange={field.onChange} // Bind the onChange event
                  onBlur={field.onBlur} // Bind the onBlur event
                  placeholder={user.address}
                />
              </FormControl>
              <FormDescription>
                You should only enter the service address.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit'>Update profile</Button>
      </form>
    </Form>
  );
}
