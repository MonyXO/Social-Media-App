import mysql.connector

def get_db_connection():
    return mysql.connector.connect(
		host="localhost",
		user="admin_mony",
		password="$Socialpassword01",
		database="social_media_app"
	)

##		auth_db = mysql.connector.connect(
##			host="localhost",
##			user="admin_mony",
##			password="$Socialpassword01",
##			database="social_media_auth"
##		)
##		auth_cursor = auth_db.cursor(buffered=True)