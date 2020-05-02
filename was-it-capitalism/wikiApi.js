const baseURI = 'https://en.wikipedia.org/w/api.php?action=query&format=json'

function GetArticle(title) {
    const query = '&prop=extracts|pageimages|info|categories|revisions&pithumbsize=400&origin=*&exintro&inprop=url&rvprop=content&rvslots=main&titles=' + title;
    return QueryAPI(query);
}

function GetListArticle(title) {
    const query = '&prop=links&origin=*&pllimit=500&titles=' + title;
    return QueryAPI(query);
}

async function QueryAPI(query) {
    const response = await $.getJSON(baseURI + query);
    return response['query']['pages'][Object.keys(response['query']['pages'])[0]];
}

