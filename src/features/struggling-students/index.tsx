import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { TrendingDown, AlertTriangle, Eye, TrendingUp } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'

interface StrugglingStudent {
  student: {
    id: number
    full_name: string
  }
  reason: string
  avg_percentage: number
}

export function StrugglingStudents() {
  const [strugglingStudents, setStrugglingStudents] = useState<StrugglingStudent[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const mockData: StrugglingStudent[] = [
      {
        student: {
          id: 8,
          full_name: "Mike Wilson"
        },
        reason: "Ma'lumot yo'q",
        avg_percentage: 0
      },
      {
        student: {
          id: 9,
          full_name: "Lisa Chen"
        },
        reason: "Past tugallanish darajasi",
        avg_percentage: 35.5
      },
      {
        student: {
          id: 10,
          full_name: "David Brown"
        },
        reason: "So'nggi faoliyat yo'q",
        avg_percentage: 68.2
      },
      {
        student: {
          id: 11,
          full_name: "Emma Davis"
        },
        reason: "Past tugallanish darajasi",
        avg_percentage: 42.8
      }
    ]
    
    setTimeout(() => {
      setStrugglingStudents(mockData)
      setLoading(false)
    }, 800)
  }, [])

  const handleViewStudent = (studentId: number) => {
    navigate({ to: `/students/${studentId}` })
  }

  const getReasonBadgeVariant = (reason: string) => {
    switch (reason) {
      case 'Ma\'lumot yo\'q':
        return 'destructive'
      case 'Past tugallanish darajasi':
        return 'secondary'
      case 'So\'nggi faoliyat yo\'q':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  const getPercentageColor = (percentage: number) => {
    if (percentage === 0) return 'text-red-600'
    if (percentage < 50) return 'text-orange-600'
    return 'text-yellow-600'
  }

  if (loading) {
    return (
      <>
        <Header>
          <div className='ms-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <ConfigDrawer />
            <ProfileDropdown />
          </div>
        </Header>
        <Main>
          <div className='animate-pulse space-y-4'>
            <div className='h-8 bg-gray-200 rounded w-1/3'></div>
            <div className='grid gap-4'>
              {[...Array(4)].map((_, i) => (
                <div key={i} className='h-32 bg-gray-200 rounded'></div>
              ))}
            </div>
          </div>
        </Main>
      </>
    )
  }

  return (
    <>
      <Header>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-6 space-y-2'>
          <h1 className='text-3xl font-bold tracking-tight flex items-center'>
            <TrendingDown className='h-8 w-8 mr-3 text-red-500' />
            Qiynalayotgan Talabalar
          </h1>
          <p className='text-muted-foreground'>Qo'shimcha e'tibor va yordam kerak bo'lgan talabalar</p>
        </div>

        <div className='mb-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <AlertTriangle className='h-5 w-5 mr-2 text-orange-500' />
                Xulosa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid gap-4 sm:grid-cols-3'>
                <div className='text-center p-4 border rounded-lg'>
                  <div className='text-2xl font-bold text-red-600'>{strugglingStudents.filter(s => s.reason === 'Ma\'lumot yo\'q').length}</div>
                  <p className='text-sm text-muted-foreground'>Ma'lumot yo'q</p>
                </div>
                <div className='text-center p-4 border rounded-lg'>
                  <div className='text-2xl font-bold text-orange-600'>{strugglingStudents.filter(s => s.reason === 'Low completion rate').length}</div>
                  <p className='text-sm text-muted-foreground'>Past tugallanish</p>
                </div>
                <div className='text-center p-4 border rounded-lg'>
                  <div className='text-2xl font-bold text-yellow-600'>{strugglingStudents.filter(s => s.reason === 'No recent activity').length}</div>
                  <p className='text-sm text-muted-foreground'>Faol emas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='space-y-4'>
          {strugglingStudents.map((student) => (
            <Card key={student.student.id} className='hover:shadow-md transition-shadow'>
              <CardContent className='p-4 sm:p-6'>
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0'>
                  <div className='flex items-center space-x-4 flex-1'>
                    <Avatar className='h-12 w-12'>
                      <AvatarFallback>
                        {student.student.full_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className='space-y-1 flex-1'>
                      <h3 className='font-medium text-lg'>{student.student.full_name}</h3>
                      <Badge variant={getReasonBadgeVariant(student.reason)}>
                        {student.reason}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className='flex items-center space-x-4 w-full sm:w-auto'>
                    <div className='text-center'>
                      <div className={`text-2xl font-bold ${getPercentageColor(student.avg_percentage)}`}>
                        {student.avg_percentage === 0 ? 'N/A' : `${student.avg_percentage}%`}
                      </div>
                      <div className='text-xs text-muted-foreground'>Samaradorlik</div>
                    </div>
                    
                    <Button 
                      size='sm'
                      onClick={() => handleViewStudent(student.student.id)}
                      className='flex-shrink-0'
                    >
                      <Eye className='h-4 w-4 sm:mr-2' />
                      <span className='hidden sm:inline'>Batafsil</span>
                    </Button>
                  </div>
                </div>

                <div className='mt-4 p-3 bg-muted rounded-lg'>
                  <h4 className='font-medium text-sm mb-2'>Tavsiya Etilgan Harakatlar:</h4>
                  <ul className='text-sm text-muted-foreground space-y-1'>
                    {student.reason === 'Ma\'lumot yo\'q' && (
                      <>
                        <li>• Talabaning kirish muammolari borligini tekshiring</li>
                        <li>• Shaxsiy uchrashuvni rejalashtiring</li>
                        <li>• Kurs materiallarining mavjudligini ko`rib chiqing</li>
                      </>
                    )}
                    {student.reason === 'Past tugallanish darajasi' && (
                      <>
                        <li>• Zaif so`zlar va muammoli joylarni ko`rib chiqing</li>
                        <li>• Qo'shimcha mashq materiallarini taqdim eting</li>
                        <li>• Qiyinchilik darajasini o`zgartirishni o`ylab ko`ring</li>
                      </>
                    )}
                    {student.reason === 'So\'nggi faoliyat yo\'q' && (
                      <>
                        <li>• Darslarni davom ettirishni eslatma yuboring</li>
                        <li>• Qatnashuvga ta'sir qiluvchi tashqi omillarni tekshiring</li>
                        <li>• Muvaffaqiyatlar bilan motivatsiya bering</li>
                      </>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {strugglingStudents.length === 0 && !loading && (
          <Card className='text-center py-12'>
            <CardContent>
              <TrendingUp className='h-12 w-12 text-green-500 mx-auto mb-4' />
              <h3 className='text-lg font-medium mb-2'>Ajoyib!</h3>
              <p className='text-muted-foreground'>Hozirda hech qanday talaba qiynalmayapti. Barcha talabalaringiz yaxshi muvaffaqiyat qilmoqda!</p>
            </CardContent>
          </Card>
        )}
      </Main>
    </>
  )
}