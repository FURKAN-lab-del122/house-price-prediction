# HouseAI - AI-Powered Real Estate Valuation Engine

This is an end-to-end house price prediction application built using the Kaggle House Prices dataset. It connects data science, mathematical optimization, machine learning, and full-stack software architecture.

---

## Project Features & Engineering Solutions

* **Model Comparison & High Success (R² 89.5%):** We trained and compared `LinearRegression` (83.7% R² score) and `XGBoost` models in a Jupyter Notebook. The **XGBoost Regressor** provided the highest and most stable success rate, so we chose it as our main prediction engine.
* **Mathematical Transformation (Log/Exp Transformation):** The target variable (`SalePrice`) in the dataset was right-skewed. To help the model learn better, we applied `np.log1p()` before training to make the data look more normal. Inside the Flask API, the log prediction from the model is converted back to real US Dollar value using `np.expm1()` before showing it to the user.
* **Smart Missing Data Management (Data Imputation):** Missing values (NaN) in critical fields like street frontage (`LotFrontage`) were not just filled with a simple average. Instead, they were filled dynamically based on the **median value of the specific neighborhood** (`groupby("Neighborhood").transform`).
* **Perfect Feature Alignment:** After transforming categorical data (`Neighborhood`) with One-Hot Encoding (`pd.get_dummies`), a template of 259 feature columns was saved as `model_columns.pkl`. When a new request comes to the API, it is dynamically matched with this template, completely preventing any "feature mismatch" errors.

---

## System Architecture & Technology Stack

The project has a modern architecture consisting of three independent layers:

1.  **Data Science & ML Pipeline (Jupyter Notebook):** `Python`, `Pandas`, `NumPy`, `Scikit-Learn`, `XGBoost`, `Seaborn`, and `Matplotlib`.
2.  **Backend API Service (PyCharm / Flask):** A lightweight API layer running on port 5000 with `CORS` protection. It uses `joblib` to load the trained models (`xgboost_model.pkl` and `model_columns.pkl`), handles POST requests from the React frontend, and returns JSON data.
3.  **Frontend Interface (React):** A clean React component with a dark theme (`#0f172a`) and inline-CSS layout. Users can select house features like Square Footage, Total Rooms, Year Built, Frontage, Quality Score, and Neighborhood. It communicates with the backend using asynchronous `fetch` requests.

---

## Project Structure

```text
├── house-ai-frontend/          # React Frontend Layer
│   └── src/App.js              # Form interface with State management and Fetch architecture
├── app.py                      # PyCharm Flask API (Model Serving Layer)
├── house_prediction.ipynb      # Jupyter Notebook for Data Preprocessing, EDA, and XGBoost Training
├── train.csv                   # Raw training dataset from Kaggle
├── xgboost_model.pkl           # Serialized XGBoost Model
└── model_columns.pkl           # One-Hot Encoding column template (259 Features)
