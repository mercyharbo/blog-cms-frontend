import SignupPage from '@/components/signup'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up | CMS Platform',
  description:
    'Create an account to start managing your content with our powerful CMS platform',
  keywords: ['CMS', 'content management', 'signup', 'register'],
  openGraph: {
    title: 'Sign Up | CMS Platform',
    description:
      'Create an account to start managing your content with our powerful CMS platform',
    type: 'website',
    locale: 'en_US',
    siteName: 'CMS Platform',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function Page() {
  return <SignupPage />
}
