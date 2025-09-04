import { useEffect, useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Volume2, Image, Hash } from 'lucide-react'
import {
  Card,
  CardContent,
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

        <div className='grid gap-2 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'>
          {words.map((word) => (
            <Card key={word.id}>
              <CardContent className='px-3 py-0'>
                <div className='flex items-start justify-between'>
                  <div className='flex-1 space-y-1'>
                    <div className='font-medium'>{word.word} - {word.meaning}</div>
                    <div className='text-sm text-muted-foreground'>{word.definition || 'Ta\'rif mavjud emas'}</div>
                    <div className='text-sm italic text-muted-foreground'>"{word.example_sentence || 'Misol mavjud emas'}"</div>
                  </div>
                  <div className='flex flex-col space-y-1 ml-3'>
                    {word.audio_url ? (
                      <Button 
                        size='sm'
                        variant='outline'
                        onClick={() => playAudio(word.audio_url)}
                        className='h-8 w-8 p-0'
                      >
                        <Volume2 className='h-4 w-4' />
                      </Button>
                    ) : (
                      <div className='h-8 w-8 border rounded flex items-center justify-center text-muted-foreground'>
                        <Volume2 className='h-4 w-4 opacity-30' />
                      </div>
                    )}
                    
                    {word.image_url ? (
                      <Button 
                        size='sm'
                        variant='outline'
                        onClick={() => window.open(word.image_url, '_blank')}
                        className='h-8 w-8 p-0'
                      >
                        <Image className='h-4 w-4' />
                      </Button>
                    ) : (
                      <div className='h-8 w-8 border rounded flex items-center justify-center text-muted-foreground'>
                        <Image className='h-4 w-4 opacity-30' />
                      </div>
                    )}
                  </div>
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