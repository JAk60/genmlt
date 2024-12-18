'use server'

// export async function onSubmit(formData: FormData) {
//   console.log('Selected categories:', formData);
// }

//   // const url = `http://127.0.0.1:8000/fetch-first-column/gendata.csv; 

// 'use server'

export async function onSubmit(formData: FormData) {
  // Function to handle multiple input extraction
  const getMultipleValues = (formData: FormData, name: string): string[] => {
    const values: string[] = []
    
    // Collect all values with the given name
    formData.getAll(name).forEach(value => {
      if (value instanceof File) {
        // If it's a file input, convert to string if needed
        return
      }
      
      // Convert to string and trim
      const stringValue = value.toString().trim()
      
      // Only add non-empty values
      if (stringValue) {
        // If the value contains commas, split it
        if (stringValue.includes(',')) {
          values.push(...stringValue.split(',').map(v => v.trim()).filter(v => v))
        } else {
          values.push(stringValue)
        }
      }
    })

    return values
  }

  // Prepare the data object with flexible multiple input handling
  const rawData = {
    ACTION_ID_40c07880ecb08feb0462be9ca3c29fdf0514e3914d: formData.get('ACTION_ID_40c07880ecb08feb0462be9ca3c29fdf0514e3914d')?.toString() || '',
    Category: formData.get('Category')?.toString() || '',
    'Sub - mission': formData.get('Sub - mission')?.toString() || '',
    Criticality: formData.get('Criticality')?.toString() || '',
    Level: formData.get('Level')?.toString() || '',
    Action: formData.get('Action')?.toString() || '',
    Entity: formData.get('Entity')?.toString() || '',
    From: formData.get('From')?.toString() || '',
    // Time: formData.get('Time')?.toString() || '',
    // Location: formData.get('Location')?.toString() || '',
    'Task Objective': getMultipleValues(formData, 'Task Objective'),
    'Objective function': getMultipleValues(formData, 'Objective function'),
    'Constraints': getMultipleValues(formData, 'Constraints'),
    id: formData.get('id')?.toString() || '',
    Scenario: formData.get('Scenario')?.toString() || ''
  }

  try {
    // Send data to FastAPI endpoint
    const response = await fetch('http://localhost:8000/log-mission/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rawData)
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to submit mission data: ${errorText}`)
    }

    const result = await response.json()
    
    console.log('Mission data submitted successfully:', result)

    return {
      success: true,
      message: 'Mission data logged successfully'
    }
  } catch (error) {
    console.error('Error submitting mission data:', error)
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    }
  }
}

