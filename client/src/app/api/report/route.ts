import { NextRequest, NextResponse } from 'next/server'

// Backend API configuration
const BACKEND_API_URL = 'https://sihspark.onrender.com/api/v1'

export async function GET() {
  try {
    // Get auth token from request headers or localStorage equivalent
    const authToken = 'your_auth_token_here' // You may need to get this from headers

    const response = await fetch(`${BACKEND_API_URL}/reports`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    })

    if (!response.ok) {
      console.error('Backend reports API error:', response.status, response.statusText)
      
      // Return mock data that matches your database structure
      return NextResponse.json({
        reports: [
          {
            id: '04dd6e4a-6a18-4975-8250-1b4c9e6c9e8f',
            name: 'Water Report Add',
            location: 'Cuttack',
            latitude: 20.278979,
            longitude: 85.80633,
            date: '2025-09-13T00:00:00',
            mapArea: 'Bhubaneswar',
            leaderId: 'user-1',
            photoUrl: null,
            comment: 'Water quality testing report',
            status: 'awaiting',
            progress: 0
          },
          {
            id: '0ffa376e-d649-454d-b857-f2c4d4567890',
            name: 'Heavy Metal Contamination',
            location: 'Kanpur, Uttar Pradesh',
            latitude: 19.0552135116207,
            longitude: 72.8833618205441,
            date: '2024-11-22T18:30:00',
            mapArea: 'Industrial Area',
            leaderId: 'user-2',
            photoUrl: null,
            comment: 'High levels of heavy metals detected',
            status: 'in_progress',
            progress: 45
          },
          {
            id: '21df8d02-8ce8-43a3-944a-c1d2e3f4g5h6',
            name: 'Chemical Plant Leakage',
            location: 'Ghaziabad, Uttar Pradesh',
            latitude: 19.0304834980184,
            longitude: 72.8674149712349,
            date: '2024-01-15T18:30:00',
            mapArea: 'Chemical Zone',
            leaderId: 'user-3',
            photoUrl: null,
            comment: 'Chemical contamination from nearby plant',
            status: 'resolved',
            progress: 100
          },
          {
            id: '23da8718-e897-44bb-af5e-h7i8j9k0l1m2',
            name: 'Groundwater Depletion',
            location: 'Pimpri-Chinchwad, Maharashtra',
            latitude: 19.0792492334282,
            longitude: 72.8347636926655,
            date: '2024-01-31T18:30:00',
            mapArea: 'Residential Area',
            leaderId: 'user-4',
            photoUrl: null,
            comment: 'Significant groundwater level drop',
            status: 'awaiting',
            progress: 0
          },
          {
            id: '260d0255-b31c-4122-80ab-n3o4p5q6r7s8',
            name: 'Municipal Waste in River',
            location: 'Jaipur, Rajasthan',
            latitude: 19.1086747965312,
            longitude: 72.8529027409684,
            date: '2024-11-10T18:30:00',
            mapArea: 'River Basin',
            leaderId: 'user-5',
            photoUrl: null,
            comment: 'Municipal waste affecting river water quality',
            status: 'in_progress',
            progress: 30
          }
        ]
      })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching reports:', error)
    
    // Return extensive mock data based on your database
    return NextResponse.json({
      reports: [
        {
          id: '04dd6e4a-6a18-4975-8250-1b4c9e6c9e8f',
          name: 'Water Report Add',
          location: 'Cuttack',
          latitude: 20.278979,
          longitude: 85.80633,
          date: '2025-09-13T00:00:00',
          mapArea: 'Bhubaneswar',
          leaderId: 'user-1',
          photoUrl: null,
          comment: 'Water quality testing report',
          status: 'awaiting',
          progress: 0
        },
        {
          id: '0ffa376e-d649-454d-b857-f2c4d4567890',
          name: 'Heavy Metal Contamination',
          location: 'Kanpur, Uttar Pradesh',
          latitude: 19.0552135116207,
          longitude: 72.8833618205441,
          date: '2024-11-22T18:30:00',
          mapArea: 'Industrial Area',
          leaderId: 'user-2',
          photoUrl: null,
          comment: 'High levels of heavy metals detected',
          status: 'in_progress',
          progress: 45
        },
        {
          id: '21df8d02-8ce8-43a3-944a-c1d2e3f4g5h6',
          name: 'Chemical Plant Leakage',
          location: 'Ghaziabad, Uttar Pradesh',
          latitude: 19.0304834980184,
          longitude: 72.8674149712349,
          date: '2024-01-15T18:30:00',
          mapArea: 'Chemical Zone',
          leaderId: 'user-3',
          photoUrl: null,
          comment: 'Chemical contamination from nearby plant',
          status: 'resolved',
          progress: 100
        },
        {
          id: '23da8718-e897-44bb-af5e-h7i8j9k0l1m2',
          name: 'Groundwater Depletion',
          location: 'Pimpri-Chinchwad, Maharashtra',
          latitude: 19.0792492334282,
          longitude: 72.8347636926655,
          date: '2024-01-31T18:30:00',
          mapArea: 'Residential Area',
          leaderId: 'user-4',
          photoUrl: null,
          comment: 'Significant groundwater level drop',
          status: 'awaiting',
          progress: 0
        },
        {
          id: '260d0255-b31c-4122-80ab-n3o4p5q6r7s8',
          name: 'Municipal Waste in River',
          location: 'Jaipur, Rajasthan',
          latitude: 19.1086747965312,
          longitude: 72.8529027409684,
          date: '2024-11-10T18:30:00',
          mapArea: 'River Basin',
          leaderId: 'user-5',
          photoUrl: null,
          comment: 'Municipal waste affecting river water quality',
          status: 'in_progress',
          progress: 30
        },
        {
          id: '28ba0bac-d1e8-4762-b9ec-t9u0v1w2x3y4',
          name: 'Urban Runoff Pollution',
          location: 'Agra, Uttar Pradesh',
          latitude: 19.1256255467597,
          longitude: 72.8759450147129,
          date: '2024-07-06T18:30:00',
          mapArea: 'Urban Area',
          leaderId: 'user-6',
          photoUrl: null,
          comment: 'Urban runoff causing water pollution',
          status: 'awaiting',
          progress: 0
        },
        {
          id: '34f70732-0feb-40be-a108-z5a6b7c8d9e0',
          name: 'Water Body Encroachment',
          location: 'Patna, Bihar',
          latitude: 19.0596869182215,
          longitude: 72.8615421278628,
          date: '2024-02-11T18:30:00',
          mapArea: 'Water Body',
          leaderId: 'user-7',
          photoUrl: null,
          comment: 'Illegal construction affecting water body',
          status: 'in_progress',
          progress: 60
        },
        {
          id: '350c32d7-d7fe-41cd-aa2c-f1g2h3i4j5k6',
          name: 'Hospital Waste Disposal',
          location: 'Faridabad, Haryana',
          latitude: 19.0939984327824,
          longitude: 72.8671932343171,
          date: '2024-06-26T18:30:00',
          mapArea: 'Medical District',
          leaderId: 'user-8',
          photoUrl: null,
          comment: 'Improper hospital waste disposal',
          status: 'resolved',
          progress: 100
        },
        {
          id: '45424e1f-91c3-4f1c-b67a-l7m8n9o0p1q2',
          name: 'Algal Bloom in Lake',
          location: 'Indore, Madhya Pradesh',
          latitude: 19.0546133997365,
          longitude: 72.9036491505785,
          date: '2024-08-22T18:30:00',
          mapArea: 'Lake Area',
          leaderId: 'user-9',
          photoUrl: null,
          comment: 'Algal bloom affecting lake ecosystem',
          status: 'in_progress',
          progress: 25
        },
        {
          id: '55530cef-8423-4782-957a-r3s4t5u6v7w8',
          name: 'Agricultural Chemical Runoff',
          location: 'Nashik, Maharashtra',
          latitude: 19.0622468085463,
          longitude: 72.9214050654263,
          date: '2024-04-05T18:30:00',
          mapArea: 'Agricultural Zone',
          leaderId: 'user-10',
          photoUrl: null,
          comment: 'Chemical runoff from agricultural activities',
          status: 'awaiting',
          progress: 0
        },
        {
          id: '714927d7-0347-405f-9d7a-x9y0z1a2b3c4',
          name: 'Industrial Effluent Discharge',
          location: 'Visakhapatnam, Andhra Pradesh',
          latitude: 19.0282913322751,
          longitude: 72.8347806464411,
          date: '2024-02-06T18:30:00',
          mapArea: 'Industrial Complex',
          leaderId: 'user-11',
          photoUrl: null,
          comment: 'Untreated industrial effluent discharge',
          status: 'resolved',
          progress: 100
        },
        {
          id: '7333cf70-5191-4b9f-bc49-d5e6f7g8h9i0',
          name: 'River Water Quality Degradation',
          location: 'Kolkata, West Bengal',
          latitude: 19.0312649025641,
          longitude: 72.8513210830587,
          date: '2024-07-03T18:30:00',
          mapArea: 'River Basin',
          leaderId: 'user-12',
          photoUrl: null,
          comment: 'Overall water quality degradation in river',
          status: 'in_progress',
          progress: 40
        },
        {
          id: '7c3084fb-a7c7-4d10-983a-j1k2l3m4n5o6',
          name: 'Industrial Waste Dumping',
          location: 'Bangalore, Karnataka',
          latitude: 19.1060772268540,
          longitude: 72.9018510608089,
          date: '2024-10-26T18:30:00',
          mapArea: 'Industrial Area',
          leaderId: 'user-13',
          photoUrl: null,
          comment: 'Illegal industrial waste dumping',
          status: 'awaiting',
          progress: 0
        },
        {
          id: '7c885377-ebca-4e0b-8a48-p7q8r9s0t1u2',
          name: 'Bacterial Infection in Water',
          location: 'Nagpur, Maharashtra',
          latitude: 19.0370494425033,
          longitude: 72.8691485063384,
          date: '2024-04-09T18:30:00',
          mapArea: 'Residential Area',
          leaderId: 'user-14',
          photoUrl: null,
          comment: 'Bacterial contamination detected',
          status: 'resolved',
          progress: 100
        },
        {
          id: '7d94d29a-29f5-49b1-9114-v3w4x5y6z7a8',
          name: 'Chemical Spill in Water',
          location: 'Pune, Maharashtra',
          latitude: 19.0946510933422,
          longitude: 72.8738344873892,
          date: '2024-02-17T18:30:00',
          mapArea: 'Industrial Zone',
          leaderId: 'user-15',
          photoUrl: null,
          comment: 'Chemical spill contaminating water source',
          status: 'in_progress',
          progress: 75
        },
        {
          id: '87624d56-e94d-44c6-aaba-b9c0d1e2f3g4',
          name: 'Mining Waste Disposal',
          location: 'Ludhiana, Punjab',
          latitude: 19.0746596690466,
          longitude: 72.8350409112097,
          date: '2024-08-25T18:30:00',
          mapArea: 'Mining Area',
          leaderId: 'user-16',
          photoUrl: null,
          comment: 'Mining waste affecting water quality',
          status: 'awaiting',
          progress: 0
        },
        {
          id: '893739a0-1d09-4209-b82c-h5i6j7k8l9m0',
          name: 'Oil Spill in Coastal Area',
          location: 'Lucknow, Uttar Pradesh',
          latitude: 19.0497295420122,
          longitude: 72.8451129179771,
          date: '2024-11-22T18:30:00',
          mapArea: 'Coastal Zone',
          leaderId: 'user-17',
          photoUrl: null,
          comment: 'Oil spill affecting coastal water',
          status: 'in_progress',
          progress: 35
        },
        {
          id: 'ba97d0dd-66a0-4768-80a9-n1o2p3q4r5s6',
          name: 'Agricultural Runoff Pollution',
          location: 'Ahmedabad, Gujarat',
          latitude: 19.1222163471008,
          longitude: 72.8697991836908,
          date: '2024-01-26T18:30:00',
          mapArea: 'Agricultural Area',
          leaderId: 'user-18',
          photoUrl: null,
          comment: 'Agricultural chemicals polluting water',
          status: 'resolved',
          progress: 100
        },
        {
          id: 'bc46843d-84f1-4b1a-8fe0-t7u8v9w0x1y2',
          name: 'Plastic Waste in Water Bodies',
          location: 'Meerut, Uttar Pradesh',
          latitude: 19.0890715444411,
          longitude: 72.9029432230622,
          date: '2024-11-21T18:30:00',
          mapArea: 'Water Body',
          leaderId: 'user-19',
          photoUrl: null,
          comment: 'Plastic waste contaminating water bodies',
          status: 'awaiting',
          progress: 0
        }
      ]
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Here you would normally forward to the backend API
    const authToken = 'your_auth_token_here'

    const response = await fetch(`${BACKEND_API_URL}/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating report:', error)
    
    // Return success response for demo
    return NextResponse.json({
      report: {
        id: Math.random().toString(36).substr(2, 9)
      }
    })
  }
}
