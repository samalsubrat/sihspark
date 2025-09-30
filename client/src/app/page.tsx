"use client"
import AudienceSwitcherCard from '@/components/accordian-card'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Droplets, Globe, GraduationCap, Newspaper, Phone, Shield, Users } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import React, { useState } from 'react'
import ChatbotOverlay from "@/components/chatbot-overlay"

const items = [
    {
        id: "citizens",
        eyebrow: "Smart Water Surveillance.",
        heading: "Citizens",
        title: "For Citizens",
        description:
            "Stay informed about your local water quality with easy-to-understand scores and alerts. Empower your community with real-time transparency and cleaner surroundings.",
        ctaLabel: "For citizens",
        ctaHref: "#citizens",
        imageSrc: "https://uk.clipper.madriver.app/app/uploads/2019/03/what-is-assam-tea-desktop-1200x600.jpg",
        imageAlt: "Residents checking water cleanliness report on a phone.",
    },
    {
        id: "municipalities",
        eyebrow: "Smart Water Surveillance.",
        heading: "Municipalities",
        title: "For Municipalities",
        description:
            "Get actionable insights on water cleanliness levels across locations. Identify problem areas early, optimize cleaning schedules, and build citizen trust through data-driven transparency.",
        ctaLabel: "For municipalities",
        ctaHref: "#municipalities",
        imageSrc: "https://images.pexels.com/photos/32903195/pexels-photo-32903195.jpeg",
        imageAlt: "City officials reviewing cleanliness data on a dashboard.",
    },
    {
        id: "govt",
        eyebrow: "Smart Water Surveillance.",
        heading: "Government Agencies",
        title: "For Government Agencies",
        description:
            "Ensure compliance, track environmental KPIs, and monitor cleanliness initiatives at scale. Use AI-powered reports to strengthen accountability and policy impact.",
        ctaLabel: "For agencies",
        ctaHref: "#govt",
        imageSrc: "https://media.licdn.com/dms/image/v2/D4D12AQEQ6VKAeWoGnw/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1669295927898?e=2147483647&v=beta&t=MDhK_boLOWdzB8fEcioYI1j8dtjJTLfcoxcMaVS0ZS8",
        imageAlt: "Government agency team reviewing reports in a meeting.",
    },
    {
        id: "ngos",
        eyebrow: "Smart Water Surveillance.",
        heading: "NGOs & Communities",
        title: "For NGOs & Communities",
        description:
            "Collaborate with local authorities and citizens to raise awareness, track improvements, and advocate for cleaner, safer public spaces.",
        ctaLabel: "For NGOs",
        ctaHref: "#ngos",
        imageSrc: "https://aif.org/wp-content/uploads/2017/12/ASHA-Mansi.jpg",
        imageAlt: "Community volunteers working near a water body.",
    },
];


