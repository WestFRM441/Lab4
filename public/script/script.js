document.getElementById("searchForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const query = document.getElementById("searchInput").value;
  const type = document.querySelector('input[name="searchType"]:checked').value;
  const results = document.getElementById("results");

  let genres = [];
  let checkboxes = document.querySelectorAll("#genreSelection input:checked");

  for (let i = 0; i < checkboxes.length; i++) {
    genres.push(checkboxes[i].value);
  }

  if (!query && genres.length === 0) {
    alert("Enter an artist or select a genre.");
    return;
  }

  try {
    const res = await fetch("/discover", {
     method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query: query, type: type, genres: genres })
});


    const data = await res.json();
    results.innerHTML = "";

    if (data.error) {
      results.innerHTML = `<p>${data.error}</p>`;
      return;
    }else if ( data.length === 0) {
      results.innerHTML = `<p>No results found.</p>`;
      return;
    }

    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      let card = document.createElement("div");

      
      card.innerHTML = `
        <div class="albumCards">
          <div>
            <img class="album-image" src="${item.albumArt}" alt="Album Art">
          </div>
          <div>
            <h3>${item.artist}</h3>
            <p>Genre: ${item.genre}</p>
            <p>Year: ${item.year}</p>
          </div>
        </div>
      `;

      results.appendChild(card);
    }
  } catch (error) {
    results.innerHTML = `<p>Error loading results.</p>`;
  }
});
