import dynamic from 'next/dynamic'

export const LazyStepperSectionComponent = dynamic(
    () =>
        import(
            '@/_template/form/_components/questionnaire/_components/stepper/component'
        ).then((mod) => mod.StepperComponent),
    { ssr: false }
)
