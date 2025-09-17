import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import React from 'react'
import { Droplets } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ReportsTable } from '@/components/reports-table'


const page = () => {
    return (
        <>
            <header className="bg-white/90 backdrop-blur-sm shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Droplets className="h-8 w-8 text-blue-600 mr-3" />
                            <h1 className="text-xl font-bold text-gray-900">SPARK</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="/education">
                                <Button variant="ghost">Education</Button>
                            </Link>
                            <Link href="/news">
                                <Button variant="ghost">News</Button>
                            </Link>
                            <Link href="/report">
                                <Button variant="ghost">Report Issue</Button>
                            </Link>
                            <Link href="/sign-in">
                                <Button variant="ghost">Sign In</Button>
                            </Link>
                            <Link href="/sign-up">
                                <Button>Get Started</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>
            <MaxWidthWrapper className='py-10'>
                <ReportsTable/>
            </MaxWidthWrapper>
        </>
    )
}

export default page