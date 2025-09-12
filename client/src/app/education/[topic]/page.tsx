"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { 
  ArrowLeft, 
  Home,
  GraduationCap,
  Clock,
  User,
  Volume2,
  Play,
  CheckCircle,
  XCircle,
  BookOpen,
  Lightbulb,
  Share2,
  Brain,
  HandHeart,
  Shield
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

// Topic content data
const topicContent = {
  "water-diseases": {
    title: "Water-borne Diseases",
    subtitle: "Understanding and preventing cholera, typhoid, and diarrheal diseases",
    category: "Health Education",
    readTime: "8 min read",
    lastUpdated: "January 2025",
    author: "Dr. Priya Sharma, Community Health Expert",
    sections: [
      {
        id: "overview",
        title: "Understanding Water-borne Diseases",
        content: `Water-borne diseases are illnesses caused by pathogenic microorganisms that are transmitted through contaminated water. These diseases affect millions of people worldwide and are a leading cause of illness and death in many developing communities.

The most common water-borne diseases include cholera, typhoid fever, hepatitis A, and various forms of diarrheal diseases. Understanding these diseases is the first step in preventing their spread in your community.`
      },
      {
        id: "cholera",
        title: "Cholera: Causes and Prevention",
        content: `Cholera is an acute diarrheal infection caused by ingesting food or water contaminated with the bacterium Vibrio cholerae. It can cause rapid dehydration and death if untreated.

**Symptoms:**
- Sudden onset of profuse, watery diarrhea
- Vomiting
- Rapid dehydration
- Muscle cramps

**Prevention:**
- Ensure water is properly boiled or treated
- Practice good hand hygiene
- Eat food that is thoroughly cooked and served hot
- Avoid raw or undercooked seafood`
      },
      {
        id: "typhoid",
        title: "Typhoid Fever: Early Detection Signs",
        content: `Typhoid fever is a life-threatening infection caused by the bacterium Salmonella Typhi. It spreads through contaminated food and water or through close contact with an infected person.

**Early Warning Signs:**
- Prolonged fever (104°F/40°C)
- Headache and weakness
- Stomach pain and loss of appetite
- Rose-colored spots on the chest

**Prevention Measures:**
- Vaccination when available
- Safe water practices
- Proper food handling and cooking
- Good personal hygiene`
      },
      {
        id: "diarrhea",
        title: "Diarrhea & Dehydration: Treatment Basics",
        content: `Diarrheal diseases are among the leading causes of malnutrition and death among children under five years old. Quick recognition and treatment can save lives.

**Immediate Treatment:**
- Oral Rehydration Solution (ORS) - mix 1 packet with clean water
- Continue breastfeeding for infants
- Give small, frequent amounts of fluid
- Seek medical attention if symptoms worsen

**When to Seek Emergency Care:**
- Signs of severe dehydration
- Blood in stool
- High fever
- Persistent vomiting`
      }
    ],
    audioClips: [
      {
        title: "Community Health Worker Experience",
        speaker: "Sunita Devi, ASHA Worker",
        duration: "4:32",
        description: "Real experience preventing a cholera outbreak through early detection and community education."
      }
    ],
    quiz: {
      question: "What is the most effective way to prevent water-borne diseases?",
      options: [
        "Taking antibiotics regularly",
        "Boiling water and practicing good hygiene",
        "Avoiding all water consumption",
        "Only drinking bottled water"
      ],
      correct: 1,
      explanation: "Boiling water kills harmful pathogens, and good hygiene practices prevent contamination. This is the most practical and effective prevention method for communities."
    }
  },
  "hygiene-sanitation": {
    title: "Hygiene & Sanitation",
    subtitle: "Essential practices for personal and community health",
    category: "Health Practices",
    readTime: "6 min read",
    lastUpdated: "January 2025",
    author: "Nurse Anjali Kumari, Public Health Specialist",
    sections: [
      {
        id: "handwashing",
        title: "Proper Handwashing Techniques",
        content: `Handwashing is one of the most effective ways to prevent the spread of disease. Proper technique and timing are crucial for maximum effectiveness.

**The 6-Step Method:**
1. Wet hands with clean, running water
2. Apply soap and lather well
3. Rub hands together for at least 20 seconds
4. Clean under nails and between fingers
5. Rinse thoroughly under running water
6. Dry with a clean towel or air dry

**Critical Times to Wash Hands:**
- Before eating or preparing food
- After using the toilet
- After caring for someone who is sick
- After touching animals or waste`
      },
      {
        id: "food-safety",
        title: "Safe Food Handling Practices",
        content: `Foodborne illnesses can be prevented through proper food handling, cooking, and storage practices. These simple steps can protect your family and community.

**Key Food Safety Rules:**
- Cook food to safe temperatures
- Keep raw and cooked foods separate
- Refrigerate perishable foods quickly
- Use clean utensils and surfaces

**The "Danger Zone":**
Bacteria multiply rapidly between 40°F and 140°F (4°C to 60°C). Never leave food in this temperature range for more than 2 hours.`
      }
    ],
    audioClips: [
      {
        title: "Handwashing Education Success",
        speaker: "Teacher Meera Singh",
        duration: "3:15",
        description: "How teaching proper handwashing reduced illness in her school by 60%."
      }
    ],
    quiz: {
      question: "How long should you wash your hands to ensure proper hygiene?",
      options: [
        "5 seconds",
        "10 seconds", 
        "At least 20 seconds",
        "1 minute"
      ],
      correct: 2,
      explanation: "Washing hands for at least 20 seconds ensures that soap has enough time to break down germs and that mechanical action removes them effectively."
    }
  },
  "safe-water": {
    title: "Safe Water Practices",
    subtitle: "Methods for ensuring clean, safe drinking water",
    category: "Water Safety",
    readTime: "10 min read",
    lastUpdated: "January 2025",
    author: "Engineer Rajesh Kumar, Water Safety Expert",
    sections: [
      {
        id: "boiling",
        title: "Proper Water Boiling Techniques",
        content: `Boiling is one of the most effective methods to make water safe for drinking. It kills bacteria, viruses, and parasites that cause waterborne diseases.

**Correct Boiling Method:**
1. Use a clean pot with a lid
2. Bring water to a rolling boil
3. Boil for at least 1 minute (3 minutes at high altitude)
4. Let cool naturally, don't add ice
5. Store in a clean, covered container

**Important Tips:**
- Clear cloudy water by letting it settle, then filter through clean cloth
- Boiled water can taste flat - improve taste by pouring between containers
- Use boiled water for drinking, cooking, and brushing teeth`
      },
      {
        id: "chlorination",
        title: "Using Chlorine Tablets Safely",
        content: `Chlorine tablets are an effective way to disinfect water when boiling is not possible. Proper use ensures safety and effectiveness.

**How to Use Chlorine Tablets:**
1. Check the tablet strength (usually 0.5mg or 8.5mg)
2. Add correct amount based on water volume
3. Stir or shake well
4. Wait 30 minutes before drinking
5. Water should have slight chlorine smell

**Dosage Guidelines:**
- 0.5mg tablet: 1 tablet per liter of water
- 8.5mg tablet: 1 tablet per 4-8 liters of water
- Always follow manufacturer instructions`
      },
      {
        id: "storage",
        title: "Proper Water Storage Methods",
        content: `Even clean water can become contaminated during storage. Proper storage methods keep water safe for consumption.

**Storage Best Practices:**
- Use clean, covered containers with narrow openings
- Don't dip cups or hands directly into stored water
- Use a clean ladle or pour carefully
- Clean storage containers regularly with soap
- Store in cool, dark places away from chemicals

**Container Options:**
- Food-grade plastic containers with tight lids
- Ceramic or glass vessels with covers
- Metal containers (avoid if chlorinated)
- Traditional clay pots (properly maintained)`
      }
    ],
    audioClips: [
      {
        title: "Village Water Safety Success",
        speaker: "Sarpanch Ram Prasad",
        duration: "5:42",
        description: "How implementing proper water practices reduced waterborne diseases by 75% in his village."
      }
    ],
    quiz: {
      question: "How long should you boil water to make it safe for drinking?",
      options: [
        "30 seconds",
        "At least 1 minute",
        "5 minutes",
        "10 minutes"
      ],
      correct: 1,
      explanation: "Boiling water for at least 1 minute (3 minutes at high altitude) is sufficient to kill most disease-causing organisms, making it safe to drink."
    }
  }
}

