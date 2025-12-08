import { IFullForm } from '@/_server/queries/form/get'

interface IFormSectionEditComponentProps {
    data: IFullForm['pages'][0]['sections'][0]
}

export function FormSectionEditComponent(
    props: IFormSectionEditComponentProps
) {
    const { data } = props
    return (
        <section>
            <div className="mx-4 my-4 py-2 px-2 border-b">
                <h3 className=" mb-1">{data.title || 'Sección sin título'}</h3>
                {/* Aquí puedes agregar más detalles del editor de la sección */}
            </div>
        </section>
    )
}
