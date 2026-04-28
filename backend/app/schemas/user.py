from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class UserProfileUpdate(BaseModel):
    leetcode: str | None = None
    github: str | None = None
    linkedin: str | None = None
    photo: str | None = None
    bio: str | None = None


class UserUpdate(BaseModel):
    username: str | None = None
    email: EmailStr | None = None
    password: str | None = None
    profile: UserProfileUpdate | None = None


class UserProfileResponse(BaseModel):
    leetcode: str | None = None
    github: str | None = None
    linkedin: str | None = None
    photo: str | None = None
    bio: str | None = None

    class Config:
        from_attributes = True


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    profile: UserProfileResponse | None = None

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    token: str
    user: UserResponse
