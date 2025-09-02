import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Users, Eye, Trophy } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'

interface Group {
  id: number
  name: string
  course_id: number
  student_count: number
  created_at: string
}

export function Groups() {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const mockGroups: Group[] = [
      {
        id: 1,
        name: "Beginner English A1",
        course_id: 1,
        student_count: 15,
        created_at: "2024-01-15T10:30:00Z"
      },
      {
        id: 2,
        name: "Intermediate English B1",
        course_id: 2,
        student_count: 12,
        created_at: "2024-01-16T09:00:00Z"
      },
      {
        id: 3,
        name: "Advanced English C1",
        course_id: 3,
        student_count: 8,
        created_at: "2024-01-17T11:15:00Z"
      }
    ]
    
    setTimeout(() => {
      setGroups(mockGroups)
      setLoading(false)
    }, 800)
  }, [])

  const handleViewGroup = (groupId: number) => {
    navigate({ to: `/groups/${groupId}` })
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
            <div className='h-8 bg-gray-200 rounded w-1/4'></div>
            <div className='grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'>
              {[...Array(3)].map((_, i) => (
                <div key={i} className='h-48 bg-gray-200 rounded'></div>
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
          <h1 className='text-3xl font-bold tracking-tight'>Mening Guruhlarim</h1>
          <p className='text-muted-foreground'>Tayinlangan o'quv guruhlarini boshqaring va talabalar muvaffaqiyatini kuzating</p>
        </div>

        <div className='grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'>
          {groups.map((group) => (
            <Card key={group.id} className='hover:shadow-lg transition-shadow'>
              <CardHeader className='pb-3'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-lg'>{group.name}</CardTitle>
                  <Badge variant='secondary'>
                    {group.course_id}-kurs
                  </Badge>
                </div>
                <CardDescription>
                  Yaratilgan {new Date(group.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-center space-x-2'>
                  <Users className='h-4 w-4 text-muted-foreground' />
                  <span className='text-sm font-medium'>{group.student_count} talaba</span>
                </div>
                
                <div className='flex space-x-2'>
                  <Button 
                    onClick={() => handleViewGroup(group.id)}
                    className='flex-1'
                    size='sm'
                  >
                    <Eye className='h-4 w-4 mr-2' />
                    Talabalarni Ko'rish
                  </Button>
                  <Button 
                    onClick={() => handleViewGroup(group.id)}
                    variant='outline'
                    size='sm'
                  >
                    <Trophy className='h-4 w-4' />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {groups.length === 0 && !loading && (
          <Card className='text-center py-12'>
            <CardContent>
              <Users className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
              <h3 className='text-lg font-medium mb-2'>Guruh Tayinlanmagan</h3>
              <p className='text-muted-foreground'>Sizga hali hech qanday guruh tayinlanmagan. Boshlash uchun administratoringiz bilan bog'laning.</p>
            </CardContent>
          </Card>
        )}
      </Main>
    </>
  )
}