"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  GraduationCap,
  Home,
  LogIn,
  Droplets,
  Shield,
  HandHeart,
  AudioLines,
  Brain,
  ChevronRight,
  Play,
  Volume2,
  Users,
  Quote,
  Heart
} from "lucide-react"
import Link from "next/link"

// Education categories with icons and descriptions
const educationCategories = [
  {
    id: "water-diseases",
    title: "Water-borne Diseases",
    description: "Learn about cholera, typhoid, diarrhea and prevention methods",
    icon: Droplets,
    color: "bg-blue-50 border-blue-200",
    iconColor: "text-blue-600",
    articles: 8
  },
  {
    id: "hygiene-sanitation", 
    title: "Hygiene & Sanitation",
    description: "Handwashing techniques and safe food handling practices",
    icon: HandHeart,
    color: "bg-green-50 border-green-200",
    iconColor: "text-green-600",
    articles: 6
  },
  {
    id: "safe-water",
    title: "Safe Water Practices",
    description: "Boiling, chlorination, and proper water storage methods",
    icon: Shield,
    color: "bg-purple-50 border-purple-200",
    iconColor: "text-purple-600",
    articles: 5
  },
  {
    id: "community-stories",
    title: "Community Stories",
    description: "Real experiences from communities and health workers",
    icon: Users,
    color: "bg-orange-50 border-orange-200",
    iconColor: "text-orange-600",
    articles: 12
  },
  {
    id: "audio-testimonials",
    title: "Audio Clips & Testimonials",
    description: "Listen to community worker experiences and testimonials",
    icon: AudioLines,
    color: "bg-pink-50 border-pink-200",
    iconColor: "text-pink-600",
    articles: 4
  },
  {
    id: "preventive-measures",
    title: "Preventive Measures",
    description: "Essential practices to prevent waterborne illness outbreaks",
    icon: Brain,
    color: "bg-indigo-50 border-indigo-200",
    iconColor: "text-indigo-600",
    articles: 7
  }
]

// Featured stories data
const featuredStories = [
  {
    id: 1,
    title: "The Village That Transformed Its Water",
    excerpt: "How Jalpur village reduced waterborne diseases by 80% through community education",
    readTime: "5 min read",
    category: "Community Stories",
    image: "/api/placeholder/400/200"
  },
  {
    id: 2,
    title: "ASHA Worker&apos;s Prevention Success",
    excerpt: "Priya's innovative approach to teaching water safety in rural communities",
    readTime: "3 min read",
    category: "Community Stories",
    image: "/api/placeholder/400/200"
  },
  {
    id: 3,
    title: "Simple Water Testing Saves Lives",
    excerpt: "Learn how basic pH testing helped prevent a cholera outbreak",
    readTime: "4 min read",
    category: "Safe Water Practices",
    image: "/api/placeholder/400/200"
  }
]

export default function EducationHomePage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCategories = educationCategories.filter(category => 
    category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
                <Home className="w-5 h-5" />
                <span className="font-medium">Home</span>
              </Link>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">Education Hub</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="/news">
                <Button variant="outline" size="sm">
                  News
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Banner */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-2xl p-12 mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Learn. Prevent. Stay Healthy.
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Access comprehensive educational resources about water quality, hygiene, and community health
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search health topics, practices, and stories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-3 text-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Learning Categories</h2>
            <Badge variant="outline" className="text-sm">
              {filteredCategories.length} categories available
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => {
              const IconComponent = category.icon
              return (
                <Link
                  key={category.id}
                  href={`/education/${category.id}`}
                  className="group"
                >
                  <Card className={`${category.color} border-2 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer h-full`}>
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className={`p-3 rounded-lg bg-white shadow-sm ${category.iconColor}`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      </div>
                      <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                        {category.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {category.articles} articles
                        </Badge>
                        <span className="text-sm text-blue-600 font-medium group-hover:text-blue-700">
                          Explore →
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Featured Stories Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Stories</h2>
            <Link href="/education/community-stories">
              <Button variant="outline" className="flex items-center gap-2">
                View All Stories
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredStories.map((story) => (
              <Link
                key={story.id}
                href={`/education/story/${story.id}`}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                    <Heart className="w-12 h-12 text-blue-600" />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {story.category}
                      </Badge>
                      <span className="text-xs text-gray-500">{story.readTime}</span>
                    </div>
                    <CardTitle className="text-lg group-hover:text-blue-700 transition-colors">
                      {story.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {story.excerpt}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Audio Testimonials Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Audio Testimonials</h2>
            <Link href="/education/audio-testimonials">
              <Button variant="outline" className="flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                Listen to All
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-600 text-white rounded-full">
                    <AudioLines className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      ASHA Worker&apos;s Prevention Experience
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Sunita shares how early detection prevented a waterborne disease outbreak in her village.
                    </p>
                    <div className="flex items-center gap-3">
                      <Button size="sm" className="flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Play Audio
                      </Button>
                      <span className="text-xs text-gray-500">3:24</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-600 text-white rounded-full">
                    <Quote className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Community Health Success Story
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Dr. Kumar explains how water quality testing transformed community health outcomes.
                    </p>
                    <div className="flex items-center gap-3">
                      <Button size="sm" className="flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Play Audio
                      </Button>
                      <span className="text-xs text-gray-500">5:12</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white rounded-2xl p-8 border border-gray-200">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-gray-600 mb-6">
              Join thousands of community health workers using these resources to prevent waterborne diseases and promote better health practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/education/preventive-measures">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Learning
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Join Community
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
