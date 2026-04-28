from typing import Any

from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse


class AuthError(Exception):
    def __init__(self, detail: str, status_code: int = status.HTTP_401_UNAUTHORIZED) -> None:
        self.detail = detail
        self.status_code = status_code
        super().__init__(self.detail)


class UserAlreadyExistsError(AuthError):
    def __init__(self, username: str) -> None:
        self.username = username
        super().__init__(
            detail=f"User '{username}' already exists. Please choose a different username.",
            status_code=status.HTTP_409_CONFLICT,
        )


class EmailAlreadyExistsError(AuthError):
    def __init__(self, email: str) -> None:
        self.email = email
        super().__init__(
            detail=f"Email '{email}' is already registered. Please use a different email or login.",
            status_code=status.HTTP_409_CONFLICT,
        )


class InvalidUserCredentialsError(AuthError):
    def __init__(self) -> None:
        super().__init__(
            detail="Invalid username or password. Please check your credentials.",
            status_code=status.HTTP_401_UNAUTHORIZED,
        )


class InvalidTokenError(AuthError):
    def __init__(self) -> None:
        super().__init__(
            detail="Invalid or expired token. Please login again.",
            status_code=status.HTTP_401_UNAUTHORIZED,
        )


class UserNotFoundError(AuthError):
    def __init__(self, user_id: int | None = None, username: str | None = None) -> None:
        self.user_id = user_id
        self.username = username
        if user_id:
            detail = f"User with id {user_id} not found"
        elif username:
            detail = f"User '{username}' not found"
        else:
            detail = "User not found"
        super().__init__(
            detail=detail,
            status_code=status.HTTP_404_NOT_FOUND,
        )


def register_auth_exception_handlers(app: "FastAPI") -> None:

    @app.exception_handler(UserAlreadyExistsError)
    async def user_already_exists_handler(
        _request: Request, exc: UserAlreadyExistsError
    ) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail, "username": exc.username},
        )

    @app.exception_handler(EmailAlreadyExistsError)
    async def email_already_exists_handler(
        _request: Request, exc: EmailAlreadyExistsError
    ) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail, "email": exc.email},
        )

    @app.exception_handler(InvalidUserCredentialsError)
    async def invalid_credentials_handler(
        _request: Request, exc: InvalidUserCredentialsError
    ) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail},
        )

    @app.exception_handler(InvalidTokenError)
    async def invalid_token_handler(_request: Request, exc: InvalidTokenError) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail},
        )

    @app.exception_handler(UserNotFoundError)
    async def user_not_found_handler(_request: Request, exc: UserNotFoundError) -> JSONResponse:
        content: dict[str, Any] = {"detail": exc.detail}
        if exc.user_id:
            content["user_id"] = exc.user_id
        if exc.username:
            content["username"] = exc.username
        return JSONResponse(
            status_code=exc.status_code,
            content=content,
        )
