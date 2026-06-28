import ssl

from app.config import settings

# ---------------------------------------------------------------------------
# Resolve the effective broker URL.
# When BROKER_TYPE is "redis" (or unset) fall back to REDIS_URL so that
# existing deployments that only configure REDIS_URL keep working.
# ---------------------------------------------------------------------------
_broker_url: str = settings.BROKER_URL if settings.BROKER_URL else settings.REDIS_URL

if settings.BROKER_TYPE == "rabbitmq":
    # ------------------------------------------------------------------
    # RabbitMQ transport via taskiq-aio-pika
    # ------------------------------------------------------------------
    from taskiq_aio_pika import AioPikaBroker

    if _broker_url.startswith("amqps://"):
        # For TLS-secured amqps:// connections, disable hostname / cert
        # verification (commonly needed with self-signed certs on PaaS).
        _amqp_ssl_ctx: ssl.SSLContext = ssl.create_default_context()
        _amqp_ssl_ctx.check_hostname = False
        _amqp_ssl_ctx.verify_mode = ssl.CERT_NONE
        broker = AioPikaBroker(url=_broker_url, ssl_context=_amqp_ssl_ctx)
    else:
        broker = AioPikaBroker(url=_broker_url)

else:
    # ------------------------------------------------------------------
    # Redis transport (default)  via taskiq-redis
    # ------------------------------------------------------------------
    from taskiq_redis import ListQueueBroker, RedisAsyncResultBackend

    if _broker_url.startswith("rediss://"):
        _redis_ssl_ctx: ssl.SSLContext | None = ssl.create_default_context()
        assert _redis_ssl_ctx is not None
        _redis_ssl_ctx.check_hostname = False
        _redis_ssl_ctx.verify_mode = ssl.CERT_NONE
    else:
        _redis_ssl_ctx = None

    broker = ListQueueBroker(url=_broker_url).with_result_backend(
        RedisAsyncResultBackend(redis_url=_broker_url)
    )
