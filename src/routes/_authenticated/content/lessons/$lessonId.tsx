import { createFileRoute } from '@tanstack/react-router'
import { LessonWords } from '@/features/content/lesson-words'

export const Route = createFileRoute('/_authenticated/content/lessons/$lessonId')({
  component: LessonWords,
})