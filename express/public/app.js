document.querySelectorAll('.js-price-format').forEach(node => {
  node.textContent = new Intl.NumberFormat('ru-RU', {
    currency: 'rub',
    style: 'currency'
  }).format(node.textContent)
})