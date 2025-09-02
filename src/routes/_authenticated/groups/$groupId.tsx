import { createFileRoute } from '@tanstack/react-router'
import { GroupDetail } from '@/features/group-detail'

export const Route = createFileRoute('/_authenticated/groups/$groupId')({
  component: GroupDetail,
})