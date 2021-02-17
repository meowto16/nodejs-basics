window.addEventListener('load', priceFormat)
window.addEventListener('load', dateFormat)

const renderEvent = new CustomEvent('render')

const $cart = document.querySelector('#cart')
if ($cart) {
  window.addEventListener('render', priceFormat)
  window.addEventListener('render', dateFormat)
  $cart.addEventListener('click', event => {
    if (event.target.classList.contains('js-remove')) {
      const id = event.target.dataset.id
      const csrf = event.target.dataset.csrf

      fetch(`/cart/remove/${id}`, {
        method: 'delete',
        headers: {
          'X-XSRF-TOKEN': csrf
        }
      }).then(res => res.json())
        .then(cart => {
          if (cart.courses.length) {
            const rows = cart.courses.map(({title, count, id}) => {
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
            $cart.innerHTML = `
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
                <strong>Цена: <span class="price js-price-format">${cart.price}</span></strong>
              </p>
            `
          } else {
            $cart.innerHTML = `<p>Корзина пуста!</p>`
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
    }).format(new Date(node.textContent))
  })
}

M.Tabs.init(document.querySelectorAll('.tabs'))