const request = require('request-promise-native');
const baseuri = 'https://apiteams.goobee.com.br/api/';

const GoobeeTeamsService = class {
    constructor() {
    }

    async obterDadosUsuario(usuario, senha) {
        console.log(usuario);
        console.log(senha);
        let data = await request(`${baseuri}/Token`, {
            method: 'POST',
            body: { senha, usuario },
            json: true
        });

        if(data){
            return {
                token: data.token,
                idResponsavel: data.id,
                idPessoa: data.idPessoa
            }
        }
        else{
            throw new Error("Não foi possível obter os dados do Usuário");
        }
    }

    async obterIdSentimento(token, idPessoa) {
        let data = await request(`${baseuri}/Home/InformaHumor?idPessoa=${idPessoa}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            },
            json: true
        });

        if(data){
            return data.idSentimentoPessoa;
        }
        else{
            throw new Error("Não foi possível obter o Sentimento do Usuário");
        }
    }

    async alterarSentimento(token, idResponsavelCriacao, idSentimentoPessoa, sentimento) {
        let data = await request(`${baseuri}/Home/EditarHumor/${idSentimentoPessoa}`, {
            method: 'PUT',
            body: {
                idResponsavelCriacao,
                idSentimentoPessoa,
                sentimento
            },
            headers: {
                Authorization: `Bearer ${token}`
            },
            json: true
        });

        if(!data){
            throw new Error("Não foi possível alterar o Sentimento do Usuário");
        }
    }
}

module.exports = GoobeeTeamsService;