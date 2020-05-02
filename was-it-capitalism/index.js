const riskyWordsFile = 'riskyWords.txt';
const listArticlesFile = 'listArticles.txt';
let listArticleTitles;
let riskyWords;

$(document).ready(async function () {
    listArticleTitles = await GetListArticleTitles();
    riskyWords = await GetRiskyWords();

    $('#refresh').click(function () {
        Refresh();
    });
});

async function Refresh() {
    let list = SelectListArticle();
    console.log(list)
    let articleTitle;

    // Fetch an article from the list and if it is itself a list
    // keep going
    do {
        list = await GetListArticle(list);
        articleTitle = SelectArticle(list['links']);
        list = articleTitle;
    } while (list.includes('List'))

    // Just try all over again if you find a risky word can't be too spensy
    const article = await GetArticle(articleTitle);
    console.dir(article)
    if (ContainsRiskyWord(article['revisions'][0]['slots']['main']['*']))
        return Refresh();

    const title = article['title'];
    const extract = article['extract'];
    $("#title").text(title);
    $("#extract").empty();
    $("#extract").append(extract);
}

function ContainsRiskyWord(content) {
    let contains = false;
    content = content.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    let words = content.split(' ');
    words.map((word) => {
        word = word.toLowerCase();
        if (riskyWords.hasOwnProperty(word))
            contains = true;
    });
    return contains;
}

function SelectArticle(list) {
    return list[Math.floor(Math.random() * list.length)]['title'];
}

function SelectListArticle() {
    return listArticleTitles[Math.floor(Math.random() * listArticleTitles.length)];
}

const GetListArticleTitles = async function () {
    let lines;
    await $.get(listArticlesFile, function (data) {
        lines = data.split('\n');
    });
    return lines;
}

const GetRiskyWords = async function () {
    let lines;
    let words = {};
    await $.get(riskyWordsFile, function (data) {
        lines = data.split('\n');
        lines.map((word) => {
            words[word.trimEnd()] = null;
        });
    });
    return words;
}

