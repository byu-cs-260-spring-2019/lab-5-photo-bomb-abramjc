import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from 'firebase';

Vue.config.productionTip = false;

var firebaseConfig = {
  apiKey: "AIzaSyBOw8uJRkiyh7AoSRCNf5_iVeebfXSeyqU",
  authDomain: "cs260-clements.firebaseapp.com",
  databaseURL: "https://cs260-clements.firebaseio.com",
  projectId: "cs260-clements",
  storageBucket: "cs260-clements.appspot.com",
  messagingSenderId: "228376409270",
  appId: "1:228376409270:web:14c9477aad284c62"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(user => {
  if(user){
    store.commit('setUser',user);
  }
  else {
    store.commit('setUser',null);
  }
});

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app');



