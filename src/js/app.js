/* global config */
import $ from 'jquery'
import qlik from 'js/qlik'

const g = qlik.getGlobal(config)

g.getAuthenticatedUser(({ qReturn: username }) => $('#user').text(`Hello ${username}`))
