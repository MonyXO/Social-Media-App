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

	#	## My solution ##

	#	if uID is not None:
			## Generate token
	#		token = generate_token(32)
	#		app_cursor.execute('INSERT INTO tokens(uID, token, ranks)values(%s, %s, 1);', (uID, token))
	#		print(token)
	#		app_db.commit()
	#		print('commited')
	#		return make_response(jsonify( { 'Token': token } ), 200)

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