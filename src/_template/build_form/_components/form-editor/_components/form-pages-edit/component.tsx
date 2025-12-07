'use client'
import { Button } from '@/_components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/_components/ui/tabs'
import { SingleFormSelectedContext } from '@/_provider/forms/single-form-selected'
import { IFullForm } from '@/_server/queries/form/get'
import { use } from 'react'

export function FormPagesEditComponent() {
    const data: IFullForm = use(SingleFormSelectedContext)!

    return (
        <Tabs className=" w-full" defaultValue={data.pages[0]?.id || ''}>
            <TabsList className="flex items-center space-x-2 overflow-x-auto pb-2">
                {data.pages.map((page) => (
                    <TabsTrigger asChild key={page.id} value={page.id}>
                        <Button size="lg">
                            {page.title || 'Página sin título'}
                        </Button>
                    </TabsTrigger>
                ))}
                <Button size="xs">Añadir Página</Button>
            </TabsList>
            {data.pages.map((page) => (
                <TabsContent key={page.id} value={page.id}>
                    <div className="p-4 border border-border rounded-md">
                        {/* Aquí puedes agregar el editor de la página */}
                        <h2 className="text-lg font-semibold mb-2">
                            {page.title || 'Página sin título'}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Contenido de la página con ID: {page.id}
                        </p>
                    </div>
                </TabsContent>
            ))}
        </Tabs>
    )
}
