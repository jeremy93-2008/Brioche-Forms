export function formatDate(value: Date | number) {
    return new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium' }).format(
        value
    )
}
