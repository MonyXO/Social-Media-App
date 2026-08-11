from flask import jsonify 
from db import get_db_connection
from utils import generate_token
from flask import request
##	from db import auth_db

def register_routes(app):

	@app.route("/")
	def home():
		token = generate_token(32)
		return jsonify({
			"status": "online",
			"server": "My Flask API",
			"token": token,
		})

	@app.route("/login", methods=["POST"])
	def login():

		# Recieve data from front end - In this case the email and password
		data = request.get_json()

		# store data in variables
		email = data["email"]
		password = data["password"]

		# print(email + '\n' + password)
		# Open up a connection to the database to look up using frontend data
		db = get_db_connection()
		cursor = db.cursor(dictionary=True)
		cursor.execute(
			"SELECT id FROM users WHERE email = %s AND password_hash = %s",
			(
				email, 
				password
			)
		)
		user = cursor.fetchone()

		if user is not None:

			cursor.execute(
				"DELETE FROM auth WHERE user_id = %s",
				(user["id"],)
			)

			# Generate Token
			token = generate_token(32)
			cursor.execute(
				"INSERT INTO auth (user_id, token, user_rank, expires_at) VALUES (%s, %s, 1, DATE_ADD(NOW(), INTERVAL 30 DAY))",
				(
					user["id"],
					token
				)
			)
			db.commit()

			db.close()
			cursor.close()
			
			return jsonify({
				"success": True,
				"user ID": user["id"],
				"token": token,	
			}), 200

		# user_id = user["id"]

		return jsonify({
			"success": False,
			"message": "invalid email or password"
		}, 401)

	@app.route("/logout", methods=["POST"])
	def logout():
		auth_header = request.headers.get("Authorization")

		if not auth_header or not auth_header.startswith("Bearer "):
			return jsonify({
				"success": False,
				"message": "Missing token"
			}), 401

		token = auth_header.split(" ", 1)[1]

		db = get_db_connection()
		cursor = db.cursor()

		cursor.execute(
			"DELETE FROM auth WHERE token = %s",
			(token,)
		)

		db.commit()

		cursor.close()
		db.close()

		return jsonify({
			"success": True,
			"message": "Logged out successfully"
		})

	@app.route("/session", methods=["GET"])
	def session():
		# Recieve data from the frontend - in this case, the token from retrieved from the phones Async Storage
		# data = response.get_json()
		# Can probably use auth header just like in logout
		auth_header = request.headers.get("Authorization")

		# Check to make sure it's a valid response - Will return false if it is invalid
		if not auth_header or not auth_header.startswith("Bearer "):
			return jsonify({
				"success": False,
				"message": "Missing token"
			}), 401

		# Valid response recieved - Check it with database		
		token = auth_header.split(" ", 1)[1]

		db = get_db_connection()
		cursor = db.cursor(dictionary=True)

		cursor.execute(
			"""
			SELECT user_id, user_rank 
			FROM auth 
			WHERE token = %s
				AND expires_at > NOW()
			""",
			(token,)
		)

		# Get credentials and close database connections
		creds = cursor.fetchone()

		cursor.close()
		db.close()

		# Return credential info to the front end
		if creds is not None:
			return jsonify({
				"success": True,
				"user": creds["user_id"],
				"rank": creds["user_rank"]
			})
		return jsonify({
				"success": False,
				"message": "Invalid token"
		}), 401


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