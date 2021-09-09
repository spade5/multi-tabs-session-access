# SharedSession
多窗口共享 sessionStorage 解决方案，session 数据会在窗口间实时同步，所有窗口关闭后，数据清除。 

# usage:

```
npm i shared-session
#or
yarn add shared-session
```

```js
import SharedSession from 'shared-session'

//监听数据变化
SharedSession.listen((data) => {
    console.log(data)
})

//获取数据
SharedSession.getItem('key').then((value) => {
    console.log(value)
})

//更新数据
SharedSession.setItem('key', 'value')

//删除某个字段
SharedSession.removeItem('key')

//清除所有数据
SharedSession.clear()

```
