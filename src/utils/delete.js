/*
  * Removing elements by id that has been entered into the localStorage
  *
  * @param {Object} e -- an object. Usually expects deleteBtn
  * @param {String} itemId -- id of deleting card
*/
export const initCardDelete = (e, cardId) => {
  localStorage.setItem(cardId, cardId);
  e.closest('.card').remove();
}

/*
  * Pushing data from localStorage to the array
  *
  * @returns {array}
*/
export const loadDataFromStorage = () => {
  let result = [];
  for (let i = 0; i < localStorage.length; i++) {
    result.push(localStorage.getItem([i]));
  }
  return result;
}

//v-if="parseInt(blackList[item.id]) != item.id + 1"