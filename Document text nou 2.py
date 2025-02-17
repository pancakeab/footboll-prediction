import requests
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from flask import Flask, jsonify, request

# Configurare Flask
app = Flask(__name__)

# Funcție pentru colectarea datelor (Exemplu cu un API fictiv)
def get_match_data():
    API_URL = "https://api-football.example.com/matches"
    API_KEY = "your_api_key"
    headers = {"Authorization": f"Bearer {API_KEY}"}
    response = requests.get(API_URL, headers=headers)
    return response.json()

# Procesarea datelor
def process_data(data):
    df = pd.DataFrame(data)
    df = df[['home_team', 'away_team', 'home_goals', 'away_goals', 'home_possession', 'away_possession']]
    df['match_result'] = np.where(df['home_goals'] > df['away_goals'], 1, 
                                  np.where(df['home_goals'] < df['away_goals'], -1, 0))
    df.drop(columns=['home_goals', 'away_goals'], inplace=True)
    return df

# Încărcare și antrenare model
match_data = get_match_data()
dataset = process_data(match_data)
X = dataset.drop(columns=['match_result'])
y = dataset['match_result']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# API pentru predicții
@app.route('/predict', methods=['POST'])
def predict():
    input_data = request.get_json()
    df = pd.DataFrame([input_data])
    prediction = model.predict(df)
    result = "Home Win" if prediction[0] == 1 else "Away Win" if prediction[0] == -1 else "Draw"
    return jsonify({'prediction': result})

if __name__ == '__main__':
    app.run(debug=True)
