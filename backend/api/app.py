from flask import Flask, jsonify
import mysql.connector

app = Flask(__name__)

db = mysql.connector.connect(
	host="localhost",
	user="admin_mony",
	password="$Mony5040$",
	database="social_media_app"
)

@app.route("/")
def home():
	return jsonify({
		"status": "online",
		"server": "My Flask API",
	})

@app.route("/user-test/<int:id>")
def get_user(id):
	cursor = db.cursor(dictionary=True)
	cursor.execute(
		"SELECT * FROM users WHERE id=%s",
		(id,)
	)
	user = cursor.fetchone()
	cursor.close()

	if user is None:
		return jsonify({"error": "User not found"}), 404

	return jsonify(user)

if __name__ == '__main__':
	app.run(
		host="0.0.0.0",
		port=5000,
		debug=True
	)
