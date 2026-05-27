import asyncio
import smtplib
from email.message import EmailMessage

from app.config import settings
from app.exceptions.email import EmailSendError
from app.interfaces.email_provider import EmailProvider
from app.logger import get_logger

logger = get_logger(__name__)


class SmtpEmailProvider(EmailProvider):
    def __init__(
        self,
        host: str = settings.SMTP_HOST,
        port: int = settings.SMTP_PORT,
        username: str = settings.SMTP_USERNAME,
        password: str = settings.SMTP_PASSWORD,
        from_email: str = settings.SMTP_FROM_EMAIL,
        use_tls: bool = settings.SMTP_USE_TLS,
        use_ssl: bool = settings.SMTP_USE_SSL,
    ) -> None:
        if not host or not username or not password:
            logger.warning("SMTP is not fully configured; email sending may fail.")
        self.host = host
        self.port = port
        self.username = username
        self.password = password
        self.from_email = from_email or username
        self.use_tls = use_tls
        self.use_ssl = use_ssl

    async def send_email(self, to_email: list[str], subject: str, body: str) -> None:
        # smtplib is blocking, so run the whole exchange in a worker thread to
        # keep the event loop responsive.
        await asyncio.to_thread(self._send_sync, to_email, subject, body)

    def _send_sync(self, to_email: list[str], subject: str, body: str) -> None:
        message = EmailMessage()
        message["From"] = self.from_email
        message["To"] = ", ".join(to_email)
        message["Subject"] = subject
        message.set_content(body)

        try:
            if self.use_ssl:
                with smtplib.SMTP_SSL(self.host, self.port) as server:
                    self._login_and_send(server, message)
            else:
                with smtplib.SMTP(self.host, self.port) as server:
                    if self.use_tls:
                        server.starttls()
                    self._login_and_send(server, message)
        except Exception as e:
            logger.error("SMTP send failed: %s", str(e), exc_info=True)
            raise EmailSendError(f"Failed to send email: {str(e)}") from e

    def _login_and_send(self, server: smtplib.SMTP, message: EmailMessage) -> None:
        if self.username and self.password:
            server.login(self.username, self.password)
        server.send_message(message)
