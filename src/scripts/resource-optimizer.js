/**
 * クリティカルリソース最適化スクリプト
 * ビルドでのハッシュ値が変わっても自動的に重要なリソースを検出してpreload
 */

// 重要なコンポーネント名のパターン
const CRITICAL_PATTERNS = [
  /ClientRouter/i,
  /page/i,
  /Breadcrumbs/i,
  /YouTube/i
];

/**
 * クリティカルなJSファイルを検出して優先的にプリロード
 */
export function optimizeResources() {
  // 既にロードされているリソースの追跡
  const preloadedUrls = new Set();
  const resourceHints = document.head.querySelectorAll('link[rel="preload"], link[rel="modulepreload"]');

  // 既存のpreloadをトラック
  resourceHints.forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      preloadedUrls.add(href);
    }
  });

  // 1. スクリプトを探索
  detectAndPreloadScripts(preloadedUrls);

  // 2. スタイルシートを探索
  detectAndPreloadStyles(preloadedUrls);

  // 3. MutationObserverで動的に追加されるリソースを監視
  observeDynamicResources();
}

/**
 * スクリプトを検出してpreload
 */
function detectAndPreloadScripts(preloadedUrls) {
  // 現在のページ内のすべてのスクリプトタグを取得
  const scripts = document.querySelectorAll('script[type="module"]');

  scripts.forEach(script => {
    const src = script.getAttribute('src');
    if (src && !preloadedUrls.has(src)) {
      // クリティカルなパターンに一致するか確認
      if (CRITICAL_PATTERNS.some(pattern => pattern.test(src))) {
        // modulepreloadとして追加
        addPreload(src, 'modulepreload', null, 'high');
        preloadedUrls.add(src);
      }
    }
  });
}

/**
 * スタイルシートを検出してpreload
 */
function detectAndPreloadStyles(preloadedUrls) {
  // 現在のページ内のすべてのスタイルシートを取得
  const styleLinks = document.querySelectorAll('link[rel="stylesheet"]');

  styleLinks.forEach(styleLink => {
    const href = styleLink.getAttribute('href');
    if (href && !preloadedUrls.has(href)) {
      // スタイルシートをpreload
      addPreload(href, 'preload', 'style', 'high');
      preloadedUrls.add(href);
    }
  });
}

/**
 * 動的に追加されるリソースを監視
 */
function observeDynamicResources() {
  if (!('MutationObserver' in window)) return;

  const preloadedUrls = new Set();

  // DOMの変更を監視
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.nodeName === 'SCRIPT' && node.getAttribute('src')) {
            const src = node.getAttribute('src');

            // まだpreloadしていなくてクリティカルなら追加
            if (src && !preloadedUrls.has(src) && CRITICAL_PATTERNS.some(pattern => pattern.test(src))) {
              addPreload(src, 'modulepreload', null, 'high');
              preloadedUrls.add(src);
            }
          }
        });
      }
    });
  });

  // head要素の監視を開始
  observer.observe(document.head, { childList: true, subtree: true });
}

/**
 * プリロードリンク要素を追加
 */
function addPreload(href, rel, as, fetchPriority) {
  const link = document.createElement('link');
  link.rel = rel;
  link.href = href;
  if (as) link.as = as;
  if (fetchPriority) link.fetchPriority = fetchPriority;
  document.head.appendChild(link);
}

// エクスポートして他のファイルから使用可能に
export default { optimizeResources };
