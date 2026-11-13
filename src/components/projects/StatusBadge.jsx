import Badge from '../common/Badge'
import { projectStatuses } from '../../data/projects'

const tones = { ongoing: 'gold', completed: 'sage', planned: 'outline' }

export default function StatusBadge({ status }) {
  const label = projectStatuses.find((s) => s.id === status)?.label ?? status
  return <Badge tone={tones[status] ?? 'neutral'}>{label}</Badge>
}
