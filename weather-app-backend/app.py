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

class FavoriteLocation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String(50), nullable=False)

class HistoricalWeather(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String(50), nullable=False)
    temperature = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(50), nullable=False)
    local_time = db.Column(db.String(50), nullable=False)  
    weather_icon = db.Column(db.String(50), nullable=False)  
    low_temperature = db.Column(db.Float, nullable=False)
    high_temperature = db.Column(db.Float, nullable=False)
    recorded_at = db.Column(db.DateTime, default=db.func.current_timestamp())

with app.app_context():
    def create_tables():
        db.create_all()

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
        high_temperature=data['high_temperature']
    )
    db.session.add(new_weather)
    db.session.commit()
    return jsonify({'message': 'Weather data added successfully!'})

@app.route('/weather/all', methods=['GET'])
def get_all_weather():
    weather_data = Weather.query.all()
    results = [
        {
            "location": weather.location,
            "temperature": weather.temperature,
            "description": weather.description,
            "local_time": weather.local_time,
            "weather_icon": weather.weather_icon,
            "low_temperature": weather.low_temperature,
            "high_temperature": weather.high_temperature
        } for weather in weather_data]

    return jsonify(results)

@app.route('/favorites', methods=['GET'])
def get_favorites():
    favorites = FavoriteLocation.query.all()
    favorite_list = [{'id': fav.id, 'location': fav.location} for fav in favorites]
    return jsonify(favorite_list)

@app.route('/favorites/add', methods=['POST'])
def add_favorite():
    data = request.get_json()
    new_favorite = FavoriteLocation(location=data['location'])
    db.session.add(new_favorite)
    db.session.commit()
    return jsonify({'message': 'Favorite location added successfully!'})

@app.route('/favorites/delete/<int:id>', methods=['DELETE'])
def delete_favorite(id):
    favorite = FavoriteLocation.query.get(id)
    if favorite is None:
        return jsonify({'message': 'Favorite location not found'}), 404

    db.session.delete(favorite)
    db.session.commit()
    return jsonify({'message': 'Favorite location deleted successfully'})

@app.route('/history/<location>', methods=['GET'])
def get_history(location):
    history_data = HistoricalWeather.query.filter_by(location=location).all()
    history_list = [{"location": weather.location,
                     "temperature": weather.temperature,
                     "description": weather.description,
                     "weather_icon": weather.weather_icon,
                     "low_temperature": weather.low_temperature,
                     "high_temperature": weather.high_temperature,
                     "recorded_at": weather.recorded_at
                    } for hist in history_data]
    return jsonify(history_list)

@app.route('/history/add', methods=['POST'])
def add_history():
    data = request.get_json()
    try:
        new_history = HistoricalWeather(
            location=data['location'], 
            temperature=data['temperature'],
            description=data['description'],
            local_time=data['local_time'],
            weather_icon=data['weather_icon'],
            low_temperature=data['low_temperature'],
            high_temperature=data['high_temperature']
        )
        db.session.add(new_history)
        db.session.commit()
        return jsonify({'message': 'Historical weather data added successfully!'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to add historical weather data', 'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
