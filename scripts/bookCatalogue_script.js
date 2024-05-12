// SCRIPT FOR SIDEBAR
function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle('active');
  }
// SCRIPT FOR THE SUBMENU SIDEBAR
  function toggleSubMenu() {
    var subMenu = document.getElementById("userSubMenu");
    subMenu.classList.toggle('active');
  }
// FUNCTION FOR HIDING THE SUBMENU
  function hideSubMenu() {
  var subMenu = document.getElementById("userSubMenu");
  subMenu.classList.remove('active'); 
  subMenu.classList.add('inactive')
}

// FOR THE USER VALUES
  const username = localStorage.getItem("username");
  document.getElementById("username").textContent = username;
  const profile_picture = localStorage.getItem("profile_picture");
  document.getElementById("profilePicture").src = profile_picture;



//FOR THE BOOK CATALOGUE
document.addEventListener("DOMContentLoaded", function() {
  const bookCatalogue = document.getElementById("bookCatalogueDiv");

  // FETCHES THE BOOK DATA FROM THE '/books'. 
  fetch('/books')
      .then(response => response.json())
      .then(data => {
          // THE FIELDS AND THEIR VALUES ARE TAKEN AND SENT TO renderBooks TO BE PROCESSED
          renderBooks(data, bookCatalogue);
      }) //IF THERE IS NO BOOK DATA
      .catch(error => {
          console.error('Error fetching books:', error);
          throw new Error('Error Fetching books');
      });
});

  // FOR EACH DATA SENT, THE createBookElement PROCESSES IT TO ADD THE IMAGE AND TITLE WHILE USING localStorage TO OTHER VALUES
  function renderBooks(books, bookCatalogue) {
      books.forEach(book => {
          const bookElement = createBookElement(book);
          // IF THE PROCESS IS DONE, IT IS APPENDED TO bookCatalogue TO HAVE ITS OWN DIVISION
          bookCatalogue.appendChild(bookElement);
      });
  }
  
  // FUNCTION TO ADD IMAGE AND TITLE, AND localStorage THE DATA TAKEN FROM THE '/books' COLLECTION 
  function createBookElement(book) {
  const bookDiv = document.createElement("div");
  bookDiv.classList.add("book");

  // THE img TAKES ITS VALUE FROM THE FIELD 'picture' 
  const img = document.createElement("img");
  img.src = book.picture;
  // THE title GETS ITS TEXTCONTENT FROM THE FIELD 'title'
  const title = document.createElement("div");
  title.classList.add("title");
  title.textContent = book.title;

  // THE PURPOSE OF THIS IS THAT WHEN THE bookCatalogue IS CLICKED, THE VALUES FOR THESE ARE STORED AND WILL BE USED IN THE bookInfo WEBPAGE
  bookDiv.addEventListener("click", () => {
      localStorage.setItem("_id", book.book_id);
      localStorage.setItem("title", book.title);
      localStorage.setItem("author", book.author);
      localStorage.setItem("date", book.date);
      localStorage.setItem("genre", book.genre);
      localStorage.setItem("copies", book.copies);
      localStorage.setItem("picture", book.picture);

      // REDIRECTS THE USER/LIBRARIAN TO THE bookInfo WEBPAGE
      window.location.href = "/library-management-system/users/dashboard/book-catalogue/book-details";
  });
  // THE IMAGE AND TITLE IS APPENDED TO THE bookDiv, and the bookDiv will also be appended to the BookCatalogue
  bookDiv.appendChild(img);
  bookDiv.appendChild(title);

  return bookDiv;
}
