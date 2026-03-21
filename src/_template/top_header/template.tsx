import { NotificationsComponent } from '@/_components/shared/notifications/component.server'
import { ProfileComponent } from '@/_components/shared/profile/component.client'
import { WorkspaceSelectorComponent } from '@/_components/shared/workspace-selector/component.client'
import { Separator } from '@/_components/ui/separator'

import { LogoLinkComponent } from '@/_template/top_header/_components/logo-link/component'

export function TopHeaderTemplate() {
    return (
        <header className="flex flex-col w-full">
            <section className="flex items-center justify-between mx-0 font-montserrat">
                <div className="flex items-center gap-[0.3rem] mx-2 font-montserrat">
                    <LogoLinkComponent />
                    <WorkspaceSelectorComponent />
                </div>

                <div className="flex items-center gap-4 mx-2 font-montserrat">
                    <NotificationsComponent />
                    <ProfileComponent />
                </div>
            </section>
            <Separator />
        </header>
    )
}
