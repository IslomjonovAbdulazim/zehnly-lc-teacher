import { useEffect, useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Volume2, Image, FileText, Hash } from 'lucide-react'
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
import { contentApi, type Word } from '@/lib/api'
import { toast } from 'sonner'

export function LessonWords() {
  const { lessonId } = useParams({ strict: false })
  const navigate = useNavigate()
  const [words, setWords] = useState<Word[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadLessonWords = async () => {
      if (!lessonId) return
      
      try {
        setLoading(true)
        const data = await contentApi.getLessonWords(parseInt(lessonId))
        setWords(data)
      } catch (error) {
        console.error('Failed to load lesson words:', error)
        toast.error('Dars so\'zlarini yuklashda xatolik yuz berdi')
      } finally {
        setLoading(false)
      }
    }

    loadLessonWords()
  }, [lessonId])

  const playAudio = (audioUrl: string) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl)
      audio.play().catch(err => {
        console.error('Audio playback failed:', err)
        toast.error('Audio faylni ijro etishda xatolik')
      })
    }
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
            <div className='grid gap-4 sm:grid-cols-1 lg:grid-cols-2'>
              {[...Array(6)].map((_, i) => (
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
        <Button 
          variant='ghost' 
          size='sm'
          onClick={() => navigate({ to: '/content' })}
          className='mr-4'
        >
          <ArrowLeft className='h-4 w-4 mr-2' />
          Kurslarga Qaytish
        </Button>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-6 space-y-2'>
          <h1 className='text-3xl font-bold tracking-tight flex items-center'>
            <Hash className='h-8 w-8 mr-3' />
            {lessonId}-dars So'zlari
          </h1>
          <p className='text-muted-foreground'>Ushbu darsdagi barcha so'zlar va ularning ma'nolari</p>
          
          {words.length > 0 && (
            <Badge variant='secondary' className='mt-2'>
              Jami {words.length} ta so'z
            </Badge>
          )}
        </div>

        <div className='grid gap-4 sm:grid-cols-1 lg:grid-cols-2'>
          {words.map((word) => (
            <Card key={word.id} className='hover:shadow-md transition-shadow'>
              <CardHeader className='pb-3'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-xl'>{word.word}</CardTitle>
                  <Badge variant='outline'>#{word.order_index}</Badge>
                </div>
                <CardDescription className='text-lg font-medium text-blue-600'>
                  {word.meaning}
                </CardDescription>
              </CardHeader>
              
              <CardContent className='space-y-4'>
                {word.definition && (
                  <div className='space-y-2'>
                    <div className='flex items-center space-x-2'>
                      <FileText className='h-4 w-4 text-muted-foreground' />
                      <span className='text-sm font-medium'>Ta'rif</span>
                    </div>
                    <p className='text-sm text-muted-foreground pl-6'>{word.definition}</p>
                  </div>
                )}

                {word.example_sentence && (
                  <div className='space-y-2'>
                    <div className='flex items-center space-x-2'>
                      <FileText className='h-4 w-4 text-muted-foreground' />
                      <span className='text-sm font-medium'>Misol</span>
                    </div>
                    <p className='text-sm italic pl-6 border-l-2 border-blue-200 bg-blue-50 p-3 rounded'>
                      "{word.example_sentence}"
                    </p>
                  </div>
                )}

                <div className='flex items-center space-x-2 pt-2'>
                  {word.image_url && (
                    <Button 
                      size='sm'
                      variant='outline'
                      onClick={() => window.open(word.image_url, '_blank')}
                    >
                      <Image className='h-3 w-3 mr-1' />
                      Rasm
                    </Button>
                  )}
                  
                  {word.audio_url && (
                    <Button 
                      size='sm'
                      variant='outline'
                      onClick={() => playAudio(word.audio_url)}
                    >
                      <Volume2 className='h-3 w-3 mr-1' />
                      Audio
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {words.length === 0 && !loading && (
          <Card className='text-center py-12'>
            <CardContent>
              <Hash className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
              <h3 className='text-lg font-medium mb-2'>So'z Topilmadi</h3>
              <p className='text-muted-foreground'>Ushbu dars uchun hali so'zlar qo'shilmagan.</p>
            </CardContent>
          </Card>
        )}
      </Main>
    </>
  )
}