from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from matplotlib.figure import Figure
import io
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

@app.route('/seasonstats')
def seasonstats():
    player_name = request.args.get('player_name')
    season_id = request.args.get('season_id')
    player_id = get_player_id(player_name)
    if player_id and season_id:
        season_stats = get_season_stats(player_id, season_id)
        if not season_stats.empty:
            season_ppg = get_season_ppg(player_id, season_id)
            season_rpg = get_season_rpg(player_id, season_id)
            season_apg = get_season_apg(player_id, season_id)
            return jsonify({
                "player": player_name,
                "ppg": season_ppg,
                "rpg": season_rpg,
                "apg": season_apg,
                "season_stats": season_stats.to_dict(orient='records')
            })
        else:
            return jsonify({"error": f"No stats found for season {season_id} for player {player_name}."})
    else:
        return jsonify({"error": f"Player {player_name} not found or season {season_id} not found."})

@app.route('/plot')
def plot():
    player_name = request.args.get('player_name')
    season_id = request.args.get('season_id')
    fig = generate_plot(player_name=player_name, season_id=season_id)
    if fig:
        output = io.BytesIO()
        FigureCanvas(fig).print_png(output)
        output.seek(0)
        return send_file(output, mimetype='image/png')
    else:
        return "No shot chart data available", 404

def generate_plot(player_name, season_id):
    player_id = get_player_id(player_name)
    if player_id:
        shotchart_df = get_player_shot_chart(player_id, season_id)
        if not shotchart_df.empty:
            fig = Figure()
            ax = fig.add_subplot(111)
            draw_court(ax)

            made_shots = shotchart_df[shotchart_df['SHOT_MADE_FLAG'] == 1]
            missed_shots = shotchart_df[shotchart_df['SHOT_MADE_FLAG'] == 0]

            ax.scatter(made_shots.LOC_X, made_shots.LOC_Y, c='blue', s=20, alpha=0.6, edgecolors='k', label='Made Shots')
            ax.scatter(missed_shots.LOC_X, missed_shots.LOC_Y, c='red', s=20, alpha=0.6, marker='x', label='Missed Shots')
            
            ax.set_xlim(-250, 250)
            ax.set_ylim(-50, 470)
            ax.set_title(f'{player_name} Shot Chart')
            ax.set_xlabel('Court Width (feet)')
            ax.set_ylabel('Court Length (feet)')
            ax.set_aspect('equal', adjustable='box')
            ax.legend()
            return fig
    return None

if __name__ == '__main__':
    app.run(debug=True)
