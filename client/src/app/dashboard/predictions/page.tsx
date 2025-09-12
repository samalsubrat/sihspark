import { PredictionsDashboard } from "@/components/predictions-dashboard"

export default function PredictionsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-gray-900">ML Predictions</h1>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4">
        <div className="w-full">
          <div className="mb-4 sm:mb-6">
            <p className="text-sm sm:text-base text-gray-600">
              Machine learning predictions for health surveillance and risk assessment
            </p>
          </div>
          <PredictionsDashboard />
        </div>
      </div>
    </div>
  )
}