const HomePage = () => {
    const [activeMetric, setActiveMetric] = useState('turbidity')

    const metrics = [
        { id: 'oxygen', label: 'O₂ Level', value: '8.5 mg/L' },
        { id: 'ph', label: 'pH Level', value: '7.2' },
        { id: 'turbidity', label: 'Turbidity', value: '15 NTU' },
        { id: 'tds', label: 'TDS Level', value: '120 ppm' }
    ]
    return (
        <>
            <Navbar overlay={true} />
            <div className="relative h-screen overflow-hidden">
                {/* Background Video */}
                <video
                    className="absolute top-0 left-0 w-full h-full object-cover z-0"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    controls={false}
                >
                    <source src="/bg.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                {/* Overlay Navbar */}


                {/* Content Overlay */}
                <MaxWidthWrapper className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black/30 z-10">
                    <div className="text-center text-white">
                        <h1 className="text-5xl md:text-6xl font-bold mb-4">Welcome to JalRakshak</h1>
                        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
                            Protecting India&apos;s water resources through technology and community action
                        </p>
                        <Link href="/sign-up">
                            <Button size="lg" className="text-lg px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-full hover:cursor-pointer">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </MaxWidthWrapper>
            </div>

            <MaxWidthWrapper className='py-10 md:py-20 bg-gray-100'>
                <h3 className='text-center text-blue-700 pb-2'>Our Solution</h3>
                <h1 className='text-center text-2xl md:text-3xl font-medium pb-20'>We connect communities, clean water initiatives & local leaders<br /> ensuring every family gains safe water, protecting health and dignity</h1>

                <AudienceSwitcherCard items={items} className='shadow-lg' />
            </MaxWidthWrapper>

            <MaxWidthWrapper className='py-10 md:py-20'>
                {/* Anytime Anywhere Section */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Anytime Anywhere
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Monitor water quality and health indicators wherever you are, whenever you need
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Card 1 - Daily Monitoring */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="aspect-[4/3] bg-gradient-to-br from-blue-100 to-blue-200">
                            <Image
                                src="https://images.pexels.com/photos/33684068/pexels-photo-33684068.jpeg"
                                alt="People monitoring water quality daily"
                                className="w-full h-full object-cover"
                                width={400}
                                height={300}
                            />
                        </div>
                        <div className="p-6 text-center">
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Being healthy is becoming increasingly challenging day by day
                            </h3>
                            <Button
                                variant="outline"
                                className="mt-4 text-blue-600 border-blue-600 hover:bg-blue-50 rounded-full"
                            >
                                Start with JalRakshak
                            </Button>
                        </div>
                    </div>

                    {/* Card 2 - Personalized Health */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="aspect-[4/3] bg-gradient-to-br from-orange-100 to-orange-200">
                            <Image
                                src="/lake-with-algae.jpg"
                                alt="Personalized water quality assessment"
                                className="w-full h-full object-cover"
                                width={400}
                                height={300}
                            />
                        </div>
                        <div className="p-6 text-center">
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Personalized healthcare can be inaccessible and expensive
                            </h3>
                            <Button
                                variant="outline"
                                className="mt-4 text-orange-600 border-orange-600 hover:bg-orange-50 rounded-full"
                            >
                                Track with JalRakshak
                            </Button>
                        </div>
                    </div>

                    {/* Card 3 - Community Support */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="aspect-[4/3] bg-gradient-to-br from-green-100 to-green-200">
                            <Image
                                src="https://images.pexels.com/photos/14039659/pexels-photo-14039659.jpeg"
                                alt="Community supporting water quality initiatives"
                                className="w-full h-full object-cover"
                                width={400}
                                height={300}
                            />
                        </div>
                        <div className="p-6 text-center">
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Everyone deserves the support they need to succeed
                            </h3>
                            <Button
                                variant="outline"
                                className="mt-4 text-green-600 border-green-600 hover:bg-green-50 rounded-full"
                            >
                                Grow with JalRakshak
                            </Button>
                        </div>
                    </div>
                </div>
            </MaxWidthWrapper>

            {/* Best-in-class Technology Section */}
            <div className="bg-gray-100 py-16 md:py-24">
                <MaxWidthWrapper>
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="order-2 lg:order-1">
                            <div className="mb-4">
                                <span className="text-blue-600 font-medium text-sm uppercase tracking-wide">
                                    Water Quality Monitoring
                                </span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                Best-in-class technology
                            </h2>

                            <div className="space-y-6 mb-8">
                                <div>
                                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                                        Let&apos;s bring water safety home
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        We coordinate with best-in-class water testing laboratories to
                                        ensure your water is delivered with accuracy, speed, and
                                        exceptional service.
                                    </p>
                                </div>

                                <p className="text-gray-600 leading-relaxed">
                                    Our solution powers the water quality industry by improving
                                    patient outcomes, saving providers time, and delivering high-
                                    quality care.
                                </p>
                            </div>

                            <Button className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-full text-lg">
                                Get Service
                            </Button>
                        </div>

                        {/* Right Content - Phone Mockup */}
                        <div className="order-1 lg:order-2 flex justify-center">
                            <div className="relative">
                                {/* Phone Frame */}
                                <div className="relative w-80 h-[600px] bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 rounded-[3rem] p-2 shadow-2xl">
                                    {/* Screen */}
                                    <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                                        {/* Status Bar */}
                                        <div className="flex justify-between items-center px-6 py-3 bg-white">
                                            <span className="text-xs font-medium">9:41</span>
                                            <div className="w-6 h-3 bg-black rounded-full"></div>
                                            <div className="flex gap-1">
                                                <div className="w-1 h-1 bg-black rounded-full"></div>
                                                <div className="w-1 h-1 bg-black rounded-full"></div>
                                                <div className="w-1 h-1 bg-black rounded-full"></div>
                                                <div className="w-4 h-2 border border-black rounded-sm"></div>
                                            </div>
                                        </div>

                                        {/* App Content */}
                                        <div className="px-6 py-4">
                                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                                Water Quality Assessment
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-6">
                                                Monitor water data helps the doctor customize
                                                your treatment and ensure proper care.
                                            </p>

                                            {/* Metrics Grid */}
                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                {metrics.map((metric) => (
                                                    <button
                                                        key={metric.id}
                                                        onClick={() => setActiveMetric(metric.id)}
                                                        className={`p-4 rounded-xl text-center transition-all duration-300 cursor-pointer ${activeMetric === metric.id
                                                            ? 'bg-blue-100 border-2 border-blue-300'
                                                            : 'bg-gray-50 hover:bg-gray-100'
                                                            }`}
                                                    >
                                                        <div className={`w-8 h-8 rounded-full mx-auto mb-2 ${activeMetric === metric.id
                                                            ? 'bg-blue-600'
                                                            : 'bg-gray-300'
                                                            }`}></div>
                                                        <div className={`text-xs font-medium ${activeMetric === metric.id
                                                            ? 'text-blue-700'
                                                            : 'text-gray-600'
                                                            }`}>
                                                            {metric.label}
                                                        </div>
                                                        {activeMetric === metric.id && (
                                                            <div className="text-xs text-blue-600 mt-1 font-semibold">
                                                                {metric.value}
                                                            </div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-3">
                                                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full py-3">
                                                    Test +
                                                </Button>
                                                <Button variant="outline" className="flex-1 border-gray-300 rounded-full py-3">
                                                    Report -
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </MaxWidthWrapper>
            </div>

            <section className="py-20 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Everything You Need for Water Quality Management
                        </h2>
                        <p className="text-lg text-gray-600">
                            Comprehensive tools for monitoring, testing, and reporting water quality data
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <Card className="bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <BarChart3 className="h-6 w-6 text-blue-600 mr-3" />
                                    Real-time Analytics
                                </CardTitle>
                                <CardDescription>
                                    Monitor water quality parameters in real-time with interactive dashboards
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li>• Live pH and turbidity monitoring</li>
                                    <li>• Chemical contamination tracking</li>
                                    <li>• Historical trend analysis</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Shield className="h-6 w-6 text-green-600 mr-3" />
                                    Smart Alerts
                                </CardTitle>
                                <CardDescription>
                                    Intelligent notification system for water quality issues
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li>• Automated quality alerts</li>
                                    <li>• Emergency notifications</li>
                                    <li>• Scheduled testing reminders</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Users className="h-6 w-6 text-purple-600 mr-3" />
                                    Role Management
                                </CardTitle>
                                <CardDescription>
                                    Organize teams with role-based access control
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li>• ASHA worker access</li>
                                    <li>• Community leader tools</li>
                                    <li>• Admin oversight controls</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Globe className="h-6 w-6 text-cyan-600 mr-3" />
                                    Multi-location Support
                                </CardTitle>
                                <CardDescription>
                                    Manage water quality across multiple locations
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li>• Geographic mapping</li>
                                    <li>• Location-based reports</li>
                                    <li>• Regional comparisons</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Droplets className="h-6 w-6 text-blue-500 mr-3" />
                                    Testing Integration
                                </CardTitle>
                                <CardDescription>
                                    Seamless integration with testing equipment
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li>• Digital test kit support</li>
                                    <li>• Automated data entry</li>
                                    <li>• Quality validation</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Newspaper className="h-6 w-6 text-indigo-600 mr-3" />
                                    Health News & Updates
                                </CardTitle>
                                <CardDescription>
                                    Stay informed with latest health news and community updates
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li>• Breaking health alerts</li>
                                    <li>• Community success stories</li>
                                    <li>• Research updates</li>
                                </ul>
                                <Link href="/news" className="block mt-4">
                                    <Button variant="outline" size="sm" className="w-full">
                                        Read Latest News
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <GraduationCap className="h-6 w-6 text-indigo-600 mr-3" />
                                    Education Hub
                                </CardTitle>
                                <CardDescription>
                                    Learn about water quality through interactive content
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li>• Educational playbooks</li>
                                    <li>• Inspiring stories</li>
                                    <li>• Community testimonials</li>
                                </ul>
                                <Link href="/education" className="block mt-4">
                                    <Button variant="outline" size="sm" className="w-full">
                                        Explore Learning
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Phone className="h-6 w-6 text-green-500 mr-3" />
                                    Community Reporting
                                </CardTitle>
                                <CardDescription>
                                    Help your community by reporting water quality issues
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li>• Anonymous issue reporting</li>
                                    <li>• Community water monitoring</li>
                                    <li>• Quick reporting process</li>
                                </ul>
                                <Link href="/report" className="block mt-4">
                                    <Button variant="outline" size="sm" className="w-full">
                                        Report Water Issue
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            <div className="relative h-screen overflow-hidden">
                {/* Background Video */}
                <video
                    className="absolute top-0 left-0 w-full h-full object-cover z-0"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    controls={false}
                >
                    <source src="/bg.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                {/* Overlay Navbar */}


                {/* Content Overlay */}
                <MaxWidthWrapper className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black/30 z-10">
                    <div className="text-center text-white">
                        <h1 className="text-5xl md:text-6xl font-bold mb-4">Find the support you need to heal</h1>
                        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
                            Protecting India&apos;s water resources through technology and community action
                        </p>
                        <Link href="/sign-up">
                            <Button size="lg" className="text-lg px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-full hover:cursor-pointer">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </MaxWidthWrapper>
            </div>
            <footer className="bg-white/90 backdrop-blur-sm border-t">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center mb-4 md:mb-0">
                            <Droplets className="h-6 w-6 text-blue-600 mr-2" />
                            <span className="font-semibold text-gray-900">SPARK</span>
                        </div>
                        <div className="text-sm text-gray-600">
                            © 2025 SPARK. Water Quality Monitoring System.
                        </div>
                    </div>
                </div>
            </footer>

            <ChatbotOverlay />
        </>
    )
}

export default HomePage