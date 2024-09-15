<template>
    <div class="list row">
        <div class="col-md-8">
            <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="Busca por nome fantasia ou CNPJ"
                    v-model="searchInput" @keypress.enter="search" />
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary" type="button" @click="search">
                        Buscar
                    </button>
                </div>
            </div>
        </div>

        <div class="col-md-6">
            <h4>Empresas List</h4>
            <p>Selecione uma empresa</p>
            <ul class="list-group">
                <li class="list-group-item" :class="{ active: index === currentIndex }"
                    v-for="(empresa, index) in empresas" :key="empresa.cnpj" @click="setActiveEmpresa(empresa, index)">
                    {{ empresa.nomeFantasia }}
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
            <div v-if="currentEmpresa">

                <div class="d-flex justify-content-around align-items-start mb-3">
                    <h4>Empresa</h4>
                    <button class="btn btn-success" @click="atualizarEmpresa">
                        Atualizar empresa
                    </button>
                    <button class="btn btn-danger" @click="deleteEmpresa">
                        Excluir
                    </button>

                </div>
                <div><strong>Nome Fantasia:</strong> {{ currentEmpresa.nomeFantasia }}</div>
                <div><strong>CNPJ:</strong> {{ currentEmpresa.cnpj }}</div>
                <div v-if="currentEmpresa.fornecedores && currentEmpresa.fornecedores.length > 0">
                    <h5>Fornecedores Vinculados:</h5>
                    <ul>
                        <li v-for="fornecedor in currentEmpresa.fornecedores" :key="fornecedor.id">
                            {{ fornecedor.nome }} - {{ fornecedor.cpfCnpj }}
                        </li>
                    </ul>
                </div>
                <div v-else>
                    <p>Não há fornecedores vinculados a esta empresa.</p>
                </div>



                <button class="btn btn-primary mt-2" @click="activeAddFornecedores">Adicionar fornecedor</button>
                <div v-if="currentEmpresa && adicionarFornecedores">
                    <div class="mt-3">
                        <h5>Vincular Fornecedores</h5>
                        <div class="form-group">
                            <label for="fornecedor-select">Selecionar Fornecedores:</label>
                            <select v-model="selectedFornecedores" multiple class="form-control" id="fornecedor-select">
                                <option v-for="fornecedor in fornecedores" :key="fornecedor.id" :value="fornecedor.id">
                                    {{ fornecedor.nome }} - {{ fornecedor.cpfCnpj }}
                                </option>
                            </select>
                        </div>
                        <button class="btn btn-primary mt-2" @click="vincularFornecedores">Vincular</button>
                    </div>
                </div>
            </div>
            

        </div>


    </div>
</template>

<script>
import EmpresaDataService from "../../services/EmpresaDataService";
import FornecedorDataService from "../../services/FornecedorDataService";
import { useToast } from "vue-toastification";
import Swal from 'sweetalert2';


