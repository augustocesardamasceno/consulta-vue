<template>
    <div class="submit-form">
        <div v-if="!submitted">
            <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
            <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>

            <div>
                <h2>Adicionar Fornecedor</h2>
            </div>

            <div class="form-group">
                <label for="nome">Nome</label>
                <input type="text" class="form-control" id="nome" required v-model="fornecedor.nome" name="nome" />
            </div>

            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" class="form-control" id="email" required v-model="fornecedor.email" name="email" />
            </div>

            <div class="form-group">
                <label for="cpfCnpj">CPF/CNPJ</label>
                <input type="text" class="form-control" id="cpfCnpj" required v-model="fornecedor.cpfCnpj"
                    name="cpfCnpj" v-mask="cpfCnpjMask" />
            </div>

            <div class="form-group">
                <label for="cep">CEP</label>
                <input type="text" class="form-control" id="cep" required v-model="fornecedor.cep" name="cep" v-mask="'#####-###'"/>
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
                    <input type="text" class="form-control" id="rg" v-model="fornecedor.rg" name="rg" @input="limitRgInput" />
                </div>

                <div class="form-group">
                    <label for="dataNascimento">Data de Nascimento</label>
                    <input 
                      type="date" 
                      class="form-control" 
                      id="dataNascimento" 
                      v-model="fornecedor.dataNascimento"
                      name="dataNascimento"
                      @input="validateBirthDate"  
                    />
                </div>
            </div>

            <button @click="saveFornecedor" class="btn btn-success mt-3">Cadastrar</button>
        </div>

        <div v-else>
            <h4>Fornecedor cadastrado com sucesso!</h4>
            <button class="btn btn-success" @click="newFornecedor">Adicionar outro</button>
        </div>
    </div>
</template>

<script>
import FornecedorDataService from "../../services/FornecedorDataService";
import { mask } from 'vue-the-mask';

export default {
    name: "add-fornecedor",
    directives: { mask },

    data() {
        return {
            fornecedor: {
                id: null,
                nome: "",
                email: "",
                cpfCnpj: "",
                cep: "",
                tipoPessoa: "FISICA",
                rg: null,
                dataNascimento: null
            },
            errorMessage: null,  
            successMessage: null,  
            submitted: false
        };
    },
    computed: {
        cpfCnpjMask() {
            if (this.fornecedor.cpfCnpj.length <= 14) {
                return '###.###.###-##';
            } else {
                return '##.###.###/####-##';
            }
        }
    },
    methods: {

        limitRgInput() {
            if (this.fornecedor.rg.length > 7) {
                this.fornecedor.rg = this.fornecedor.rg.slice(0, 7);
            }
        },
        validateBirthDate(event) {
            const inputValue = event.target.value;
            const year = inputValue.split('-')[0]; 

            if (year && year.length > 4) {
                this.fornecedor.dataNascimento = inputValue.replace(/(\d{4})\d*/, '$1'); 
            }
        },

        validateEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  
            return emailRegex.test(email);
        },

        validateCpfCnpj() {
            const cpfCnpj = this.fornecedor.cpfCnpj.replace(/\D/g, ''); 

            if (this.fornecedor.tipoPessoa === 'FISICA' && cpfCnpj.length === 14) {
                this.errorMessage = "CNPJ não pode ser usado para pessoa física.";
                return false;
            }

            if (this.fornecedor.tipoPessoa === 'FISICA' && cpfCnpj.length !== 11) {
                this.errorMessage = "Para pessoa física, o CPF deve conter exatamente 11 dígitos.";
                return false;
            }

            if (this.fornecedor.tipoPessoa === 'JURIDICA' && cpfCnpj.length !== 14) {
                this.errorMessage = "Para pessoa jurídica, o CNPJ deve conter exatamente 14 dígitos.";
                return false;
            }

            return true;
        },

        async validateCep() {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${this.fornecedor.cep}/json/`);
                const data = await response.json();
                
                if (data.erro) {
                    this.errorMessage = "CEP inválido.";
                    return false;
                }

                return true;
            } catch (error) {
                console.error("Erro ao validar o CEP:", error);
                this.errorMessage = "Erro ao validar o CEP. Tente novamente.";
                return false;
            }
        },

        async saveFornecedor() {
            this.errorMessage = null;
            this.successMessage = null;

            if (!this.fornecedor.nome.trim()) {
                this.errorMessage = "O nome não pode estar em branco.";
                return;
            }

            if (this.fornecedor.nome.length > 30) {
                this.errorMessage = "O nome não pode ter mais de 30 caracteres.";
                return;
            }

            if (!this.validateEmail(this.fornecedor.email)) {
                this.errorMessage = "Por favor, insira um email válido.";
                return;
            }

            if (!this.validateCpfCnpj()) {
                return; 
            }

            const isCepValid = await this.validateCep();
            if (!isCepValid) {
                return; 
            }

            const data = {
                nome: this.fornecedor.nome,
                email: this.fornecedor.email,
                cpfCnpj: this.fornecedor.cpfCnpj,
                cep: this.fornecedor.cep,
                tipoPessoa: this.fornecedor.tipoPessoa,
                rg: this.fornecedor.tipoPessoa === "FISICA" ? this.fornecedor.rg : null,
                dataNascimento: this.fornecedor.tipoPessoa === "FISICA" ? this.fornecedor.dataNascimento : null
            };

            FornecedorDataService.createFornecedor(data)
                .then(() => {
                    this.successMessage = "Fornecedor cadastrado com sucesso!";
                    this.submitted = true;
                })
                .catch(error => {
                    if (error.response) {
                        if (error.response.data && typeof error.response.data === 'object') {
                            this.errorMessage = error.response.data.error || error.response.data.message || "Erro ao cadastrar fornecedor.";
                        } else {
                            this.errorMessage = "Erro ao processar a solicitação. Verifique os dados e tente novamente.";
                        }
                    } else {
                        this.errorMessage = "Erro de rede. Não foi possível se conectar ao servidor.";
                    }
                    console.log(error);
                });
        },

        newFornecedor() {
            this.submitted = false;
            this.fornecedor = {
                id: null,
                nome: "",
                email: "",
                cpfCnpj: "",
                cep: "",
                tipoPessoa: "FISICA",
                rg: null,
                dataNascimento: null
            };
            this.errorMessage = null;
            this.successMessage = null;
        }
    }
};
</script>

<style>
.submit-form {
    max-width: 300px;
    margin: auto;
}
</style>
