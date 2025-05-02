import Image from 'next/image'
import React from 'react'

interface LogoProps {
  size?: number
  alt?: string
}

const Logo: React.FC<LogoProps> = ({ size = 100, alt = 'Logo' }) => {
  return (
    <div>
      <Image
        src='/path/to/logo.png'
        alt={alt}
        style={{ width: size, height: size }}
      />
    </div>
  )
}

export default Logo
