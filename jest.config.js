module.exports = {
    // Suporte para arquivos Vue, JavaScript e JSON
    moduleFileExtensions: ['js', 'json', 'vue'],
  
    // Transforma arquivos .vue com vue-jest
    transform: {
      '^.+\\.vue$': 'vue-jest',
      '^.+\\.js$': 'babel-jest' // Transforma arquivos JS com babel-jest
    },
  
    // Ignora node_modules, exceto o axios ou qualquer outro pacote ES6+ que precise ser transformado
    transformIgnorePatterns: [
      'node_modules/(?!axios)/'  // Exceção para axios
    ],
    "setupFiles": ["jest-fetch-mock"],

  
    // Testes
    testMatch: ['**/test/unit/**/*.spec.[jt]s?(x)'],
  
    // Ambiente de teste
    testEnvironment: 'jsdom',
  
    // Mapeamento para resolver os caminhos
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1'
    }
    
  };
  