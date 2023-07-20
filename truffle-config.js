// truffleのconfigurationのための以下
require('babel-register');
require('babel-polyfill');


module.exports = {  // export default と同じで他のファイルでこのオブジェクトが使える開発を円滑に
    networks: {  //ganache networkにexportを作成
        development: {
            host:'127.0.0.1',
            port:'7545',
            network_id: '*' // Connect to any network.
        },
    },
    contracts_directory: './src/contracts',
    contracts_build_directory: './src/truffle_abis',
    compilors: {
        solc: {
            version: '^0.5.0',
            optimizer: {
                enabled: true,
                runs: 200
            },
        }
    }
}