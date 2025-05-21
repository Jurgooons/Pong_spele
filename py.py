from flask import Flask, render_template, request, jsonify
import os

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('home.html')  

@app.route('/game')
def game():
    return render_template('index.html')  

@app.route('/about')
def about():
    return render_template('about.html')  

@app.route('/submit-score', methods=['POST']) 
def submit_score(): #ievāc datus par score un username no spēles
    data = request.get_json()
    username = data.get('username', 'Unknown')
    hits = data.get('hits', 0)

    with open('scores.txt', 'a') as f: #Uztaisa dokumentu ar datiem
        f.write(f"Username: {username} | Hits: {hits}\n")

    return jsonify({"status": "success"}), 200

@app.route('/leaderboard')
def leaderboard(): ## atver leaderboarda text failu un izņem no tā datus
    scores = []
    try:
        with open('scores.txt', 'r') as f:
            for line in f:
                parts = line.strip().split('|')
                if len(parts) == 2:
                    username = parts[0].split(':')[1].strip()
                    hits = int(parts[1].split(':')[1].strip())
                    scores.append((username, hits))
    except FileNotFoundError:
        scores = []

    scores.sort(key=lambda x: x[1], reverse=True)

    return jsonify(scores[:10])
if __name__ == '__main__':
    app.run(debug=True)
