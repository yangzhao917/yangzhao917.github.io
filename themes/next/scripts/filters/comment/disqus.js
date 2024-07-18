/* global hexo */

'use strict';

const path = require('path');
const { iconText } = require('./common');

// Add comment
hexo.extend.filter.register('theme_inject', injects => {
  const config = hexo.theme.config.disqus;
  if (!config.enable || !config.shortname) return;

  injects.comment.raw('disqus', `
  <div class="comments" id="disqus_thread">
    <noscript>Please enable JavaScript to view the comments powered by Disqus.</noscript>
  </div>
  `, {}, { cache: true });

  injects.bodyEnd.file('disqus', path.join(hexo.theme_dir, 'layout/_third-party/comments/disqus.njk'));

});

// Add post_meta
hexo.extend.filter.register('theme_inject', injects => {
  const config = hexo.theme.config.disqus;
  if (!config.enable || !config.shortname || !config.count) return;

  injects.postMeta.raw('disqus', `
  {% if post.comments %}
  <span class="post-meta-item">
    ${iconText('far fa-comment', '评论数')}
    <a title="disqus" href="{{ url_for(post.path) }}#disqus_thread" itemprop="discussionUrl">
      <span class="post-comments-count disqus-comment-count" data-disqus-identifier="{{ post.path }}" itemprop="commentCount"></span>
    </a>
  </span>
  {% endif %}
  `, {}, {});

});
