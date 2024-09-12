document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("photo-gallery");
  const pageInfo = document.getElementById("page-info");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  let currentPage = 1;
  let totalPages; // Declare totalPages here to make it accessible in event listeners
  const limit = 10;

  const fetchPhotos = async (page) => {
    try {
      const response = await fetch(`/api/photos?page=${page}&limit=${limit}`);
      const data = await response.json();

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

      // Enable/Disable buttons based on the current page
      prevBtn.disabled = currentPage === 1;
      nextBtn.disabled = currentPage === totalPages;
    } catch (error) {
      console.error("Fetch error:", error);
      gallery.innerHTML = "<p>Failed to load photos.</p>";
    }
  };

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

  fetchPhotos(currentPage); // Initial fetch
});
