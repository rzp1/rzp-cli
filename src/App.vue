<template>
  <div id="app">
    <img src="./assets/logo.png">
    {{#if langChange}}
    <router-view/>
    {{else}}
    <HelloWorld/>
    {{/if}}
  </div>
</template>

<script>
{{#unless langChange}}
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
