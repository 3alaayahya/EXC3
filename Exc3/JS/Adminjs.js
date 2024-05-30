let mode;
$(document).ready(function () {
    //let port = "7294";
    //let url = `https://localhost:${port}/api/Courses`;
    let url = `https://proj.ruppin.ac.il/cgroup88/test2/tar1/api/Courses`
    ajaxCall("GET", url, "", getAllSCBF, getAllECBF);

    $('#editCourseBtn').on('click', function () {
        mode = "edit";
        const courseId = $('#courseDatalist').val();
        console.log("Edit course button clicked, course ID: ", courseId);
        $('#courseID').prop('readonly', true);
        $('#courseInstructorId').prop('readonly', true);
        if (courseId) {
            fetchCourseDetails(courseId);
        } else {
            alert("Please enter a course ID.");
        }
    });

    $('#insertCourseBtn').on('click', function () {
        mode = "insert";
        $('#courseID').prop('readonly', false);
        $('#courseInstructorId').prop('readonly', false);
        clearForm();
        $('#formMode').val('insert');
        showModal();
    });
});

function clearForm() {
    $('#courseId').val('');
    $('#courseTitle').val('');
    $('#courseID').val('');
    $('#courseInstructorId').val('');
    $('#courseURL').val('');
    $('#courseDuration').val('');
    $('#courseImageReference').val('');
    $('#courseImageUpload').val('');
    $('#courseRating').val('0');
    $('#courseReviews').val('0');
}

// Modal handling
var modal = document.getElementById("editCourseModal");
var span = document.getElementsByClassName("close")[0];

span.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function getCourses() {
    //let port = "7294";
    //let url = `https://localhost:${port}/api/Courses`;
    let url = `https://proj.ruppin.ac.il/cgroup88/test2/tar1/api/Courses`

    ajaxCall("GET", url, "", getAllSCBF, getAllECBF);
}

function getAllSCBF(courses) {
    renderCourses(courses);
}

function getAllECBF(err) {
    console.error("Error fetching courses: ", err);
    alert("Error fetching courses. Please try again later.");
}

$('#sortCoursesBtn').on('click', function () {
    $.getJSON("data/course.js", function (coursesData) {
        coursesData.forEach(function (course) {
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
            };
            postToServer(courseData);
        });
        getCourses();
    });
    document.getElementById('sortCoursesBtn').disabled = true;
});

$(document).on('click', '.edit-course', function () {
    mode = "edit";
    const courseId = $(this).data('id');
    $('#courseID').prop('readonly', true);
    $('#courseInstructorId').prop('readonly', true);
    console.log("Edit course button inside course clicked, course ID: ", courseId); // Debugging log
    fetchCourseDetails(courseId);
});

function getAllSCBF(courses) {
    renderCourses(courses);
    populateDatalist(courses);
}

function getAllECBF(err) {
    console.error("Error fetching courses: ", err);
    //alert("Error fetching courses. Please try again later.");
}

function renderCourses(courses) {
    let $coursesList = $('#course-list');
    $coursesList.empty();

    courses.forEach(function (course) {
        let courseData = `
    <div class="course">
        <h2>${course.title1}</h2>
        <h4>ID: ${course.id}</h4>
        <h4>Rating: ${course.rating1.toFixed(1)}</h4>
        <h4>Number of Reviews: ${course.numberOfReviews1}</h4>
        <h4>Last Update: ${course.lastUpdate1}</h4>
        <h4>Duration: ${course.duration1} hours</h4>
        <h4>Instructor ID: ${course.instructorsId1}</h4>
        <h4><a href="${course.urL1}" target="_blank">Go to course</a></h4>
        <br />
        <img src="${course.imageReference1}" alt="${course.title1}">
            <button class="edit-course" data-id="${course.id}">Edit</button>
    </div>
    `;
        $coursesList.append(courseData);
    });
}

function populateDatalist(courses) {
    let $datalist = $('#courses');
    $datalist.empty();

    courses.forEach(function (course) {
        let option = `<option value="${course.id}">${course.title1}</option>`;
        $datalist.append(option);
    });
}