export default {
    name: "empresas-list",
    data() {
        return {
            empresas: [],
            fornecedores: [],
            selectedFornecedores: [],
            currentEmpresa: null,
            currentIndex: -1,
            searchInput: "",
            pageNumber: 0,
            totalPages: 0,
            pageSize: 10,
            adicionarFornecedores: false
        };
    },
    setup() {
        const toast = useToast();
        return {
            toast
        };
    },
    methods: {
      
        retrieveEmpresas() {
            const params = { page: this.pageNumber, size: this.pageSize };

            EmpresaDataService.getAllEmpresas(params)
                .then(response => {
                    const { content, totalPages } = response.data;
                    this.empresas = content;
                    this.totalPages = totalPages;
                })
                .catch(e => {
                    console.log(e);
                });
        },

        vincularFornecedores() {
            if (this.currentEmpresa && this.selectedFornecedores.length > 0) {
                EmpresaDataService.vincularFornecedores(this.currentEmpresa.id, this.selectedFornecedores)
                    .then(() => {
                        this.toast.success("Fornecedores vinculados com sucesso!");
                        this.setActiveEmpresa(this.currentEmpresa, this.currentIndex);
                    })
                    .catch(error => {
                        console.error(error);
                        this.toast.error("Erro ao vincular fornecedores.");
                    });
            }
        },



        activeAddFornecedores() {
            this.adicionarFornecedores = !this.adicionarFornecedores;
        },

        retrieveFornecedores() {
            const fetchFornecedores = async (page = 0, size = 100) => {
                try {
                    const response = await FornecedorDataService.getAllFornecedores({ page, size });
                    const { content, totalPages } = response.data;

                    this.fornecedores.push(...content);

                    if (page < totalPages - 1) {
                        await fetchFornecedores(page + 1, size);
                    }
                } catch (error) {
                    console.log(error);
                }
            };

            this.fornecedores = []; 
            fetchFornecedores();
        },


        retrieveFornecedoresByCnpj(cnpj) {
            EmpresaDataService.getFornecedoresByCnpj(cnpj)
                .then(response => {
                    if (response.data && Array.isArray(response.data)) {
                        this.currentEmpresa.fornecedores = response.data;  
                    } else {
                        this.currentEmpresa.fornecedores = [];
                    }
                })
                .catch(e => {
                    console.log(e);
                });
        },

        setActiveEmpresa(empresa, index) {
            this.currentEmpresa = empresa;
            this.currentIndex = index;
            this.retrieveFornecedoresByCnpj(empresa.cnpj);

        },

        previousPage() {
            if (this.pageNumber > 0) {
                this.pageNumber--;
                this.retrieveEmpresas();
            }
        },

        nextPage() {
            if (this.pageNumber < this.totalPages - 1) {
                this.pageNumber++;
                this.retrieveEmpresas();
            }
        },

        search() {
            const isCnpj = /^\d{14}$/.test(this.searchInput.replace(/\D/g, '')); 
            if (isCnpj) {
                this.searchCnpj(this.searchInput);
            } else {
                this.searchNomeFantasia();
            }
        },

        searchNomeFantasia() {
            EmpresaDataService.getByNomeFantasia(this.searchInput)
                .then(response => {
                    if (response.data && Array.isArray(response.data)) {
                        this.empresas = response.data;
                    } else {
                        this.empresas = [];
                    }
                })
                .catch(e => {
                    console.log(e);
                });
        },

        searchCnpj(cnpj) {
            EmpresaDataService.getByCnpj(cnpj.replace(/\D/g, '')) 
                .then(response => {
                    this.empresas = [response.data];
                })
                .catch(e => {
                    console.log(e);
                });
        },

        deleteEmpresa() {
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
                    EmpresaDataService.deleteEmpresa(this.currentEmpresa.id)
                        .then(() => {
                            this.toast.success("Empresa excluída com sucesso!");
                            this.retrieveEmpresas();  
                            this.currentEmpresa = null;  
                        })
                        .catch(error => {
                            console.error(error);
                            this.toast.error("Erro ao excluir a empresa.");
                        });
                }
            });
        },
        atualizarEmpresa() {
            const fornecedoresHtml = this.currentEmpresa.fornecedores.map(fornecedor => `
        <div style=" align-items: center; margin-bottom: 5px;">
            <input type="checkbox" id="fornecedor-${fornecedor.id}" value="${fornecedor.id}" style="margin-center: 5px;">
            <label for="fornecedor-${fornecedor.id}" style="margin: 0;">${fornecedor.nome} - ${fornecedor.cpfCnpj}</label>
        </div>
    `).join('');

            Swal.fire({
                title: 'Atualizar Empresa',
                html: `
    <div class="form-group" style="display: flex; justify-content: flex-start; align-items: center; margin-bottom: 10px;">
        <label for="nomeFantasia" style="width: 100px; text-align: right; margin-right: 10px;">Nome</label>
        <input id="nomeFantasia" class="swal2-input" value="${this.currentEmpresa.nomeFantasia}" style="width: 300px;">
    </div>
    <div class="form-group" style="display: flex; justify-content: flex-start; align-items: center; margin-bottom: 10px;">
        <label for="cnpj" style="width: 100px; text-align: right; margin-right: 10px;">CNPJ</label>
        <input id="cnpj" class="swal2-input" value="${this.currentEmpresa.cnpj}" style="width: 300px;">
    </div>
    <div class="form-group" style="display: flex; justify-content: flex-start; align-items: center; margin-bottom: 10px;">
        <label for="cep" style="width: 100px; text-align: right; margin-right: 10px;">CEP</label>
        <input id="cep" class="swal2-input" value="${this.currentEmpresa.cep}" style="width: 300px;">
    </div>
    <div class="form-group" style="text-align: center; margin-top: 15px; ">
        <h5 style="margin-bottom: 10px;">Excluir fornecedor:</h5>
        ${fornecedoresHtml}
    </div>
    `,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: 'Atualizar',
                cancelButtonText: 'Cancelar',
                preConfirm: () => {
                    const nomeFantasia = document.getElementById('nomeFantasia').value;
                    const cnpj = document.getElementById('cnpj').value;
                    const cep = document.getElementById('cep').value;

                    if (!nomeFantasia || !cnpj || !cep) {
                        Swal.showValidationMessage('Por favor, preencha todos os campos');
                        return null;
                    }

                    const fornecedoresParaDesvincular = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
                        .map(checkbox => checkbox.value);

                    return { nomeFantasia, cnpj, cep, fornecedoresParaDesvincular };
                }
            }).then((result) => {
                if (result.isConfirmed && result.value) {
                    const { nomeFantasia, cnpj, cep, fornecedoresParaDesvincular } = result.value;

                    EmpresaDataService.updateEmpresa(this.currentEmpresa.id, { nomeFantasia, cnpj, cep })
                        .then(() => {
                            this.toast.success("Empresa atualizada com sucesso!");

                            if (fornecedoresParaDesvincular.length > 0) {
                                EmpresaDataService.desvincularFornecedores(this.currentEmpresa.id, fornecedoresParaDesvincular)
                                    .then(() => {
                                        this.toast.success("Fornecedores desvinculados com sucesso!");
                                        this.currentEmpresa.fornecedores = this.currentEmpresa.fornecedores.filter(fornecedor =>
                                            !fornecedoresParaDesvincular.includes(fornecedor.id.toString())
                                        );
                                        this.retrieveEmpresas();
                                    })
                                    .catch(error => {
                                        console.error(error);
                                        this.toast.error("Erro ao desvincular fornecedores.");
                                    });
                            } else {
                                this.retrieveEmpresas(); 
                            }

                            this.setActiveEmpresa(this.currentEmpresa, this.currentIndex); 
                        })
                        .catch(error => {
                            console.error(error);
                            this.toast.error("Erro ao atualizar a empresa.");
                        });
                }
            });
        },




    },

    mounted() {
        this.retrieveEmpresas();
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

/* Adiciona o hover ao item da lista para indicar que é clicável */
.list-group-item {
    transition: background-color 0.3s ease, color 0.3s ease;
    cursor: pointer;
    /* Mostra que o item é clicável */
}

.list-group-item:hover {
    background-color: #f0f0f0;
    /* Muda a cor de fundo no hover */
    color: #007bff;
    /* Muda a cor do texto no hover */
}
</style>
