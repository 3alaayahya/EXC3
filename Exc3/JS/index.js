$(document).ready(function () {
    // Initial check for user login status
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    let registeredUser;
    updateNavbar();

    // Fetch courses data from JSON file
    $.getJSON("data/course.js", function (coursesData) {
        // Render each course
        coursesData.forEach(function (course) {
            renderCourse(course);
        });
    });

    function extractDuration(durationStr) {
        const durationMatch = durationStr.match(/\d+(.\d+)?/);
        return parseFloat(durationMatch[0]);
    }

    // Function to render each course
    function renderCourse(course) {
        let courseData = {
            Id: course.id,
            Title1: course.title,
            URL1: "https://www.udemy.com" + course.url,
            Rating1: course.rating,
            NumberOfReviews1: course.num_reviews,
            InstructorsId1: course.instructors_id,
            ImageReference1: course.image,
            Duration1: extractDuration(course.duration),
            LastUpdate1: course.last_update_date,
        }

        var courseHtml = `
            <div class="course">
                <h2>${course.title}</h2>
                <h4>ID: ${course.id}</h4>
                <h4>Rating: ${course.rating.toFixed(1)}</h4>
                <h4>Number of Reviews: ${course.num_reviews}</h4>
                <h4>Last Update: ${course.last_update_date}</h4>
                <h4>Duration: ${course.duration}</h4>
                <h4>Instructor ID: ${course.instructors_id}</h4>
                <h4><a href="https://www.udemy.com${course.url}" target="_blank">Go to course</a></h4><br/>
                <button class="add-course" data-course='${JSON.stringify(courseData)}'>Add Course</button><br/>
                <img src="${course.image}" alt="${course.title}">
            </div>
        `;
        $("#course-list").append(courseHtml);
    }
    // Event listener for Add Course button
    $(document).on("click", ".add-course", function () {
        if (loggedInUser && loggedInUser.isActive1) {
            let courseData = JSON.parse($(this).attr("data-course"));
            postToServer(courseData); // Call the function to post the course to the server
        } else {
            alert("You are not signed in! sign in or register now")
            openLoginModal(); // Open login modal if the user is not logged in
        }
    });

    $(document).on("click", "#adminPage", function () {
        if (loggedInUser && loggedInUser.isActive1 && loggedInUser.isAdmin1) {
            window.location.href = `Admin.html`;
        } else {
            alert("sign in as an admin to visit this page!");
            openLoginModal(); // Open login modal if the user is not logged in as an admin
        }
    });

    $(document).on("click", "#myCoursesBtn", function () {
        if (loggedInUser && loggedInUser.isActive1) {
            window.location.href = `MyCourses.html`;
        } else {
            alert("sign in to see your courses!");
            openLoginModal(); // Open login modal if the user is not logged in as an admin
        }
    });

    function postToServer(courseData) {
        //let port = "7294";
        //let url = `https://localhost:${port}/api/User/course`;
        let url = `https://proj.ruppin.ac.il/cgroup88/test2/tar1/api/User/course`;
        
        ajaxCall("POST", url, JSON.stringify(courseData), postSCBF, postECBF);
    }

    function postSCBF(result) {
        console.log(result);
        if (result) {
            alert("The course has been added!");
        } else {
            alert("Error: This course has been already added!")
        }
    }

    function postECBF(err) {
        console.log(err);
    }

    // Function to open the login modal
    function openLoginModal() {
        $("#registerFormContainer").hide();
        $("#loginFormContainer").show();
        $("#loginModal").css("display", "block");
    }

    // Function to open the registration modal
    function openRegisterModal() {
        $("#loginFormContainer").hide();
        $("#registerFormContainer").show();
        $("#loginModal").css("display", "block");
    }

    // Get the modal
    var modal = document.getElementById("loginModal");

    // Get the button that opens the modal
    var loginBtn = document.getElementById("loginBtn");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks the login button, open the login modal
    loginBtn.onclick = openLoginModal;

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Toggle between login and registration forms
    $("#showRegisterForm").click(openRegisterModal);
    $("#showLoginForm").click(openLoginModal);

    // Validate forms
    $("#loginForm").submit(function (event) {
        event.preventDefault();
        var email = $("#loginEmail").val();
        var password = $("#loginPassword").val();
        var user = {
            Email1: email,
            Password1: password
        }
        if (email && password.length >= 4) {
            loginToServer(user);
        } else {
            alert("All fields are mandatory and password must be at least 4 characters.");
        }
    });

    $("#registerForm").submit(function (event) {
        event.preventDefault(); // Prevent form submission from reloading the page

        // Clear existing error messages
        $(".error-message").remove();

        var name = $("#registerName").val();
        var id = $("#registerId").val();
        var email = $("#registerEmail").val();
        var password = $("#registerPassword").val();
        var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        var user = {
            Name1: name,
            Id1: id,
            Email1: email,
            Password1: password
        };

        var isValid = true;

        if (!name) {
            $("#registerName").before('<div class="error-message">Name is required and must be at least 7 letters.</div>');
            isValid = false;
        }
        if (!email.match(emailPattern)) {
            $("#registerEmail").before('<div class="error-message">Email must be valid, Format: X@X.XX.</div>');
            isValid = false;
        }
        if (password.length < 4) {
            $("#registerPassword").before('<div class="error-message">Password must be at least 4 characters.</div>');
            isValid = false;
        }
        if (id.length != 9 || !/^\d+$/.test(id)) {
            $("#registerId").before('<div class="error-message">Id must be 9 numbers.</div>');
            isValid = false;
        }

        if (isValid) {
            registerToServer(user);
        }
    });

    function registerToServer(user) {
        // Your logic to register the user to the server goes here.
        console.log("Registering user to server: ", user);
    }


    function registerToServer(user) {
        //let port = "7294";
        //let url = `https://localhost:${port}/api/User/register`;
        let url = `https://proj.ruppin.ac.il/cgroup88/test2/tar1/api/User/register`
        
        registeredUser = user;

        ajaxCall("POST", url, JSON.stringify(user), registerSCBF, registerECBF);
    }
    function registerSCBF(result) {
        console.log(result);
        if (result) {
            alert("The user has been registered successfully");
            loginToServer(registeredUser);
        }
    }
    function registerECBF(err) {
        console.log(err);
        alert("this email already in use!");

    }

    function loginToServer(user) {
        //let port = "7294";
        //let url = `https://localhost:${port}/api/User/login?email=${user.Email1}&password=${user.Password1}`;
        let url = `https://proj.ruppin.ac.il/cgroup88/test2/tar1/api/User/login?email=${user.Email1}&password=${user.Password1}`;

        ajaxCall("POST", url, JSON.stringify(user), function (result) {
            if (result && result.user) {
                localStorage.setItem('loggedInUser', JSON.stringify(result.user));
                loggedInUser = result.user;
                updateNavbar();
                location.reload(); // Reload the page after login
            }
        }, function (err) {
            console.log(err);
            alert("The password or email is incorrect!");
        });
    }

    // Update navbar based on login status
    function updateNavbar() {
        if (loggedInUser && loggedInUser.isActive1) {
            $("#loginBtn").hide();
            $("#hiUser").show();
            $("#hiUser").text(`Hi ${loggedInUser.name1}!`);
            $("#logoutBtn").show();
            $("#logoutBtn").click(function () {
                // Ask the user for confirmation before logging out
                if (confirm("Are you sure you want to logout?")) {
                    //let port = "7294";
                    //let url = `https://localhost:${port}/api/User/logout`;
                    let url = `https://proj.ruppin.ac.il/cgroup88/test2/tar1/api/User/logout`;
                    
                    ajaxCall("POST", url, JSON.stringify(loggedInUser), logoutSCBF, logoutECBF);

                    localStorage.removeItem('loggedInUser');
                    loggedInUser = null;
                    window.location.href = "index.html"; // Reload the page after logout
                }
            });
        } else {
            $("#loginBtn").show();
            $("#logoutBtn").hide();
            $("#navbar p").hide();
            console.log(loggedInUser);
        }
    }
    function logoutSCBF(result) {
        console.log(result);
    }
    function logoutECBF(result) {
        console.log(result);
    }
});