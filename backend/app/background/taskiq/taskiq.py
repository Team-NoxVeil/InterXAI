import ssl

from taskiq_redis import ListQueueBroker, RedisAsyncResultBackend

from app.config import settings

if settings.REDIS_URL.startswith("rediss://"):
    _ssl_ctx: ssl.SSLContext | None = ssl.create_default_context()
    assert _ssl_ctx is not None
    _ssl_ctx.check_hostname = False
    _ssl_ctx.verify_mode = ssl.CERT_NONE
else:
    _ssl_ctx = None

broker = ListQueueBroker(url=settings.REDIS_URL).with_result_backend(
    RedisAsyncResultBackend(redis_url=settings.REDIS_URL)
)
