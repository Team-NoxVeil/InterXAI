from pydantic import BaseModel, EmailStr


class OrganizationCreate(BaseModel):
    username: str
    password: str
    email: EmailStr


class OrganizationUpdate(BaseModel):
    address: str | None = None
    email: EmailStr | None = None
    url: str | None = None
    linkedin: str | None = None
    photo: str | None = None
    description: str | None = None


class OrganizationResponse(BaseModel):
    id: int
    account_id: int
    address: str | None = None
    email: str | None = None
    url: str | None = None
    linkedin: str | None = None
    photo: str | None = None
    description: str | None = None

    class Config:
        from_attributes = True


class OrganizationSignupResponse(BaseModel):
    organization: OrganizationResponse
    access_token: str
