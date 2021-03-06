# Part 6: Login

Our next step is to create a login page.

## Login Form

Create a new file called `src/views/Login.vue`. It should have a `template` section:

```
<template>
<div>
  <h1>Login to your account</h1>
  <form @submit.prevent="login" class="pure-form pure-form-aligned">
    <fieldset>
      <p class="pure-form-message-inline">All fields are required.</p>

      <div class="pure-control-group">
        <label for="email">Email</label>
        <input v-model="email" type="text" placeholder="Email">
      </div>

      <div class="pure-control-group">
        <label for="password">Password</label>
        <input v-model="password" type="password" placeholder="Password">
      </div>

      <div class="pure-controls">
        <button type="submit" class="pure-button pure-button-primary">Submit</button>
      </div>
    </fieldset>
  </form>
  <p v-if="error" class="error">{{error}}</p>
</div>
</template>
```

This contains a form to enter a username and password. It is nearly identical
to the registration form.

Next, put the following in the `script` section:

```
<script>
export default {
  name: 'login',
  data() {
    return {
      email: '',
      password: '',
      error: '',
    }
  },
  methods: {
    async login() {
      try {
        this.error = await this.$store.dispatch("login", {
          email: this.email,
          password: this.password
        });
        if (this.error === "")
          this.$router.push('mypage');
      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>
```

This uses some variables that are bound to the registration form, plus a `login`
method. This method dispatches the `login` action on the store and, if no error
occurs, loads the `MyPage` view.

We'll use the same styles as the registration form:

```
<style scoped>
form {
  border: 1px solid #ccc;
  background-color: #eee;
  border-radius: 4px;
  padding: 20px;
}

.pure-controls {
  display: flex;
}

.pure-controls button {
  margin-left: auto;
}
</style>
```

## Vuex

We need to add some new actions to our Vuex store to handle login and logout.
Start with a `login` action:

```
    async login(context, data) {
      try {
        let response = await firebase.auth().signInWithEmailAndPassword(data.email, data.password);
        context.commit('setUser', response.user);
        return "";
      } catch (error) {
        return error.message;
      }
    }
```

This uses `firebase authentication` to to login. We commit the user state if it is successful, otherwise return an error message.

Next, add the `logout` action.

```
    async logout(context) {
      try {
        await firebase.auth().signOut();
        context.commit('setUser', null);
        return "";
      } catch (error) {
        return error.message;
      }
    },
```

This uses `firebase authentication` to logout. We delete the state for
the logged in user if it is successful.

Next, add the `getUser` action:

```
    async getUser(context) {
      try {
        let response = await  firebase.auth().currentUser;
        context.commit('setUser', response.user);
        return "";
      } catch (error) {
        return "";
      }
    }
```

This uses `firebase authentication` to get the current user, setting the state for this user if succssful.

You will also need to add the following to the bottom of your `main.js`
```
firebase.auth().onAuthStateChanged(user => {
  if(user){
    store.commit('setUser',user);
  }
  else {
    store.commit('setUser',null);
  }
});
```
Because of the way the firebase authentication system is defined, using the getUser function will not always return the correct user (and sometimes will return null).  By adding this to `main.js` it is in a sense "listening" to see if the status of the user changes and storing the current user via a commit action to our store.

## My Page

We now need to redesign the `MyPage` view to add a logout button. If the user
is not logged in, then the page displays buttons to register or login.

Modify the template in `src/views/mypage.vue`:

```
<template>
<div>
  <div v-if="user" class="header">
    <div>
      <h2>{{user.email}}</h2>
    </div>
    <div class="button">
      <p><button @click="logout" class="pure-button pure-button-primary">Logout</button></p>
    </div>
  </div>
  <div v-else>
    <router-link to="/register" class="pure-button">Register</router-link> or
    <router-link to="/login" class="pure-button">Login</router-link>
  </div>
</div>
</template>
```

This uses a `v-if` directive to display the user's email if they are logged in,
plus a logout button. Otherwise, it displays directions for registration or
login.

Next, add a `created` section and a `logout` method:

```
  created() {
    this.$store.dispatch("getUser");
  },
  methods: {
    async logout() {
      try {
        this.error = await this.$store.dispatch("logout");
      } catch (error) {
        console.log(error);
      }
    },
  }
```

The `created` section dispatches the `getUser` action on the store, which sets
the `user` variable if the user is logged in. The `logout` method dispatches
the `logout` action on the store.

We also use the following styles:

```
<style scoped>
.pure-button {
  margin: 0px 20px;
}

.header {
  display: flex;
}

.header .button {
  margin-left: 50px;
  order: 2;
}
</style>
```

## Routing

The last step is to hook up the new Login view. Start with adding an import
statement:

```
import Login from './views/Login.vue'
```

Then add the route:

```
   {
      path: '/login',
      name: 'login',
      component: Login
    }
```

## Results

You should now be able to login now. The cookie that is set will keep you logged
in even if you refresh the page.

