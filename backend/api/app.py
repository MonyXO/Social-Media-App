from flask import Flask, jsonify
import mysql.connector

app = Flask(__name__)

db = mysql.connector.connect(
	host="10.0.0.5",
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

@app.route("/user-test")
def get_user():
	cursor = db.cursor(dictionary=True)
	cursor.execute("SELECT * FROM users")
	users = cursor.fetchall()
	cursor.close()

	return jsonify(users)

