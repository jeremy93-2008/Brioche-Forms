'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/_components/ui/tabs'
import { FormResultFormResponsesComponent } from '@/_template/form_result/_components/form-response-result/component'
import { FormResultHeaderComponent } from '@/_template/form_result/_components/header-result/component'
import { FormResultTableResponsesComponent } from '@/_template/form_result/_components/table-responses-result/component'

export function FormResultTemplate() {
    return (
        <section className="flex flex-col items-center justify-center w-full mt-4">
            <FormResultHeaderComponent />
            <Tabs defaultValue="table" className="w-full items-center">
                <section className="flex items-center justify-evenly mb-4">
                    <TabsList>
                        <TabsTrigger value="table">
                            Tabla de respuestas
                        </TabsTrigger>
                        <TabsTrigger value="form">
                            Formulario de respuestas
                        </TabsTrigger>
                        <TabsTrigger value="statistic">
                            Estadistica de respuestas
                        </TabsTrigger>
                    </TabsList>
                    <span>patata</span>
                </section>

                <TabsContent value="table" className="w-full items-center">
                    <FormResultTableResponsesComponent />
                </TabsContent>
                <TabsContent value="form">
                    <FormResultFormResponsesComponent />
                </TabsContent>
            </Tabs>
        </section>
    )
}
