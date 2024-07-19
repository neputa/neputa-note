/**
 * 2つのDate()の年月日が一致するか判定
 * @param {Date} first  - 比較対象
 * @param {Date} second - 比較対象
 * @returns {boolean}   - 判定結果
 */

export function datesAreOnSameDay(first: Date, second: Date): boolean {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  )
}
