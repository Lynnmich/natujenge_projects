from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///weather.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)

class Weather(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String(50), nullable=False)
    temperature = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(50), nullable=False)
    local_time = db.Column(db.String(50), nullable=False)  
    weather_icon = db.Column(db.String(50), nullable=False)  
    low_temperature = db.Column(db.Float, nullable=False)
    high_temperature = db.Column(db.Float, nullable=False)
    humidity = db.Column(db.Float, nullable=True)  
    wind_speed = db.Column(db.Float, nullable=True)

class FavoriteLocation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String(50), nullable=False)

with app.app_context():
    def create_tables():
        db.create_all()

#Index page
@app.route("/")
def index():
    return "<h1>Hello, World!</h1>"

@app.before_request
def before_request_func():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "*")
        response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE, PUT")
        return response

#Route to save searched weather data to the dB
@app.route('/weather/add', methods=['POST'])
def add_weather():
    data = request.get_json()
    new_weather = Weather(
        location=data['location'],
        temperature=data['temperature'],
        description=data['description'],
        local_time=data['local_time'],
        weather_icon=data['weather_icon'],
        low_temperature=data['low_temperature'],
        high_temperature=data['high_temperature'],
        humidity=data['humidity'], 
        wind_speed=data['wind_speed']
        
    )
    db.session.add(new_weather)
    db.session.commit()
    return jsonify({'message': 'Weather data added successfully!'})

#Route to retrieve all weather data saved on the dB
@app.route('/weather/all', methods=['GET'])
def get_all_weather():
    try:
        page = request.args.get('page', default=1, type=int)
        per_page = request.args.get('per_page', default=10, type=int)

        app.logger.info(f"Requesting page {page} with {per_page} items per page")

        weather_query = Weather.query.paginate(page=page, per_page=per_page, error_out=False)

        weather_data = weather_query.items
        total = weather_query.total

        app.logger.info(f"Retrieved {len(weather_data)} items from the database")

        results = [
            {
                "id": weather.id,
                "location": weather.location,
                "temperature": weather.temperature,
                "description": weather.description,
                "local_time": weather.local_time,
                "weather_icon": weather.weather_icon,
                "low_temperature": weather.low_temperature,
                "high_temperature": weather.high_temperature,
                "humidity": weather.humidity,
                "wind_speed": weather.wind_speed
            } for weather in weather_data]

        response = {
            "searches": results,
            "total": total,
            "page": page,
            "per_page": per_page,
            "pages": weather_query.pages
        }

        return jsonify(response)

    except Exception as e:
        app.logger.error(f"Error in get_all_weather: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

#Route to fetch all favorite locations 
@app.route('/favorites', methods=['GET'])
def get_favorites():
    favorites = FavoriteLocation.query.all()
    favorite_list = [{'id': fav.id, 'location': fav.location} for fav in favorites]
    return jsonify(favorite_list)

#Route to add favorite locations to dB
@app.route('/favorites/add', methods=['POST'])
def add_favorite():
    data = request.get_json()
    new_favorite = FavoriteLocation(location=data['location'])
    db.session.add(new_favorite)
    db.session.commit()
    return jsonify({'message': 'Favorite location added successfully!'})

#Route to retrieve weather data by location trhough the favorites
@app.route('/weather/<location>', methods=['GET'])
def get_weather(location):
    weather_data = Weather.query.filter_by(location=location).first()
    if weather_data:
        result = {
            "location": weather_data.location,
            "temperature": weather_data.temperature,
            "description": weather_data.description,
            "local_time": weather_data.local_time,
            "weather_icon": weather_data.weather_icon,
            "low_temperature": weather_data.low_temperature,
            "high_temperature": weather_data.high_temperature,
            "humidity": weather.humidity,
            "wind_speed": weather.wind_speed
        }
        return jsonify(result)
    else:
        return jsonify({'message': 'Weather data not found'}), 404

#Route  to delete favorite location by id
@app.route('/favorites/delete/<int:id>', methods=['DELETE'])
def delete_favorite(id):
    favorite = FavoriteLocation.query.get(id)
    if favorite is None:
        return jsonify({'message': 'Favorite location not found'}), 404

    db.session.delete(favorite)
    db.session.commit()
    return jsonify({'message': 'Favorite location deleted successfully'})

# Route to delete weather data
@app.route('/weather/delete/<int:id>', methods=['DELETE'])
def delete_weather(id):
    weather = Weather.query.get(id)
    if weather is None:
        return jsonify({'message': 'Weather data not found'}), 404

    db.session.delete(weather)
    db.session.commit()
    return jsonify({'message': 'Weather data deleted successfully'})


if __name__ == '__main__':
    app.run(debug=True)