function fetchCourseDetails(courseId) {
    //let port = "7294";
    //let url = `https://localhost:${port}/api/Courses/getCourseById/${courseId}`;
    let url = `https://proj.ruppin.ac.il/cgroup88/test2/tar1/api/Courses/getCourseById/${courseId}`;
    console.log("Fetching course details for course ID: ", courseId); // Debugging log

    ajaxCall("GET", url, "", function (course) {
        if (!course) {
            alert("There is no course with this ID");
        }
        else {
            console.log("Fetched course details: ", course); // Debugging log
            populateEditForm(course);
            showModal();
        }
    }, function (err) {
        console.error("Error fetching course details: ", err);
        //alert("Error fetching course details. Please enter a valid course ID");
    });
}

function populateEditForm(course) {
    $('#courseID').val(course.id);
    $('#courseTitle').val(course.title1);
    $('#courseURL').val(course.urL1);
    $('#courseDuration').val(course.duration1);
    $('#courseImageReference').val(course.imageReference1);
    $('#courseReviews').val(course.numberOfReviews1);
    $('#courseRating').val(course.rating1);
    $('#courseInstructorId').val(course.instructorsId1);
}

function showModal() {
    console.log("Showing modal"); // Debugging log
    var modal = document.getElementById("editCourseModal");
    modal.style.display = "block";
}

// Modify the updateCourse function
async function updateCourse() {
    let updatedCourse = {
        Id: $('#courseID').val(),
        Title1: $('#courseTitle').val(),
        URL1: $('#courseURL').val(),
        Rating1: $('#courseRating').val(),
        NumberOfReviews1: $('#courseReviews').val(),
        InstructorsId1: $('#courseInstructorId').val(),
        Duration1: parseFloat($('#courseDuration').val()),
        ImageReference1: $('#courseImageReference').val(), // This will be updated after image upload
        LastUpdate1: new Date().toISOString()
    };
    //let port = "7294";
    //let url = `https://localhost:${port}/api/Courses/update/${$('#courseID').val()}`;
    let url = `https://proj.ruppin.ac.il/cgroup88/test2/tar1/api/Courses/update/${$('#courseID').val()}`;
    let imageFile = $('#courseImageUpload')[0].files[0];
    if (imageFile) {
        try {
            const uploadResult = await uploadCourseImage(updatedCourse.Id, imageFile);
            updatedCourse.ImageReference1 = uploadResult.filePath; // Update the image reference with the uploaded file path
        } catch (err) {
            console.error("Error uploading image: ", err.responseJSON?.message || err.statusText);
            alert("Error uploading image: " + (err.responseJSON?.message || "Please try again later."));
            return;
        }
    }

    ajaxCall("PUT", url, JSON.stringify(updatedCourse), function (result) {
        if (result) {
            console.log("Update course success response: ", result);
            getCourses();
            $('#editCourseModal').hide();
            alert("The course has been updated!");
        } else {
            alert("There is a course with the same title!");
        }
    }, function (res) {
        $('#editCourseModal').hide();
        alert("The course has been updated!");
        getCourses();
    });
}

function uploadCourseImage(courseId, imageFile) {
    return new Promise((resolve, reject) => {
        //let port = "7294";
        //let url = `https://localhost:${port}/api/Courses/uploadImage/${courseId}`;
        let url = `https://proj.ruppin.ac.il/cgroup88/test2/tar1/api/Courses/uploadImage/${courseId}`;
        let formData = new FormData();
        formData.append('image', imageFile);

        $.ajax({
            type: 'POST',
            url: url,
            data: formData,
            contentType: false,
            processData: false,
            success: function (result) {
                resolve(result);
            },
            error: function (err) {
                reject(err);
            }
        });
    });
}

