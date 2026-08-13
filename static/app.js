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

    if (!nfts || nfts.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
          <h2> No NFTs found </h2>
          <p> This wallet doesn't appear to own any NFTs on this network.</p>
          </div>
        `;
        return;
    }

    nfts.forEach(nft => {
        const image= nft.image?.cachedUrl || nft.image?.thumbnailUrl || nft.image?.originalUrl || 'https://via.placeholder.com/600×600?text=No+Image';

        const name = nft.name || `# ${nft.tokenId || "unknown"}`;

        const collection = nft.contractMetadata?.name || nft.contract?.name || 'Unknown Collection';

        const tokenID = nft.tokenID || "unknown";

        const contractAddress = nft.contract?.address || 'Unknown Address';

        const shortContract = contractAddress !== "unknown"
         ? `
         ${contractAddress.slice(0,6)}...
         ${contractAddress.slice(-4)}` : "unknown";

         const card = document.createElement("div");

         card.className = "nft-card";

         card.innerHTML = `
         
           <div class= "nft-image-wrapper">
           <img src="${image}" alt="${name}" class="nft-image">

           <span class="chain-badge">
           Ethereum </span>

           </div>

           <div class="nft-info">

           <p class="collection"> ${collection} </p>

           <h3> ${name} </h3>

           <div class="nft-details">
             
             <span> Token #${tokenID} </span>

             <span> ${shortContract} </span>

             </div>

             </div>
         `;

         container.appendChild(card);

    });

}

(() => {
  const marketplaceGrid = document.getElementById("marketplaceGrid");
  const marketplaceSearch = document.getElementById("marketplaceSearch");
  const marketplaceSort = document.getElementById("marketplaceSort");
  const marketplaceFilters = document.querySelectorAll(".market-filter");

  if (!marketplaceGrid) return;

  let marketplaceItems = [];
  let activeCategory = "all";

  const fallbackItems = [
    {
      name: "Neon Genesis",
      collection: "Digital Art",
      category: "art",
      price: 1.84,
      currency: "ETH",
      image: "https://picsum.photos/seed/nftscope1/700/700"
    },
    {
      name: "Chrome Runner",
      collection: "Future Collectibles",
      category: "collectibles",
      price: 0.72,
      currency: "ETH",
      image: "https://picsum.photos/seed/nftscope2/700/700"
    },
    {
      name: "Pixel Warrior",
      collection: "Chain Fighters",
      category: "gaming",
      price: 2.15,
      currency: "ETH",
      image: "https://picsum.photos/seed/nftscope3/700/700"
    },
    {
      name: "Void Portrait",
      collection: "Digital Art",
      category: "art",
      price: 3.42,
      currency: "ETH",
      image: "https://picsum.photos/seed/nftscope4/700/700"
    }
  ];

  function getFilteredItems() {
    const query = marketplaceSearch?.value.trim().toLowerCase() || "";

    const items = marketplaceItems.filter(item => {
      const categoryMatch =
        activeCategory === "all" || item.category === activeCategory;

      const searchMatch =
        !query ||
        String(item.name || "").toLowerCase().includes(query) ||
        String(item.collection || "").toLowerCase().includes(query);

      return categoryMatch && searchMatch;
    });

    if (marketplaceSort?.value === "price-low") {
      items.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    }

    if (marketplaceSort?.value === "price-high") {
      items.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    }

    return items;
  }

  function renderMarketplace() {
    const items = getFilteredItems();

    if (!items.length) {
      marketplaceGrid.innerHTML =
        '<div class="market-empty">No marketplace items found.</div>';
      return;
    }

    marketplaceGrid.innerHTML = items.map((item, index) => {
      const name = item.name || `Marketplace Item ${index + 1}`;
      const collection = item.collection || "Unknown Collection";
      const price = item.price ?? "—";
      const currency = item.currency || "ETH";
      const image = item.image || "https://via.placeholder.com/700?text=No+Image";
      const category = item.category || "collectibles";

      return `
        <article class="market-card" data-category="${category}">
          <div class="market-image-wrap">
            <img src="${image}" alt="${name}" loading="lazy">
            <span class="market-chain">Ethereum</span>
          </div>
          <div class="market-body">
            <p class="market-collection">${collection}</p>
            <h3 class="market-name">${name}</h3>
            <div class="market-bottom">
              <div>
                <span class="market-label">Price</span>
                <span class="market-price">${price} ${currency}</span>
              </div>
              <button class="market-buy" type="button" data-index="${index}">
                View
              </button>
            </div>
          </div>
        </article>
      `;
    }).join("");

    marketplaceGrid.querySelectorAll(".market-buy").forEach(button => {
      button.addEventListener("click", () => {
        const items = getFilteredItems();
        const item = items[Number(button.dataset.index)];

        if (!item) return;

        const name = item.name || "Marketplace Item";
        const collection = item.collection || "Unknown Collection";
        const price = item.price ?? "—";
        const currency = item.currency || "ETH";

        alert(`${name}\n${collection}\n${price} ${currency}`);
      });
    });
  }

  async function loadMarketplace() {
    marketplaceGrid.innerHTML =
      '<div class="market-empty">Loading marketplace...</div>';

    try {
      const response = await fetch("/api/market");

      if (!response.ok) {
        throw new Error("Marketplace endpoint unavailable");
      }

      const data = await response.json();
      marketplaceItems = Array.isArray(data)
        ? data
        : Array.isArray(data.items)
          ? data.items
          : [];

      if (!marketplaceItems.length) {
        marketplaceItems = fallbackItems;
      }
    } catch {
      marketplaceItems = fallbackItems;
    }

    renderMarketplace();
  }

  marketplaceFilters.forEach(filter => {
    filter.addEventListener("click", () => {
      marketplaceFilters.forEach(item => item.classList.remove("active"));
      filter.classList.add("active");
      activeCategory = filter.dataset.filter || "all";
      renderMarketplace();
    });
  });

  marketplaceSearch?.addEventListener("input", renderMarketplace);
  marketplaceSort?.addEventListener("change", renderMarketplace);

  loadMarketplace();
})();

