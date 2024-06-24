from flask import Flask, jsonify, request
from flask_cors import CORS
from nba import *

app = Flask(__name__)
CORS(app)

@app.route('/playerstats')
def playerstats():
    player_name = request.args.get('player_name', default='Luka Doncic')
    player_id = get_player_id(player_name)
    if player_id:
        career_stats = get_career_stats(player_id)
        career_ppg = get_career_ppg(player_id)
        career_rpg = get_career_rpg(player_id)
        career_apg = get_career_apg(player_id)
        return jsonify({
            "player": player_name,
            "ppg": career_ppg,
            "rpg": career_rpg,
            "apg": career_apg,
            "career_stats": career_stats.to_dict(orient='records')
        })
    else:
        return jsonify({"error": f"Player {player_name} not found."})

if __name__ == '__main__':
    app.run(debug=True)
