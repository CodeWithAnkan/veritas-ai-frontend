import { labelMeta } from '../../lib/utils.js'

export default function AlertBadge({ label, size = 'sm' }) {
  const meta = labelMeta(label)
  const padding = size === 'xs' ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-0.5 text-[10px]'

  return (
    <span className={`font-mono tracking-[0.5px] border
                      ${meta.color} ${meta.bg} ${meta.border} ${padding}`}>
      {meta.text}
    </span>
  )
}