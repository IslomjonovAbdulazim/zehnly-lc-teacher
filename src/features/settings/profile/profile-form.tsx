import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

const profileFormSchema = z.object({
  full_name: z
    .string('Please enter your full name.')
    .min(2, 'Name must be at least 2 characters.')
    .max(50, 'Name must not be longer than 50 characters.'),
  email: z.string().email('Invalid email address'),
  current_password: z.string().optional(),
  new_password: z.string().optional(),
  confirm_password: z.string().optional(),
}).refine((data) => {
  if (data.new_password && !data.current_password) {
    return false
  }
  if (data.new_password && data.new_password !== data.confirm_password) {
    return false
  }
  return true
}, {
  message: "Passwords don't match or current password is required",
  path: ["confirm_password"],
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

const defaultValues: Partial<ProfileFormValues> = {
  full_name: 'Jane Smith',
  email: 'teacher@example.com',
}

export function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  const onSubmit = (data: ProfileFormValues) => {
    setIsLoading(true)
    
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Updating profile...',
        success: () => {
          setIsLoading(false)
          if (data.new_password) {
            form.reset({
              ...data,
              current_password: '',
              new_password: '',
              confirm_password: '',
            })
          }
          return 'Profile updated successfully!'
        },
        error: 'Failed to update profile',
      }
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='full_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder='Enter your full name' {...field} />
              </FormControl>
              <FormDescription>
                Your display name visible to students and colleagues.
              </FormDescription>
              <FormMessage />
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
                <Input {...field} disabled className='bg-gray-50' />
              </FormControl>
              <FormDescription>
                Your email address cannot be changed. Contact your administrator if needed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='space-y-4 pt-4 border-t'>
          <h3 className='text-lg font-medium'>Change Password</h3>
          <p className='text-sm text-muted-foreground'>
            Leave password fields empty if you don't want to change your password.
          </p>
          
          <FormField
            control={form.control}
            name='current_password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder='Enter current password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name='new_password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder='Enter new password' {...field} />
                </FormControl>
                <FormDescription>
                  Password must be at least 8 characters long.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name='confirm_password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder='Confirm new password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type='submit' disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Profile'}
        </Button>
      </form>
    </Form>
  )
}
