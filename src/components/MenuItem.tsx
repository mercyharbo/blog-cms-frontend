import React from 'react'

interface MenuItemProps {
  label: string
  link: string
}

const MenuItem: React.FC<MenuItemProps> = ({ label, link }) => {
  return (
    <li>
      <a href={link}>{label}</a>
    </li>
  )
}

export default MenuItem
