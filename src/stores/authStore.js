import { Component } from 'react'
import jwt_decode from 'jwt-decode'
import { decorate, observable } from 'mobx'
import axios from 'axios'

class AuthStore extends Component {
  user = null

  signupUser = async (userData, history) => {
    try {
      const res = await axios.post(
        'https://the-index-api.herokuapp.com/signup/',
        userData
      )
      const user = res.data
      this.setUser(user.token)
      history.replace('/login/')
    } catch (err) {
      console.log(err)
    }
  }

  loginUser = async (userData, history) => {
    try {
      const res = await axios.post(
        'https://the-index-api.herokuapp.com/login/',
        userData
      )
      const user = res.data
      this.setUser(user.token)
      history.replace('/')
    } catch (err) {
      console.error(err)
    }
  }

  checkForToken = () => {
    const token = localStorage.getItem('myToken')
    if (token) {
      const currentTime = Date.now() / 1000
      const user = jwt_decode(token)
      if (user.exp >= currentTime) {
        this.setUser(token)
      } else {
        this.logout()
      }
    }
  }

  logout = () => {
    this.setUser()
  }

  setUser = token => {
    if (token) {
      axios.defaults.headers.common.Authorization = `JWT ${token}`
      const decodedUser = jwt_decode(token)
      this.user = decodedUser
      localStorage.setItem('myToken', token)
    } else {
      localStorage.removeItem('myToken')
      delete axios.defaults.headers.common.Authorization
      this.user = null
    }
  }
}

decorate(AuthStore, {
  user: observable
})

const authStore = new AuthStore()
authStore.checkForToken()

export default authStore
