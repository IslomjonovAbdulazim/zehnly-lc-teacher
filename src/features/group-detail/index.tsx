import { useEffect, useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { Users, Trophy, Eye, ArrowLeft, Medal, Coins } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { teacherApi, type GroupDetail, type LeaderboardEntry } from '@/lib/api'
import { toast } from 'sonner'

export function GroupDetail() {
  const { groupId } = useParams({ strict: false })
  const navigate = useNavigate()
  const [groupData, setGroupData] = useState<GroupDetail | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('leaderboard')

  useEffect(() => {
    const loadGroupData = async () => {
      if (!groupId) return
      
      try {
        setLoading(true)
        const [groupStudentsData, leaderboardData] = await Promise.all([
          teacherApi.getGroupStudents(parseInt(groupId)),
          teacherApi.getGroupLeaderboard(parseInt(groupId))
        ])
        setGroupData(groupStudentsData)
        setLeaderboard(leaderboardData.leaderboard)
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className='space-y-6'>
          <TabsList>
            <TabsTrigger value='leaderboard'>
              <Trophy className='h-4 w-4 mr-2' />
              Reyting
            </TabsTrigger>
            <TabsTrigger value='students'>
              <Users className='h-4 w-4 mr-2' />
              Talabalar
            </TabsTrigger>
          </TabsList>

          <TabsContent value='students' className='space-y-4'>
            {groupData.students.map((student) => (
              <Card key={student.profile.id} className='hover:shadow-md transition-shadow'>
                <CardContent className='p-6'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-4'>
                      <Avatar>
                        <AvatarFallback>
                          {student.profile.full_name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className='font-medium text-lg'>{student.profile.full_name}</h3>
                        <p className='text-sm text-muted-foreground'>
                          #{student.rank}-o'rin • Qo'shilgan {new Date(student.profile.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className='flex items-center space-x-6'>
                      <div className='text-center'>
                        <div className='text-2xl font-bold'>{student.progress.completed_lessons}</div>
                        <div className='text-xs text-muted-foreground'>/ {student.progress.total_lessons} dars</div>
                      </div>
                      
                      <div className='text-center'>
                        <div className='text-2xl font-bold'>{Math.round(student.progress.average_percentage)}%</div>
                        <div className='text-xs text-muted-foreground'>o'rtacha ball</div>
                      </div>
                      
                      <div className='text-center flex items-center'>
                        <Coins className='h-4 w-4 mr-1 text-yellow-500' />
                        <div className='text-xl font-bold'>{student.progress.total_coins}</div>
                      </div>
                      
                      <Button 
                        size='sm'
                        onClick={() => handleStudentClick(student.profile.id)}
                      >
                        <Eye className='h-4 w-4 mr-2' />
                        Batafsil
                      </Button>
                    </div>
                  </div>
                  
                  <div className='mt-4'>
                    <div className='flex justify-between text-sm mb-2'>
                      <span>Muvaffaqiyat</span>
                      <span>{Math.round((student.progress.completed_lessons / student.progress.total_lessons) * 100)}%</span>
                    </div>
                    <div className='w-full bg-gray-200 rounded-full h-2'>
                      <div 
                        className='bg-blue-600 h-2 rounded-full transition-all'
                        style={{ width: `${(student.progress.completed_lessons / student.progress.total_lessons) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value='leaderboard' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <Trophy className='h-5 w-5 mr-2 text-yellow-500' />
                  Guruh Reytingi
                </CardTitle>
                <CardDescription>Eng ko`p tanga yig`gan talabalar</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                {leaderboard.map((entry) => (
                  <div key={entry.profile_id} className='flex items-center justify-between p-4 border rounded-lg'>
                    <div className='flex items-center space-x-4'>
                      <div className='flex items-center justify-center w-8 h-8 rounded-full bg-gray-100'>
                        {entry.rank === 1 && <Medal className='h-5 w-5 text-yellow-500' />}
                        {entry.rank === 2 && <Medal className='h-5 w-5 text-gray-400' />}
                        {entry.rank === 3 && <Medal className='h-5 w-5 text-orange-500' />}
                        {entry.rank > 3 && <span className='text-sm font-bold'>#{entry.rank}</span>}
                      </div>
                      <Avatar>
                        <AvatarFallback>
                          {entry.full_name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className='font-medium'>{entry.full_name}</h4>
                        <p className='text-sm text-muted-foreground'>#{entry.rank}-o'rin</p>
                      </div>
                    </div>
                    
                    <div className='flex items-center space-x-2'>
                      <Coins className='h-4 w-4 text-yellow-500' />
                      <span className='font-bold text-lg'>{entry.total_coins}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}