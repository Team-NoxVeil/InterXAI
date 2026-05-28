from app.background.taskiq.taskiq import broker
from app.logger import get_logger
from app.utils.default_providers import default_email_provider

logger = get_logger(__name__)


async def run_send_email(to_email: list[str], subject: str, body: str) -> None:
    """Send an email through the configured email provider."""
    provider = default_email_provider()
    await provider.send_email(to_email, subject, body)
    logger.info("Sent email to %s (subject=%r)", ", ".join(to_email), subject)


@broker.task
async def send_email_task(to_email: list[str], subject: str, body: str) -> None:
    """TaskIQ-dispatchable wrapper around run_send_email."""
    await run_send_email(to_email, subject, body)
