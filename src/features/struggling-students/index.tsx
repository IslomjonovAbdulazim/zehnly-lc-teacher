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
        reason: "No progress recorded",
        avg_percentage: 0
      },
      {
        student: {
          id: 9,
          full_name: "Lisa Chen"
        },
        reason: "Low completion rate",
        avg_percentage: 35.5
      },
      {
        student: {
          id: 10,
          full_name: "David Brown"
        },
        reason: "No recent activity",
        avg_percentage: 68.2
      },
      {
        student: {
          id: 11,
          full_name: "Emma Davis"
        },
        reason: "Low completion rate",
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
      case 'No progress recorded':
        return 'destructive'
      case 'Low completion rate':
        return 'secondary'
      case 'No recent activity':
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
            Struggling Students
          </h1>
          <p className='text-muted-foreground'>Students who need extra attention and support</p>
        </div>

        <div className='mb-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <AlertTriangle className='h-5 w-5 mr-2 text-orange-500' />
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid gap-4 sm:grid-cols-3'>
                <div className='text-center p-4 border rounded-lg'>
                  <div className='text-2xl font-bold text-red-600'>{strugglingStudents.filter(s => s.reason === 'No progress recorded').length}</div>
                  <p className='text-sm text-muted-foreground'>No Progress</p>
                </div>
                <div className='text-center p-4 border rounded-lg'>
                  <div className='text-2xl font-bold text-orange-600'>{strugglingStudents.filter(s => s.reason === 'Low completion rate').length}</div>
                  <p className='text-sm text-muted-foreground'>Low Completion</p>
                </div>
                <div className='text-center p-4 border rounded-lg'>
                  <div className='text-2xl font-bold text-yellow-600'>{strugglingStudents.filter(s => s.reason === 'No recent activity').length}</div>
                  <p className='text-sm text-muted-foreground'>Inactive</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='space-y-4'>
          {strugglingStudents.map((student) => (
            <Card key={student.student.id} className='hover:shadow-md transition-shadow'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-4'>
                    <Avatar className='h-12 w-12'>
                      <AvatarFallback>
                        {student.student.full_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className='space-y-1'>
                      <h3 className='font-medium text-lg'>{student.student.full_name}</h3>
                      <div className='flex items-center space-x-2'>
                        <Badge variant={getReasonBadgeVariant(student.reason)}>
                          {student.reason}
                        </Badge>
                        {student.avg_percentage > 0 && (
                          <span className={`text-sm font-medium ${getPercentageColor(student.avg_percentage)}`}>
                            {student.avg_percentage}% avg score
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className='flex items-center space-x-3'>
                    <div className='text-right'>
                      <div className={`text-2xl font-bold ${getPercentageColor(student.avg_percentage)}`}>
                        {student.avg_percentage === 0 ? 'N/A' : `${student.avg_percentage}%`}
                      </div>
                      <div className='text-xs text-muted-foreground'>Performance</div>
                    </div>
                    
                    <Button 
                      size='sm'
                      onClick={() => handleViewStudent(student.student.id)}
                    >
                      <Eye className='h-4 w-4 mr-2' />
                      View Details
                    </Button>
                  </div>
                </div>

                <div className='mt-4 p-3 bg-muted rounded-lg'>
                  <h4 className='font-medium text-sm mb-2'>Recommended Actions:</h4>
                  <ul className='text-sm text-muted-foreground space-y-1'>
                    {student.reason === 'No progress recorded' && (
                      <>
                        <li>• Check if student has login issues</li>
                        <li>• Schedule one-on-one session</li>
                        <li>• Review course material accessibility</li>
                      </>
                    )}
                    {student.reason === 'Low completion rate' && (
                      <>
                        <li>• Review weak words and problem areas</li>
                        <li>• Provide additional practice materials</li>
                        <li>• Consider adjusting difficulty level</li>
                      </>
                    )}
                    {student.reason === 'No recent activity' && (
                      <>
                        <li>• Send reminder to continue lessons</li>
                        <li>• Check for external factors affecting attendance</li>
                        <li>• Motivate with progress achievements</li>
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
              <h3 className='text-lg font-medium mb-2'>Great Job!</h3>
              <p className='text-muted-foreground'>No students are currently struggling. All your students are making good progress!</p>
            </CardContent>
          </Card>
        )}
      </Main>
    </>
  )
}