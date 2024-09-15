import http from "../http-common";

class EmpresaDataService {
    getAllEmpresas(params) {
        return http.get("/empresas", { params });
    }

    getByCnpj(cnpj) {
        return http.get(`/empresas/cnpj/${cnpj}`);
    }

    getByNomeFantasia(nomeFantasia) {
        return http.get(`/empresas/nomeFantasia/${nomeFantasia}`);
    }

    vincularFornecedores(id, fornecedoresIds) {
        return http.post(`/empresas/vincular-fornecedor/${id}`, fornecedoresIds);  
    }
    
    
    

    getFornecedoresByCnpj(cnpj) {
        return http.get(`/empresas/cnpj/${cnpj}/fornecedores`);
    }
    


    getById(id) {
        return http.get(`/empresas/${id}`);
    }

    desvincularFornecedores(id, fornecedoresIds) {
        return http.post(`/empresas/desvincular-fornecedor/${id}`, fornecedoresIds);
    }
    

    createEmpresa(data) {
        return http.post("/empresas", data);
    }

    updateEmpresa(id, data) {
        return http.put(`/empresas/${id}`, data);
    }

    deleteEmpresa(id) {
        return http.delete(`/empresas/${id}`);
    }
}

export default new EmpresaDataService();
