import { sql } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

// Get all water tests
export async function GET() {
  try {
    const tests = await sql`
      SELECT * FROM water_tests 
      ORDER BY created_at DESC
    `
    
    return NextResponse.json(tests, { status: 200 })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json(
      { error: "Failed to fetch water tests" },
      { status: 500 }
    )
  }
}

// Create new water test
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      waterbodyName,
      testType,
      priority,
      conductedBy,
      waterQualityParams,
      mlPrediction
    } = body

    // Insert the water test record
    const result = await sql`
      INSERT INTO water_tests (
        waterbody_name,
        test_type,
        priority,
        conducted_by,
        chloramines,
        conductivity,
        hardness,
        organic_carbon,
        solids,
        sulfate,
        trihalomethanes,
        turbidity,
        ph,
        predicted_class,
        risk_probabilities,
        status,
        created_at
      ) VALUES (
        ${waterbodyName},
        ${testType},
        ${priority},
        ${conductedBy},
        ${waterQualityParams.Chloramines},
        ${waterQualityParams.Conductivity},
        ${waterQualityParams.Hardness},
        ${waterQualityParams.Organic_carbon},
        ${waterQualityParams.Solids},
        ${waterQualityParams.Sulfate},
        ${waterQualityParams.Trihalomethanes},
        ${waterQualityParams.Turbidity},
        ${waterQualityParams.ph},
        ${mlPrediction.predicted_class},
        ${JSON.stringify(mlPrediction.probabilities)},
        'Completed',
        NOW()
      )
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating water test:", error)
    return NextResponse.json(
      { error: "Failed to create water test" },
      { status: 500 }
    )
  }
}
