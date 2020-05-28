const AlterarSentimentoService = class {
    constructor({ GoobeeTeamsService }) {
        this.goobeeTeamsService = GoobeeTeamsService;
    }

    async alterarSentimentoUsuario(idUsuarioDiscord, novoSentimento){
        let { token,idResponsavel, idSentimentoPessoa } = await this.obterDadosUsuario(idUsuarioDiscord);

        let idSentimentoPessoa = await this.obterIdSentimento();

        await this.goobeeTeamsService.alterarSentimento(
            token, 
            idResponsavel, 
            idSentimentoPessoa, 
            novoSentimento
        );
    }

    async obterDadosUsuario(usuarioDiscord) {
        let { usuario, senha } = await this.obterUsuarioSenhaGoobee(usuarioDiscord);

        return await this.goobeeTeamsService.obterDadosUsuario(usuario, senha);
    }

    async obterUsuarioSenhaGoobee(idUsuarioDiscord){
        //TODO: obter usuario e senha de uma base local através do usuario do discord
        if(false) //se o usuário não existe na base
        {
            throw new Error("usuario_nao_encontrado")
        }

        return {
            usuario: '',
            senha: ''
        }
    }

    async obterIdSentimento() {
        //TODO: registrar idsentimento em uma base local para evitar requisições todo momento
        return await this.goobeeTeamsService.obterIdSentimento(this.dadosUsuario.token, this.dadosUsuario.idPessoa);
    }
}

module.exports = AlterarSentimentoService;