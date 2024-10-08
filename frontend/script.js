document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("photo-gallery");
  const pageInfo = document.getElementById("page-info");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const citySelect = document.getElementById("city-select");


  let currentPage = 1;
  let totalPages = 1;

  const fetchPhotos = async (page, city) => {
    try {
      const response = await fetch(`/api/photos?page=${page}&city=${city}`);
      const data = await response.json();
      if (!data.photos[0]) {
        alert("photo!");
        return;
      }

      gallery.innerHTML = data.photos
        .map(
          (photo) => `
          <div class="photo">
            <img src="${photo.url}" alt="${photo.description}">
            <p>${photo.description}</p>
          </div>
        `
        )
        .join("");
      pageInfo.textContent = `Page ${page} of ${data.totalPages}`;

      totalPages = data.totalPages;
      updatePaginationButtons();
    } catch (error) {
      console.error("Fetch error:", error);
      gallery.innerHTML = "<p>Failed to load photos.</p>";
    }
  };

  const updatePaginationButtons = () => {
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
  };

  // Handle city change
  citySelect.addEventListener("change", () => {
    selectedCity = citySelect.value;
    currentPage = 1; // Reset to the first page
    fetchPhotos(currentPage, selectedCity);
  });

  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      fetchPhotos(currentPage);
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      fetchPhotos(currentPage);
    }
  });

  selectedCity = citySelect.value;
  fetchPhotos(currentPage, selectedCity); // Initial fetch
});
