'use client'

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageCircle, X, Send, Bot, User, Globe } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ChatMessage {
  role: "user" | "model"
  parts: string[]
}

interface ChatResponse {
  response: string
  history: ChatMessage[]
  selected_language: string
}

const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi (हिंदी)" },
  { code: "bn", name: "Bengali (বাংলা)" },
  { code: "te", name: "Telugu (తెలుగు)" },
  { code: "mr", name: "Marathi (मराठी)" },
  { code: "ta", name: "Tamil (தமிழ்)" },
  { code: "gu", name: "Gujarati (ગુજરાતી)" },
  { code: "kn", name: "Kannada (ಕನ್ನಡ)" },
  { code: "ml", name: "Malayalam (മലയാളം)" },
  { code: "pa", name: "Punjabi (ਪੰਜਾਬੀ)" },
  { code: "or", name: "Odia (ଓଡ଼ିଆ)" },
  { code: "as", name: "Assamese (অসমীয়া)" }
]

export default function ChatbotOverlay() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("English")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setIsLoading(true)

    // Add user message immediately
    const newUserMessage: ChatMessage = {
      role: "user",
      parts: [userMessage]
    }
    
    const currentMessages = [...messages, newUserMessage]
    setMessages(currentMessages)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          language: selectedLanguage,
          history: messages // Send previous messages, not including the current one
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response from chatbot")
      }

      const data: ChatResponse = await response.json()
      
      // Update messages with the complete history from the API
      setMessages(data.history)
      
      // Update selected language if it changed
      if (data.selected_language && data.selected_language !== selectedLanguage) {
        setSelectedLanguage(data.selected_language)
      }
    } catch (error) {
      console.error("Error sending message:", error)
      // Add error message to current messages
      const errorMessage: ChatMessage = {
        role: "model",
        parts: ["Sorry, I'm having trouble connecting right now. Please try again later."]
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Chatbot Toggle Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Chatbot Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-3rem)]"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="shadow-2xl border-2 border-blue-200 bg-white/95 backdrop-blur-sm -py-3">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg py-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Bot className="h-5 w-5" />
                    SPARK Health Assistant
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger className="w-36 h-8 text-xs bg-white/20 border-white/30 text-white hover:bg-white/30">
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {SUPPORTED_LANGUAGES.map((lang) => (
                          <SelectItem key={lang.code} value={lang.name} className="text-sm">
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <p className="text-blue-100 text-sm">
                  Ask me about water quality and health!
                </p>
              </CardHeader>
              
              <CardContent className="p-0">
                {/* Messages Area */}
                <ScrollArea className="h-80 px-4 py-2">
                  <div className="space-y-3">
                    {messages.length === 0 && (
                      <div className="text-center text-gray-500 py-6">
                        <Bot className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                        <p className="text-sm">
                          Hi! I`&apos;`m your health assistant. Ask me anything about water quality, 
                          waterborne diseases, or health tips!
                        </p>
                      </div>
                    )}
                    
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex gap-3 ${
                          message.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        {message.role === "model" && (
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Bot className="h-4 w-4 text-blue-600" />
                          </div>
                        )}
                        
                        <div
                          className={`max-w-[80%] rounded-lg px-3 py-2 ${
                            message.role === "user"
                              ? "bg-blue-600 text-white ml-auto"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">
                            {message.parts.join("")}
                          </p>
                        </div>
                        
                        {message.role === "user" && (
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                            <User className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                    
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3 justify-start"
                      >
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="bg-gray-100 rounded-lg px-3 py-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="border-t p-3 bg-gray-50/50">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={
                        selectedLanguage === "Hindi (हिंदी)" ? "जल गुणवत्ता, स्वास्थ्य सुझावों के बारे में पूछें..." :
                        selectedLanguage === "Bengali (বাংলা)" ? "জল গুণমান, স্বাস্থ্য পরামর্শ সম্পর্কে জিজ্ঞাসা করুন..." :
                        selectedLanguage === "Tamil (தமிழ்)" ? "நீரின் தரம், ஆரோக்கிய குறிப்புகள் பற்றி கேளுங்கள்..." :
                        "Ask about water quality, health tips..."
                      }
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!input.trim() || isLoading}
                      size="sm"
                      className="px-3"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedLanguage === "Hindi (हिंदी)" ? "भेजने के लिए Enter दबाएं • SPARK AI द्वारा संचालित" :
                     selectedLanguage === "Bengali (বাংলা)" ? "পাঠাতে Enter চাপুন • SPARK AI দ্বারা চালিত" :
                     selectedLanguage === "Tamil (தமிழ்)" ? "அனுப்ப Enter அழுத்தவும் • SPARK AI மூலம் இயக்கப்படுகிறது" :
                     "Press Enter to send • Powered by SPARK AI"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
