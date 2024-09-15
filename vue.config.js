module.exports = {
  devServer: {
    port: 8082,
    proxy: {
      '/api': {
        target: 'http://app:8080',  // O nome do serviço do backend na rede Docker
        changeOrigin: true
      }
    }
  }
}
