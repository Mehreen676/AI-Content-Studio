'use client'

import { Badge } from '@/components/ui/badge'

interface ResumeData {
  personalInfo: {
    name: string; email: string; phone: string; location: string;
    linkedin: string; website: string; summary: string;
  }
  experience: Array<{
    company: string; title: string; startDate: string; endDate: string;
    current: boolean; description: string;
  }>
  education: Array<{
    institution: string; degree: string; field: string;
    startDate: string; endDate: string; gpa: string;
  }>
  skills: Array<{ category: string; items: string[] }>
  projects: Array<{ name: string; description: string; url: string; technologies: string }>
  certifications: Array<{ name: string; issuer: string; date: string; url: string }>
  languages: Array<{ name: string; proficiency: string }>
  template: string
}

interface Props {
  data: ResumeData
}

function ProfessionalTemplate({ data }: Props) {
  const { personalInfo: p, experience: exp, education: edu, skills: sk, projects: proj, certifications: cert } = data

  return (
    <div className="bg-white text-gray-900 rounded-lg shadow-lg overflow-hidden" style={{ minHeight: '600px' }}>
      {/* Header */}
      <div className="bg-emerald-800 text-white px-8 py-6">
        <h1 className="text-2xl font-bold">{p.name || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-3 mt-2 text-emerald-100 text-xs">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.linkedin && <span>{p.linkedin}</span>}
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        {p.summary && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-800 border-b border-emerald-200 pb-1 mb-2">Professional Summary</h2>
            <p className="text-xs leading-relaxed text-gray-700">{p.summary}</p>
          </div>
        )}

        {exp.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-800 border-b border-emerald-200 pb-1 mb-3">Experience</h2>
            {exp.map((e, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-semibold">{e.title || 'Position'}</h3>
                    <p className="text-xs text-emerald-700">{e.company || 'Company'}</p>
                  </div>
                  <span className="text-xs text-gray-500">{e.startDate}{e.endDate ? ` — ${e.endDate}` : ''}</span>
                </div>
                {e.description && (
                  <div className="mt-1 text-xs text-gray-600 whitespace-pre-line">{e.description}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {edu.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-800 border-b border-emerald-200 pb-1 mb-3">Education</h2>
            {edu.map((e, i) => (
              <div key={i} className="mb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-semibold">{e.degree || 'Degree'}{e.field ? ` in ${e.field}` : ''}</h3>
                    <p className="text-xs text-emerald-700">{e.institution || 'Institution'}</p>
                  </div>
                  <span className="text-xs text-gray-500">{e.startDate}{e.endDate ? ` — ${e.endDate}` : ''}</span>
                </div>
                {e.gpa && <p className="text-xs text-gray-500">GPA: {e.gpa}</p>}
              </div>
            ))}
          </div>
        )}

        {sk.some(s => s.items.length > 0) && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-800 border-b border-emerald-200 pb-1 mb-2">Skills</h2>
            {sk.map((s, i) => s.items.length > 0 && (
              <div key={i} className="mb-1">
                <span className="text-xs font-medium">{s.category}: </span>
                <span className="text-xs text-gray-600">{s.items.join(', ')}</span>
              </div>
            ))}
          </div>
        )}

        {proj.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-800 border-b border-emerald-200 pb-1 mb-3">Projects</h2>
            {proj.map((pr, i) => (
              <div key={i} className="mb-2">
                <h3 className="text-sm font-semibold">{pr.name || 'Project'}</h3>
                {pr.technologies && <p className="text-xs text-emerald-700">{pr.technologies}</p>}
                {pr.description && <p className="text-xs text-gray-600 mt-0.5">{pr.description}</p>}
              </div>
            ))}
          </div>
        )}

        {cert.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-800 border-b border-emerald-200 pb-1 mb-2">Certifications</h2>
            {cert.map((c, i) => (
              <div key={i} className="mb-1">
                <span className="text-xs font-semibold">{c.name}</span>
                <span className="text-xs text-gray-500"> — {c.issuer}{c.date ? ` (${c.date})` : ''}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ModernTemplate({ data }: Props) {
  const { personalInfo: p, experience: exp, education: edu, skills: sk, projects: proj, certifications: cert } = data

  return (
    <div className="bg-white text-gray-900 rounded-lg shadow-lg overflow-hidden" style={{ minHeight: '600px' }}>
      <div className="flex">
        {/* Sidebar */}
        <div className="w-1/3 bg-teal-700 text-white px-5 py-6 space-y-5">
          <div>
            <h1 className="text-xl font-bold">{p.name || 'Your Name'}</h1>
            {p.summary && <p className="text-xs text-teal-100 mt-2 leading-relaxed">{p.summary}</p>}
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider border-b border-teal-500 pb-1 mb-2">Contact</h2>
            <div className="space-y-1 text-xs text-teal-100">
              {p.email && <p>{p.email}</p>}
              {p.phone && <p>{p.phone}</p>}
              {p.location && <p>{p.location}</p>}
              {p.linkedin && <p>{p.linkedin}</p>}
              {p.website && <p>{p.website}</p>}
            </div>
          </div>

          {sk.some(s => s.items.length > 0) && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-teal-500 pb-1 mb-2">Skills</h2>
              <div className="space-y-2">
                {sk.map((s, i) => s.items.length > 0 && (
                  <div key={i}>
                    <p className="text-xs font-medium text-teal-200">{s.category}</p>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {s.items.map((item, j) => (
                        <span key={j} className="text-xs bg-teal-600 px-1.5 py-0.5 rounded">{item}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {cert.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-teal-500 pb-1 mb-2">Certifications</h2>
              {cert.map((c, i) => (
                <div key={i} className="mb-1">
                  <p className="text-xs font-medium">{c.name}</p>
                  <p className="text-xs text-teal-200">{c.issuer}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="w-2/3 px-6 py-6 space-y-5">
          {exp.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-teal-700 border-b border-teal-200 pb-1 mb-3">Experience</h2>
              {exp.map((e, i) => (
                <div key={i} className="mb-3">
                  <h3 className="text-sm font-semibold">{e.title || 'Position'}</h3>
                  <p className="text-xs text-teal-600">{e.company || 'Company'} | {e.startDate}{e.endDate ? ` — ${e.endDate}` : ''}</p>
                  {e.description && <p className="text-xs text-gray-600 mt-1 whitespace-pre-line">{e.description}</p>}
                </div>
              ))}
            </div>
          )}

          {edu.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-teal-700 border-b border-teal-200 pb-1 mb-3">Education</h2>
              {edu.map((e, i) => (
                <div key={i} className="mb-2">
                  <h3 className="text-sm font-semibold">{e.degree || 'Degree'}{e.field ? ` in ${e.field}` : ''}</h3>
                  <p className="text-xs text-teal-600">{e.institution || 'Institution'} | {e.startDate}{e.endDate ? ` — ${e.endDate}` : ''}</p>
                  {e.gpa && <p className="text-xs text-gray-500">GPA: {e.gpa}</p>}
                </div>
              ))}
            </div>
          )}

          {proj.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-teal-700 border-b border-teal-200 pb-1 mb-3">Projects</h2>
              {proj.map((pr, i) => (
                <div key={i} className="mb-2">
                  <h3 className="text-sm font-semibold">{pr.name || 'Project'}</h3>
                  {pr.technologies && <div className="flex flex-wrap gap-1 mt-0.5">{pr.technologies.split(',').map((t, j) => <Badge key={j} variant="secondary" className="text-xs">{t.trim()}</Badge>)}</div>}
                  {pr.description && <p className="text-xs text-gray-600 mt-0.5">{pr.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MinimalTemplate({ data }: Props) {
  const { personalInfo: p, experience: exp, education: edu, skills: sk, projects: proj } = data

  return (
    <div className="bg-white text-gray-900 rounded-lg shadow-lg px-10 py-8 space-y-6" style={{ minHeight: '600px' }}>
      <div className="text-center border-b border-gray-200 pb-5">
        <h1 className="text-3xl font-light tracking-wide">{p.name || 'Your Name'}</h1>
        <div className="flex justify-center flex-wrap gap-3 mt-2 text-xs text-gray-500">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
        </div>
      </div>

      {p.summary && (
        <p className="text-sm text-gray-600 leading-relaxed text-center">{p.summary}</p>
      )}

      {exp.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Experience</h2>
          {exp.map((e, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between">
                <h3 className="text-sm font-medium">{e.title || 'Position'}</h3>
                <span className="text-xs text-gray-400">{e.startDate}{e.endDate ? ` — ${e.endDate}` : ''}</span>
              </div>
              <p className="text-xs text-gray-500">{e.company || 'Company'}</p>
              {e.description && <p className="text-xs text-gray-600 mt-1 whitespace-pre-line">{e.description}</p>}
            </div>
          ))}
        </div>
      )}

      {edu.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Education</h2>
          {edu.map((e, i) => (
            <div key={i} className="mb-2">
              <div className="flex justify-between">
                <h3 className="text-sm font-medium">{e.degree || 'Degree'}{e.field ? `, ${e.field}` : ''}</h3>
                <span className="text-xs text-gray-400">{e.startDate}{e.endDate ? ` — ${e.endDate}` : ''}</span>
              </div>
              <p className="text-xs text-gray-500">{e.institution || 'Institution'}</p>
            </div>
          ))}
        </div>
      )}

      {sk.some(s => s.items.length > 0) && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Skills</h2>
          <p className="text-sm text-gray-600">{sk.flatMap(s => s.items).join('  •  ')}</p>
        </div>
      )}

      {proj.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Projects</h2>
          {proj.map((pr, i) => (
            <div key={i} className="mb-2">
              <h3 className="text-sm font-medium">{pr.name || 'Project'}</h3>
              {pr.technologies && <p className="text-xs text-gray-400">{pr.technologies}</p>}
              {pr.description && <p className="text-xs text-gray-600 mt-0.5">{pr.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ResumePreview({ data }: Props) {
  const templateMap: Record<string, React.FC<Props>> = {
    professional: ProfessionalTemplate,
    modern: ModernTemplate,
    minimal: MinimalTemplate,
  }

  const Template = templateMap[data.template] || ProfessionalTemplate

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-muted-foreground">Live Preview</h3>
        <Badge variant="secondary" className="capitalize text-xs">{data.template}</Badge>
      </div>
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="scale-[0.6] origin-top-left w-[166.67%]">
          <Template data={data} />
        </div>
      </div>
    </div>
  )
}
