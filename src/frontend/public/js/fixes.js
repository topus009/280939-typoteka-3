'use strict';

document.addEventListener(`DOMContentLoaded`, function () {
  expandTextAreaOnPostArticlePage();
  handleDeleteFileOnPostArticlePage();
});

function expandTextAreaOnPostArticlePage() {
  var pathname = window.location.pathname;
  var addPath = `/articles/add`;
  var editPath = `/articles/article/edit`;

  if (pathname.indexOf(addPath) >= 0 || pathname.indexOf(editPath) >= 0) {
    var textArea = document.querySelectorAll(`textarea`);

    for (var i = 0; i < textArea.length; i++) {
      textArea[i].setAttribute(
        `style`, `height:` + textArea[i].scrollHeight + `px;overflow-y:hidden;`,
      );
      textArea[i].addEventListener(`input`, onInput, false);
    }
  }
}

function handleDeleteFileOnPostArticlePage() {
  if (`/articles/article/edit/`.indexOf(window.location.pathname) >= 0) {
    var articleFormImgDeleteBtn = getElById(`image-file-delete`);

    if (articleFormImgDeleteBtn) {
      articleFormImgDeleteBtn.addEventListener(`click`, function (e) {
        e.preventDefault();

        var articleFormImg = getElById(`image-name-field`);
        var prevArticleFormImg = getElById(`prevImage-name-field`);

        prevArticleFormImg.value = articleFormImg.value;
        articleFormImg.value = ``;
      });
    }
  }
}

function onInput() {
  this.style.height = `auto`;
  this.style.height = this.scrollHeight + `px`;
}

function getElById(id) {
  return document.getElementById(id);
}