export default function TopicDetailPage() {
  const params = useParams()
  const topic = params.topic as string
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [showQuizResult, setShowQuizResult] = useState(false)

  const content = topicContent[topic as keyof typeof topicContent]

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Topic Not Found</h1>
          <Link href="/education">
            <Button>Return to Education Hub</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleQuizSubmit = () => {
    setShowQuizResult(true)
  }

  const isCorrectAnswer = parseInt(selectedAnswer) === content.quiz.correct

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
              <Link href="/education" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
                <GraduationCap className="w-5 h-5" />
                <span className="font-medium">Education Hub</span>
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/education" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Education Hub</span>
          </Link>
        </div>

        {/* Article Header */}
        <div className="bg-white rounded-2xl p-8 mb-8 border border-gray-200">
          <div className="max-w-4xl mx-auto">
            <Badge variant="outline" className="mb-4">
              {content.category}
            </Badge>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {content.title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-6">
              {content.subtitle}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{content.readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{content.author}</span>
              </div>
              <div>
                Updated {content.lastUpdated}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Article Content */}
          <div className="space-y-8 mb-12">
            {content.sections.map((section, index) => (
              <Card key={section.id} className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                    {section.content}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Audio Testimonials */}
          {content.audioClips && content.audioClips.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Volume2 className="w-6 h-6 text-blue-600" />
                Audio Testimonials
              </h2>
              
              <div className="space-y-4">
                {content.audioClips.map((clip, index) => (
                  <Card key={index} className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-600 text-white rounded-full">
                          <Volume2 className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {clip.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {clip.speaker}
                          </p>
                          <p className="text-gray-700 text-sm mb-4">
                            {clip.description}
                          </p>
                          <div className="flex items-center gap-3">
                            <Button size="sm" className="flex items-center gap-2">
                              <Play className="w-4 h-4" />
                              Play Audio
                            </Button>
                            <span className="text-xs text-gray-500">{clip.duration}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Awareness Quiz */}
          {content.quiz && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Brain className="w-6 h-6 text-purple-600" />
                Test Your Knowledge
              </h2>
              
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    {content.quiz.question}
                  </h3>
                  
                  {!showQuizResult ? (
                    <>
                      <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-4 mb-6">
                        {content.quiz.options.map((option, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                            <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                      
                      <Button 
                        onClick={handleQuizSubmit} 
                        disabled={!selectedAnswer}
                        className="w-full sm:w-auto"
                      >
                        Submit Answer
                      </Button>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div className={`flex items-center gap-3 p-4 rounded-lg ${
                        isCorrectAnswer 
                          ? 'bg-green-50 text-green-800 border border-green-200' 
                          : 'bg-red-50 text-red-800 border border-red-200'
                      }`}>
                        {isCorrectAnswer ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <XCircle className="w-6 h-6" />
                        )}
                        <span className="font-semibold">
                          {isCorrectAnswer ? 'Correct!' : 'Incorrect'}
                        </span>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-start gap-3">
                          <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-blue-900 mb-2">Explanation:</p>
                            <p className="text-blue-800 text-sm leading-relaxed">
                              {content.quiz.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setShowQuizResult(false)
                          setSelectedAnswer("")
                        }}
                        className="w-full sm:w-auto"
                      >
                        Try Again
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Related Topics */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Continue Learning
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/education/hygiene-sanitation" className="group">
                <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <HandHeart className="w-5 h-5 text-green-600" />
                    <span className="font-medium group-hover:text-blue-700">Hygiene & Sanitation</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Learn essential hygiene practices for personal and community health
                  </p>
                </div>
              </Link>
              
              <Link href="/education/safe-water" className="group">
                <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-5 h-5 text-purple-600" />
                    <span className="font-medium group-hover:text-blue-700">Safe Water Practices</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Methods for ensuring clean, safe drinking water in your community
                  </p>
                </div>
              </Link>
            </div>
            
            <div className="mt-6 text-center">
              <Link href="/education">
                <Button variant="outline" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Explore All Topics
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
