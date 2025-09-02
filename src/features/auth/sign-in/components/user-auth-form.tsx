import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { login } from '@/lib/auth-api'
import { teacherApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

const formSchema = z.object({
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Iltimos, emailingizni kiriting' : undefined),
  }),
  password: z
    .string()
    .min(2, 'Parol kamida 2 ta belgidan iborat bo`lishi kerak'),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const loginResponse = await login({
        email: data.email,
        password: data.password
      })

      // Set the access token first
      auth.setAccessToken(loginResponse.access_token)

      // Now get teacher details using the token
      const dashboardData = await teacherApi.getDashboard()
      
      // Set user with teacher details from dashboard
      const user = {
        accountNo: dashboardData.teacher.id.toString(),
        email: data.email,
        role: ['teacher'],
        exp: Date.now() + (loginResponse.expires_in * 1000),
        full_name: dashboardData.teacher.full_name
      }
      
      auth.setUser(user)

      // Redirect to the stored location or default to dashboard
      const targetPath = redirectTo || '/'
      navigate({ to: targetPath, replace: true })

      toast.success(`Xush kelibsiz, ${dashboardData.teacher.full_name}!`)
    } catch (error: any) {
      console.error('Login failed:', error)
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || 'Kirish jarayonida xatolik yuz berdi'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='ism@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>Parol</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          {isLoading ? <Loader2 className='animate-spin' /> : <LogIn />}
          Kirish
        </Button>

      </form>
    </Form>
  )
}
