//--------------------------------VARIABLES
var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");
var languageButtonEl = document.getElementById("language-buttons");

//--------------------------------------------------FUNCTIONS
var getUserRepos = function(user) {
    //format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos"

    //make a request to the url
    fetch(apiUrl).then(function(response) {
        //request was successful
        if(response.ok) {
            response.json().then(function(data) {
                displayRepos(data, user);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error) {
        //Notice this '.catch()' getting chained on the end of '.then()' method
        alert("Unable to connect to GitHub-wlr");
    });
};

var formSubmitHandler = function(event) {
    event.preventDefault();

    //get value from input element
    var username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username");
    }
};

var displayRepos = function(repos, searchTerm) {
    // console.log(repos);
    // console.log(searchTerm);

    //check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositoreis found.";
        return;
    }
    //clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    //loop over repos
    for (let i = 0; i < repos.length; i++) {
        const element = repos[i];
        
        //format repo name
        var repoName = element.owner.login + "/" + element.name;

        //create a container for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href","./single-repo.html?repo="+repoName);

        //create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        //append to container
        repoEl.appendChild(titleEl);

        //create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        //check if current repo has issues or not
        if (element.open_issues_count > 0) {
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + element.open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        //appedn to container
        repoEl.appendChild(statusEl);

        //append container to the dom
        repoContainerEl.appendChild(repoEl);
    }
};

function reloadLastUserOnBack() {
    let queryString = document.location.search;
    let user = queryString.split("=")[1];
    
    if (user) {
        getUserRepos(user);
        nameInputEl.value = "";
        // document.location.search="";
    } 
    // else {
    //     alert("Please enter a GitHub username");
    // }
}

function getFeaturedRepos(language) {
    let apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayRepos(data.items, language)
            });
        } else {
            alert("Error: " + response.statusText);
        }
    });
}

function buttonClickHandler(event) {
    event.preventDefault();

    let language = event.target.getAttribute("data-language");
    
    if (language) {
        getFeaturedRepos(language);

        //clear old content while getting the new
        repoContainerEl.textContent = "";
    }

}

//---------------------------------------------------CALLS
reloadLastUserOnBack();

//----------------------------------------------------EVENTS
userFormEl.addEventListener("submit", formSubmitHandler);
languageButtonEl.addEventListener("click", buttonClickHandler);