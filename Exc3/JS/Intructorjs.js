$(document).ready(function () {
    let insertionSuccess = true;

    $('#insert-button').on('click', function () {
        $.getJSON("data/instructor.js", function (instructorData) {
            instructorData.forEach(function (instructor) {
                insertInstructor(instructor);
            });
            if (insertionSuccess) {
                alert("All the instructors have been added successfully!");
                $('#insert-button').prop("disabled", true);
            } else {
                alert("Error: Some instructors could not be added!");
            }
        });
    });

    function insertInstructor(instructor) {
        let instructorData = {
            Id: instructor.id,
            Title: instructor.title,
            Name: instructor.display_name,
            Image: instructor.image_100x100,
            JobTitle: instructor.job_title
        };
        postToServer(instructorData);
    }

    function postToServer(instructorData) {
        //let port = "7294";
        //let url = `https://localhost:${port}/api/Instructors`;
        let url = `https://proj.ruppin.ac.il/cgroup88/test2/tar1/api/Instructors`;
        
        ajaxCall("POST", url, JSON.stringify(instructorData), postSCBF, postECBF);
    }

    function postSCBF(result) {
        console.log(result);
        if (!result) {
            insertionSuccess = false;
        }
    }

    function postECBF(err) {
        console.log(err);
        insertionSuccess = false;
    }

    $('#get-all-button').on('click', function () {
        //let port = "7294";
        //let url = `https://localhost:${port}/api/Instructors`;
        let url = `https://proj.ruppin.ac.il/cgroup88/test2/tar1/api/Instructors`;

        ajaxCall("GET", url, "", getAllSCBF, getAllECBF);
    });

    function getAllSCBF(instructors) {
        renderInstructors(instructors);
    }

    function getAllECBF(err) {
        console.error("Error fetching instructors: ", err);
        alert("Error fetching instructors. Please try again later.");
    }

    function renderInstructors(instructors) {
        let $instructorsList = $('#instructors-list');
        $instructorsList.empty();

        instructors.forEach(function (instructor) {
            let instructorData = `
                <div class="Instructor">
                    <h2>${instructor.title}</h2>
                    <h4>Name: ${instructor.name}</h4>
                    <h4>ID: ${instructor.id}</h4>
                    <h4>Job title: ${instructor.jobTitle}</h4>
                    <img src="${instructor.image}" alt="${instructor.name}">
                </div>
            `;
            $instructorsList.append(instructorData);
        });
    }
});