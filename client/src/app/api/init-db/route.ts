import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Create water_tests table
    await sql`
      CREATE TABLE IF NOT EXISTS water_tests (
        id SERIAL PRIMARY KEY,
        waterbody_name VARCHAR(255) NOT NULL,
        test_type VARCHAR(50) NOT NULL CHECK (test_type IN ('Routine', 'Surveillance', 'Emergency')),
        priority VARCHAR(20) NOT NULL CHECK (priority IN ('Low', 'Medium', 'High')),
        conducted_by VARCHAR(255) NOT NULL,
        
        -- Water quality parameters
        chloramines DECIMAL(10, 3),
        conductivity DECIMAL(10, 3),
        hardness DECIMAL(10, 3),
        organic_carbon DECIMAL(10, 3),
        solids DECIMAL(10, 3),
        sulfate DECIMAL(10, 3),
        trihalomethanes DECIMAL(10, 3),
        turbidity DECIMAL(10, 3),
        ph DECIMAL(4, 2),
        
        -- ML prediction results
        predicted_class INTEGER,
        risk_probabilities JSONB,
        
        -- Metadata
        status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Completed')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    return NextResponse.json({ 
      message: "Water tests table created successfully" 
    }, { status: 200 })
  } catch (error) {
    console.error("Error creating table:", error)
    return NextResponse.json({ 
      error: "Failed to create water tests table" 
    }, { status: 500 })
  }
}
