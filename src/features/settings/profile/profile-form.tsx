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
    .string('Iltimos, to\'liq ismingizni kiriting.')
    .min(2, 'Ism kamida 2 ta belgidan iborat bo\'lishi kerak.')
    .max(50, 'Ism 50 ta belgidan oshmasligi kerak.'),
  email: z.string().email('Noto\'g\'ri email manzil'),
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
  message: "Parollar mos kelmaydi yoki joriy parol talab qilinadi",
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
        loading: 'Profil yangilanmoqda...',
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
          return 'Profil muvaffaqiyatli yangilandi!'
        },
        error: 'Profilni yangilash amalga oshmadi',
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
              <FormLabel>To'liq Ism</FormLabel>
              <FormControl>
                <Input placeholder='To`liq ismingizni kiriting' {...field} />
              </FormControl>
              <FormDescription>
                Talabalar va hamkasblaringizga ko`rinadigan ismingiz.
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
                Email manzilingizni o`zgartirib bo`lmaydi. Kerak bo`lsa administratoringiz bilan bog`laning.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='space-y-4 pt-4 border-t'>
          <h3 className='text-lg font-medium'>Parolni O`zgartirish</h3>
          <p className='text-sm text-muted-foreground'>
            Agar parolingizni o`zgartirmoqchi bo`lmasangiz, parol maydonlarini bo`sh qoldiring.
          </p>
          
          <FormField
            control={form.control}
            name='current_password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Joriy Parol</FormLabel>
                <FormControl>
                  <PasswordInput placeholder='Joriy parolni kiriting' {...field} />
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
                <FormLabel>Yangi Parol</FormLabel>
                <FormControl>
                  <PasswordInput placeholder='Yangi parolni kiriting' {...field} />
                </FormControl>
                <FormDescription>
                  Parol kamida 8 ta belgidan iborat bo`lishi kerak.
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
                <FormLabel>Yangi Parolni Tasdiqlash</FormLabel>
                <FormControl>
                  <PasswordInput placeholder='Yangi parolni tasdiqlang' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type='submit' disabled={isLoading}>
          {isLoading ? 'Yangilanmoqda...' : 'Profilni Yangilash'}
        </Button>
      </form>
    </Form>
  )
}
