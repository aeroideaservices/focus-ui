export const embedConfigs = {
  youtube: true,
  coub: true,
  rutube: {
    regex: /https?:\/\/rutube\.ru\/video\/([0-9a-z\/\?\&\=]*)/,
    embedUrl: 'https://rutube.ru/play/embed/<%= remote_id %>?autoplay=0',
    html: "<iframe height='300' scrolling='no' autoplay='false' autoplay='0' frameborder='no' allowtransparency='true' allowfullscreen='true' webkitAllowFullScreen mozallowfullscreen allowFullScreen style='width: 100%;'></iframe>",
    height: 300,
    width: 600,
  },
  ok: {
    regex: /https?:\/\/ok\.ru\/video\/([^\/\?\&]*)/,
    embedUrl: 'https://ok.ru/videoembed/<%= remote_id %>?autoplay=0',
    html: "<iframe height='300' scrolling='no' autoplay='false' autoplay='0' frameborder='no' allowtransparency='true' allowfullscreen='true' webkitAllowFullScreen mozallowfullscreen allowFullScreen style='width: 100%;'></iframe>",
    height: 300,
    width: 600,
  },
};
