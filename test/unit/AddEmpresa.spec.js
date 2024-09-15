import { mount } from '@vue/test-utils';
import AddEmpresa from '@/components/empresa/AddEmpresa.vue';
import EmpresaDataService from '@/services/EmpresaDataService';
import FornecedorDataService from '@/services/FornecedorDataService';

jest.mock('@/services/EmpresaDataService', () => ({
    createEmpresa: jest.fn(),
    createEmpresaComFornecedor: jest.fn(),
}));
jest.mock('@/services/FornecedorDataService');

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({ erro: false }), 
    })
);

describe('AddEmpresa.vue', () => {
    let wrapper;

    beforeEach(() => {
        jest.clearAllMocks(); 

        FornecedorDataService.getAllFornecedores.mockResolvedValue({
            data: {
                content: [],
                totalPages: 0
            }
        });

        wrapper = mount(AddEmpresa, {
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
                    errorMessage: null,
                    successMessage: null,
                    submitted: false
                };
            }
        });
    });

    it('deve validar que o CNPJ não pode ser vazio', async () => {
        wrapper.setData({ empresa: { cnpj: '' } });

        await wrapper.vm.saveEmpresa();
        expect(wrapper.vm.errorMessage).toBe('CNPJ é obrigatório.');
    });

    it('deve chamar o serviço EmpresaDataService.createEmpresa quando a empresa for criada', async () => {
        wrapper.setData({
            empresa: {
                nomeFantasia: 'Empresa Teste',
                cnpj: '12.345.678/0001-23',
                cep: '12345-678'
            },
            fornecedorOption: 'none' 
        });

        EmpresaDataService.createEmpresa.mockResolvedValueOnce({});

        await wrapper.vm.saveEmpresa();

        expect(EmpresaDataService.createEmpresa).toHaveBeenCalled();
        expect(wrapper.vm.successMessage).toBe('Empresa cadastrada com sucesso!');
    });

    it('deve chamar o serviço EmpresaDataService.createEmpresaComFornecedor quando houver fornecedor vinculado', async () => {
        wrapper.setData({
            empresa: {
                nomeFantasia: 'Empresa Teste',
                cnpj: '12.345.678/0001-23',
                cep: '12345-678'
            },
            fornecedorOption: 'new',
            fornecedor: {
                nome: 'Fornecedor Teste',
                cpfCnpj: '12345678901',
                cep: '12345-678',
                tipoPessoa: 'FISICA',
            }
        });

        EmpresaDataService.createEmpresaComFornecedor.mockResolvedValueOnce({});

        await wrapper.vm.saveEmpresa();

        expect(EmpresaDataService.createEmpresaComFornecedor).toHaveBeenCalled();
        expect(wrapper.vm.successMessage).toBe('Empresa e fornecedor cadastrados com sucesso!');
    });
});
