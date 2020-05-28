const Discord = require('discord.js');
const auth = require('./config/auth.json');
const AlterarSentimentoService = require('./servicos/alterarSentimentoService');
const GoobeeTeamsService = require('./servicos/goobeeTeamsService');
const regras = require('./regras/intencoes.json');
const regrasMigues = require('./regras/migues.json');

const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', (message) => {
    if(mensagemDeUsuarioParaBot(message) && mensagemCanalValido(message)) {
        processarMensagem(message);
    }
    else if (message.author.bot == false && mensagemPrivada(message)) {
        processarMensagemPrivada(message);
    }
});

client.login(auth.token);

/* Linguição abaixo que deve ser organizado e modularizado */
const processarMensagem = (event) => {
    let mensagemRetorno = '';
    let mensagemNaoAssincrona = false;

    let regra = regras.intencoes.find((intencao) => {
        let expressaoOk = intencao.padraoIntencao.expressoesRegular.some((expressao) => {
            let regex = new RegExp(expressao, "gi");
            return regex.test(event.content);
        });

        let expressaoNegar = intencao.padraoIntencao.expressoesRegularNegar && 
                intencao.padraoIntencao.expressoesRegularNegar.some((expressao) => {
            let regex = new RegExp(expressao, "gi");
            return regex.test(event.content);
        });

        return expressaoOk && !expressaoNegar;
    })

    if(regra) {
        let numeroSorteio = Math.floor(Math.random() * regra.respostas.length);

        if(regra.respostas.length) {
            mensagemRetorno = regra.respostas[numeroSorteio].texto;
        }

        if(regra.acao) {
            if(regra.acao.service == "ALTERASENTIMENTO"){
                let svc = new AlterarSentimentoService({ 
                    GoobeeTeamsService: new GoobeeTeamsService() 
                 });
                 let [ novoSentimento ] = regra.acao.args;

                 try {
                    svc.alterarSentimentoUsuario(event.author.id, novoSentimento)
                 }
                 catch(err){
                     if(err.message == 'usuario_nao_encontrado'){
                        //enviar msg no privado solicitando usuário e senha para gravar na base local
                     }
                 }
            }
        }
    }
    else {
        let numeroSorteio = Math.floor(Math.random() * regrasMigues.migues.length);
        mensagemRetorno = regrasMigues.migues[numeroSorteio].texto;
    }

    if(mensagemNaoAssincrona == false) {
        mensagemRetorno = formatarIncluindoVariaveis(mensagemRetorno, event);
        event.channel.startTyping();
                                
        setTimeout(() => {
            event.channel.send(mensagemRetorno);
            event.channel.stopTyping(true);
        }, randomTimeMs());
    }
    
}

const mensagemDeUsuarioParaBot = (messageObj) => {
    return messageObj.content.includes(`<@${auth.bot}>`) && messageObj.author.bot == false;
}

const formatarIncluindoVariaveis = (mensagemRetorno, event) => {
    if(mensagemRetorno.includes('{{SENDAUTHOR}}')) {
        mensagemRetorno = mensagemRetorno.replace('{{SENDAUTHOR}}', `<@${event.author.id}>`);
    }

    if(mensagemRetorno.includes('{{URLPUB}}')) {
        let regex = new RegExp(/([a-z0-9-\.]{1,50}\.\w{1,}\.com\.br)/, "gi");

        if(regex.test(event.content)) {
            mensagemRetorno = mensagemRetorno.replace('{{URLPUB}}', RegExp.$1);
        }
    }

    return mensagemRetorno;
}

const mensagemCanalValido = (event) => {
    return event.channel && auth.canaisComandos.some((nomeCanal) => {
        return event.channel.name == nomeCanal;
    });
}

const mensagemPrivada = (event) => event.channel && event.channel.type == 'dm';

const processarMensagemPrivada = (event) => {
    let mensagemRetorno = '';
    let numeroSorteio = Math.floor(Math.random() * regrasMigues.miguesPrivado.length);

    mensagemRetorno = regrasMigues.miguesPrivado[numeroSorteio].texto;
    mensagemRetorno = formatarIncluindoVariaveis(mensagemRetorno, event);
    event.channel.startTyping();
    
    setTimeout(() => {
        event.channel.send(mensagemRetorno);
        event.channel.stopTyping(true);
    }, randomTimeMs());
}

const randomTimeMs = () => ((Math.random() * 30) + 5) * 100