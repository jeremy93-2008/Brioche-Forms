import dynamic from 'next/dynamic'

export const LazyTextSectionComponent = dynamic(
    () =>
        import(
            '@/_template/form/_components/questionnaire/_components/stepper/page/section/text/component'
        ).then((mod) => mod.TextSectionComponent),
    { ssr: false }
)
