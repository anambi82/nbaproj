from nba_api.stats.static import players
from nba_api.stats.endpoints import playercareerstats
from nba_api.stats.endpoints import shotchartdetail
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import matplotlib.image as mpimg


#fetching the player id associated with the player name
def get_player_id(player_name):
    player_dict = players.get_players()
    for player in player_dict:
        if player['full_name'].lower() == player_name.lower():
            return player['id']
    return None

#get the player stats for the specific player id
def get_career_stats(player_id):
    career = playercareerstats.PlayerCareerStats(player_id=player_id)
    career_stats = career.get_data_frames()[0]
    return career_stats

#get the careers ppg for their career
def get_career_ppg(player_id):
    career_stats = get_career_stats(player_id)
    totalpoints = career_stats['PTS'].sum()
    totalgames = career_stats['GP'].sum()
    if totalgames > 0:
        ppg = totalpoints / totalgames
        ppg = round(ppg, 2)
        return ppg
    
#get the total rebounds per game for the player
def get_career_rpg(player_id):
    career_stats = get_career_stats(player_id)
    totalRebounds = career_stats['REB'].sum()
    totalgames = career_stats['GP'].sum()
    if totalgames > 0:
        rbg = totalRebounds / totalgames
        rbg = round(rbg, 2)
        return rbg
    
#get the total assists per game for the player 
def get_career_apg(player_id):
    career_stats = get_career_stats(player_id)
    totalAssists = career_stats['AST'].sum()
    totalgames = career_stats['GP'].sum()
    if totalgames > 0:
        apg = totalAssists / totalgames
        apg = round(apg, 2)
        return apg
    
#get the season stats for the player
def get_season_stats(player_id, season_id):
    career = playercareerstats.PlayerCareerStats(player_id=player_id)
    career_stats = career.get_data_frames()[0]
    season_stats = career_stats[career_stats['SEASON_ID'] == season_id]
    return season_stats

#get the season ppg for the player
def get_season_ppg(player_id, season_id):
    career = playercareerstats.PlayerCareerStats(player_id=player_id)
    career_stats = career.get_data_frames()[0]
    season_stats = career_stats[career_stats['SEASON_ID'] == season_id]
    if not season_stats.empty:
        ppg = season_stats['PTS'].values[0] / season_stats['GP'].values[0]
        ppg = round(ppg, 2)
        return ppg
    return

#get the season rpg for the player
def get_season_rpg(player_id, season_id):
    career = playercareerstats.PlayerCareerStats(player_id=player_id)
    career_stats = career.get_data_frames()[0]
    season_stats = career_stats[career_stats['SEASON_ID'] == season_id]
    if not season_stats.empty:
        rpg = season_stats['REB'].values[0] / season_stats['GP'].values[0]
        rpg = round(rpg, 2)
        return rpg
    return

#get the season apg for the player
def get_season_apg(player_id, season_id):
    career = playercareerstats.PlayerCareerStats(player_id=player_id)
    career_stats = career.get_data_frames()[0]
    season_stats = career_stats[career_stats['SEASON_ID'] == season_id]
    if not season_stats.empty:
        apg = season_stats['AST'].values[0] / season_stats['GP'].values[0]
        apg = round(apg, 2)
        return apg
    return

# Get the player's shot chart
def get_player_shot_chart(player_id, season_id):
    shotchart = shotchartdetail.ShotChartDetail(player_id=player_id, team_id=0, season_type_all_star='Regular Season', season_nullable=season_id, context_measure_simple='FGA')
    shotchart_df = shotchart.get_data_frames()[0]
    return shotchart_df

# Draw the basketball court
def draw_court(ax=None, color='black', lw=2):
    if ax is None:
        ax = plt.gca()

    # Basketball hoop
    hoop = patches.Circle((0, 0), radius=7.5, linewidth=lw, color=color, fill=False)

    # Backboard
    backboard = patches.Rectangle((-30, -7.5), 60, -1, linewidth=lw, color=color)

    # The paint
    outer_box = patches.Rectangle((-80, -47.5), 160, 190, linewidth=lw, color=color, fill=False)
    inner_box = patches.Rectangle((-60, -47.5), 120, 190, linewidth=lw, color=color, fill=False)

    # Free throw top arc
    top_free_throw = patches.Arc((0, 142.5), 120, 120, theta1=0, theta2=180, linewidth=lw, color=color, fill=False)

    # Free throw bottom arc
    bottom_free_throw = patches.Arc((0, 142.5), 120, 120, theta1=180, theta2=0, linewidth=lw, color=color, linestyle='dashed')

    # Restricted zone
    restricted = patches.Arc((0, 0), 80, 80, theta1=0, theta2=180, linewidth=lw, color=color)

    # Three point line
    corner_three_a = plt.Line2D((-220, -220), (-47.5, 92.5), linewidth=lw, color=color)
    corner_three_b = plt.Line2D((220, 220), (-47.5, 92.5), linewidth=lw, color=color)
    three_arc = patches.Arc((0, 0), 475, 475, theta1=22, theta2=158, linewidth=lw, color=color)

    # Center court
    center_outer = patches.Arc((0, 422.5), 120, 120, theta1=180, theta2=0, linewidth=lw, color=color)
    center_inner = patches.Arc((0, 422.5), 40, 40, theta1=180, theta2=0, linewidth=lw, color=color)

    # List of court elements to be added
    court_elements = [hoop, backboard, outer_box, inner_box, top_free_throw, bottom_free_throw,
                      restricted, corner_three_a, corner_three_b, three_arc, center_outer, center_inner]

    # Add the court elements onto the axes
    for element in court_elements:
        if isinstance(element, patches.Patch):
            ax.add_patch(element)
        else:
            ax.add_line(element)

    return ax

# Plot the shot chart on a basketball court image
def plot_shot_chart(shotchart_df, player_name):
    plt.figure(figsize=(12, 11))

    # Load the basketball court image
    # court_img = mpimg.imread('basketball_court.png')
    # plt.imshow(court_img, extent=[-250, 250, -47.5, 422.5], aspect='auto')

    # Draw the court markings
    draw_court(plt.gca())

    # Separate made and missed shots
    made_shots = shotchart_df[shotchart_df['SHOT_MADE_FLAG'] == 1]
    missed_shots = shotchart_df[shotchart_df['SHOT_MADE_FLAG'] == 0]

    # Plot the shot chart data
    plt.scatter(made_shots.LOC_X, made_shots.LOC_Y, c='blue', s=30, alpha=0.6, edgecolors='k', label='Made Shots')
    plt.scatter(missed_shots.LOC_X, missed_shots.LOC_Y, c='red', s=30, alpha=0.6, marker='x', label='Missed Shots')
    
    plt.xlim(-250, 250)
    plt.ylim(-50, 470)
    plt.title(f'{player_name} Shot Chart')
    plt.xlabel('Court Width (feet)')
    plt.ylabel('Court Length (feet)')
    plt.gca().set_aspect('equal', adjustable='box')
    plt.legend()
    plt.show()
    
# #main starts here
# player_name = "Luka Doncic"
# player_id = get_player_id(player_name)

# if player_id:
#     print(f"Player ID for {player_name} is {player_id}")
#     career_stats = get_career_stats(player_id)
#     career_ppg = get_career_ppg(player_id)
#     #print(career_stats)
#     print(f"Career PPG for {player_name} is {career_ppg:.2f}")
# else:
#     print(f"Player {player_name} not found.")
