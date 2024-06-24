from nba_api.stats.static import players
from nba_api.stats.endpoints import playercareerstats

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
        ppg = round(ppg, 1)
        return ppg
    
#get the total rebounds per game for the player
def get_career_rpg(player_id):
    career_stats = get_career_stats(player_id)
    totalRebounds = career_stats['REB'].sum()
    totalgames = career_stats['GP'].sum()
    if totalgames > 0:
        rbg = totalRebounds / totalgames
        rbg = round(rbg, 1)
        return rbg
    
#get the total assists per game for the player 
def get_career_apg(player_id):
    career_stats = get_career_stats(player_id)
    totalAssists = career_stats['AST'].sum()
    totalgames = career_stats['GP'].sum()
    if totalgames > 0:
        apg = totalAssists / totalgames
        apg = round(apg, 1)
        return apg
    
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
