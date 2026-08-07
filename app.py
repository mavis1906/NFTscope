from flask import Flask, render_template, request, jsonify

from services.nft_service import get_wallet_nfts

app = Flask(__name__)

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

if __name__ == '__main__':
    app.run(debug=True)