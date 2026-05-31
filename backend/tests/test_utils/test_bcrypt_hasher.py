"""
Unit tests for app.utils.bcrypt_hasher.BcryptHasher.

These tests are purely in-memory — no database or network access.
BcryptHasher wraps the bcrypt library and implements the Hasher interface.
"""

import pytest

from app.utils.bcrypt_hasher import BcryptHasher


class TestBcryptHasherHash:
    """Tests for BcryptHasher.hash()."""

    def test_hash_returns_string(self) -> None:
        """hash() must return a str, not bytes."""
        hasher = BcryptHasher()
        result = hasher.hash("mysecretpassword")
        assert isinstance(result, str)

    def test_hash_is_not_plaintext(self) -> None:
        """The hashed value must differ from the original plaintext."""
        hasher = BcryptHasher()
        plaintext = "mysecretpassword"
        result = hasher.hash(plaintext)
        assert result != plaintext

    def test_hash_starts_with_bcrypt_prefix(self) -> None:
        """All bcrypt hashes start with a recognisable prefix."""
        hasher = BcryptHasher()
        result = hasher.hash("anypassword")
        assert result.startswith("$2b$")

    def test_same_password_produces_different_hashes(self) -> None:
        """bcrypt uses a random salt — hashing the same password twice
        must yield two *different* outputs."""
        hasher = BcryptHasher()
        hash1 = hasher.hash("samepassword")
        hash2 = hasher.hash("samepassword")
        assert hash1 != hash2

    def test_custom_rounds_accepted(self) -> None:
        """Passing a custom rounds value should produce a valid hash."""
        hasher = BcryptHasher(rounds=4)  # 4 rounds = fast for tests
        result = hasher.hash("fasttest")
        assert result.startswith("$2b$04$")


class TestBcryptHasherVerify:
    """Tests for BcryptHasher.verify()."""

    def test_verify_correct_password_returns_true(self) -> None:
        """verify() returns True when the plaintext matches the hash."""
        hasher = BcryptHasher(rounds=4)
        plaintext = "correctpassword"
        hashed = hasher.hash(plaintext)
        assert hasher.verify(plaintext, hashed) is True

    def test_verify_wrong_password_returns_false(self) -> None:
        """verify() returns False when the plaintext does NOT match."""
        hasher = BcryptHasher(rounds=4)
        hashed = hasher.hash("correctpassword")
        assert hasher.verify("wrongpassword", hashed) is False

    def test_verify_empty_password_returns_false(self) -> None:
        """An empty string should not match a real password hash."""
        hasher = BcryptHasher(rounds=4)
        hashed = hasher.hash("notempty")
        assert hasher.verify("", hashed) is False

    def test_verify_is_consistent_across_instances(self) -> None:
        """A hash created by one BcryptHasher instance must be verifiable
        by a completely separate instance (no shared state)."""
        hasher_a = BcryptHasher(rounds=4)
        hasher_b = BcryptHasher(rounds=4)
        hashed = hasher_a.hash("sharedpassword")
        assert hasher_b.verify("sharedpassword", hashed) is True

    @pytest.mark.parametrize(
        "password",
        [
            "short",
            "a" * 50,
            "P@ssw0rd!#$%",
            "unicode_тест",
        ],
    )
    def test_verify_round_trips_various_passwords(self, password: str) -> None:
        """hash→verify round-trip succeeds for a range of password formats."""
        hasher = BcryptHasher(rounds=4)
        hashed = hasher.hash(password)
        assert hasher.verify(password, hashed) is True