async function loadCoinPrices() {
  const priceMap = {
    bitcoin: {
      price: document.getElementById("btc-price"),
      change: document.getElementById("btc-change"),
      tablePrice: document.getElementById("table-btc-price"),
      tableChange: document.getElementById("table-btc-change")
    },
    ethereum: {
      price: document.getElementById("eth-price"),
      change: document.getElementById("eth-change"),
      tablePrice: document.getElementById("table-eth-price"),
      tableChange: document.getElementById("table-eth-change")
    },
    solana: {
      price: document.getElementById("sol-price"),
      change: document.getElementById("sol-change"),
      tablePrice: document.getElementById("table-sol-price"),
      tableChange: document.getElementById("table-sol-change")
    },
    binancecoin: {
      price: document.getElementById("bnb-price"),
      change: document.getElementById("bnb-change"),
      tablePrice: document.getElementById("table-bnb-price"),
      tableChange: document.getElementById("table-bnb-change")
    }
  };

  try {
    const response = await fetch("/api/market");

    if (!response.ok) {
      throw new Error("Market endpoint unavailable");
    }

    const data = await response.json();
    const markets = Array.isArray(data) ? data : Array.isArray(data.coins) ? data.coins : [];

    markets.forEach((coin) => {
      const key = String(coin.id || "").toLowerCase();
      const target = priceMap[key];

      if (!target || !coin.current_price) return;

      const priceValue = Number(coin.current_price);
      const changeValue = Number(coin.price_change_percentage_24h || 0);

      const formatCurrency = (value) => `$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
      const formatChange = (value) => `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;

      target.price.textContent = formatCurrency(priceValue);
      target.change.textContent = formatChange(changeValue);
      target.change.style.color = changeValue >= 0 ? "#22c55e" : "#ef4444";

      target.tablePrice.textContent = formatCurrency(priceValue);
      target.tableChange.textContent = formatChange(changeValue);
      target.tableChange.style.color = changeValue >= 0 ? "#22c55e" : "#ef4444";
    });
  } catch {
    Object.values(priceMap).forEach(({ price, change, tablePrice, tableChange }) => {
      if (price) price.textContent = "Unavailable";
      if (change) change.textContent = "--";
      if (tablePrice) tablePrice.textContent = "Unavailable";
      if (tableChange) tableChange.textContent = "--";
    });
  }
}

loadCoinPrices();
setInterval(loadCoinPrices, 30000);

