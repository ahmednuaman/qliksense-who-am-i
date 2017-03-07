import $ from 'jquery'
import qlik from 'js/qlik'

qlik
  .callRepository('/user')
  .then(({ data }) => {
    console.log(data)
  })
