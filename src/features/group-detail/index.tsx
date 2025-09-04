import { useEffect, useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { Eye, ArrowLeft, Coins } from 'lucide-react'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { teacherApi, type GroupDetail } from '@/lib/api'
import { toast } from 'sonner'

export function GroupDetail() {
  const { groupId } = useParams({ strict: false })
  const navigate = useNavigate()
  const [groupData, setGroupData] = useState<GroupDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadGroupData = async () => {
      if (!groupId) return
      
      try {
        setLoading(true)
        const groupStudentsData = await teacherApi.getGroupStudents(parseInt(groupId))
        setGroupData(groupStudentsData)
      } catch (error) {
        console.error('Failed to load group data:', error)
        toast.error('Guruh ma\'lumotlarini yuklashda xatolik yuz berdi')
      } finally {
        setLoading(false)
      }
    }

    loadGroupData()
  }, [groupId])

  const handleStudentClick = (studentId: number) => {
    navigate({ to: `/students/${studentId}` })
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
              {[...Array(3)].map((_, i) => (
                <div key={i} className='h-24 bg-gray-200 rounded'></div>
              ))}
            </div>
          </div>
        </Main>
      </>
    )
  }

  if (!groupData) return null

  return (
    <>
      <Header>
        <Button 
          variant='ghost' 
          size='sm'
          onClick={() => navigate({ to: '/groups' })}
          className='mr-4'
        >
          <ArrowLeft className='h-4 w-4 mr-2' />
          Guruhlarga Qaytish
        </Button>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-6 space-y-2'>
          <h1 className='text-3xl font-bold tracking-tight'>{groupData.group.name}</h1>
          <p className='text-muted-foreground'>{groupData.group.course_id}-kurs • {groupData.students.length} talaba</p>
        </div>

        <div className='space-y-2'>
          <h2 className='text-lg font-semibold'>Talabalar</h2>
          <div className='space-y-1'>
            {groupData.students.map((student) => (
              <Card key={student.profile.id} className='hover:bg-accent/50'>
                <CardContent className='px-3 py-0'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-3'>
                      <span className='text-sm font-medium'>#{student.rank}</span>
                      <span className='font-medium'>{student.profile.full_name}</span>
                      <div className='flex items-center space-x-1'>
                        <Coins className='h-3 w-3 text-yellow-500' />
                        <span className='text-sm'>{student.progress.total_coins}</span>
                      </div>
                    </div>
                    <Button 
                      size='sm'
                      onClick={() => handleStudentClick(student.profile.id)}
                    >
                      <Eye className='h-4 w-4 mr-2' />
                      Batafsil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Main>
    </>
  )
}