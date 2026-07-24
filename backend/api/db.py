import mysql.connector

def get_db_connection():
    return mysql.connector.connect(
		host=Config.DB_HOST,
		port=Config.DB_PORT,
		user=Config.DB_USER,
		password=Config.DB_PASSWORD,
		database=Config.DB_NAME
	)

##		auth_db = mysql.connector.connect(
##			host="localhost",
##			user="admin_mony",
##			password="$Socialpassword01",
##			database="social_media_auth"
##		)
##		auth_cursor = auth_db.cursor(buffered=True)
