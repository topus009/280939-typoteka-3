document.addEventListener('DOMContentLoaded', function() {
  expandTextAreaOnPostArticlePage();
  handleDeleteFileOnPostArticlePage();
})

function expandTextAreaOnPostArticlePage() {
  var targetUrl = window.location.origin + '/posts/post/';

  if(targetUrl.indexOf(window.location.href) >= 0) {
    var textArea = getElById('textarea');

    for (var i = 0; i < textArea.length; i++) {
      textArea[i].setAttribute('style', 'height:' + (textArea[i].scrollHeight) + 'px;overflow-y:hidden;');
      textArea[i].addEventListener('input', onInput, false);
    }
  }
}

function handleDeleteFileOnPostArticlePage() {
  if('/articles/article/edit/'.indexOf(window.location.pathname) >= 0) {
    var articleFormImgDeleteBtn = getElById('image-file-delete');

    if(articleFormImgDeleteBtn) {
      articleFormImgDeleteBtn.addEventListener('click', function(e) {
        e.preventDefault();

        var articleFormImg = getElById('image-name-field');
        var prevArticleFormImg = getElById('prevImage-name-field');

        prevArticleFormImg.value = articleFormImg.value;
        articleFormImg.value = '';
      })
    }
  }
}

function onInput(e) {
  this.style.height = 'auto';
  this.style.height = (this.scrollHeight) + 'px';
}

function getElById(id) {
  return document.getElementById(id);
}
