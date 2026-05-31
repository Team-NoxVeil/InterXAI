class EmailError(Exception):
    def __init__(self, detail: str = "An error occurred while sending email"):
        self.detail = detail
        super().__init__(self.detail)


class EmailSendError(EmailError):
    def __init__(self, detail: str = "Failed to send email"):
        super().__init__(detail)
