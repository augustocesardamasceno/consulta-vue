<template>
    <div class="list row">
        <div class="col-md-8">
            <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="Busca por nome ou CPF/CNPJ" v-model="searchInput"
                    @keypress.enter="search" />
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary" type="button" @click="search">
                        Search
                    </button>
                </div>
            </div>
        </div>

        <div class="col-md-6">
            <h4>Fornecedores List</h4>
            <p>Selecione uma empresa</p>
            <ul class="list-group">
                <li class="list-group-item" :class="{ active: index === currentIndex }"
                    v-for="(fornecedor, index) in fornecedores" :key="fornecedor.cpfCnpj"
                    @click="setActiveFornecedor(fornecedor, index)">
                    {{ fornecedor.nome }}
                </li>
            </ul>

            <div class="pagination">
                <button class="btn btn-outline-primary" @click="previousPage" :disabled="pageNumber === 0">
                    ← Anterior
                </button>
                <button class="btn btn-outline-primary ml-2" @click="nextPage" :disabled="pageNumber >= totalPages - 1">
                    Próxima →
                </button>
            </div>
        </div>

        <div class="col-md-6">
            <div v-if="currentFornecedor">
                <div class="d-flex justify-content-around align-items-start mb-3">
                    <h4>Fornecedor</h4>
                    <button class="btn btn-success" @click="atualizarFornecedor">
                        Atualizar
                    </button>
                    <button class="btn btn-danger" @click="deleteFornecedor">
                        Excluir
                    </button>
                </div>
                <div><strong>Nome:</strong> {{ currentFornecedor.nome }}</div>
                <div><strong>Email:</strong> {{ currentFornecedor.email }}</div>
                <div><strong>CPF/CNPJ:</strong> {{ currentFornecedor.cpfCnpj }}</div>
            </div>
            
        </div>
    </div>
</template>

<script>
import FornecedorDataService from "../../services/FornecedorDataService";
import Swal from 'sweetalert2';
import { useToast } from "vue-toastification";

export default {
    name: "fornecedores-list",
    data() {
        return {
            fornecedores: [],
            currentFornecedor: null,
            currentIndex: -1,
            searchInput: "", 
            pageNumber: 0, 
            totalPages: 0, 
            pageSize: 10, 
        };
    },
    setup() {
        const toast = useToast(); 
        return {
            toast
        };
    },
    methods: {
        retrieveFornecedores() {
            const params = { page: this.pageNumber, size: this.pageSize };

            FornecedorDataService.getAllFornecedores(params)
                .then(response => {
                    const { content, totalPages } = response.data;
                    this.fornecedores = content;
                    this.totalPages = totalPages;
                })
                .catch(e => {
                    console.log(e);
                });
        },

        previousPage() {
            if (this.pageNumber > 0) {
                this.pageNumber--;
                this.retrieveFornecedores();
            }
        },

        nextPage() {
            if (this.pageNumber < this.totalPages - 1) {
                this.pageNumber++;
                this.retrieveFornecedores();
            }
        },

        search() {
            const isCpfCnpj = /^\d{11}$|^\d{14}$/.test(this.searchInput.replace(/\D/g, '')); 
            if (isCpfCnpj) {
                this.searchCpfCnpj(this.searchInput);
            } else {
                this.searchNome();
            }
        },

        searchNome() {
            FornecedorDataService.getByNome(this.searchInput)
                .then(response => {
                    if (response.data && Array.isArray(response.data)) {
                        this.fornecedores = response.data;
                    } else {
                        this.fornecedores = [];
                    }
                })
                .catch(e => {
                    console.log(e);
                });
        },

        searchCpfCnpj(cpfCnpj) {
            FornecedorDataService.getByCpfCnpj(cpfCnpj.replace(/\D/g, ''))  
                .then(response => {
                    this.fornecedores = [response.data];
                })
                .catch(e => {
                    console.log(e);
                });
        },

        setActiveFornecedor(fornecedor, index) {
            this.currentFornecedor = fornecedor;
            this.currentIndex = index;
        },

        atualizarFornecedor() {
            Swal.fire({
                title: 'Atualizar Fornecedor',
                html: `
            <div class="form-group" style="display: flex; justify-content: flex-start; align-items: center; margin-bottom: 10px;">
                <label for="nome" style="width: 100px; text-align: right; margin-right: 10px;">Nome</label>
                <input id="nome" class="swal2-input" value="${this.currentFornecedor.nome}" maxlength="50" style="width: 300px;" placeholder="Máx 50 caracteres">
            </div>
            <div class="form-group" style="display: flex; justify-content: flex-start; align-items: center; margin-bottom: 10px;">
                <label for="cpfCnpj" style="width: 100px; text-align: right; margin-right: 10px;">CPF/CNPJ</label>
                <input id="cpfCnpj" class="swal2-input" value="${this.currentFornecedor.cpfCnpj}" style="width: 300px;">
            </div>
            <div class="form-group" style="display: flex; justify-content: flex-start; align-items: center; margin-bottom: 10px;">
                <label for="email" style="width: 100px; text-align: right; margin-right: 10px;">Email</label>
                <input id="email" class="swal2-input" value="${this.currentFornecedor.email}" style="width: 300px;" placeholder="Digite um email válido">
            </div>
        `,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: 'Atualizar',
                cancelButtonText: 'Cancelar',
                preConfirm: () => {
                    const nome = document.getElementById('nome').value;
                    const email = document.getElementById('email').value;
                    const cpfCnpj = document.getElementById('cpfCnpj').value;

                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!nome || !email || !cpfCnpj) {
                        Swal.showValidationMessage('Por favor, preencha todos os campos');
                        return null;
                    }
                    if (!emailRegex.test(email)) {
                        Swal.showValidationMessage('Por favor, insira um email válido');
                        return null;
                    }

                    if (nome.length > 50) {
                        Swal.showValidationMessage('O nome deve ter no máximo 50 caracteres');
                        return null;
                    }

                    return { nome, email, cpfCnpj };
                }
            }).then((result) => {
                if (result.isConfirmed && result.value) {
                    const { nome, email, cpfCnpj } = result.value;

                    FornecedorDataService.updateFornecedor(this.currentFornecedor.id, { nome, email, cpfCnpj })
                        .then(() => {
                            this.toast.success("Fornecedor atualizado com sucesso!");
                            this.retrieveFornecedores(); 
                        })
                        .catch(error => {
                            console.error(error);
                            this.toast.error("Erro ao atualizar o fornecedor.");
                        });
                }
            });
        },




        deleteFornecedor() {
            Swal.fire({
                title: 'Tem certeza?',
                text: "Você não poderá desfazer essa ação!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim, excluir!',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    FornecedorDataService.deleteFornecedor(this.currentFornecedor.id)
                        .then(() => {
                            this.toast.success("Fornecedor excluído com sucesso!");
                            this.retrieveFornecedores(); 
                            this.currentFornecedor = null; 
                        })
                        .catch(error => {
                            console.error(error);
                            this.toast.error("Erro ao excluir o fornecedor.");
                        });
                }
            });
        },
    },

    mounted() {
        this.retrieveFornecedores();
    }
};

</script>

<style scoped>
.list {
    max-width: 750px;
    margin: auto;
}

.pagination {
    margin-top: 20px;
}

.list-group-item {
    transition: background-color 0.3s ease, color 0.3s ease;
    cursor: pointer;
}

.list-group-item:hover {
    background-color: #f0f0f0;
    color: #007bff;
}
</style>
