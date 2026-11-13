import { useState } from 'react'
import Section from '../common/Section'
import EmptyState from '../common/EmptyState'
import ProjectCard from '../projects/ProjectCard'
import ProjectDetail from '../projects/ProjectDetail'
import { useContent } from '../../context/PreviewContext'
import { projectStatuses } from '../../data/projects'

export default function Projects() {
  const { projects } = useContent()
  const [status, setStatus] = useState('all')
  const [selected, setSelected] = useState(null)
  const visible = projects.filter((p) => status === 'all' || p.status === status)

  return (
    <Section
      id="projects"
      tone="tint"
      eyebrow="Research Projects"
      title="Projects and investigations"
      intro="Ongoing, completed and planned research, with objectives, methods, collaborators and outcomes."
    >
      {projects.length === 0 ? (
        <EmptyState title="No projects yet" message="Research projects will be shown here once they are confirmed and added." />
      ) : (
        <>
          <div role="group" aria-label="Filter projects by status" className="mb-8 flex flex-wrap gap-2">
            {[{ id: 'all', label: 'All' }, ...projectStatuses].map((s) => {
              const active = status === s.id
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setStatus(s.id)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                    active ? 'border-transparent bg-primary text-on-primary' : 'border-line bg-surface text-ink hover:border-gold'
                  }`}
                >
                  {s.label}
                </button>
              )
            })}
          </div>
          {visible.length === 0 ? (
            <EmptyState compact message="No projects with this status yet." />
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((p) => (
                <li key={p.id}><ProjectCard project={p} onOpen={setSelected} /></li>
              ))}
            </ul>
          )}
        </>
      )}
      <ProjectDetail project={selected} onClose={() => setSelected(null)} />
    </Section>
  )
}
