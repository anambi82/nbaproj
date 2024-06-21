from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

#testing the git repo
@app.route('/members')
def members():
    return jsonify({"members": ["member1", "member2", "member3"]})

if __name__ == '__main__':
    app.run(debug=True)
