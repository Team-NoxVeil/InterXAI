"""
Unit tests for app.utils.jwt_encrypter.JWTEncrypter.

These tests are purely in-memory — no database or network access.
JWTEncrypter wraps PyJWT and implements the Encrypter interface.
"""

import time
from typing import Any

import jwt
import pytest

from app.utils.jwt_encrypter import JWTEncrypter

# Fixed test credentials — avoids reading from .env during unit tests.
_SECRET = "test-secret-key"
_ALGORITHM = "HS256"
_EXPIRE_SECONDS = 60  # 1 minute — fast for tests


class TestJWTEncrypterEncrypt:
    """Tests for JWTEncrypter.encrypt()."""

    def test_encrypt_returns_string(self) -> None:
        """encrypt() must return a str (not bytes)."""
        enc = JWTEncrypter(secret_key=_SECRET, algorithm=_ALGORITHM, expire_seconds=_EXPIRE_SECONDS)
        token = enc.encrypt({"sub": "user123"})
        assert isinstance(token, str)

    def test_encrypt_produces_three_dot_segments(self) -> None:
        """A valid JWT must have exactly two '.' separators (header.payload.signature)."""
        enc = JWTEncrypter(secret_key=_SECRET, algorithm=_ALGORITHM, expire_seconds=_EXPIRE_SECONDS)
        token = enc.encrypt({"sub": "user123"})
        assert token.count(".") == 2

    def test_encrypt_embeds_exp_claim(self) -> None:
        """When expire_seconds is set, the encoded token must carry an 'exp' claim."""
        enc = JWTEncrypter(secret_key=_SECRET, algorithm=_ALGORITHM, expire_seconds=_EXPIRE_SECONDS)
        token = enc.encrypt({"sub": "user42"})
        # Decode without verifying expiry to inspect raw claims.
        raw = jwt.decode(token, _SECRET, algorithms=[_ALGORITHM])
        assert "exp" in raw

    def test_encrypt_exp_is_in_the_future(self) -> None:
        """The 'exp' claim must be in the future relative to now."""
        enc = JWTEncrypter(secret_key=_SECRET, algorithm=_ALGORITHM, expire_seconds=_EXPIRE_SECONDS)
        token = enc.encrypt({"sub": "futureuser"})
        raw = jwt.decode(token, _SECRET, algorithms=[_ALGORITHM])
        assert raw["exp"] > int(time.time())

    def test_encrypt_with_zero_expire_omits_exp(self) -> None:
        """When expire_seconds=0, no 'exp' should be embedded in the token."""
        enc = JWTEncrypter(secret_key=_SECRET, algorithm=_ALGORITHM, expire_seconds=0)
        token = enc.encrypt({"sub": "noexpiry"})
        raw = jwt.decode(token, _SECRET, algorithms=[_ALGORITHM], options={"verify_exp": False})
        assert "exp" not in raw

    def test_encrypt_preserves_payload_fields(self) -> None:
        """All input fields must be present in the decoded payload."""
        enc = JWTEncrypter(secret_key=_SECRET, algorithm=_ALGORITHM, expire_seconds=_EXPIRE_SECONDS)
        payload = {"sub": "abc", "role": "admin", "user_id": 99}
        token = enc.encrypt(payload)
        decoded = jwt.decode(token, _SECRET, algorithms=[_ALGORITHM])
        assert decoded["sub"] == "abc"
        assert decoded["role"] == "admin"
        assert decoded["user_id"] == 99

    def test_encrypt_does_not_mutate_original_dict(self) -> None:
        """encrypt() must not add 'exp' to the caller's dict in-place."""
        enc = JWTEncrypter(secret_key=_SECRET, algorithm=_ALGORITHM, expire_seconds=_EXPIRE_SECONDS)
        original = {"sub": "immutable"}
        enc.encrypt(original)
        assert "exp" not in original


class TestJWTEncrypterDecrypt:
    """Tests for JWTEncrypter.decrypt()."""

    def test_decrypt_recovers_payload(self) -> None:
        """decrypt() must return the original payload data."""
        enc = JWTEncrypter(secret_key=_SECRET, algorithm=_ALGORITHM, expire_seconds=_EXPIRE_SECONDS)
        payload = {"sub": "recovered", "value": 42}
        token = enc.encrypt(payload)
        result = enc.decrypt(token)
        assert result["sub"] == "recovered"
        assert result["value"] == 42

    def test_decrypt_strips_exp_from_result(self) -> None:
        """decrypt() must remove 'exp' from the returned dict."""
        enc = JWTEncrypter(secret_key=_SECRET, algorithm=_ALGORITHM, expire_seconds=_EXPIRE_SECONDS)
        token = enc.encrypt({"sub": "stripexp"})
        result = enc.decrypt(token)
        assert "exp" not in result

    def test_decrypt_raises_on_wrong_secret(self) -> None:
        """A token signed with a different secret must fail to decrypt."""
        enc_a = JWTEncrypter(
            secret_key="secret-a", algorithm=_ALGORITHM, expire_seconds=_EXPIRE_SECONDS
        )
        enc_b = JWTEncrypter(
            secret_key="secret-b", algorithm=_ALGORITHM, expire_seconds=_EXPIRE_SECONDS
        )
        token = enc_a.encrypt({"sub": "attacker"})
        with pytest.raises(jwt.exceptions.InvalidSignatureError):
            enc_b.decrypt(token)

    def test_decrypt_raises_on_tampered_token(self) -> None:
        """Modifying the token payload must make decryption fail."""
        enc = JWTEncrypter(secret_key=_SECRET, algorithm=_ALGORITHM, expire_seconds=_EXPIRE_SECONDS)
        token = enc.encrypt({"sub": "honest"})
        # Corrupt a character in the middle segment.
        header, payload_b64, signature = token.split(".")
        tampered = f"{header}.{payload_b64[:-2]}xx.{signature}"
        with pytest.raises(jwt.exceptions.DecodeError):
            enc.decrypt(tampered)

    def test_decrypt_raises_on_expired_token(self) -> None:
        """A token whose 'exp' is in the past must raise ExpiredSignatureError."""
        enc = JWTEncrypter(secret_key=_SECRET, algorithm=_ALGORITHM, expire_seconds=-1)
        token = enc.encrypt({"sub": "expired"})
        with pytest.raises(jwt.exceptions.ExpiredSignatureError):
            enc.decrypt(token)

    @pytest.mark.parametrize(
        "data",
        [
            {"sub": "simple"},
            {"sub": "nested", "meta": {"role": "admin"}},
            {"sub": "numbers", "count": 0, "score": 9.99},
        ],
    )
    def test_decrypt_round_trips_various_payloads(self, data: dict[str, Any]) -> None:
        """encrypt → decrypt round-trip preserves all payload values."""
        enc = JWTEncrypter(secret_key=_SECRET, algorithm=_ALGORITHM, expire_seconds=_EXPIRE_SECONDS)
        token = enc.encrypt(data)
        result = enc.decrypt(token)
        for key, value in data.items():
            assert result[key] == value
