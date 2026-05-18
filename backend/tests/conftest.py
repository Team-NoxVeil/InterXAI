"""
Shared pytest fixtures for the InterXAI backend test suite.

Design decisions:
- Uses an in-memory SQLite database (aiosqlite) so tests are fast and
  fully isolated — no external services required.
- The Taskiq Redis broker is auto-mocked so tests never attempt to
  connect to Redis. Every test still exercises real FastAPI routing and
  business logic; only the background-worker bootstrap is stubbed out.
- Each test runs inside a rolled-back transaction, so the database starts
  clean for every test function.
"""

from collections.abc import AsyncGenerator
from typing import Any
from unittest.mock import AsyncMock, patch

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

# ---------------------------------------------------------------------------
# In-memory test database
# ---------------------------------------------------------------------------
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

_test_engine = create_async_engine(
    TEST_DATABASE_URL,
    echo=False,
    future=True,
    # SQLite does not support connect_args={"ssl": ...} — none needed here.
)

_TestSessionLocal = async_sessionmaker(
    bind=_test_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


@pytest_asyncio.fixture(scope="session", loop_scope="session", autouse=True)
async def create_tables() -> AsyncGenerator[None, None]:
    """Create all ORM tables once per test session, drop them afterwards."""
    # Import all models so Base.metadata knows about them.
    import app.models.application  # noqa: F401
    import app.models.interaction  # noqa: F401
    import app.models.interview  # noqa: F401
    import app.models.organization  # noqa: F401
    import app.models.user  # noqa: F401
    from app.database import Base  # noqa: F401 (side-effect import)

    async with _test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with _test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture()
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Yield a database session whose changes are rolled back after each test.
    This keeps tests fully isolated from one another.
    """
    async with _TestSessionLocal() as session:
        yield session
        await session.rollback()


# ---------------------------------------------------------------------------
# FastAPI app with dependency overrides
# ---------------------------------------------------------------------------
@pytest_asyncio.fixture()
async def app(db_session: AsyncSession) -> Any:
    """
    Return the FastAPI application with `get_db` overridden to use the
    in-memory SQLite session, and with the Taskiq broker startup/shutdown
    mocked out so no Redis connection is attempted.
    """
    from app.database import get_db
    from app.main import app as fastapi_app

    async def _override_get_db() -> AsyncGenerator[AsyncSession, None]:
        yield db_session

    fastapi_app.dependency_overrides[get_db] = _override_get_db
    yield fastapi_app
    fastapi_app.dependency_overrides.clear()


# ---------------------------------------------------------------------------
# HTTP test client
# ---------------------------------------------------------------------------
@pytest_asyncio.fixture()
async def client(app: Any) -> AsyncGenerator[AsyncClient, None]:
    """
    Yield an async HTTP client that hits the FastAPI app directly (no
    real network socket) via ASGI transport.
    """
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac


# ---------------------------------------------------------------------------
# Mock the Taskiq broker so tests never need a running Redis instance
# ---------------------------------------------------------------------------
@pytest.fixture(autouse=True)
def mock_broker() -> Any:
    """
    Autouse fixture: replaces broker.startup and broker.shutdown with
    no-op async mocks for the duration of every test.
    """
    with (
        patch(
            "app.background.taskiq.taskiq.broker.startup",
            new_callable=AsyncMock,
        ),
        patch(
            "app.background.taskiq.taskiq.broker.shutdown",
            new_callable=AsyncMock,
        ),
    ):
        yield
