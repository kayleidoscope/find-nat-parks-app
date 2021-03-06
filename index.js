'use strict';

//set apiKey to a variable
const apiKey = "P4jSe07xT0iE5pVCbCnF5lfnvcLpQR48IcYYcHcn";
//set needed url to a variable
const searchURL = "https://developer.nps.gov/api/v1/parks";


function formatQueryParams(params) {
    console.log('formatQueryParams ran');
    //get query params ready to tack onto searchURL
    const queryItems = Object.keys(params)
        .map(key => `${key}=${params[key]}`)
    return queryItems.join('&');
}

function displayResults(responseJson) {
    //if there are previous results, remove them
    console.log(responseJson);
    $('#results-list').empty();
    //iterate through the array
    for (let i = 0; i < responseJson.data.length; i++) {
        $('#results-list').append(
            `<li>
                <a href="${responseJson.data[i].url}"><h3>${responseJson.data[i].fullName}</h3></a>
                <p>${responseJson.data[i].description}</p>
            </li>`
        )
    }
    $('#results').removeClass('hidden');
}

function getParks(statesFormatted, maxResults) {
    //hold needed params in an array
    const params = {
        api_key: apiKey,
        limit: maxResults,
        stateCode: statesFormatted,
    }

    //run params through formatQueryParams function
    const queryString = formatQueryParams(params);
    
    //create needed url by adding queryString onto the end of searchURL
    const url = encodeURI(searchURL + '?' + queryString);

    console.log(url);

    //run URL through API
    fetch(url)
    //if OK, convert response into JSON
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        let allStates = [];
        $.each($(`input[name='states']:checked`), function(){
            allStates.push($(this).val());
        })
        const statesFormatted = allStates.toString();
        const maxResults = $('#js-max-results').val();
        
        if (statesFormatted.length === 0) {
            $('#results-list').empty();
            $('#results-list').append(`<p>No National Parks to show.</p>`)
        } else {
            getParks(statesFormatted, maxResults)
        }
    }
)}

$(watchForm)