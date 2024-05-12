        // DOMContentLoaded IS TRIGGERED THE WEBPAGE CONTENT IS LOADED
        document.addEventListener('DOMContentLoaded', function() {
            // REFERENCES THE logInForm SUBMIT BUTTON TO TRIGGER THE FUNCTION TO SEARCH AND COMPARE USERNAME AND PASSWORDS
            document.getElementById('logInForm').addEventListener('submit', async function(event) {
                event.preventDefault();
        
                const login_username = document.getElementById('username').value;
                const login_password = document.getElementById('password').value;
        
                    // USES THE VALUE OF THE username TO SEE IF IT MATCHES ANY IN THE DATABASE
                    const response = await fetch(`/users?username=${username}`, {
                        method: 'GET'
                    });
        
                    if (!response.ok) {
                        throw new Error('Failed to fetch user data. Server returned ' + response.status);
                    }
                        const userData = await response.json();
        
                        // CONDITION FOR PASSWORD AND USERNAME TO MATCH
                        const user = userData.find(user => user.username === login_username && user.password ===login_password);
                        if (user) {
                            // IF user IS FOUND, DECONSTRUCTS THE CONTENT OF THE JSON IN FIELDS
                            const {
                                _id,
                                last_name,
                                username,
                                password,
                                given_name,
                                email_address,
                                contact_number,
                                profile_picture,
                                city,
                                province,
                                barangay
                            } = user;
        
                            // STORED IN THE LocalStorage
                            localStorage.setItem("_id", _id);
                            localStorage.setItem("username", username); 
                            localStorage.setItem("password", password); 
                            localStorage.setItem("lastName", last_name);
                            localStorage.setItem("givenName", given_name);
                            localStorage.setItem("emailAddress", email_address);
                            localStorage.setItem("contactNumber", contact_number);
                            localStorage.setItem("profilePicture", profile_picture);
                            
                            localStorage.setItem("city", city);
                            localStorage.setItem("province", province);
                            localStorage.setItem("barangay", barangay);
                            // REDIRECT TO THE USERS DASHBOARD AFTER THE OPERATION IS DONE
                            window.location.href = '/library-management-system/users/dashboard';
                        } else { //IF USER WAS NOT FOUND, THE ALERT TRIGGERS
                            alert('Invalid username or password. Please try again.');
                        }
            });
        });