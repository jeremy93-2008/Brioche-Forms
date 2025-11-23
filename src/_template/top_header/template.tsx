'use client'
import { Separator } from '@/_components/ui/separator'
import { ProfileComponent } from '@/_components/shared/profile/component'
import { WorkspaceSelectorComponent } from '@/_components/shared/workspace-selector/component'

import { LogoLinkComponent } from '@/_template/top_header/_components/logo-link/component'

export function TopHeaderTemplate() {
    return (
        <header className="flex flex-col w-full">
            <section className="flex items-center justify-between mx-3 font-montserrat">
                <div className="flex items-center gap-6 mx-3 font-montserrat">
                    <LogoLinkComponent />
                    <WorkspaceSelectorComponent />
                </div>

                <div className="flex items-center gap-6 mx-3 font-montserrat">
                    <ProfileComponent />
                </div>
            </section>
            <Separator />
        </header>
    )
}
