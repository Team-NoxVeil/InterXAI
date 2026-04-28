import bcrypt

from app.interfaces.hasher import Hasher


class BcryptHasher(Hasher):
    def __init__(self, rounds: int = 12) -> None:
        self.rounds = rounds

    def hash(self, data: str) -> str:
        salt = bcrypt.gensalt(rounds=self.rounds)
        hashed = bcrypt.hashpw(data.encode("utf-8"), salt)
        return hashed.decode("utf-8")

    def verify(self, data: str, hash: str) -> bool:
        return bcrypt.checkpw(data.encode("utf-8"), hash.encode("utf-8"))
