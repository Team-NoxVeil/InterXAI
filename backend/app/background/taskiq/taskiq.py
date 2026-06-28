from typing import Any

from taskiq import AsyncBroker
from taskiq.abc.result_backend import AsyncResultBackend
from taskiq_aio_pika import AioPikaBroker
from taskiq_redis import ListQueueBroker, RedisAsyncResultBackend

from app.config import settings

# Explicitly annotate with [Any] to satisfy Mypy
result_backend: AsyncResultBackend[Any] = RedisAsyncResultBackend(redis_url=settings.REDIS_URL)

# Define the broker type
broker: AsyncBroker

if settings.BROKER_TYPE.lower() == "rabbitmq":
    broker = AioPikaBroker(url=settings.RABBITMQ_URL).with_result_backend(result_backend)
else:
    broker = ListQueueBroker(url=settings.REDIS_URL).with_result_backend(result_backend)
