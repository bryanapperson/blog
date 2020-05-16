function replyTo(parent, name) {
      var e = document.getElementById(parent),
              f = document.getElementById('comment-form'),
              h = document.getElementById('comment-form-header');

      h.innerHTML = 'Reply to ' + name;
      e.parentNode.insertBefore(f, e.nextSibling);
      document.getElementsByName('fields[reply_to]')[0].value=parent;

}
