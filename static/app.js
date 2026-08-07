async function searchNFTs() {
    alert('Searching for NFTs...');
   
    const wallet= document.getElementById('walletAddress').value;

    if (!wallet) {
        alert('Please enter a wallet address.');
        return;
    }

    const  reponse = await fetch(`/api/nfts?wallet=${wallet}`);

    const data = await reponse.json();

    displayNFTs(data.ownedNfts);

}

function displayNFTs(nfts) {

    const container = document.getElementById('results');

    container.innerHTML = '';

    nfts.forEach(nft => {
        const image= nft.image?.cachedUrl || nft.image?.thumbnailUrl || 'https://via.placeholder.com/300?text=No+Image';

        const name = nft.name || 'Unnamed NFT';

        const contract= nft.contract.address;

        container.innerHTML += `
            <div class="card">

                <img src="${image}">

                <div class="card-content">

                    <h3>${name}</h3>

                    <p>Ethereum</p>

                    <small>Contract: ${contract}</small>
                </div>
            </div>
        `;
    })
}