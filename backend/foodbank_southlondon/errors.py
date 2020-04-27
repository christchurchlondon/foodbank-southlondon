from foodbank_southlondon import app


@app.errorhandler(404)
def handle_404(error):
    return ("This page does not exist", 404)
