from flask import Flask, jsonify
from db import get_db_connection

app = Flask(__name__)

@app.route("/")
def home():
	return jsonify({
		"status": "online",
		"server": "My Flask API",
	})

@app.route("/user-test/<int:id>")
def get_user(id):
	db = get_db_connection()
	cursor = db.cursor(dictionary=True)
	cursor.execute(
		"SELECT * FROM users WHERE id=%s",
		(id,)
	)
	user = cursor.fetchone()
	cursor.close()
	db.close()

	if user is None:
		return jsonify({"error": "User not found"}), 404
	return jsonify(user)

if __name__ == '__main__':
	app.run(
		host="0.0.0.0",
		port=5000,
		debug=True
	)
