import { X } from "lucide-react"

interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  className?: string
}

export function Dialog({ open, onClose, title, children, className }: DialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative border-2 border-white/20 rounded-2xl p-6 max-w-lg w-full mx-4 animate-in ${className || 'bg-[#111]'}`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div className="text-gray-300">{children}</div>
      </div>
    </div>
  )
}