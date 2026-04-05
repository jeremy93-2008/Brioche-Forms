export function renderStringTemplate(template: string, data: Record<string, string | number>) {
    return template.replace(/{(\w+)}/g, (_, key) => {
        return data[key] !== undefined ? String(data[key]) : `{${key}}`
    })
}