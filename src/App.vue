<template>
  <div id="app">
    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <router-link to="/" class="navbar-brand logo-space">Accenture</router-link>
      <div class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link to="/fornecedores" class="nav-link">Fornecedores</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/fornecedores/add" class="nav-link">Adicionar Fornecedor</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/empresas" class="nav-link">Empresas</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/empresas/add" class="nav-link">Adicionar Empresa</router-link>
        </li>
      </div>
    </nav>
    <div class="container mt-3">
      <router-view />
    </div>
  </div>

</template>

<script>
export default {
  name: 'App'
};
</script>
<style scoped>
.logo-space {
  margin-left: 20px;
}
</style>