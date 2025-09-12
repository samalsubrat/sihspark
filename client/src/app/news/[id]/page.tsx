"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { 
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  ThumbsUp,
  Home,
  Newspaper,
  Send,
  AlertTriangle,
  CheckCircle,
  TrendingUp
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"

// Sample article data (in a real app, this would come from an API)
const articlesData = {
  1: {
    id: 1,
    title: "Major Waterborne Disease Outbreak Prevented in Rural Bihar",
    subtitle: "Quick action by ASHA workers and community leaders prevented a potential cholera outbreak affecting over 5,000 residents",
    category: "health-alerts",
    categoryLabel: "Health Alert",
    author: "Dr. Priya Sharma",
    authorBio: "Community Health Expert with 15 years of experience in rural health initiatives",
    publishedDate: "2025-01-10",
    readTime: "4 min read",
    views: 1247,
    likes: 89,
    comments: 23,
    isBreaking: true,
    tags: ["cholera", "prevention", "bihar", "asha-workers"],
    content: `
# Early Detection Saves Thousands

In a remarkable display of community health preparedness, the village of Madhubani successfully prevented what could have been a devastating cholera outbreak. The quick thinking and coordinated response of local ASHA workers, community leaders, and health officials demonstrated the power of early detection and rapid response protocols.

## The Initial Warning Signs

The crisis began when Sunita Devi, an ASHA worker in the region, noticed an unusual pattern of gastrointestinal symptoms among children in three neighboring villages. Instead of dismissing these as common stomach ailments, her training in waterborne disease recognition led her to immediately alert the district health authorities.

"I had seen these symptoms before during our training sessions," explained Sunita. "The sudden onset, the specific pattern of dehydration, and the clustering in certain areas all pointed to potential water contamination."

## Rapid Response Protocol

Within 6 hours of the initial report, a mobile testing unit was dispatched to the affected areas. Water samples from the primary sources showed high levels of Vibrio cholerae, the bacteria responsible for cholera. The contamination was traced to a damaged sewage line that had been leaking into the community well for several days.

### Key Actions Taken:

- **Immediate water source isolation**: All affected wells were immediately marked as unsafe and sealed
- **Alternative water supply**: Clean water tankers were deployed within 12 hours
- **Community education**: Door-to-door awareness campaigns about symptoms and prevention
- **Medical camps**: Temporary health camps set up to treat early cases and prevent spread

## Community Response

The success of this prevention effort wasn't just due to the quick response of health workers, but also the cooperation of the entire community. Village elders worked alongside ASHA workers to ensure everyone understood the importance of the precautionary measures.

"When people understand why they need to take certain steps, they're much more likely to follow through," noted Ramesh Kumar, the village sarpanch. "The health workers explained everything clearly, and people could see the immediate benefits."

## Lessons Learned

This incident highlights several critical factors in preventing waterborne disease outbreaks:

1. **Training effectiveness**: Proper training of frontline health workers pays dividends in crisis situations
2. **Community trust**: Strong relationships between health workers and community members enable quick information flow
3. **Rapid testing capabilities**: Having mobile testing units that can be deployed quickly is essential
4. **Clear communication**: Simple, clear messaging about risks and prevention measures

## Moving Forward

The Bihar health department has announced plans to expand this model of community-based early detection across the state. Additional ASHA workers will receive enhanced training in waterborne disease recognition, and more mobile testing units will be positioned strategically throughout rural areas.

Dr. Rajesh Singh, District Health Officer, emphasized the importance of this approach: "Prevention will always be more effective and cost-efficient than treatment. This success story shows what's possible when we invest in community health education and early detection systems."

## Impact and Results

Thanks to the quick response, what could have affected over 5,000 people was contained to just 23 cases, all of which were treated successfully with no fatalities. The affected water sources were repaired within 48 hours, and comprehensive testing confirmed the elimination of contamination.

This prevention success has become a model for other districts facing similar challenges, demonstrating that with proper training, equipment, and community cooperation, even serious health threats can be effectively managed at the local level.
    `,
    relatedArticles: [2, 3, 5]
  },
  2: {
    id: 2,
    title: "New AI-Powered Water Quality Testing Shows 95% Accuracy",
    subtitle: "Revolutionary testing technology deployed across 200 villages shows remarkable success in early disease detection",
    category: "research-updates",
    categoryLabel: "Research Update", 
    author: "Engineer Rajesh Kumar",
    authorBio: "Water Technology Specialist and AI Research Coordinator",
    publishedDate: "2025-01-09",
    readTime: "6 min read",
    views: 892,
    likes: 156,
    comments: 34,
    isBreaking: false,
    tags: ["ai", "water-testing", "technology", "accuracy"],
    content: `
# Revolutionary Technology Transforms Water Safety

A groundbreaking AI-powered water quality testing system has demonstrated 95% accuracy in detecting harmful pathogens, representing a major leap forward in community health protection. The system, developed through a collaboration between the Indian Institute of Technology and the Ministry of Health, has been successfully deployed across 200 villages in three states.

## How the Technology Works

The AI system combines advanced spectroscopy with machine learning algorithms to analyze water samples in real-time. Unlike traditional testing methods that can take days to provide results, this new technology delivers accurate readings within minutes.

The system analyzes multiple parameters simultaneously:
- Bacterial contamination levels
- Chemical pollutants
- pH and turbidity variations
- Presence of heavy metals
- Organic contaminants

## Field Testing Results

Over the past six months, the system has processed over 10,000 water samples with remarkable consistency. The 95% accuracy rate represents a significant improvement over standard field testing kits, which typically achieve 70-80% accuracy.

Dr. Anita Verma, lead researcher on the project, explains: "The AI learns from each test, continuously improving its accuracy. We've seen the system catch contamination events that traditional methods missed, potentially preventing numerous outbreaks."

## Real-World Impact

The technology has already proven its worth in several critical situations:

### Case Study: Rajasthan Village
In a remote village in Rajasthan, the AI system detected E. coli contamination three days before symptoms appeared in the population. This early warning allowed health workers to implement prevention measures immediately.

### Case Study: West Bengal Floods
During recent flooding in West Bengal, the portable AI units enabled rapid testing of multiple water sources, helping communities identify safe alternatives quickly.

## Community Adoption

One of the key advantages of this technology is its ease of use. ASHA workers can operate the devices with minimal training, making it practical for widespread deployment in rural areas.

"The device is simple enough that I learned to use it in just two hours," said Kamala Devi, an ASHA worker in Uttar Pradesh. "Now I can test water quality immediately when people report stomach problems, instead of waiting for samples to be sent to the district lab."

## Cost-Effectiveness Analysis

While the initial investment in AI-powered devices is higher than traditional testing equipment, the long-term cost benefits are substantial:

- **Reduced lab costs**: Fewer samples need to be sent for laboratory confirmation
- **Prevention savings**: Early detection prevents expensive outbreak response
- **Time efficiency**: Immediate results enable faster decision-making
- **Training costs**: Simpler operation reduces training requirements

## Challenges and Solutions

The deployment hasn't been without challenges:

**Power Requirements**: Rural areas often lack reliable electricity
*Solution*: Solar-powered units with 72-hour battery backup

**Maintenance**: Sophisticated equipment needs regular calibration
*Solution*: Remote monitoring system with predictive maintenance alerts

**Data Connectivity**: Results need to be shared with health authorities
*Solution*: Satellite connectivity for areas without cellular coverage

## Future Developments

The research team is working on several enhancements:

1. **Expanded pathogen detection**: Adding capability to detect viral contamination
2. **Predictive modeling**: Using historical data to predict contamination risks
3. **Integration with weather data**: Correlating contamination with rainfall and temperature
4. **Mobile app interface**: Simplified reporting and data visualization

## Scaling Up

Based on the success of the pilot program, the government has announced plans to deploy 1,000 additional units over the next 18 months. Priority will be given to areas with high vulnerability to waterborne diseases.

The success of this technology demonstrates how AI can be effectively applied to solve real-world health challenges in resource-constrained settings. As the system continues to learn and improve, it promises to become an even more powerful tool in the fight against waterborne diseases.
    `,
    relatedArticles: [1, 4, 6]
  }
}

