export function money(value) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
export function dateTime(value) {
    return new Date(value).toLocaleString("pt-BR");
}
