import requests
from config import ALCHEMY_API_KEY

BASE_URL = f"https://eth-mainnet.g.alchemy.com/nft/v3/{ALCHEMY_API_KEY}"

def get_wallet_nfts(wallet_address):
    url = f"{BASE_URL}/getNFTsForOwner"

    params = {
        "owner": wallet_address,
    }

    response = requests.get(url, params=params)

    return response.json()