const sampleComments = [
  {
    id: 1,
    author: "Dr. Meera Patel",
    role: "Community Health Worker",
    content: "This is exactly the kind of proactive approach we need. Early detection saves lives and prevents the huge costs associated with outbreak response.",
    timestamp: "2 hours ago",
    likes: 12,
    replies: 3
  },
  {
    id: 2,
    author: "Suresh Kumar",
    role: "Village Sarpanch",
    content: "We implemented similar protocols in our village last year. The key is training and community cooperation. Well done to the Bihar team!",
    timestamp: "4 hours ago", 
    likes: 8,
    replies: 1
  },
  {
    id: 3,
    author: "ASHA Worker Kamala",
    role: "Frontline Health Worker",
    content: "Thank you for sharing this success story. It motivates us to be more vigilant in our own communities. The training really makes a difference.",
    timestamp: "6 hours ago",
    likes: 15,
    replies: 2
  }
]

export default function NewsArticlePage() {
  const params = useParams()
  const articleId = parseInt(params.id as string)
  const article = articlesData[articleId as keyof typeof articlesData]
  
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState(sampleComments)

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <Link href="/news">
            <Button>Return to News</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        author: "Anonymous User",
        role: "Community Member", 
        content: newComment,
        timestamp: "Just now",
        likes: 0,
        replies: 0
      }
      setComments([comment, ...comments])
      setNewComment("")
    }
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
              <Link href="/news" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
                <Newspaper className="w-5 h-5" />
                <span className="font-medium">News</span>
              </Link>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBookmarked(!bookmarked)}
                className="flex items-center gap-2"
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                {bookmarked ? 'Saved' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/news" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to News</span>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 mb-8 border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <Badge className={`border ${getCategoryColor(article.category)}`}>
                {getCategoryIcon(article.category)}
                <span className="ml-1">{article.categoryLabel}</span>
              </Badge>
              {article.isBreaking && (
                <Badge variant="destructive">Breaking News</Badge>
              )}
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-6">
              {article.subtitle}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(article.publishedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{article.readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{article.views} views</span>
              </div>
            </div>

            {/* Engagement Buttons */}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLiked(!liked)}
                className={`flex items-center gap-2 ${liked ? 'text-red-600 border-red-200' : ''}`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-red-600' : ''}`} />
                <span>{article.likes + (liked ? 1 : 0)}</span>
              </Button>
              
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span>{comments.length}</span>
              </Button>
              
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </motion.div>

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-8 mb-8 border border-gray-200"
          >
            <div className="prose prose-gray max-w-none">
              <div className="whitespace-pre-line text-gray-700 leading-relaxed text-lg">
                {article.content}
              </div>
            </div>

            {/* Tags */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Author Bio */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {article.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{article.author}</h3>
                  <p className="text-gray-600 text-sm">{article.authorBio}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Comments Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-8 mb-8 border border-gray-200"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Comments ({comments.length})
            </h2>

            {/* Add Comment */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <Textarea
                placeholder="Share your thoughts on this article..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-4"
              />
              <Button 
                onClick={handleCommentSubmit}
                disabled={!newComment.trim()}
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Post Comment
              </Button>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-bold text-sm">
                      {comment.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{comment.author}</span>
                        <Badge variant="outline" className="text-xs">
                          {comment.role}
                        </Badge>
                        <span className="text-xs text-gray-500">{comment.timestamp}</span>
                      </div>
                      <p className="text-gray-700 mb-3">{comment.content}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <Button variant="ghost" size="sm" className="flex items-center gap-1 p-0 h-auto">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{comment.likes}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="p-0 h-auto text-blue-600">
                          Reply ({comment.replies})
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Related Articles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-8 border border-gray-200"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Related Articles
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {article.relatedArticles.map((relatedId) => {
                const relatedArticle = articlesData[relatedId as keyof typeof articlesData]
                if (!relatedArticle) return null
                
                return (
                  <Link
                    key={relatedId}
                    href={`/news/${relatedId}`}
                    className="group p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={`border text-xs ${getCategoryColor(relatedArticle.category)}`}>
                        {relatedArticle.categoryLabel}
                      </Badge>
                    </div>
                    <h3 className="font-medium group-hover:text-blue-700 transition-colors mb-2">
                      {relatedArticle.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {relatedArticle.subtitle}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{relatedArticle.author}</span>
                      <span>{relatedArticle.readTime}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
