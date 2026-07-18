import mysql.connector

def get_db_connection():
    return mysql.connector.connect(
		host="localhost",
		user="admin_mony",
		password="$Socialpassword01",
		database="social_media_app"
	)