function uploadCourseImage(courseId, imageFile) {
    return new Promise((resolve, reject) => {
        //let port = "7294";
        //let url = `https://localhost:${port}/api/Courses/uploadImage/${courseId}`;
        let url = `https://proj.ruppin.ac.il/cgroup88/test2/tar1/api/Courses/uploadImage/${courseId}`;
        let formData = new FormData();
        formData.append('image', imageFile);

        $.ajax({
            type: 'POST',
            url: url,
            data: formData,
            contentType: false,
            processData: false,
            success: function (result) {
                resolve(result);
            },
            error: function (err) {
                reject(err);
            }
        });
    });
}

function uploadCourseImage(courseId, imageFile) {
    return new Promise((resolve, reject) => {
        //let port = "7294";
        //let url = `https://localhost:${port}/api/Courses/uploadImage/${courseId}`;
        let url = `https://proj.ruppin.ac.il/cgroup88/test2/tar1/api/Courses/uploadImage/${courseId}`;
        let formData = new FormData();
        formData.append('image', imageFile);

        $.ajax({
            type: 'POST',
            url: url,
            data: formData,
            contentType: false,
            processData: false,
            success: function (result) {
                resolve(result);
            },
            error: function (err) {
                reject(err);
            }
        });
    });
}

function extractDuration(durationStr) {
    const durationMatch = durationStr.match(/\d+(\.\d+)?/);
    return parseFloat(durationMatch[0]);
}

function postToServer(courseData) {
    //let port = "7294";
    //let url = `https://localhost:${port}/api/Courses`;
    let url = `https://proj.ruppin.ac.il/cgroup88/test2/tar1/api/Courses`;
    ajaxCall("POST", url, JSON.stringify(courseData), function (result) {
        console.log(result);
        getCourses();
    }, function (err) {
        console.error("Error posting course: ", err);
    });
}

$(document).on("click", "#myCoursesBtn", function () {
    window.location.href = `MyCourses.html`;
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

$('#editCourseForm').on('submit', function (event) {
    event.preventDefault();
    if (mode === 'edit') {
        updateCourse();
    } else {
        insertCourse();
    }
});

function insertCourse() {
    let newCourse = {
        Id: $('#courseID').val(),
        Title1: $('#courseTitle').val(),
        URL1: $('#courseURL').val(),
        Rating1: 0, // Default rating value for new course
        NumberOfReviews1: 0, // Default reviews value for new course
        InstructorsId1: $('#courseInstructorId').val(),
        Duration1: parseFloat($('#courseDuration').val()),
        ImageReference1: $('#courseImageReference').val(),
        LastUpdate1: new Date().toISOString()
    };

    //let port = "7294";
    let instructorId = newCourse.InstructorsId1;
/*    let instructorCheckUrl = `https://localhost:${port}/api/Instructors/${instructorId}`;*/
    let instructorCheckUrl = `https://proj.ruppin.ac.il/cgroup88/test2/tar1/api/Instructors/${instructorId}`;

    // Check if the instructor exists
    ajaxCall("GET", instructorCheckUrl, null, function (instructorExists) {
        if (instructorExists) {
            //let url = `https://localhost:${port}/api/Courses`;
            let url = `https://proj.ruppin.ac.il/cgroup88/test2/tar1/api/Courses`;
            ajaxCall("POST", url, JSON.stringify(newCourse), function (result) {
                if (result) {
                    console.log("Insert course success response: ", result); // Log the success response
                    getCourses();
                    $('#editCourseModal').hide();
                    alert("The new course has been inserted successfully!");
                } else {
                    alert("This course ID or title already exists!");
                }
            }, function (err) {
                console.error("Error inserting course: ", err);
                alert("Error inserting course. Please try again later.");
            });

            let imageFile = $('#courseImageUpload')[0].files[0];
            if (imageFile) {
                uploadCourseImage(newCourse.Id, imageFile);
            }
        } else {
            alert("Instructor not found. Please check the instructor ID and try again.");
        }
    }, function (err) {
        console.error("Error checking instructor: ", err);
        alert("Error checking instructor. Please try again later.");
    });
}