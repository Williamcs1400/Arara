export default function getHeaderStyleByPath(path){
    if (path === '/') {
        return {showIcon: false, showButtonLogin: true, redirectUrl: '/', barColor: '#17202A', showBar: true};
    }
    else if (path === '/livre') {
        return {showIcon: true, showButtonLogin: true, redirectUrl: '/livre', barColor: '#2F2F2F', showBar: false};
    }
    else if (path === '/entrar') {
        return {showIcon: true, showButtonLogin: false, redirectUrl: '/entrar', barColor: '#17202A', showBar: true};
    }
    else if (path === '/cadastrarAtividade') {
        return {showIcon: true, showButtonLogin: true, redirectUrl: '/cadastrarAtividade', barColor: '#17202A', showBar: true};
    }
    else if (path === '/cadastroAtividadeFeito') {
        return {showIcon: true, showButtonLogin: true, redirectUrl: '/cadastroAtividadeFeito', barColor: '#17202A', showBar: true};
    }
    else if (path === '/minhasAtividades') {
        return {showIcon: true, showButtonLogin: true, redirectUrl: '/minhasAtividades', barColor: '#17202A', showBar: true};
    }
    else if (path.startsWith('/detalhes')) {
        return {showIcon: true, showButtonLogin: true, redirectUrl: '/detalhes', barColor: '#17202A', showBar: true};
    }
    else if (path.startsWith('/atividade')) {
        return {showIcon: true, showButtonLogin: true, redirectUrl: path, barColor: '#2F2F2F', showBar: false};
    }
    else if (path === '/quemSomos') {
        return {showIcon: true, showButtonLogin: true, redirectUrl: '/quemSomos', barColor: '#17202A', showBar: true};
    }
    else {
        return {showIcon: false, showButtonLogin: true, redirectUrl: '/', barColor: '#17202A', showBar: true};
    }
}