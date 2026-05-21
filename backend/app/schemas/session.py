from pydantic import BaseModel


class HeartbeatResponse(BaseModel):
    status: str
