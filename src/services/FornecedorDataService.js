import http from "../http-common";

class FornecedorDataService {
    getAllFornecedores(params) {
        return http.get("/fornecedores", { params });
    }

    getByCpfCnpj(cpfCnpj) {
        return http.get(`/fornecedores/cpfCnpj/${cpfCnpj}`);
    }

    getByNome(nome) {
        return http.get(`/fornecedores/nome/${nome}`);
    }

    getByEmail(email) {
        return http.get(`/fornecedores/email/${email}`);
    }

    getById(id) {
        return http.get(`/fornecedores/${id}`);
    }

    createFornecedor(data) {
        return http.post("/fornecedores", data);
    }

    updateFornecedor(id, data) {
        return http.put(`/fornecedores/${id}`, data);
    }

    deleteFornecedor(id) {
        return http.delete(`/fornecedores/${id}`);
    }
}

export default new FornecedorDataService();
