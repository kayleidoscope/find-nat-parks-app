//set apiKey to a variable
const apiKey = "P4jSe07xT0iE5pVCbCnF5lfnvcLpQR48IcYYcHcn";
//set needed url to a variable
const searchURL = "https://developer.nps.gov/api/v1/parks";

function formatQueryParams(params) {
    console.log('formatQueryParams ran');
    //get query params ready to tack onto searchURL
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
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
                <address>
                    <p>${responseJson.data[i].addresses[0].line1}</p>
                    <p>${responseJson.data[i].addresses[0].city}, ${responseJson.data[i].addresses[0].stateCode}, ${responseJson.data[i].addresses[0].postalCode}</p>
                </address>
            </li>`
        )
    }
    $('#results').removeClass('hidden');
}

function getParks(allStates, maxResults) {
    //hold needed params in an array
    const params = {
        api_key: apiKey,
        limit: maxResults,
        stateCode: allStates,
    }

    //run params through formatQueryParams function
    const queryString = formatQueryParams(params);
    //create needed url by adding queryString onto the end of searchURL
    const url = searchURL + '?' + queryString;

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
        const maxResults = $('#js-max-results').val();
        getParks(allStates, maxResults)
    }
)}

$(watchForm)