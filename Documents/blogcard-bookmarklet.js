;(function () {
  // スタイルを作成
  const style = document.createElement('style')
  style.innerHTML = `
    .custom-dialog {
      color: #fff;
      overflow: auto;
      max-width: 80%;
      max-height: 80%;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 20px;
      background-color: #171717;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      z-index: 10000;
      font-size:14px;
    }
    .custom-dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
      z-index: 9999;
    }
    .custom-dialog-close {
      float: right;
      cursor: pointer;
    }
  `
  document.head.appendChild(style)

  // タイトルタグの値を取得する関数
  const getTitleTagValue = () => document.title

  // メタタグの情報を取得する関数
  const getMetaTagContent = (property) => {
    const metaTag = document.querySelector(`meta[property='${property}']`)
    return metaTag ? metaTag.getAttribute('content') : undefined
  }

  const obj = {
    title: getMetaTagContent('og:title') || getTitleTagValue(),
    desp: getMetaTagContent('og:description') || '',
    url: document.URL,
    domain: location.host
  }

  const escapeString = (str) => {
    return str.replace(/["'\\\n\r]/g, function (match) {
      switch (match) {
        case '"':
          return '&quot;'
        case "'":
          return '&#39;'
        case '\\':
          return '\\\\'
        case '\n':
        case '\r':
          return ''
        default:
          return match
      }
    })
  }

  const textContent = `
    &lt;BlogCard
    title=\"${escapeString(obj.title)}\"
    description=\"${escapeString(obj.desp)}\"
    url='${obj.url}'
    domain='${obj.domain}' /&gt;
  `

  // ダイアログを作成
  const overlay = document.createElement('div')
  overlay.className = 'custom-dialog-overlay'

  const dialog = document.createElement('div')
  dialog.className = 'custom-dialog'
  dialog.innerHTML = `<pre>${textContent}</pre><button class="custom-dialog-close">閉じる</button>`

  overlay.appendChild(dialog)
  document.body.appendChild(overlay)

  // 閉じるボタンの動作を追加
  dialog.querySelector('.custom-dialog-close').onclick = () => {
    document.body.removeChild(overlay)
  }

  // コピー実行
  navigator.clipboard
    .writeText(textContent.trim().replace('&lt;', '<').replace('&gt;', '>'))
    .then(() => {
      alert('コピーしました')
    })
    .catch((err) => {
      alert('コピーに失敗しました: ', err)
    })
})()
