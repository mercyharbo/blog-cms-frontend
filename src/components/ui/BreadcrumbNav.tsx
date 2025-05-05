import { usePathname } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from './breadcrumb'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbNavProps {
  items?: BreadcrumbItem[]
}

export default function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  const pathname = usePathname()

  /**
   * The function `generateBreadcrumbs` takes a pathname, splits it into segments, and generates an array
   * of breadcrumb objects with formatted labels and URLs.
   * @returns The `generateBreadcrumbs` function returns an array of objects, where each object contains
   * a `label` and `href` property. The `label` property is a formatted version of a segment of the
   * pathname, with hyphens replaced by spaces and each word capitalized. The `href` property is a URL
   * constructed from the path segments.
   */
  const generateBreadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(Boolean)

    return pathSegments.map((segment, index) => {
      const url = `/${pathSegments.slice(0, index + 1).join('/')}`

      const label = segment
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      return { label, href: url }
    })
  }

  const breadcrumbItems = items || generateBreadcrumbs()

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <div className='flex items-center'>
          <BreadcrumbItem>
            <BreadcrumbLink href='/'>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </div>

        {breadcrumbItems.map((item, index) => (
          <div key={item.label} className='flex items-center'>
            <BreadcrumbItem>
              {index < breadcrumbItems.length - 1 ? (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              ) : (
                <span className='text-gray-500'>{item.label}</span>
              )}
            </BreadcrumbItem>
            {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
