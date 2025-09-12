import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"

export default function SearchPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-gray-900">Search</h1>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4">
        <div className="mx-auto w-full max-w-7xl">
          <Card className="rounded-xl border-0 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Search Health Surveillance Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input placeholder="Search across reports, tests, alerts, and more..." className="pl-10" />
                </div>
                <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">Search</Button>
              </div>
              <div className="text-center py-12 text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-sm sm:text-base">Enter search terms to find relevant health surveillance data</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
