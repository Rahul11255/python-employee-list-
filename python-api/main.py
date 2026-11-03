
from fastapi import FastAPI, Depends ,Query
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base, test_connection, get_db
import models
import schemas



# Create FastAPI application
app = FastAPI(
    title="Employee Directory API",
    description="API to manage employee records",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# Application startup
@app.on_event("startup")
def startup():
    test_connection()
    Base.metadata.create_all(bind=engine)


# Home API
@app.get("/")
def home():
    return {
        "message": "Employee Directory API is running"
    }


# Create Employee API
@app.post("/employees")
def create_employee(
    employee: schemas.EmployeeCreate,
    db: Session = Depends(get_db)
):
    # Create employee object
    new_employee = models.Employee(
        name=employee.name,
        email=employee.email,
        department=employee.department,
        designation=employee.designation
    )

    # Add employee to database session
    db.add(new_employee)

    # Save changes in MySQL
    db.commit()

    # Refresh employee data
    db.refresh(new_employee)

    # Return response
    return {
        "message": "Employee created successfully",
        "employee": {
            "id": new_employee.id,
            "name": new_employee.name,
            "email": new_employee.email,
            "department": new_employee.department,
            "designation": new_employee.designation
        }
    }


@app.get("/employees")
def get_employees(
    search: str = "",
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    # Start database query
    query = db.query(models.Employee)

    # Search employees by name
    if search:
        query = query.filter(
            models.Employee.name.ilike(f"%{search}%")
        )

    # Get total matching employees
    total = query.count()

    # Apply pagination
    employees = (
        query
        .order_by(models.Employee.id.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    # Return employee data
    return {
        "items": [
            {
                "id": emp.id,
                "name": emp.name,
                "email": emp.email,
                "department": emp.department,
                "designation": emp.designation
            }
            for emp in employees
        ],
        "total": total,
        "page": page,
        "page_size": page_size
    }