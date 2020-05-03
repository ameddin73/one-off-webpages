const riskyWordsFile = 'riskyWords.txt';
const listArticlesFile = 'listArticles.txt';
let listArticleTitles;
let riskyWords;
let isCapitalism = true;
let currentTitle = '';

$(document).ready(async function () {
    listArticleTitles = await GetListArticleTitles();
    riskyWords = await GetRiskyWords();
    await Refresh();

    $('#try-again').click(() => {
       Refresh();
    });

    $('#yes-button').click(() => {
        isCapitalism = true;
        $('#modal-card').removeClass('card-failure');
        $('#modal-card').addClass('card-success');
        $('.overlay').show();
        OpenModal();
    });
    $('#no-button').click(() => {
        isCapitalism = false;
        $('#modal-card').removeClass('card-success');
        $('#modal-card').addClass('card-failure');
        $('.overlay').show();
        OpenModal();
    });
});

function OpenModal() {
    if (isCapitalism) {
        $('#modal-icon').text('check_circle');
        $('#modal-title').text('Correct!');
        $('#modal-body').text(currentTitle + ' is an unfortunate result of capitalism.');
    } else {
        $('#modal-icon').text('cancel');
        $('#modal-title').text('Incorrect');
        $('#modal-body').text(currentTitle + ' is indeed a tragic result of capitalism.');
    }
    $('.modal').show();
}

async function Refresh() {
    $('#title').empty();
    $('#extract').empty();
    $('#loading-spinner').show();
    $('.prompt').hide();
    $('.modal').hide();
    $('.overlay').hide();
    let list = SelectListArticle();
    let articleTitle;

    // Fetch an article from the list and if it is itself a list
    // keep going
    do {
        list = await GetListArticle(list);
        articleTitle = SelectArticle(list['links']);
        list = articleTitle;
    } while (list.includes('List') || list.includes('Template'))

    // Just try all over again if you find a risky word can't be too spensy
    const article = await GetArticle(articleTitle);
    if (ContainsRiskyWord(article['revisions'][0]['slots']['main']['*']))
        return Refresh();

    $('#loading-spinner').hide();
    const title = article['title'];
    const extract = article['extract'];
    currentTitle = title
    $('#title').text(title);
    $('#extract').append(extract);
    $('.prompt').show();
}

function ContainsRiskyWord(content) {
    content = content.replace(/[.,\/!$%\^&\*;:{}=\-_`~()]/g,"");
    let words = content.split(' ');
    for (let i = 0; i < words.length; i++) {
        let word = words[i].toLowerCase().trimEnd();
        if (riskyWords.hasOwnProperty(word) && word !== '') {
            return true;
        }
    }
    return false;
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

