'use client'
import React, { useState } from 'react'
import MaxWidthWrapper from './MaxWidthWrapper'
import Link from 'next/link'
import { Button } from './ui/button'
import { Menu, X, GraduationCap, Newspaper, Phone } from 'lucide-react'

interface NavbarProps {
  overlay?: boolean
  className?: string
}

const Navbar: React.FC<NavbarProps> = ({ overlay = false, className = '' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const overlayStyles = overlay 
    ? 'fixed top-0 left-0 w-full z-20 pt-4' 
    : 'sticky top-0 mt-4'
  
  const navStyles = overlay
    ? 'rounded-full py-2 px-4 flex backdrop-blur-3xl border border-gray-300/30 bg-white/20 shadow-xl justify-between items-center '
    : 'rounded-full py-2 px-4 flex backdrop-blur-3xl border border-gray-300/20 shadow-xl justify-between items-center '
  
  const textStyles = overlay ? 'text-gray-900' : 'text-gray-900'
  const buttonStyles = overlay ? 'text-gray-900 hover:bg-white/20 hover:text-gray-900 hover:font-semibold hover:cursor-pointer' : ''
  const ctaButtonStyles = overlay 
    ? 'rounded-full bg-blue-600 hover:bg-blue-700 text-gray-900 text-white hover:cursor-pointer'
    : 'rounded-full'
  
  const mobileMenuStyles = overlay 
    ? 'md:hidden mt-2 rounded-lg bg-black/80 backdrop-blur-md border border-gray-300/30'
    : 'md:hidden mt-2 rounded-lg bg-white/90 backdrop-blur-sm border border-gray-300/20'
  
  const mobileButtonStyles = overlay 
    ? 'w-full justify-start text-white hover:bg-white/20'
    : 'w-full justify-start'

  return (
    <div className={`${overlayStyles} ${className}`}>
      <MaxWidthWrapper>
        <nav className={navStyles}>
          <div className="flex items-center">
            
            <h1 className={`text-xl font-bold ${textStyles}`}>JalRakshak</h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 ">
            <Link href="/education" className='cursor-pointer'>
              <Button variant="ghost" className={buttonStyles}>Education</Button>
            </Link>
            <Link href="/news" className='cursor-pointer'>
              <Button variant="ghost" className={buttonStyles}>News</Button>
            </Link>
            <Link href="/report" className='cursor-pointer'>
              <Button variant="ghost" className={buttonStyles}>Report Issue</Button>
            </Link>
            <Link href="/sign-in" className='cursor-pointer'>
              <Button variant="ghost" className={buttonStyles}>Sign In</Button>
            </Link>
            <Link href="/sign-up" className='cursor-pointer'>
              <Button className={ctaButtonStyles}>Get Started</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              className={overlay ? 'text-white hover:bg-white/20' : ''}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className={mobileMenuStyles}>
            <div className="px-4 pt-2 pb-3 space-y-1">
              <Link href="/education" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className={mobileButtonStyles}>
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Education
                </Button>
              </Link>
              <Link href="/news" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className={mobileButtonStyles}>
                  <Newspaper className="h-4 w-4 mr-2" />
                  News
                </Button>
              </Link>
              <Link href="/report" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className={mobileButtonStyles}>
                  <Phone className="h-4 w-4 mr-2" />
                  Report Issue
                </Button>
              </Link>
              <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className={mobileButtonStyles}>
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                <Button className={`w-full ${overlay ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}>
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </MaxWidthWrapper>
    </div>
  )
}

export default Navbar