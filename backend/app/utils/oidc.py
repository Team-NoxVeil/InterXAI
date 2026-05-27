from authlib.integrations.starlette_client import OAuth

from app.config import settings


class OIDCProvider:
    def __init__(self, provider_name: str):
        self.provider_name = provider_name
        self.client = None
        self.get_oidc_client(provider_name)

    def get_oidc_client(self, provider_name: str) -> None:
        oauth = OAuth()
        if provider_name == "google":
            self.client = oauth.register(
                name="google",
                client_id=settings.OIDC_GOOGLE_CLIENT_ID,
                client_secret=settings.OIDC_GOOGLE_CLIENT_SECRET,
                server_metadata_url=(
                    "https://accounts.google.com/.well-known/openid-configuration"
                ),
                client_kwargs={"scope": "openid email profile"},
            )
