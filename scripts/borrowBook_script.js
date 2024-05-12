        //INITIATED AS GLOBAL VARIABLE TO MAKE PROCESSING BETWEEN FUNCTIONS MUCH MORE EASIER
        var return_date;

        //GLOBAL VARIABLES THAT TAKES THE VALUES FROM localStorage. TAKES IN VALUES INSTEAD OF TEXTCONTENT
        var username = localStorage.getItem("username");
        document.getElementById("username").value = username;

        var book_title = localStorage.getItem("title");
        document.getElementById("title").value = book_title;
        
        var book_author = localStorage.getItem("author");
        document.getElementById("author").value = book_author

        var last_name = localStorage.getItem("last_name");
        var given_name = localStorage.getItem("given_name");

        const full_name = last_name + ", " + given_name;
        document.getElementById("fullName").value = full_name


    // FUNCTION TO MAKE SURE THE INPUTS HAVE VALUES
    function validateInputs(username, full_name, book_author, borrow_date, return_date){

        if (!username || !full_name || !book_author || !borrow_date || !return_date){
            alert("All fields are required")
            throw new Error('All fields are required.');
        }
    }

    // FUNCTION THAT COMPARES THE start_date AND THE return_date. MAKES SURE THAT start_date IS HIGHER THAN return_date
    function compareDates(start_date, return_date) {
        //REMOVES HYPENS FIRST AND SEPARATE THE DATA INTO ARRAY
        const borrowParts = start_date.split('-');
        const borrowYear = parseInt(borrowParts[0], 10);
        const borrowMonth = parseInt(borrowParts[1], 10) - 1; 
        const borrowDay = parseInt(borrowParts[2], 10);

        const returnParts = return_date.split('-');
        const returnYear = parseInt(returnParts[0], 10);
        const returnMonth = parseInt(returnParts[1], 10) - 1; 
        const returnDay = parseInt(returnParts[2], 10);
        // CONCATENATE THE ARRAY VALUES THEN COMPARE
        const borrowDateInt = borrowYear * 10000 + (borrowMonth + 1) * 100 + borrowDay;
        const returnDateInt = returnYear * 10000 + (returnMonth + 1) * 100 + returnDay;
        if (returnDateInt < borrowDateInt) {
            // IF THE start_date VALUE IS HIGHER THAN return_date, RETURNS THIS:
            alert("Invalid date: Return date cannot be earlier than borrow date");
            $('#return_date').val('');
            return false; 
        } else {
            return true; 
        }
    }


    // INITIATES THE start_date 
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0'); 
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear(); 
    const start_date = `${year}-${month}-${day}`; 

    // INITIATES THE time
    const hours = String(date.getHours()).padStart(2, '0'); 
    const minutes = String(date.getMinutes()).padStart(2, '0'); 
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const time = `${hours}:${minutes}:${seconds}`; 

    //ASSIGNS THE VALUE OF start_date TO INPUT start_date
    document.getElementById("start_date").value = start_date;

    // THIS IS THE BOOTSTRAP FOR ALLOWING THE USER TO SELECT A DATE IN THE FORMAT OF YYYY-MM-DD
    $('#return_date').datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
    });
    // IF THE return_date VALUE IS CHANGED, IT WILL THEN PROCEED TO compareDates() FUNCTION
    $('#return_date').on('changeDate', function(event) {
        return_date = event.target.value;
        compareDates(start_date, return_date);
    });


    // addRequest IS TRIGGERED WHEN THE SUBMIT BUTTON FROM THE FORM IS CLICKED
    document.getElementById('borrowBookForm').addEventListener('submit', addRequest)

    function addRequest(){
        // INITIALIZES THE VALUE OF borrow_Date TO start_date
        var borrow_date = start_date;
        var request_type = "Borrow Request";
        validateInputs(username, full_name, book_author, borrow_date, return_date)

        // A MESSAGE FOR THE sentRequest WEBPAGE
        const request_message = `${time}: ${username} requests "${book_title}" to be borrowed. It will be returned in ${return_date}`
    
        const borrow_form = {username, full_name, request_type, request_message, book_title, book_author, borrow_date, return_date}
            fetch('/sentrequests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                    body: JSON.stringify(borrow_form)
            })
            .then(data => {
                console.log('Book added successfully:', data);
                alert('Book added successfully!');
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to send notification. Please try again.');
            });
    }