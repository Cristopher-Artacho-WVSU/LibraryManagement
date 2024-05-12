        //INITIATED AS GLOBAL VARIABLE TO MAKE PROCESSING BETWEEN FUNCTIONS MUCH MORE EASIER
        var borrow_date;
        var return_date;

        //GLOBAL VARIABLES THAT TAKES THE VALUES FROM localStorage. TAKES IN VALUES INSTEAD OF TEXTCONTENT
        var username = localStorage.getItem("username");
        document.getElementById("username").value = username;

        var book_title = localStorage.getItem("title");
        document.getElementById("title").value = book_title;
                
        var book_author = localStorage.getItem("author");
        document.getElementById("author").value = book_author;

        var last_name = localStorage.getItem("last_name");
        var given_name = localStorage.getItem("given_name");

        const full_name = last_name + ", " + given_name;
        document.getElementById("fullName").value = full_name;

    // FUNCTION TO MAKE SURE THE INPUTS HAVE VALUES
    function validateInputs(username, full_name, book_author, borrow_date, return_date){

        if (!username || !full_name || !book_author || !borrow_date || !return_date){
            alert("All fields are required")
            throw new Error('All fields are required.');
        }
    }

    // FUNCTION THAT COMPARES THE start_date AND THE return_date. MAKES SURE THAT start_date IS HIGHER THAN return_date
    function compareDates(borrow_date, return_date) {
        //REMOVES HYPENS FIRST AND SEPARATE THE DATA INTO ARRAY
        const borrowParts = borrow_date.split('-');
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
            $('#borrow_date').val('')
            return false;
        } else {
            return true; 
        }
    }
    // INITIATES THE time
    const date = new Date();
    const hours = String(date.getHours()).padStart(2, '0'); 
    const minutes = String(date.getMinutes()).padStart(2, '0'); 
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const time = `${hours}:${minutes}:${seconds}`; 

        // THIS IS THE BOOTSTRAP FOR ALLOWING THE USER TO SELECT A DATE IN THE FORMAT OF YYYY-MM-DD
        // INITIALIZES THE DATEPICKER FOR borrow_date as YYYY-MM-DD
        $('#borrow_date').datepicker({
            format: 'yyyy-mm-dd',
            autoclose: true
        })
        // IF THERE IS ANY CHANGE IN THE VALUE OF THE borrow_date, IMMEDIATELY COMPARES WITH return_date
        .on('changeDate', function(event) {
            borrow_date = event.target.value;
            compareDates(borrow_date, $('#return_date').val());
        });
        // INITIALIZES THE DATEPICKER FOR return_date as YYYY-MM-DD
        $('#return_date').datepicker({
            format: 'yyyy-mm-dd',
            autoclose: true,
        })
        // IF THERE IS ANY CHANGE IN THE VALUE OF THE borrow_date, IMMEDIATELY COMPARES WITH return_date
        .on('changeDate', function(event) {
            return_date = event.target.value;
            compareDates($('#borrow_date').val(), return_date);
        });

    // addRequest IS TRIGGERED WHEN THE SUBMIT BUTTON FROM THE FORM IS CLICKED
    document.getElementById('reserveBookForm').addEventListener('submit', addRequest)
            
    function addRequest(){
        var request_type = "Reserve Request";

        validateInputs(username, full_name, book_author, borrow_date, return_date)
        
        const request_message = `${time}: ${username} requests "${book_title}" to be reserved for ${borrow_date} and will be returned in ${return_date}`
                
        const reserve_form = {username, full_name, request_type, request_message, book_title, book_author, borrow_date, return_date}
            fetch('/sentrequests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                    body: JSON.stringify(reserve_form)
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