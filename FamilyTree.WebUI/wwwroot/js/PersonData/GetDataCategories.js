/**
 * Возвращает массив категорий данных человека.
 *
 * Например:
 * ```js
 * const dataCategories = [{
 *  0: {
 *   Id: 0,
 *   Name: "Персональные данные"
 *  },
 *  1: {
 *   Id: 1,
 *   Name: "Образование"
 *  },
 *  2: {
 *   Id: 2,
 *   Name: "Важные события"
 *  },
 * }]
 * ```
 *
 * Эти данные приходят в виде JSON и форматируются в JS объекты.
 *
 * @function
 * @param {number} personId Id человека в дереве.
 * @returns {Array<Object>} JSON в виде массива JS объектов.
 * @todo Сделать этот метод асинхронным.
 */
export function GetDataCategories(personId) {
  let result = []
  $.ajax({
    async: false,
    type: 'GET',
    dataType: 'json',
    url: '/PersonContent/DataCategory/GetAll?personId=' + personId,
    success: function (data) {
      result = data
    },
  })
  return result
}
