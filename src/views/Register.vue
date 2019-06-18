<template>
<div>
  <h1>Register for an account</h1>
  <form @submit.prevent="register" class="pure-form pure-form-aligned">
    <fieldset>
      <p class="pure-form-message-inline">All fields are required.</p>

      <div class="pure-control-group">
        <label for="email">Email</label>
        <input v-model="email" type="email" placeholder="Email">
      </div>

      <div class="pure-control-group">
        <label for="password">Password</label>
        <input v-model="password" type="password" placeholder="Password">
      </div>
      
      <div class="pure-control-group">
        <label for="text">First Name</label>
        <input v-model="firstName" type="text" placeholder="First Name">
      </div>

      <div class="pure-control-group">
        <label for="text">Last Name</label>
        <input v-model="lastName" type="text" placeholder="Last Name">
      </div>

      <div class="pure-control-group">
        <label for="text">Age</label>
        <input v-model="age" type="text" placeholder="Age">
      </div>
      
      <div class="pure-controls">
        <button type="submit" class="pure-button pure-button-primary">Submit</button>
      </div>
    </fieldset>
  </form>
  <p v-if="error" class="error">{{error}}</p>
</div>
</template>

<script>
export default {
  name: 'register',
  data() {
    return {
      email: '',
      password: '',
      error: '',
      firstName: '',
      lastName: '',
      age: '',
    }
  },
  methods: {
    async register() {
      try {
        this.error = await this.$store.dispatch("register", {
          email: this.email,
          password: this.password
        });
        if (this.error === "")
          this.$router.push('mypage');

        await axios.post("/api/users", {
            firstName: this.firstName,
            lastName: this.lastName,
            age: this.age
        });
          
      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>

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
