from flask import Flask
from routes.users import register_routes
from routes.health import register_routes as register_health_routes
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

register_routes(app)
register_health_routes(app)

if __name__ == '__main__':
	app.run(
		host="0.0.0.0",
		port=5000,
		debug=False
	)
