from foodbank_southlondon import app


@app.route("/")
def home():
    return "Hello, World"
