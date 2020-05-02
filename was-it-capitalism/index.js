$(document).ready(function () {
    $('#refresh').click(function () {
        Refresh();
    });

    async function Refresh() {
        const response = await GetArticle('Charlene Corley');
        const title = response['title'];
        $("#title").replaceWith(title);
    }
});

