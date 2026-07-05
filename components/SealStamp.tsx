'use client'

interface SealStampProps {
  text?: string
  className?: string
}

export default function SealStamp({ 
  text = '墨韵', 
  className = '' 
}: SealStampProps) {
  return (
    <div 
      className={`seal-stamp w-16 h-16 flex flex-col items-center justify-center ${className}`}
      style={{ 
        fontFamily: 'Georgia, SimSun, serif',
        fontSize: '14px',
        fontWeight: 'bold',
        letterSpacing: '2px',
      }}
    >
      {text.split('').map((char, idx) => (
        <span key={idx}>{char}</span>
      ))}
    </div>
  )
}
