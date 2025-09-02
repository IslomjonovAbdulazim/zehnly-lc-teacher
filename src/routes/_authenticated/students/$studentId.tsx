import { createFileRoute } from '@tanstack/react-router'
import { StudentProgress } from '@/features/student-progress'

export const Route = createFileRoute('/_authenticated/students/$studentId')({
  component: StudentProgress,
})