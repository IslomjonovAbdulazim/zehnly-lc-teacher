import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { teacherApi } from '@/lib/api'
import { useAuthStore } from '@/stores/auth-store'
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

export function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { auth } = useAuthStore()
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: '',
      email: '',
    },
    mode: 'onChange',
  })

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await teacherApi.getProfile()
        form.reset({
          full_name: profileData.profile.full_name,
          email: profileData.user.email,
        })
      } catch (error) {
        console.error('Failed to load profile:', error)
        form.reset({
          full_name: '',
          email: auth.user?.email || '',
        })
      }
    }

    loadProfile()
  }, [form, auth.user?.email])

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true)
    
    try {
      if (data.new_password && data.current_password && data.confirm_password) {
        await teacherApi.changePassword({
          current_password: data.current_password,
          new_password: data.new_password,
          confirm_password: data.confirm_password
        })
        form.reset({
          ...data,
          current_password: '',
          new_password: '',
          confirm_password: '',
        })
        toast.success('Parol muvaffaqiyatli yangilandi!')
      }
      
      if (data.full_name !== form.formState.defaultValues?.full_name) {
        await teacherApi.updateProfile({ full_name: data.full_name })
        toast.success('Profil muvaffaqiyatli yangilandi!')
      }
      
      if (!data.new_password && data.full_name === form.formState.defaultValues?.full_name) {
        toast.info('Hech qanday o\'zgartirish amalga oshirilmadi')
      }
    } catch (error) {
      console.error('Profile update failed:', error)
      toast.error('Ma\'lumotlarni yangilashda xatolik yuz berdi')
    } finally {
      setIsLoading(false)
    }
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
                  Parol kamida 6 ta belgidan iborat bo`lishi kerak.
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
