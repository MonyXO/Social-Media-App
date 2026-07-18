from flask import jsonify 
from db import get_db_connection

def register_routes(app):

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