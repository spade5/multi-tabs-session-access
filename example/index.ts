import SharedSession from '../lib/index'

const countSpan = document.getElementById('count')
const btn = document.getElementById('btn')

let count = 0

btn && btn.addEventListener('click', () => {
  count++
  session.setItem('count', count + '')
})

const session = new SharedSession()

session.onChange(() => {
  session.getItem('count').then((value) => {
    if (value) {
      count = +value
      changeValue()
    }
  })
})

session.getItem('count').then((value) => {
  if (value) {
    count = +value
    changeValue()
  }
})

function changeValue() {
  countSpan && (countSpan.innerText = count + '')
}