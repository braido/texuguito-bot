const jenkinsapi = require('jenkins-api');
const client = jenkinsapi.init("http://jenkins:11a94566c4cb90c948f0cc853752eed8fb@10.151.49.189");

const statusUltimoBuild = (job, callback) => {
    client.last_build_info(job, (err, data) => {
        if (err){ console.log('errrrrrrrrrrrrrrrrou'); return console.log(err); }
        callback(data);
    });
}

const iniciarJob = (job) => {
    client.build(job, (err, data) => {
        if (err){ return console.log(`Erro: ${err}`); }
        console.log(data);
    });
}

const iniciarJobComParametro = (job, parametros) => {
    const callback = (err, data) => {
        if (err){ return console.log(`Erro: ${err}`); }
        console.log(data);
    };

    if(parametros) {
        client.build_with_params(job, parametros, callback);
    }
    else {
        client.build_with_params(job, callback);
    }
}


module.exports = { statusUltimoBuild, iniciarJob, iniciarJobComParametro }