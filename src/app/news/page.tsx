"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  Calendar,
  User,
  Eye,
  Heart,
  MessageCircle,
  Bookmark,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Home,
  Newspaper,
  Filter,
  ArrowRight
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

// News categories
const newsCategories = [
  { id: "all", label: "All News", count: 24 },
  { id: "health-alerts", label: "Health Alerts", count: 8 },
  { id: "community-success", label: "Community Success", count: 6 },
  { id: "research-updates", label: "Research Updates", count: 5 },
  { id: "policy-changes", label: "Policy Changes", count: 3 },
  { id: "educational-content", label: "Educational Content", count: 2 }
]

// Featured news data
const featuredNews = [
  {
    id: 1,
    title: "Major Waterborne Disease Outbreak Prevented in Rural Bihar",
    excerpt: "Quick action by ASHA workers and community leaders prevented a potential cholera outbreak affecting over 5,000 residents.",
    content: "In a remarkable display of community health preparedness, the village of Madhubani successfully prevented what could have been a devastating cholera outbreak...",
    category: "health-alerts",
    categoryLabel: "Health Alert",
    author: "Dr. Priya Sharma",
    publishedDate: "2025-01-10",
    readTime: "4 min read",
    views: 1247,
    likes: 89,
    comments: 23,
    isBreaking: true,
    tags: ["cholera", "prevention", "bihar", "asha-workers"]
  },
  {
    id: 2,
    title: "New AI-Powered Water Quality Testing Shows 95% Accuracy",
    excerpt: "Revolutionary testing technology deployed across 200 villages shows remarkable success in early disease detection.",
    content: "A groundbreaking AI-powered water quality testing system has demonstrated 95% accuracy in detecting harmful pathogens...",
    category: "research-updates", 
    categoryLabel: "Research Update",
    author: "Engineer Rajesh Kumar",
    publishedDate: "2025-01-09",
    readTime: "6 min read",
    views: 892,
    likes: 156,
    comments: 34,
    isBreaking: false,
    tags: ["ai", "water-testing", "technology", "accuracy"]
  },
  {
    id: 3,
    title: "Community-Led Water Safety Program Reduces Child Mortality by 60%",
    excerpt: "Three-year program in Odisha demonstrates the power of grassroots education and community involvement.",
    content: "A comprehensive community-led water safety program implemented across 50 villages in Odisha has achieved remarkable results...",
    category: "community-success",
    categoryLabel: "Community Success", 
    author: "Social Worker Meera Patel",
    publishedDate: "2025-01-08",
    readTime: "5 min read",
    views: 2156,
    likes: 278,
    comments: 67,
    isBreaking: false,
    tags: ["community", "child-health", "odisha", "mortality-reduction"]
  },
  {
    id: 4,
    title: "Government Launches National Water Quality Monitoring Initiative",
    excerpt: "New policy mandates real-time water quality monitoring in all villages with population over 1,000.",
    content: "The Ministry of Health has announced a comprehensive national initiative to monitor water quality in real-time...",
    category: "policy-changes",
    categoryLabel: "Policy Change",
    author: "Policy Analyst Suresh Yadav",
    publishedDate: "2025-01-07",
    readTime: "7 min read", 
    views: 1834,
    likes: 203,
    comments: 45,
    isBreaking: false,
    tags: ["government", "policy", "monitoring", "national-initiative"]
  },
  {
    id: 5,
    title: "ASHA Workers Receive Advanced Training in Water Quality Testing",
    excerpt: "National training program equips frontline health workers with latest testing techniques and digital tools.",
    content: "Over 10,000 ASHA workers across the country have completed advanced training in water quality testing...",
    category: "educational-content",
    categoryLabel: "Educational Content",
    author: "Training Coordinator Anjali Singh",
    publishedDate: "2025-01-06",
    readTime: "3 min read",
    views: 987,
    likes: 134,
    comments: 28,
    isBreaking: false,
    tags: ["asha-workers", "training", "education", "digital-tools"]
  },
  {
    id: 6,
    title: "Mobile Water Testing Labs Reach Remote Villages",
    excerpt: "Innovative mobile labs bring sophisticated water quality testing to areas previously without access.",
    content: "A fleet of mobile water testing laboratories has begun operations in remote areas of Rajasthan and Madhya Pradesh...",
    category: "research-updates",
    categoryLabel: "Research Update",
    author: "Field Coordinator Ram Prasad",
    publishedDate: "2025-01-05",
    readTime: "4 min read",
    views: 743,
    likes: 98,
    comments: 19,
    isBreaking: false,
    tags: ["mobile-labs", "remote-villages", "accessibility", "testing"]
  }
]

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [bookmarkedArticles, setBookmarkedArticles] = useState<number[]>([])

  const filteredNews = featuredNews.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const toggleBookmark = (articleId: number) => {
    setBookmarkedArticles(prev => 
      prev.includes(articleId) 
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    )
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "health-alerts": return "bg-red-50 text-red-700 border-red-200"
      case "community-success": return "bg-green-50 text-green-700 border-green-200"
      case "research-updates": return "bg-blue-50 text-blue-700 border-blue-200"
      case "policy-changes": return "bg-purple-50 text-purple-700 border-purple-200"
      case "educational-content": return "bg-orange-50 text-orange-700 border-orange-200"
      default: return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "health-alerts": return <AlertTriangle className="w-4 h-4" />
      case "community-success": return <CheckCircle className="w-4 h-4" />
      case "research-updates": return <TrendingUp className="w-4 h-4" />
      case "policy-changes": return <Newspaper className="w-4 h-4" />
      case "educational-content": return <Heart className="w-4 h-4" />
      default: return <Newspaper className="w-4 h-4" />
    }
  }

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
                <Newspaper className="w-6 h-6 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">Health News</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="/education">
                <Button variant="outline" size="sm">
                  Education Hub
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-2xl p-12 mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Stay Informed. Stay Healthy.
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Latest news and updates on water quality, community health, and disease prevention
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search news, topics, and updates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 py-3 text-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">Filter by:</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {newsCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                {selectedCategory === category.id && getCategoryIcon(category.id)}
                {category.label}
                <Badge variant="secondary" className="ml-1">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Breaking News Banner */}
        {filteredNews.some(article => article.isBreaking) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-red-600 text-white rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="font-bold uppercase text-sm">Breaking News</span>
                </div>
                <div className="flex-1">
                  {filteredNews.find(article => article.isBreaking)?.title}
                </div>
                <Link href={`/news/${filteredNews.find(article => article.isBreaking)?.id}`}>
                  <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-red-600">
                    Read More
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Featured Article */}
        {filteredNews.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Story</h2>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <div className="aspect-video md:aspect-square bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                      <Newspaper className="w-16 h-16 text-blue-600" />
                    </div>
                  </div>
                  <div className="md:w-2/3 p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge className={`border ${getCategoryColor(filteredNews[0].category)}`}>
                        {getCategoryIcon(filteredNews[0].category)}
                        <span className="ml-1">{filteredNews[0].categoryLabel}</span>
                      </Badge>
                      {filteredNews[0].isBreaking && (
                        <Badge variant="destructive">Breaking</Badge>
                      )}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 hover:text-blue-700 transition-colors">
                      <Link href={`/news/${filteredNews[0].id}`}>
                        {filteredNews[0].title}
                      </Link>
                    </h3>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {filteredNews[0].excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{filteredNews[0].author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(filteredNews[0].publishedDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{filteredNews[0].readTime}</span>
                        </div>
                      </div>
                      
                      <Link href={`/news/${filteredNews[0].id}`}>
                        <Button className="flex items-center gap-2">
                          Read Full Story
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        )}

        {/* News Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Latest Updates</h2>
            <Badge variant="outline" className="text-sm">
              {filteredNews.length} articles found
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.slice(1).map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                    {getCategoryIcon(article.category)}
                  </div>
                  
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={`border text-xs ${getCategoryColor(article.category)}`}>
                        {article.categoryLabel}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleBookmark(article.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Bookmark className={`w-4 h-4 ${
                          bookmarkedArticles.includes(article.id) 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-gray-400'
                        }`} />
                      </Button>
                    </div>
                    
                    <CardTitle className="text-lg leading-tight hover:text-blue-700 transition-colors">
                      <Link href={`/news/${article.id}`}>
                        {article.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {article.excerpt}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{article.author}</span>
                        <span>{new Date(article.publishedDate).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{article.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            <span>{article.likes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            <span>{article.comments}</span>
                          </div>
                        </div>
                        
                        <span className="text-xs text-gray-500">{article.readTime}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Stay Updated with Health News
            </h2>
            <p className="text-gray-600 mb-6">
              Get the latest updates on water quality, community health, and disease prevention delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                placeholder="Enter your email"
                type="email"
                className="flex-1"
              />
              <Button className="whitespace-nowrap">
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
