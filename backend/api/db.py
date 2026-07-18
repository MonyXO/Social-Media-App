import mysql.connector

def get_db_connection():
    return mysql.connector.connect(
		host="localhost",
		user="admin_mony",
		password="$Mony5040$",
		database="social_media_app"
	)