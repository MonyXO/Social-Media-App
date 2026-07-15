from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/")
def home():
	return jsonify({
		"status": "online",
		"server": "My Flask API",
	})

@app.route("/hello")
def hello():
	return jsonify({
		"message": "Hello from the Flask api!"
	})

@app.route("/welcome")
def welcome():
	return "Cdawg wuz x"

if __name__ == "__main__":
	app.run(
		host="0.0.0.0",
		port=5000,
		debug=True
	)
