import { createFileRoute } from '@tanstack/react-router'
import { StrugglingStudents } from '@/features/struggling-students'

export const Route = createFileRoute('/_authenticated/struggling/')({
  component: StrugglingStudents,
})