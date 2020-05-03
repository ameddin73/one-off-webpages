const riskyWordsFile = 'keywords/riskyWords.txt';
const listArticlesFile = 'keywords/listArticles.txt';
const offTopicFile = 'keywords/offTopic.txt';
let listArticleTitles;
let riskyWords;
let offTopicPhrases;
let isCapitalism = true;
let currentTitle = '';

$(document).ready(async function () {
    listArticleTitles = await GetFileContent(listArticlesFile);
    offTopicPhrases = await GetFileContent(offTopicFile);
    const riskyWordFileLines = await GetFileContent(riskyWordsFile);
    riskyWords = await GetRiskyWords(riskyWordFileLines);
    await Refresh();

    $('#try-again').click(() => {
        Refresh();
    });

    $('#yes-button').click(() => {
        // isCapitalism = true;
        // $('#modal-card').removeClass('card-failure');
        // $('#modal-card').addClass('card-success');
        // $('.overlay').show();
        // OpenModal();
        Refresh();
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
    $('#image').attr('alt', '');
    $('#image').attr('src', '');
    $('.prompt').hide();
    $('.modal').hide();
    $('.overlay').hide();
    let list = SelectListArticle();
    let articleTitle;
    let article;

    try {
        // Fetch an article from the list and if it is itself a list
        // keep going
        let loop = true;
        while (loop) {
            loop = false;
            list = await GetListArticle(list);
            articleTitle = SelectArticle(list['links']);
            if (ContainsPhrase(['Template', 'Category:', 'Wikipedia:','Index','Help:'], articleTitle)) {
                Refresh();
                return;
            }
            if (ContainsRiskyWord(articleTitle) ||
                ContainsPhrase(['Corruption in', 'List', 'list', 'lists'], articleTitle)) {
                list = articleTitle;
                loop = true;
            }
        }

        // Just try all over again if you find a risky word can't be too spensy
        article = await GetArticle(articleTitle);
        if (ContainsRiskyWord(article['revisions'][0]['slots']['main']['*']) || ContainsPhrase(offTopicPhrases, article['extract']))
            return Refresh();
    } catch (err) {
        Refresh();
        return;
    }

    const wikiUrl = article['canonicalurl'];
    const extract = article['extract'];
    if (extract === '') {
        Refresh();
        return;
    }
    currentTitle = articleTitle;

    $('#loading-spinner').hide();
    $('#title').text(articleTitle);
    $('#wiki-link').attr('href',wikiUrl);
    $('#extract').append(extract);
    $('.prompt').show();

    if (article.hasOwnProperty('thumbnail')) {
        const image = article['thumbnail']['source'];
        $('#image').attr('alt', articleTitle);
        $('#image').attr('src', image);
    }
}

function ContainsRiskyWord(content) {
    content = content.replace(/[.,\/!$%\^&\*;{}=\-_`~()]/g, "");
    let words = content.split(' ');
    for (let i = 0; i < words.length; i++) {
        let word = words[i].toLowerCase().trimEnd();
        if ((riskyWords.hasOwnProperty(word) || riskyWords.hasOwnProperty(word + 's')) && word !== '') {
            return true;
        }
    }
    return false;
}

function ContainsPhrase(phrases, content) {
    return phrases.some(word => {
        word = word.trimEnd();
        return word !== '' && content.includes(word);
    });
}

function SelectArticle(list) {
    return list[Math.floor(Math.random() * list.length)]['title'];
}

function SelectListArticle() {
    return listArticleTitles[Math.floor(Math.random() * listArticleTitles.length)];
}

const GetFileContent = async function (filename) {
    let lines;
    await $.get(filename, function (data) {
        lines = data.split('\n');
    });
    return lines;
}

const GetRiskyWords = async function (lines) {
    let words = {};
    lines.map((word) => {
        words[word.trimEnd()] = null;
    });
    return words;
}

