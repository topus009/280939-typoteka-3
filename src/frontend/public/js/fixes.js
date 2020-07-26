document.addEventListener('DOMContentLoaded', function() {
  var location = window.location
  var targetUrl = location.origin + '/posts/post/';
  if(~~targetUrl.indexOf(location.href)) {
    var tx = document.getElementsByTagName('textarea');

    for (var i = 0; i < tx.length; i++) {
      tx[i].setAttribute('style', 'height:' + (tx[i].scrollHeight) + 'px;overflow-y:hidden;');
      tx[i].addEventListener("input", OnInput, false);
    }

    function OnInput(e) {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight) + 'px';
    }
  }
})
