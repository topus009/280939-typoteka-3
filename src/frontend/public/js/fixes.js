function onInput(e) {
  this.style.height = 'auto';
  this.style.height = (this.scrollHeight) + 'px';
}

document.addEventListener('DOMContentLoaded', function() {
  var location = window.location
  var pathname = location.pathname
  var targetUrl = location.origin + '/posts/post/';
  if(~~targetUrl.indexOf(location.href)) {
    var tx = document.getElementsByTagName('textarea');

    for (var i = 0; i < tx.length; i++) {
      tx[i].setAttribute('style', 'height:' + (tx[i].scrollHeight) + 'px;overflow-y:hidden;');
      tx[i].addEventListener("input", onInput, false);
    }
  }

  if(~~'/articles/article/edit/'.indexOf(pathname)) {
    var articleFormImgDeleteBtn = document.getElementById('image-file-delete');
    if(articleFormImgDeleteBtn) {
      articleFormImgDeleteBtn.addEventListener('click', function(e) {
        e.preventDefault();
        var articleFormImg = document.getElementById('image-name-field');
        var prevArticleFormImg = document.getElementById('prevImage-name-field');
        prevArticleFormImg.value = articleFormImg.value;
        articleFormImg.value = '';
      })
    }
  }
})
