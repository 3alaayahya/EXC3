$(document).ready(function () {
    //let port = "7294";
    //let api = `https://localhost:${port}/api/User/courses`;
    let api = `https://proj.ruppin.ac.il/cgroup88/test2/tar1/api/User/courses`;

    ajaxCall("GET", api, "", successCallBackFunction, errorCallBackFunction);

    function successCallBackFunction(courses) {
        console.log(courses);
        $("#my-courses-list").empty();

        courses.forEach(function (course) {
            renderCourse(course);
        });
    }

    $(document).on("click", "#adminPage", function () {
        if (loggedInUser && loggedInUser.isActive1 && loggedInUser.isAdmin1) {
            window.location.href = `Admin.html`;
        } else {
            alert("sign in as an admin to visit this page!");
            openLoginModal(); // Open login modal if the user is not logged in as an admin
        }
    });

    $("#logoutBtn").click(function () {
        //let port = "7294";
        //let url = `https://localhost:${port}/api/User/logout`;
        let url = `https://proj.ruppin.ac.il/cgroup88/test2/tar1/api/User/logout`;

        ajaxCall("POST", url, JSON.stringify(loggedInUser), logoutSCBF, logoutECBF);

        localStorage.removeItem('loggedInUser');
        loggedInUser = null;
        window.location.href = "index.html"; // Reload the page after logout
    });

    function logoutSCBF(result) {
        console.log(result);
    }

    function logoutECBF(result) {
        console.log(result);
    }

    function errorCallBackFunction(err) {
        console.error("Error fetching courses: ", err);
        $("#my-courses-list").html("<p>Error fetching courses. Please try again later.</p>");
    }

    $('#fetch-by-duration').on('click', function () {
        let minDuration = parseFloat($('#min-duration').val());
        let maxDuration = parseFloat($('#max-duration').val());

        if (!isNaN(minDuration) && !isNaN(maxDuration) && maxDuration >= minDuration) {
            fetchCoursesByDurationRange(minDuration, maxDuration);
        } else {
            alert('Please enter valid values for both minimum and maximum duration.');
        }
    });

    $('#fetch-by-rating').on('click', function () {
        let minRating = parseFloat($('#min-rating').val());
        let maxRating = parseFloat($('#max-rating').val());

        if (!isNaN(minRating) && !isNaN(maxRating) && maxRating >= minRating && minRating >= 1 && maxRating <= 5) {
            fetchCoursesByRatingRange(minRating, maxRating);
        } else {
            alert('Please select valid values for both minimum and maximum rating (1 to 5).');
        }
    });

    $('#delete-by-id').on('click', function () {
        let courseId = parseInt($('#delete-id').val());
        if (!isNaN(courseId)) {
            deleteCourseById(courseId);
        } else {
            alert('Please enter a valid course ID.');
        }
    });

    $(document).on('click', '.delete-course', function () {
        let courseId = $(this).data('id');
        if (confirm('Are you sure you want to delete this course?')) {
            deleteCourseById(courseId);
        }
    });

    function fetchCoursesByDurationRange(min, max) {
        //let url = `https://localhost:${port}/api/User/search?durationFrom=${min}&DurationTo=${max}`;
        let url = `https://proj.ruppin.ac.il/cgroup88/test2/tar1/api/User/search?durationFrom=${min}&DurationTo=${max}`;
        ajaxCall("GET", url, "", successCallBackFunction, errorCallBackFunction);
    }

    function fetchCoursesByRatingRange(min, max) {
        //let url = `https://localhost:${port}/api/User/searchByRouting/ratingFrom/${min}/ratingTo/${max}`;
        let url = `https://proj.ruppin.ac.il/cgroup88/test2/tar1/api/User/searchByRouting/ratingFrom/${min}/ratingTo/${max}`;

        ajaxCall("GET", url, "", successCallBackFunction, errorCallBackFunction);
    }

    function deleteCourseById(id) {
        //let url = `https://localhost:${port}/api/User/DeleteById/id/${id}`;
        let url = `https://proj.ruppin.ac.il/cgroup88/test2/tar1/api/User/DeleteById/id/${id}`;

        ajaxCall("DELETE", url, "", deleteSuccessCallBackFunction, deleteErrorCallBackFunction);
    }

    function deleteSuccessCallBackFunction(response) {
        console.log(response); // Display the response message from the server
        alert("The course has been deleted seccessfuly");
        ajaxCall("GET", api, "", successCallBackFunction, errorCallBackFunction);
    }

    function deleteErrorCallBackFunction(err) {
        console.log(err);
        alert("The course with this id has been not found!");
    }

    $(document).on('click', '#reset', function () {
        ajaxCall("GET", api, "", successCallBackFunction, errorCallBackFunction);
    });

    function renderCourse(course) {
        var courseHtml = `
                            <div class="course">
                                <h2>${course.title1}</h2>
                                <h4>ID: ${course.id}</h4>
                                <h4>Rating: ${course.rating1.toFixed(1)}</h4>
                                <h4>Number of Reviews: ${course.numberOfReviews1}</p>
                                <h4>Last Update: ${course.lastUpdate1}</h4>
                                <h4>Duration: ${course.duration1} hours</h4>
                                <h4>Instructor ID: ${course.instructorsId1}</h4>
                                <h4><a href="${course.urL1}" target="_blank">Go to course</a></h4><br/>
                                <img src="${course.imageReference1}" alt="${course.title1}">
                                <button class="delete-course" data-id="${course.id}">Delete</button>
                            </div>
                        `;
        $("#my-courses-list").append(courseHtml);
    }
});

let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

$(document).on("click", "#adminPage", function () {
    if (loggedInUser && loggedInUser.isActive1 && loggedInUser.isAdmin1) {
        window.location.href = `Admin.html`;
    } else {
        alert("sign in as an admin to visit this page!");
        openLoginModal(); // Open login modal if the user is not logged in as an admin
    }
});

$("#logoutBtn").click(function () {
    // Ask the user for confirmation before logging out
    if (confirm("Are you sure you want to logout?")) {
        let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        //let port = "7294";
        //let url = `https://localhost:${port}/api/User/logout`;
        let url = `https://proj.ruppin.ac.il/cgroup88/test2/tar1/api/User/logout`;

        ajaxCall("POST", url, JSON.stringify(loggedInUser), logoutSCBF, logoutECBF);

        localStorage.removeItem('loggedInUser');
        loggedInUser = null;
        window.location.href = "index.html"; // Reload the page after logout
    }
});
function logoutSCBF(result) {
    console.log(result);
}
function logoutECBF(result) {
    console.log(result);
}

