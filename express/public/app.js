window.addEventListener('load', priceFormat)
window.addEventListener('load', dateFormat)

const renderEvent = new CustomEvent('render')

const $card = document.querySelector('#card')
if ($card) {
  window.addEventListener('render', priceFormat)
  window.addEventListener('render', dateFormat)
  $card.addEventListener('click', event => {
    if (event.target.classList.contains('js-remove')) {
      const id = event.target.dataset.id

      fetch(`/card/remove/${id}`, {
        method: 'delete'
      }).then(res => res.json())
        .then(card => {
          if (card.courses.length) {
            const rows = card.courses.map(({title, count, id}) => {
              return `
                <tr>
                    <td>${title}</td>
                    <td>${count}</td>
                    <td>
                        <button class="btn btn-small js-remove" data-id="${id}">Удалить</button>
                    </td>
                </tr>
              `
            })
            $card.innerHTML = `
              <table>
                  <thead>
                      <tr>
                          <th>Название</th>
                          <th>Количество</th>
                          <th>Действия</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${rows.join('')}
                  </tbody>
              </table>
              <p>
                <strong>Цена: <span class="price js-price-format">${card.price}</span></strong>
              </p>
            `
          } else {
            $card.innerHTML = `<p>Корзина пуста!</p>`
          }
          window.dispatchEvent(renderEvent)
        })
    }
  })
}


function priceFormat() {
  document.querySelectorAll('.js-price-format').forEach(node => {
    node.textContent = new Intl.NumberFormat('ru-RU', {
      currency: 'rub',
      style: 'currency'
    }).format(node.textContent)
  })
}

function dateFormat() {
  document.querySelectorAll('.js-date-format').forEach(node => {
    node.textContent = new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(new Date(date))
  })
}