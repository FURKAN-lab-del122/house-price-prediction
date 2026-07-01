import os
import joblib
import numpy as np
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model_path = os.path.join(BASE_DIR, "xgboost_model.pkl")
columns_path = os.path.join(BASE_DIR, "model_columns.pkl")

app = Flask(__name__)
CORS(app)

model = joblib.load(model_path)
model_columns = joblib.load(columns_path)

@app.route("/predict", methods = ["POST"])
def predict():
    try:
        data = request.get_json()


        input_data = {
            "GrLivArea": float(data.get("GrLivArea", 1500)),
            "TotRmsAbvGrd": int(data.get("TotRmsAbvGrd", 6)),
            "YearBuilt": int(data.get("YearBuilt", 2000)),
            "LotFrontage": float(data.get("LotFrontage", 60)),
            "OverallQual": int(data.get("OverallQual", 6)),
        }

        neighborhood_input = data.get("Neighborhood", "CollgCr")


        current_df = pd.DataFrame(columns = model_columns)
        current_df.loc[0] = 0

        for col, val in input_data.items():
            if col in current_df.columns:
                current_df[col] = val

        neighborhood_column = f"Neighborhood_{neighborhood_input}"
        if neighborhood_column in current_df.columns:
            current_df[neighborhood_column] = 1

        log_prediction = model.predict(current_df)[0]

        real_price = np.expm1(log_prediction)

        return jsonify({"predicted_price": round(float(real_price), 2)})


    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(port=5000, debug=True)

