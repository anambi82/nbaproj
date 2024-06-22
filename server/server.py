from flask import Flask, jsonify
from flask_cors import CORS
from nba import *

app = Flask(__name__)
CORS(app)

#testing the git repo
@app.route('/members')
def members():
    return jsonify({"members": ["member1", "member2", "member3"]})

@app.route('/playerppg')
def playerppg():
    player_name = "Luka Doncic"
    player_id = get_player_id(player_name)
    if player_id:
        career_ppg = get_career_ppg(player_id)
        career_ppg = round(career_ppg, 2)
        return jsonify({"player": player_name, "ppg": career_ppg})
    else:
        return jsonify({"error": f"Player {player_name} not found."})

if __name__ == '__main__':
    app.run(debug=True)
