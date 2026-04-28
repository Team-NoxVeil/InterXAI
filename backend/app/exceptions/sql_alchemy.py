from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError


def register_sql_alchemy_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(SQLAlchemyError)
    async def sqlalchemy_error_handler(_request: Request, exc: SQLAlchemyError) -> JSONResponse:
        return JSONResponse(
            status_code=500,
            content={
                "detail": "Database error occurred",
                "error_type": type(exc).__name__,
                "error_message": str(exc),
                "orig": str(exc.orig) if hasattr(exc, "orig") else None,
            },
        )
