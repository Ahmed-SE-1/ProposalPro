'use client'

interface SkillPillsProps {
  selected: string[]
  onSelect: (skill: string) => void
}

const SKILLS = [
  'Web Dev', 'Design', 'Writing', 'Mobile',
  'SEO', 'Video', 'VA', 'Python/AI',
]

export default function SkillPills({ selected, onSelect }: SkillPillsProps) {
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {SKILLS.map((skill) => (
          <button
            key={skill}
            type="button"
            onClick={() => onSelect(skill)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
              selected.includes(skill)
                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                : 'bg-white text-[#1A1A1A] border-[#E5E7EB] hover:border-[#1A1A1A]'
            }`}
          >
            {skill}
          </button>
        ))}
      </div>
      {selected.length > 0 && (
        <p className="text-xs text-[#6B7280] mt-2">
          ✓ Selected: {selected.join(', ')}
        </p>
      )}
    </div>
  )
}