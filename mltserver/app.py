import os
import csv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from typing import List
import os

app = FastAPI()

# CORS settings
origins = [
    "*"  # Replace "*" with specific origins if needed, e.g., ["http://localhost:3000"]
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # List of allowed origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

UPLOADS_FOLDER = "data"

@app.get("/fetch-first-column/{filename}")
async def fetch_first_column(filename: str):
    """
    Endpoint to fetch the first column of a CSV file located in the 'uploads' folder.

    Args:
        filename (str): The name of the CSV file.

    Returns:
        List[dict]: A list of dictionaries containing 'id' and the values from the first column.
    """
    if not filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Invalid file type. Only CSV files are supported.")

    file_path = os.path.join(UPLOADS_FOLDER, filename)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found.")

    try:
        # Read the CSV file into a Pandas DataFrame
        df = pd.read_csv(file_path)
        
        # Check if the DataFrame is empty
        if df.empty:
            raise HTTPException(status_code=400, detail="The CSV file is empty.")

        # Extract the first column and generate response with ids
        first_column = [{"id": idx + 1, "value": value} for idx, value in enumerate(df.iloc[:, 0].tolist())]
        return {"first_column": first_column}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing the file: {str(e)}")


import os
import csv
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, ValidationError, ConfigDict
from typing import List, Optional
import json


class MissionData(BaseModel):
    # V2 configuration
    model_config = ConfigDict(
        populate_by_name=True,  # Replaces allow_population_by_field_name
        arbitrary_types_allowed=True
    )

    # Allow some fields to be optional or have default values
    id: str = Field(min_length=1, max_length=50)
    scenario: str = Field(min_length=1, alias='Scenario')
    # action_id: Optional[str] = Field(default='', alias='ACTION_ID_40c07880ecb08feb0462be9ca3c29fdf0514e3914d')
    category: str = Field(min_length=1, max_length=100, alias='Category')
    sub_mission: Optional[str] = Field(default=None, alias='Sub - mission')
    Criticality: Optional[str] = Field(default=None, alias='Criticality')
    level: str = Field(min_length=1, max_length=50, alias='Level')
    action: str = Field(min_length=1, max_length=100, alias='Action')
    entity: str = Field(min_length=1, max_length=50, alias='Entity')
    from_field: str = Field(min_length=1, max_length=50, alias='From')
    # time: str = Field(min_length=1, max_length=50, alias='Time')
    # location: str = Field(min_length=1, max_length=100, alias='Location')
    task_objective: List[str] = Field(default=[], alias='Task Objective')
    objective_function: List[str] = Field(default=[], alias='Objective function')
    constraints: List[str] = Field(default=[], alias='Constraints')

CSV_FILE_PATH = 'data/mission_data.csv'

@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
    """
    Custom exception handler for Pydantic validation errors
    """
    return JSONResponse(
        status_code=422,
        content={
            "error": "Validation Error",
            "details": exc.errors()
        }
    )

@app.post("/log-mission/")
async def log_mission_data(request: Request):
    """
    Enhanced endpoint to log mission data to a CSV file with comprehensive error handling
    """
    # Try to parse the request body
    try:
        # Parse raw body to handle potential JSON parsing issues
        body = await request.body()
        mission_data_dict = json.loads(body)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON")

    try:
        # Validate the incoming data
        mission_data = MissionData(**mission_data_dict)

        # Determine if file exists and needs headers
        file_exists = os.path.exists(CSV_FILE_PATH)

        # Open file in append mode
        with open(CSV_FILE_PATH, 'a', newline='', encoding='utf-8') as csvfile:
            # Get all fields from the original input keys
            fieldnames = [
                'id', 'Scenario',
                'Category', 'Sub - mission','Criticality', 'Level', 'Action', 
                'Entity', 'From',
                'Task Objective', 'Objective function', 
                'Constraints', 
                
            ]

            # Create CSV writer
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

            # Write headers if file is new
            if not file_exists:
                writer.writeheader()

            # Prepare dictionary for writing
            csv_row = mission_data.model_dump(
                by_alias=True,
                exclude_unset=True
            )

            # Convert list fields to semicolon-separated strings
            list_fields = [
                'Task Objective', 'Objective function', 'Constraints'
            ]
            for field in list_fields:
                if csv_row.get(field):
                    csv_row[field] = '; '.join(csv_row[field])

            # Write the row
            writer.writerow(csv_row)

        return {"status": "Mission data logged successfully", "file": CSV_FILE_PATH}

    except ValidationError as e:
        # More detailed validation error handling
        return JSONResponse(
            status_code=422,
            content={
                "error": "Validation Error",
                "details": e.errors()
            }
        )
    except Exception as e:
        # Catch any unexpected errors
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

# Optional: Endpoint to read the CSV file
@app.get("/read-missions/")
async def read_mission_data():
    """
    Endpoint to read all logged mission data.
    """
    if not os.path.exists(CSV_FILE_PATH):
        raise HTTPException(status_code=404, detail="No mission data file found")

    with open(CSV_FILE_PATH, 'r', encoding='utf-8') as csvfile:
        return list(csv.DictReader(csvfile))

# CORS middleware (if needed)
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)