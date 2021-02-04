//------------------------------------Variables
var issueContainerEl = document.querySelector("#issues-container");


//-------------------------------------Functions
function getRepoIssues(repo) {
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=dec";
    console.log(repo);
    
    fetch(apiUrl).then(function(response) {
        //request was successful
        if(response.ok) {
            response.json().then(function(data) {
                displayIssues(data);
                console.log(data);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error) {
        //Notice this '.catch()' getting chained on the end of '.then()' method
        alert("Unable to connect to GitHub-wlr");
    });
}

function displayIssues(issuesJSON) {
    let issuesLength = issuesJSON.length;
    if (issuesLength === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }

    for (let i = 0; i < issuesLength; i++) {
        const element = issuesJSON[i];
        //create a link element to take users to the issue on github
        var issueEl = document.createElement("a");
        issueEl.classList="list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href",element.html_url);
        issueEl.setAttribute("target", "_blank");

        //create span to hold issues title
        var titleEl = document.createElement("span");
        titleEl.textContent=element.title;

        //append to container
        issueEl.appendChild(titleEl);

        //create a type element
        var typeEl = document.createElement("span");

        //check if issue is an actual issue or a pull request
        if (element.pull_request) {
            typeEl.textContent = "(Pull request)";
        } else {
            typeEl.textContent = "(Issue)";
        }

        //append to container
        issueEl.appendChild(typeEl);

        //append to html
        issueContainerEl.appendChild(issueEl);
    }

}

//--------------------------------------Calls
getRepoIssues("apple/ccs-caldavtester");
// getRepoIssues("rolanduwxcc/ch1-accessibility");
