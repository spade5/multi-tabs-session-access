import SharedSession from '../lib/index'
import './index.css'

const countSpan = document.getElementById('count')
const btn = document.getElementById('btn')

let count = 0

btn && btn.addEventListener('click', () => {
  count++
  SharedSession.setItem('count', count + '')
})

SharedSession.listen(() => {
  SharedSession.getItem('count').then((value) => {
    if (value) {
      count = +value
      changeValue()
    }
  })
})

SharedSession.getItem('count').then((value) => {
  if (value) {
    count = +value
    changeValue()
  }
})

function changeValue() {
  countSpan && (countSpan.innerText = count + '')
}