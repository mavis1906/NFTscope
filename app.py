import os
import requests

from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv

from services.nft_service import get_wallet_nfts

app = Flask(__name__)

load_dotenv()

COINGECKO_API_KEY= os.getenv("COINGECKO_API_KEY")

@app.route('/')
def home():
    return render_template('index.html')

@app.route("/api/nfts")
def fetch_nfts():

    wallet = request.args.get('wallet')

    if not wallet:
        return jsonify({"error": "Wallet address is required"}), 400

    data = get_wallet_nfts(wallet)

    return jsonify(data)

@app.route("/api/market")
def fetch_market():

    url= "https://api.coingecko.com/api/v3/coins/markets"

    params ={
        "vs_currency": "usd",
        "ids": "bitcoin, ethereum, solana, binancecoin,cardano,ripple,dogecoin",
        "order": "market_cap_desc",
        "per_page": 20,
        "page": 1,
        "sparkline": "false"
    }

    headers= {
        "x-cg-demo-api-key": COINGECKO_API_KEY
    }

    if not COINGECKO_API_KEY: 
        return jsonify({
            "error": "CoinGecko API is missing"
        }), 500
    
    try:
        response = requests.get(
            url, params=params, headers=headers, timeout=10
        )
        response.raise_for_status()

        return jsonify(response.json())
    except requests.exceptions.RequestException as error:
        return jsonify({
            "error": "failed to fetch market data",
            "details": str(error)
        }), 500

@app.route("/api/market/chart")
def fetch_market_chart():

    coin_id= request.args.get("coins","bitcoin")
    url= f"https://api.coingecko.com/api/v3/coins/{coin_id}/market_chart"

    params ={
        "vs_currency": "usd",
        "days":"7"
    }

    headers= {
        "x-cg-demo-api-keys": COINGECKO_API_KEY
    }

    try:
        response = requests.get(url, params=params, headers=headers, timeout=10)

        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as error:
        return jsonify({
            "error": "failed to fetch chart data",
            "details": str(error)
        }), 500


if __name__ == '__main__':
    app.run(debug=True)