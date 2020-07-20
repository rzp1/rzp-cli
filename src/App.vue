<template>
  <div id="app">
    <img src="./assets/logo.png">
    {{#lang-change}}
    <router-view/>
    {{else}}
    <HelloWorld/>
    {{/lang-change}}
  </div>
</template>

<script>
{{#unless lang-change}}
import HelloWorld from './components/HelloWorld'

{{/unless}}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
