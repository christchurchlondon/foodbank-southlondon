from foodbank_southlondon import app


@app.errorhandler(404)
def handle_404(error: Exception):
    return ("This page does not exist", 404)
