<template>
    <div class="submit-form">
        <div v-if="!submitted">
            <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
            <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>

            <div>
                <h2>Adicionar Empresa</h2>
            </div>

            <div class="form-group">
                <label for="nomeFantasia">Nome Fantasia</label>
                <input type="text" class="form-control" id="nomeFantasia" required v-model="empresa.nomeFantasia"
                    name="nomeFantasia" />
            </div>

            <div class="form-group">
                <label for="cnpj">CNPJ</label>
                <input type="text" class="form-control" id="cnpj" required v-model="empresa.cnpj" name="cnpj"
                    v-mask="'##.###.###/####-##'" />
            </div>

            <div class="form-group">
                <label for="cep">CEP</label>
                <input type="text" class="form-control" id="cep" required v-model="empresa.cep" name="cep"
                    v-mask="'#####-###'" />
            </div>


            <div v-if="fornecedorOption === 'new'">
                <h3>Cadastro de Fornecedor</h3>
                <div class="form-group">
                    <label for="nome">Nome</label>
                    <input type="text" class="form-control" id="nome" required v-model="fornecedor.nome" name="nome" />
                </div>

                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" class="form-control" id="email" required v-model="fornecedor.email"
                        name="email" />
                </div>

                <div class="form-group">
                    <label for="cpfCnpj">CPF/CNPJ</label>
                    <input type="text" class="form-control" id="cpfCnpj" required v-model="fornecedor.cpfCnpj"
                        name="cpfCnpj" v-mask="cpfCnpjMask" />
                </div>

                <div class="form-group">
                    <label for="cep">CEP</label>
                    <input type="text" class="form-control" id="cep" required v-model="fornecedor.cep" name="cep" />
                </div>

                <div class="form-group">
                    <label for="tipoPessoa">Tipo de Pessoa</label>
                    <select class="form-control" id="tipoPessoa" v-model="fornecedor.tipoPessoa" name="tipoPessoa">
                        <option value="FISICA">Pessoa Física</option>
                        <option value="JURIDICA">Pessoa Jurídica</option>
                    </select>
                </div>

                <div v-if="fornecedor.tipoPessoa === 'FISICA'">
                    <div class="form-group">
                        <label for="rg">RG</label>
                        <input type="text" class="form-control" id="rg" v-model="fornecedor.rg" name="rg" />
                    </div>

                    <div class="form-group">
                        <label for="dataNascimento">Data de Nascimento</label>
                        <input type="date" class="form-control" id="dataNascimento" v-model="fornecedor.dataNascimento"
                            name="dataNascimento" @input="validateBirthDate" />
                    </div>
                </div>
            </div>


            <button @click="saveEmpresa" class="btn btn-success mt-3">Cadastrar</button>
        </div>

        <div v-else>
            <h4>Empresa cadastrada com sucesso!</h4>
            <button class="btn btn-success" @click="newEmpresa">Adicionar outra empresa</button>
        </div>
    </div>
</template>

<script>
import EmpresaDataService from "../../services/EmpresaDataService";
import FornecedorDataService from "../../services/FornecedorDataService";
import { mask } from 'vue-the-mask';

export default {
    name: "add-empresa",
    directives: { mask },

    data() {
        return {
            empresa: {
                id: null,
                cnpj: "",
                nomeFantasia: "",
                cep: "",
                fornecedores: []  
            },
            fornecedorOption: 'none',  
            fornecedor: {
                nome: "",
                email: "",
                cpfCnpj: "",
                cep: "",
                tipoPessoa: "FISICA",
                rg: null,
                dataNascimento: null
            },
            selectedFornecedores: [],  
            fornecedores: [], 
            pageNumber: 0,  
            totalPages: 0,  
            pageSize: 10,  
            errorMessage: null,
            successMessage: null,
            submitted: false
        };
    },

    methods: {
       
        async validateCep(cep) {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            
            if (data.erro) {
                this.errorMessage = "O CEP informado não existe.";
                return false;
            }

            return true; 
        } catch (error) {
            console.error("Erro ao validar o CEP:", error);
            this.errorMessage = "Erro ao validar o CEP. Tente novamente.";
            return false;
        }
    },

        validateBirthDate(event) {
            const inputValue = event.target.value;
            const year = inputValue.split('-')[0]; 
            if (year && year.length > 4) {
                this.fornecedor.dataNascimento = inputValue.replace(/(\d{4})\d*/, '$1'); 
            }
        },

        async saveEmpresa() {
        this.errorMessage = null;
        this.successMessage = null;

        // Validação de CNPJ
        if (!this.empresa.cnpj) {
            this.errorMessage = "CNPJ é obrigatório.";
            return;
        }

        const cep = this.empresa.cep.replace(/\D/g, ''); 

        if (cep.length !== 8) {
            this.errorMessage = "O CEP deve conter exatamente 8 dígitos.";
            return;
        }

        const cepIsValid = await this.validateCep(cep); 
        if (!cepIsValid) {
            return; 
        }

        if (this.fornecedorOption === 'new') {
            EmpresaDataService.createEmpresaComFornecedor(this.empresa, this.fornecedor)
                .then(() => {
                    this.successMessage = "Empresa e fornecedor cadastrados com sucesso!";
                    this.submitted = true;
                })
                .catch(this.handleError);
        } else {
            EmpresaDataService.createEmpresa(this.empresa)
                .then(() => {
                    this.successMessage = "Empresa cadastrada com sucesso!";
                    this.submitted = true;
                })
                .catch(this.handleError);
        }
    },


        handleError(error) {
            if (error.response) {
                if (error.response.data && typeof error.response.data === 'object') {
                    this.errorMessage = error.response.data.error || error.response.data.message || "Erro ao cadastrar empresa.";
                } else {
                    this.errorMessage = "Erro ao processar a solicitação. Verifique os dados e tente novamente.";
                }
            } else {
                this.errorMessage = "Erro de rede. Não foi possível se conectar ao servidor.";
            }
        },

        retrieveFornecedores() {
            const params = { page: this.pageNumber, size: this.pageSize };

            FornecedorDataService.getAllFornecedores(params)
                .then(response => {
                    const { content, totalPages } = response.data;
                    this.fornecedores = content;
                    this.totalPages = totalPages;
                })
                .catch(error => {
                    console.log(error);
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

        newEmpresa() {
            this.submitted = false;
            this.empresa = { id: null, cnpj: "", nomeFantasia: "", cep: "", fornecedores: [] };
            this.fornecedorOption = 'none';
            this.selectedFornecedores = [];
            this.errorMessage = null;
            this.successMessage = null;
        },

        isFornecedorSelected(id) {
            return this.selectedFornecedores.includes(id);
        },

    },

    computed: {
        cpfCnpjMask() {
            if (this.fornecedor.cpfCnpj && this.fornecedor.cpfCnpj.length <= 14) {
                return '###.###.###-##';  
            }
            return '##.###.###/####-##';   
        }
    },

    mounted() {
        this.retrieveFornecedores();
    }
};
</script>
