
export function convertDateHour(seconds) {
    return new Date(seconds * 1000).toTimeString().split(' ')[0] + ' ' + new Date(seconds * 1000).toLocaleDateString('pt-BR');
}