import { OutbreakPredictionForm } from "@/components/outbreak-prediction-form"

export default function OutbreakPredictionPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-gray-900">Outbreak Risk Prediction</h1>
        </div>
      </header>

      <div className="flex flex-1 gap-0 flex-row justify-start items-start">
        <div className="w-full">
          <div className="mb-4 sm:mb-6">
            <p className="text-sm sm:text-base text-gray-600">
              AI-powered outbreak risk prediction using environmental and epidemiological data to assess potential disease outbreak probability.
            </p>
          </div>
          <OutbreakPredictionForm />
        </div>
      </div>
    </div>
  )
}
