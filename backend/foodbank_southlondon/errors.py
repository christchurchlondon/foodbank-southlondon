from typing import Tuple

from foodbank_southlondon import app


@app.errorhandler(404)
def handle_404(error: Exception) -> Tuple[str, int]:
    return ("This page does not exist", 404)
