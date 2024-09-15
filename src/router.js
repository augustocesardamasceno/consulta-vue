import { createRouter, createWebHistory } from 'vue-router';
import AddFornecedor from './components/fornecedor/AddFornecedor.vue';
import FornecedoresList from './components/fornecedor/FornecedorList.vue';
import EmpresaList from './components/empresa/EmpresaList.vue';
import AddEmpresa from './components/empresa/AddEmpresa.vue';

const routes = [
  {
    path: '/',
    redirect: '/empresas'  
  },
  {
    path: '/fornecedores',
    name: 'fornecedores-list',
    component: FornecedoresList
  },
  {
    path: '/fornecedores/add',
    name: 'add-fornecedor',
    component: AddFornecedor
  },
  {
    path: '/empresas',
    name: 'empresas-list',
    component: EmpresaList
  },
  {
    path: '/empresas/add',
    name: 'add-empresa',
    component: AddEmpresa
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
