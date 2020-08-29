'use strict';

document.addEventListener(`DOMContentLoaded`, function () {
  var socket = io();

  socket.on(`NEW_COMMENT`, function (data) {
    updateLastComments(data);
    updateHottestArticles(data);
  });

  socket.on(`MAIN_PAGE_READERS_COUNT`, function (data) {
    var currentReaders = document.querySelectorAll(`.current-page-readers`);
    if (currentReaders.length) {
      currentReaders[0].innerText = `Смотрят эту страницу: ` + data;
    }
  });
});

function updateLastComments(data) {
  var lastHTML = data.lastHTML;
  var lastList = document.getElementById(`last-list`);
  var firstComment = lastList.childNodes[0];
  var commentsLength = lastList.childNodes.length;

  firstComment.insertAdjacentHTML(`beforebegin`, lastHTML);

  if (commentsLength === 4) {
    lastList.childNodes[commentsLength - 1].remove();
  }
}

function updateHottestArticles(data) {
  var hotHTML = data.hotHTML;
  var hotList = document.getElementById(`hot-list`);
  hotList.innerHTML = hotHTML;
}
