import { createFileRoute } from '@tanstack/react-router'
import { CourseDetail } from '@/features/content/course-detail'

export const Route = createFileRoute('/_authenticated/content/courses/$courseId')({
  component: CourseDetail,
})