import fs from 'fs'
import path from 'path'

/**
 * 指定されたファイルの最終更新日時を取得します。
 * @param {string} filePath - ファイルパス
 * @returns {Date} - 最終更新日時
 */

export function getFileUpdatedAt(filePath: string): Date {
  const stats = fs.statSync(filePath)
  return stats.mtime // 最終更新日時を返す
}

/**
 * content/blog/* にあるコンテンツファイルのフルパスを返す。
 * @param {string} fileName - ファイル名
 * @returns {string} - フルパス
 */

export function getBlogContentFullPath(fileName: string): string {
  return `${path.resolve('./')}/src/content/blog/${fileName}`
}
