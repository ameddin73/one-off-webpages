const baseURI = 'https://en.wikipedia.org/w/api.php?action=query&format=json'

async function GetArticle(title) {
    const query = '&prop=extracts|pageimages|info&pithumbsize=400&origin=*&exintro&explaintext&inprop=url&titles=' + title;
    const response = await $.getJSON(baseURI + query);
    return response['query']['pages'][Object.keys(response['query']['pages'])[0]]
}