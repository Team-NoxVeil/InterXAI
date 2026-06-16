import ssl

from taskiq_redis import ListQueueBroker, RedisAsyncResultBackend

from app.config import settings

# Determine broker type
if getattr(settings, "BROKER_TYPE", "redis") == "rabbitmq":
    from taskiq_aio_pika import AioPikaBroker, AioPikaResultBackend
    broker = AioPikaBroker(url=settings.BROKER_URL).with_result_backend(
        AioPikaResultBackend(url=settings.BROKER_URL)
    )
else:
    from taskiq_redis import ListQueueBroker, RedisAsyncResultBackend
    broker = ListQueueBroker(url=settings.REDIS_URL).with_result_backend(
        RedisAsyncResultBackend(redis_url=settings.REDIS_URL)
    )
